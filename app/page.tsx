"use client";

import { useState } from "react";

type Opportunity = {
  title: string;
  description: string;
  score: number;
  investment: string;
  revenueModel: string;
  demand: string;
  competition: string;
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

async function analyzeProblem(problem: string): Promise<Analysis> {
  const response = await fetch("/api/analyze", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ problem }),
  });

  const text = await response.text();

  let data;

  try {
    data = JSON.parse(text);
  } catch {
    throw new Error(
      `Server returned an invalid response (${response.status}).`
    );
  }

  if (!response.ok) {
    throw new Error(data?.error || "Analysis failed.");
  }

  return data;
}

export default function Home() {
  const [problem, setProblem] = useState("");
  const [analysis, setAnalysis] = useState<Analysis | null>(null);
  const [selected, setSelected] = useState(0);
  const [tab, setTab] = useState("overview");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [saved, setSaved] = useState(false);

  const scrollToScanner = () => {
    document
      .getElementById("scanner")
      ?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const runAnalysis = async () => {
    if (!problem.trim()) {
      setError("Describe a consumer problem first.");
      scrollToScanner();
      return;
    }

    setLoading(true);
    setError("");
    setAnalysis(null);
    setSaved(false);

    try {
      const result = await analyzeProblem(problem.trim());

      setAnalysis(result);
      setSelected(0);
      setTab("overview");

      setTimeout(() => {
        document
          .getElementById("results")
          ?.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 150);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to analyze this opportunity."
      );
    } finally {
      setLoading(false);
    }
  };

  const chooseExample = (text: string) => {
    setProblem(text);
    setError("");

    setTimeout(() => {
      document
        .querySelector(".problemInput")
        ?.scrollIntoView({ behavior: "smooth", block: "center" });
    }, 100);
  };

  const currentOpportunity = analysis?.opportunities?.[selected];

  return (
    <main className="venturePage">
      <header className="topbar">
        <div className="logo">
          VENTURE<span>LENS</span>
        </div>

        <div className="topbarRight">
          <span className="statusDot" />
          AI BUSINESS OPPORTUNITY FINDER
        </div>
      </header>

      <section className="hero">
        <div className="heroOrb heroOrbOne" />
        <div className="heroOrb heroOrbTwo" />

        <div className="heroGrid" />

        <div className="heroContent">
          <div className="heroEyebrow">
            <span className="eyebrowLine" />
            CONSUMER PROBLEM → BUSINESS OPPORTUNITY
            <span className="eyebrowLine" />
          </div>

          <h1>
            Find the business
            <br />
            <em>hiding in a problem.</em>
          </h1>

          <p className="heroDescription">
            VentureLens turns everyday consumer frustrations into
            potential startup opportunities — evaluating demand,
            customers, competition, risks and practical ways to launch.
          </p>

          <button className="heroCTA" onClick={scrollToScanner}>
            <span>Try VentureLens</span>
            <strong>↓</strong>
          </button>

          <div className="heroMeta">
            <div>
              <span>01</span>
              IDENTIFY
            </div>

            <div className="metaLine" />

            <div>
              <span>02</span>
              ANALYZE
            </div>

            <div className="metaLine" />

            <div>
              <span>03</span>
              BUILD
            </div>
          </div>
        </div>

        <div className="scrollHint">
          <span>SCROLL TO EXPLORE</span>
          <div className="scrollArrow">↓</div>
        </div>
      </section>

      <section className="introStrip">
        <div className="introNumber">01</div>

        <div className="introText">
          <span>THE IDEA</span>
          <p>
            Great businesses often begin with a simple observation:
            something people struggle with every day.
          </p>
        </div>

        <div className="introText right">
          <span>THE MISSION</span>
          <p>
            Use AI to transform those observations into structured,
            testable business opportunities.
          </p>
        </div>
      </section>

      <section className="scannerSection" id="scanner">
        <div className="sectionHeader">
          <div>
            <div className="sectionEyebrow">
              OPPORTUNITY SCANNER
            </div>

            <h2>
              What problem
              <br />
              are you solving?
            </h2>
          </div>

          <div className="sectionSideText">
            Tell VentureLens about a real consumer problem.
            <br />
            We&apos;ll explore what could be built around it.
          </div>
        </div>

        <div className="scanner">
          <div className="scannerTop">
            <div className="scannerLabel">
              WHO IS EXPERIENCING IT?
            </div>

            <div className="categories">
              {examples.map((example) => (
                <button
                  key={example.name}
                  className={
                    problem === example.text
                      ? "category active"
                      : "category"
                  }
                  onClick={() => chooseExample(example.text)}
                >
                  {example.name}
                </button>
              ))}
            </div>
          </div>

          <div className="problemInput">
            <textarea
              value={problem}
              onChange={(e) => {
                setProblem(e.target.value);
                setError("");
              }}
              maxLength={500}
              placeholder="Describe a real consumer problem..."
            />
          </div>

          <div className="scannerBottom">
            <div className="characterCount">
              {problem.length.toString().padStart(3, "0")} / 500
            </div>

            <button
              className="analyzeButton"
              onClick={runAnalysis}
              disabled={loading}
            >
              {loading ? (
                <>
                  <span className="buttonSpinner" />
                  Analyzing
                </>
              ) : (
                <>
                  Analyze opportunity
                  <span>✦</span>
                </>
              )}
            </button>
          </div>
        </div>

        <div className="scannerNote">
          <span>VENTURELENS AI</span>
          <span>
            START WITH A PROBLEM. END WITH A POSSIBILITY.
          </span>
        </div>
      </section>

      {error && (
        <div className="errorBox">
          <strong>Something went wrong.</strong>
          <span>{error}</span>
        </div>
      )}

      {loading && (
        <section className="loadingSection">
          <div className="loadingOrb">
            <div />
          </div>

          <div>
            <div className="loadingEyebrow">
              VENTURELENS IS THINKING
            </div>

            <h3>Turning the problem into possibilities...</h3>

            <p>
              Evaluating business models, customer demand,
              competition, risks and launch potential.
            </p>
          </div>
        </section>
      )}

      {analysis && !loading && (
        <section className="resultsSection" id="results">
          <div className="resultsTop">
            <div>
              <div className="sectionEyebrow">
                AI-GENERATED ANALYSIS
              </div>

              <h2>
                Opportunity
                <br />
                <em>report.</em>
              </h2>
            </div>

            <button
              className={saved ? "saveButton saved" : "saveButton"}
              onClick={() => setSaved(!saved)}
            >
              {saved ? "Saved ✓" : "Save opportunity"}
            </button>
          </div>

          <div className="summaryGrid">
            <div className="scoreCard">
              <div className="scoreLabel">PROBLEM SCORE</div>

              <div className="scoreNumber">
                {analysis.problemScore}
                <small>/100</small>
              </div>

              <div className="scoreBar">
                <div
                  style={{
                    width: `${Math.min(
                      Math.max(analysis.problemScore, 0),
                      100
                    )}%`,
                  }}
                />
              </div>

              <p>
                Strength of the consumer pain point and its
                potential for a business solution.
              </p>
            </div>

            <div className="insightCard">
              <div className="cardEyebrow">PROBLEM INSIGHT</div>

              <p>{analysis.problemSummary}</p>
            </div>
          </div>

          <div className="opportunitiesHeader">
            <div>
              <span>02</span>
              TOP BUSINESS OPPORTUNITIES
            </div>

            <p>
              Three directions worth investigating based on
              the problem.
            </p>
          </div>

          <div className="opportunityGrid">
            {analysis.opportunities.map((opportunity, index) => (
              <button
                key={index}
                className={
                  selected === index
                    ? "opportunityCard selected"
                    : "opportunityCard"
                }
                onClick={() => {
                  setSelected(index);
                  setTab("overview");
                }}
              >
                <div className="opportunityNumber">
                  0{index + 1}
                </div>

                <div className="opportunityScore">
                  {opportunity.score}
                </div>

                <h3>{opportunity.title}</h3>

                <p>{opportunity.description}</p>

                <div className="opportunityFooter">
                  <span>
                    {opportunity.demand} demand
                  </span>

                  <span className="cardArrow">↗</span>
                </div>
              </button>
            ))}
          </div>

          {currentOpportunity && (
            <section className="detailSection">
              <div className="detailTop">
                <div>
                  <div className="sectionEyebrow">
                    OPPORTUNITY 0{selected + 1}
                  </div>

                  <h2>{currentOpportunity.title}</h2>
                </div>

                <div className="detailScore">
                  {currentOpportunity.score}
                  <small>/100</small>
                </div>
              </div>

              <div className="tabs">
                {[
                  "overview",
                  "market",
                  "risks",
                  "business",
                ].map((item) => (
                  <button
                    key={item}
                    className={
                      tab === item ? "tab active" : "tab"
                    }
                    onClick={() => setTab(item)}
                  >
                    {item}
                  </button>
                ))}
              </div>

              {tab === "overview" && (
                <div className="detailContent">
                  <p className="detailDescription">
                    {currentOpportunity.description}
                  </p>

                  <div className="metricGrid">
                    <Metric
                      label="STARTUP INVESTMENT"
                      value={currentOpportunity.investment}
                    />

                    <Metric
                      label="REVENUE MODEL"
                      value={currentOpportunity.revenueModel}
                    />

                    <Metric
                      label="CUSTOMER DEMAND"
                      value={currentOpportunity.demand}
                    />

                    <Metric
                      label="COMPETITION"
                      value={currentOpportunity.competition}
                    />
                  </div>

                  <CustomerList
                    customers={analysis.market.targetCustomers}
                  />
                </div>
              )}

              {tab === "market" && (
                <div className="detailContent">
                  <div className="metricGrid">
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

                  <CustomerList
                    customers={analysis.market.targetCustomers}
                  />
                </div>
              )}

              {tab === "risks" && (
                <div className="twoColumns">
                  <ListBlock
                    title="BUSINESS RISKS"
                    items={analysis.risks}
                  />

                  <ListBlock
                    title="ETHICAL CONSIDERATIONS"
                    items={analysis.ethicalConsiderations}
                  />
                </div>
              )}

              {tab === "business" && (
                <div className="launchSection">
                  <div className="cardEyebrow">
                    PRACTICAL LAUNCH PLAN
                  </div>

                  <div className="launchPlan">
                    {analysis.launchPlan.map((step, index) => (
                      <div className="launchStep" key={index}>
                        <div className="launchDay">
                          {step.day}
                        </div>

                        <div className="launchNumber">
                          {String(index + 1).padStart(2, "0")}
                        </div>

                        <div className="launchAction">
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

      <footer className="footer">
        <div className="footerBrand">
          VENTURE<span>LENS</span>
        </div>

        <div>AI BUSINESS OPPORTUNITY FINDER</div>

        <div>TURN PROBLEMS INTO POSSIBILITIES.</div>
      </footer>

      <style jsx global>{`
        * {
          box-sizing: border-box;
        }

        html {
          scroll-behavior: smooth;
          background: #090a09 !important;
        }

        body {
          margin: 0 !important;
          background: #090a09 !important;
          color: #eeeDE7 !important;
          font-family:
            Arial,
            Helvetica,
            sans-serif !important;
        }

        button,
        textarea {
          font-family: inherit !important;
        }

        button {
          cursor: pointer;
        }

        .venturePage {
          min-height: 100vh;
          overflow: hidden;
          background: #090a09 !important;
          color: #eeeDE7 !important;
        }

        .topbar {
          height: 72px;
          padding: 0 42px;
          border-bottom: 1px solid #34352f;
          display: flex;
          align-items: center;
          justify-content: space-between;
          background: #090a09;
          position: relative;
          z-index: 10;
        }

        .logo {
          color: #f0efe8 !important;
          font-size: 18px;
          font-weight: 800;
          letter-spacing: -0.7px;
        }

        .logo span,
        .footerBrand span {
          color: #d9f000 !important;
        }

        .topbarRight {
          display: flex;
          align-items: center;
          gap: 9px;
          color: #898980 !important;
          font-size: 10px;
          letter-spacing: 2.5px;
        }

        .statusDot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: #d9f000;
          box-shadow: 0 0 12px rgba(217, 240, 0, 0.6);
        }

        .hero {
          min-height: 720px;
          position: relative;
          overflow: hidden;
          display: flex;
          justify-content: center;
          text-align: center;
          background:
            radial-gradient(
              circle at 68% 30%,
              rgba(191, 216, 126, 0.22),
              transparent 27%
            ),
            radial-gradient(
              circle at 50% 70%,
              rgba(110, 120, 82, 0.08),
              transparent 35%
            ),
            #090a09;
        }

        .heroGrid {
          position: absolute;
          inset: 0;
          opacity: 0.28;
          background-image:
            linear-gradient(
              rgba(255, 255, 255, 0.035) 1px,
              transparent 1px
            ),
            linear-gradient(
              90deg,
              rgba(255, 255, 255, 0.035) 1px,
              transparent 1px
            );
          background-size: 90px 90px;
          mask-image: linear-gradient(
            to bottom,
            black,
            transparent 80%
          );
        }

        .heroOrb {
          position: absolute;
          border-radius: 50%;
          pointer-events: none;
          filter: blur(70px);
        }

        .heroOrbOne {
          width: 330px;
          height: 330px;
          top: 20px;
          right: 7%;
          background: rgba(207, 227, 147, 0.12);
        }

        .heroOrbTwo {
          width: 250px;
          height: 250px;
          bottom: 20px;
          left: 5%;
          background: rgba(176, 195, 115, 0.06);
        }

        .heroContent {
          position: relative;
          z-index: 2;
  tric
                      label="COMPETITION"
                      value={
                        currentOpportunity.competition
                      }
                    />
                  </div>

                  <CustomerList
                    customers={
                      analysis.market.targetCustomers
                    }
                  />
                </div>
              )}

              {tab === "market" && (
                <div>
                  <div className="metricGrid">
                    <Metric
                      label="CUSTOMER DEMAND"
                      value={
                        analysis.market.customerDemand
                      }
                    />

                    <Metric
                      label="MARKET ACCESSIBILITY"
                      value={
                        analysis.market.marketAccessibility
                      }
                    />

                    <Metric
                      label="COMPETITIVE PRESSURE"
                      value={
                        analysis.market
                          .competitivePressure
                      }
                    />

                    <Metric
                      label="SCALABILITY"
                      value={
                        analysis.market.scalability
                      }
                    />
                  </div>

                  <CustomerList
                    customers={
                      analysis.market.targetCustomers
                    }
                  />
                </div>
              )}

              {tab === "risks" && (
                <div className="twoColumns">
                  <ListBlock
                    title="BUSINESS RISKS"
                    items={analysis.risks}
                  />

                  <ListBlock
                    title="ETHICAL CONSIDERATIONS"
                    items={
                      analysis.ethicalConsiderations
                    }
                  />
                </div>
              )}

              {tab === "business" && (
                <div>
                  <div className="label">
                    PRACTICAL LAUNCH PLAN
                  </div>

                  <div className="launchPlan">
                    {analysis.launchPlan.map(
                      (step, index) => (
                        <div
                          className="launchStep"
                          key={index}
                        >
                          <div className="launchDay">
                            {step.day}
                          </div>

                          <div className="launchNumber">
                            {String(index + 1).padStart(
                              2,
                              "0"
                            )}
                          </div>

                          <div className="launchAction">
                            {step.action}
                          </div>
                        </div>
                      )
                    )}
                  </div>
                </div>
              )}
            </section>
          )}
        </section>
      )}

      <footer>
        <span>VENTURELENS</span>
        <span>
          TURN PROBLEMS INTO POSSIBILITIES.
        </span>
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
          background: #090a09;
          color: #f0efe9;
          font-family:
            Arial,
            Helvetica,
            sans-serif;
        }

        button,
        textarea {
          font-family: inherit;
        }

        button {
          cursor: pointer;
        }

        .page {
          min-height: 100vh;
          background:
            radial-gradient(
              circle at 74% 23%,
              rgba(202, 220, 150, 0.25),
              transparent 24%
            ),
            #090a09;
        }

        .header {
          height: 68px;
          padding: 0 28px;
          border-bottom: 1px solid #45443c;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .brand {
          font-size: 21px;
          font-weight: 900;
          color: #f0efe9;
          letter-spacing: -1px;
        }

        .brand span {
          color: #d8f000;
        }

        .headerRight {
          font-size: 12px;
          color: #c2c0b6;
          letter-spacing: 3px;
        }

        .hero {
          position: relative;
          min-height: 545px;
          overflow: hidden;
          padding: 48px 25px 70px;
          text-align: center;
        }

        .heroGlow {
          position: absolute;
          width: 650px;
          height: 650px;
          border-radius: 50%;
          background: rgba(214, 227, 161, 0.14);
          filter: blur(80px);
          top: -220px;
          right: 14%;
          pointer-events: none;
        }

        .eyebrow {
          position: relative;
          color: #aaa89d;
          font-size: 12px;
          letter-spacing: 4px;
          font-weight: 500;
        }

        .hero h1 {
          position: relative;
          max-width: 1150px;
          margin: 55px auto 30px;
          color: #f1f0eb;
          font-size: clamp(58px, 7vw, 108px);
          line-height: 0.9;
          letter-spacing: -6px;
          font-weight: 800;
        }

        .hero p {
          position: relative;
          max-width: 760px;
          margin: auto;
          color: #bbb9ae;
          font-size: 18px;
          line-height: 1.7;
        }

        .scanner {
          width: calc(100% - 74px);
          margin: -10px auto 90px;
          border: 1px solid #5a584c;
          border-radius: 32px;
          background: #0c0d0c;
          overflow: hidden;
        }

        .categoryRow {
          padding: 30px 38px 22px;
          display: flex;
          align-items: center;
          gap: 25px;
          flex-wrap: wrap;
        }

        .categoryLabel,
        .label,
        .sectionTitle {
          color: #aaa89e;
          font-size: 12px;
          letter-spacing: 3px;
          font-weight: 500;
        }

        .categories {
          display: flex;
          gap: 14px;
          flex-wrap: wrap;
        }

        .category {
          border: 1px solid #57554b;
          background: transparent;
          color: #e5e3dc;
          border-radius: 30px;
          padding: 12px 23px;
          font-size: 16px;
        }

        .category:hover,
        .category.active {
          color: #111;
          background: #d8f000;
          border-color: #d8f000;
        }

        textarea {
          width: 100%;
          min-height: 300px;
          display: block;
          resize: vertical;
          border: 0;
          border-top: 1px solid #3b3a35;
          border-bottom: 1px solid #3b3a35;
          outline: none;
          background: #0c0d0c;
          color: #efeee9;
          padding: 38px 40px;
          font-size: clamp(27px, 3vw, 43px);
          line-height: 1.22;
        }

        textarea::placeholder {
          color: #77766d;
        }

        .scannerBottom {
          min-height: 115px;
          padding: 25px 38px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          color: #aaa89e;
        }

        .analyze {
          border: 0;
          border-radius: 40px;
          padding: 19px 30px;
          background: #050505;
          color: #f3f1ea;
          font-weight: 700;
          font-size: 16px;
        }

        .analyze:hover:not(:disabled) {
          background: #d8f000;
          color: #101010;
        }

        .analyze:disabled {
          opacity: 0.55;
          cursor: wait;
        }

        .error,
        .loading {
          width: calc(100% - 74px);
          margin: -50px auto 70px;
          border-radius: 18px;
          padding: 22px 25px;
        }

        .error {
          border: 1px solid #743c3c;
          background: #1b0d0d;
          color: #ff8989;
        }

        .loading {
          border: 1px solid #555348;
          background: #10110f;
          color: #eee;
          display: flex;
          align-items: center;
          gap: 20px;
        }

        .loading p {
          color: #a4a39a;
          margin-bottom: 0;
        }

        .spinner {
          width: 32px;
          height: 32px;
          border-radius: 50%;
          border: 3px solid #47473e;
          border-top-color: #d8f000;
          animation: spin 0.8s linear infinite;
        }

        @keyframes spin {
          to {
            transform: rotate(360deg);
          }
        }

        .results {
          width: calc(100% - 74px);
          margin: 0 auto 100px;
        }

        .resultsHeading,
        .detailHeading {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 30px;
          margin-bottom: 35px;
        }

        .results h2,
        .detail h2 {
          margin: 10px 0 0;
          color: #f1f0eb;
          font-size: clamp(42px, 5vw, 70px);
          line-height: 0.95;
          letter-spacing: -4px;
        }

        .save {
          border: 1px solid #5a584d;
          background: transparent;
          color: #e4e2db;
          border-radius: 30px;
          padding: 13px 21px;
        }

        .save.saved {
          background: #d8f000;
          color: #111;
          border-color: #d8f000;
        }

        .summaryGrid {
          display: grid;
          grid-template-columns: 1fr 2fr;
          gap: 18px;
          margin-bottom: 75px;
        }

        .scoreCard,
        .insightCard,
        .detail {
          border: 1px solid #45443d;
          border-radius: 25px;
          background: #0c0d0c;
        }

        .scoreCard {
          padding: 30px;
          display: flex;
          align-items: center;
          gap: 28px;
        }

        .score {
          color: #d8f000;
          font-size: 70px;
          font-weight: 800;
        }

        .scoreCard p,
        .insightCard p {
          color: #bdbbb1;
          line-height: 1.6;
        }

        .insightCard {
          padding: 30px;
        }

        .insightCard p {
          font-size: 19px;
          margin-bottom: 0;
        }

        .sectionTitle {
          margin-bottom: 22px;
        }

        .opportunityGrid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 18px;
          margin-bottom: 80px;
        }

        .opportunity {
          min-height: 310px;
          text-align: left;
          padding: 30px;
          border: 1px solid #46453d;
          border-radius: 25px;
          background: #0c0d0c;
          color: #eee;
          transition: 0.2s;
        }

        .opportunity:hover,
        .opportunity.selected {
          border-color: #d8f000;
          transform: translateY(-3px);
        }

        .number {
          color: #d8f000;
          letter-spacing: 2px;
        }

        .opportunity h3 {
          color: #f0efe9;
          font-size: 28px;
          line-height: 1.1;
          letter-spacing: -1px;
          margin: 38px 0 16px;
        }

        .opportunity p {
          color: #aaa99f;
          line-height: 1.55;
          font-size: 15px;
        }

        .opportunityBottom {
          margin-top: 32px;
          display: flex;
          justify-content: space-between;
          color: #aaa99e;
        }

        .opportunityBottom strong {
          color: #d8f000;
        }

        .arrow {
          font-size: 20px;
        }

        .detail {
          padding: 40px;
        }

        .bigScore {
          color: #d8f000;
          font-size: 52px;
          font-weight: 800;
        }

        .bigScore small {
          color: #77766d;
          font-size: 18px;
          font-weight: 400;
        }

        .tabs {
          display: flex;
          gap: 8px;
          border-bottom: 1px solid #3d3c37;
          margin-bottom: 35px;
        }

        .tab {
          padding: 15px 20px;
          border: 0;
          border-bottom: 2px solid transparent;
          background: transparent;
          color: #88877e;
          text-transform: capitalize;
        }

        .tab.active {
          color: #d8f000;
          border-bottom-color: #d8f000;
        }

        .description {
          max-width: 900px;
          color: #d1d0c9;
          font-size: 21px;
          line-height: 1.6;
          margin-bottom: 35px;
        }

        .metricGrid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 14px;
          margin-bottom: 20px;
        }

        .metric {
          min-height: 120px;
          padding: 24px;
          border: 1px solid #45443d;
          border-radius: 20px;
          background: #0b0c0b;
        }

        .metricValue {
          margin-top: 18px;
          color: #f0efe9;
          font-size: 19px;
          font-weight: 700;
        }

        .customerBox {
          padding: 25px;
          border: 1px solid #45443d;
          border-radius: 20px;
          background: #0b0c0b;
        }

        .tags {
          display: flex;
          flex-wrap: wrap;
          gap: 10px;
          margin-top: 18px;
        }

        .tag {
          border: 1px solid #4e4d44;
          border-radius: 30px;
          padding: 10px 15px;
          color: #d5d3ca;
        }

        .twoColumns {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 60px;
        }

        .list {
          margin-top: 20px;
        }

        .listItem {
          padding: 17px 0;
          border-bottom: 1px solid #34342f;
          color: #d0cec6;
          line-height: 1.5;
        }

        .launchPlan {
          margin-top: 20px;
        }

        .launchStep {
          display: grid;
          grid-template-columns: 130px 55px 1fr;
          align-items: center;
          min-height: 75px;
          border-bottom: 1px solid #34342f;
        }

        .launchDay {
          color: #929189;
          font-size: 11px;
          letter-spacing: 2px;
          text-transform: uppercase;
        }

        .launchNumber {
          color: #d8f000;
        }

        .launchAction {
          color: #d4d2ca;
        }

        footer {
          padding: 35px 28px;
          border-top: 1px solid #393832;
          display: flex;
          justify-content: space-between;
          color: #8b8980;
          font-size: 11px;
          letter-spacing: 3px;
        }

        @media (max-width: 900px) {
          .summaryGrid,
          .opportunityGrid,
          .twoColumns {
            grid-template-columns: 1fr;
          }

          .metricGrid {
            grid-template-columns: 1fr 1fr;
          }

          .hero h1 {
            letter-spacing: -4px;
          }
        }

        @media (max-width: 600px) {
          .headerRight {
            display: none;
          }

          .header {
            padding: 0 18px;
          }

          .hero {
            padding-left: 18px;
            padding-right: 18px;
          }

          .hero h1 {
            font-size: 48px;
          }

          .scanner,
          .results,
          .error,
          .loading {
            width: calc(100% - 24px);
          }

          .categoryRow,
          .scannerBottom,
          .detail {
            padding: 22px;
          }

          textarea {
            min-height: 240px;
            padding: 25px 22px;
          }

          .scannerBottom {
            align-items: flex-start;
            flex-direction: column;
            gap: 18px;
          }

          .analyze {
            width: 100%;
          }

          .metricGrid {
            grid-template-columns: 1fr;
          }

          .resultsHeading,
          .detailHeading {
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
      <div className="label">{label}</div>
      <div className="metricValue">{value}</div>
    </div>
  );
}

function CustomerList({
  customers,
}: {
  customers: string[];
}) {
  return (
    <div className="customerBox">
      <div className="label">TARGET CUSTOMERS</div>

      <div className="tags">
        {customers.map((customer, index) => (
          <span className="tag" key={index}>
            {customer}
          </span>
        ))}
      </div>
    </div>
  );
}

function ListBlock({
  title,
  items,
}: {
  title: string;
  items: string[];
}) {
  return (
    <div>
      <div className="label">{title}</div>

      <div className="list">
        {items.map((item, index) => (
          <div className="listItem" key={index}>
            {item}
          </div>
        ))}
      </div>
    </div>
  );
}
