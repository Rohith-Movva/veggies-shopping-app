import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaArrowLeft, FaEnvelopeOpenText, FaUser, FaPhoneAlt, FaCalendarAlt, FaCheckCircle, FaClock } from 'react-icons/fa';
import API from '../api'; 

const AdminContactsPage = () => {
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  

  // 1. Get user token for authorization
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

  // ---> NEW: FUNCTION TO UPDATE STATUS <---
  const handleMarkAsDone = async (id) => {
    try {
      const config = getUserConfig();
      if (!config) return;

      // Call the new PUT API we just made
      await API.put(`/contact/${id}/status`, { status: 'Done' }, config);
      
      // Update the UI immediately without refreshing the page
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

  return (
    <div style={styles.container}>
      {/* Header */}
      <header style={styles.header}>
        <Link to="/" style={styles.backLink}>
          <FaArrowLeft style={{ marginRight: '8px' }} /> Back to Home
        </Link>
        <h1 style={styles.pageTitle}>Customer Messages</h1>
        <div style={{ width: '100px' }}></div> 
      </header>

      {/* Main Dashboard */}
      <div style={styles.contentWrapper}>
        {isLoading ? (
          <p style={styles.statusText}>Loading messages...</p>
        ) : error ? (
          <div style={styles.errorBox}>{error}</div>
        ) : messages.length === 0 ? (
          <div style={styles.emptyBox}>
            <FaEnvelopeOpenText style={{ fontSize: '40px', color: '#ccc', marginBottom: '15px' }} />
            <p>No messages yet. Your inbox is clear!</p>
          </div>
        ) : (
          <div style={styles.grid}>
            {messages.map((msg) => (
              <div 
                key={msg._id} 
                style={{
                  ...styles.messageCard, 
                  // Visual cue: Gray border if Done, Green border if In Progress
                  borderLeftColor: msg.status === 'Done' ? '#bdc3c7' : '#27ae60',
                  opacity: msg.status === 'Done' ? 0.8 : 1 // Slightly dim completed ones
                }}
              >
                <div style={styles.cardHeader}>
                  <div style={styles.headerRow}>
                    <FaUser style={{...styles.icon, color: msg.status === 'Done' ? '#7f8c8d' : '#27ae60'}} /> 
                    <span style={styles.name}>{msg.name}</span>
                  </div>
                  
                  {/* ---> NEW: STATUS BADGE <--- */}
                  <div style={{
                    ...styles.statusBadge, 
                    backgroundColor: msg.status === 'Done' ? '#e8f6f3' : '#fcf3cf',
                    color: msg.status === 'Done' ? '#117a65' : '#b7950b'
                  }}>
                    {msg.status === 'Done' ? <FaCheckCircle style={{marginRight: '5px'}}/> : <FaClock style={{marginRight: '5px'}}/>}
                    {msg.status || 'In Progress'}
                  </div>
                </div>
                
                <div style={styles.contactDetails}>
                  <p style={styles.detailText}><FaEnvelopeOpenText style={styles.smallIcon} /> {msg.email}</p>
                  <p style={styles.detailText}><FaPhoneAlt style={styles.smallIcon} /> {msg.mobile}</p>
                  <p style={styles.detailText}><FaCalendarAlt style={styles.smallIcon} /> {formatDate(msg.createdAt)}</p>
                </div>

                <div style={styles.messageBody}>
                  <p style={styles.messageLabel}>Message:</p>
                  <p style={styles.comments}>{msg.comments}</p>
                </div>

                {/* ---> NEW: ACTION BUTTON <--- */}
                {msg.status !== 'Done' && (
                  <div style={styles.actionRow}>
                    <button onClick={() => handleMarkAsDone(msg._id)} style={styles.doneBtn}>
                      <FaCheckCircle style={{ marginRight: '8px' }} /> Mark as Done
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

// Clean Dashboard Styling
const styles = {
  container: { fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif", width: '100%', minHeight: '100vh', backgroundColor: '#f4f7f6' },
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '20px 40px', backgroundColor: 'white', boxShadow: '0 2px 10px rgba(0,0,0,0.05)', position: 'sticky', top: 0, zIndex: 1000 },
  backLink: { display: 'flex', alignItems: 'center', textDecoration: 'none', color: '#2c3e50', fontWeight: '600', width: '120px' },
  pageTitle: { color: '#2c3e50', margin: 0, fontSize: '24px', fontWeight: '800' },
  contentWrapper: { padding: '40px 20px', maxWidth: '1000px', margin: '0 auto' },
  statusText: { textAlign: 'center', fontSize: '18px', color: '#666', marginTop: '50px' },
  errorBox: { backgroundColor: '#f8d7da', color: '#721c24', padding: '20px', borderRadius: '10px', textAlign: 'center', fontWeight: 'bold' },
  emptyBox: { display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '60px', backgroundColor: 'white', borderRadius: '15px', border: '1px dashed #ccc', color: '#777' },
  grid: { display: 'flex', flexDirection: 'column', gap: '20px' },
  
  messageCard: { backgroundColor: 'white', borderRadius: '12px', padding: '25px', boxShadow: '0 4px 15px rgba(0,0,0,0.04)', borderLeft: '5px solid', transition: 'all 0.3s ease' },
  cardHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #eee', paddingBottom: '15px', marginBottom: '15px', flexWrap: 'wrap', gap: '10px' },
  headerRow: { display: 'flex', alignItems: 'center', color: '#2c3e50' },
  name: { fontSize: '20px', fontWeight: 'bold', marginLeft: '10px' },
  statusBadge: { display: 'flex', alignItems: 'center', padding: '5px 12px', borderRadius: '20px', fontSize: '13px', fontWeight: 'bold' },
  icon: { fontSize: '18px' },
  smallIcon: { color: '#aaa', marginRight: '8px' },
  contactDetails: { display: 'flex', gap: '25px', marginBottom: '20px', flexWrap: 'wrap' },
  detailText: { margin: 0, display: 'flex', alignItems: 'center', color: '#555', fontWeight: '500', fontSize: '14px' },
  messageBody: { backgroundColor: '#f9fbf9', padding: '15px', borderRadius: '8px', border: '1px solid #eef2ef' },
  messageLabel: { margin: '0 0 5px 0', fontSize: '13px', color: '#777', textTransform: 'uppercase', fontWeight: 'bold' },
  comments: { margin: 0, color: '#333', lineHeight: '1.6', fontSize: '16px', whiteSpace: 'pre-wrap' },
  
  actionRow: { display: 'flex', justifyContent: 'flex-end', marginTop: '15px' },
  doneBtn: { backgroundColor: '#27ae60', color: 'white', border: 'none', padding: '8px 16px', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold', display: 'flex', alignItems: 'center', transition: 'background-color 0.2s' }
};

export default AdminContactsPage;