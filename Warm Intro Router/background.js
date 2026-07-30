const LINKEDIN_ORIGIN = 'https://www.linkedin.com';

/* ------------------------------
   INSTALL & SIDEPANEL SETUP
------------------------------ */
chrome.runtime.onInstalled.addListener(async () => {
  const s = await chrome.storage.local.get(['contacts', 'intros']);
  if (!s.contacts) await chrome.storage.local.set({ contacts: [], intros: [] });
  chrome.sidePanel.setPanelBehavior({ openPanelOnActionClick: true }).catch(console.error);
});

/* ------------------------------
   SIDEPANEL ENABLE LOGIC
------------------------------ */
async function setSidePanelForTab(tabId, enabled) {
  try {
    if (enabled) {
      await chrome.sidePanel.setOptions({ tabId, path: 'sidepanel.html', enabled: true });
    } else {
      await chrome.sidePanel.setOptions({ tabId, enabled: false });
    }
  } catch (err) {
    console.log('sidePanel.setOptions error', err);
  }
}

chrome.tabs.onUpdated.addListener(async (tabId, changeInfo, tab) => {
  if (!tab?.url) return;
  try {
    const url = new URL(tab.url);
    const enabled = (url.origin === LINKEDIN_ORIGIN);
    await setSidePanelForTab(tabId, enabled);
  } catch {}
});

chrome.tabs.onActivated.addListener(async (info) => {
  try {
    const tab = await chrome.tabs.get(info.tabId);
    if (!tab || !tab.url) return;
    const url = new URL(tab.url);
    const enabled = (url.origin === LINKEDIN_ORIGIN);
    await setSidePanelForTab(tab.id, enabled);
  } catch {}
});

/* ------------------------------
   HELPERS
------------------------------ */
const pendingNav = new Map(); // tabId → true (when navigation from profile → mutuals)

function timeoutPromise(promise, ms) {
  return Promise.race([
    promise,
    new Promise(res => setTimeout(() => res(null), ms))
  ]);
}

function isMutualsSearchUrl(urlStr) {
  try {
    const url = new URL(urlStr);
    if (!url.hostname.includes('linkedin.com')) return false;
    return url.pathname.startsWith('/search/results/people/');
  } catch {
    return false;
  }
}

function sendMessageToTab(tabId, message, timeoutMs = 12000) {
  return timeoutPromise(new Promise((resolve) => {
    chrome.tabs.sendMessage(tabId, message, (resp) => resolve(resp || null));
  }), timeoutMs);
}

async function injectContentIfNeeded(tabId, force = false) {
  const ping = await new Promise(resolve => {
    chrome.tabs.sendMessage(tabId, { type: 'PING_FROM_BG' }, (r) => {
      if (chrome.runtime.lastError) return resolve(null);
      resolve(r || null);
    });
  });
  if (ping) return true;
  if (!force) return false;
  try {
    await chrome.scripting.executeScript({ target: { tabId }, files: ['content.js'] });
    await new Promise(r => setTimeout(r, 180));
    return true;
  } catch (e) {
    console.warn('injectContentIfNeeded failed', e);
    return false;
  }
}

/* ------------------------------
   MAIN HANDLER – GET_VISIBLE_MUTUALS
------------------------------ */
chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
  if (!msg || msg.type !== 'GET_VISIBLE_MUTUALS') return;
  (async () => {
    try {
      const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
      if (!tab || !tab.id) return sendResponse({ targetName: '', targetHeadline: '', mutuals: [] });
      const currentUrl = tab.url || '';

      // 🛑 If user manually opens mutuals/connections page, do NOT inject
if (isMutualsSearchUrl(currentUrl) && !pendingNav.has(tab.id)) {
  const ping = await new Promise(resolve => {
    chrome.tabs.sendMessage(tab.id, { type: 'PING_FROM_BG' }, (r) => {
      if (chrome.runtime.lastError) return resolve(null);
      resolve(r || null);
    });
  });

  // if ping missing, attempt to inject the content script rather than skip
  if (!ping) {
    console.log('[background] connections page but content script missing — attempting injection.');
    const injected = await injectContentIfNeeded(tab.id, true);
    if (!injected) {
      console.log('[background] injection failed — returning empty result.');
      return sendResponse({ targetName: '', targetHeadline: '', mutuals: [], note: 'injection_failed' });
    }
  }

  // Ask content script to extract mutuals
  const extractResp = await sendMessageToTab(tab.id, { type: 'GET_MUTUALS_FROM_SEARCH_PAGE', timeout: 120000  }, 120000 );
  const mutuals = extractResp?.mutuals || [];
  chrome.runtime.sendMessage({ type: 'MUTUALS_PAGE_LOADED', mutuals, url: currentUrl });
  return sendResponse({ targetName: '', targetHeadline: '', mutuals });
}


      // Ensure content script available on profile
      await injectContentIfNeeded(tab.id, true);

      const step1 = await sendMessageToTab(tab.id, { type: 'GET_VISIBLE_MUTUALS_STEP1' }, 9000);
      if (!step1) return sendResponse({ targetName: '', targetHeadline: '', mutuals: [] });

      // If we already have mutuals
      if (Array.isArray(step1.mutuals) && step1.mutuals.length > 0) {
        return sendResponse({
          targetName: step1.targetName || '',
          targetHeadline: step1.targetHeadline || '',
          mutuals: step1.mutuals
        });
      }

      // If navigation required → go to shared connections
      if (step1.navigateTo) {
        const targetName = step1.targetName || '';
        const targetHeadline = step1.targetHeadline || '';
        sendResponse({ targetName, targetHeadline, mutuals: [] }); // quick response

        pendingNav.set(tab.id, true);

        (async () => {
          try {
            await chrome.tabs.update(tab.id, { url: step1.navigateTo });

            await new Promise((resolve) => {
              const onUpdated = (updatedTabId, changeInfo) => {
                if (updatedTabId !== tab.id) return;
                if (changeInfo.status === 'complete') {
                  chrome.tabs.onUpdated.removeListener(onUpdated);
                  resolve();
                }
              };
              chrome.tabs.onUpdated.addListener(onUpdated);
            });

            await injectContentIfNeeded(tab.id, true);
            await new Promise(r => setTimeout(r, 300));

            const extractResp = await sendMessageToTab(tab.id, { type: 'GET_MUTUALS_FROM_SEARCH_PAGE', timeout: 30000 }, 30000);
            const mutuals = extractResp?.mutuals || [];
            chrome.runtime.sendMessage({ type: 'MUTUALS_PAGE_LOADED', mutuals, url: step1.navigateTo });
          } catch (err) {
            console.log('Async navigate/extract error', err);
          } finally {
            pendingNav.delete(tab.id);
          }
        })();

        return;
      }

      // fallback
      return sendResponse({
        targetName: step1.targetName || '',
        targetHeadline: step1.targetHeadline || '',
        mutuals: step1.mutuals || []
      });
    } catch (err) {
      console.log('GET_VISIBLE_MUTUALS handler error', err);
      return sendResponse({ targetName: '', targetHeadline: '', mutuals: [] });
    }
  })();
  return true;
});

/* ------------------------------
   ✅ Your Working MUTUALS_PAGE_LOADED Handler
------------------------------ */
// chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
//   if (!msg || msg.type !== 'MUTUALS_PAGE_LOADED') return;

//   (async () => {
//     try {
//       const tabId = sender?.tab?.id;
//       const mutuals = msg.mutuals || [];
//       const url = msg.url || '';

//       console.log(`[background] MUTUALS_PAGE_LOADED from ${url} — ${mutuals.length} names received`);

//       // 1️⃣ Load stored contacts
//       const { contacts = [] } = await chrome.storage.local.get(['contacts']);

//       // 2️⃣ Match contacts vs mutuals
//       const matched = contacts.filter(contact => {
//         const name = (contact.name || '').toLowerCase().trim();
//         return mutuals.some(m => (m || '').toLowerCase().includes(name));
//       });

//       console.log(`[background] ✅ Found ${matched.length} matched connectors`);
//       console.log(matched);

//       // 3️⃣ Simple rank by partial name matches count
//       const ranked = matched.sort((a, b) => {
//         const score = (n) => {
//           const parts = (n.name || '').toLowerCase().split(/\s+/);
//           return mutuals.filter(m => parts.some(p => m.toLowerCase().includes(p))).length;
//         };
//         return score(b) - score(a);
//       });

//       // 4️⃣ Save results
//       await chrome.storage.local.set({ suggestedConnectors: ranked });

//       // 5️⃣ Notify sidepanel
//       chrome.runtime.sendMessage({
//         type: 'UPDATE_SUGGESTED_CONNECTORS',
//         connectors: ranked,
//         totalMutuals: mutuals.length
//       });

//       sendResponse({ ok: true, matched: ranked });
//     } catch (err) {
//       console.log('[background] MUTUALS_PAGE_LOADED handler error', err);
//       sendResponse({ ok: false, matched: [] });
//     }
//   })();

//   return true;
// });

// ---- Robust MUTUALS_PAGE_LOADED handler (replace existing handler) ----
chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
  if (!msg || msg.type !== 'MUTUALS_PAGE_LOADED') return;
  (async () => {
    try {
      const mutualsIncoming = Array.isArray(msg.mutuals) ? msg.mutuals.map(m => (m || '').trim()).filter(Boolean) : [];
      const url = msg.url || (sender?.tab?.url || '');
      console.log('[background] MUTUALS_PAGE_LOADED received from', url, 'incoming count=', mutualsIncoming.length, 'complete=', !!msg.complete);

      // Load stored contacts and previously extracted mutuals mapping
      const s = await chrome.storage.local.get(['contacts','extractedMutualsByUrl']);
      const contacts = s.contacts || [];
      const extractedMap = s.extractedMutualsByUrl || {};

      // Union incoming with previously saved for this url
      const prev = Array.isArray(extractedMap[url]) ? extractedMap[url] : [];
      const unionSet = new Set(prev.concat(mutualsIncoming));
      // Optionally, if content signalled complete, we could mark finished (not needed)
      extractedMap[url] = Array.from(unionSet);

      // persist updated map
      await chrome.storage.local.set({ extractedMutualsByUrl: extractedMap });

      const mutualsAll = extractedMap[url] || [];
      console.log('[background] total mutuals for url (after union) =', mutualsAll.length);

      // 1) matched contacts (case-insensitive substring)
      const lowerContactNames = contacts.map(c => (c.name || '').toLowerCase().trim()).filter(Boolean);
      const matchedContacts = contacts.filter(contact => {
        const name = (contact.name || '').toLowerCase().trim();
        return mutualsAll.some(m => (m || '').toLowerCase().includes(name));
      });

      // 2) compute scoredContacts using your scoring helper (assume available)
      const scoredContacts = matchedContacts.map(c => {
        const score = typeof scoreConnectorForBackground === 'function'
          ? scoreConnectorForBackground(c, mutualsAll, '')
          : ( (c.strength||0) * 10 ); // fallback
        return { ...c, score };
      });

      // 3) build unmatched mutuals (names not in your contacts)
      const lowerContactSet = new Set(lowerContactNames);
      const unmatchedMutuals = mutualsAll.filter(m => {
        const lm = (m || '').toLowerCase().trim();
        return !Array.from(lowerContactSet).some(cn => cn && lm.includes(cn));
      });

      // convert unmatched mutual names into connector-like objects (minimal)
      const baselineScore = 10;
      const mutualConnectorObjs = unmatchedMutuals.map(m => ({
        name: m,
        email: '',
        company: '',
        tags: [],
        strength: 0,
        score: baselineScore,
        source: 'mutual'
      }));

      // 4) merge and sort descending (contacts first, then mutuals)
      const merged = [
        ...scoredContacts.sort((a,b) => (b.score||0) - (a.score||0)).map(x => ({ ...x, source: 'contact' })),
        ...mutualConnectorObjs.sort((a,b) => (b.score||0) - (a.score||0))
      ];

      // 5) persist & notify sidepanel (preserve any other storage keys)
      await chrome.storage.local.set({ suggestedConnectors: merged });
      chrome.runtime.sendMessage({
        type: 'UPDATE_SUGGESTED_CONNECTORS',
        connectors: merged,
        totalMutuals: mutualsAll.length
      });

      console.log('[background] Suggested connectors updated (total connectors =', merged.length, ')');
      if (typeof sendResponse === 'function') sendResponse({ ok: true, mergedCount: merged.length, totalMutuals: mutualsAll.length });
    } catch (err) {
      console.error('[background] MUTUALS_PAGE_LOADED handler error', err);
      if (typeof sendResponse === 'function') sendResponse({ ok: false, error: (err && err.message) || err });
    }
  })();
  return true;
});

