import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { FaSeedling, FaArrowRight, FaLeaf } from 'react-icons/fa'; // 🔴 NEW ICONS
import API from '../api';

const CategoryPage = () => {
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState(''); 
  const { categoryName } = useParams(); 
  const [loading, setLoading] = useState(true); // 🔴 NEW: Loading State


  const BACKEND_URL = window.location.hostname === 'localhost' 
    ? "http://localhost:5000" 
    : "https://veggies-shopping-app.onrender.com";

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true); // Start loading
        const res = await API.get(`/products/category/${categoryName}`);
        setProducts(res.data);
        setLoading(false); // Stop loading
      } catch (err) {
        console.error("Error fetching products:", err);
        setLoading(false);
      }
    };
    fetchProducts();
    setSearchTerm(''); 
  }, [categoryName]);

  const renderImageSrc = (imgString) => {
      if (!imgString) return '';
      if (imgString.startsWith('http')) return imgString;
      return `${BACKEND_URL}/images/${imgString}`;
  };

  // --- FILTER LOGIC ---
  const filteredProducts = products.filter(product => 
    product.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto', minHeight: '60vh' }}>
      
      {/* Header Section */}
      <div style={styles.headerContainer}>
        <h2 style={{ textTransform: 'capitalize', color: '#2c3e50', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <FaLeaf style={{ color: '#27ae60' }} /> {categoryName} Section
        </h2>
        
        {/* Only show search bar if there are products to search */}
        {products.length > 0 && (
            <input 
            type="text" 
            placeholder={`Search in ${categoryName}...`} 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={styles.searchInput}
            />
        )}
      </div>
      
      {/* Content Section */}
      <div style={styles.grid}>
        
        {loading ? (
            <h3 style={{color: '#777', width: '100%', textAlign: 'center'}}>Loading fresh products...</h3>
        ) : products.length === 0 ? (
          
          /* 🔴 🔴 🔴 FANCY "COMING SOON" UI (When Category is Empty) 🔴 🔴 🔴 */
          <div style={styles.emptyStateContainer}>
              <div style={styles.iconCircle}>
                  <FaSeedling size={50} color="#27ae60" />
              </div>
              <h2 style={styles.emptyTitle}>Fresh Harvest Coming Soon!</h2>
              <p style={styles.emptyText}>
                  We are currently sourcing the finest quality <strong>{categoryName}</strong> directly from the farms. 
                  <br />Check back shortly for new stock!
              </p>
              
              <div style={styles.suggestionBox}>
                  <p>In the meantime, why not try:</p>
                  <div style={styles.buttonGroup}>
                      <Link to="/" style={styles.secondaryBtn}>Go to Home</Link>
                      <Link to="/category/powders" style={styles.primaryBtn}>
                          Explore Powders <FaArrowRight />
                      </Link>
                  </div>
              </div>
          </div>

        ) : filteredProducts.length > 0 ? (
          /* Normal Product Grid */
          filteredProducts.map((product) => (
            <div key={product._id} style={styles.card}>
              
              <img 
                src={renderImageSrc(product.image)} 
                alt={product.name} 
                style={styles.image} 
              />
              
              <div style={{ flexGrow: 1 }}> 
                <h3>{product.name}</h3>
                <p style={{ color: '#777', fontSize: '14px' }}>{product.description.substring(0, 60)}...</p>
              </div>

              <div>
                <p style={styles.price}>₹{product.price}</p>
                <Link 
                  to={`/product/${product._id}`}
                  style={styles.detailsButton}
                >
                  View Details
                </Link>
              </div>
            </div>
          ))
        ) : (
           /* Search returns no results, but category is NOT empty */
           <div style={{ width: '100%', textAlign: 'center', color: '#888' }}>
             <h3>No products found for "{searchTerm}"</h3>
           </div>
        )}
      </div>
    </div>
  );
};

// Internal CSS
const styles = {
  headerContainer: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '30px',
    borderBottom: '2px solid #eee',
    paddingBottom: '15px',
    flexWrap: 'wrap',
    gap: '15px'
  },
  searchInput: {
    padding: '10px 15px',
    width: '300px',
    borderRadius: '25px',
    border: '1px solid #ccc',
    fontSize: '16px',
    outline: 'none'
  },
  grid: {
    display: 'flex', 
    flexWrap: 'wrap', 
    gap: '20px',
    justifyContent: 'center',
    alignItems: 'stretch' 
  },
  card: {
    border: '1px solid #eee', 
    padding: '15px', 
    width: '220px', 
    borderRadius: '10px',
    boxShadow: '0 4px 8px rgba(0,0,0,0.1)', 
    textAlign: 'center',
    backgroundColor: 'white',
    display: 'flex',            
    flexDirection: 'column',    
    justifyContent: 'space-between' 
  },
  image: {
    width: '100%', 
    height: '150px', 
    objectFit: 'cover', 
    borderRadius: '5px',
    marginBottom: '10px'
  },
  price: {
    fontSize: '18px', 
    color: '#27ae60', 
    fontWeight: 'bold',
    margin: '10px 0'
  },
  detailsButton: {
    display: 'block', 
    textAlign: 'center', 
    backgroundColor: '#3498db', 
    color: 'white', 
    padding: '10px', 
    textDecoration: 'none', 
    borderRadius: '5px',
    marginTop: 'auto', 
    fontWeight: 'bold'
  },

  // 🔴 NEW STYLES FOR EMPTY STATE
  emptyStateContainer: {
      textAlign: 'center',
      padding: '40px 20px',
      backgroundColor: '#f9f9f9',
      borderRadius: '15px',
      maxWidth: '600px',
      width: '100%',
      margin: '20px auto',
      border: '1px dashed #ccc'
  },
  iconCircle: {
      width: '100px',
      height: '100px',
      backgroundColor: '#e8f8f5', // Light green background
      borderRadius: '50%',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      margin: '0 auto 20px auto'
  },
  emptyTitle: {
      color: '#2c3e50',
      marginBottom: '10px',
      fontSize: '24px'
  },
  emptyText: {
      color: '#7f8c8d',
      fontSize: '16px',
      lineHeight: '1.6',
      marginBottom: '30px'
  },
  suggestionBox: {
      borderTop: '1px solid #ddd',
      paddingTop: '20px'
  },
  buttonGroup: {
      display: 'flex',
      justifyContent: 'center',
      gap: '15px',
      marginTop: '15px',
      flexWrap: 'wrap'
  },
  primaryBtn: {
      backgroundColor: '#27ae60',
      color: 'white',
      padding: '10px 20px',
      borderRadius: '25px',
      textDecoration: 'none',
      fontWeight: 'bold',
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      boxShadow: '0 4px 6px rgba(39, 174, 96, 0.2)'
  },
  secondaryBtn: {
      backgroundColor: 'white',
      color: '#555',
      border: '1px solid #ccc',
      padding: '10px 20px',
      borderRadius: '25px',
      textDecoration: 'none',
      fontWeight: 'bold'
  }
};

export default CategoryPage;