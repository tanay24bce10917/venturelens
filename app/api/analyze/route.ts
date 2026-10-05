import OpenAI from "openai";

const analysisSchema = {
  type: "object",
  properties: {
    problemScore: {
      type: "number",
    },
    problemSummary: {
      type: "string",
    },
    opportunities: {
      type: "array",
      items: {
        type: "object",
        properties: {
          title: { type: "string" },
          description: { type: "string" },
          score: { type: "number" },
          investment: { type: "string" },
          revenueModel: { type: "string" },
          demand: {
            type: "string",
            enum: ["High", "Medium", "Low"],
          },
          competition: {
            type: "string",
            enum: ["High", "Medium", "Low"],
          },
        },
        required: [
          "title",
          "description",
          "score",
          "investment",
          "revenueModel",
          "demand",
          "competition",
        ],
        additionalProperties: false,
      },
    },
    market: {
      type: "object",
      properties: {
        customerDemand: {
          type: "string",
          enum: ["High", "Medium", "Low"],
        },
        marketAccessibility: {
          type: "string",
          enum: ["High", "Medium", "Low"],
        },
        competitivePressure: {
          type: "string",
          enum: ["High", "Medium", "Low"],
        },
        scalability: {
          type: "string",
          enum: ["High", "Medium", "Low"],
        },
        targetCustomers: {
          type: "array",
          items: {
            type: "string",
          },
        },
      },
      required: [
        "customerDemand",
        "marketAccessibility",
        "competitivePressure",
        "scalability",
        "targetCustomers",
      ],
      additionalProperties: false,
    },
    risks: {
      type: "array",
      items: {
        type: "string",
      },
    },
    ethicalConsiderations: {
      type: "array",
      items: {
        type: "string",
      },
    },
    launchPlan: {
      type: "array",
      items: {
        type: "object",
        properties: {
          day: { type: "string" },
          action: { type: "string" },
        },
        required: ["day", "action"],
        additionalProperties: false,
      },
    },
  },
  required: [
    "problemScore",
    "problemSummary",
    "opportunities",
    "market",
    "risks",
    "ethicalConsiderations",
    "launchPlan",
  ],
  additionalProperties: false,
};

export async function POST(request: Request) {
  try {
    const apiKey = process.env.OPENAI_API_KEY;

    if (!apiKey) {
      return Response.json(
        {
          error:
            "OPENAI_API_KEY is not configured on the server. Add it in Vercel Environment Variables.",
        },
        { status: 500 }
      );
    }

    const body = await request.json();
    const problem = body?.problem;

    if (!problem || typeof problem !== "string") {
      return Response.json(
        {
          error: "Please describe a consumer problem.",
        },
        { status: 400 }
      );
    }

    const client = new OpenAI({
      apiKey,
    });

    const response = await client.responses.create({
      model: "gpt-5.5",

      instructions: `
You are VentureLens, an AI-powered business opportunity analyst.

Your job is to transform a real consumer problem into realistic startup opportunities.

Analyze:
- the consumer pain
- potential business opportunities
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

Focus on realistic opportunities that could actually be started by a student or early-stage entrepreneur in India.

Do not invent precise market statistics.
Do not claim that estimates are verified market research.

Return structured data matching the supplied schema.
`,

      input: `
Consumer problem:

${problem}

Generate exactly 3 realistic business opportunities.

Investment ranges should be realistic Indian startup estimates such as:
₹10K–₹50K
₹50K–₹2L
₹2L–₹5L

Give practical revenue models.

Identify specific customer groups.

Identify realistic business risks.

Include ethical considerations where relevant.

Create a practical 5–7 step launch plan.
`,

      text: {
        format: {
          type: "json_schema",
          name: "venturelens_analysis",
          strict: true,
          schema: analysisSchema,
        },
      },
    });

    if (!response.output_text) {
      return Response.json(
        {
          error: "The AI returned an empty response. Please try again.",
        },
        { status: 502 }
      );
    }

    const result = JSON.parse(response.output_text);

    return Response.json(result);
  } catch (error) {
    console.error("VentureLens API error:", error);

    const message =
      error instanceof Error ? error.message : "Unknown server error";

    return Response.json(
      {
        error: `AI analysis failed: ${message}`,
      },
      { status: 500 }
    );
  }
}
