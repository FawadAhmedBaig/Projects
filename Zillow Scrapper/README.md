# Zillow Scraper FB

Zillow Scraper FB is a Chrome Extension designed to automate the extraction of property data from your Zillow Favorites page. It efficiently scrapes property details, handles pagination automatically, and provides options to export the data in various formats.

## Features

- **Automated Data Extraction**: Scrapes essential property details including Price, Address, Owner Name, and Phone Number directly from `https://www.zillow.com/myzillow/favorites`.
- **Auto-Pagination**: Automatically navigates through multiple pages of your saved favorites to ensure all data is captured.
- **Multiple Export Options**: 
  - Automatically downloads data as CSV and XLSX (Excel) files upon completion.
  - Manual download buttons available in the extension popup.
- **Webhook Integration**: Automatically sends the scraped data to a Google Sheets webhook (via Google Apps Script) for seamless data collection and cloud storage.
- **User-Friendly Interface**: Simple popup interface to start or stop the scraping process and monitor the number of successfully scraped properties.

## Installation

1. Clone this repository or download the source code as a ZIP file and extract it.
2. Open Google Chrome and navigate to `chrome://extensions/`.
3. Enable **Developer mode** using the toggle switch in the top right corner.
4. Click on the **Load unpacked** button in the top left corner.
5. Select the extracted project folder (`Zillow Scrapper`).
6. The extension should now appear in your Chrome extensions list and be ready to use.

## Usage

1. Log in to your Zillow account and navigate to your favorites page: [https://www.zillow.com/myzillow/favorites](https://www.zillow.com/myzillow/favorites).
2. Click on the **Zillow Scraper FB** extension icon in your Chrome toolbar.
3. In the popup window, click the **Start** button.
4. The extension will begin scrolling through the properties, visiting each property link to extract data, and automatically click the "Next page" button when it reaches the bottom.
5. **Do not close the tab** while the scraping is in progress.
6. Once there are no more pages to scrape, or if you click the **Stop** button in the popup, the extension will automatically download the collected data as both a CSV and an XLSX file, and send the data to the configured Google Webhook.
7. You can also manually download the CSV or Excel files at any time using the respective buttons in the extension popup.

## Technical Details

- **Manifest Version**: MV3 (Manifest V3)
- **Permissions**: `cookies`, `storage`, `unlimitedStorage`, `activeTab`, `tabs`
- **Libraries used**: [SheetJS (xlsx.js)](https://sheetjs.com/) for generating Excel files.

## Developer

Developed by **Fawad Baig**
