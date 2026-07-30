# React Weather App

A simple, responsive, and dynamic weather application built with React and Vite. It allows users to search for any city worldwide and get real-time weather information. The app uses Material-UI for a modern interface and fetches live data from the OpenWeatherMap API.

## Features

- **Real-Time Weather Data:** Get up-to-date information including current temperature, minimum/maximum temperature, humidity, and a description of the weather.
- **Dynamic UI:** The application interface dynamically updates its images and icons based on the current weather conditions (e.g., sunny, rainy, or cold).
- **City Search:** Easily search for any city using the integrated search bar.
- **Modern Design:** Built using Material-UI components for a clean and user-friendly experience.

## Technologies Used

- **Frontend:** React (v19), Vite
- **UI Library:** Material-UI (MUI) & Emotion
- **Icons:** Material-UI Icons
- **API:** OpenWeatherMap API

## Getting Started

### Prerequisites

- Node.js (v18 or higher recommended)
- npm or yarn

### Installation

1. **Clone the repository:**
   ```bash
   git clone <your-repository-url>
   cd "React Weather App"
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Run the development server:**
   ```bash
   npm run dev
   ```

4. **Open the app in your browser:**
   Navigate to `http://localhost:5173` (or the URL provided in your terminal).

## Note on API Key

This project uses the OpenWeatherMap API to fetch weather data. The API key is currently included in the `SearchBox.jsx` file for demonstration purposes. For production use, it is highly recommended to extract this key into environment variables (e.g., `.env`) to keep it secure.

## Folder Structure

- `src/`
  - `components/`
    - `WeatherApp.jsx` - The main component orchestrating the search and info display.
    - `SearchBox.jsx` - Component handling the city search input and API calls.
    - `InfoBox.jsx` - Component displaying the fetched weather data using MUI Cards.
  - `assets/` - Contains dynamic images used for different weather conditions.
  - `App.jsx` & `main.jsx` - Application entry points.

## License

This project is open-source and available under the [MIT License](LICENSE).
