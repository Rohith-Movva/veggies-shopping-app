import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaSearch, FaUser, FaShoppingCart, FaSignOutAlt, FaBars, FaTimes } from 'react-icons/fa';
import logo from '../assets/logo.png';
import API from '../api';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';

const Navbar = ({ user, cartCount, handleLogout }) => {
  const [showCategories, setShowCategories] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [allProducts, setAllProducts] = useState([]);
  const [searchResults, setSearchResults] = useState([]);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  
  const navRef = useRef();
  const navigate = useNavigate();

  const BACKEND_URL = window.location.hostname === 'localhost' 
    ? "http://localhost:5000" 
    : "https://veggies-shopping-app.onrender.com";

  useEffect(() => {
    const handleResize = () => {
        setIsMobile(window.innerWidth < 768);
        if (window.innerWidth >= 768) setIsMenuOpen(false);
    };
    window.addEventListener('resize', handleResize);
    const fetchProducts = async () => {
      try {
        const res = await API.get('/products');
        setAllProducts(res.data);
      } catch (err) { console.error("Error fetching products:", err); }
    };
    fetchProducts();
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useGSAP(() => {
    // Reveal everything except the forced logout button
    gsap.from(".nav-anim", {
      y: -20,
      opacity: 0,
      stagger: 0.1,
      duration: 0.8,
      ease: "power4.out"
    });
  }, { scope: navRef });

  const handleSearchChange = (e) => {
    const term = e.target.value;
    setSearchTerm(term);
    if (term.length > 0) {
      const results = allProducts.filter(product => 
        product.name.toLowerCase().includes(term.toLowerCase())
      );
      setSearchResults(results.slice(0, 5));
    } else { setSearchResults([]); }
  };

  const handleResultClick = (id) => {
    setSearchTerm('');
    setSearchResults([]);
    setIsMenuOpen(false);
    navigate(`/product/${id}`);
  };

  return (
    <nav ref={navRef} style={styles.navbar}>
      <style>{`
        .nav-link-heavy { position: relative; text-decoration: none; color: #fff; font-weight: 600; font-size: 0.9rem; letter-spacing: 1px; transition: color 0.3s; }
        .nav-link-heavy::after { content: ''; position: absolute; width: 0; height: 2px; bottom: -5px; left: 0; background-color: #27ae60; transition: width 0.3s; }
        .nav-link-heavy:hover::after { width: 100%; }
        .nav-link-heavy:hover { color: #27ae60; }
        
        /* High Visibility Logout */
        .logout-btn-heavy { 
          background: #e74c3c !important; 
          color: #fff !important; 
          border: none !important;
          padding: 8px 20px !important;
          border-radius: 50px !important;
          font-weight: 900 !important;
          transition: all 0.3s ease !important;
          display: flex !important;
          align-items: center !important;
          gap: 8px !important;
          cursor: pointer !important;
          opacity: 1 !important;
          transform: none !important;
        }

        .logout-btn-heavy:hover { 
          background: #fff !important; 
          color: #e74c3c !important; 
          box-shadow: 0 5px 15px rgba(231, 76, 60, 0.4);
        }

        .search-input-heavy:focus { width: 220px !important; border-color: #27ae60 !important; }
        
        @media (max-width: 768px) {
            .mobile-menu-active { transform: translateX(0) !important; }
        }
      `}</style>
      
      {/* 1. BRANDING */}
      <div className="nav-anim" style={styles.logoContainer}>
        <Link to="/" style={styles.logoLink} onClick={() => setIsMenuOpen(false)}>
          <img src={logo} alt="Logo" style={styles.logoImg} />
          <span style={styles.logoText}>AGRO TECH</span>
        </Link>
      </div>

      {/* 2. SEARCH */}
      <div className="nav-anim" style={styles.searchWrapper}>
        <div style={styles.searchBar}>
          <input 
            className="search-input-heavy"
            type="text" 
            placeholder="SEARCH..." 
            value={searchTerm}
            onChange={handleSearchChange}
            style={styles.searchInput}
          />
          <FaSearch style={{ color: '#888', cursor: 'pointer' }} />
        </div>
        
        {searchTerm && searchResults.length > 0 && (
          <div style={styles.searchResults}>
            {searchResults.map(product => (
              <div key={product._id} style={styles.searchItem} onClick={() => handleResultClick(product._id)}>
                <span>{product.name.toUpperCase()}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 3. DESKTOP LINKS */}
      {!isMobile && (
        <div style={styles.linksContainer}>
          <Link to="/" className="nav-link-heavy nav-anim">HOME</Link>
          
          <div className="nav-anim" 
               onMouseEnter={() => setShowCategories(true)} 
               onMouseLeave={() => setShowCategories(false)}
               style={{ position: 'relative', cursor: 'pointer' }}>
            <span className="nav-link-heavy">CATEGORIES ▾</span>
            {showCategories && (
              <div style={styles.dropdown}>
                <div style={styles.dropdownInner}>
                  <Link to="/category/vegetables" className="drop-item" style={styles.dropItem}>VEGETABLES</Link>
                  <Link to="/category/powders" className="drop-item" style={styles.dropItem}>RAW POWDERS</Link>
                </div>
              </div>
            )}
          </div>

          {user && user.isAdmin && (
            <Link to="/admin" className="nav-link-heavy nav-anim" style={{ color: '#e74c3c' }}>ADMIN</Link>
          )}

          <Link to="/profile" className="nav-link-heavy nav-anim"><FaUser /></Link>
          
          <Link to="/cart" className="nav-link-heavy nav-anim" style={styles.cartBtn}>
            <FaShoppingCart />
            {cartCount > 0 && <span style={styles.badge}>{cartCount}</span>}
          </Link>

          {/* 🔴 CONDITIONAL LOGOUT/LOGIN BUTTON */}
          {user ? (
            <button onClick={handleLogout} className="logout-btn-heavy">
              <FaSignOutAlt size={14} /> LOGOUT
            </button>
          ) : (
            <Link to="/login" className="nav-link-heavy nav-anim" style={{color: '#27ae60'}}>LOGIN</Link>
          )}
        </div>
      )}

      {/* 4. MOBILE TOGGLE */}
      {isMobile && (
        <button style={styles.menuBtn} onClick={() => setIsMenuOpen(!isMenuOpen)}>
          {isMenuOpen ? <FaTimes /> : <FaBars />}
        </button>
      )}

      {/* 5. MOBILE OVERLAY */}
      <div className={isMenuOpen ? "mobile-menu-active" : ""} style={styles.mobileNav}>
          <Link to="/" onClick={() => setIsMenuOpen(false)} style={styles.mobLink}>HOME</Link>
          <Link to="/category/vegetables" onClick={() => setIsMenuOpen(false)} style={styles.mobLink}>VEGETABLES</Link>
          <Link to="/category/powders" onClick={() => setIsMenuOpen(false)} style={styles.mobLink}>POWDERS</Link>
          
          {/* 🔴 CONDITIONAL MOBILE BUTTON */}
          {user ? (
            <button onClick={() => { handleLogout(); setIsMenuOpen(false); }} style={styles.mobLogout}>
               LOGOUT
            </button>
          ) : (
            <Link to="/login" onClick={() => setIsMenuOpen(false)} style={styles.mobLink}>LOGIN</Link>
          )}
      </div>
    </nav>
  );
};

const styles = {
  navbar: {
    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
    padding: '15px 50px', position: 'fixed', top: 0, width: '100%', zIndex: 1000,
    background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(20px)', borderBottom: '1px solid rgba(255,255,255,0.1)'
  },
  logoContainer: { display: 'flex', alignItems: 'center' },
  logoLink: { display: 'flex', alignItems: 'center', gap: '12px', textDecoration: 'none' },
  logoImg: { height: '35px', filter: 'brightness(1.2)' },
  logoText: { color: '#fff', fontSize: '1rem', fontWeight: '900', letterSpacing: '2px' },
  
  searchWrapper: { position: 'relative' },
  searchBar: { display: 'flex', alignItems: 'center', background: 'rgba(255,255,255,0.05)', padding: '8px 15px', borderRadius: '30px', border: '1px solid rgba(255,255,255,0.1)' },
  searchInput: { background: 'none', border: 'none', color: '#fff', outline: 'none', width: '150px', transition: 'width 0.4s ease', fontSize: '0.8rem', letterSpacing: '1px' },
  searchResults: { position: 'absolute', top: '100%', left: 0, width: '100%', background: '#111', borderRadius: '10px', marginTop: '10px', padding: '10px', boxShadow: '0 10px 30px rgba(0,0,0,0.5)' },
  searchItem: { padding: '10px', color: '#fff', cursor: 'pointer', fontSize: '0.7rem', borderBottom: '1px solid #222' },

  linksContainer: { display: 'flex', alignItems: 'center', gap: '30px' },
  cartBtn: { position: 'relative', display: 'flex', alignItems: 'center' },
  badge: { position: 'absolute', top: '-8px', right: '-12px', background: '#27ae60', color: '#fff', fontSize: '10px', padding: '2px 6px', borderRadius: '10px', fontWeight: 'bold' },
  
  dropdown: { position: 'absolute', top: '100%', left: 0, background: 'transparent', paddingTop: '15px', width: '180px', zIndex: 1001 },
  dropdownInner: { background: '#111', padding: '10px', borderRadius: '10px', display: 'flex', flexDirection: 'column', gap: '5px', border: '1px solid #222' },
  dropItem: { color: '#fff', textDecoration: 'none', fontSize: '0.8rem', letterSpacing: '1px', padding: '10px', borderRadius: '5px', transition: '0.3s' },

  menuBtn: { background: 'none', border: 'none', color: '#fff', fontSize: '1.5rem', cursor: 'pointer' },
  mobileNav: { position: 'fixed', top: 0, right: 0, height: '100vh', width: '250px', background: '#000', zIndex: 999, display: 'flex', flexDirection: 'column', padding: '100px 30px', gap: '30px', transform: 'translateX(100%)', transition: 'transform 0.5s cubic-bezier(0.16, 1, 0.3, 1)' },
  mobLink: { color: '#fff', textDecoration: 'none', fontSize: '1.2rem', fontWeight: 'bold' },
  mobLogout: { background: '#e74c3c', color: '#fff', border: 'none', padding: '15px', borderRadius: '10px', fontWeight: 'bold', cursor: 'pointer' }
};

export default Navbar;