import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { type Job } from "../context/DataContext";

interface AuthRequiredModalProps {
  job: Job | null;
  onClose: () => void;
}

export function AuthRequiredModal({ job, onClose }: AuthRequiredModalProps) {
  const navigate = useNavigate();

  if (!job) return null;

  const handleLoginClick = () => {
    onClose();
    navigate("/auth");
  };

  return (
    <div style={{
      position: "fixed", top: 0, left: 0, right: 0, bottom: 0,
      background: "rgba(15, 23, 42, 0.65)",
      backdropFilter: "blur(6px)",
      zIndex: 10000,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: "1.5rem",
      animation: "fadeUp 0.25s ease-out"
    }}>
      <div style={{
        background: "#ffffff",
        borderRadius: "var(--r-xl)",
        maxWidth: 440,
        width: "100%",
        padding: "2.5rem 2rem",
        boxShadow: "0 24px 48px rgba(0, 0, 0, 0.2)",
        position: "relative",
        textAlign: "center"
      }}>
        {/* Close Button */}
        <button 
          onClick={onClose}
          style={{
            position: "absolute", top: "1.25rem", right: "1.25rem",
            background: "none", border: "none", cursor: "pointer",
            color: "var(--on-surface-variant)", opacity: 0.7
          }}
        >
          <i className="ms" style={{ fontSize: 24 }}>close</i>
        </button>

        {/* Header Badge Icon */}
        <div style={{
          width: 64, height: 64, borderRadius: "50%",
          background: "rgba(0, 80, 203, 0.08)",
          color: "var(--primary)",
          display: "flex", alignItems: "center", justifyContent: "center",
          margin: "0 auto 1.5rem"
        }}>
          <i className="ms" style={{ fontSize: 32 }}>lock</i>
        </div>

        <h3 style={{ fontSize: "1.375rem", fontWeight: 900, marginBottom: "0.5rem", letterSpacing: "-0.02em" }}>
          Login Required
        </h3>

        <p style={{ fontSize: "0.9375rem", color: "var(--on-surface-variant)", lineHeight: 1.6, marginBottom: "1.75rem" }}>
          Please sign in or create an account before submitting your application for <strong style={{ color: "var(--on-surface)" }}>{job.title}</strong> at <strong style={{ color: "var(--on-surface)" }}>{job.company}</strong>.
        </p>

        <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
          <button 
            onClick={handleLoginClick}
            style={{
              padding: "0.875rem 1.5rem",
              borderRadius: "var(--r-md)",
              background: "var(--primary)",
              color: "white",
              fontWeight: 800,
              fontSize: "0.9375rem",
              border: "none",
              cursor: "pointer",
              boxShadow: "0 4px 16px rgba(0, 80, 203, 0.25)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "0.5rem"
            }}
          >
            <i className="ms" style={{ fontSize: 20 }}>login</i>
            Sign In / Sign Up to Apply
          </button>

          <button 
            onClick={onClose}
            style={{
              padding: "0.75rem 1.5rem",
              borderRadius: "var(--r-md)",
              background: "transparent",
              color: "var(--on-surface-variant)",
              fontWeight: 600,
              fontSize: "0.875rem",
              border: "none",
              cursor: "pointer"
            }}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
