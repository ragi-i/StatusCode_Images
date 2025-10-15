import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';

const Login = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const validate = () => {
    if (!formData.email || !formData.password) {
      return 'Please fill in both email and password.';
    }
    const emailRegex = /[^\s@]+@[^\s@]+\.[^\s@]+/;
    if (!emailRegex.test(formData.email)) {
      return 'Please enter a valid email address.';
    }
    return '';
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    const validationMsg = validate();
    if (validationMsg) {
      setError(validationMsg);
      return;
    }

    try {
      setLoading(true);
      const response = await axios.post(
        'https://statuscode-image.onrender.com/login',
        formData,
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      if (response.status === 200) {
        const { fullname, email, userId } = response.data.existingUser;
        const userProfile = { fullname, email, userId };
        localStorage.setItem('profile', JSON.stringify(userProfile));
        navigate('/searchresponsecode');
      } else {
        setError('Invalid credentials');
      }
    } catch (err) {
      setError('Error logging in. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div style={styles.background}>
      {/* Local component styles for animations and utility classes */}
      <style>{`
        :root {
          --card-bg: rgba(10, 15, 25, 0.55);
          --card-stroke: rgba(255, 255, 255, 0.12);
          --input-bg: rgba(255, 255, 255, 0.06);
          --input-stroke: rgba(255, 255, 255, 0.14);
          --text-high: #e5e7eb;
          --text-mid: #cbd5e1;
          --text-dim: #94a3b8;
          --accent-1: #22d3ee;
          --accent-2: #a78bfa;
          --accent-3: #f472b6;
          --success: #22c55e;
          --danger: #ef4444;
        }

        @keyframes gradientShift {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        @keyframes floatY {
          0% { transform: translateY(0px); }
          50% { transform: translateY(-12px); }
          100% { transform: translateY(0px); }
        }
        @keyframes pulseGlow {
          0% { box-shadow: 0 0 0 0 rgba(167, 139, 250, 0.35); }
          70% { box-shadow: 0 0 0 12px rgba(167, 139, 250, 0); }
          100% { box-shadow: 0 0 0 0 rgba(167, 139, 250, 0); }
        }
        @keyframes dots {
          0%, 20% { content: '.'; }
          40% { content: '..'; }
          60%, 100% { content: '...'; }
        }
        .btn:hover { transform: translateY(-1px) scale(1.01); }
        .btn:active { transform: translateY(0) scale(0.99); }
        .errorBox { border: 1px solid rgba(239, 68, 68, 0.35); background: rgba(239, 68, 68, 0.1); }
        .orb {
          position: absolute;
          filter: blur(55px);
          opacity: 0.65;
          mix-blend-mode: screen;
          pointer-events: none;
        }
        .orb.one { background: radial-gradient(circle, #22d3ee, transparent 60%); width: 340px; height: 340px; top: 8%; left: 8%; animation: floatY 9s ease-in-out infinite; }
        .orb.two { background: radial-gradient(circle, #a78bfa, transparent 60%); width: 420px; height: 420px; bottom: 6%; right: 10%; animation: floatY 11s ease-in-out infinite; }
        .accentUnderline {
          background: linear-gradient(90deg, var(--accent-1), var(--accent-2), var(--accent-3));
          height: 3px; width: 72px; border-radius: 999px; margin: 10px auto 0;
          animation: gradientShift 12s ease infinite; background-size: 200% 200%;
        }
        .inputWrap:focus-within { borderColor: #7dd3fc; box-shadow: 0 0 0 4px rgba(34, 211, 238, 0.15); }
        .inputEl::placeholder { color: var(--text-dim); }
        .tag {
          display: inline-flex; align-items: center; gap: 6px; font-weight: 600; letter-spacing: .3px; color: var(--text-high);
          background: linear-gradient(90deg, rgba(34,211,238,.12), rgba(167,139,250,.12));
          border: 1px solid rgba(255,255,255,.15);
          padding: 6px 10px; border-radius: 999px;
        }
      `}</style>

      {/* Decorative orbs */}
      <div className="orb one" />
      <div className="orb two" />

      <div style={styles.container}>
        {/* Promo / Intro Panel */}
        <div style={styles.leftPanel}>
          <div style={styles.heroBadge}>
            <span style={styles.pillDot} />
            Visual learning
          </div>
          <h1 style={styles.heroTitle}>Visualize HTTP Codes</h1>
          <p style={styles.heroDesc}>
            From 2xx success to 5xx errors, grasp semantics at a glance through clean visuals.
          </p>

          <div style={styles.showcaseGrid}>
            <div style={{ ...styles.codeCard, background: 'linear-gradient(135deg, rgba(34,197,94,0.15), rgba(34,211,238,0.12))', borderColor: 'rgba(34,197,94,0.35)' }}>
              <div style={styles.codeBadgeRow}>
                <span style={{ ...styles.codeBadge, background: 'rgba(34,197,94,0.18)', color: '#86efac', borderColor: 'rgba(34,197,94,0.35)' }}>2xx</span>
                <span style={styles.codeDelta}>+99.9% uptime</span>
              </div>
              <div style={styles.codeBig}>200</div>
              <div style={styles.codeLabel}>OK</div>
            </div>

            <div style={{ ...styles.codeCard, background: 'linear-gradient(135deg, rgba(244,63,94,0.12), rgba(168,85,247,0.10))', borderColor: 'rgba(244,63,94,0.35)' }}>
              <div style={styles.codeBadgeRow}>
                <span style={{ ...styles.codeBadge, background: 'rgba(244,63,94,0.18)', color: '#fda4af', borderColor: 'rgba(244,63,94,0.35)' }}>4xx</span>
                <span style={styles.codeDelta}>Client issue</span>
              </div>
              <div style={styles.codeBig}>404</div>
              <div style={styles.codeLabel}>Not Found</div>
            </div>

            <div style={{ ...styles.codeCard, background: 'linear-gradient(135deg, rgba(250,204,21,0.12), rgba(56,189,248,0.10))', borderColor: 'rgba(250,204,21,0.35)' }}>
              <div style={styles.codeBadgeRow}>
                <span style={{ ...styles.codeBadge, background: 'rgba(250,204,21,0.20)', color: '#fde68a', borderColor: 'rgba(250,204,21,0.35)' }}>3xx</span>
                <span style={styles.codeDelta}>Redirection</span>
              </div>
              <div style={styles.codeBig}>301</div>
              <div style={styles.codeLabel}>Moved Permanently</div>
            </div>

            <div style={{ ...styles.codeCard, background: 'linear-gradient(135deg, rgba(59,130,246,0.12), rgba(244,114,182,0.12))', borderColor: 'rgba(168,85,247,0.35)' }}>
              <div style={styles.codeBadgeRow}>
                <span style={{ ...styles.codeBadge, background: 'rgba(168,85,247,0.18)', color: '#c4b5fd', borderColor: 'rgba(168,85,247,0.35)' }}>5xx</span>
                <span style={styles.codeDelta}>Server issue</span>
              </div>
              <div style={styles.codeBig}>500</div>
              <div style={styles.codeLabel}>Server Error</div>
            </div>
          </div>

          <div style={styles.statsRow}>
            <div style={styles.statItem}>
              <div style={styles.statValue}>70+</div>
              <div style={styles.statLabel}>Codes Covered</div>
            </div>
            <div style={styles.statItem}>
              <div style={styles.statValue}>Instant</div>
              <div style={styles.statLabel}>Search</div>
            </div>
            <div style={styles.statItem}>
              <div style={styles.statValue}>Save</div>
              <div style={styles.statLabel}>Favorites</div>
            </div>
          </div>
        </div>

        {/* Auth Card */}
        <div style={styles.loginCard} className="login-card">
          <div style={styles.cardHeader}>
            <div style={styles.logoWrap}>
              <img src="/assets/images/http.webp" alt="HTTP Logo" style={styles.logo} />
            </div>
            <div>
              <h2 style={styles.title}>Welcome back</h2>
              <div className="accentUnderline" />
              <p style={styles.subtitle}>Sign in to continue</p>
            </div>
          </div>

          {error && (
            <div className="errorBox" style={styles.errorBox} role="alert">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ marginRight: 8 }}>
                <path d="M12 9v4m0 4h.01M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" stroke="#ef4444" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <span style={{ color: '#fecaca' }}>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} style={styles.form}>
            {/* Email */}
            <label style={styles.label} htmlFor="email">Email</label>
            <div style={styles.inputWrap} className="inputWrap">
              <div style={styles.inputIcon}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M4 4h16a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2z" stroke="currentColor" strokeWidth="2"/>
                  <path d="M22 6l-10 7L2 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <input
                id="email"
                className="inputEl"
                type="email"
                name="email"
                placeholder="you@example.com"
                value={formData.email}
                onChange={handleChange}
                style={styles.input}
                autoComplete="email"
              />
            </div>

            {/* Password */}
            <label style={styles.label} htmlFor="password">Password</label>
            <div style={styles.inputWrap} className="inputWrap">
              <div style={styles.inputIcon}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <rect x="3" y="11" width="18" height="10" rx="2" stroke="currentColor" strokeWidth="2"/>
                  <path d="M7 11V7a5 5 0 0 1 10 0v4" stroke="currentColor" strokeWidth="2"/>
                </svg>
              </div>
              <input
                id="password"
                className="inputEl"
                type={showPassword ? 'text' : 'password'}
                name="password"
                placeholder="Enter your password"
                value={formData.password}
                onChange={handleChange}
                style={{ ...styles.input, paddingRight: 44 }}
                autoComplete="current-password"
              />
              <button
                type="button"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
                onClick={() => setShowPassword((v) => !v)}
                style={styles.eyeButton}
                className="btn"
              >
                {showPassword ? (
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M17.94 17.94A10.94 10.94 0 0 1 12 20C7 20 2.73 16.11 1 12c.74-1.72 1.83-3.27 3.17-4.53M9.9 4.24A10.93 10.93 0 0 1 12 4c5 0 9.27 3.89 11 8-1.07 2.49-2.93 4.59-5.06 6.06M9.9 4.24L4.22 9.92M14.1 19.76l5.68-5.68" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M14.12 14.12A3 3 0 0 1 9.88 9.88" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                ) : (
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8S1 12 1 12z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="2"/>
                  </svg>
                )}
              </button>
            </div>

            {/* Actions */}
            <div style={styles.actionsRow}>
              <label style={styles.checkboxLabel}>
                <input type="checkbox" style={styles.checkbox} />
                <span>Remember me</span>
              </label>
              <a href="#" style={styles.forgotLink}>Forgot password?</a>
            </div>

            <button type="submit" className="btn" disabled={loading} style={{ ...styles.button, opacity: loading ? 0.85 : 1 }}>
              {loading ? (
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: 10 }}>
                  <span>Signing in</span>
                  <span style={{ display: 'inline-block', width: 16, textAlign: 'left' }}>...</span>
                </span>
              ) : (
                'Sign in'
              )}
            </button>
          </form>

          <div style={styles.link}> 
            <span style={{ color: 'var(--text-mid)' }}>New here? </span>
            <Link to="/userregister" style={styles.registerLink}>Create an account</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

const styles = {
  background: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '100vh',
    padding: '40px 20px',
    background: `radial-gradient(ellipse 70% 55% at 50% 50%, rgba(34, 211, 238, 0.08), transparent 50%),
                 radial-gradient(ellipse 110% 60% at 20% 20%, rgba(167, 139, 250, 0.10), transparent 55%),
                 radial-gradient(ellipse 120% 60% at 80% 80%, rgba(244, 114, 182, 0.10), transparent 60%),
                 linear-gradient(135deg, #0b1220 0%, #050a13 100%)`,
    backgroundSize: '200% 200%',
    animation: 'gradientShift 18s ease infinite',
    position: 'relative',
    overflow: 'hidden',
  },
  container: {
    width: '100%',
    maxWidth: 1100,
    display: 'flex',
    gap: 28,
    alignItems: 'stretch',
    justifyContent: 'center',
    flexWrap: 'wrap',
  },
  leftPanel: {
    flex: '1 1 460px',
    minWidth: 320,
    color: 'var(--text-high)',
    padding: 32,
    borderRadius: 20,
    background: 'linear-gradient(180deg, rgba(255,255,255,0.06), rgba(255,255,255,0.02))',
    border: '1px solid var(--card-stroke)',
    backdropFilter: 'blur(14px)',
    display: 'flex',
    flexDirection: 'column',
    gap: 16,
    boxShadow: '0 12px 45px rgba(0,0,0,0.35)',
  },
  brandBadge: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: 8,
    marginBottom: 16,
    fontSize: 13,
  },
  headline: {
    fontSize: 34,
    lineHeight: 1.2,
    margin: '8px 0 10px',
    fontWeight: 800,
    background: 'linear-gradient(90deg, #e2e8f0, #a5b4fc, #f0abfc)',
    WebkitBackgroundClip: 'text',
    backgroundClip: 'text',
    color: 'transparent',
  },
  subtext: {
    color: 'var(--text-mid)',
    fontSize: 16,
    lineHeight: 1.6,
    marginBottom: 18,
  },
  featuresRow: {
    display: 'flex',
    gap: 10,
    flexWrap: 'wrap',
    marginTop: 10,
  },
  loginCard: {
    flex: '1 1 380px',
    minWidth: 320,
    maxWidth: 480,
    color: 'var(--text-high)',
    padding: 28,
    borderRadius: 18,
    background: 'var(--card-bg)',
    border: '1px solid var(--card-stroke)',
    boxShadow: '0 12px 45px rgba(0, 0, 0, 0.45)',
    backdropFilter: 'blur(14px)',
  },
  cardHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: 14,
    marginBottom: 18,
  },
  logoWrap: {
    width: 48,
    height: 48,
    borderRadius: 12,
    overflow: 'hidden',
    display: 'grid',
    placeItems: 'center',
    background: 'linear-gradient(135deg, rgba(34,211,238,.15), rgba(167,139,250,.15))',
    border: '1px solid rgba(255,255,255,.15)',
    animation: 'pulseGlow 3s ease-in-out infinite',
  },
  logo: {
    width: 32,
    height: 32,
    objectFit: 'contain',
  },
  title: {
    fontSize: 26,
    margin: 0,
    fontWeight: 800,
    letterSpacing: 0.3,
    color: 'var(--text-high)',
  },
  subtitle: {
    marginTop: 10,
    marginBottom: 0,
    color: 'var(--text-dim)',
    fontSize: 14,
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: 12,
    marginTop: 8,
  },
  label: {
    marginTop: 8,
    fontSize: 14,
    color: 'var(--text-mid)',
    fontWeight: 600,
    letterSpacing: 0.2,
  },
  inputWrap: {
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
    background: 'var(--input-bg)',
    border: '1px solid var(--input-stroke)',
    borderRadius: 12,
  },
  inputIcon: {
    display: 'grid',
    placeItems: 'center',
    width: 42,
    color: '#a5b4fc',
  },
  input: {
    flex: 1,
    padding: '12px 12px 12px 6px',
    border: 'none',
    outline: 'none',
    background: 'transparent',
    color: 'var(--text-high)',
    fontSize: 16,
    fontWeight: 600,
  },
  eyeButton: {
    position: 'absolute',
    right: 8,
    top: '50%',
    transform: 'translateY(-50%)',
    height: 34,
    width: 34,
    display: 'grid',
    placeItems: 'center',
    borderRadius: 10,
    border: '1px solid rgba(255,255,255,.12)',
    background: 'linear-gradient(135deg, rgba(34,211,238,.12), rgba(167,139,250,.12))',
    color: 'var(--text-mid)',
    cursor: 'pointer',
  },
  actionsRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 4,
    marginBottom: 6,
  },
  checkboxLabel: {
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    color: 'var(--text-mid)',
    fontSize: 14,
    userSelect: 'none',
  },
  checkbox: {
    width: 16,
    height: 16,
    accentColor: '#60a5fa',
  },
  forgotLink: {
    color: '#93c5fd',
    textDecoration: 'none',
    fontSize: 14,
  },
  button: {
    marginTop: 10,
    padding: '12px 18px',
    borderRadius: 12,
    border: '1px solid rgba(255,255,255,.15)',
    background: 'linear-gradient(90deg, rgba(34,211,238,.75), rgba(167,139,250,.85), rgba(244,114,182,.75))',
    backgroundSize: '200% 200%',
    animation: 'gradientShift 14s ease infinite',
    color: '#0b1220',
    fontWeight: 800,
    fontSize: 16,
    letterSpacing: 0.4,
    cursor: 'pointer',
  },
  errorBox: {
    display: 'flex',
    alignItems: 'center',
    gap: 6,
    padding: '10px 12px',
    borderRadius: 12,
    marginBottom: 10,
  },
  link: {
    marginTop: 14,
    textAlign: 'center',
  },
  registerLink: {
    color: '#93c5fd',
    textDecoration: 'none',
    fontWeight: 700,
  },

  heroBadge: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: 8,
    padding: '6px 10px',
    borderRadius: 999,
    border: '1px solid rgba(255,255,255,.15)',
    background: 'linear-gradient(90deg, rgba(34,211,238,.12), rgba(167,139,250,.12))',
    color: 'var(--text-high)',
    fontWeight: 700,
    width: 'fit-content',
  },
  pillDot: {
    display: 'inline-block',
    width: 8,
    height: 8,
    borderRadius: 999,
    background: 'linear-gradient(90deg, #22d3ee, #a78bfa)',
    boxShadow: '0 0 12px rgba(167,139,250,.6)',
  },
  heroTitle: {
    fontSize: 36,
    lineHeight: 1.15,
    margin: '4px 0 2px',
    fontWeight: 900,
    background: 'linear-gradient(90deg, #e2e8f0, #a5b4fc, #f0abfc)',
    WebkitBackgroundClip: 'text',
    backgroundClip: 'text',
    color: 'transparent',
    letterSpacing: 0.3,
  },
  heroDesc: {
    color: 'var(--text-mid)',
    fontSize: 15,
    lineHeight: 1.6,
    marginBottom: 8,
  },
  showcaseGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(2, minmax(140px, 1fr))',
    gap: 12,
  },
  codeCard: {
    position: 'relative',
    borderRadius: 16,
    padding: '14px 14px 16px',
    border: '1px solid rgba(255,255,255,.12)',
    boxShadow: 'inset 0 1px 0 rgba(255,255,255,.08)',
    overflow: 'hidden',
  },
  codeBadgeRow: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  codeBadge: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: 6,
    padding: '4px 8px',
    borderRadius: 999,
    border: '1px solid rgba(255,255,255,.16)',
    fontSize: 12,
    fontWeight: 800,
  },
  codeDelta: {
    color: 'var(--text-dim)',
    fontSize: 12,
    fontWeight: 700,
  },
  codeBig: {
    fontSize: 40,
    lineHeight: 1,
    fontWeight: 900,
    letterSpacing: 0.5,
    marginTop: 4,
    background: 'linear-gradient(90deg, #e2e8f0, #a5b4fc)',
    WebkitBackgroundClip: 'text',
    backgroundClip: 'text',
    color: 'transparent',
  },
  codeLabel: {
    color: 'var(--text-mid)',
    fontWeight: 700,
    fontSize: 12,
  },
  statsRow: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, minmax(0,1fr))',
    gap: 8,
    marginTop: 8,
  },
  statItem: {
    background: 'rgba(255,255,255,0.04)',
    border: '1px solid rgba(255,255,255,.12)',
    borderRadius: 12,
    padding: '10px 12px',
    textAlign: 'center',
  },
  statLabel: {
    color: 'var(--text-dim)',
    fontSize: 11,
    marginTop: 2,
  },
  statValue: {
    fontSize: 16,
    fontWeight: 800,
    background: 'linear-gradient(90deg, #a5b4fc, #22d3ee)',
    WebkitBackgroundClip: 'text',
    backgroundClip: 'text',
    color: 'transparent',
  },
};

export default Login;
