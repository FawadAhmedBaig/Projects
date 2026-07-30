# Fiverr Brief Proposal Architect Pro 🚀

An AI-powered Chrome extension designed to help Fiverr freelancers craft winning, tailored proposals for buyer briefs in seconds. Boost your response rate and win more projects using the power of AI.

## ✨ Features

- **AI-Powered Generation**: Instantly generate professional proposals tailored to the specific details of a Fiverr buyer's brief.
- **Multiple AI Models**: Choose between OpenAI's **GPT-4o-mini** and Google's **Gemini 2.5 Flash Lite**.
- **Bring Your Own Key (BYOK)**: Securely use your own API keys for OpenAI or Gemini. Keys are stored locally on your device and never sent to any third-party server.
- **Multi-Language Support**: Generate proposals in English, Spanish, French, German, Arabic, Simplified Chinese, or Portuguese.
- **Direct Integration**: Works seamlessly on `fiverr.com`, analyzing briefs directly from the page.
- **Freemium & Pro Tiers**: 
  - **Free Tier**: 3 free proposals per month.
  - **Pro Tier**: Unlock unlimited generations, priority templates (Value Proposition, Case Study, Urgency), advanced tone and length controls, and a full generation history.
- **Cloud Sync**: Sign in with your Google Account to sync your settings, Pro status, and history across multiple devices.

## 🛠️ Tech Stack

- **Browser Extension**: Manifest V3 Chrome Extension
- **Languages**: HTML, CSS, JavaScript (Vanilla)
- **APIs**: OpenAI API, Google Gemini API, Google OAuth2

## 📦 Installation (Developer Mode)

To install this extension locally for testing or development:

1. Clone or download this repository to your local machine.
2. Open Google Chrome and navigate to `chrome://extensions/`.
3. Enable **Developer mode** using the toggle in the top right corner.
4. Click on the **Load unpacked** button in the top left.
5. Select the `Fiverr Brief Proposal Generator` folder from the cloned repository.
6. The extension is now installed! You can pin it to your toolbar for easy access.

## ⚙️ Configuration & Usage

1. Click the extension icon in your Chrome toolbar.
2. Go to the **API Keys** section.
3. Enter your OpenAI API Key or Google Gemini API Key.
4. Select your preferred default **Proposal Language** in the Default Settings.
5. Navigate to a buyer brief on Fiverr.
6. Use the extension to automatically analyze the brief and generate a customized proposal.

## 🔒 Privacy & Security

Your privacy is our priority. 
- API keys are stored in your browser's local storage and are only sent directly to OpenAI or Google's official API endpoints.
- The extension only requests access to `fiverr.com` to read the contents of the briefs you want to generate proposals for.

## 📄 License

This project is licensed under the MIT License.
