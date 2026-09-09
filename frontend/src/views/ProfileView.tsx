import React, { useState, useEffect } from "react";
import { useData, type User } from "../context/DataContext";
import { getApiUrl } from "../utils/api";
import { Toast } from "../components/SharedAdminComponents";

export const PROFILE_FIELDS = [
  { key: 'name', label: 'Full Name', icon: 'person', hint: 'Your legal name' },
  { key: 'profileImage', label: 'Profile Photo', icon: 'account_circle', hint: 'Professional photo' },
  { key: 'headline', label: 'Professional Headline', icon: 'title', hint: 'e.g. Senior Frontend Engineer' },
  { key: 'location', label: 'Location', icon: 'location_on', hint: 'e.g. Kolkata, WB, India' },
  { key: 'phone', label: 'Phone Number', icon: 'phone', hint: 'e.g. +91 8240529170' },
  { key: 'topSkills', label: 'Top Skills', icon: 'psychology', hint: 'Comma-separated skills' },
  { key: 'resumeUrl', label: 'Resume / CV', icon: 'description', hint: 'PDF Document' },
  { key: 'preferredSalary', label: 'Preferred Salary', icon: 'payments', hint: 'e.g. ₹12,00,000 / year' },
  { key: 'workSetting', label: 'Work Setting', icon: 'laptop_mac', hint: 'e.g. Remote, Hybrid' },
  { key: 'desiredRole', label: 'Desired Role', icon: 'work', hint: 'e.g. Lead Product Designer' },
] as const;

export function ProfileView() {
  const { user, setUser, logout } = useData();
  const [profile, setProfile] = useState<User>(user || {} as User);
  const [applications, setApplications] = useState<any[]>([]);
  const [uploadingResume, setUploadingResume] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [toast, setToast] = useState({ msg: "", type: "success" });
  const [saving, setSaving] = useState(false);

  // Modal form state
  const [form, setForm] = useState({
    name: "",
    headline: "",
    location: "",
    phone: "",
    topSkills: "",
    preferredSalary: "",
    workSetting: "",
    desiredRole: "",
    industryFocus: "",
    openToWork: true
  });

  useEffect(() => {
    if (user) {
      setProfile(user);
      setForm({
        name: user.name || "",
        headline: user.headline || "",
        location: user.location || "",
        phone: user.phone || "",
        topSkills: user.topSkills || "",
        preferredSalary: user.preferredSalary || "",
        workSetting: user.workSetting || "",
        desiredRole: user.desiredRole || "",
        industryFocus: user.industryFocus || "",
        openToWork: user.openToWork !== false
      });
      fetchApplications();
    }
  }, [user]);

  // Check URL params for edit trigger
  useEffect(() => {
    if (typeof window !== "undefined") {
      const urlParams = new URLSearchParams(window.location.search);
      if (urlParams.get("edit") === "true") {
        setShowEditModal(true);
      }
    }
  }, []);

  const fetchApplications = async () => {
    try {
      const apiUrl = getApiUrl();
      const res = await fetch(`${apiUrl}/applications`, {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('userToken')}` }
      });
      if (res.ok) {
        const data = await res.json();
        setApplications(Array.isArray(data) ? data : []);
      }
    } catch (err) { 
      console.error("Failed to fetch applications:", err); 
    }
  };

  const showToastMsg = (msg: string, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast({ msg: "", type: "success" }), 4000);
  };

  const handleUpdateProfile = async (updates: Partial<User>) => {
    setSaving(true);
    try {
      const apiUrl = getApiUrl();
      const res = await fetch(`${apiUrl}/profile`, {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('userToken')}` 
        },
        body: JSON.stringify(updates)
      });
      const data = await res.json();
      if (res.ok && data.user) {
        setUser(data.user);
        setProfile(data.user);
        localStorage.setItem("userData", JSON.stringify(data.user));
        showToastMsg("✓ Profile details updated successfully!");
        setShowEditModal(false);
      } else {
        showToastMsg(data.error || "Failed to update profile", "error");
      }
    } catch (err) { 
      showToastMsg("Error connecting to server", "error");
    } finally {
      setSaving(false);
    }
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleUpdateProfile(form);
  };

  const handleResumeUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingResume(true);
    const formData = new FormData();
    formData.append('resume', file);
    try {
      const apiUrl = getApiUrl();
      const res = await fetch(`${apiUrl}/resume/upload`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${localStorage.getItem('userToken')}` },
        body: formData
      });
      const data = await res.json();
      if (res.ok && data.resumeUrl) {
        const updated = { ...profile, resumeUrl: data.resumeUrl, resumeName: data.resumeName } as User;
        setUser(updated);
        setProfile(updated);
        localStorage.setItem("userData", JSON.stringify(updated));
        showToastMsg("✓ Resume uploaded successfully!");
      } else {
        showToastMsg(data.error || "Resume upload failed", "error");
      }
    } catch (err) { 
      showToastMsg("Error uploading resume", "error"); 
    } finally {
      setUploadingResume(false);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingImage(true);
    const formData = new FormData();
    formData.append('image', file);
    try {
      const apiUrl = getApiUrl();
      const res = await fetch(`${apiUrl}/profile/image`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${localStorage.getItem('userToken')}` },
        body: formData
      });
      const data = await res.json();
      if (res.ok && data.profileImage) {
        const updated = { ...profile, profileImage: data.profileImage } as User;
        setUser(updated);
        setProfile(updated);
        localStorage.setItem("userData", JSON.stringify(updated));
        showToastMsg("✓ Profile photo updated!");
      } else {
        showToastMsg(data.error || "Photo upload failed", "error");
      }
    } catch (err) { 
      showToastMsg("Error uploading image", "error"); 
    } finally {
      setUploadingImage(false);
    }
  };

  // Calculate completion % strictly according to details received
  const filledFields = PROFILE_FIELDS.filter(f => {
    const val = profile[f.key];
    return val !== undefined && val !== null && String(val).trim() !== '';
  });

  const missingFields = PROFILE_FIELDS.filter(f => {
    const val = profile[f.key];
    return val === undefined || val === null || String(val).trim() === '';
  });

  const completionPercent = Math.round((filledFields.length / PROFILE_FIELDS.length) * 100);

  return (
    <main style={{ paddingTop: 88, paddingBottom: 100, minHeight: "100vh", background: "#f8f9ff" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 var(--content-pad)" }}>
        
        {toast.msg && <Toast msg={toast.msg} type={toast.type} />}

        {/* Header Section */}
        <section className="profile-header-container" style={{ 
            background: "#ffffff", borderRadius: "var(--r-xl)", padding: "2.5rem", 
            display: "flex", flexWrap: "wrap", gap: "2.5rem", alignItems: "center",
            boxShadow: "0 4px 20px rgba(0,0,0,0.03)", position: "relative", marginBottom: "2rem"
        }}>
            <div style={{ position: "relative" }}>
                <div style={{ 
                    width: 120, height: 120, borderRadius: "var(--r-xl)", overflow: "hidden", 
                    background: "var(--surface-container-high)", border: "4px solid #fff", boxShadow: "0 10px 20px rgba(0,0,0,0.05)"
                }}>
                    {profile?.profileImage ? (
                        <img src={profile.profileImage} style={{ width: "100%", height: "100%", objectFit: "cover" }} alt="Me" />
                    ) : (
                        <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 40, color: "var(--primary)" }}>
                            {profile.name ? profile.name.slice(0,1).toUpperCase() : "U"}
                        </div>
                    )}
                </div>
                <label style={{ 
                    position: "absolute", bottom: -8, right: -8, width: 36, height: 36, 
                    borderRadius: "50%", background: "var(--primary)", color: "white",
                    display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer",
                    boxShadow: "0 4px 10px rgba(0,80,203,0.3)"
                }}>
                    <i className="ms" style={{ fontSize: 18 }}>{uploadingImage ? "sync" : "edit"}</i>
                    <input type="file" hidden accept="image/*" onChange={handleImageUpload} disabled={uploadingImage} />
                </label>
            </div>

            <div className="profile-header-info" style={{ flex: 1, minWidth: 280 }}>
                <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginBottom: "0.5rem" }}>
                    <h1 style={{ fontSize: "2rem", fontWeight: 800 }}>{profile.name || "Job Seeker"}</h1>
                    <span style={{ 
                        padding: "0.3rem 0.75rem", background: "#e6fffb", color: "#08979c", 
                        borderRadius: "var(--r-full)", fontSize: "0.75rem", fontWeight: 800, textTransform: "uppercase" 
                    }}>
                      {completionPercent >= 80 ? "Top Talent" : "Active Member"}
                    </span>
                </div>
                <p style={{ fontSize: "1rem", color: "var(--on-surface-variant)", fontWeight: 600, marginBottom: "1rem" }}>
                    {profile.headline || "Add professional headline"} • {profile.location || "Add location"}
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
                <div style={{ display: "flex", gap: "0.75rem", marginTop: "1.5rem" }}>
                  <button 
                    onClick={() => setShowEditModal(true)}
                    style={{ 
                      padding: "0.5rem 1.25rem", borderRadius: "var(--r-md)", 
                      background: "var(--primary)", color: "white",
                      fontSize: "0.8125rem", fontWeight: 700, cursor: "pointer", display: "flex", alignItems: "center", gap: "0.5rem"
                    }}
                  >
                    <i className="ms" style={{ fontSize: 16 }}>edit</i> Edit Details
                  </button>
                  <button 
                    onClick={() => { logout(); window.location.href = '/'; }}
                    style={{ 
                      padding: "0.5rem 1rem", borderRadius: "var(--r-md)", 
                      border: "1px solid var(--error)", color: "var(--error)", background: "transparent",
                      fontSize: "0.8125rem", fontWeight: 700, cursor: "pointer", display: "flex", alignItems: "center", gap: "0.5rem"
                    }}
                  >
                    <i className="ms" style={{ fontSize: 16 }}>logout</i> Sign Out
                  </button>
                </div>
            </div>

            {/* Profile Completion Card Widget matching exact design */}
            <div className="profile-progress-widget" style={{ 
                width: 340, background: "linear-gradient(135deg, #0066ff 0%, #0050cb 100%)", 
                borderRadius: "var(--r-xl)", padding: "1.75rem", color: "white",
                boxShadow: "0 8px 24px rgba(0,80,203,0.3)"
            }}>
                <div style={{ fontSize: "1.125rem", fontWeight: 800, marginBottom: "0.5rem" }}>Profile Completion</div>
                <div style={{ fontSize: "0.8125rem", opacity: 0.9, marginBottom: "1.5rem", lineHeight: 1.5 }}>
                  Complete your profile to unlock premium recommendations.
                </div>
                
                {/* Progress bar */}
                <div style={{ height: 6, background: "rgba(255,255,255,0.25)", borderRadius: 3, marginBottom: "1.25rem", position: "relative", overflow: "hidden" }}>
                    <div style={{ position: "absolute", top: 0, left: 0, bottom: 0, width: `${completionPercent}%`, background: "#ffffff", borderRadius: 3, transition: "width 0.6s ease-in-out" }} />
                </div>
                
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <span style={{ fontSize: "1.125rem", fontWeight: 800 }}>{completionPercent}% Complete</span>
                    <button 
                      onClick={() => setShowEditModal(true)}
                      style={{ 
                        background: "#ffffff", color: "#0050cb", padding: "0.625rem 1.25rem", 
                        borderRadius: "var(--r-md)", fontSize: "0.875rem", fontWeight: 800,
                        border: "none", cursor: "pointer", boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                        transition: "transform 0.15s, background 0.15s"
                      }}
                      onMouseDown={e => e.currentTarget.style.transform = "scale(0.97)"}
                      onMouseUp={e => e.currentTarget.style.transform = "scale(1)"}
                    >
                      {completionPercent === 100 ? "Edit Profile" : "Complete Profile"}
                    </button>
                </div>
            </div>
        </section>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 2fr", gap: "2rem" }} className="responsive-grid">
            {/* Left Column: CV & Skills */}
            <aside style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
                {/* Resume Box */}
                <div style={{ background: "white", borderRadius: "var(--r-xl)", padding: "2rem", boxShadow: "0 4px 15px rgba(0,0,0,0.02)" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}>
                        <h3 style={{ fontSize: "1.125rem", fontWeight: 800 }}>Resume / CV</h3>
                        <label style={{ color: "var(--primary)", fontSize: "0.75rem", fontWeight: 700, cursor: "pointer" }}>
                            Upload PDF
                            <input type="file" hidden accept=".pdf" onChange={handleResumeUpload} />
                        </label>
                    </div>
                    {profile?.resumeUrl ? (
                        <div style={{ 
                            background: "#f8f9ff", borderRadius: "var(--r-md)", padding: "1.25rem",
                            display: "flex", alignItems: "center", gap: "1rem", border: "1px solid #ecedfa", marginBottom: "1.5rem"
                        }}>
                            <div style={{ width: 40, height: 40, background: "#fff1f0", borderRadius: "8px", display: "flex", alignItems: "center", justifyContent: "center", color: "#f5222d" }}>
                                <i className="ms">description</i>
                            </div>
                            <div style={{ flex: 1, minWidth: 0 }}>
                                <div style={{ fontSize: "0.875rem", fontWeight: 800, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{profile.resumeName || "Uploaded Resume"}</div>
                                <a href={profile.resumeUrl} target="_blank" rel="noreferrer" style={{ fontSize: "0.75rem", color: "var(--primary)", fontWeight: 600, textDecoration: "underline" }}>View PDF</a>
                            </div>
                        </div>
                    ) : (
                        <div style={{ textAlign: "center", padding: "1.5rem", border: "2px dashed #ecedfa", borderRadius: "var(--r-md)", marginBottom: "1.5rem" }}>
                            <p style={{ fontSize: "0.8125rem", color: "#727687" }}>No resume uploaded yet (+10% score).</p>
                        </div>
                    )}
                    <label style={{ 
                        display: "flex", alignItems: "center", justifyContent: "center", gap: "0.5rem",
                        width: "100%", padding: "1rem", borderRadius: "var(--r-md)", background: "#f2f3ff",
                        color: "var(--primary)", fontWeight: 800, cursor: "pointer", fontSize: "0.875rem"
                    }}>
                        <i className="ms">{uploadingResume ? "sync" : "cloud_upload"}</i>
                        {uploadingResume ? "Uploading..." : profile?.resumeUrl ? "Replace Resume" : "Upload Resume PDF"}
                        <input type="file" hidden accept=".pdf" onChange={handleResumeUpload} disabled={uploadingResume} />
                    </label>
                </div>

                {/* Skills Box */}
                <div style={{ background: "white", borderRadius: "var(--r-xl)", padding: "2rem", boxShadow: "0 4px 15px rgba(0,0,0,0.02)" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}>
                        <h3 style={{ fontSize: "1.125rem", fontWeight: 800 }}>Top Skills</h3>
                        <button onClick={() => setShowEditModal(true)} style={{ color: "var(--primary)", fontSize: "0.75rem", fontWeight: 700 }}>Edit</button>
                    </div>
                    {profile.topSkills ? (
                        <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
                            {profile.topSkills.split(',').map((s: string) => (
                                <span key={s} style={{ 
                                    padding: "0.5rem 1rem", background: "#f2f3ff", borderRadius: "var(--r-md)",
                                    fontSize: "0.8125rem", fontWeight: 600, color: "#424656"
                                }}>{s.trim()}</span>
                            ))}
                        </div>
                    ) : (
                        <button 
                            onClick={() => setShowEditModal(true)}
                            style={{ width: "100%", padding: "1rem", border: "1.5px dashed #c2c6d8", borderRadius: "var(--r-md)", color: "var(--primary)", fontSize: "0.8125rem", fontWeight: 700, textAlign: "center" }}
                        >
                            + Add Top Skills (+10%)
                        </button>
                    )}
                </div>
            </aside>

            {/* Right Column: History & Preferences */}
            <div style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
                {/* Application History */}
                <div style={{ background: "white", borderRadius: "var(--r-xl)", padding: "2.5rem", boxShadow: "0 4px 15px rgba(0,0,0,0.02)" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "2rem" }}>
                        <h3 style={{ fontSize: "1.125rem", fontWeight: 800 }}>Application History</h3>
                        <span style={{ fontSize: "0.8125rem", color: "var(--on-surface-variant)", fontWeight: 600 }}>{applications.length} Total</span>
                    </div>
                    
                    <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                        {applications.length > 0 ? applications.map(app => (
                            <div key={app.id} style={{ 
                                padding: "1.25rem", border: "1.5px solid #f2f3ff", borderRadius: "var(--r-xl)",
                                display: "flex", gap: "1rem", alignItems: "center"
                            }}>
                                <div style={{ width: 44, height: 44, borderRadius: "10px", background: "var(--primary)11", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--primary)", fontWeight: 800 }}>
                                    {(app.job?.company || "JB").slice(0,2).toUpperCase()}
                                </div>
                                <div style={{ flex: 1 }}>
                                    <div style={{ fontSize: "0.9375rem", fontWeight: 800 }}>{app.job?.title || "Job Title"}</div>
                                    <div style={{ fontSize: "0.8125rem", color: "#727687" }}>{app.job?.company} • Applied: {new Date(app.createdAt).toLocaleDateString()}</div>
                                </div>
                                <div style={{ textAlign: "right" }}>
                                    <div style={{ fontSize: "0.75rem", fontWeight: 800, color: app.status === 'Interview' ? "#389e0d" : "#0050cb" }}>{app.status}</div>
                                </div>
                            </div>
                        )) : (
                            <div style={{ textAlign: "center", padding: "2rem", color: "#727687" }}>No applications yet. Browse jobs to apply!</div>
                        )}
                    </div>
                </div>

                {/* Job Preferences */}
                <div style={{ background: "white", borderRadius: "var(--r-xl)", padding: "2.5rem", boxShadow: "0 4px 15px rgba(0,0,0,0.02)" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "2.5rem" }}>
                        <h3 style={{ fontSize: "1.125rem", fontWeight: 800 }}>Job Preferences</h3>
                        <button onClick={() => setShowEditModal(true)} style={{ color: "var(--primary)", fontSize: "0.8125rem", fontWeight: 700 }}>Edit Preferences</button>
                    </div>
                    
                    <div className="preferences-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "2.5rem 4rem" }}>
                        {[
                            { label: "PREFERRED SALARY", value: profile.preferredSalary, fallback: "+ Add salary target" },
                            { label: "WORK SETTING", value: profile.workSetting, fallback: "+ Add work setting" },
                            { label: "DESIRED ROLE", value: profile.desiredRole, fallback: "+ Add desired role" },
                            { label: "INDUSTRY FOCUS", value: profile.industryFocus, fallback: "+ Add industry focus" }
                        ].map(p => (
                            <div key={p.label} onClick={() => !p.value && setShowEditModal(true)} style={{ cursor: !p.value ? "pointer" : "default" }}>
                                <div style={{ fontSize: "0.6875rem", fontWeight: 800, letterSpacing: "0.1em", color: "#727687", marginBottom: "0.75rem" }}>{p.label}</div>
                                <div style={{ fontSize: "1rem", fontWeight: 700, color: p.value ? "var(--on-surface)" : "var(--primary)", borderBottom: "2px solid #f2f3ff", paddingBottom: "0.5rem" }}>
                                  {p.value || p.fallback}
                                </div>
                            </div>
                        ))}
                    </div>

                    <div style={{ 
                        marginTop: "3rem", padding: "1.5rem", background: "#f8f9ff", 
                        borderRadius: "var(--r-lg)", display: "flex", justifyContent: "space-between", alignItems: "center" 
                    }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
                            <div style={{ width: 44, height: 44, borderRadius: "50%", background: profile.openToWork ? "#006d43" : "#c2c6d8", display: "flex", alignItems: "center", justifyContent: "center", color: "white" }}>
                                <i className="ms">{profile.openToWork ? "check_circle" : "pause_circle"}</i>
                            </div>
                            <div>
                                <div style={{ fontSize: "0.9375rem", fontWeight: 800 }}>Open to Work</div>
                                <div style={{ fontSize: "0.75rem", color: "var(--on-surface-variant)" }}>
                                  {profile.openToWork ? "Recruiters can see you're looking for new roles." : "Visibility hidden from recruiters."}
                                </div>
                            </div>
                        </div>
                        <button 
                            onClick={() => handleUpdateProfile({ openToWork: !profile.openToWork })}
                            style={{ 
                                width: 48, height: 26, borderRadius: 13, 
                                background: profile.openToWork ? "#006d43" : "#c2c6d8",
                                position: "relative", transition: "background 0.3s", cursor: "pointer"
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

      {/* Profile Completion / Edit Modal */}
      {showEditModal && (
        <div style={{
          position: "fixed", top: 0, left: 0, right: 0, bottom: 0,
          background: "rgba(0,0,0,0.5)", backdropFilter: "blur(4px)",
          zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center", padding: "1.5rem"
        }}>
          <div style={{
            background: "#ffffff", borderRadius: "var(--r-xl)", maxWidth: 640, width: "100%",
            maxHeight: "90vh", overflowY: "auto", padding: "2.5rem", boxShadow: "0 20px 40px rgba(0,0,0,0.2)",
            position: "relative"
          }}>
            <button 
              onClick={() => setShowEditModal(false)}
              style={{ position: "absolute", top: "1.5rem", right: "1.5rem", background: "none", border: "none", cursor: "pointer", color: "var(--on-surface-variant)" }}
            >
              <i className="ms" style={{ fontSize: 24 }}>close</i>
            </button>

            <h2 style={{ fontSize: "1.5rem", fontWeight: 800, marginBottom: "0.25rem" }}>
              Complete Your Profile
            </h2>
            <p style={{ fontSize: "0.875rem", color: "var(--on-surface-variant)", marginBottom: "1.5rem" }}>
              Update your details below. Each field adds to your overall completion score!
            </p>

            {/* Live progress indicator inside modal */}
            <div style={{ background: "#f2f3ff", borderRadius: "var(--r-lg)", padding: "1.25rem", marginBottom: "1.5rem" }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.5rem" }}>
                <span style={{ fontSize: "0.875rem", fontWeight: 800, color: "var(--primary)" }}>Completion Status: {completionPercent}%</span>
                <span style={{ fontSize: "0.75rem", fontWeight: 700, color: "var(--on-surface-variant)" }}>{filledFields.length} of {PROFILE_FIELDS.length} Details Added</span>
              </div>
              <div style={{ height: 8, background: "#e6e7f4", borderRadius: 4, position: "relative", overflow: "hidden" }}>
                <div style={{ width: `${completionPercent}%`, background: "var(--primary)", height: "100%", borderRadius: 4, transition: "width 0.4s" }} />
              </div>
              {missingFields.length > 0 && (
                <div style={{ marginTop: "0.75rem", fontSize: "0.75rem", color: "var(--on-surface-variant)", display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
                  <span style={{ fontWeight: 700 }}>Missing to hit 100%:</span>
                  {missingFields.map(m => (
                    <span key={m.key} style={{ background: "#fff", padding: "0.15rem 0.5rem", borderRadius: "4px", border: "1px solid var(--outline-variant)" }}>
                      +10% {m.label}
                    </span>
                  ))}
                </div>
              )}
            </div>

            <form onSubmit={handleFormSubmit} style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }} className="stack-on-mobile">
                <div style={{ display: "flex", flexDirection: "column", gap: "0.375rem" }}>
                  <label style={{ fontSize: "0.75rem", fontWeight: 700, textTransform: "uppercase" }}>Full Name</label>
                  <input 
                    type="text" 
                    value={form.name} 
                    onChange={e => setForm({ ...form, name: e.target.value })}
                    required
                    style={{ padding: "0.75rem", borderRadius: "var(--r-md)", border: "1px solid var(--outline-variant)", background: "var(--surface-container-low)" }}
                  />
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: "0.375rem" }}>
                  <label style={{ fontSize: "0.75rem", fontWeight: 700, textTransform: "uppercase" }}>Phone Number (+10%)</label>
                  <input 
                    type="text" 
                    value={form.phone} 
                    onChange={e => setForm({ ...form, phone: e.target.value })}
                    placeholder="+91 8240529170"
                    style={{ padding: "0.75rem", borderRadius: "var(--r-md)", border: "1px solid var(--outline-variant)", background: "var(--surface-container-low)" }}
                  />
                </div>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: "0.375rem" }}>
                <label style={{ fontSize: "0.75rem", fontWeight: 700, textTransform: "uppercase" }}>Professional Headline (+10%)</label>
                <input 
                  type="text" 
                  value={form.headline} 
                  onChange={e => setForm({ ...form, headline: e.target.value })}
                  placeholder="e.g. Lead Product Designer | React & Figma Specialist"
                  style={{ padding: "0.75rem", borderRadius: "var(--r-md)", border: "1px solid var(--outline-variant)", background: "var(--surface-container-low)" }}
                />
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }} className="stack-on-mobile">
                <div style={{ display: "flex", flexDirection: "column", gap: "0.375rem" }}>
                  <label style={{ fontSize: "0.75rem", fontWeight: 700, textTransform: "uppercase" }}>Location (+10%)</label>
                  <input 
                    type="text" 
                    value={form.location} 
                    onChange={e => setForm({ ...form, location: e.target.value })}
                    placeholder="e.g. San Francisco, CA"
                    style={{ padding: "0.75rem", borderRadius: "var(--r-md)", border: "1px solid var(--outline-variant)", background: "var(--surface-container-low)" }}
                  />
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: "0.375rem" }}>
                  <label style={{ fontSize: "0.75rem", fontWeight: 700, textTransform: "uppercase" }}>Desired Role (+10%)</label>
                  <input 
                    type="text" 
                    value={form.desiredRole} 
                    onChange={e => setForm({ ...form, desiredRole: e.target.value })}
                    placeholder="e.g. Senior UX Architect"
                    style={{ padding: "0.75rem", borderRadius: "var(--r-md)", border: "1px solid var(--outline-variant)", background: "var(--surface-container-low)" }}
                  />
                </div>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: "0.375rem" }}>
                <label style={{ fontSize: "0.75rem", fontWeight: 700, textTransform: "uppercase" }}>Top Skills (Comma Separated) (+10%)</label>
                <input 
                  type="text" 
                  value={form.topSkills} 
                  onChange={e => setForm({ ...form, topSkills: e.target.value })}
                  placeholder="e.g. React, TypeScript, UI/UX, Node.js, Product Design"
                  style={{ padding: "0.75rem", borderRadius: "var(--r-md)", border: "1px solid var(--outline-variant)", background: "var(--surface-container-low)" }}
                />
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }} className="stack-on-mobile">
                <div style={{ display: "flex", flexDirection: "column", gap: "0.375rem" }}>
                  <label style={{ fontSize: "0.75rem", fontWeight: 700, textTransform: "uppercase" }}>Preferred Salary (+10%)</label>
                  <input 
                    type="text" 
                    value={form.preferredSalary} 
                    onChange={e => setForm({ ...form, preferredSalary: e.target.value })}
                    placeholder="e.g. $140,000 / year"
                    style={{ padding: "0.75rem", borderRadius: "var(--r-md)", border: "1px solid var(--outline-variant)", background: "var(--surface-container-low)" }}
                  />
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: "0.375rem" }}>
                  <label style={{ fontSize: "0.75rem", fontWeight: 700, textTransform: "uppercase" }}>Work Setting (+10%)</label>
                  <input 
                    type="text" 
                    value={form.workSetting} 
                    onChange={e => setForm({ ...form, workSetting: e.target.value })}
                    placeholder="e.g. Remote, Hybrid"
                    style={{ padding: "0.75rem", borderRadius: "var(--r-md)", border: "1px solid var(--outline-variant)", background: "var(--surface-container-low)" }}
                  />
                </div>
              </div>

              <div style={{ display: "flex", justifyContent: "flex-end", gap: "1rem", marginTop: "1rem" }}>
                <button 
                  type="button" 
                  onClick={() => setShowEditModal(false)}
                  style={{ padding: "0.875rem 1.5rem", borderRadius: "var(--r-md)", border: "1px solid var(--outline-variant)", fontWeight: 700, cursor: "pointer" }}
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  disabled={saving}
                  style={{ padding: "0.875rem 2rem", borderRadius: "var(--r-md)", background: "var(--primary)", color: "#fff", fontWeight: 800, border: "none", cursor: "pointer", opacity: saving ? 0.7 : 1 }}
                >
                  {saving ? "Saving Details..." : "Save & Update Score"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </main>
  );
}
