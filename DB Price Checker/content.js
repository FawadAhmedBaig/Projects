(async () => {
  const { enableExtension } = await chrome.storage.local.get('enableExtension');
  
  if (enableExtension !== false) {
    startConversion();
  } else {
    console.log("Extension is disabled.");
  }
})();

// Listen for toggle messages from popup/background
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === 'toggle-extension') {
    if (message.enableExtension) {
      startConversion();
    } else {
      removeConvertedPrices();
    }
  }
});

// Main conversion function
async function startConversion() {
  // Wait for Airbnb-specific content
  if (location.hostname.includes('airbnb.com')) {
    await waitForElement('[data-testid="price-and-discounted-price"]', 2000);
  }await waitForPricesToAppear();
  let selectedFiatCurrency = await detectCurrencyFromPage() || await getStoredCurrency();
  console.log("Selected Currency:", selectedFiatCurrency);
  convertFiatToCryptoOnPage('dickbutt', selectedFiatCurrency);
}

// Convert fiat prices to crypto on page
async function convertFiatToCryptoOnPage(coinId, fiatCurrency) {
  try {
    const [coinPrice, { dickbuttMode = false }] = await Promise.all([
      getCryptoPrice(coinId, fiatCurrency),
      chrome.storage.local.get('dickbuttMode')
    ]);

    console.log("Coin Price:", coinPrice, "Only Memecoin:", dickbuttMode);
    replacePrices(coinPrice, coinId, dickbuttMode);
    observeDOMChanges(coinPrice, coinId, dickbuttMode);
  } catch (error) {
    console.error('Failed to convert prices:', error.message);
  }
}

// Fetch crypto price from CoinGecko API
async function getCryptoPrice(coinId, fiatCurrency) {
  const apiUrl = `https://api.coingecko.com/api/v3/simple/price?ids=${coinId}&vs_currencies=${fiatCurrency}`;
  const response = await fetch(apiUrl);
  const data = await response.json();

  if (!data[coinId]?.[fiatCurrency]) {
    throw new Error(`No price data found for "${coinId}" in "${fiatCurrency}".`);
  }

  return data[coinId][fiatCurrency];
}

// Convert fiat amount to crypto
// function fiatToCrypto(fiatAmount, coinPrice, coinId) {
//   const amount = Math.round(fiatAmount / coinPrice).toLocaleString();
//   return `${amount} $${coinId.toUpperCase()}`;
// }
function fiatToCrypto(fiatAmount, coinPrice, coinId) {
  const amount = Math.round(fiatAmount / coinPrice).toLocaleString();
  return amount; // ✅ Just return number like 517,516
}



function parseAbbreviatedPrice(text) {
  let cleanText = text.trim();
  let multiplier = 1;
  let suffix = '';

  if (/k$/i.test(cleanText)) {
    multiplier = 1_000;
    suffix = 'K';
    cleanText = cleanText.replace(/k$/i, '');
  } else if (/m$/i.test(cleanText)) {
    multiplier = 1_000_000;
    suffix = 'M';
    cleanText = cleanText.replace(/m$/i, '');
  } else if (/b$/i.test(cleanText)) {
    multiplier = 1_000_000_000;
    suffix = 'B';
    cleanText = cleanText.replace(/b$/i, '');
  }

  const number = parseFloat(cleanText.replace(/,/g, ''));
  if (isNaN(number)) return { value: null, suffix };

  return { value: number * multiplier, suffix };
}





// Replace prices on page
function replacePrices(coinPrice, coinId, onlyMemecoin) {
  const forbiddenDomains = ['google.com', 'gmail.com'];
  if (forbiddenDomains.some(domain => location.hostname.includes(domain))) {
    console.log("Price injection skipped on:", location.hostname);
    return;
  }

const priceRegex = new RegExp(
  String.raw`(?<![A-Za-z0-9])(\$|€|£|¥|元|C\$|CA\$|AR\$|A\$|AU\$|R\$|CLP\$|Kč|kr|Ft|HK\$|₹|Rs|Rp|MX\$|NT\$|NZ\$|₱|zł|₽|S\$|SG\$|₩|₺|₫|CHF|CNY|CAD|ARS|EUR|AUD|BRL|CLP|CZK|DKK|HUF|HKD|INR|IDR|MXN|TWD|NZD|NOK|PHP|PLN|RUB|SGD|ZAR|KRW|SEK|TRY|VND)\s?(\d+(?:[.,]\d{3})*(?:\.\d+)?)([kKmMbB])?`,
  'gi'
);








  // Process text nodes
  const treeWalker = document.createTreeWalker(
    document.body,
    NodeFilter.SHOW_TEXT,
    {
      acceptNode: (node) => {
        const parentTag = node.parentNode?.nodeName.toLowerCase();
        const ignoredTags = ['script', 'style', 'noscript', 'iframe', 'input', 'textarea', 'select', 'button', 'option', 'h1', 'h2', 'title', 'label', 'strong', 'b'];
        return ignoredTags.includes(parentTag) ? NodeFilter.FILTER_REJECT : NodeFilter.FILTER_ACCEPT;
      }
    }
  );

  const nodesToReplace = [];
  while (treeWalker.nextNode()) {
    const node = treeWalker.currentNode;
    if (priceRegex.test(node.nodeValue)) {
      nodesToReplace.push(node);
    }
  }

  for (const node of nodesToReplace) {
    if (/[A-Za-z]{2,}-\d{3,}/.test(node.nodeValue)) continue;

    const parent = node.parentNode;
    if (!parent || parent.classList.contains('crypto-converted')) continue;

const replacedHTML = node.nodeValue.replace(priceRegex, (_, symbol, fullAmount, suffix = '') => {
    const { value: numericAmount } = parseAbbreviatedPrice(fullAmount + suffix);
    if (!numericAmount) return _;

    const cryptoAmount = fiatToCrypto(numericAmount, coinPrice, coinId);

    return onlyMemecoin
      ? `${cryptoAmount} $DICKBUTT`
      : `${symbol}${fullAmount}${suffix} <span style="color:#3260d3; font-size:0.85em; font-weight:bold;">| ${cryptoAmount} $DICKBUTT</span>`;
});










    const span = document.createElement('span');
    span.innerHTML = replacedHTML;
    span.classList.add('crypto-converted');
    parent.replaceChild(span, node);
  }

// Handle Amazon-specific price blocks
document.querySelectorAll('.a-price:not(.crypto-converted)').forEach((priceBlock) => {
    const wholeEl = priceBlock.querySelector('.a-price-whole');
    const fractionEl = priceBlock.querySelector('.a-price-fraction');
    const symbolEl = priceBlock.querySelector('.a-price-symbol');

    if (!wholeEl) return; // skip if no price found

    // ✅ Get whole and fraction text
    const whole = wholeEl.innerText.replace(/[^\d]/g, '');
    const fraction = fractionEl ? fractionEl.innerText.replace(/[^\d]/g, '') : '';

    // ✅ Build full amount (ex: "1,200.50")
    let fullAmountText = whole;
    if (fraction) fullAmountText += '.' + fraction;

    // ✅ Add suffix check (Amazon usually won’t use M/K/B, but keep it future-proof)
    const { value: numericAmount } = parseAbbreviatedPrice(fullAmountText);
    if (!numericAmount) return;

    // ✅ Convert to DICKBUTT price
    const cryptoAmount = fiatToCrypto(numericAmount, coinPrice, coinId);

    // ✅ Build crypto span
    const cryptoSpan = document.createElement('span');
    cryptoSpan.className = 'crypto-price-converted';
    cryptoSpan.style = 'margin-left: 6px; color: #3260d3; font-size: 0.85em; font-weight: bold;';
    cryptoSpan.innerText = onlyMemecoin ? cryptoAmount : `| ${cryptoAmount} $DICKBUTT`;

    // ✅ Append if not already added
    if (!priceBlock.querySelector('.crypto-price-converted')) {
        priceBlock.appendChild(cryptoSpan);
        priceBlock.classList.add('crypto-converted');

        // ✅ Hide original text in memecoin-only mode
        if (onlyMemecoin) {
            wholeEl.style.display = 'none';
            if (fractionEl) fractionEl.style.display = 'none';
            if (symbolEl) symbolEl.style.display = 'none';
        }
    }
});


  // Handle Amazon offscreen prices
  document.querySelectorAll('.a-offscreen:not(.crypto-converted)').forEach((el) => {
    const priceText = el.innerText.replace(/[^0-9.,]/g, '');
    // const numericAmount = parseFloat(priceText.replace(/,/g, ''));
    const numericAmount = parseAbbreviatedPrice(fullAmount);

    if (isNaN(numericAmount)) return;

    const cryptoAmount = fiatToCrypto(numericAmount, coinPrice, coinId);
    const cryptoSpan = document.createElement('span');
    cryptoSpan.className = 'crypto-price-converted';
    cryptoSpan.style = 'margin-left: 6px; color: #3260d3; font-size: 0.85em; font-weight: bold;';
    cryptoSpan.innerText = onlyMemecoin ? cryptoAmount : `| ${cryptoAmount}`;

    if (!el.parentNode.querySelector('.crypto-price-converted')) {
      el.after(cryptoSpan);
      el.classList.add('crypto-converted');
      if (onlyMemecoin) el.style.display = 'none';
    }
  });

  // Handle eBay-specific prices
  const ebayPriceSelectors = ['#prcIsum', '#mm-saleDscPrc', '#prcIsum_bidPrice', '.display-price'];
  ebayPriceSelectors.forEach(selector => {
    const el = document.querySelector(selector);
    if (!el || el.classList.contains('crypto-converted')) return;

    const priceText = el.textContent.replace(/[^0-9.,]/g, '');
    // const numericAmount = parseFloat(priceText.replace(/,/g, ''));
    const numericAmount = parseAbbreviatedPrice(fullAmount);

    if (isNaN(numericAmount)) return;

    const cryptoAmount = fiatToCrypto(numericAmount, coinPrice, coinId);
    const cryptoSpan = document.createElement('span');
    cryptoSpan.className = 'crypto-price-converted';
    cryptoSpan.style = 'margin-left: 6px; color: #3260d3; font-size: 0.85em; font-weight: bold;';
    cryptoSpan.innerText = onlyMemecoin ? cryptoAmount : `| ${cryptoAmount}`;

    el.after(cryptoSpan);
    el.classList.add('crypto-converted');
  });
}

// Observe DOM for dynamic content
function observeDOMChanges(coinPrice, coinId, onlyMemecoin) {
  const observer = new MutationObserver((mutations) => {
    for (const mutation of mutations) {
      for (const node of mutation.addedNodes) {
        if (node.nodeType === 1 && !['SCRIPT', 'STYLE'].includes(node.nodeName)) {
          replacePrices(coinPrice, coinId, onlyMemecoin);
        }
      }
    }
  });

  observer.observe(document.body, { childList: true, subtree: true });
}

// Remove converted prices
function removeConvertedPrices() {
  document.querySelectorAll('.crypto-price-converted').forEach(span => span.remove());

  document.querySelectorAll('.crypto-converted').forEach(el => {
    const parent = el.parentNode;
    if (el.tagName === 'SPAN' && el.childNodes.length === 1 && el.childNodes[0].nodeType === Node.TEXT_NODE) {
      parent.replaceChild(el.childNodes[0], el);
    } else {
      el.classList.remove('crypto-converted');
    }
  });

  document.querySelectorAll('.a-price-whole, .a-price-fraction, .a-price-symbol, .a-offscreen').forEach(el => {
    el.style.display = '';
  });
}

// Wait for element to appear
function waitForElement(selector, timeout = 3000) {
  return new Promise(resolve => {
    const el = document.querySelector(selector);
    if (el) return resolve(true);

    const observer = new MutationObserver(() => {
      if (document.querySelector(selector)) {
        observer.disconnect();
        resolve(true);
      }
    });

    observer.observe(document.body, { childList: true, subtree: true });
    setTimeout(() => {
      observer.disconnect();
      resolve(false);
    }, timeout);
  });
}

async function waitForPricesToAppear(timeout = 3000) {
  return new Promise(resolve => {
    const interval = setInterval(() => {
      const priceDetected = /\$|€|£|¥|₹|Rs|C\$|CA\$|R\$|AU\$|A\$|NZ\$|₽|₺|₫|₩|zł|Kč|kr|Ft|元|HK\$|S\$|SG\$|CLP\$|AR\$|Rp/.test(document.body.innerText);
      if (priceDetected) {
        clearInterval(interval);
        resolve();
      }
    }, 300);

    setTimeout(() => {
      clearInterval(interval);
      resolve(); // fallback if prices never appear
    }, timeout);
  });
}

// Detect currency from page
async function detectCurrencyFromPage() {
  const currencySymbols = {
  'C\\$': 'cad', 'CA\\$': 'cad', 'R\\$': 'brl', 'A\\$': 'aud', 'AU\\$': 'aud', 'NZ\\$': 'nzd',
  '€': 'eur', 'EUR': 'eur', '£': 'gbp', '¥': 'jpy', '元': 'cny', 'CNY': 'cny', '₩': 'krw', '₹': 'inr',
  'Rs': 'inr', '₽': 'rub', '₺': 'try', '₫': 'vnd', 'CLP\\$': 'clp', 'AR\\$': 'ars', 'Rp': 'idr',
  'S\\$': 'sgd', 'SG\\$': 'sgd', 'HK\\$': 'hkd', 'MX\\$': 'mxn', 'NT\\$': 'twd', 'CHF': 'chf',
  '₱': 'php', 'PHP': 'php',
  'zł': 'pln', 'Kč': 'czk', 'kr': 'sek', 'Ft': 'huf', '\\$': 'usd'
  // ⚠️ Removed bare 'R': 'zar'
};


  const domainCurrencyHints = {
    'zillow.com': ['cad', 'usd'], 'amazon.com.br': ['brl'], 'amazon.ca': ['cad'],
    'amazon.com': ['usd'], 'ebay.ca': ['cad'], 'ebay.com': ['usd']
  };

  const hostname = location.hostname.toLowerCase();
  if (hostname.includes('.za') || hostname.includes('gumtree.co.za')) {
    currencySymbols['R'] = 'zar';
  }

  let prioritizedCurrencies = Object.keys(currencySymbols);
  for (const [domain, currencies] of Object.entries(domainCurrencyHints)) {
    if (hostname.includes(domain)) {
      prioritizedCurrencies = [
        ...currencies.flatMap(c => Object.keys(currencySymbols).filter(k => currencySymbols[k] === c)),
        ...Object.keys(currencySymbols).filter(k => !currencies.includes(currencySymbols[k]))
      ];
      break;
    }
  }

  // Check URL parameters
  const currencyParam = new URLSearchParams(location.search).get('currency');
  if (currencyParam && /^[A-Z]{3}$/.test(currencyParam)) {
    const currency = currencyParam.toLowerCase();
    if (Object.values(currencySymbols).includes(currency)) {
      console.log("✅ Detected currency from URL:", currency);
      return currency;
    }
  }

  // Check meta tags
  const metaCurrency = document.querySelector('meta[name="currency"]')?.getAttribute('content');
  if (metaCurrency && /^[A-Z]{3}$/.test(metaCurrency)) {
    const currency = metaCurrency.toLowerCase();
    if (Object.values(currencySymbols).includes(currency)) {
      console.log("✅ Detected currency from meta tag:", currency);
      return currency;
    }
  }

  // Check Airbnb-specific state
  if (hostname.includes('airbnb.com')) {
    const airbnbCurrency = getCurrencyFromAirbnbState();
    if (airbnbCurrency) return airbnbCurrency;

    const currencyMatches = { '$': 'usd', '€': 'eur', '£': 'gbp', 'CHF': 'chf', 'C$': 'cad', 'A$': 'aud' };
    const visibleText = document.body.innerText?.replace(/\u202F|\u00A0/g, ' ') || '';
    for (const [symbol, code] of Object.entries(currencyMatches)) {
      const regex = new RegExp(`${symbol}\\s?\\d{1,3}([.,]\\d{3})*([.,]\\d{2})?`, 'gi');
      if (regex.test(visibleText)) {
        console.log("✅ Detected Airbnb currency via visible text symbol:", symbol, "=>", code);
        return code;
      }
    }

    // Check Airbnb price span for euro symbol
    const airbnbPriceEl = document.querySelector('[data-testid="price-and-discounted-price"]');
    if (airbnbPriceEl && airbnbPriceEl.innerText.includes('€')) {
      console.log("✅ Detected Airbnb currency from price DOM: € => eur");
      return 'eur';
    }


    const codeMatch = visibleText.match(/\b(USD|EUR|GBP|CHF|CAD|AUD|NZD)\b/);
    if (codeMatch) {
      console.log("✅ Detected Airbnb currency via code:", codeMatch[1]);
      return codeMatch[1].toLowerCase();
    }
  }

  // Check page text for currency symbols
  const normalizedText = (document.body.textContent || '').replace(/\u00A0/g, ' ');
  for (const pattern of prioritizedCurrencies) {
    const currency = currencySymbols[pattern];
    const regex = new RegExp(`\\b${pattern}\\s*\\d`, 'i');
    if (regex.test(normalizedText)) {
      console.log("✅ Detected currency from symbol:", pattern, "=>", currency);
      return currency;
    }
  }

  // Fallback to domain-specific currency
  for (const [domain, currencies] of Object.entries(domainCurrencyHints)) {
    if (hostname.includes(domain)) {
      console.log("✅ Falling back to domain-specific currency:", currencies[0]);
      return currencies[0];
    }
  }

  // Final fallback to locale-based currency
  const fallback = guessCurrencyByLocale();
  console.log("⚠️ Falling back to locale currency:", fallback);
  return fallback;
}

// Get stored currency
async function getStoredCurrency() {
  const { currency } = await chrome.storage.local.get('currency');
  return currency || 'usd';
}

// Get Airbnb currency from state
function getCurrencyFromAirbnbState() {
  try {
    if (window.__INITIAL_STATE__?.currency && /^[a-z]{3}$/i.test(window.__INITIAL_STATE__.currency)) {
      console.log("✅ Detected Airbnb currency from window.__INITIAL_STATE__:", window.__INITIAL_STATE__.currency);
      return window.__INITIAL_STATE__.currency.toLowerCase();
    }

    const stateScript = [...document.scripts].find(script => script.innerText.includes('"currency":"'));
    const match = stateScript?.innerText.match(/"currency":"([A-Z]{3})"/);
    if (match?.[1]) {
      console.log("✅ Detected Airbnb currency from state script:", match[1]);
      return match[1].toLowerCase();
    }
  } catch (err) {
    console.warn("❌ Airbnb state currency detection failed:", err);
  }
  return null;
}

// Guess currency by locale
function guessCurrencyByLocale() {
  const localeCurrencyMap = {
    'en-US': 'usd', 'en-GB': 'gbp', 'fr-FR': 'eur', 'de-DE': 'eur', 'ja-JP': 'jpy',
    'en-CA': 'cad', 'fr-CA': 'cad', 'en-AU': 'aud', 'en-NZ': 'nzd', 'es-CL': 'clp',
    'es-MX': 'mxn', 'zh-CN': 'cny', 'zh-TW': 'twd', 'ko-KR': 'krw', 'ru-RU': 'rub',
    'tr-TR': 'try', 'pl-PL': 'pln', 'cs-CZ': 'czk', 'hu-HU': 'huf', 'sv-SE': 'sek'
  };
  return localeCurrencyMap[navigator.language] || 'usd';
}