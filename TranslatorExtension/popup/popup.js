/**
 * LinguaSub — Popup Settings Logic
 * =============================================================
 * Reads/writes all settings from chrome.storage.local and
 * keeps the popup UI in sync. Changes take effect immediately
 * on the active tab via storage.onChanged in the content script.
 */

(() => {
  'use strict';

  const MIN_FONT = 12;
  const MAX_FONT = 32;
  const FONT_STEP = 2;

  /* ---- DOM references ---- */
  const toggleEl = document.getElementById('ll-toggle');
  const srcLangEl = document.getElementById('ll-src-lang');
  const tgtLangEl = document.getElementById('ll-tgt-lang');
  const swatchContainer = document.getElementById('ll-color-swatches');
  const swatches = swatchContainer.querySelectorAll('.swatch');
  const resetBtn = document.getElementById('ll-reset');
  const fontDecBtn = document.getElementById('ll-font-decrease');
  const fontIncBtn = document.getElementById('ll-font-increase');
  const fontValueEl = document.getElementById('ll-font-value');

  const DEFAULTS = {
    enabled: true,
    srcLang: 'en',
    tgtLang: 'es',
    color: '#38BDF8',
    fontSize: 18,
  };

  let currentFontSize = DEFAULTS.fontSize;

  /* ---- Load saved settings into the UI ---- */

  async function loadSettings() {
    try {
      const result = await chrome.storage.local.get([
        'enabled',
        'srcLang',
        'tgtLang',
        'color',
        'fontSize',
      ]);
      const s = { ...DEFAULTS, ...result };

      toggleEl.checked = s.enabled;
      srcLangEl.value = s.srcLang;
      tgtLangEl.value = s.tgtLang;

      // Activate matching swatch
      swatches.forEach((sw) => {
        sw.classList.toggle('active', sw.dataset.color === s.color);
      });

      // Font size
      currentFontSize = s.fontSize;
      updateFontDisplay();

      updateDisabledState(!s.enabled);
    } catch (_) {
      // Use defaults silently
    }
  }

  /* ---- Persist a single setting key ---- */

  function save(key, value) {
    chrome.storage.local.set({ [key]: value });
  }

  /* ---- Event listeners ---- */

  // Toggle
  toggleEl.addEventListener('change', () => {
    const enabled = toggleEl.checked;
    save('enabled', enabled);
    updateDisabledState(!enabled);
  });

  // Source language
  srcLangEl.addEventListener('change', () => {
    save('srcLang', srcLangEl.value);
  });

  // Target language
  tgtLangEl.addEventListener('change', () => {
    save('tgtLang', tgtLangEl.value);
  });

  // Colour swatches
  swatches.forEach((swatch) => {
    swatch.addEventListener('click', () => {
      swatches.forEach((s) => s.classList.remove('active'));
      swatch.classList.add('active');
      save('color', swatch.dataset.color);
    });
  });

  // Font size decrease
  fontDecBtn.addEventListener('click', () => {
    if (currentFontSize > MIN_FONT) {
      currentFontSize -= FONT_STEP;
      updateFontDisplay();
      save('fontSize', currentFontSize);
    }
  });

  // Font size increase
  fontIncBtn.addEventListener('click', () => {
    if (currentFontSize < MAX_FONT) {
      currentFontSize += FONT_STEP;
      updateFontDisplay();
      save('fontSize', currentFontSize);
    }
  });

  // Reset
  resetBtn.addEventListener('click', () => {
    chrome.storage.local.set(DEFAULTS, () => {
      loadSettings();
    });
  });

  /* ---- Helpers ---- */

  function updateFontDisplay() {
    fontValueEl.textContent = `${currentFontSize}px`;
    // Dim the buttons at min/max
    fontDecBtn.style.opacity = currentFontSize <= MIN_FONT ? '0.3' : '1';
    fontDecBtn.style.pointerEvents = currentFontSize <= MIN_FONT ? 'none' : '';
    fontIncBtn.style.opacity = currentFontSize >= MAX_FONT ? '0.3' : '1';
    fontIncBtn.style.pointerEvents = currentFontSize >= MAX_FONT ? 'none' : '';
  }

  /**
   * Visually dim the settings when the extension is disabled.
   * @param {boolean} disabled
   */
  function updateDisabledState(disabled) {
    const controls = [srcLangEl, tgtLangEl, ...swatches, fontDecBtn, fontIncBtn];
    controls.forEach((el) => {
      el.style.opacity = disabled ? '0.4' : '1';
      el.style.pointerEvents = disabled ? 'none' : '';
    });
    if (disabled) {
      fontValueEl.style.opacity = '0.4';
    } else {
      fontValueEl.style.opacity = '1';
      updateFontDisplay(); // re-apply min/max dimming
    }
  }

  /* ---- Init ---- */
  loadSettings();
})();
