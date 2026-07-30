/**
 * Fiverr Brief Proposal Architect Pro — Background Service Worker
 *
 * Handles:
 *   - Google OAuth authentication (chrome.identity)
 *   - Paddle checkout URL construction with userId
 *   - Server-verified subscription state sync (Firestore via backend API)
 *   - Monthly free-tier token resets
 *   - Message routing between popup and content scripts
 */

"use strict";

/* ─────────────────────────────────────────────
   Constants
   ───────────────────────────────────────────── */
const STORAGE_KEYS = {
  PAID_STATUS: "user_paid_status",            // boolean
  FREE_COUNT: "freeGenerationsCount",          // integer 0-3
  RESET_MONTH: "freeGenerationsResetMonth",    // "YYYY-MM"
  SUBSCRIPTION_ID: "subscription_id",          // string | null
  SUBSCRIPTION_EMAIL: "subscription_email",    // string | null
  API_PROVIDER: "api_provider",                // "openai" | "gemini"
  API_KEY_OPENAI: "api_key_openai",            // string
  API_KEY_GEMINI: "api_key_gemini",            // string
  USER_PROFILE: "user_profile",               // { name, title, skills, experience }
  GENERATION_HISTORY: "generation_history",    // array of past proposals
  SETTINGS: "extension_settings",             // { tone, length, language }
  AUTH_USER_ID: "auth_user_id",               // Google email (userId)
  AUTH_TOKEN: "auth_token",                    // OAuth access token
};

const FREE_TIER_LIMIT = 3;
const MONTHLY_RESET_ALARM = "monthly_token_reset";
const SUBSCRIPTION_CHECK_ALARM = "subscription_status_check";

// ── Backend & Checkout Configuration ──
// IMPORTANT: Replace with your actual deployed domain
const BACKEND_URL = "https://fiverrproposalarchitect.vercel.app/";
const CHECKOUT_PATH = "/checkout.html";

/* ─────────────────────────────────────────────
   Installation & Startup
   ───────────────────────────────────────────── */
chrome.runtime.onInstalled.addListener(function (details) {
  if (details.reason === "install") {
    // Initialize default storage values on first install
    chrome.storage.local.set({
      [STORAGE_KEYS.PAID_STATUS]: false,
      [STORAGE_KEYS.FREE_COUNT]: 0,
      [STORAGE_KEYS.RESET_MONTH]: getCurrentMonth(),
      [STORAGE_KEYS.SUBSCRIPTION_ID]: null,
      [STORAGE_KEYS.SUBSCRIPTION_EMAIL]: null,
      [STORAGE_KEYS.API_PROVIDER]: "openai",
      [STORAGE_KEYS.API_KEY_OPENAI]: "",
      [STORAGE_KEYS.API_KEY_GEMINI]: "",
      [STORAGE_KEYS.USER_PROFILE]: {
        name: "",
        title: "",
        skills: "",
        experience: "",
      },
      [STORAGE_KEYS.GENERATION_HISTORY]: [],
      [STORAGE_KEYS.SETTINGS]: {
        tone: "professional",
        length: "medium",
        language: "english",
      },
      [STORAGE_KEYS.AUTH_USER_ID]: null,
      [STORAGE_KEYS.AUTH_TOKEN]: null,
    });
  }

  // Set up alarms
  setupAlarms();
  // Check access on install/update
  checkUserAccess();
});

chrome.runtime.onStartup.addListener(function () {
  checkAndResetMonthlyTokens();
  setupAlarms();
  // Verify subscription on every browser startup
  checkUserAccess();
});

/* ─────────────────────────────────────────────
   Alarm Management
   ───────────────────────────────────────────── */
function setupAlarms() {
  // Check for monthly reset every 6 hours
  chrome.alarms.create(MONTHLY_RESET_ALARM, {
    periodInMinutes: 360, // 6 hours
  });

  // Check subscription status every 6 hours (tighter enforcement)
  chrome.alarms.create(SUBSCRIPTION_CHECK_ALARM, {
    periodInMinutes: 360, // 6 hours
  });
}

chrome.alarms.onAlarm.addListener(function (alarm) {
  if (alarm.name === MONTHLY_RESET_ALARM) {
    checkAndResetMonthlyTokens();
  }
  if (alarm.name === SUBSCRIPTION_CHECK_ALARM) {
    checkUserAccess();
  }
});

/* ─────────────────────────────────────────────
   Monthly Token Reset Logic
   ───────────────────────────────────────────── */
function getCurrentMonth() {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  return year + "-" + month;
}

function checkAndResetMonthlyTokens() {
  chrome.storage.local.get(
    [STORAGE_KEYS.RESET_MONTH, STORAGE_KEYS.FREE_COUNT],
    function (result) {
      const currentMonth = getCurrentMonth();
      const storedMonth = result[STORAGE_KEYS.RESET_MONTH] || "";

      if (storedMonth !== currentMonth) {
        // New month — reset free generation count
        chrome.storage.local.set({
          [STORAGE_KEYS.FREE_COUNT]: 0,
          [STORAGE_KEYS.RESET_MONTH]: currentMonth,
        });
      }
    }
  );
}

/* ─────────────────────────────────────────────
   Google OAuth Authentication
   ───────────────────────────────────────────── */

/**
 * Authenticate the user via an explicit Google OAuth flow.
 * Returns a Promise that resolves with the user's email (userId).
 */
function authenticateUser() {
  return new Promise(function (resolve, reject) {
    const manifest = chrome.runtime.getManifest();
    const oauth2 = manifest && manifest.oauth2;

    if (!oauth2 || !oauth2.client_id) {
      reject(new Error("OAuth is not configured in manifest.json."));
      return;
    }

    const authUrl = buildGoogleAuthUrl(oauth2.client_id);

    chrome.identity.launchWebAuthFlow(
      { interactive: true, url: authUrl },
      function (redirectUrl) {
        if (chrome.runtime.lastError) {
          console.error("[auth] launchWebAuthFlow error:", chrome.runtime.lastError.message);
          reject(new Error(chrome.runtime.lastError.message));
          return;
        }

        const authResult = parseAuthRedirect(redirectUrl);
        if (authResult.error) {
          reject(new Error(authResult.error));
          return;
        }

        if (!authResult.accessToken) {
          reject(new Error("No access token received"));
          return;
        }

        fetch("https://www.googleapis.com/oauth2/v2/userinfo", {
          headers: { Authorization: "Bearer " + authResult.accessToken },
        })
          .then(function (response) {
            if (!response.ok) throw new Error("Failed to fetch user info");
            return response.json();
          })
          .then(function (info) {
            const oauthUserId = info.email;
            if (!oauthUserId) {
              throw new Error("Google account email not returned by userinfo endpoint.");
            }

            chrome.storage.local.set({
              [STORAGE_KEYS.AUTH_USER_ID]: oauthUserId,
              [STORAGE_KEYS.AUTH_TOKEN]: authResult.accessToken,
              [STORAGE_KEYS.SUBSCRIPTION_EMAIL]: oauthUserId,
            });
            console.log("[auth] Signed in as:", oauthUserId);
            resolve(oauthUserId);
          })
          .catch(function (err) {
            console.error("[auth] userinfo fetch error:", err);
            reject(err);
          });
      }
    );
  });
}

/**
 * Sign the user out — clear cached token and auth state.
 */
function signOutUser() {
  return new Promise(function (resolve) {
    chrome.storage.local.get([STORAGE_KEYS.AUTH_TOKEN], function (result) {
      const token = result[STORAGE_KEYS.AUTH_TOKEN];
      if (token) {
        revokeGoogleToken(token)
          .catch(function (err) {
            console.warn("[auth] token revoke failed:", err.message);
          })
          .then(function () {
            clearIdentityCache(token);
            clearAuthState();
            resolve();
          });
      } else {
        clearIdentityCache(null);
        clearAuthState();
        resolve();
      }
    });
  });
}

function buildGoogleAuthUrl(clientId) {
  console.log("Your Redirect URI:", chrome.identity.getRedirectURL("oauth2"));
  const redirectUri = chrome.identity.getRedirectURL("oauth2");
  const params = new URLSearchParams({
    client_id: clientId,
    response_type: "token",
    redirect_uri: redirectUri,
    scope: "openid email profile",
    prompt: "select_account",
    access_type: "online",
    include_granted_scopes: "true",
  });

  return "https://accounts.google.com/o/oauth2/v2/auth?" + params.toString();
}

function parseAuthRedirect(redirectUrl) {
  if (!redirectUrl) {
    return { accessToken: null, error: "No redirect URL returned" };
  }

  const hashIndex = redirectUrl.indexOf("#");
  const queryIndex = redirectUrl.indexOf("?");
  const rawParams = hashIndex >= 0 ? redirectUrl.slice(hashIndex + 1) : queryIndex >= 0 ? redirectUrl.slice(queryIndex + 1) : "";
  const params = new URLSearchParams(rawParams);

  return {
    accessToken: params.get("access_token"),
    error: params.get("error") || null,
  };
}

function revokeGoogleToken(token) {
  return fetch("https://oauth2.googleapis.com/revoke?token=" + encodeURIComponent(token), {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
  }).then(function (response) {
    if (!response.ok) {
      throw new Error("Google revoke endpoint returned " + response.status);
    }
  });
}

function clearIdentityCache(token) {
  if (typeof chrome.identity.clearAllCachedAuthTokens === "function") {
    chrome.identity.clearAllCachedAuthTokens(function () {
      if (chrome.runtime.lastError) {
        console.warn("[auth] clearAllCachedAuthTokens error:", chrome.runtime.lastError.message);
      }
    });
    return;
  }

  if (token && typeof chrome.identity.removeCachedAuthToken === "function") {
    chrome.identity.removeCachedAuthToken({ token: token }, function () {
      if (chrome.runtime.lastError) {
        console.warn("[auth] removeCachedAuthToken error:", chrome.runtime.lastError.message);
      }
    });
  }
}

function clearAuthState() {
  chrome.storage.local.set({
    [STORAGE_KEYS.AUTH_USER_ID]: null,
    [STORAGE_KEYS.AUTH_TOKEN]: null,
    [STORAGE_KEYS.PAID_STATUS]: false,
    [STORAGE_KEYS.SUBSCRIPTION_ID]: null,
    [STORAGE_KEYS.SUBSCRIPTION_EMAIL]: null,
  });
}

/* ─────────────────────────────────────────────
   Server-Verified Subscription Check
   ───────────────────────────────────────────── */

/**
 * Check the user's premium status against the backend database.
 * This is the ONLY trusted source for activation state.
 * Called on startup, every 6 hours, and on-demand after sign-in.
 */
function checkUserAccess() {
  chrome.storage.local.get([STORAGE_KEYS.AUTH_USER_ID], function (result) {
    const userId = result[STORAGE_KEYS.AUTH_USER_ID];
    if (!userId) {
      // Not signed in — ensure free state
      chrome.storage.local.set({ [STORAGE_KEYS.PAID_STATUS]: false });
      return;
    }

    const url = BACKEND_URL + "/api/user-status?userId=" + encodeURIComponent(userId);

    fetch(url)
      .then(function (response) {
        if (!response.ok) throw new Error("Backend returned " + response.status);
        return response.json();
      })
      .then(function (data) {
        chrome.storage.local.set({
          [STORAGE_KEYS.PAID_STATUS]: data.isPremium === true,
          [STORAGE_KEYS.SUBSCRIPTION_ID]: data.subscriptionId || null,
        });
        console.log("[sync] User access updated:", data);
      })
      .catch(function (err) {
        // On network error, preserve last known state (offline fallback)
        console.warn("[sync] Backend unreachable, using cached state:", err.message);
      });
  });
}

/* ─────────────────────────────────────────────
   Message Handler — Popup & Content Script Communication
   ───────────────────────────────────────────── */
chrome.runtime.onMessage.addListener(function (request, _sender, sendResponse) {
  switch (request.action) {
    /* ── Google Sign In ── */
    case "SIGN_IN":
      authenticateUser()
        .then(function (userId) {
          // After sign-in, immediately check subscription status
          checkUserAccess();
          sendResponse({ success: true, userId: userId });
        })
        .catch(function (err) {
          sendResponse({ success: false, error: err.message });
        });
      return true;

    /* ── Google Sign Out ── */
    case "SIGN_OUT":
      signOutUser().then(function () {
        sendResponse({ success: true });
      });
      return true;

    /* ── Get Auth State ── */
    case "GET_AUTH_STATE":
      chrome.storage.local.get(
        [STORAGE_KEYS.AUTH_USER_ID, STORAGE_KEYS.PAID_STATUS],
        function (result) {
          sendResponse({
            isSignedIn: !!result[STORAGE_KEYS.AUTH_USER_ID],
            userId: result[STORAGE_KEYS.AUTH_USER_ID] || null,
            isPaid: result[STORAGE_KEYS.PAID_STATUS] === true,
          });
        }
      );
      return true;

    /* ── Subscription State ── */
    case "GET_SUBSCRIPTION_STATE":
      // Trigger a fresh background check (non-blocking)
      checkUserAccess();
      chrome.storage.local.get(
        [
          STORAGE_KEYS.PAID_STATUS,
          STORAGE_KEYS.FREE_COUNT,
          STORAGE_KEYS.SUBSCRIPTION_EMAIL,
          STORAGE_KEYS.AUTH_USER_ID,
        ],
        function (result) {
          sendResponse({
            paid: result[STORAGE_KEYS.PAID_STATUS] === true,
            freeGenerationsCount: result[STORAGE_KEYS.FREE_COUNT] || 0,
            freeLimit: FREE_TIER_LIMIT,
            email: result[STORAGE_KEYS.SUBSCRIPTION_EMAIL] || null,
            userId: result[STORAGE_KEYS.AUTH_USER_ID] || null,
          });
        }
      );
      return true;

    /* ── Activate Premium (manual / dev only) ── */
    case "ACTIVATE_PREMIUM":
      chrome.storage.local.set(
        {
          [STORAGE_KEYS.PAID_STATUS]: true,
          [STORAGE_KEYS.SUBSCRIPTION_ID]: request.subscriptionId || "manual",
          [STORAGE_KEYS.SUBSCRIPTION_EMAIL]: request.email || "",
        },
        function () {
          sendResponse({ success: true });
        }
      );
      return true;

    /* ── Deactivate Premium ── */
    case "DEACTIVATE_PREMIUM":
      chrome.storage.local.set(
        {
          [STORAGE_KEYS.PAID_STATUS]: false,
          [STORAGE_KEYS.SUBSCRIPTION_ID]: null,
        },
        function () {
          sendResponse({ success: true });
        }
      );
      return true;

    /* ── Increment Free Generation Count ── */
    case "INCREMENT_FREE_COUNT":
      chrome.storage.local.get([STORAGE_KEYS.FREE_COUNT], function (result) {
        const current = result[STORAGE_KEYS.FREE_COUNT] || 0;
        const newCount = current + 1;
        chrome.storage.local.set(
          { [STORAGE_KEYS.FREE_COUNT]: newCount },
          function () {
            sendResponse({
              count: newCount,
              limitReached: newCount >= FREE_TIER_LIMIT,
            });
          }
        );
      });
      return true;

    /* ── Check if Free Limit Reached ── */
    case "CHECK_FREE_LIMIT":
      chrome.storage.local.get(
        [STORAGE_KEYS.PAID_STATUS, STORAGE_KEYS.FREE_COUNT],
        function (result) {
          const isPaid = result[STORAGE_KEYS.PAID_STATUS] === true;
          const count = result[STORAGE_KEYS.FREE_COUNT] || 0;
          sendResponse({
            canGenerate: isPaid || count < FREE_TIER_LIMIT,
            isPaid: isPaid,
            count: count,
            remaining: isPaid ? Infinity : Math.max(0, FREE_TIER_LIMIT - count),
          });
        }
      );
      return true;

    /* ── Get Paddle Checkout URL (with userId) ── */
    case "GET_CHECKOUT_URL":
      chrome.storage.local.get([STORAGE_KEYS.AUTH_USER_ID], function (result) {
        const userId = result[STORAGE_KEYS.AUTH_USER_ID];
        if (!userId) {
          sendResponse({ url: null, error: "Not signed in" });
          return;
        }
        const checkoutUrl =
          BACKEND_URL +
          CHECKOUT_PATH +
          "?userId=" +
          encodeURIComponent(userId);
        sendResponse({ url: checkoutUrl });
      });
      return true;

    /* ── Force Sync (manual refresh) ── */
    case "FORCE_SYNC":
      checkUserAccess();
      sendResponse({ success: true });
      return true;

    /* ── Reset (for development/testing) ── */
    case "DEV_RESET":
      chrome.storage.local.set(
        {
          [STORAGE_KEYS.PAID_STATUS]: false,
          [STORAGE_KEYS.FREE_COUNT]: 0,
          [STORAGE_KEYS.RESET_MONTH]: getCurrentMonth(),
          [STORAGE_KEYS.SUBSCRIPTION_ID]: null,
        },
        function () {
          sendResponse({ success: true });
        }
      );
      return true;

    default:
      sendResponse({ error: "Unknown action: " + request.action });
      return true;
  }
});
