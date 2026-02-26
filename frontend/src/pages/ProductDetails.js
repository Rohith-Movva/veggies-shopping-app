import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FaArrowLeft, FaPlus, FaMinus, FaUtensils, FaIndustry } from 'react-icons/fa';
import Lenis from 'lenis';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import API from '../api';

gsap.registerPlugin(ScrollTrigger);

const ProductDetails = ({ addToCart }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [isLoading, setIsLoading] = useState(true);

  const mainRef = useRef(null);

  const BACKEND_URL = window.location.hostname === 'localhost' 
    ? "http://localhost:5000" 
    : "https://veggies-shopping-app.onrender.com";

  useEffect(() => {
    const lenis = new Lenis({ lerp: 0.1 });
    function raf(time) { lenis.raf(time); requestAnimationFrame(raf); }
    requestAnimationFrame(raf);

    const fetchProduct = async () => {
      try {
        const res = await API.get('/products');
        const list = Array.isArray(res.data) ? res.data : res.data.products || [];
        const found = list.find(p => p._id === id);
        if (found) setProduct(found);
        setIsLoading(false);
      } catch (err) {
        console.error(err);
        setIsLoading(false);
      }
    };
    fetchProduct();
    return () => lenis.destroy();
  }, [id]);

  useGSAP(() => {
    if (isLoading || !product) return;

    const ctx = gsap.context(() => {
      // Set initial states to prevent flickering
      gsap.set(".reveal-item", { opacity: 0, y: 30 });

      gsap.to(".reveal-item", {
        opacity: 1,
        y: 0,
        duration: 1,
        stagger: 0.15,
        ease: "power4.out",
        clearProps: "transform", // ONLY clear transform, keep opacity: 1
        onComplete: () => {
          ScrollTrigger.refresh();
        }
      });
    }, mainRef);

    return () => ctx.revert(); 
  }, [isLoading, product]);

  if (isLoading) return <div style={styles.loader}>LOADING...</div>;
  if (!product) return <div style={styles.loader}>PRODUCT NOT FOUND</div>;

  const isOutOfStock = product.stock === 0;
  const imageSrc = product.image?.startsWith('http') ? product.image : `${BACKEND_URL}/images/${product.image}`;

  return (
    <div ref={mainRef} style={styles.page}>
      <style>{`
        .qty-btn:hover { background: #2d6a4f !important; color: white !important; }
        .main-btn:hover { transform: translateY(-3px); box-shadow: 0 10px 20px rgba(27, 67, 50, 0.2); }
        
        /* Responsive Fix: Only stack on small mobile screens */
        @media (max-width: 900px) {
          .grid-container { grid-template-columns: 1fr !important; gap: 40px !important; }
          .img-wrapper-heavy { height: 400px !important; }
        }
      `}</style>

      <nav style={styles.nav}>
        <button onClick={() => navigate(-1)} style={styles.backBtn}>
          <FaArrowLeft /> BACK TO SHOP
        </button>
      </nav>

      {/* CHANGED TO GRID SYSTEM FOR STABILITY */}
      <div className="grid-container" style={styles.grid}>
        
        {/* LEFT COLUMN: IMAGE */}
        <div className="reveal-item" style={styles.leftCol}>
          <div className="img-wrapper-heavy" style={styles.imgWrapper}>
            <img src={imageSrc} alt={product.name} style={styles.img} />
          </div>
        </div>

        {/* RIGHT COLUMN: CONTENT */}
        <div style={styles.rightCol}>
          <span className="reveal-item" style={styles.category}>{product.category?.toUpperCase()}</span>
          <h1 className="reveal-item" style={styles.title}>{product.name?.toUpperCase()}</h1>
          
          <div className="reveal-item" style={styles.priceRow}>
            <span style={styles.price}>₹{product.price}</span>
            <span style={isOutOfStock ? styles.outStock : styles.inStock}>
               {isOutOfStock ? "• UNAVAILABLE" : "• IN STOCK"}
            </span>
          </div>

          <p className="reveal-item" style={styles.desc}>{product.description}</p>

          <div className="reveal-item" style={styles.infoGrid}>
             <div style={styles.infoBox}>
                <FaUtensils color="#2d6a4f" />
                <div><strong style={styles.label}>USAGE</strong><p style={styles.smallP}>{product.usageInfo || "Mix with water or meals."}</p></div>
             </div>
             <div style={styles.infoBox}>
                <FaIndustry color="#2d6a4f" />
                <div><strong style={styles.label}>SOURCE</strong><p style={styles.smallP}>{product.manufacturingInfo || "Organic Certified"}</p></div>
             </div>
          </div>

          <div className="reveal-item" style={styles.actionRow}>
            {!isOutOfStock && (
              <div style={styles.qtyBox}>
                <button className="qty-btn" onClick={() => setQuantity(q => Math.max(1, q-1))} style={styles.qBtn}>-</button>
                <span style={{fontWeight:'900', width: '40px', textAlign:'center'}}>{quantity}</span>
                <button className="qty-btn" onClick={() => setQuantity(q => q+1)} style={styles.qBtn}>+</button>
              </div>
            )}
            
            <button 
              className="main-btn"
              onClick={() => !isOutOfStock && addToCart(product, quantity)}
              style={{
                ...styles.mainBtn,
                background: isOutOfStock ? '#d68c45' : '#1b4332',
              }}
            >
              {isOutOfStock ? "NOTIFY ME" : `ADD TO CART • ₹${product.price * quantity}`}
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};

const styles = {
  page: { background: '#fff', minHeight: '100vh', paddingTop: '160px', paddingBottom: '100px' },
  loader: { height: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center', fontWeight: '900', color: '#1b4332' },
  nav: { position: 'fixed', top: 0, width: '100%', padding: '40px 60px', zIndex: 100, background: 'rgba(255,255,255,0.8)', backdropFilter: 'blur(20px)' },
  backBtn: { background: 'none', border: 'none', fontWeight: '900', fontSize: '0.7rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '10px', color: '#1b4332' },
  
  // FIXED GRID SYSTEM (Prevents content dropping down)
  grid: { 
    maxWidth: '1300px', 
    margin: '0 auto', 
    display: 'grid', 
    gridTemplateColumns: '1fr 1fr', // Force 50/50 split
    gap: '80px', 
    padding: '0 40px',
    alignItems: 'start'
  },

  leftCol: { width: '100%' },
  imgWrapper: { width: '100%', height: '650px', borderRadius: '40px', overflow: 'hidden', boxShadow: '0 30px 60px rgba(0,0,0,0.06)' },
  img: { width: '100%', height: '100%', objectFit: 'cover' },
  
  rightCol: { display: 'flex', flexDirection: 'column', gap: '25px' },
  category: { color: '#2d6a4f', fontWeight: '900', letterSpacing: '3px', fontSize: '0.75rem' },
  title: { fontSize: '4.5rem', fontWeight: '900', lineHeight: '0.9', margin: 0, color: '#1b4332', letterSpacing: '-2px' },
  priceRow: { display: 'flex', alignItems: 'center', gap: '25px' },
  price: { fontSize: '2.5rem', fontWeight: '300', color: '#1b4332' },
  inStock: { color: '#2d6a4f', fontSize: '0.7rem', fontWeight: '900', letterSpacing: '1px' },
  outStock: { color: '#d68c45', fontSize: '0.7rem', fontWeight: '900', letterSpacing: '1px' },
  desc: { color: '#555', lineHeight: '1.7', fontSize: '1.1rem', maxWidth: '500px' },
  
  infoGrid: { display: 'flex', flexDirection: 'column', gap: '20px', borderTop: '1px solid #f0f0f0', paddingTop: '30px' },
  infoBox: { display: 'flex', gap: '20px', alignItems: 'flex-start' },
  label: { fontSize: '0.65rem', letterSpacing: '2px', color: '#aaa' },
  smallP: { margin: '5px 0 0 0', fontSize: '0.95rem', color: '#444' },
  
  actionRow: { display: 'flex', gap: '20px', marginTop: '10px' },
  qtyBox: { display: 'flex', alignItems: 'center', border: '1px solid #eee', borderRadius: '50px', padding: '5px' },
  qBtn: { width: '45px', height: '45px', border: 'none', background: 'transparent', cursor: 'pointer', borderRadius: '50%', transition: '0.3s', fontSize: '1.2rem' },
  mainBtn: { flex: 1, color: '#fff', border: 'none', borderRadius: '50px', fontWeight: '900', fontSize: '0.8rem', letterSpacing: '2px', transition: '0.4s', padding: '20px' },
};

export default ProductDetails;