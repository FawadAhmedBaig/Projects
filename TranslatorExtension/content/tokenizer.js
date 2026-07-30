/**
 * LinguaSub — Tokenizer Module
 * =============================================================
 * Splits a subtitle sentence into interactive word-token spans
 * and static punctuation/whitespace nodes.
 *
 * Exports: LLTokenizer.tokenizeSentence(sentence, activeColorHex)
 *          LLTokenizer.updateTokenColors(newColorHex)
 *          LLTokenizer.hexToRgba(hex, alpha)
 */

/* eslint-disable no-unused-vars */
const LLTokenizer = (() => {
  'use strict';

  /**
   * Regex explanation:
   *   Group 1 — word characters: Latin letters (including accented), digits,
   *             with internal apostrophes/hyphens (e.g. "don't", "well-known")
   *   Group 2 — everything else: whitespace, punctuation, symbols
   */
  const TOKEN_REGEX =
    /([a-zA-Z\u00C0-\u024F\u1E00-\u1EFF0-9]+(?:['\u2019-][a-zA-Z\u00C0-\u024F\u1E00-\u1EFF0-9]+)*)|([^a-zA-Z\u00C0-\u024F\u1E00-\u1EFF0-9]+)/g;

  /* ---- Helpers ---- */

  /**
   * Convert a hex color like "#38BDF8" to "rgba(56,189,248,0.2)".
   * @param {string} hex
   * @param {number} alpha
   * @returns {string}
   */
  function hexToRgba(hex, alpha) {
    const h = hex.replace('#', '');
    const r = parseInt(h.substring(0, 2), 16);
    const g = parseInt(h.substring(2, 4), 16);
    const b = parseInt(h.substring(4, 6), 16);
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  }

  /* ---- Event handlers (applied per-token) ---- */

  function onTokenEnter(e) {
    e.target.style.backgroundColor = e.target.dataset.hoverBg;
  }

  function onTokenLeave(e) {
    e.target.style.backgroundColor = 'transparent';
  }

  /* ---- Public API ---- */

  /**
   * Tokenize a subtitle string into a DocumentFragment.
   *
   * Word tokens  → <span class="ll-word-token" data-word="…">
   * Punctuation   → <span class="ll-punctuation">
   *
   * Clicking a word token dispatches a CustomEvent "ll-word-click" on
   * `document` with detail { word, sentenceText, targetEl, rect }.
   *
   * @param {string}  sentence       Raw subtitle text
   * @param {string}  activeColorHex Active theme colour (e.g. "#38BDF8")
   * @returns {DocumentFragment}
   */
  function tokenizeSentence(sentence, activeColorHex) {
    const fragment = document.createDocumentFragment();
    if (!sentence || typeof sentence !== 'string') return fragment;

    const hoverBg = hexToRgba(activeColorHex, 0.2);

    TOKEN_REGEX.lastIndex = 0; // reset global regex state
    let match;

    while ((match = TOKEN_REGEX.exec(sentence)) !== null) {
      const wordPart = match[1];
      const punctPart = match[2];

      if (wordPart) {
        const span = document.createElement('span');
        span.className = 'll-word-token';
        span.textContent = wordPart;
        span.dataset.word = wordPart.toLowerCase();
        span.dataset.hoverBg = hoverBg;
        span.style.color = activeColorHex;

        // Direct event listeners (small token count per subtitle line)
        span.addEventListener('mouseenter', onTokenEnter);
        span.addEventListener('mouseleave', onTokenLeave);
        span.addEventListener('click', (e) => {
          e.stopPropagation();
          document.dispatchEvent(
            new CustomEvent('ll-word-click', {
              detail: {
                word: wordPart,
                sentenceText: sentence,
                targetEl: span,
                rect: span.getBoundingClientRect(),
              },
            })
          );
        });

        fragment.appendChild(span);
      } else if (punctPart) {
        const span = document.createElement('span');
        span.className = 'll-punctuation';
        span.textContent = punctPart;
        span.style.color = activeColorHex;
        fragment.appendChild(span);
      }
    }

    return fragment;
  }

  /**
   * Live-update hover colour on every existing word token in the DOM.
   * Called when the user changes their theme colour.
   * @param {string} newColorHex
   */
  function updateTokenColors(newColorHex) {
    const hoverBg = hexToRgba(newColorHex, 0.2);
    document.querySelectorAll('.ll-word-token').forEach((token) => {
      token.dataset.hoverBg = hoverBg;
      token.style.color = newColorHex;
    });
    document.querySelectorAll('.ll-punctuation').forEach((p) => {
      p.style.color = newColorHex;
    });
  }

  return { tokenizeSentence, updateTokenColors, hexToRgba };
})();
