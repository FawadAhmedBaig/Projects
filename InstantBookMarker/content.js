chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.type === "GET_SELECTION") {
    sendResponse({
      text: window.getSelection().toString(),
      url: window.location.href
    });
  }
});