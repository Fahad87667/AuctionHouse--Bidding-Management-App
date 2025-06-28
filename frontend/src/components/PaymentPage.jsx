import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Button, Spinner, Card, Badge, Modal } from 'react-bootstrap';
import { useAuth } from '../contexts/AuthContext';

const PaymentPage = () => {
  const { auctionId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [auction, setAuction] = useState(null);
  const [loading, setLoading] = useState(true);
  const [payLoading, setPayLoading] = useState(false);
  const [payError, setPayError] = useState('');
  const [paySuccess, setPaySuccess] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [clientSecret, setClientSecret] = useState(null);
  const [intentLoading, setIntentLoading] = useState(false);

  useEffect(() => {
    const fetchAuction = async () => {
      setLoading(true);
      try {
        const res = await axios.get(`http://localhost:5100/api/auctionitems/${auctionId}`);
        setAuction(res.data);
      } catch (err) {
        setAuction(null);
      } finally {
        setLoading(false);
      }
    };
    fetchAuction();
  }, [auctionId]);

  const handlePay = async () => {
    setPayError('');
    setIntentLoading(true);
    try {
      // Get payment intent (mock)
      const res = await axios.post('http://localhost:5100/api/payments/stripe-intent', { AuctionId: auctionId }, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setClientSecret(res.data.clientSecret);
      setShowModal(true);
    } catch (err) {
      setPayError(err.response?.data || 'Payment failed');
    } finally {
      setIntentLoading(false);
    }
  };

  const handleConfirm = async () => {
    setPayLoading(true);
    setPayError('');
    try {
      await axios.post('http://localhost:5100/api/payments/confirm', {
        AuctionId: auctionId,
        TransactionId: 'mock_txn_' + Date.now(),
        RawResponse: '{}'
      }, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setPaySuccess(true);
      setShowModal(false);
      setTimeout(() => navigate('/dashboard'), 2000);
    } catch (err) {
      let errMsg = 'Payment failed';
      if (err.response?.data) {
        if (typeof err.response.data === 'string') {
          errMsg = err.response.data;
        } else if (typeof err.response.data.title === 'string') {
          errMsg = err.response.data.title;
        } else if (typeof err.response.data.message === 'string') {
          errMsg = err.response.data.message;
        } else {
          errMsg = JSON.stringify(err.response.data);
        }
      }
      setPayError(errMsg);
    } finally {
      setPayLoading(false);
    }
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
        <div style={{ textAlign: 'center' }}>
          <div className="spinner-border text-primary" role="status" style={{ width: '3rem', height: '3rem' }}>
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-3 text-muted">Loading payment details...</p>
        </div>
      </div>
    );
  }

  if (!auction) {
    return (
      <div className="container py-5">
        <div className="text-center">
          <div style={{ 
            width: '100px', 
            height: '100px', 
            background: '#fee',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 20px'
          }}>
            <i className="fas fa-exclamation-triangle" style={{ fontSize: '48px', color: '#f56565' }}></i>
          </div>
          <h3 style={{ color: '#2d3748' }}>Auction Not Found</h3>
          <p className="text-muted mb-4">The auction you're looking for doesn't exist or has been removed.</p>
          <Button 
            variant="primary" 
            onClick={() => navigate('/auctions')}
            style={{ 
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              border: 'none',
              padding: '10px 30px',
              borderRadius: '25px'
            }}
          >
            Back to Auctions
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-lg-6">
          {/* Success Message */}
          {paySuccess && (
            <div className="alert alert-success d-flex align-items-center mb-4" style={{ 
              borderRadius: '12px', 
              border: 'none',
              backgroundColor: '#d4edda',
              color: '#155724'
            }}>
              <i className="fas fa-check-circle me-3" style={{ fontSize: '24px' }}></i>
              <div>
                <strong>Payment Successful!</strong><br />
                Redirecting to your dashboard...
              </div>
            </div>
          )}

          {/* Payment Card */}
          <Card style={{ 
            borderRadius: '20px', 
            border: 'none', 
            boxShadow: '0 10px 40px rgba(0,0,0,0.1)',
            overflow: 'hidden'
          }}>
            {/* Header with gradient */}
            <div style={{ 
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              padding: '30px',
              color: 'white'
            }}>
              <div className="d-flex align-items-center mb-3">
                <div style={{ 
                  width: '50px', 
                  height: '50px', 
                  background: 'rgba(255,255,255,0.2)',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginRight: '15px'
                }}>
                  <i className="fas fa-shopping-cart" style={{ fontSize: '24px' }}></i>
                </div>
                <div>
                  <h3 className="mb-0 fw-bold">Payment Checkout</h3>
                  <small style={{ opacity: 0.9 }}>Complete your winning bid payment</small>
                </div>
              </div>
            </div>

            <Card.Body style={{ padding: '30px' }}>
              {/* Product Image */}
              {auction.imageUrl && (
                <div className="text-center mb-4">
                  <img 
                    src={auction.imageUrl.startsWith('http') ? auction.imageUrl : `http://localhost:5100${auction.imageUrl}`}
                    alt={auction.title}
                    style={{ 
                      maxWidth: '200px', 
                      maxHeight: '150px', 
                      objectFit: 'cover',
                      borderRadius: '12px',
                      boxShadow: '0 4px 15px rgba(0,0,0,0.1)'
                    }}
                    onError={(e) => { e.target.style.display = 'none' }}
                  />
                </div>
              )}

              {/* Order Details */}
              <div style={{ background: '#f8f9fa', borderRadius: '12px', padding: '20px', marginBottom: '20px' }}>
                <h5 className="fw-bold mb-3" style={{ color: '#2d3748' }}>
                  <i className="fas fa-file-invoice me-2"></i>Order Details
                </h5>
                
                <div className="mb-3">
                  <div className="d-flex justify-content-between align-items-start">
                    <span className="text-muted">Product:</span>
                    <span className="fw-semibold text-end" style={{ maxWidth: '60%' }}>{auction.title}</span>
                  </div>
                </div>
                
                <div className="mb-3">
                  <div className="d-flex justify-content-between align-items-start">
                    <span className="text-muted">Description:</span>
                    <span className="text-end" style={{ maxWidth: '60%' }}>{auction.description}</span>
                  </div>
                </div>
                
                <div className="mb-3">
                  <div className="d-flex justify-content-between align-items-center">
                    <span className="text-muted">Auction Ended:</span>
                    <span>{new Date(auction.endTime).toLocaleString('en-IN', { 
                      day: '2-digit', 
                      month: '2-digit', 
                      year: 'numeric', 
                      hour: '2-digit', 
                      minute: '2-digit', 
                      hour12: true 
                    })}</span>
                  </div>
                </div>
                
                <hr style={{ borderColor: '#e0e0e0' }} />
                
                <div className="d-flex justify-content-between align-items-center">
                  <span className="fs-5 fw-bold">Total Amount:</span>
                  <span className="fs-4 fw-bold" style={{ color: '#667eea' }}>
                    ₹{Number(auction.highestBid).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                  </span>
                </div>
              </div>

              {/* Payment Status */}
              <div className="mb-4 text-center">
                <span className="me-2">Payment Status:</span>
                {auction.isPaid ? (
                  <Badge 
                    bg="success" 
                    style={{ 
                      padding: '8px 16px',
                      fontSize: '14px',
                      borderRadius: '20px'
                    }}
                  >
                    <i className="fas fa-check-circle me-1"></i>Paid
                  </Badge>
                ) : (
                  <Badge 
                    bg="warning" 
                    text="dark"
                    style={{ 
                      padding: '8px 16px',
                      fontSize: '14px',
                      borderRadius: '20px'
                    }}
                  >
                    <i className="fas fa-clock me-1"></i>Pending Payment
                  </Badge>
                )}
              </div>

              {/* Error Message */}
              {payError && (
                <div className="alert alert-danger d-flex align-items-center mb-3" style={{ 
                  borderRadius: '12px', 
                  border: 'none'
                }}>
                  <i className="fas fa-exclamation-circle me-2"></i>
                  {payError}
                </div>
              )}

              {/* Payment Button */}
              {!paySuccess && (
                <Button 
                  className="w-100 fw-semibold" 
                  size="lg" 
                  disabled={payLoading || auction.isPaid || intentLoading}
                  onClick={handlePay}
                  style={{ 
                    background: auction.isPaid ? '#6c757d' : 'linear-gradient(135deg, #48bb78 0%, #38a169 100%)',
                    border: 'none',
                    padding: '15px',
                    borderRadius: '12px',
                    fontSize: '18px',
                    transition: 'all 0.3s ease'
                  }}
                  onMouseOver={(e) => {
                    if (!auction.isPaid && !payLoading && !intentLoading) {
                      e.target.style.transform = 'translateY(-2px)';
                      e.target.style.boxShadow = '0 8px 20px rgba(72,187,120,0.3)';
                    }
                  }}
                  onMouseOut={(e) => {
                    e.target.style.transform = 'translateY(0)';
                    e.target.style.boxShadow = 'none';
                  }}
                >
                  {payLoading || intentLoading ? (
                    <>
                      <Spinner size="sm" animation="border" className="me-2" />
                      Processing...
                    </>
                  ) : auction.isPaid ? (
                    <>
                      <i className="fas fa-check me-2"></i>
                      Already Paid
                    </>
                  ) : (
                    <>
                      <i className="fas fa-credit-card me-2"></i>
                      Proceed to Payment
                    </>
                  )}
                </Button>
              )}

              {/* Security Note */}
              <div className="text-center mt-3">
                <small className="text-muted">
                  <i className="fas fa-lock me-1"></i>
                  Secure payment powered by Stripe
                </small>
              </div>
            </Card.Body>
          </Card>
        </div>
      </div>

      {/* Mock Payment Modal */}
      <Modal show={showModal} onHide={() => setShowModal(false)} centered size="lg">
        <Modal.Header style={{ 
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white',
          borderBottom: 'none',
          borderRadius: '0.5rem 0.5rem 0 0'
        }}>
          <Modal.Title className="fw-bold">
            <i className="fas fa-credit-card me-2"></i>Complete Payment
          </Modal.Title>
          <button type="button" className="btn-close btn-close-white" onClick={() => setShowModal(false)}></button>
        </Modal.Header>
        <Modal.Body style={{ padding: '30px' }}>
          <div className="text-center mb-4">
            <div style={{ 
              width: '80px', 
              height: '80px', 
              background: '#e6fffa',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto'
            }}>
              <i className="fas fa-shopping-bag" style={{ fontSize: '36px', color: '#38b2ac' }}></i>
            </div>
          </div>
          
          <h5 className="text-center mb-4">Confirm your payment for</h5>
          
          <div style={{ background: '#f8f9fa', borderRadius: '12px', padding: '20px', marginBottom: '20px' }}>
            <h4 className="fw-bold mb-3">{auction.title}</h4>
            <div className="d-flex justify-content-between align-items-center">
              <span className="text-muted">Amount to pay:</span>
              <span className="fs-3 fw-bold" style={{ color: '#667eea' }}>
                ₹{Number(auction.highestBid).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
              </span>
            </div>
          </div>

          <Button 
            variant="success" 
            className="w-100 fw-semibold" 
            size="lg"
            onClick={handleConfirm} 
            disabled={payLoading}
            style={{ 
              background: 'linear-gradient(135deg, #48bb78 0%, #38a169 100%)',
              border: 'none',
              padding: '15px',
              borderRadius: '12px',
              fontSize: '18px'
            }}
          >
            {payLoading ? (
              <>
                <Spinner size="sm" animation="border" className="me-2" />
                Processing Payment...
              </>
            ) : (
              <>
                <i className="fas fa-lock me-2"></i>
                Pay Now
              </>
            )}
          </Button>

          <div className="text-center mt-4">
            <small className="text-muted">
              <i className="fas fa-shield-alt me-1"></i>
              This is a mock payment for demonstration purposes
            </small>
          </div>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default PaymentPage;