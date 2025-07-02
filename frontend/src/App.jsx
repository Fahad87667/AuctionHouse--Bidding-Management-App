import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Container } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import { ToastContainer, Slide } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Components
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import AuctionItemList from './components/AuctionItemList';
import AuctionItemDetail from './components/AuctionItemDetail';
import Login from './components/Login';
import Register from './components/Register';
import AdminDashboard from './components/AdminDashboard';
import About from './components/About';
import Home from './components/Home';
import UserDashboard from './components/UserDashboard';
import PaymentPage from './components/PaymentPage';
import OrderReciept from './components/OrderReciept';
import ContactUs from './components/ContactUs';

// Auth Context
import { AuthProvider, useAuth } from './contexts/AuthContext';

// Protected Route Component
const ProtectedRoute = ({ children, requireAdmin = false }) => {
  const { user, loading } = useAuth();
  
  if (loading) {
    return <div className="text-center mt-5">Loading...</div>;
  }
  
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  
  if (requireAdmin) {
    // Use same hardcoded admin check logic as Navbar
    const isAdmin = user && (
      user.email === 'admin@auction.com' || 
      user.role === 'Admin' || 
      (user.roles && user.roles.includes('Admin'))
    );
    
    if (!isAdmin) {
      return <Navigate to="/" replace />;
    }
  }
  
  return children;
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="App" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
          <Navbar />
          <Container className="mt-4 flex-grow-1">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/auctions" element={<AuctionItemList />} />
              <Route path="/about" element={<About />} />
              <Route path="/auctions/:id" element={<AuctionItemDetail />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route 
                path="/admin" 
                element={
                  <ProtectedRoute requireAdmin={true}>
                    <AdminDashboard />
                  </ProtectedRoute>
                } 
              />
              <Route path="/dashboard" element={
                <ProtectedRoute requireAdmin={false}>
                  <UserDashboard />
                </ProtectedRoute>
              } />
              <Route path="/payment/:auctionId" element={
                <ProtectedRoute requireAdmin={false}>
                  <PaymentPage />
                </ProtectedRoute>
              } />
              <Route path="/order-receipt/:auctionId" element={<OrderReciept />} />
              <Route path="/contact" element={<ContactUs />} />
            </Routes>
          </Container>
          <Footer />
          <ToastContainer 
            position="top-right" 
            autoClose={600} 
            hideProgressBar={false} 
            newestOnTop 
            closeOnClick 
            pauseOnFocusLoss 
            draggable 
            pauseOnHover 
            transition={Slide}
            limit={3}
          />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;