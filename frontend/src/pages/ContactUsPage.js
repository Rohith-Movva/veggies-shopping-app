import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { FaArrowLeft, FaPaperPlane, FaCheckCircle, FaExclamationCircle, FaPhoneAlt, FaEnvelope } from 'react-icons/fa';
import Lenis from 'lenis';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import API from '../api'; 
import contactusBg from '../assets/farm-bg.png';

gsap.registerPlugin(ScrollTrigger);

const ContactUsPage = () => {
  const [formData, setFormData] = useState({
    name: '', email: '', mobile: '', comments: ''
  });
  
  const [status, setStatus] = useState('idle'); 
  const [errorMessage, setErrorMessage] = useState('');
  const containerRef = useRef();

  // --- LOGIC (EXACTLY AS PROVIDED) ---
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('submitting');
    setErrorMessage('');
    try {
      await API.post('/contact', formData);
      setStatus('success');
      setFormData({ name: '', email: '', mobile: '', comments: '' }); 
      setTimeout(() => setStatus('idle'), 5000);
    } catch (err) {
      console.error(err);
      setStatus('error');
      setErrorMessage(err.response?.data?.message || 'Something went wrong. Please try again.');
    }
  };

  useEffect(() => {
    const lenis = new Lenis({ duration: 1.2 });
    function raf(time) { lenis.raf(time); requestAnimationFrame(raf); }
    requestAnimationFrame(raf);
    return () => lenis.destroy();
  }, []);

  useGSAP(() => {
    // Reveal everything with a heavy stagger
    gsap.from(".glass-reveal", {
      y: 100,
      opacity: 0,
      duration: 1.5,
      stagger: 0.3,
      ease: "expo.out",
      delay: 0.2
    });

    // Magnetic effect for the "Send" button
    const btn = document.querySelector('.magnetic-btn');
    btn.addEventListener('mousemove', (e) => {
      const rect = btn.getBoundingClientRect();
      const x = (e.clientX - rect.left - rect.width / 2) * 0.3;
      const y = (e.clientY - rect.top - rect.height / 2) * 0.3;
      gsap.to(btn, { x, y, duration: 0.3 });
    });
    btn.addEventListener('mouseleave', () => {
      gsap.to(btn, { x: 0, y: 0, duration: 0.5, ease: "elastic.out(1, 0.3)" });
    });
  }, { scope: containerRef });

  return (
    <div ref={containerRef} style={styles.page}>
      <style>{`
        .glass-card { 
            background: rgba(255, 255, 255, 0.05);  
            border: 1px solid rgba(255, 255, 255, 0.1);
            border-radius: 30px;
            box-shadow: 0 25px 50px rgba(0,0,0,0.3);
        }
        .heavy-input { 
            background: rgba(255,255,255,0.05) !important; 
            border: 1px solid rgba(255,255,255,0.1) !important; 
            color: #fff !important;
            transition: all 0.3s ease;
        }
        .heavy-input:focus { 
            background: rgba(255,255,255,0.1) !important; 
            border-color: #27ae60 !important;
            transform: scale(1.02);
        }
        .magnetic-btn:hover { background: #2ecc71 !important; }
      `}</style>

      {/* --- BACKGROUND IMAGE (The "Nature" part) --- */}
      <div style={styles.bgImage} />
      <div style={styles.overlay} />

      {/* Navigation */}
      <nav style={styles.nav}>
        <Link to="/" style={styles.backLink}>
          <FaArrowLeft /> <span>BACK TO HOME</span>
        </Link>
      </nav>

      <div style={styles.content}>
        <div style={styles.layoutGrid}>
          
          {/* LEFT: Info & Map */}
          <div className="glass-reveal" style={styles.leftCol}>
            <div className="glass-card" style={styles.infoCard}>
                <h1 style={styles.mainTitle}>LET'S<br/>TALK.</h1>
                <div style={styles.detailRow}><FaPhoneAlt color="#27ae60" /> <span>+91 9705116060</span></div>
                <div style={styles.detailRow}><FaEnvelope color="#27ae60" /> <span>AGROTECHARVEST@GMAIL.COM</span></div>
                
                {/* --- YOUR EXACT MAP POINTER RESTORED --- */}
                <div style={styles.mapWrapper}>
                    <iframe 
                        title="Agro Tech Harvest Location"
                        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3816.634123456789!2d79.6200!3d17.1500!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMTfCsDA5JzAwLjAiTiA3OcKwMzcnMTIuMCJF!5e0!3m2!1sen!2sin!4v1234567890" 
                        width="100%" 
                        height="200" 
                        style={{ border: 0, borderRadius: '20px' }} 
                        allowFullScreen="" 
                        loading="lazy">
                    </iframe>
                </div>
            </div>
          </div>

          {/* RIGHT: The Form */}
          <div className="glass-reveal" style={styles.rightCol}>
            <div className="glass-card" style={styles.formCard}>
              <h2 style={styles.formTitle}>SEND A MESSAGE</h2>

              {status === 'success' && <div style={styles.successMsg}><FaCheckCircle /> Sent Successfully!</div>}
              {status === 'error' && <div style={styles.errorMsg}><FaExclamationCircle /> {errorMessage}</div>}

              <form onSubmit={handleSubmit} style={styles.form}>
                <div style={styles.inputGroup}>
                    <label style={styles.label}>FULL NAME</label>
                    <input type="text" name="name" value={formData.name} onChange={handleChange} className="heavy-input" style={styles.input} required />
                </div>
                <div style={styles.inputGroup}>
                    <label style={styles.label}>EMAIL ADDRESS</label>
                    <input type="email" name="email" value={formData.email} onChange={handleChange} className="heavy-input" style={styles.input} required />
                </div>
                <div style={styles.inputGroup}>
                    <label style={styles.label}>MOBILE</label>
                    <input type="tel" name="mobile" value={formData.mobile} onChange={handleChange} className="heavy-input" style={styles.input} required />
                </div>
                <div style={styles.inputGroup}>
                    <label style={styles.label}>MESSAGE</label>
                    <textarea name="comments" value={formData.comments} onChange={handleChange} className="heavy-input" style={{...styles.input, height: '100px'}} required />
                </div>

                <button type="submit" className="magnetic-btn" style={styles.submitBtn} disabled={status === 'submitting'}>
                  {status === 'submitting' ? 'SENDING...' : 'DISPATCH MESSAGE'} <FaPaperPlane style={{marginLeft: '10px'}} />
                </button>
              </form>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

const styles = {
  page: { minHeight: '100vh', position: 'relative', overflow: 'hidden', color: '#fff' },
  bgImage: { 
    position: 'absolute', inset: 0, 
    backgroundImage: `url(${contactusBg})`, 
    backgroundSize: 'cover', backgroundPosition: 'center', zIndex: -2 
  },
  overlay: { position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.7)', zIndex: -1 },
  nav: { padding: '40px 60px', position: 'fixed', top: 0, width: '100%', zIndex: 100 },
  backLink: { color: '#fff', textDecoration: 'none', fontWeight: '900', fontSize: '0.8rem', letterSpacing: '2px', display: 'flex', alignItems: 'center', gap: '10px' },
  
  content: { padding: '120px 60px', display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' },
  layoutGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '40px', width: '100%', maxWidth: '1200px' },
  
  infoCard: { padding: '50px' },
  mainTitle: { fontSize: '6rem', fontWeight: '900', lineHeight: 0.8, marginBottom: '40px' },
  detailRow: { display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '20px', fontWeight: 'bold', fontSize: '1rem' },
  mapWrapper: { marginTop: '40px', overflow: 'hidden' },

  formCard: { padding: '50px' },
  formTitle: { fontSize: '1.5rem', fontWeight: '900', letterSpacing: '3px', marginBottom: '40px', color: '#27ae60' },
  form: { display: 'flex', flexDirection: 'column', gap: '20px' },
  inputGroup: { display: 'flex', flexDirection: 'column', gap: '8px' },
  label: { fontSize: '0.65rem', fontWeight: '900', color: '#888', letterSpacing: '2px' },
  input: { padding: '15px', borderRadius: '12px', border: 'none', outline: 'none', fontSize: '1rem' },
  submitBtn: { 
    marginTop: '20px', padding: '20px', background: '#27ae60', color: '#fff', 
    border: 'none', borderRadius: '50px', fontWeight: '900', letterSpacing: '2px', 
    cursor: 'pointer', display: 'flex', justifyContent: 'center', alignItems: 'center', transition: '0.3s' 
  },

  successMsg: { background: 'rgba(46, 204, 113, 0.2)', padding: '15px', borderRadius: '10px', marginBottom: '20px', color: '#2ecc71', fontWeight: 'bold' },
  errorMsg: { background: 'rgba(231, 76, 60, 0.2)', padding: '15px', borderRadius: '10px', marginBottom: '20px', color: '#e74c3c', fontWeight: 'bold' }
};

export default ContactUsPage;