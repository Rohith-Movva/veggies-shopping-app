import React, { useState, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { FaHome, FaEye, FaEyeSlash, FaArrowRight } from 'react-icons/fa'; 
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import API from '../api';
import loginBg from '../assets/farm-bg.png';

const LoginPage = ({ setUser }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const formRef = useRef();

  // --- HEAVY UI ENTRANCE ---
  useGSAP(() => {
    // Reveal the left side background
    gsap.from(".login-visual", {
      xPercent: -100,
      duration: 1.5,
      ease: "power4.inOut"
    });

    // Staggered reveal for form elements
    gsap.from(".login-anim", {
      y: 30,
      opacity: 0,
      stagger: 0.1,
      duration: 1,
      delay: 0.8,
      ease: "power4.out"
    });
  }, { scope: formRef });

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const { data } = await API.post('/auth/login', { email, password });
      localStorage.setItem('token', data.token);
      localStorage.setItem('userInfo', JSON.stringify(data.user)); 
      setUser(data.user);
      navigate('/shop');
    } catch (err) {
      setError('INVALID EMAIL OR PASSWORD');
      gsap.fromTo(".error-msg", { x: -10 }, { x: 10, repeat: 5, yoyo: true, duration: 0.05 });
    }
  };

  return (
    <div ref={formRef} style={styles.pageWrapper}>
      <style>{`
        .login-input:focus { border-color: #27ae60 !important; transform: scale(1.02); }
        .login-btn-heavy:hover { background: #1e8449 !important; transform: translateY(-3px); }
        .mask { overflow: hidden; }
      `}</style>

      {/* LEFT SIDE: Visual Impact */}
      <div className="login-visual" style={styles.visualSide}>
        <div style={styles.visualOverlay} />
        <div style={styles.visualContent}>
          <h1 style={styles.visualTitle}>PURE<br/>NUTRITION</h1>
          <p style={styles.visualSub}>FROM FARM TO SOUL</p>
        </div>
      </div>

      {/* RIGHT SIDE: Heavy Form */}
      <div style={styles.formSide}>
        <Link to="/" style={styles.homeLink} className="login-anim">
          <FaHome /> BACK TO HOME
        </Link>

        <div style={styles.formContainer}>
          <div className="mask">
            <h2 className="login-anim" style={styles.formTitle}>WELCOME BACK</h2>
          </div>
          <p className="login-anim" style={styles.formSub}>Enter your details to continue your harvest journey.</p>

          {error && <p className="error-msg" style={styles.errorText}>{error}</p>}

          <form onSubmit={handleLogin} style={styles.form}>
            <div className="login-anim" style={styles.inputGroup}>
              <label style={styles.label}>EMAIL ADDRESS</label>
              <input 
                type="email" 
                className="login-input"
                style={styles.input} 
                value={email} 
                onChange={(e) => setEmail(e.target.value)} 
                required 
              />
            </div>

            <div className="login-anim" style={styles.inputGroup}>
              <label style={styles.label}>PASSWORD</label>
              <div style={styles.passwordWrapper}>
                <input 
                  type={showPassword ? "text" : "password"} 
                  className="login-input"
                  style={styles.input} 
                  value={password} 
                  onChange={(e) => setPassword(e.target.value)} 
                  required 
                />
                <span onClick={() => setShowPassword(!showPassword)} style={styles.eyeIcon}>
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </span>
              </div>
            </div>

            <button type="submit" className="login-btn-heavy" style={styles.button}>
              SIGN IN <FaArrowRight style={{ marginLeft: '10px' }} />
            </button>
          </form>

          <p className="login-anim" style={styles.footerText}>
            DON'T HAVE AN ACCOUNT? <Link to="/signup" style={styles.signupLink}>SIGN UP</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

const styles = {
  pageWrapper: { display: 'flex', minHeight: '100vh', background: '#fff', overflow: 'hidden' },
  
  // Visual Side
  visualSide: { 
    flex: 1.2, position: 'relative', 
    backgroundImage: `url(${loginBg})`,
    backgroundSize: 'cover', backgroundPosition: 'center', display: 'flex', alignItems: 'flex-end', padding: '80px'
  },
  visualOverlay: { position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.8), transparent)' },
  visualContent: { position: 'relative', zIndex: 2, color: '#fff' },
  visualTitle: { fontSize: '5rem', fontWeight: '900', lineHeight: 0.9, margin: 0 },
  visualSub: { letterSpacing: '8px', fontSize: '0.9rem', marginTop: '20px', color: '#27ae60', fontWeight: 'bold' },

  // Form Side
  formSide: { flex: 1, padding: '60px', display: 'flex', flexDirection: 'column', justifyContent: 'center', position: 'relative' },
  homeLink: { position: 'absolute', top: '40px', left: '60px', textDecoration: 'none', color: '#888', fontSize: '0.7rem', fontWeight: 'bold', letterSpacing: '2px', display: 'flex', alignItems: 'center', gap: '8px' },
  formContainer: { maxWidth: '450px', margin: '0 auto', width: '100%' },
  formTitle: { fontSize: '2.5rem', fontWeight: '900', color: '#000', margin: 0 },
  formSub: { color: '#666', fontSize: '0.9rem', marginBottom: '40px' },
  errorText: { color: '#e74c3c', fontSize: '0.7rem', fontWeight: 'bold', letterSpacing: '1px', marginBottom: '20px' },

  form: { display: 'flex', flexDirection: 'column', gap: '25px' },
  inputGroup: { display: 'flex', flexDirection: 'column', gap: '8px' },
  label: { fontSize: '0.65rem', fontWeight: '900', color: '#aaa', letterSpacing: '1px' },
  input: { padding: '15px 0', border: 'none', borderBottom: '2px solid #eee', fontSize: '1rem', outline: 'none', transition: '0.3s', background: 'transparent' },
  passwordWrapper: { position: 'relative', width: '100%' },
  eyeIcon: { position: 'absolute', right: '0', top: '50%', transform: 'translateY(-50%)', cursor: 'pointer', color: '#aaa' },

  button: { 
    marginTop: '20px', padding: '20px', background: '#000', color: '#fff', border: 'none', 
    borderRadius: '50px', fontSize: '0.8rem', fontWeight: 'bold', letterSpacing: '2px', 
    cursor: 'pointer', display: 'flex', justifyContent: 'center', alignItems: 'center', transition: '0.3s' 
  },
  footerText: { textAlign: 'center', marginTop: '30px', fontSize: '0.75rem', color: '#888', letterSpacing: '1px' },
  signupLink: { color: '#27ae60', textDecoration: 'none', fontWeight: '900' }
};

export default LoginPage;