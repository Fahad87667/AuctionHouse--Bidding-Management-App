import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, Row, Col, Button, Badge, Alert, Form, ListGroup } from 'react-bootstrap';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';

const AuctionItemDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [auction, setAuction] = useState(null);
  const [bids, setBids] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [bidAmount, setBidAmount] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [timeLeft, setTimeLeft] = useState('');

  useEffect(() => {
    fetchAuctionDetails();
    const interval = setInterval(updateTimeLeft, 1000);
    return () => clearInterval(interval);
  }, [id]);

  const fetchAuctionDetails = async () => {
    try {
      setLoading(true);
      const auctionResponse = await axios.get(`http://localhost:5100/api/auctionitems/${id}`);
      setAuction(auctionResponse.data);
      setBids(auctionResponse.data.Bids || []);
      updateTimeLeft();
    } catch (error) {
      setError('Failed to load auction details');
      console.error('Error fetching auction:', error);
    } finally {
      setLoading(false);
    }
  };

  // Helper to format time left in a human-friendly way
  const formatTimeLeft = (diff) => {
    if (diff <= 0) return 'Auction ended';
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);
    let parts = [];
    if (days > 0) parts.push(`${days} day${days > 1 ? 's' : ''}`);
    if (hours > 0) parts.push(`${hours} hour${hours > 1 ? 's' : ''}`);
    if (minutes > 0) parts.push(`${minutes} minute${minutes > 1 ? 's' : ''}`);
    if (days === 0 && hours === 0) parts.push(`${seconds} second${seconds !== 1 ? 's' : ''}`);
    return parts.join(', ') + ' left';
  };

  const updateTimeLeft = () => {
    if (!auction) return;
    const now = new Date();
    const end = new Date(auction.endTime);
    const diff = end - now;
    setTimeLeft(formatTimeLeft(diff));
  };

  const handleBid = async (e) => {
    e.preventDefault();
    if (!user) {
      navigate('/login');
      return;
    }

    const amount = parseFloat(bidAmount);
    const highestBid = auction.highestBid ?? auction.startingPrice;
    if (amount <= highestBid) {
      setError('Bid must be higher than current price');
      return;
    }

    try {
      setSubmitting(true);
      setError(null);
      
      await axios.post('http://localhost:5100/api/bids', {
        auctionItemId: parseInt(id),
        amount: amount
      });

      // Refresh auction details
      await fetchAuctionDetails();
      setBidAmount('');
    } catch (error) {
      let errMsg = error.message || 'Failed to place bid';
      if (error.response?.data) {
        if (typeof error.response.data === 'string') {
          errMsg = error.response.data;
        } else if (typeof error.response.data.message === 'string') {
          errMsg = error.response.data.message;
        } else if (typeof error.response.data.title === 'string') {
          errMsg = error.response.data.title;
        } else {
          errMsg = JSON.stringify(error.response.data);
        }
      }
      setError(errMsg);
    } finally {
      setSubmitting(false);
    }
  };

  const getStatusBadge = () => {
    const now = new Date();
    const end = new Date(auction?.endTime);
    const diff = end - now;

    if (diff <= 0) {
      return <Badge style={{ 
        background: '#e2e8f0', 
        color: '#718096',
        padding: '8px 16px',
        borderRadius: '25px',
        fontWeight: '600',
        fontSize: '14px'
      }}>
        <i className="fas fa-times-circle me-1"></i>Ended
      </Badge>;
    } else if (diff < 1000 * 60 * 60) {
      return <Badge style={{ 
        background: 'linear-gradient(135deg, #f56565 0%, #e53e3e 100%)',
        padding: '8px 16px',
        borderRadius: '25px',
        fontWeight: '600',
        fontSize: '14px'
      }}>
        <i className="fas fa-clock me-1"></i>Ending Soon
      </Badge>;
    } else {
      return <Badge style={{ 
        background: 'linear-gradient(135deg, #48bb78 0%, #38a169 100%)',
        padding: '8px 16px',
        borderRadius: '25px',
        fontWeight: '600',
        fontSize: '14px'
      }}>
        <i className="fas fa-check-circle me-1"></i>Active
      </Badge>;
    }
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
        <div style={{ textAlign: 'center' }}>
          <div className="spinner-border text-primary" role="status" style={{ width: '3rem', height: '3rem' }}>
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-3 text-muted">Loading auction details...</p>
        </div>
      </div>
    );
  }

  if (error && !auction) {
    return (
      <div className="container py-5">
        <Alert variant="danger" style={{ borderRadius: '12px', border: 'none' }}>
          <i className="fas fa-exclamation-circle me-2"></i>{error}
        </Alert>
      </div>
    );
  }

  if (!auction) {
    return (
      <div className="container py-5">
        <Alert variant="warning" style={{ borderRadius: '12px', border: 'none' }}>
          <i className="fas fa-search me-2"></i>Auction not found
        </Alert>
      </div>
    );
  }

  const isAuctionEnded = new Date(auction.endTime) <= new Date();
  const canBid = user && !isAuctionEnded;
  const currentPrice = auction.highestBid !== null && auction.highestBid !== undefined
    ? Number(auction.highestBid)
    : (auction.startingPrice !== null && auction.startingPrice !== undefined
        ? Number(auction.startingPrice)
        : 0);

  const isAdmin = user && (
    user.email === 'admin@auction.com' ||
    user.role === 'Admin' ||
    (user.roles && user.roles.includes('Admin'))
  );

  return (
    <div className="container py-5">
      <Button 
        onClick={() => navigate(-1)}
        className="mb-4"
        style={{
          background: 'white',
          border: '2px solid #e2e8f0',
          borderRadius: '10px',
          padding: '10px 20px',
          fontWeight: '600',
          color: '#4a5568',
          transition: 'all 0.3s ease'
        }}
        onMouseOver={(e) => {
          e.currentTarget.style.background = '#f7fafc';
          e.currentTarget.style.transform = 'translateX(-5px)';
        }}
        onMouseOut={(e) => {
          e.currentTarget.style.background = 'white';
          e.currentTarget.style.transform = 'translateX(0)';
        }}
      >
        <i className="fas fa-arrow-left me-2"></i>
        Back to Auctions
      </Button>

      <Row className="g-4">
        <Col lg={8}>
          <Card className="border-0 shadow-sm" style={{ borderRadius: '20px', overflow: 'hidden' }}>
            <div style={{ position: 'relative', height: '450px', overflow: 'hidden' }}>
              <img
                src={auction.imageUrl || 'https://via.placeholder.com/600x400?text=Auction+Item'}
                alt={auction.title}
                style={{ 
                  width: '100%', 
                  height: '100%', 
                  objectFit: 'cover',
                  transition: 'transform 0.3s ease'
                }}
                onMouseOver={(e) => e.target.style.transform = 'scale(1.05)'}
                onMouseOut={(e) => e.target.style.transform = 'scale(1)'}
              />
              <div style={{ position: 'absolute', top: '20px', right: '20px' }}>
                {getStatusBadge()}
              </div>
            </div>
            
            <Card.Body className="p-4">
              <h2 className="mb-3 fw-bold" style={{ color: '#2d3748' }}>{auction.title}</h2>
              <p className="text-muted mb-4" style={{ fontSize: '16px', lineHeight: '1.6' }}>
                {auction.description}
              </p>
              
              <Row className="g-3 mb-4">
                <Col md={6}>
                  <div className="text-center p-4" style={{ 
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    borderRadius: '16px',
                    color: 'white'
                  }}>
                    <i className="fas fa-dollar-sign fs-3 mb-2 d-block"></i>
                    <div className="display-6 fw-bold">
                      ${currentPrice.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </div>
                    <small>Current Price</small>
                  </div>
                </Col>
                <Col md={6}>
                  <div className="text-center p-4" style={{ 
                    background: '#f7fafc',
                    borderRadius: '16px'
                  }}>
                    <i className="fas fa-clock fs-3 mb-2 d-block text-warning"></i>
                    <div className="h3 fw-bold mb-1" style={{ color: '#2d3748' }}>
                      {timeLeft}
                    </div>
                    <small className="text-muted">
                      <i className="fas fa-users me-1"></i>
                      {auction.bidCount} bids
                    </small>
                  </div>
                </Col>
              </Row>

              {canBid && !isAdmin && (
                <Card style={{ 
                  borderRadius: '16px', 
                  border: 'none',
                  background: 'linear-gradient(135deg, #f8fafc 0%, #f0f4f8 100%)'
                }} className="p-4">
                  <Form onSubmit={handleBid}>
                    <h5 className="mb-3 fw-bold" style={{ color: '#2d3748' }}>
                      <i className="fas fa-gavel me-2" style={{ color: '#667eea' }}></i>
                      Place Your Bid
                    </h5>
                    <Row className="g-3">
                      <Col md={8}>
                        <Form.Group>
                          <Form.Label className="fw-semibold text-secondary mb-2">
                            Your Bid Amount ($)
                          </Form.Label>
                          <div className="input-group">
                            <span className="input-group-text" style={{ 
                              background: '#f7fafc', 
                              border: '1.5px solid #e2e8f0',
                              borderRight: 'none',
                              borderRadius: '12px 0 0 12px'
                            }}>
                              <i className="fas fa-dollar-sign"></i>
                            </span>
                            <Form.Control
                              type="number"
                              min={currentPrice + 1}
                              step="0.01"
                              value={bidAmount}
                              onChange={(e) => setBidAmount(e.target.value)}
                              placeholder={`Minimum: $${(currentPrice + 1).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
                              required
                              style={{ 
                                border: '1.5px solid #e2e8f0',
                                borderLeft: 'none',
                                borderRadius: '0 12px 12px 0',
                                fontSize: '16px',
                                padding: '12px'
                              }}
                            />
                          </div>
                        </Form.Group>
                      </Col>
                      <Col md={4} className="d-flex align-items-end">
                        <Button
                          type="submit"
                          disabled={submitting || !bidAmount}
                          className="w-100 fw-semibold border-0"
                          style={{
                            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                            padding: '14px',
                            borderRadius: '12px',
                            transition: 'transform 0.2s ease',
                            boxShadow: '0 4px 15px rgba(102, 126, 234, 0.3)'
                          }}
                          onMouseOver={(e) => !submitting && (e.target.style.transform = 'translateY(-2px)')}
                          onMouseOut={(e) => e.target.style.transform = 'translateY(0)'}
                        >
                          {submitting ? (
                            <>
                              <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                              Placing Bid...
                            </>
                          ) : (
                            <>
                              <i className="fas fa-gavel me-2"></i>
                              Place Bid
                            </>
                          )}
                        </Button>
                      </Col>
                    </Row>
                  </Form>
                </Card>
              )}
              
              {isAdmin && (
                <Alert 
                  variant="info" 
                  className="mt-3 d-flex align-items-center"
                  style={{ 
                    borderRadius: '12px', 
                    border: 'none',
                    backgroundColor: '#e6f0ff',
                    color: '#2b6cb0'
                  }}                >
                  <i className="fas fa-info-circle me-2"></i>
                  Admins cannot place bids.
                </Alert>
              )}

              {!user && !isAuctionEnded && (
                <Alert 
                  variant="info" 
                  className="mt-3"
                  style={{ 
                    borderRadius: '12px', 
                    border: 'none',
                    backgroundColor: '#e6f0ff',
                    color: '#2b6cb0'
                  }}
                >
                  <i className="fas fa-user-circle me-2"></i>
                  Please{' '}
                  <Button 
                    variant="link" 
                    onClick={() => navigate('/login')}
                    style={{ 
                      padding: '0 4px',
                      color: '#667eea',
                      fontWeight: '600'
                    }}
                  >
                    login
                  </Button>{' '}
                  to place a bid.
                </Alert>
              )}

              {error && (
                <Alert 
                  variant="danger" 
                  className="mt-3"
                  dismissible
                  onClose={() => setError(null)}
                  style={{ 
                    borderRadius: '12px', 
                    border: 'none',
                    backgroundColor: '#fee',
                    color: '#c53030'
                  }}
                >
                  <i className="fas fa-exclamation-circle me-2"></i>
                  {error}
                </Alert>
              )}
            </Card.Body>
          </Card>
        </Col>

        <Col lg={4}>
          <Card className="border-0 shadow-sm" style={{ borderRadius: '20px' }}>
            <Card.Header 
              className="bg-white border-0 p-4" 
              style={{ 
                borderBottom: '1px solid #f0f4f8',
                borderRadius: '20px 20px 0 0'
              }}
            >
              <h5 className="mb-0 fw-bold" style={{ color: '#2d3748' }}>
                <i className="fas fa-history me-2" style={{ color: '#667eea' }}></i>
                Bid History
              </h5>
            </Card.Header>
            <Card.Body className="p-0">
              {bids.length === 0 ? (
                <div className="text-center py-5">
                  <i className="fas fa-gavel text-muted mb-3" style={{ fontSize: '3rem' }}></i>
                  <p className="text-muted">No bids placed yet</p>
                  <small className="text-muted">Be the first to bid!</small>
                </div>
              ) : (
                <ListGroup variant="flush">
                  {bids.slice(0, 10).map((bid, index) => (
                    <ListGroup.Item 
                      key={bid.id} 
                      className="border-0 px-4 py-3"
                      style={{ 
                        borderBottom: index < bids.length - 1 ? '1px solid #f0f4f8' : 'none',
                        background: index === 0 ? '#f0f9ff' : 'transparent'
                      }}
                    >
                      <div className="d-flex align-items-center">
                        <div style={{
                          width: '40px',
                          height: '40px',
                          borderRadius: '50%',
                          background: index === 0 
                            ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' 
                            : '#e2e8f0',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          marginRight: '12px'
                        }}>
                          <i className={`fas fa-user text-white`}></i>
                        </div>
                        <div className="flex-grow-1">
                          <div className="d-flex justify-content-between align-items-start">
                            <div>
                              <span className="fw-semibold" style={{ color: '#2d3748' }}>
                                {bid.userName || `User #${bid.userId}`}
                              </span>
                              {index === 0 && (
                                <Badge 
                                  className="ms-2"
                                  style={{ 
                                    background: 'linear-gradient(135deg, #48bb78 0%, #38a169 100%)',
                                    fontSize: '11px',
                                    padding: '4px 8px',
                                    borderRadius: '12px'
                                  }}
                                >
                                  Leading
                                </Badge>
                              )}
                              <small className="d-block text-muted mt-1">
                                {new Date(bid.timestamp).toLocaleString()}
                              </small>
                            </div>
                            <span className="fw-bold" style={{ 
                              color: index === 0 ? '#667eea' : '#4a5568',
                              fontSize: '18px'
                            }}>
                              ${bid.amount.toLocaleString(undefined, { 
                                minimumFractionDigits: 2, 
                                maximumFractionDigits: 2 
                              })}
                            </span>
                          </div>
                        </div>
                      </div>
                    </ListGroup.Item>
                  ))}
                </ListGroup>
              )}
              {bids.length > 10 && (
                <div className="text-center p-3" style={{ borderTop: '1px solid #f0f4f8' }}>
                  <small className="text-muted">
                    Showing latest 10 of {bids.length} bids
                  </small>
                </div>
              )}
            </Card.Body>
          </Card>

          {auction.winningUser && (
            <Card className="border-0 shadow-sm mt-3" style={{ borderRadius: '20px' }}>
              <Card.Body className="text-center p-4">
                <div style={{
                  width: '60px',
                  height: '60px',
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, #f6d365 0%, #fda085 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 16px'
                }}>
                  <i className="fas fa-trophy text-white fs-4"></i>
                </div>
                <h6 className="fw-bold mb-1" style={{ color: '#2d3748' }}>Current Leader</h6>
                <p className="mb-0 text-muted">{auction.winningUser}</p>
              </Card.Body>
            </Card>
          )}
        </Col>
      </Row>
    </div>
  );
};

export default AuctionItemDetail;