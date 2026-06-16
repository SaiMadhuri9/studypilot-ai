const { GoogleGenAI } = require("@google/genai");

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

async function generateRoadmap(goal, days) {

  const prompt = `
Create a study roadmap.

Goal: ${goal}
Days Available: ${days}

Return ONLY valid JSON.
`;

  const response = await ai.models.generateContent({
    model: "gemini-2.0-flash",
    contents: prompt,
  });

  return response.text;
}

module.exports = generateRoadmap;