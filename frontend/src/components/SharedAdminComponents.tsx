// @ts-nocheck

import React, { useState, useRef } from "react";
import { JOB_COLUMNS, UPDATE_COLUMNS } from "../constants/tokens";

export function Toast({ msg, type }: any) {
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

export function DropZone({ onFile, accept, label }: any) {
  const [dragging, setDragging] = useState(false);
  const [fileName, setFileName] = useState("");
  const inputRef = useRef();

  const handleFile = (f: File) => {
    if (f) {
      setFileName(f.name);
      onFile(f);
    }
  };

  return (
    <div
      onClick={() => inputRef.current.click()}
      onDragOver={e => { e.preventDefault(); setDragging(true); }}
      onDragLeave={() => setDragging(false)}
      onDrop={e => { e.preventDefault(); setDragging(false); const f = (e as any).dataTransfer.files[0]; handleFile(f); }}
      style={{
        border: `2px dashed ${dragging ? "var(--primary)" : "var(--outline-variant)"}`,
        borderRadius: "var(--r-xl)", padding: "2.5rem 2rem",
        textAlign: "center", cursor: "pointer",
        background: dragging ? "rgba(0,80,203,.04)" : "var(--surface-container-low)",
        transition: "border-color .18s,background .18s",
      }}>
      <i className="ms" style={{ fontSize: 36, color: "var(--on-surface-variant)", marginBottom: "0.75rem", display: "block" }}>{fileName ? "task_check" : "upload_file"}</i>
      <p style={{ fontSize: "0.9375rem", fontWeight: 700, marginBottom: "0.375rem" }}>{fileName || label}</p>
      <p style={{ fontSize: "0.8125rem", color: "var(--on-surface-variant)" }}>
        {fileName ? `File selected: ${fileName}` : "Drag & drop or click to browse — .xlsx or .csv"}
      </p>
      <input ref={inputRef as any} type="file" accept={accept} style={{ display: "none" }} onChange={(e: any) => handleFile(e.target.files[0])} />
    </div>
  );
}

export function DataTable({ rows, columns, onDelete, onEdit }: any) {
  if (!rows.length) return <p style={{ color: "var(--on-surface-variant)", fontSize: "0.875rem" }}>No records yet.</p>;
  return (
    <div style={{ overflowX: "auto", borderRadius: "var(--r-lg)", border: "1px solid var(--outline-variant)" }}>
      <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.8125rem" }}>
        <thead>
          <tr style={{ background: "var(--surface-container-high)" }}>
            {columns.map((c: any) => (
              <th key={c} style={{ padding: "0.75rem 1rem", textAlign: "left", fontWeight: 700, color: "var(--on-surface-variant)", whiteSpace: "nowrap", fontSize: "0.75rem", letterSpacing: "0.04em", textTransform: "uppercase" }}>{c}</th>
            ))}
            <th style={{ padding: "0.75rem 1rem", textAlign: "center", fontWeight: 700, color: "var(--on-surface-variant)", fontSize: "0.75rem" }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row: any, i: number) => (
            <tr key={row.id} style={{ borderTop: "1px solid var(--outline-variant)", background: i % 2 === 0 ? "var(--surface-container-lowest)" : "var(--surface-container-low)" }}>
              {columns.map((c: any) => (
                <td key={c} style={{ padding: "0.75rem 1rem", color: "var(--on-surface)", maxWidth: 180, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                  {String(row[c] ?? "")}
                </td>
              ))}
              <td style={{ padding: "0.75rem 1rem", textAlign: "center", display: "flex", justifyContent: "center", gap: "1rem" }}>
                <button onClick={() => onEdit(row)} style={{ color: "var(--primary)", fontSize: "0.75rem", fontWeight: 700, cursor: "pointer", display: "inline-flex", alignItems: "center", gap: "0.25rem" }}>
                  <i className="ms" style={{ fontSize: 16 }}>edit</i> Edit
                </button>
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

export function AddJobForm({ onAdd, initialData = null, onCancel }: any) {
  const [form, setForm] = useState(initialData || { title: "", company: "", location: "", type: "Full-time", category: "Editorial", salary: "", deadline: "", postedAgo: "Just now", urgent: false, logo: "", logoColor: "#0050cb", description: "", url: "", qualifications: "", experience: "" });
  const [err, setErr] = useState("");
  
  // Update form if initialData changes (for Edit mode)
  React.useEffect(() => {
    if (initialData) setForm(initialData);
  }, [initialData]);

  const set = (k: any) => (e: any) => setForm((f: any) => ({ ...f, [k]: e.target.type === "checkbox" ? e.target.checked : e.target.value }));
  const submit = () => {
    if (!form.title || !form.company) { setErr("Title and Company are required."); return; }
    
    // Clean payload for Prisma: remove read-only or invalid fields
    const { featured, createdAt, updatedAt, applications, ...cleanPayload } = form;
    
    onAdd({ 
      ...cleanPayload, 
      id: form.id || Date.now(), 
      logo: form.logo || form.company.slice(0, 2).toUpperCase()
    });

    if (!initialData) {
        setForm({ title: "", company: "", location: "", type: "Full-time", category: "Editorial", salary: "", deadline: "", postedAgo: "Just now", urgent: false, logo: "", logoColor: "#0050cb", description: "", url: "", qualifications: "", experience: "" });
    }
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
        {field("Apply URL", "url")}
        {field("Posted Ago", "postedAgo")}
        {field("Experience", "experience")}
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
        <label style={{ fontSize: "0.75rem", fontWeight: 700, color: "var(--on-surface-variant)", letterSpacing: "0.04em", textTransform: "uppercase", display: "block", marginBottom: "0.375rem" }}>Qualifications</label>
        <textarea value={form.qualifications} onChange={set("qualifications")} rows={2} style={{ width: "100%", padding: "0.5rem 0.75rem", borderRadius: "var(--r-md)", border: "1px solid var(--outline-variant)", background: "var(--surface-container-lowest)", fontFamily: "var(--font-body)", fontSize: "0.875rem", color: "var(--on-surface)", resize: "vertical", outline: "none", marginBottom: "1rem" }} />
        
        <label style={{ fontSize: "0.75rem", fontWeight: 700, color: "var(--on-surface-variant)", letterSpacing: "0.04em", textTransform: "uppercase", display: "block", marginBottom: "0.375rem" }}>Description</label>
        <textarea value={form.description} onChange={set("description")} rows={3} style={{ width: "100%", padding: "0.5rem 0.75rem", borderRadius: "var(--r-md)", border: "1px solid var(--outline-variant)", background: "var(--surface-container-lowest)", fontFamily: "var(--font-body)", fontSize: "0.875rem", color: "var(--on-surface)", resize: "vertical", outline: "none" }} />
      </div>
      <div style={{ display: "flex", gap: "1rem" }}>
          <button onClick={submit} style={{
            padding: "0.625rem 1.75rem", borderRadius: "var(--r-md)", fontSize: "0.875rem", fontWeight: 700,
            color: "var(--on-primary)", background: "linear-gradient(135deg,var(--primary) 0%,var(--primary-container) 100%)",
            boxShadow: "0 4px 16px rgba(0,80,203,.25)", cursor: "pointer",
            display: "inline-flex", alignItems: "center", gap: "0.5rem",
          }}>
            <i className="ms" style={{ fontSize: 18 }}>{initialData ? "save" : "add_circle"}</i> 
            {initialData ? "Save Changes" : "Add Job"}
          </button>
          {initialData && (
            <button onClick={onCancel} style={{
                padding: "0.625rem 1.75rem", borderRadius: "var(--r-md)", fontSize: "0.875rem", fontWeight: 700,
                color: "var(--on-surface-variant)", background: "var(--surface-container-high)",
                cursor: "pointer"
            }}>Cancel</button>
          )}
      </div>
    </div>
  );
}

export function AddUpdateForm({ onAdd }: any) {
  const [form, setForm] = useState({ title: "", date: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }), type: "Feature", body: "" });
  const [err, setErr] = useState("");
  const set = (k: any) => (e: any) => setForm((f: any) => ({ ...f, [k]: e.target.value }));
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
