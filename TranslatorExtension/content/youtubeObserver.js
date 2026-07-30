/**
 * LinguaSub — YouTube Observer Module
 * =============================================================
 * Intercepts YouTube's native closed-caption rendering via
 * MutationObserver, suppresses the native UI, translates the
 * text, and pushes dual-language lines into the LLOverlay.
 *
 * Handles YouTube's SPA navigation (yt-navigate-finish) by
 * tearing down and re-attaching observers automatically.
 *
 * Exports: LLYouTubeObserver.init(settings)
 *          LLYouTubeObserver.updateSettings(newSettings)
 *          LLYouTubeObserver.cleanup()
 */

/* eslint-disable no-unused-vars */
const LLYouTubeObserver = (() => {
  'use strict';

  /* ---- State ---- */

  /** @type {MutationObserver|null} */
  let captionObserver = null;
  /** @type {MutationObserver|null} */
  let playerWatcher = null;
  let lastText = '';
  let debounceTimer = null;
  let settings = { srcLang: 'en', tgtLang: 'es', color: '#38BDF8' };
  let isAttached = false;
  let retryCount = 0;
  const MAX_RETRIES = 30; // ~24 seconds of retrying

  /* ---- Public API ---- */

  /**
   * Bootstrap the YouTube observer pipeline.
   * @param {Object} userSettings
   */
  function init(userSettings) {
    settings = { ...settings, ...userSettings };
    retryCount = 0;
    attachObserver();

    // YouTube is a SPA — re-attach on navigation
    document.addEventListener('yt-navigate-finish', onNavigate);
    window.addEventListener('popstate', onNavigate);
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
    // If languages changed, clear the translation cache and re-process
    if (newSettings.srcLang || newSettings.tgtLang) {
      LLTranslator.clearCache();
      lastText = ''; // force re-translation on next caption
    }
  }

  /** Full teardown. */
  function cleanup() {
    if (captionObserver) {
      captionObserver.disconnect();
      captionObserver = null;
    }
    if (playerWatcher) {
      playerWatcher.disconnect();
      playerWatcher = null;
    }
    clearTimeout(debounceTimer);
    lastText = '';
    isAttached = false;
    LLOverlay.destroy();

    document.removeEventListener('yt-navigate-finish', onNavigate);
    window.removeEventListener('popstate', onNavigate);
  }

  /* ---- Internals ---- */

  function onNavigate() {
    console.log('[LinguaSub] YouTube navigation detected — re-attaching…');
    // Tear down existing observers and re-attach after DOM settles
    if (captionObserver) {
      captionObserver.disconnect();
      captionObserver = null;
    }
    if (playerWatcher) {
      playerWatcher.disconnect();
      playerWatcher = null;
    }
    clearTimeout(debounceTimer);
    lastText = '';
    isAttached = false;
    retryCount = 0;
    LLOverlay.destroy();

    // Wait for new player DOM to appear
    setTimeout(attachObserver, 1500);
  }

  /** Retry-loop that waits for the video player to exist in the DOM. */
  function attachObserver() {
    if (isAttached) return;

    const player =
      document.querySelector('#movie_player') ||
      document.querySelector('.html5-video-player');

    if (!player) {
      retryCount++;
      if (retryCount < MAX_RETRIES) {
        console.log(`[LinguaSub] Player not found, retrying… (${retryCount}/${MAX_RETRIES})`);
        setTimeout(attachObserver, 800);
      } else {
        console.warn('[LinguaSub] Player not found after max retries. Is this a video page?');
      }
      return;
    }

    isAttached = true;
    console.log('[LinguaSub] YouTube player found:', player.id || player.className);

    // Suppress native captions via CSS class
    player.classList.add('ll-hide-native-captions');

    // *** CRITICAL: Mount overlay on #movie_player, NOT .html5-video-container ***
    // .html5-video-container has overflow:hidden which clips our overlay
    LLOverlay.create(player);
    console.log('[LinguaSub] Overlay created on player element.');

    // Try to observe the caption container directly
    const captionContainer = player.querySelector(
      '.ytp-caption-window-container'
    );

    if (captionContainer) {
      console.log('[LinguaSub] Caption container found immediately.');
      observeCaptions(captionContainer, player);
    } else {
      console.log('[LinguaSub] Caption container not found yet — watching for it…');
      console.log('[LinguaSub] ⚠ Make sure captions (CC) are turned ON in the YouTube player.');

      // Caption container may not exist yet — watch for it
      playerWatcher = new MutationObserver(() => {
        const cc = player.querySelector('.ytp-caption-window-container');
        if (cc) {
          console.log('[LinguaSub] Caption container appeared!');
          playerWatcher.disconnect();
          playerWatcher = null;
          observeCaptions(cc, player);
        }
      });
      playerWatcher.observe(player, { childList: true, subtree: true });
    }
  }

  /**
   * Attach a MutationObserver on the caption window container.
   * @param {HTMLElement} captionContainer
   * @param {HTMLElement} player
   */
  function observeCaptions(captionContainer, player) {
    if (captionObserver) captionObserver.disconnect();

    captionObserver = new MutationObserver(() => {
      clearTimeout(debounceTimer);
      debounceTimer = setTimeout(() => processCaption(player), 50);
    });

    captionObserver.observe(captionContainer, {
      childList: true,
      subtree: true,
      characterData: true,
    });

    console.log('[LinguaSub] MutationObserver active on caption container.');

    // Process any caption already visible
    processCaption(player);
  }

  /**
   * Extract text from YouTube caption segments, translate, and update overlay.
   * @param {HTMLElement} player
   */
  async function processCaption(player) {
    // Try multiple selectors — YouTube has changed these over time
    let segments = player.querySelectorAll('.ytp-caption-segment');

    // Fallback: try the broader caption window text content
    if (segments.length === 0) {
      segments = player.querySelectorAll('.caption-visual-line');
    }
    if (segments.length === 0) {
      segments = player.querySelectorAll('.captions-text span');
    }

    if (segments.length === 0) {
      LLOverlay.hide();
      lastText = '';
      return;
    }

    // Concatenate all visible segments
    let text = '';
    segments.forEach((seg) => {
      text += seg.textContent;
    });
    text = text.trim();

    if (!text || text === lastText) return;
    lastText = text;

    console.log('[LinguaSub] Caption:', text);

    // Translate and render
    try {
      const translated = await LLTranslator.translateText(
        text,
        settings.srcLang,
        settings.tgtLang
      );
      LLOverlay.updateSubtitles(text, translated, settings.color);
    } catch (err) {
      console.warn('[LinguaSub] Translation pipeline error:', err);
      // Still show original text even if translation fails
      LLOverlay.updateSubtitles(text, text, settings.color);
    }
  }

  return { init, updateSettings, cleanup };
})();
