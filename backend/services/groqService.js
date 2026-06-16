const Groq = require("groq-sdk");

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

async function generateRoadmap(goal, days) {

  const completion =
    await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",

      messages: [
        {
          role: "user",
          content: `
Create a study roadmap.

Goal: ${goal}
Days Available: ${days}

Return ONLY valid JSON.

Example:

[
  {
    "day": 1,
    "topic": "Introduction"
  }
]
`
        }
      ]
    });

  return completion.choices[0].message.content;
}

module.exports = generateRoadmap;