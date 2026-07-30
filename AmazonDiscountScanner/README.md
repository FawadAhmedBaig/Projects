# Amazon Discount Scanner

Amazon Discount Scanner is a powerful Google Chrome extension (Manifest V3) that automatically scans Amazon search results for discounted products. It helps you find the best deals by filtering products based on discount types and minimum discount percentages, auto-paginates through search results, and allows you to export the collected data.

## Features

- **Automated Scanning & Pagination**: Automatically scans through multiple pages of Amazon search results with humanized randomized delays to prevent rate-limiting.
- **Advanced Discount Filtering**: Detects and filters various types of discounts:
  - 🎟️ Coupon Discounts
  - 🛒 Save at Checkout
  - 🔄 Subscribe & Save
  - 🏢 Business-Only Pricing
  - 🎁 Redeem / Promo Codes
- **Customizable Filters**: Set your minimum desired discount percentage and maximum number of pages to scan.
- **Cross-Region Support**: Works on various Amazon domains (`.com`, `.ca`, `.co.uk`, `.de`, `.com.mx`). Includes a special "MX Direct Scan" mode that cross-checks US prices for Amazon Mexico.
- **Export Capabilities**: Easily export your findings to:
  - 📄 CSV (Detailed product info and discount metrics)
  - 📝 TXT (ASINs only)
  - 📊 Excel / XLSX (Using integrated SheetJS)
- **Robust Anti-Bot Protection**: Includes rate-limit detection, exponential backoff, and CAPTCHA awareness to safely pause and resume scanning.
- **Real-time Logs & Progress**: View live scan status, logs, and a real-time updating results table directly in the extension popup.

## Installation

1. Clone or download this repository to your local machine.
2. Open Google Chrome and navigate to `chrome://extensions/`.
3. Enable **Developer mode** in the top right corner.
4. Click on **Load unpacked** in the top left corner.
5. Select the folder containing the extension files (where `manifest.json` is located).
6. The extension is now installed! You can pin it to your browser toolbar for quick access.

## Usage

1. Navigate to an Amazon search results page (e.g., search for a product on Amazon).
2. Click the **Amazon Discount Scanner** icon in your extension toolbar.
3. Configure your preferences:
   - **Discount Types**: Toggle which discount types to look for.
   - **Scan Mode**: Choose Standard or MX Direct mode.
   - **Min Discount %**: Enter the minimum discount percentage you are interested in.
   - **Max Pages**: Set how many pages the scanner should automatically navigate through.
   - **Delay (s)**: Adjust the base delay between page loads (randomized jitter is automatically added).
4. Click **Start Scan**.
5. Sit back and watch the scanner collect results! The popup will display real-time logs and a preview of the found items.
6. Once the scan is complete (or stopped), use the **Export Results** section to download your data as CSV, TXT, or Excel.

## Technical Details

- **Manifest V3**: Built using the latest Chrome Extension standards.
- **Background Service Worker**: Orchestrates the scan state, tab navigation, and handles rate-limit retries.
- **Content Scripts**: Injects logic to parse the DOM of Amazon search pages to accurately identify complex pricing structures and discounts without making extraneous network requests.
- **SheetJS**: Bundled locally in the `lib` folder for robust Excel file generation.

## Disclaimer

This extension is a tool for personal use to help find discounts. It simulates user scrolling and navigation. Please use it responsibly to respect Amazon's terms of service and avoid triggering aggressive bot protection mechanisms.
