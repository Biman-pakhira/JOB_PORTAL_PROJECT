import React, { useState } from "react";
import { JobCard } from "../components/JobCard";
import { useData } from "../context/DataContext";
import { Link } from "react-router-dom";

export function HomeView() {
  const { jobs, bookmarks, toggleBookmark } = useData();
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("All Jobs");

  const tabs = ["All Jobs", "Design", "Engineering", "Marketing", "Finance"];
  
  const filtered = jobs.filter((j: any) => {
    const matchesSearch = j.title?.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          j.company?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          j.description?.toLowerCase().includes(searchQuery.toLowerCase());
    
    let matchesTab = activeTab === "All Jobs";
    if (activeTab === "Design") matchesTab = j.title?.toLowerCase().includes("design") || j.description?.toLowerCase().includes("design");
    if (activeTab === "Engineering") matchesTab = j.title?.toLowerCase().includes("engineer") || j.title?.toLowerCase().includes("developer") || j.description?.toLowerCase().includes("engineer");
    if (activeTab === "Marketing") matchesTab = j.title?.toLowerCase().includes("marketing") || j.description?.toLowerCase().includes("marketing");
    if (activeTab === "Finance") matchesTab = j.title?.toLowerCase().includes("finance") || j.title?.toLowerCase().includes("banking");
    
    return matchesSearch && matchesTab;
  });

  return (
    <main style={{ paddingTop: 88, paddingBottom: 100, background: "#faf8ff" }}>
      <header style={{ padding: "0 var(--content-pad)", marginBottom: "2.5rem" }}>
        <h1 style={{ fontSize: "2.25rem", fontWeight: 800, color: "#191b24", lineHeight: 1.2 }}>
          Find your dream job in the <span style={{ color: "var(--primary)" }}>digital era</span>
        </h1>
        
        {/* Modern Search Bar */}
        <div style={{ 
          marginTop: "1.5rem", background: "#f2f3ff", borderRadius: "var(--r-lg)", 
          padding: "1rem 1.25rem", display: "flex", alignItems: "center", gap: "0.75rem",
          boxShadow: "0 2px 8px rgba(0,0,0,0.02)"
        }}>
          <i className="ms" style={{ color: "#727687" }}>search</i>
          <input 
            type="text" 
            placeholder="Search roles, skills, or companies" 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{ flex: 1, border: "none", background: "none", outline: "none", fontSize: "0.9375rem" }}
          />
        </div>

        {/* Tab Pills */}
        <div style={{ display: "flex", gap: "0.5rem", marginTop: "1.5rem", overflowX: "auto", paddingBottom: "0.5rem", scrollbarWidth: "none" }}>
          {tabs.map(tab => (
            <button 
              key={tab} 
              onClick={() => setActiveTab(tab)}
              style={{
                padding: "0.625rem 1.25rem", borderRadius: "1.25rem", fontSize: "0.8125rem", fontWeight: 700,
                background: activeTab === tab ? "var(--primary)" : "var(--surface-container-high)",
                color: activeTab === tab ? "white" : "var(--on-surface-variant)",
                whiteSpace: "nowrap", transition: "all 0.2s"
              }}
            >
              {tab}
            </button>
          ))}
        </div>
      </header>

      <section style={{ padding: "0 var(--content-pad)" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}>
          <h2 style={{ fontSize: "1.25rem", fontWeight: 800 }}>Latest Opportunities</h2>
          <Link to="/browse" style={{ fontSize: "0.8125rem", fontWeight: 700, color: "var(--primary)" }}>View all</Link>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          {filtered.slice(0, 10).map((job: any, i: number) => (
            <JobCard 
                key={job.id} 
                job={job} 
                bookmarked={bookmarks.has(job.id)} 
                onBookmark={toggleBookmark} 
                delay={i * 0.05} 
            />
          ))}
        </div>
        
        {/* Banner Section */}
        <div style={{
            marginTop: "2rem", background: "linear-gradient(135deg, #0066ff 0%, #0050cb 100%)",
            borderRadius: "var(--r-lg)", padding: "2rem", color: "white", position: "relative", overflow: "hidden"
        }}>
            <h3 style={{ fontSize: "1.25rem", fontWeight: 800, marginBottom: "0.5rem", position: "relative", zIndex: 1 }}>Exclusive Access</h3>
            <p style={{ fontSize: "0.875rem", opacity: 0.9, maxWidth: "70%", position: "relative", zIndex: 1 }}>Unlock hidden opportunities at Fortune 500 tech firms.</p>
            <i className="ms" style={{ position: "absolute", right: -20, bottom: -20, fontSize: 120, opacity: 0.1 }}>work_outline</i>
        </div>

        {/* Complete Profile Widget */}
        <div style={{
            marginTop: "2rem", background: "#f2f3ff", borderRadius: "var(--r-lg)", padding: "2rem", textAlign: "center"
        }}>
            <div style={{ 
                width: 64, height: 64, borderRadius: "50%", background: "#191b24", margin: "0 auto 1.5rem",
                display: "flex", alignItems: "center", justifyContent: "center"
            }}>
                <i className="ms" style={{ color: "white", fontSize: 32 }}>person_pin</i>
            </div>
            <h3 style={{ fontSize: "1.25rem", fontWeight: 800, marginBottom: "0.75rem" }}>Complete your profile</h3>
            <p style={{ fontSize: "0.875rem", color: "var(--on-surface-variant)", lineHeight: 1.6, marginBottom: "1.5rem" }}>
                Users with 100% complete profiles are 4x more likely to get noticed by recruiters.
            </p>
            <Link to="/profile" style={{
                display: "inline-flex", alignItems: "center", gap: "0.5rem",
                padding: "0.875rem 2rem", borderRadius: "var(--r-md)", 
                background: "var(--primary)", color: "white", fontWeight: 800, textDecoration: "none"
            }}>
                Update Profile <i className="ms" style={{ fontSize: 18 }}>arrow_forward</i>
            </Link>
        </div>
      </section>
    </main>
  );
}
