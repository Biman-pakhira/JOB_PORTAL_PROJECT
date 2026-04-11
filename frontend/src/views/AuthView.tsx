import React, { useState } from "react";
import { getApiUrl } from "../utils/api";
import { Toast } from "../components/SharedAdminComponents";

export function AuthView({ onAuthSuccess, onBack }: any) {
  const [isLogin, setIsLogin] = useState(true);
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);

  const set = (k: string) => (e: any) => setForm(f => ({ ...f, [k]: e.target.value }));

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setErr("");
    setLoading(true);

    const endpoint = isLogin ? "/login" : "/signup";
    try {
      const apiUrl = getApiUrl();
        
      const res = await fetch(`${apiUrl}${endpoint}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form)
      });
      const data = await res.json();
      if (res.ok) {
        localStorage.setItem("userToken", data.token);
        localStorage.setItem("userData", JSON.stringify(data.user));
        onAuthSuccess(data.user);
      } else {
        setErr(data.error || "Authentication failed");
      }
    } catch (err) {
      setErr("Server connection failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main style={{ paddingTop: 88, paddingBottom: "5rem", minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{ maxWidth: 400, width: "100%", padding: "2.5rem", background: "var(--surface-container-lowest)", borderRadius: "var(--r-xl)", boxShadow: "0 12px 32px var(--shadow)" }}>
        <h2 style={{ fontSize: "1.75rem", fontWeight: 900, marginBottom: "0.5rem", letterSpacing: "-0.04em" }}>
          {isLogin ? "Welcome Back" : "Create Account"}
        </h2>
        <p style={{ fontSize: "0.875rem", color: "var(--on-surface-variant)", marginBottom: "1.5rem" }}>
          {isLogin ? "Sign in to manage your applications." : "Join our community of creative professionals."}
        </p>

        {err && <Toast msg={err} type="error" />}

        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          {!isLogin && (
            <div style={{ display: "flex", flexDirection: "column", gap: "0.375rem" }}>
              <label style={{ fontSize: "0.75rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.04em" }}>Full Name</label>
              <input value={form.name} onChange={set("name")} required style={{ padding: "0.75rem", borderRadius: "var(--r-md)", border: "1px solid var(--outline-variant)", background: "var(--surface-container-low)" }} />
            </div>
          )}
          <div style={{ display: "flex", flexDirection: "column", gap: "0.375rem" }}>
            <label style={{ fontSize: "0.75rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.04em" }}>Email Address</label>
            <input type="email" value={form.email} onChange={set("email")} required style={{ padding: "0.75rem", borderRadius: "var(--r-md)", border: "1px solid var(--outline-variant)", background: "var(--surface-container-low)" }} />
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "0.375rem" }}>
            <label style={{ fontSize: "0.75rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.04em" }}>Password</label>
            <input type="password" value={form.password} onChange={set("password")} required style={{ padding: "0.75rem", borderRadius: "var(--r-md)", border: "1px solid var(--outline-variant)", background: "var(--surface-container-low)" }} />
          </div>

          <button disabled={loading} style={{ 
            marginTop: "1rem", padding: "0.875rem", borderRadius: "var(--r-md)", background: "var(--primary)", color: "white", 
            fontWeight: 700, boxShadow: "0 4px 12px rgba(0,80,203,.2)", opacity: loading ? 0.7 : 1, cursor: "pointer"
          }}>
            {loading ? "Processing..." : isLogin ? "Sign In" : "Sign Up"}
          </button>
        </form>

        <div style={{ marginTop: "1.5rem", textAlign: "center", fontSize: "0.875rem" }}>
          <span style={{ color: "var(--on-surface-variant)" }}>
            {isLogin ? "Don't have an account? " : "Already have an account? "}
          </span>
          <button onClick={() => setIsLogin(!isLogin)} style={{ fontWeight: 700, color: "var(--primary)", borderBottom: "1px solid var(--primary)" }}>
            {isLogin ? "Sign Up" : "Sign In"}
          </button>
        </div>

        <button onClick={onBack} style={{ display: "block", margin: "1.5rem auto 0", fontSize: "0.8125rem", fontWeight: 600, color: "var(--on-surface-variant)" }}>
          ← Back to Site
        </button>
      </div>
    </main>
  );
}
