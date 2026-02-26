import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { FaArrowLeft } from 'react-icons/fa';
import Lenis from 'lenis';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import API from '../api'; 

gsap.registerPlugin(ScrollTrigger);

const AllProductsPage = () => {
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const containerRef = useRef();
  const gridRef = useRef();

  const BACKEND_URL = window.location.hostname === 'localhost' 
    ? "http://localhost:5000" 
    : "https://veggies-shopping-app.onrender.com"; 

  useEffect(() => {
    const lenis = new Lenis({ duration: 1.2 });
    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    const fetchProducts = async () => {
      try {
        const { data } = await API.get('/products');
        const productList = Array.isArray(data) ? data : data.products || [];
        const powderList = productList.filter(p => p.category && p.category.toLowerCase() === 'powders');
        setProducts(powderList);
        setIsLoading(false);
      } catch (err) {
        console.error("Failed to load products", err);
        setIsLoading(false);
      }
    };
    fetchProducts();

    return () => lenis.destroy();
  }, []);

  useGSAP(() => {
    if (!isLoading) {
      // Reveal the Header content (Title & Subtitle) with a nice slide up
      gsap.from(".reveal-header-content", {
        y: 40,
        opacity: 0,
        duration: 1.2,
        stagger: 0.2,
        ease: "power4.out"
      });

      // Staggered reveal for the product cards
      gsap.from(".product-card-heavy", {
        y: 60,
        opacity: 0,
        duration: 1,
        stagger: 0.1,
        ease: "power4.out",
        scrollTrigger: {
          trigger: gridRef.current,
          start: "top 90%", 
        }
      });

      const backBtn = document.querySelector('.back-magnetic');
      if (backBtn) {
        backBtn.addEventListener('mousemove', (e) => {
          const rect = backBtn.getBoundingClientRect();
          const x = (e.clientX - rect.left - rect.width / 2) * 0.4;
          const y = (e.clientY - rect.top - rect.height / 2) * 0.4;
          gsap.to(backBtn, { x, y, duration: 0.3 });
        });
        backBtn.addEventListener('mouseleave', () => {
          gsap.to(backBtn, { x: 0, y: 0, duration: 0.5, ease: "elastic.out(1, 0.3)" });
        });
      }
    }
  }, [isLoading]);

  const renderImageSrc = (imgString) => {
      if (!imgString) return '';
      if (imgString.startsWith('http')) return imgString;
      return `${BACKEND_URL}/images/${imgString}`;
  };

  return (
    <div ref={containerRef} style={styles.container}>
      <style>{`
        .product-card-heavy { transition: transform 0.6s cubic-bezier(0.16, 1, 0.3, 1); }
        .product-card-heavy:hover { transform: translateY(-15px); }
        .product-card-heavy:hover img { transform: scale(1.1); }
        .mask { overflow: hidden; display: inline-block; }
      `}</style>

      {/* --- HEADER SECTION (This is what we pushed down) --- */}
      <section style={styles.topContentWrapper}>
        <div className="reveal-header-content" style={styles.backButtonRow}>
          <div className="back-magnetic">
            <Link to="/" style={styles.backLink}>
              <FaArrowLeft /> <span>Back to Home</span>
            </Link>
          </div>
        </div>

        <div style={styles.titleContainer}>
          <div className="mask">
            <h1 className="reveal-header-content" style={styles.pageTitle}>THE COLLECTION</h1>
          </div>
          <div className="mask">
            <p className="reveal-header-content" style={styles.subTitle}>Nature's Purity, Delivered.</p>
          </div>
        </div>
      </section>

      {/* --- PRODUCT GRID --- */}
      <div style={styles.section}>
        {isLoading ? (
          <div style={styles.loader}>
             <div className="mask"><h2 style={styles.loadingText}>PREPARING HARVEST...</h2></div>
          </div>
        ) : (
          <div ref={gridRef} style={styles.productGrid}>
            {products.length > 0 ? (
              products.map((product) => (
                <div key={product._id} className="product-card-heavy" style={styles.productCard}>
                  <div style={styles.imageWrapper}>
                      <img 
                          src={renderImageSrc(product.image)} 
                          alt={product.name} 
                          style={styles.productImage} 
                      />
                  </div>
                  
                  <div style={styles.cardContent}>
                    <span style={styles.categoryTag}>{product.category}</span>
                    <h3 style={styles.productTitle}>{product.name}</h3>
                    <p style={styles.productDesc}>
                      {product.description ? product.description.substring(0, 60) : 'Premium organic powder...'}...
                    </p>
                    <div style={styles.productFooter}>
                      <Link to={`/product/${product._id}`} style={styles.cardBtn}>
                        VIEW DETAILS
                      </Link>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <p style={styles.noProductsText}>No products found at the moment.</p>
            )}
          </div>
        )}
      </div>

      <footer style={styles.simpleFooter}></footer>
    </div>
  );
};

const styles = {
  container: { 
    background: '#fff', 
    color: '#000', 
    minHeight: '100vh', 
    overflowX: 'hidden',
  },
  // --- NEW TOP WRAPPER TO CLEAR YOUR NAVBAR ---
  topContentWrapper: {
    paddingTop: '180px', // Pushes everything down to clear the fixed navbar
    paddingBottom: '40px',
    textAlign: 'center',
    maxWidth: '1400px',
    margin: '0 auto',
    paddingLeft: '60px',
    paddingRight: '60px'
  },
  backButtonRow: {
    display: 'flex',
    justifyContent: 'flex-start',
    marginBottom: '40px'
  },
  backLink: { 
    textDecoration: 'none', 
    color: '#000', 
    fontWeight: '900', 
    fontSize: '0.75rem', 
    letterSpacing: '2px', 
    display: 'flex', 
    alignItems: 'center', 
    gap: '10px' 
  },
  titleContainer: {
    textAlign: 'center',
  },
  pageTitle: { 
    margin: 0, 
    fontSize: '4.5rem', // Big, Heavy UI Typography
    fontWeight: '900', 
    letterSpacing: '-2px',
    lineHeight: 1
  },
  subTitle: { 
    margin: '15px 0 0 0', 
    fontSize: '0.9rem', 
    color: '#888', 
    textTransform: 'uppercase', 
    letterSpacing: '4px' 
  },

  section: { 
    padding: '60px 60px 100px', 
    maxWidth: '1400px', 
    margin: '0 auto' 
  },
  productGrid: { 
    display: 'grid', 
    gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', 
    gap: '50px' 
  },
  
  productCard: { 
    background: '#fcfcfc', 
    borderRadius: '30px', 
    overflow: 'hidden', 
    border: '1px solid #f0f0f0',
  },
  imageWrapper: { width: '100%', height: '320px', overflow: 'hidden' },
  productImage: { width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 1s cubic-bezier(0.16, 1, 0.3, 1)' },
  
  cardContent: { padding: '35px', textAlign: 'center' },
  categoryTag: { fontSize: '0.7rem', fontWeight: '900', color: '#27ae60', letterSpacing: '2px' },
  productTitle: { fontSize: '1.4rem', margin: '10px 0', fontWeight: '800' },
  productDesc: { fontSize: '0.9rem', color: '#666', lineHeight: '1.6', marginBottom: '30px' },
  cardBtn: { 
    display: 'inline-block', 
    padding: '12px 35px', 
    border: '1px solid #000', 
    color: '#000', 
    textDecoration: 'none', 
    borderRadius: '40px', 
    fontSize: '0.8rem', 
    fontWeight: 'bold', 
    transition: '0.3s' 
  },
  
  loader: { height: '60vh', display: 'flex', justifyContent: 'center', alignItems: 'center' },
  loadingText: { fontSize: '1.5rem', fontWeight: '300', letterSpacing: '5px' },
  noProductsText: { textAlign: 'center', gridColumn: '1 / -1', color: '#999', fontSize: '1.2rem' },
  simpleFooter: { textAlign: 'center', padding: '60px', color: '#ccc', fontSize: '0.7rem', letterSpacing: '1px' }
};

export default AllProductsPage;