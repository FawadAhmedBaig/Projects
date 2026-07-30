/**
 * Fiverr Brief Proposal Architect Pro — Popup Controller
 *
 * Coordinates: tab navigation, subscription state checks, free-tier enforcement,
 * Fiverr brief scraping, AI proposal generation (OpenAI + Gemini), profile management,
 * settings persistence, history tracking, paywall display, and toast notifications.
 *
 * All DOM manipulation uses textContent for Web Store CSP compliance.
 */

(function () {
  "use strict";

  /* ─────────────────────────────────────────────
     STORAGE KEYS (mirrors background.js)
     ───────────────────────────────────────────── */
  var KEYS = {
    PAID_STATUS: "user_paid_status",
    FREE_COUNT: "freeGenerationsCount",
    RESET_MONTH: "freeGenerationsResetMonth",
    API_PROVIDER: "api_provider",
    API_KEY_OPENAI: "api_key_openai",
    API_KEY_GEMINI: "api_key_gemini",
    USER_PROFILE: "user_profile",
    GENERATION_HISTORY: "generation_history",
    SETTINGS: "extension_settings",
  };

  var FREE_LIMIT = 3;

  /* ─────────────────────────────────────────────
     STATE
     ───────────────────────────────────────────── */
  var state = {
    isPaid: false,
    freeCount: 0,
    scrapedBrief: null,
    isGenerating: false,
    userId: null,
    isSignedIn: false,
  };

  /* ─────────────────────────────────────────────
     DOM REFERENCES
     ───────────────────────────────────────────── */
  var dom = {};

  function cacheDom() {
    // Header
    dom.creditsBadge = document.getElementById("credits-badge");
    dom.creditsText = document.getElementById("credits-text");

    // Tabs
    dom.tabNav = document.getElementById("tab-nav");
    dom.tabBtns = document.querySelectorAll(".tab-btn");
    dom.tabPanels = document.querySelectorAll(".tab-panel");

    // Generate panel
    dom.scrapeDot = document.getElementById("scrape-dot");
    dom.scrapeText = document.getElementById("scrape-text");
    dom.btnScrape = document.getElementById("btn-scrape");
    dom.briefPreview = document.getElementById("brief-preview");
    dom.upgradeBanner = document.getElementById("upgrade-banner");
    dom.btnUpgradeBanner = document.getElementById("btn-upgrade-banner");
    dom.selectProvider = document.getElementById("select-provider");
    dom.selectTone = document.getElementById("select-tone");
    dom.selectLength = document.getElementById("select-length");
    dom.selectTemplate = document.getElementById("select-template");
    dom.inputNotes = document.getElementById("input-custom-notes");
    dom.btnGenerate = document.getElementById("btn-generate");
    dom.btnGenerateText = document.getElementById("btn-generate-text");
    dom.loadingBar = document.getElementById("loading-bar");
    dom.outputCard = document.getElementById("output-card");
    dom.outputIntroConsole = document.getElementById("output-intro-console");
    dom.outputProposalConsole = document.getElementById("output-proposal-console");
    dom.introCharCount = document.getElementById("intro-char-count");
    dom.proposalCharCount = document.getElementById("proposal-char-count");
    dom.btnCopyIntro = document.getElementById("btn-copy-intro");
    dom.btnCopyProposal = document.getElementById("btn-copy-proposal");
    dom.btnCopyAll = document.getElementById("btn-copy-all");
    dom.btnRegenerate = document.getElementById("btn-regenerate");
    dom.historyList = document.getElementById("history-list");

    // Profile panel
    dom.profileName = document.getElementById("profile-name");
    dom.profileTitle = document.getElementById("profile-title");
    dom.profileSkills = document.getElementById("profile-skills");
    dom.profileExperience = document.getElementById("profile-experience");
    dom.btnSaveProfile = document.getElementById("btn-save-profile");

    // Settings panel
    dom.subStatusCard = document.getElementById("sub-status-card");
    dom.subIcon = document.getElementById("sub-icon");
    dom.subPlanName = document.getElementById("sub-plan-name");
    dom.subPlanInfo = document.getElementById("sub-plan-info");
    dom.btnUpgradeSettings = document.getElementById("btn-upgrade-settings");
    dom.btnCancelSub = document.getElementById("btn-cancel-sub");
    dom.inputOpenaiKey = document.getElementById("input-openai-key");
    dom.inputGeminiKey = document.getElementById("input-gemini-key");
    dom.toggleOpenaiKey = document.getElementById("toggle-openai-key");
    dom.toggleGeminiKey = document.getElementById("toggle-gemini-key");
    dom.btnSaveKeys = document.getElementById("btn-save-keys");
    dom.settingsLanguage = document.getElementById("settings-language");
    dom.btnSaveSettings = document.getElementById("btn-save-settings");
    dom.btnDevReset = document.getElementById("btn-dev-reset");
    dom.btnDevActivate = document.getElementById("btn-dev-activate");

    // Paywall
    dom.paywallOverlay = document.getElementById("paywall-overlay");
    dom.paywallClose = document.getElementById("paywall-close");
    dom.btnPaywallUpgrade = document.getElementById("btn-paywall-upgrade");
    dom.btnPaywallDismiss = document.getElementById("btn-paywall-dismiss");

    // Auth
    dom.btnHeaderSignin = document.getElementById("btn-header-signin");
    dom.headerUserBadge = document.getElementById("header-user-badge");
    dom.headerUserEmail = document.getElementById("header-user-email");
    dom.accountSignedIn = document.getElementById("account-signed-in");
    dom.accountSignedOut = document.getElementById("account-signed-out");
    dom.accountEmail = document.getElementById("account-email");
    dom.accountStatus = document.getElementById("account-status");
    dom.btnSyncStatus = document.getElementById("btn-sync-status");
    dom.btnSignOut = document.getElementById("btn-sign-out");
    dom.btnSettingsSignin = document.getElementById("btn-settings-signin");

    // Toast
    dom.toast = document.getElementById("toast");
    dom.toastIcon = document.getElementById("toast-icon");
    dom.toastText = document.getElementById("toast-text");
  }

  /* ─────────────────────────────────────────────
     INITIALIZATION
     ───────────────────────────────────────────── */
  document.addEventListener("DOMContentLoaded", function () {
    cacheDom();
    bindEvents();
    initializeState();
  });

  function initializeState() {
    // Get auth state first
    chrome.runtime.sendMessage(
      { action: "GET_AUTH_STATE" },
      function (authResponse) {
        if (authResponse) {
          state.isSignedIn = authResponse.isSignedIn;
          state.userId = authResponse.userId;
          state.isPaid = authResponse.isPaid;
        }
        updateAuthUI();

        // Then get subscription state
        chrome.runtime.sendMessage(
          { action: "GET_SUBSCRIPTION_STATE" },
          function (response) {
            if (response) {
              state.isPaid = response.paid;
              state.freeCount = response.freeGenerationsCount || 0;
              if (response.userId) {
                state.userId = response.userId;
                state.isSignedIn = true;
              }
            }
            updateUIForSubscription();
            updateAuthUI();
            loadSavedData();
            loadHistory();
          }
        );
      }
    );
  }

  /* ─────────────────────────────────────────────
     EVENT BINDINGS
     ───────────────────────────────────────────── */
  function bindEvents() {
    // Tab navigation
    dom.tabBtns.forEach(function (btn) {
      btn.addEventListener("click", function () {
        switchTab(btn.getAttribute("data-tab"));
      });
    });

    // Scrape
    dom.btnScrape.addEventListener("click", scrapeBrief);

    // Generate
    dom.btnGenerate.addEventListener("click", handleGenerate);
    dom.btnRegenerate.addEventListener("click", handleGenerate);

    // Copy
    dom.btnCopyIntro.addEventListener("click", function () { copySection("intro"); });
    dom.btnCopyProposal.addEventListener("click", function () { copySection("proposal"); });
    dom.btnCopyAll.addEventListener("click", function () { copySection("all"); });

    // Profile
    dom.btnSaveProfile.addEventListener("click", saveProfile);

    // Settings — API keys
    dom.btnSaveKeys.addEventListener("click", saveApiKeys);
    dom.toggleOpenaiKey.addEventListener("click", function () {
      togglePasswordVisibility(dom.inputOpenaiKey);
    });
    dom.toggleGeminiKey.addEventListener("click", function () {
      togglePasswordVisibility(dom.inputGeminiKey);
    });

    // Settings — defaults
    dom.btnSaveSettings.addEventListener("click", saveDefaultSettings);

    // Upgrade buttons
    dom.btnUpgradeBanner.addEventListener("click", showPaywall);
    dom.btnUpgradeSettings.addEventListener("click", showPaywall);
    dom.btnPaywallUpgrade.addEventListener("click", openCheckout);
    dom.btnPaywallDismiss.addEventListener("click", hidePaywall);
    dom.paywallClose.addEventListener("click", hidePaywall);

    // Cancel subscription
    dom.btnCancelSub.addEventListener("click", cancelSubscription);

    // Auth buttons
    dom.btnHeaderSignin.addEventListener("click", handleSignIn);
    dom.btnSettingsSignin.addEventListener("click", handleSignIn);
    dom.btnSignOut.addEventListener("click", handleSignOut);
    dom.btnSyncStatus.addEventListener("click", handleSyncStatus);

    // Dev tools
    dom.btnDevReset.addEventListener("click", devReset);
    dom.btnDevActivate.addEventListener("click", devActivate);

    // Template selection guard for Pro templates
    dom.selectTemplate.addEventListener("change", function () {
      var selectedOption =
        dom.selectTemplate.options[dom.selectTemplate.selectedIndex];
      var isPro = selectedOption.getAttribute("data-pro") === "true";
      if (isPro && !state.isPaid) {
        dom.selectTemplate.value = "general";
        showPaywall();
      }
    });
  }

  /* ─────────────────────────────────────────────
     TAB NAVIGATION
     ───────────────────────────────────────────── */
  function switchTab(tabId) {
    dom.tabBtns.forEach(function (btn) {
      btn.classList.toggle("active", btn.getAttribute("data-tab") === tabId);
    });
    dom.tabPanels.forEach(function (panel) {
      panel.classList.toggle(
        "active",
        panel.id === "panel-" + tabId
      );
    });
  }

  /* ─────────────────────────────────────────────
     SUBSCRIPTION UI UPDATES
     ───────────────────────────────────────────── */
  function updateUIForSubscription() {
    if (state.isPaid) {
      // Pro user
      dom.creditsText.textContent = "∞ Pro";
      dom.creditsBadge.classList.remove("exhausted");
      dom.creditsBadge.classList.add("pro-active");

      dom.upgradeBanner.classList.remove("visible");

      dom.subIcon.textContent = "⭐";
      dom.subIcon.classList.remove("free");
      dom.subIcon.classList.add("pro");
      dom.subPlanName.textContent = "Pro Plan";
      dom.subPlanInfo.textContent = "Unlimited proposals · Priority templates";
      dom.btnUpgradeSettings.classList.add("hidden");
      dom.btnCancelSub.classList.remove("hidden");
    } else {
      // Free user
      var remaining = Math.max(0, FREE_LIMIT - state.freeCount);
      dom.creditsText.textContent = remaining + " / " + FREE_LIMIT + " Free";
      dom.creditsBadge.classList.remove("pro-active");

      if (remaining === 0) {
        dom.creditsBadge.classList.add("exhausted");
        dom.upgradeBanner.classList.add("visible");
      } else {
        dom.creditsBadge.classList.remove("exhausted");
        dom.upgradeBanner.classList.remove("visible");
      }

      dom.subIcon.textContent = "🆓";
      dom.subIcon.classList.remove("pro");
      dom.subIcon.classList.add("free");
      dom.subPlanName.textContent = "Free Plan";
      dom.subPlanInfo.textContent =
        remaining + " of " + FREE_LIMIT + " proposals remaining this month";
      dom.btnUpgradeSettings.classList.remove("hidden");
      dom.btnCancelSub.classList.add("hidden");
    }
  }

  /* ─────────────────────────────────────────────
     PAYWALL
     ───────────────────────────────────────────── */
  function showPaywall() {
    dom.paywallOverlay.classList.add("visible");
  }

  function hidePaywall() {
    dom.paywallOverlay.classList.remove("visible");
  }

  function openCheckout() {
    if (!state.isSignedIn) {
      // Must sign in first
      showToast("Please sign in first to upgrade", "🔑");
      handleSignIn();
      return;
    }
    chrome.runtime.sendMessage({ action: "GET_CHECKOUT_URL" }, function (resp) {
      if (resp && resp.url) {
        // Open Paddle checkout in a new tab
        chrome.tabs.create({ url: resp.url });
      } else if (resp && resp.error) {
        showToast(resp.error, "⚠️");
      }
    });
  }

  function cancelSubscription() {
    chrome.runtime.sendMessage(
      { action: "DEACTIVATE_PREMIUM" },
      function () {
        state.isPaid = false;
        updateUIForSubscription();
        updateAuthUI();
        showToast("Subscription cancelled", "ℹ️");
      }
    );
  }

  /* ─────────────────────────────────────────────
     AUTHENTICATION HANDLERS
     ───────────────────────────────────────────── */
  function handleSignIn() {
    showToast("Signing in...", "🔄");
    chrome.runtime.sendMessage({ action: "SIGN_IN" }, function (resp) {
      if (resp && resp.success) {
        state.isSignedIn = true;
        state.userId = resp.userId;
        updateAuthUI();
        showToast("Signed in as " + resp.userId, "✅");
        // Refresh subscription state after sign-in
        chrome.runtime.sendMessage(
          { action: "GET_SUBSCRIPTION_STATE" },
          function (subResp) {
            if (subResp) {
              state.isPaid = subResp.paid;
              state.freeCount = subResp.freeGenerationsCount || 0;
            }
            updateUIForSubscription();
            updateAuthUI();
          }
        );
      } else {
        var errMsg = (resp && resp.error) ? resp.error : "Sign in failed";
        showToast(errMsg, "❌");
      }
    });
  }

  function handleSignOut() {
    chrome.runtime.sendMessage({ action: "SIGN_OUT" }, function (resp) {
      if (resp && resp.success) {
        state.isSignedIn = false;
        state.userId = null;
        state.isPaid = false;
        updateAuthUI();
        updateUIForSubscription();
        showToast("Signed out", "ℹ️");
      }
    });
  }

  function handleSyncStatus() {
    showToast("Syncing...", "🔄");
    chrome.runtime.sendMessage({ action: "FORCE_SYNC" }, function () {
      // Wait a moment for the background to fetch, then refresh
      setTimeout(function () {
        chrome.runtime.sendMessage(
          { action: "GET_SUBSCRIPTION_STATE" },
          function (resp) {
            if (resp) {
              state.isPaid = resp.paid;
              state.freeCount = resp.freeGenerationsCount || 0;
            }
            updateUIForSubscription();
            updateAuthUI();
            showToast("Status synced", "✅");
          }
        );
      }, 1500);
    });
  }

  function updateAuthUI() {
    if (state.isSignedIn && state.userId) {
      // Header: hide sign-in button, show user badge
      dom.btnHeaderSignin.style.display = "none";
      dom.headerUserBadge.style.display = "inline-flex";
      dom.headerUserEmail.textContent = state.userId;

      // Settings: show signed-in card, hide sign-in prompt
      dom.accountSignedIn.style.display = "block";
      dom.accountSignedOut.style.display = "none";
      dom.accountEmail.textContent = state.userId;

      // Update status badge
      if (state.isPaid) {
        dom.accountStatus.textContent = "Pro";
        dom.accountStatus.className = "account-status pro";
      } else {
        dom.accountStatus.textContent = "Free";
        dom.accountStatus.className = "account-status free";
      }
    } else {
      // Header: show sign-in button, hide user badge
      dom.btnHeaderSignin.style.display = "inline-flex";
      dom.headerUserBadge.style.display = "none";

      // Settings: hide signed-in card, show sign-in prompt
      dom.accountSignedIn.style.display = "none";
      dom.accountSignedOut.style.display = "block";
    }
  }

  /* ─────────────────────────────────────────────
     CAN GENERATE CHECK — Core paywall logic
     ───────────────────────────────────────────── */
  function checkCanGenerate(callback) {
    chrome.runtime.sendMessage(
      { action: "CHECK_FREE_LIMIT" },
      function (response) {
        if (!response) {
          callback(false, "Unable to verify subscription status.");
          return;
        }

        state.isPaid = response.isPaid;
        state.freeCount = response.count;

        if (response.canGenerate) {
          callback(true, null);
        } else {
          // Free limit reached
          updateUIForSubscription();
          showPaywall();
          callback(false, "Free generation limit reached.");
        }
      }
    );
  }

  /* ─────────────────────────────────────────────
     BRIEF SCRAPING
     ───────────────────────────────────────────── */
  function scrapeBrief() {
    dom.scrapeText.textContent = "Scanning Fiverr page...";
    dom.scrapeDot.classList.remove("connected", "error");

    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      if (!tabs || tabs.length === 0) {
        setScrapeError("No active tab found");
        return;
      }

      var tab = tabs[0];

      // Check if we're on a Fiverr page
      if (!tab.url || tab.url.indexOf("fiverr.com") === -1) {
        setScrapeError("Not on a Fiverr page. Navigate to a brief first.");
        return;
      }

      chrome.tabs.sendMessage(
        tab.id,
        { action: "SCRAPE_BRIEF" },
        function (response) {
          if (chrome.runtime.lastError) {
            setScrapeError(
              "Content script not loaded. Try refreshing the Fiverr page."
            );
            return;
          }

          if (response && response.success && response.data) {
            state.scrapedBrief = response.data;
            dom.scrapeDot.classList.add("connected");
            dom.scrapeDot.classList.remove("error");

            var titleText = response.data.title || "Brief detected";
            dom.scrapeText.textContent = "";
            var strong = document.createElement("strong");
            strong.textContent = titleText;
            dom.scrapeText.appendChild(strong);

            displayBriefPreview(response.data);
            showToast("Brief scraped successfully!", "✅");
          } else {
            setScrapeError(
              response && response.error
                ? response.error
                : "No brief data found on this page."
            );
          }
        }
      );
    });
  }

  function setScrapeError(msg) {
    dom.scrapeDot.classList.add("error");
    dom.scrapeDot.classList.remove("connected");
    dom.scrapeText.textContent = msg;
  }

  function displayBriefPreview(data) {
    // Clear and rebuild preview using safe DOM methods
    dom.briefPreview.textContent = "";

    var fields = [
      { label: "Title", value: data.title },
      { label: "Description", value: data.description },
      { label: "Budget", value: data.budget },
      { label: "Timeline", value: data.timeline },
      { label: "Category", value: data.category },
      { label: "Skills", value: data.skills },
      { label: "Project Type", value: data.projectType },
    ];

    fields.forEach(function (field) {
      if (field.value && field.value !== "Not specified") {
        var fieldDiv = document.createElement("div");
        fieldDiv.className = "brief-field";

        var labelSpan = document.createElement("span");
        labelSpan.className = "brief-field-label";
        labelSpan.textContent = field.label + ": ";

        var displayValue = field.value.length > 2000
          ? field.value.substring(0, 2000) + "..."
          : field.value;

        var valueText = document.createTextNode(displayValue);

        fieldDiv.appendChild(labelSpan);
        fieldDiv.appendChild(valueText);
        dom.briefPreview.appendChild(fieldDiv);
      }
    });

    dom.briefPreview.classList.add("visible");
  }

  /* ─────────────────────────────────────────────
     PROPOSAL GENERATION
     ───────────────────────────────────────────── */
  function handleGenerate() {
    if (state.isGenerating) return;

    // Step 1: Check subscription / free limit
    checkCanGenerate(function (canProceed, errorMsg) {
      if (!canProceed) {
        if (errorMsg) {
          showToast(errorMsg, "⚠️");
        }
        return;
      }

      // Step 2: Validate template selection for pro templates
      var selectedOption =
        dom.selectTemplate.options[dom.selectTemplate.selectedIndex];
      var isProTemplate =
        selectedOption.getAttribute("data-pro") === "true";
      if (isProTemplate && !state.isPaid) {
        showPaywall();
        return;
      }

      // Step 3: Check API key
      var provider = dom.selectProvider.value;
      var keyName =
        provider === "openai" ? KEYS.API_KEY_OPENAI : KEYS.API_KEY_GEMINI;

      chrome.storage.local.get([keyName], function (result) {
        var apiKey = result[keyName] || "";
        if (!apiKey) {
          showToast("Please set your " + (provider === "openai" ? "OpenAI" : "Gemini") + " API key in Settings.", "⚠️");
          switchTab("settings");
          return;
        }

        // Step 4: Generate
        generateProposal(provider, apiKey);
      });
    });
  }

  function generateProposal(provider, apiKey) {
    state.isGenerating = true;
    dom.btnGenerate.disabled = true;
    dom.btnGenerateText.textContent = "Generating...";
    dom.loadingBar.classList.add("active");
    dom.outputCard.style.display = "block";
    dom.outputIntroConsole.textContent = "Generating intro...";
    dom.outputProposalConsole.textContent = "Generating proposal...";
    dom.introCharCount.textContent = "";
    dom.proposalCharCount.textContent = "";

    // Build prompt
    var prompt = buildPrompt();

    if (provider === "openai") {
      callOpenAI(apiKey, prompt);
    } else {
      callGemini(apiKey, prompt);
    }
  }

  function buildPrompt() {
    var tone = dom.selectTone.value;
    var length = dom.selectLength.value;
    var template = dom.selectTemplate.value;
    var notes = dom.inputNotes.value.trim();
    var brief = state.scrapedBrief;

    // Gather profile data from DOM (or use saved data)
    var profileName = dom.profileName.value.trim();
    var profileTitle = dom.profileTitle.value.trim();
    var profileSkills = dom.profileSkills.value.trim();
    var profileExperience = dom.profileExperience.value.trim();

    // Depth guidance based on selected length (each section capped at 1400 chars)
    var depthGuide = {
      short: "Keep each section concise and punchy. Get straight to the point. Aim for roughly 400-600 characters per section.",
      medium: "Write well-balanced sections with enough detail to be convincing. Aim for roughly 700-1000 characters per section.",
      long: "Write detailed and thorough sections covering your approach and value. Use up to the full 1400 character limit per section.",
    };
    var depthText = depthGuide[length] || depthGuide.medium;

    // Template instructions
    var templateInstructions = {
      general:
        "Write a well-structured, engaging Fiverr proposal that demonstrates deep understanding of the client's specific project needs.",
      technical:
        "Write a technical expert proposal emphasizing relevant technical skills, methodology, and a clear implementation approach for this specific project.",
      creative:
        "Write a creative, compelling pitch that stands out with a unique angle and storytelling elements tailored to this project.",
      "value-prop":
        "Write a value-proposition focused proposal highlighting ROI, business outcomes, and measurable results the client will achieve from this specific project.",
      "case-study":
        "Write a proposal structured around a relevant case study, showing how you solved a similar problem with quantifiable results.",
      urgency:
        "Write a persuasive proposal with urgency elements, emphasizing immediate availability, fast delivery, and time-sensitive value for this project.",
    };

    var templateText =
      templateInstructions[template] || templateInstructions.general;

    // Build the prompt
    var prompt = "You are an expert Fiverr freelancer proposal writer who crafts highly specific, personalized proposals.\n\n";
    prompt += "TASK: " + templateText + "\n\n";

    prompt += "CRITICAL OUTPUT FORMAT:\n";
    prompt += "You MUST output TWO separate sections using these EXACT delimiters:\n";
    prompt += "[INTRO_START]\n(your intro text here)\n[INTRO_END]\n";
    prompt += "[PROPOSAL_START]\n(your proposal text here)\n[PROPOSAL_END]\n\n";

    prompt += "CRITICAL FORMATTING RULES:\n";
    prompt += "- The INTRO section MUST be STRICTLY UNDER 1400 characters (count carefully).\n";
    prompt += "- The PROPOSAL section MUST be STRICTLY UNDER 1400 characters (count carefully).\n";
    prompt += "- Each section has its own independent 1400-character limit.\n";
    prompt += "- " + depthText + "\n";
    prompt += "- Tone: " + tone + "\n";
    prompt += "- Do NOT include generic filler or vague statements. Every sentence must directly reference the client's project.\n";
    prompt += "- Do NOT include subject lines, salutations like 'Dear Client' or 'Hi there', or formal sign-offs like 'Best regards'.\n";
    prompt += "- Write in first person as the freelancer.\n";
    prompt += "- Do NOT use markdown formatting, bullet points with asterisks, or headers. Write in plain flowing text with natural paragraph breaks.\n\n";

    prompt += "SECTION 1 — INTRO (wrapped in [INTRO_START] and [INTRO_END]):\n";
    if (profileName || profileTitle || profileSkills || profileExperience) {
      prompt += "Write a compelling personal introduction (2-4 sentences) that directly connects the freelancer's background and expertise to THIS specific project. Mention their name, relevant title/role, and immediately relate their experience to the client's needs. Do NOT write a generic intro — tie it specifically to what the client is asking for.\n\n";
    } else {
      prompt += "Write an opening hook (2-3 sentences) that shows you've read and understood the brief deeply. Demonstrate familiarity with the project specifics.\n\n";
    }

    prompt += "SECTION 2 — PROPOSAL (wrapped in [PROPOSAL_START] and [PROPOSAL_END]):\n";
    prompt += "This section should contain:\n";
    prompt += "- PROJECT UNDERSTANDING (2-3 sentences): Demonstrate that you clearly understand what the client needs by referencing SPECIFIC details from their brief — their exact requirements, scope items, or pain points. Do not paraphrase generically.\n";
    prompt += "- YOUR APPROACH (2-3 sentences): Explain concisely how you would tackle their specific project, referencing relevant tools, methods, or experience.\n";
    prompt += "- CALL TO ACTION (1 sentence): End with a clear, confident next step invitation.\n\n";

    // Pass the COMPLETE brief to the AI
    if (brief) {
      prompt += "=== CLIENT BRIEF (read this completely and reference specific details in your proposal) ===\n";
      if (brief.title) prompt += "PROJECT TITLE: " + brief.title + "\n\n";
      if (brief.description) {
        prompt += "FULL PROJECT DESCRIPTION:\n" + brief.description + "\n\n";
      }
      if (brief.budget && brief.budget !== "Not specified")
        prompt += "BUDGET: " + brief.budget + "\n";
      if (brief.timeline && brief.timeline !== "Not specified")
        prompt += "TIMELINE: " + brief.timeline + "\n";
      if (brief.category && brief.category !== "Not specified")
        prompt += "CATEGORY: " + brief.category + "\n";
      if (brief.skills) prompt += "REQUIRED SKILLS: " + brief.skills + "\n";
      if (brief.projectType && brief.projectType !== "Not specified" && brief.projectType.length > 0)
        prompt += "PROJECT TYPE: " + brief.projectType + "\n";
      if (brief.clientLocation) prompt += "CLIENT LOCATION: " + brief.clientLocation + "\n";
      prompt += "=== END OF BRIEF ===\n\n";
    } else {
      prompt +=
        "NOTE: No specific brief was provided. Write a versatile, adaptable proposal template that the freelancer can customize.\n\n";
    }

    if (profileName || profileTitle || profileSkills || profileExperience) {
      prompt += "FREELANCER PROFILE (use this to write the personalized intro):\n";
      if (profileName) prompt += "- Name: " + profileName + "\n";
      if (profileTitle) prompt += "- Title/Role: " + profileTitle + "\n";
      if (profileSkills) prompt += "- Key Skills: " + profileSkills + "\n";
      if (profileExperience)
        prompt += "- Experience & Background: " + profileExperience + "\n";
      prompt += "\n";
    }

    if (notes) {
      prompt += "ADDITIONAL INSTRUCTIONS FROM FREELANCER:\n" + notes + "\n\n";
    }

    prompt += "REMEMBER:\n";
    prompt += "- Output MUST use the exact [INTRO_START]/[INTRO_END] and [PROPOSAL_START]/[PROPOSAL_END] delimiters.\n";
    prompt += "- Each section MUST be strictly under 1400 characters independently.\n";
    prompt += "- Output ONLY the two delimited sections, nothing else.";

    return prompt;
  }

  /* ─────────────────────────────────────────────
     OPENAI API CALL
     ───────────────────────────────────────────── */
  function callOpenAI(apiKey, prompt) {
    var requestBody = JSON.stringify({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content:
            "You are a professional Fiverr proposal writer. Write compelling, personalized proposals.",
        },
        { role: "user", content: prompt },
      ],
      max_tokens: 1024,
      temperature: 0.7,
    });

    fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + apiKey,
      },
      body: requestBody,
    })
      .then(function (response) {
        if (!response.ok) {
          return response.json().then(function (errData) {
            throw new Error(
              errData.error
                ? errData.error.message
                : "OpenAI API error (HTTP " + response.status + ")"
            );
          });
        }
        return response.json();
      })
      .then(function (data) {
        if (
          data.choices &&
          data.choices.length > 0 &&
          data.choices[0].message
        ) {
          var proposalText = data.choices[0].message.content.trim();
          onGenerationSuccess(proposalText);
        } else {
          throw new Error("Unexpected response format from OpenAI.");
        }
      })
      .catch(function (err) {
        onGenerationError(err.message);
      });
  }

  /* ─────────────────────────────────────────────
     GEMINI API CALL
     ───────────────────────────────────────────── */
  function callGemini(apiKey, prompt) {
    var url =
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-lite:generateContent?key=" +
      apiKey;

    var requestBody = JSON.stringify({
      contents: [
        {
          parts: [{ text: prompt }],
        },
      ],
      generationConfig: {
        temperature: 0.7,
        maxOutputTokens: 1024,
      },
    });

    fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: requestBody,
    })
      .then(function (response) {
        if (!response.ok) {
          return response.json().then(function (errData) {
            var errMsg = "Gemini API error (HTTP " + response.status + ")";
            if (errData.error && errData.error.message) {
              errMsg = errData.error.message;
            }
            throw new Error(errMsg);
          });
        }
        return response.json();
      })
      .then(function (data) {
        if (
          data.candidates &&
          data.candidates.length > 0 &&
          data.candidates[0].content &&
          data.candidates[0].content.parts &&
          data.candidates[0].content.parts.length > 0
        ) {
          var proposalText =
            data.candidates[0].content.parts[0].text.trim();
          onGenerationSuccess(proposalText);
        } else {
          throw new Error("Unexpected response format from Gemini.");
        }
      })
      .catch(function (err) {
        onGenerationError(err.message);
      });
  }

  /* ─────────────────────────────────────────────
     GENERATION RESULT HANDLERS
     ───────────────────────────────────────────── */
  /**
   * Parse the AI response to extract intro and proposal sections.
   * Looks for [INTRO_START]...[INTRO_END] and [PROPOSAL_START]...[PROPOSAL_END] delimiters.
   * Falls back to splitting on double newline if delimiters are missing.
   */
  function parseAIOutput(text) {
    var intro = "";
    var proposal = "";

    // Try to extract with delimiters
    var introMatch = text.match(/\[INTRO_START\]([\s\S]*?)\[INTRO_END\]/i);
    var proposalMatch = text.match(/\[PROPOSAL_START\]([\s\S]*?)\[PROPOSAL_END\]/i);

    if (introMatch && proposalMatch) {
      intro = introMatch[1].trim();
      proposal = proposalMatch[1].trim();
    } else {
      // Fallback: try splitting by double newline — first paragraph is intro, rest is proposal
      var cleanText = text
        .replace(/\[INTRO_START\]/gi, "")
        .replace(/\[INTRO_END\]/gi, "")
        .replace(/\[PROPOSAL_START\]/gi, "")
        .replace(/\[PROPOSAL_END\]/gi, "")
        .trim();

      var parts = cleanText.split(/\n\n/);
      if (parts.length >= 2) {
        intro = parts[0].trim();
        proposal = parts.slice(1).join("\n\n").trim();
      } else {
        // Last resort: everything is proposal
        intro = "";
        proposal = cleanText;
      }
    }

    return { intro: intro, proposal: proposal };
  }

  function onGenerationSuccess(proposalText) {
    state.isGenerating = false;
    dom.btnGenerate.disabled = false;
    dom.btnGenerateText.textContent = "Generate Proposal";
    dom.loadingBar.classList.remove("active");

    // Parse the AI output into separate sections
    var parsed = parseAIOutput(proposalText);
    state.lastParsedIntro = parsed.intro;
    state.lastParsedProposal = parsed.proposal;

    // Display intro section
    dom.outputIntroConsole.textContent = parsed.intro || "(No intro section generated)";
    dom.introCharCount.textContent = (parsed.intro ? parsed.intro.length : 0) + " / 1400 chars";
    if (parsed.intro && parsed.intro.length > 1400) {
      dom.introCharCount.style.color = "var(--danger)";
    } else {
      dom.introCharCount.style.color = "var(--text-muted)";
    }

    // Display proposal section
    dom.outputProposalConsole.textContent = parsed.proposal || "(No proposal section generated)";
    dom.proposalCharCount.textContent = (parsed.proposal ? parsed.proposal.length : 0) + " / 1400 chars";
    if (parsed.proposal && parsed.proposal.length > 1400) {
      dom.proposalCharCount.style.color = "var(--danger)";
    } else {
      dom.proposalCharCount.style.color = "var(--text-muted)";
    }

    // Show the output card
    dom.outputCard.style.display = "block";

    // Increment free count if not paid
    if (!state.isPaid) {
      chrome.runtime.sendMessage(
        { action: "INCREMENT_FREE_COUNT" },
        function (resp) {
          if (resp) {
            state.freeCount = resp.count;
            updateUIForSubscription();
          }
        }
      );
    }

    // Save to history (save the combined text)
    var combinedText = "";
    if (parsed.intro) combinedText += "[INTRO]\n" + parsed.intro + "\n\n";
    if (parsed.proposal) combinedText += "[PROPOSAL]\n" + parsed.proposal;
    saveToHistory(combinedText.trim());

    showToast("Proposal generated!", "✅");
  }

  function onGenerationError(errorMsg) {
    state.isGenerating = false;
    dom.btnGenerate.disabled = false;
    dom.btnGenerateText.textContent = "Generate Proposal";
    dom.loadingBar.classList.remove("active");

    dom.outputIntroConsole.textContent = "Error: " + errorMsg;
    dom.outputProposalConsole.textContent = "";
    dom.introCharCount.textContent = "";
    dom.proposalCharCount.textContent = "";
    showToast("Generation failed: " + errorMsg, "❌");
  }

  /* ─────────────────────────────────────────────
     COPY PROPOSAL
     ───────────────────────────────────────────── */
  function copySection(section) {
    var text = "";
    if (section === "intro") {
      text = state.lastParsedIntro || dom.outputIntroConsole.textContent;
    } else if (section === "proposal") {
      text = state.lastParsedProposal || dom.outputProposalConsole.textContent;
    } else {
      // all — combine both
      var introText = state.lastParsedIntro || dom.outputIntroConsole.textContent;
      var proposalText = state.lastParsedProposal || dom.outputProposalConsole.textContent;
      text = introText + "\n\n" + proposalText;
    }

    if (!text || text.indexOf("(No ") === 0) {
      showToast("Nothing to copy", "ℹ️");
      return;
    }

    navigator.clipboard
      .writeText(text.trim())
      .then(function () {
        var label = section === "all" ? "Full proposal" : (section === "intro" ? "Intro" : "Proposal");
        showToast(label + " copied to clipboard!", "📋");
      })
      .catch(function () {
        // Fallback
        var textarea = document.createElement("textarea");
        textarea.value = text.trim();
        textarea.style.position = "fixed";
        textarea.style.left = "-9999px";
        document.body.appendChild(textarea);
        textarea.select();
        try {
          document.execCommand("copy");
          showToast("Copied to clipboard!", "📋");
        } catch (e) {
          showToast("Copy failed. Please select and copy manually.", "⚠️");
        }
        document.body.removeChild(textarea);
      });
  }

  /* ─────────────────────────────────────────────
     HISTORY
     ───────────────────────────────────────────── */
  function saveToHistory(proposalText) {
    chrome.storage.local.get([KEYS.GENERATION_HISTORY], function (result) {
      var history = result[KEYS.GENERATION_HISTORY] || [];

      var entry = {
        id: Date.now().toString(),
        title: state.scrapedBrief
          ? state.scrapedBrief.title || "Untitled Brief"
          : "Manual Proposal",
        snippet: proposalText.substring(0, 120),
        fullText: proposalText,
        provider: dom.selectProvider.value,
        tone: dom.selectTone.value,
        template: dom.selectTemplate.value,
        createdAt: new Date().toISOString(),
      };

      history.unshift(entry);

      // Keep last 50 entries
      if (history.length > 50) {
        history = history.slice(0, 50);
      }

      chrome.storage.local.set(
        { [KEYS.GENERATION_HISTORY]: history },
        function () {
          loadHistory();
        }
      );
    });
  }

  function loadHistory() {
    chrome.storage.local.get([KEYS.GENERATION_HISTORY], function (result) {
      var history = result[KEYS.GENERATION_HISTORY] || [];
      renderHistory(history);
    });
  }

  function renderHistory(history) {
    dom.historyList.textContent = "";

    if (history.length === 0) {
      var emptyDiv = document.createElement("div");
      emptyDiv.className = "history-empty";
      emptyDiv.textContent = "No proposals generated yet";
      dom.historyList.appendChild(emptyDiv);
      return;
    }

    // Show last 10 in popup
    var display = history.slice(0, 10);
    display.forEach(function (item) {
      var itemDiv = document.createElement("div");
      itemDiv.className = "history-item";

      var metaDiv = document.createElement("div");
      metaDiv.className = "history-meta";

      var titleSpan = document.createElement("span");
      titleSpan.className = "history-title";
      titleSpan.textContent = item.title;

      var dateSpan = document.createElement("span");
      dateSpan.className = "history-date";
      dateSpan.textContent = formatDate(item.createdAt);

      metaDiv.appendChild(titleSpan);
      metaDiv.appendChild(dateSpan);

      var snippetDiv = document.createElement("div");
      snippetDiv.className = "history-snippet";
      snippetDiv.textContent = item.snippet + "...";

      itemDiv.appendChild(metaDiv);
      itemDiv.appendChild(snippetDiv);

      // Click to load into output console
      itemDiv.addEventListener("click", function () {
        dom.outputCard.style.display = "block";
        // Try to parse stored text with [INTRO] and [PROPOSAL] markers
        var storedText = item.fullText;
        var introText = "";
        var proposalText = "";
        var introMarkerMatch = storedText.match(/\[INTRO\]\n([\s\S]*?)(?:\n\n\[PROPOSAL\]|$)/);
        var proposalMarkerMatch = storedText.match(/\[PROPOSAL\]\n([\s\S]*?)$/);
        if (introMarkerMatch) {
          introText = introMarkerMatch[1].trim();
        }
        if (proposalMarkerMatch) {
          proposalText = proposalMarkerMatch[1].trim();
        }
        // Fallback: if no markers found, try the AI delimiters
        if (!introText && !proposalText) {
          var parsed = parseAIOutput(storedText);
          introText = parsed.intro;
          proposalText = parsed.proposal;
        }
        state.lastParsedIntro = introText;
        state.lastParsedProposal = proposalText;
        dom.outputIntroConsole.textContent = introText || "(No intro)";
        dom.outputProposalConsole.textContent = proposalText || storedText;
        dom.introCharCount.textContent = (introText ? introText.length : 0) + " / 1400 chars";
        dom.proposalCharCount.textContent = ((proposalText || storedText).length) + " / 1400 chars";
        showToast("Loaded from history", "📂");
      });

      dom.historyList.appendChild(itemDiv);
    });
  }

  function formatDate(isoString) {
    try {
      var d = new Date(isoString);
      var month = d.toLocaleString("en-US", { month: "short" });
      var day = d.getDate();
      var hours = d.getHours();
      var mins = String(d.getMinutes()).padStart(2, "0");
      var ampm = hours >= 12 ? "PM" : "AM";
      hours = hours % 12 || 12;
      return month + " " + day + ", " + hours + ":" + mins + " " + ampm;
    } catch (e) {
      return "";
    }
  }

  /* ─────────────────────────────────────────────
     PROFILE MANAGEMENT
     ───────────────────────────────────────────── */
  function saveProfile() {
    var profile = {
      name: dom.profileName.value.trim(),
      title: dom.profileTitle.value.trim(),
      skills: dom.profileSkills.value.trim(),
      experience: dom.profileExperience.value.trim(),
    };

    chrome.storage.local.set({ [KEYS.USER_PROFILE]: profile }, function () {
      showToast("Profile saved!", "✅");
    });
  }

  function loadSavedData() {
    chrome.storage.local.get(
      [
        KEYS.USER_PROFILE,
        KEYS.API_KEY_OPENAI,
        KEYS.API_KEY_GEMINI,
        KEYS.API_PROVIDER,
        KEYS.SETTINGS,
      ],
      function (result) {
        // Profile
        var profile = result[KEYS.USER_PROFILE];
        if (profile) {
          dom.profileName.value = profile.name || "";
          dom.profileTitle.value = profile.title || "";
          dom.profileSkills.value = profile.skills || "";
          dom.profileExperience.value = profile.experience || "";
        }

        // API keys (masked — show last 4 chars as hint)
        if (result[KEYS.API_KEY_OPENAI]) {
          dom.inputOpenaiKey.value = result[KEYS.API_KEY_OPENAI];
        }
        if (result[KEYS.API_KEY_GEMINI]) {
          dom.inputGeminiKey.value = result[KEYS.API_KEY_GEMINI];
        }

        // Provider
        if (result[KEYS.API_PROVIDER]) {
          dom.selectProvider.value = result[KEYS.API_PROVIDER];
        }

        // Settings
        var settings = result[KEYS.SETTINGS];
        if (settings) {
          if (settings.tone) dom.selectTone.value = settings.tone;
          if (settings.length) dom.selectLength.value = settings.length;
          if (settings.language) dom.settingsLanguage.value = settings.language;
        }
      }
    );
  }

  /* ─────────────────────────────────────────────
     API KEY MANAGEMENT
     ───────────────────────────────────────────── */
  function saveApiKeys() {
    var openaiKey = dom.inputOpenaiKey.value.trim();
    var geminiKey = dom.inputGeminiKey.value.trim();

    // Basic validation
    if (openaiKey && !openaiKey.startsWith("sk-")) {
      showToast("OpenAI keys typically start with 'sk-'", "⚠️");
    }

    chrome.storage.local.set(
      {
        [KEYS.API_KEY_OPENAI]: openaiKey,
        [KEYS.API_KEY_GEMINI]: geminiKey,
      },
      function () {
        showToast("API keys saved securely!", "🔑");
      }
    );
  }

  function togglePasswordVisibility(inputEl) {
    if (inputEl.type === "password") {
      inputEl.type = "text";
    } else {
      inputEl.type = "password";
    }
  }

  /* ─────────────────────────────────────────────
     DEFAULT SETTINGS
     ───────────────────────────────────────────── */
  function saveDefaultSettings() {
    var settings = {
      tone: dom.selectTone.value,
      length: dom.selectLength.value,
      language: dom.settingsLanguage.value,
    };

    chrome.storage.local.set(
      {
        [KEYS.SETTINGS]: settings,
        [KEYS.API_PROVIDER]: dom.selectProvider.value,
      },
      function () {
        showToast("Default settings saved!", "⚙️");
      }
    );
  }

  /* ─────────────────────────────────────────────
     DEV TOOLS
     ───────────────────────────────────────────── */
  function devReset() {
    chrome.runtime.sendMessage({ action: "DEV_RESET" }, function () {
      state.isPaid = false;
      state.freeCount = 0;
      updateUIForSubscription();
      showToast("Reset to free tier", "🛠");
    });
  }

  function devActivate() {
    chrome.runtime.sendMessage(
      { action: "ACTIVATE_PREMIUM", email: "dev@test.com" },
      function () {
        state.isPaid = true;
        updateUIForSubscription();
        showToast("Pro activated (dev mode)", "⭐");
      }
    );
  }

  /* ─────────────────────────────────────────────
     TOAST NOTIFICATIONS
     ───────────────────────────────────────────── */
  var toastTimer = null;

  function showToast(message, icon) {
    if (toastTimer) clearTimeout(toastTimer);

    dom.toastIcon.textContent = icon || "✓";
    dom.toastText.textContent = message;
    dom.toast.classList.add("visible");

    toastTimer = setTimeout(function () {
      dom.toast.classList.remove("visible");
      toastTimer = null;
    }, 3000);
  }
})();
