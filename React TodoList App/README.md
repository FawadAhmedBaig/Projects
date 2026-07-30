# React Mini-Projects Playground

Welcome to the **React Mini-Projects Playground**! (Also known as the React TodoList App repository). 
This repository contains a collection of interactive React components that demonstrate core React concepts such as state management, event handling, conditional rendering, and functional components.

## 🚀 Features & Components

This project includes several distinct mini-applications and UI components:

### 1. Todo List (`TodoList.jsx`)
A fully functional Todo List application that allows you to:
- **Add** new tasks to the list.
- **Delete** existing tasks.
- **Mark as Done** for individual tasks (strikethrough effect).
- **Update** tasks individually.
- **Bulk Actions:** Update all tasks or mark all tasks as done simultaneously.
- Uses `uuid` for unique task key generation.

### 2. Lottery Game (`LotteryGame.jsx`)
A fun, simple probability game. 
- Generates a 3-digit random lottery ticket.
- Automatically calculates the sum of the digits.
- Displays a winning message if the sum of the digits equals **15**.

### 3. Ludo Board (`LudoBoard.jsx`)
A state management exercise simulating a Ludo game board's move tracker.
- Tracks and displays the number of moves for Blue, Green, Red, and Yellow players.
- Uses complex object state updates in React.

### 4. Interactive UI Elements
- **`LikeButton.jsx`**: A stateful toggle button for "liking" an item.
- **`Form.jsx`**: Demonstrates form handling and input state management in React.
- **`Button.jsx` & `State.jsx`**: Additional components exploring React state and basic event listeners.

## 🛠️ Technologies Used
- **React.js** (Functional Components, Hooks like `useState`)
- **JavaScript (ES6+)**
- **CSS** (Vanilla CSS for styling)
- **UUID** (For unique identifiers)

## 💻 Installation and Setup

Since these are React components, they are designed to be run within a React environment (like Vite or Create React App).

1. **Clone the repository:**
   ```bash
   git clone https://github.com/your-username/your-repo-name.git
   ```
2. **Navigate to the project directory:**
   ```bash
   cd "React TodoList App"
   ```
3. **Install Dependencies:**
   Make sure you have Node.js installed. If this is part of a larger Vite/CRA project, run:
   ```bash
   npm install
   ```
   *(Note: You may need to ensure `uuid` is installed via `npm install uuid`)*
4. **Run the Development Server:**
   ```bash
   npm run dev    # For Vite
   # OR
   npm start      # For Create React App
   ```
5. **View in Browser:**
   Open your browser and navigate to `http://localhost:5173` (Vite) or `http://localhost:3000` (CRA).

## 📝 Usage
By default, the `App.jsx` file is set up to render specific components. You can modify `App.jsx` to import and render any of the other components to test them out!

```jsx
import TodoList from './TodoList';

function App() {
  return (
    <>
      <TodoList />
    </>
  )
}
export default App;
```
