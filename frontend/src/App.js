import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ScrollToTop from './components/ScrollToTop';

// Pages
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import HomePage from './pages/HomePage';
import CategoryPage from './pages/CategoryPage';
import CartPage from './pages/CartPage';
import ProductDetails from './pages/ProductDetails';
import AdminPage from './pages/AdminPage';
import ProfilePage from './pages/ProfilePage';
import InventoryPage from './pages/InventoryPage';
import AboutUsPage from './pages/AboutUsPage';

function App() {
  const [user, setUser] = useState(null);
  const [cart, setCart] = useState([]);

  // PERSIST LOGIN ON REFRESH
  useEffect(() => {
    const token = localStorage.getItem('token');
    const storedUser = localStorage.getItem('userInfo'); 
    
    if (token && storedUser && !user) {
      setUser(JSON.parse(storedUser));
    }
  }, []); 

  // --- LOGOUT FUNCTION ---
  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userInfo'); // Clear userInfo too
    setCart([]);
    window.location.href = '/';
  };

  // Updated Add to Cart with "Login Check" & "Cart Awareness" Logic
  const addToCart = (product, qty) => {
    // 🔴 NEW: Check if user is logged in
    if (!user) {
      alert("Please login to add items to your cart.");
      window.location.href = '/login';
      return;
    }

    // 1. Check if the item is already in the cart
    const exist = cart.find((x) => x._id === product._id);
    
    // 2. Calculate what the TOTAL would be after adding
    const currentQtyInCart = exist ? exist.quantity : 0;
    const totalProposedQty = currentQtyInCart + qty;
    const MAX_LIMIT = 10;

    // 3. Rule 1: Check against Total Inventory
    if (totalProposedQty > product.stock) {
      alert(`Cannot add more! You already have ${currentQtyInCart} in your cart. Only ${product.stock} available in total.`);
      return; 
    }

    // 4. Rule 2: Check against Max Order Limit (10)
    if (totalProposedQty > MAX_LIMIT) {
      alert(`Limit Exceeded! You have ${currentQtyInCart} in cart. Max allowed is ${MAX_LIMIT} per order.`);
      return; 
    }

    // 5. If checks pass, proceed normally
    if (exist) {
      setCart(
        cart.map((x) =>
          x._id === product._id ? { ...exist, quantity: totalProposedQty } : x
        )
      );
    } else {
      setCart([...cart, { ...product, quantity: qty }]);
    }
    
    //alert("Added to Cart Successfully!");
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
    <Router>
      {/* Show Navbar for logged in users, or if you want public users to see it too, remove the check */}
      <Navbar user={user} cartCount={cart.length} handleLogout={handleLogout} />
      
      <ScrollToTop />

      <div style={{ minHeight: '80vh' }}>

        <Routes>

          {/* --- PUBLIC ROUTES (No Login Required) --- */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/about" element={<AboutUsPage />} />
          
          {/* 🔴 CHANGED: Made Product & Category Public */}
          <Route path="/product/:id" element={<ProductDetails addToCart={addToCart} />} />
          <Route path="/category/:categoryName" element={<CategoryPage addToCart={addToCart} />} />

          {/* Login/Signup only accessible if NOT logged in */}
          <Route path="/login" element={!user ? <LoginPage setUser={setUser} /> : <Navigate to="/" />} />
          <Route path="/signup" element={!user ? <SignupPage /> : <Navigate to="/" />} />


          {/* --- PRIVATE ROUTES (Login Required) --- */}
          {/* If they try to go to /shop, redirect to home/landing */}
          <Route path="/shop" element={<HomePage />} /> 
          
          <Route path="/admin" element={user && user.isAdmin ? <AdminPage /> : <Navigate to="/" /> } />

          <Route 
            path="/cart" 
            element={
              user ? 
              <CartPage 
                user={user} 
                cart={cart} 
                setCart={setCart} 
                removeFromCart={removeFromCart} 
                updateQuantity={updateQuantity} 
              /> 
              : <Navigate to="/login" />
            } 
          />
          
          <Route 
            path="/profile" 
            element={user ? <ProfilePage user={user} /> : <Navigate to="/login" />} 
          />

          <Route 
            path="/admin/inventory" 
            element={user && user.isAdmin ? <InventoryPage /> : <Navigate to="/" />} 
          />

        </Routes>
      </div>

      <Footer />
    </Router>
  );
}

export default App;