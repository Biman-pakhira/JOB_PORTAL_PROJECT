export const TOKENS = `
  @import url('https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;600;700;800;900&family=Inter:wght@300;400;500;600&display=swap');
  @import url('https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200&display=swap');

  :root {
    --primary: #0050cb;
    --primary-container: #0066ff;
    --on-primary: #ffffff;
    --secondary: #006d43;
    --on-secondary: #ffffff;
    --tertiary: #9f3600;
    --surface: #faf8ff;
    --surface-bright: #faf8ff;
    --surface-container-lowest: #ffffff;
    --surface-container-low: #f2f3ff;
    --surface-container: #ecedfa;
    --surface-container-high: #e6e7f4;
    --surface-container-highest: #e1e2ee;
    --surface-variant: #e1e2ee;
    --on-surface: #191b24;
    --on-surface-variant: #424656;
    --outline: #727687;
    --outline-variant: #c2c6d8;
    --error: #ba1a1a;
    --error-container: #ffdad6;
    --on-error-container: #93000a;
    --shadow: rgba(25,27,36,0.06);
    --font-headline: 'Manrope', sans-serif;
    --font-body: 'Inter', sans-serif;
    --r-sm: 4px; --r-md: 12px; --r-lg: 16px; --r-xl: 24px; --r-full: 9999px;
    --content-pad: 3rem;
  }

  @media (max-width: 1024px) {
    :root { --content-pad: 2rem; }
  }
  @media (max-width: 768px) {
    :root { --content-pad: 1.5rem; }
  }

  .mobile-show { display: none !important; }
  @media (max-width: 1024px) {
    .mobile-hide { display: none !important; }
    .mobile-show { display: block !important; }
    .mobile-show-flex { display: flex !important; }
  }

  .responsive-grid {
    display: grid;
    grid-template-columns: 1fr 2.2fr;
    gap: 1.75rem;
  }
  @media (max-width: 1024px) {
    .responsive-grid { grid-template-columns: 1fr; gap: 1.5rem; }
  }

  .page-header {
    padding: 3.5rem var(--content-pad) 2.5rem;
    max-width: 1280px;
    margin: 0 auto;
  }

  .stack-on-mobile {
    display: flex;
    flex-direction: row;
    gap: 1.5rem;
  }
  @media (max-width: 768px) {
    .stack-on-mobile { flex-direction: column; }
  }

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  html { scroll-behavior: smooth; }
  body { font-family: var(--font-body); background: var(--surface); color: var(--on-surface); -webkit-font-smoothing: antialiased; }
  h1,h2,h3,h4,h5 { font-family: var(--font-headline); }
  a { text-decoration: none; color: inherit; }
  button { cursor: pointer; border: none; background: none; font-family: inherit; }
  img { display: block; max-width: 100%; }
  .ms { font-family: 'Material Symbols Outlined'; font-size: 20px; line-height: 1; vertical-align: middle; font-style: normal;
    font-variation-settings: 'FILL' 0,'wght' 400,'GRAD' 0,'opsz' 24; }
  .ms-fill { font-variation-settings: 'FILL' 1,'wght' 400,'GRAD' 0,'opsz' 24; }
  ::-webkit-scrollbar { width: 6px; }
  ::-webkit-scrollbar-track { background: var(--surface-container-low); }
  ::-webkit-scrollbar-thumb { background: var(--outline-variant); border-radius: 3px; }

  @keyframes pulse { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:.6;transform:scale(.85)} }
  @keyframes fadeUp { from{opacity:0;transform:translateY(18px)} to{opacity:1;transform:translateY(0)} }
  @keyframes shimmer { 0%{background-position:-400px 0} 100%{background-position:400px 0} }

  .fade-up { animation: fadeUp 0.45s ease both; }
  .fade-up-1 { animation: fadeUp 0.45s 0.05s ease both; }
  .fade-up-2 { animation: fadeUp 0.45s 0.12s ease both; }
  .fade-up-3 { animation: fadeUp 0.45s 0.2s ease both; }
`;

export const JOB_COLUMNS = ["title", "company", "location", "type", "category", "salary", "deadline", "postedAgo", "urgent", "logo", "logoColor", "description"];
export const UPDATE_COLUMNS = ["title", "date", "type", "body"];
