/**
 * LinguaSub — Main Entry Point
 * =============================================================
 * Detects the current site (YouTube or Netflix), loads user
 * settings from chrome.storage.local, and bootstraps the
 * appropriate subtitle observer + overlay + tooltip pipeline.
 *
 * Also listens for live settings changes from the popup.
 */

(() => {
  'use strict';

  const DEFAULT_SETTINGS = {
    enabled: true,
    srcLang: 'en',
    tgtLang: 'es',
    color: '#38BDF8',
    fontSize: 18,
  };

  /* ---- Site detection ---- */
  const hostname = window.location.hostname;
  const isYouTube = hostname.includes('youtube.com');
  const isNetflix = hostname.includes('netflix.com');

  // Bail immediately if we're not on a supported site
  if (!isYouTube && !isNetflix) return;

  console.log('[LinguaSub] Content script loaded on', hostname);

  /** Current active observer module reference */
  let activeModule = null;

  /* ---- Bootstrap ---- */

  async function bootstrap() {
    // Load persisted settings
    let settings;
    try {
      const stored = await chrome.storage.local.get([
        'enabled',
        'srcLang',
        'tgtLang',
        'color',
        'fontSize',
      ]);
      settings = { ...DEFAULT_SETTINGS, ...stored };
    } catch (_) {
      settings = { ...DEFAULT_SETTINGS };
    }

    // Respect the enabled toggle
    if (!settings.enabled) return;

    console.log(
      `[LinguaSub] Initialising on ${isYouTube ? 'YouTube' : 'Netflix'} ` +
        `(${settings.srcLang} → ${settings.tgtLang})`
    );

    // Start the tooltip manager (shared across platforms)
    LLTooltip.init();

    // Start the platform-specific observer
    if (isYouTube) {
      activeModule = LLYouTubeObserver;
      LLYouTubeObserver.init(settings);
    } else if (isNetflix) {
      activeModule = LLNetflixInterceptor;
      LLNetflixInterceptor.init(settings);
    }
  }

  /* ---- Live settings listener ---- */

  chrome.storage.onChanged.addListener((changes, area) => {
    if (area !== 'local') return;

    const patch = {};
    for (const [key, { newValue }] of Object.entries(changes)) {
      patch[key] = newValue;
    }

    // Handle enable/disable toggle
    if (patch.enabled === false) {
      if (activeModule) {
        activeModule.cleanup();
        activeModule = null;
      }
      LLTooltip.dismiss();
      console.log('[LinguaSub] Disabled by user.');
      return;
    }

    // If re-enabled, re-bootstrap
    if (patch.enabled === true && !activeModule) {
      bootstrap();
      return;
    }

    // Forward partial settings updates to the active module
    if (activeModule) {
      activeModule.updateSettings(patch);
    }
  });

  /* ---- Go ---- */
  bootstrap();
})();
