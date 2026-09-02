import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import Groq from 'groq-sdk';

dotenv.config({ path: '.env.local' });

const app = express();
const port = 3001;

app.use(cors());
app.use(express.json());

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

app.post('/api/trip', async (req, res) => {
  try {
    const { prompt } = req.body;

    if (!prompt) {
      return res.status(400).json({ error: 'Prompt is required' });
    }

    const systemPrompt = `You are an expert travel planner. You must return a detailed day-by-day itinerary based on the user's request. 
You must respond with ONLY a valid JSON object. Do not include markdown formatting like \`\`\`json or \`\`\`. Do not include any explanations.

The JSON MUST match this exact schema:
{
  "title": "A catchy title for the trip",
  "summary": "A short 1-2 sentence summary of the trip",
  "days": [
    {
      "dayNumber": 1,
      "theme": "A theme for the day (e.g., Historic City Center)",
      "stops": [
        {
          "id": "unique-string-id",
          "time": "e.g. 09:00 AM",
          "activity": "Activity Name",
          "description": "Details about what to do",
          "duration": "Estimated duration (e.g. 2 hours)"
        }
      ]
    }
  ]
}`;

    const completion = await groq.chat.completions.create({
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: prompt },
      ],
      model: 'openai/gpt-oss-20b',
      temperature: 0.7,
      response_format: { type: 'json_object' }
    });

    const responseContent = completion.choices[0]?.message?.content;
    
    if (!responseContent) {
      throw new Error("Empty response from the model");
    }

    const parsedJson = JSON.parse(responseContent);
    res.json(parsedJson);

  } catch (error) {
    console.error('Groq API Error:', error);
    if (error instanceof SyntaxError) {
      return res.status(500).json({ error: 'Failed to parse AI output as JSON. Please try again.' });
    }
    res.status(500).json({ error: error.message || 'An error occurred while planning the trip.' });
  }
});

app.listen(port, () => {
  console.log(`Backend server running on http://localhost:${port}`);
});
