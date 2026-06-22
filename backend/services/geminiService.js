const { GoogleGenAI } = require("@google/genai");

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

async function generateRoadmap(goal, days) {

  const prompt = `
Create a study roadmap.

Goal: ${goal}
Days Available: ${days}

Return ONLY valid JSON in this format:

[
  {
    "day": 1,
    "topic": "Introduction"
  }
]

Rules:
- Return only JSON
- No markdown
- No explanation
- No \`\`\`json block
- Generate exactly enough topics for the number of days
`;

  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: prompt,
  });

  return response.text.trim();
}

async function generateResources(goal) {

  const prompt = `
Generate learning resources for ${goal}.

Return ONLY valid JSON.

{
  "videos": [
    {
      "title": "",
      "url": ""
    }
  ],
  "docs": [
    {
      "title": "",
      "url": ""
    }
  ],
  "practice": [
    {
      "title": "",
      "url": ""
    }
  ],
  "projects": [
    {
      "title": "",
      "url": ""
    }
  ]
}

Rules:
- Return only JSON
- No markdown
- No explanation
- URLs must be real and valid
- Include 3 resources for each category
`;
  const response =
    await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
    });

  return response.text.trim();
}

module.exports = {
  generateRoadmap,
  generateResources
};