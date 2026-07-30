chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: "saveToBookmarker",
    title: "Save to Instant Bookmarker",
    contexts: ["selection"]
  });
});

chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId === "saveToBookmarker") {
    // Save selection temporarily and open the popup/dialog
    chrome.storage.local.set({ lastSelection: info.selectionText, lastUrl: tab.url }, () => {
      chrome.action.openPopup();
    });
  }
});