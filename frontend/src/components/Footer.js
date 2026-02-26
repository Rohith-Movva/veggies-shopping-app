import React, { useRef } from 'react';
import { Link } from 'react-router-dom';
import { FaFacebook, FaTwitter, FaInstagram, FaArrowUp } from 'react-icons/fa';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import logo from '../assets/logo.png';

gsap.registerPlugin(ScrollTrigger);

const Footer = () => {
  const footerRef = useRef();

  // --- HEAVY UI ANIMATIONS ---
  useGSAP(() => {
    // 1. Staggered Entrance for footer columns
    gsap.from(".footer-section-gsap", {
      y: 50,
      opacity: 0,
      duration: 1,
      stagger: 0.2,
      ease: "power4.out",
      scrollTrigger: {
        trigger: footerRef.current,
        start: "top 90%", // Triggers when the top of footer is near the bottom of screen
      }
    });

    // 2. Magnetic Social Icons
    const socialIcons = document.querySelectorAll('.social-icon-magnetic');
    socialIcons.forEach((icon) => {
      icon.addEventListener('mousemove', (e) => {
        const rect = icon.getBoundingClientRect();
        const x = (e.clientX - rect.left - rect.width / 2) * 0.5;
        const y = (e.clientY - rect.top - rect.height / 2) * 0.5;
        gsap.to(icon, { x, y, duration: 0.3 });
      });
      icon.addEventListener('mouseleave', () => {
        gsap.to(icon, { x: 0, y: 0, duration: 0.5, ease: "elastic.out(1, 0.3)" });
      });
    });
  }, { scope: footerRef });

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer ref={footerRef} style={styles.footer}>
      <style>{`
        .footer-link:hover { color: #27ae60 !important; transform: translateX(5px); }
        .social-icon-magnetic { transition: color 0.3s; cursor: pointer; }
        .social-icon-magnetic:hover { color: #27ae60 !important; }
        .back-to-top:hover { background: #27ae60 !important; border-color: #27ae60 !important; }
      `}</style>

      <div style={styles.footerContent}>
        
        {/* Column 1: Brand/About */}
        <div className="footer-section-gsap" style={styles.section}>
          <div style={styles.logoRow}>
            <img src={logo} alt="Agro Tech Harvest" style={{ height: '50px' }} />
            <h2 style={styles.brandTitle}>AGRO TECH</h2>
          </div>
          <p style={styles.aboutText}>
            Pioneering the future of dehydrated nutrition. From rural roots to global standards of purity.
          </p>
        </div>

        {/* Column 2: Navigation */}
        <div className="footer-section-gsap" style={styles.section}>
          <h3 style={styles.heading}>EXPLORE</h3>
          <ul style={styles.list}>
            <li><Link to="/" className="footer-link" style={styles.link}>HOME</Link></li>
            <li><Link to="/all-products" className="footer-link" style={styles.link}>POWDERS</Link></li>
            <li><Link to="/about" className="footer-link" style={styles.link}>OUR STORY</Link></li>
            <li><Link to="/contact" className="footer-link" style={styles.link}>CONTACT</Link></li>
          </ul>
        </div>

        {/* Column 3: Contact & Socials */}
        <div className="footer-section-gsap" style={styles.section}>
          <h3 style={styles.heading}>CONNECT</h3>
          <div style={styles.contactInfo}>
            <p>📍 SURYAPET, TELANGANA</p>
            <p>📞 +91 9705116060</p>
            <p>✉️ AGROTECH@GMAIL.COM</p>
          </div>
          
          <div style={styles.socialRow}>
            <div className="social-icon-magnetic"><FaFacebook size={22} /></div>
            <div className="social-icon-magnetic"><FaTwitter size={22} /></div>
            <div className="social-icon-magnetic"><FaInstagram size={22} /></div>
          </div>
        </div>

        {/* Column 4: Back to Top */}
        <div className="footer-section-gsap" style={styles.backTopSection}>
            <button onClick={scrollToTop} className="back-to-top" style={styles.topBtn}>
                <FaArrowUp />
            </button>
            <span style={{ fontSize: '0.7rem', marginTop: '10px', fontWeight: 'bold' }}>BACK TO TOP</span>
        </div>

      </div>

      <div style={styles.footerBottom}>
        <div style={styles.line} />
        <div style={styles.bottomRow}>
            <span>&copy; {new Date().getFullYear()} AGRO TECH HARVEST</span>
            <div style={styles.legal}>
                <span>PRIVACY POLICY</span>
                <span>TERMS OF SERVICE</span>
            </div>
        </div>
      </div>
    </footer>
  );
};

const styles = {
  footer: { 
    background: '#000', 
    color: '#fff', 
    padding: '100px 60px 40px', 
    position: 'relative', 
    zIndex: 10,
    overflow: 'hidden'
  },
  footerContent: { 
    maxWidth: '1400px', 
    margin: '0 auto', 
    display: 'grid', 
    gridTemplateColumns: '2fr 1fr 1fr 0.5fr', 
    gap: '60px' 
  },
  section: { display: 'flex', flexDirection: 'column', gap: '20px' },
  logoRow: { display: 'flex', alignItems: 'center', gap: '15px' },
  brandTitle: { fontSize: '1.5rem', fontWeight: '900', letterSpacing: '2px', margin: 0 },
  aboutText: { color: '#888', lineHeight: '1.8', fontSize: '0.95rem', maxWidth: '300px' },
  
  heading: { fontSize: '0.8rem', fontWeight: '900', letterSpacing: '3px', color: '#444', marginBottom: '20px' },
  list: { listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '15px' },
  link: { color: '#fff', textDecoration: 'none', fontSize: '0.85rem', fontWeight: 'bold', transition: 'all 0.3s' },
  
  contactInfo: { color: '#888', fontSize: '0.85rem', lineHeight: '2', letterSpacing: '1px' },
  socialRow: { display: 'flex', gap: '25px', marginTop: '20px', color: '#fff' },
  
  backTopSection: { display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' },
  topBtn: { 
    width: '60px', height: '60px', borderRadius: '50%', border: '1px solid #444', 
    background: 'transparent', color: '#fff', cursor: 'pointer', display: 'flex', 
    justifyContent: 'center', alignItems: 'center', fontSize: '1.2rem', transition: '0.4s' 
  },

  footerBottom: { maxWidth: '1400px', margin: '80px auto 0' },
  line: { width: '100%', height: '1px', background: '#222', marginBottom: '30px' },
  bottomRow: { 
    display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', 
    color: '#555', fontWeight: 'bold', letterSpacing: '1px' 
  },
  legal: { display: 'flex', gap: '30px' }
};

export default Footer;