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
  const userId = window.localStorage.getItem('userId');

  useEffect(() => {
    fetchAuctions();
    // Set up polling to refresh auction data every 5 seconds for real-time updates
    const interval = setInterval(fetchAuctions, 5000);
    return () => clearInterval(interval);
  }, []);

  const fetchAuctions = async () => {
    try {
      setLoading(false); // After first load, don't show loading spinner
      const response = await axios.get('http://localhost:5100/api/auctionitems');
      setAuctions(response.data);
    } catch (error) {
      setError('Failed to load auctions');
      console.error('Error fetching auctions:', error);
    } finally {
      if (loading) setLoading(false); // Only set loading false on first load
    }
  };

  // Filter auctions for users: hide ended or completed auctions
  const filteredAuctions = auctions.filter(auction => {
    const isEnded = new Date(auction.endTime) <= new Date();
    return !auction.isCompleted && !auction.isPaid && !isEnded;
  });

  const formatDateTime = (dateStr) => {
    if (!dateStr) return 'N/A';
    const date = new Date(dateStr);
    return date.toLocaleString('en-IN', {
      day: '2-digit', month: 'short', year: 'numeric',
      hour: '2-digit', minute: '2-digit', hour12: true
    });
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

  const getStatusBadge = (auction) => {
    const now = new Date();
    const end = new Date(auction.endTime);
    const diff = end - now;
    const isWinner = auction.isCompleted && auction.winnerUserId && userId && auction.winnerUserId === userId;
    if (auction.isCompleted || auction.isPaid || diff <= 0) {
      return <Badge style={{ 
        background: '#ff4d4f',
        color: '#fff',
        padding: '8px 16px',
        borderRadius: '25px',
        fontWeight: '700',
        fontSize: '14px',
        boxShadow: '0 2px 8px rgba(255,77,79,0.08)'
      }}>
        <i className="fas fa-trophy me-1"></i>{isWinner ? 'Won' : 'Ended'}
      </Badge>;
    } else if (diff < 1000 * 60 * 60) {
      return <Badge style={{ 
        background: 'linear-gradient(135deg, #fbbf24 0%, #f59e42 100%)',
        color: '#222',
        padding: '8px 16px',
        borderRadius: '25px',
        fontWeight: '700',
        fontSize: '14px',
        boxShadow: '0 2px 8px rgba(251,191,36,0.08)'
      }}>
        <i className="fas fa-clock me-1"></i>Ending Soon
      </Badge>;
    } else {
      return <Badge style={{ 
        background: 'linear-gradient(135deg, #48bb78 0%, #38a169 100%)',
        color: '#fff',
        padding: '8px 16px',
        borderRadius: '25px',
        fontWeight: '700',
        fontSize: '14px',
        boxShadow: '0 2px 8px rgba(72,187,120,0.08)'
      }}>
        <i className="fas fa-check-circle me-1"></i>Active
      </Badge>;
    }
  };

  // Helper function to get the current leader/highest bidder
  const getCurrentLeader = (auction) => {
    // Check if there are any bids
    if (auction.bids && auction.bids.length > 0) {
      // Get the highest bid (assuming bids are sorted by amount descending)
      const highestBid = auction.bids[0];
      return {
        name: highestBid.userName || highestBid.userEmail || 'Anonymous',
        amount: highestBid.amount || auction.highestBid
      };
    }
    
    // Check alternative property names
    if (auction.Bids && auction.Bids.length > 0) {
      const highestBid = auction.Bids[0];
      return {
        name: highestBid.UserName || highestBid.UserEmail || highestBid.userName || highestBid.userEmail || 'Anonymous',
        amount: highestBid.Amount || highestBid.amount || auction.highestBid || auction.HighestBid
      };
    }
    
    // If auction has a winner already set
    if (auction.winnerUserName || auction.WinnerUserName) {
      return {
        name: auction.winnerUserName || auction.WinnerUserName,
        amount: auction.highestBid || auction.HighestBid || auction.startingPrice
      };
    }
    
    return null;
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
            {filteredAuctions.length} Active Auctions
          </span>
        </div>
      </div>

      {filteredAuctions.length === 0 ? (
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
          {filteredAuctions.map((auction) => {
            const currentLeader = getCurrentLeader(auction);
            const currentBid = auction.highestBid || auction.HighestBid || auction.startingPrice || 0;
            
            return (
              <Col key={auction.id} md={6} lg={4}>
                <Link to={`/auctions/${auction.id}`} style={{ textDecoration: 'none' }}>
                  <Card className="h-100 border-0 shadow-sm auction-card" style={{ 
                    borderRadius: '20px',
                    transition: 'transform 0.3s ease, box-shadow 0.3s ease' 
                  }}>
                    <div style={{ position: 'relative', width: '100%', aspectRatio: '16/9', background: '#f7fafc', overflow: 'hidden' }}>
                      <Card.Img
                        variant="top"
                        src={auction.imageUrl ? (auction.imageUrl.startsWith('http') ? auction.imageUrl : `http://localhost:5100${auction.imageUrl}`) : '/images/no-image.png'}
                        onError={e => { e.target.onerror = null; e.target.src = '/images/no-image.png'; }}
                        style={{ 
                          width: '100%',
                          height: '100%',
                          objectFit: 'cover',
                          transition: 'transform 0.3s ease',
                          borderRadius: 0
                        }}
                        onMouseOver={(e) => e.target.style.transform = 'scale(1.05)'}
                        onMouseOut={(e) => e.target.style.transform = 'scale(1)'}
                      />
                      <div style={{ position: 'absolute', top: '12px', right: '12px', zIndex: 2 }}>
                        {getStatusBadge(auction)}
                      </div>
                    </div>
                    <Card.Body style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between', padding: '1.5rem' }}>
                      <div>
                        <h5 className="fw-bold mb-2" style={{ color: '#2d3748', fontSize: '1.25rem', lineHeight: 1.2 }}>{auction.title}</h5>
                        <p className="text-muted mb-3" style={{ fontSize: '1rem', lineHeight: 1.4, minHeight: '2.5em', maxHeight: '2.5em', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{auction.description}</p>
                      </div>
                      <div style={{ background: '#f7fafc', borderRadius: '12px', padding: '1rem', marginTop: 'auto' }}>
                        <div className="d-flex justify-content-between align-items-center mb-2">
                          <span className="text-muted">Current Bid:</span>
                          <span className="fs-5 fw-bold" style={{ color: '#667eea' }}>
                            ₹{Number(currentBid).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                          </span>
                        </div>
                        <div className="d-flex justify-content-between align-items-center">
                          <span className="text-muted"><i className="fas fa-users me-1"></i>{auction.bidCount || 0} bids</span>
                          <span className="text-muted"><i className="fas fa-clock me-1"></i>{formatTimeLeft(auction.endTime)}</span>
                        </div>
                        
                        {/* Dynamic Leader Display */}
                        <div className="mt-3" style={{ 
                          background: currentLeader ? '#e6fffa' : '#f0f0f0', 
                          borderRadius: '8px', 
                          padding: '0.75rem',
                          border: currentLeader ? '1px solid #38b2ac' : '1px solid #e0e0e0'
                        }}>
                          <div className="d-flex align-items-center justify-content-center">
                            <i className={`fas ${currentLeader ? 'fa-trophy' : 'fa-gavel'} me-2`} 
                               style={{ color: currentLeader ? '#38b2ac' : '#a0aec0' }}></i>
                            <small className="fw-semibold">
                              {currentLeader ? (
                                <>
                                  <span style={{ color: '#2d3748' }}>Leading: </span>
                                  <span style={{ color: '#38b2ac' }}>{currentLeader.name}</span>
                                  <span style={{ color: '#667eea', marginLeft: '8px' }}>
                                    (₹{Number(currentLeader.amount).toLocaleString('en-IN', { minimumFractionDigits: 2 })})
                                  </span>
                                </>
                              ) : (
                                <span style={{ color: '#718096' }}>No bids yet - Be the first!</span>
                              )}
                            </small>
                          </div>
                        </div>
                      </div>
                    </Card.Body>
                  </Card>
                </Link>
              </Col>
            );
          })}
        </Row>
      )}
      
      <style jsx>{`
        .auction-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.15) !important;
        }
      `}</style>
    </div>
  );
};

export default AuctionItemList;