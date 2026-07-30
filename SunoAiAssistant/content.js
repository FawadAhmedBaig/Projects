// content.js
console.log("🎧 Suno Downloader initializing...");


window.addEventListener("message", (event) => {
  if (event.data?.type === "FETCH_SONG_FROM_EXTENSION") {
    const fetchUrl = event.data.url;
    
    chrome.runtime.sendMessage(
      { type: "FETCH_SONG", url: fetchUrl },
      (res) => {
        // Robust handling for undefined response (port closed error)
        let responseToSend = res;
        
        if (!responseToSend) {
            console.error("❌ Message from background worker failed or was undefined:", chrome.runtime.lastError);
            responseToSend = { 
                success: false, 
                error: chrome.runtime.lastError?.message || "Extension communication failed due to disconnection." 
            };
        }
        
        window.postMessage(
          {
            type: "FETCH_SONG_RESULT",
            result: responseToSend,
            originalUrl: fetchUrl,
          },
          "*"
        );
      }
    );
  }
});


function injectScript(file) {
  return new Promise((resolve, reject) => {
    const s = document.createElement("script");
    s.src = chrome.runtime.getURL(file);
    s.onload = () => {
      console.log(`✅ Injected: ${file}`);
      s.remove();
      resolve();
    };
    s.onerror = reject;
    (document.head || document.documentElement).appendChild(s);
  });
}

(async () => {
  try {
    await injectScript("jszip.min.js");
    await injectScript("page-downloader.js");
    console.log("🚀 Downloader fully injected!");

    // Add floating button
    const btn = document.createElement("button");
    btn.textContent = "⬇️ Download All Songs";
    Object.assign(btn.style, {
      position: "fixed",
      bottom: "20px",
      right: "20px",
      zIndex: "9999",
      background: "#0a84ff",
      color: "white",
      border: "none",
      borderRadius: "8px",
      padding: "10px 16px",
      fontWeight: "600",
      cursor: "pointer",
      boxShadow: "0 2px 6px rgba(0,0,0,0.3)"
    });

    btn.onclick = () => {
      console.log("🎵 Download button clicked!");
      window.postMessage({ type: "RUN_SUNO_DOWNLOADER" }, "*");
    };

    document.body.appendChild(btn);
    console.log("✅ Button added successfully!");
  } catch (err) {
    console.error("❌ Injection failed:", err);
  }
})();