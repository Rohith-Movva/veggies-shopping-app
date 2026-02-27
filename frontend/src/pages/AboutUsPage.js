import React from 'react';
import { Link } from 'react-router-dom';
import { FaArrowLeft, FaUsers, FaTractor, FaHeart, FaCheckCircle } from 'react-icons/fa';

// 1. IMPORT IMAGES
// Make sure these files exist in src/assets/
import pranayImg from '../assets/pranay.jpg'; 
import abhishekImg from '../assets/abhishek.jpg'; 

const AboutUsPage = () => {
  return (
    <div style={styles.container}>
      
      {/* Navigation Helper */}
      <div style={styles.navBar}>
        <Link to="/" style={styles.backLink}>
          <FaArrowLeft /> Back to Home
        </Link>
      </div>

      {/* Hero Section */}
      <div style={styles.hero}>
        <h1 style={styles.title}>A Journey Born from Struggle, Belief & Purpose</h1>
        <p style={styles.subtitle}>
          Founded by Pranay Muthumula Veera & Abhishek Bandla
        </p>
      </div>

      {/* Main Content Grid */}
      <div style={styles.content}>
        
        {/* Section 1: The Origin Story */}
        <section style={styles.section}>
          <h2 style={styles.heading}>Our Roots</h2>
          <p style={styles.text}>
            Agro Tech Harvest is not just a brand; it is a journey. We, <strong>Pranay Muthumula Veera and Abhishek Bandla</strong>, were raised in a simple rural family where hard work was a way of life.
          </p>

          {/* FOUNDERS PHOTO GRID */}
          <div style={styles.foundersGrid}>
            
            {/* Founder 1 */}
            <div style={styles.founderCard}>
                <img 
                    src={pranayImg} 
                    alt="Pranay Muthumula Veera" 
                    style={styles.founderImg}
                    onError={(e) => {
                      e.target.onerror = null; 
                      e.target.src="https://cdn-icons-png.flaticon.com/512/3135/3135715.png"
                    }}
                />
                <h3 style={styles.founderName}>Pranay Muthumula Veera</h3>
                <p style={styles.founderRole}>Co-Founder</p>
            </div>

            {/* Founder 2 */}
            <div style={styles.founderCard}>
                <img 
                    src={abhishekImg} 
                    alt="Abhishek Bandla" 
                    style={styles.founderImg} 
                    onError={(e) => {
                      e.target.onerror = null; 
                      e.target.src="https://cdn-icons-png.flaticon.com/512/3135/3135715.png"
                    }}
                />
                <h3 style={styles.founderName}>Abhishek Bandla</h3>
                <p style={styles.founderRole}>Co-Founder</p>
            </div>

          </div>

          <p style={styles.text}>
            The idea behind Agro Tech Harvest came as we observed the food market. One truth became impossible to ignore: many products labelled as "healthy" were actually filled with chemicals and preservatives. 
          </p>
          
          <div style={styles.quoteBox}>
            "The most powerful question arose: Can we provide nutrition in its purest, most natural form?"
          </div>

          <p style={styles.text}>
            This question became our turning point, transforming a vision into reality. The journey was not easy, but we stood by our principles.
          </p>
        </section>

        {/* Section 2: Our Principles */}
        <section style={styles.sectionAlt}>
          <h2 style={styles.heading}>Our Unchanging Principles</h2>
          <p style={{marginBottom: '30px', color: '#555'}}>We are open to challenge because we have nothing to hide.</p>
          
          <div style={styles.principlesGrid}>
             <div style={styles.principleItem}><FaCheckCircle color="#27ae60"/> No Compromise on Quality</div>
             <div style={styles.principleItem}><FaCheckCircle color="#27ae60"/> No Chemicals</div>
             <div style={styles.principleItem}><FaCheckCircle color="#27ae60"/> No Preservatives</div>
             <div style={styles.principleItem}><FaCheckCircle color="#27ae60"/> No Added Sugars</div>
             <div style={styles.principleItem}><FaCheckCircle color="#27ae60"/> Only Pure Fruits & Veg</div>
             <div style={styles.principleItem}><FaCheckCircle color="#27ae60"/> 100% Lab Tested</div>
          </div>
        </section>

        {/* Section 3: The Name & Mission */}
        <section style={styles.section}>
          <h2 style={styles.heading}>Why "Agro Tech Harvest"?</h2>
          <div style={styles.nameBreakdown}>
             <p><strong>Agro Tech</strong> = Integration of Agriculture with Technology</p>
             <p><strong>Harvest</strong> = The hard work of farmers</p>
          </div>
          <p style={styles.text}>
            Our mission is simple: To bring nature's goodness directly from farms to Homes without any manipulation.
          </p>
          
          <p style={styles.text}>
            We carefully produce raw powders from Banana, carrot, beetroot, lemon, moringa, and more. Each product is made with a specific purpose and loaded with health benefits.
          </p>
        </section>

        {/* Section 4: Vision Cards */}
        <section style={styles.valuesSection}>
          <div style={styles.card}>
            <FaUsers style={styles.icon} />
            <h3>Rural Employment</h3>
            <p>To create employment opportunities in rural areas and empower local communities.</p>
          </div>
          <div style={styles.card}>
            <FaTractor style={styles.icon} />
            <h3>Support Farmers</h3>
            <p>Supporting our backbone—the farmers—by ensuring they get fair value for their produce.</p>
          </div>
          <div style={styles.card}>
            <FaHeart style={styles.icon} />
            <h3>Accessible Nutrition</h3>
            <p>Making healthy, chemical-free nutrition accessible to every single Indian kitchen.</p>
          </div>
        </section>

        {/* Section 5: Closing Statement */}
        <section style={{marginTop: '60px', textAlign: 'center'}}>
          <h2 style={{color: '#2c3e50', marginBottom: '20px'}}>Our Identity</h2>
          <p style={styles.text}>
            At Agro Tech Harvest, we are not chasing profits. Our aim is to build an organic firm that provides 100% nature-given foods. We stand for <strong>Trust, Purity, and Honesty</strong>.
            <br /><br />
            This is not just a business—it is our identity and commitment to healthier families and a better future.
          </p>
        </section>

      </div>

      {/* Footer Call to Action */}
      <div style={styles.footer}>
        <h3>We invite you to be a part of this journey from our family to yours.</h3>
        <Link to="/" style={styles.ctaBtn}>Explore Our Products</Link>
      </div>

    </div>
  );
};

const styles = {
  container: {
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
    color: '#333',
    lineHeight: '1.6',
  },
  navBar: {
    padding: '20px',
    backgroundColor: '#f9f9f9',
  },
  backLink: {
    textDecoration: 'none',
    color: '#2c3e50',
    fontWeight: 'bold',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    fontSize: '16px'
  },
  hero: {
    backgroundColor: '#27ae60', 
    color: 'white',
    padding: '80px 20px',
    textAlign: 'center',
    backgroundImage: 'linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.5)), url("https://images.unsplash.com/photo-1500937386664-56d1dfef3854?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80")', 
    backgroundSize: 'cover',
    backgroundPosition: 'center',
  },
  title: {
    fontSize: '2.5rem',
    marginBottom: '15px',
    fontWeight: 'bold',
  },
  subtitle: {
    fontSize: '1.3rem',
    maxWidth: '800px',
    margin: '0 auto',
    opacity: '0.95',
    fontWeight: '500'
  },
  content: {
    maxWidth: '1000px',
    margin: '0 auto',
    padding: '60px 20px',
  },
  section: {
    marginBottom: '60px',
    textAlign: 'center',
  },
  sectionAlt: {
    backgroundColor: '#f0fdf4',
    padding: '50px 30px',
    borderRadius: '15px',
    textAlign: 'center',
    marginBottom: '60px',
    boxShadow: '0 5px 15px rgba(0,0,0,0.05)'
  },
  heading: {
    color: '#2c3e50',
    fontSize: '2rem',
    marginBottom: '25px',
    borderBottom: '3px solid #e67e22',
    display: 'inline-block',
    paddingBottom: '10px'
  },
  text: {
    fontSize: '1.15rem',
    color: '#555',
    maxWidth: '800px',
    margin: '0 auto',
    marginBottom: '20px'
  },
  foundersGrid: {
    display: 'flex',
    justifyContent: 'center',
    gap: '40px',
    margin: '40px 0',
    flexWrap: 'wrap'
  },
  founderCard: {
    textAlign: 'center',
    maxWidth: '220px',
    // Ensure the card itself is aligned nicely
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center'
  },
  // 🔴 FIXED ALIGNMENT STYLES
  founderImg: {
    display: 'block', // Forces it to respect margin auto
    margin: '0 auto 15px auto', // Centers horizontally, margin bottom 15px
    width: '180px',
    height: '250px',
    borderRadius: '10px', 
    objectFit: 'cover',
    border: '4px solid #fff',
    boxShadow: '0 4px 10px rgba(0,0,0,0.1)',
    backgroundColor: '#eee'
  },
  founderName: {
    fontSize: '1.2rem',
    color: '#2c3e50',
    margin: '5px 0',
    fontWeight: 'bold'
  },
  founderRole: {
    color: '#7f8c8d',
    fontSize: '0.9rem',
    margin: 0
  },
  quoteBox: {
    fontSize: '1.4rem',
    fontStyle: 'italic',
    color: '#27ae60',
    fontWeight: 'bold',
    margin: '40px auto',
    padding: '20px',
    borderLeft: '5px solid #e67e22',
    backgroundColor: '#fff',
    maxWidth: '700px',
    boxShadow: '0 2px 10px rgba(0,0,0,0.05)'
  },
  principlesGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '20px',
    maxWidth: '800px',
    margin: '0 auto'
  },
  principleItem: {
    backgroundColor: 'white',
    padding: '15px',
    borderRadius: '8px',
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    fontWeight: 'bold',
    color: '#2c3e50',
    boxShadow: '0 2px 5px rgba(0,0,0,0.05)'
  },
  nameBreakdown: {
    backgroundColor: '#fff3cd', 
    padding: '20px',
    borderRadius: '10px',
    display: 'inline-block',
    marginBottom: '30px',
    textAlign: 'left'
  },
  valuesSection: {
    display: 'flex',
    justifyContent: 'center',
    gap: '30px',
    flexWrap: 'wrap',
    marginTop: '40px',
  },
  card: {
    flex: '1',
    minWidth: '280px',
    padding: '30px',
    backgroundColor: 'white',
    boxShadow: '0 10px 20px rgba(0,0,0,0.08)',
    borderRadius: '15px',
    textAlign: 'center',
    border: '1px solid #eee',
    transition: 'transform 0.3s ease'
  },
  icon: {
    fontSize: '40px',
    color: '#27ae60',
    marginBottom: '15px',
  },
  footer: {
    textAlign: 'center',
    padding: '60px 20px',
    backgroundColor: '#2c3e50',
    color: 'white',
  },
  ctaBtn: {
    display: 'inline-block',
    marginTop: '20px',
    padding: '15px 35px',
    backgroundColor: '#e67e22',
    color: 'white',
    textDecoration: 'none',
    fontWeight: 'bold',
    borderRadius: '30px',
    fontSize: '1.2rem',
    boxShadow: '0 4px 15px rgba(230, 126, 34, 0.4)'
  }
};

export default AboutUsPage;