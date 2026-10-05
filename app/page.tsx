"use client";

import { useState } from "react";

type Opportunity = {
  title: string;
  description: string;
  score: number;
  investment: string;
  revenueModel: string;
  demand: "Low" | "Medium" | "High" | string;
  competition: "Low" | "Medium" | "High" | string;
};

type Analysis = {
  problemScore: number;
  problemSummary: string;
  opportunities: Opportunity[];
  market: {
    customerDemand: string;
    marketAccessibility: string;
    competitivePressure: string;
    scalability: string;
    targetCustomers: string[];
  };
  risks: string[];
  ethicalConsiderations: string[];
  launchPlan: {
    day: string;
    action: string;
  }[];
};

const examples: Record<string, string> = {
  Students:
    "College students struggle to find affordable short-term storage for their belongings during semester breaks.",
  "Local businesses":
    "Small local businesses struggle to understand why customers do not return after their first purchase.",
  Environment:
    "Apartment residents want to recycle but do not have convenient collection and sorting services.",
  Employment:
    "College students have useful skills but struggle to find their first paying customers.",
};

const categories = Object.keys(examples);

export default function Home() {
  const [category, setCategory] = useState("Students");
  const [problem, setProblem] = useState("");
  const [analysis, setAnalysis] = useState<Analysis | null>(null);
  const [activeTab, setActiveTab] = useState<
    "overview" | "market" | "risks" | "business"
  >("overview");
  const [selectedOpportunity, setSelectedOpportunity] = useState(0);
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");

  const analyzeProblem = async (text: string): Promise<Analysis> => {
    const response = await fetch("/api/analyze", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        problem: text,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || "Analysis failed");
    }

    return data;
  };

  const runAnalysis = async () => {
    const finalProblem = problem.trim() || examples[category];

    setProblem(finalProblem);
    setLoading(true);
    setError("");
    setAnalysis(null);
    setSaved(false);
    setSelectedOpportunity(0);
    setActiveTab("overview");

    try {
      const result = await analyzeProblem(finalProblem);

      setAnalysis(result);

      setTimeout(() => {
        document.getElementById("results")?.scrollIntoView({
          behavior: "smooth",
        });
      }, 100);
    } catch (err) {
      console.error(err);
      setError(
        err instanceof Error
          ? err.message
          : "Unable to analyze this problem. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const useExample = (key: string) => {
    setCategory(key);
    setProblem(examples[key]);
    setAnalysis(null);
    setError("");
  };

  const selected =
    analysis?.opportunities?.[selectedOpportunity] ||
    analysis?.opportunities?.[0];

  return (
    <main className="site">
      <style jsx global>{`
        * {
          box-sizing: border-box;
        }

        html {
          scroll-behavior: smooth;
        }

        body {
          margin: 0;
          background: #0b0d0d;
          color: #f1f0e9;
          font-family:
            Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont,
            "Segoe UI", sans-serif;
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
              circle at 50% -10%,
              rgba(151, 173, 0, 0.1),
              transparent 35%
            ),
            #0b0d0d;
        }

        .container {
          width: min(1380px, calc(100% - 48px));
          margin: 0 auto;
        }

        .nav {
          height: 82px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          border-bottom: 1px solid #282c2b;
        }

        .logo {
          font-size: 20px;
          font-weight: 800;
          letter-spacing: -0.04em;
        }

        .logo span {
          color: #a9bd00;
        }

        .nav-right {
          color: #929690;
          font-size: 13px;
          letter-spacing: 0.08em;
          text-transform: uppercase;
        }

        .hero {
          padding: 105px 0 85px;
          text-align: center;
        }

        .eyebrow {
          color: #aeb19f;
          font-size: 12px;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          margin-bottom: 22px;
        }

        h1 {
          max-width: 900px;
          margin: 0 auto;
          font-size: clamp(48px, 7vw, 92px);
          line-height: 0.95;
          letter-spacing: -0.07em;
          font-weight: 700;
        }

        .hero-copy {
          max-width: 680px;
          margin: 30px auto 0;
          color: #999d98;
          font-size: 18px;
          line-height: 1.7;
        }

        .scanner {
          margin: 20px auto 90px;
          border: 1px solid #4b5048;
          border-radius: 28px;
          background: #101313;
          overflow: hidden;
        }

        .scanner-top {
          padding: 26px 32px 18px;
          display: flex;
          align-items: center;
          gap: 12px;
          flex-wrap: wrap;
        }

        .scanner-label {
          color: #9b9f99;
          font-size: 12px;
          letter-spacing: 0.16em;
          text-transform: uppercase;
          margin-right: 6px;
        }

        .category {
          border: 1px solid #454944;
          background: transparent;
          color: #e8e8df;
          border-radius: 999px;
          padding: 10px 18px;
          transition: 0.2s;
        }

        .category:hover {
          border-color: #8d9d00;
        }

        .category.active {
          background: #829600;
          border-color: #829600;
          color: #101300;
        }

        .problem-box {
          padding: 12px 32px 32px;
        }

        textarea {
          width: 100%;
          min-height: 190px;
          resize: vertical;
          border: 0;
          outline: 0;
          background: transparent;
          color: #f0f0e9;
          font-size: clamp(24px, 3vw, 38px);
          line-height: 1.2;
          letter-spacing: -0.035em;
        }

        textarea::placeholder {
          color: #50544f;
        }

        .scanner-bottom {
          border-top: 1px solid #343834;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 22px 32px;
        }

        .counter {
          color: #858a83;
          font-family: monospace;
          font-size: 13px;
        }

        .analyze-btn {
          border: 0;
          border-radius: 999px;
          padding: 17px 27px;
          background: #050606;
          color: #f2f1eb;
          font-weight: 700;
          transition: 0.2s;
        }

        .analyze-btn:hover {
          background: #a1b300;
          color: #0c0e0d;
        }

        .analyze-btn:disabled {
          opacity: 0.5;
          cursor: wait;
        }

        .error {
          margin: 20px 0;
          padding: 18px 20px;
          border: 1px solid #693b3b;
          border-radius: 14px;
          background: #211313;
          color: #ffb5b5;
        }

        .loading {
          padding: 80px 20px;
          text-align: center;
        }

        .loading-title {
          font-family: monospace;
          letter-spacing: 0.15em;
          font-size: 14px;
          color: #b4c500;
        }

        .loading-copy {
          margin-top: 14px;
          color: #858982;
        }

        .results {
          padding-bottom: 100px;
        }

        .results-heading {
          display: flex;
          justify-content: space-between;
          align-items: flex-end;
          gap: 30px;
          margin-bottom: 20px;
        }

        .section-label {
          color: #a5aa9e;
          font-family: monospace;
          font-size: 12px;
          letter-spacing: 0.15em;
          text-transform: uppercase;
        }

        .problem-summary {
          max-width: 850px;
          margin-top: 14px;
          font-size: 22px;
          line-height: 1.45;
        }

        .score {
          font-size: 68px;
          line-height: 0.9;
          font-weight: 800;
        }

        .score small {
          font-size: 14px;
          color: #858983;
          font-weight: 400;
        }

        .result-grid {
          display: grid;
          grid-template-columns: 330px 1fr;
          gap: 24px;
        }

        .panel {
          border: 1px solid #303532;
          border-radius: 22px;
          background: #121616;
          overflow: hidden;
        }

        .opportunity-list {
          min-height: 100%;
        }

        .opportunity-list-head {
          padding: 25px;
          border-bottom: 1px solid #303532;
          display: flex;
          justify-content: space-between;
          color: #aaaDA5;
          font-family: monospace;
          font-size: 12px;
          letter-spacing: 0.14em;
          text-transform: uppercase;
        }

        .opportunity {
          padding: 25px;
          border-bottom: 1px solid #303532;
          background: transparent;
          color: #f2f1eb;
          width: 100%;
          text-align: left;
          border-left: 0;
          border-right: 0;
          border-top: 0;
        }

        .opportunity:last-child {
          border-bottom: 0;
        }

        .opportunity.active {
          background: #293006;
        }

        .opportunity-number {
          color: #9a9d91;
          font-family: monospace;
          font-size: 12px;
        }

        .opportunity-title {
          font-size: 18px;
          font-weight: 700;
          margin: 12px 0;
          line-height: 1.3;
        }

        .opportunity-meta {
          color: #9b9f96;
          font-size: 13px;
        }

        .opportunity-score {
          float: right;
          font-size: 30px;
          font-weight: 800;
        }

        .main-result {
          padding: 38px;
        }

        .result-top {
          display: flex;
          justify-content: space-between;
          gap: 30px;
          border-bottom: 1px solid #303532;
          padding-bottom: 30px;
        }

        .result-top h2 {
          font-size: clamp(32px, 4vw, 58px);
          line-height: 1;
          letter-spacing: -0.05em;
          margin: 14px 0;
        }

        .description {
          color: #9ea29b;
          font-size: 17px;
          line-height: 1.65;
          max-width: 800px;
        }

        .big-score {
          text-align: right;
          min-width: 150px;
        }

        .big-score-number {
          font-size: 68px;
          line-height: 0.8;
          font-weight: 800;
        }

        .big-score-label {
          color: #92968e;
          font-size: 12px;
          margin-top: 14px;
          text-transform: uppercase;
        }

        .tabs {
          display: flex;
          gap: 32px;
          border-bottom: 1px solid #303532;
          margin-top: 10px;
        }

        .tab {
          padding: 20px 2px;
          border: 0;
          background: transparent;
          color: #858982;
          border-bottom: 2px solid transparent;
        }

        .tab.active {
          color: #f2f1eb;
          border-bottom-color: #a3b600;
        }

        .content {
          padding-top: 28px;
        }

        .two-col {
          display: grid;
          grid-template-columns: 1.4fr 0.9fr;
          gap: 18px;
        }

        .card {
          border: 1px solid #303532;
          border-radius: 18px;
          padding: 28px;
          background: #111515;
        }

        .card-label {
          color: #a2a69d;
          font-family: monospace;
          font-size: 12px;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          margin-bottom: 20px;
        }

        .card h3 {
          margin: 0;
          font-size: 25px;
          line-height: 1.35;
        }

        .tags {
          display: flex;
          gap: 8px;
          flex-wrap: wrap;
          margin-top: 24px;
        }

        .tag {
          background: #1c2108;
          color: #dce49c;
          padding: 8px 12px;
          border-radius: 9px;
          font-size: 12px;
        }

        .stat {
          margin-bottom: 25px;
        }

        .stat-row {
          display: flex;
          justify-content: space-between;
          margin-bottom: 10px;
          color: #aaaDA5;
        }

        .bar {
          height: 7px;
          background: #292d2a;
          border-radius: 99px;
          overflow: hidden;
        }

        .bar-fill {
          height: 100%;
          background: #93a600;
          border-radius: 99px;
        }

        .list {
          display: grid;
          gap: 12px;
        }

        .list-item {
          border-left: 2px solid #91a000;
          padding: 12px 15px;
          background: #171a15;
          color: #c8cbc4;
          line-height: 1.5;
        }

        .launch {
          display: grid;
          gap: 12px;
        }

        .launch-step {
          display: grid;
          grid-template-columns: 100px 1fr;
          gap: 20px;
          border-bottom: 1px solid #2d312e;
          padding: 16px 0;
        }

        .launch-day {
          color: #a7b800;
          font-family: monospace;
          font-size: 13px;
        }

        .save-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-top: 30px;
        }

        .save {
          border: 1px solid #454a45;
          background: transparent;
          color: #f1f1eb;
          border-radius: 999px;
          padding: 12px 20px;
        }

        .save.saved {
          background: #293006;
          border-color: #788600;
        }

        .disclaimer {
          color: #777c75;
          font-family: monospace;
          font-size: 11px;
        }

        @media (max-width: 900px) {
          .result-grid,
          .two-col {
            grid-template-columns: 1fr;
          }

          .results-heading,
          .result-top {
            align-items: flex-start;
            flex-direction: column;
          }

          .big-score {
            text-align: left;
          }
        }

        @media (max-width: 650px) {
          .container {
            width: min(100% - 24px, 1380px);
          }

          .hero {
            padding: 70px 0 50px;
          }

          .scanner-top,
          .problem-box,
          .scanner-bottom,
          .main-result {
            padding-left: 20px;
            padding-right: 20px;
          }

          .scanner-bottom {
            gap: 20px;
            flex-direction: column;
            align-items: stretch;
          }

          .analyze-btn {
            width: 100%;
          }

          .tabs {
            gap: 18px;
            overflow-x: auto;
          }
        }
      `}</style>

      <div className="container">
        <nav className="nav">
          <div className="logo">
            VENTURE<span>LENS</span>
          </div>
          <div className="nav-right">AI Business Opportunity Finder</div>
        </nav>

        <section className="hero">
          <div className="eyebrow">Consumer problem → business opportunity</div>

          <h1>
            Find the business
            <br />
            hiding in a problem.
          </h1>

          <p className="hero-copy">
            Describe a real consumer problem. VentureLens uses AI to identify
            startup opportunities, evaluate the market, assess risks and build
            a practical launch direction.
          </p>
        </section>

        <section className="scanner">
          <div className="scanner-top">
            <span className="scanner-label">Who is experiencing it?</span>

            {categories.map((item) => (
              <button
                key={item}
                className={`category ${category === item ? "active" : ""}`}
                onClick={() => useExample(item)}
              >
                {item}
              </button>
            ))}
          </div>

          <div className="problem-box">
            <textarea
              value={problem}
              onChange={(e) => {
                setProblem(e.target.value);
                setAnalysis(null);
                setError("");
              }}
              maxLength={500}
              placeholder="Describe a consumer problem you have noticed..."
            />
          </div>

          <div className="scanner-bottom">
            <div className="counter">{problem.length}/500</div>

            <button
              className="analyze-btn"
              onClick={runAnalysis}
              disabled={loading}
            >
              {loading ? "Analyzing..." : "Analyze opportunity  ✦"}
            </button>
          </div>
        </section>

        {error && <div className="error">{error}</div>}

        {loading && (
          <section className="loading">
            <div className="loading-title">ANALYZING OPPORTUNITY...</div>
            <div className="loading-copy">
              Understanding the consumer problem, evaluating opportunities and
              assessing business potential.
            </div>
          </section>
        )}

        {analysis && !loading && (
          <section className="results" id="results">
            <div className="results-heading">
              <div>
                <div className="section-label">Problem identified</div>
                <div className="problem-summary">
                  {analysis.problemSummary}
                </div>
              </div>

              <div className="score">
                {analysis.problemScore}
                <small>/100</small>
              </div>
            </div>

            <div className="result-grid">
              <aside className="panel opportunity-list">
                <div className="opportunity-list-head">
                  <span>Recommended opportunities</span>
                  <span>{analysis.opportunities.length}</span>
                </div>

                {analysis.opportunities.map((opportunity, index) => (
                  <button
                    key={`${opportunity.title}-${index}`}
                    className={`opportunity ${
                      selectedOpportunity === index ? "active" : ""
                    }`}
                    onClick={() => setSelectedOpportunity(index)}
                  >
                    <span className="opportunity-number">
                      0{index + 1}
                    </span>

                    <span className="opportunity-score">
                      {opportunity.score}
                    </span>

                    <div className="opportunity-title">
                      {opportunity.title}
                    </div>

                    <div className="opportunity-meta">
                      {opportunity.investment} ·{" "}
                      {opportunity.revenueModel}
                    </div>
                  </button>
                ))}
              </aside>

              <div className="panel main-result">
                {selected && (
                  <>
                    <div className="result-top">
                      <div>
                        <div className="section-label">
                          Top opportunity
                        </div>

                        <h2>{selected.title}</h2>

                        <div className="description">
                          {selected.description}
                        </div>
                      </div>

                      <div className="big-score">
                        <div className="big-score-number">
                          {selected.score}
                        </div>
                        <div className="big-score-label">
                          Opportunity score
                        </div>
                      </div>
                    </div>

                    <div className="tabs">
                      {(
                        [
                          ["overview", "Overview"],
                          ["market", "Market"],
                          ["risks", "Risks"],
                          ["business", "Business"],
                        ] as const
                      ).map(([key, label]) => (
                        <button
                          key={key}
                          className={`tab ${
                            activeTab === key ? "active" : ""
                          }`}
                          onClick={() => setActiveTab(key)}
                        >
                          {label}
                        </button>
                      ))}
                    </div>

                    <div className="content">
                      {activeTab === "overview" && (
                        <div className="two-col">
                          <div className="card">
                            <div className="card-label">
                              Problem identified
                            </div>

                            <h3>{analysis.problemSummary}</h3>

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

                          <div>
                            <div className="card">
                              <div className="card-label">
                                Estimated investment
                              </div>
                              <h3>{selected.investment}</h3>
                              <p className="description">
                                Lean launch range. Validate demand before
                                making major investments.
                              </p>
                            </div>

                            <div className="card" style={{ marginTop: 18 }}>
                              <div className="card-label">
                                Revenue model
                              </div>
                              <h3>{selected.revenueModel}</h3>
                            </div>
                          </div>
                        </div>
                      )}

                      {activeTab === "market" && (
                        <div className="two-col">
                          <div className="card">
                            <div className="card-label">
                              Market signals
                            </div>

                            <MarketStat
                              label="Customer demand"
                              value={analysis.market.customerDemand}
                            />

                            <MarketStat
                              label="Market accessibility"
                              value={analysis.market.marketAccessibility}
                            />

                            <MarketStat
                              label="Competitive pressure"
                              value={analysis.market.competitivePressure}
                            />

                            <MarketStat
                              label="Scalability"
                              value={analysis.market.scalability}
                            />
                          </div>

                          <div className="card">
                            <div className="card-label">
                              Target customers
                            </div>

                            <div className="list">
                              {analysis.market.targetCustomers.map(
                                (customer) => (
                                  <div className="list-item" key={customer}>
                                    ✓ {customer}
                                  </div>
                                )
                              )}
                            </div>
                          </div>
                        </div>
                      )}

                      {activeTab === "risks" && (
                        <div className="two-col">
                          <div className="card">
                            <div className="card-label">
                              Business risks
                            </div>

                            <div className="list">
                              {analysis.risks.map((risk) => (
                                <div className="list-item" key={risk}>
                                  {risk}
                                </div>
                              ))}
                            </div>
                          </div>

                          <div className="card">
                            <div className="card-label">
                              Ethical considerations
                            </div>

                            <div className="list">
                              {analysis.ethicalConsiderations?.length ? (
                                analysis.ethicalConsiderations.map(
                                  (item) => (
                                    <div className="list-item" key={item}>
                                      {item}
                                    </div>
                                  )
                                )
                              ) : (
                                <div className="list-item">
                                  Validate customer privacy, fairness and
                                  transparency before launch.
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      )}

                      {activeTab === "business" && (
                        <div className="card">
                          <div className="card-label">
                            30-day launch direction
                          </div>

                          <div className="launch">
                            {analysis.launchPlan.map((step, index) => (
                              <div
                                className="launch-step"
                                key={`${step.day}-${index}`}
                              >
                                <div className="launch-day">
                                  {step.day}
                                </div>
                                <div>{step.action}</div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="save-row">
                      <button
                        className={`save ${saved ? "saved" : ""}`}
                        onClick={() => setSaved(!saved)}
                      >
                        {saved ? "✓ Opportunity saved" : "+ Save opportunity"}
                      </button>

                      <div className="disclaimer">
                        AI-generated analysis · Estimates are illustrative
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>
          </section>
        )}
      </div>
    </main>
  );
}

function MarketStat({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  const normalized = value.toLowerCase();

  const width =
    normalized === "high"
      ? "100%"
      : normalized === "medium"
        ? "65%"
        : "30%";

  return (
    <div className="stat">
      <div className="stat-row">
        <span>{label}</span>
        <strong>{value}</strong>
      </div>

      <div className="bar">
        <div className="bar-fill" style={{ width }} />
      </div>
    </div>
  );
}
