import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route, useNavigate, useParams } from "react-router-dom";
import { DataProvider, useData } from "./context/DataContext";
import { GoogleAuthProvider } from "./components/GoogleAuthProvider";
import { NavWrapper } from "./components/NavWrapper";
import { Footer } from "./components/Footer";
import { BottomNav } from "./components/BottomNav";
import { TOKENS } from "./constants/tokens";

// Views
import { HomeView } from "./views/HomeView";
import { AdminPage } from "./views/AdminPage";
import { AuthView } from "./views/AuthView";
import { SectorPage } from "./views/SectorPage";
import { UpdatesPage } from "./views/UpdatesPage";
import { ProfileView } from "./views/ProfileView";
import { JobDetailPage } from "./views/JobDetailPage";

// Utils
import { getApiUrl } from "./utils/api";

function HomeRoute() {
  const { loading } = useData();

  if (loading) {
    return (
      <main style={{ paddingTop: 120, textAlign: "center", color: "var(--on-surface-variant)" }}>
        <p>Fetching opportunities...</p>
      </main>
    );
  }

  return <HomeView />;
}

function BrowseRoute() {
  const { jobs, bookmarks, toggleBookmark, loading } = useData();

  if (loading) {
    return (
      <main style={{ paddingTop: 120, textAlign: "center", color: "var(--on-surface-variant)" }}>
        <p>Loading jobs...</p>
      </main>
    );
  }

  return (
    <SectorPage 
      title="All Jobs" 
      subtitle="Explore the full directory of private and government opportunities." 
      jobs={jobs} 
      bookmarks={bookmarks} 
      onBookmark={toggleBookmark} 
    />
  );
}

function GovtJobsRoute() {
  const { jobs, bookmarks, toggleBookmark, loading } = useData();

  if (loading) return <main style={{ paddingTop: 88, textAlign: "center" }}><p>Loading...</p></main>;

  return (
    <SectorPage 
      title="Govt Jobs" 
      subtitle="Curated roles in policy writing, communications, and public sector editorial." 
      jobs={jobs} 
      bookmarks={bookmarks} 
      onBookmark={toggleBookmark} 
      categoryFilter="Govt" 
    />
  );
}

function PrivateSectorRoute() {
  const { jobs, bookmarks, toggleBookmark, loading } = useData();

  if (loading) return <main style={{ paddingTop: 88, textAlign: "center" }}><p>Loading...</p></main>;

  return (
    <SectorPage 
      title="Private Sector" 
      subtitle="Explore high-impact roles in publishing, tech, and design firms." 
      jobs={jobs} 
      bookmarks={bookmarks} 
      onBookmark={toggleBookmark} 
      categoryFilter="Private" 
    />
  );
}

function SavedRoute() {
  const { jobs, bookmarks, toggleBookmark, loading } = useData();

  const savedJobs = jobs.filter((j: any) => bookmarks.has(j.id));

  if (loading) {
    return (
      <main style={{ paddingTop: 120, textAlign: "center", color: "var(--on-surface-variant)" }}>
        <p>Loading bookmarks...</p>
      </main>
    );
  }

  return (
    <SectorPage 
      title="Saved Jobs" 
      subtitle="Your personal shortlist of bookmarked opportunities." 
      jobs={savedJobs} 
      bookmarks={bookmarks} 
      onBookmark={toggleBookmark} 
    />
  );
}

function UpdatesRoute() {
  const { updates, loading } = useData();
  if (loading) return <main style={{ paddingTop: 88, textAlign: "center" }}><p>Loading updates...</p></main>;
  return <UpdatesPage updates={updates} />;
}

function ProfileRoute() {
  const { user, loading } = useData();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !user) {
      navigate("/auth");
    }
  }, [user, loading, navigate]);

  if (loading) {
    return (
      <main style={{ paddingTop: 120, textAlign: "center", color: "var(--on-surface-variant)" }}>
        <p>Loading profile...</p>
      </main>
    );
  }

  if (!user) return null;

  return <ProfileView />;
}

function AuthRoute() {
  const navigate = useNavigate();
  const { setUser } = useData();

  return (
    <AuthView 
      onAuthSuccess={(u: any) => { 
        setUser(u); 
        navigate("/"); 
      }} 
      onBack={() => navigate("/")} 
    />
  );
}

function JobRoute() {
  const { id } = useParams();
  const { bookmarks, toggleBookmark } = useData();
  const [job, setJob] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchJob = async () => {
      try {
        const apiUrl = getApiUrl();
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

export function AppContent() {
  return (
    <>
      <style>{TOKENS}</style>
      <NavWrapper />
      <div style={{ minHeight: "calc(100vh - 64px)" }}>
        <Routes>
          <Route path="/" element={<HomeRoute />} />
          <Route path="/browse" element={<BrowseRoute />} />
          <Route path="/govt-jobs" element={<GovtJobsRoute />} />
          <Route path="/private-sector" element={<PrivateSectorRoute />} />
          <Route path="/saved" element={<SavedRoute />} />
          <Route path="/updates" element={<UpdatesRoute />} />
          <Route path="/profile" element={<ProfileRoute />} />
          <Route path="/auth" element={<AuthRoute />} />
          <Route path="/admin" element={<AdminPage />} />
          <Route path="/jobs/:id" element={<JobRoute />} />
        </Routes>
      </div>
      <BottomNav />
      <Footer />
    </>
  );
}

export default function App() {
  return (
    <DataProvider>
      <GoogleAuthProvider>
        <Router>
          <AppContent />
        </Router>
      </GoogleAuthProvider>
    </DataProvider>
  );
}
