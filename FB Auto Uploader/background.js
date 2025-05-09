chrome.runtime.onInstalled.addListener(async ()=>{
    chrome.storage.local.set({count: 0});
    chrome.storage.local.set({status: false})
})
