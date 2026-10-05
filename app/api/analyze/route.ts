import OpenAI from "openai";


export async function POST(request: Request) {
    const client = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });
  try {
    const { problem } = await request.json();

    if (!problem || typeof problem !== "string") {
      return Response.json(
        { error: "Please describe a consumer problem." },
        { status: 400 }
      );
    }

    const response = await client.responses.create({
      model: "gpt-5.5",

      instructions: `
You are VentureLens, an AI-powered business opportunity analyst.

Your job is to take a consumer problem and turn it into realistic startup opportunities.

Analyze:
- consumer pain
- business opportunities
- target customers
- market demand
- market accessibility
- competition
- scalability
- startup investment
- revenue model
- business risks
- ethical considerations
- practical launch plan

Do not invent precise statistics.
Do not pretend estimates are verified market research.

Return ONLY valid JSON.
`,

      input: `
Analyze this consumer problem:

${problem}

Return exactly this JSON structure:

{
  "problemScore": 0,
  "problemSummary": "",
  "opportunities": [
    {
      "title": "",
      "description": "",
      "score": 0,
      "investment": "",
      "revenueModel": "",
      "demand": "High",
      "competition": "Medium"
    }
  ],
  "market": {
    "customerDemand": "High",
    "marketAccessibility": "High",
    "competitivePressure": "Medium",
    "scalability": "High",
    "targetCustomers": []
  },
  "risks": [],
  "ethicalConsiderations": [],
  "launchPlan": [
    {
      "day": "",
      "action": ""
    }
  ]
}

Requirements:

- Give exactly 3 opportunities.
- Scores must be between 0 and 100.
- Use realistic Indian startup investment ranges such as ₹10K–₹50K.
- Give realistic revenue models.
- Make target customers specific.
- Give practical business risks.
- Include relevant ethical considerations.
- Give 5-7 practical launch-plan steps.
- Do not invent exact market-size statistics.
`
    });

    const result = JSON.parse(response.output_text);

    return Response.json(result);

  } catch (error) {
    console.error("VentureLens API error:", error);

    return Response.json(
      {
        error: "Unable to analyze the opportunity. Please try again."
      },
      { status: 500 }
    );
  }
}
