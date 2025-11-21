const enableExtension = document.getElementById('enableExtension');
const dickbuttMode = document.getElementById('dickbuttMode');

// Restore settings from storage
chrome.storage.local.get(['enableExtension', 'dickbuttMode'], (result) => {
  enableExtension.checked = result.enableExtension !== false;
  dickbuttMode.checked = result.dickbuttMode || false;
});

enableExtension.addEventListener('change', () => {
  const extensionEnabled = enableExtension.checked;

  chrome.storage.local.set({ enableExtension: extensionEnabled }, () => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      const activeTab = tabs[0];
      if (!activeTab?.id) return;

      // Send toggle message to content script
      chrome.tabs.sendMessage(activeTab.id, {
        type: 'toggle-extension',
        enableExtension: extensionEnabled
      }, () => {
        if (chrome.runtime.lastError) {
        console.warn("⚠️ Could not contact content script:", chrome.runtime.lastError.message);
        }
        // ✅ After content script receives the message, reload tab
        chrome.tabs.reload(activeTab.id);
      });
    });

    // Update extension badge
    chrome.runtime.sendMessage({
      type: 'update-badge',
      enableExtension: extensionEnabled
    }, () => {
    if (chrome.runtime.lastError) {
      console.warn("⚠️ Could not contact content script:", chrome.runtime.lastError.message);
    }
  });
  });
});

dickbuttMode.addEventListener('change', () => {
  const modeEnabled = dickbuttMode.checked;

  chrome.storage.local.set({ dickbuttMode: modeEnabled }, () => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      const activeTab = tabs[0];
      if (activeTab?.id) {
        chrome.tabs.reload(activeTab.id); // ✅ Reload tab after dickbutt mode change
      }
    });
  });
});
