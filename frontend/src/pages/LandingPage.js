import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { 
  FaLeaf, FaFlask, FaCertificate, FaArrowRight, 
  FaBars, FaTimes, FaChevronLeft, FaChevronRight, FaShieldAlt 
} from 'react-icons/fa';
import Lenis from 'lenis';

// GSAP Imports
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Assets
import logo from '../assets/logo.png';
import farmBg1 from '../assets/farm-bg.png';
import farmBg2 from '../assets/farm-bg-2.png'; 
import farmBg3 from '../assets/farm-bg-3.png';
import API from '../api'; 

gsap.registerPlugin(ScrollTrigger);

const LandingPage = () => {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [sliderIndex, setSliderIndex] = useState(0);
  const [currentBg, setCurrentBg] = useState(0);

  const mainContainer = useRef();
  const trackRef = useRef();
  const heroRef = useRef();
  
  const heroImages = [farmBg1, farmBg2, farmBg3];
  const BACKEND_URL = window.location.hostname === 'localhost' 
    ? "http://localhost:5000" 
    : "https://veggies-shopping-app.onrender.com";

  useEffect(() => {
    const lenis = new Lenis({ duration: 1.2, smoothWheel: true });
    function raf(time) { lenis.raf(time); requestAnimationFrame(raf); }
    requestAnimationFrame(raf);

    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    
    const fetchProducts = async () => {
      try {
        const { data } = await API.get('/products');
        const list = Array.isArray(data) ? data : data.products || [];
        setProducts(list.filter(p => p.category?.toLowerCase() === 'powders'));
        setIsLoading(false);
      } catch (err) { console.error(err); setIsLoading(false); }
    };
    fetchProducts();

    const bgInterval = setInterval(() => {
      setCurrentBg((prev) => (prev + 1) % heroImages.length);
    }, 5000);

    return () => { 
      window.removeEventListener('resize', handleResize); 
      lenis.destroy(); 
      clearInterval(bgInterval);
    };
  }, [heroImages.length]);

  useGSAP(() => {
    if (isLoading) return;

    gsap.from(".char", {
      y: 150, stagger: 0.08, duration: 1.2, ease: "power4.out", delay: 0.3
    });

    gsap.to(".hero-bg-layer", {
      yPercent: 15, ease: "none",
      scrollTrigger: { trigger: heroRef.current, start: "top top", end: "bottom top", scrub: true }
    });

    const magnets = document.querySelectorAll('.magnetic');
    magnets.forEach((btn) => {
      btn.addEventListener('mousemove', (e) => {
        const rect = btn.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;
        gsap.to(btn, { x: x * 0.3, y: y * 0.3, duration: 0.3, ease: "power2.out" });
      });
      btn.addEventListener('mouseleave', () => {
        gsap.to(btn, { x: 0, y: 0, duration: 0.5, ease: "elastic.out(1, 0.3)" });
      });
    });

    gsap.from(".trust-item", {
      opacity: 0, scale: 0.8, y: 30, stagger: 0.15,
      scrollTrigger: { trigger: ".trust-section", start: "top 90%" }
    });
  }, { scope: mainContainer, dependencies: [isLoading] });

  const slideNext = () => {
    const limit = isMobile ? products.length - 1 : products.length - 3;
    setSliderIndex(prev => (prev < limit ? prev + 1 : 0));
  };

  const slidePrev = () => {
    const limit = isMobile ? products.length - 1 : products.length - 3;
    setSliderIndex(prev => (prev > 0 ? prev - 1 : limit));
  };

  useGSAP(() => {
    const gap = isMobile ? 20 : 40;
    const cardWidth = isMobile ? (window.innerWidth - 40) : 400; 
    gsap.to(trackRef.current, {
      x: -(sliderIndex * (cardWidth + gap)),
      duration: 1,
      ease: "expo.out"
    });
  }, [sliderIndex, isMobile]);

  const renderImageSrc = (imgString) => {
    if (!imgString) return '';
    if (imgString.startsWith('http')) return imgString;
    return `${BACKEND_URL}/images/${imgString}`;
  };

  return (
    <div ref={mainContainer} style={styles.page}>
      <style>{`
        .mask { overflow: hidden; display: inline-block; }
        .nav-link:hover { color: #27ae60 !important; }
        .product-card-heavy:hover .card-img { transform: scale(1.1); }
        .arrow-btn:hover { background: #27ae60 !important; border-color: #27ae60 !important; color: #fff !important; }
      `}</style>

      {/* --- HEADER --- */}
      <header style={styles.header}>
        <div style={styles.headerInner}>
          <div style={styles.logoRow}>
            <img src={logo} alt="Logo" style={{ height: isMobile ? '35px' : '45px' }} />
            <h1 style={styles.brandName}>AGRO TECH</h1>
          </div>

          {!isMobile ? (
            <div style={styles.navGroup}>
              <nav style={styles.nav}>
                <Link to="/" className="nav-link" style={styles.link}>Home</Link>
                <Link to="/about" className="nav-link" style={styles.link}>About Us</Link>
                <Link to="/all-products" className="nav-link" style={styles.link}>Shop</Link>
                <Link to="/contact" className="nav-link" style={styles.link}>Contact</Link>
              </nav>
              <div style={styles.auth}>
                <Link to="/login" style={styles.loginBtn}>Login</Link>
                <Link to="/signup" className="magnetic" style={styles.signupBtn}>Sign Up</Link>
              </div>
            </div>
          ) : (
            <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} style={styles.menuBtn}>
              {mobileMenuOpen ? <FaTimes /> : <FaBars />}
            </button>
          )}
        </div>
        
        {isMobile && mobileMenuOpen && (
          <div style={styles.mobileOverlay}>
            <Link to="/" onClick={()=>setMobileMenuOpen(false)} style={styles.mLink}>Home</Link>
            <Link to="/about" onClick={()=>setMobileMenuOpen(false)} style={styles.mLink}>About</Link>
            <Link to="/all-products" onClick={()=>setMobileMenuOpen(false)} style={styles.mLink}>Shop</Link>
            <Link to="/signup" onClick={()=>setMobileMenuOpen(false)} style={styles.mLink}>Sign Up</Link>
          </div>
        )}
      </header>

      {/* --- HERO --- */}
      <section ref={heroRef} style={styles.hero}>
        {heroImages.map((img, i) => (
          <div key={i} className="hero-bg-layer" style={{ 
            ...styles.heroLayer, 
            backgroundImage: `url(${img})`,
            opacity: currentBg === i ? 1 : 0 
          }} />
        ))}
        <div style={styles.heroOverlay} />
        <div style={styles.heroContent}>
          <div className="mask"><h1 className="char" style={styles.bigTitle}>NATURE'S</h1></div><br/>
          <div className="mask"><h1 className="char" style={styles.bigTitle}>FINEST</h1></div>
          <p style={styles.heroSubText}>DEHYDRATED RAW POWDERS FOR A BETTER LIFE</p>
          <div style={{ marginTop: '40px' }}>
            <Link to="/all-products" className="magnetic" style={styles.heroCta}>Explore Shop <FaArrowRight /></Link>
          </div>
        </div>
      </section>

      {/* --- SLIDER --- */}
      <section style={styles.sliderSection}>
        <div style={styles.sliderHeader}>
          <div>
            <span style={{ color: '#27ae60', fontWeight: 'bold', letterSpacing: '2px' }}>COLLECTIONS</span>
            <h2 style={{ fontSize: isMobile ? '2.5rem' : '3.5rem', margin: '10px 0' }}>Our Premium Range</h2>
          </div>
          <div style={styles.arrowRow}>
            <button onClick={slidePrev} className="arrow-btn" style={styles.arrowStyle}><FaChevronLeft /></button>
            <button onClick={slideNext} className="arrow-btn" style={styles.arrowStyle}><FaChevronRight /></button>
          </div>
        </div>

        <div style={styles.trackContainer}>
          <div ref={trackRef} style={styles.track}>
            {products.map((p, i) => (
              <div key={i} className="product-card-heavy" style={styles.card}>
                <div style={styles.cardImageWrap}>
                  <img src={renderImageSrc(p.image)} alt={p.name} className="card-img" style={styles.cardImg} />
                </div>
                <div style={styles.cardBody}>
                  <h3 style={{ fontSize: '1.4rem', marginBottom: '15px' }}>{p.name}</h3>
                  <Link to={`/product/${p._id}`} style={styles.viewBtn}>Discover More</Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* --- TRUST SECTION (REDUCED HEIGHT & FSSAI ICON) --- */}
      <section className="trust-section" style={styles.trustSection}>
        <div className="trust-item" style={styles.trustBox}>
          <div style={styles.iconCircle}><FaLeaf /></div>
          <h3 style={styles.trustTitle}>100% ORGANIC</h3>
        </div>
        <div className="trust-item" style={styles.trustBox}>
          <div style={styles.iconCircle}><FaShieldAlt /></div>
          <h3 style={styles.trustTitle}>FSSAI LICENSED</h3>
        </div>
        <div className="trust-item" style={styles.trustBox}>
          <div style={styles.iconCircle}><FaFlask /></div>
          <h3 style={styles.trustTitle}>LAB TESTED</h3>
        </div>
        <div className="trust-item" style={styles.trustBox}>
          <div style={styles.iconCircle}><FaCertificate /></div>
          <h3 style={styles.trustTitle}>CERTIFIED</h3>
        </div>
      </section>
      
      

      {/* --- FOOTER --- */}
      <footer style={styles.footer}>
        <h2 style={{ fontSize: isMobile ? '2rem' : '4rem', fontWeight: '900', color: '#fff' }}>GROWN IN NATURE.<br/>PACKED WITH CARE.</h2>
        <Link to="/about" style={{ color: '#27ae60', marginTop: '30px', textDecoration: 'none', fontWeight: 'bold' }}>READ OUR STORY →</Link>
      </footer>
    </div>
  );
};

const styles = {
  page: { background: '#000', overflowX: 'hidden' },
  header: { position: 'fixed', top: 0, width: '100%', zIndex: 1000 },
  headerInner: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '20px 50px', background: 'rgba(0,0,0,0.3)', backdropFilter: 'blur(15px)' },
  logoRow: { display: 'flex', alignItems: 'center', gap: '15px' },
  brandName: { color: '#fff', margin: 0, fontSize: '1.2rem', fontWeight: 'bold', letterSpacing: '1px' },
  navGroup: { display: 'flex', alignItems: 'center', gap: '50px' },
  nav: { display: 'flex', gap: '30px' },
  link: { color: '#fff', textDecoration: 'none', fontWeight: '500', fontSize: '0.9rem' },
  auth: { display: 'flex', alignItems: 'center', gap: '25px' },
  loginBtn: { color: '#fff', textDecoration: 'none', fontWeight: 'bold' },
  signupBtn: { padding: '12px 28px', background: '#27ae60', color: '#fff', borderRadius: '30px', textDecoration: 'none', fontWeight: 'bold' },
  menuBtn: { background: 'none', border: 'none', color: '#fff', fontSize: '1.5rem' },
  mobileOverlay: { position: 'absolute', top: '70px', left: 0, width: '100%', background: '#111', display: 'flex', flexDirection: 'column', padding: '30px' },
  mLink: { color: '#fff', padding: '15px 0', textDecoration: 'none', fontSize: '1.2rem', borderBottom: '1px solid #222' },

  hero: { height: '100vh', position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' },
  heroLayer: { position: 'absolute', inset: 0, backgroundSize: 'cover', backgroundPosition: 'center', transition: 'opacity 1.5s ease' },
  heroOverlay: { position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, rgba(0,0,0,0.4), rgba(0,0,0,0.8))' },
  heroContent: { position: 'relative', zIndex: 10, textAlign: 'center', color: '#fff' },
  bigTitle: { fontSize: '10vw', lineHeight: '0.85', fontWeight: '900', margin: 0 },
  heroSubText: { fontSize: '1.1rem', letterSpacing: '4px', marginTop: '20px', color: '#ccc' },
  heroCta: { padding: '18px 40px', background: '#fff', color: '#000', borderRadius: '40px', textDecoration: 'none', fontWeight: 'bold', display: 'inline-flex', alignItems: 'center', gap: '10px' },

  sliderSection: { padding: '80px 50px', background: '#fff' }, // Reduced padding
  sliderHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '40px' }, // Reduced margin
  arrowRow: { display: 'flex', gap: '15px' },
  arrowStyle: { width: '60px', height: '60px', borderRadius: '50%', border: '1px solid #ddd', background: '#fff', cursor: 'pointer', display: 'flex', justifyContent: 'center', alignItems: 'center' },
  
  trackContainer: { overflow: 'visible' },
  track: { display: 'flex', gap: '40px' },
  card: { width: '400px', height: '520px', background: '#fcfcfc', borderRadius: '30px', overflow: 'hidden', flexShrink: 0, boxShadow: '0 20px 40px rgba(0,0,0,0.03)' }, // Reduced height
  cardImageWrap: { height: '65%', overflow: 'hidden' },
  cardImg: { width: '100%', height: '100%', objectFit: 'cover', transition: '1.2s cubic-bezier(0.16, 1, 0.3, 1)' },
  cardBody: { padding: '25px', textAlign: 'center' },
  viewBtn: { color: '#27ae60', textDecoration: 'none', fontWeight: 'bold', borderBottom: '2px solid' },

  trustSection: { padding: '60px 20px', display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '40px 80px', background: '#fff' }, // Significantly reduced padding & gaps
  trustBox: { textAlign: 'center', color: '#000', flex: '0 1 180px' },
  iconCircle: { width: '80px', height: '80px', background: '#f0fdf4', borderRadius: '50%', display: 'flex', justifyContent: 'center', alignItems: 'center', fontSize: '2rem', color: '#27ae60', marginBottom: '15px', margin: '0 auto' }, // Smaller icons
  trustTitle: { fontSize: '0.9rem', letterSpacing: '1px', fontWeight: 'bold' },

  footer: { height: '80vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', textAlign: 'center', background: '#000', padding: '20px' }
};

export default LandingPage;