import React, { useState, useEffect, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { FaSeedling, FaArrowRight, FaSearch, FaArrowLeft } from 'react-icons/fa';
import Lenis from 'lenis';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import API from '../api';

gsap.registerPlugin(ScrollTrigger);

const CategoryPage = () => {
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const { categoryName } = useParams();
  const [loading, setLoading] = useState(true);
  
  const containerRef = useRef(null);
  const gridRef = useRef(null);

  const BACKEND_URL = window.location.hostname === 'localhost' 
    ? "http://localhost:5000" 
    : "https://veggies-shopping-app.onrender.com";

  // --- 1. DATA & SMOOTH SCROLL SETUP ---
  useEffect(() => {
    const lenis = new Lenis({ lerp: 0.1, smoothWheel: true });
    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    const fetchProducts = async () => {
      try {
        setLoading(true);
        const res = await API.get(`/products/category/${categoryName}`);
        setProducts(Array.isArray(res.data) ? res.data : []);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching products:", err);
        setLoading(false);
      }
    };

    fetchProducts();
    setSearchTerm('');

    return () => {
      lenis.destroy();
      ScrollTrigger.getAll().forEach(t => t.kill());
    };
  }, [categoryName]);

  // --- 2. STABLE ANIMATION ENGINE ---
  useGSAP(() => {
    if (loading) return;

    const ctx = gsap.context(() => {
      // Hide elements initially to prevent the "flicker"
      gsap.set(".product-card-heavy", { opacity: 0, y: 40 });

      // Refresh ScrollTrigger after a small delay to ensure images have started rendering
      setTimeout(() => {
        ScrollTrigger.refresh();
      }, 100);

      // Header Animation
      gsap.from(".header-anim", {
        y: -30,
        opacity: 0,
        duration: 1,
        stagger: 0.2,
        ease: "power4.out"
      });

      // Grid Animation
      if (products.length > 0) {
        gsap.to(".product-card-heavy", {
          y: 0,
          opacity: 1,
          duration: 1.2,
          stagger: 0.1,
          ease: "expo.out",
          clearProps: "transform", // This keeps the items visible and stable after animation
          scrollTrigger: {
            trigger: gridRef.current,
            start: "top 85%",
            toggleActions: "play none none none"
          }
        });
      }
    }, containerRef);

    return () => ctx.revert();
  }, [loading, products]);

  const renderImageSrc = (imgString) => {
    if (!imgString) return '';
    return imgString.startsWith('http') ? imgString : `${BACKEND_URL}/images/${imgString}`;
  };

  const filteredProducts = products.filter(product => 
    product.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div ref={containerRef} style={styles.container}>
      <style>{`
        .product-card-heavy:hover { transform: translateY(-15px) !important; }
        .product-card-heavy:hover img { transform: scale(1.1); }
        .search-input-heavy:focus { width: 350px !important; border-color: #27ae60 !important; }
        .details-link:hover { color: #27ae60 !important; border-color: #27ae60 !important; }
        .loading-shimmer { animation: shimmer 2s infinite linear; background: linear-gradient(to right, #f6f7f8 0%, #edeef1 20%, #f6f7f8 40%, #f6f7f8 100%); background-size: 800px 104px; }
        @keyframes shimmer { 0% { background-position: -468px 0; } 100% { background-position: 468px 0; } }
      `}</style>

      {/* --- TOP HEADER --- */}
      <div style={styles.topSection}>
        <div className="header-anim" style={styles.breadcrumb}>
           <Link to="/shop" style={styles.backBtn}><FaArrowLeft /> BACK TO SHOP</Link>
        </div>
        
        <div style={styles.headerRow}>
          <div style={{overflow: 'hidden'}}>
            <h1 className="header-anim" style={styles.title}>
              {categoryName?.toUpperCase()}<span style={{color: '#27ae60'}}>.</span>
            </h1>
          </div>

          {!loading && products.length > 0 && (
            <div className="header-anim" style={styles.searchBox}>
              <FaSearch style={styles.searchIcon} />
              <input 
                type="text" 
                placeholder={`FILTER ${categoryName?.toUpperCase()}...`} 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="search-input-heavy"
                style={styles.searchInput}
              />
            </div>
          )}
        </div>
      </div>
      
      {/* --- CONTENT SECTION --- */}
      <div style={styles.content}>
        {loading ? (
          <div style={styles.loader}>
             <h2 style={styles.loadingText}>COLLECTING HARVEST...</h2>
          </div>
        ) : products.length === 0 ? (
          
          <div className="header-anim" style={styles.emptyCard}>
              <div style={styles.iconCircle}><FaSeedling size={60} color="#27ae60" /></div>
              <h2 style={styles.emptyTitle}>FRESH BATCH COMING SOON</h2>
              <p style={styles.emptyText}>
                  We are currently sourcing the finest quality <strong>{categoryName}</strong> directly from our partner farms. 
              </p>
              <div style={styles.buttonGroup}>
                  <Link to="/shop" style={styles.secondaryBtn}>RETURN TO SHOP</Link>
                  <Link to="/category/powders" style={styles.primaryBtn}>EXPLORE POWDERS <FaArrowRight /></Link>
              </div>
          </div>

        ) : (
          <div ref={gridRef} style={styles.productGrid}>
            {filteredProducts.length > 0 ? (
              filteredProducts.map((product) => (
                <div key={product._id} className="product-card-heavy" style={styles.card}>
                  <div style={styles.imageWrapper}>
                    <img 
                      src={renderImageSrc(product.image)} 
                      alt={product.name} 
                      style={styles.image} 
                      loading="lazy"
                    />
                  </div>
                  
                  <div style={styles.cardInfo}>
                    <h3 style={styles.productName}>{product.name.toUpperCase()}</h3>
                    <p style={styles.productDesc}>{product.description?.substring(0, 70)}...</p>
                    <div style={styles.cardFooter}>
                       <span style={styles.price}>₹{product.price}</span>
                       <Link to={`/product/${product._id}`} className="details-link" style={styles.detailsButton}>
                         VIEW DETAILS
                       </Link>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div style={styles.noResults}>
                <h3>No results found for "{searchTerm}"</h3>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

// --- STYLES (Heavy UI Theme) ---
const styles = {
  container: { background: '#fff', color: '#000', minHeight: '100vh', paddingTop: '160px' },
  topSection: { maxWidth: '1400px', margin: '0 auto', padding: '0 60px 40px' },
  backBtn: { textDecoration: 'none', color: '#aaa', fontSize: '0.7rem', fontWeight: '900', letterSpacing: '2px', display: 'flex', alignItems: 'center', gap: '10px' },
  
  headerRow: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '20px' },
  title: { fontSize: '5rem', fontWeight: '900', margin: 0, letterSpacing: '-2px', color: '#1b4332', lineHeight: 1 },
  
  searchBox: { position: 'relative', display: 'flex', alignItems: 'center' },
  searchIcon: { position: 'absolute', left: '20px', color: '#aaa', zIndex: 5 },
  searchInput: { 
    padding: '18px 20px 18px 55px', width: '280px', borderRadius: '40px', border: '1px solid #eee', 
    background: '#fcfcfc', fontSize: '0.75rem', fontWeight: 'bold', outline: 'none', transition: 'all 0.4s ease' 
  },

  content: { maxWidth: '1400px', margin: '0 auto', padding: '0 60px 100px' },
  productGrid: { 
    display: 'grid', 
    gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', 
    gap: '40px' 
  },
  
  card: { background: '#fff', borderRadius: '30px', border: '1px solid #f0f0f0', overflow: 'hidden', transition: '0.6s cubic-bezier(0.16, 1, 0.3, 1)' },
  imageWrapper: { width: '100%', height: '320px', overflow: 'hidden', background: '#f9f9f9' },
  image: { width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 1.2s cubic-bezier(0.16, 1, 0.3, 1)' },
  
  cardInfo: { padding: '30px' },
  productName: { fontSize: '1.2rem', fontWeight: '900', color: '#1b4332', marginBottom: '10px' },
  productDesc: { fontSize: '0.85rem', color: '#777', lineHeight: '1.6', marginBottom: '25px', height: '45px' },
  cardFooter: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '20px', borderTop: '1px solid #f5f5f5' },
  price: { fontSize: '1.5rem', fontWeight: '300', color: '#1b4332' },
  detailsButton: { textDecoration: 'none', color: '#000', fontSize: '0.7rem', fontWeight: '900', letterSpacing: '1px', borderBottom: '2px solid #000', transition: '0.3s' },

  emptyCard: { textAlign: 'center', padding: '80px 40px', background: '#fcfcfc', borderRadius: '40px', border: '1px dashed #eee' },
  iconCircle: { width: '100px', height: '100px', background: '#fff', borderRadius: '50%', display: 'flex', justifyContent: 'center', alignItems: 'center', margin: '0 auto 30px', boxShadow: '0 10px 30px rgba(0,0,0,0.03)' },
  emptyTitle: { fontSize: '2rem', fontWeight: '900', color: '#1b4332' },
  emptyText: { color: '#888', maxWidth: '450px', margin: '15px auto 40px', lineHeight: '1.7' },
  buttonGroup: { display: 'flex', justifyContent: 'center', gap: '20px' },
  primaryBtn: { background: '#27ae60', color: '#fff', padding: '18px 35px', borderRadius: '50px', textDecoration: 'none', fontWeight: '900', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '10px' },
  secondaryBtn: { background: '#fff', color: '#000', padding: '18px 35px', borderRadius: '50px', textDecoration: 'none', fontWeight: '900', fontSize: '0.8rem', border: '1px solid #eee' },

  loader: { height: '50vh', display: 'flex', justifyContent: 'center', alignItems: 'center' },
  loadingText: { fontSize: '1rem', fontWeight: '900', letterSpacing: '8px', color: '#ddd' },
  noResults: { gridColumn: '1/-1', textAlign: 'center', padding: '100px 0', color: '#aaa', letterSpacing: '2px' }
};

export default CategoryPage;