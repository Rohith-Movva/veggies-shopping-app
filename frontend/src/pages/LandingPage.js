import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaLeaf, FaFlask, FaCertificate, FaBan, FaArrowRight, FaBars, FaTimes } from 'react-icons/fa';
import logo from '../assets/logo.png';
import farmBg from '../assets/farm-bg.png';
import API from '../api'; 

const LandingPage = () => {
  const [showContact, setShowContact] = useState(false);
  const [powders, setPowders] = useState([]);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false); // New state for mobile menu toggle

  const BACKEND_URL = window.location.hostname === 'localhost' 
    ? "http://localhost:5000" 
    : "https://veggies-shopping-app.onrender.com"; 

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    
    const fetchPowders = async () => {
      try {
        const { data } = await API.get('/products');
        // Fallback checks in case data structure differs
        const productList = Array.isArray(data) ? data : data.products || [];
        const powderList = productList.filter(p => p.category && p.category.toLowerCase() === 'powders');
        setPowders(powderList);
      } catch (err) {
        console.error("Failed to load products", err);
      }
    };
    fetchPowders();

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const renderImageSrc = (imgString) => {
      if (!imgString) return '';
      if (imgString.startsWith('http')) return imgString;
      return `${BACKEND_URL}/images/${imgString}`;
  };

  const styles = getStyles(isMobile, mobileMenuOpen);

  return (
    <div style={styles.container}>
      
      {/* --- HEADER --- */}
      <header style={styles.header}>
        <div style={styles.headerTopBar}>
            <div style={styles.logoContainer}>
              <img src={logo} alt="Logo" style={{ height: isMobile ? '40px' : '50px' }} />
              <h1 style={styles.brandName}>Agro Tech Harvest</h1>
            </div>
            
            {/* Hamburger Icon for Mobile */}
            {isMobile && (
                <button 
                    onClick={() => setMobileMenuOpen(!mobileMenuOpen)} 
                    style={styles.hamburgerBtn}
                >
                    {mobileMenuOpen ? <FaTimes /> : <FaBars />}
                </button>
            )}
        </div>

        {/* Navigation - Hidden on mobile unless toggled */}
        <div style={styles.navContainer}>
            <nav style={styles.nav}>
              <Link to="/" style={styles.navLink}>Home</Link>
              <Link to="/about" style={styles.navLink}>About Us</Link>
              <button onClick={() => setShowContact(true)} style={styles.navBtn}>Contact Us</button>
            </nav>

            <div style={styles.authContainer}>
              <Link to="/login" style={styles.loginBtn}>Login</Link>
              <Link to="/signup" style={styles.signupBtn}>Sign Up</Link>
            </div>
        </div>
      </header>

      {/* --- HERO SECTION --- */}
      <div style={styles.hero}>
        <div style={styles.heroOverlay}>
            <h1 style={styles.heroTitle}>Pure. Organic. Fresh.</h1>
            <p style={styles.heroText}>
            Experience the finest authentic raw powders, delivered directly from the farm to your doorstep.
            </p>
            <Link to="/signup" style={styles.ctaButton}>Join the Harvest</Link>
        </div>
      </div>

      {/* --- PRODUCT GRID SECTION --- */}
      <div style={styles.section}>
        <h2 style={styles.sectionTitle}>
          ✨ Our Premium Selections
        </h2>
        
        <div style={styles.productGrid}>
          {powders.length > 0 ? (
            powders.map((product) => (
              <div key={product._id} style={styles.productCard}>
                <div style={styles.imageWrapper}>
                    <img 
                        src={renderImageSrc(product.image)} 
                        alt={product.name} 
                        style={styles.productImage} 
                    />
                </div>
                
                <h3 style={styles.productTitle}>{product.name}</h3>
                
                <p style={styles.productDesc}>
                  {product.description ? product.description.substring(0, 60) : 'Premium organic powder...'}...
                </p>
                
                <div style={styles.productFooter}>
                  <Link to={`/product/${product._id}`} style={styles.cardBtn}>View Details</Link>
                </div>
              </div>
            ))
          ) : (
            <p style={styles.loadingText}>Loading products...</p>
          )}
        </div>
      </div>

      {/* --- TRUST BADGES SECTION --- */}
      <div style={styles.trustSection}>
        <h2 style={styles.sectionTitle}>Our Promise of Purity</h2>
        <div style={styles.trustGrid}>
            <div style={styles.trustBadge}>
                <div style={styles.iconCircle}><FaFlask /></div>
                <h3>Lab Tested</h3>
                <p>Every batch tested</p>
            </div>
            <div style={styles.trustBadge}>
                <div style={styles.iconCircle}><FaCertificate /></div>
                <h3>FSSAI Certified</h3>
                <p>100% Safe</p>
            </div>
            <div style={styles.trustBadge}>
                <div style={styles.iconCircle}><FaLeaf /></div>
                <h3>100% Organic</h3>
                <p>Nature only</p>
            </div>
            <div style={styles.trustBadge}>
                <div style={styles.iconCircle}><FaBan /></div>
                <h3>Non-GMO</h3>
                <p>Authentic seeds</p>
            </div>
        </div>
      </div>

      {/* --- STORY SECTION --- */}
      <div style={styles.storySection}>
          <h2>Discover Our Roots</h2>
          <p style={{maxWidth: '600px', margin: '15px auto', lineHeight: '1.6'}}>
            Learn about Pranay & Abhishek's journey from a simple rural family to creating Agro Tech Harvest.
          </p>
          <Link to="/about" style={styles.storyBtn}>
              Read Our Story <FaArrowRight style={{marginLeft: '8px'}}/>
          </Link>
      </div>

      {/* --- CONTACT MODAL --- */}
      {showContact && (
        <div style={styles.modalOverlay}>
            <div style={styles.modalContent}>
            <button onClick={() => setShowContact(false)} style={styles.closeBtn}>×</button>
            <h2 style={{ color: '#27ae60', marginBottom: '20px' }}>Contact Us</h2>
            <div style={styles.contactRow}>
                <span style={{ fontSize: '24px' }}>📍</span> <p style={{margin: 0}}>Suryapet, Telangana</p>
            </div>
            <div style={styles.contactRow}>
                <span style={{ fontSize: '24px' }}>📞</span> <p style={{margin: 0}}>+91-9705116060</p>
            </div>
            <div style={styles.contactRow}>
                <span style={{ fontSize: '24px' }}>✉️</span> <p style={{margin: 0, wordBreak: 'break-all'}}>Agrotecharvest@gmail.com</p>
            </div>
            </div>
        </div>
      )}
    </div>
  );
};

// --- DYNAMIC STYLES FUNCTION ---
const getStyles = (isMobile, mobileMenuOpen) => ({
  container: { 
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif", 
    width: '100%', 
    overflowX: 'hidden',
    backgroundColor: '#fdfdfd'
  },
  
  // Header - Refactored for better mobile layout
  header: {
    display: 'flex', 
    flexDirection: isMobile ? 'column' : 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center',
    padding: isMobile ? '10px 15px' : '0 40px', 
    minHeight: '70px', 
    backgroundColor: 'white', 
    boxShadow: '0 2px 10px rgba(0,0,0,0.05)', 
    position: 'sticky', // Makes header stay at top
    top: 0,
    zIndex: 1000,
  },
  headerTopBar: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: isMobile ? '100%' : 'auto',
  },
  logoContainer: { display: 'flex', alignItems: 'center', gap: '10px' },
  brandName: { color: '#2c3e50', margin: 0, fontSize: isMobile ? '18px' : '24px', fontWeight: '700' },
  hamburgerBtn: { background: 'none', border: 'none', fontSize: '24px', color: '#2c3e50', cursor: 'pointer' },
  
  // Navigation Container - Handles Mobile Toggle
  navContainer: {
    display: isMobile ? (mobileMenuOpen ? 'flex' : 'none') : 'flex',
    flexDirection: isMobile ? 'column' : 'row',
    alignItems: 'center',
    width: isMobile ? '100%' : 'auto',
    gap: isMobile ? '20px' : '30px',
    paddingTop: isMobile ? '20px' : '0',
    paddingBottom: isMobile ? '20px' : '0',
    borderTop: isMobile ? '1px solid #eee' : 'none',
    marginTop: isMobile ? '10px' : '0'
  },
  nav: { 
    display: 'flex', 
    gap: isMobile ? '15px' : '25px', 
    alignItems: 'center',
    flexDirection: isMobile ? 'column' : 'row', 
  },
  authContainer: { 
    display: 'flex',
    flexDirection: isMobile ? 'column' : 'row',
    gap: isMobile ? '10px' : '0',
    alignItems: 'center',
    width: isMobile ? '100%' : 'auto'
  },
  navLink: { textDecoration: 'none', color: '#2c3e50', fontWeight: '500', fontSize: '16px', cursor: 'pointer', transition: 'color 0.2s' },
  navBtn: { background: 'none', border: 'none', color: '#2c3e50', fontWeight: '500', fontSize: '16px', cursor: 'pointer', fontFamily: 'inherit' },
  loginBtn: { marginRight: isMobile ? '0' : '20px', textDecoration: 'none', color: '#2c3e50', fontWeight: 'bold' },
  signupBtn: { padding: '10px 25px', backgroundColor: '#27ae60', color: 'white', textDecoration: 'none', borderRadius: '25px', fontWeight: 'bold', width: isMobile ? '100%' : 'auto', textAlign: 'center' },
  
  // Hero
  hero: { 
      textAlign: 'center', 
      backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url(${farmBg})`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      color: 'white',
      padding: isMobile ? '100px 20px' : '140px 20px', 
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center'
  },
  heroTitle: { 
      fontSize: isMobile ? '2.5rem' : '4rem', 
      marginBottom: '15px', 
      lineHeight: 1.1,
      textShadow: '2px 2px 4px rgba(0,0,0,0.6)' 
  },
  heroText: { 
      fontSize: isMobile ? '1.1rem' : '1.3rem', 
      maxWidth: '700px', 
      margin: '0 auto 30px',
      lineHeight: 1.5,
      textShadow: '1px 1px 2px rgba(0,0,0,0.6)' 
  },
  ctaButton: { 
      padding: '14px 35px', 
      backgroundColor: '#e67e22', 
      color: 'white', 
      fontSize: '1.1rem', 
      textDecoration: 'none', 
      borderRadius: '50px', 
      fontWeight: 'bold', 
      display: 'inline-block',
      boxShadow: '0 4px 15px rgba(230, 126, 34, 0.4)',
      transition: 'transform 0.2s'
  },

  // Section Generic
  section: {
    padding: isMobile ? '40px 15px' : '60px 20px',
    maxWidth: '1200px',
    margin: '0 auto',
    boxSizing: 'border-box'
  },
  sectionTitle: {
      textAlign: 'center', 
      color: '#2c3e50', 
      marginBottom: '40px',
      fontSize: isMobile ? '1.8rem' : '2.2rem'
  },
  
  // Smart Grid System
  productGrid: {
    display: 'grid',
    // Auto-fit creates as many columns as fit with min-width 280px.
    // This handles Mobile (1 col), Tablet (2 cols), Desktop (3+ cols) automatically.
    gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', 
    gap: '25px', 
    width: '100%',
    boxSizing: 'border-box'
  },
  productCard: {
    border: '1px solid #eaeaea',
    borderRadius: '12px',
    padding: '15px',
    boxShadow: '0 5px 15px rgba(0,0,0,0.05)', 
    backgroundColor: 'white',
    display: 'flex',
    flexDirection: 'column',
    transition: 'transform 0.2s',
    height: '100%'
  },
  imageWrapper: {
      width: '100%',
      height: '220px',
      marginBottom: '15px',
      overflow: 'hidden',
      borderRadius: '8px',
  },
  productImage: {
    width: '100%',
    height: '100%',
    objectFit: 'cover', 
    transition: 'transform 0.3s'
  },
  productTitle: { fontSize: '1.2rem', color: '#2c3e50', margin: '0 0 8px 0', fontWeight: '700' },
  productDesc: { fontSize: '0.95rem', color: '#666', marginBottom: '20px', flexGrow: 1, lineHeight: '1.5' }, 
  productFooter: { marginTop: 'auto' },
  cardBtn: { 
    display: 'block',
    width: '100%',
    padding: '12px 0', 
    backgroundColor: '#3498db', 
    color: 'white', 
    textDecoration: 'none', 
    borderRadius: '8px', 
    fontSize: '1rem', 
    fontWeight: '600',
    textAlign: 'center' 
  },
  loadingText: { textAlign: 'center', width: '100%', gridColumn: '1 / -1', padding: '20px', color: '#777' },

  // Trust Section
  trustSection: {
    backgroundColor: '#f8f9fa',
    padding: isMobile ? '50px 20px' : '70px 20px',
    textAlign: 'center'
  },
  trustGrid: {
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: isMobile ? '30px' : '50px',
    maxWidth: '1000px',
    margin: '0 auto'
  },
  trustBadge: {
    flex: '1 1 150px', // Allow badges to shrink/grow but default to 150px
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  iconCircle: {
    width: '70px',
    height: '70px',
    backgroundColor: 'white',
    borderRadius: '50%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    fontSize: '28px',
    color: '#27ae60',
    marginBottom: '15px',
    boxShadow: '0 5px 15px rgba(0,0,0,0.05)',
  },

  // Story Section
  storySection: {
    backgroundColor: '#2c3e50',
    color: 'white',
    textAlign: 'center',
    padding: isMobile ? '50px 20px' : '80px 20px',
  },
  storyBtn: {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: '20px',
    color: '#e67e22',
    textDecoration: 'none',
    fontWeight: 'bold',
    fontSize: '1.1rem',
    border: '2px solid #e67e22',
    padding: '10px 30px',
    borderRadius: '30px',
    backgroundColor: 'transparent'
  },

  // Modal
  modalOverlay: { position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.6)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 2000, padding: '15px' },
  modalContent: { backgroundColor: 'white', padding: isMobile ? '30px 20px' : '40px', borderRadius: '15px', position: 'relative', width: '100%', maxWidth: '400px', textAlign: 'center', boxShadow: '0 10px 30px rgba(0,0,0,0.2)' },
  closeBtn: { position: 'absolute', top: '10px', right: '15px', background: 'none', border: 'none', fontSize: '28px', cursor: 'pointer', color: '#aaa' },
  contactRow: { display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '15px', textAlign: 'left', padding: '12px', backgroundColor: '#f8f9fa', borderRadius: '8px' }
});

export default LandingPage;