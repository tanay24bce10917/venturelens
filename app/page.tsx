"use client";

import { useState } from "react";

type Opportunity = {
  title: string;
  description: string;
  score: number;
  investment: string;
  revenueModel: string;
  demand: "High" | "Medium" | "Low";
  competition: "High" | "Medium" | "Low";
};

type Analysis = {
  problemScore: number;
  problemSummary: string;
  opportunities: Opportunity[];
  market: {
    customerDemand: "High" | "Medium" | "Low";
    marketAccessibility: "High" | "Medium" | "Low";
    competitivePressure: "High" | "Medium" | "Low";
    scalability: "High" | "Medium" | "Low";
    targetCustomers: string[];
  };
  risks: string[];
  ethicalConsiderations: string[];
  launchPlan: {
    day: string;
    action: string;
  }[];
};

const examples = [
  {
    name: "Students",
    text: "College students struggle to find affordable short-term storage for their belongings during semester breaks.",
  },
  {
    name: "Local businesses",
    text: "Small local businesses struggle to create consistent social media content and attract new customers.",
  },
  {
    name: "Environment",
    text: "Apartment residents find it difficult to recycle household waste because there are no convenient collection services nearby.",
  },
  {
    name: "Employment",
    text: "College students struggle to find flexible part-time work that matches their skills and class schedules.",
  },
];

async function analyzeProblem(text: string) {
  const response = await fetch("/api/analyze", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      problem: text,
    }),
  });

  const raw = await response.text();

  let data: any = null;

  try {
    data = raw ? JSON.parse(raw) : null;
  } catch {
    throw new Error(
      `The server returned an invalid response (${response.status}).`
    );
  }

  if (!response.ok) {
    throw new Error(
      data?.error ||
        `The analysis request failed with status ${response.status}.`
    );
  }

  if (!data) {
    throw new Error("The server returned an empty response.");
  }

  return data as Analysis;
}

export default function Home() {
  const [problem, setProblem] = useState("");
  const [analysis, setAnalysis] = useState<Analysis | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [selected, setSelected] = useState(0);
  const [activeTab, setActiveTab] = useState("overview");
  const [saved, setSaved] = useState(false);

  const runAnalysis = async () => {
    const finalProblem = problem.trim();

    if (!finalProblem) {
      setError("Please describe a consumer problem first.");
      return;
    }

    setLoading(true);
    setError("");
    setAnalysis(null);
    setSaved(false);

    try {
      const result = await analyzeProblem(finalProblem);

      setAnalysis(result);
      setSelected(0);
      setActiveTab("overview");

      setTimeout(() => {
        document
          .getElementById("results")
          ?.scrollIntoView({ behavior: "smooth" });
      }, 100);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to analyze the opportunity."
      );
    } finally {
      setLoading(false);
    }
  };

  const useExample = (text: string) => {
    setProblem(text);
    setError("");
  };

  return (
    <main className="site">
      <header className="nav">
        <div className="logo">
          VENTURE<span>LENS</span>
        </div>

        <div className="navRight">AI BUSINESS OPPORTUNITY</div>
      </header>

      <section className="hero">
        <div className="eyebrow">
          CONSUMER PROBLEM → BUSINESS OPPORTUNITY
        </div>

        <h1>
          Find the business
          <br />
          hiding in a problem.
        </h1>

        <p className="heroText">
          Describe a real consumer problem. VentureLens uses AI to identify
          startup opportunities, evaluate the market, assess risks and build a
          practical launch direction.
        </p>
      </section>

      <section className="scanner">
        <div className="scannerTop">
          <div className="question">WHO IS EXPERIENCING IT?</div>

          <div className="categories">
            {examples.map((item) => (
              <button
                key={item.name}
                className={
                  problem === item.text
                    ? "category active"
                    : "category"
                }
                onClick={() => useExample(item.text)}
              >
                {item.name}
              </button>
            ))}
          </div>
        </div>

        <textarea
          value={problem}
          maxLength={500}
          onChange={(e) => {
            setProblem(e.target.value);
            setError("");
          }}
          placeholder="Describe a real consumer problem..."
        />

        <div className="scannerBottom">
          <span>{problem.length}/500</span>

          <button
            className="analyzeButton"
            onClick={runAnalysis}
            disabled={loading}
          >
            {loading ? "Analyzing..." : "Analyze opportunity ✦"}
          </button>
        </div>
      </section>

      {error && (
        <div className="errorBox">
          {error}
        </div>
      )}

      {loading && (
        <section className="loadingBox">
          <div className="loader" />
          <div>
            <strong>Analyzing the opportunity...</strong>
            <p>
              VentureLens is evaluating demand, competition, risks and
              potential business models.
            </p>
          </div>
        </section>
      )}

      {analysis && !loading && (
        <section className="results" id="results">
          <div className="resultsHeader">
            <div>
              <div className="eyebrow">AI ANALYSIS</div>
              <h2>Opportunity report</h2>
            </div>

            <button
              className={saved ? "saveButton saved" : "saveButton"}
              onClick={() => setSaved(!saved)}
            >
              {saved ? "Saved ✓" : "Save opportunity"}
            </button>
          </div>

          <div className="scoreGrid">
            <div className="scoreCard">
              <div className="scoreNumber">
                {analysis.problemScore}
              </div>
              <div>
                <div className="cardLabel">PROBLEM SCORE</div>
                <p>
                  Strength of the consumer problem and potential for a
                  business solution.
                </p>
              </div>
            </div>

            <div className="summaryCard">
              <div className="cardLabel">PROBLEM INSIGHT</div>
              <p>{analysis.problemSummary}</p>
            </div>
          </div>

          <div className="opportunitySection">
            <div className="sectionLabel">TOP BUSINESS OPPORTUNITIES</div>

            <div className="opportunityGrid">
              {analysis.opportunities.map((opportunity, index) => (
                <button
                  key={opportunity.title}
                  className={
                    selected === index
                      ? "opportunityCard selected"
                      : "opportunityCard"
                  }
                  onClick={() => setSelected(index)}
                >
                  <div className="opportunityNumber">
                    0{index + 1}
                  </div>

                  <h3>{opportunity.title}</h3>

                  <p>{opportunity.description}</p>

                  <div className="opportunityFooter">
                    <span>
                      Score <strong>{opportunity.score}</strong>
                    </span>

                    <span className="arrow">↗</span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {analysis.opportunities[selected] && (
            <section className="detail">
              <div className="detailHeader">
                <div>
                  <div className="eyebrow">
                    OPPORTUNITY 0{selected + 1}
                  </div>
                  <h2>
                    {analysis.opportunities[selected].title}
                  </h2>
                </div>

                <div className="detailScore">
                  {analysis.opportunities[selected].score}
                  <span>/100</span>
                </div>
              </div>

              <div className="tabs">
                {["overview", "market", "risks", "business"].map(
                  (tab) => (
                    <button
                      key={tab}
                      className={
                        activeTab === tab ? "tab active" : "tab"
                      }
                      onClick={() => setActiveTab(tab)}
                    >
                      {tab}
                    </button>
                  )
                )}
              </div>

              {activeTab === "overview" && (
                <div className="tabContent">
                  <div className="detailDescription">
                    {analysis.opportunities[selected].description}
                  </div>

                  <div className="metrics">
                    <Metric
                      label="STARTUP INVESTMENT"
                      value={
                        analysis.opportunities[selected].investment
                      }
                    />

                    <Metric
                      label="REVENUE MODEL"
                      value={
                        analysis.opportunities[selected].revenueModel
                      }
                    />

                    <Metric
                      label="CUSTOMER DEMAND"
                      value={
                        analysis.opportunities[selected].demand
                      }
                    />

                    <Metric
                      label="COMPETITION"
                      value={
                        analysis.opportunities[selected].competition
                      }
                    />
                  </div>

                  <div className="customerBox">
                    <div className="cardLabel">TARGET CUSTOMERS</div>

                    <div className="tags">
                      {analysis.market.targetCustomers.map(
                        (customer) => (
                          <span className="tag" key={customer}>
                            {customer}
                          </span>
                        )
                      )}
                    </div>
                  </div>
                </div>
              )}

              {activeTab === "market" && (
                <div className="tabContent">
                  <div className="marketGrid">
                    <Metric
                      label="CUSTOMER DEMAND"
                      value={analysis.market.customerDemand}
                    />

                    <Metric
                      label="MARKET ACCESSIBILITY"
                      value={analysis.market.marketAccessibility}
                    />

                    <Metric
                      label="COMPETITIVE PRESSURE"
                      value={analysis.market.competitivePressure}
                    />

                    <Metric
                      label="SCALABILITY"
                      value={analysis.market.scalability}
                    />
                  </div>

                  <div className="customerBox">
                    <div className="cardLabel">TARGET CUSTOMERS</div>

                    <div className="tags">
                      {analysis.market.targetCustomers.map(
                        (customer) => (
                          <span className="tag" key={customer}>
                            {customer}
                          </span>
                        )
                      )}
                    </div>
                  </div>
                </div>
              )}

              {activeTab === "risks" && (
                <div className="tabContent twoColumns">
                  <div>
                    <div className="cardLabel">BUSINESS RISKS</div>

                    <div className="list">
                      {analysis.risks.map((risk, index) => (
                        <div className="listItem" key={index}>
                          <span>{String(index + 1).padStart(2, "0")}</span>
                          {risk}
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <div className="cardLabel">
                      ETHICAL CONSIDERATIONS
                    </div>

                    <div className="list">
                      {analysis.ethicalConsiderations.map(
                        (item, index) => (
                          <div className="listItem" key={index}>
                            <span>+</span>
                            {item}
                          </div>
                        )
                      )}
                    </div>
                  </div>
                </div>
              )}

              {activeTab === "business" && (
                <div className="tabContent">
                  <div className="cardLabel">
                    PRACTICAL LAUNCH PLAN
                  </div>

                  <div className="launchPlan">
                    {analysis.launchPlan.map((step, index) => (
                      <div className="launchStep" key={index}>
                        <div className="day">
                          {step.day}
                        </div>

                        <div className="stepNumber">
                          {String(index + 1).padStart(2, "0")}
                        </div>

                        <div className="stepAction">
                          {step.action}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </section>
          )}
        </section>
      )}

      <footer>
        <div>VENTURELENS</div>
        <div>TURN PROBLEMS INTO POSSIBILITIES.</div>
      </footer>

      <style jsx global>{`
        * {
          box-sizing: border-box;
        }

        html {
          scroll-behavior: smooth;
        }

        body {
          margin: 0;
          background: #080909;
          color: #e9e8e3;
          font-family:
            Arial,
            Helvetica,
            sans-serif;
        }

        button,
        textarea {
          font: inherit;
        }

        button {
          cursor: pointer;
        }

        .site {
          min-height: 100vh;
          background:
            radial-gradient(
              circle at 76% 27%,
              rgba(210, 225, 142, 0.2),
              transparent 25%
            ),
            #080909;
        }

        .nav {
          height: 86px;
          border-bottom: 1px solid #4d4b3e;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0 6%;
          background: rgba(8, 9, 9, 0.88);
        }

        .logo {
          font-size: 20px;
          font-weight: 900;
          letter-spacing: -1px;
        }

        .logo span {
          color: #d7ef00;
        }

        .navRight {
          color: #a8a79d;
          font-size: 12px;
          letter-spacing: 2px;
        }

        .hero {
          min-height: 580px;
          padding: 55px 6% 80px;
          text-align: center;
          background:
            radial-gradient(
              circle at 72% 38%,
              rgba(224, 235, 167, 0.3),
              transparent 24%
            ),
            radial-gradient(
              circle at 70% 40%,
              rgba(150, 160, 120, 0.14),
              transparent 38%
            );
        }

        .eyebrow,
        .sectionLabel,
        .question,
        .cardLabel {
          color: #b9b6a8;
          font-size: 12px;
          letter-spacing: 3px;
          text-transform: uppercase;
        }

        .hero h1 {
          margin: 32px auto 30px;
          max-width: 1000px;
          font-size: clamp(58px, 7vw, 100px);
          line-height: 0.93;
          letter-spacing: -5px;
          font-weight: 700;
        }

        .heroText {
          max-width: 720px;
          margin: auto;
          color: #a8a69d;
          font-size: 18px;
          line-height: 1.7;
        }

        .scanner {
          width: 94%;
          max-width: 1500px;
          margin: -30px auto 100px;
          border: 1px solid #5b5849;
          border-radius: 34px;
          background: #0c0d0d;
          overflow: hidden;
        }

        .scannerTop {
          padding: 32px 38px 20px;
          display: flex;
          align-items: center;
          gap: 24px;
          flex-wrap: wrap;
        }

        .categories {
          display: flex;
          gap: 14px;
          flex-wrap: wrap;
        }

        .category {
          border: 1px solid #59564b;
          border-radius: 30px;
          background: transparent;
          color: #dddcd6;
          padding: 12px 22px;
          transition: 0.2s;
        }

        .category:hover,
        .category.active {
          background: #d5ef00;
          color: #111;
          border-color: #d5ef00;
        }

        textarea {
          display: block;
          width: 100%;
          min-height: 290px;
          resize: vertical;
          border: 0;
          border-top: 1px solid #393833;
          border-bottom: 1px solid #393833;
          outline: none;
          background: #0c0d0d;
          color: #e9e8e3;
          padding: 38px 40px;
          font-size: clamp(25px, 3vw, 43px);
          line-height: 1.2;
        }

        textarea::placeholder {
          color: #56564f;
        }

        .scannerBottom {
          min-height: 118px;
          padding: 28px 38px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          color: #aaa89e;
        }

        .analyzeButton {
          border: 0;
          background: #050505;
          color: #eee;
          padding: 20px 32px;
          border-radius: 40px;
          font-weight: 700;
          transition: 0.2s;
        }

        .analyzeButton:hover:not(:disabled) {
          background: #d5ef00;
          color: #111;
        }

        .analyzeButton:disabled {
          opacity: 0.6;
          cursor: wait;
        }

        .errorBox {
          width: 94%;
          max-width: 1500px;
          margin: -55px auto 70px;
          padding: 22px 25px;
          border: 1px solid #773d3d;
          border-radius: 18px;
          background: #1b0d0d;
          color: #ff8585;
        }

        .loadingBox {
          width: 94%;
          max-width: 1500px;
          margin: -45px auto 90px;
          padding: 35px;
          border: 1px solid #555342;
          border-radius: 22px;
          display: flex;
          gap: 25px;
          align-items: center;
          background: #10110f;
        }

        .loadingBox p {
          color: #99988f;
          margin-bottom: 0;
        }

        .loader {
          width: 38px;
          height: 38px;
          border: 3px solid #45453c;
          border-top-color: #d5ef00;
          border-radius: 50%;
          animation: spin 0.8s linear infinite;
        }

        @keyframes spin {
          to {
            transform: rotate(360deg);
          }
        }

        .results {
          width: 94%;
          max-width: 1500px;
          margin: 0 auto 100px;
        }

        .resultsHeader,
        .detailHeader {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 30px;
          margin-bottom: 35px;
        }

        .results h2,
        .detail h2 {
          font-size: clamp(38px, 5vw, 65px);
          letter-spacing: -3px;
          margin: 10px 0 0;
        }

        .saveButton {
          border: 1px solid #57554a;
          border-radius: 30px;
          background: transparent;
          color: #ddd;
          padding: 14px 22px;
        }

        .saveButton.saved {
          background: #d5ef00;
          border-color: #d5ef00;
          color: #111;
        }

        .scoreGrid {
          display: grid;
          grid-template-columns: 1fr 2fr;
          gap: 18px;
          margin-bottom: 70px;
        }

        .scoreCard,
        .summaryCard,
        .customerBox,
        .metric,
        .detail {
          border: 1px solid #47463e;
          background: #0d0e0e;
          border-radius: 24px;
        }

        .scoreCard {
          padding: 32px;
          display: flex;
          gap: 28px;
          align-items: center;
        }

        .scoreNumber {
          font-size: 65px;
          font-weight: 700;
          color: #d5ef00;
        }

        .scoreCard p,
        .summaryCard p {
          color: #aaa9a0;
          line-height: 1.6;
        }

        .summaryCard {
          padding: 32px;
        }

        .summaryCard p {
          font-size: 20px;
          margin-bottom: 0;
        }

        .opportunitySection {
          margin-bottom: 70px;
        }

        .sectionLabel {
          margin-bottom: 20px;
        }

        .opportunityGrid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 18px;
        }

        .opportunityCard {
          min-height: 290px;
          padding: 30px;
          text-align: left;
          border: 1px solid #48473e;
          border-radius: 24px;
          background: #0d0e0e;
          color: #eee;
          transition: 0.2s;
        }

        .opportunityCard:hover,
        .opportunityCard.selected {
          border-color: #d5ef00;
          transform: translateY(-3px);
        }

        .opportunityNumber {
          color: #d5ef00;
          font-size: 13px;
          letter-spacing: 2px;
        }

        .opportunityCard h3 {
          font-size: 28px;
          line-height: 1.1;
          margin: 35px 0 15px;
          letter-spacing: -1px;
        }

        .opportunityCard p {
          color: #9d9c94;
          line-height: 1.5;
        }

        .opportunityFooter {
          margin-top: 30px;
          display: flex;
          justify-content: space-between;
          color: #aaa99f;
        }

        .opportunityFooter strong {
          color: #d5ef00;
        }

        .arrow {
          font-size: 20px;
        }

        .detail {
          padding: 40px;
        }

        .detailScore {
          font-size: 50px;
          color: #d5ef00;
          font-weight: 700;
        }

        .detailScore span {
          color: #77776f;
          font-size: 18px;
          font-weight: 400;
        }

        .tabs {
          display: flex;
          gap: 8px;
          border-bottom: 1px solid #3d3c36;
          margin-bottom: 35px;
        }

        .tab {
          border: 0;
          background: transparent;
          color: #77766e;
          padding: 15px 20px;
          text-transform: capitalize;
        }

        .tab.active {
          color: #d5ef00;
          border-bottom: 2px solid #d5ef00;
        }

        .tabContent {
          min-height: 300px;
        }

        .detailDescription {
          max-width: 900px;
          color: #d3d2cc;
          font-size: 22px;
          line-height: 1.55;
          margin-bottom: 35px;
        }

        .metrics,
        .marketGrid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 14px;
          margin-bottom: 20px;
        }

        .metric {
          padding: 24px;
        }

        .metricValue {
          margin-top: 18px;
          font-size: 20px;
          color: #eee;
          font-weight: 600;
        }

        .customerBox {
          padding: 25px;
          margin-top: 20px;
        }

        .tags {
          display: flex;
          gap: 10px;
          flex-wrap: wrap;
          margin-top: 18px;
        }

        .tag {
          padding: 10px 15px;
          border: 1px solid #4b4a42;
          border-radius: 30px;
          color: #cccac0;
        }

        .twoColumns {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 50px;
        }

        .list {
          margin-top: 20px;
        }

        .listItem {
          padding: 18px 0;
          border-bottom: 1px solid #33332f;
          color: #cccac3;
          line-height: 1.5;
          display: flex;
          gap: 18px;
        }

        .listItem span {
          color: #d5ef00;
          min-width: 25px;
        }

        .launchPlan {
          margin-top: 20px;
        }

        .launchStep {
          display: grid;
          grid-template-columns: 130px 60px 1fr;
          align-items: center;
          min-height: 75px;
          border-bottom: 1px solid #33332f;
        }

        .day {
          color: #8f8e86;
          text-transform: uppercase;
          font-size: 12px;
          letter-spacing: 2px;
        }

        .stepNumber {
          color: #d5ef00;
        }

        .stepAction {
          color: #d4d3cd;
        }

        footer {
          border-top: 1px solid #37372f;
          padding: 35px 6%;
          display: flex;
          justify-content: space-between;
          color: #77776e;
          font-size: 11px;
          letter-spacing: 2px;
        }

        @media (max-width: 900px) {
          .hero h1 {
            letter-spacing: -3px;
          }

          .scoreGrid,
          .opportunityGrid,
          .twoColumns {
            grid-template-columns: 1fr;
          }

          .metrics,
          .marketGrid {
            grid-template-columns: 1fr 1fr;
          }
        }

        @media (max-width: 600px) {
          .nav {
            padding: 0 20px;
          }

          .navRight {
            display: none;
          }

          .hero {
            padding-left: 20px;
            padding-right: 20px;
          }

          .hero h1 {
            font-size: 48px;
          }

          .scanner,
          .results,
          .errorBox,
          .loadingBox {
            width: calc(100% - 24px);
          }

          .scannerTop,
          .scannerBottom,
          .detail {
            padding: 22px;
          }

          textarea {
            padding: 25px 22px;
            min-height: 230px;
          }

          .scannerBottom {
            align-items: flex-start;
            flex-direction: column;
            gap: 20px;
          }

          .analyzeButton {
            width: 100%;
          }

          .metrics,
          .marketGrid {
            grid-template-columns: 1fr;
          }

          .detailHeader {
            align-items: flex-start;
            flex-direction: column;
          }

          .launchStep {
            grid-template-columns: 80px 40px 1fr;
          }

          footer {
            flex-direction: column;
            gap: 15px;
          }
        }
      `}</style>
    </main>
  );
}

function Metric({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="metric">
      <div className="cardLabel">{label}</div>
      <div className="metricValue">{value}</div>
    </div>
  );
}
