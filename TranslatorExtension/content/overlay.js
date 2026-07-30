/**
 * LinguaSub — Overlay Module
 * =============================================================
 * Creates, manages, and positions a draggable dual-subtitle
 * container overlaid on the active video player.
 *
 * Exports: LLOverlay.create(videoContainer)
 *          LLOverlay.updateSubtitles(original, translated, colorHex)
 *          LLOverlay.show() / .hide() / .destroy()
 *          LLOverlay.setColor(hex)
 *          LLOverlay.getOverlay()
 */

/* eslint-disable no-unused-vars */
const LLOverlay = (() => {
  'use strict';

  /* ---- State ---- */
  let overlayEl = null;
  let originalLineEl = null;
  let translatedLineEl = null;
  let dragHandleEl = null;
  let currentColor = '#38BDF8';
  let currentFontSize = 18;

  // Drag tracking
  let isDragging = false;
  let dragOffsetX = 0;
  let dragOffsetY = 0;

  // Bound listeners (for clean removal)
  const onMouseMove = (e) => {
    if (!isDragging || !overlayEl) return;
    const parentRect = overlayEl.parentElement.getBoundingClientRect();
    overlayEl.style.left = `${e.clientX - parentRect.left - dragOffsetX}px`;
    overlayEl.style.top = `${e.clientY - parentRect.top - dragOffsetY}px`;
    overlayEl.style.bottom = 'auto';
    overlayEl.style.transform = 'none';
  };

  const onMouseUp = () => {
    if (isDragging) {
      isDragging = false;
      if (overlayEl) overlayEl.style.transition = '';
    }
  };

  /* ---- Public API ---- */

  /**
   * Build the overlay DOM and attach it to the given video container.
   * @param {HTMLElement} videoContainer
   * @returns {HTMLElement} The overlay element
   */
  function create(videoContainer) {
    if (overlayEl) destroy();

    overlayEl = document.createElement('div');
    overlayEl.id = 'll-subtitle-overlay';
    overlayEl.classList.add('ll-hidden');

    /* Drag handle */
    dragHandleEl = document.createElement('div');
    dragHandleEl.className = 'll-drag-handle';
    const indicator = document.createElement('span');
    indicator.className = 'll-drag-indicator';
    dragHandleEl.appendChild(indicator);
    overlayEl.appendChild(dragHandleEl);

    /* Original (tokenized) line */
    originalLineEl = document.createElement('div');
    originalLineEl.className = 'll-original-line';
    overlayEl.appendChild(originalLineEl);

    /* Translated line */
    translatedLineEl = document.createElement('div');
    translatedLineEl.className = 'll-translated-line';
    overlayEl.appendChild(translatedLineEl);

    /* Ensure the parent is a positioning context */
    const cs = window.getComputedStyle(videoContainer);
    if (cs.position === 'static') {
      videoContainer.style.position = 'relative';
    }

    videoContainer.appendChild(overlayEl);
    setupDrag();

    return overlayEl;
  }

  /** Wire pointer-drag behaviour on the drag handle. */
  function setupDrag() {
    if (!dragHandleEl) return;

    dragHandleEl.addEventListener('mousedown', (e) => {
      isDragging = true;
      const rect = overlayEl.getBoundingClientRect();
      dragOffsetX = e.clientX - rect.left;
      dragOffsetY = e.clientY - rect.top;
      overlayEl.style.transition = 'none';
      e.preventDefault();
    });

    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
  }

  /**
   * Render a new pair of subtitle lines.
   *
   * @param {string} originalText  Source-language line
   * @param {string} translatedText Target-language line
   * @param {string} [colorHex]     Active theme colour override
   */
  function updateSubtitles(originalText, translatedText, colorHex) {
    if (!overlayEl || !originalLineEl || !translatedLineEl) return;

    currentColor = colorHex || currentColor;

    // Clear previous content
    originalLineEl.textContent = '';
    translatedLineEl.textContent = '';

    if (!originalText || !originalText.trim()) {
      hide();
      return;
    }

    // Apply font sizes
    originalLineEl.style.fontSize = `${currentFontSize}px`;
    translatedLineEl.style.fontSize = `${Math.max(currentFontSize - 3, 10)}px`;

    // Tokenize and inject original line (tokens get text color from tokenizer)
    const fragment = LLTokenizer.tokenizeSentence(originalText, currentColor);
    originalLineEl.appendChild(fragment);

    // Translated line inherits a muted version of the theme color
    translatedLineEl.textContent = translatedText || '';
    translatedLineEl.style.color = LLTokenizer.hexToRgba(currentColor, 0.6);

    show();
  }

  function show() {
    if (overlayEl) overlayEl.classList.remove('ll-hidden');
  }

  function hide() {
    if (overlayEl) overlayEl.classList.add('ll-hidden');
  }

  /** Tear down the overlay and remove global listeners. */
  function destroy() {
    document.removeEventListener('mousemove', onMouseMove);
    document.removeEventListener('mouseup', onMouseUp);

    if (overlayEl && overlayEl.parentElement) {
      overlayEl.parentElement.removeChild(overlayEl);
    }
    overlayEl = null;
    originalLineEl = null;
    translatedLineEl = null;
    dragHandleEl = null;
  }

  /**
   * Live-swap the active theme colour.
   * @param {string} hex
   */
  function setColor(hex) {
    currentColor = hex;
    LLTokenizer.updateTokenColors(hex);
    // Also update translated line color
    if (translatedLineEl) {
      translatedLineEl.style.color = LLTokenizer.hexToRgba(hex, 0.6);
    }
  }

  /**
   * Live-update font size.
   * @param {number} size  Font size in px for the original line
   */
  function setFontSize(size) {
    currentFontSize = size;
    if (originalLineEl) originalLineEl.style.fontSize = `${size}px`;
    if (translatedLineEl) translatedLineEl.style.fontSize = `${Math.max(size - 3, 10)}px`;
  }

  /** @returns {HTMLElement|null} */
  function getOverlay() {
    return overlayEl;
  }

  return { create, updateSubtitles, show, hide, destroy, setColor, setFontSize, getOverlay };
})();
