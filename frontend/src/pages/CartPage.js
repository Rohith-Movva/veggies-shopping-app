import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaTrashAlt, FaCheckCircle } from 'react-icons/fa';
import gsap from 'gsap';
import API from '../api';

const CartPage = ({ user, cart, setCart, removeFromCart, updateQuantity }) => {
  // --- ORIGINAL STATE & LOGIC (UNTOUCHED) ---
  const navigate = useNavigate();
  const [customerName, setCustomerName] = useState(user ? user.name : '');
  const [customerAddress, setCustomerAddress] = useState('');
  
  const BACKEND_URL = window.location.hostname === 'localhost' 
    ? "http://localhost:5000" 
    : "https://veggies-shopping-app.onrender.com";

  useEffect(() => {
    if (user && user.name) {
      setCustomerName(user.name);
    }
  }, [user]);

  const totalAmount = cart.reduce((acc, item) => acc + item.price * item.quantity, 0).toFixed(2);

  const handleIncrement = (item) => {
    const MAX_LIMIT = 10;
    const currentStock = item.stock; 
    
    const effectiveLimit = Math.min(MAX_LIMIT, currentStock);

    if (item.quantity < effectiveLimit) {
      updateQuantity(item._id, 1);
    } else {
      if (item.quantity >= 10) {
        alert("Limit reached: You can only buy 10 per order.");
      } else {
        alert(`Stock limit reached! Only ${currentStock} available.`);
      }
    }
  };

  const renderImageSrc = (imgString) => {
      if (!imgString) return '';
      if (imgString.startsWith('http')) return imgString;
      return `${BACKEND_URL}/images/${imgString}`;
  };

  const handlePlaceOrder = async () => {
    if (!customerName || !customerAddress) {
      alert("Please fill in your Name and Shipping Address to place the order.");
      return;
    }

    const formattedItems = cart.map(item => ({
      productId: item._id,
      name: item.name,
      quantity: item.quantity,
      price: item.price
    }));

    const orderData = {
      user: user ? user.id : null, 
      customerName,
      customerAddress,
      items: formattedItems,
      totalAmount: Number(totalAmount)
    };

    try {
      await API.post('/orders', orderData);
      alert('Order Placed Successfully!');
      setCart([]); 
      navigate('/profile'); 
    } catch (err) {
      console.error(err);
      alert('Failed to place order.');
    }
  };

  // --- GSAP HIGH-MOTION LOGIC ---
  const compRef = useRef(null);

  useEffect(() => {
    if (cart.length === 0) return;

    let ctx = gsap.context(() => {
      // Staggered reveal for cart items
      gsap.fromTo('.cart-item-anim',
        { y: 40, opacity: 0, scale: 0.98 },
        { y: 0, opacity: 1, scale: 1, duration: 0.6, stagger: 0.1, ease: "power3.out" }
      );

      // Checkout card slide in
      gsap.fromTo('.checkout-card-anim',
        { x: 50, opacity: 0 },
        { x: 0, opacity: 1, duration: 0.8, ease: "power3.out", delay: 0.3 }
      );
    }, compRef);

    return () => ctx.revert();
  }, [cart.length]);

  if (cart.length === 0) return (
    <div className="ambient-bg" style={styles.emptyContainer}>
      <style>
        {`
          @keyframes gradientFloat {
            0% { background-position: 0% 50%; }
            50% { background-position: 100% 50%; }
            100% { background-position: 0% 50%; }
          }
          .ambient-bg {
            background: linear-gradient(-45deg, #fdfbfb, #f0fdf4, #e2f0ea, #fdfbfb);
            background-size: 400% 400%;
            animation: gradientFloat 15s ease infinite;
            min-height: 100vh;
          }
        `}
      </style>
      <div style={styles.emptyContent}>
        <h2 style={styles.emptyTitle}>Your Cart is Empty 🛒</h2>
        <p style={{ color: '#64748b', fontSize: '1.1rem' }}>Looks like you haven't added any of our fresh harvest yet.</p>
        <button onClick={() => navigate('/shop')} style={styles.continueBtn}>Continue Shopping</button>
      </div>
    </div>
  );

  return (
    <div ref={compRef} className="ambient-bg" style={styles.pageWrapper}>
      
      {/* --- UPGRADED THEME CSS --- */}
      <style>
        {`
          @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;600;800&display=swap');
          
          @keyframes gradientFloat {
            0% { background-position: 0% 50%; }
            50% { background-position: 100% 50%; }
            100% { background-position: 0% 50%; }
          }
          .ambient-bg {
            background: linear-gradient(-45deg, #fdfbfb, #f0fdf4, #e2f0ea, #fdfbfb);
            background-size: 400% 400%;
            animation: gradientFloat 15s ease infinite;
            min-height: 100vh;
          }

          /* Input Focus Polish */
          .fancy-input { transition: all 0.3s ease; }
          .fancy-input:focus {
            outline: none;
            border-color: #27ae60 !important;
            box-shadow: 0 0 0 4px rgba(39, 174, 96, 0.1) !important;
          }

          /* Button Hovers */
          .hover-btn { transition: all 0.2s cubic-bezier(0.34, 1.56, 0.64, 1); }
          .hover-btn:hover:not(:disabled) { transform: translateY(-2px); }
          .hover-btn:active:not(:disabled) { transform: translateY(0); }

          .checkout-btn { transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1); }
          .checkout-btn:hover {
            transform: translateY(-3px);
            box-shadow: 0 15px 30px rgba(39, 174, 96, 0.4) !important;
          }
          
          .remove-btn { transition: all 0.2s ease; }
          .remove-btn:hover { color: #dc2626 !important; background: #fee2e2 !important; }

          /* Cart Item Hover */
          .cart-item { transition: all 0.3s ease; }
          .cart-item:hover {
            transform: translateX(5px);
            box-shadow: 0 15px 35px rgba(0,0,0,0.06) !important;
            border-color: rgba(39, 174, 96, 0.2) !important;
          }
        `}
      </style>

      <div style={styles.container}>
        
        {/* LEFT SIDE: CART ITEMS */}
        <div style={styles.cartSection}>
          <h2 style={styles.pageTitle}>Your Shopping Cart</h2>
          <p style={styles.itemCountText}>You have {cart.length} item{cart.length > 1 ? 's' : ''} in your cart.</p>
          
          <div style={styles.cartList}>
            {cart.map((item) => (
              <div key={item._id} className="cart-item-anim cart-item" style={styles.cartItem}>
                
                <div style={styles.imageWrapper}>
                  <img 
                    src={renderImageSrc(item.image)} 
                    alt={item.name} 
                    style={styles.image} 
                  />
                </div>
                
                <div style={styles.details}>
                  <h3 style={styles.productTitle}>{item.name}</h3>
                  <p style={styles.unitPrice}>₹{item.price} each</p>
                  
                  {/* Controls */}
                  <div style={styles.controls}>
                    <button onClick={() => updateQuantity(item._id, -1)} className="hover-btn" style={styles.qtyBtn}>-</button>
                    <span style={styles.qtyNum}>{item.quantity}</span>
                    <button onClick={() => handleIncrement(item)} className="hover-btn" style={styles.qtyBtn}>+</button>
                  </div>
                </div>

                <div style={styles.actions}>
                  <p style={styles.totalPrice}>
                    ₹{(item.price * item.quantity).toFixed(2)}
                  </p>
                  <button onClick={() => removeFromCart(item._id)} className="remove-btn" style={styles.removeBtn}>
                    <FaTrashAlt style={{ marginRight: '6px' }} /> Remove
                  </button>
                </div>

              </div>
            ))}
          </div>
        </div>

        {/* RIGHT SIDE: SHIPPING FORM & CHECKOUT */}
        <div className="checkout-card-anim" style={styles.checkoutSection}>
          <div style={styles.summaryCard}>
            <h3 style={styles.summaryTitle}>
              Shipping Details
            </h3>
            
            {/* Name Input */}
            <div style={styles.formGroup}>
              <label style={styles.label}>Full Name</label>
              <input 
                type="text" 
                placeholder="Enter your full name"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                className="fancy-input"
                style={styles.input}
              />
            </div>

            {/* Address Input */}
            <div style={styles.formGroup}>
              <label style={styles.label}>Delivery Address</label>
              <textarea 
                rows="3"
                placeholder="Enter your full delivery address"
                value={customerAddress}
                onChange={(e) => setCustomerAddress(e.target.value)}
                className="fancy-input"
                style={{ ...styles.input, resize: 'vertical' }}
              />
            </div>

            <div style={styles.divider}></div>

            {/* Totals */}
            <div style={styles.totalRow}>
              <span style={styles.totalText}>Total Amount</span>
              <span style={styles.totalAmount}>₹{totalAmount}</span>
            </div>

            <button onClick={handlePlaceOrder} className="checkout-btn" style={styles.checkoutBtn}>
               <FaCheckCircle style={{ marginRight: '8px' }} /> Confirm Order
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};

// --- DYNAMIC STYLES (MATCHING PREMIUM THEME) ---
const styles = {
  pageWrapper: {
    fontFamily: "'Outfit', 'Segoe UI', sans-serif",
    color: '#0f172a',
    overflowX: 'hidden'
  },
  container: { 
    maxWidth: '1300px', 
    margin: '0 auto', 
    padding: '60px 40px 100px 40px', 
    display: 'flex', 
    gap: '50px', 
    flexWrap: 'wrap',
    alignItems: 'flex-start'
  },
  emptyContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '80vh',
    width: '100%',
    fontFamily: "'Outfit', 'Segoe UI', sans-serif",
  },
  emptyContent: {
    textAlign: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    backdropFilter: 'blur(16px)',
    padding: '60px 40px',
    borderRadius: '24px',
    boxShadow: '0 20px 40px rgba(0,0,0,0.05)',
    border: '1px solid rgba(255,255,255,0.9)'
  },
  emptyTitle: {
    color: '#0f172a',
    fontSize: '2.5rem',
    fontWeight: '800',
    marginBottom: '15px'
  },
  continueBtn: {
    marginTop: '30px',
    padding: '16px 40px',
    backgroundColor: '#27ae60',
    color: 'white',
    border: 'none',
    borderRadius: '50px',
    fontSize: '1.1rem',
    fontWeight: '800',
    cursor: 'pointer',
    boxShadow: '0 8px 20px rgba(39, 174, 96, 0.25)',
    transition: 'all 0.3s ease'
  },
  
  // Left Side (Cart Items)
  cartSection: { 
    flex: '1 1 650px', 
    minWidth: '300px' 
  },
  pageTitle: {
    fontSize: 'clamp(2rem, 4vw, 3rem)',
    color: '#0f172a',
    margin: '0 0 10px 0',
    fontWeight: '800',
    letterSpacing: '-1px'
  },
  itemCountText: {
    color: '#64748b',
    fontSize: '1.1rem',
    marginBottom: '40px'
  },
  cartList: { 
    display: 'flex', 
    flexDirection: 'column', 
    gap: '20px' 
  },
  cartItem: { 
    display: 'flex', 
    gap: '25px', 
    border: '1px solid rgba(255,255,255,0.9)', 
    padding: '25px', 
    borderRadius: '20px', 
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    backdropFilter: 'blur(10px)',
    boxShadow: '0 10px 30px rgba(0,0,0,0.03)'
  },
  imageWrapper: {
    width: '100px', 
    height: '100px', 
    borderRadius: '16px',
    overflow: 'hidden',
    flexShrink: 0,
    boxShadow: '0 8px 20px rgba(0,0,0,0.08)'
  },
  image: { 
    width: '100%', 
    height: '100%', 
    objectFit: 'cover' 
  },
  details: { 
    flex: 1 
  },
  productTitle: {
    fontSize: '1.3rem',
    color: '#0f172a',
    margin: '0 0 5px 0',
    fontWeight: '800'
  },
  unitPrice: {
    color: '#64748b',
    fontSize: '0.95rem',
    margin: 0
  },
  controls: { 
    display: 'flex', 
    alignItems: 'center', 
    marginTop: '15px',
    backgroundColor: '#f8fafc',
    border: '1px solid #e2e8f0',
    borderRadius: '50px',
    width: 'fit-content',
    overflow: 'hidden'
  },
  qtyBtn: { 
    padding: '8px 15px', 
    cursor: 'pointer', 
    backgroundColor: 'transparent', 
    border: 'none',
    color: '#0f172a',
    fontWeight: '800',
    fontSize: '1.1rem'
  },
  qtyNum: {
    padding: '0 15px',
    fontWeight: '800',
    color: '#0f172a',
    fontSize: '1.1rem'
  },
  actions: { 
    textAlign: 'right',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-end',
    justifyContent: 'center',
    gap: '15px'
  },
  totalPrice: {
    fontWeight: '800',
    fontSize: '1.5rem',
    color: '#0f172a',
    margin: 0
  },
  removeBtn: { 
    backgroundColor: 'transparent', 
    color: '#ef4444', 
    border: 'none', 
    padding: '8px 15px', 
    borderRadius: '50px', 
    cursor: 'pointer',
    fontWeight: '700',
    fontSize: '0.9rem',
    display: 'flex',
    alignItems: 'center'
  },

  // Right Side (Checkout Form)
  checkoutSection: { 
    flex: '1 1 350px', 
    minWidth: '300px' 
  },
  summaryCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    backdropFilter: 'blur(20px)',
    padding: '40px 30px',
    borderRadius: '24px',
    border: '1px solid rgba(255,255,255,0.9)',
    boxShadow: '0 25px 50px rgba(0,0,0,0.08)',
    position: 'sticky',
    top: '120px'
  },
  summaryTitle: {
    borderBottom: '2px solid rgba(0,0,0,0.05)', 
    paddingBottom: '15px', 
    marginBottom: '25px',
    color: '#0f172a',
    fontSize: '1.5rem',
    fontWeight: '800',
    letterSpacing: '-0.5px'
  },
  formGroup: { 
    marginBottom: '20px' 
  },
  label: { 
    display: 'block', 
    marginBottom: '8px', 
    fontWeight: '700', 
    fontSize: '0.95rem', 
    color: '#334155' 
  },
  input: {
    width: '100%',
    padding: '14px 18px',
    borderRadius: '12px',
    border: '1px solid #cbd5e1',
    backgroundColor: '#f8fafc',
    fontSize: '1rem',
    color: '#0f172a',
    fontFamily: 'inherit',
    boxSizing: 'border-box' 
  },
  divider: { 
    height: '1px', 
    backgroundColor: 'rgba(0,0,0,0.05)', 
    margin: '30px 0' 
  },
  totalRow: { 
    display: 'flex', 
    justifyContent: 'space-between', 
    alignItems: 'center', 
    marginBottom: '30px' 
  },
  totalText: {
    fontWeight: '700',
    color: '#475569',
    fontSize: '1.1rem'
  },
  totalAmount: {
    fontSize: '2.5rem', 
    color: '#0f172a',
    fontWeight: '800',
    letterSpacing: '-1px'
  },
  checkoutBtn: { 
    width: '100%',
    padding: '18px', 
    backgroundColor: '#e67e22', // Brand Orange for strong CTA
    color: 'white', 
    fontSize: '1.2rem', 
    border: 'none', 
    borderRadius: '50px', // Pill shape
    cursor: 'pointer',
    fontWeight: '800',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    boxShadow: '0 8px 20px rgba(230, 126, 34, 0.3)'
  }
};

export default CartPage;