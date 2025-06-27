import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';

const Cart = () => {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchCart = useCallback(async () => {
    try {
      const response = await axios.get('http://localhost:5100/api/cart/1');
      setCartItems(response.data);
      setLoading(false);
    } catch (err) {
      setError('Failed to fetch cart items');
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  const removeFromCart = async (itemId) => {
    try {
      await axios.delete(`http://localhost:5100/api/cart/${itemId}`);
      fetchCart();
    } catch (err) {
      alert('Failed to remove item from cart');
    }
  };

  const calculateTotal = () => {
    return cartItems.reduce((total, item) => {
      return total + (item.product?.price * item.quantity);
    }, 0);
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
        <div style={{ textAlign: 'center' }}>
          <div className="spinner-border text-primary" role="status" style={{ width: '3rem', height: '3rem' }}>
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-3 text-muted">Loading your cart...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
        <div className="alert alert-danger" role="alert" style={{ maxWidth: '500px', borderRadius: '12px' }}>
          <i className="fas fa-exclamation-triangle me-2"></i>
          Error: {error}
        </div>
      </div>
    );
  }

  return (
    <div className="container py-5">
      <div className="text-center mb-5">
        <div className="mb-3">
          <div style={{ 
            width: '80px', 
            height: '80px', 
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto',
            boxShadow: '0 4px 15px rgba(102, 126, 234, 0.3)'
          }}>
            <i className="fas fa-shopping-cart text-white" style={{ fontSize: '32px' }}></i>
          </div>
        </div>
        <h1 className="fw-bold mb-2" style={{ color: '#2d3748' }}>Shopping Cart</h1>
        <p className="text-muted">Review your items before checkout</p>
      </div>
      
      <div className="row justify-content-center">
        <div className="col-lg-8">
          {cartItems.length === 0 ? (
            <div className="text-center py-5">
              <div className="card border-0 shadow-sm" style={{ borderRadius: '20px' }}>
                <div className="card-body p-5">
                  <i className="fas fa-shopping-basket text-muted mb-4" style={{ fontSize: '4rem' }}></i>
                  <h5 className="mb-3">Your cart is empty</h5>
                  <p className="text-muted mb-4">
                    Looks like you haven't added any items to your cart yet.
                  </p>
                  <a 
                    href="/" 
                    className="btn btn-primary"
                    style={{
                      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                      border: 'none',
                      padding: '12px 30px',
                      borderRadius: '25px',
                      fontWeight: '600',
                      boxShadow: '0 4px 15px rgba(102, 126, 234, 0.3)'
                    }}
                  >
                    <i className="fas fa-arrow-left me-2"></i>
                    Continue Shopping
                  </a>
                </div>
              </div>
            </div>
          ) : (
            <>
              <div className="card border-0 shadow-sm mb-4" style={{ borderRadius: '20px' }}>
                <div className="card-body p-4">
                  {cartItems.map((item, index) => (
                    <div 
                      key={item.id} 
                      className="d-flex align-items-center p-3 mb-3"
                      style={{ 
                        borderBottom: index < cartItems.length - 1 ? '1px solid #f0f4f8' : 'none',
                        transition: 'background 0.2s ease',
                        borderRadius: '12px'
                      }}
                      onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#f8fafc'}
                      onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                    >
                      <div style={{
                        width: '100px',
                        height: '100px',
                        borderRadius: '12px',
                        overflow: 'hidden',
                        marginRight: '20px',
                        boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                      }}>
                        <img 
                          src={item.product?.imageUrl || 'https://via.placeholder.com/100x100?text=Product'} 
                          alt={item.product?.name}
                          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        />
                      </div>
                      
                      <div className="flex-grow-1">
                        <h5 className="mb-1 fw-semibold" style={{ color: '#2d3748' }}>
                          {item.product?.name}
                        </h5>
                        <div className="d-flex align-items-center">
                          <span className="text-muted me-3">
                            <i className="fas fa-tag me-1"></i>
                            ${item.product?.price}
                          </span>
                          <span className="text-muted">
                            <i className="fas fa-times me-1"></i>
                            {item.quantity}
                          </span>
                        </div>
                        <div className="mt-2">
                          <span className="fw-bold" style={{ color: '#667eea', fontSize: '18px' }}>
                            ${(item.product?.price * item.quantity).toFixed(2)}
                          </span>
                        </div>
                      </div>
                      
                      <button 
                        onClick={() => removeFromCart(item.id)} 
                        className="btn btn-outline-danger"
                        style={{ 
                          borderRadius: '10px',
                          padding: '8px 16px',
                          fontWeight: '600',
                          transition: 'all 0.2s ease'
                        }}
                        onMouseOver={(e) => {
                          e.target.style.transform = 'scale(1.05)';
                          e.target.style.backgroundColor = '#dc3545';
                          e.target.style.color = 'white';
                        }}
                        onMouseOut={(e) => {
                          e.target.style.transform = 'scale(1)';
                          e.target.style.backgroundColor = 'transparent';
                          e.target.style.color = '#dc3545';
                        }}
                      >
                        <i className="fas fa-trash-alt me-2"></i>
                        Remove
                      </button>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="card border-0 shadow-sm" style={{ borderRadius: '20px' }}>
                <div className="card-body p-4">
                  <div className="d-flex justify-content-between align-items-center mb-4">
                    <h4 className="mb-0 fw-bold" style={{ color: '#2d3748' }}>Order Summary</h4>
                    <span className="badge" style={{ 
                      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                      padding: '8px 16px',
                      borderRadius: '20px',
                      fontSize: '14px'
                    }}>
                      {cartItems.length} Items
                    </span>
                  </div>
                  
                  <div style={{ 
                    background: '#f8fafc', 
                    padding: '20px', 
                    borderRadius: '12px',
                    marginBottom: '20px'
                  }}>
                    <div className="d-flex justify-content-between align-items-center">
                      <span className="text-muted">Subtotal:</span>
                      <span className="fs-5">${calculateTotal().toFixed(2)}</span>
                    </div>
                    <hr style={{ borderColor: '#e2e8f0' }} />
                    <div className="d-flex justify-content-between align-items-center">
                      <span className="fw-bold fs-5" style={{ color: '#2d3748' }}>Total:</span>
                      <span className="fw-bold fs-3" style={{ color: '#667eea' }}>
                        ${calculateTotal().toFixed(2)}
                      </span>
                    </div>
                  </div>
                  
                  <button 
                    className="btn btn-primary w-100"
                    style={{
                      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                      border: 'none',
                      padding: '14px',
                      borderRadius: '12px',
                      fontSize: '16px',
                      fontWeight: '600',
                      transition: 'transform 0.2s ease',
                      boxShadow: '0 4px 15px rgba(102, 126, 234, 0.3)'
                    }}
                    onMouseOver={(e) => e.target.style.transform = 'translateY(-2px)'}
                    onMouseOut={(e) => e.target.style.transform = 'translateY(0)'}
                  >
                    <i className="fas fa-credit-card me-2"></i>
                    Proceed to Checkout
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Cart;