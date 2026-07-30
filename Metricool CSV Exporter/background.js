// background.js
const API_BASE = "https://www.googleapis.com/drive/v3";

// Toggle the floating panel when the toolbar icon is clicked
chrome.action.onClicked.addListener((tab) => {
  if (!tab?.id || !tab.url) return;

  // only on Google Drive folder pages
  if (!FOLDER_RE.test(tab.url)) return;

  chrome.tabs.sendMessage(tab.id, { type: "METRICOOL_TOGGLE_PANEL" }, () => {
    if (chrome.runtime.lastError) {
      // swallow "Receiving end does not exist" errors
      console.debug("No content script yet:", chrome.runtime.lastError.message);
    }
  });
});

const FOLDER_RE = /^https:\/\/drive\.google\.com\/drive(?:\/u\/\d+)?\/folders\/[A-Za-z0-9_-]+/;


/* ---------- Auth + Drive helpers ---------- */
async function getTokenInteractive() {
  return new Promise((resolve, reject) => {
    chrome.identity.getAuthToken({ interactive: true }, (token) => {
      const err = chrome.runtime.lastError;
      if (err || !token) return reject(new Error(`Auth token error: ${err?.message || "No token"}`));
      resolve(token);
    });
  });
}

async function gapi(token, path, params = {}) {
  const url = new URL(API_BASE + path);
  for (const [k, v] of Object.entries(params)) {
    if (v !== undefined && v !== null && v !== "") url.searchParams.set(k, v);
  }
  const res = await fetch(url, { headers: { Authorization: `Bearer ${token}` } });
  if (!res.ok) {
    const body = await res.text().catch(() => "");
    let reason = body;
    try { reason = JSON.stringify(JSON.parse(body), null, 2); } catch {}
    throw new Error(`${path} -> HTTP ${res.status}\n${reason}`);
  }
  return res.json();
}

// Public READ permission is enough for Metricool to fetch the file
async function setAnyoneWithLinkReader(token, fileId) {
  try {
    const url = `https://www.googleapis.com/drive/v3/files/${fileId}/permissions`;
    const body = { role: "reader", type: "anyone" };
    const res = await fetch(url, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
      body: JSON.stringify(body)
    });
    if (!res.ok) {
      const t = await res.text().catch(() => "");
      console.warn("permission error", fileId, res.status, t);
    }
  } catch (e) {
    console.warn("permission exception", fileId, e);
  }
}

/* ---------- CSV formatting (Metricool template) ---------- */
function buildDirectMp4Url(fileId, filenameNoExt = "video") {
  // Force URL to end with .mp4 so Metricool accepts it as a video link
  return `https://drive.google.com/uc?export=download&id=${fileId}&filename=${encodeURIComponent(filenameNoExt)}.mp4`;
}
function fmtDate(d) {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${dd}`; // YYYY-MM-DD
}
function fmtTimeHMS(d) {
  const h = String(d.getHours()).padStart(2, "0");
  const m = String(d.getMinutes()).padStart(2, "0");
  const s = "00";
  return `${h}:${m}:${s}`; // HH:MM:SS (24h)
}

// Clean and cap title to avoid Planner’s 100-char rule and illegal chars
function cleanTitle(rawName) {
  const base = (rawName || "video").replace(/\.[^.]+$/, "");
  let t = base
    .replace(/[_-]+/g, " ")
    .replace(/[<>]/g, "")
    .replace(/[\u0000-\u001F\u007F]/g, "") // control chars
    .replace(/[\uD800-\uDFFF]/g, "");      // strip surrogate pairs
  t = t.trim();
  if (!t) t = "Short";
  if (t.length > 95) t = t.slice(0, 95);   // keep margin under 100
  return t;
}

function csv(s = "") {
  return `"${String(s).replace(/"/g, '""')}"`;
}

/* EXACT Metricool template header (as you pasted) */
const HEADER = [
  "Text","Date","Time","Draft","Facebook","Twitter/X","LinkedIn","GBP","Instagram","Pinterest","TikTok","Youtube","Threads","Bluesky",
  "Picture Url 1","Picture Url 2","Picture Url 3","Picture Url 4","Picture Url 5","Picture Url 6","Picture Url 7","Picture Url 8","Picture Url 9","Picture Url 10",
  "Document title","Shortener","Video Thumbnail Url","Video Cover Frame","Twitter/X Can reply","Twitter/X Type","Twitter/X Poll Duration minutes","Twitter/X Poll Option 1","Twitter/X Poll Option 2","Twitter/X Poll Option 3","Twitter/X Poll Option 4",
  "Pinterest Board","Pinterest Pin Title","Pinterest Pin Link","Pinterest Pin New Format",
  "Instagram Post Type","Instagram Show Reel On Feed",
  "Youtube Video Title","Youtube Video Type","Youtube Video Privacy","Youtube video for kids","Youtube Video Category","Youtube Video Tags",
  "GBP Post Type","Facebook Post Type","Facebook Title","First Comment Text",
  "TikTok Title","TikTok disable comments","TikTok disable duet","TikTok disable stitch","TikTok Post Privacy","TikTok Branded Content","TikTok Your Brand","TikTok Auto Add Music","TikTok Photo Cover Index",
  "LinkedIn Type","LinkedIn Poll Question","LinkedIn Poll Option 1","LinkedIn Poll Option 2","LinkedIn Poll Option 3","LinkedIn Poll Option 4","LinkedIn Poll Duration","LinkedIn Show link preview","LinkedIn Images as Carousel","Brand name"
].join(",");

/**
 * Build one row following the template.
 * We only fill the fields required for YouTube Shorts scheduling;
 * everything else is blank or a safe default.
 */
function makeRowForYouTube({ text, date, time, videoUrl, ytTitle }) {
  const cells = [
    // 1-3
    text, date, time,
    // 4 Draft
    "false",
    // 5-13 networks
    "false","false","false","false","false","false","false","true","false","false",
    // 15-24 Picture Url 1..10  (put the .mp4 in Picture Url 1)
    videoUrl,"","","","","","","","","",
    // 25 Document title
    "",
    // 26 Shortener
    "true",
    // 27 Video Thumbnail Url
    "",
    // 28 Video Cover Frame
    "",
    // 29-33 Twitter/X fields
    "","","","","","",
    // 34-37 Pinterest
    "","","","false",
    // 38-39 Instagram
    "","",
    // 40-45 YouTube specifics
    ytTitle, "SHORT", "PUBLIC", "false", "", "",
    // 46-49 GBP/Facebook extras
    "","","","",
    // 50-58 TikTok fields
    "","false","false","false","","false","","false","0",
    // 59-66 LinkedIn poll stuff
    "","","","","","","","false",
    // 67-69 LinkedIn carousel + Brand name
    "false",""
  ];

  // Escape every cell
  return cells.map(csv).join(",");
}

function chunkArray(arr, size) {
  const out = [];
  for (let i = 0; i < arr.length; i += size) out.push(arr.slice(i, i + size));
  return out;
}

/* ---------- Main listener ---------- */
chrome.runtime.onMessage.addListener((msg, _sender, sendResponse) => {
  (async () => {
    if (msg.type !== "EXPORT_CSV") return;

    const { folderId, startDateISO, startTimeHHmm, intervalMinutes, chunkSize } = msg;
    const token = await getTokenInteractive();

    // 1) List videos in folder
    const q = `'${folderId}' in parents and mimeType contains 'video/' and trashed = false`;
    const files = [];
    let pageToken;
    do {
      const resp = await gapi(token, "/files", {
        q,
        fields: "nextPageToken, files(id, name, mimeType, size, createdTime)",
        pageSize: "1000",
        pageToken
      });
      files.push(...(resp.files || []));
      pageToken = resp.nextPageToken;
    } while (pageToken);

    if (!files.length) throw new Error("No videos found in this folder (or you lack permission).");

    // 2) Deterministic order
    files.sort((a, b) => (a.name || "").localeCompare(b.name || ""));

    // 3) Build rows
    const rows = [];
    let t = new Date(`${startDateISO}T${startTimeHHmm || "10:00"}:00`);
    for (const f of files) {
      const ytTitle = cleanTitle(f.name);
      await setAnyoneWithLinkReader(token, f.id); // best-effort

      const url = buildDirectMp4Url(f.id, ytTitle.replace(/\s+/g, "_"));
      const date = fmtDate(t);
      const time = fmtTimeHMS(t);

      // For YouTube we also keep a short generic Text (optional)
      const text = ytTitle;

      rows.push(makeRowForYouTube({ text, date, time, videoUrl: url, ytTitle }));
      t = new Date(t.getTime() + (Number(intervalMinutes) || 60) * 60_000);
    }

    // 4) Chunk + return
    const size = Math.max(1, Number(chunkSize) || 400);
    const chunks = chunkArray(rows, size);
    const filesOut = chunks.map((chunk, i) => ({
      name: `metricool_template_${folderId}_part${i + 1}.csv`,
      csv: [HEADER, ...chunk].join("\r\n")
    }));

    sendResponse({ ok: true, files: filesOut });
  })().catch(err => {
    const msgText = err?.stack || err?.message || String(err);
    console.error("EXPORT_CSV failed:", err);
    sendResponse({ ok: false, error: msgText });
  });
  return true; // async
});

