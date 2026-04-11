"use client";
import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { JobDetailPage } from "../../../views/JobDetailPage";
import { useData } from "../../../context/DataContext";

export default function JobPageRoute() {
  const { id } = useParams();
  const { bookmarks, toggleBookmark } = useData();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchJob = async () => {
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5001/api";
        const res = await fetch(`${apiUrl}/jobs/${id}`);
        if (res.ok) {
          const data = await res.json();
          setJob(data);
        }
      } catch (err) {
        console.error("Failed to fetch job:", err);
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchJob();
  }, [id]);

  if (loading) return <div style={{ paddingTop: 120, textAlign: "center" }}>Loading job details...</div>;
  if (!job) return <div style={{ paddingTop: 120, textAlign: "center" }}>Job not found</div>;

  return (
    <JobDetailPage 
      job={job} 
      bookmarked={bookmarks.has(job.id)} 
      onBookmark={toggleBookmark} 
    />
  );
}
