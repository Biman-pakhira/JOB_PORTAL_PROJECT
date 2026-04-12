"use client";
import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { getApiUrl } from "../utils/api";

const DataContext = createContext<any>(null);

export function DataProvider({ children }: { children: React.ReactNode }) {
  const [jobs, setJobs] = useState<any[]>([]);
  const [updates, setUpdates] = useState<any[]>([]);
  const [bookmarks, setBookmarks] = useState<Set<string>>(new Set());
  const [user, setUser] = useState<any>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  // Sync bookmarks with localStorage
  useEffect(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("job_bookmarks");
      if (saved) {
        try {
          setBookmarks(new Set(JSON.parse(saved)));
        } catch (e) {
          console.error("Failed to parse bookmarks", e);
        }
      }
    }
  }, []);

  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("job_bookmarks", JSON.stringify(Array.from(bookmarks)));
    }
  }, [bookmarks]);

  const fetchData = useCallback(async () => {
    try {
      const apiUrl = getApiUrl();
      const [jobsRes, updatesRes] = await Promise.all([
        fetch(`${apiUrl}/jobs`),
        fetch(`${apiUrl}/updates`)
      ]);
      const jobsData = await jobsRes.json();
      const updatesData = await updatesRes.json();
      
      setJobs(Array.isArray(jobsData) ? jobsData : []);
      setUpdates(Array.isArray(updatesData) ? updatesData : []);
    } catch (err) {
      console.error("Failed to fetch data:", err);
      setJobs([]);
      setUpdates([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
    if (typeof window !== "undefined") {
      const savedUser = localStorage.getItem("userData");
      if (savedUser) setUser(JSON.parse(savedUser));
      
      const adminToken = localStorage.getItem("adminToken");
      setIsAdmin(!!adminToken);
    }
  }, [fetchData]);

  const toggleBookmark = (id: string) => {
    setBookmarks(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const logout = () => {
    localStorage.removeItem("userToken");
    localStorage.removeItem("userData");
    localStorage.removeItem("adminToken");
    setUser(null);
    setIsAdmin(false);
  };

  return (
    <DataContext.Provider value={{ 
      jobs, setJobs, 
      updates, setUpdates, 
      bookmarks, toggleBookmark, 
      user, setUser,
      isAdmin, setIsAdmin,
      logout, loading, fetchData 
    }}>
      {children}
    </DataContext.Provider>
  );
}

export const useData = () => useContext(DataContext);
