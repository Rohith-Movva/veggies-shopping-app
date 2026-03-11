import React, { useState, useEffect, useRef } from 'react';
import { FaUserCircle, FaBoxOpen, FaShoppingBag } from 'react-icons/fa';
import gsap from 'gsap';
import API from '../api';

const ProfilePage = ({ user }) => {
  const [myOrders, setMyOrders] = useState([]);

  useEffect(() => {
    if (user) {
      const fetchMyOrders = async () => {
        try {
          const res = await API.get(`/orders/user/${user.id}`);
          setMyOrders(res.data);
        } catch (err) {
          console.error("Error fetching orders:", err);
        }
      };
      fetchMyOrders();
    }
  }, [user]);

  const getStatusColor = (status) => {
    switch (status) {
      case 'Pending': return '#f59e0b';   // Amber
      case 'Processing': return '#3b82f6'; // Blue
      case 'Shipped': return '#8b5cf6';    // Purple
      case 'Delivered': return '#10b981';  // Emerald Green
      case 'Cancelled': return '#ef4444';  // Red
      default: return '#64748b'; // Slate Gray
    }
  };

  const compRef = useRef(null);

  useEffect(() => {
    if (!user) return;

    let ctx = gsap.context(() => {
      gsap.fromTo('.profile-card-anim',
        { x: -40, opacity: 0 },
        { x: 0, opacity: 1, duration: 0.8, ease: "power3.out", delay: 0.1 }
      );

      gsap.fromTo('.orders-header-anim',
        { y: 30, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.6, ease: "power2.out", delay: 0.2 }
      );

      if (myOrders.length > 0) {
        gsap.fromTo('.order-card-anim',
          { y: 50, opacity: 0, scale: 0.98 },
          { y: 0, opacity: 1, scale: 1, duration: 0.6, stagger: 0.15, ease: "back.out(1.2)", delay: 0.3 }
        );
      }
    }, compRef);

    return () => ctx.revert();
  }, [user, myOrders.length]);

  if (!user) return (
    <div className="ambient-bg" style={styles.loadingContainer}>
      <h2 style={styles.loadingText}>Please Login to view your profile.</h2>
    </div>
  );

  return (
    <div ref={compRef} className="ambient-bg" style={styles.pageWrapper}>
      
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

          .order-card {
            transition: all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94);
          }
          .order-card:hover {
            transform: translateY(-5px);
            box-shadow: 0 15px 35px rgba(0,0,0,0.06) !important;
            border-color: rgba(39, 174, 96, 0.2) !important;
          }
        `}
      </style>

      <div style={styles.container}>
        
        {/* 1. User Info Card */}
        <div className="profile-card-anim" style={styles.profileCard}>
          <div style={styles.profileInner}>
            <div style={styles.avatarWrapper}>
              <FaUserCircle style={styles.avatarIcon} />
            </div>
            <h2 style={styles.userName}>{user.name}</h2>
            <p style={styles.userEmail}>{user.email}</p>
            <div style={styles.badge}>Member</div>
          </div>
        </div>

        {/* 2. Order History Section */}
        <div style={styles.ordersSection}>
          <div className="orders-header-anim" style={styles.sectionHeader}>
            <h2 style={styles.sectionTitle}>
              <FaBoxOpen style={{ color: '#27ae60' }} /> Order History
            </h2>
            <p style={styles.orderCountText}>You have {myOrders.length} order{myOrders.length !== 1 ? 's' : ''}.</p>
          </div>

          {myOrders.length === 0 ? (
            <div className="orders-header-anim" style={styles.emptyState}>
               <FaShoppingBag style={styles.emptyIcon} />
               <h3 style={styles.emptyTextTitle}>No orders yet.</h3>
               <p style={styles.emptyTextSub}>Your recent purchases will appear here.</p>
            </div>
          ) : (
            <div style={styles.orderList}>
              {myOrders.map((order) => (
                <div key={order._id} className="order-card-anim order-card" style={styles.orderCard}>
                  
                  {/* Order Header */}
                  <div style={styles.orderHeader}>
                    <span style={styles.orderId}>Order #{order._id ? order._id.slice(-8).toUpperCase() : 'N/A'}</span>
                    <span style={styles.date}>
                      {order.createdAt ? new Date(order.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }) : 'Unknown Date'}
                    </span>
                  </div>

                  {/* Items List */}
                  <div style={styles.itemsContainer}>
                    {order.items && order.items.map((item, idx) => (
                      <div key={idx} style={styles.itemRow}>
                        <span style={styles.itemName}>
                          <span style={styles.itemQty}>x{item.quantity || 1}</span> {item.name || 'Unknown Item'}
                        </span>
                        {/* 🔴 FIXED: Safe fallback for item math */}
                        <span style={styles.itemPrice}>₹{((item.price || 0) * (item.quantity || 1)).toFixed(2)}</span>
                      </div>
                    ))}
                  </div>

                  {/* Total & Status */}
                  <div style={styles.orderFooter}>
                    <span style={{ 
                      ...styles.statusBadge,
                      backgroundColor: `${getStatusColor(order.status || 'Pending')}15`, 
                      color: getStatusColor(order.status || 'Pending'),
                      border: `1px solid ${getStatusColor(order.status || 'Pending')}40`
                    }}>
                      <span style={{
                        display: 'inline-block',
                        width: '8px',
                        height: '8px',
                        borderRadius: '50%',
                        backgroundColor: getStatusColor(order.status || 'Pending'),
                        marginRight: '6px'
                      }}></span>
                      {order.status || 'Pending'}
                    </span>

                    {/* 🔴 FIXED: Safe fallback for totalAmount */}
                    <span style={styles.totalAmount}>
                      Total: ₹{(order.totalAmount || 0).toFixed(2)}
                    </span>
                  </div>

                </div>
              ))}
            </div>
          )}
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
  loadingContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '80vh',
    width: '100%',
    fontFamily: "'Outfit', 'Segoe UI', sans-serif",
  },
  loadingText: {
    color: '#64748b',
    fontSize: '1.5rem',
    fontWeight: '700'
  },
  container: {
    maxWidth: '1200px', 
    margin: '0 auto', 
    padding: '60px 40px 100px 40px',
    display: 'flex',
    gap: '50px',
    flexWrap: 'wrap',
    alignItems: 'flex-start'
  },
  
  // Left Column (Profile)
  profileCard: {
    flex: '1 1 350px',
    padding: '40px',
    borderRadius: '24px',
    boxShadow: '0 20px 50px rgba(0,0,0,0.06)',
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    backdropFilter: 'blur(20px)',
    border: '1px solid rgba(255,255,255,0.9)',
    position: 'sticky',
    top: '120px'
  },
  profileInner: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    textAlign: 'center'
  },
  avatarWrapper: {
    width: '120px',
    height: '120px',
    borderRadius: '50%',
    backgroundColor: '#f8fafc',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: '20px',
    boxShadow: 'inset 0 4px 10px rgba(0,0,0,0.05)'
  },
  avatarIcon: {
    fontSize: '80px', 
    color: '#cbd5e1' 
  },
  userName: {
    fontSize: '1.8rem',
    color: '#0f172a',
    margin: '0 0 5px 0',
    fontWeight: '800',
    letterSpacing: '-0.5px'
  },
  userEmail: {
    color: '#64748b',
    fontSize: '1.05rem',
    margin: '0 0 20px 0',
    fontWeight: '500'
  },
  badge: {
    display: 'inline-block',
    padding: '8px 20px',
    backgroundColor: '#f0fdf4',
    color: '#27ae60',
    borderRadius: '50px',
    fontSize: '0.9rem',
    fontWeight: '800',
    border: '1px solid #dcfce7',
    letterSpacing: '0.5px',
    textTransform: 'uppercase'
  },

  // Right Column (Orders)
  ordersSection: {
    flex: '2 1 600px',
    minWidth: '300px'
  },
  sectionHeader: {
    marginBottom: '30px',
    borderBottom: '2px solid rgba(0,0,0,0.05)',
    paddingBottom: '20px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    flexWrap: 'wrap',
    gap: '15px'
  },
  sectionTitle: {
    margin: 0,
    fontSize: '2rem',
    color: '#0f172a',
    fontWeight: '800',
    display: 'flex',
    alignItems: 'center',
    gap: '15px',
    letterSpacing: '-0.5px'
  },
  orderCountText: {
    margin: 0,
    color: '#64748b',
    fontWeight: '600',
    fontSize: '1.05rem'
  },
  
  // Empty State
  emptyState: {
    textAlign: 'center',
    padding: '60px 40px',
    backgroundColor: 'rgba(255,255,255,0.6)',
    borderRadius: '24px',
    border: '1px dashed #cbd5e1'
  },
  emptyIcon: {
    fontSize: '60px',
    color: '#e2e8f0',
    marginBottom: '20px'
  },
  emptyTextTitle: {
    fontSize: '1.5rem',
    color: '#334155',
    margin: '0 0 10px 0',
    fontWeight: '800'
  },
  emptyTextSub: {
    color: '#64748b',
    margin: 0,
    fontSize: '1.1rem'
  },

  // Order List & Cards
  orderList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '25px'
  },
  orderCard: {
    border: '1px solid rgba(255,255,255,0.9)',
    borderRadius: '20px',
    padding: '30px',
    backgroundColor: 'rgba(255, 255, 255, 0.85)',
    backdropFilter: 'blur(10px)',
    boxShadow: '0 10px 30px rgba(0,0,0,0.03)'
  },
  orderHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottom: '1px solid rgba(0,0,0,0.05)',
    paddingBottom: '15px',
    marginBottom: '20px'
  },
  orderId: {
    fontWeight: '800',
    color: '#0f172a',
    fontSize: '1.1rem'
  },
  date: {
    fontSize: '0.95rem',
    color: '#64748b',
    fontWeight: '500'
  },
  itemsContainer: {
    margin: '0 0 25px 0',
    display: 'flex',
    flexDirection: 'column',
    gap: '12px'
  },
  itemRow: {
    display: 'flex',
    justifyContent: 'space-between',
    fontSize: '1.05rem',
    color: '#334155',
    fontWeight: '500'
  },
  itemName: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px'
  },
  itemQty: {
    backgroundColor: '#f1f5f9',
    color: '#475569',
    padding: '2px 8px',
    borderRadius: '6px',
    fontSize: '0.85rem',
    fontWeight: '700'
  },
  itemPrice: {
    fontWeight: '600',
    color: '#0f172a'
  },
  orderFooter: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTop: '1px solid rgba(0,0,0,0.05)',
    paddingTop: '20px'
  },
  statusBadge: {
    padding: '8px 16px', 
    borderRadius: '50px', 
    fontSize: '0.85rem', 
    fontWeight: '800',
    display: 'flex',
    alignItems: 'center',
    textTransform: 'uppercase',
    letterSpacing: '0.5px'
  },
  totalAmount: {
    fontSize: '1.4rem',
    fontWeight: '800',
    color: '#0f172a',
    letterSpacing: '-0.5px'
  }
};

export default ProfilePage;