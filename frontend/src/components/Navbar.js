import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaSearch, FaUser, FaShoppingCart, FaSignOutAlt, FaLock, FaBars, FaTimes } from 'react-icons/fa';
import logo from '../assets/logo.png';
import './Navbar.css';
import API from '../api';

const Navbar = ({ user, cartCount, handleLogout }) => {
  const [showCategories, setShowCategories] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [allProducts, setAllProducts] = useState([]);
  const [searchResults, setSearchResults] = useState([]);
  
  // --- RESPONSIVE STATES ---
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [isMenuOpen, setIsMenuOpen] = useState(false); // Controls the hamburger menu
  
  const navigate = useNavigate();

  const BACKEND_URL = window.location.hostname === 'localhost' 
    ? "http://localhost:5000" 
    : "https://veggies-shopping-app.onrender.com";

  // Handle Resize
  useEffect(() => {
    const handleResize = () => {
        setIsMobile(window.innerWidth < 768);
        if (window.innerWidth >= 768) {
            setIsMenuOpen(false); // Close menu if switching to desktop
        }
    };
    window.addEventListener('resize', handleResize);
    
    // Fetch Products
    const fetchProducts = async () => {
      try {
        const res = await API.get('/products');
        setAllProducts(res.data);
      } catch (err) {
        console.error("Error fetching products:", err);
      }
    };
    fetchProducts();

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleSearchChange = (e) => {
    const term = e.target.value;
    setSearchTerm(term);
    if (term.length > 0) {
      const results = allProducts.filter(product => 
        product.name.toLowerCase().includes(term.toLowerCase())
      );
      setSearchResults(results.slice(0, 5));
    } else {
      setSearchResults([]);
    }
  };

  const handleResultClick = (id) => {
    setSearchTerm('');
    setSearchResults([]);
    setIsMenuOpen(false); // Close menu on selection
    navigate(`/product/${id}`);
  };

  const handleLinkClick = () => {
      setIsMenuOpen(false); // Close menu when a link is clicked
  };

  return (
    <nav className="navbar">
      
      {/* --- 1. HEADER ROW (Logo + Hamburger) --- */}
      <div className="navbar-header">
        <div className="logo">
            <Link to="/shop" onClick={handleLinkClick} style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <img src={logo} alt="Agro Tech Harvest" className="logo-image" />
            <span className="logo-text">Agro Tech Harvest</span>
            </Link>
        </div>

        {/* Hamburger Icon (Only visible on Mobile) */}
        {isMobile && (
            <button className="menu-toggle" onClick={() => setIsMenuOpen(!isMenuOpen)}>
                {isMenuOpen ? <FaTimes /> : <FaBars />}
            </button>
        )}
      </div>

      {/* --- 2. SEARCH CONTAINER --- */}
      {/* On mobile, this moves to the next row (order: 2) */}
      <div className="search-container">
        <div className="search-bar">
          <input 
            type="text" 
            placeholder="Search products..." 
            value={searchTerm}
            onChange={handleSearchChange}
          />
          <button><FaSearch /></button>
        </div>
        
        {searchTerm && searchResults.length > 0 && (
          <div className="search-results">
            {searchResults.map(product => {
                const imageUrl = product.image.startsWith('http') 
                    ? product.image 
                    : `${BACKEND_URL}/images/${product.image}`;
                return (
                  <div key={product._id} className="search-item" onClick={() => handleResultClick(product._id)}>
                    <img src={imageUrl} alt={product.name} />
                    <span>{product.name}</span>
                  </div>
                );
            })}
          </div>
        )}
      </div>

      {/* --- 3. NAV LINKS --- */}
      {/* On mobile, these are hidden until toggled */}
      <div className={`nav-links ${isMenuOpen ? 'active' : ''}`}>
        <Link to="/shop" onClick={handleLinkClick}>Home</Link>
        
        <div 
          className="dropdown"
          // On mobile, click to toggle usually better, but hover works for now
          onClick={() => isMobile && setShowCategories(!showCategories)}
          onMouseEnter={() => !isMobile && setShowCategories(true)}
          onMouseLeave={() => !isMobile && setShowCategories(false)}
        >
          <span className="dropdown-title">Categories ▾</span>
          {(showCategories || (isMobile && showCategories)) && (
            <div className="dropdown-menu">
              <Link to="/category/vegetables" onClick={handleLinkClick}>Vegetables</Link>
              <Link to="/category/powders" onClick={handleLinkClick}>Raw Powders</Link>
            </div>
          )}
        </div>

        {user && user.isAdmin && (
          <div className="dropdown">
            <span className="dropdown-title" style={{ color: '#e74c3c' }}>
              <FaLock /> Admin ▾
            </span>
            <div className="dropdown-menu">
              <Link to="/admin" onClick={handleLinkClick}>Dashboard</Link>
              <Link to="/admin/inventory" onClick={handleLinkClick}>Inventory</Link>
            </div>
          </div>
        )}
        
        <Link to="/profile" className="icon-link" onClick={handleLinkClick}>
          <FaUser /> Profile
        </Link>
        
        <Link to="/cart" className="cart-btn" onClick={handleLinkClick}>
          <FaShoppingCart /> 
          Cart
          {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
        </Link>

        <button onClick={() => { handleLogout(); handleLinkClick(); }} className="logout-btn">
          <FaSignOutAlt /> Logout
        </button>
      </div>
    </nav>
  );
};

export default Navbar;