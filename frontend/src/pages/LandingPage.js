import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaLeaf, FaFlask, FaCertificate, FaBan, FaArrowRight } from 'react-icons/fa'; // 🔴 NEW ICONS
import logo from '../assets/logo.png';
import farmBg from '../assets/farm-bg.png'; // 🔴 IMPORT YOUR IMAGE HERE
import API from '../api'; 

const LandingPage = () => {
  const [showContact, setShowContact] = useState(false);
  const [powders, setPowders] = useState([]);

  // --- 1. RESPONSIVE STATE ---
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  // Backend URL for images
  const BACKEND_URL = "http://localhost:5000"; 

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    
    const fetchPowders = async () => {
      try {
        const { data } = await API.get('/products');
        const powderList = data.filter(p => p.category.toLowerCase() === 'powders');
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

  const styles = getStyles(isMobile);

  return (
    <div style={styles.container}>
      
      {/* --- HEADER --- */}
      <header style={styles.header}>
        <div style={styles.logoContainer}>
          <img src={logo} alt="Logo" style={{ height: '50px' }} />
          <h1 style={{ color: '#2c3e50', margin: 0, fontSize: '24px' }}>Agro Tech Harvest</h1>
        </div>

        <nav style={styles.nav}>
          <Link to="/" style={styles.navLink}>Home</Link>
          <Link to="/about" style={{...styles.navLink, textDecoration: 'none'}}>About Us</Link>
          <button onClick={() => setShowContact(true)} style={styles.navBtn}>Contact Us</button>
        </nav>

        <div style={styles.authContainer}>
          <Link to="/login" style={styles.loginBtn}>Login</Link>
          <Link to="/signup" style={styles.signupBtn}>Sign Up</Link>
        </div>
      </header>

      {/* --- HERO SECTION (Updated with Image) --- */}
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
        <h2 style={{ textAlign: 'center', color: '#2c3e50', marginBottom: '40px' }}>
          ✨ Our Premium Selections
        </h2>
        
        {/* THE GRID CONTAINER */}
        <div style={styles.productGrid}>
          {powders.length > 0 ? (
            powders.map((product) => (
              <div key={product._id} style={styles.productCard}>
                
                <img 
                    src={renderImageSrc(product.image)} 
                    alt={product.name} 
                    style={styles.productImage} 
                />
                
                <h3 style={styles.productTitle}>{product.name}</h3>
                
                <p style={styles.productDesc}>
                  {product.description.substring(0, 50)}...
                </p>
                
                <div style={styles.productFooter}>
                  <Link to={`/product/${product._id}`} style={styles.cardBtn}>View Details</Link>
                </div>
              </div>
            ))
          ) : (
            <p style={{ textAlign: 'center', width: '100%', gridColumn: '1 / -1' }}>
              Loading products...
            </p>
          )}
        </div>
      </div>

      {/* --- TRUST BADGES SECTION (New) --- */}
      <div style={styles.trustSection}>
        <h2 style={{color: '#2c3e50', marginBottom: '40px'}}>Our Promise of Purity</h2>
        <div style={styles.trustGrid}>
            
            {/* Badge 1 */}
            <div style={styles.trustBadge}>
                <div style={styles.iconCircle}>
                    <FaFlask />
                </div>
                <h3>Lab Tested</h3>
                <p>Every batch tested for purity</p>
            </div>

            {/* Badge 2 */}
            <div style={styles.trustBadge}>
                <div style={styles.iconCircle}>
                    <FaCertificate />
                </div>
                <h3>FSSAI Certified</h3>
                <p>100% Compliant & Safe</p>
            </div>

            {/* Badge 3 */}
            <div style={styles.trustBadge}>
                <div style={styles.iconCircle}>
                    <FaLeaf />
                </div>
                <h3>100% Organic</h3>
                <p>No chemicals, nature only</p>
            </div>

            {/* Badge 4 */}
            <div style={styles.trustBadge}>
                <div style={styles.iconCircle}>
                    <FaBan />
                </div>
                <h3>Non-GMO</h3>
                <p>Authentic native seeds</p>
            </div>

        </div>
      </div>

      {/* --- QUICK LINK / BOTTOM CTA --- */}
      <div style={styles.storySection}>
          <h2>Discover Our Roots</h2>
          <p>Learn about Pranay & Abhishek's journey from a simple rural family to Agro Tech Harvest.</p>
          <Link to="/about" style={styles.storyBtn}>
              Read Our Story <FaArrowRight />
          </Link>
      </div>

      {/* --- CONTACT MODAL --- */}
      {showContact && (
        <div style={styles.modalOverlay}>
            <div style={styles.modalContent}>
            <button onClick={() => setShowContact(false)} style={styles.closeBtn}>×</button>
            <h2 style={{ color: '#27ae60', marginBottom: '20px' }}>Contact Us</h2>
            <div style={styles.contactRow}>
                <span style={{ fontSize: '24px' }}>📍</span> <p>Suryapet, Telangana</p>
            </div>
            <div style={styles.contactRow}>
                <span style={{ fontSize: '24px' }}>📞</span> <p>+91-9705116060</p>
            </div>
            <div style={styles.contactRow}>
                <span style={{ fontSize: '24px' }}>✉️</span> <p>Agrotecharvest@gmail.com</p>
            </div>
            </div>
        </div>
      )}
    </div>
  );
};

// --- DYNAMIC STYLES FUNCTION ---
const getStyles = (isMobile) => ({
  container: { fontFamily: 'Arial, sans-serif', width: '100%', overflowX: 'hidden' },
  
  // Header
  header: {
    display: 'flex', 
    flexDirection: isMobile ? 'column' : 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center',
    padding: isMobile ? '20px' : '0 40px', 
    minHeight: '80px', 
    backgroundColor: 'white', 
    boxShadow: '0 2px 5px rgba(0,0,0,0.05)', 
    position: 'relative', 
    zIndex: 100,
    gap: isMobile ? '15px' : '0'
  },
  logoContainer: { display: 'flex', alignItems: 'center', gap: '10px' },
  nav: { 
    display: 'flex', 
    gap: '25px', 
    alignItems: 'center',
    flexDirection: 'row', 
    flexWrap: 'wrap',
    justifyContent: 'center'
  },
  authContainer: { marginTop: isMobile ? '10px' : '0' },
  navLink: { textDecoration: 'none', color: '#2c3e50', fontWeight: 'bold', fontSize: '16px', cursor: 'pointer' },
  navBtn: { background: 'none', border: 'none', color: '#2c3e50', fontWeight: 'bold', fontSize: '16px', cursor: 'pointer', fontFamily: 'inherit' },
  loginBtn: { marginRight: '20px', textDecoration: 'none', color: '#2c3e50', fontWeight: 'bold' },
  signupBtn: { padding: '10px 20px', backgroundColor: '#27ae60', color: 'white', textDecoration: 'none', borderRadius: '5px', fontWeight: 'bold' },
  
  // 🔴 UPDATED HERO SECTION with Background Image
  hero: { 
      textAlign: 'center', 
      // This gradient creates the "Shaded" effect so white text is readable
      backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url(${farmBg})`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      color: 'white',
      padding: isMobile ? '80px 15px' : '120px 20px', 
  },
  heroTitle: { 
      fontSize: isMobile ? '2.5rem' : '4rem', 
      marginBottom: '20px', 
      textShadow: '2px 2px 4px rgba(0,0,0,0.5)' // Text shadow for better readability
  },
  heroText: { 
      fontSize: isMobile ? '1rem' : '1.3rem', 
      maxWidth: '700px', 
      margin: '0 auto 40px',
      textShadow: '1px 1px 2px rgba(0,0,0,0.5)' 
  },
  ctaButton: { 
      padding: '15px 40px', 
      backgroundColor: '#e67e22', 
      color: 'white', 
      fontSize: '1.2rem', 
      textDecoration: 'none', 
      borderRadius: '30px', 
      fontWeight: 'bold', 
      display: 'inline-block',
      boxShadow: '0 4px 15px rgba(230, 126, 34, 0.4)'
  },

  // --- GRID SECTION STYLES ---
  section: {
    padding: '60px 20px',
    backgroundColor: 'white',
    maxWidth: '1200px',
    margin: '0 auto'
  },
  productGrid: {
    display: 'grid',
    gridTemplateColumns: isMobile ? '1fr' : 'repeat(3, 1fr)', 
    gap: '30px', 
    width: '100%',
    padding: '10px'
  },
  productCard: {
    border: '1px solid #eee',
    borderRadius: '10px',
    padding: '15px',
    boxShadow: '0 4px 8px rgba(0,0,0,0.08)', 
    backgroundColor: 'white',
    textAlign: 'center',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    height: '100%', 
    minHeight: '350px'
  },
  productImage: {
    width: '100%',
    height: '200px',
    objectFit: 'cover', 
    borderRadius: '8px',
    marginBottom: '15px'
  },
  productTitle: { fontSize: '18px', color: '#34495e', margin: '0 0 10px 0', fontWeight: 'bold' },
  productDesc: { fontSize: '14px', color: '#777', marginBottom: '15px', flexGrow: 1 }, 
  productFooter: { marginTop: 'auto' },
  cardBtn: { 
    display: 'block',
    width: '100%',
    padding: '10px 0', 
    backgroundColor: '#3498db', 
    color: 'white', 
    textDecoration: 'none', 
    borderRadius: '5px', 
    fontSize: '14px', 
    fontWeight: 'bold' 
  },

  // 🔴 NEW: TRUST SECTION STYLES
  trustSection: {
    backgroundColor: '#f9f9f9',
    padding: '60px 20px',
    textAlign: 'center'
  },
  trustGrid: {
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: '40px',
    maxWidth: '1000px',
    margin: '0 auto'
  },
  trustBadge: {
    flex: '1 1 200px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: '20px',
  },
  iconCircle: {
    width: '80px',
    height: '80px',
    backgroundColor: 'white',
    borderRadius: '50%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    fontSize: '32px',
    color: '#27ae60',
    marginBottom: '15px',
    boxShadow: '0 5px 15px rgba(0,0,0,0.05)',
    border: '1px solid #e1e1e1'
  },

  // 🔴 NEW: BOTTOM STORY SECTION
  storySection: {
    backgroundColor: '#2c3e50',
    color: 'white',
    textAlign: 'center',
    padding: '50px 20px',
  },
  storyBtn: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '10px',
    marginTop: '20px',
    color: '#e67e22',
    textDecoration: 'none',
    fontWeight: 'bold',
    fontSize: '18px',
    border: '2px solid #e67e22',
    padding: '10px 25px',
    borderRadius: '30px',
    transition: 'all 0.3s'
  },

  // Modal
  modalOverlay: { position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 2000, padding: '20px' },
  modalContent: { backgroundColor: 'white', padding: '40px', borderRadius: '10px', position: 'relative', width: isMobile ? '100%' : '400px', textAlign: 'center', boxShadow: '0 5px 15px rgba(0,0,0,0.2)' },
  closeBtn: { position: 'absolute', top: '10px', right: '15px', background: 'none', border: 'none', fontSize: '24px', cursor: 'pointer' },
  contactRow: { display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '15px', textAlign: 'left', padding: '10px', backgroundColor: '#f9f9f9', borderRadius: '5px' }
});

export default LandingPage;