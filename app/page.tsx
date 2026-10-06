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

  const goToScanner = () => {
    document
      .getElementById("problem-scanner")
      ?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
  };

  const runAnalysis = async () => {
    if (!problem.trim()) {
      setError("Describe a consumer problem first.");
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
          ?.scrollIntoView({
            behavior: "smooth",
            block: "start",
          });
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
  };

  const currentOpportunity =
    analysis?.opportunities?.[selected];

  return (
    <main className="vl-page">
      {/* HEADER */}
      <header className="vl-header">
        <div className="vl-logo">
          VENTURE<span>LENS</span>
        </div>

        <div className="vl-header-label">
          AI BUSINESS OPPORTUNITY FINDER
        </div>
      </header>

      {/* HERO */}
      <section className="vl-hero">
        <div className="vl-hero-glow" />

        <div className="vl-grid" />

        <div className="vl-hero-content">
          <div className="vl-eyebrow">
            CONSUMER PROBLEM&nbsp;&nbsp;→&nbsp;&nbsp; BUSINESS OPPORTUNITY
          </div>

          <h1>
            Find the business
            <br />
            <span>hiding in a problem.</span>
          </h1>

          <p className="vl-hero-description">
            Describe a real consumer problem. VentureLens uses AI
            to discover potential startup opportunities, evaluate
            the market, identify risks and help you decide what
            could be built.
          </p>

          {/* THIS IS THE BUTTON THAT MUST BE VISIBLE */}
          <button
            type="button"
            className="vl-try-button"
            onClick={goToScanner}
          >
            <span>Try VentureLens</span>
            <b>↓</b>
          </button>

          <div className="vl-hero-stats">
            <div>
              <strong>01</strong>
              <span>PROBLEM</span>
            </div>

            <i />

            <div>
              <strong>02</strong>
              <span>OPPORTUNITY</span>
            </div>

            <i />

            <div>
              <strong>03</strong>
              <span>STARTUP</span>
            </div>
          </div>
        </div>

        <div className="vl-scroll">
          <span>SCROLL TO EXPLORE</span>
          <b>↓</b>
        </div>
      </section>

      {/* INTRO / STATEMENT SECTION */}
      <section className="vl-statement">
        <div className="vl-statement-number">01</div>

        <div className="vl-statement-main">
          <div className="vl-small-label">THE IDEA</div>

          <h2>
            Every frustrating
            <br />
            experience can hide
            <br />
            an opportunity.
          </h2>
        </div>

        <div className="vl-statement-side">
          <p>
            VentureLens starts where entrepreneurs usually
            start: with a problem.
          </p>

          <p>
            Instead of guessing what business to build,
            describe something people genuinely struggle with
            and let AI help explore the possibilities.
          </p>
        </div>
      </section>

      {/* PROBLEM SCANNER */}
      <section
        className="vl-scanner-section"
        id="problem-scanner"
      >
        <div className="vl-scanner-heading">
          <div>
            <div className="vl-small-label">
              OPPORTUNITY SCANNER
            </div>

            <h2>
              What problem
              <br />
              are you solving?
            </h2>
          </div>

          <p>
            Tell VentureLens about a real consumer problem.
            <br />
            We&apos;ll turn it into potential business directions.
          </p>
        </div>

        <div className="vl-scanner">
          <div className="vl-scanner-top">
            <span>WHO IS EXPERIENCING IT?</span>

            <div className="vl-categories">
              {examples.map((example) => (
                <button
                  type="button"
                  key={example.name}
                  className={
                    problem === example.text
                      ? "vl-category active"
                      : "vl-category"
                  }
                  onClick={() => chooseExample(example.text)}
                >
                  {example.name}
                </button>
              ))}
            </div>
          </div>

          <textarea
            value={problem}
            onChange={(e) => {
              setProblem(e.target.value);
              setError("");
            }}
            maxLength={500}
            placeholder="Describe a real consumer problem..."
          />

          <div className="vl-scanner-bottom">
            <span>{problem.length}/500</span>

            <button
              type="button"
              className="vl-analyze"
              onClick={runAnalysis}
              disabled={loading}
            >
              {loading ? (
                <>
                  <span className="vl-spinner" />
                  Analyzing...
                </>
              ) : (
                <>
                  Analyze opportunity
                  <b>✦</b>
                </>
              )}
            </button>
          </div>
        </div>

        <div className="vl-scanner-footer">
          <span>VENTURELENS AI</span>
          <span>TURN PROBLEMS INTO POSSIBILITIES.</span>
        </div>
      </section>

      {/* ERROR */}
      {error && (
        <div className="vl-error">
          <strong>Analysis error</strong>
          <span>{error}</span>
        </div>
      )}

      {/* LOADING */}
      {loading && (
        <section className="vl-loading">
          <div className="vl-loading-ring">
            <span />
          </div>

          <div>
            <div className="vl-small-label">
              VENTURELENS IS ANALYZING
            </div>

            <h3>
              Finding the opportunity inside the problem...
            </h3>

            <p>
              Evaluating business models, customer demand,
              competition, risks and launch possibilities.
            </p>
          </div>
        </section>
      )}

      {/* RESULTS */}
      {analysis && !loading && (
        <section className="vl-results" id="results">
          <div className="vl-results-header">
            <div>
              <div className="vl-small-label">
                AI-GENERATED ANALYSIS
              </div>

              <h2>
                Opportunity
                <br />
                <span>report.</span>
              </h2>
            </div>

            <button
              type="button"
              className={
                saved
                  ? "vl-save saved"
                  : "vl-save"
              }
              onClick={() => setSaved(!saved)}
            >
              {saved ? "Saved ✓" : "Save opportunity"}
            </button>
          </div>

          <div className="vl-summary">
            <div className="vl-score-card">
              <div className="vl-card-label">
                PROBLEM SCORE
              </div>

              <div className="vl-score">
                {analysis.problemScore}
                <small>/100</small>
              </div>

              <div className="vl-score-line">
                <span
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

            <div className="vl-insight">
              <div className="vl-card-label">
                PROBLEM INSIGHT
              </div>

              <p>{analysis.problemSummary}</p>
            </div>
          </div>

          <div className="vl-opportunities-title">
            <span>
              <b>02</b> TOP BUSINESS OPPORTUNITIES
            </span>

            <small>
              Potential directions worth investigating
            </small>
          </div>

          <div className="vl-opportunities">
            {analysis.opportunities.map(
              (opportunity, index) => (
                <button
                  type="button"
                  key={index}
                  className={
                    selected === index
                      ? "vl-opportunity selected"
                      : "vl-opportunity"
                  }
                  onClick={() => {
                    setSelected(index);
                    setTab("overview");
                  }}
                >
                  <div className="vl-opportunity-top">
                    <span>0{index + 1}</span>
                    <b>{opportunity.score}</b>
                  </div>

                  <h3>{opportunity.title}</h3>

                  <p>{opportunity.description}</p>

                  <div className="vl-opportunity-bottom">
                    <span>
                      {opportunity.demand} demand
                    </span>

                    <b>↗</b>
                  </div>
                </button>
              )
            )}
          </div>

          {currentOpportunity && (
            <section className="vl-detail">
              <div className="vl-detail-header">
                <div>
                  <div className="vl-small-label">
                    OPPORTUNITY 0{selected + 1}
                  </div>

                  <h2>{currentOpportunity.title}</h2>
                </div>

                <div className="vl-detail-score">
                  {currentOpportunity.score}
                  <small>/100</small>
                </div>
              </div>

              <div className="vl-tabs">
                {[
                  "overview",
                  "market",
                  "risks",
                  "business",
                ].map((item) => (
                  <button
                    type="button"
                    key={item}
                    className={
                      tab === item
                        ? "active"
                        : ""
                    }
                    onClick={() => setTab(item)}
                  >
                    {item}
                  </button>
                ))}
              </div>

              {tab === "overview" && (
                <div>
                  <p className="vl-description">
                    {currentOpportunity.description}
                  </p>

                  <div className="vl-metrics">
                    <Metric
                      label="STARTUP INVESTMENT"
                      value={
                        currentOpportunity.investment
                      }
                    />

                    <Metric
                      label="REVENUE MODEL"
                      value={
                        currentOpportunity.revenueModel
                      }
                    />

                    <Metric
                      label="CUSTOMER DEMAND"
                      value={
                        currentOpportunity.demand
                      }
                    />

                    <Metric
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
                  <div className="vl-metrics">
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
                <div className="vl-two-columns">
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
                  <div className="vl-card-label">
                    PRACTICAL LAUNCH PLAN
                  </div>

                  <div className="vl-launch">
                    {analysis.launchPlan.map(
                      (step, index) => (
                        <div
                          className="vl-launch-row"
                          key={index}
                        >
                          <span>{step.day}</span>

                          <b>
                            {String(index + 1).padStart(
                              2,
                              "0"
                            )}
                          </b>

                          <p>{step.action}</p>
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

      <footer className="vl-footer">
        <strong>
          VENTURE<span>LENS</span>
        </strong>

        <span>AI BUSINESS OPPORTUNITY FINDER</span>

        <span>TURN PROBLEMS INTO POSSIBILITIES.</span>
      </footer>

      <style jsx global>{`
        * {
          box-sizing: border-box;
        }

        html,
        body {
          margin: 0 !important;
          padding: 0 !important;
          background: #080908 !important;
          color: #efeee8 !important;
          font-family:
            Arial,
            Helvetica,
            sans-serif !important;
        }

        body {
          overflow-x: hidden;
        }

        button,
        textarea {
          font-family: inherit !important;
        }

        button {
          cursor: pointer;
        }

        .vl-page {
          min-height: 100vh;
          background: #080908 !important;
          color: #efeee8 !important;
        }

        /* HEADER */

        .vl-header {
          height: 70px;
          padding: 0 34px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          border-bottom: 1px solid #30312c;
          background: #080908 !important;
          position: relative;
          z-index: 10;
        }

        .vl-logo {
          color: #f0efe9 !important;
          font-size: 20px;
          font-weight: 800;
          letter-spacing: -1px;
        }

        .vl-logo span,
        .vl-footer span {
          color: #d9f000 !important;
        }

        .vl-header-label {
          color: #77786f !important;
          font-size: 9px;
          letter-spacing: 3px;
        }

        /* HERO */

        .vl-hero {
          min-height: 720px;
          position: relative;
          display: flex;
          justify-content: center;
          text-align: center;
          overflow: hidden;
          background:
            radial-gradient(
              circle at 72% 22%,
              rgba(204, 224, 145, 0.2),
              transparent 27%
            ),
            radial-gradient(
              circle at 30% 75%,
              rgba(150, 170, 100, 0.06),
              transparent 30%
            ),
            #080908 !important;
        }

        .vl-grid {
          position: absolute;
          inset: 0;
          opacity: 0.25;
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
            black 0%,
            transparent 90%
          );
        }

        .vl-hero-glow {
          position: absolute;
          width: 520px;
          height: 520px;
          top: -180px;
          right: 5%;
          border-radius: 50%;
          background: rgba(211, 232, 147, 0.12);
          filter: blur(80px);
        }

        .vl-hero-content {
          width: min(1100px, calc(100% - 40px));
          position: relative;
          z-index: 2;
          padding-top: 110px;
        }

        .vl-eyebrow {
          color: #92928a !important;
          font-size: 10px;
          letter-spacing: 3.5px;
        }

        .vl-hero h1 {
          margin: 55px auto 28px !important;
          color: #f0efe9 !important;
          font-size: clamp(55px, 8vw, 110px) !important;
          line-height: 0.88 !important;
          letter-spacing: -6px !important;
          font-weight: 800 !important;
        }

        .vl-hero h1 span {
          color: #d9f000 !important;
        }

        .vl-hero-description {
          max-width: 700px;
          margin: 0 auto;
          color: #a5a49c !important;
          font-size: 16px;
          line-height: 1.7;
        }

        /* THE BUTTON */

        .vl-try-button {
          display: inline-flex !important;
          align-items: center;
          justify-content: center;
          gap: 14px;
          margin-top: 42px !important;
          padding: 16px 27px !important;
          min-width: 190px;
          border: 1px solid #696a60 !important;
          border-radius: 50px !important;
          background: #10110f !important;
          color: #f0efe9 !important;
          font-size: 14px !important;
          font-weight: 700 !important;
          visibility: visible !important;
          opacity: 1 !important;
          position: relative;
          z-index: 20;
          transition: 0.25s ease;
        }

        .vl-try-button b {
          color: #d9f000 !important;
          font-size: 18px;
        }

        .vl-try-button:hover {
          background: #d9f000 !important;
          color: #101010 !important;
          border-color: #d9f000 !important;
          transform: translateY(-3px);
        }

        .vl-try-button:hover b {
          color: #101010 !important;
          transform: translateY(3px);
        }

        .vl-hero-stats {
          margin-top: 75px;
          display: flex;
          justify-content: center;
          align-items: center;
          gap: 25px;
        }

        .vl-hero-stats div {
          display: flex;
          gap: 8px;
          color: #66675f !important;
          font-size: 9px;
          letter-spacing: 2px;
        }

        .vl-hero-stats strong {
          color: #d9f000 !important;
        }

        .vl-hero-stats i {
          width: 45px;
          height: 1px;
          background: #363730;
        }

        .vl-scroll {
          position: absolute;
          bottom: 25px;
          left: 50%;
          transform: translateX(-50%);
          display: flex;
          flex-direction: column;
          gap: 7px;
          color: #55564f !important;
          font-size: 8px;
          letter-spacing: 2px;
        }

        .vl-scroll b {
          color: #d9f000 !important;
          font-size: 15px;
        }

        /* STATEMENT */

        .vl-statement {
          min-height: 350px;
          padding: 65px 7%;
          display: grid;
          grid-template-columns: 90px 1.4fr 0.8fr;
          gap: 50px;
          border-top: 1px solid #30312c;
          border-bottom: 1px solid #30312c;
          background: #0b0c0b !important;
        }

        .vl-statement-number {
          color: #d9f000 !important;
          font-size: 11px;
          letter-spacing: 2px;
        }

        .vl-small-label,
        .vl-card-label {
          color: #77786f !important;
          font-size: 9px;
          letter-spacing: 2.5px;
        }

        .vl-statement-main h2 {
          margin: 17px 0 0;
          color: #eeeDE7 !important;
          font-size: clamp(38px, 5vw, 66px);
          line-height: 0.98;
          letter-spacing: -4px;
        }

        .vl-statement-side {
          padding-top: 10px;
        }

        .vl-statement-side p {
          color: #8f8f87 !important;
          font-size: 14px;
          line-height: 1.7;
          margin: 0 0 24px;
        }

        /* SCANNER */

        .vl-scanner-section {
          padding: 120px 6% 100px;
          background: #080908 !important;
        }

        .vl-scanner-heading {
          max-width: 1250px;
          margin: 0 auto 45px;
          display: flex;
          justify-content: space-between;
          align-items: end;
          gap: 40px;
        }

        .vl-scanner-heading h2 {
          margin: 15px 0 0;
          color: #eeeDE7 !important;
          font-size: clamp(45px, 6vw, 78px);
          line-height: 0.9;
          letter-spacing: -4px;
        }

        .vl-scanner-heading > p {
          color: #77786f !important;
          font-size: 13px;
          line-height: 1.7;
        }

        .vl-scanner {
          max-width: 1250px;
          margin: 0 auto;
          border: 1px solid #484940;
          border-radius: 28px;
          overflow: hidden;
          background: #0c0d0c !important;
        }

        .vl-scanner-top {
          min-height: 92px;
          padding: 24px 30px;
          display: flex;
          align-items: center;
          flex-wrap: wrap;
          gap: 22px;
          border-bottom: 1px solid #353630;
        }

        .vl-scanner-top > span {
          color: #77786f !important;
          font-size: 9px;
          letter-spacing: 2.5px;
        }

        .vl-categories {
          display: flex;
          flex-wrap: wrap;
          gap: 9px;
        }

        .vl-category {
          padding: 10px 17px;
          border: 1px solid #484940 !important;
          border-radius: 30px;
          background: transparent !important;
          color: #aaa9a1 !important;
          font-size: 12px;
        }

        .vl-category:hover,
        .vl-category.active {
          background: #d9f000 !important;
          border-color: #d9f000 !important;
          color: #101010 !important;
        }

        .vl-scanner textarea {
          width: 100%;
          min-height: 320px;
          display: block;
          resize: vertical;
          border: 0 !important;
          outline: 0 !important;
          padding: 38px 35px;
          background: #0b0c0b !important;
          color: #eeeDE7 !important;
          font-size: clamp(25px, 3vw, 40px);
          line-height: 1.25;
        }

        .vl-scanner textarea::placeholder {
          color: #55564f !important;
          opacity: 1;
        }

        .vl-scanner-bottom {
          min-height: 105px;
          padding: 22px 30px;
          border-top: 1px solid #353630;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .vl-scanner-bottom > span {
          color: #66675f !important;
          font-size: 11px;
        }

        .vl-analyze {
          min-width: 210px;
          min-height: 52px;
          border: 0 !important;
          border-radius: 40px;
          background: #050605 !important;
          color: #f0efe9 !important;
          font-size: 13px;
          font-weight: 700;
        }

        .vl-analyze b {
          color: #d9f000 !important;
          margin-left: 8px;
        }

        .vl-analyze:hover:not(:disabled) {
          background: #d9f000 !important;
          color: #101010 !important;
        }

        .vl-analyze:hover:not(:disabled) b {
          color: #101010 !important;
        }

        .vl-spinner {
          display: inline-block;
          width: 13px;
          height: 13px;
          margin-right: 9px;
          border: 2px solid #55564e;
          border-top-color: #d9f000;
          border-radius: 50%;
          animation: vlspin 0.7s linear infinite;
        }

        .vl-scanner-footer {
          max-width: 1250px;
          margin: 15px auto 0;
          display: flex;
          justify-content: space-between;
          color: #50514b !important;
          font-size: 8px;
          letter-spacing: 2px;
        }

        /* ERROR / LOADING */

        .vl-error {
          width: 88%;
          max-width: 1250px;
          margin: -30px auto 70px;
          padding: 20px 24px;
          border: 1px solid #713d3d;
          border-radius: 15px;
          background: #1a0e0e !important;
          display: flex;
          flex-direction: column;
          gap: 7px;
        }

        .vl-error strong {
          color: #ff9999 !important;
        }

        .vl-error span {
          color: #bd7777 !important;
          font-size: 13px;
        }

        .vl-loading {
          width: 88%;
          max-width: 1250px;
          margin: 0 auto 80px;
          padding: 45px;
          display: flex;
          align-items: center;
          gap: 30px;
          border: 1px solid #41423b;
          border-radius: 25px;
          background: #0d0e0d !important;
        }

        .vl-loading-ring {
          width: 65px;
          height: 65px;
          border: 1px solid #44453e;
          border-radius: 50%;
          display: grid;
          place-items: center;
        }

        .vl-loading-ring span {
          width: 32px;
          height: 32px;
          border: 2px solid #44453e;
          border-top-color: #d9f000;
          border-radius: 50%;
          animation: vlspin 0.8s linear infinite;
        }

        .vl-loading h3 {
          margin: 9px 0;
          color: #eeeDE7 !important;
          font-size: 24px;
        }

        .vl-loading p {
          margin: 0;
          color: #77786f !important;
          font-size: 13px;
        }

        /* RESULTS */

        .vl-results {
          padding: 120px 6% 130px;
          border-top: 1px solid #30312c;
          background: #0a0b0a !important;
        }

        .vl-results-header {
          max-width: 1250px;
          margin: 0 auto 60px;
          display: flex;
          justify-content: space-between;
          align-items: end;
        }

        .vl-results-header h2 {
          margin: 15px 0 0;
          color: #eeeDE7 !important;
          font-size: clamp(48px, 6vw, 78px);
          line-height: 0.9;
          letter-spacing: -4px;
        }

        .vl-results-header h2 span {
          color: #d9f000 !important;
        }

        .vl-save {
          padding: 13px 21px;
          border: 1px solid #494a42 !important;
          border-radius: 30px;
          background: transparent !important;
          color: #aaa9a1 !important;
        }

        .vl-save.saved {
          background: #d9f000 !important;
          border-color: #d9f000 !important;
          color: #101010 !important;
        }

        .vl-summary {
          max-width: 1250px;
          margin: 0 auto 80px;
          display: grid;
          grid-template-columns: 0.8fr 1.6fr;
          gap: 17px;
        }

        .vl-score-card,
        .vl-insight {
          padding: 30px;
          border: 1px solid #40413a;
          border-radius: 23px;
          background: #0d0e0d !important;
        }

        .vl-score {
          margin: 20px 0;
          color: #d9f000 !important;
          font-size: 70px;
          font-weight: 800;
          letter-spacing: -4px;
        }

        .vl-score small {
          color: #66675f !important;
          font-size: 16px;
          letter-spacing: 0;
        }

        .vl-score-line {
          height: 3px;
          background: #292a26;
          margin-bottom: 22px;
        }

        .vl-score-line span {
          display: block;
          height: 100%;
          background: #d9f000;
        }

        .vl-score-card p {
          color: #77786f !important;
          font-size: 13px;
          line-height: 1.6;
        }

        .vl-insight {
          display: flex;
          flex-direction: column;
          justify-content: center;
        }

        .vl-insight p {
          max-width: 850px;
          margin: 18px 0 0;
          color: #c0bfb7 !important;
          font-size: 18px;
          line-height: 1.65;
        }

        .vl-opportunities-title {
          max-width: 1250px;
          margin: 0 auto 20px;
          display: flex;
          justify-content: space-between;
          color: #85867e !important;
          font-size: 9px;
          letter-spacing: 2.5px;
        }

        .vl-opportunities-title b {
          color: #d9f000 !important;
          margin-right: 14px;
        }

        .vl-opportunities-title small {
          color: #55564f !important;
          font-size: 10px;
          letter-spacing: 0;
        }

        .vl-opportunities {
          max-width: 1250px;
          margin: 0 auto 80px;
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 16px;
        }

        .vl-opportunity {
          min-height: 315px;
          padding: 28px;
          text-align: left;
          border: 1px solid #3f4039 !important;
          border-radius: 23px;
          background: #0d0e0d !important;
          color: #eeeDE7 !important;
          transition: 0.25s ease;
        }

        .vl-opportunity:hover,
        .vl-opportunity.selected {
          border-color: #d9f000 !important;
          transform: translateY(-4px);
        }

        .vl-opportunity-top {
          display: flex;
          justify-content: space-between;
        }

        .vl-opportunity-top span {
          color: #d9f000 !important;
          font-size: 10px;
          letter-spacing: 2px;
        }

        .vl-opportunity-top b {
          color: #77786f !important;
          font-size: 12px;
        }

        .vl-opportunity h3 {
          margin: 65px 0 15px;
          color: #eeeDE7 !important;
          font-size: 25px;
          line-height: 1.1;
        }

        .vl-opportunity p {
          min-height: 70px;
          color: #77786f !important;
          font-size: 13px;
          line-height: 1.6;
        }

        .vl-opportunity-bottom {
          margin-top: 25px;
          padding-top: 15px;
          border-top: 1px solid #2d2e29;
          display: flex;
          justify-content: space-between;
          color: #66675f !important;
          font-size: 9px;
          text-transform: uppercase;
          letter-spacing: 1.5px;
        }

        .vl-opportunity-bottom b {
          color: #d9f000 !important;
          font-size: 17px;
        }

        /* DETAIL */

        .vl-detail {
          max-width: 1250px;
          margin: 0 auto;
          padding: 40px;
          border: 1px solid #41423b;
          border-radius: 25px;
          background: #0d0e0d !important;
        }

        .vl-detail-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .vl-detail-header h2 {
          margin: 12px 0 0;
          color: #eeeDE7 !important;
          font-size: clamp(34px, 5vw, 58px);
          letter-spacing: -3px;
        }

        .vl-detail-score {
          color: #d9f000 !important;
          font-size: 50px;
          font-weight: 800;
        }

        .vl-detail-score small {
          color: #66675f !important;
          font-size: 15px;
        }

        .vl-tabs {
          margin: 35px 0;
          display: flex;
          gap: 5px;
          border-bottom: 1px solid #363731;
        }

        .vl-tabs button {
          padding: 13px 18px;
          border: 0;
          border-bottom: 2px solid transparent;
          background: transparent;
          color: #66675f !important;
          text-transform: capitalize;
        }

        .vl-tabs button.active {
          color: #d9f000 !important;
          border-bottom-color: #d9f000;
        }

        .vl-description {
          max-width: 900px;
          color: #c1c0b8 !important;
          font-size: 18px;
          line-height: 1.65;
        }

        .vl-metrics {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 12px;
          margin: 30px 0 15px;
        }

        .vl-metric {
          min-height: 115px;
          padding: 22px;
          border: 1px solid #383933;
          border-radius: 17px;
          background: #0a0b0a !important;
        }

        .vl-metric-value {
          margin-top: 15px;
          color: #eeeDE7 !important;
          font-size: 17px;
          font-weight: 700;
          line-height: 1.35;
        }

        .vl-customers {
          margin-top: 15px;
          padding: 22px;
          border: 1px solid #383933;
          border-radius: 17px;
          background: #0a0b0a !important;
        }

        .vl-tags {
          margin-top: 15px;
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
        }

        .vl-tag {
          padding: 9px 13px;
          border: 1px solid #41423b;
          border-radius: 30px;
          color: #aaa9a1 !important;
          font-size: 12px;
        }

        .vl-two-columns {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 60px;
        }

        .vl-list {
          margin-top: 15px;
        }

        .vl-list-item {
          padding: 16px 0;
          border-bottom: 1px solid #30312c;
          color: #aaa9a1 !important;
          font-size: 14px;
          line-height: 1.55;
        }

        .vl-launch {
          margin-top: 20px;
        }

        .vl-launch-row {
          min-height: 72px;
          display: grid;
          grid-template-columns: 120px 45px 1fr;
          align-items: center;
          border-bottom: 1px solid #30312c;
        }

        .vl-launch-row > span {
          color: #66675f !important;
          font-size: 9px;
          letter-spacing: 1.5px;
          text-transform: uppercase;
        }

        .vl-launch-row > b {
          color: #d9f000 !important;
          font-size: 11px;
        }

        .vl-launch-row p {
          color: #b8b7af !important;
          font-size: 14px;
        }

        /* FOOTER */

        .vl-footer {
          min-height: 105px;
          padding: 35px 34px;
          border-top: 1px solid #30312c;
          display: flex;
          justify-content: space-between;
          align-items: center;
          color: #55564f !important;
          font-size: 8px;
          letter-spacing: 2px;
          background: #080908 !important;
        }

        .vl-footer strong {
          color: #d0cfc7 !important;
          font-size: 15px;
          letter-spacing: -0.5px;
        }

        /* ANIMATION */

        @keyframes vlspin {
          to {
            transform: rotate(360deg);
          }
        }

        /* TABLET */

        @media (max-width: 900px) {
          .vl-hero {
            min-height: 680px;
          }

          .vl-statement {
            grid-template-columns: 60px 1fr;
          }

          .vl-statement-side {
            grid-column: 2;
          }

          .vl-scanner-heading {
            flex-direction: column;
            align-items: flex-start;
          }

          .vl-summary,
          .vl-opportunities,
          .vl-two-columns {
            grid-template-columns: 1fr;
          }

          .vl-metrics {
            grid-template-columns: 1fr 1fr;
          }
        }

        /* MOBILE */

        @media (max-width: 600px) {
          .vl-header {
            height: 62px;
            padding: 0 18px;
          }

          .vl-logo {
            font-size: 17px;
          }

          .vl-header-label {
            display: none;
          }

          .vl-hero {
            min-height: 650px;
          }

          .vl-hero-content {
            width: calc(100% - 28px);
            padding-top: 75px;
          }

          .vl-eyebrow {
            font-size: 8px;
            letter-spacing: 2px;
          }

          .vl-hero h1 {
            margin-top: 40px !important;
            font-size: 49px !important;
            letter-spacing: -3px !important;
          }

          .vl-hero-description {
            font-size: 13px;
            line-height: 1.65;
          }

          .vl-try-button {
            margin-top: 32px !important;
          }

          .vl-hero-stats {
            margin-top: 55px;
            gap: 9px;
          }

          .vl-hero-stats div {
            font-size: 7px;
            gap: 5px;
          }

          .vl-hero-stats i {
            width: 18px;
          }

          .vl-statement {
            min-height: auto;
            padding: 50px 22px;
            grid-template-columns: 30px 1fr;
            gap: 18px;
          }

          .vl-statement-main h2 {
            font-size: 40px;
            letter-spacing: -2px;
          }

          .vl-statement-side {
            grid-column: 2;
            padding-top: 0;
          }

          .vl-scanner-section {
            padding: 80px 12px 70px;
          }

          .vl-scanner-heading h2 {
            font-size: 46px;
            letter-spacing: -3px;
          }

          .vl-scanner-heading > p {
            font-size: 12px;
          }

          .vl-scanner {
            border-radius: 20px;
          }

          .vl-scanner-top {
            padding: 20px;
          }

          .vl-categories {
            gap: 6px;
          }

          .vl-category {
            padding: 8px 11px;
            font-size: 9px;
          }

          .vl-scanner textarea {
            min-height: 245px;
            padding: 25px 20px;
            font-size: 24px;
          }

          .vl-scanner-bottom {
            padding: 18px 20px;
            flex-direction: column;
            align-items: stretch;
            gap: 16px;
          }

          .vl-analyze {
            width: 100%;
          }

          .vl-scanner-footer {
            flex-direction: column;
            gap: 8px;
            padding: 0 5px;
          }

          .vl-error,
          .vl-loading {
            width: calc(100% - 24px);
          }

          .vl-loading {
            padding: 28px;
            flex-direction: column;
            align-items: flex-start;
          }

          .vl-results {
            padding: 80px 12px;
          }

          .vl-results-header {
            align-items: flex-start;
            flex-direction: column;
            gap: 25px;
          }

          .vl-results-header h2 {
            font-size: 48px;
          }

          .vl-score-card,
          .vl-insight {
            padding: 24px;
          }

          .vl-opportunities-title {
            flex-direction: column;
            gap: 8px;
          }

          .vl-detail {
            padding: 22px;
            border-radius: 20px;
          }

          .vl-detail-header {
            align-items: flex-start;
            flex-direction: column;
          }

          .vl-detail-header h2 {
            font-size: 37px;
          }

          .vl-tabs {
            overflow-x: auto;
          }

          .vl-tabs button {
            white-space: nowrap;
          }

          .vl-metrics {
            grid-template-columns: 1fr;
          }

          .vl-two-columns {
            gap: 40px;
          }

          .vl-launch-row {
            grid-template-columns: 70px 35px 1fr;
          }

          .vl-footer {
            padding: 28px 20px;
            flex-direction: column;
            align-items: flex-start;
            gap: 13px;
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
    <div className="vl-metric">
      <div className="vl-card-label">{label}</div>
      <div className="vl-metric-value">{value}</div>
    </div>
  );
}

function CustomerList({
  customers,
}: {
  customers: string[];
}) {
  return (
    <div className="vl-customers">
      <div className="vl-card-label">
        TARGET CUSTOMERS
      </div>

      <div className="vl-tags">
        {customers.map((customer, index) => (
          <span className="vl-tag" key={index}>
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
      <div className="vl-card-label">{title}</div>

      <div className="vl-list">
        {items.map((item, index) => (
          <div className="vl-list-item" key={index}>
            {item}
          </div>
        ))}
      </div>
    </div>
  );
}
