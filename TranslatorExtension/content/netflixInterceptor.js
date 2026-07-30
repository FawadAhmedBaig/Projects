/**
 * LinguaSub — Netflix Interceptor Module
 * =============================================================
 * Intercepts Netflix's timed-text subtitle rendering via
 * MutationObserver, suppresses the native subtitle layer,
 * translates lines, and pushes them into the LLOverlay.
 *
 * Netflix's player is React-driven and aggressively recycles
 * DOM nodes, so the observer is configured broadly and the
 * subtitle extraction logic tolerates structural variance.
 *
 * Exports: LLNetflixInterceptor.init(settings)
 *          LLNetflixInterceptor.updateSettings(newSettings)
 *          LLNetflixInterceptor.cleanup()
 */

/* eslint-disable no-unused-vars */
const LLNetflixInterceptor = (() => {
  'use strict';

  /* ---- State ---- */

  /** @type {MutationObserver|null} */
  let subtitleObserver = null;
  /** @type {MutationObserver|null} */
  let playerWatcher = null;
  let lastText = '';
  let debounceTimer = null;
  let settings = { srcLang: 'en', tgtLang: 'es', color: '#38BDF8' };
  let isAttached = false;

  /* ---- Selectors (Netflix DOM varies by region / app version) ---- */

  const PLAYER_SELECTORS = [
    '.watch-video--player-view',
    '.NFPlayer',
    '[data-uia="video-canvas"]',
    '.watch-video',
  ];

  const SUBTITLE_SELECTORS = [
    '.player-timedtext-text-container',
    '.player-timedtext',
  ];

  const VIDEO_CONTAINER_SELECTORS = [
    '.VideoContainer',
    '.watch-video--player-view',
    '.NFPlayer',
  ];

  /* ---- Helpers ---- */

  /** Try multiple selectors and return the first match. */
  function queryFirst(selectors, root = document) {
    for (const sel of selectors) {
      const el = root.querySelector(sel);
      if (el) return el;
    }
    return null;
  }

  /* ---- Public API ---- */

  /**
   * Bootstrap the Netflix interceptor pipeline.
   * @param {Object} userSettings
   */
  function init(userSettings) {
    settings = { ...settings, ...userSettings };
    attachObserver();

    // Netflix navigates via pushState — watch for URL changes
    let lastUrl = location.href;
    const urlWatcher = new MutationObserver(() => {
      if (location.href !== lastUrl) {
        lastUrl = location.href;
        onNavigate();
      }
    });
    urlWatcher.observe(document.body, { childList: true, subtree: true });
  }

  /** Live-update language/colour settings. */
  function updateSettings(newSettings) {
    Object.assign(settings, newSettings);
    if (newSettings.color) {
      LLOverlay.setColor(newSettings.color);
    }
    if (newSettings.fontSize) {
      LLOverlay.setFontSize(newSettings.fontSize);
    }
    if (newSettings.srcLang || newSettings.tgtLang) {
      LLTranslator.clearCache();
      lastText = '';
    }
  }

  /** Full teardown. */
  function cleanup() {
    if (subtitleObserver) {
      subtitleObserver.disconnect();
      subtitleObserver = null;
    }
    if (playerWatcher) {
      playerWatcher.disconnect();
      playerWatcher = null;
    }
    clearTimeout(debounceTimer);
    lastText = '';
    isAttached = false;
    LLOverlay.destroy();
  }

  /* ---- Internals ---- */

  function onNavigate() {
    if (subtitleObserver) {
      subtitleObserver.disconnect();
      subtitleObserver = null;
    }
    if (playerWatcher) {
      playerWatcher.disconnect();
      playerWatcher = null;
    }
    clearTimeout(debounceTimer);
    lastText = '';
    isAttached = false;
    LLOverlay.destroy();

    setTimeout(attachObserver, 2000);
  }

  /** Retry-loop waiting for the Netflix player to appear. */
  function attachObserver() {
    if (isAttached) return;

    const player = queryFirst(PLAYER_SELECTORS);
    if (!player) {
      setTimeout(attachObserver, 1200);
      return;
    }

    isAttached = true;

    // Suppress native subtitles via CSS class
    player.classList.add('ll-hide-netflix-subs');

    // Mount overlay directly on the player (avoid nested containers with overflow:hidden)
    LLOverlay.create(player);
    console.log('[LinguaSub] Netflix overlay created on player element.');

    // Watch the player subtree for subtitle text changes
    subtitleObserver = new MutationObserver(() => {
      clearTimeout(debounceTimer);
      debounceTimer = setTimeout(processSubtitle, 60);
    });

    subtitleObserver.observe(player, {
      childList: true,
      subtree: true,
      characterData: true,
    });

    // Initial check
    processSubtitle();
  }

  /** Extract subtitle text, translate, and update overlay. */
  async function processSubtitle() {
    const container = queryFirst(SUBTITLE_SELECTORS);

    if (!container) {
      LLOverlay.hide();
      lastText = '';
      return;
    }

    // Netflix wraps each subtitle line in nested spans
    const spans = container.querySelectorAll('span');
    let text = '';
    spans.forEach((span) => {
      // Filter out empty or purely whitespace spans
      const t = span.textContent.trim();
      if (t) text += (text ? ' ' : '') + t;
    });

    if (!text) {
      LLOverlay.hide();
      lastText = '';
      return;
    }

    if (text === lastText) return;
    lastText = text;

    // Translate and render
    const translated = await LLTranslator.translateText(
      text,
      settings.srcLang,
      settings.tgtLang
    );
    LLOverlay.updateSubtitles(text, translated, settings.color);
  }

  return { init, updateSettings, cleanup };
})();
