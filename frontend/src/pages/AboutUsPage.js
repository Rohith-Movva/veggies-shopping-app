import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
// Make sure FaArrowRight is imported here
import { FaArrowLeft, FaUsers, FaTractor, FaHeart, FaCheckCircle, FaQuoteLeft, FaArrowRight } from 'react-icons/fa';
import Lenis from 'lenis';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// IMPORT IMAGES
import pranayImg from '../assets/pranay.jpg'; 
import abhishekImg from '../assets/abhishek.jpg'; 

gsap.registerPlugin(ScrollTrigger);

const AboutUsPage = () => {
  const containerRef = useRef();

  // --- SMOOTH SCROLL ---
  useEffect(() => {
    const lenis = new Lenis({ duration: 1.2, smoothWheel: true });
    function raf(time) { lenis.raf(time); requestAnimationFrame(raf); }
    requestAnimationFrame(raf);
    return () => lenis.destroy();
  }, []);

  // --- HEAVY UI ANIMATIONS ---
  useGSAP(() => {
    // 1. Hero Title Reveal
    gsap.from(".reveal-title", {
      y: 100, opacity: 0, duration: 1.2, stagger: 0.2, ease: "power4.out"
    });

    // 2. NEW APPROACH: Founder Image Mask Reveal
    // Instead of moving the image, we reveal it using clip-path so it stays in place.
    gsap.fromTo(".founder-img-reveal", 
      { clipPath: "inset(100% 0 0 0)" }, // Start hidden from bottom
      { 
        clipPath: "inset(0% 0 0 0)", // Reveal upward fully
        duration: 1.5,
        ease: "power4.inOut",
        stagger: 0.3,
        scrollTrigger: {
          trigger: ".founders-section",
          start: "top 75%", // Starts when section is in view
        }
      }
    );

    // Animate the text below images separately
    gsap.from(".founder-info", {
      y: 30, opacity: 0, duration: 0.8, stagger: 0.3, delay: 0.5,
      scrollTrigger: { trigger: ".founders-section", start: "top 75%" }
    });

    // 3. Principles Reveal
    gsap.from(".principle-card", {
      scrollTrigger: { trigger: ".principles-grid", start: "top 80%" },
      scale: 0.8, opacity: 0, stagger: 0.1, duration: 0.8, ease: "back.out(1.7)"
    });

    // 4. Parallax Hero Background
    gsap.to(".hero-bg", {
      yPercent: 30, ease: "none",
      scrollTrigger: { trigger: ".hero-section", start: "top top", end: "bottom top", scrub: true }
    });

  }, { scope: containerRef });

  return (
    <div ref={containerRef} style={styles.container}>
      <style>{`
        .mask { overflow: hidden; display: inline-block; }
        /* Removed Grayscale filter, kept slight scale on hover */
        .founder-card:hover img { transform: scale(1.03); }
        .principle-card:hover { background: #27ae60 !important; color: white !important; transform: translateY(-5px); }
        .principle-card:hover svg { color: white !important; }
        .value-card:hover { border-color: #27ae60 !important; }
      `}</style>

      <nav style={styles.nav}>
        <Link to="/" style={styles.backLink}>
          <FaArrowLeft /> <span>Back to Home</span>
        </Link>
      </nav>

      {/* --- HERO --- */}
      <section className="hero-section" style={styles.hero}>
        <div className="hero-bg" style={styles.heroBg} />
        <div style={styles.overlay} />
        <div style={styles.heroContent}>
          <div className="mask"><h1 className="reveal-title" style={styles.bigTitle}>OUR JOURNEY</h1></div><br/>
          <div className="mask"><p className="reveal-title" style={styles.subtitle}>Born from Struggle, Belief & Purpose</p></div>
          <div className="mask"><p className="reveal-title" style={styles.foundersName}>Pranay Muthumula Veera & Abhishek Bandla</p></div>
        </div>
      </section>

      {/* --- STORY & FOUNDERS --- */}
      <section style={styles.storySection}>
        <div style={styles.storyGrid}>
          <div style={styles.textColumn}>
            <h2 style={styles.sectionHeading}>OUR ROOTS</h2>
            <p style={styles.mainText}>
              Raised in a simple rural family where hard work was a way of life, we observed a market filled with chemical-laden "healthy" foods. We decided to change that.
            </p>
            <div style={styles.quoteBox}>
              <FaQuoteLeft style={styles.quoteIcon} />
              <p>"Can we provide nutrition in its purest, most natural form?"</p>
            </div>
          </div>
          
          {/* UPDATED FOUNDERS SECTION */}
          <div className="founders-section" style={styles.foundersGrid}>
            
            <div className="founder-card" style={styles.founderCard}>
              {/* Added 'founder-img-reveal' class for the new animation */}
              <div className="founder-img-reveal" style={styles.imgWrapper}>
                <img src={pranayImg} alt="Pranay" style={styles.founderImg} onError={(e) => e.target.src="https://via.placeholder.com/300x400"} />
              </div>
              <div className="founder-info">
                <h3>Pranay Muthumula Veera</h3>
                <span>Co-Founder</span>
              </div>
            </div>

            <div className="founder-card" style={styles.founderCard}>
               {/* Added 'founder-img-reveal' class for the new animation */}
              <div className="founder-img-reveal" style={styles.imgWrapper}>
                <img src={abhishekImg} alt="Abhishek" style={styles.founderImg} onError={(e) => e.target.src="https://via.placeholder.com/300x400"} />
              </div>
              <div className="founder-info">
                <h3>Abhishek Bandla</h3>
                <span>Co-Founder</span>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* --- PRINCIPLES --- */}
      <section style={styles.principlesSection}>
        <div style={{ textAlign: 'center', marginBottom: '60px' }}>
          <h2 style={styles.sectionHeading}>UNCHANGING PRINCIPLES</h2>
          <p style={{ color: '#888', letterSpacing: '2px' }}>OPEN TO CHALLENGE. NOTHING TO HIDE.</p>
        </div>
        <div className="principles-grid" style={styles.principlesGrid}>
          {['No Quality Compromise', 'No Chemicals', 'No Preservatives', 'No Added Sugars', 'Pure Fruits & Veg', '100% Lab Tested'].map((p, i) => (
            <div key={i} className="principle-card" style={styles.principleCard}>
              <FaCheckCircle size={20} color="#27ae60" />
              <span>{p.toUpperCase()}</span>
            </div>
          ))}
        </div>
      </section>

      {/* --- MISSION --- */}
      <section style={styles.missionSection}>
        <div style={styles.missionCard}>
          <h2 style={{ fontSize: '3rem', fontWeight: '900', color: '#fff' }}>WHY AGRO TECH HARVEST?</h2>
          <div style={styles.breakdownRow}>
            <div style={styles.breakdownItem}>
              <h3>AGRO TECH</h3>
              <p>Integration of Agriculture with Technology</p>
            </div>
            <div style={styles.divider} />
            <div style={styles.breakdownItem}>
              <h3>HARVEST</h3>
              <p>The hard work of farmers</p>
            </div>
          </div>
          <p style={styles.missionStatement}>
            Our identity is built on Trust, Purity, and Honesty. This is not just a business—it is a commitment to healthier families.
          </p>
        </div>
      </section>

      {/* --- VALUES --- */}
      <section style={styles.valuesSection}>
        <div className="value-card" style={styles.valueCard}>
          <FaUsers style={styles.icon} />
          <h3>Rural Employment</h3>
          <p>Empowering local communities by creating meaningful work.</p>
        </div>
        <div className="value-card" style={styles.valueCard}>
          <FaTractor style={styles.icon} />
          <h3>Support Farmers</h3>
          <p>Ensuring fair value for the backbone of our nation.</p>
        </div>
        <div className="value-card" style={styles.valueCard}>
          <FaHeart style={styles.icon} />
          <h3>Accessible Nutrition</h3>
          <p>Pure nutrition for every single Indian kitchen.</p>
        </div>
      </section>

      {/* --- FOOTER CTA --- */}
      <footer style={styles.footer}>
        <h2>BE A PART OF THE JOURNEY.</h2>
        {/* Added FaArrowRight here which caused the previous error */}
        <Link to="/" style={styles.ctaBtn}>EXPLORE PRODUCTS <FaArrowRight /></Link>
      </footer>
    </div>
  );
};

const styles = {
  container: { background: '#fff', color: '#000', overflowX: 'hidden' },
  nav: { position: 'fixed', top: 0, width: '100%', padding: '30px 60px', zIndex: 100 },
  backLink: { textDecoration: 'none', color: '#fff', fontWeight: '900', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '10px', mixBlendMode: 'difference' },
  
  hero: { height: '100vh', position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center', textAlign: 'center' },
  heroBg: { position: 'absolute', inset: 0, backgroundImage: `url("https://images.unsplash.com/photo-1500937386664-56d1dfef3854?auto=format&fit=crop&w=1950&q=80")`, backgroundSize: 'cover', backgroundPosition: 'center', zIndex: 1 },
  overlay: { position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.6)', zIndex: 2 },
  heroContent: { position: 'relative', zIndex: 3, color: '#fff' },
  bigTitle: { fontSize: '10vw', fontWeight: '900', lineHeight: '0.8', margin: 0 },
  subtitle: { fontSize: '1.5rem', fontWeight: '300', marginTop: '20px', letterSpacing: '2px' },
  foundersName: { fontSize: '0.9rem', color: '#27ae60', fontWeight: 'bold', marginTop: '10px', letterSpacing: '4px' },

  storySection: { padding: '150px 60px' },
  storyGrid: { display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '100px', maxWidth: '1400px', margin: '0 auto', alignItems: 'center' },
  textColumn: { paddingRight: '50px' },
  sectionHeading: { fontSize: '0.8rem', fontWeight: '900', letterSpacing: '5px', color: '#27ae60', marginBottom: '30px' },
  mainText: { fontSize: '2rem', fontWeight: '400', lineHeight: '1.4', color: '#111' },
  quoteBox: { marginTop: '50px', position: 'relative', paddingLeft: '40px' },
  quoteIcon: { position: 'absolute', left: 0, top: 0, color: '#eee', fontSize: '2rem' },
  
  foundersGrid: { display: 'flex', gap: '40px' },
  founderCard: { textAlign: 'center', flex: 1 },
  // Updated Image Wrapper style for stability
  imgWrapper: { overflow: 'hidden', borderRadius: '20px', marginBottom: '25px', height: '400px', background: '#f0f0f0' },
  // Updated Image style - removed grayscale filter
  founderImg: { width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.5s ease' },

  principlesSection: { padding: '150px 60px', background: '#f9f9f9' },
  principlesGrid: { display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px', maxWidth: '1200px', margin: '0 auto' },
  principleCard: { padding: '30px', background: '#fff', borderRadius: '10px', display: 'flex', alignItems: 'center', gap: '15px', fontWeight: '900', fontSize: '0.8rem', boxShadow: '0 5px 20px rgba(0,0,0,0.03)', transition: '0.3s' },

  missionSection: { padding: '150px 60px', background: '#000' },
  missionCard: { textAlign: 'center', maxWidth: '1000px', margin: '0 auto' },
  breakdownRow: { display: 'flex', justifyContent: 'center', gap: '50px', margin: '60px 0', alignItems: 'center' },
  breakdownItem: { color: '#fff', flex: 1 },
  divider: { width: '1px', height: '100px', background: '#333' },
  missionStatement: { color: '#888', fontSize: '1.2rem', lineHeight: '1.8' },

  valuesSection: { padding: '150px 60px', display: 'flex', gap: '40px', maxWidth: '1400px', margin: '0 auto' },
  valueCard: { flex: 1, padding: '50px', border: '1px solid #eee', borderRadius: '20px', textAlign: 'center', transition: '0.3s' },
  icon: { fontSize: '3rem', color: '#27ae60', marginBottom: '30px' },

  footer: { height: '70vh', background: '#111', color: '#fff', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', textAlign: 'center' },
  ctaBtn: { marginTop: '40px', padding: '20px 45px', background: '#27ae60', color: '#fff', textDecoration: 'none', fontWeight: '900', borderRadius: '50px', display: 'flex', alignItems: 'center', gap: '15px' }
};

export default AboutUsPage;