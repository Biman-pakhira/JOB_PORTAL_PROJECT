
import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { getApiUrl } from "../utils/api";

// ── Domain types ─────────────────────────────────────────────────────────────

export interface Job {
  id: string;
  title: string;
  company: string;
  location?: string;
  type?: string;
  salary?: string;
  description?: string;
  skills?: string;
  qualifications?: string;
  url?: string;
  experience?: string;
  postingDate?: string;
  category?: string;
  urgent?: boolean;
  logo?: string;
  logoColor?: string;
  deadline?: string;
  postedAgo?: string;
  isActive?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface Update {
  id: string;
  title: string;
  date?: string;
  type?: string;
  body?: string;
  createdAt?: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  profileImage?: string;
  headline?: string;
  location?: string;
  phone?: string;
  topSkills?: string;
  preferredSalary?: string;
  workSetting?: string;
  desiredRole?: string;
  industryFocus?: string;
  openToWork?: boolean;
  resumeUrl?: string;
  resumeName?: string;
}

export interface DataContextValue {
  jobs: Job[];
  setJobs: React.Dispatch<React.SetStateAction<Job[]>>;
  updates: Update[];
  setUpdates: React.Dispatch<React.SetStateAction<Update[]>>;
  bookmarks: Set<string>;
  toggleBookmark: (id: string) => void;
  user: User | null;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
  isAdmin: boolean;
  setIsAdmin: React.Dispatch<React.SetStateAction<boolean>>;
  logout: () => void;
  loading: boolean;
  fetchData: () => Promise<void>;
}

// ── Context ──────────────────────────────────────────────────────────────────

const DataContext = createContext<DataContextValue | null>(null);

export function DataProvider({ children }: { children: React.ReactNode }) {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [updates, setUpdates] = useState<Update[]>([]);
  const [bookmarks, setBookmarks] = useState<Set<string>>(new Set());
  const [user, setUser] = useState<User | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

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

  const fetchUserProfile = useCallback(async (token: string) => {
    try {
      const apiUrl = getApiUrl();
      const res = await fetch(`${apiUrl}/me`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        const fullUser: User = await res.json();
        setUser(fullUser);
        localStorage.setItem("userData", JSON.stringify(fullUser));
      } else if (res.status === 401) {
        logout();
      }
    } catch (err) {
      console.error("Failed to fetch user profile:", err);
    }
  }, []);

  useEffect(() => {
    fetchData();
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("userToken");
      const savedUser = localStorage.getItem("userData");
      if (savedUser) setUser(JSON.parse(savedUser));
      
      if (token) {
        fetchUserProfile(token);
      }
      
      const adminToken = localStorage.getItem("adminToken");
      setIsAdmin(!!adminToken);
    }
  }, [fetchData, fetchUserProfile]);

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

export const useData = (): DataContextValue => {
  const ctx = useContext(DataContext);
  if (!ctx) throw new Error("useData must be used within a DataProvider");
  return ctx;
};
