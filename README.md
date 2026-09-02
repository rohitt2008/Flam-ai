# AI Trip Planner

This is a modern, stateful React application built with Next.js that leverages generative AI to create detailed day-by-day travel itineraries. 

## Features
- **Generative AI Integration**: Uses the Groq API (LLaMA 3) to generate structured JSON data from free-form text input.
- **Stateful Interactive UI**: Allows users to expand/collapse details, remove stops, and reorder activities with a rich, premium design.
- **Robust Error Handling**: Handles API failures, malformed JSON, and empty responses gracefully with retry mechanisms.
- **Mobile Responsive**: Designed to look and function perfectly on both desktop and mobile devices.

## Setup & Running Locally

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Configure API Keys:**
   Create a `.env.local` file in the root directory and add your Groq API key:
   ```env
   GROQ_API_KEY=your_groq_api_key_here
   ```

3. **Start the development server:**
   ```bash
   npm run dev
   ```

4. **Open the App:**
   Navigate to [http://localhost:3000](http://localhost:3000) in your browser.

## Known Limitations
- The application currently relies on a single LLM provider (Groq) and does not support streaming (which could improve perceived latency for long itineraries).
- AI output is unpredictable, and very complex edge cases in JSON formatting might still occasionally require a retry.
- Reordering is currently limited to moving stops up and down within the same day. Moving stops across different days is not yet supported.

## AI-usage Note
This project was primarily built with the assistance of an AI coding agent (Antigravity). AI was used for scaffolding the Next.js application, generating the React components, styling the UI with glassmorphism CSS, and designing the LLM integration logic. All code was carefully reviewed and validated to ensure it meets the assignment requirements and best practices.

## Time Spent
Total time spent: ~1 hour (accelerated via AI agent workflow).
