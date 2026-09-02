import { NextResponse } from 'next/server';
import Groq from 'groq-sdk';

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

export async function POST(req: Request) {
  try {
    const { prompt } = await req.json();

    if (!prompt) {
      return NextResponse.json({ error: 'Prompt is required' }, { status: 400 });
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
      model: 'llama-3.1-70b-versatile',
      temperature: 0.7,
      response_format: { type: 'json_object' }
    });

    const responseContent = completion.choices[0]?.message?.content;
    
    if (!responseContent) {
      throw new Error("Empty response from the model");
    }

    // Try to parse it to ensure it's valid JSON before sending it to the client
    const parsedJson = JSON.parse(responseContent);

    return NextResponse.json(parsedJson);
  } catch (error: any) {
    console.error('Groq API Error:', error);
    // Determine if it's a parsing error or an API error
    if (error instanceof SyntaxError) {
      return NextResponse.json({ error: 'Failed to parse AI output as JSON. Please try again.' }, { status: 500 });
    }
    return NextResponse.json({ error: error.message || 'An error occurred while planning the trip.' }, { status: 500 });
  }
}
