// sw.js (The Critical Fix: Token Update)

chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
  if (msg.type === "FETCH_SONG") {
    // Immediately invoke an async function and return true to keep the port open
    (async () => {
      try {
        const res = await fetch(msg.url, {
          method: "POST",
          headers: {
            "accept": "*/*",
            // *** 🔑 UPDATE THESE VALUES WITH YOUR LIVE SESSION DATA 🔑 ***
            "authorization": "Bearer eyJhbGciOiJSUzI1NiIsImNhdCI6ImNsX0I3ZDRQRDExMUFBQSIsImtpZCI6Imluc18yT1o2eU1EZzhscWRKRWloMXJvemY4T3ptZG4iLCJ0eXAiOiJKV1QifQ.eyJhdWQiOiJzdW5vLWFwaSIsImF6cCI6Imh0dHBzOi8vc3Vuby5jb20iLCJleHAiOjE3NjI0NDg2MDEsImZ2YSI6WzE5NTMsLTFdLCJodHRwczovL3N1bm8uYWkvY2xhaW1zL2NsZXJrX2lkIjoidXNlcl8zNTM5RkVoNUpqR3M0c2FZRWRtYksyakFlTkEiLCJodHRwczovL3N1bm8uYWkvY2xhaW1zL2VtYWlsIjoiZmF3YWRnYW1lN0BnbWFpbC5jb20iLCJodHRwczovL3N1bm8uYWkvY2xhaW1zL3Bob25lIjpudWxsLCJpYXQiOjE3NjI0NDUwMDEsImlzcyI6Imh0dHBzOi8vY2xlcmsuc3Vuby5jb20iLCJqdGkiOiIwMTcyYzUyMmYxODAyZTViNzg4ZSIsIm5iZiI6MTc2MjQ0NDk5MSwic2lkIjoic2Vzc18zNTM5RkppZnR1TW5CQTlQWXluZkg2cGE3MEoiLCJzdHMiOiJhY3RpdmUiLCJzdWIiOiJ1c2VyXzM1MzlGRWg1SmpHczRzYVlFZG1iSzJqQWVOQSJ9.qRFI72kIrqt29ESghknF00lExZkrm3AEpBXywIMAuPHH97dJuZBSa9W5iZOw_gOJZpea3R-1jh4EsMrmqAngET-UBiflOsEfCUG15Zov7rSspdSBw58rdnGETjTacbMIFBTet1vOy_uTBZ4TPMvsx5wzC-br04Mn_ZLAp5yKXGuxzeUlQMo2xpiRrnc15O0et_X8BID6k5ltR7fE2Dei_A3nz45N3K1twdasDjilO6nVd-g7zgYp3e-Z5a3ukm6i6izkbcAVss8rEJDYQHv6_huKHXEj_-sEtDIf7-_lzr_RHnhJnbyAnEecsg-qil-TF4jVVc2TfmGy72hgeCoJMA",
            "browser-token": "eyJ0aW1lc3RhbXAiOjE3NjI0NDUwNzg1OTV9",
            "device-id": "096deb92-0c42-42c8-8e2b-d2e7707a55b4",
            // *************************************************************
            "referer": "https://suno.com/",
          },
          credentials: "include",
        });

        if (!res.ok) {
          sendResponse({ success: false, error: `HTTP ${res.status}` });
          return;
        }

        const buffer = await res.arrayBuffer();
        
        // ⭐ Stable: Convert ArrayBuffer to Array of Bytes for message passing
        sendResponse({ success: true, buffer: Array.from(new Uint8Array(buffer)) });
        
      } catch (e) {
        console.error("Fetch failed in service worker:", e);
        sendResponse({ success: false, error: e.message || "Unknown Service Worker Fetch Error" });
      }
    })();
    
    return true; 
  }
});