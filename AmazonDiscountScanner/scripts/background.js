/**
 * background.js — Service Worker (MV3)
 * 
 * State machine managing multi-page scanning:
 *   IDLE → SCANNING → (page-by-page loop) → COMPLETE / STOPPED / PAUSED
 * 
 * Coordinates with content.js via chrome.tabs.sendMessage and
 * reports progress back to popup.js via chrome.runtime.sendMessage.
 *
 * Includes randomized delay jittering (3500–6000ms) to avoid Amazon
 * rate-limiting, exponential backoff on errors, tab URL validation,
 * and graceful handling of RATE_LIMITED signals from the content script.
 */

(function () {
  'use strict';

  // ── State ─────────────────────────────────────────────────────────────────
  let scanState = {
    scanning:       false,
    tabId:          null,
    currentPage:    0,
    maxPages:       20,
    config:         null,
    resultCount:    0,
    recentLogs:     [],   // Ring buffer of last 50 log entries for popup restore
    consecutiveFails: 0,  // Tracks consecutive errors for exponential backoff
    rateLimitRetries: 0,
  };

  const MAX_LOG_ENTRIES = 50;
  const MAX_CONSECUTIVE_FAILS = 4;  // Stop after 4 consecutive failures

  // ── Helpers ───────────────────────────────────────────────────────────────

  function pushLog(message, logType = 'info') {
    const entry = { message, type: logType, ts: Date.now() };
    scanState.recentLogs.push(entry);
    if (scanState.recentLogs.length > MAX_LOG_ENTRIES) {
      scanState.recentLogs.shift();
    }

    // Persist logs for popup re-hydration
    chrome.storage.local.get({ scanLogs: [] }).then(data => {
      data.scanLogs.push(entry);
      if (data.scanLogs.length > MAX_LOG_ENTRIES) {
        data.scanLogs.shift();
      }
      chrome.storage.local.set({ scanLogs: data.scanLogs });
    });

    // Broadcast to popup (if open)
    chrome.runtime.sendMessage({ type: 'SCAN_LOG', message, logType }).catch(() => {});
  }

  function broadcastProgress() {
    chrome.runtime.sendMessage({
      type: 'SCAN_PROGRESS',
      currentPage:  scanState.currentPage,
      maxPages:     scanState.maxPages,
      resultCount:  scanState.resultCount,
    }).catch(() => {});
  }

  /**
   * Randomized delay to avoid Amazon rate-limiting.
   * Returns a random interval between `minMs` and `maxMs` (inclusive).
   * Default range: 3500ms – 6000ms.
   */
  function randomDelay(minMs = 3500, maxMs = 6000) {
    return Math.floor(Math.random() * (maxMs - minMs + 1)) + minMs;
  }

  /**
   * Compute the page-navigation delay based on user config.
   * Uses the user's `delayBase` (seconds) + random jitter (1.5s to 4.5s).
   */
  function calculateHumanizedDelay(baseSeconds) {
    const baseMs = (baseSeconds || 4) * 1000;
    const jitter = randomDelay(1500, 4500); // 1.5s to 4.5s
    return baseMs + jitter;
  }

  /**
   * Compute exponential backoff delay based on consecutive failure count.
   * Base: 5s, doubles each failure, capped at 30s.
   */
  function getBackoffDelay() {
    const base = 5000;
    const delay = Math.min(base * Math.pow(2, scanState.consecutiveFails), 30000);
    // Add jitter of ±20%
    const jitter = delay * 0.2;
    return delay - jitter + Math.random() * jitter * 2;
  }

  function sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  // ── Message Router ────────────────────────────────────────────────────────
  chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
    switch (msg.type) {

      case 'GET_STATE':
        sendResponse({
          scanning:    scanState.scanning,
          currentPage: scanState.currentPage,
          maxPages:    scanState.maxPages,
          resultCount: scanState.resultCount,
          recentLogs:  scanState.recentLogs,
        });
        return true; // async sendResponse

      case 'START_SCAN':
        handleStartScan(msg.config);
        sendResponse({ ok: true });
        return true;

      case 'STOP_SCAN':
        handleStopScan();
        sendResponse({ ok: true });
        return true;

      case 'CLEAR_RESULTS':
        scanState.resultCount = 0;
        scanState.recentLogs = [];
        chrome.storage.local.set({ scanResults: [], scanLogs: [], foundCount: 0 });
        sendResponse({ ok: true });
        return true;

      case 'PAGE_SCAN_RESULT':
        // Content script sends scanned products for the current page
        handlePageResults(msg.products, msg.hasNextPage, msg.nextPageUrl);
        return false;

      case 'RATE_LIMITED':
        // Ignored here; handled via the response in scanCurrentPage
        return false;

      case 'SCAN_ERROR':
        // Content script encountered an error
        pushLog(msg.message || 'Unknown content script error.', 'error');
        scanState.scanning = false;
        chrome.runtime.sendMessage({
          type: 'SCAN_ERROR',
          message: msg.message,
        }).catch(() => {});
        return false;

      case 'CHECK_US_DISCOUNT_BATCH':
        processAsinBatch(msg.products).then(sendResponse);
        return true;

      case 'ITEM_FOUND':
        handleItemFound(msg.product).then(sendResponse);
        return true;

      default:
        return false;
    }
  });

  // ── Scan Orchestration ────────────────────────────────────────────────────

  async function handleStartScan(config) {
    // Reset state
    scanState.scanning        = true;
    scanState.config          = config;
    scanState.currentPage     = 0;
    scanState.maxPages        = config.maxPages || 20;
    scanState.resultCount     = 0;
    scanState.recentLogs      = [];
    scanState.consecutiveFails = 0;
    scanState.rateLimitRetries = 0;

    // Clear previous results
    await chrome.storage.local.set({ scanResults: [], scanLogs: [], foundCount: 0 });

    // Get the active tab
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    if (!tab || !tab.url || !tab.url.includes('amazon.')) {
      pushLog('Active tab is not an Amazon page. Navigate to Amazon search results first.', 'error');
      scanState.scanning = false;
      chrome.runtime.sendMessage({ type: 'SCAN_ERROR', message: 'Not on Amazon.' }).catch(() => {});
      return;
    }
    scanState.tabId = tab.id;

    pushLog(`Scan started. Max pages: ${scanState.maxPages}, Min discount: ${config.minDiscountPercent}%`);

    // Kick off first page scan
    scanCurrentPage();
  }

  function handleStopScan() {
    scanState.scanning = false;
    pushLog('Scan stopped by user.', 'warn');
    chrome.runtime.sendMessage({
      type: 'SCAN_STOPPED',
      resultCount: scanState.resultCount,
    }).catch(() => {});
  }

  /**
   * Handle rate-limit detection from the content script.
   * Stops scanning and alerts the user via popup messages.
   */
  function handleRateLimited(message) {
    scanState.scanning = false;
    const logMsg = message || 'Amazon rate-limit page detected. Scan paused to avoid further blocks.';
    pushLog(`⚠️ ${logMsg}`, 'error');
    pushLog('Try again later or reduce scan speed by increasing the delay.', 'warn');

    chrome.notifications.create({
      type: 'basic',
      iconUrl: 'icons/icon128.png',
      title: 'Amazon Scanner Paused',
      message: 'Rate Limit / Bot Protection Detected by Amazon. Scan paused to protect your session.',
      priority: 2
    });

    chrome.runtime.sendMessage({
      type:        'SCAN_STOPPED',
      resultCount: scanState.resultCount,
      rateLimited: true,
    }).catch(() => {});
  }

  /**
   * Validate that the current tab URL is still an Amazon search results page.
   * Detects CAPTCHA redirects, error pages, and non-Amazon URLs.
   */
  async function validateTabUrl() {
    try {
      const tab = await chrome.tabs.get(scanState.tabId);
      if (!tab || !tab.url) return false;

      const url = tab.url;

      // Must still be on Amazon
      if (!url.includes('amazon.')) {
        pushLog('Tab navigated away from Amazon. Stopping scan.', 'error');
        return false;
      }

      // Check for CAPTCHA page
      if (url.includes('/errors/validateCaptcha') || url.includes('/captcha/')) {
        pushLog('⚠️ Amazon CAPTCHA detected. Scan paused — please solve the CAPTCHA and restart.', 'error');
        return false;
      }

      // Check for sign-in redirect
      if (url.includes('/ap/signin') || url.includes('/ap/forgotpassword')) {
        pushLog('⚠️ Amazon sign-in page detected. Please sign in and restart the scan.', 'error');
        return false;
      }

      return true;
    } catch (err) {
      pushLog(`Tab validation error: ${err.message}`, 'error');
      return false;
    }
  }

  async function scanCurrentPage() {
    if (!scanState.scanning) return;

    // ── Tab URL validation before each scan ──
    const isValidTab = await validateTabUrl();
    if (!isValidTab) {
      scanState.scanning = false;
      chrome.runtime.sendMessage({
        type:        'SCAN_STOPPED',
        resultCount: scanState.resultCount,
        rateLimited: true,
      }).catch(() => {});
      return;
    }

    scanState.currentPage++;
    pushLog(`Scanning page ${scanState.currentPage}…`);
    broadcastProgress();

    // Inject content script scan command via messaging
    try {
      const response = await chrome.tabs.sendMessage(scanState.tabId, {
        type:   'SCAN_PAGE',
        config: scanState.config,
      });

      if (response && response.rateLimited) {
        if (scanState.rateLimitRetries < 1) {
          scanState.rateLimitRetries++;
          pushLog('⚠️ Amazon error page detected. Waiting 15 seconds before single retry...', 'warn');
          await sleep(15000);
          if (!scanState.scanning) return;
          
          pushLog('Retrying page load...', 'info');
          await chrome.tabs.reload(scanState.tabId);
          await waitForTabLoad(scanState.tabId);
          await sleep(2000);
          scanCurrentPage();
          return;
        } else {
          scanState.scanning = false;
          pushLog('⚠️ Gracefully stopping after single retry failure due to Amazon error page.', 'error');
          chrome.runtime.sendMessage({
            type:        'SCAN_STOPPED',
            resultCount: scanState.resultCount,
            rateLimited: true,
          }).catch(() => {});
          return;
        }
      }

      // Reset consecutive fail counter on success
      scanState.consecutiveFails = 0;
      scanState.rateLimitRetries = 0;
    } catch (err) {
      // Content script might not be ready; try programmatic injection
      pushLog('Content script not responding, injecting…', 'warn');
      try {
        await chrome.scripting.executeScript({
          target: { tabId: scanState.tabId },
          files:  ['scripts/content.js'],
        });
        // Retry after brief pause
        await sleep(800);
        await chrome.tabs.sendMessage(scanState.tabId, {
          type:   'SCAN_PAGE',
          config: scanState.config,
        });
        scanState.consecutiveFails = 0;
      } catch (e) {
        scanState.consecutiveFails++;
        pushLog(`Failed to inject or communicate (attempt ${scanState.consecutiveFails}): ${e.message}`, 'error');

        if (scanState.consecutiveFails >= MAX_CONSECUTIVE_FAILS) {
          pushLog(`Too many consecutive failures (${MAX_CONSECUTIVE_FAILS}). Stopping scan.`, 'error');
          scanState.scanning = false;
          chrome.runtime.sendMessage({ type: 'SCAN_ERROR', message: 'Too many consecutive communication failures.' }).catch(() => {});
          return;
        }

        // Exponential backoff before retrying
        const backoff = getBackoffDelay();
        pushLog(`Backing off for ${(backoff / 1000).toFixed(1)}s before retry…`, 'warn');
        await sleep(backoff);

        if (!scanState.scanning) return;
        // Retry the same page
        scanState.currentPage--;
        scanCurrentPage();
      }
    }
  }

  async function handlePageResults(products, hasNextPage, nextPageUrl) {
    if (!scanState.scanning) return;

    // Process all products from the page. handleItemFound deduplicates and syncs state.
    for (const p of products) {
      await handleItemFound(p);
    }

    pushLog(`Page ${scanState.currentPage}: scanned. (Total unique matches: ${scanState.resultCount}).`, 'info');
    broadcastProgress();

    // Decide whether to continue
    if (!hasNextPage) {
      pushLog('No more pages available.', 'info');
      finishScan();
      return;
    }
    if (scanState.currentPage >= scanState.maxPages) {
      pushLog(`Reached max page limit (${scanState.maxPages}).`, 'info');
      finishScan();
      return;
    }

    try {
      await chrome.tabs.sendMessage(scanState.tabId, { type: 'SCROLL_PAGE' });
    } catch (e) {}

    // Adaptive Cooldown Logic: 8-15 seconds rest every 10 pages
    if (scanState.currentPage > 0 && scanState.currentPage % 10 === 0) {
      const cooldown = randomDelay(8000, 15000);
      pushLog(`Cooldown resting for ${(cooldown / 1000).toFixed(1)}s to avoid rate limits…`, 'warn');
      await sleep(cooldown);
    } else {
      // Navigate to next page after randomized jittered delay
      const delay = calculateHumanizedDelay(scanState.config.delayBase);
      pushLog(`Waiting ${(delay / 1000).toFixed(1)}s before next page…`);
      await sleep(delay);
    }

    if (!scanState.scanning) return; // Check again after delay

    try {
      // Navigate the tab
      await chrome.tabs.update(scanState.tabId, { url: nextPageUrl });

      // Wait for the page to load
      await waitForTabLoad(scanState.tabId);

      // Extra settle time for Amazon JS to render results (randomized)
      const settleDelay = randomDelay(1500, 2500);
      await sleep(settleDelay);

      // Check if we're still scanning (user might have stopped during wait)
      if (!scanState.scanning) return;

      // ── Tab URL validation after navigation ──
      const isValidTab = await validateTabUrl();
      if (!isValidTab) {
        scanState.scanning = false;
        chrome.runtime.sendMessage({
          type:        'SCAN_STOPPED',
          resultCount: scanState.resultCount,
          rateLimited: true,
        }).catch(() => {});
        return;
      }

      // Reset consecutive fail counter on successful navigation
      scanState.consecutiveFails = 0;

      // Continue scanning
      scanCurrentPage();
    } catch (err) {
      scanState.consecutiveFails++;
      pushLog(`Navigation error (attempt ${scanState.consecutiveFails}): ${err.message}`, 'error');

      if (scanState.consecutiveFails >= MAX_CONSECUTIVE_FAILS) {
        pushLog(`Too many consecutive navigation failures. Stopping scan.`, 'error');
        finishScan();
        return;
      }

      // Exponential backoff before retrying
      const backoff = getBackoffDelay();
      pushLog(`Backing off for ${(backoff / 1000).toFixed(1)}s before retry…`, 'warn');
      await sleep(backoff);

      if (!scanState.scanning) return;

      // Retry navigating to the same next page
      try {
        await chrome.tabs.update(scanState.tabId, { url: nextPageUrl });
        await waitForTabLoad(scanState.tabId);
        await sleep(randomDelay(1500, 2500));

        if (!scanState.scanning) return;
        scanState.consecutiveFails = 0;
        scanCurrentPage();
      } catch (retryErr) {
        pushLog(`Retry navigation also failed: ${retryErr.message}`, 'error');
        finishScan();
      }
    }
  }

  function finishScan() {
    scanState.scanning = false;
    pushLog(`Scan complete. Total products: ${scanState.resultCount}.`, 'success');
    chrome.runtime.sendMessage({
      type: 'SCAN_COMPLETE',
      resultCount: scanState.resultCount,
    }).catch(() => {});
  }

  // ── Tab Load Watcher ──────────────────────────────────────────────────────

  function waitForTabLoad(tabId, timeoutMs = 30000) {
    return new Promise((resolve, reject) => {
      const timer = setTimeout(() => {
        chrome.tabs.onUpdated.removeListener(listener);
        reject(new Error('Tab load timeout'));
      }, timeoutMs);

      function listener(updatedTabId, changeInfo) {
        if (updatedTabId === tabId && changeInfo.status === 'complete') {
          clearTimeout(timer);
          chrome.tabs.onUpdated.removeListener(listener);
          resolve();
        }
      }
      chrome.tabs.onUpdated.addListener(listener);
    });
  }

  // ── US Discount Checking Batcher & Fetcher ────────────────────────────────

  async function handleItemFound(product) {
    if (!scanState.scanning) return;
    const data = await chrome.storage.local.get({ scanResults: [], foundCount: 0 });
    
    // Prevent duplicates
    if (data.scanResults.some(p => p.asin === product.asin)) {
      return;
    }

    const updated = data.scanResults.concat([product]);
    const updatedCount = updated.length;
    
    await chrome.storage.local.set({ 
      scanResults: updated,
      foundCount: updatedCount
    });
    
    scanState.resultCount = updatedCount;
    broadcastProgress();
    
    const tType = product.usDiscountType || product.discountType || 'N/A';
    const tVal = product.usDiscountValue || product.discountValue || 'N/A';
    pushLog(`[Match] ${product.asin} - ${tType} (${tVal})`, 'success');

    // Broadcast UPDATE_FOUND_COUNT to popup for real-time UI update
    chrome.runtime.sendMessage({ 
      action: 'UPDATE_FOUND_COUNT',
      count: updatedCount,
      newProduct: product 
    }).catch(() => {});
  }

  function parsePrice(priceStr) {
    if (!priceStr) return 0;
    const cleaned = String(priceStr).replace(/[^0-9.]/g, '');
    const parsed = parseFloat(cleaned);
    return isNaN(parsed) ? 0 : parsed;
  }

  // Optimized Concurrent Fetcher
  async function processAsinBatch(asinList, batchSize = 4, delayBetweenBatchesMs = 1200) {
    const results = [];
    
    // Chunk the ASIN array into smaller batches
    for (let i = 0; i < asinList.length; i += batchSize) {
      if (!scanState.scanning) break; // Stop if user paused
      const chunk = asinList.slice(i, i + batchSize);
      
      // Execute all ASIN fetches in the current batch simultaneously
      const batchPromises = chunk.map(product => fetchUsProductDataWithTimeout(product, 6000));
      
      const batchResults = await Promise.allSettled(batchPromises);
      
      // Collect successful results
      for (const res of batchResults) {
        if (res.status === 'fulfilled' && res.value) {
          results.push(res.value);
          // Pass the augmented product to handleItemFound to save and broadcast
          await handleItemFound(res.value);
        }
      }

      // Short politeness delay between parallel batches (1.2s instead of 3-5s per product)
      if (i + batchSize < asinList.length) {
        await sleep(delayBetweenBatchesMs);
      }
    }

    return results;
  }

  // Fetch helper with explicit 6-second timeout to prevent hung requests
  async function fetchUsProductDataWithTimeout(product, timeoutMs = 6000) {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

    try {
      const usUrl = `https://www.amazon.com/dp/${product.asin}`;
      const response = await fetch(usUrl, { 
        signal: controller.signal,
        headers: {
          'Accept': 'text/html,application/xhtml+xml',
          'Accept-Language': 'en-US,en;q=0.9'
        }
      });
      clearTimeout(timeoutId);

      if (!response.ok) return null;
      const htmlText = await response.text();

      // Parse discount logic using existing extraction functions
      return parseAndEvaluateDiscounts(htmlText, product);
    } catch (error) {
      clearTimeout(timeoutId);
      return null; // Gracefully drop failed/timed-out fetch and move on
    }
  }

  function parseAndEvaluateDiscounts(rawHtml, product) {
    if (rawHtml.includes('Dogs of Amazon') || rawHtml.includes('Page Not Found')) {
      return null;
    }

    // FIX: HTML CLEANUP & REGEX PRECISION
    const cleanHtml = rawHtml.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
                             .replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, '');

    let basePrice = 0;
    // Identify current displayed listing price (Base Price), avoiding struck-through List Price
    let priceMatch = cleanHtml.match(/class="[^"]*priceToPay[^"]*".*?<span class="a-offscreen">\$([0-9,.]+)<\/span>/is) 
                  || cleanHtml.match(/<span class="a-price"[^>]*data-a-color="price"[^>]*>.*?<span class="a-offscreen">\$([0-9,.]+)<\/span>/is)
                  || cleanHtml.match(/<span class="a-price"[^>]*>.*?<span class="a-offscreen">\$([0-9,.]+)<\/span>/is)
                  || cleanHtml.match(/<span class="a-offscreen">\$([0-9,.]+)<\/span>/);

    if (priceMatch && priceMatch[1]) {
      basePrice = parsePrice(priceMatch[1]);
    }

    let discountType = null;
    let savingsAmount = 0;
    let finalPrice = basePrice;

    // 1. Subscribe & Save (S&S) Post-Subscription Price Extraction
    let snsSavings = 0;
    const snsPriceMatch = cleanHtml.match(/id="sns-base-price"[\s\S]{0,500}?apex-pricetopay-value[\s\S]{0,200}?class="a-offscreen">\s*\$(\d+\.\d{2})/i) ||
                          cleanHtml.match(/id="sns-base-price"[\s\S]{0,400}?class="a-offscreen">\$(\d+\.\d{2})/i) ||
                          cleanHtml.match(/apex-pricetopay-value[\s\S]{0,400}?class="a-offscreen">\$(\d+\.\d{2})/i) ||
                          cleanHtml.match(/id="priceblock_ourprice"[\s\S]{0,400}?\$(\d+\.\d{2})/i) ||
                          cleanHtml.match(/data-a-size="b"[\s\S]{0,400}?class="a-offscreen">\$(\d+\.\d{2})/i);
    if (snsPriceMatch && snsPriceMatch[1]) {
      const snsPrice = parsePrice(snsPriceMatch[1]);
      if (basePrice > snsPrice) {
        snsSavings = basePrice - snsPrice;
      }
    }

    // 2. Clippable Coupon / Commission Extraction
    let couponSavings = 0;
    let couponRawText = '';
    
    // Support dynamic coupon spans like .couponLabelText or id^="couponText"
    const couponRegex = cleanHtml.match(/(?:class="[^"]*couponLabelText[^"]*"|id="coupons_feature_div"|id="couponText[^"]*"|id="promoPriceBlockMessage_feature_div")[\s\S]{0,400}?(Save\s+\$\d+(?:\.\d{2})?|\$\d+(?:\.\d{2})?\s+coupon|Save\s+\d+(?:\.\d+)?%|Coupon:\s*Save\s*\$\d+(?:\.\d{2})?)/i);
    if (couponRegex) {
      couponRawText = couponRegex[1] || couponRegex[0];
    }
    
    const flatCouponMatch = couponRawText.match(/Save\s+\$(\d+(?:\.\d{2})?)/i) || 
                            couponRawText.match(/\$(\d+(?:\.\d{2})?)\s+coupon/i) ||
                            couponRawText.match(/Coupon:\s*Save\s*\$(\d+(?:\.\d{2})?)/i);
                            
    const percentCouponMatch = couponRawText.match(/Save\s+(\d+(?:\.\d+)?)%/i) || 
                               couponRawText.match(/(\d+(?:\.\d+)?)%\s+coupon/i);
    
    if (flatCouponMatch) {
      const cVal = parsePrice(flatCouponMatch[1]);
      if (cVal > 0 && cVal < basePrice) {
        couponSavings = cVal;
      }
    } else if (percentCouponMatch) {
      const cPct = parsePrice(percentCouponMatch[1]);
      if (cPct > 0 && cPct <= 100) {
        couponSavings = basePrice * (cPct / 100);
      }
    } else {
      const couponMatch2 = cleanHtml.match(/Coupon price.*?<span class="a-offscreen">\$([0-9,.]+)<\/span>/is);
      if (couponMatch2 && couponMatch2[1]) {
        const cPrice = parsePrice(couponMatch2[1]);
        if (cPrice > 0 && cPrice < basePrice) couponSavings = basePrice - cPrice;
      }
    }

    // 3. Save at Checkout / First-Time Subscriber Promos
    let promoSavings = 0;
    const checkoutMatch = cleanHtml.match(/<div[^>]*class="[^"]*a-alert-content[^"]*"[^>]*>[\s\S]{0,250}?Save\s+([0-9.]+(?:%|\$))[\s\S]{0,250}?at checkout/i) || 
                          cleanHtml.match(/Save\s+([0-9.]+(?:%|\$))\s+at checkout/i) ||
                          cleanHtml.match(/Promo Code:\s*([A-Z0-9]+)/i) ||
                          cleanHtml.match(/Save\s*([0-9.]+(?:%|\$))\s*with promo code/i) ||
                          cleanHtml.match(/([0-9.]+(?:%|\$)).*?(?:Promo Code|Redeem)/i);

    if (checkoutMatch && checkoutMatch[1]) {
      const val = checkoutMatch[1];
      if (val.includes('%')) {
        promoSavings = basePrice * (parsePrice(val) / 100);
      } else if (!/[A-Z]/i.test(val)) { // Exclude raw promo codes like "SAVE20"
        const pVal = parsePrice(val);
        if (pVal > 0 && pVal < basePrice) {
          promoSavings = pVal;
        }
      }
    }

    const isBusiness = cleanHtml.match(/Business Price/i) || cleanHtml.match(/Business-Only Savings/i);

    // MUTUALLY EXCLUSIVE TIER SAVINGS
    // Do not add S&S and Promo together as they usually reflect the same price reduction tier
    let tierSavings = Math.max(snsSavings, promoSavings);
    
    // 4. Calculate Total Savings
    savingsAmount = tierSavings + couponSavings;
    
    // Safety Guard: Fallback if savings unnaturally exceed 60% without a massive explicit coupon
    if (savingsAmount >= basePrice || (savingsAmount > (basePrice * 0.60) && couponSavings === 0)) {
      if (couponSavings > 0) {
        savingsAmount = couponSavings;
        tierSavings = 0;
      } else if (tierSavings > 0) {
        savingsAmount = tierSavings;
      }
    }
    
    let discountLabels = [];
    if (tierSavings > 0) {
      if (tierSavings === snsSavings && snsSavings > 0) discountLabels.push('Subscribe & Save');
      else discountLabels.push('Promo/Checkout');
    }
    if (couponSavings > 0) discountLabels.push('Coupon');
    if (isBusiness) discountLabels.push('Business Price');
    
    discountType = discountLabels.join(' + ') || null;

    if (!discountType || savingsAmount <= 0) {
      return null;
    }

    let discountPercentRaw = 0;
    let discountPercent = '0.00%';
    if (basePrice > 0 && savingsAmount > 0) {
      discountPercentRaw = (savingsAmount / basePrice) * 100;
      
      // SANITY CHECK 2: Cap percentage to 85% maximum
      if (discountPercentRaw > 85) {
        discountPercentRaw = 85.00;
        savingsAmount = basePrice * 0.85;
      }
      discountPercent = discountPercentRaw.toFixed(2) + '%';
    }

    const minDiscountPercent = scanState.config ? scanState.config.minDiscountPercent : 0;
    if (discountPercentRaw < minDiscountPercent) {
      return null;
    }

    finalPrice = basePrice - savingsAmount;

    return {
      ...product,
      usBasePrice: basePrice,
      usDiscountType: discountType,
      usDiscountValue: `$${savingsAmount.toFixed(2)}`,
      usDiscountPercent: discountPercent,
      usSavingsAmount: savingsAmount,
      usFinalPrice: finalPrice,
      usProductUrl: `https://www.amazon.com/dp/${product.asin}`
    };
  }
})();
