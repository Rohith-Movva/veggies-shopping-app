import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ScrollToTop from './components/ScrollToTop';

// Pages
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import ShopPage from './pages/ShopPage'; // This is your Dashboard
import CategoryPage from './pages/CategoryPage';
import CartPage from './pages/CartPage';
import ProductDetails from './pages/ProductDetails';
import AdminPage from './pages/AdminPage';
import ProfilePage from './pages/ProfilePage';
import InventoryPage from './pages/InventoryPage';
import AboutUsPage from './pages/AboutUsPage';

function AppContent() {
  const [user, setUser] = useState(null);
  const [cart, setCart] = useState([]);
  const location = useLocation(); 

  // --- 1. NAVBAR VISIBILITY LOGIC ---
  // We hide the main app navbar on these public pages
  const hideNavbarPaths = ['/', '/login', '/signup', '/about']; 
  const showNavbar = !hideNavbarPaths.includes(location.pathname);

  // --- 2. AUTH PERSISTENCE ---
  useEffect(() => {
    const token = localStorage.getItem('token');
    const storedUser = localStorage.getItem('userInfo'); 
    if (token && storedUser && !user) {
      setUser(JSON.parse(storedUser));
    }
  }, [user]); 

  // --- 3. LOGOUT ---
  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userInfo'); 
    setCart([]); 
    window.location.href = '/'; // Send back to Landing Page
  };

  // --- 4. CART LOGIC ---
  const addToCart = (product, qty) => {
    if (!user) {
      alert("Please login to add items to your cart.");
      window.location.href = '/login';
      return;
    }
    const exist = cart.find((x) => x._id === product._id);
    const currentQtyInCart = exist ? exist.quantity : 0;
    const totalProposedQty = currentQtyInCart + qty;
    const MAX_LIMIT = 10;

    if (totalProposedQty > product.stock) {
      alert(`Cannot add more! Only ${product.stock} available in total.`);
      return; 
    }
    if (totalProposedQty > MAX_LIMIT) {
      alert(`Limit Exceeded! Max allowed is ${MAX_LIMIT} per order.`);
      return; 
    }

    if (exist) {
      setCart(cart.map((x) => x._id === product._id ? { ...exist, quantity: totalProposedQty } : x));
    } else {
      setCart([...cart, { ...product, quantity: qty }]);
    }
  };

  const removeFromCart = (productId) => {
    setCart(cart.filter(item => item._id !== productId));
  };

  const updateQuantity = (productId, amount) => {
    setCart(cart.map(item => {
      if (item._id === productId) {
        const newQuantity = item.quantity + amount;
        return { ...item, quantity: newQuantity > 0 ? newQuantity : 1 }; 
      }
      return item;
    }));
  };

  return (
    <>
      {/* Show Navbar only if NOT on Landing/Login/Signup */}
      {showNavbar && (
        <Navbar user={user} cartCount={cart.length} handleLogout={handleLogout} />
      )}
      
      <ScrollToTop />
      
      <div style={{ minHeight: '80vh' }}>
        <Routes>
          {/* --- PUBLIC ROUTES --- */}
          {/* If user is logged in, '/' sends them to '/shop' */}
          <Route path="/" element={user ? <Navigate to="/shop" /> : <LandingPage />} />
          <Route path="/about" element={<AboutUsPage />} />
          
          {/* Login/Signup: Redirect to '/shop' if already logged in */}
          <Route path="/login" element={!user ? <LoginPage setUser={setUser} /> : <Navigate to="/shop" />} />
          <Route path="/signup" element={!user ? <SignupPage /> : <Navigate to="/shop" />} />

          {/* --- PRIVATE ROUTES (The Dashboard) --- */}
          {/* This is the new home for logged in users */}
          <Route 
            path="/shop" 
            element={user ? <ShopPage /> : <Navigate to="/login" />} 
          /> 
          
          <Route path="/product/:id" element={<ProductDetails addToCart={addToCart} />} />
          <Route path="/category/:categoryName" element={<CategoryPage addToCart={addToCart} />} />
          
          <Route path="/cart" element={user ? <CartPage user={user} cart={cart} setCart={setCart} removeFromCart={removeFromCart} updateQuantity={updateQuantity} /> : <Navigate to="/login" />} />
          <Route path="/profile" element={user ? <ProfilePage user={user} /> : <Navigate to="/login" />} />
          
          {/* Admin Routes */}
          <Route path="/admin" element={user && user.isAdmin ? <AdminPage /> : <Navigate to="/" /> } />
          <Route path="/admin/inventory" element={user && user.isAdmin ? <InventoryPage /> : <Navigate to="/" />} />

        </Routes>
      </div>
      <Footer />
    </>
  );
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;