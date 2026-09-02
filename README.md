# 🌍 AI Trip Planner - Frontend Internship Assignment

![AI Trip Planner Banner](https://img.shields.io/badge/AI_Powered-Trip_Planner-f43f5e?style=for-the-badge&logo=react)
![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Vite](https://img.shields.io/badge/Vite-B73BFE?style=for-the-badge&logo=vite&logoColor=FFD62E)
![Express](https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white)

A modern, highly interactive, stateful React application that leverages generative AI to turn free-form text input into a structured, day-by-day travel itinerary. Built to fulfill the Frontend Internship Assignment requirements, focusing heavily on robust error handling, a premium aesthetic, and clean component architecture.

---

## 🎯 Core Requirements Fulfilled

| Requirement | Implementation Detail |
|-------------|-----------------------|
| **React Hooks & Functional Components** | Built entirely with modern React standards. Uses `useState` to manage complex hierarchical local state (days, stops, expanded details). |
| **Free-form Text Input** | A flexible `<textarea>` allowing users to describe highly specific and nuanced travel preferences. |
| **Real LLM API (Structured Data)** | Integrates the **Groq API** (using the high-performance `openai/gpt-oss-20b` model). The system prompt uses strict prompt-engineering constraints to force the AI to return a specific JSON schema. |
| **Stateful Interactive UI** | The JSON is parsed and rendered into a dynamic dashboard. Users can deeply interact with the data by **reordering**, **deleting**, and **expanding** individual itinerary stops. |
| **No Exposed API Keys** | The application is architected securely with an **Express.js backend** acting as a proxy layer. The React frontend never touches or exposes the Groq API key to the client's browser. |

---

## 🛡️ Handling Bad AI Output (The Crucial 20%)

As noted in the assignment, handling unpredictable AI behavior is what separates good apps from great ones. Here is how resilience was engineered into this product:

1. **JSON Validation & Parsing Safeguards**: The Express backend doesn't just blindly forward the Groq API response. It actively attempts to parse the AI's string output via `JSON.parse()`. 
2. **Graceful Error States**: If the LLM hallucinates, outputs markdown, or returns malformed JSON, the backend intercepts the `SyntaxError` and returns a clean `500` status with a user-friendly error message.
3. **Retry Mechanism**: The React frontend catches API errors and gracefully transitions into an Error State, presenting the user with an actionable **"Retry"** button rather than crashing or showing a white screen.
4. **Empty State Handlers**: Handled the edge case where the AI returns an empty `stops` array, displaying a fallback message rather than rendering a broken UI component.
5. **No Stale Responses**: The UI strictly manages the loading state, ensuring that a user cannot spam the "Generate" button, which prevents race conditions and stale responses overwriting newer ones.

---

## 💅 UI/UX & Product Sense

- **Premium Aesthetics**: Bypassed standard component libraries to build a custom, visually striking "Sunset/Coral" dark mode theme using Vanilla CSS and glassmorphism techniques. 
- **Micro-interactions**: Hover states, smooth transform transitions, and SVG icons give the application a tactile, responsive feel.
- **Mobile First**: Fully responsive layouts ensure the drag-and-drop/action buttons degrade gracefully on smaller mobile screens, maintaining usability regardless of the device.

---

## 🚀 Setup & Local Development

### 1. Clone & Install
```bash
git clone https://github.com/rohitt2008/Flam-ai.git
cd "Flam-ai"
npm install
```

### 2. Configure Environment
Create a `.env.local` file in the root of the project and add your Groq API key:
```env
GROQ_API_KEY=gsk_your_api_key_here
```

### 3. Start the Application
This project uses `concurrently` to spin up both the Express backend and the Vite React frontend in a single command.
```bash
npm run dev
```

- **Frontend**: [http://localhost:5173](http://localhost:5173)
- **Backend API**: [http://localhost:3001](http://localhost:3001)

---

## ☁️ Deployment

This repository is strictly configured to be deployed as a single Web Service on platforms like **Render**, **Railway**, or **Heroku**. 
- The `npm run build` script compiles the Vite React app into static files.
- The `npm start` script starts the Express server, which dynamically serves both the secure `/api/trip` route AND the compiled static React files from the `dist/` directory.

---

## 🤖 AI Usage Note & Time Spent

- **Time Spent**: ~1.5 hours of active architectural planning and execution.
- **AI Tooling**: This project was built via pair-programming with **Antigravity (Google DeepMind)**. The AI agent handled the scaffolding, repetitive CSS styling, and standard boilerplate integrations, while the core architectural decisions (moving from Next.js to Vite+Express for precise requirement adherence), UI/UX product direction, and explicit error-boundary logic were driven through structured prompts. All code was thoroughly reviewed for security and performance.
