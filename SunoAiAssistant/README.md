# Suno Playlist Downloader

A Chrome browser extension designed to help you easily download all songs from a Suno AI playlist with a single click. The extension adds a floating "Download All Songs" button to Suno playlist pages, fetches the audio files, and packages them into a convenient ZIP archive.

## 🚀 Features

- **One-Click Download**: Adds a convenient download button directly to Suno playlist pages (`https://suno.com/playlist/*`).
- **Batch Processing**: Automatically iterates through all songs visible in the playlist and downloads them.
- **ZIP Archiving**: Uses JSZip to bundle all downloaded MP3s into a single `suno_playlist.zip` file.
- **Session Authentication**: Bypasses restrictions by routing download requests through a background service worker using your active session tokens.

## 🛠️ Tech Stack

- **JavaScript (Vanilla)**: Core logic for DOM manipulation and API requests.
- **Chrome Extension API**: Manifest V3 compliant architecture (Content Scripts, Service Workers).
- **JSZip**: Client-side ZIP generation library.

## 📂 Project Structure

- `manifest.json`: Extension configuration and permissions (Manifest V3).
- `content.js`: Content script that injects the floating download button and necessary scripts into the Suno page.
- `page-downloader.js`: Handles scraping the playlist data, managing fetch promises, and zipping the files.
- `sw.js`: The background service worker responsible for executing the API requests with necessary authorization headers.
- `jszip.min.js`: The external JSZip library for creating ZIP files.

## ⚙️ Installation & Setup

1. **Clone or Download the Repository:**
   ```bash
   git clone https://github.com/yourusername/SunoAiAssistant.git
   ```

2. **Update Session Tokens (CRITICAL STEP):**
   Due to Suno's API authentication, you must update the authorization tokens in the service worker for the downloads to succeed.
   - Open `sw.js` in your code editor.
   - Look for the `fetch` request headers block.
   - Update the following headers with your live session data from the browser's Network tab:
     - `authorization` (Bearer token)
     - `browser-token`
     - `device-id`

3. **Load the Extension in Chrome:**
   - Open Google Chrome and navigate to `chrome://extensions/`.
   - Enable **"Developer mode"** in the top right corner.
   - Click on **"Load unpacked"** in the top left.
   - Select the project directory (`SunoAiAssistant`).

## 🎵 Usage

1. Navigate to any Suno playlist page (e.g., `https://suno.com/playlist/...`).
2. You should see a blue floating **"⬇️ Download All Songs"** button in the bottom right corner of the page.
3. Scroll down the page to ensure all the songs you want to download are loaded in the DOM.
4. Click the download button.
5. Wait for the extension to fetch the songs and generate the ZIP file. Once completed, your browser will prompt you to save `suno_playlist.zip`.

## ⚠️ Disclaimer

This tool is for educational and personal use only. Please respect Suno's terms of service and copyright rules when downloading and using generated audio.
