import React, { useState, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { FaHome, FaArrowRight, FaUserPlus } from 'react-icons/fa'; 
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import API from '../api';
import signupBg from '../assets/farm-bg.png';

const SignupPage = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const signupRef = useRef();

  // --- HEAVY UI ENTRANCE ---
  useGSAP(() => {
    // Slide in the visual side from the right this time for a different feel
    gsap.from(".signup-visual", {
      xPercent: 100,
      duration: 1.5,
      ease: "power4.inOut"
    });

    // Staggered reveal for form elements
    gsap.from(".signup-anim", {
      y: 30,
      opacity: 0,
      stagger: 0.1,
      duration: 1,
      delay: 0.8,
      ease: "power4.out"
    });
  }, { scope: signupRef });

  const handleSignup = async (e) => {
    e.preventDefault();
    try {
      await API.post('/auth/signup', { name, email, password });
      navigate('/login');
    } catch (err) {
      setError('SIGNUP FAILED. PLEASE TRY AGAIN.');
      gsap.fromTo(".error-msg", { x: -10 }, { x: 10, repeat: 5, yoyo: true, duration: 0.05 });
    }
  };

  return (
    <div ref={signupRef} style={styles.pageWrapper}>
      <style>{`
        .signup-input:focus { border-color: #e67e22 !important; transform: scale(1.01); }
        .signup-btn-heavy:hover { background: #d35400 !important; transform: translateY(-3px); }
        .mask { overflow: hidden; }
      `}</style>

      {/* LEFT SIDE: Form Side */}
      <div style={styles.formSide}>
        <Link to="/" style={styles.homeLink} className="signup-anim">
          <FaHome /> BACK TO HOME
        </Link>

        <div style={styles.formContainer}>
          <div className="mask">
            <h2 className="signup-anim" style={styles.formTitle}>START YOUR HARVEST</h2>
          </div>
          <p className="signup-anim" style={styles.formSub}>Join our community of organic seekers and farm-fresh lovers.</p>

          {error && <p className="error-msg" style={styles.errorText}>{error}</p>}

          <form onSubmit={handleSignup} style={styles.form}>
            <div className="signup-anim" style={styles.inputGroup}>
              <label style={styles.label}>FULL NAME</label>
              <input 
                type="text" 
                className="signup-input"
                style={styles.input} 
                value={name} 
                onChange={(e) => setName(e.target.value)} 
                required 
              />
            </div>

            <div className="signup-anim" style={styles.inputGroup}>
              <label style={styles.label}>EMAIL ADDRESS</label>
              <input 
                type="email" 
                className="signup-input"
                style={styles.input} 
                value={email} 
                onChange={(e) => setEmail(e.target.value)} 
                required 
              />
            </div>

            <div className="signup-anim" style={styles.inputGroup}>
              <label style={styles.label}>PASSWORD</label>
              <input 
                type="password" 
                className="signup-input"
                style={styles.input} 
                value={password} 
                onChange={(e) => setPassword(e.target.value)} 
                required 
              />
            </div>

            <button type="submit" className="signup-btn-heavy" style={styles.button}>
              CREATE ACCOUNT <FaArrowRight style={{ marginLeft: '10px' }} />
            </button>
          </form>

          <p className="signup-anim" style={styles.footerText}>
            ALREADY A MEMBER? <Link to="/login" style={styles.loginLink}>LOG IN</Link>
          </p>
        </div>
      </div>

      {/* RIGHT SIDE: Visual Impact */}
      <div className="signup-visual" style={styles.visualSide}>
        <div style={styles.visualOverlay} />
        <div style={styles.visualContent}>
          <div style={styles.iconCircle}><FaUserPlus /></div>
          <h1 style={styles.visualTitle}>JOIN THE<br/>REVOLUTION</h1>
          <p style={styles.visualSub}>100% PURE. 100% HONEST.</p>
        </div>
      </div>
    </div>
  );
};

const styles = {
  pageWrapper: { display: 'flex', minHeight: '100vh', background: '#fff', overflow: 'hidden' },
  
  // Form Side
  formSide: { flex: 1, padding: '60px', display: 'flex', flexDirection: 'column', justifyContent: 'center', position: 'relative' },
  homeLink: { position: 'absolute', top: '40px', left: '60px', textDecoration: 'none', color: '#888', fontSize: '0.7rem', fontWeight: 'bold', letterSpacing: '2px', display: 'flex', alignItems: 'center', gap: '8px' },
  formContainer: { maxWidth: '450px', margin: '0 auto', width: '100%' },
  formTitle: { fontSize: '2.5rem', fontWeight: '900', color: '#000', margin: 0, letterSpacing: '-1px' },
  formSub: { color: '#666', fontSize: '0.9rem', marginBottom: '40px', marginTop: '10px' },
  errorText: { color: '#e74c3c', fontSize: '0.7rem', fontWeight: 'bold', letterSpacing: '1px', marginBottom: '20px' },

  form: { display: 'flex', flexDirection: 'column', gap: '20px' },
  inputGroup: { display: 'flex', flexDirection: 'column', gap: '5px' },
  label: { fontSize: '0.65rem', fontWeight: '900', color: '#aaa', letterSpacing: '1px' },
  input: { padding: '12px 0', border: 'none', borderBottom: '2px solid #eee', fontSize: '1rem', outline: 'none', transition: '0.3s', background: 'transparent' },

  button: { 
    marginTop: '20px', padding: '20px', background: '#e67e22', color: '#fff', border: 'none', 
    borderRadius: '50px', fontSize: '0.8rem', fontWeight: 'bold', letterSpacing: '2px', 
    cursor: 'pointer', display: 'flex', justifyContent: 'center', alignItems: 'center', transition: '0.3s' 
  },
  footerText: { textAlign: 'center', marginTop: '30px', fontSize: '0.75rem', color: '#888', letterSpacing: '1px' },
  loginLink: { color: '#e67e22', textDecoration: 'none', fontWeight: '900' },

  // Visual Side (Flipped to the Right)
  visualSide: { 
    flex: 1.2, position: 'relative', 
    backgroundImage: `url(${signupBg})`, 
    backgroundSize: 'cover', backgroundPosition: 'center', display: 'flex', alignItems: 'center', padding: '80px'
  },
  visualOverlay: { position: 'absolute', inset: 0, background: 'linear-gradient(to right, rgba(0,0,0,0.7), transparent)' },
  visualContent: { position: 'relative', zIndex: 2, color: '#fff' },
  iconCircle: { width: '60px', height: '60px', border: '2px solid #e67e22', borderRadius: '50%', display: 'flex', justifyContent: 'center', alignItems: 'center', marginBottom: '30px', color: '#e67e22', fontSize: '1.5rem' },
  visualTitle: { fontSize: '4rem', fontWeight: '900', lineHeight: 0.9, margin: 0 },
  visualSub: { letterSpacing: '6px', fontSize: '0.8rem', marginTop: '20px', color: '#e67e22', fontWeight: 'bold' },
};

export default SignupPage;