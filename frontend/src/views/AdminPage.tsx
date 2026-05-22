
import React, { useState, useEffect } from "react";
import * as XLSX from "xlsx";
import { JOB_COLUMNS, UPDATE_COLUMNS } from "../constants/tokens";
import { Toast, DropZone, DataTable, AddJobForm, AddUpdateForm } from "../components/SharedAdminComponents";
import { useData } from "../context/DataContext";
import { getApiUrl } from "../utils/api";

export function AdminPage() {
  const { jobs, updates, fetchData, loading: dataLoading } = useData();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [masterKey, setMasterKey] = useState("");
  const [token, setToken] = useState("");
  const [tab, setTab] = useState("jobs");
  const [mode, setMode] = useState("login"); // "login" or "setup"
  const [toast, setToast] = useState({ msg: "", type: "success" });
  const [uploadCategory, setUploadCategory] = useState("Private");
  const [loginLoading, setLoginLoading] = useState(false);
  const [editingJob, setEditingJob] = useState<any>(null);
  const [editingUpdate, setEditingUpdate] = useState<any>(null);
  const [showManualJobForm, setShowManualJobForm] = useState(false);
  const [showManualUpdateForm, setShowManualUpdateForm] = useState(false);

  const apiUrl = getApiUrl();

  useEffect(() => {
    if (typeof window !== "undefined") setToken(localStorage.getItem("adminToken") || "");
  }, []);

  const showToast = (msg: string, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast({ msg: "", type: "success" }), 4000);
  };

  const handleSubmit = async (e: any) => {
    if (e) e.preventDefault();
    setLoginLoading(true);
    const endpoint = mode === "login" ? "/admin/login" : "/admin/setup";
    try {
      const res = await fetch(`${apiUrl}${endpoint}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, masterKey })
      });
      const d = await res.json();
      if (res.ok) {
        if (mode === "login") {
          localStorage.setItem("adminToken", d.token);
          setToken(d.token);
          showToast("Login successful!", "success");
        } else {
          showToast("Admin account created! You can now log in.", "success");
          setMode("login");
          setMasterKey("");
        }
      } else {
        showToast(d.error || "Action failed", "error");
      }
    } catch (err) {
      showToast("Fail to connect to server", "error");
    } finally {
      setLoginLoading(false);
    }
  };

  if (!token) {
    return (
      <main style={{ paddingTop: 88, paddingBottom: "5rem", minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ maxWidth: 400, width: "100%", padding: "2.5rem", background: "var(--surface-container-lowest)", borderRadius: "var(--r-xl)", boxShadow: "0 12px 32px var(--shadow)" }}>
          <h2 style={{ fontSize: "1.5rem", fontWeight: 800, marginBottom: "0.5rem" }}>
            Admin {mode === "login" ? "Gateway" : "Registration"}
          </h2>
          <p style={{ fontSize: "0.875rem", color: "var(--on-surface-variant)", marginBottom: "1.5rem" }}>
            {mode === "login" ? "Enter your credentials to manage platform data." : "Create a new administrative account."}
          </p>
          
          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.375rem" }}>
                <label style={{ fontSize: "0.75rem", fontWeight: 700, textTransform: "uppercase" }}>Email</label>
                <input 
                  type="email" value={email} onChange={e=>setEmail(e.target.value)} required
                  placeholder="admin@jobportal.com" 
                  style={{ padding: "0.75rem", borderRadius: "var(--r-md)", border: "1px solid var(--outline-variant)", background: "var(--surface-container-low)" }}
                />
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.375rem" }}>
                <label style={{ fontSize: "0.75rem", fontWeight: 700, textTransform: "uppercase" }}>Password</label>
                <input 
                  type="password" value={password} onChange={e=>setPassword(e.target.value)} required
                  placeholder="••••••••" 
                  style={{ padding: "0.75rem", borderRadius: "var(--r-md)", border: "1px solid var(--outline-variant)", background: "var(--surface-container-low)" }}
                />
            </div>
            {mode === "setup" && (
              <div style={{ display: "flex", flexDirection: "column", gap: "0.375rem" }}>
                  <label style={{ fontSize: "0.75rem", fontWeight: 700, textTransform: "uppercase" }}>Master Key</label>
                  <input 
                    type="password" value={masterKey} onChange={e=>setMasterKey(e.target.value)} required
                    placeholder="Security token..." 
                    style={{ padding: "0.75rem", borderRadius: "var(--r-md)", border: "1px solid var(--outline-variant)", background: "var(--surface-container-low)" }}
                  />
              </div>
            )}
            <button 
                type="submit"
                disabled={loginLoading}
                style={{ 
                    marginTop: "0.5rem", padding: "0.875rem", background: "var(--primary)", color: "white", 
                    borderRadius: "var(--r-md)", fontWeight: 700, cursor: "pointer", 
                    opacity: loginLoading ? 0.7 : 1, transition: "opacity .2s" 
                }}>
              {loginLoading ? "Verifying..." : mode === "login" ? "Access Panel" : "Register Admin"}
            </button>
          </form>

          <div style={{ marginTop: "1.25rem", textAlign: "center" }}>
            <button 
              onClick={() => setMode(mode === "login" ? "setup" : "login")}
              style={{ background: "none", border: "none", color: "var(--primary)", fontSize: "0.8125rem", fontWeight: 600, cursor: "pointer" }}>
              {mode === "login" ? "Need to create an account?" : "Already have an account? Login"}
            </button>
          </div>

          {toast.msg && <div style={{ marginTop: '1rem' }}><Toast msg={toast.msg} type={toast.type} /></div>}
        </div>
      </main>
    );
  }

  const handleJobFile = async (file: any) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('category', uploadCategory);
    try {
      const res = await fetch(`${apiUrl}/admin/jobs/upload`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` },
        body: formData
      });
      const data = await res.json();
      if(res.ok) { 
        showToast(data.message || "✓ Imported successfully!"); 
        await fetchData(); // Global refresh
      } else { 
        showToast(data.error || "Upload failed", "error"); 
      }
    } catch(err) { 
        showToast("Upload failed", "error"); 
    }
  };

  const handleManualJobSave = async (jobData: any) => {
    const isEdit = !!jobData.id && typeof jobData.id === "string" && jobData.id.length > 10;
    const url = isEdit ? `${apiUrl}/admin/jobs/${jobData.id}` : `${apiUrl}/admin/jobs`;
    const method = isEdit ? 'PATCH' : 'POST';
    
    try {
      // If creating a new job, remove the temporary numeric ID so MongoDB can generate a proper ObjectID
      const payload = isEdit ? jobData : { ...jobData };
      if (!isEdit) delete payload.id;

      const res = await fetch(url, {
        method,
        headers: { 
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}` 
        },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      if (res.ok) {
        showToast(isEdit ? "Job updated!" : "Job added!");
        setEditingJob(null);
        setShowManualJobForm(false);
        await fetchData();
      } else {
        showToast(data.error || "Save failed", "error");
      }
    } catch (err) {
      showToast("Operation failed", "error");
    }
  };

  const handleDeleteJob = async (id: string) => {
    if (!confirm("Are you sure you want to remove this listing?")) return;
    try {
      const res = await fetch(`${apiUrl}/admin/jobs/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        showToast("✓ Removed successfully");
        await fetchData();
      } else {
        showToast("Delete failed", "error");
      }
    } catch (err) {
      showToast("Delete failed", "error");
    }
  };



  const handleUpdateFile = async (file: any) => {
    const formData = new FormData();
    formData.append('file', file);
    try {
      const res = await fetch(`${apiUrl}/admin/updates/upload`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` },
        body: formData
      });
      const data = await res.json();
      if(res.ok) { 
        showToast(data.message || "✓ Imported successfully!"); 
        await fetchData(); // Global refresh
      } else { 
        showToast(data.error || "Upload failed", "error"); 
      }
    } catch(err) { 
        showToast("Upload failed", "error"); 
    }
  };

  const downloadTemplate = (type: string) => {
    const cols = type === "jobs" ? JOB_COLUMNS : UPDATE_COLUMNS;
    const ws = XLSX.utils.aoa_to_sheet([cols]);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, type === "jobs" ? "Jobs" : "Updates");
    XLSX.writeFile(wb, `editorial-architect-${type}-template.xlsx`);
  };

  const tabStyle = (t: string) => ({
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
        
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "2rem" }}>
            <h1 style={{ fontSize: "2rem", fontWeight: 900, letterSpacing: "-0.04em" }}>Content <span style={{ color: "var(--primary)" }}>Manager</span></h1>
            <button onClick={() => { localStorage.removeItem("adminToken"); setToken(""); }} style={{ fontSize: "0.875rem", fontWeight: 700, color: "var(--error)", background: "transparent", border: "none", cursor: "pointer" }}>Logout Session</button>
        </div>

        <Toast msg={toast.msg} type={toast.type} />
        
        <div style={{ display: "flex", gap: "0.75rem", marginBottom: "2rem" }}>
          <button style={tabStyle("jobs")} onClick={() => setTab("jobs")}>Job Openings</button>
          <button style={tabStyle("updates")} onClick={() => setTab("updates")}>Platform Updates</button>
        </div>

        {tab === "jobs" ? (
          <div style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
            <div style={{ background: "var(--surface-container-low)", borderRadius: "var(--r-xl)", padding: "1.5rem" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
                    <h3 style={{ fontSize: "1rem", fontWeight: 800 }}>Bulk Excel Upload</h3>
                    <div style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
                        <span style={{ fontSize: "0.75rem", fontWeight: 700, color: "var(--on-surface-variant)" }}>Assign Category:</span>
                        <select value={uploadCategory} onChange={e => setUploadCategory(e.target.value)} style={{ padding: "0.4rem", borderRadius: "var(--r-md)", fontSize: "0.8125rem" }}>
                            <option value="Private">Private Sector</option>
                            <option value="Govt">Govt Jobs</option>
                        </select>
                        <button onClick={() => downloadTemplate("jobs")} style={{ fontSize: "0.75rem", color: "var(--primary)", fontWeight: 700, background: "none", border: "none", cursor: "pointer" }}>Template ↗</button>
                    </div>
                </div>
                <DropZone onFile={handleJobFile} accept=".xlsx,.csv" label={`Click to upload ${uploadCategory} jobs`} />

            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <h3 style={{ fontSize: "1rem", fontWeight: 800 }}>Manual Management</h3>
                    <button 
                        onClick={() => { setShowManualJobForm(!showManualJobForm); setEditingJob(null); }}
                        style={{ fontSize: "0.8125rem", fontWeight: 700, color: "var(--primary)", display: "flex", alignItems: "center", gap: "0.4rem" }}>
                        <i className="ms">{showManualJobForm && !editingJob ? "remove_circle" : "add_circle"}</i>
                        {showManualJobForm && !editingJob ? "Close Form" : "Create Individual Job"}
                    </button>
                </div>
                {(showManualJobForm || editingJob) && (
                    <AddJobForm 
                        onAdd={handleManualJobSave} 
                        initialData={editingJob} 
                        onCancel={() => { setEditingJob(null); setShowManualJobForm(false); }} 
                    />
                )}
            </div>

            <div>
                 <h3 style={{ fontSize: "1rem", fontWeight: 800, marginBottom: "1.25rem" }}>Active Listings ({jobs.length})</h3>
                 <DataTable 
                    rows={jobs} 
                    columns={["title", "company", "category", "location"]} 
                    onEdit={(job: any) => { setEditingJob(job); window.scrollTo({ top: 120, behavior: "smooth" }); }}
                    onDelete={handleDeleteJob} 
                 />
            </div>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
            <div style={{ background: "var(--surface-container-low)", borderRadius: "var(--r-xl)", padding: "1.5rem" }}>
                 <h3 style={{ fontSize: "1rem", fontWeight: 800, marginBottom: "1rem" }}>Bulk Update Upload</h3>
                 <DropZone onFile={handleUpdateFile} accept=".xlsx,.csv" label="Click to upload updates" />
            </div>
            <DataTable rows={updates} columns={["title", "type", "date"]} onDelete={async (id: any) => {
                showToast("This feature is currently read-only for individual items. Use Excel for changes.", "warning");
                // Implementing update CRUD is a separate scope if needed
            }} />
          </div>
        )}
      </div>
    </main>
  );
}
