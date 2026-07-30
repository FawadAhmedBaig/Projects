// content.js — single content script for profiles and mutuals-search pages
// Fixed: removed rogue IIFE and made mutuals extraction reliable + logged
console.log('Warm Intro Router content script loaded');

// ---------- new globals for safe aborting / detection ----------
let __WIR_extractionActive = false;
let __WIR_lastExtractionHref = null;
// quick ping responder so background can detect content is loaded
chrome?.runtime?.onMessage?.addListener?.((msg, sender, sendResponse) => {
  try {
    if (!msg || !msg.type) return;
    if (msg.type === 'PING_FROM_BG') {
      // immediate lightweight reply
      sendResponse({ pong: true, href: location.href });
      return; // keep other listeners intact
    }
    // other message types are handled in your main listener below
  } catch (e) { /* ignore */ }
});

function safeText(el) {
  try { return el && (el.innerText || el.textContent) ? (el.innerText || el.textContent).trim() : ''; }
  catch (e) { return ''; }
}

function isMutualsSearchPage() {
  try {
    const url = new URL(location.href);
    if (!url.hostname.endsWith('.linkedin.com') && url.hostname !== 'linkedin.com') return false;
    if (!url.pathname.startsWith('/search/results/people/')) return false;
    // require connectionOf OR other search params often present on mutuals page
    return url.searchParams.has('connectionOf') || url.searchParams.has('origin') || url.searchParams.has('network');
  } catch (e) {
    return false;
  }
}

// Profile extractors
function extractProfileName() {
  const primary = document.querySelector('div[data-view-name="profile-top-card-verified-badge"] div[role="button"] p');
  if (primary && safeText(primary)) return safeText(primary);
  const selectors = [
    'section.pv-top-card h1',
    '.pv-text-details__left-panel h1',
    '.profile-topcard-person-entity__name',
    'h1'
  ];
  for (const sel of selectors) {
    const el = document.querySelector(sel);
    if (el && safeText(el)) return safeText(el);
  }
  return '';
}

// function extractHeadlineOrCompany() {
//   const ps = document.querySelectorAll('p');
//   if (ps && ps.length > 4 && safeText(ps[4])) return safeText(ps[4]);
//   const selectors = [
//     '.pv-text-details__left-panel .text-body-medium',
//     '.pv-text-details__left-panel .text-body-small',
//     '.pv-top-card--list li',
//     '.text-body-medium.break-words'
//   ];
//   for (const sel of selectors) {
//     const el = document.querySelector(sel);
//     if (el && safeText(el)) return safeText(el);
//   }
//   return '';
// }
// --- stricter headline filter + cleaner that removes duplicate name and "Message" noise ---

function isBadHeadline(txt) {
  if (!txt || typeof txt !== 'string') return true;
  const t = txt.trim();
  if (t.length < 3) return true;
  if (t.length > 500) return true;
  if (!/[a-zA-Z]/.test(t)) return true;

  // reject short single-word UI labels or pure nav items
  const badWords = [
    'home','my network','jobs','messaging','notifications','me',
    'for business','reactivate premium','reactivate','premium',
    'help','sign in','sign out','get started','search','message'
  ];
  const lower = t.toLowerCase();
  for (const w of badWords) {
    if (new RegExp('\\b' + w.replace(/[-\/\\^$*+?.()|[\]{}]/g,'\\$&') + '\\b', 'i').test(lower)) return true;
  }

  // accessibility/dialog noise
  const badPatterns = [
    /beginning of dialog window/i,
    /escape will cancel/i,
    /press enter to/i,
    /skip to main content/i,
    /close dialog/i,
    /loading/i,
    /show more/i
  ];
  for (const re of badPatterns) if (re.test(t)) return true;

  // need at least two words to look like a headline
  if ((t.match(/\w+/g) || []).length < 2) return true;

  return false;
}

function cleanCandidateHeadline(raw, profileName = '') {
  if (!raw || typeof raw !== 'string') return '';
  // normalize whitespace and lines
  let txt = raw.replace(/\r/g, ' ').split('\n').map(s => s.trim()).filter(Boolean).join(' ');
  // remove left/right stray separators
  txt = txt.replace(/^[\|\-\:,\s]+|[\|\-\:,\s]+$/g, '').trim();

  // remove the profile name (exact or partial) if present at start or anywhere
  if (profileName) {
    const nameParts = profileName.split(/\s+/).filter(Boolean);
    if (nameParts.length) {
      // build patterns for full name and first+last, case-insensitive
      const patterns = [];
      patterns.push(profileName.replace(/[-\/\\^$*+?.()|[\]{}]/g,'\\$&'));
      if (nameParts.length > 1) patterns.push((nameParts[0] + '\\s+' + nameParts.slice(1).join('\\s+')).replace(/[-\/\\^$*+?.()|[\]{}]/g,'\\$&'));
      // also remove if name appears as a standalone token
      patterns.push(nameParts[0].replace(/[-\/\\^$*+?.()|[\]{}]/g,'\\$&'));
      const re = new RegExp('\\b(' + patterns.join('|') + ')\\b', 'ig');
      txt = txt.replace(re, '').replace(/\s{2,}/g, ' ').trim();
      // if leftover leading separators remain, trim
      txt = txt.replace(/^[\|\-\:\,]+\s*/, '').trim();
    }
  }

  // remove obvious "Message" / "Connect" prefix or suffix words if they remain
  txt = txt.replace(/\b(Message|Connect|Follow|Following|1|2)\b/ig, '').replace(/\s{2,}/g, ' ').trim();

  // final pass: collapse multiple separators
  txt = txt.replace(/\s*\|\s*/g, ' | ').replace(/\s{2,}/g, ' ').trim();

  return txt;
}

function extractHeadlineOrCompany() {
  // Acquire the profile name (to strip duplicates)
  let profileName = '';
  try { profileName = (typeof extractProfileName === 'function') ? (extractProfileName() || '') : ''; } catch (e) { profileName = ''; }

  // 1) try focused top-card selectors
  const selectors = [
    'section.pv-top-card .pv-text-details__left-panel .text-body-medium',
    'section.pv-top-card .pv-text-details__left-panel .text-body-small',
    'section.pv-top-card .text-body-medium.break-words',
    'section.pv-top-card .pv-top-card--list li',
    'section.pv-top-card p',
    '.pv-top-card--list li',
    '.profile-topcard-person-entity__occupation'
  ];

  for (const sel of selectors) {
    try {
      const el = document.querySelector(sel);
      if (!el) continue;
      if (el.closest && el.closest('header, nav, footer, [role="banner"], .global-nav')) continue;
      let candidate = (el.innerText || el.textContent || '').trim();
      if (!candidate) continue;
      candidate = cleanCandidateHeadline(candidate, profileName);
      if (candidate && !isBadHeadline(candidate)) return candidate;
    } catch (e) {}
  }

  // 2) narrow-scope scan inside top-card only
  try {
    const topCard = document.querySelector('section.pv-top-card, .pv-top-card');
    const root = topCard || document.body;
    const nodes = Array.from(root.querySelectorAll('p, span, div'))
      .filter(n => {
        if (n.closest && n.closest('header, nav, footer, [role="banner"], .global-nav')) return false;
        const style = window.getComputedStyle(n);
        if (!style || style.display === 'none' || style.visibility === 'hidden') return false;
        const txt = (n.innerText || n.textContent || '').trim();
        if (!txt) return false;
        return txt.length >= 3 && txt.length < 500;
      });

    for (const n of nodes) {
      let candidate = (n.innerText || n.textContent || '').trim();
      candidate = cleanCandidateHeadline(candidate, profileName);
      if (candidate && !isBadHeadline(candidate)) return candidate;
    }
  } catch (e) {}

  // 3) fallback: sanitized document.title
  try {
    const title = (document.title || '').replace(/\s+[\-\|\–]\s+LinkedIn.*$/i, '').trim();
    const candidate = cleanCandidateHeadline(title, profileName);
    if (candidate && !isBadHeadline(candidate)) return candidate;
  } catch (e) {}

  return '';
}


/* Try to collect visible mutual names from the profile DOM (no navigation/clicking).
   Returns array (maybe empty). */
function extractVisibleMutualsFromProfileDOM() {
  const mutuals = new Set();
  try {
    const nodes = document.querySelectorAll(
      '[data-view-name="profile-shared-connections"] a, ' +
      '[data-control-name="topcard_view_all_connections"] a, ' +
      '[data-view-name="profile-shared-connections"]'
    );
    if (nodes && nodes.length) {
      nodes.forEach(n => {
        const t = safeText(n);
        if (t && t.split(/\s+/).length >= 2 && t.length < 120) mutuals.add(t);
      });
    }

    if (mutuals.size === 0) {
      const candidates = Array.from(document.querySelectorAll('section,div'))
        .filter(n => /Mutual connections|Mutual connection|mutual connections/i.test(n.innerText || ''));
      if (candidates.length) {
        candidates[0].querySelectorAll('a').forEach(a => {
          const t = safeText(a);
          if (t && t.split(/\s+/).length >= 2 && t.length < 120) mutuals.add(t);
        });
      }
    }
  } catch (e) {
    console.warn('extractVisibleMutualsFromProfileDOM error', e);
  }
  return Array.from(mutuals).slice(0, 500);
}

/* Find the shared-connections href on profile (absolute URL) */
// function findSharedConnectionsHref() {
//   try {
//     const el =
//       document.querySelector('[data-view-name="profile-shared-connections"] a') ||
//       document.querySelector('[data-control-name="topcard_view_all_connections"] a') ||
//       document.querySelector('[data-view-name="profile-shared-connections"]');

//     if (!el) return null;
//     const raw = el.href || (el.getAttribute && el.getAttribute('href')) || (el.querySelector && el.querySelector('a') && el.querySelector('a').href);
//     if (!raw) return null;
//     return new URL(raw, location.href).toString();
//   } catch (e) {
//     console.warn('findSharedConnectionsHref error', e);
//     return null;
//   }
// }
/* Find the shared-connections href on profile (absolute URL)
   - waits briefly for lazy DOM
   - searches many possible anchor selectors and href patterns
   - returns absolute URL string or null
*/
function findSharedConnectionsHref(waitMs = 2500) {
  const endAt = Date.now() + waitMs;

  function candidateHrefFromNode(n) {
    try {
      const href = n.href || (n.getAttribute && n.getAttribute('href'));
      if (!href || href === '#') return null;
      // ignore javascript: style hrefs
      if (/^\s*javascript:/i.test(href)) return null;
      // prefabricate absolute URL
      return new URL(href, location.href).toString();
    } catch (e) {
      return null;
    }
  }

  function findOnce() {
    // 1) common data-view/data-control selectors you already had
    const nodes = Array.from(document.querySelectorAll(
      '[data-view-name="profile-shared-connections"] a, ' +
      '[data-control-name="topcard_view_all_connections"] a, ' +
      '[data-test-topcard-view-all-connections] a, ' +
      'a[href*="/search/results/people/"], ' +
      'a[href*="connectionOf="], ' +
      'a[href*="/connections/"], ' +
      'a[aria-label*="connections"], ' +
      'a[title*="connections"], ' +
      'a'
    ));

    // Filter and return first plausible href that looks like a connections/search URL
    for (const n of nodes) {
      const h = candidateHrefFromNode(n);
      if (!h) continue;
      // heuristics: connections/search page or has connectionOf
      if (/\/search\/results\/people\/|connectionOf=|\/connections\//i.test(h)) return h;
      // also accept anchors whose text contains "Mutual" / "connections"
      try {
        const t = (n.innerText || n.textContent || '').trim();
        if (/mutuals?|shared connections|connections/i.test(t)) return h;
      } catch (e){}
    }

    return null;
  }

  // quick repeated attempts for up to waitMs (polling) — for lazy-loaded variants
  let found = findOnce();
  if (found) return found;

  // poll loop (small delay per tick)
  const pollDelay = 250;
  while (Date.now() < endAt) {
    // give the DOM a chance to settle for lazy renderers
    // but bail early if page is clearly not a profile or we navigated away
    if (!document || !location || !location.href) break;
    try {
      // small synchronous sleep via busy-wait not used — use setTimeout via promise (async path)
      // but this function is synchronous in your flow; so we do a micro-yield via Date check loop
    } catch (e) { break; }
    // attempt find again
    found = findOnce();
    if (found) return found;
    // synchronous short wait (block for pollDelay ms)
    const stop = Date.now() + pollDelay;
    while (Date.now() < stop) { /* spin-wait to keep this sync — minimal cost */ }
  }

  // Debug: gather candidate hrefs to help diagnose variants (will be printed where you call this)
  try {
    const allAnchors = Array.from(document.querySelectorAll('a')).slice(0, 200);
    const candidateList = allAnchors.map(a => {
      try { return (a.href || a.getAttribute('href') || '').slice(0, 200); } catch(e){ return ''; }
    }).filter(Boolean).slice(0,50);
    console.debug('[findSharedConnectionsHref] candidate hrefs (sample):', candidateList);
  } catch(e){}

  return null;
}

/**
 * Extract even-indexed mutual names across pages, scroll/focus Next then click.
 * Returns array of unique names and also sends chrome.runtime message {type:'MUTUALS_EXTRACTED', mutuals}
 *
 * @param {number} maxPages - max pages to traverse (default 10)
 * @param {number} perPageDelayMs - extra wait after page-change (default 800)
 * @param {number} stablePollInterval - DOM poll interval (default 250)
 * @param {number} stableRequired - number of stable polls to consider list stable (default 2)
 */
// async function extractMutualsPaginated(
//   maxPages = 10,
//   perPageDelayMs = 1000,
//   stablePollInterval = 300,
//   stableRequired = 2
// ) {
//   const collected = new Set();
//   const wait = (ms) => new Promise((res) => setTimeout(res, ms));

//   const readListNodes = () =>
//     Array.from(document.querySelectorAll('ul[role="list"] li span[dir="ltr"] span'));

//   async function waitForListStable(timeout = 10000) {
//     const start = Date.now();
//     let lastCount = -1;
//     let stableHits = 0;
//     while (Date.now() - start < timeout) {
//       const nodes = readListNodes();
//       const count = nodes.length;
//       if (count > 0 && count === lastCount) stableHits++;
//       else {
//         stableHits = 1;
//         lastCount = count;
//       }
//       if (count > 0 && stableHits >= stableRequired) {
//         await wait(400);
//         return true;
//       }
//       await wait(stablePollInterval);
//     }
//     return false;
//   }

//   function isButtonEnabled(btn) {
//     if (!btn) return false;
//     if (btn.disabled) return false;
//     const aria = btn.getAttribute?.('aria-disabled');
//     if (aria && aria.toLowerCase() === 'true') return false;
//     const style = window.getComputedStyle(btn);
//     if (!style || style.display === 'none' || style.visibility === 'hidden') return false;
//     const rect = btn.getBoundingClientRect();
//     return rect.width > 0 && rect.height > 0;
//   }

//   function extractEvenIndexedNamesFromDom() {
//     const nodes = readListNodes();
//     const filtered = nodes.filter((_, i) => i % 2 === 0);
//     const names = filtered
//       .map((n) => (n.innerText || n.textContent || '').trim())
//       .filter((t) => t && t.split(/\s+/).length >= 2 && t.length < 140);
//     names.forEach((n) => collected.add(n));
//     return names.length;
//   }

//   async function scrollUntilPaginationAppears(maxScrolls = 25) {
//     for (let i = 0; i < maxScrolls; i++) {
//       const btn = document.querySelector(
//         'div[class*="pagination"] button[aria-label="Next"]'
//       );
//       if (btn) return btn;
//       window.scrollBy(0, window.innerHeight);
//       await wait(600);
//     }
//     return null;
//   }

//   async function waitForPageChange(beforeCount, beforeHref, timeout = 9000) {
//     return new Promise((resolve) => {
//       let resolved = false;
//       const start = Date.now();

//       const listEl = document.querySelector('ul[role="list"]');
//       const observer = listEl
//         ? new MutationObserver(() => {
//             if (!resolved) {
//               resolved = true;
//               observer.disconnect();
//               resolve(true);
//             }
//           })
//         : null;

//       if (observer) observer.observe(listEl, { childList: true, subtree: true });

//       const interval = setInterval(() => {
//         const afterCount = readListNodes().length;
//         if (
//           !resolved &&
//           (afterCount !== beforeCount || location.href !== beforeHref)
//         ) {
//           resolved = true;
//           clearInterval(interval);
//           observer?.disconnect();
//           resolve(true);
//         } else if (Date.now() - start > timeout) {
//           resolved = true;
//           clearInterval(interval);
//           observer?.disconnect();
//           resolve(false);
//         }
//       }, 300);
//     });
//   }

//   async function clickNextButton() {
//     let nextBtn = document.querySelector(
//       'div[class*="pagination"] button[aria-label="Next"]'
//     );

//     // If pagination not loaded yet, scroll until it appears
//     if (!nextBtn) {
//       console.log('🔍 Scrolling to reveal pagination...');
//       nextBtn = await scrollUntilPaginationAppears();
//     }

//     if (!nextBtn) {
//       console.log('[extractMutualsPaginated] ❌ No Next button found after scrolling.');
//       return false;
//     }

//     nextBtn.scrollIntoView({ behavior: 'smooth', block: 'center' });
//     await wait(1000);

//     if (!isButtonEnabled(nextBtn)) {
//       console.log('[extractMutualsPaginated] ⚠️ Next button disabled.');
//       return false;
//     }

//     nextBtn.focus();
//     await wait(200);
//     nextBtn.click();
//     console.log('✅ Next button clicked.');
//     return true;
//   }

//   // ---- MAIN PAGINATION LOOP ----
//   for (let page = 1; page <= maxPages; page++) {
//     console.log(`📄 Extracting page ${page}...`);
//     await waitForListStable(12000);

//     const countBefore = readListNodes().length;
//     const hrefBefore = location.href;

//     extractEvenIndexedNamesFromDom();
//     console.log(`[extractMutualsPaginated] Page ${page}: total so far = ${collected.size}`);

//     const clicked = await clickNextButton();
//     if (!clicked) break;

//     const changed = await waitForPageChange(countBefore, hrefBefore, 10000);
//     if (!changed) {
//       console.warn('[extractMutualsPaginated] ⚠️ Page did not change — stopping pagination.');
//       break;
//     }

//     await wait(perPageDelayMs);
//   }

//   const result = Array.from(collected);
//   console.log(`[extractMutualsPaginated] ✅ Completed. Total mutuals: ${result.length}`);

//   try {
//     chrome.runtime.sendMessage({ type: 'MUTUALS_EXTRACTED', mutuals: result });
//   } catch (e) {
//     console.warn('⚠️ Error sending message', e);
//   }

//   return result;
// }

// async function extractMutualsPaginated(
//   maxPages = 100,
//   perPageDelayMs = 1000,
//   stablePollInterval = 300,
//   stableRequired = 2
// ) {

//   // mark active and record starting href so we can detect navigation away
// if (__WIR_extractionActive) {
//   console.log('[extractMutualsPaginated] another extraction already running — aborting new run.');
//   return []; // avoid overlapping runs
// }
// __WIR_extractionActive = true;
// __WIR_lastExtractionHref = location.href;


//   const collected = new Set();
//   const wait = (ms) => new Promise((res) => setTimeout(res, ms));

//   const readListNodes = () =>
//     Array.from(document.querySelectorAll('ul[role="list"] li span[dir="ltr"] span'));

//   async function waitForListStable(timeout = 10000) {
//     const start = Date.now();
//     let lastCount = -1;
//     let stableHits = 0;
//     while (Date.now() - start < timeout) {
//       const nodes = readListNodes();
//       const count = nodes.length;
//       if (count > 0 && count === lastCount) stableHits++;
//       else {
//         stableHits = 1;
//         lastCount = count;
//       }
//       if (count > 0 && stableHits >= stableRequired) {
//         await wait(400);
//         return true;
//       }
//       await wait(stablePollInterval);
//     }
//     return false;
//   }

//   function isButtonEnabled(btn) {
//     if (!btn) return false;
//     if (btn.disabled) return false;
//     const aria = btn.getAttribute?.('aria-disabled');
//     if (aria && aria.toLowerCase() === 'true') return false;
//     const style = window.getComputedStyle(btn);
//     if (!style || style.display === 'none' || style.visibility === 'hidden') return false;
//     const rect = btn.getBoundingClientRect();
//     return rect.width > 0 && rect.height > 0;
//   }

//   /* --- NEW: ensure first-degree filter is ON, 2nd & 3rd+ are OFF --- */
//   async function ensureFirstDegreeFilter() {
//     try {
//       const btn1 = document.querySelector('button[aria-label="1st"]');
//       const btn2 = document.querySelector('button[aria-label="2nd"]');
//       const btn3 = document.querySelector('button[aria-label="3rd+"]');

//       // helper to safely click a button (scroll, focus, wait, click)
//       async function safeClick(btn) {
//         if (!btn) return false;
//         try {
//           btn.scrollIntoView({ behavior: 'smooth', block: 'center' });
//         } catch (e) {}
//         await wait(200);
//         try { btn.focus(); } catch (e) {}
//         await wait(120);
//         try { btn.click(); return true; } catch (e) { return false; }
//       }

//       // If 2nd or 3rd+ are pressed, turn them off
//       if (btn2) {
//         const v2 = btn2.getAttribute('aria-pressed');
//         if (v2 === 'true' || v2 === '1') {
//           await safeClick(btn2);
//           await wait(600); // let UI update
//         }
//       }
//       if (btn3) {
//         const v3 = btn3.getAttribute('aria-pressed');
//         if (v3 === 'true' || v3 === '1') {
//           await safeClick(btn3);
//           await wait(600);
//         }
//       }

//       // Ensure 1st is ON; if not, click it
//       if (btn1) {
//         const v1 = btn1.getAttribute('aria-pressed');
//         if (!(v1 === 'true' || v1 === '1')) {
//           await safeClick(btn1);
//           await wait(700);
//         }
//       } else {
//         // fallback: sometimes labels differ; try button by text
//         const alt1 = Array.from(document.querySelectorAll('button')).find(b => /1st|1st degree|1st-degree/i.test(b.getAttribute('aria-label') || b.innerText || ''));
//         if (alt1) { await safeClick(alt1); await wait(700); }
//       }

//       // After toggling filters, wait for results to re-render
//       await wait(800);
//       await waitForListStable(8000);
//       return true;
//     } catch (e) {
//       console.warn('[extractMutualsPaginated] ensureFirstDegreeFilter error', e);
//       return false;
//     }
//   }

//   function extractEvenIndexedNamesFromDom() {
//     const nodes = readListNodes();
//     const filtered = nodes.filter((_, i) => i % 2 === 0); // 0,2,4...
//     const names = filtered
//       .map((n) => (n.innerText || n.textContent || '').trim())
//       .filter((t) => t && t.split(/\s+/).length >= 2 && t.length < 140);
//     names.forEach((n) => collected.add(n));
//     return names.length;
//   }

//   async function scrollUntilPaginationAppears(maxScrolls = 5) {
//     for (let i = 0; i < maxScrolls; i++) {
//       const btn = document.querySelector('div[class*="pagination"] button[aria-label="Next"]');
//       if (btn) return btn;
//       window.scrollBy(0, window.innerHeight);
//       await wait(600);
//     }
//     return null;
//   }

//   async function waitForPageChange(beforeCount, beforeHref, timeout = 9000) {
//     return new Promise((resolve) => {
//       let resolved = false;
//       const start = Date.now();
//       const listEl = document.querySelector('ul[role="list"]');
//       const observer = listEl ? new MutationObserver(() => {
//           if (!resolved) { resolved = true; observer.disconnect(); resolve(true); }
//         }) : null;

//       if (observer) observer.observe(listEl, { childList: true, subtree: true });

//       const interval = setInterval(() => {
//         const afterCount = readListNodes().length;
//         if (!resolved && (afterCount !== beforeCount || location.href !== beforeHref)) {
//           resolved = true; clearInterval(interval); observer?.disconnect(); resolve(true);
//         } else if (Date.now() - start > timeout) {
//           resolved = true; clearInterval(interval); observer?.disconnect(); resolve(false);
//         }
//       }, 300);
//     });
//   }

//   async function clickNextButton() {
//     let nextBtn = document.querySelector('div[class*="pagination"] button[aria-label="Next"]');
//     if (!nextBtn) {
//       nextBtn = await scrollUntilPaginationAppears();
//     }
//     if (!nextBtn) {
//       console.log('[extractMutualsPaginated] ❌ No Next button found after scrolling.');
//       return false;
//     }

//     try {
//       nextBtn.scrollIntoView({ behavior: 'smooth', block: 'center' });
//     } catch (e) {}
//     await wait(600);

//     if (!isButtonEnabled(nextBtn)) {
//       console.log('[extractMutualsPaginated] ⚠️ Next button disabled.');
//       return false;
//     }

//     try { nextBtn.focus(); } catch (e) {}
//     await wait(200);
//     try { nextBtn.click(); return true; }
//     catch (e) { console.warn('click Next failed', e); return false; }
//   }

//   // --- ensure we are filtering to 1st-degree only before extracting ---
//   await ensureFirstDegreeFilter();

//   // MAIN loop
//   for (let page = 1; page <= maxPages; page++) {
//     console.log(`📄 Extracting page ${page}...`);
//     await waitForListStable(12000);

//     const countBefore = readListNodes().length;
//     const hrefBefore = location.href;

//     extractEvenIndexedNamesFromDom();
//     console.log(`[extractMutualsPaginated] Page ${page}: total so far = ${collected.size}`);

//     const clicked = await clickNextButton();
//     if (!clicked) break;

//     const changed = await waitForPageChange(countBefore, hrefBefore, 10000);
//     if (!changed) {
//       console.warn('[extractMutualsPaginated] ⚠️ Page did not change — stopping pagination.');
//       break;
//     }

//     await wait(perPageDelayMs);
//   }

// const result = Array.from(collected);
// console.log(`[extractMutualsPaginated] ✅ Completed. Total mutuals: ${result.length}`);

// try { chrome.runtime.sendMessage({ type: 'MUTUALS_EXTRACTED', mutuals: result }); } catch (e) { console.warn('send message failed', e); }

// // clear active flag
// __WIR_extractionActive = false;
// return result;

// }

// Global flag to prevent overlapping runs


// Helper: Sanitize a line of text to remove UI artifacts
function _sanitizeLine(line) {
  if (!line) return '';
  let t = line
    .replace(/\r/g, ' ') // Normalize carriage returns
    .replace(/\s+/g, ' ') // Normalize spaces
    .trim();
  t = t.replace(/•\s*\d+(st|nd|rd|th)?/ig, '').trim(); // Remove • 1st, etc.
  t = t.replace(/\b(1st|2nd|3rd|1st degree|first degree)\b/ig, '').trim(); // Remove degree markers
  t = t.replace(/\b(View|See)\s+.*profile\b/ig, '').trim(); // Remove profile CTAs
  t = t.replace(/^[\s\-\|\:\,\.\(\)]+|[\s\-\|\:\,\.\(\)]+$/g, '').trim(); // Remove leading/trailing punctuation
  return t;
}

// Helper: Determine if a string resembles a name
function _isNameLike(s) {
  if (!s || typeof s !== 'string') return false;
  const t = s.trim();

  // Reject UI/CTA/question markers
  if (/\?/.test(t)) return false;
  if (/\b(are these|results helpful|results|helpful|feedback|show more|see more|are these results|did you find|help us improve)\b/i.test(t)) return false;

  // Reject UI/status or description fragments
  if (/^\s*status\s+is\s+/i.test(t)) return false;
  if (/(provides services|provides|services -|service|web development|software|application development|mobile application|keyboard shortcuts)/i.test(t)) return false;
  if (/(view profile|view|see profile|see|open profile|message|connect|recommended)/i.test(t)) return false;
  if (/https?:\/\//i.test(t) || /www\./i.test(t) || /@[\w.-]+/.test(t)) return false;

  // Require at least two words with letters
  const words = t.split(/\s+/).filter(Boolean);
  const letterWordCount = words.filter(w => /[A-Za-z\u00C0-\u024F\u0400-\u04FF]/.test(w)).length;
  if (letterWordCount < 2) return false;

  // Reject overly long tokens
  if (words.some(w => w.length > 30)) return false;

  // Enforce reasonable length for names
  if (t.length < 3 || t.length > 120) return false;

  return true;
}

// Main function to extract mutuals with pagination
async function extractMutualsPaginated(
  maxPages = 100,
  perPageDelayMs = 1000,
  stablePollInterval = 300,
  stableRequired = 2
) {
  // Prevent overlapping runs
  if (__WIR_extractionActive) {
    console.log('[extractMutualsPaginated] Another extraction already running — aborting.');
    return [];
  }
  __WIR_extractionActive = true;
  __WIR_lastExtractionHref = location.href;

  const collected = new Set();
  const wait = (ms) => new Promise((res) => setTimeout(res, ms));

  // Read list nodes from DOM
  const readListNodes = () =>
    Array.from(document.querySelectorAll('ul[role="list"] li span[dir="ltr"] span'));

  // Wait for list to stabilize
  async function waitForListStable(timeout = 10000) {
    const start = Date.now();
    let lastCount = -1;
    let stableHits = 0;
    while (Date.now() - start < timeout) {
      const nodes = readListNodes();
      const count = nodes.length;
      if (count > 0 && count === lastCount) stableHits++;
      else {
        stableHits = 0;
        lastCount = count;
      }
      if (count > 0 && stableHits >= stableRequired) {
        await wait(400);
        return true;
      }
      await wait(stablePollInterval);
    }
    console.warn('[extractMutualsPaginated] List did not stabilize within timeout.');
    return false;
  }

  // Check if a button is enabled and visible
  function isButtonEnabled(btn) {
    if (!btn) return false;
    if (btn.disabled) return false;
    const aria = btn.getAttribute?.('aria-disabled');
    if (aria && aria.toLowerCase() === 'true') return false;
    const style = window.getComputedStyle(btn);
    if (!style || style.display === 'none' || style.visibility === 'hidden') return false;
    const rect = btn.getBoundingClientRect();
    return rect.width > 0 && rect.height > 0;
  }

  // Ensure first-degree filter is applied
  async function ensureFirstDegreeFilter() {
    try {
      const btn1 = document.querySelector('button[aria-label="1st"]') ||
        Array.from(document.querySelectorAll('button')).find(b => /1st|1st degree|1st-degree/i.test(b.getAttribute('aria-label') || b.innerText || ''));
      const btn2 = document.querySelector('button[aria-label="2nd"]');
      const btn3 = document.querySelector('button[aria-label="3rd+"]');

      async function safeClick(btn) {
        if (!btn) return false;
        try {
          btn.scrollIntoView({ behavior: 'smooth', block: 'center' });
          await wait(200);
          btn.focus();
          await wait(120);
          btn.click();
          return true;
        } catch (e) {
          console.warn('[ensureFirstDegreeFilter] Failed to click button:', e);
          return false;
        }
      }

      // Turn off 2nd and 3rd+ filters if active
      if (btn2 && btn2.getAttribute('aria-pressed') === 'true') {
        await safeClick(btn2);
        await wait(600);
      }
      if (btn3 && btn3.getAttribute('aria-pressed') === 'true') {
        await safeClick(btn3);
        await wait(600);
      }

      // Ensure 1st-degree filter is ON
      if (btn1 && btn1.getAttribute('aria-pressed') !== 'true') {
        await safeClick(btn1);
        await wait(700);
      }

      // Wait for list to stabilize after filter change
      await wait(800);
      return await waitForListStable(8000);
    } catch (e) {
      console.warn('[extractMutualsPaginated] ensureFirstDegreeFilter error:', e);
      return false;
    }
  }

  // Extract even-indexed names from DOM, applying sanitization and validation
  function extractEvenIndexedNamesFromDom() {
    const nodes = readListNodes();
    const filtered = nodes.filter((_, i) => i % 2 === 0); // Even indices
    const names = filtered
      .map((n) => _sanitizeLine(n.innerText || n.textContent || ''))
      .filter((t) => _isNameLike(t));
    names.forEach((n) => collected.add(n));
    return names.length;
  }

  // Scroll until pagination button appears
  async function scrollUntilPaginationAppears(maxScrolls = 5) {
    for (let i = 0; i < maxScrolls; i++) {
      const btn = document.querySelector('div[class*="pagination"] button[aria-label="Next"]');
      if (btn) return btn;
      window.scrollBy(0, window.innerHeight);
      await wait(600);
    }
    return null;
  }

  // Wait for page content to change after clicking Next
  async function waitForPageChange(beforeCount, beforeHref, timeout = 9000) {
    return new Promise((resolve) => {
      let resolved = false;
      const start = Date.now();
      const listEl = document.querySelector('ul[role="list"]');
      const observer = listEl
        ? new MutationObserver(() => {
            if (!resolved) {
              resolved = true;
              observer.disconnect();
              resolve(true);
            }
          })
        : null;

      if (observer) observer.observe(listEl, { childList: true, subtree: true });

      const interval = setInterval(() => {
        const afterCount = readListNodes().length;
        if (!resolved && (afterCount !== beforeCount || location.href !== beforeHref)) {
          resolved = true;
          clearInterval(interval);
          observer?.disconnect();
          resolve(true);
        } else if (Date.now() - start > timeout) {
          resolved = true;
          clearInterval(interval);
          observer?.disconnect();
          resolve(false);
        }
      }, 300);
    });
  }

  // Click the Next button for pagination
  async function clickNextButton() {
    let nextBtn = document.querySelector('div[class*="pagination"] button[aria-label="Next"]');
    if (!nextBtn) {
      nextBtn = await scrollUntilPaginationAppears();
    }
    if (!nextBtn) {
      console.log('[extractMutualsPaginated] No Next button found after scrolling.');
      return false;
    }

    try {
      nextBtn.scrollIntoView({ behavior: 'smooth', block: 'center' });
      await wait(600);
      if (!isButtonEnabled(nextBtn)) {
        console.log('[extractMutualsPaginated] Next button disabled.');
        return false;
      }
      nextBtn.focus();
      await wait(200);
      nextBtn.click();
      return true;
    } catch (e) {
      console.warn('[extractMutualsPaginated] clickNextButton failed:', e);
      return false;
    }
  }

  // Ensure first-degree filter is applied
  if (!(await ensureFirstDegreeFilter())) {
    console.warn('[extractMutualsPaginated] Failed to apply first-degree filter.');
    __WIR_extractionActive = false;
    return [];
  }

  // Main pagination loop
  for (let page = 1; page <= maxPages; page++) {
    console.log(`[extractMutualsPaginated] Extracting page ${page}...`);
    if (!(await waitForListStable(12000))) {
      console.warn('[extractMutualsPaginated] List stabilization failed on page', page);
      break;
    }

    const countBefore = readListNodes().length;
    const hrefBefore = location.href;

    const extractedCount = extractEvenIndexedNamesFromDom();
    console.log(`[extractMutualsPaginated] Page ${page}: extracted ${extractedCount}, total so far = ${collected.size}`);

    const clicked = await clickNextButton();
    if (!clicked) {
      console.log('[extractMutualsPaginated] Stopping: Could not click Next button.');
      break;
    }

    const changed = await waitForPageChange(countBefore, hrefBefore, 10000);
    if (!changed) {
      console.warn('[extractMutualsPaginated] Page did not change — stopping pagination.');
      break;
    }

    await wait(perPageDelayMs);
  }

  // Finalize results
  const result = Array.from(collected);
  console.log(`[extractMutualsPaginated] Completed. Total mutuals: ${result.length}`);

  // Send results to extension (if applicable)
  try {
    chrome.runtime.sendMessage({ type: 'MUTUALS_EXTRACTED', mutuals: result });
  } catch (e) {
    console.warn('[extractMutualsPaginated] Failed to send message:', e);
  }

  // Clear active flag
  __WIR_extractionActive = false;
  return result;
}





/* Message handler:
   - GET_VISIBLE_MUTUALS_STEP1  (profile page) -> { targetName, targetHeadline, mutuals[] } or navigateTo
   - GET_MUTUALS_FROM_SEARCH_PAGE (search page) -> { mutuals[] }
*/
chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
  if (!msg || !msg.type) return;
  (async () => {
    try {
      if (msg.type === 'GET_VISIBLE_MUTUALS_STEP1') {
        // If we're already on a mutuals search page, extract immediately
    if (isMutualsSearchPage()) {
      console.log('GET_VISIBLE_MUTUALS_STEP1: already on mutuals search page, extracting (all pages)...');
      // allow up to many pages (effectively until Next disappears)
      const mutuals = await extractMutualsPaginated(1000, 900);
      console.log('Mutuals extracted (profile-step):', mutuals.length);
      // respond and broadcast final full set
      sendResponse({ targetName: '', targetHeadline: '', mutuals });
      try { chrome.runtime.sendMessage({ type: 'MUTUALS_PAGE_LOADED', mutuals, url: location.href }); } catch(e){ console.warn('send MUTUALS_PAGE_LOADED failed', e); }
      return;
    }


        // Not mutual-search page -> profile logic
        const targetName = extractProfileName() || '';
        const targetHeadline = extractHeadlineOrCompany() || '';
        const visibleMutuals = extractVisibleMutualsFromProfileDOM();
        // if (visibleMutuals && visibleMutuals.length) {
        //   console.log('GET_VISIBLE_MUTUALS_STEP1: found visible mutuals on profile:', visibleMutuals.length);
        //   return sendResponse({ targetName, targetHeadline, mutuals: visibleMutuals });
        // }

        // return shared-connections URL to background so it can navigate
        const sharedHref = findSharedConnectionsHref(2500); // wait up to 2.5s
        console.log('GET_VISIBLE_MUTUALS_STEP1: findSharedConnectionsHref returned:', sharedHref, 'profileHref:', location.href);
        if (!sharedHref) {
          console.warn('[GET_VISIBLE_MUTUALS_STEP1] failed to find shared connections link — DOM candidates were logged by findSharedConnectionsHref above.');
        }

        return sendResponse({ targetName, targetHeadline, navigateTo: sharedHref || null });
      }

      if (msg.type === 'GET_MUTUALS_FROM_SEARCH_PAGE') {
        if (!isMutualsSearchPage()) {
          console.log('GET_MUTUALS_FROM_SEARCH_PAGE: not mutuals page, returning empty');
          return sendResponse({ mutuals: [] });
        }
        console.log('GET_MUTUALS_FROM_SEARCH_PAGE: extracting mutuals from search page...');
        const timeout = msg.timeout || 10000;
        // allow caller to set pickEverySecond; default true
        const pickEverySecond = (typeof msg.pickEverySecond === 'boolean') ? msg.pickEverySecond : true;
        // extract across all pages (cap high)
        const mutuals = await extractMutualsPaginated(1000, 900);
        console.log('GET_MUTUALS_FROM_SEARCH_PAGE: extracted mutuals count=', mutuals.length);
        // return to caller and also broadcast so background/sidepanel update immediately
        try { sendResponse({ mutuals }); } catch(e) { console.warn('sendResponse failed', e); }
        try { chrome.runtime.sendMessage({ type: 'MUTUALS_PAGE_LOADED', mutuals, url: location.href }); } catch(e){ console.warn('send MUTUALS_PAGE_LOADED failed', e); }
        return;

      }

      // unknown message -> ignore
      return;
    } catch (err) {
      console.error('content.js handler error', err);
      return sendResponse({ mutuals: [] });
    }
  })();
  return true; // keep channel open for async sendResponse
});

// OPTIONAL: auto-extract on load if we landed on the mutuals page (helps background if it doesn't wait)
if (isMutualsSearchPage()) {
  (async () => {
    try {
      console.log('Auto-detect mutuals page on load — starting extraction (background may also query)...');
      const mutuals = await extractMutualsPaginated(1000, 900);

      console.log(mutuals)
      console.log('Auto-extraction complete — sending MUTUALS_PAGE_LOADED message, count=', mutuals.length);
      chrome.runtime.sendMessage({ type: 'MUTUALS_PAGE_LOADED', mutuals, url: location.href });
    } catch (e) {
      console.warn('Auto-extraction failed', e);
    }
  })();
}
