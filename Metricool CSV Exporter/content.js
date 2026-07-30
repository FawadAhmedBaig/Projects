// content.js
(function () {
  const PANEL_ID = "metricool-export-panel";
  const STYLE_ID = "metricool-export-style";
  const POS_KEY = "metricool_export_panel_pos";
  const MIN_KEY = "metricool_export_panel_min";
  const ENABLE_KEY = "metricool_export_panel_enabled";

  if (window.__metricool_export_inited__) return;
  window.__metricool_export_inited__ = true;

  function ensureStyles() {
    if (document.getElementById(STYLE_ID)) return;
    const css = `
      #${PANEL_ID}{
        position:fixed;right:16px;bottom:16px;z-index:2147483647;
        font-family:ui-sans-serif,system-ui,-apple-system,Segoe UI,Roboto,Helvetica,Arial,"Apple Color Emoji","Segoe UI Emoji";
        color:#0f172a;box-sizing:border-box
      }
      #${PANEL_ID} *{box-sizing:border-box}
      #${PANEL_ID}.dragging{cursor:grabbing;user-select:none}
      #${PANEL_ID} .mc-card{
        width:320px;background:#fff;border:1px solid rgba(15,23,42,.07);
        border-radius:14px;box-shadow:0 10px 30px rgba(2,6,23,.15),0 2px 8px rgba(2,6,23,.08);overflow:hidden
      }
      #${PANEL_ID} .mc-header{
        display:flex;align-items:center;justify-content:space-between;gap:8px;
        padding:10px 12px;background:linear-gradient(180deg,#0ea5e9,#0284c7);
        color:#fff;font-weight:600;letter-spacing:.2px;cursor:grab;user-select:none
      }
      #${PANEL_ID}.dragging .mc-header{cursor:grabbing}
      #${PANEL_ID} .mc-title{display:flex;align-items:center;gap:8px;font-size:14px;line-height:1;white-space:nowrap}
      #${PANEL_ID} .mc-title .mc-dot{width:8px;height:8px;border-radius:999px;background:#a7f3d0;box-shadow:0 0 0 3px rgba(167,243,208,.25)}

      #${PANEL_ID} .mc-actions{display:flex;gap:6px}
      #${PANEL_ID} .mc-btn{
        appearance:none;border:0;background:rgba(255,255,255,.18);color:#fff;
        width:28px;height:28px;border-radius:8px;
        display:flex;align-items:center;justify-content:center; /* perfect centering */
        cursor:pointer;transition:background .18s ease,transform .12s ease;
        font-size:16px;line-height:1;font-weight:700;padding:0
      }
      #${PANEL_ID} .mc-btn:hover{background:rgba(255,255,255,.3)}
      #${PANEL_ID} .mc-btn:active{transform:scale(.97)}

      #${PANEL_ID} .mc-body{padding:12px;display:grid;gap:10px;background:#f8fafc}
      #${PANEL_ID} .mc-field{display:grid;gap:6px}
      #${PANEL_ID} .mc-label{font-size:12px;color:#334155}
      #${PANEL_ID} input[type="date"],#${PANEL_ID} input[type="time"],#${PANEL_ID} input[type="number"]{
        width:100%;padding:8px 10px;border-radius:10px;border:1px solid #e2e8f0;background:#fff;outline:none;font-size:13px
      }
      #${PANEL_ID} input:focus{border-color:#38bdf8;box-shadow:0 0 0 3px rgba(56,189,248,.25)}
      #${PANEL_ID} .mc-row{display:grid;grid-template-columns:1fr 1fr;gap:10px}
      #${PANEL_ID} .mc-primary{
        width:100%;padding:10px 12px;border-radius:10px;border:0;
        background:linear-gradient(180deg,#22c55e,#16a34a);color:#fff;font-weight:600;letter-spacing:.2px;cursor:pointer;
        transition:filter .15s ease,transform .12s ease
      }
      #${PANEL_ID} .mc-primary:hover{filter:brightness(1.03)}
      #${PANEL_ID} .mc-primary:active{transform:translateY(1px)}
      #${PANEL_ID} .mc-msg{margin-top:2px;font-size:12px;color:#0369a1;min-height:16px}
      #${PANEL_ID}.min .mc-body{display:none}
    `;
    const style = document.createElement("style");
    style.id = STYLE_ID;
    style.textContent = css;
    document.documentElement.appendChild(style);
  }

  function getFolderIdFromUrl(href = location.href) {
    const url = new URL(href);
    let m = url.pathname.match(/^\/drive(?:\/u\/\d+)?\/folders\/([A-Za-z0-9_-]+)/);
    if (m) return m[1];
    const id = url.searchParams.get("id");
    if (id) return id;
    m = url.pathname.match(/\/folders\/([A-Za-z0-9_-]+)/);
    if (m) return m[1];
    return null;
  }

  function saveCsvFile(filename, csv) {
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(a.href);
  }

  function clampToViewport(panel) {
    const r = panel.getBoundingClientRect();
    const left = Math.max(0, Math.min(window.innerWidth - r.width, r.left));
    const top  = Math.max(0, Math.min(window.innerHeight - r.height, r.top));
    panel.style.left = left + "px";
    panel.style.top  = top + "px";
  }
  function storePosition(panel) {
    const r = panel.getBoundingClientRect();
    const left = Math.max(0, Math.min(window.innerWidth - r.width, r.left));
    const top  = Math.max(0, Math.min(window.innerHeight - r.height, r.top));
    localStorage.setItem(POS_KEY, JSON.stringify({ left, top }));
  }
  function restorePosition(panel) {
    const stored = localStorage.getItem(POS_KEY);
    if (!stored) {
      panel.style.removeProperty("top");
      panel.style.removeProperty("left");
      panel.style.right = "16px";
      panel.style.bottom = "16px";
      return;
    }
    try {
      const pos = JSON.parse(stored);
      panel.style.right = "auto";
      panel.style.bottom = "auto";
      panel.style.left = pos.left + "px";
      panel.style.top  = pos.top  + "px";
      clampToViewport(panel);
    } catch {
      panel.style.removeProperty("top");
      panel.style.removeProperty("left");
      panel.style.right = "16px";
      panel.style.bottom = "16px";
    }
  }

  function makeDraggable(panel, handle) {
    let startX=0, startY=0, startLeft=0, startTop=0, dragging=false;

    function onPointerDown(e) {
      // 🔒 Do NOT drag if the click was on a button area
      if (e.target.closest(".mc-actions") || e.target.closest(".mc-btn")) return;
      if (e.button !== undefined && e.button !== 0) return;

      dragging = true;
      panel.classList.add("dragging");
      const rect = panel.getBoundingClientRect();
      panel.style.right = "auto";
      panel.style.bottom = "auto";
      startLeft = rect.left;
      startTop  = rect.top;
      startX = e.clientX;
      startY = e.clientY;
      handle.setPointerCapture?.(e.pointerId);
      e.preventDefault();
    }
    function onPointerMove(e) {
      if (!dragging) return;
      const dx = e.clientX - startX;
      const dy = e.clientY - startY;
      panel.style.left = startLeft + dx + "px";
      panel.style.top  = startTop  + dy + "px";
    }
    function onPointerUp(e) {
      if (!dragging) return;
      dragging = false;
      panel.classList.remove("dragging");
      clampToViewport(panel);
      storePosition(panel);
      handle.releasePointerCapture?.(e.pointerId);
    }

    handle.addEventListener("pointerdown", onPointerDown, { passive:false });
    window.addEventListener("pointermove", onPointerMove);
    window.addEventListener("pointerup", onPointerUp);
    window.addEventListener("resize", () => clampToViewport(panel));
  }

  function createPanel() {
    ensureStyles();

    const panel = document.createElement("div");
    panel.id = PANEL_ID;
    panel.innerHTML = `
      <div class="mc-card">
        <div class="mc-header" id="mc-drag-handle" title="Drag to move">
          <div class="mc-title">
            <img src="https://res.cloudinary.com/dnzopenf6/image/upload/v1757334359/uploader_128_xowbug.png" width="32" height="32"/>
            Metricool CSV Exporter
          </div>
          <div class="mc-actions">
            <button class="mc-btn" id="mc-min"   type="button" title="Minimize/Expand" aria-label="Minimize">−</button>
            <button class="mc-btn" id="mc-close" type="button" title="Close"            aria-label="Close">✕</button>
          </div>
        </div>
        <div class="mc-body">
          <div class="mc-field">
            <label class="mc-label" for="mc-date">Start date</label>
            <input id="mc-date" type="date">
          </div>
          <div class="mc-row">
            <div class="mc-field">
              <label class="mc-label" for="mc-time">Start time</label>
              <input id="mc-time" type="time" value="10:00">
            </div>
            <div class="mc-field">
              <label class="mc-label" for="mc-interval">Interval (minutes)</label>
              <input id="mc-interval" type="number" value="60" min="1">
            </div>
          </div>
          <div class="mc-field">
            <label class="mc-label" for="mc-chunk">Max rows per CSV</label>
            <input id="mc-chunk" type="number" value="400" min="1">
          </div>
          <button class="mc-primary" id="mc-export" type="button">Export Shorts → CSV</button>
          <div class="mc-msg" id="mc-msg"></div>
        </div>
      </div>
    `;
    document.body.appendChild(panel);

    // Defaults
    const today = new Date().toISOString().slice(0, 10);
    panel.querySelector("#mc-date").value = today;
    restorePosition(panel);

    // Restore minimized state
    const isMin = localStorage.getItem(MIN_KEY) === "1";
    if (isMin) panel.classList.add("min");

    // Controls (now guaranteed to work because drag ignores actions)
    panel.querySelector("#mc-min").addEventListener("click", (e) => {
      e.stopPropagation();
      e.preventDefault();
      panel.classList.toggle("min");
      localStorage.setItem(MIN_KEY, panel.classList.contains("min") ? "1" : "0");
    });

    panel.querySelector("#mc-close").addEventListener("click", (e) => {
      e.stopPropagation();
      e.preventDefault();
      hidePanel(); // sets enabled=0 and removes node
    });

    makeDraggable(panel, panel.querySelector("#mc-drag-handle"));

    // Export logic
    panel.querySelector("#mc-export").addEventListener("click", async () => {
      const msg = panel.querySelector("#mc-msg");
      msg.textContent = "Generating CSV…";

      const folderId = getFolderIdFromUrl();
      if (!folderId) {
        msg.textContent = "Could not detect Drive folder ID in the URL.";
        return;
      }

      const startDateISO = panel.querySelector("#mc-date").value;
      const startTimeHHmm = panel.querySelector("#mc-time").value || "10:00";
      const intervalMinutes = parseInt(panel.querySelector("#mc-interval").value || "60", 10);
      const chunkSize = Math.max(1, parseInt(panel.querySelector("#mc-chunk").value || "400", 10));

      let resp;
      try {
        resp = await chrome.runtime.sendMessage({
          type: "EXPORT_CSV",
          folderId, startDateISO, startTimeHHmm, intervalMinutes, chunkSize,
        });
      } catch (e) {
        console.error("Export message failed:", e);
        msg.textContent = "Error: failed to contact background service worker.";
        return;
      }

      if (!resp?.ok) {
        console.error("Export error:", resp);
        msg.textContent = "Error: " + (resp?.error || "Unknown");
        return;
      }

      const { files } = resp; // [{name,csv}, ...]
      for (const f of files) saveCsvFile(f.name, f.csv);
      msg.textContent = `Exported ${files.length} CSV file(s).`;
    });

    return panel;
  }

  function showPanel() {
    localStorage.setItem(ENABLE_KEY, "1");
    if (!document.getElementById(PANEL_ID)) createPanel();
  }
  function hidePanel() {
    localStorage.setItem(ENABLE_KEY, "0");
    const el = document.getElementById(PANEL_ID);
    if (el) el.remove();
  }
  function togglePanel() {
    if (document.getElementById(PANEL_ID)) hidePanel();
    else showPanel();
  }

  chrome.runtime.onMessage.addListener((msg) => {
    if (msg?.type === "METRICOOL_TOGGLE_PANEL") togglePanel();
  });

  const enabled = localStorage.getItem(ENABLE_KEY) === "1";
  const observer = new MutationObserver(() => {
    if (localStorage.getItem(ENABLE_KEY) === "1" && !document.getElementById(PANEL_ID)) {
      createPanel();
    }
  });
  observer.observe(document.documentElement, { childList: true, subtree: true });

  if (enabled) createPanel();
})();
