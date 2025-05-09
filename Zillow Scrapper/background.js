chrome.runtime.onInstalled.addListener(function (details) {
    chrome.storage.local.set({ totalWebsiteData: [] });
    chrome.storage.local.set({ status: false });
});