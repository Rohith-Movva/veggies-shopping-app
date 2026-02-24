import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaArrowLeft } from 'react-icons/fa';
import API from '../api'; 

const AllProductsPage = () => {
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const BACKEND_URL = window.location.hostname === 'localhost' 
    ? "http://localhost:5000" 
    : "https://veggies-shopping-app.onrender.com"; 

  useEffect(() => {
    // Fetching the exact same way as the landing page
    const fetchProducts = async () => {
      try {
        const { data } = await API.get('/products');
        const productList = Array.isArray(data) ? data : data.products || [];
        // Keeping the same filter you had, or you can remove the filter if you want ALL categories here
        const powderList = productList.filter(p => p.category && p.category.toLowerCase() === 'powders');
        setProducts(powderList);
        setIsLoading(false);
      } catch (err) {
        console.error("Failed to load products", err);
        setIsLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const renderImageSrc = (imgString) => {
      if (!imgString) return '';
      if (imgString.startsWith('http')) return imgString;
      return `${BACKEND_URL}/images/${imgString}`;
  };

  return (
    <div style={styles.container}>
      {/* Simple Header for Navigation */}
      <header style={styles.header}>
        <Link to="/" style={styles.backLink}>
          <FaArrowLeft style={{ marginRight: '8px' }} /> Back to Home
        </Link>
        <h1 style={styles.pageTitle}>All Products</h1>
        <div style={{ width: '100px' }}></div> {/* Spacer for centering */}
      </header>

      {/* Product Grid Section */}
      <div style={styles.section}>
        <div style={styles.productGrid}>
          {isLoading ? (
            <p style={styles.loadingText}>Loading our fresh harvest...</p>
          ) : products.length > 0 ? (
            products.map((product) => (
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
                  {/* Exactly the same routing functionality */}
                  <Link to={`/product/${product._id}`} style={styles.cardBtn}>
                    View Details
                  </Link>
                </div>
              </div>
            ))
          ) : (
            <p style={styles.loadingText}>No products found at the moment.</p>
          )}
        </div>
      </div>
    </div>
  );
};

// Reused styles to ensure consistency
const styles = {
  container: { fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif", width: '100%', minHeight: '100vh', backgroundColor: '#fdfdfd' },
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '20px 40px', backgroundColor: 'white', boxShadow: '0 2px 10px rgba(0,0,0,0.05)', position: 'sticky', top: 0, zIndex: 1000 },
  backLink: { display: 'flex', alignItems: 'center', textDecoration: 'none', color: '#2c3e50', fontWeight: '600', width: '100px' },
  pageTitle: { color: '#2c3e50', margin: 0, fontSize: '24px' },
  section: { padding: '40px 20px', maxWidth: '1200px', margin: '0 auto', boxSizing: 'border-box' },
  productGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '25px', width: '100%' },
  productCard: { border: '1px solid #eaeaea', borderRadius: '12px', padding: '15px', boxShadow: '0 5px 15px rgba(0,0,0,0.05)', backgroundColor: 'white', display: 'flex', flexDirection: 'column', transition: 'transform 0.2s', height: '100%' },
  imageWrapper: { width: '100%', height: '220px', marginBottom: '15px', overflow: 'hidden', borderRadius: '8px' },
  productImage: { width: '100%', height: '100%', objectFit: 'cover' },
  productTitle: { fontSize: '1.2rem', color: '#2c3e50', margin: '0 0 8px 0', fontWeight: '700' },
  productDesc: { fontSize: '0.95rem', color: '#666', marginBottom: '20px', flexGrow: 1, lineHeight: '1.5' },
  productFooter: { marginTop: 'auto' },
  cardBtn: { display: 'block', width: '100%', padding: '12px 0', backgroundColor: '#3498db', color: 'white', textDecoration: 'none', borderRadius: '8px', fontSize: '1rem', fontWeight: '600', textAlign: 'center' },
  loadingText: { textAlign: 'center', width: '100%', gridColumn: '1 / -1', padding: '40px', color: '#777', fontSize: '1.2rem' }
};

export default AllProductsPage;