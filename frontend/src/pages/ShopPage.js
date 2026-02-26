import React, { useRef } from 'react';
import { Link } from 'react-router-dom';
import logo from '../assets/logo.png'; 
import farmBg from '../assets/farm-bg.png'; // Make sure your powder/farm bg is here
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import Lenis from 'lenis';

const ShopPage = () => {
  const containerRef = useRef();

  // --- SMOOTH SCROLL & ENTRANCE ---
  useGSAP(() => {
    const lenis = new Lenis({ duration: 1.2 });
    function raf(time) { lenis.raf(time); requestAnimationFrame(raf); }
    requestAnimationFrame(raf);

    // 1. Text Reveal
    gsap.from(".shop-reveal", {
      y: 40,
      opacity: 0,
      stagger: 0.2,
      duration: 1,
      ease: "power4.out"
    });

    // 2. Panel Entrance
    gsap.from(".shop-panel", {
      scale: 0.9,
      opacity: 0,
      stagger: 0.2,
      duration: 1.2,
      ease: "expo.out",
      delay: 0.4
    });

    return () => lenis.destroy();
  }, { scope: containerRef });

  return (
    <div ref={containerRef} style={styles.container}>
      <style>{`
        .shop-panel { transition: transform 0.8s cubic-bezier(0.16, 1, 0.3, 1); cursor: pointer; overflow: hidden; }
        .shop-panel:hover { transform: scale(1.02); }
        .shop-panel:hover .panel-bg { transform: scale(1.1); }
        .shop-panel:hover .panel-btn { background: #fff !important; color: #000 !important; width: 100% !important; }
        .mask { overflow: hidden; display: inline-block; }
      `}</style>

      {/* --- HERO SECTION --- */}
      <div style={styles.hero}>
        <div className="shop-reveal" style={styles.logoWrapper}>
          {/* <img src={logo} alt="Logo" style={styles.logo} /> */}
        </div>
        <div className="mask">
          <h1 className="shop-reveal" style={styles.title}>WELCOME BACK.</h1>
        </div>
        <p className="shop-reveal" style={styles.subtitle}>
          Your daily dose of nature-harvested purity is just a click away.
        </p>
      </div>

      {/* --- PANEL GRID (The "Heavy" part) --- */}
      <div style={styles.contentSection}>
        <div style={styles.grid}>
          
          {/* Panel 1: Vegetables */}
          <Link to="/category/vegetables" className="shop-panel" style={styles.panel}>
            <div className="panel-bg" style={{...styles.panelBg, backgroundImage: `url(${farmBg})` }} />
            <div style={styles.panelOverlay} />
            <div style={styles.panelContent}>
                <span style={styles.panelLabel}>FRESH HARVEST</span>
                <h2 style={styles.panelTitle}>VEGETABLES</h2>
                <p style={styles.panelDesc}>Daily harvested, 100% organic produce from rural Telangana.</p>
                <div className="panel-btn" style={styles.panelBtn}>BROWSE COLLECTION</div>
            </div>
          </Link>

          {/* Panel 2: Powders */}
          <Link to="/category/powders" className="shop-panel" style={styles.panel}>
            <div className="panel-bg" style={{...styles.panelBg, backgroundImage: `url(${farmBg})` }} />
            <div style={styles.panelOverlay} />
            <div style={styles.panelContent}>
                <span style={styles.panelLabel}>DEHYDRATED PURITY</span>
                <h2 style={styles.panelTitle}>RAW POWDERS</h2>
                <p style={styles.panelDesc}>Pure turmeric, moringa, and beetroot nutrition in its finest form.</p>
                <div className="panel-btn" style={styles.panelBtn}>BROWSE COLLECTION</div>
            </div>
          </Link>

        </div>
      </div>

      {/* FOOTER CAPTION */}
      <div className="shop-reveal" style={styles.footerCaption}>
          <div style={styles.line} />
          <p>AGRO TECH HARVEST • TRUSTED BY 500+ RURAL FAMILIES</p>
      </div>
    </div>
  );
};

const styles = {
  container: { background: '#fff', minHeight: '100vh', overflowX: 'hidden' },
  
  // HERO (Adjusted for fixed navbar)
  hero: { 
    paddingTop: '180px', // CLEAR NAVBAR SPACE
    textAlign: 'center', 
    paddingBottom: '80px' 
  },
  logoWrapper: { marginBottom: '20px' },
  logo: { height: '60px', borderRadius: '50%', background: '#f9f9f9', padding: '10px' },
  title: { fontSize: '6rem', fontWeight: '900', color: '#1b4332', margin: 0, letterSpacing: '-3px' },
  subtitle: { fontSize: '1rem', color: '#888', letterSpacing: '2px', textTransform: 'uppercase', marginTop: '10px' },

  // PANELS SECTION
  contentSection: { padding: '0 60px', maxWidth: '1400px', margin: '0 auto' },
  grid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '40px', height: '600px' },
  
  panel: { position: 'relative', borderRadius: '40px', display: 'flex', alignItems: 'flex-end', padding: '60px', textDecoration: 'none' },
  panelBg: { position: 'absolute', inset: 0, backgroundSize: 'cover', backgroundPosition: 'center', transition: 'transform 1.5s cubic-bezier(0.16, 1, 0.3, 1)', zIndex: 1 },
  panelOverlay: { position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.8), transparent)', zIndex: 2 },
  
  panelContent: { position: 'relative', zIndex: 3, color: '#fff', width: '100%' },
  panelLabel: { fontSize: '0.7rem', fontWeight: '900', letterSpacing: '3px', color: '#2ecc71' },
  panelTitle: { fontSize: '3rem', fontWeight: '900', margin: '10px 0', lineHeight: 1 },
  panelDesc: { fontSize: '1rem', color: '#ccc', marginBottom: '30px', maxWidth: '400px' },
  
  panelBtn: { 
    width: '180px', padding: '15px 0', border: '1px solid rgba(255,255,255,0.3)', 
    borderRadius: '50px', textAlign: 'center', fontSize: '0.8rem', fontWeight: '900', 
    letterSpacing: '2px', transition: 'all 0.4s ease' 
  },

  footerCaption: { textAlign: 'center', padding: '100px 0', color: '#ccc', fontSize: '0.7rem', letterSpacing: '4px' },
  line: { width: '80px', height: '2px', background: '#eee', margin: '0 auto 20px' }
};

export default ShopPage;