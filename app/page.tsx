 "use client";

import { useMemo, useState } from "react";

type Opportunity = {
  title: string;
  score: number;
  investment: string;
  demand: string;
  competition: string;
  model: string;
  description: string;
  tags: string[];
};

const examples: Record<string, { label: string; text: string }> = {
  students: { label: "Students", text: "Students struggle to find affordable healthy food after 8 PM." },
  local: { label: "Local businesses", text: "Small local shops struggle to create effective digital marketing and retain customers." },
  waste: { label: "Environment", text: "Apartment societies generate a lot of recyclable waste that is poorly sorted." },
  jobs: { label: "Employment", text: "Young people have useful skills but struggle to turn them into small income-generating businesses." },
};

function analyzeProblem(text: string): { score: number; opportunities: Opportunity[]; problem: string; customers: string[]; risks: string[] } {
  const t = text.toLowerCase();
  if (t.includes("food") || t.includes("meal") || t.includes("student")) {
    return {
      score: 87,
      problem: "Students need convenient, affordable food outside normal campus hours.",
      customers: ["College students", "Hostel residents", "Young professionals"],
      risks: ["Delivery logistics", "Food safety compliance", "Customer retention"],
      opportunities: [
        { title: "Late-night healthy meal delivery", score: 92, investment: "₹30K–₹60K", demand: "High", competition: "Medium", model: "Per-order + subscription", description: "Pre-order healthy meals for students with scheduled evening delivery windows.", tags: ["Recurring revenue", "Local", "Low inventory"] },
        { title: "Student meal subscription", score: 88, investment: "₹25K–₹50K", demand: "High", competition: "Medium", model: "Weekly / monthly plans", description: "Affordable fixed-price meal plans built around student budgets and schedules.", tags: ["Subscription", "Predictable revenue", "Community"] },
        { title: "Campus healthy snack point", score: 79, investment: "₹40K–₹1L", demand: "Medium–High", competition: "Low–Medium", model: "Retail margin", description: "A compact healthy snack and beverage point positioned near hostels or late-study areas.", tags: ["Offline", "High footfall", "Simple model"] }
      ]
    };
  }
  if (t.includes("waste") || t.includes("plastic") || t.includes("recycl")) {
    return {
      score: 91,
      problem: "Valuable recyclable material is being lost because collection and sorting are inefficient.",
      customers: ["Housing societies", "Recyclers", "Local institutions"],
      risks: ["Collection consistency", "Material price volatility", "Operational complexity"],
      opportunities: [
        { title: "Smart recycling pickup", score: 93, investment: "₹20K–₹70K", demand: "High", competition: "Low–Medium", model: "Pickup fee + material resale", description: "Scheduled pickup and sorting service for societies, offices and campuses.", tags: ["Circular economy", "B2B2C", "Impact"] },
        { title: "Upcycled home products", score: 84, investment: "₹15K–₹50K", demand: "Medium", competition: "Medium", model: "Product sales", description: "Turn selected waste streams into useful, branded home and lifestyle products.", tags: ["D2C", "Creative", "Sustainable"] },
        { title: "Recyclable aggregation hub", score: 81, investment: "₹75K–₹2L", demand: "High", competition: "Medium", model: "Wholesale margin", description: "Aggregate and sort recyclable material before selling in larger batches to processors.", tags: ["B2B", "Scale", "Operations"] }
      ]
    };
  }
  if (t.includes("shop") || t.includes("business") || t.includes("marketing") || t.includes("customer")) {
    return {
      score: 84,
      problem: "Small businesses often lack time, tools and expertise to consistently acquire and retain customers.",
      customers: ["Retail shops", "Cafés", "Salons", "Home businesses"],
      risks: ["Customer acquisition", "Crowded agency market", "Demonstrating ROI"],
      opportunities: [
        { title: "AI marketing copilot for local shops", score: 90, investment: "₹10K–₹35K", demand: "High", competition: "Medium", model: "Monthly subscription", description: "Generate promotions, content calendars and customer re-engagement campaigns from simple business inputs.", tags: ["AI", "SaaS", "Recurring revenue"] },
        { title: "Local loyalty & offers service", score: 83, investment: "₹15K–₹45K", demand: "High", competition: "Medium", model: "Merchant subscription", description: "Help neighborhood businesses create simple digital loyalty and repeat-purchase programs.", tags: ["Retention", "Local", "B2B"] },
        { title: "Done-for-you WhatsApp growth", score: 78, investment: "₹5K–₹20K", demand: "High", competition: "High", model: "Service + retainer", description: "Set up promotional campaigns, catalogs and customer follow-ups for small merchants.", tags: ["Service", "Fast launch", "WhatsApp"] }
      ]
    };
  }
  return {
    score: 82,
    problem: text.trim() ? "A recurring customer problem has been identified and can be explored as a market opportunity." : "Start with a real problem experienced by a specific group of people.",
    customers: ["Students", "Young professionals", "Local consumers"],
    risks: ["Demand uncertainty", "Customer acquisition", "Execution costs"],
    opportunities: [
      { title: "Specialized problem-solving service", score: 88, investment: "₹10K–₹40K", demand: "High", competition: "Medium", model: "Service + subscription", description: "Solve the problem for a narrow customer segment with a simple, repeatable service.", tags: ["Lean startup", "Low cost", "Fast validation"] },
      { title: "Niche digital platform", score: 81, investment: "₹25K–₹1L", demand: "Medium–High", competition: "Medium", model: "Commission + premium", description: "Connect customers and providers around the specific problem with a focused marketplace.", tags: ["Technology", "Network effects", "Scale"] },
      { title: "Productized solution", score: 77, investment: "₹30K–₹1.2L", demand: "Medium", competition: "Medium", model: "Product margin", description: "Package the solution into an affordable product with a clear outcome for customers.", tags: ["Product", "Brand", "D2C"] }
    ]
  };
}

function Icon({ name }: { name: string }) {
  const paths: Record<string, string> = {
    spark: "M12 3l1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8L12 3Zm7 12 .8 2.2L22 18l-2.2.8L19 21l-.8-2.2L16 18l2.2-.8L19 15Z",
    arrow: "M5 12h13m-5-5 5 5-5 5",
    check: "m5 12 4 4L19 6",
    trend: "M4 16l5-5 4 3 7-8M16 6h4v4",
    shield: "M12 3 20 7v5c0 4.5-3.2 7.5-8 9-4.8-1.5-8-4.5-8-9V7l8-4Z",
    target: "M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18Zm0-5a4 4 0 1 0 0-8 4 4 0 0 0 0 8Zm0-4h.01",
    chart: "M4 19V5m0 14h16M8 16v-5m4 5V7m4 9v-8",
    wallet: "M4 7h16v12H4zM4 7l2-3h12l2 3M16 13h4",
  };
  return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d={paths[name] || paths.spark} /></svg>;
}

export default function Home() {
  const [problem, setProblem] = useState("");
  const [category, setCategory] = useState("students");
  const [analyzed, setAnalyzed] = useState(false);
  const [selected, setSelected] = useState(0);
  const [saved, setSaved] = useState<number[]>([]);
  const [activeTab, setActiveTab] = useState("overview");

  const result = useMemo(() => analyzeProblem(problem), [problem]);

  const runAnalysis = () => {
    if (!problem.trim()) setProblem(examples[category].text);
    setAnalyzed(true);
    setSelected(0);
    setActiveTab("overview");
    setTimeout(() => document.getElementById("results")?.scrollIntoView({ behavior: "smooth" }), 50);
  };

  const useExample = (key: string) => {
    setCategory(key);
    setProblem(examples[key].text);
    setAnalyzed(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const opp = result.opportunities[selected];

  return (
    <main>
      <nav className="nav">
        <div className="nav-inner">
          <a className="brand" href="#"><span className="brand-mark"><Icon name="spark" /></span>venture<span>lens</span></a>
          <div className="nav-links">
            <a href="#how">How it works</a><a href="#features">Features</a><a href="#about">Why VentureLens</a>
          </div>
          <button className="nav-cta" onClick={() => document.getElementById("analyzer")?.scrollIntoView({ behavior: "smooth" })}>Try it free <Icon name="arrow" /></button>
        </div>
      </nav>

      <section className="hero">
        <div className="hero-grid">
          <div className="hero-copy">
            <div className="eyebrow"><span className="pulse"></span> AI-powered opportunity discovery</div>
            <h1>Turn everyday<br /><em>problems</em> into<br />real opportunities.</h1>
            <p>VentureLens helps aspiring entrepreneurs identify customer problems, evaluate markets, compare risks and turn promising ideas into practical business concepts.</p>
            <div className="hero-actions">
              <button className="primary" onClick={() => document.getElementById("analyzer")?.scrollIntoView({ behavior: "smooth" })}>Find an opportunity <Icon name="arrow" /></button>
              <a className="text-btn" href="#how">See how it works <Icon name="arrow" /></a>
            </div>
            <div className="trust-row"><span>Built for</span><b>STUDENTS</b><b>FIRST-TIME FOUNDERS</b><b>SMALL BUSINESSES</b></div>
          </div>
          <div className="hero-visual">
            <div className="orbit orbit-a"></div><div className="orbit orbit-b"></div>
            <div className="visual-card main-card">
              <div className="card-top"><span className="mini-label"><Icon name="spark" /> OPPORTUNITY SCAN</span><span className="live-dot">LIVE</span></div>
              <div className="scan-problem">“Students can't find affordable healthy food after 8 PM.”</div>
              <div className="scan-score"><div><span>Opportunity score</span><strong>87</strong><small>/100</small></div><div className="score-ring"><b>87</b><span>STRONG</span></div></div>
              <div className="mini-metrics"><div><span>Demand</span><b>High</b></div><div><span>Competition</span><b>Medium</b></div><div><span>Risk</span><b>Low</b></div></div>
            </div>
            <div className="floating-card f1"><span className="float-icon"><Icon name="target" /></span><div><small>Market fit</small><b>8.7 / 10</b></div></div>
            <div className="floating-card f2"><span className="float-icon"><Icon name="trend" /></span><div><small>Growth potential</small><b>+32%</b></div></div>
          </div>
        </div>
      </section>

      <section className="marquee"><div>DISCOVER <span>•</span> VALIDATE <span>•</span> BUILD <span>•</span> GROW <span>•</span> DISCOVER <span>•</span> VALIDATE <span>•</span> BUILD <span>•</span> GROW</div></section>

      <section className="how section" id="how">
        <div className="section-head"><div><div className="kicker">01 / THE PROCESS</div><h2>From a problem<br />to a <em>business.</em></h2></div><p>Don't start with a random idea. Start with something people actually struggle with.</p></div>
        <div className="steps">
          {[
            ["01","Describe the problem","Tell VentureLens what people are struggling with, in your own words.","target"],
            ["02","Validate the opportunity","Get a structured view of customers, demand, competition and risks.","chart"],
            ["03","Build the concept","Turn the strongest opportunity into a business model, launch plan and financial snapshot.","spark"]
          ].map(([n,t,d,i]) => <div className="step" key={n}><div className="step-num">{n}</div><div className="step-icon"><Icon name={i} /></div><h3>{t}</h3><p>{d}</p><span className="step-arrow">↗</span></div>)}
        </div>
      </section>

      <section className="analyzer section" id="analyzer">
        <div className="analyzer-shell">
          <div className="analyzer-head"><div><div className="kicker">02 / OPPORTUNITY SCANNER</div><h2>What's the <em>problem?</em></h2><p>Describe a consumer problem. We'll turn it into potential business opportunities.</p></div><div className="ai-badge"><Icon name="spark" /> AI ASSISTED</div></div>
          <div className="input-area">
            <div className="category-row"><span>WHO IS EXPERIENCING IT?</span>{Object.entries(examples).map(([k,v]) => <button className={category===k ? "chip active" : "chip"} key={k} onClick={() => {setCategory(k); setProblem(v.text)}}>{v.label}</button>)}</div>
            <textarea value={problem} onChange={e=>setProblem(e.target.value)} placeholder="e.g. Small restaurants struggle to get repeat customers..." />
            <div className="input-bottom"><span>{problem.length}/500</span><button className="primary" onClick={runAnalysis}>Analyze opportunity <Icon name="spark" /></button></div>
          </div>
        </div>
      </section>

      {analyzed && (
        <section className="results section" id="results">
          <div className="result-title"><div><div className="kicker">03 / YOUR ANALYSIS</div><h2>Opportunity <em>report.</em></h2></div><button className="outline" onClick={()=>setAnalyzed(false)}>New problem</button></div>
          <div className="report-grid">
            <aside className="opp-list">
              <div className="list-head"><span>RECOMMENDED OPPORTUNITIES</span><b>{result.opportunities.length}</b></div>
              {result.opportunities.map((o,i)=><button key={o.title} className={selected===i ? "opp-item selected" : "opp-item"} onClick={()=>setSelected(i)}><div><span>0{i+1}</span><h3>{o.title}</h3><p>{o.investment} · {o.model}</p></div><strong>{o.score}</strong></button>)}
            </aside>
            <div className="report-main">
              <div className="report-hero"><div><span className="mini-label"><Icon name="spark" /> TOP OPPORTUNITY</span><h3>{opp.title}</h3><p>{opp.description}</p></div><div className="big-score"><strong>{opp.score}</strong><span>/100</span><small>OPPORTUNITY SCORE</small></div></div>
              <div className="tabs">{["overview","market","risks","business"].map(t=><button className={activeTab===t ? "tab active" : "tab"} key={t} onClick={()=>setActiveTab(t)}>{t}</button>)}</div>
              {activeTab==="overview" && <div className="detail-grid"><div className="detail-card wide"><span className="detail-label">PROBLEM IDENTIFIED</span><h4>{result.problem}</h4><div className="customer-tags">{result.customers.map(c=><span key={c}>{c}</span>)}</div></div><div className="detail-card"><span className="detail-label">EST. INVESTMENT</span><strong className="large">{opp.investment}</strong><p>Lean launch range</p></div><div className="detail-card"><span className="detail-label">REVENUE MODEL</span><strong className="large model">{opp.model}</strong><p>Designed for repeat demand</p></div></div>}
              {activeTab==="market" && <div className="detail-grid"><div className="detail-card wide"><span className="detail-label">MARKET SIGNALS</span><div className="bars"><div><span>Customer demand</span><b>High</b><i style={{width:"88%"}} /></div><div><span>Market accessibility</span><b>High</b><i style={{width:"82%"}} /></div><div><span>Competitive pressure</span><b>Medium</b><i style={{width:"58%"}} /></div><div><span>Scalability</span><b>High</b><i style={{width:"78%"}} /></div></div></div><div className="detail-card"><span className="detail-label">TARGET CUSTOMERS</span>{result.customers.map(c=><p className="checkline" key={c}><Icon name="check"/>{c}</p>)}</div></div>}
              {activeTab==="risks" && <div className="detail-grid"><div className="detail-card wide"><span className="detail-label">KEY RISKS</span>{result.risks.map((r,i)=><div className="risk" key={r}><span>{String(i+1).padStart(2,"0")}</span><div><b>{r}</b><p>Plan a small pilot before committing significant capital.</p></div><strong>{i===1?"MEDIUM":"LOW"}</strong></div>)}</div><div className="detail-card ethics"><span className="detail-label">ETHICS CHECK</span><div className="ethics-icon"><Icon name="shield"/></div><h4>Human-first by design</h4><p>Consider privacy, truthful marketing, accessibility and responsible use of AI when launching.</p></div></div>}
              {activeTab==="business" && <div className="detail-grid"><div className="detail-card wide"><span className="detail-label">30-DAY LAUNCH PLAN</span>{["Interview 10 potential customers and test willingness to pay.","Create a minimum viable version of the service.","Acquire the first 10 paying customers manually.","Measure retention, margin and customer feedback."].map((x,i)=><div className="plan" key={x}><span>{i+1}</span><p>{x}</p><Icon name="check"/></div>)}</div><div className="detail-card"><span className="detail-label">NEXT MOVE</span><h4>Validate before you build.</h4><p>Run a small paid pilot. Real customer behavior is stronger evidence than assumptions.</p><button className="primary full" onClick={()=>alert("Business plan preview created — connect a backend later to save/export it.")}>Build business plan <Icon name="arrow"/></button></div></div>}
              <div className="save-row"><button className={saved.includes(selected) ? "saved" : "save"} onClick={()=>setSaved(s=>s.includes(selected)?s.filter(x=>x!==selected):[...s,selected])}>{saved.includes(selected) ? "✓ Saved to workspace" : "＋ Save opportunity"}</button><span>Demo analysis · estimates are illustrative</span></div>
            </div>
          </div>
        </section>
      )}

      <section className="features section" id="features">
        <div className="section-head"><div><div className="kicker">04 / WHAT YOU GET</div><h2>More than an<br /><em>idea generator.</em></h2></div><p>VentureLens combines opportunity discovery with the thinking an early-stage founder actually needs.</p></div>
        <div className="feature-grid">
          {[["01","Market intelligence","Understand who has the problem, what alternatives exist and where the opportunity may sit.","trend"],["02","Risk & ethics","Surface financial, operational, regulatory and ethical considerations before launch.","shield"],["03","Business feasibility","Estimate investment, pricing, revenue model and the first steps toward validation.","wallet"],["04","AI-assisted thinking","Use structured analysis to challenge assumptions instead of blindly accepting the first idea.","spark"]].map(([n,t,d,i])=><div className="feature-card" key={n}><span>{n}</span><div><div className="feature-icon"><Icon name={i}/></div><h3>{t}</h3><p>{d}</p></div></div>)}
        </div>
      </section>

      <section className="impact section" id="about">
        <div className="impact-inner"><div><div className="kicker">05 / WHY IT MATTERS</div><h2>Technology should<br />create <em>agency.</em></h2><p>Entrepreneurship is often limited by information: people see problems every day but don't know how to evaluate whether those problems can become businesses.</p><p>VentureLens makes the first stage of entrepreneurship more accessible by turning unstructured problems into structured decisions.</p></div><div className="impact-stats"><div><strong>01</strong><span>Identify a real consumer problem</span></div><div><strong>02</strong><span>Evaluate market opportunity</span></div><div><strong>03</strong><span>Understand risk & ethics</span></div><div><strong>04</strong><span>Move toward employment & growth</span></div></div></div>
      </section>

      <footer><div className="brand"><span className="brand-mark"><Icon name="spark"/></span>venture<span>lens</span></div><p>AI-assisted entrepreneurship, built for the first step.</p><span>© 2026 VentureLens</span></footer>
    </main>
  );
}