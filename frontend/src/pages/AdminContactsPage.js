import React, { useState, useEffect, useRef } from 'react';
import { FaEnvelopeOpenText, FaUser, FaPhoneAlt, FaCalendarAlt, FaCheckCircle, FaClock } from 'react-icons/fa';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import API from '../api'; 

gsap.registerPlugin(ScrollTrigger);

const AdminContactsPage = () => {
  // --- ORIGINAL STATE & LOGIC (UNTOUCHED) ---
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  
  const getUserConfig = () => {
    const userInfo = JSON.parse(localStorage.getItem('userInfo'));
    if (!userInfo || !userInfo.isAdmin) return null;
    return { headers: { Authorization: `Bearer ${userInfo.token}` } };
  };

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const config = getUserConfig();
        if (!config) {
          setError('Not authorized. You must be logged in as an admin.');
          setIsLoading(false);
          return;
        }

        const { data } = await API.get('/contact', config);
        setMessages(data);
        setIsLoading(false);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch messages.');
        setIsLoading(false);
      }
    };
    fetchMessages();
  }, []);

  const handleMarkAsDone = async (id) => {
    try {
      const config = getUserConfig();
      if (!config) return;

      await API.put(`/contact/${id}/status`, { status: 'Done' }, config);
      
      setMessages((prevMessages) => 
        prevMessages.map((msg) => msg._id === id ? { ...msg, status: 'Done' } : msg)
      );
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to update status');
    }
  };

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  // --- GSAP HIGH-MOTION LOGIC ---
  const compRef = useRef(null);

  useEffect(() => {
    if (isLoading || messages.length === 0) return;

    let ctx = gsap.context(() => {
      // Header Animation
      gsap.fromTo('.page-header-anim',
        { y: 30, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.6, ease: "power2.out" }
      );

      // Staggered Reveal for Message Cards
      gsap.fromTo('.message-card-anim',
        { y: 50, opacity: 0, scale: 0.98 },
        { y: 0, opacity: 1, scale: 1, duration: 0.6, stagger: 0.15, ease: "back.out(1.2)", delay: 0.2 }
      );
    }, compRef);

    return () => ctx.revert();
  }, [isLoading, messages.length]);

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

          /* Message Card Hover Polish */
          .message-card {
            transition: all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94);
          }
          .message-card:hover {
            transform: translateY(-5px);
            box-shadow: 0 15px 35px rgba(0,0,0,0.06) !important;
            border-color: rgba(39, 174, 96, 0.2) !important;
          }

          /* Button Hover */
          .done-btn { transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1); }
          .done-btn:hover {
            transform: translateY(-3px);
            box-shadow: 0 10px 20px rgba(39, 174, 96, 0.3) !important;
          }
        `}
      </style>

      {/* Main Dashboard */}
      <div style={styles.contentWrapper}>
        
        {/* Replaced old header with seamlessly integrated title */}
        <div className="page-header-anim" style={styles.sectionHeader}>
          <h1 style={styles.pageTitle}>Customer Messages</h1>
          <p style={styles.subtitle}>Manage and respond to incoming inquiries from your customers.</p>
        </div>

        {isLoading ? (
          <div style={styles.loadingContainer}>
            <p style={styles.statusText}>Loading messages...</p>
          </div>
        ) : error ? (
          <div style={styles.errorBox}>{error}</div>
        ) : messages.length === 0 ? (
          <div style={styles.emptyBox}>
            <FaEnvelopeOpenText style={styles.emptyIcon} />
            <h3 style={styles.emptyTitle}>Inbox Zero!</h3>
            <p style={styles.emptyText}>You have no messages at the moment.</p>
          </div>
        ) : (
          <div style={styles.grid}>
            {messages.map((msg) => (
              <div 
                key={msg._id} 
                className="message-card-anim message-card"
                style={{
                  ...styles.messageCard, 
                  borderLeft: `6px solid ${msg.status === 'Done' ? '#cbd5e1' : '#27ae60'}`,
                  opacity: msg.status === 'Done' ? 0.75 : 1
                }}
              >
                <div style={styles.cardHeader}>
                  <div style={styles.headerRow}>
                    <FaUser style={{...styles.icon, color: msg.status === 'Done' ? '#94a3b8' : '#27ae60'}} /> 
                    <span style={styles.name}>{msg.name}</span>
                  </div>
                  
                  <div style={{
                    ...styles.statusBadge, 
                    backgroundColor: msg.status === 'Done' ? '#f1f5f9' : '#f0fdf4',
                    color: msg.status === 'Done' ? '#64748b' : '#166534',
                    border: `1px solid ${msg.status === 'Done' ? '#e2e8f0' : '#bbf7d0'}`
                  }}>
                    {msg.status === 'Done' ? <FaCheckCircle style={{marginRight: '6px'}}/> : <FaClock style={{marginRight: '6px'}}/>}
                    {msg.status || 'In Progress'}
                  </div>
                </div>
                
                <div style={styles.contactDetails}>
                  <p style={styles.detailText}><FaEnvelopeOpenText style={styles.smallIcon} /> {msg.email}</p>
                  <p style={styles.detailText}><FaPhoneAlt style={styles.smallIcon} /> {msg.mobile}</p>
                  <p style={styles.detailText}><FaCalendarAlt style={styles.smallIcon} /> {formatDate(msg.createdAt)}</p>
                </div>

                <div style={styles.messageBody}>
                  <p style={styles.messageLabel}>Message</p>
                  <p style={styles.comments}>{msg.comments}</p>
                </div>

                {msg.status !== 'Done' && (
                  <div style={styles.actionRow}>
                    <button onClick={() => handleMarkAsDone(msg._id)} className="done-btn" style={styles.doneBtn}>
                      <FaCheckCircle style={{ marginRight: '8px', fontSize: '1.1em' }} /> Mark as Done
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
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
  contentWrapper: { 
    padding: '60px 20px 100px 20px', 
    maxWidth: '1000px', 
    margin: '0 auto',
    boxSizing: 'border-box'
  },
  sectionHeader: {
    marginBottom: '50px',
    borderBottom: '2px solid rgba(0,0,0,0.05)',
    paddingBottom: '20px',
  },
  pageTitle: { 
    color: '#0f172a', 
    margin: '0 0 10px 0', 
    fontSize: 'clamp(2rem, 4vw, 3rem)', 
    fontWeight: '800',
    letterSpacing: '-1px'
  },
  subtitle: {
    color: '#64748b',
    fontSize: '1.1rem',
    margin: 0
  },
  loadingContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '40vh'
  },
  statusText: { 
    fontSize: '1.3rem', 
    color: '#64748b', 
    fontWeight: '600' 
  },
  errorBox: { 
    backgroundColor: '#fef2f2', 
    color: '#b91c1c', 
    padding: '20px', 
    borderRadius: '16px', 
    textAlign: 'center', 
    fontWeight: '700',
    border: '1px solid #fecaca'
  },
  emptyBox: { 
    display: 'flex', 
    flexDirection: 'column', 
    alignItems: 'center', 
    justifyContent: 'center', 
    padding: '80px 40px', 
    backgroundColor: 'rgba(255,255,255,0.7)', 
    backdropFilter: 'blur(10px)',
    borderRadius: '24px', 
    border: '1px dashed #cbd5e1', 
    color: '#475569',
    textAlign: 'center'
  },
  emptyIcon: {
    fontSize: '60px',
    color: '#cbd5e1',
    marginBottom: '20px'
  },
  emptyTitle: {
    margin: '0 0 10px 0',
    fontSize: '1.8rem',
    fontWeight: '800',
    color: '#0f172a'
  },
  emptyText: {
    margin: 0,
    fontSize: '1.1rem'
  },
  grid: { 
    display: 'flex', 
    flexDirection: 'column', 
    gap: '30px' 
  },
  messageCard: { 
    backgroundColor: 'rgba(255, 255, 255, 0.85)', 
    backdropFilter: 'blur(12px)',
    borderRadius: '24px', 
    padding: '35px', 
    boxShadow: '0 10px 30px rgba(0,0,0,0.03)', 
    borderTop: '1px solid rgba(255,255,255,0.9)',
    borderRight: '1px solid rgba(255,255,255,0.9)',
    borderBottom: '1px solid rgba(255,255,255,0.9)'
  },
  cardHeader: { 
    display: 'flex', 
    justifyContent: 'space-between', 
    alignItems: 'center', 
    borderBottom: '1px solid rgba(0,0,0,0.06)', 
    paddingBottom: '20px', 
    marginBottom: '20px', 
    flexWrap: 'wrap', 
    gap: '15px' 
  },
  headerRow: { 
    display: 'flex', 
    alignItems: 'center', 
    color: '#0f172a' 
  },
  name: { 
    fontSize: '1.5rem', 
    fontWeight: '800', 
    marginLeft: '12px',
    letterSpacing: '-0.5px'
  },
  statusBadge: { 
    display: 'flex', 
    alignItems: 'center', 
    padding: '8px 16px', 
    borderRadius: '50px', 
    fontSize: '0.9rem', 
    fontWeight: '800',
    textTransform: 'uppercase',
    letterSpacing: '0.5px'
  },
  icon: { 
    fontSize: '22px' 
  },
  smallIcon: { 
    color: '#94a3b8', 
    marginRight: '10px',
    fontSize: '1.1em'
  },
  contactDetails: { 
    display: 'flex', 
    gap: '25px', 
    marginBottom: '25px', 
    flexWrap: 'wrap' 
  },
  detailText: { 
    margin: 0, 
    display: 'flex', 
    alignItems: 'center', 
    color: '#475569', 
    fontWeight: '600', 
    fontSize: '1.05rem',
    backgroundColor: '#f8fafc',
    padding: '8px 16px',
    borderRadius: '12px',
    border: '1px solid #f1f5f9'
  },
  messageBody: { 
    backgroundColor: 'rgba(255, 255, 255, 0.6)', 
    padding: '20px', 
    borderRadius: '16px', 
    border: '1px solid #e2e8f0' 
  },
  messageLabel: { 
    margin: '0 0 8px 0', 
    fontSize: '0.9rem', 
    color: '#64748b', 
    textTransform: 'uppercase', 
    fontWeight: '800',
    letterSpacing: '1px'
  },
  comments: { 
    margin: 0, 
    color: '#0f172a', 
    lineHeight: '1.8', 
    fontSize: '1.1rem', 
    whiteSpace: 'pre-wrap',
    fontWeight: '500'
  },
  actionRow: { 
    display: 'flex', 
    justifyContent: 'flex-end', 
    marginTop: '25px',
    borderTop: '1px solid rgba(0,0,0,0.06)',
    paddingTop: '20px'
  },
  doneBtn: { 
    backgroundColor: '#27ae60', 
    color: 'white', 
    border: 'none', 
    padding: '14px 28px', 
    borderRadius: '50px', 
    cursor: 'pointer', 
    fontWeight: '800', 
    fontSize: '1.05rem',
    display: 'flex', 
    alignItems: 'center'
  }
};

export default AdminContactsPage;