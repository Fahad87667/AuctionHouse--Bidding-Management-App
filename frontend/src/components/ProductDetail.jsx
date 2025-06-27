import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const AuctionItemDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [item, setItem] = useState(null);
  const [bids, setBids] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [bidAmount, setBidAmount] = useState('');
  const [bidError, setBidError] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [itemRes, bidsRes] = await Promise.all([
          axios.get(`http://localhost:5100/api/auctionitems/${id}`),
          axios.get(`http://localhost:5100/api/bids?auctionItemId=${id}`)
        ]);
        setItem(itemRes.data);
        setBids(bidsRes.data);
        setLoading(false);
      } catch (err) {
        setError('Failed to load auction item');
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  const handleBid = async () => {
    setBidError('');
    try {
      await axios.post('http://localhost:5100/api/bids', {
        amount: parseFloat(bidAmount),
        auctionItemId: item.id
      });
      setBidAmount('');
      // Refresh bids and item
      const [itemRes, bidsRes] = await Promise.all([
        axios.get(`http://localhost:5100/api/auctionitems/${id}`),
        axios.get(`http://localhost:5100/api/bids?auctionItemId=${id}`)
      ]);
      setItem(itemRes.data);
      setBids(bidsRes.data);
    } catch (err) {
      let errMsg = err.message || 'Failed to place bid';
      if (err.response?.data) {
        if (typeof err.response.data === 'string') {
          errMsg = err.response.data;
        } else if (typeof err.response.data.message === 'string') {
          errMsg = err.response.data.message;
        } else if (typeof err.response.data.title === 'string') {
          errMsg = err.response.data.title;
        } else {
          errMsg = JSON.stringify(err.response.data);
        }
      }
      setBidError(errMsg);
    }
  };

  if (loading) return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
      <div style={{ textAlign: 'center' }}>
        <div className="spinner-border text-primary" role="status" style={{ width: '3rem', height: '3rem' }}>
          <span className="visually-hidden">Loading...</span>
        </div>
        <p className="mt-3 text-muted">Loading auction details...</p>
      </div>
    </div>
  );
  
  if (error) return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
      <div className="alert alert-danger" role="alert" style={{ maxWidth: '500px', borderRadius: '12px' }}>
        <i className="fas fa-exclamation-triangle me-2"></i>
        Error: {error}
      </div>
    </div>
  );
  
  if (!item) return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
      <div className="alert alert-warning" role="alert" style={{ borderRadius: '12px' }}>
        <i className="fas fa-search me-2"></i>
        Auction item not found.
      </div>
    </div>
  );

  return (
    <div className="container py-5">
      <button 
        className="btn mb-4"
        onClick={() => navigate(-1)}
        style={{
          background: 'white',
          border: '2px solid #e2e8f0',
          borderRadius: '10px',
          padding: '10px 20px',
          fontWeight: '600',
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
      </button>

      <div className="row g-5">
        <div className="col-lg-6">
          <div style={{
            position: 'relative',
            borderRadius: '20px',
            overflow: 'hidden',
            boxShadow: '0 10px 30px rgba(0,0,0,0.1)'
          }}>
            <img
              src={item.imageUrl || 'https://via.placeholder.com/400x300?text=Auction+Item'}
              alt={item.title}
              className="img-fluid w-100"
              style={{ height: '450px', objectFit: 'cover' }}
            />
            {item.timeLeft === 'Ended' && (
              <div style={{
                position: 'absolute',
                top: '20px',
                right: '20px',
                background: 'rgba(220, 38, 38, 0.9)',
                color: 'white',
                padding: '10px 20px',
                borderRadius: '25px',
                fontWeight: 'bold',
                boxShadow: '0 4px 15px rgba(0,0,0,0.2)'
              }}>
                <i className="fas fa-times-circle me-2"></i>
                AUCTION ENDED
              </div>
            )}
          </div>
        </div>

        <div className="col-lg-6">
          <div className="mb-4">
            <h1 className="display-5 fw-bold mb-3" style={{ color: '#2d3748' }}>
              {item.title}
            </h1>
            <p className="lead text-muted mb-4">
              {item.description}
            </p>
          </div>

          <div className="card border-0 shadow-sm mb-4" style={{ borderRadius: '16px' }}>
            <div className="card-body p-4">
              <div className="row g-3">
                <div className="col-6">
                  <div className="text-center p-3" style={{ background: '#f7fafc', borderRadius: '12px' }}>
                    <i className="fas fa-pound-sign text-primary fs-4 mb-2 d-block"></i>
                    <small className="text-muted d-block">Current Bid</small>
                    <span className="fs-3 fw-bold" style={{ color: '#667eea' }}>
                      £{item.highestBid}
                    </span>
                  </div>
                </div>
                <div className="col-6">
                  <div className="text-center p-3" style={{ background: '#f7fafc', borderRadius: '12px' }}>
                    <i className="fas fa-users text-success fs-4 mb-2 d-block"></i>
                    <small className="text-muted d-block">Total Bids</small>
                    <span className="fs-3 fw-bold">
                      {item.bidCount}
                    </span>
                  </div>
                </div>
                <div className="col-12">
                  <div className="text-center p-3" style={{ background: '#e6fffa', borderRadius: '12px' }}>
                    <i className="fas fa-clock text-warning fs-5 me-2"></i>
                    <span className="fw-semibold me-3">Time Left: {item.timeLeft}</span>
                    <span className="text-muted">|</span>
                    <i className="fas fa-trophy text-success fs-5 ms-3 me-2"></i>
                    <span className="fw-semibold">Leading: {item.winningUser || 'No bids yet'}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="card border-0 shadow-sm" style={{ borderRadius: '16px' }}>
            <div className="card-body p-4">
              <h5 className="card-title fw-bold mb-3" style={{ color: '#2d3748' }}>
                <i className="fas fa-gavel me-2" style={{ color: '#667eea' }}></i>
                Place Your Bid
              </h5>
              <div className="input-group mb-3" style={{ borderRadius: '12px', overflow: 'hidden' }}>
                <span className="input-group-text" style={{ 
                  background: '#f7fafc', 
                  border: '1.5px solid #e2e8f0',
                  borderRight: 'none'
                }}>£</span>
                <input
                  type="number"
                  min={item.highestBid + 1}
                  value={bidAmount}
                  onChange={e => setBidAmount(e.target.value)}
                  className="form-control"
                  placeholder={`Enter more than £${item.highestBid}`}
                  disabled={item.timeLeft === 'Ended'}
                  style={{ 
                    border: '1.5px solid #e2e8f0',
                    borderLeft: 'none',
                    fontSize: '18px',
                    padding: '12px'
                  }}
                />
              </div>
              <button
                className="btn w-100 fw-semibold"
                onClick={handleBid}
                disabled={item.timeLeft === 'Ended'}
                style={{
                  background: item.timeLeft === 'Ended' ? '#cbd5e0' : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  border: 'none',
                  color: 'white',
                  padding: '14px',
                  borderRadius: '12px',
                  fontSize: '16px',
                  transition: 'transform 0.2s ease',
                  cursor: item.timeLeft === 'Ended' ? 'not-allowed' : 'pointer'
                }}
                onMouseOver={(e) => {
                  if (item.timeLeft !== 'Ended') {
                    e.target.style.transform = 'translateY(-2px)';
                  }
                }}
                onMouseOut={(e) => {
                  e.target.style.transform = 'translateY(0)';
                }}
              >
                {item.timeLeft === 'Ended' ? 'Auction Has Ended' : 'Place Bid'}
              </button>
              {bidError && (
                <div className="alert alert-danger mt-3" role="alert" style={{ 
                  borderRadius: '10px',
                  border: 'none',
                  backgroundColor: '#fee',
                  color: '#c53030'
                }}>
                  <i className="fas fa-exclamation-circle me-2"></i>
                  {bidError}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="mt-5">
        <div className="card border-0 shadow-sm" style={{ borderRadius: '20px' }}>
          <div className="card-header bg-white border-0 p-4" style={{ borderRadius: '20px 20px 0 0' }}>
            <h3 className="mb-0 fw-bold" style={{ color: '#2d3748' }}>
              <i className="fas fa-history me-2" style={{ color: '#667eea' }}></i>
              Bid History
            </h3>
          </div>
          <div className="card-body p-4">
            {bids.length === 0 ? (
              <div className="text-center py-5">
                <i className="fas fa-gavel text-muted mb-3" style={{ fontSize: '3rem' }}></i>
                <p className="text-muted fs-5">No bids placed yet. Be the first to bid!</p>
              </div>
            ) : (
              <div className="table-responsive">
                <table className="table table-hover">
                  <thead>
                    <tr style={{ borderBottom: '2px solid #e2e8f0' }}>
                      <th className="fw-semibold text-secondary py-3">
                        <i className="fas fa-user me-2"></i>Bidder
                      </th>
                      <th className="fw-semibold text-secondary py-3">
                        <i className="fas fa-pound-sign me-2"></i>Amount
                      </th>
                      <th className="fw-semibold text-secondary py-3">
                        <i className="fas fa-clock me-2"></i>Time
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {bids.map((bid, index) => (
                      <tr key={bid.id} style={{ 
                        transition: 'background 0.2s ease',
                        background: index === 0 ? '#f0f9ff' : 'transparent'
                      }}>
                        <td className="py-3">
                          <div className="d-flex align-items-center">
                            <div style={{
                              width: '40px',
                              height: '40px',
                              borderRadius: '50%',
                              background: index === 0 ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' : '#e2e8f0',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              marginRight: '12px'
                            }}>
                              <i className="fas fa-user text-white"></i>
                            </div>
                            <div>
                              <span className="fw-semibold">{bid.userName || `User #${bid.userId}`}</span>
                              {index === 0 && (
                                <span className="badge bg-success ms-2" style={{ borderRadius: '20px' }}>
                                  Leading
                                </span>
                              )}
                            </div>
                          </div>
                        </td>
                        <td className="py-3">
                          <span className="fs-5 fw-semibold" style={{ color: index === 0 ? '#667eea' : '#4a5568' }}>
                            £{bid.amount}
                          </span>
                        </td>
                        <td className="py-3 text-muted">
                          <i className="far fa-calendar me-2"></i>
                          {new Date(bid.timestamp).toLocaleString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuctionItemDetail;