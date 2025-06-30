import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, Button, Row, Col, Badge } from 'react-bootstrap';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';

const OrderReceipt = () => {
  const { auctionId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [auction, setAuction] = useState(null);
  const [payment, setPayment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [deliveryDate] = useState(() => {
    const date = new Date();
    date.setDate(date.getDate() + 7); // Delivery in 7 days
    return date;
  });

  useEffect(() => {
    fetchOrderDetails();
  }, [auctionId]);

  const fetchOrderDetails = async () => {
    try {
      // Fetch auction details
      const auctionRes = await axios.get(`http://localhost:5100/api/auctionitems/${auctionId}`);
      setAuction(auctionRes.data);
      
      // Fetch payment details
      const paymentRes = await axios.get('http://localhost:5100/api/payments/my-payments', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      const auctionPayment = paymentRes.data.find(p => p.auctionId === parseInt(auctionId));
      setPayment(auctionPayment);
    } catch (error) {
      console.error('Error fetching order details:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDateTime = (dateStr) => {
    if (!dateStr) return 'N/A';
    const date = new Date(dateStr);
    return date.toLocaleString('en-IN', {
      day: '2-digit', 
      month: 'long', 
      year: 'numeric',
      hour: '2-digit', 
      minute: '2-digit', 
      hour12: true
    });
  };

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadPDF = () => {
    // Simple implementation - just opens print dialog for now
    // In production, you'd use a library like jsPDF
    window.print();
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
        <div style={{ textAlign: 'center' }}>
          <div className="spinner-border text-primary" role="status" style={{ width: '3rem', height: '3rem' }}>
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-3 text-muted">Loading order details...</p>
        </div>
      </div>
    );
  }

  if (!auction || !payment) {
    return (
      <div className="container py-5">
        <div className="text-center">
          <i className="fas fa-exclamation-triangle text-warning mb-3" style={{ fontSize: '3rem' }}></i>
          <h3>Order Not Found</h3>
          <p className="text-muted">Unable to find order details.</p>
          <Button onClick={() => navigate('/dashboard')} variant="primary">Go to Dashboard</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-5">
      {/* Success Banner */}
      <div className="text-center mb-5">
        <div style={{ 
          width: '100px', 
          height: '100px', 
          background: 'linear-gradient(135deg, #48bb78 0%, #38a169 100%)',
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 auto 20px',
          boxShadow: '0 10px 30px rgba(72, 187, 120, 0.3)'
        }}>
          <i className="fas fa-check text-white" style={{ fontSize: '48px' }}></i>
        </div>
        <h1 className="display-5 fw-bold mb-3" style={{ color: '#2d3748' }}>Order Confirmed!</h1>
        <p className="text-muted fs-5">Thank you for your purchase. Your order has been successfully placed.</p>
      </div>

      <Row className="justify-content-center">
        <Col lg={8}>
          {/* Receipt Card */}
          <Card style={{ 
            borderRadius: '20px', 
            border: 'none', 
            boxShadow: '0 10px 40px rgba(0,0,0,0.1)',
            overflow: 'hidden'
          }} className="receipt-card">
            {/* Header */}
            <div style={{ 
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              padding: '30px',
              color: 'white'
            }}>
              <Row className="align-items-center">
                <Col>
                  <h3 className="mb-0 fw-bold">
                    <i className="fas fa-receipt me-2"></i>Order Receipt
                  </h3>
                  <small style={{ opacity: 0.9 }}>Order #{payment.transactionId || `AUC-${auctionId}`}</small>
                </Col>
                <Col xs="auto">
                  <Badge 
                    bg="light" 
                    text="dark"
                    style={{ 
                      padding: '10px 20px',
                      fontSize: '14px',
                      borderRadius: '25px'
                    }}
                  >
                    <i className="fas fa-check-circle text-success me-2"></i>
                    Paid
                  </Badge>
                </Col>
              </Row>
            </div>

            <Card.Body style={{ padding: '40px' }}>
              {/* Order Details Section */}
              <div className="mb-5">
                <h5 className="fw-bold mb-4" style={{ color: '#2d3748' }}>
                  <i className="fas fa-shopping-bag me-2 text-primary"></i>
                  Order Details
                </h5>
                
                <Row className="mb-4">
                  <Col md={3}>
                    <div style={{ 
                      width: '100%', 
                      aspectRatio: '1', 
                      borderRadius: '12px',
                      overflow: 'hidden',
                      backgroundColor: '#f8f9fa'
                    }}>
                      <img 
                        src={auction.imageUrl ? (auction.imageUrl.startsWith('http') ? auction.imageUrl : `http://localhost:5100${auction.imageUrl}`) : '/images/no-image.png'}
                        alt={auction.title}
                        style={{ 
                          width: '100%', 
                          height: '100%', 
                          objectFit: 'cover' 
                        }}
                        onError={(e) => {
                          if (e.target.src !== 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjQwIiBoZWlnaHQ9IjQwIiBmaWxsPSIjRjdGQUZDIi8+CjxwYXRoIGQ9Ik0yMCAxMkMxNS41ODIgMTIgMTIgMTUuNTgyIDEyIDIwQzEyIDI0LjQxOCAxNS41ODIgMjggMjAgMjhDMjQuNDE4IDI4IDI4IDI0LjQxOCAyOCAyMEMyOCAxNS41ODIgMjQuNDE4IDEyIDIwIDEyWk0yMCAyNkMxNy43OTEgMjYgMTYgMjQuMjA5IDE2IDIyQzE2IDE5Ljc5MSAxNy43OTEgMTggMjAgMThDMjIuMjA5IDE4IDI0IDE5Ljc5MSAyNCAyMkMyNCAyNC4yMDkgMjIuMjA5IDI2IDIwIDI2WiIgZmlsbD0iI0EwQUVBMiIvPgo8L3N2Zz4K') {
                          e.target.onerror = null;
                          e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjQwIiBoZWlnaHQ9IjQwIiBmaWxsPSIjRjdGQUZDIi8+CjxwYXRoIGQ9Ik0yMCAxMkMxNS41ODIgMTIgMTIgMTUuNTgyIDEyIDIwQzEyIDI0LjQxOCAxNS41ODIgMjggMjAgMjhDMjQuNDE4IDI4IDI4IDI0LjQxOCAyOCAyMEMyOCAxNS41ODIgMjQuNDE4IDEyIDIwIDEyWk0yMCAyNkMxNy43OTEgMjYgMTYgMjQuMjA5IDE2IDIyQzE2IDE5Ljc5MSAxNy43OTEgMTggMjAgMThDMjIuMjA5IDE4IDI0IDE5Ljc5MSAyNCAyMkMyNCAyNC4yMDkgMjIuMjA5IDI2IDIwIDI2WiIgZmlsbD0iI0EwQUVBMiIvPgo8L3N2Zz4K';
                        }
                        }}
                      />
                    </div>
                  </Col>
                  <Col md={9}>
                    <h4 className="fw-bold mb-2">{auction.title}</h4>
                    <p className="text-muted mb-3">{auction.description}</p>
                    <div className="d-flex gap-4 flex-wrap">
                      <div>
                        <small className="text-muted d-block">Winning Bid</small>
                        <h5 className="mb-0" style={{ color: '#667eea' }}>
                          ₹{Number(auction.highestBid || payment.amount).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                        </h5>
                      </div>
                      <div>
                        <small className="text-muted d-block">Auction Ended</small>
                        <p className="mb-0 fw-semibold">{formatDateTime(auction.endTime)}</p>
                      </div>
                    </div>
                  </Col>
                </Row>
              </div>

              <hr className="my-4" />

              {/* Delivery Information */}
              <div className="mb-5">
                <h5 className="fw-bold mb-4" style={{ color: '#2d3748' }}>
                  <i className="fas fa-truck me-2 text-primary"></i>
                  Delivery Information
                </h5>
                <Row>
                  <Col md={6}>
                    <div style={{ 
                      background: '#f8f9fa', 
                      borderRadius: '12px', 
                      padding: '20px',
                      height: '100%'
                    }}>
                      <h6 className="fw-bold mb-3">Shipping Address</h6>
                      <p className="mb-1">{user.name || user.email}</p>
                      <p className="text-muted mb-0">
                        {user.address || '123 Main Street, City, State 12345'}<br />
                        Email: {user.email}<br />
                        Phone: {user.phone || '+91 98765 43210'}
                      </p>
                    </div>
                  </Col>
                  <Col md={6}>
                    <div style={{ 
                      background: '#e6fffa', 
                      borderRadius: '12px', 
                      padding: '20px',
                      height: '100%',
                      border: '1px solid #38b2ac'
                    }}>
                      <h6 className="fw-bold mb-3">Estimated Delivery</h6>
                      <p className="mb-2">
                        <i className="fas fa-calendar-check me-2 text-success"></i>
                        {deliveryDate.toLocaleDateString('en-IN', { 
                          weekday: 'long',
                          day: 'numeric',
                          month: 'long',
                          year: 'numeric'
                        })}
                      </p>
                      <small className="text-muted">
                        Standard shipping (5-7 business days)
                      </small>
                    </div>
                  </Col>
                </Row>
              </div>

              <hr className="my-4" />

              {/* Payment Summary */}
              <div className="mb-5">
                <h5 className="fw-bold mb-4" style={{ color: '#2d3748' }}>
                  <i className="fas fa-credit-card me-2 text-primary"></i>
                  Payment Summary
                </h5>
                <div style={{ background: '#f8f9fa', borderRadius: '12px', padding: '25px' }}>
                  <Row className="mb-3">
                    <Col>Item Total</Col>
                    <Col xs="auto">₹{Number(payment.amount).toLocaleString('en-IN', { minimumFractionDigits: 2 })}</Col>
                  </Row>
                  <Row className="mb-3">
                    <Col>Shipping</Col>
                    <Col xs="auto" className="text-success">FREE</Col>
                  </Row>
                  <Row className="mb-3">
                    <Col>Tax (GST 18%)</Col>
                    <Col xs="auto">₹{(Number(payment.amount) * 0.18).toLocaleString('en-IN', { minimumFractionDigits: 2 })}</Col>
                  </Row>
                  <hr />
                  <Row>
                    <Col><h5 className="fw-bold mb-0">Total Paid</h5></Col>
                    <Col xs="auto">
                      <h5 className="fw-bold mb-0" style={{ color: '#667eea' }}>
                        ₹{(Number(payment.amount) * 1.18).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                      </h5>
                    </Col>
                  </Row>
                </div>
                <div className="mt-3">
                  <small className="text-muted">
                    <i className="fas fa-lock me-1"></i>
                    Payment processed on {formatDateTime(payment.timestamp || new Date())}
                  </small>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="d-flex gap-3 justify-content-center flex-wrap">
                <Button 
                  variant="outline-primary"
                  onClick={handlePrint}
                  style={{ 
                    borderRadius: '25px',
                    padding: '10px 30px'
                  }}
                >
                  <i className="fas fa-print me-2"></i>
                  Print Receipt
                </Button>
                <Button 
                  variant="outline-secondary"
                  onClick={handleDownloadPDF}
                  style={{ 
                    borderRadius: '25px',
                    padding: '10px 30px'
                  }}
                >
                  <i className="fas fa-download me-2"></i>
                  Download PDF
                </Button>
                <Button 
                  onClick={() => navigate('/dashboard')}
                  style={{ 
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    border: 'none',
                    borderRadius: '25px',
                    padding: '10px 30px'
                  }}
                >
                  <i className="fas fa-th-large me-2"></i>
                  Go to Dashboard
                </Button>
              </div>
            </Card.Body>
          </Card>

          {/* Additional Info */}
          <div className="text-center mt-4">
            <p className="text-muted">
              <i className="fas fa-envelope me-2"></i>
              A confirmation email has been sent to {user.email}
            </p>
          </div>
        </Col>
      </Row>

      {/* Print Styles */}
      <style jsx>{`
        @media print {
          .receipt-card {
            box-shadow: none !important;
            border: 1px solid #dee2e6 !important;
          }
          button {
            display: none !important;
          }
        }
      `}</style>
    </div>
  );
};

export default OrderReceipt;