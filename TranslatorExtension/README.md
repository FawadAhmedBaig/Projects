# LinguaSub — Dual Subtitle Translator

LinguaSub is a powerful browser extension that helps you learn new languages seamlessly while watching your favorite content on YouTube and Netflix. It provides interactive dual subtitles, allowing you to click on any word for instant definitions, phonetics, and pronunciation.

## Features

- **Dual Subtitles**: Display two sets of subtitles simultaneously on both YouTube and Netflix.
- **Interactive Words**: Click on any word in the subtitles to instantly view its translation, dictionary definition, and phonetics.
- **Pronunciation**: Hear how words are pronounced natively.
- **Word Saving**: Save difficult words to build your personal vocabulary list.
- **Customizable**: Adjust the target/source languages, subtitle colors, and font sizes to fit your viewing preferences perfectly.

## Installation

### For Chrome / Edge / Brave (Chromium-based browsers)

1. Clone or download this repository to your local machine.
2. Open your browser and navigate to the Extensions page (`chrome://extensions/`).
3. Enable **Developer mode** in the top right corner.
4. Click on **Load unpacked**.
5. Select the `TranslatorExtension` folder (the root folder containing `manifest.json`).
6. LinguaSub should now be installed and visible in your extensions toolbar!

## Usage

1. Pin the LinguaSub extension to your toolbar for easy access.
2. Click the extension icon to open the popup settings.
3. Configure your **Source Language** (the language you are learning) and **Target Language** (your native language).
4. Customize the appearance (color, font size).
5. Open any video on [YouTube](https://youtube.com) or [Netflix](https://netflix.com) that has closed captions available.
6. LinguaSub will automatically overlay the interactive dual subtitles on the video player.

## Project Structure

- `manifest.json`: Extension configuration and permissions.
- `background.js`: Service worker for handling extension installation and state management.
- `popup/`: Contains the HTML, CSS, and JS for the extension's settings menu.
- `content/`: Contains the core logic injected into the web pages:
  - `youtubeObserver.js` & `netflixInterceptor.js`: Site-specific subtitle extractors and observers.
  - `tokenizer.js`: Processes subtitle text into clickable interactive words.
  - `translator.js`: Handles translation requests.
  - `tooltip.js`: UI for the interactive dictionary popup.
  - `overlay.js`: Renders the dual subtitle overlay on the video player.
  - `main.js`: Entry point for the content scripts.

## Permissions

- `activeTab`: Used to interact with the current video page to overlay subtitles.
- `storage`: Used to save your language preferences, theme settings, and saved vocabulary words.

## License

This project is licensed under the MIT License.
