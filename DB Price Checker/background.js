chrome.runtime.onStartup.addListener(() => {
  updateBadgeFromStorage();
});

chrome.runtime.onInstalled.addListener(() => {
  // Set enableExtension and dickbuttMode to true by default
  chrome.storage.local.set({ 
    enableExtension: true,
    dickbuttMode: true  // Default ON
  }, () => {
    updateBadge(true); // Set badge to ON (green)
  });
});

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === 'update-badge') {
    const isEnabled = message.enableExtension;
    updateBadge(isEnabled);
  }
});

chrome.storage.onChanged.addListener((changes, area) => {
  if (area === 'local' && changes.enableExtension) {
    const isEnabled = changes.enableExtension.newValue;
    updateBadge(isEnabled);
  }
});

function updateBadgeFromStorage() {
  chrome.storage.local.get('enableExtension', (result) => {
    const isEnabled = result.enableExtension !== false; // default true if undefined
    updateBadge(isEnabled);
  });
}

function updateBadge(isEnabled) {
  const text = isEnabled ? 'ON' : 'OFF';
  const color = isEnabled ? '#00AA00' : '#FF0000'; // Green for ON, Red for OFF
  chrome.action.setBadgeText({ text });
  chrome.action.setBadgeBackgroundColor({ color });
  chrome.action.setBadgeTextColor?.({ color: '#FFFFFF' }); // White text
}
