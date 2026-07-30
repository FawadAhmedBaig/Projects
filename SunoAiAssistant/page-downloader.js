// page-downloader.js

// A map to store active promises, keyed by the URL
const fetchPromises = new Map();

// Listener for results coming back from the content script (content.js)
window.addEventListener("message", (event) => {
  if (event.data?.type === "FETCH_SONG_RESULT") {
    const { result, originalUrl } = event.data;
    const resolveFunc = fetchPromises.get(originalUrl);
    if (resolveFunc) {
      // Resolve the promise in the main download loop
      resolveFunc(result);
      fetchPromises.delete(originalUrl); // Clean up the promise resolver
    }
  }
});

// Function to fetch a song by relaying the request to the extension's background worker (sw.js)
function fetchSongThroughExtension(url) {
  return new Promise((resolve) => {
    // Store the resolve function keyed by the URL
    fetchPromises.set(url, resolve);

    // Request the content script to perform the fetch via the extension API
    window.postMessage({ type: "FETCH_SONG_FROM_EXTENSION", url }, "*");
  });
}

// page-downloader.js (Final Attempt to Fix Binary Corruption)

// ... (fetchPromises setup and fetchSongThroughExtension function remain the same) ...

window.addEventListener("message", async (event) => {
  if (event.data?.type !== "RUN_SUNO_DOWNLOADER") return;

  console.log("🎧 Suno Downloader started...");

  if (typeof JSZip === "undefined") {
    alert("JSZip failed to load. Refresh and retry.");
    return;
  }

  const zip = new JSZip();
  const clipEls = document.querySelectorAll('[data-testid="song-row"]'); 
  if (!clipEls.length) return alert("No songs found!");

  for (const el of clipEls) {
    const clipId = el.getAttribute("data-clip-id");
    if (!clipId) continue;
    const nameEl = el.querySelector("div.font-sans");
    const name = (nameEl?.textContent?.trim() || clipId).replace(/[^\w\s-]/g, "_");
    const url = `https://studio-api.prod.suno.com/api/billing/clips/${clipId}/download/`;
    console.log(`🎵 Requesting ${name}...`);

    try {
      const res = await fetchSongThroughExtension(url);

      if (!res.success) throw new Error(res.error);
      
      // ⭐ ULTIMATE FIX: Directly create Uint8Array from the received byte array.
      // JSZip prefers receiving a Uint8Array for binary files.
      const byteArray = new Uint8Array([...res.buffer]); 
      
      // Use the raw Uint8Array for the zip file entry. 
      // This is the most direct way to pass binary data to JSZip.
      zip.file(`${name}.mp3`, byteArray, { binary: true });
      
      console.log(`✅ Added ${name}`);
    } catch (err) {
      console.error(`❌ Failed to fetch ${name}:`, err);
    }
  }

  console.log("🧩 Creating ZIP...");
  const zipBlob = await zip.generateAsync({ type: "blob" });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(zipBlob);
  a.download = "suno_playlist.zip";
  a.click();
  console.log("✅ Done!");
});