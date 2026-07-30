/**
 * LinguaSub — Tooltip Module
 * =============================================================
 * Singleton floating dictionary card triggered by clicking a
 * word token in the subtitle overlay.
 *
 * Features:
 *   • Fetches definitions + IPA from dictionaryapi.dev
 *   • Native browser speechSynthesis pronunciation
 *   • Heart toggle to save/unsave words via chrome.storage.local
 *   • Shows the original subtitle sentence as context
 *   • Smart viewport-aware positioning
 *   • Dismisses on click-outside or Escape
 *
 * Exports: LLTooltip.init()
 *          LLTooltip.dismiss()
 */

/* eslint-disable no-unused-vars */
const LLTooltip = (() => {
  'use strict';

  const DICT_API = 'https://api.dictionaryapi.dev/api/v2/entries/en';

  /* ---- SVG Icons ---- */

  const SPEAKER_SVG = [
    '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20"',
    ' viewBox="0 0 24 24" fill="none" stroke="currentColor"',
    ' stroke-width="2" stroke-linecap="round" stroke-linejoin="round">',
    '<polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>',
    '<path d="M19.07 4.93a10 10 0 0 1 0 14.14"></path>',
    '<path d="M15.54 8.46a5 5 0 0 1 0 7.07"></path>',
    '</svg>',
  ].join('');

  const HEART_SVG = [
    '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20"',
    ' viewBox="0 0 24 24" fill="none" stroke="currentColor"',
    ' stroke-width="2" stroke-linecap="round" stroke-linejoin="round">',
    '<path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06',
    'a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78',
    ' 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>',
    '</svg>',
  ].join('');

  /* ---- State ---- */

  /** @type {HTMLElement|null} */
  let tooltipEl = null;
  let currentWord = null;

  /* ---- Lifecycle ---- */

  /** Attach global listeners. Call once on startup. */
  function init() {
    document.addEventListener('ll-word-click', handleWordClick);
    document.addEventListener('click', handleOutsideClick, true);
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') dismiss();
    });
  }

  /* ---- Core click handler ---- */

  /**
   * @param {CustomEvent} e
   * @param {Object}      e.detail
   * @param {string}      e.detail.word
   * @param {string}      e.detail.sentenceText
   * @param {DOMRect}     e.detail.rect
   */
  async function handleWordClick(e) {
    const { word, sentenceText, rect } = e.detail;

    // Toggle off if same word clicked again
    if (currentWord === word.toLowerCase() && tooltipEl) {
      dismiss();
      return;
    }

    dismiss(); // remove any existing tooltip
    currentWord = word.toLowerCase();

    /* ---- Build tooltip shell ---- */
    tooltipEl = document.createElement('div');
    tooltipEl.className = 'll-tooltip-card';

    // — Header —
    const header = document.createElement('div');
    header.className = 'll-tooltip-header';

    const wordEl = document.createElement('span');
    wordEl.className = 'll-tooltip-word';
    wordEl.textContent = word;

    const actions = document.createElement('div');
    actions.className = 'll-tooltip-actions';

    // Speaker button
    const speakerBtn = document.createElement('button');
    speakerBtn.className = 'll-tooltip-btn';
    speakerBtn.innerHTML = SPEAKER_SVG;
    speakerBtn.title = 'Pronounce';
    speakerBtn.addEventListener('click', (ev) => {
      ev.stopPropagation();
      speak(word);
    });

    // Heart button
    const heartBtn = document.createElement('button');
    heartBtn.className = 'll-tooltip-btn';
    heartBtn.innerHTML = HEART_SVG;
    heartBtn.title = 'Save word';
    heartBtn.addEventListener('click', (ev) => {
      ev.stopPropagation();
      toggleSave(word, sentenceText, heartBtn);
    });

    // Pre-check saved state
    applySavedState(word, heartBtn);

    actions.appendChild(speakerBtn);
    actions.appendChild(heartBtn);
    header.appendChild(wordEl);
    header.appendChild(actions);
    tooltipEl.appendChild(header);

    // — Translation row (populated async) —
    const translationEl = document.createElement('div');
    translationEl.className = 'll-tooltip-translation';
    translationEl.textContent = 'Translating…';
    tooltipEl.appendChild(translationEl);

    // — Loading indicator —
    const loadingEl = document.createElement('div');
    loadingEl.className = 'll-tooltip-loading';
    loadingEl.textContent = 'Loading definition…';
    tooltipEl.appendChild(loadingEl);

    // — Context sentence (always at the bottom) —
    const contextEl = document.createElement('div');
    contextEl.className = 'll-tooltip-context';
    contextEl.textContent = `"${sentenceText}"`;
    tooltipEl.appendChild(contextEl);

    /* ---- Append (invisible), measure, position, reveal ---- */
    tooltipEl.style.visibility = 'hidden';
    document.body.appendChild(tooltipEl);
    positionTooltip(rect);
    tooltipEl.style.visibility = 'visible';

    /* ---- Async: definition + translation in parallel ---- */
    let tgtLang = 'es';
    let srcLang = 'en';
    try {
      const langSettings = await chrome.storage.local.get(['srcLang', 'tgtLang']);
      if (langSettings.tgtLang) tgtLang = langSettings.tgtLang;
      if (langSettings.srcLang) srcLang = langSettings.srcLang;
    } catch (_) { /* use defaults */ }

    // Fire both requests in parallel
    const [data, translatedWord] = await Promise.all([
      fetchDefinition(word).catch(() => null),
      LLTranslator.translateText(word, srcLang, tgtLang).catch(() => word),
    ]);

    if (!tooltipEl) return; // dismissed while fetching

    // — Populate translation row —
    if (translatedWord && translatedWord.toLowerCase() !== word.toLowerCase()) {
      translationEl.textContent = translatedWord;
    } else {
      translationEl.textContent = translatedWord || word;
    }

    // — Populate definition —
    // Remove loading indicator
    if (loadingEl.parentElement) loadingEl.remove();

    if (data) {
      // Insert phonetic right after translation row
      if (data.phonetic) {
        const phoneticEl = document.createElement('div');
        phoneticEl.className = 'll-tooltip-phonetic';
        phoneticEl.textContent = data.phonetic;
        translationEl.after(phoneticEl);
      }

      // Definitions block (before context)
      const defsContainer = document.createElement('div');
      defsContainer.className = 'll-tooltip-definitions';

      const meanings = data.meanings.slice(0, 3);
      for (const meaning of meanings) {
        const posEl = document.createElement('div');
        posEl.className = 'll-tooltip-pos';
        posEl.textContent = meaning.partOfSpeech;
        defsContainer.appendChild(posEl);

        const defs = meaning.definitions.slice(0, 2);
        for (const def of defs) {
          const defEl = document.createElement('div');
          defEl.className = 'll-tooltip-def';
          defEl.textContent = def.definition;
          defsContainer.appendChild(defEl);
        }
      }

      // Insert definitions before context
      tooltipEl.insertBefore(defsContainer, contextEl);
    } else {
      const noDefEl = document.createElement('div');
      noDefEl.className = 'll-tooltip-def';
      noDefEl.textContent = 'No definition found.';
      tooltipEl.insertBefore(noDefEl, contextEl);
    }

    // Re-position after content change
    positionTooltip(rect);
  }

  /* ---- Positioning ---- */

  /**
   * Position the tooltip relative to a word token's bounding rect,
   * keeping it fully within the viewport.
   * @param {DOMRect} wordRect
   */
  function positionTooltip(wordRect) {
    if (!tooltipEl) return;

    const MARGIN = 12;
    const vw = window.innerWidth;
    const vh = window.innerHeight;
    const tipRect = tooltipEl.getBoundingClientRect();

    // Prefer above the word
    let top = wordRect.top - tipRect.height - MARGIN;
    if (top < MARGIN) {
      // Fall below
      top = wordRect.bottom + MARGIN;
    }
    // Clamp vertical
    if (top + tipRect.height > vh - MARGIN) {
      top = vh - tipRect.height - MARGIN;
    }
    if (top < MARGIN) top = MARGIN;

    // Centre horizontally on the word
    let left = wordRect.left + wordRect.width / 2 - tipRect.width / 2;
    if (left < MARGIN) left = MARGIN;
    if (left + tipRect.width > vw - MARGIN) {
      left = vw - tipRect.width - MARGIN;
    }

    tooltipEl.style.top = `${top}px`;
    tooltipEl.style.left = `${left}px`;
  }

  /* ---- Dictionary API ---- */

  /**
   * Fetch word data from the Free Dictionary API.
   * @param {string} word
   * @returns {Promise<{phonetic:string, meanings:Array}|null>}
   */
  async function fetchDefinition(word) {
    try {
      const resp = await fetch(
        `${DICT_API}/${encodeURIComponent(word.toLowerCase())}`
      );
      if (!resp.ok) return null;

      const data = await resp.json();
      if (!Array.isArray(data) || data.length === 0) return null;

      const entry = data[0];

      // Resolve phonetic text (multiple sources)
      let phonetic = entry.phonetic || '';
      if (!phonetic && Array.isArray(entry.phonetics)) {
        const found = entry.phonetics.find((p) => p.text);
        if (found) phonetic = found.text;
      }

      return {
        phonetic,
        meanings: entry.meanings || [],
      };
    } catch (err) {
      console.warn('[LinguaSub] Dictionary API error:', err.message);
      return null;
    }
  }

  /* ---- Speech Synthesis ---- */

  /** Pronounce a word using the native Web Speech API. */
  function speak(word) {
    if (!window.speechSynthesis) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(word);
    utterance.lang = 'en-US';
    utterance.rate = 0.9;
    window.speechSynthesis.speak(utterance);
  }

  /* ---- Heart / Save Toggle ---- */

  /**
   * Toggle a word in/out of chrome.storage.local.savedWords.
   * @param {string} word
   * @param {string} sentence
   * @param {HTMLElement} btn
   */
  async function toggleSave(word, sentence, btn) {
    try {
      const result = await chrome.storage.local.get('savedWords');
      const saved = result.savedWords || {};
      const key = word.toLowerCase();

      if (saved[key]) {
        delete saved[key];
        btn.classList.remove('ll-heart-active');
      } else {
        saved[key] = { word, sentence, timestamp: Date.now() };
        btn.classList.add('ll-heart-active');
      }

      await chrome.storage.local.set({ savedWords: saved });
    } catch (err) {
      console.warn('[LinguaSub] Save toggle error:', err.message);
    }
  }

  /** Check storage and apply the "saved" visual state. */
  async function applySavedState(word, btn) {
    try {
      const result = await chrome.storage.local.get('savedWords');
      const saved = result.savedWords || {};
      if (saved[word.toLowerCase()]) {
        btn.classList.add('ll-heart-active');
      }
    } catch (_) {
      /* non-critical */
    }
  }

  /* ---- Dismissal ---- */

  function handleOutsideClick(e) {
    if (
      tooltipEl &&
      !tooltipEl.contains(e.target) &&
      !e.target.classList.contains('ll-word-token')
    ) {
      dismiss();
    }
  }

  /** Remove the tooltip from the DOM. */
  function dismiss() {
    if (tooltipEl && tooltipEl.parentElement) {
      tooltipEl.parentElement.removeChild(tooltipEl);
    }
    tooltipEl = null;
    currentWord = null;
  }

  return { init, dismiss };
})();
