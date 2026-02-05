import React, { useEffect, useMemo, useState } from 'react';
import ReactGA from "react-ga4";


// Helper: Preload an image using the browser Image API to avoid CORS issues
const preloadImage = (url) =>
  new Promise((resolve) => {
    const img = new Image();
    img.onload = () => {
      const finalUrl = img.currentSrc || img.src;
      const is404Final = finalUrl && /\/404\.jpg(\?.*)?$/i.test(finalUrl);
      const requested404 = /\/404\.jpg(\?.*)?$/i.test(url);
      // If server fell back to 404.jpg for a non-404 code, treat as missing.
      if (is404Final && !requested404) {
        resolve(null);
      } else {
        resolve(url);
      }
    };
    img.onerror = () => resolve(null);
    img.src = url;
  });

// Map HTTP code to a category with colors and label
// const codeCategory = (code) => {
//   if (code >= 100 && code < 200) return { label: 'Informational', color: '#38bdf8' };
//   if (code >= 200 && code < 300) return { label: 'Success', color: '#22c55e' };
//   if (code >= 300 && code < 400) return { label: 'Redirection', color: '#f59e0b' };
//   if (code >= 400 && code < 500) return { label: 'Client Error', color: '#ef4444' };
//   if (code >= 500 && code < 600) return { label: 'Server Error', color: '#a78bfa' };
//   return { label: 'Unknown', color: '#94a3b8' };
// };

// Whitelist of available HTTP status images
const ALLOWED_CODES = [
  100, 101, 102, 103,
  200, 201, 202, 203, 204, 205, 206, 207, 208, 218, 226,
  300, 301, 302, 303, 304, 305, 306, 307, 308,
  400, 401, 402, 403, 404, 405, 406, 407, 408, 409, 410, 411, 412, 413, 414, 415, 416, 417,
  418, 419, 420, 421, 422, 423, 424, 425, 426, 428, 429, 430, 431,
  440, 444, 449, 450, 451, 460, 463, 464, 494, 495, 496, 497, 498, 499,
  500, 501, 502, 503, 504, 505, 506, 507, 508, 509, 510, 511,
  520, 521, 522, 523, 524, 525, 526, 527, 529, 530, 561, 598, 599,
  999
];

const ShimmerCardOne = ({ descriptionLineCount = 1, rating = true, className = '', imageShimmerClassName = 'ud-sk-rounded' }) => {
  return (
    <div className={`ud-grid-item ud-sk-card ${className}`}>
      <div aria-hidden="true" className={`ud-sk-img ${imageShimmerClassName}`} />
      <div className="ud-sk-body">
        <div className="ud-sk-row">
          <div className="ud-sk-title" />
          <div className={`ud-sk-right ${rating ? '' : 'ud-sk-hide'}`} />
        </div>
        <div className="ud-sk-sub" />
        {Array.from({ length: descriptionLineCount }).map((_, index) => (
          <div key={index} className="ud-sk-line" />
        ))}
      </div>
    </div>
  );
};

const UserDashboard = () => {
  const [allImages, setAllImages] = useState([]); // [{ code, url }]
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [query, setQuery] = useState('');
  const [chip, setChip] = useState('all'); // all | 1xx | 2xx | 3xx | 4xx | 5xx

  // Fetch and validate available codes 100..599
  useEffect(() => {
    let cancelled = false;

    const run = async () => {
      try {
        setLoading(true);
        setError('');

        const codes = ALLOWED_CODES;

        // Batch with modest concurrency to avoid spamming the network
        const batchSize = 24;
        const found = [];

        for (let i = 0; i < codes.length; i += batchSize) {
          if (cancelled) break;
          const batch = codes.slice(i, i + batchSize);
          const results = await Promise.all(
            batch.map(async (code) => {
              const url = `https://http.dog/${code}.jpg`;
              const ok = await preloadImage(url);
              return ok ? { code, url } : null;
            })
          );
          for (const r of results) if (r) found.push(r);
        }

        if (!cancelled) setAllImages(found);
      } catch (_) {
        if (!cancelled) setError('Failed to load images. Please try again later.');
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    run();
    return () => {
      cancelled = true;
    };
  }, []);

  // Numeric-only input; strip non-digits
  const handleSearchChange = (e) => {
    const onlyDigits = e.target.value.replace(/\D/g, '');
    setQuery(onlyDigits);
      // 🔹 Google Analytics Event
  ReactGA.event({
    category: "Search",
    action: "Search HTTP Code",
    label: onlyDigits || "empty",
  });
  };

  // Optional category chips
  const chips = [
    { key: 'all', label: 'All' },
    { key: '1xx', label: '1xx' },
    { key: '2xx', label: '2xx' },
    { key: '3xx', label: '3xx' },
    { key: '4xx', label: '4xx' },
    { key: '5xx', label: '5xx' },
    { key: '9xx', label: '9xx' },
  ];

  // Filter pipeline: chip first, then query prefix
  const filtered = useMemo(() => {
    let list = allImages;

    if (chip !== 'all') {
      const start = Number(chip[0]) * 100;
      list = list.filter((x) => x.code >= start && x.code < start + 100);
    }

    if (!query) return list;
    return list.filter((x) => String(x.code).startsWith(query));
  }, [allImages, query, chip]);

  // const showEmptyState = !loading && query && filtered.length === 0;

  return (
    <div className="ud-root">
      <div className="ud-bg-orb ud-orb-1" />
      <div className="ud-bg-orb ud-orb-2" />

      {/* Header/Search */}
      <header className="ud-header">
        <div className="ud-brand">
          <span className="ud-dot" />
          HTTP Status Code Gallery
        </div>

        <div className="ud-toolbar">
          <div className="ud-search">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="2" />
              <path d="M20 20l-3.5-3.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
            <input
              type="text"
              value={query}
              onChange={handleSearchChange}
              placeholder="Search by status code (e.g., 2, 200, 404)"
              aria-label="Search codes"
            />
          </div>

          <div className="ud-chips">
            {chips.map((c) => (
              <button
                key={c.key}
                className={`ud-chip ${chip === c.key ? 'ud-chip-active' : ''}`}
                onClick={() =>{setChip(c.key)
              ReactGA.event({
                category: "Filter",
                 action: "Filter by Category",
                label: c.key,
                   });
                }}
                aria-pressed={chip === c.key}
              >
                {c.label}
              </button>
            ))}
          </div>
        </div>
      </header>

      <section className="ud-hero">
        <div className="ud-hero-inner">
          <h1 className="ud-hero-title">HTTP Status Code Gallery</h1>
          <p className="ud-hero-sub">
            Visual, searchable reference of HTTP status codes. 
          </p>
          <div className="ud-legend">
            <span className="ud-legend-item" style={{ '--c': '#38bdf8' }}>1xx Informational</span>
            <span className="ud-legend-item" style={{ '--c': '#22c55e' }}>2xx Success</span>
            <span className="ud-legend-item" style={{ '--c': '#f59e0b' }}>3xx Redirection</span>
            <span className="ud-legend-item" style={{ '--c': '#ef4444' }}>4xx Client Error</span>
            <span className="ud-legend-item" style={{ '--c': '#a78bfa' }}>5xx Server Error</span>
            <span className="ud-legend-item" style={{ '--c': '#94a3b8' }}>9xx Other</span>
          </div>
          <div className="ud-stats">
            <span>Loaded {allImages.length} images</span>
            <span>Showing {filtered.length} result{filtered.length !== 1 ? 's' : ''}</span>
          </div>
        </div>
      </section>

      {error && <div className="ud-error">{error}</div>}

      {/* Grid */}
      <main className="ud-main">
        <div className="ud-grid">
          {loading ? (
            Array.from({ length: 24 }).map((_, i) => (
              <ShimmerCardOne key={i} descriptionLineCount={2} rating={true} />
            ))
          ) : (
            filtered.length > 0 ? (
              filtered.map(({ code, url }) => {
                // const cat = codeCategory(code);
                return (
                  <div key={code} className="ud-grid-item ud-card">
                    <div className="ud-card-image-wrap">
                      <img src={url} alt={`HTTP ${code}`} loading="lazy" />
                    </div>
                    <div className="ud-card-meta">
                      <div className="ud-meta-actions">
                        <button className="ud-btn ud-btn-ghost" onClick={() =>{navigator.clipboard.writeText(url)
                           ReactGA.event({
                       category: "Interaction",
                       action: "Copy Image URL",
                           label: String(code),
                          });
                        }}>
                          <span className="ud-btn-ico" aria-hidden="true">
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                              <path d="M9 3h6a2 2 0 012 2v1h1a2 2 0 012 2v11a2 2 0 01-2 2H8a2 2 0 01-2-2V8a2 2 0 012-2h1V5a2 2 0 012-2zm0 3h6V5H9v1z"/>
                            </svg>
                          </span>
                          Copy URL
                        </button>
                        <a className="ud-btn ud-btn-primary ud-link" href={url} target="_blank" rel="noreferrer"
                          onClick={() => {
                         ReactGA.event({
                      category: "Interaction",
                      action: "Open Image",
                      label: String(code),
                          });
                             }}>
                          <span className="ud-btn-ico" aria-hidden="true">
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                              <path d="M14 3h7v7h-2V6.41l-7.29 7.3-1.42-1.42 7.3-7.29H14V3z"/>
                              <path d="M5 5h6v2H7v10h10v-4h2v6H5V5z"/>
                            </svg>
                          </span>
                          Open
                        </a>
                      </div>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="ud-empty">
                <div className="ud-empty-icon">🔍</div>
                <div className="ud-empty-title">No matches found</div>
                <div className="ud-empty-text">Try a different prefix or pick another category.</div>
              </div>
            )
          )}
        </div>

              </main>

      <footer className="ud-footer">
        <div className="ud-footer-inner">
          <div className="ud-footer-left">
            <div className="ud-footer-copy">
              <span>HTTP Status Gallery — A lightweight visual explorer for HTTP codes.</span>
              <span className="ud-sep" aria-hidden="true">•</span>
              <span>Images by <a href="https://http.dog" target="_blank" rel="noreferrer">http.dog</a></span>
              <span className="ud-sep" aria-hidden="true">•</span>
              <span>Made with ❤️ by Ragnee</span>
            </div>
          </div>
          <div className="ud-footer-right">
            <div className="ud-contact-card" role="contentinfo" aria-label="Contact details">
              <div className="ud-contact-header">Connect with me</div>
              <div className="ud-contact-row">
                <div className="ud-contact-logo ud-logo-email" aria-hidden="true">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="#ffffff" xmlns="http://www.w3.org/2000/svg"><path d="M20 6H4a2 2 0 00-2 2v.2l10 6.3 10-6.3V8a2 2 0 00-2-2zm0 4.4l-8 5-8-5V18a2 2 0 002 2h12a2 2 0 002-2v-7.6z"/></svg>
                </div>
                <div className="ud-contact-label">Email</div>
                <div className="ud-contact-value">ragneekumari.dev@gmail.com</div>
                <div className="ud-contact-actions-line">
                  <button className="ud-contact-icon" title="Copy email" onClick={() => navigator.clipboard.writeText('ragneekumari.dev@gmail.com')} aria-label="Copy email">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path d="M16 1H4a2 2 0 00-2 2v12h2V3h12V1zm3 4H8a2 2 0 00-2 2v14a2 2 0 002 2h11a2 2 0 002-2V7a2 2 0 00-2-2zm0 16H8V7h11v14z"/></svg>
                  </button>
                </div>
              </div>
              <div className="ud-contact-row">
                <div className="ud-contact-logo ud-logo-linkedin" aria-hidden="true">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="#ffffff" xmlns="http://www.w3.org/2000/svg"><path d="M4.98 3.5C4.98 4.88 3.86 6 2.5 6S0 4.88 0 3.5 1.12 1 2.5 1s2.48 1.12 2.48 2.5zM0 8h5v15H0V8zm7.5 0H12v2.1h.06c.63-1.2 2.17-2.46 4.47-2.46C21.4 7.64 24 10 24 14.3V23H19v-7.5c0-1.8-.03-4.12-2.51-4.12-2.51 0-2.9 1.96-2.9 4v7.62H7.5V8z"/></svg>
                </div>
                <div className="ud-contact-label">LinkedIn</div>
                <div className="ud-contact-value">linkedin.com/in/ragnee-kumari</div>
                <div className="ud-contact-actions-line">
                  <button className="ud-contact-icon" title="Copy LinkedIn URL" onClick={() => navigator.clipboard.writeText('https://www.linkedin.com/in/ragnee-kumari-12bb21223/')} aria-label="Copy LinkedIn URL">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path d="M16 1H4a2 2 0 00-2 2v12h2V3h12V1zm3 4H8a2 2 0 00-2 2v14a2 2 0 002 2h11a2 2 0 002-2V7a2 2 0 00-2-2zm0 16H8V7h11v14z"/></svg>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </footer>

      {/* Local styles */}
      <style>{`
        :root {
          --bg: #0f172a;
          --panel: rgba(255,255,255,0.08);
          --stroke: rgba(255,255,255,0.14);
          --text: #f1f5f9;
          --text-dim: #cbd5e1;
          --blue: #93c5fd; /* light sky */
          --violet: #f9a8d4; /* light pink */
          --red: #fca5a5; /* light red */
        }

        @keyframes shift { 0%{background-position:0% 50%} 50%{background-position:100% 50%} 100%{background-position:0% 50%} }
        @keyframes floatY { 0%{ transform:translateY(0) } 50%{ transform:translateY(-12px) } 100%{ transform:translateY(0) } }
        @keyframes shimmer { 0% { background-position: 100% 0; } 100% { background-position: -100% 0; } }
        @keyframes sk-pulse { 0% { opacity: .65; } 50% { opacity: .35; } 100% { opacity: .65; } }

        .ud-root { min-height: 100vh; background: radial-gradient(ellipse 70% 55% at 50% 50%, rgba(147,197,253,.22), transparent 50%),
                                           radial-gradient(ellipse 110% 60% at 20% 20%, rgba(249,168,212,.22), transparent 55%),
                                           radial-gradient(ellipse 120% 60% at 80% 80%, rgba(252,165,165,.20), transparent 60%),
                                           linear-gradient(135deg, #1a2540 0%, #131e33 100%);
                   background-size: 200% 200%; animation: shift 18s ease infinite; position: relative; overflow-x: hidden; color: var(--text); }
        .ud-bg-orb { position: absolute; filter: blur(55px); opacity: .6; mix-blend-mode: screen; pointer-events: none; }
        .ud-orb-1 { width: 360px; height: 360px; left: 6%; top: 6%; background: radial-gradient(circle, var(--blue), transparent 60%); animation: floatY 10s ease-in-out infinite; }
        .ud-orb-2 { width: 440px; height: 440px; right: 8%; bottom: 8%; background: radial-gradient(circle, var(--violet), transparent 60%); animation: floatY 12s ease-in-out infinite; }

        .ud-header { position: sticky; top: 0; z-index: 10; backdrop-filter: blur(12px);
                     background: linear-gradient(180deg, rgba(20,28,44,.50), rgba(20,28,44,.16)); border-bottom: 1px solid var(--stroke);
                     padding: 10px 20px; display: flex; flex-direction: column; align-items: center; }
        .ud-brand { display: inline-flex; align-items: center; gap: 8px; font-weight: 900; letter-spacing: .2px; font-size: 13px; color: var(--text); }
        .ud-dot { width: 10px; height: 10px; border-radius: 999px; background: linear-gradient(90deg, var(--blue), var(--violet)); box-shadow: 0 0 12px rgba(167,139,250,.6); }

        .ud-toolbar { margin-top: 8px; display: flex; gap: 6px; align-items: center; justify-content: center; flex-wrap: wrap; width: 100%; max-width: 1200px; }

        .ud-search { flex: 0 1 420px; display: flex; align-items: center; justify-content: center; gap: 8px; padding: 4px 12px; min-height: 34px; border-radius: 999px; max-width: 520px; margin-left: 0; margin-right: 6px;
                     border: 1px solid var(--stroke); background: linear-gradient(180deg, rgba(255,255,255,0.10), rgba(255,255,255,0.06)); color: var(--text); box-shadow: 0 6px 22px rgba(0,0,0,0.22); transition: box-shadow .2s ease, border-color .2s ease, background .2s ease; }
        .ud-search svg { color: #a5b4fc; width: 16px; height: 16px; flex-shrink: 0; }
        .ud-search:focus-within { border-color: #7dd3fc; box-shadow: 0 0 0 4px rgba(125, 211, 252, 0.15), 0 6px 22px rgba(0,0,0,0.22); background: linear-gradient(180deg, rgba(255,255,255,0.14), rgba(255,255,255,0.08)); }
        .ud-search input { flex: 1; border: none; outline: none; background: transparent; color: var(--text); font-weight: 600; letter-spacing: .2px; font-size: 14px; }

        .ud-chips { display: flex; align-items: center; gap: 6px; margin-left: 0; }
        .ud-chip { padding: 8px 12px; border-radius: 999px; border: 1px solid var(--stroke); color: var(--text); background: rgba(255,255,255,.06);
                   cursor: pointer; font-weight: 700; }
        .ud-chip-active { background: linear-gradient(90deg, rgba(147,197,253,.26), rgba(249,168,212,.22)); border-color: rgba(255,255,255,.22); }

        .ud-error { max-width: 1100px; margin: 14px auto 0; padding: 10px 12px; border-radius: 12px; background: rgba(239,68,68,.1);
                    border: 1px solid rgba(239,68,68,.25); color: #fecaca; }

        .ud-main { max-width: 1200px; margin: 0 auto; padding: 20px; }
        .ud-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 16px; }

        .ud-grid-item { border-radius: 14px; overflow: hidden; border: 1px solid var(--stroke); background: rgba(255,255,255,.06); box-shadow: 0 12px 45px rgba(0,0,0,.35); }
        .ud-card { transition: transform .2s ease, box-shadow .2s ease; }
        .ud-card:hover { transform: translateY(-2px); box-shadow: 0 16px 55px rgba(0,0,0,.45); }
        .ud-card-image-wrap { position: relative; aspect-ratio: 4/3; background: rgba(255,255,255,.04); }
        .ud-card-image-wrap img { width: 100%; height: 100%; object-fit: contain; display: block; transform: translateY(-12px); }
        .ud-card-badge { position: absolute; left: 10px; bottom: 10px; display: inline-flex; gap: 8px; align-items: center; padding: 6px 10px;
                          border: 1px solid rgba(255,255,255,.16); border-radius: 999px; backdrop-filter: blur(6px); }
        .ud-code { font-weight: 900; }
        .ud-cat { font-weight: 800; font-size: 12px; }
        .ud-card-meta { display: flex; align-items: center; justify-content: flex-end; gap: 8px; padding: 8px 10px; border-top: 1px solid var(--stroke); background: rgba(255,255,255,.04); }

        /* Skeleton */
        .ud-sk-card { opacity: .95; padding: 8px; display: flex; flex-direction: column; }
        .ud-sk-img { height: 224px; border-radius: 10px; background: #6b7280; animation: sk-pulse 1.2s ease-in-out infinite; }
        .ud-sk-body { margin-top: 12px; display: flex; flex-direction: column; gap: 8px; }
        .ud-sk-row { display: flex; justify-content: space-between; align-items: center; gap: 8px; }
        .ud-sk-title, .ud-sk-right, .ud-sk-sub, .ud-sk-line { background: #6b7280; animation: sk-pulse 1.2s ease-in-out infinite; }
        .ud-sk-title { width: 66%; height: 16px; border-radius: 6px; }
        .ud-sk-right { width: 20%; height: 16px; border-radius: 6px; }
        .ud-sk-sub { width: 44%; height: 12px; border-radius: 6px; }
        .ud-sk-line { width: 100%; height: 10px; border-radius: 6px; }
        .ud-sk-hide { visibility: hidden; }

        /* Empty */
        .ud-empty { max-width: 640px; margin: 24px auto; padding: 24px; text-align: center; border-radius: 16px; border: 1px solid var(--stroke);
                    background: rgba(255,255,255,.06); }
        .ud-empty-icon { font-size: 26px; margin-bottom: 8px; }
        .ud-empty-title { font-weight: 900; margin-bottom: 6px; }
        .ud-empty-text { color: var(--text-dim); }

        /* Hero */
        .ud-hero { width: 100%; margin: 6px 0 0; padding: 28px 0 14px; position: relative; overflow: hidden; }
        .ud-hero::before { content: ''; position: absolute; inset: 0; background: radial-gradient(1200px 200px at 50% -20px, rgba(147,197,253,.26), transparent 60%), radial-gradient(1000px 180px at 60% -40px, rgba(249,168,212,.22), transparent 60%), radial-gradient(900px 160px at 40% -30px, rgba(252,165,165,.20), transparent 65%); pointer-events: none; }
        .ud-hero-inner { max-width: 1200px; margin: 0 auto; padding: 0 20px; display: flex; flex-direction: column; align-items: center; text-align: center; }
        .ud-hero-title { font-size: 28px; font-weight: 900; margin: 0 0 6px; letter-spacing: .4px; background: linear-gradient(90deg,#e2e8f0,#93c5fd,#f9a8d4); -webkit-background-clip: text; background-clip: text; color: transparent; }
        .ud-hero-sub { color: var(--text-dim); margin: 0 0 14px; max-width: 760px; }
        .ud-legend { display: flex; gap: 10px; flex-wrap: wrap; justify-content: center; margin-bottom: 12px; }
        .ud-legend-item { position: relative; padding: 8px 12px 8px 26px; border-radius: 999px; border: 1px solid rgba(255,255,255,.18); background: rgba(255,255,255,.05); font-weight: 800; font-size: 12px; backdrop-filter: blur(6px); box-shadow: 0 4px 18px rgba(0,0,0,.25) inset, 0 2px 8px rgba(0,0,0,.25); }
        .ud-legend-item::before { content: ''; position: absolute; left: 10px; top: 50%; transform: translateY(-50%); width: 10px; height: 10px; border-radius: 999px; background: var(--c, #94a3b8); box-shadow: 0 0 10px var(--c, #94a3b8); }
        .ud-stats { display: flex; gap: 16px; color: var(--text-dim); font-weight: 700; font-size: 12px; opacity: .9; }

        /* Buttons */
        .ud-btn { appearance: none; border: 1px solid var(--stroke); background: rgba(255,255,255,.04); color: var(--text); padding: 6px 10px; border-radius: 8px; cursor: pointer; font-weight: 600; font-size: 12px; line-height: 1; display: inline-flex; align-items: center; gap: 6px; text-decoration: none; transition: background .2s ease, box-shadow .2s ease, border-color .2s ease, transform .06s ease; }
        .ud-btn:hover { background: rgba(255,255,255,.08); border-color: rgba(255,255,255,.24); }
        .ud-btn:active { transform: translateY(1px); }
        .ud-btn:focus-visible { outline: none; box-shadow: 0 0 0 3px rgba(125,211,252,.25); }
        .ud-btn-primary { background: linear-gradient(180deg, rgba(147,197,253,.32), rgba(249,168,212,.22)); border-color: rgba(255,255,255,.28); }
        .ud-btn-primary:hover { background: linear-gradient(180deg, rgba(147,197,253,.38), rgba(249,168,212,.28)); }
        .ud-btn-ghost { background: rgba(255,255,255,.04); }
        .ud-btn-ico { width: 14px; height: 14px; display: inline-flex; align-items: center; justify-content: center; opacity: .9; }
        .ud-link { text-decoration: none; }

        .ud-meta-actions { display: flex; align-items: center; gap: 8px; }
        .ud-meta-left { color: var(--text-dim); }

        /* Footer */
        .ud-footer { border-top: 1px solid var(--stroke); background: linear-gradient(180deg, rgba(255,255,255,.05), rgba(255,255,255,.03)); }
        .ud-footer-inner { max-width: 1200px; margin: 0 auto; padding: 18px 10px 18px 20px; display: grid; grid-template-columns: 1fr auto; align-items: center; gap: 16px; color: var(--text-dim); }
        .ud-footer-left { display: flex; flex-direction: column; gap: 6px; }
        .ud-footer-right { display: flex; flex-direction: column; align-items: flex-end; justify-self: end; margin-right: -10px; }
        .ud-footer-copy { display: flex; gap: 18px; flex-wrap: wrap; align-items: center; }
        .ud-footer-inner a { color: var(--text); text-decoration: none; }
        .ud-sep { opacity: .45; }

        /* Contact card */
        .ud-contact-card { min-width: 300px; max-width: 380px; border: 1px solid rgba(255,255,255,.18); border-radius: 14px; background: linear-gradient(180deg, rgba(147,197,253,.12), rgba(249,168,212,.10)); padding: 14px; box-shadow: 0 14px 40px rgba(0,0,0,.32), 0 0 0 4px rgba(147,197,253,.06) inset; backdrop-filter: blur(6px); }
        .ud-contact-header { font-weight: 900; letter-spacing: .3px; color: var(--text); margin-bottom: 10px; font-size: 13px; text-align: center; }
        .ud-contact-row { display: grid; grid-template-columns: auto auto 1fr auto; align-items: center; gap: 12px; padding: 10px 0; border-top: 1px dashed rgba(255,255,255,.12); }
        .ud-contact-row:first-of-type { border-top: none; }
        .ud-contact-label { font-weight: 800; font-size: 12px; color: var(--text); opacity: .95; }
        .ud-contact-value { font-weight: 600; color: var(--text-dim); font-size: 12px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
        .ud-contact-actions-line { display: inline-flex; align-items: center; gap: 6px; }
        .ud-contact-icon { appearance: none; border: 1px solid var(--stroke); background: rgba(255,255,255,.05); color: var(--text); width: 28px; height: 28px; border-radius: 8px; display: inline-flex; align-items: center; justify-content: center; cursor: pointer; text-decoration: none; transition: transform .12s ease, box-shadow .2s ease, border-color .2s ease, background .2s ease; box-shadow: 0 6px 20px rgba(0,0,0,.25); }
        .ud-contact-icon:hover { transform: translateY(-1px); border-color: rgba(255,255,255,.28); background: rgba(255,255,255,.08); }
        .ud-contact-icon:active { transform: translateY(0); }
        .ud-contact-icon svg { opacity: .95; }
        .ud-contact-logo { width: 28px; height: 28px; border-radius: 999px; display: inline-flex; align-items: center; justify-content: center; box-shadow: 0 6px 20px rgba(0,0,0,.25); flex-shrink: 0; }
        .ud-logo-email { background: linear-gradient(135deg, #38bdf8, #60a5fa); }
        .ud-logo-linkedin { background: #0A66C2; }
        .ud-contact-logo svg { display: block; }

        @media (max-width: 640px) {
          .ud-footer-inner { grid-template-columns: 1fr; }
          .ud-footer-right { align-items: stretch; margin-right: 0; }
          .ud-contact-header { text-align: left; }
        }

        /* Grid empty full-span */
        .ud-grid > .ud-empty { grid-column: 1 / -1; }
      `}</style>
    </div>
  );
};

export default UserDashboard;
