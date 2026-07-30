/**
 * All-In-Bookmarker: popup.js
 * Handles intelligent AI extraction and saving to local repository. [cite: 4, 10]
 */

let currentUrl = "";
let selectedCategory = "event";
const API_KEY = "AIzaSyD2JJU3bkWgCvqKLsxsbxok9dP7hQxkoxc"; // Use your new key

document.addEventListener('DOMContentLoaded', async () => {
    const textField = document.getElementById('extractedText');
    const locationField = document.getElementById('locationField');
    const dateField = document.getElementById('eventDate');
    const saveBtn = document.getElementById('save');

    // 1. Setup Button Listeners for Categories [cite: 33]
    document.getElementById('addEvent').onclick = () => { selectedCategory = "event"; highlightButton('addEvent'); };
    document.getElementById('addTask').onclick = () => { selectedCategory = "task"; highlightButton('addTask'); };
    document.getElementById('addTop3').onclick = () => { selectedCategory = "top3"; highlightButton('addTop3'); };

    function highlightButton(id) {
        document.querySelectorAll(".cat-btn").forEach(b => {
            b.classList.remove("active-cat");
        });
        const btn = document.getElementById(id);
        if (btn) btn.classList.add("active-cat");
    }

    // 2. Load the initial text and trigger AI extraction [cite: 29, 31]
    chrome.storage.local.get(['lastSelection', 'lastUrl'], async (data) => {
        if (data.lastSelection) {
            textField.value = "AI is processing..."; // [cite: 4]
            currentUrl = data.lastUrl;
            
            // Call the extraction function directly
            await runSmartExtraction(data.lastSelection);
        }
    });

    // 3. Smart Extraction Logic
/**
 * All-In-Bookmarker: Intelligent Extraction via Groq
 * Uses Llama 3 8B for near-instant processing.
 */
async function runSmartExtraction(rawText) {
    const loader = document.getElementById('aiLoading');
    if(loader) loader.style.display = 'block';
    const GROQ_API_KEY = "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";
    const URL = "https://api.groq.com/openai/v1/chat/completions";

    // Few-shot example helps the model understand complex text blocks
    const PROMPT = `You are a precise data extractor. Extract info from the text into JSON.
    
    EXAMPLE:
    Input: "PAST EVENT Wednesday February 11, 2026 AI+Education Summit 2026 The AI Inflection Point: What, How, and Why We Learn"
    Output: {"title": "AI+Education Summit 2026", "date": "2026-02-11", "location": "Stanford Accelerator for Learning"}

    TASK:
    Analyze this text: "${rawText}"
    1. Extract the Title (The main name of the event).
    2. Extract Date (YYYY-MM-DD).
    3. Extract Location.
    
    RULES:
    - If Date or Location is not explicitly mentioned, return "".
    - Return ONLY a JSON object. No prose.`;

    try {
        const response = await fetch(URL, {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${GROQ_API_KEY}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                model: "llama-3.1-8b-instant", 
                messages: [{ role: "user", content: PROMPT }],
                response_format: { type: "json_object" },
                temperature: 0.1 // Low temperature = more precise extraction
            })
        });

        const data = await response.json();
        const result = JSON.parse(data.choices[0].message.content);

        // UI Updates
        document.getElementById('extractedText').value = result.title || rawText;
        if (result.date) document.getElementById('eventDate').value = result.date;
        if (result.location) document.getElementById('locationField').value = result.location;
        
    } catch (e) {
        console.error("Extraction failed:", e);
        document.getElementById('extractedText').value = rawText; 
    }
    if(loader) loader.style.display = 'none';
}
    // 4. Save Logic [cite: 13, 14, 15]
    saveBtn.addEventListener('click', () => {
        const title = textField.value;
        const location = locationField.value;
        const dateValue = dateField.value;

        if (!title) return alert("Please enter a title.");

        if ((selectedCategory === "event" || selectedCategory === "task") && !dateValue) {
            return alert(`Please select a date for the ${selectedCategory}.`);
        }

        const displayLabel = location ? `${title} at ${location}` : title;

        const newItem = {
            id: Date.now() + Math.random(),
            text: displayLabel, 
            url: currentUrl, 
            category: selectedCategory === "top3" ? "event" : selectedCategory,
            date: dateValue, 
            timestamp: new Date().toISOString(),
            isTop3: selectedCategory === "top3" 
        };

        chrome.storage.local.get({ savedItems: [] }, (data) => {
            let items = data.savedItems;
            if (newItem.isTop3 && items.filter(i => i.isTop3).length >= 3) {
                return alert("Only 3 items allowed in Today's Top 3. [cite: 21]");
            }
            items.push(newItem);
            chrome.storage.local.set({ savedItems: items }, () => {
                window.close(); // [cite: 34]
            });
        });
    });

    // Navigation and Cancel [cite: 34, 35]
    document.getElementById('viewDash').onclick = () => {
        chrome.tabs.create({ url: chrome.runtime.getURL('popup/dashboard.html') });
    };

    document.getElementById('cancel').onclick = () => window.close();
});