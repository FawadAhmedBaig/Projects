/**
 * Fiverr Brief Proposal Architect Pro — Content Script
 * Securely scrapes project briefs from Fiverr brief/project pages.
 * All DOM reads use textContent for Web Store compliance (no innerHTML extraction).
 */

(function () {
  "use strict";

  /**
   * Safely extract text from a DOM element, returning trimmed string or fallback.
   * @param {Element|null} el
   * @param {string} fallback
   * @returns {string}
   */
  function safeText(el, fallback) {
    if (!el) return fallback;
    return (el.textContent || "").trim() || fallback;
  }

  /**
   * Try multiple selectors in order, return first match.
   * @param {string[]} selectors
   * @returns {Element|null}
   */
  function queryFirst(selectors) {
    for (const sel of selectors) {
      const el = document.querySelector(sel);
      if (el) return el;
    }
    return null;
  }

  /**
   * Try multiple selectors, collect all text from all matches.
   * @param {string[]} selectors
   * @returns {string}
   */
  function queryAllText(selectors) {
    const parts = [];
    for (const sel of selectors) {
      document.querySelectorAll(sel).forEach(function (el) {
        const t = (el.textContent || "").trim();
        if (t) parts.push(t);
      });
    }
    return parts.join(", ");
  }

  /**
   * Determine if a node is a section heading (h2-h6, or bold/strong text).
   * @param {Element} el
   * @returns {boolean}
   */
  function isSectionHeading(el) {
    var tag = el.tagName;
    if (tag === "H2" || tag === "H3" || tag === "H4" || tag === "H5" || tag === "H6") return true;
    if (tag === "STRONG" || tag === "B") return true;
    // Check if element has bold font weight via class or style
    if (el.style && (el.style.fontWeight === "bold" || el.style.fontWeight === "700")) return true;
    return false;
  }

  /**
   * Recursively extract ALL visible text from a container, preserving structure.
   * Walks headings, paragraphs, list items, divs, and spans to build a complete text dump.
   * Skips navigation, buttons, and script/style elements.
   * @param {Element} container
   * @returns {string}
   */
  function deepExtractText(container) {
    if (!container) return "";

    var skipTags = { SCRIPT: 1, STYLE: 1, BUTTON: 1, NAV: 1, HEADER: 1, FOOTER: 1, SVG: 1, IMG: 1, INPUT: 1, SELECT: 1, TEXTAREA: 1 };
    var blockTags = { H1: 1, H2: 1, H3: 1, H4: 1, H5: 1, H6: 1, P: 1, LI: 1, DIV: 1, SECTION: 1, ARTICLE: 1, BLOCKQUOTE: 1, TR: 1, DT: 1, DD: 1 };

    var lines = [];
    var seen = new Set();

    function walk(node) {
      if (!node) return;

      // Skip hidden elements
      if (node.nodeType === 1) {
        var tag = node.tagName;
        if (skipTags[tag]) return;
        // Skip if element is hidden
        if (node.offsetParent === null && tag !== "BODY" && tag !== "HTML") {
          // exception: elements in modals/overlays may have offsetParent null but still visible
          var style = window.getComputedStyle(node);
          if (style.display === "none" || style.visibility === "hidden") return;
        }
      }

      if (node.nodeType === 3) {
        // Text node
        var text = (node.textContent || "").trim();
        if (text.length > 0) {
          // Avoid duplicate text from parent/child overlap
          if (!seen.has(text)) {
            lines.push(text);
            seen.add(text);
          }
        }
        return;
      }

      if (node.nodeType !== 1) return;

      var isBlock = blockTags[node.tagName] || false;

      // For list items, prefix with "- "
      if (node.tagName === "LI") {
        var liText = (node.textContent || "").trim();
        if (liText.length > 2 && !seen.has(liText)) {
          lines.push("- " + liText);
          seen.add(liText);
        }
        return; // Don't recurse into LI children, we got the full text
      }

      // For headings, prefix with newline + heading marker
      if (isSectionHeading(node)) {
        var headText = (node.textContent || "").trim();
        if (headText.length > 1 && !seen.has(headText)) {
          lines.push("\n" + headText);
          seen.add(headText);
        }
        return;
      }

      // For paragraphs, grab full text as one block
      if (node.tagName === "P") {
        var pText = (node.textContent || "").trim();
        if (pText.length > 2 && !seen.has(pText)) {
          lines.push(pText);
          seen.add(pText);
        }
        return;
      }

      // Recurse into children for other elements
      var children = node.childNodes;
      for (var i = 0; i < children.length; i++) {
        walk(children[i]);
      }
    }

    walk(container);
    return lines.join("\n").trim();
  }

  /**
   * Find the brief overview container — the main panel/modal that holds the full brief.
   * Tries multiple strategies: modal/drawer overlays first, then brief-specific containers,
   * then falls back to the largest content section on the page.
   * @returns {Element|null}
   */
  function findBriefContainer() {
    // Strategy 1: Look for the brief overview modal/drawer (the panel shown in screenshot)
    var containerSelectors = [
      "[class*='brief-overview']",
      "[class*='brief_overview']",
      "[class*='briefOverview']",
      "[role='dialog']",
      "[class*='drawer']",
      "[class*='modal'] [class*='content']",
      "[class*='panel'][class*='brief']",
      "[class*='brief-detail']",
      "[class*='brief_detail']",
    ];

    for (var i = 0; i < containerSelectors.length; i++) {
      var candidates = document.querySelectorAll(containerSelectors[i]);
      for (var j = 0; j < candidates.length; j++) {
        var el = candidates[j];
        var text = (el.textContent || "").trim();
        // Must have substantial content (at least 100 chars to be a real brief container)
        if (text.length > 100) return el;
      }
    }

    // Strategy 2: Look for Description tab content
    var descTabSelectors = [
      "[class*='description']",
      "[data-testid='description']",
      "[class*='brief-content']",
      "[class*='brief_content']",
    ];
    for (var k = 0; k < descTabSelectors.length; k++) {
      var descEl = document.querySelector(descTabSelectors[k]);
      if (descEl && (descEl.textContent || "").trim().length > 80) return descEl;
    }

    // Strategy 3: Find the largest text block on the page (likely the brief body)
    var allSections = document.querySelectorAll("main section, main article, main > div, [role='main'] > div");
    var best = null;
    var bestLen = 0;
    allSections.forEach(function (sec) {
      var len = (sec.textContent || "").trim().length;
      if (len > bestLen) {
        bestLen = len;
        best = sec;
      }
    });
    if (best && bestLen > 100) return best;

    // Strategy 4: Last resort — use the body
    return document.body;
  }

  /**
   * Parse the Fiverr brief / project page DOM and return structured data.
   * Captures the COMPLETE description including all sections, scope of work, and bullet points.
   * @returns {Object}
   */
  function parseBriefPage() {
    // --- Project Title ---
    var titleEl = queryFirst([
      "h1.brief-title",
      "h1.text-display-3",
      "h1[class*='title']",
      ".brief-header h1",
      ".project-brief h1",
      "[role='dialog'] h1",
      "[class*='drawer'] h1",
      "h1",
    ]);
    var title = safeText(titleEl, "");

    // --- Full Description: Deep extraction from the brief container ---
    var briefContainer = findBriefContainer();
    var fullDescription = "";

    if (briefContainer) {
      fullDescription = deepExtractText(briefContainer);

      // Remove the title from the description if it appears at the start (avoid duplication)
      if (title && fullDescription.indexOf(title) === 0) {
        fullDescription = fullDescription.substring(title.length).trim();
      }

      // Clean up common noise: remove "Brief overview", "Description", "About the client" tabs, etc.
      var noisePatterns = [
        /^Brief overview\n?/i,
        /^Posted \d+.*?\n/i,
        /^\d+ responses?\n?/i,
        /^Description\s*About the client\n?/i,
        /^Description\n?/i,
      ];
      for (var np = 0; np < noisePatterns.length; np++) {
        fullDescription = fullDescription.replace(noisePatterns[np], "").trim();
      }
    }

    // Fallback: If deep extraction got nothing, try individual selectors
    if (fullDescription.length < 40) {
      var descEl = queryFirst([
        ".brief-description",
        ".brief-details .description",
        "[class*='brief'] [class*='description']",
        ".project-description",
        ".brief-content",
        "[data-testid='description']",
        ".text-body-1",
      ]);
      var fallbackDesc = safeText(descEl, "");

      // Also gather all paragraphs and list items near the description
      if (descEl) {
        var parent = descEl.parentElement || descEl;
        var parts = [];
        parent.querySelectorAll("h2, h3, h4, h5, h6, p, li").forEach(function (el) {
          var t = (el.textContent || "").trim();
          if (t.length > 2) {
            if (el.tagName === "LI") {
              parts.push("- " + t);
            } else if (el.tagName.charAt(0) === "H") {
              parts.push("\n" + t);
            } else {
              parts.push(t);
            }
          }
        });
        if (parts.length > 0) {
          fallbackDesc = parts.join("\n");
        }
      }

      if (fallbackDesc.length > fullDescription.length) {
        fullDescription = fallbackDesc;
      }
    }

    // --- Budget ---
    var budgetEl = queryFirst([
      ".brief-budget",
      "[class*='budget']",
      "[class*='price']",
      "[data-testid='budget']",
      ".budget-range",
    ]);
    var budget = safeText(budgetEl, "Not specified");

    // Also try to extract budget from the scraped text if selector missed it
    if (budget === "Not specified" && fullDescription) {
      var budgetMatch = fullDescription.match(/(?:budget|price|up to)[:\s]*\$[\d,]+(?:\s*[-–]\s*\$[\d,]+)?/i);
      if (budgetMatch) {
        budget = budgetMatch[0].trim();
      }
    }

    // --- Timeline / Deadline ---
    var timelineEl = queryFirst([
      ".brief-deadline",
      "[class*='deadline']",
      "[class*='timeline']",
      "[class*='duration']",
      "[data-testid='deadline']",
      "[class*='delivery']",
    ]);
    var timeline = safeText(timelineEl, "Not specified");

    // --- Category ---
    var categoryEl = queryFirst([
      ".brief-category",
      "[class*='category']",
      "[class*='subcategory']",
      ".breadcrumbs a:last-child",
      "nav[aria-label='breadcrumb'] a:last-child",
    ]);
    var category = safeText(categoryEl, "Not specified");

    // --- Skills / Tags ---
    var skills = queryAllText([
      ".brief-skills .tag",
      "[class*='skill'] .tag",
      "[class*='tag']",
      ".skills-list span",
    ]);

    // --- Project Type tags (e.g. "One-time job", "Ongoing work potential") ---
    var projectTypeRaw = queryAllText([
      "[class*='project-type']",
      "[class*='project_type']",
      "[class*='projectType']",
      "[class*='badge']",
      "[class*='chip']",
    ]);

    // Filter out language names and other noise from project type tags
    var languageNames = [
      "english", "spanish", "french", "german", "arabic", "chinese",
      "portuguese", "italian", "dutch", "russian", "japanese", "korean",
      "hindi", "urdu", "turkish", "polish", "swedish", "norwegian",
      "danish", "finnish", "greek", "hebrew", "thai", "vietnamese",
      "indonesian", "malay", "czech", "romanian", "hungarian", "bengali",
      "simplified", "traditional", "mandarin", "cantonese"
    ];
    var noiseWords = [
      "pro", "new", "hot", "featured", "verified", "top", "rising",
      "online", "offline", "active", "away", "busy"
    ];

    var projectType = projectTypeRaw
      .split(",")
      .map(function (s) { return s.trim(); })
      .filter(function (s) {
        if (!s || s.length < 3) return false;
        var lower = s.toLowerCase();
        // Exclude if it's just a language name
        for (var ln = 0; ln < languageNames.length; ln++) {
          if (lower === languageNames[ln]) return false;
        }
        // Exclude common noise words
        for (var nw = 0; nw < noiseWords.length; nw++) {
          if (lower === noiseWords[nw]) return false;
        }
        return true;
      })
      // De-duplicate
      .filter(function (val, idx, arr) {
        return arr.indexOf(val) === idx;
      })
      .join(", ");

    // --- Attachments count ---
    var attachments = document.querySelectorAll(
      ".brief-attachments .attachment, [class*='attachment'] a, [class*='file'] a"
    ).length;

    // --- Client info ---
    var clientEl = queryFirst([
      ".client-name",
      "[class*='buyer'] [class*='name']",
      ".user-profile-name",
      "[class*='client'] [class*='info']",
    ]);
    var clientName = safeText(clientEl, "");

    // --- Client location ---
    var locationEl = queryFirst([
      "[class*='location']",
      "[class*='country']",
    ]);
    var clientLocation = safeText(locationEl, "");

    return {
      title: title,
      description: fullDescription,
      budget: budget,
      timeline: timeline,
      category: category,
      skills: skills,
      projectType: projectType,
      attachments: attachments,
      clientName: clientName,
      clientLocation: clientLocation,
      pageUrl: window.location.href,
      scrapedAt: new Date().toISOString(),
    };
  }

  /**
   * Listen for messages from the popup or background script.
   */
  chrome.runtime.onMessage.addListener(function (request, _sender, sendResponse) {
    if (request.action === "SCRAPE_BRIEF") {
      try {
        const briefData = parseBriefPage();
        sendResponse({ success: true, data: briefData });
      } catch (err) {
        sendResponse({ success: false, error: err.message });
      }
      return true; // keep channel open for async sendResponse
    }

    if (request.action === "PING") {
      sendResponse({ alive: true, url: window.location.href });
      return true;
    }
  });
})();
