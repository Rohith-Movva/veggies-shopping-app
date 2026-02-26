import React, { useState, useEffect, useRef } from 'react';
import { FaUserCircle, FaBoxOpen, FaChevronRight, FaCalendarAlt } from 'react-icons/fa';
import Lenis from 'lenis';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import API from '../api';

const ProfilePage = ({ user }) => {
  const [myOrders, setMyOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const containerRef = useRef(null);

  // --- 1. DATA FETCHING (Wrapped in Safety) ---
  useEffect(() => {
    // Initialize smooth scroll
    const lenis = new Lenis({ lerp: 0.1 });
    function raf(time) { lenis.raf(time); requestAnimationFrame(raf); }
    requestAnimationFrame(raf);

    if (user?.id) {
      const fetchMyOrders = async () => {
        try {
          const res = await API.get(`/orders/user/${user.id}`);
          setMyOrders(Array.isArray(res.data) ? res.data : []);
          setIsLoading(false);
        } catch (err) {
          console.error("Order Fetch Error:", err);
          setIsLoading(false);
        }
      };
      fetchMyOrders();
    } else {
      setIsLoading(false);
    }

    return () => lenis.destroy();
  }, [user]);

  // --- 2. THE STABLE ANIMATION ENGINE ---
  useGSAP(() => {
    // SAFETY CHECK: Do not run if data is still loading or user is missing
    if (isLoading || !user) return;

    const ctx = gsap.context(() => {
      // Set initial hidden state
      gsap.set(".profile-anim", { opacity: 0, y: 30 });

      // Run entrance timeline
      const tl = gsap.timeline();
      tl.to(".profile-anim", {
        opacity: 1,
        y: 0,
        duration: 0.8,
        stagger: 0.1,
        ease: "power3.out",
        clearProps: "all" // Clears GSAP styles after finish so they don't "break" on re-render
      });
    }, containerRef);

    return () => ctx.revert();
  }, [isLoading, user, myOrders.length]); // Re-run only when these specific things change

  const getStatusColor = (status) => {
    switch (status) {
      case 'Pending': return '#f39c12';
      case 'Processing': return '#3498db';
      case 'Shipped': return '#9b59b6';
      case 'Delivered': return '#27ae60';
      case 'Cancelled': return '#e74c3c';
      default: return '#7f8c8d';
    }
  };

  if (!user) return <div style={styles.loader}>ACCESS DENIED. PLEASE LOGIN.</div>;
  if (isLoading) return <div style={styles.loader}>SYNCING YOUR HISTORY...</div>;

  return (
    <div ref={containerRef} style={styles.page}>
      <style>{`
        .order-card-heavy:hover { border-color: #27ae60 !important; transform: translateX(10px); }
        .order-card-heavy { transition: all 0.4s ease; }
      `}</style>

      {/* HEADER SECTION */}
      <header style={styles.header}>
        <div className="profile-anim" style={styles.avatarRow}>
          <FaUserCircle size={100} color="#1b4332" />
          <div>
            <h1 style={styles.userName}>{user.name.toUpperCase()}</h1>
            <p style={styles.userEmail}>{user.email.toUpperCase()}</p>
          </div>
        </div>
      </header>

      {/* DASHBOARD GRID */}
      <main style={styles.dashboardGrid}>
        
        {/* LEFT: INFO CARD */}
        <aside className="profile-anim" style={styles.sidebar}>
           <div style={styles.infoCard}>
              <span style={styles.label}>ACCOUNT TYPE</span>
              <p style={styles.value}>PREMIUM MEMBER</p>
              
              <div style={{marginTop: '30px'}}>
                <span style={styles.label}>ORDER COUNT</span>
                <p style={styles.value}>{myOrders.length}</p>
              </div>
           </div>
        </aside>

        {/* RIGHT: ORDERS LIST */}
        <section style={styles.mainContent}>
          <h2 className="profile-anim" style={styles.sectionTitle}>
             <FaBoxOpen /> ORDER HISTORY
          </h2>

          <div style={styles.orderStack}>
            {myOrders.length === 0 ? (
              <p className="profile-anim" style={styles.emptyText}>No orders found yet.</p>
            ) : (
              myOrders.map((order) => (
                <div key={order._id} className="profile-anim order-card-heavy" style={styles.orderCard}>
                  <div style={styles.cardHeader}>
                    <div>
                      <span style={styles.orderId}>ORDER #{order._id.slice(-6).toUpperCase()}</span>
                      <p style={styles.orderDate}><FaCalendarAlt /> {new Date(order.createdAt).toLocaleDateString()}</p>
                    </div>
                    <span style={{ 
                      ...styles.statusBadge, 
                      color: getStatusColor(order.status),
                      border: `1px solid ${getStatusColor(order.status)}`
                    }}>
                      {order.status.toUpperCase()}
                    </span>
                  </div>

                  <div style={styles.itemsBox}>
                    {order.items.map((item, idx) => (
                      <div key={idx} style={styles.itemRow}>
                        <span>{item.name} (x{item.quantity})</span>
                        <span>₹{item.price * item.quantity}</span>
                      </div>
                    ))}
                  </div>

                  <div style={styles.cardFooter}>
                    <span style={styles.totalLabel}>TOTAL AMOUNT</span>
                    <span style={styles.totalValue}>₹{order.totalAmount} <FaChevronRight size={12}/></span>
                  </div>
                </div>
              ))
            )}
          </div>
        </section>

      </main>
    </div>
  );
};

const styles = {
  page: { background: '#fff', minHeight: '100vh', paddingTop: '140px', paddingBottom: '100px', color: '#000' },
  loader: { height: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center', fontWeight: '900', color: '#1b4332' },
  header: { maxWidth: '1200px', margin: '0 auto', padding: '0 40px 60px' },
  avatarRow: { display: 'flex', alignItems: 'center', gap: '30px' },
  userName: { fontSize: '4rem', fontWeight: '900', margin: 0, color: '#1b4332', letterSpacing: '-2px' },
  userEmail: { fontSize: '0.8rem', color: '#888', letterSpacing: '2px', fontWeight: 'bold' },

  dashboardGrid: { maxWidth: '1200px', margin: '0 auto', display: 'grid', gridTemplateColumns: '300px 1fr', gap: '60px', padding: '0 40px' },
  sidebar: { width: '100%' },
  infoCard: { background: '#f9f9f9', padding: '40px', borderRadius: '30px' },
  label: { fontSize: '0.6rem', fontWeight: '900', color: '#bbb', letterSpacing: '2px' },
  value: { fontSize: '1.2rem', fontWeight: 'bold', margin: '5px 0 0 0', color: '#1b4332' },

  mainContent: { width: '100%' },
  sectionTitle: { fontSize: '0.8rem', fontWeight: '900', letterSpacing: '4px', borderBottom: '1px solid #eee', paddingBottom: '20px', marginBottom: '30px', display: 'flex', alignItems: 'center', gap: '15px' },
  orderStack: { display: 'flex', flexDirection: 'column', gap: '20px' },
  orderCard: { background: '#fff', border: '1px solid #eee', borderRadius: '24px', padding: '30px' },
  cardHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px' },
  orderId: { fontWeight: '900', fontSize: '1rem' },
  orderDate: { fontSize: '0.7rem', color: '#aaa', margin: '5px 0 0 0' },
  statusBadge: { padding: '5px 15px', borderRadius: '50px', fontSize: '0.6rem', fontWeight: '900' },
  itemsBox: { padding: '20px 0', borderTop: '1px solid #f9f9f9', borderBottom: '1px solid #f9f9f9', display: 'flex', flexDirection: 'column', gap: '10px' },
  itemRow: { display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem', color: '#444' },
  cardFooter: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '20px' },
  totalLabel: { fontSize: '0.6rem', color: '#aaa', fontWeight: '900' },
  totalValue: { fontSize: '1.4rem', fontWeight: '300', color: '#1b4332' },
  emptyText: { color: '#ccc', fontWeight: 'bold', textAlign: 'center', padding: '50px' }
};

export default ProfilePage;