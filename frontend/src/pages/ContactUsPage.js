import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaArrowLeft, FaPaperPlane, FaCheckCircle, FaExclamationCircle, FaPhoneAlt, FaEnvelope, FaMapMarkerAlt } from 'react-icons/fa';
import API from '../api'; 

const ContactUsPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    mobile: '',
    comments: ''
  });
  
  const [status, setStatus] = useState('idle'); 
  const [errorMessage, setErrorMessage] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('submitting');
    setErrorMessage('');

    try {
      await API.post('/contact', formData);
      setStatus('success');
      setFormData({ name: '', email: '', mobile: '', comments: '' }); 
      setTimeout(() => setStatus('idle'), 5000);
    } catch (err) {
      console.error(err);
      setStatus('error');
      setErrorMessage(err.response?.data?.message || 'Something went wrong. Please try again.');
    }
  };

  return (
    <div className="animated-bg" style={styles.container}>
      {/* Custom CSS for Advanced Motion & Responsive Grid */}
      <style>
        {`
          /* Slow Moving Gradient Background */
          @keyframes gradientMotion {
            0% { background-position: 0% 50%; }
            50% { background-position: 100% 50%; }
            100% { background-position: 0% 50%; }
          }
          .animated-bg {
            background: linear-gradient(-45deg, #e8f5e9, #ffffff, #f1f8e9, #e0f2f1);
            background-size: 400% 400%;
            animation: gradientMotion 15s ease infinite;
          }

          /* Staggered Slide Fades */
          @keyframes slideRight {
            0% { opacity: 0; transform: translateX(-40px); }
            100% { opacity: 1; transform: translateX(0); }
          }
          @keyframes slideLeft {
            0% { opacity: 0; transform: translateX(40px); }
            100% { opacity: 1; transform: translateX(0); }
          }

          .slide-right { animation: slideRight 0.8s cubic-bezier(0.2, 0.8, 0.2, 1) forwards; }
          .slide-left { animation: slideLeft 0.8s cubic-bezier(0.2, 0.8, 0.2, 1) forwards; animation-delay: 0.2s; opacity: 0; }

          /* Interactive Cards */
          .info-card {
            transition: all 0.3s ease;
            cursor: default;
          }
          .info-card:hover {
            transform: translateY(-5px);
            box-shadow: 0 10px 25px rgba(39, 174, 96, 0.15) !important;
            border-color: #27ae60 !important;
          }

          /* Input Animations */
          .animated-input {
            transition: all 0.3s ease;
          }
          .animated-input:focus {
            border-color: #27ae60 !important;
            box-shadow: 0 0 0 4px rgba(39, 174, 96, 0.15) !important;
            transform: translateY(-2px);
          }

          /* Button Animations */
          .animated-btn { transition: all 0.3s ease; }
          .animated-btn:hover:not(:disabled) {
            transform: translateY(-3px);
            box-shadow: 0 8px 20px rgba(39, 174, 96, 0.4) !important;
          }
          @keyframes flyAway {
            0% { transform: translate(0, 0) scale(1); opacity: 1; }
            50% { transform: translate(20px, -20px) scale(1.2); opacity: 0; }
            100% { transform: translate(0, 0) scale(1); opacity: 1; }
          }
          .submitting-icon { animation: flyAway 1.5s infinite ease-in-out; }
          @keyframes popIn {
            0% { transform: scale(0.9); opacity: 0; }
            100% { transform: scale(1); opacity: 1; }
          }
          .status-box { animation: popIn 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards; }

          /* Responsive Layout */
          .contact-wrapper {
            display: flex;
            flex-direction: column;
            gap: 40px;
            width: 100%;
            max-width: 1100px;
          }
          @media (min-width: 850px) {
            .contact-wrapper {
              flex-direction: row;
            }
            .contact-info { flex: 1; }
            .contact-form { flex: 1.2; }
          }
        `}
      </style>

      {/* Header */}
      <header style={styles.header}>
        <Link to="/" style={styles.backLink}>
          <FaArrowLeft style={{ marginRight: '8px' }} /> Back to Home
        </Link>
        <h1 style={styles.pageTitle}>Contact Us</h1>
        <div style={{ width: '100px' }}></div> 
      </header>

      {/* Main Content */}
      <div style={styles.contentWrapper}>
        <div className="contact-wrapper">
          
          {/* LEFT COLUMN: Contact Info & Map */}
          <div className="contact-info slide-right">
            <h2 style={styles.sectionHeading}>Get in Touch</h2>
            <p style={styles.sectionSubheading}>We'd love to hear from you. Reach out using the details below or fill out the form.</p>
            
            <div style={styles.infoCardsContainer}>
              {/* Phone Card */}
              <div className="info-card" style={styles.infoCard}>
                <div style={styles.iconCircle}><FaPhoneAlt /></div>
                <div>
                  <h3 style={styles.infoTitle}>Call Us</h3>
                  <p style={styles.infoText}>+91-9705116060</p>
                </div>
              </div>

              {/* Email Card */}
              <div className="info-card" style={styles.infoCard}>
                <div style={styles.iconCircle}><FaEnvelope /></div>
                <div>
                  <h3 style={styles.infoTitle}>Email Us</h3>
                  <p style={styles.infoText}>Agrotecharvest@gmail.com</p>
                </div>
              </div>
            </div>

            {/* Google Map */}
            <div className="info-card" style={styles.mapContainer}>
              <div style={{ display: 'flex', alignItems: 'center', marginBottom: '15px', color: '#27ae60', fontWeight: 'bold' }}>
                <FaMapMarkerAlt style={{ marginRight: '8px', fontSize: '20px' }} /> 
                <span style={{ color: '#2c3e50' }}>Our Location</span>
              </div>
              <iframe 
                title="Agro Tech Harvest Location"
                src="https://maps.google.com/maps?q=17.418583,78.578389&hl=en&z=15&output=embed" 
                width="100%" 
                height="220" 
                style={{ border: 0, borderRadius: '12px' }} 
                allowFullScreen="" 
                loading="lazy" 
                referrerPolicy="no-referrer-when-downgrade">
              </iframe>
            </div>
          </div>

          {/* RIGHT COLUMN: The Form */}
          <div className="contact-form slide-left">
            <div style={styles.formCard}>
              <h2 style={styles.formTitle}>Send a Message</h2>

              {status === 'success' && (
                <div style={{...styles.statusBox, backgroundColor: '#d4edda', color: '#155724'}} className="status-box">
                  <FaCheckCircle style={{ marginRight: '10px', fontSize: '20px' }} />
                  Message sent successfully!
                </div>
              )}

              {status === 'error' && (
                <div style={{...styles.statusBox, backgroundColor: '#f8d7da', color: '#721c24'}} className="status-box">
                  <FaExclamationCircle style={{ marginRight: '10px', fontSize: '20px' }} />
                  {errorMessage}
                </div>
              )}

              <form onSubmit={handleSubmit} style={styles.form}>
                <div style={styles.inputGroup}>
                  <label style={styles.label}>Full Name</label>
                  <input 
                    type="text" 
                    name="name" 
                    value={formData.name} 
                    onChange={handleChange} 
                    style={styles.input} 
                    className="animated-input"
                    required 
                  />
                </div>

                <div style={styles.inputGroup}>
                  <label style={styles.label}>Email Address</label>
                  <input 
                    type="email" 
                    name="email" 
                    value={formData.email} 
                    onChange={handleChange} 
                    style={styles.input} 
                    className="animated-input"
                    required 
                  />
                </div>

                <div style={styles.inputGroup}>
                  <label style={styles.label}>Mobile Number</label>
                  <input 
                    type="tel" 
                    name="mobile" 
                    value={formData.mobile} 
                    onChange={handleChange} 
                    style={styles.input} 
                    className="animated-input"
                    required 
                  />
                </div>

                <div style={styles.inputGroup}>
                  <label style={styles.label}>Your Message</label>
                  <textarea 
                    name="comments" 
                    value={formData.comments} 
                    onChange={handleChange} 
                    style={{ ...styles.input, height: '120px', resize: 'vertical' }} 
                    className="animated-input"
                    required 
                  />
                </div>

                <button 
                  type="submit" 
                  style={{
                    ...styles.submitBtn, 
                    backgroundColor: status === 'submitting' ? '#95a5a6' : '#27ae60',
                    cursor: status === 'submitting' ? 'not-allowed' : 'pointer'
                  }} 
                  className="animated-btn"
                  disabled={status === 'submitting'}
                >
                  {status === 'submitting' ? (
                    <>Sending... <FaPaperPlane className="submitting-icon" style={{ marginLeft: '10px' }} /></>
                  ) : (
                    <>Send Message <FaPaperPlane style={{ marginLeft: '10px' }} /></>
                  )}
                </button>
              </form>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

// Clean styling matching your brand
const styles = {
  container: { fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif", width: '100%', minHeight: '100vh', overflowX: 'clip' },
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '20px 40px', backgroundColor: 'rgba(255, 255, 255, 0.9)', backdropFilter: 'blur(10px)', boxShadow: '0 2px 10px rgba(0,0,0,0.05)', position: 'sticky', top: 0, zIndex: 1000 },
  backLink: { display: 'flex', alignItems: 'center', textDecoration: 'none', color: '#2c3e50', fontWeight: '600', width: '120px', transition: 'color 0.2s' },
  pageTitle: { color: '#2c3e50', margin: 0, fontSize: '24px', fontWeight: '800' },
  contentWrapper: { display: 'flex', justifyContent: 'center', padding: '60px 20px', minHeight: 'calc(100vh - 80px)' },
  
  // Left Column Styles
  sectionHeading: { fontSize: '40px', color: '#2c3e50', margin: '0 0 15px 0', fontWeight: '800', lineHeight: '1.2' },
  sectionSubheading: { fontSize: '18px', color: '#555', marginBottom: '35px', lineHeight: '1.6', maxWidth: '90%' },
  infoCardsContainer: { display: 'flex', flexDirection: 'column', gap: '20px', marginBottom: '30px' },
  infoCard: { display: 'flex', alignItems: 'center', backgroundColor: 'white', padding: '20px', borderRadius: '16px', boxShadow: '0 4px 15px rgba(0,0,0,0.03)', border: '1px solid #f0f0f0' },
  iconCircle: { width: '50px', height: '50px', backgroundColor: '#e8f5e9', color: '#27ae60', borderRadius: '50%', display: 'flex', justifyContent: 'center', alignItems: 'center', fontSize: '20px', marginRight: '20px' },
  infoTitle: { margin: '0 0 5px 0', fontSize: '14px', color: '#7f8c8d', textTransform: 'uppercase', letterSpacing: '1px' },
  infoText: { margin: 0, fontSize: '18px', color: '#2c3e50', fontWeight: 'bold' },
  mapContainer: { backgroundColor: 'white', padding: '20px', borderRadius: '16px', boxShadow: '0 4px 15px rgba(0,0,0,0.03)', border: '1px solid #f0f0f0' },

  // Right Column (Form) Styles
  formCard: { backgroundColor: 'white', padding: '40px', borderRadius: '24px', boxShadow: '0 20px 50px rgba(0,0,0,0.08)', width: '100%', border: '1px solid rgba(255,255,255,0.5)' },
  formTitle: { color: '#27ae60', margin: '0 0 30px 0', fontSize: '28px', fontWeight: '800' },
  form: { display: 'flex', flexDirection: 'column', gap: '22px' },
  inputGroup: { display: 'flex', flexDirection: 'column', gap: '8px' },
  label: { fontWeight: '600', color: '#2c3e50', fontSize: '14px', letterSpacing: '0.5px' },
  input: { padding: '14px 16px', borderRadius: '10px', border: '1px solid #ddd', fontSize: '16px', outline: 'none', fontFamily: 'inherit', backgroundColor: '#fcfcfc' },
  submitBtn: { padding: '16px', color: 'white', border: 'none', borderRadius: '10px', fontSize: '18px', fontWeight: 'bold', display: 'flex', justifyContent: 'center', alignItems: 'center', marginTop: '10px' },
  statusBox: { padding: '16px 20px', borderRadius: '10px', marginBottom: '25px', display: 'flex', alignItems: 'center', fontWeight: '600', fontSize: '15px' },
};

export default ContactUsPage;