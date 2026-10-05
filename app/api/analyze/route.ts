import OpenAI from "openai";

function createDemoAnalysis(problem: string) {
  const text = problem.toLowerCase();

  let opportunities;

  if (
    text.includes("storage") ||
    text.includes("belongings") ||
    text.includes("semester break") ||
    text.includes("hostel")
  ) {
    opportunities = [
      {
        title: "Student Storage Network",
        description:
          "A local storage service that collects student belongings before semester breaks and returns them when students return.",
        score: 91,
        investment: "₹25K–₹75K",
        revenueModel: "Storage fee + pickup/delivery charges",
        demand: "High",
        competition: "Medium",
      },
      {
        title: "Hostel Storage Lockers",
        description:
          "Secure short-term storage lockers placed near college campuses for students who need temporary space.",
        score: 86,
        investment: "₹50K–₹2L",
        revenueModel: "Weekly or monthly locker rental",
        demand: "High",
        competition: "Medium",
      },
      {
        title: "Student-to-Student Storage",
        description:
          "A marketplace connecting students who need storage with local residents, shops or unused rooms offering spare space.",
        score: 82,
        investment: "₹10K–₹50K",
        revenueModel: "Commission on storage bookings",
        demand: "Medium",
        competition: "Low",
      },
    ];
  } else if (
    text.includes("food") ||
    text.includes("meal") ||
    text.includes("hungry") ||
    text.includes("canteen")
  ) {
    opportunities = [
      {
        title: "Affordable Meal Subscription",
        description:
          "A subscription service providing affordable home-style meals for students and young professionals.",
        score: 89,
        investment: "₹30K–₹1L",
        revenueModel: "Weekly and monthly subscriptions",
        demand: "High",
        competition: "Medium",
      },
      {
        title: "Campus Meal Marketplace",
        description:
          "A platform connecting students with local home chefs and small food businesses near campuses.",
        score: 84,
        investment: "₹15K–₹60K",
        revenueModel: "Commission per order",
        demand: "High",
        competition: "High",
      },
      {
        title: "Late-Night Food Delivery",
        description:
          "A focused delivery service for affordable meals and snacks during late evening and night hours.",
        score: 80,
        investment: "₹25K–₹80K",
        revenueModel: "Delivery fee + restaurant commission",
        demand: "High",
        competition: "High",
      },
    ];
  } else if (
    text.includes("waste") ||
    text.includes("plastic") ||
    text.includes("recycl")
  ) {
    opportunities = [
      {
        title: "Doorstep Recycling Pickup",
        description:
          "A scheduled pickup service that collects recyclable household waste directly from apartments.",
        score: 88,
        investment: "₹20K–₹70K",
        revenueModel: "Pickup subscription + recycling partnerships",
        demand: "High",
        competition: "Medium",
      },
      {
        title: "Campus Recycling Service",
        description:
          "A waste collection and sorting service designed specifically for colleges, hostels and student communities.",
        score: 84,
        investment: "₹30K–₹1L",
        revenueModel: "Institutional contracts + recyclable material sales",
        demand: "High",
        competition: "Medium",
      },
      {
        title: "Upcycled Product Marketplace",
        description:
          "A marketplace selling useful products created from recyclable or discarded materials.",
        score: 78,
        investment: "₹15K–₹60K",
        revenueModel: "Product sales + marketplace commission",
        demand: "Medium",
        competition: "Medium",
      },
    ];
  } else if (
    text.includes("job") ||
    text.includes("employment") ||
    text.includes("work") ||
    text.includes("part-time") ||
    text.includes("freelance")
  ) {
    opportunities = [
      {
        title: "Student Skill Marketplace",
        description:
          "A platform connecting students with local businesses that need affordable short-term services.",
        score: 90,
        investment: "₹15K–₹60K",
        revenueModel: "Commission on completed jobs",
        demand: "High",
        competition: "Medium",
      },
      {
        title: "Campus Part-Time Jobs",
        description:
          "A verified job board focused on flexible work opportunities that fit around student schedules.",
        score: 86,
        investment: "₹10K–₹40K",
        revenueModel: "Employer listing fees",
        demand: "High",
        competition: "Medium",
      },
      {
        title: "Micro-Internship Platform",
        description:
          "A platform offering students short projects that build practical experience and generate income.",
        score: 84,
        investment: "₹20K–₹70K",
        revenueModel: "Employer subscription + placement fee",
        demand: "High",
        competition: "Medium",
      },
    ];
  } else {
    opportunities = [
      {
        title: "Problem-Specific Service",
        description:
          "A focused service designed around solving the consumer problem through a simple, convenient experience.",
        score: 84,
        investment: "₹20K–₹75K",
        revenueModel: "Direct service fees",
        demand: "Medium",
        competition: "Medium",
      },
      {
        title: "Digital Marketplace",
        description:
          "A platform connecting consumers experiencing the problem with providers who can solve it.",
        score: 80,
        investment: "₹25K–₹1L",
        revenueModel: "Transaction commission",
        demand: "Medium",
        competition: "Medium",
      },
      {
        title: "Subscription Solution",
        description:
          "A recurring service that solves the problem continuously for customers who experience it frequently.",
        score: 77,
        investment: "₹30K–₹1.5L",
        revenueModel: "Monthly or annual subscription",
        demand: "Medium",
        competition: "Medium",
      },
    ];
  }

  return {
    problemScore: 87,

    problemSummary:
      `The problem describes a clear consumer pain point: ${problem} A viable business opportunity exists if the solution can deliver convenience, affordability and a better customer experience.`,

    opportunities,

    market: {
      customerDemand: "High",
      marketAccessibility: "High",
      competitivePressure: "Medium",
      scalability: "High",
      targetCustomers: [
        "Students and young consumers",
        "Price-sensitive customers",
        "Customers seeking convenient solutions",
        "Local communities",
      ],
    },

    risks: [
      "Customer acquisition may be expensive during the early stage.",
      "Existing competitors may offer similar solutions.",
      "Operational costs could increase as the customer base grows.",
      "Customer trust and service quality must be maintained consistently.",
      "The business should validate demand before making large investments.",
    ],

    ethicalConsiderations: [
      "Protect customer data and personal information.",
      "Keep pricing transparent and avoid hidden charges.",
      "Provide reliable service and communicate limitations clearly.",
      "Avoid exploiting customers who have limited alternatives.",
    ],

    launchPlan: [
      {
        day: "Days 1–3",
        action: "Interview 10–20 potential customers and validate the problem.",
      },
      {
        day: "Days 4–7",
        action: "Study existing competitors and identify an underserved segment.",
      },
      {
        day: "Week 2",
        action: "Create a simple landing page and collect early sign-ups.",
      },
      {
        day: "Week 3",
        action: "Build a small MVP focused on the core customer problem.",
      },
      {
        day: "Week 4",
        action: "Run a pilot with a small group of real customers.",
      },
      {
        day: "Week 5",
        action: "Measure customer feedback, costs and willingness to pay.",
      },
      {
        day: "Week 6",
        action: "Improve the model and begin expanding to nearby customers.",
      },
    ],
  };
}

export async function POST(request: Request) {
  try {
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

    /*
     * Try the real AI first.
     * If the API is unavailable or has no credits,
     * automatically use the free demo analysis.
     */

    if (process.env.OPENAI_API_KEY) {
      try {
        const client = new OpenAI({
          apiKey: process.env.OPENAI_API_KEY,
        });

        const response = await client.responses.create({
          model: "gpt-5.5",

          instructions: `
You are VentureLens, an AI-powered business opportunity analyst.

Analyze the consumer problem and generate realistic startup opportunities.

Return practical business opportunities suitable for an early-stage entrepreneur in India.

Do not invent precise market statistics.
`,

          input: `
Analyze this consumer problem:

${problem}

Return exactly 3 business opportunities.

For each opportunity provide:
- title
- description
- score from 0 to 100
- realistic Indian investment range
- revenue model
- demand
- competition

Also provide:
- problem score
- problem summary
- market analysis
- target customers
- business risks
- ethical considerations
- 5-7 launch plan steps
`,

          text: {
            format: {
              type: "json_schema",
              name: "venturelens_analysis",
              strict: true,
              schema: {
                type: "object",
                properties: {
                  problemScore: { type: "number" },
                  problemSummary: { type: "string" },

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
                        items: { type: "string" },
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
                    items: { type: "string" },
                  },

                  ethicalConsiderations: {
                    type: "array",
                    items: { type: "string" },
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
              },
            },
          },
        });

        if (response.output_text) {
          return Response.json(JSON.parse(response.output_text));
        }
      } catch (error) {
        console.log(
          "OpenAI unavailable. Using VentureLens demo analysis.",
          error
        );
      }
    }

    return Response.json(createDemoAnalysis(problem));
  } catch (error) {
    console.error("VentureLens error:", error);

    return Response.json(
      {
        error: "Unable to analyze the opportunity.",
      },
      { status: 500 }
    );
  }
}
