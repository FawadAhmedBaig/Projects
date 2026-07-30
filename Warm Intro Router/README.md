# Warm Intro Router

Warm Intro Router is a local-only Chrome Extension that uses the Side Panel API to help you manage and streamline warm introductions on LinkedIn. It allows you to maintain a local database of your contacts, automatically detect mutual connections when viewing LinkedIn profiles, and easily draft intro requests and forwardable emails.

## Features

*   **Privacy First (Local-Only):** All your contact data and introduction requests are stored locally in your browser using `chrome.storage.local`. No data is sent to external servers.
*   **Contact Management:**
    *   Manually add contacts with details like name, email, company, custom tags, and relationship strength (0-10).
    *   Bulk import contacts via CSV.
*   **Smart Connector Discovery:** When you visit a LinkedIn profile, the extension can detect mutual connections and cross-reference them with your stored contacts, suggesting the best people to ask for an intro based on relationship strength and tag matches.
*   **Intro Request Templates:** Quickly generate "Ask to Connector" and "Forwardable" messages. Includes one-click copy functionality.
*   **Dashboard & Tracking:** Keep track of the status of your introduction requests (Sent, Accepted, Declined, Meeting Booked) in a built-in mini dashboard.

## Installation (Developer Mode)

Since this extension is loaded locally, follow these steps to install it in Google Chrome:

1.  Clone or download this repository to your local machine.
2.  Open Google Chrome and navigate to `chrome://extensions/`.
3.  Enable **Developer mode** by toggling the switch in the top right corner.
4.  Click the **Load unpacked** button.
5.  Select the directory where you extracted the project files.
6.  The "Warm Intro Router" extension should now appear in your list of extensions.

## Usage

1.  **Open the Side Panel:** Click the extension icon in your Chrome toolbar or open the Chrome Side Panel and select "Warm Intro Router" from the dropdown.
2.  **Add Contacts:** Go to **Manage Contacts**. You can add people manually or upload a CSV file.
    *   *CSV Format requirement:* Your CSV should have a header row and include columns for `name`, `email`, `company`, `tags` (semicolon-separated), and `strength` (number 0-10).
3.  **Find Connectors:** Navigate to a LinkedIn profile. Open the **Find Connectors** screen in the side panel. The extension will suggest connectors from your contact list who might know the target.
4.  **Draft Intros:** Select a suggested connector to open the **Intro Request** screen. Here, you can copy pre-formatted text to send to your connector.
5.  **Track Progress:** Use the **Manage Requests** dashboard to update the status of your introductions as they progress.

## Permissions Explained

The extension requests the following permissions in the `manifest.json`:
*   `sidePanel`: Required to render the main interface alongside your web pages.
*   `storage`: Required to save your contacts and intro statuses locally.
*   `scripting` & `activeTab`: Used to interact with the active LinkedIn tab to detect profile information and mutual connections.
*   `tabs`: Used to manage and query tab states.
*   `host_permissions`: Specifically limited to LinkedIn (`https://www.linkedin.com/in/*`, `https://www.linkedin.com/search/*`) to read public profile data needed for connector suggestions.

## Author

Developed by **Fawad Baig** ([fawad8280 on Fiverr](https://www.fiverr.com/fawad8280)).
