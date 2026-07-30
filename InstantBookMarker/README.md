# All-In-Bookmarker (Instant Bookmarker)

A smart Chrome Extension that allows you to instantly capture text selections from any webpage and intelligently categorize them as Events, Tasks, or Daily Focus items using AI.

## Features

- **Context Menu Integration**: Highlight any text, right-click, and select "Save to Instant Bookmarker" to start capturing.
- **AI-Powered Extraction**: Uses the Groq API (Llama 3 8B model) to automatically parse the selected text and extract the event title, date, and location.
- **Categorization**: Save your captures as:
  - **Event**: Adds an event to your calendar with date and location.
  - **Task**: Adds a task to your calendar.
  - **Top 3**: Highlights your top 3 most important items for the day.
- **Interactive Dashboard**: A full-page dashboard featuring a monthly calendar view to visualize all your saved events and tasks.
- **Manage Entries**: Easily edit or delete your saved items directly from the dashboard.

## Installation

1. Clone or download this repository to your local machine.
2. Open Google Chrome and navigate to `chrome://extensions/`.
3. Enable **Developer mode** in the top right corner.
4. Click on **Load unpacked** and select the directory containing this project (`InstantBookMarker`).
5. The extension icon should now appear in your browser toolbar.

## Configuration (API Key)

This extension uses the Groq API for smart text extraction. 
To ensure it works correctly:
1. Open `popup/popup.js`.
2. Locate the `GROQ_API_KEY` variable inside the `runSmartExtraction` function.
3. Replace the placeholder with your own valid Groq API key.

## Usage

1. **Highlight and Save**: Select text on any web page (e.g., event details, an important task).
2. Right-click the selected text and click **"Save to Instant Bookmarker"**.
3. The extension popup will open. The AI will automatically process your text and fill in the Title, Date, and Location fields.
4. Choose a category (**Event**, **Task**, or **Top 3**).
5. Click **Save to Storage**.
6. **View Dashboard**: Click the extension icon and click **Open Dashboard** to view your calendar and Top 3 list.

## Technologies Used

- HTML, CSS, Vanilla JavaScript
- Chrome Extensions API (`contextMenus`, `storage`, `tabs`, `scripting`)
- Groq API (LLaMA 3) for Natural Language Processing

## License

MIT License
