"use client";
import React, { useState, useEffect } from "react";
import { useData } from "../context/DataContext";

export function ProfileView() {
  const { user, setUser } = useData();
  const [profile, setProfile] = useState<any>(user || {});
  const [applications, setApplications] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState("Activity");
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (user) {
        setProfile(user);
        fetchApplications();
    }
  }, [user]);

  const fetchApplications = async () => {
    try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/applications`, {
            headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
        });
        const data = await res.json();
        setApplications(data);
    } catch (err) { console.error(err); }
  };

  const handleUpdateProfile = async (updates: any) => {
    try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/profile`, {
            method: 'PUT',
            headers: { 
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}` 
            },
            body: JSON.stringify(updates)
        });
        const data = await res.json();
        if (data.user) {
            setUser(data.user);
            setProfile(data.user);
        }
    } catch (err) { console.error(err); }
  };

  const handleResumeUpload = async (e: any) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);
    const formData = new FormData();
    formData.append('resume', file);
    try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/resume/upload`, {
            method: 'POST',
            headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` },
            body: formData
        });
        const data = await res.json();
        if (data.resumeUrl) {
            setUser({ ...user, resumeUrl: data.resumeUrl, resumeName: data.resumeName });
        }
    } catch (err) { console.error(err); }
    setUploading(false);
  };

  const handleImageUpload = async (e: any) => {
    const file = e.target.files[0];
    if (!file) return;
    const formData = new FormData();
    formData.append('image', file);
    try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/profile/image`, {
            method: 'POST',
            headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` },
            body: formData
        });
        const data = await res.json();
        if (data.profileImage) {
            setUser({ ...user, profileImage: data.profileImage });
        }
    } catch (err) { console.error(err); }
  };

  // Calculate completion %
  const fields = ['profileImage', 'headline', 'location', 'phone', 'topSkills', 'resumeUrl', 'preferredSalary', 'desiredRole'];
  const filled = fields.filter(f => !!profile[f]).length;
  const completionPercent = Math.round((filled / fields.length) * 100);

  return (
    <main style={{ paddingTop: 88, paddingBottom: 100, minHeight: "100vh", background: "#f8f9ff" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 var(--content-pad)" }}>
        
        {/* Header Section */}
        <section style={{ 
            background: "#ffffff", borderRadius: "var(--r-xl)", padding: "2.5rem", 
            display: "flex", flexWrap: "wrap", gap: "2.5rem", alignItems: "center",
            boxShadow: "0 4px 20px rgba(0,0,0,0.03)", position: "relative", marginBottom: "2rem"
        }}>
            <div style={{ position: "relative" }}>
                <div style={{ 
                    width: 120, height: 120, borderRadius: "var(--r-xl)", overflow: "hidden", 
                    background: "var(--surface-container-high)", border: "4px solid #fff", boxShadow: "0 10px 20px rgba(0,0,0,0.05)"
                }}>
                    {user?.profileImage ? (
                        <img src={user.profileImage} style={{ width: "100%", height: "100%", objectFit: "cover" }} alt="Me" />
                    ) : (
                        <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 40, color: "var(--primary)" }}>
                            {profile.name?.slice(0,1)}
                        </div>
                    )}
                </div>
                <label style={{ 
                    position: "absolute", bottom: -8, right: -8, width: 36, height: 36, 
                    borderRadius: "50%", background: "var(--primary)", color: "white",
                    display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer",
                    boxShadow: "0 4px 10px rgba(0,80,203,0.3)"
                }}>
                    <i className="ms" style={{ fontSize: 18 }}>edit</i>
                    <input type="file" hidden accept="image/*" onChange={handleImageUpload} />
                </label>
            </div>

            <div style={{ flex: 1, minWidth: 280 }}>
                <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginBottom: "0.5rem" }}>
                    <h1 style={{ fontSize: "2rem", fontWeight: 800 }}>{profile.name}</h1>
                    <span style={{ 
                        padding: "0.3rem 0.75rem", background: "#e6fffb", color: "#08979c", 
                        borderRadius: "var(--r-full)", fontSize: "0.75rem", fontWeight: 800, textTransform: "uppercase" 
                    }}>Top Talent</span>
                </div>
                <p style={{ fontSize: "1rem", color: "var(--on-surface-variant)", fontWeight: 600, marginBottom: "1rem" }}>
                    {profile.headline || "Add a professional headline"} • {profile.location || "Add location"}
                </p>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "1rem" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", fontSize: "0.875rem", background: "#f2f3ff", padding: "0.5rem 1rem", borderRadius: "var(--r-md)" }}>
                        <i className="ms" style={{ fontSize: 18 }}>mail</i> {profile.email}
                    </div>
                    {profile.phone && (
                        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", fontSize: "0.875rem", background: "#f2f3ff", padding: "0.5rem 1rem", borderRadius: "var(--r-md)" }}>
                            <i className="ms" style={{ fontSize: 18 }}>call</i> {profile.phone}
                        </div>
                    )}
                </div>
            </div>

            {/* Progress Widget */}
            <div style={{ 
                width: 320, background: "linear-gradient(135deg, #0066ff 0%, #0050cb 100%)", 
                borderRadius: "var(--r-xl)", padding: "1.75rem", color: "white"
            }}>
                <div style={{ fontSize: "0.875rem", fontWeight: 800, marginBottom: "0.5rem" }}>Profile Completion</div>
                <div style={{ fontSize: "0.75rem", opacity: 0.8, marginBottom: "1.25rem" }}>Complete your profile to unlock premium recommendations.</div>
                <div style={{ height: 6, background: "rgba(255,255,255,0.2)", borderRadius: 3, marginBottom: "0.75rem", position: "relative" }}>
                    <div style={{ position: "absolute", top: 0, left: 0, bottom: 0, width: `${completionPercent}%`, background: "#fff", borderRadius: 3, transition: "width 0.5s" }} />
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <span style={{ fontWeight: 800 }}>{completionPercent}% Complete</span>
                    <button style={{ 
                        background: "white", color: "var(--primary)", padding: "0.5rem 1rem", 
                        borderRadius: "var(--r-md)", fontSize: "0.75rem", fontWeight: 800 
                    }}>Complete Profile</button>
                </div>
            </div>
        </section>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 2fr", gap: "2rem" }} className="responsive-grid">
            {/* Left Column: CV & Skills */}
            <aside style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
                {/* Resume Box */}
                <div style={{ background: "white", borderRadius: "var(--r-xl)", padding: "2rem", boxShadow: "0 4px 15px rgba(0,0,0,0.02)" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}>
                        <h3 style={{ fontSize: "1.125rem", fontWeight: 800 }}>Resume</h3>
                        <button style={{ color: "var(--primary)", fontSize: "0.75rem", fontWeight: 700 }}>Manage</button>
                    </div>
                    {user?.resumeUrl ? (
                        <div style={{ 
                            background: "#f8f9ff", borderRadius: "var(--r-md)", padding: "1.25rem",
                            display: "flex", alignItems: "center", gap: "1rem", border: "1px solid #ecedfa", marginBottom: "1.5rem"
                        }}>
                            <div style={{ width: 40, height: 40, background: "#fff1f0", borderRadius: "8px", display: "flex", alignItems: "center", justifyContent: "center", color: "#f5222d" }}>
                                <i className="ms">description</i>
                            </div>
                            <div style={{ flex: 1, minWidth: 0 }}>
                                <div style={{ fontSize: "0.875rem", fontWeight: 800, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{user.resumeName}</div>
                                <div style={{ fontSize: "0.75rem", color: "var(--on-surface-variant)" }}>Uploaded recently</div>
                            </div>
                        </div>
                    ) : (
                        <div style={{ textAlign: "center", padding: "1.5rem", border: "2px dashed #ecedfa", borderRadius: "var(--r-md)", marginBottom: "1.5rem" }}>
                            <p style={{ fontSize: "0.8125rem", color: "#727687" }}>No resume uploaded yet.</p>
                        </div>
                    )}
                    <label style={{ 
                        display: "flex", alignItems: "center", justifyContent: "center", gap: "0.5rem",
                        width: "100%", padding: "1rem", borderRadius: "var(--r-md)", background: "#f2f3ff",
                        color: "var(--primary)", fontWeight: 800, cursor: "pointer", fontSize: "0.875rem"
                    }}>
                        <i className="ms">{uploading ? "sync" : "cloud_upload"}</i>
                        {uploading ? "Uploading..." : "Upload New CV"}
                        <input type="file" hidden accept=".pdf" onChange={handleResumeUpload} />
                    </label>
                </div>

                {/* Skills Box */}
                <div style={{ background: "white", borderRadius: "var(--r-xl)", padding: "2rem", boxShadow: "0 4px 15px rgba(0,0,0,0.02)" }}>
                    <h3 style={{ fontSize: "1.125rem", fontWeight: 800, marginBottom: "1.5rem" }}>Top Skills</h3>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
                        {(profile.topSkills || "UI/UX Design, Design Systems, Frontend, Product Strategy").split(',').map((s: string) => (
                            <span key={s} style={{ 
                                padding: "0.5rem 1rem", background: "#f2f3ff", borderRadius: "var(--r-md)",
                                fontSize: "0.8125rem", fontWeight: 600, color: "#424656"
                            }}>{s.trim()}</span>
                        ))}
                    </div>
                </div>
            </aside>

            {/* Right Column: History & Preferences */}
            <div style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
                {/* Application History */}
                <div style={{ background: "white", borderRadius: "var(--r-xl)", padding: "2.5rem", boxShadow: "0 4px 15px rgba(0,0,0,0.02)" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "2rem" }}>
                        <h3 style={{ fontSize: "1.125rem", fontWeight: 800 }}>Application History</h3>
                        <button style={{ color: "#727687", fontSize: "0.8125rem", fontWeight: 700 }}>View All</button>
                    </div>
                    
                    <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                        {applications.length > 0 ? applications.map(app => (
                            <div key={app.id} style={{ 
                                padding: "1.25rem", border: "1.5px solid #f2f3ff", borderRadius: "var(--r-xl)",
                                display: "flex", gap: "1rem", alignItems: "center"
                            }}>
                                <div style={{ width: 44, height: 44, borderRadius: "10px", background: "var(--primary)11", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--primary)", fontWeight: 800 }}>
                                    {app.job.company.slice(0,2)}
                                </div>
                                <div style={{ flex: 1 }}>
                                    <div style={{ fontSize: "0.9375rem", fontWeight: 800 }}>{app.job.title}</div>
                                    <div style={{ fontSize: "0.8125rem", color: "#727687" }}>{app.job.company} • Applied: {new Date(app.createdAt).toLocaleDateString()}</div>
                                </div>
                                <div style={{ textAlign: "right" }}>
                                    <div style={{ fontSize: "0.75rem", fontWeight: 800, color: app.status === 'Interview' ? "#389e0d" : "#0050cb" }}>{app.status}</div>
                                </div>
                            </div>
                        )) : (
                            <div style={{ textAlign: "center", padding: "2rem", color: "#727687" }}>No applications yet.</div>
                        )}
                    </div>
                </div>

                {/* Preferences */}
                <div style={{ background: "white", borderRadius: "var(--r-xl)", padding: "2.5rem", boxShadow: "0 4px 15px rgba(0,0,0,0.02)" }}>
                    <h3 style={{ fontSize: "1.125rem", fontWeight: 800, marginBottom: "2.5rem" }}>Job Preferences</h3>
                    
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "2.5rem 4rem" }}>
                        {[
                            { label: "PREFERRED SALARY", value: profile.preferredSalary || "$140,000 - $185,000 / year" },
                            { label: "WORK SETTING", value: profile.workSetting || "Remote, Hybrid (NYC Only)" },
                            { label: "DESIRED ROLE", value: profile.desiredRole || "Lead Product Designer" },
                            { label: "INDUSTRY FOCUS", value: profile.industryFocus || "FinTech, Healthcare" }
                        ].map(p => (
                            <div key={p.label}>
                                <div style={{ fontSize: "0.6875rem", fontWeight: 800, letterSpacing: "0.1em", color: "#727687", marginBottom: "0.75rem" }}>{p.label}</div>
                                <div style={{ fontSize: "1rem", fontWeight: 700, borderBottom: "2px solid #f2f3ff", paddingBottom: "0.5rem" }}>{p.value}</div>
                            </div>
                        ))}
                    </div>

                    <div style={{ 
                        marginTop: "3rem", padding: "1.5rem", background: "#f8f9ff", 
                        borderRadius: "var(--r-lg)", display: "flex", justifyContent: "space-between", alignItems: "center" 
                    }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
                            <div style={{ width: 44, height: 44, borderRadius: "50%", background: "#006d43", display: "flex", alignItems: "center", justifyContent: "center", color: "white" }}>
                                <i className="ms">check_circle</i>
                            </div>
                            <div>
                                <div style={{ fontSize: "0.9375rem", fontWeight: 800 }}>Open to Work</div>
                                <div style={{ fontSize: "0.75rem", color: "var(--on-surface-variant)" }}>Recruiters can see you're looking for new roles.</div>
                            </div>
                        </div>
                        <button 
                            onClick={() => handleUpdateProfile({ openToWork: !profile.openToWork })}
                            style={{ 
                                width: 48, height: 26, borderRadius: 13, 
                                background: profile.openToWork ? "#006d43" : "#c2c6d8",
                                position: "relative", transition: "background 0.3s"
                            }}
                        >
                            <div style={{ 
                                position: "absolute", top: 3, left: profile.openToWork ? 25 : 3, 
                                width: 20, height: 20, background: "white", borderRadius: "50%", transition: "left 0.3s"
                            }} />
                        </button>
                    </div>
                </div>
            </div>
        </div>
      </div>
    </main>
  );
}
