import React, { useState, useEffect } from 'react';
import { Tabs, Tab, Table, Button, Badge, Spinner, Card, Image } from 'react-bootstrap';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

const UserDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('bids');
  const [bids, setBids] = useState([]);
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [payLoading, setPayLoading] = useState(null);
  const [payError, setPayError] = useState('');
  const [paySuccess, setPaySuccess] = useState(null);

  useEffect(() => {
    fetchData();
  }, [user]);

  const fetchData = async () => {
    setLoading(true);
    try {
      // Fetch only this user's bids
      const bidsRes = await axios.get('http://localhost:5100/api/bids/my-bids', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setBids(bidsRes.data);
      // Fetch all payments, filter for this user
      const paymentsRes = await axios.get('http://localhost:5100/api/payments/my-payments', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setPayments(paymentsRes.data);
    } catch (err) {
      setBids([]);
      setPayments([]);
    } finally {
      setLoading(false);
    }
  };

  const handlePayNow = async (auctionId) => {
    setPayLoading(auctionId);
    setPayError('');
    try {
      await axios.post('http://localhost:5100/api/payments/create-order', { AuctionId: auctionId }, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      await axios.post('http://localhost:5100/api/payments/confirm', {
        AuctionId: auctionId,
        TransactionId: 'mock_txn_' + Date.now(),
        RawResponse: '{}'
      }, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setPaySuccess(auctionId);
      fetchData();
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
      setPayLoading(null);
    }
  };

  // Helper to format time left
  const formatTimeLeft = (endTime) => {
    const now = new Date();
    const end = new Date(endTime);
    const diff = end - now;
    if (diff <= 0) return <span style={{ color: '#e53e3e' }}><i className="fas fa-clock me-1"></i>Ended</span>;
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
    const minutes = Math.floor((diff / (1000 * 60)) % 60);
    const seconds = Math.floor((diff / 1000) % 60);
    
    if (days > 0) {
      return <span style={{ color: '#38a169' }}><i className="fas fa-clock me-1"></i>{days}d {hours}h</span>;
    } else if (hours > 0) {
      return <span style={{ color: '#d69e2e' }}><i className="fas fa-clock me-1"></i>{hours}h {minutes}m</span>;
    } else {
      return <span style={{ color: '#e53e3e' }}><i className="fas fa-clock me-1"></i>{minutes}m {seconds}s</span>;
    }
  };

  // Filter for won but unpaid auctions
  const wonUnpaid = bids.filter(bid => {
    const auctionEnded = bid.auctionEndTime && new Date(bid.auctionEndTime) <= new Date();
    const isWinner = (bid.isCompleted || bid.isPaid) && bid.winnerUserId && user.id && bid.winnerUserId === user.id;
    return isWinner && !bid.isPaid;
  });

  // Hardcoded admin check - same as elsewhere
  const isAdmin = user && (
    user.email === 'admin@auction.com' ||
    user.role === 'Admin' ||
    (user.roles && user.roles.includes('Admin'))
  );

  const formatDateTime = (dateStr) => {
    if (!dateStr) return 'N/A';
    const date = new Date(dateStr);
    return date.toLocaleString('en-IN', {
      day: '2-digit', month: 'short', year: 'numeric',
      hour: '2-digit', minute: '2-digit', hour12: true
    });
  };

  const getStatusBadge = (bid) => {
    const auctionEnded = bid.auctionEndTime && new Date(bid.auctionEndTime) <= new Date();
    const isUserHighest = bid.isWinning && auctionEnded;
    const isBackendWinner = (bid.isCompleted || bid.isPaid) && bid.winnerUserId && user.id && bid.winnerUserId === user.id;
    
    if (isBackendWinner || isUserHighest) {
      return <Badge style={{ 
        background: 'linear-gradient(135deg, #48bb78 0%, #38a169 100%)',
        color: '#fff',
        padding: '6px 12px',
        borderRadius: '20px',
        fontWeight: '600'
      }}>
        <i className="fas fa-trophy me-1"></i>Won
      </Badge>;
    } else if (bid.isWinning) {
      return <Badge style={{ 
        background: 'linear-gradient(135deg, #fbbf24 0%, #f59e42 100%)',
        color: '#fff',
        padding: '6px 12px',
        borderRadius: '20px',
        fontWeight: '600'
      }}>
        <i className="fas fa-fire me-1"></i>Winning
      </Badge>;
    } else {
      return <span
        className="badge"
        style={{
          background: '#6b7280',  // Darker grey background
          color: '#fff',          // White text for better contrast
          padding: '6px 12px',
          borderRadius: '20px',
          fontWeight: '600',
          display: 'inline-flex',
          alignItems: 'center',
        }}
      >
        <i className="fas fa-times-circle me-1"></i>Outbid
      </span>;
    }
  };

  if (isAdmin) {
    return (
      <div className="container py-5">
        <div className="row justify-content-center">
          <div className="col-md-6">
            <Card style={{ borderRadius: '20px', border: 'none', boxShadow: '0 10px 30px rgba(0,0,0,0.1)' }}>
              <Card.Body className="text-center p-5">
                <div style={{ 
                  width: '80px', 
                  height: '80px', 
                  background: '#fee',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 20px'
                }}>
                  <i className="fas fa-shield-alt" style={{ fontSize: '36px', color: '#e53e3e' }}></i>
                </div>
                <h4 style={{ color: '#2d3748' }}>Access Restricted</h4>
                <p className="text-muted">Admins cannot access the user dashboard.</p>
                <Button 
                  onClick={() => navigate('/admin')}
                  style={{ 
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    border: 'none',
                    padding: '10px 30px',
                    borderRadius: '25px'
                  }}
                >
                  Go to Admin Panel
                </Button>
              </Card.Body>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
        <div style={{ textAlign: 'center' }}>
          <div className="spinner-border text-primary" role="status" style={{ width: '3rem', height: '3rem' }}>
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-3 text-muted">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-5">
      {/* Header Section */}
      <div className="mb-5">
        <div className="row align-items-center">
          <div className="col-md-8">
            <h1 className="display-4 fw-bold mb-3" style={{ color: '#2d3748' }}>
              <i className="fas fa-user-circle me-3" style={{ color: '#667eea' }}></i>
              Your Dashboard
            </h1>
            <p className="text-muted fs-5">Track your bidding activity and payment history</p>
          </div>
          <div className="col-md-4 text-md-end">
            <div className="d-flex gap-3 justify-content-md-end">
              <Card style={{ 
                borderRadius: '15px', 
                border: 'none',
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                color: 'white'
              }}>
                <Card.Body className="p-3">
                  <div className="d-flex align-items-center">
                    <i className="fas fa-gavel fs-4 me-3"></i>
                    <div>
                      <small className="d-block opacity-75">Total Bids</small>
                      <h4 className="mb-0">{bids.length}</h4>
                    </div>
                  </div>
                </Card.Body>
              </Card>
              {wonUnpaid.length > 0 && (
                <Card style={{ 
                  borderRadius: '15px', 
                  border: 'none',
                  background: 'linear-gradient(135deg, #fbbf24 0%, #f59e42 100%)',
                  color: 'white'
                }}>
                  <Card.Body className="p-3">
                    <div className="d-flex align-items-center">
                      <i className="fas fa-exclamation-circle fs-4 me-3"></i>
                      <div>
                        <small className="d-block">Pending</small>
                        <h4 className="mb-0">{wonUnpaid.length}</h4>
                      </div>
                    </div>
                  </Card.Body>
                </Card>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced Tabs */}
      <Card style={{ borderRadius: '20px', border: 'none', boxShadow: '0 10px 30px rgba(0,0,0,0.08)' }}>
        <Card.Body className="p-0">
          <Tabs 
            activeKey={activeTab} 
            onSelect={setActiveTab} 
            className="custom-tabs"
            style={{ borderBottom: '2px solid #f0f0f0' }}
          >
            <Tab 
              eventKey="bids" 
              title={
                <span>
                  <i className="fas fa-gavel me-2"></i>
                  Your Bids
                  {bids.length > 0 && (
                    <Badge 
                      className="ms-2" 
                      style={{ 
                        background: '#667eea',
                        borderRadius: '12px',
                        padding: '4px 8px'
                      }}
                    >
                      {bids.length}
                    </Badge>
                  )}
                </span>
              }
            >
              <div className="p-4">
                {bids.length === 0 ? (
                  <div className="text-center py-5">
                    <i className="fas fa-inbox text-muted mb-3" style={{ fontSize: '4rem' }}></i>
                    <h5 className="text-muted">No Bids Yet</h5>
                    <p className="text-muted mb-4">Start bidding on amazing items!</p>
                    <Button 
                      onClick={() => navigate('/auctions')}
                      style={{ 
                        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                        border: 'none',
                        padding: '10px 30px',
                        borderRadius: '25px'
                      }}
                    >
                      Browse Auctions
                    </Button>
                  </div>
                ) : (
                  <div className="table-responsive">
                    <Table hover className="mb-0 align-middle" style={{ borderCollapse: 'separate', borderSpacing: '0 8px' }}>
                      <thead>
                        <tr style={{ backgroundColor: '#f8f9fa' }}>
                          <th style={{ border: 'none', padding: '15px', borderRadius: '12px 0 0 12px' }}>Listing</th>
                          <th style={{ border: 'none', padding: '15px' }}>Time Left</th>
                          <th style={{ border: 'none', padding: '15px' }}>Your Bid</th>
                          <th style={{ border: 'none', padding: '15px' }}>Status</th>
                          {bids.some(bid => {
                            const auctionEnded = bid.auctionEndTime && new Date(bid.auctionEndTime) <= new Date();
                            const isUserHighest = bid.isWinning && auctionEnded;
                            const isBackendWinner = (bid.isCompleted || bid.isPaid) && bid.winnerUserId && user.id && bid.winnerUserId === user.id;
                            const canPay = (isBackendWinner || isUserHighest) && !bid.isPaid;
                            return canPay;
                          }) && <th style={{ border: 'none', padding: '15px', borderRadius: '0 12px 12px 0' }}>Action</th>}
                        </tr>
                      </thead>
                      <tbody>
                        {bids.map((bid, idx) => {
                          const auctionEnded = bid.auctionEndTime && new Date(bid.auctionEndTime) <= new Date();
                          const isUserHighest = bid.isWinning && auctionEnded;
                          const isBackendWinner = (bid.isCompleted || bid.isPaid) && bid.winnerUserId && user.id && bid.winnerUserId === user.id;
                          const canPay = (isBackendWinner || isUserHighest) && !bid.isPaid;
                          
                          return (
                            <tr key={bid.id || idx} style={{ 
                              backgroundColor: 'white',
                              boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
                              transition: 'all 0.3s ease'
                            }}>
                              <td style={{ 
                                border: 'none', 
                                padding: '20px',
                                borderRadius: '12px 0 0 12px'
                              }}>
                                <div className="d-flex align-items-center gap-3">
                                  <div style={{ 
                                    width: '60px', 
                                    height: '60px', 
                                    borderRadius: '12px',
                                    overflow: 'hidden',
                                    flexShrink: 0
                                  }}>
                                    <img 
                                      src={
                                        bid.auctionImageUrl
                                          ? (bid.auctionImageUrl.startsWith('http')
                                              ? bid.auctionImageUrl
                                              : `http://localhost:5100${bid.auctionImageUrl}`)
                                          : '/images/no-image.png'
                                      } 
                                      alt="Auction" 
                                      style={{ 
                                        width: '100%', 
                                        height: '100%', 
                                        objectFit: 'cover'
                                      }}
                                      onError={(e) => { e.target.src = '/images/no-image.png' }}
                                    />
                                  </div>
                                  <div>
                                    <div className="fw-semibold" style={{ fontSize: '16px', color: '#2d3748' }}>
                                      {bid.auctionTitle}
                                    </div>
                                    <div className="text-muted" style={{ 
                                      fontSize: '14px',
                                      maxWidth: '250px', 
                                      whiteSpace: 'nowrap', 
                                      overflow: 'hidden', 
                                      textOverflow: 'ellipsis' 
                                    }}>
                                      {bid.auctionDescription}
                                    </div>
                                  </div>
                                </div>
                              </td>
                              <td style={{ border: 'none', padding: '20px' }}>
                                {formatTimeLeft(bid.auctionEndTime)}
                              </td>
                              <td style={{ 
                                border: 'none', 
                                padding: '20px',
                                fontSize: '16px',
                                fontWeight: '600',
                                color: '#667eea'
                              }}>
                                ₹{Number(bid.amount).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                              </td>
                              <td style={{ border: 'none', padding: '20px' }}>
                                {getStatusBadge(bid)}
                              </td>
                              {bids.some(bid => {
                                const auctionEnded = bid.auctionEndTime && new Date(bid.auctionEndTime) <= new Date();
                                const isUserHighest = bid.isWinning && auctionEnded;
                                const isBackendWinner = (bid.isCompleted || bid.isPaid) && bid.winnerUserId && user.id && bid.winnerUserId === user.id;
                                const canPay = (isBackendWinner || isUserHighest) && !bid.isPaid;
                                return canPay;
                              }) && (
                                <td style={{ 
                                  border: 'none', 
                                  padding: '20px',
                                  borderRadius: '0 12px 12px 0'
                                }}>
                                  {canPay && (
                                    <>
                                      <Button 
                                        size="sm" 
                                        className="fw-semibold"
                                        onClick={() => navigate(`/payment/${bid.auctionItemId}`)}
                                        style={{ 
                                          background: 'linear-gradient(135deg, #48bb78 0%, #38a169 100%)',
                                          border: 'none',
                                          padding: '8px 20px',
                                          borderRadius: '20px',
                                          transition: 'all 0.3s ease'
                                        }}
                                        onMouseOver={(e) => {
                                          e.target.style.transform = 'translateY(-2px)';
                                          e.target.style.boxShadow = '0 4px 12px rgba(72,187,120,0.3)';
                                        }}
                                        onMouseOut={(e) => {
                                          e.target.style.transform = 'translateY(0)';
                                          e.target.style.boxShadow = 'none';
                                        }}
                                      >
                                        <i className="fas fa-credit-card me-1"></i>
                                        Pay Now
                                      </Button>
                                      {paySuccess === bid.auctionItemId && (
                                        <div className="text-success mt-2">
                                          <i className="fas fa-check-circle me-1"></i>Paid!
                                        </div>
                                      )}
                                      {payError && payLoading === bid.auctionItemId && (
                                        <div className="text-danger small mt-2">{payError}</div>
                                      )}
                                    </>
                                  )}
                                </td>
                              )}
                            </tr>
                          );
                        })}
                      </tbody>
                    </Table>
                  </div>
                )}
              </div>
            </Tab>
            
            <Tab 
              eventKey="payments" 
              title={
                <span>
                  <i className="fas fa-credit-card me-2"></i>
                  Payment History
                  {payments.length > 0 && (
                    <Badge 
                      className="ms-2" 
                      style={{ 
                        background: '#48bb78',
                        borderRadius: '12px',
                        padding: '4px 8px'
                      }}
                    >
                      {payments.length}
                    </Badge>
                  )}
                </span>
              }
            >
              <div className="p-4">
                {payments.length === 0 ? (
                  <div className="text-center py-5">
                    <i className="fas fa-receipt text-muted mb-3" style={{ fontSize: '4rem' }}></i>
                    <h5 className="text-muted">No Payments Yet</h5>
                    <p className="text-muted">Your payment history will appear here</p>
                  </div>
                ) : (
                  <div className="table-responsive">
                    <Table hover className="mb-0" style={{ borderCollapse: 'separate', borderSpacing: '0 8px' }}>
                      <thead>
                        <tr style={{ backgroundColor: '#f8f9fa' }}>
                          <th style={{ border: 'none', padding: '15px', borderRadius: '12px 0 0 12px' }}>
                            <i className="fas fa-hashtag me-2"></i>Auction ID
                          </th>
                          <th style={{ border: 'none', padding: '15px' }}>
                            <i className="fas fa-rupee-sign me-2"></i>Amount
                          </th>
                          <th style={{ border: 'none', padding: '15px' }}>
                            <i className="fas fa-info-circle me-2"></i>Status
                          </th>
                          <th style={{ border: 'none', padding: '15px' }}>
                            <i className="fas fa-receipt me-2"></i>Transaction ID
                          </th>
                          <th style={{ border: 'none', padding: '15px' }}>
                            <i className="fas fa-calendar me-2"></i>Date & Time
                          </th>
                          <th style={{ border: 'none', padding: '15px', borderRadius: '0 12px 12px 0' }}>
                            <i className="fas fa-university me-2"></i>Gateway
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {payments.map((p, idx) => (
                          <tr key={p.id || idx} style={{ 
                            backgroundColor: 'white',
                            boxShadow: '0 2px 8px rgba(0,0,0,0.04)'
                          }}>
                            <td style={{ 
                              border: 'none', 
                              padding: '20px',
                              borderRadius: '12px 0 0 12px',
                              fontWeight: '600'
                            }}>
                              #{p.auctionId}
                            </td>
                            <td style={{ 
                              border: 'none', 
                              padding: '20px',
                              fontSize: '16px',
                              fontWeight: '600',
                              color: '#667eea'
                            }}>
                              ₹{Number(p.amount).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                            </td>
                            <td style={{ border: 'none', padding: '20px' }}>
                              <Badge style={{ 
                                background: p.status === 'Completed' ? '#48bb78' : '#fbbf24',
                                color: '#fff',
                                padding: '6px 12px',
                                borderRadius: '20px',
                                fontWeight: '600'
                              }}>
                                <i className={`fas ${p.status === 'Completed' ? 'fa-check-circle' : 'fa-clock'} me-1`}></i>
                                {p.status}
                              </Badge>
                            </td>
                            <td style={{ 
                              border: 'none', 
                              padding: '20px',
                              fontFamily: 'monospace',
                              fontSize: '14px'
                            }}>
                              {p.transactionId}
                            </td>
                            <td style={{ border: 'none', padding: '20px' }}>
                              {formatDateTime(p.timestamp)}
                            </td>
                            <td style={{ 
                              border: 'none', 
                              padding: '20px',
                              borderRadius: '0 12px 12px 0'
                            }}>
                              <span style={{ 
                                background: '#f0f0f0',
                                padding: '4px 12px',
                                borderRadius: '12px',
                                fontSize: '14px'
                              }}>
                                {p.gateway}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </Table>
                  </div>
                )}
              </div>
            </Tab>
          </Tabs>
        </Card.Body>
      </Card>

      <style jsx>{`
        .custom-tabs .nav-link {
          color: #64748b;
          border: none;
          padding: 15px 25px;
          font-weight: 600;
          transition: all 0.3s ease;
        }
        .custom-tabs .nav-link:hover {
          color: #667eea;
        }
        .custom-tabs .nav-link.active {
          color: #667eea;
          background-color: transparent;
          border-bottom: 3px solid #667eea;
        }
        tr:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(0,0,0,0.08) !important;
        }
      `}</style>
    </div>
  );
};

export default UserDashboard;