import { useState, useEffect, useRef, useCallback } from "react";

/* ─── DESIGN TOKENS ──────────────────────────────────────────────────────── */
const TOKENS = `
  @import url('https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;600;700;800;900&family=Inter:wght@300;400;500;600&display=swap');
  @import url('https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200&display=swap');

  :root {
    --primary: #0050cb;
    --primary-container: #0066ff;
    --on-primary: #ffffff;
    --secondary: #006d43;
    --on-secondary: #ffffff;
    --tertiary: #9f3600;
    --surface: #faf8ff;
    --surface-bright: #faf8ff;
    --surface-container-lowest: #ffffff;
    --surface-container-low: #f2f3ff;
    --surface-container: #ecedfa;
    --surface-container-high: #e6e7f4;
    --surface-container-highest: #e1e2ee;
    --surface-variant: #e1e2ee;
    --on-surface: #191b24;
    --on-surface-variant: #424656;
    --outline: #727687;
    --outline-variant: #c2c6d8;
    --error: #ba1a1a;
    --error-container: #ffdad6;
    --on-error-container: #93000a;
    --shadow: rgba(25,27,36,0.06);
    --font-headline: 'Manrope', sans-serif;
    --font-body: 'Inter', sans-serif;
    --r-sm: 4px; --r-md: 12px; --r-lg: 16px; --r-xl: 24px; --r-full: 9999px;
  }
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  html { scroll-behavior: smooth; }
  body { font-family: var(--font-body); background: var(--surface); color: var(--on-surface); -webkit-font-smoothing: antialiased; }
  h1,h2,h3,h4,h5 { font-family: var(--font-headline); }
  a { text-decoration: none; color: inherit; }
  button { cursor: pointer; border: none; background: none; font-family: inherit; }
  img { display: block; max-width: 100%; }
  .ms { font-family: 'Material Symbols Outlined'; font-size: 20px; line-height: 1; vertical-align: middle; font-style: normal;
    font-variation-settings: 'FILL' 0,'wght' 400,'GRAD' 0,'opsz' 24; }
  .ms-fill { font-variation-settings: 'FILL' 1,'wght' 400,'GRAD' 0,'opsz' 24; }
  ::-webkit-scrollbar { width: 6px; }
  ::-webkit-scrollbar-track { background: var(--surface-container-low); }
  ::-webkit-scrollbar-thumb { background: var(--outline-variant); border-radius: 3px; }

  @keyframes pulse { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:.6;transform:scale(.85)} }
  @keyframes fadeUp { from{opacity:0;transform:translateY(18px)} to{opacity:1;transform:translateY(0)} }
  @keyframes shimmer { 0%{background-position:-400px 0} 100%{background-position:400px 0} }

  .fade-up { animation: fadeUp 0.45s ease both; }
  .fade-up-1 { animation: fadeUp 0.45s 0.05s ease both; }
  .fade-up-2 { animation: fadeUp 0.45s 0.12s ease both; }
  .fade-up-3 { animation: fadeUp 0.45s 0.2s ease both; }
`;

/* ─── INITIAL SEED DATA ─────────────────────────────────────────────────── */
const SEED_JOBS = [
  {
    id: 1, featured: true,
    title: "Director of Creative Strategy",
    company: "Lumina Publishing",
    location: "Paris, FR (Hybrid)",
    type: "Contract", category: "Editorial",
    salary: "$140k – $180k",
    deadline: "Oct 24",
    postedAgo: "2d ago",
    urgent: false,
    logo: "LP",
    logoColor: "#0050cb",
    description: "Lead creative strategy across print and digital editorial channels.",
  },
  {
    id: 2, featured: false,
    title: "Principal UX Copywriter",
    company: "FinFlow Tech",
    location: "San Francisco (Remote)",
    type: "Full-time", category: "UX Writing",
    salary: "$165k+",
    deadline: "Nov 12",
    postedAgo: "5d ago",
    urgent: false,
    logo: "FF",
    logoColor: "#006d43",
    description: "Shape the voice and tone of a leading fintech product suite.",
  },
  {
    id: 3, featured: false,
    title: "Editorial Operations Lead",
    company: "Grand Design Mag",
    location: "New York, NY",
    type: "On-site", category: "Ops",
    salary: "",
    deadline: "Oct 21",
    postedAgo: "1w ago",
    urgent: true,
    logo: "GD",
    logoColor: "#9f3600",
    description: "Own editorial ops, workflows, and cross-functional coordination.",
  },
  {
    id: 4, featured: false,
    title: "Senior Narrative Designer",
    company: "Aether Studios",
    location: "Remote",
    type: "Full-time", category: "Narrative",
    salary: "$120k – $145k",
    deadline: "Oct 22",
    postedAgo: "3d ago",
    urgent: false,
    logo: "AS",
    logoColor: "#5b2aab",
    description: "Craft immersive narratives for award-winning interactive experiences.",
  },
  {
    id: 5, featured: false,
    title: "Managing Editor, Tech",
    company: "Vertex Media",
    location: "New York",
    type: "Hybrid", category: "Editorial",
    salary: "$110k – $135k",
    deadline: "Oct 23",
    postedAgo: "4d ago",
    urgent: false,
    logo: "VM",
    logoColor: "#006d43",
    description: "Oversee editorial calendar and manage a team of tech journalists.",
  },
];

const SEED_UPDATES = [
  {
    id: 1,
    title: "Platform Launch: Govt Jobs Category",
    date: "Oct 18, 2024",
    type: "Feature",
    body: "We've launched a dedicated Govt Jobs section covering editorial, policy writing, and communications roles across public sector organizations worldwide.",
  },
  {
    id: 2,
    title: "Q4 Salary Benchmarks Released",
    date: "Oct 12, 2024",
    type: "Report",
    body: "Our annual salary benchmarking report for editorial and creative professionals is now live. Median salaries up 8% YoY across all seniority bands.",
  },
  {
    id: 3,
    title: "New Partner: Oxford University Press",
    date: "Oct 5, 2024",
    type: "Partnership",
    body: "Oxford University Press joins as an exclusive hiring partner. Expect a wave of senior editorial and academic publishing roles over the coming months.",
  },
];

/* ─── XLSX PARSER (via CDN SheetJS) ─────────────────────────────────────── */
function parseXLSX(file) {
  return new Promise((resolve, reject) => {
    if (!window.XLSX) { reject(new Error("XLSX library not loaded")); return; }
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const wb = window.XLSX.read(e.target.result, { type: "array" });
        const ws = wb.Sheets[wb.SheetNames[0]];
        const rows = window.XLSX.utils.sheet_to_json(ws, { defval: "" });
        resolve(rows);
      } catch (err) { reject(err); }
    };
    reader.onerror = reject;
    reader.readAsArrayBuffer(file);
  });
}

/* ─── COMPONENT: NAV ────────────────────────────────────────────────────── */
function Nav({ activePage, onNav }) {
  const links = ["Browse Jobs", "Private Sector", "Govt Jobs", "Curated Lists", "Updates"];
  return (
    <nav style={{
      position: "fixed", top: 0, left: 0, right: 0, zIndex: 100,
      display: "flex", justifyContent: "space-between", alignItems: "center",
      padding: "0 3rem", height: 64,
      background: "rgba(250,248,255,0.82)",
      backdropFilter: "blur(16px)",
      borderBottom: "1px solid rgba(194,198,216,0.20)",
    }}>
      <button onClick={() => onNav("home")} style={{
        fontFamily: "var(--font-headline)", fontSize: "1.15rem", fontWeight: 800,
        letterSpacing: "-0.03em",
        background: "linear-gradient(135deg,#0050cb 0%,#0066ff 100%)",
        WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
        backgroundClip: "text", cursor: "pointer",
      }}>The Editorial Architect</button>

      <div style={{ display: "flex", gap: "2rem", alignItems: "center" }}>
        {links.map(l => (
          <button key={l} onClick={() => onNav(l.toLowerCase().replace(" ", "-"))}
            style={{
              fontSize: "0.875rem", fontWeight: activePage === l.toLowerCase().replace(" ", "-") ? 700 : 500,
              color: activePage === l.toLowerCase().replace(" ", "-") ? "var(--primary)" : "var(--on-surface-variant)",
              position: "relative", transition: "color 0.2s",
            }}>
            {l}
            {activePage === l.toLowerCase().replace(" ", "-") && (
              <span style={{
                position: "absolute", bottom: -4, left: 0, right: 0, height: 2,
                background: "linear-gradient(90deg,var(--primary),var(--primary-container))",
                borderRadius: 2,
              }} />
            )}
          </button>
        ))}
      </div>

      <div style={{ display: "flex", gap: "0.75rem", alignItems: "center" }}>
        <button style={{
          padding: "0.5rem 1.25rem", borderRadius: "var(--r-md)",
          fontSize: "0.875rem", fontWeight: 600, color: "var(--on-surface-variant)",
          transition: "color 0.2s", cursor: "pointer",
        }}>Login</button>
        <button onClick={() => onNav("admin")} style={{
          padding: "0.5rem 1.375rem", borderRadius: "var(--r-md)",
          fontSize: "0.875rem", fontWeight: 700, color: "var(--on-primary)",
          background: "linear-gradient(135deg,var(--primary) 0%,var(--primary-container) 100%)",
          boxShadow: "0 4px 16px rgba(0,80,203,.25)", transition: "transform .15s,box-shadow .2s",
          cursor: "pointer",
        }}>Admin ↗</button>
      </div>
    </nav>
  );
}

/* ─── COMPONENT: JOB CARD ───────────────────────────────────────────────── */
function JobCard({ job, bookmarked, onBookmark, delay = 0 }) {
  const [hovered, setHovered] = useState(false);
  return (
    <article
      className={`fade-up`}
      style={{
        background: hovered ? "var(--surface-bright)" : "var(--surface-container-lowest)",
        borderRadius: "var(--r-xl)", padding: "1.625rem",
        display: "flex", gap: "1.25rem",
        transition: "background .2s,transform .2s,box-shadow .2s",
        marginBottom: "1.125rem", cursor: "pointer",
        boxShadow: hovered ? "0 12px 32px var(--shadow)" : job.featured ? "0 2px 12px rgba(0,80,203,.06)" : "none",
        transform: hovered ? "translateY(-2px)" : "none",
        animationDelay: `${delay}s`,
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Logo */}
      <div style={{
        width: 56, height: 56, flexShrink: 0, borderRadius: "var(--r-lg)",
        background: job.logoColor + "18",
        display: "flex", alignItems: "center", justifyContent: "center",
        fontFamily: "var(--font-headline)", fontSize: "1.1rem", fontWeight: 800,
        color: job.logoColor,
      }}>{job.logo}</div>

      {/* Body */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "1rem", marginBottom: "0.5rem" }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "0.625rem", flexWrap: "wrap" }}>
              <h3 style={{
                fontSize: "1.125rem", fontWeight: 800, letterSpacing: "-0.02em", lineHeight: 1.25,
                color: hovered ? "var(--primary)" : "var(--on-surface)", transition: "color .18s",
              }}>{job.title}</h3>
              {job.urgent && (
                <span style={{
                  padding: "0.2rem 0.5rem", background: "var(--error-container)", color: "var(--on-error-container)",
                  borderRadius: "var(--r-sm)", fontSize: "0.65rem", fontWeight: 800, letterSpacing: "0.08em", textTransform: "uppercase",
                }}>Urgent</span>
              )}
            </div>
            <div style={{ fontSize: "0.875rem", fontWeight: 500, color: "var(--on-surface-variant)", display: "flex", alignItems: "center", gap: "0.375rem" }}>
              {job.company} <span style={{ opacity: 0.4 }}>•</span> {job.location}
            </div>
          </div>
          <button
            onClick={(e) => { e.stopPropagation(); onBookmark(job.id); }}
            style={{
              width: 36, height: 36, borderRadius: "50%",
              display: "flex", alignItems: "center", justifyContent: "center",
              color: bookmarked ? "var(--primary)" : "var(--on-surface-variant)",
              transition: "background .18s", flexShrink: 0,
            }}>
            <i className={`ms ms-fill`} style={{ fontSize: 20, fontVariationSettings: bookmarked ? "'FILL' 1,'wght' 400,'GRAD' 0,'opsz' 24" : "'FILL' 0,'wght' 400,'GRAD' 0,'opsz' 24" }}>
              {bookmarked ? "bookmark" : "bookmark_border"}
            </i>
          </button>
        </div>

        <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem", marginBottom: "1.125rem" }}>
          {[job.category, job.type].map(t => (
            <span key={t} style={{ padding: "0.25rem 0.75rem", borderRadius: "var(--r-full)", background: "var(--surface-container-high)", color: "var(--on-surface-variant)", fontSize: "0.75rem", fontWeight: 600 }}>{t}</span>
          ))}
          {job.salary && (
            <span style={{ padding: "0.25rem 0.75rem", borderRadius: "var(--r-full)", background: "rgba(0,109,67,0.09)", color: "var(--secondary)", fontSize: "0.75rem", fontWeight: 700 }}>{job.salary}</span>
          )}
        </div>

        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", paddingTop: "1rem", borderTop: "1px solid rgba(194,198,216,.20)", gap: "1rem" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
            <span style={{ display: "flex", alignItems: "center", gap: "0.3rem", fontSize: "0.8125rem", color: "var(--on-surface-variant)" }}>
              <i className="ms" style={{ fontSize: 15 }}>schedule</i> Posted {job.postedAgo}
            </span>
            <span style={{ display: "flex", alignItems: "center", gap: "0.3rem", fontSize: "0.8125rem", color: job.urgent ? "var(--tertiary)" : "var(--on-surface-variant)", fontWeight: job.urgent ? 600 : 400 }}>
              <i className="ms" style={{ fontSize: 15 }}>event</i> Deadline: {job.deadline}
            </span>
          </div>
          <button style={{
            padding: "0.5rem 1.375rem", borderRadius: "var(--r-md)", fontSize: "0.8125rem", fontWeight: 700,
            color: "var(--on-secondary)", background: "var(--secondary)",
            boxShadow: "0 2px 8px rgba(0,109,67,.20)", transition: "background .18s,transform .15s",
            whiteSpace: "nowrap", flexShrink: 0,
          }}>Quick Apply</button>
        </div>
      </div>
    </article>
  );
}

/* ─── COMPONENT: UPDATE CARD ─────────────────────────────────────────────── */
function UpdateCard({ update, delay = 0 }) {
  const colors = { Feature: "var(--primary)", Report: "var(--secondary)", Partnership: "var(--tertiary)" };
  const bgs = { Feature: "rgba(0,80,203,.08)", Report: "rgba(0,109,67,.08)", Partnership: "rgba(159,54,0,.08)" };
  return (
    <div className="fade-up" style={{
      background: "var(--surface-container-lowest)", borderRadius: "var(--r-xl)",
      padding: "1.5rem", marginBottom: "1.125rem", animationDelay: `${delay}s`,
      boxShadow: "0 1px 4px var(--shadow)",
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "0.875rem" }}>
        <span style={{
          padding: "0.2rem 0.7rem", borderRadius: "var(--r-full)",
          background: bgs[update.type] || "var(--surface-container-high)",
          color: colors[update.type] || "var(--on-surface-variant)",
          fontSize: "0.7rem", fontWeight: 800, letterSpacing: "0.07em", textTransform: "uppercase",
        }}>{update.type}</span>
        <span style={{ fontSize: "0.8125rem", color: "var(--on-surface-variant)" }}>{update.date}</span>
      </div>
      <h3 style={{ fontSize: "1.0625rem", fontWeight: 800, letterSpacing: "-0.02em", marginBottom: "0.5rem" }}>{update.title}</h3>
      <p style={{ fontSize: "0.875rem", color: "var(--on-surface-variant)", lineHeight: 1.7 }}>{update.body}</p>
    </div>
  );
}

/* ─── PAGE: HOME / BROWSE JOBS ──────────────────────────────────────────── */
function BrowsePage({ jobs, bookmarks, onBookmark }) {
  const [activeChip, setActiveChip] = useState("All");
  const chips = ["All", "Full-time", "Contract", "Remote", "On-site", "Hybrid", "Govt"];

  const filtered = activeChip === "All" ? jobs
    : jobs.filter(j => j.type === activeChip || j.location?.toLowerCase().includes(activeChip.toLowerCase()));

  const deadlineSoon = [...jobs]
    .sort((a, b) => new Date("2024 " + a.deadline) - new Date("2024 " + b.deadline))
    .slice(0, 3);

  const urgencyLevel = (d) => {
    const diff = (new Date("2024 " + d) - new Date("2024 Oct 20")) / 3600000;
    if (diff < 24) return "critical";
    if (diff < 40) return "warning";
    return "safe";
  };
  const urgencyLabel = (d) => {
    const diff = Math.round((new Date("2024 " + d) - new Date("2024 Oct 20")) / 3600000);
    if (diff < 0) return "Expired";
    return `Closing in ${diff}h`;
  };
  const urgencyColor = { critical: "var(--error)", warning: "var(--tertiary)", safe: "var(--secondary)" };
  const urgencyBg = { critical: "var(--error-container)", warning: "rgba(159,54,0,.08)", safe: "rgba(0,109,67,.08)" };

  return (
    <main style={{ paddingTop: 88, paddingBottom: "5rem" }}>
      {/* Hero */}
      <header className="fade-up" style={{ padding: "3.5rem 3rem 2.5rem", maxWidth: 1280, margin: "0 auto" }}>
        <div style={{
          display: "inline-flex", alignItems: "center", gap: "0.5rem",
          padding: "0.25rem 0.875rem", background: "rgba(0,80,203,.08)",
          borderRadius: "var(--r-full)", fontSize: "0.75rem", fontWeight: 700,
          letterSpacing: "0.06em", textTransform: "uppercase", color: "var(--primary)", marginBottom: "1.25rem",
        }}>
          <span style={{ width: 6, height: 6, borderRadius: "50%", background: "var(--primary)", animation: "pulse 2s infinite" }} />
          Live Curated List
        </div>
        <h1 style={{ fontSize: "clamp(2.25rem,4vw,3.5rem)", fontWeight: 900, letterSpacing: "-0.04em", lineHeight: 1.1, marginBottom: "1rem" }}>
          Welcome back, <span style={{ background: "linear-gradient(135deg,var(--primary) 0%,var(--primary-container) 100%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>Curator.</span>
        </h1>
        <p style={{ fontSize: "1.0625rem", color: "var(--on-surface-variant)", maxWidth: 540, lineHeight: 1.7 }}>
          Your curated shortlist of high-impact opportunities, ranked by editorial priority and approaching deadlines.
        </p>
        <div style={{ display: "flex", gap: "1.5rem", marginTop: "2rem", flexWrap: "wrap" }}>
          {[
            { dot: "var(--secondary)", val: jobs.length, label: "Saved roles" },
            { dot: "var(--tertiary)", val: jobs.filter(j => j.urgent).length + 2, label: "Closing soon" },
            { dot: "var(--primary)", val: 2, label: "New matches" },
          ].map(p => (
            <div key={p.label} style={{
              display: "flex", alignItems: "center", gap: "0.5rem",
              padding: "0.5rem 1rem", background: "var(--surface-container-lowest)",
              borderRadius: "var(--r-full)", boxShadow: "0 1px 3px rgba(25,27,36,.07)",
            }}>
              <span style={{ width: 8, height: 8, borderRadius: "50%", background: p.dot, flexShrink: 0 }} />
              <span style={{ fontFamily: "var(--font-headline)", fontSize: "1rem", fontWeight: 800 }}>{p.val}</span>
              <span style={{ fontSize: "0.8125rem", color: "var(--on-surface-variant)" }}>{p.label}</span>
            </div>
          ))}
        </div>
      </header>

      {/* Bento */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 2.2fr", gap: "1.75rem", padding: "0 3rem", maxWidth: 1280, margin: "0 auto", alignItems: "start" }}>

        {/* Sidebar */}
        <aside style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
          {/* Deadline Widget */}
          <div style={{ background: "var(--surface-container-low)", borderRadius: "var(--r-xl)", padding: "1.5rem", position: "relative", overflow: "hidden" }}>
            <div style={{ position: "absolute", top: -40, right: -40, width: 140, height: 140, borderRadius: "50%", background: "rgba(159,54,0,.07)", pointerEvents: "none" }} />
            <div style={{ display: "flex", alignItems: "center", gap: "0.625rem", marginBottom: "1.25rem" }}>
              <i className="ms ms-fill" style={{ color: "var(--tertiary)", fontSize: 22, fontVariationSettings: "'FILL' 1,'wght' 500,'GRAD' 0,'opsz' 24" }}>alarm</i>
              <h2 style={{ fontSize: "1rem", fontWeight: 700 }}>Deadline Alert</h2>
            </div>
            {deadlineSoon.map(j => {
              const lvl = urgencyLevel(j.deadline);
              return (
                <div key={j.id} style={{
                  background: "var(--surface-container-lowest)", borderRadius: "var(--r-md)",
                  padding: "1rem 1rem 1rem 1.125rem", position: "relative",
                  marginBottom: "0.75rem", cursor: "pointer",
                  borderLeft: `3.5px solid ${urgencyColor[lvl]}`,
                  transition: "transform .2s",
                }}>
                  <div style={{ fontSize: "0.6875rem", fontWeight: 800, letterSpacing: "0.08em", textTransform: "uppercase", color: urgencyColor[lvl], marginBottom: "0.375rem" }}>
                    {urgencyLabel(j.deadline)}
                  </div>
                  <div style={{ fontSize: "0.9375rem", fontWeight: 700, lineHeight: 1.3, marginBottom: "0.2rem" }}>{j.title}</div>
                  <div style={{ fontSize: "0.8125rem", color: "var(--on-surface-variant)", marginBottom: "0.75rem" }}>{j.company} • {j.location}</div>
                  <div style={{ fontSize: "0.8125rem", fontWeight: 700, color: "var(--primary)", display: "flex", alignItems: "center", gap: "0.25rem" }}>
                    Apply Now <i className="ms" style={{ fontSize: 16 }}>arrow_forward</i>
                  </div>
                </div>
              );
            })}
            <div style={{ fontSize: "0.75rem", color: "var(--on-surface-variant)", marginTop: "0.875rem", paddingTop: "0.625rem", borderTop: "1px solid rgba(194,198,216,.25)", fontStyle: "italic" }}>
              Showing {deadlineSoon.length} roles closing within the next 48 hours.
            </div>
          </div>

          {/* Filter Chips */}
          <div style={{ background: "var(--surface-container-low)", borderRadius: "var(--r-xl)", padding: "1.25rem 1.5rem" }}>
            <div style={{ fontSize: "0.75rem", fontWeight: 700, letterSpacing: "0.07em", textTransform: "uppercase", color: "var(--on-surface-variant)", marginBottom: "0.75rem" }}>Filter by type</div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
              {chips.map(c => (
                <button key={c} onClick={() => setActiveChip(c)} style={{
                  padding: "0.3125rem 0.875rem", borderRadius: "var(--r-full)",
                  fontSize: "0.8125rem", fontWeight: 600,
                  background: activeChip === c ? "var(--primary)" : "var(--surface-container-high)",
                  color: activeChip === c ? "white" : "var(--on-surface-variant)",
                  transition: "background .18s,color .18s", cursor: "pointer",
                }}>{c}</button>
              ))}
            </div>
          </div>

          {/* Promo Widget */}
          <div style={{
            borderRadius: "var(--r-xl)", padding: "1.5rem",
            background: "linear-gradient(135deg,var(--primary) 0%,#1a6eff 100%)",
            color: "white", position: "relative", overflow: "hidden",
          }}>
            <div style={{ position: "absolute", bottom: -30, right: -30, width: 120, height: 120, borderRadius: "50%", background: "rgba(255,255,255,.08)", pointerEvents: "none" }} />
            <h3 style={{ fontSize: "1.0625rem", fontWeight: 800, marginBottom: "0.5rem", position: "relative", zIndex: 1 }}>Resume Review</h3>
            <p style={{ fontSize: "0.8125rem", lineHeight: 1.6, opacity: 0.88, marginBottom: "1.25rem", position: "relative", zIndex: 1 }}>
              Get professional editorial feedback on your portfolio before you apply. Elevate your first impression.
            </p>
            <button style={{
              display: "inline-flex", alignItems: "center", gap: "0.375rem",
              padding: "0.5rem 1.125rem",
              background: "rgba(255,255,255,.18)", border: "1px solid rgba(255,255,255,.3)",
              borderRadius: "var(--r-md)", color: "white", fontSize: "0.8125rem", fontWeight: 700,
              backdropFilter: "blur(8px)", position: "relative", zIndex: 1, cursor: "pointer",
            }}>Learn More <i className="ms" style={{ fontSize: 16 }}>open_in_new</i></button>
          </div>
        </aside>

        {/* Job Panel */}
        <section>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1.75rem" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
              <h2 style={{ fontSize: "1.375rem", fontWeight: 800, letterSpacing: "-0.03em" }}>Saved Jobs</h2>
              <span style={{
                display: "inline-flex", alignItems: "center", justifyContent: "center",
                minWidth: 28, height: 24, padding: "0 0.5rem",
                background: "var(--surface-container-high)", borderRadius: "var(--r-full)",
                fontSize: "0.75rem", fontWeight: 700, color: "var(--on-surface-variant)",
              }}>{filtered.length}</span>
            </div>
          </div>

          {filtered.length === 0 ? (
            <div style={{ textAlign: "center", padding: "3rem", color: "var(--on-surface-variant)" }}>
              No jobs match this filter.
            </div>
          ) : (
            filtered.map((job, i) => (
              <JobCard key={job.id} job={job} bookmarked={bookmarks.has(job.id)} onBookmark={onBookmark} delay={i * 0.08} />
            ))
          )}

          <div style={{ textAlign: "center", marginTop: "2.25rem" }}>
            <button style={{
              display: "inline-flex", alignItems: "center", gap: "0.5rem",
              padding: "0.75rem 2rem", borderRadius: "var(--r-full)",
              border: "1px solid rgba(194,198,216,.45)",
              fontSize: "0.875rem", fontWeight: 700, color: "var(--on-surface-variant)",
              transition: "background .18s,color .18s", cursor: "pointer",
            }}>View All Saved Roles <i className="ms" style={{ fontSize: 18 }}>expand_more</i></button>
          </div>
        </section>
      </div>
    </main>
  );
}

/* ─── PAGE: UPDATES ─────────────────────────────────────────────────────── */
function UpdatesPage({ updates }) {
  return (
    <main style={{ paddingTop: 88, paddingBottom: "5rem" }}>
      <header className="fade-up" style={{ padding: "3.5rem 3rem 2.5rem", maxWidth: 1280, margin: "0 auto" }}>
        <div style={{
          display: "inline-flex", alignItems: "center", gap: "0.5rem",
          padding: "0.25rem 0.875rem", background: "rgba(0,109,67,.08)",
          borderRadius: "var(--r-full)", fontSize: "0.75rem", fontWeight: 700,
          letterSpacing: "0.06em", textTransform: "uppercase", color: "var(--secondary)", marginBottom: "1.25rem",
        }}>
          <i className="ms" style={{ fontSize: 14 }}>rss_feed</i> Platform Updates
        </div>
        <h1 style={{ fontSize: "clamp(2rem,4vw,3rem)", fontWeight: 900, letterSpacing: "-0.04em", lineHeight: 1.1, marginBottom: "1rem" }}>
          Latest <span style={{ background: "linear-gradient(135deg,var(--secondary) 0%,#00a064 100%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>News & Updates</span>
        </h1>
        <p style={{ fontSize: "1rem", color: "var(--on-surface-variant)", maxWidth: 520, lineHeight: 1.7 }}>
          Stay informed about new features, partnerships, and editorial insights from the platform.
        </p>
      </header>
      <div style={{ maxWidth: 800, margin: "0 auto", padding: "0 3rem" }}>
        {updates.length === 0 ? (
          <div style={{ textAlign: "center", padding: "4rem", color: "var(--on-surface-variant)" }}>No updates yet. Check back soon.</div>
        ) : (
          updates.map((u, i) => <UpdateCard key={u.id} update={u} delay={i * 0.08} />)
        )}
      </div>
    </main>
  );
}

/* ─── ADMIN: EXCEL TEMPLATE COLUMNS ─────────────────────────────────────── */
const JOB_COLUMNS = ["title", "company", "location", "type", "category", "salary", "deadline", "postedAgo", "urgent", "logo", "logoColor", "description"];
const UPDATE_COLUMNS = ["title", "date", "type", "body"];

/* ─── ADMIN: FILE DROP ZONE ─────────────────────────────────────────────── */
function DropZone({ onFile, accept, label }) {
  const [dragging, setDragging] = useState(false);
  const inputRef = useRef();
  return (
    <div
      onClick={() => inputRef.current.click()}
      onDragOver={e => { e.preventDefault(); setDragging(true); }}
      onDragLeave={() => setDragging(false)}
      onDrop={e => { e.preventDefault(); setDragging(false); const f = e.dataTransfer.files[0]; if (f) onFile(f); }}
      style={{
        border: `2px dashed ${dragging ? "var(--primary)" : "var(--outline-variant)"}`,
        borderRadius: "var(--r-xl)", padding: "2.5rem 2rem",
        textAlign: "center", cursor: "pointer",
        background: dragging ? "rgba(0,80,203,.04)" : "var(--surface-container-low)",
        transition: "border-color .18s,background .18s",
      }}>
      <i className="ms" style={{ fontSize: 36, color: "var(--on-surface-variant)", marginBottom: "0.75rem", display: "block" }}>upload_file</i>
      <p style={{ fontSize: "0.9375rem", fontWeight: 700, marginBottom: "0.375rem" }}>{label}</p>
      <p style={{ fontSize: "0.8125rem", color: "var(--on-surface-variant)" }}>Drag & drop or click to browse — .xlsx or .csv</p>
      <input ref={inputRef} type="file" accept={accept} style={{ display: "none" }} onChange={e => { if (e.target.files[0]) onFile(e.target.files[0]); }} />
    </div>
  );
}

/* ─── ADMIN: INLINE TOAST ───────────────────────────────────────────────── */
function Toast({ msg, type }) {
  if (!msg) return null;
  return (
    <div style={{
      padding: "0.75rem 1.25rem", borderRadius: "var(--r-md)", marginBottom: "1rem",
      background: type === "error" ? "var(--error-container)" : "rgba(0,109,67,.1)",
      color: type === "error" ? "var(--on-error-container)" : "var(--secondary)",
      fontSize: "0.875rem", fontWeight: 600,
      display: "flex", alignItems: "center", gap: "0.5rem",
    }}>
      <i className="ms" style={{ fontSize: 18 }}>{type === "error" ? "error" : "check_circle"}</i>
      {msg}
    </div>
  );
}

/* ─── ADMIN: DATA TABLE ─────────────────────────────────────────────────── */
function DataTable({ rows, columns, onDelete }) {
  if (!rows.length) return <p style={{ color: "var(--on-surface-variant)", fontSize: "0.875rem" }}>No records yet.</p>;
  return (
    <div style={{ overflowX: "auto", borderRadius: "var(--r-lg)", border: "1px solid var(--outline-variant)" }}>
      <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.8125rem" }}>
        <thead>
          <tr style={{ background: "var(--surface-container-high)" }}>
            {columns.map(c => (
              <th key={c} style={{ padding: "0.75rem 1rem", textAlign: "left", fontWeight: 700, color: "var(--on-surface-variant)", whiteSpace: "nowrap", fontSize: "0.75rem", letterSpacing: "0.04em", textTransform: "uppercase" }}>{c}</th>
            ))}
            <th style={{ padding: "0.75rem 1rem", textAlign: "center", fontWeight: 700, color: "var(--on-surface-variant)", fontSize: "0.75rem" }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr key={row.id} style={{ borderTop: "1px solid var(--outline-variant)", background: i % 2 === 0 ? "var(--surface-container-lowest)" : "var(--surface-container-low)" }}>
              {columns.map(c => (
                <td key={c} style={{ padding: "0.75rem 1rem", color: "var(--on-surface)", maxWidth: 180, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                  {String(row[c] ?? "")}
                </td>
              ))}
              <td style={{ padding: "0.75rem 1rem", textAlign: "center" }}>
                <button onClick={() => onDelete(row.id)} style={{ color: "var(--error)", fontSize: "0.75rem", fontWeight: 700, cursor: "pointer", display: "inline-flex", alignItems: "center", gap: "0.25rem" }}>
                  <i className="ms" style={{ fontSize: 16 }}>delete</i> Remove
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

/* ─── ADMIN: MANUAL ADD FORM ─────────────────────────────────────────────── */
function AddJobForm({ onAdd }) {
  const [form, setForm] = useState({ title: "", company: "", location: "", type: "Full-time", category: "Editorial", salary: "", deadline: "", postedAgo: "Just now", urgent: false, logo: "", logoColor: "#0050cb", description: "" });
  const [err, setErr] = useState("");
  const set = k => e => setForm(f => ({ ...f, [k]: e.target.type === "checkbox" ? e.target.checked : e.target.value }));
  const submit = () => {
    if (!form.title || !form.company) { setErr("Title and Company are required."); return; }
    onAdd({ ...form, id: Date.now(), logo: form.logo || form.company.slice(0, 2).toUpperCase(), featured: false });
    setForm({ title: "", company: "", location: "", type: "Full-time", category: "Editorial", salary: "", deadline: "", postedAgo: "Just now", urgent: false, logo: "", logoColor: "#0050cb", description: "" });
    setErr("");
  };
  const field = (label, key, type = "text", opts = null) => (
    <div style={{ display: "flex", flexDirection: "column", gap: "0.375rem" }}>
      <label style={{ fontSize: "0.75rem", fontWeight: 700, color: "var(--on-surface-variant)", letterSpacing: "0.04em", textTransform: "uppercase" }}>{label}</label>
      {opts ? (
        <select value={form[key]} onChange={set(key)} style={{ padding: "0.5rem 0.75rem", borderRadius: "var(--r-md)", border: "1px solid var(--outline-variant)", background: "var(--surface-container-lowest)", fontFamily: "var(--font-body)", fontSize: "0.875rem", color: "var(--on-surface)" }}>
          {opts.map(o => <option key={o}>{o}</option>)}
        </select>
      ) : type === "checkbox" ? (
        <label style={{ display: "flex", alignItems: "center", gap: "0.5rem", fontSize: "0.875rem" }}>
          <input type="checkbox" checked={form[key]} onChange={set(key)} />
          Mark as Urgent
        </label>
      ) : (
        <input type={type} value={form[key]} onChange={set(key)} style={{ padding: "0.5rem 0.75rem", borderRadius: "var(--r-md)", border: "1px solid var(--outline-variant)", background: "var(--surface-container-lowest)", fontFamily: "var(--font-body)", fontSize: "0.875rem", color: "var(--on-surface)", outline: "none" }} />
      )}
    </div>
  );
  return (
    <div style={{ background: "var(--surface-container-low)", borderRadius: "var(--r-xl)", padding: "1.5rem" }}>
      <h3 style={{ fontSize: "1rem", fontWeight: 800, marginBottom: "1.25rem" }}>Add Job Manually</h3>
      {err && <Toast msg={err} type="error" />}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(200px,1fr))", gap: "0.875rem", marginBottom: "1rem" }}>
        {field("Job Title *", "title")}
        {field("Company *", "company")}
        {field("Location", "location")}
        {field("Type", "type", "text", ["Full-time", "Part-time", "Contract", "Freelance", "On-site", "Remote", "Hybrid"])}
        {field("Category", "category", "text", ["Editorial", "UX Writing", "Ops", "Narrative", "Copywriting", "Strategy", "Govt"])}
        {field("Salary", "salary")}
        {field("Deadline", "deadline")}
        {field("Logo Initials", "logo")}
        {field("Logo Color", "logoColor", "color")}
        <div style={{ display: "flex", flexDirection: "column", gap: "0.375rem" }}>
          <label style={{ fontSize: "0.75rem", fontWeight: 700, color: "var(--on-surface-variant)", letterSpacing: "0.04em", textTransform: "uppercase" }}>Urgent</label>
          <label style={{ display: "flex", alignItems: "center", gap: "0.5rem", fontSize: "0.875rem", marginTop: "0.25rem" }}>
            <input type="checkbox" checked={form.urgent} onChange={set("urgent")} />
            Mark as Urgent
          </label>
        </div>
      </div>
      <div style={{ marginBottom: "1rem" }}>
        <label style={{ fontSize: "0.75rem", fontWeight: 700, color: "var(--on-surface-variant)", letterSpacing: "0.04em", textTransform: "uppercase", display: "block", marginBottom: "0.375rem" }}>Description</label>
        <textarea value={form.description} onChange={set("description")} rows={3} style={{ width: "100%", padding: "0.5rem 0.75rem", borderRadius: "var(--r-md)", border: "1px solid var(--outline-variant)", background: "var(--surface-container-lowest)", fontFamily: "var(--font-body)", fontSize: "0.875rem", color: "var(--on-surface)", resize: "vertical", outline: "none" }} />
      </div>
      <button onClick={submit} style={{
        padding: "0.625rem 1.75rem", borderRadius: "var(--r-md)", fontSize: "0.875rem", fontWeight: 700,
        color: "var(--on-primary)", background: "linear-gradient(135deg,var(--primary) 0%,var(--primary-container) 100%)",
        boxShadow: "0 4px 16px rgba(0,80,203,.25)", cursor: "pointer",
        display: "inline-flex", alignItems: "center", gap: "0.5rem",
      }}><i className="ms" style={{ fontSize: 18 }}>add_circle</i> Add Job</button>
    </div>
  );
}

/* ─── ADMIN: ADD UPDATE FORM ─────────────────────────────────────────────── */
function AddUpdateForm({ onAdd }) {
  const [form, setForm] = useState({ title: "", date: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }), type: "Feature", body: "" });
  const [err, setErr] = useState("");
  const set = k => e => setForm(f => ({ ...f, [k]: e.target.value }));
  const submit = () => {
    if (!form.title || !form.body) { setErr("Title and body are required."); return; }
    onAdd({ ...form, id: Date.now() });
    setForm({ title: "", date: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }), type: "Feature", body: "" });
    setErr("");
  };
  return (
    <div style={{ background: "var(--surface-container-low)", borderRadius: "var(--r-xl)", padding: "1.5rem" }}>
      <h3 style={{ fontSize: "1rem", fontWeight: 800, marginBottom: "1.25rem" }}>Add Update Manually</h3>
      {err && <Toast msg={err} type="error" />}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "0.875rem", marginBottom: "1rem" }}>
        {[["Title *", "title"], ["Date", "date"]].map(([l, k]) => (
          <div key={k} style={{ display: "flex", flexDirection: "column", gap: "0.375rem" }}>
            <label style={{ fontSize: "0.75rem", fontWeight: 700, color: "var(--on-surface-variant)", letterSpacing: "0.04em", textTransform: "uppercase" }}>{l}</label>
            <input value={form[k]} onChange={set(k)} style={{ padding: "0.5rem 0.75rem", borderRadius: "var(--r-md)", border: "1px solid var(--outline-variant)", background: "var(--surface-container-lowest)", fontFamily: "var(--font-body)", fontSize: "0.875rem", color: "var(--on-surface)", outline: "none" }} />
          </div>
        ))}
        <div style={{ display: "flex", flexDirection: "column", gap: "0.375rem" }}>
          <label style={{ fontSize: "0.75rem", fontWeight: 700, color: "var(--on-surface-variant)", letterSpacing: "0.04em", textTransform: "uppercase" }}>Type</label>
          <select value={form.type} onChange={set("type")} style={{ padding: "0.5rem 0.75rem", borderRadius: "var(--r-md)", border: "1px solid var(--outline-variant)", background: "var(--surface-container-lowest)", fontFamily: "var(--font-body)", fontSize: "0.875rem", color: "var(--on-surface)" }}>
            {["Feature", "Report", "Partnership", "Announcement", "Alert"].map(o => <option key={o}>{o}</option>)}
          </select>
        </div>
      </div>
      <div style={{ marginBottom: "1rem" }}>
        <label style={{ fontSize: "0.75rem", fontWeight: 700, color: "var(--on-surface-variant)", letterSpacing: "0.04em", textTransform: "uppercase", display: "block", marginBottom: "0.375rem" }}>Body *</label>
        <textarea value={form.body} onChange={set("body")} rows={3} style={{ width: "100%", padding: "0.5rem 0.75rem", borderRadius: "var(--r-md)", border: "1px solid var(--outline-variant)", background: "var(--surface-container-lowest)", fontFamily: "var(--font-body)", fontSize: "0.875rem", color: "var(--on-surface)", resize: "vertical", outline: "none" }} />
      </div>
      <button onClick={submit} style={{
        padding: "0.625rem 1.75rem", borderRadius: "var(--r-md)", fontSize: "0.875rem", fontWeight: 700,
        color: "var(--on-secondary)", background: "var(--secondary)",
        boxShadow: "0 2px 8px rgba(0,109,67,.2)", cursor: "pointer",
        display: "inline-flex", alignItems: "center", gap: "0.5rem",
      }}><i className="ms" style={{ fontSize: 18 }}>add_circle</i> Add Update</button>
    </div>
  );
}

/* ─── PAGE: ADMIN DASHBOARD ─────────────────────────────────────────────── */
function AdminPage({ jobs, updates, onJobsChange, onUpdatesChange }) {
  const [tab, setTab] = useState("jobs");
  const [toast, setToast] = useState({ msg: "", type: "success" });
  const [xlsxLoaded, setXlsxLoaded] = useState(!!window.XLSX);

  // Load SheetJS from CDN if not already available
  useEffect(() => {
    if (window.XLSX) { setXlsxLoaded(true); return; }
    const s = document.createElement("script");
    s.src = "https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.18.5/xlsx.full.min.js";
    s.onload = () => setXlsxLoaded(true);
    s.onerror = () => setToast({ msg: "Failed to load XLSX library.", type: "error" });
    document.head.appendChild(s);
  }, []);

  const showToast = (msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast({ msg: "", type: "success" }), 4000);
  };

  const handleJobFile = async (file) => {
    if (!xlsxLoaded) { showToast("XLSX library still loading…", "error"); return; }
    try {
      const rows = await parseXLSX(file);
      const newJobs = rows.map((r, i) => ({
        id: Date.now() + i,
        title: r.title || r.Title || "",
        company: r.company || r.Company || "",
        location: r.location || r.Location || "",
        type: r.type || r.Type || "Full-time",
        category: r.category || r.Category || "Editorial",
        salary: r.salary || r.Salary || "",
        deadline: r.deadline || r.Deadline || "",
        postedAgo: r.postedAgo || r["Posted Ago"] || "Recently",
        urgent: String(r.urgent || r.Urgent || "").toLowerCase() === "true",
        logo: (r.logo || r.Logo || (r.company || r.Company || "JB").slice(0, 2)).toUpperCase(),
        logoColor: r.logoColor || r["Logo Color"] || "#0050cb",
        description: r.description || r.Description || "",
        featured: false,
      })).filter(j => j.title);
      onJobsChange(prev => [...prev, ...newJobs]);
      showToast(`✓ Imported ${newJobs.length} job(s) successfully!`);
    } catch (e) {
      showToast("Failed to parse file: " + e.message, "error");
    }
  };

  const handleUpdateFile = async (file) => {
    if (!xlsxLoaded) { showToast("XLSX library still loading…", "error"); return; }
    try {
      const rows = await parseXLSX(file);
      const newUpdates = rows.map((r, i) => ({
        id: Date.now() + i,
        title: r.title || r.Title || "",
        date: r.date || r.Date || new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
        type: r.type || r.Type || "Feature",
        body: r.body || r.Body || r.description || r.Description || "",
      })).filter(u => u.title);
      onUpdatesChange(prev => [...prev, ...newUpdates]);
      showToast(`✓ Imported ${newUpdates.length} update(s) successfully!`);
    } catch (e) {
      showToast("Failed to parse file: " + e.message, "error");
    }
  };

  const downloadTemplate = (type) => {
    if (!window.XLSX) { showToast("XLSX library not loaded yet.", "error"); return; }
    const cols = type === "jobs" ? JOB_COLUMNS : UPDATE_COLUMNS;
    const ws = window.XLSX.utils.aoa_to_sheet([cols]);
    const wb = window.XLSX.utils.book_new();
    window.XLSX.utils.book_append_sheet(wb, ws, type === "jobs" ? "Jobs" : "Updates");
    window.XLSX.writeFile(wb, `editorial-architect-${type}-template.xlsx`);
  };

  const tabStyle = (t) => ({
    padding: "0.625rem 1.375rem", borderRadius: "var(--r-md)",
    fontSize: "0.875rem", fontWeight: 700, cursor: "pointer",
    background: tab === t ? "linear-gradient(135deg,var(--primary) 0%,var(--primary-container) 100%)" : "transparent",
    color: tab === t ? "white" : "var(--on-surface-variant)",
    border: tab === t ? "none" : "1px solid var(--outline-variant)",
    transition: "all .18s",
    display: "inline-flex", alignItems: "center", gap: "0.4rem",
  });

  return (
    <main style={{ paddingTop: 88, paddingBottom: "5rem", minHeight: "100vh" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "2.5rem 3rem" }}>
        {/* Admin Header */}
        <div className="fade-up" style={{ marginBottom: "2rem" }}>
          <div style={{
            display: "inline-flex", alignItems: "center", gap: "0.5rem",
            padding: "0.25rem 0.875rem", background: "rgba(159,54,0,.08)",
            borderRadius: "var(--r-full)", fontSize: "0.75rem", fontWeight: 700,
            letterSpacing: "0.06em", textTransform: "uppercase", color: "var(--tertiary)", marginBottom: "1rem",
          }}>
            <i className="ms" style={{ fontSize: 14 }}>admin_panel_settings</i> Admin Panel
          </div>
          <h1 style={{ fontSize: "2.25rem", fontWeight: 900, letterSpacing: "-0.04em", marginBottom: "0.625rem" }}>
            Content <span style={{ background: "linear-gradient(135deg,var(--primary) 0%,var(--primary-container) 100%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>Manager</span>
          </h1>
          <p style={{ color: "var(--on-surface-variant)", fontSize: "0.9375rem" }}>
            Upload job listings and platform updates via Excel, or add them manually below.
          </p>
        </div>

        {/* Stats Row */}
        <div className="fade-up-1" style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: "1rem", marginBottom: "2rem" }}>
          {[
            { icon: "work", label: "Total Jobs", val: jobs.length, color: "var(--primary)" },
            { icon: "warning", label: "Urgent", val: jobs.filter(j => j.urgent).length, color: "var(--error)" },
            { icon: "campaign", label: "Updates", val: updates.length, color: "var(--secondary)" },
            { icon: "bookmark", label: "Featured", val: jobs.filter(j => j.featured).length, color: "var(--tertiary)" },
          ].map(s => (
            <div key={s.label} style={{
              background: "var(--surface-container-lowest)", borderRadius: "var(--r-xl)",
              padding: "1.25rem 1.5rem", boxShadow: "0 1px 4px var(--shadow)",
              display: "flex", alignItems: "center", gap: "1rem",
            }}>
              <div style={{ width: 44, height: 44, borderRadius: "var(--r-lg)", background: s.color + "15", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <i className="ms" style={{ fontSize: 22, color: s.color }}>{s.icon}</i>
              </div>
              <div>
                <div style={{ fontSize: "1.5rem", fontWeight: 900, fontFamily: "var(--font-headline)" }}>{s.val}</div>
                <div style={{ fontSize: "0.8125rem", color: "var(--on-surface-variant)" }}>{s.label}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Toast */}
        <Toast msg={toast.msg} type={toast.type} />

        {/* Tabs */}
        <div style={{ display: "flex", gap: "0.75rem", marginBottom: "2rem" }}>
          <button style={tabStyle("jobs")} onClick={() => setTab("jobs")}><i className="ms" style={{ fontSize: 18 }}>work</i> Job Openings</button>
          <button style={tabStyle("updates")} onClick={() => setTab("updates")}><i className="ms" style={{ fontSize: 18 }}>campaign</i> Platform Updates</button>
        </div>

        {/* Jobs Tab */}
        {tab === "jobs" && (
          <div style={{ display: "flex", flexDirection: "column", gap: "1.75rem" }}>
            {/* Upload Section */}
            <div style={{ background: "var(--surface-container-low)", borderRadius: "var(--r-xl)", padding: "1.5rem" }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1.25rem" }}>
                <h3 style={{ fontSize: "1rem", fontWeight: 800 }}>Upload via Excel / CSV</h3>
                <button onClick={() => downloadTemplate("jobs")} style={{
                  display: "inline-flex", alignItems: "center", gap: "0.375rem",
                  padding: "0.4rem 1rem", borderRadius: "var(--r-md)",
                  border: "1px solid var(--outline-variant)", fontSize: "0.8125rem", fontWeight: 700,
                  color: "var(--primary)", cursor: "pointer", background: "var(--surface-container-lowest)",
                }}>
                  <i className="ms" style={{ fontSize: 16 }}>download</i> Download Template
                </button>
              </div>
              <div style={{ background: "rgba(0,80,203,.05)", borderRadius: "var(--r-md)", padding: "0.875rem 1rem", marginBottom: "1.25rem", fontSize: "0.8125rem", color: "var(--primary)" }}>
                <strong>Required columns:</strong> {JOB_COLUMNS.join(", ")}
              </div>
              <DropZone onFile={handleJobFile} accept=".xlsx,.csv,.xls" label="Drop your Jobs Excel file here" />
            </div>

            {/* Manual Add */}
            <AddJobForm onAdd={j => { onJobsChange(prev => [...prev, j]); showToast("Job added successfully!"); }} />

            {/* Jobs Table */}
            <div>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1rem" }}>
                <h3 style={{ fontSize: "1rem", fontWeight: 800 }}>All Job Listings ({jobs.length})</h3>
                <button onClick={() => { if (window.confirm("Clear all jobs?")) onJobsChange([]); }} style={{ color: "var(--error)", fontSize: "0.8125rem", fontWeight: 700, cursor: "pointer", display: "inline-flex", alignItems: "center", gap: "0.25rem" }}>
                  <i className="ms" style={{ fontSize: 16 }}>delete_sweep</i> Clear All
                </button>
              </div>
              <DataTable rows={jobs} columns={["title", "company", "location", "type", "salary", "deadline", "urgent"]} onDelete={id => onJobsChange(prev => prev.filter(j => j.id !== id))} />
            </div>
          </div>
        )}

        {/* Updates Tab */}
        {tab === "updates" && (
          <div style={{ display: "flex", flexDirection: "column", gap: "1.75rem" }}>
            <div style={{ background: "var(--surface-container-low)", borderRadius: "var(--r-xl)", padding: "1.5rem" }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1.25rem" }}>
                <h3 style={{ fontSize: "1rem", fontWeight: 800 }}>Upload via Excel / CSV</h3>
                <button onClick={() => downloadTemplate("updates")} style={{
                  display: "inline-flex", alignItems: "center", gap: "0.375rem",
                  padding: "0.4rem 1rem", borderRadius: "var(--r-md)",
                  border: "1px solid var(--outline-variant)", fontSize: "0.8125rem", fontWeight: 700,
                  color: "var(--secondary)", cursor: "pointer", background: "var(--surface-container-lowest)",
                }}>
                  <i className="ms" style={{ fontSize: 16 }}>download</i> Download Template
                </button>
              </div>
              <div style={{ background: "rgba(0,109,67,.05)", borderRadius: "var(--r-md)", padding: "0.875rem 1rem", marginBottom: "1.25rem", fontSize: "0.8125rem", color: "var(--secondary)" }}>
                <strong>Required columns:</strong> {UPDATE_COLUMNS.join(", ")}
              </div>
              <DropZone onFile={handleUpdateFile} accept=".xlsx,.csv,.xls" label="Drop your Updates Excel file here" />
            </div>

            <AddUpdateForm onAdd={u => { onUpdatesChange(prev => [u, ...prev]); showToast("Update published!"); }} />

            <div>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1rem" }}>
                <h3 style={{ fontSize: "1rem", fontWeight: 800 }}>All Updates ({updates.length})</h3>
                <button onClick={() => { if (window.confirm("Clear all updates?")) onUpdatesChange([]); }} style={{ color: "var(--error)", fontSize: "0.8125rem", fontWeight: 700, cursor: "pointer", display: "inline-flex", alignItems: "center", gap: "0.25rem" }}>
                  <i className="ms" style={{ fontSize: 16 }}>delete_sweep</i> Clear All
                </button>
              </div>
              <DataTable rows={updates} columns={["title", "date", "type", "body"]} onDelete={id => onUpdatesChange(prev => prev.filter(u => u.id !== id))} />
            </div>
          </div>
        )}
      </div>
    </main>
  );
}

/* ─── FOOTER ─────────────────────────────────────────────────────────────── */
function Footer() {
  return (
    <footer style={{ background: "var(--surface-container-low)", marginTop: "6rem" }}>
      <div style={{ maxWidth: 1280, margin: "0 auto", padding: "4rem 3rem 2rem", display: "grid", gridTemplateColumns: "1.5fr 1fr 1fr 1.5fr", gap: "3rem" }}>
        <div>
          <span style={{ fontSize: "1rem", fontWeight: 800, background: "linear-gradient(135deg,var(--primary) 0%,var(--primary-container) 100%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>The Editorial Architect</span>
          <p style={{ marginTop: "0.75rem", fontSize: "0.8125rem", color: "var(--on-surface-variant)", lineHeight: 1.7 }}>Curating high-end opportunities for the world's most discerning editorial and creative professionals.</p>
        </div>
        {[["Platform", ["About Us", "Contact Support", "Newsletter"]], ["Legal", ["Privacy Policy", "Terms of Service"]]].map(([title, links]) => (
          <div key={title}>
            <h4 style={{ fontSize: "0.875rem", fontWeight: 700, marginBottom: "1rem" }}>{title}</h4>
            <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: "0.5rem" }}>
              {links.map(l => <li key={l}><a href="#" style={{ fontSize: "0.8125rem", color: "var(--on-surface-variant)" }}>{l}</a></li>)}
            </ul>
          </div>
        ))}
        <div>
          <h4 style={{ fontSize: "0.875rem", fontWeight: 700, marginBottom: "0.5rem" }}>Subscribe</h4>
          <p style={{ fontSize: "0.8125rem", color: "var(--on-surface-variant)", marginBottom: "1rem" }}>Join our weekly curated digest of new jobs.</p>
          <div style={{ display: "flex", gap: "0.5rem" }}>
            <input type="email" placeholder="Email address" style={{
              flex: 1, padding: "0.5rem 0.875rem", borderRadius: "var(--r-md)",
              background: "var(--surface-container-lowest)", border: "none", outline: "none",
              fontSize: "0.8125rem", fontFamily: "var(--font-body)", color: "var(--on-surface)",
              boxShadow: "0 0 0 1px rgba(194,198,216,.35)",
            }} />
            <button style={{
              width: 38, height: 38, borderRadius: "var(--r-md)", flexShrink: 0,
              background: "linear-gradient(135deg,var(--primary),var(--primary-container))",
              color: "white", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer",
            }}><i className="ms" style={{ fontSize: 18 }}>send</i></button>
          </div>
        </div>
      </div>
      <div style={{ maxWidth: 1280, margin: "0 auto", padding: "1.5rem 3rem", display: "flex", justifyContent: "space-between", alignItems: "center", borderTop: "1px solid rgba(194,198,216,.25)" }}>
        <p style={{ fontSize: "0.8125rem", color: "var(--on-surface-variant)" }}>© 2024 The Editorial Architect. All rights reserved.</p>
        <div style={{ display: "flex", gap: "1rem" }}>
          {["share", "language"].map(icon => (
            <button key={icon} style={{ width: 34, height: 34, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--on-surface-variant)", cursor: "pointer" }}>
              <i className="ms" style={{ fontSize: 19 }}>{icon}</i>
            </button>
          ))}
        </div>
      </div>
    </footer>
  );
}

/* ─── ROOT APP ───────────────────────────────────────────────────────────── */
export default function App() {
  const [page, setPage] = useState("browse-jobs");
  const [jobs, setJobs] = useState(SEED_JOBS);
  const [updates, setUpdates] = useState(SEED_UPDATES);
  const [bookmarks, setBookmarks] = useState(new Set([1]));

  const toggleBookmark = useCallback(id => {
    setBookmarks(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  }, []);

  const isAdmin = page === "admin";

  const renderPage = () => {
    switch (page) {
      case "admin": return <AdminPage jobs={jobs} updates={updates} onJobsChange={setJobs} onUpdatesChange={setUpdates} />;
      case "updates": return <UpdatesPage updates={updates} />;
      default: return <BrowsePage jobs={jobs} bookmarks={bookmarks} onBookmark={toggleBookmark} />;
    }
  };

  return (
    <>
      <style>{TOKENS}</style>
      <Nav activePage={page} onNav={setPage} />
      {renderPage()}
      {!isAdmin && <Footer />}
    </>
  );
}
