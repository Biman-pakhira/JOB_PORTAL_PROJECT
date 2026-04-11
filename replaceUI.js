const fs = require('fs');

let content = fs.readFileSync('editorial-architect.jsx', 'utf-8');

// 1. Replace state initialization with Backend Fetching
content = content.replace('const [jobs, setJobs] = useState(SEED_JOBS);',
    `const [jobs, setJobs] = useState([]);
  useEffect(() => {
    fetch('http://localhost:5001/api/jobs').then(r => r.json()).then(setJobs);
  }, []);`);

content = content.replace('const [updates, setUpdates] = useState(SEED_UPDATES);',
    `const [updates, setUpdates] = useState([]);
  useEffect(() => {
    fetch('http://localhost:5001/api/updates').then(r => r.json()).then(setUpdates);
  }, []);`);

// 2. Inject login screen inside AdminPage if token is absent
content = content.replace('function AdminPage({ jobs, updates, onJobsChange, onUpdatesChange }) {',
    `function AdminPage({ jobs, updates, onJobsChange, onUpdatesChange }) {
  const [password, setPassword] = useState("");
  const [token, setToken] = useState("");

  useEffect(() => {
    if (typeof window !== "undefined") setToken(localStorage.getItem("adminToken") || "");
  }, []);

  if (!token) {
    return (
      <main style={{ paddingTop: 88, paddingBottom: "5rem", minHeight: "100vh" }}>
        <div style={{ maxWidth: 400, margin: "100px auto", padding: "2.5rem", background: "var(--surface-container-lowest)", borderRadius: "var(--r-xl)", boxShadow: "0 12px 32px var(--shadow)" }}>
          <h2 style={{ fontSize: "1.5rem", fontWeight: 800, marginBottom: "1rem" }}>Login (Admin)</h2>
          <input 
            type="password" value={password} onChange={e=>setPassword(e.target.value)} 
            placeholder="password (password123)" 
            style={{ width: "100%", padding: "0.75rem", borderRadius: "var(--r-md)", border: "1px solid var(--outline)", marginBottom: "1rem" }}
          />
          <button style={{ width: "100%", padding: "0.75rem", background: "var(--primary)", color: "white", borderRadius: "var(--r-md)", fontWeight: "bold" }} onClick={() => {
            fetch('http://localhost:5001/api/admin/login', {
              method: 'POST', headers: {'Content-Type': 'application/json'},
              body: JSON.stringify({email: 'admin@example.com', password})
            }).then(r=>r.json()).then(d => { if(d.token){ localStorage.setItem("adminToken", d.token); setToken(d.token); } else alert("Failed"); })
          }}>Login</button>
        </div>
      </main>
    );
  }
`);

// 3. Replace the excel reading via SheetJS with direct backend calls using formData
content = content.replace(/const handleJobFile = async[^]+?};/s,
    `const handleJobFile = async (file) => {
    const formData = new FormData();
    formData.append('file', file);
    try {
      const res = await fetch('http://localhost:5001/api/admin/jobs/upload', {
        method: 'POST',
        headers: { 'Authorization': \`Bearer \${localStorage.getItem('adminToken')}\` },
        body: formData
      });
      const data = await res.json();
      if(res.ok) { 
        showToast(data.message || "✓ Imported successfully!"); 
        fetch('http://localhost:5001/api/jobs').then(r=>r.json()).then(onJobsChange); 
      } else {
        showToast(data.error || "Upload failed", "error");
      }
    } catch(err) { showToast("Upload failed", "error"); }
  };`
);

content = content.replace(/const handleUpdateFile = async[^]+?};/s,
    `const handleUpdateFile = async (file) => {
    const formData = new FormData();
    formData.append('file', file);
    try {
      const res = await fetch('http://localhost:5001/api/admin/updates/upload', {
        method: 'POST',
        headers: { 'Authorization': \`Bearer \${localStorage.getItem('adminToken')}\` },
        body: formData
      });
      const data = await res.json();
      if(res.ok) { 
        showToast(data.message || "✓ Imported successfully!"); 
        fetch('http://localhost:5001/api/updates').then(r=>r.json()).then(onUpdatesChange); 
      } else {
        showToast(data.error || "Upload failed", "error");
      }
    } catch(err) { showToast("Upload failed", "error"); }
  };`
);

// Add "use client"; at the beginning for Next.js app router compatibility
fs.writeFileSync('frontend/app/page.tsx', '// @ts-nocheck\n"use client";\n' + content);
console.log("Successfully adapted editorial-architect.jsx for Next.js");
