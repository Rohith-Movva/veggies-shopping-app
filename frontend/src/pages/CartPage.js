import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { FaTrash, FaPlus, FaMinus, FaShoppingBag, FaTruck, FaArrowLeft } from 'react-icons/fa';
import Lenis from 'lenis';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import API from '../api';

const CartPage = ({ user, cart, setCart, removeFromCart, updateQuantity }) => {
  const navigate = useNavigate();
  const [customerName, setCustomerName] = useState(user ? user.name : '');
  const [customerAddress, setCustomerAddress] = useState('');
  const containerRef = useRef();

  const BACKEND_URL = window.location.hostname === 'localhost' 
    ? "http://localhost:5000" 
    : "https://veggies-shopping-app.onrender.com";

  useEffect(() => {
    const lenis = new Lenis({ lerp: 0.1 });
    function raf(time) { lenis.raf(time); requestAnimationFrame(raf); }
    requestAnimationFrame(raf);
    if (user && user.name) setCustomerName(user.name);
    return () => lenis.destroy();
  }, [user]);

  // --- HEAVY UI ANIMATIONS ---
  useGSAP(() => {
    if (cart.length === 0) return;

    gsap.from(".cart-reveal", {
      y: 50,
      opacity: 0,
      duration: 1,
      stagger: 0.1,
      ease: "power4.out"
    });

    gsap.from(".summary-glass", {
      x: 100,
      opacity: 0,
      duration: 1.2,
      ease: "expo.out",
      delay: 0.5
    });
  }, [cart.length]);

  const totalAmount = cart.reduce((acc, item) => acc + item.price * item.quantity, 0).toFixed(2);

  const handleIncrement = (item) => {
    const MAX_LIMIT = 10;
    const currentStock = item.stock; 
    const effectiveLimit = Math.min(MAX_LIMIT, currentStock);

    if (item.quantity < effectiveLimit) {
      updateQuantity(item._id, 1);
    } else {
      alert(item.quantity >= 10 ? "Limit reached: Max 10 per order." : `Only ${currentStock} in stock.`);
    }
  };

  const renderImageSrc = (imgString) => {
    if (!imgString) return '';
    return imgString.startsWith('http') ? imgString : `${BACKEND_URL}/images/${imgString}`;
  };

  const handlePlaceOrder = async () => {
    if (!customerName || !customerAddress) {
      alert("Missing details! We need your name and address.");
      return;
    }
    const orderData = {
      user: user ? user.id : null,
      customerName,
      customerAddress,
      items: cart.map(item => ({ productId: item._id, name: item.name, quantity: item.quantity, price: item.price })),
      totalAmount: Number(totalAmount)
    };

    try {
      await API.post('/orders', orderData);
      alert('Order Successful! Harvest is on the way.');
      setCart([]);
      navigate('/profile');
    } catch (err) {
      alert('Failed to place order.');
    }
  };

  if (cart.length === 0) return (
    <div style={styles.emptyContainer}>
        <FaShoppingBag size={80} color="#eee" />
        <h1 style={styles.emptyTitle}>YOUR CART IS EMPTY</h1>
        <Link to="/shop" style={styles.shopLink}>START HARVESTING <FaArrowLeft style={{transform: 'rotate(180deg)'}} /></Link>
    </div>
  );

  return (
    <div ref={containerRef} style={styles.page}>
      <style>{`
        .cart-input:focus { border-color: #27ae60 !important; background: #fff !important; }
        .qty-btn-heavy:hover { background: #1b4332 !important; color: #fff !important; }
        .remove-btn-heavy:hover { color: #e74c3c !important; transform: scale(1.2); }
        .order-btn-heavy:hover { letter-spacing: 4px !important; background: #1b4332 !important; }
      `}</style>

      {/* HEADER SECTION */}
      <div style={styles.topHeader}>
        <h1 className="cart-reveal" style={styles.mainTitle}>BAG <span style={{color: '#27ae60'}}>[{cart.length}]</span></h1>
        <p className="cart-reveal" style={styles.subTitle}>REVIEW YOUR SELECTIONS & COMPLETE THE HARVEST</p>
      </div>

      <div style={styles.layout}>
        {/* LEFT: CART ITEMS */}
        <div style={styles.itemsColumn}>
          {cart.map((item) => (
            <div key={item._id} className="cart-reveal" style={styles.cartItem}>
              <div style={styles.imgBox}>
                <img src={renderImageSrc(item.image)} alt={item.name} style={styles.image} />
              </div>
              
              <div style={styles.details}>
                <span style={styles.itemCat}>PURE ORGANIC</span>
                <h3 style={styles.itemName}>{item.name.toUpperCase()}</h3>
                <p style={styles.itemPrice}>₹{item.price} / UNIT</p>
                
                <div style={styles.controls}>
                  <button onClick={() => updateQuantity(item._id, -1)} className="qty-btn-heavy" style={styles.qtyBtn}><FaMinus /></button>
                  <span style={styles.qNum}>{item.quantity}</span>
                  <button onClick={() => handleIncrement(item)} className="qty-btn-heavy" style={styles.qtyBtn}><FaPlus /></button>
                </div>
              </div>

              <div style={styles.priceSection}>
                <p style={styles.subtotal}>₹{(item.price * item.quantity).toFixed(2)}</p>
                <button onClick={() => removeFromCart(item._id)} className="remove-btn-heavy" style={styles.removeBtn}><FaTrash /></button>
              </div>
            </div>
          ))}
        </div>

        {/* RIGHT: SHIPPING & CHECKOUT */}
        <div className="summary-glass" style={styles.checkoutColumn}>
          <div style={styles.summaryCard}>
            <h3 style={styles.summaryTitle}><FaTruck /> SHIPPING</h3>
            
            <div style={styles.formGroup}>
              <label style={styles.label}>RECIPIENT NAME</label>
              <input 
                type="text" className="cart-input" placeholder="FULL NAME"
                value={customerName} onChange={(e) => setCustomerName(e.target.value)}
                style={styles.input}
              />
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label}>DELIVERY ADDRESS</label>
              <textarea 
                rows="4" className="cart-input" placeholder="HOUSE NO, STREET, AREA, PINCODE"
                value={customerAddress} onChange={(e) => setCustomerAddress(e.target.value)}
                style={styles.input}
              />
            </div>

            <div style={styles.costGrid}>
              <div style={styles.costRow}><span>SUBTOTAL</span><span>₹{totalAmount}</span></div>
              <div style={styles.costRow}><span>SHIPPING</span><span style={{color:'#27ae60'}}>FREE</span></div>
              <div style={{...styles.costRow, marginTop: '20px', borderTop: '1px solid #eee', paddingTop: '20px'}}>
                <span style={{fontWeight:'900'}}>TOTAL</span>
                <span style={{fontWeight:'900', fontSize: '1.8rem'}}>₹{totalAmount}</span>
              </div>
            </div>

            <button onClick={handlePlaceOrder} className="order-btn-heavy" style={styles.checkoutBtn}>
              CONFIRM ORDER
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const styles = {
  page: { background: '#fff', minHeight: '100vh', paddingTop: '160px', paddingBottom: '100px', color: '#000' },
  topHeader: { maxWidth: '1300px', margin: '0 auto', padding: '0 40px 60px' },
  mainTitle: { fontSize: '7rem', fontWeight: '900', margin: 0, letterSpacing: '-5px', lineHeight: 0.8 },
  subTitle: { letterSpacing: '4px', fontSize: '0.7rem', color: '#aaa', fontWeight: '900', marginTop: '20px' },
  
  layout: { maxWidth: '1300px', margin: '0 auto', display: 'flex', gap: '60px', padding: '0 40px', flexWrap: 'wrap' },
  itemsColumn: { flex: 1.5, minWidth: '450px', display: 'flex', flexDirection: 'column', gap: '30px' },
  cartItem: { display: 'flex', gap: '30px', borderBottom: '1px solid #eee', paddingBottom: '30px', alignItems: 'center' },
  imgBox: { width: '150px', height: '150px', borderRadius: '25px', overflow: 'hidden', background: '#f9f9f9' },
  image: { width: '100%', height: '100%', objectFit: 'cover' },
  
  details: { flex: 1 },
  itemCat: { fontSize: '0.6rem', fontWeight: '900', letterSpacing: '2px', color: '#27ae60' },
  itemName: { fontSize: '1.5rem', fontWeight: '900', margin: '5px 0' },
  itemPrice: { fontSize: '0.9rem', color: '#888', fontWeight: 'bold' },
  
  controls: { display: 'flex', alignItems: 'center', gap: '15px', marginTop: '20px' },
  qtyBtn: { width: '40px', height: '40px', border: '1px solid #eee', background: 'transparent', borderRadius: '50%', cursor: 'pointer', display: 'flex', justifyContent: 'center', alignItems: 'center', transition: '0.3s' },
  qNum: { fontWeight: '900', fontSize: '1.1rem', width: '30px', textAlign: 'center' },
  
  priceSection: { textAlign: 'right', display: 'flex', flexDirection: 'column', gap: '15px' },
  subtotal: { fontSize: '1.5rem', fontWeight: '300', margin: 0 },
  removeBtn: { background: 'none', border: 'none', color: '#ccc', cursor: 'pointer', transition: '0.3s', fontSize: '1.2rem' },

  checkoutColumn: { flex: 1, minWidth: '400px' },
  summaryCard: { background: '#fcfcfc', border: '1px solid #eee', borderRadius: '40px', padding: '40px', position: 'sticky', top: '150px' },
  summaryTitle: { fontSize: '0.8rem', fontWeight: '900', letterSpacing: '3px', marginBottom: '30px', display: 'flex', alignItems: 'center', gap: '10px' },
  
  formGroup: { marginBottom: '25px' },
  label: { fontSize: '0.6rem', fontWeight: '900', letterSpacing: '2px', color: '#bbb', marginBottom: '10px', display: 'block' },
  input: { width: '100%', padding: '20px', borderRadius: '15px', border: '1px solid #eee', background: '#f6f6f6', outline: 'none', fontSize: '0.9rem', fontWeight: 'bold', transition: '0.3s' },
  
  costGrid: { marginTop: '40px' },
  costRow: { display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', fontWeight: 'bold', letterSpacing: '1px', marginBottom: '10px' },
  
  checkoutBtn: { width: '100%', padding: '25px', background: '#1b4332', color: '#fff', border: 'none', borderRadius: '50px', fontSize: '0.9rem', fontWeight: '900', letterSpacing: '2px', cursor: 'pointer', marginTop: '40px', transition: '0.4s' },

  emptyContainer: { height: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', gap: '30px' },
  emptyTitle: { fontSize: '3rem', fontWeight: '900', letterSpacing: '-2px' },
  shopLink: { textDecoration: 'none', background: '#27ae60', color: '#fff', padding: '20px 40px', borderRadius: '50px', fontWeight: '900', fontSize: '0.8rem', letterSpacing: '2px', display: 'flex', alignItems: 'center', gap: '15px' }
};

export default CartPage;