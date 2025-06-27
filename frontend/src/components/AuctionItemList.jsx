import React, { useState, useEffect } from 'react';
import { Card, Row, Col, Button, Badge, Alert } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';

const AuctionItemList = () => {
  const [auctions, setAuctions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useAuth();
  const isAdmin = user && (
    user.email === 'admin@auction.com' ||
    user.role === 'Admin' ||
    (user.roles && user.roles.includes('Admin'))
  );

  useEffect(() => {
    fetchAuctions();
  }, []);

  const fetchAuctions = async () => {
    try {
      setLoading(true);
      const response = await axios.get('http://localhost:5100/api/auctionitems');
      setAuctions(response.data);
    } catch (error) {
      setError('Failed to load auctions');
      console.error('Error fetching auctions:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatTimeLeft = (endTime) => {
    const now = new Date();
    const end = new Date(endTime);
    const diff = end - now;
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

  const getStatusBadge = (endTime) => {
    const now = new Date();
    const end = new Date(endTime);
    const diff = end - now;

    if (diff <= 0) {
      return <Badge style={{ 
        background: '#e2e8f0', 
        color: '#718096',
        padding: '6px 12px',
        borderRadius: '20px',
        fontWeight: '600'
      }}>
        <i className="fas fa-times-circle me-1"></i>Ended
      </Badge>;
    } else if (diff < 1000 * 60 * 60) { // Less than 1 hour
      return <Badge style={{ 
        background: 'linear-gradient(135deg, #f56565 0%, #e53e3e 100%)',
        padding: '6px 12px',
        borderRadius: '20px',
        fontWeight: '600'
      }}>
        <i className="fas fa-clock me-1"></i>Ending Soon
      </Badge>;
    } else {
      return <Badge style={{ 
        background: 'linear-gradient(135deg, #48bb78 0%, #38a169 100%)',
        padding: '6px 12px',
        borderRadius: '20px',
        fontWeight: '600'
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
          <p className="mt-3 text-muted">Loading auctions...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container py-5">
        <Alert 
          variant="danger" 
          className="d-flex align-items-center"
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
            <i className="fas fa-gavel text-white" style={{ fontSize: '32px' }}></i>
          </div>
        </div>
        <h1 className="display-4 fw-bold mb-3" style={{ color: '#2d3748' }}>Live Auctions</h1>
        <p className="text-muted fs-5">Discover amazing items and place your bids</p>
      </div>

      <div className="d-flex justify-content-between align-items-center mb-4">
        <div className="d-flex align-items-center">
          <span className="badge" style={{ 
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            padding: '10px 20px',
            borderRadius: '25px',
            fontSize: '16px'
          }}>
            <i className="fas fa-fire me-2"></i>
            {auctions.length} Active Auctions
          </span>
        </div>
      </div>

      {auctions.length === 0 ? (
        <div className="text-center py-5">
          <div className="card border-0 shadow-sm mx-auto" style={{ maxWidth: '500px', borderRadius: '20px' }}>
            <div className="card-body p-5">
              <i className="fas fa-inbox text-muted mb-4" style={{ fontSize: '4rem' }}></i>
              <h5 className="mb-3">No Auctions Available</h5>
              <p className="text-muted mb-0">
                No auctions are currently active. Please check back later!
              </p>
            </div>
          </div>
        </div>
      ) : (
        <Row className="g-4">
          {auctions.map((auction) => (
            <Col key={auction.id} lg={4} md={6}>
              <Card 
                className="h-100 border-0"
                style={{ 
                  borderRadius: '20px',
                  overflow: 'hidden',
                  transition: 'all 0.3s ease',
                  boxShadow: '0 4px 15px rgba(0,0,0,0.08)'
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.transform = 'translateY(-8px)';
                  e.currentTarget.style.boxShadow = '0 12px 30px rgba(0,0,0,0.15)';
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 4px 15px rgba(0,0,0,0.08)';
                }}
              >
                <div style={{ position: 'relative', height: '220px', overflow: 'hidden' }}>
                  <Card.Img
                    variant="top"
                    src={auction.imageUrl || 'https://via.placeholder.com/300x200?text=Auction+Item'}
                    style={{ 
                      height: '100%', 
                      width: '100%',
                      objectFit: 'cover',
                      transition: 'transform 0.3s ease'
                    }}
                    onMouseOver={(e) => e.target.style.transform = 'scale(1.05)'}
                    onMouseOut={(e) => e.target.style.transform = 'scale(1)'}
                  />
                  <div style={{ position: 'absolute', top: '12px', right: '12px' }}>
                    {getStatusBadge(auction.endTime)}
                  </div>
                </div>
                
                <Card.Body className="p-4 d-flex flex-column">
                  <Card.Title className="fw-bold mb-2" style={{ color: '#2d3748', fontSize: '20px' }}>
                    {auction.title}
                  </Card.Title>
                  
                  <Card.Text className="text-muted mb-3" style={{ fontSize: '14px' }}>
                    {auction.description?.substring(0, 100)}...
                  </Card.Text>
                  
                  <div className="mt-auto">
                    <div className="p-3 mb-3" style={{ background: '#f7fafc', borderRadius: '12px' }}>
                      <div className="d-flex justify-content-between align-items-center mb-2">
                        <span className="text-muted small">Current Bid</span>
                        <span className="fw-bold fs-5" style={{ color: '#667eea' }}>
                          {auction.highestBid !== null && auction.highestBid !== undefined
                            ? '₹' + Number(auction.highestBid).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
                            : (auction.startingPrice !== null && auction.startingPrice !== undefined
                                ? '₹' + Number(auction.startingPrice).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
                                : '₹0.00')}
                        </span>
                      </div>
                      <div className="d-flex justify-content-between align-items-center">
                        <small className="text-muted">
                          <i className="fas fa-users me-1"></i>
                          {auction.bidCount} bids
                        </small>
                        <small className="text-muted">
                          <i className="fas fa-clock me-1"></i>
                          {formatTimeLeft(auction.endTime)}
                        </small>
                      </div>
                    </div>
                    
                    {auction.winningUser && (
                      <div className="text-center mb-3 p-2" style={{ background: '#e6fffa', borderRadius: '8px' }}>
                        <small className="text-success fw-semibold">
                          <i className="fas fa-trophy me-1"></i>
                          Leading: {auction.winningUser}
                        </small>
                      </div>
                    )}
                    
                    {!isAdmin && (
                      <Button
                        as={Link}
                        to={`/auction/${auction.id}`}
                        className="w-100 fw-semibold border-0"
                        style={{
                          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                          padding: '12px',
                          borderRadius: '12px',
                          transition: 'transform 0.2s ease',
                          boxShadow: '0 4px 15px rgba(102, 126, 234, 0.2)'
                        }}
                        onMouseOver={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
                        onMouseOut={(e) => e.currentTarget.style.transform = 'translateY(0)'}
                      >
                        <i className="fas fa-eye me-2"></i>
                        View Auction
                      </Button>
                    )}
                  </div>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      )}
    </div>
  );
};

export default AuctionItemList;