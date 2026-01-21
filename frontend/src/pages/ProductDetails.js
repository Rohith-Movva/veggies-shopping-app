import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FaCheckCircle, FaLeaf, FaExclamationTriangle, FaIndustry, FaUtensils, FaInfoCircle } from 'react-icons/fa'; // 🔴 NEW ICONS
import API from '../api';

const ProductDetails = ({ addToCart }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);


  const BACKEND_URL = window.location.hostname === 'localhost' 
    ? "http://localhost:5000" 
    : "https://veggies-shopping-app.onrender.com"; 

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await API.get('/products');
        const foundProduct = res.data.find(p => p._id === id);
        setProduct(foundProduct);
      } catch (err) {
        console.error(err);
      }
    };
    fetchProduct();
  }, [id]);

  const renderImageSrc = (imgString) => {
      if (!imgString) return '';
      if (imgString.startsWith('http')) return imgString;
      return `${BACKEND_URL}/images/${imgString}`;
  };

  // 🔴 NEW: FANCY LIST HELPER (Green Checkmarks)
  const formatList = (text) => {
    if (!text) return null;
    return text.split('\n').map((item, index) => (
      <li key={index} style={styles.benefitItem}>
        <FaCheckCircle style={{ color: '#27ae60', marginRight: '10px', flexShrink: 0 }} />
        <span>{item}</span>
      </li>
    ));
  };

  // 🔴 NEW: BADGE HELPER (For Highlights)
  const formatBadges = (text) => {
    if (!text) return null;
    return text.split('\n').map((item, index) => (
      <span key={index} style={styles.badge}>
         ✨ {item}
      </span>
    ));
  };

  if (!product) return <div style={styles.loading}>Loading product details...</div>;

  // --- LOGIC ---
  const MAX_PER_ORDER = 10; 
  const isOutOfStock = product.stock === 0;
  const isLowStock = product.stock > 0 && product.stock <= 5;
  const effectiveLimit = Math.min(product.stock, MAX_PER_ORDER);

  return (
    <div style={styles.container}>
      
      {/* --- LEFT: IMAGE SECTION --- */}
      <div style={styles.imageSection}>
        <img 
          src={renderImageSrc(product.image)} 
          alt={product.name} 
          style={styles.image} 
        />
      </div>

      {/* --- RIGHT: DETAILS SECTION --- */}
      <div style={styles.details}>
        
        {/* 1. HEADER & HIGHLIGHTS */}
        <h1 style={styles.title}>{product.name}</h1>
        <p style={styles.categoryTag}>{product.category}</p>

        {/* 🔴 NEW: Highlights as Badges */}
        {product.highlights && (
           <div style={styles.badgeContainer}>
             {formatBadges(product.highlights)}
           </div>
        )}
        
        {/* 2. PRICE & STOCK CARD */}
        <div style={styles.priceCard}>
            <div style={{display:'flex', alignItems:'center', gap:'15px'}}>
               <h2 style={styles.price}>₹{product.price}</h2>
               <span style={styles.taxNote}>(Inclusive of all taxes)</span>
            </div>

            <div style={{ marginTop: '5px' }}>
              {isOutOfStock ? (
                <span style={styles.stockBadgeOut}>Out of Stock</span>
              ) : (
                <span style={styles.stockBadgeIn}>In Stock {isLowStock && `(Only ${product.stock} left!)`}</span>
              )}
            </div>
        </div>

        {/* 3. ABOUT (Clean Text) */}
        <div style={styles.sectionBlock}>
          <h3 style={styles.sectionTitle}><FaInfoCircle /> About This Product</h3>
          <p style={styles.text}>{product.description}</p>
          {product.about && <p style={{...styles.text, marginTop:'10px'}}>{product.about}</p>}
        </div>

        {/* 4. KEY BENEFITS (Fancy Checkmark List) */}
        {product.keyBenefits && (
          <div style={styles.sectionBlock}>
            <h3 style={styles.sectionTitle}><FaLeaf /> Key Benefits</h3>
            <ul style={styles.benefitList}>
              {formatList(product.keyBenefits)}
            </ul>
          </div>
        )}

        {/* 5. USAGE & MANUFACTURING (Two Column Grid) */}
        <div style={styles.infoGrid}>
            
            {/* Usage Box */}
            {product.usageInfo && (
              <div style={styles.infoBoxBlue}>
                <h4 style={styles.boxTitle}><FaUtensils /> How to Use</h4>
                <p style={styles.smallText}>{product.usageInfo}</p>
                {product.recommendeddosage && (
                   <p style={{...styles.smallText, marginTop: '5px', fontWeight:'bold'}}>
                     Dosage: {product.recommendeddosage}
                   </p>
                )}
              </div>
            )}

            {/* Manufacturing Box */}
            {product.manufacturingInfo && (
              <div style={styles.infoBoxGray}>
                <h4 style={styles.boxTitle}><FaIndustry /> Manufacturing</h4>
                <p style={styles.smallText}>{product.manufacturingInfo}</p>
              </div>
            )}
        </div>

        {/* 6. SAFETY WARNING (Red Alert Box) */}
        {product.safetyInfo && (
          <div style={styles.warningBox}>
            <FaExclamationTriangle style={{ fontSize: '20px', flexShrink:0 }} />
            <div>
               <strong style={{display:'block', marginBottom:'2px'}}>Safety Information</strong>
               <span style={styles.smallText}>{product.safetyInfo}</span>
            </div>
          </div>
        )}

        {/* --- CONTROLS FOOTER --- */}
        <div style={styles.controls}>
            {!isOutOfStock && (
              <div style={styles.quantityWrapper}>
                <button onClick={() => setQuantity(q => Math.max(1, q - 1))} style={styles.qtyBtn}>-</button>
                <span style={styles.qtyNum}>{quantity}</span>
                <button 
                   onClick={() => setQuantity(q => Math.min(effectiveLimit, q + 1))} 
                   style={{...styles.qtyBtn, opacity: quantity >= effectiveLimit ? 0.5 : 1}}
                   disabled={quantity >= effectiveLimit}
                >+</button>
              </div>
            )}

            <button 
              onClick={() => {
                addToCart(product, quantity);
                navigate('/cart');
              }}
              disabled={isOutOfStock}
              style={{
                ...styles.addToCartBtn,
                background: isOutOfStock ? '#ccc' : 'linear-gradient(45deg, #27ae60, #2ecc71)',
                cursor: isOutOfStock ? 'not-allowed' : 'pointer'
              }}
            >
              {isOutOfStock ? 'Notify Me' : `Add ${quantity} Item${quantity > 1 ? 's' : ''} to Cart`}
            </button>
        </div>

      </div>
    </div>
  );
};

// --- FANCY STYLES ---
const styles = {
  container: {
    padding: '40px 20px',
    maxWidth: '1200px',
    margin: '0 auto',
    display: 'flex',
    gap: '50px',
    flexWrap: 'wrap',
    alignItems: 'flex-start',
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif"
  },
  imageSection: {
    flex: '1 1 400px',
    position: 'sticky',
    top: '20px'
  },
  image: {
    width: '100%',
    borderRadius: '15px',
    boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
    objectFit: 'cover'
  },
  details: {
    flex: '1 1 500px',
  },
  title: {
    fontSize: '36px',
    color: '#2c3e50',
    marginBottom: '5px',
    lineHeight: '1.2'
  },
  categoryTag: {
    textTransform: 'uppercase',
    letterSpacing: '1px',
    fontSize: '12px',
    color: '#95a5a6',
    fontWeight: 'bold',
    marginBottom: '15px'
  },
  badgeContainer: {
    display: 'flex',
    gap: '10px',
    flexWrap: 'wrap',
    marginBottom: '20px'
  },
  badge: {
    backgroundColor: '#e8f8f5',
    color: '#27ae60',
    padding: '6px 12px',
    borderRadius: '20px',
    fontSize: '13px',
    fontWeight: 'bold',
    border: '1px solid #d4efdf'
  },
  priceCard: {
    background: '#f8f9fa',
    padding: '20px',
    borderRadius: '10px',
    marginBottom: '30px',
    borderLeft: '5px solid #27ae60'
  },
  price: {
    fontSize: '32px',
    color: '#27ae60',
    margin: 0
  },
  taxNote: {
    fontSize: '12px',
    color: '#7f8c8d'
  },
  stockBadgeIn: {
    color: '#27ae60',
    fontWeight: 'bold',
    fontSize: '14px',
    display:'flex', alignItems:'center', gap:'5px'
  },
  stockBadgeOut: {
    color: '#e74c3c',
    fontWeight: 'bold',
    fontSize: '14px'
  },
  sectionBlock: {
    marginBottom: '30px'
  },
  sectionTitle: {
    fontSize: '18px',
    color: '#34495e',
    marginBottom: '15px',
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    borderBottom: '1px solid #eee',
    paddingBottom: '10px'
  },
  text: {
    lineHeight: '1.7',
    color: '#555',
    fontSize: '16px'
  },
  benefitList: {
    listStyle: 'none',
    padding: 0,
    margin: 0
  },
  benefitItem: {
    display: 'flex',
    alignItems: 'flex-start',
    marginBottom: '10px',
    fontSize: '15px',
    color: '#444',
    lineHeight: '1.5'
  },
  infoGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '20px',
    marginBottom: '25px'
  },
  infoBoxBlue: {
    background: '#eaf2f8',
    padding: '20px',
    borderRadius: '10px',
    border: '1px solid #d6eaf8'
  },
  infoBoxGray: {
    background: '#fdfefe',
    padding: '20px',
    borderRadius: '10px',
    border: '1px solid #eaecee'
  },
  boxTitle: {
    fontSize: '16px',
    margin: '0 0 10px 0',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    color: '#2c3e50'
  },
  smallText: {
    fontSize: '14px',
    color: '#555',
    margin: 0,
    lineHeight: '1.5'
  },
  warningBox: {
    background: '#fdedec',
    color: '#c0392b',
    padding: '15px',
    borderRadius: '8px',
    display: 'flex',
    alignItems: 'center',
    gap: '15px',
    marginBottom: '30px',
    border: '1px solid #fadbd8'
  },
  controls: {
    display: 'flex',
    gap: '20px',
    marginTop: '20px',
    paddingTop: '20px',
    borderTop: '1px solid #eee',
    alignItems: 'center'
  },
  quantityWrapper: {
    display: 'flex',
    alignItems: 'center',
    border: '1px solid #ddd',
    borderRadius: '5px'
  },
  qtyBtn: {
    background: 'none',
    border: 'none',
    padding: '10px 15px',
    fontSize: '18px',
    cursor: 'pointer',
    color: '#555'
  },
  qtyNum: {
    padding: '0 15px',
    fontWeight: 'bold',
    fontSize: '18px'
  },
  addToCartBtn: {
    flex: 1,
    padding: '15px',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    fontSize: '16px',
    fontWeight: 'bold',
    textTransform: 'uppercase',
    letterSpacing: '1px',
    boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
    transition: 'transform 0.2s'
  },
  loading: {
    textAlign: 'center',
    marginTop: '50px',
    fontSize: '20px',
    color: '#777'
  }
};

export default ProductDetails;