# FB Auto Uploader

A Chrome Extension that automates the process of uploading multiple videos to Facebook using data from an Excel file.

## Features

- **Automated Video Uploading:** Uploads videos automatically to Facebook from a local directory.
- **Excel Integration:** Reads video metadata (like Captions and Video Names) directly from an Excel file (`Video_Data.xlsx`).
- **Control Panel:** Start and stop the upload process anytime using the extension's popup interface.
- **Progress Tracking:** Tracks the number of successfully uploaded videos in real-time within the popup.

## Prerequisites

- Google Chrome browser
- Videos to upload
- An Excel file containing the video details

## Installation

1. Clone or download this repository to your local machine.
2. Open Google Chrome and navigate to `chrome://extensions/`.
3. Enable **Developer mode** using the toggle switch in the top right corner.
4. Click on the **Load unpacked** button.
5. Select the directory where you extracted/cloned this project (`FB Auto Uploader`).
6. The extension should now appear in your list of installed extensions and in the Chrome toolbar.

## Project Structure & Setup

Before running the extension, make sure to set up the data properly within the extension folder:

1. **`Videos/` Folder:** 
   Create a folder named `Videos` in the root directory of the extension and place all the video files you intend to upload inside this folder.
2. **`Video_Data.xlsx` File:**
   Place an Excel file named `Video_Data.xlsx` in the root directory of the extension. 
   - The file must contain columns for **Video Name** (the exact file name of the video including the extension) and **Caption** (the text to accompany the post).
   - Ensure the data starts from the first sheet.

## Usage

1. Open Google Chrome and log in to your Facebook account.
2. Go to the Facebook homepage (`https://www.facebook.com/`).
3. Click on the **FB Auto Uploader** extension icon in the Chrome toolbar.
4. Click the **Start** button in the popup to begin the automated upload process.
5. The extension will begin reading the data from the Excel file and uploading videos one by one. Do not close the tab or interact with the page while the automation is running.
6. You can monitor the number of successfully uploaded videos directly in the extension popup.
7. To pause or stop the process, click the **Stop** button in the popup.

## Technical Details

- **Manifest Version:** V3
- **Languages:** JavaScript, HTML, CSS
- **Libraries used:** [SheetJS (xlsx.js)](https://sheetjs.com/) for parsing Excel files.

## Important Note

This tool relies on the DOM structure of Facebook's web interface. If Facebook updates their UI, the CSS selectors used in `content.js` and `automationFunctions.js` may need to be updated to keep the extension fully functional.

## Disclaimer

This extension is for educational and personal use. Automating actions on Facebook may violate their Terms of Service. Use this tool responsibly.
