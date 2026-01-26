import React from 'react'; // Removed useState/useEffect (Not needed for CSS Grid)
import { Link } from 'react-router-dom';
import logo from '../assets/logo.png'; 
import farmBg from '../assets/farm-bg.png'; 

const ShopPage = () => {
  return (
    <div style={styles.container}>
      {/* Hero Section */}
      <div style={styles.hero}>
        <div style={styles.heroContent}>
            <div style={styles.logoWrapper}>
                <img src={logo} alt="Agro Tech Harvest Logo" style={styles.logo} />
            </div>
            <h1 style={styles.title}>Welcome Back!</h1>
            <p style={styles.subtitle}>
              Fresh Vegetables & Pure Organic Powders delivered to your doorstep.
            </p>
        </div>
      </div>

      {/* Categories Section */}
      <div style={styles.categorySection}>
        <h2 style={styles.sectionHeader}>Start Shopping</h2>
        
        <div style={styles.gridContainer}>
          {/* Card 1: Vegetables */}
          <div style={styles.card}>
            <div style={styles.icon}>🥕</div>
            <h3>Fresh Vegetables</h3>
            <p style={styles.cardDesc}>Daily harvested organic veggies.</p>
            <Link to="/category/vegetables" style={styles.linkButton}>Browse Veggies</Link>
          </div>

          {/* Card 2: Powders */}
          <div style={styles.card}>
            <div style={styles.icon}>🥣</div>
            <h3>Raw Powders</h3>
            <p style={styles.cardDesc}>Pure turmeric, chilli, and more.</p>
            <Link to="/category/powders" style={styles.linkButton}>Browse Powders</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

// Internal CSS Styles
const styles = {
  container: {
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
    backgroundColor: 'white',
    paddingBottom: '50px',
    width: '100%',
    overflowX: 'hidden' // Prevents horizontal scroll on mobile
  },
  hero: {
    textAlign: 'center',
    backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.6)), url(${farmBg})`, 
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    color: 'white', 
    // Uses clamp() for responsive padding: Min 40px, Preferred 8vw, Max 80px
    padding: 'clamp(60px, 10vh, 100px) 20px', 
    marginBottom: '40px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center'
  },
  heroContent: {
    maxWidth: '800px',
    width: '100%'
  },
  logoWrapper: {
      display: 'flex', 
      justifyContent: 'center', 
      marginBottom: '15px'
  },
  logo: {
      width: 'clamp(60px, 15vw, 90px)', // Logo scales with screen width
      height: 'auto',
      backgroundColor: 'rgba(255,255,255,0.9)', 
      borderRadius: '50%',
      padding: '5px'
  },
  title: {
    // clamp(min, preferred, max) -> Responsive Font Size without Media Queries
    fontSize: 'clamp(2rem, 5vw, 3.5rem)', 
    color: 'white', 
    margin: '0 0 15px 0',
    textShadow: '2px 2px 4px rgba(0,0,0,0.5)',
    lineHeight: '1.2'
  },
  subtitle: {
    fontSize: 'clamp(1rem, 2.5vw, 1.4rem)',
    color: '#ecf0f1', 
    margin: 0,
    textShadow: '1px 1px 2px rgba(0,0,0,0.5)',
    maxWidth: '600px',
    margin: '0 auto'
  },
  categorySection: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '0 20px'
  },
  sectionHeader: { 
      textAlign: 'center', 
      color: '#2c3e50', 
      marginBottom: '40px',
      fontSize: 'clamp(1.5rem, 4vw, 2rem)'
  },
  
  // --- INDUSTRY STANDARD GRID ---
  gridContainer: {
    display: 'grid',
    // This magic line handles Mobile (1 col) -> Tablet (2 cols) automatically
    gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', 
    gap: '30px',
    justifyContent: 'center',
    padding: '10px' // Padding to prevent shadows being cut off
  },
  
  card: {
    border: '1px solid #eee',
    borderRadius: '15px',
    padding: '30px',
    textAlign: 'center',
    boxShadow: '0 8px 16px rgba(0,0,0,0.05)',
    backgroundColor: 'white',
    transition: 'transform 0.2s',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    height: '100%' // Ensures cards are same height
  },
  icon: {
      fontSize: '40px',
      marginBottom: '15px'
  },
  cardDesc: {
      color: '#666', 
      marginBottom: '25px', 
      lineHeight: '1.5',
      flexGrow: 1 // Pushes button to bottom
  },
  linkButton: {
    display: 'inline-block',
    width: '100%',
    marginTop: 'auto', // Sticks to bottom
    backgroundColor: '#e67e22',
    color: 'white',
    padding: '12px 0',
    borderRadius: '25px',
    textDecoration: 'none',
    fontWeight: 'bold',
    transition: 'background 0.3s'
  }
};

export default ShopPage;