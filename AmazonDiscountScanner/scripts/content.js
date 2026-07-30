/**
 * content.js — DOM parser for Amazon search result pages.
 *
 * Pure Search Page DOM Scanning (NO FETCHES).
 * Exact Discount Category Matching.
 */

(function () {
  'use strict';

  if (window.__amazonScannerInjected) return;
  window.__amazonScannerInjected = true;

  chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
    if (msg.type === 'SCROLL_PAGE') {
      simulateUserScroll().then(() => sendResponse({ ok: true }));
      return true;
    }

    if (msg.type === 'SCAN_PAGE') {
      if (msg.config && msg.config.scanMode === 'mx_direct') {
        scanMxDirectMode(msg.config);
        sendResponse({ ok: true });
        return false;
      }
      (async () => {
        try {
          if (detectAmazonBlockade()) {
            chrome.runtime.sendMessage({
              type:    'RATE_LIMITED',
              message: 'Amazon bot protection/rate-limit detected.',
            });
            sendResponse({ ok: false, rateLimited: true });
            return;
          }

          await simulateUserScroll();

          const results = scanPage(msg.config);
          const nextPageInfo = getNextPageInfo();

          chrome.runtime.sendMessage({
            type:        'PAGE_SCAN_RESULT',
            products:    results,
            hasNextPage: nextPageInfo.exists,
            nextPageUrl: nextPageInfo.url,
          });
        } catch (err) {
          chrome.runtime.sendMessage({
            type:    'SCAN_ERROR',
            message: `Content script error: ${err.message}`,
          });
        }
        sendResponse({ ok: true });
      })();
      return true;
    }
  });

  async function simulateUserScroll() {
    const totalScroll = window.innerHeight * (0.6 + Math.random() * 0.4);
    const steps = 4 + Math.floor(Math.random() * 4); // 4 to 7 steps
    const stepSize = totalScroll / steps;

    for (let i = 0; i < steps; i++) {
      window.scrollBy({ top: stepSize, behavior: 'smooth' });
      // Micro-pauses between 200ms and 600ms
      await new Promise(r => setTimeout(r, 200 + Math.random() * 400));
    }
    await new Promise(r => setTimeout(r, 400 + Math.random() * 400));
    window.scrollTo({ top: 0, behavior: 'smooth' });
    await new Promise(r => setTimeout(r, 200));
  }

  function detectAmazonBlockade() {
    const title = document.title || '';
    if (/(500|503|Robot Check|Sorry!)/i.test(title)) return true;
    if (/sorry.*something\s+went\s+wrong/i.test(title)) return true;
    
    const dogsImg = document.querySelector('img[alt*="Dogs of Amazon" i]');
    if (dogsImg) return true;
    
    const bodyText = document.body ? document.body.innerText || '' : '';
    if (/(Meet the dogs of Amazon|SORRY something went wrong|\/errors\/validateCaptcha)/i.test(bodyText)) return true;
    
    const errorWrapper = document.querySelector('#cs-help-wrapper, .cs-help-content, #g');
    if (errorWrapper && /sorry/i.test(errorWrapper.textContent || '')) return true;
    
    return false;
  }

  function normalizeText(rawText) {
    if (!rawText) return '';
    return rawText
      .replace(/[\u200B\u200C\u200D\uFEFF\u00A0]/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();
  }

  function extractTitle(card) {
    const titleEl =
      card.querySelector('h2 a span.a-text-normal') ||
      card.querySelector('h2 span.a-text-normal') ||
      card.querySelector('h2 a span') ||
      card.querySelector('h2 span') ||
      card.querySelector('[data-cy="title-recipe"] span') ||
      card.querySelector('h2 a') ||
      card.querySelector('h2');
    if (titleEl) return normalizeText(titleEl.textContent).substring(0, 200);
    const titleLink = card.querySelector('a[class*="title"], a[class*="Title"]');
    if (titleLink) {
      const ariaLabel = titleLink.getAttribute('aria-label');
      if (ariaLabel) return normalizeText(ariaLabel).substring(0, 200);
    }
    return '(Unknown Title)';
  }

  function extractPrice(card) {
    const priceContainer = card.querySelector('span.a-price:not([data-a-strike])');
    if (priceContainer) {
      const offscreen = priceContainer.querySelector('span.a-offscreen');
      if (offscreen) return normalizeText(offscreen.textContent);
    }
    const whole = card.querySelector('span.a-price-whole');
    const frac  = card.querySelector('span.a-price-fraction');
    if (whole) {
      const w = whole.textContent.replace(/[^0-9]/g, '');
      const f = frac ? frac.textContent.replace(/[^0-9]/g, '') : '00';
      return `$${w}.${f}`;
    }
    const priceSpan = card.querySelector('.a-color-price, [data-cy="price-recipe"] span');
    if (priceSpan) return normalizeText(priceSpan.textContent);
    const ariaEls = card.querySelectorAll('[aria-label]');
    for (const el of ariaEls) {
      const label = el.getAttribute('aria-label') || '';
      if (/^\$[\d,.]+$/.test(label.trim())) return label.trim();
    }
    return '';
  }

  function parsePrice(priceStr) {
    if (!priceStr) return 0;
    let s = normalizeText(priceStr);
    if (/\d,\d{2}\b/.test(s)) {
      s = s.replace(/\./g, '').replace(/,/g, '.');
    } else {
      s = s.replace(/,/g, '');
    }
    const cleaned = s.replace(/[^0-9.]/g, '');
    const parsed = parseFloat(cleaned);
    return isNaN(parsed) ? 0 : parsed;
  }

  function extractCurrency(priceStr) {
    if (!priceStr) return '$';
    const s = normalizeText(priceStr);
    const leading = s.match(/^([a-zA-Z]{0,3}\s?\$|MXN|PKR|[£€])/i);
    if (leading) return leading[1].trim();

    const trailing = s.match(/([a-zA-Z]{0,3}\s?\$|MXN|PKR|[£€])$/i);
    if (trailing) return trailing[1].trim();

    const fallback = s.match(/^([^\d]+)/);
    return fallback ? fallback[1].trim() : '$';
  }

  function isElementScanned(el, scannedElements) {
    if (!scannedElements) return false;
    for (const scanned of scannedElements) {
      if (scanned === el || scanned.contains(el) || el.contains(scanned)) {
        return true;
      }
    }
    return false;
  }

  // Exact Discount Rules
  function detectSubscribe(card, priceNum, currency, scannedElements) {
    let snsPrice = null;

    // Aggressively mark S&S components as scanned to prevent double counting in detectCoupon
    const snsContainers = card.querySelectorAll('[data-csa-c-buying-option-type="SNS"], span[id*="subscribe"], span[id*="planea"], #snsAccordionRowMiddle, #subscriptionPrice');
    snsContainers.forEach(el => {
      if (scannedElements) scannedElements.add(el);
    });

    // Step 2: S&S Subscription Price Extraction
    const snsPriceEl = card.querySelector('#sns-base-price .apex-pricetopay-value .a-offscreen, #sns-base-price .a-offscreen, #sns-base-price, #snsAccordionRowMiddle .apex-pricetopay-value .a-offscreen, #subscriptionPrice .apex-pricetopay-value .a-offscreen, #subscriptionPrice .a-offscreen');
    if (snsPriceEl) {
      const raw = normalizeText(snsPriceEl.textContent);
      snsPrice = parsePrice(raw);
    }

    let returnedSns = null;

    // Step 3: Calculate S&S Dollar Savings (single lowest final price)
    if (snsPrice !== null && snsPrice > 0 && snsPrice < priceNum) {
      const val = priceNum - snsPrice;
      const pct = (val / priceNum) * 100;
      returnedSns = { type: 'Subscribe & Save', value: val, percent: pct, raw: `${currency}${val.toFixed(2)}` };
    }

    // Fallback to text matching if precise price wasn't found
    const selectors = '.s-coupon-unclipped';
    const elements = card.querySelectorAll(selectors);
    for (const el of elements) {
      if (isElementScanned(el, scannedElements)) continue;
      const text = normalizeText(el.textContent);
      if (/when you subscribe|your first subscription order|subscription voucher|Planea y Ahorra|primer pedido de suscripción|Spar-Abo|s'abonner/i.test(text)) {
        if (scannedElements) scannedElements.add(el);
        if (!returnedSns) {
          const m = text.match(/(\d+)\s*%/);
          if (m) {
            const pct = parseFloat(m[1]);
            const val = priceNum > 0 ? (priceNum * pct / 100) : 0;
            returnedSns = { type: 'Subscribe & Save', value: val, percent: pct, raw: `${pct}%` };
          } else {
            returnedSns = { type: 'Subscribe & Save', value: 0, percent: 0, raw: 'S&S available' };
          }
        }
      }
    }
    return returnedSns;
  }

  function detectCoupon(card, priceNum, currency, scannedElements) {
    const selectors = '.s-coupon-tile-container, .s-coupon-unclipped, .s-coupon-highlight, [data-a-badge-type="coupon"], span[id*="coupon"], .couponLabelText, [id^="couponText"], #coupons_feature_div, #pAdvantage, #snsAccordionRowMiddle';
    const elements = card.querySelectorAll(selectors);
    for (const el of elements) {
      if (isElementScanned(el, scannedElements)) continue;
      const text = normalizeText(el.textContent);
      if (/with coupon|with voucher|Coupon price|Rabattgutschein|Gutschein|You pay|Pay|Ahorra|con cupón|cupon|Save|off/i.test(text)) {
        if (scannedElements) scannedElements.add(el);
        
        const payMatch = text.match(/(?:You pay|Pay|Paga)\s+[^\d]*(\d[\d,.]*)/i);
        if (payMatch) {
          const payPrice = parsePrice(payMatch[1]);
          if (payPrice > 0 && payPrice < priceNum) {
            const savings = priceNum - payPrice;
            const pct = (savings / priceNum) * 100;
            return { type: 'Coupon', value: savings, percent: pct, raw: `${currency}${savings.toFixed(2)}` };
          }
        }
        
        const pctMatch = text.match(/(\d+)\s*%/);
        if (pctMatch) {
          const pct = parseFloat(pctMatch[1]);
          const val = priceNum > 0 ? (priceNum * pct / 100) : 0;
          return { type: 'Coupon', value: val, percent: pct, raw: `${pct}%` };
        }
        
        const saveMatch = text.match(/(?:Save|Ahorra)\s+[^\d]*(\d[\d,.]*)/i);
        if (saveMatch) {
          const val = parsePrice(saveMatch[1]);
          if (val > 0) {
            const pct = priceNum > 0 ? (val / priceNum) * 100 : 0;
            return { type: 'Coupon', value: val, percent: pct, raw: `${currency}${val.toFixed(2)}` };
          }
        }
        
        const generalFlat = text.match(/(?:CDN\$|CAD\s*\$|MX\$|MXN|PKR|[$£€])\s*(\d+([.,]\d+)?)/i) || text.match(/(\d+([.,]\d+)?)\s*(?:CDN\$|CAD\s*\$|MX\$|MXN|PKR|[$£€])/i);
        if (generalFlat) {
          const val = parsePrice(generalFlat[0]);
          if (val > 0) {
            const pct = priceNum > 0 ? (val / priceNum) * 100 : 0;
            return { type: 'Coupon', value: val, percent: pct, raw: `${currency}${val.toFixed(2)}` };
          }
        }
        
        return { type: 'Coupon', value: 0, percent: 0, raw: 'Coupon detected' };
      }
    }
    return null;
  }

  function detectCheckout(card, priceNum, currency, scannedElements) {
    const selectors = 'span[id*="DELIGHT_PRICING_"], [data-a-badge-type="deal"], .a-color-secondary';
    const elements = card.querySelectorAll(selectors);
    for (const el of elements) {
      if (isElementScanned(el, scannedElements)) continue;
      const text = normalizeText(el.textContent);
      if (/at checkout|Ahorra al finalizar la compra|Rabatt an der Kasse/i.test(text)) {
        if (scannedElements) scannedElements.add(el);
        const mPct = text.match(/(\d+)\s*%/);
        if (mPct) {
          const pct = parseFloat(mPct[1]);
          const val = priceNum > 0 ? (priceNum * pct / 100) : 0;
          return { type: 'Save at Checkout', value: val, percent: pct, raw: `${pct}%` };
        }
        
        const mSave = text.match(/(?:Save|Ahorra)\s+[^\d]*(\d[\d,.]*)/i);
        if (mSave) {
          const val = parsePrice(mSave[1]);
          if (val > 0) {
            const pct = priceNum > 0 ? (val / priceNum) * 100 : 0;
            return { type: 'Save at Checkout', value: val, percent: pct, raw: `${currency}${val.toFixed(2)}` };
          }
        }
        
        return { type: 'Save at Checkout', value: 0, percent: 0, raw: 'Save at checkout' };
      }
    }
    return null;
  }

  function detectBusiness(card, priceNum, currency) {
    const text = normalizeText(card.textContent);
    const hasBizPrice = /business\s+price/i.test(text)
      || /quantity\s+discount/i.test(text)
      || /bulk\s+(?:discount|price|pricing)/i.test(text);

    if (hasBizPrice) {
      const bizPriceMatch = text.match(/business\s+price[:\s]*[^\d]*(\d[\d,.]*)/i);
      if (bizPriceMatch && priceNum > 0) {
        const bizPrice = parseFloat(bizPriceMatch[1].replace(/,/g, ''));
        if (bizPrice < priceNum) {
          const val = priceNum - bizPrice;
          const pct = (val / priceNum) * 100;
          return { type: 'Business Pricing', value: val, percent: pct, raw: `${currency}${val.toFixed(2)}` };
        }
      }
      const qtyMatch = text.match(/save\s+(\d+)\s*%\s+.*(?:qty|quantity|units|items|buy\s+\d)/i);
      if (qtyMatch) {
        const pct = parseFloat(qtyMatch[1]);
        const val = priceNum > 0 ? (priceNum * pct / 100) : 0;
        return { type: 'Business Pricing', value: val, percent: pct, raw: `${pct}%` };
      }
      return { type: 'Business Pricing', value: 0, percent: 0, raw: 'Business pricing available' };
    }
    return null;
  }

  function detectPromo(card, priceNum, currency) {
    const text = normalizeText(card.textContent);
    const promoPctMatch = text.match(/(?:apply|use|enter|extra)\s+(\d+)\s*%\s+(?:off\s+)?(?:promo|promotional|discount)\s*code/i)
      || text.match(/(\d+)\s*%\s+(?:promo|promotional)\s*code/i);
    if (promoPctMatch) {
      const pct = parseFloat(promoPctMatch[1]);
      const val = priceNum > 0 ? (priceNum * pct / 100) : 0;
      return { type: 'Promo Code', value: val, percent: pct, raw: `${pct}%` };
    }
    const promoFlatMatch = text.match(/(?:apply|use|enter|extra)\s+[^\d]*(\d[\d,.]*)\s+(?:off\s+)?(?:promo|promotional|discount)\s*code/i);
    if (promoFlatMatch) {
      const val = parseFloat(promoFlatMatch[1].replace(/,/g, ''));
      const pct = priceNum > 0 ? (val / priceNum) * 100 : 0;
      return { type: 'Promo Code', value: val, percent: pct, raw: `${currency}${val.toFixed(2)}` };
    }
    return null;
  }

  function scanPage(config) {
    const { discountTypes, minDiscountPercent } = config;
    const cards = document.querySelectorAll('div[data-component-type="s-search-result"]');
    const results = [];

    cards.forEach((card) => {
      const asin = card.getAttribute('data-asin');
      if (!asin || asin.trim() === '') return;

      const title    = extractTitle(card);
      const price    = extractPrice(card);
      const priceNum = parsePrice(price);
      const currency = extractCurrency(price);

      const detectedDiscounts = [];
      const scannedElements = new Set();
      
      // Always run detectSubscribe to consume S&S elements (prevents misclassification as Coupon)
      const ssDiscount = detectSubscribe(card, priceNum, currency, scannedElements);
      if (ssDiscount && discountTypes.subscribe) {
        detectedDiscounts.push(ssDiscount);
      }

      if (discountTypes.coupon) {
        const c = detectCoupon(card, priceNum, currency, scannedElements);
        if (c) detectedDiscounts.push(c);
      }
      if (discountTypes.checkout) {
        const c = detectCheckout(card, priceNum, currency, scannedElements);
        if (c) detectedDiscounts.push(c);
      }
      if (discountTypes.business) {
        const c = detectBusiness(card, priceNum, currency);
        if (c) detectedDiscounts.push(c);
      }
      if (discountTypes.promo) {
        const c = detectPromo(card, priceNum, currency);
        if (c) detectedDiscounts.push(c);
      }

      if (detectedDiscounts.length === 0) return;

      let tierSavings = 0;
      let couponSavings = 0;
      let appliedLabels = [];
      
      const couponD = detectedDiscounts.find(d => d.type === 'Coupon');
      if (couponD) {
        couponSavings = couponD.value;
        appliedLabels.push('Coupon');
      }
      
      // Find the best tier savings (max value) from non-coupon discounts to avoid double counting S&S + Promo
      const nonCouponDs = detectedDiscounts.filter(d => d.type !== 'Coupon');
      if (nonCouponDs.length > 0) {
        const bestTier = nonCouponDs.reduce((max, d) => d.value > max.value ? d : max, nonCouponDs[0]);
        if (bestTier.value > 0) {
          tierSavings = bestTier.value;
          appliedLabels.push(bestTier.type);
        }
      }
      
      let totalMonetary = tierSavings + couponSavings;

      // Safety Guard: Fallback if savings unnaturally exceed 60% without a massive explicit coupon
      if (totalMonetary >= priceNum || (totalMonetary > (priceNum * 0.60) && couponSavings === 0)) {
        if (couponSavings > 0) {
          totalMonetary = couponSavings;
          appliedLabels = ['Coupon'];
        } else if (tierSavings > 0) {
          totalMonetary = tierSavings;
          appliedLabels = [nonCouponDs.reduce((max, d) => d.value > max.value ? d : max, nonCouponDs[0]).type];
        }
      }
      
      const combinedLabels = appliedLabels.join(' + ');

      let combinedPct = 0;
      if (priceNum > 0 && totalMonetary > 0) {
        combinedPct = (totalMonetary / priceNum) * 100;
      }

      if (totalMonetary <= 0 || combinedPct < minDiscountPercent) return;

      results.push({
        asin,
        title,
        basePrice:               price,
        discountType:            combinedLabels,
        discountValue:           `${currency}${totalMonetary.toFixed(2)}`,
        discountPercent:         `${combinedPct.toFixed(2)}%`,
        savingsAmount:           totalMonetary,
        finalPrice:              priceNum > 0 ? (priceNum - totalMonetary) : 0,
        currency:                currency,
        effectiveDiscountPercent: parseFloat(combinedPct.toFixed(2)),
        productUrl:              `${window.location.origin}/dp/${asin}`,
      });
    });

    return results;
  }

  function getNextPageInfo() {
    const nextBtn = document.querySelector('a.s-pagination-next:not(.s-pagination-disabled)');
    if (nextBtn && nextBtn.href) {
      return { exists: true, url: nextBtn.href };
    }
    const paginationLinks = document.querySelectorAll('.s-pagination-container a, [class*="pagination"] a');
    for (const link of paginationLinks) {
      if (link.textContent.trim().toLowerCase() === 'next' && link.href) {
        return { exists: true, url: link.href };
      }
    }
    return { exists: false, url: null };
  }

  async function scanMxDirectMode(config) {
    try {
      const products = [];
      const cards = document.querySelectorAll('div[data-component-type="s-search-result"]');
      
      chrome.runtime.sendMessage({
        type: 'SCAN_LOG',
        message: `[MX Direct] Found ${cards.length} items. Checking US prices in batches...`,
        logType: 'info'
      }).catch(() => {});

      for (const card of cards) {
        const asin = card.getAttribute('data-asin');
        if (!asin || asin.trim() === '') continue;

        const title = extractTitle(card);

        const priceEl = card.querySelector('span.a-price:not([data-a-strike]) span.a-offscreen');
        const priceMXN = priceEl ? priceEl.textContent.trim() : 'N/A';
        const mxUrl = `${window.location.origin}/dp/${asin}`;

        products.push({
          scanMode: 'mx_direct',
          asin,
          mxTitle: title,
          mxPrice: priceMXN,
          mxProductUrl: mxUrl
        });
      }

      // Process in background in parallel batches
      await new Promise(resolve => {
         chrome.runtime.sendMessage({ type: 'CHECK_US_DISCOUNT_BATCH', products }, resolve);
      });

      const nextBtn = document.querySelector('a.s-pagination-next:not(.s-pagination-disabled)');
      const hasNextPage = nextBtn && nextBtn.href ? true : false;
      const nextPageUrl = hasNextPage ? nextBtn.href : null;

      chrome.runtime.sendMessage({
        type: 'PAGE_SCAN_RESULT',
        products: [], // Already handled in background batching
        hasNextPage,
        nextPageUrl
      }).catch(() => {});
    } catch (err) {
      chrome.runtime.sendMessage({
        type: 'SCAN_ERROR',
        message: `[MX Direct Error] ${err.message}`
      }).catch(() => {});
    }
  }
})();
