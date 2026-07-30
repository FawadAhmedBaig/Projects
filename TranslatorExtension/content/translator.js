/**
 * LinguaSub — Translator Module
 * =============================================================
 * Async wrapper around the free Google Translate endpoint with
 * an in-memory LRU cache (max 200 entries).
 *
 * Exports: LLTranslator.translateText(text, srcLang, tgtLang)
 *          LLTranslator.clearCache()
 */

/* eslint-disable no-unused-vars */
const LLTranslator = (() => {
  'use strict';

  const API_BASE = 'https://translate.googleapis.com/translate_a/single';
  const CACHE_MAX = 200;

  /** @type {Map<string, string>} */
  const cache = new Map();

  /**
   * Translate a text string.
   *
   * @param {string} text    Source text
   * @param {string} srcLang Source language code (e.g. "en")
   * @param {string} tgtLang Target language code (e.g. "es")
   * @returns {Promise<string>} Translated text (or original on failure)
   */
  async function translateText(text, srcLang = 'en', tgtLang = 'es') {
    const trimmed = (text || '').trim();
    if (!trimmed) return '';

    /* --- LRU cache lookup --- */
    const cacheKey = `${srcLang}|${tgtLang}|${trimmed}`;
    if (cache.has(cacheKey)) {
      // Promote to most-recent (delete + re-insert)
      const cached = cache.get(cacheKey);
      cache.delete(cacheKey);
      cache.set(cacheKey, cached);
      return cached;
    }

    /* --- Fetch from Google Translate --- */
    try {
      const url =
        `${API_BASE}?client=gtx` +
        `&sl=${encodeURIComponent(srcLang)}` +
        `&tl=${encodeURIComponent(tgtLang)}` +
        `&dt=t` +
        `&q=${encodeURIComponent(trimmed)}`;

      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      const data = await response.json();

      /*
       * Response shape (simplified):
       * [
       *   [ ["translated segment 1", "source segment 1", ...],
       *     ["translated segment 2", "source segment 2", ...] ],
       *   null,
       *   "en",   // detected source language
       *   ...
       * ]
       */
      let translated = '';
      if (data && Array.isArray(data[0])) {
        for (const segment of data[0]) {
          if (Array.isArray(segment) && segment[0]) {
            translated += segment[0];
          }
        }
      }

      if (!translated) return trimmed; // fallback

      /* --- Store in cache (evict oldest if over capacity) --- */
      if (cache.size >= CACHE_MAX) {
        const oldest = cache.keys().next().value;
        cache.delete(oldest);
      }
      cache.set(cacheKey, translated);

      return translated;
    } catch (err) {
      console.warn('[LinguaSub] Translation failed:', err.message);
      return trimmed; // graceful fallback
    }
  }

  /** Flush the entire translation cache. */
  function clearCache() {
    cache.clear();
  }

  return { translateText, clearCache };
})();
