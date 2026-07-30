/**
 * LinguaSub — Background Service Worker
 * Sets default storage values on install and relays messages.
 */

const DEFAULT_SETTINGS = {
  enabled: true,
  srcLang: 'en',
  tgtLang: 'es',
  color: '#38BDF8',
  fontSize: 18,
  savedWords: {}
};

chrome.runtime.onInstalled.addListener((details) => {
  if (details.reason === 'install') {
    chrome.storage.local.set(DEFAULT_SETTINGS);
    console.log('[LinguaSub] Extension installed — defaults written.');
  }
});

// Relay settings requests from popup or content scripts
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === 'GET_SETTINGS') {
    chrome.storage.local.get(
      ['enabled', 'srcLang', 'tgtLang', 'color'],
      (result) => sendResponse({ ...DEFAULT_SETTINGS, ...result })
    );
    return true; // keep channel open for async sendResponse
  }

  if (message.type === 'RESET_SETTINGS') {
    chrome.storage.local.set(DEFAULT_SETTINGS, () => {
      sendResponse({ success: true });
    });
    return true;
  }
});
