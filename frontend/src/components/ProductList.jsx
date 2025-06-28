import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const AuctionItemList = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [bidModal, setBidModal] = useState({ open: false, item: null });
  const [bidAmount, setBidAmount] = useState('');
  const [bidError, setBidError] = useState('');

  const fetchItems = useCallback(async () => {
    try {
      const response = await axios.get('http://localhost:5100/api/auctionitems');
      setItems(response.data);
      setLoading(false);
    } catch (err) {
      setError('Failed to fetch auction items');
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchItems();
  }, [fetchItems]);

  const openBidModal = (item) => {
    setBidModal({ open: true, item });
    setBidAmount('');
    setBidError('');
  };

  const closeBidModal = () => {
    setBidModal({ open: false, item: null });
    setBidAmount('');
    setBidError('');
  };

  const handleBid = async () => {
    setBidError('');
    try {
      await axios.post('http://localhost:5100/api/bids', {
        amount: parseFloat(bidAmount),
        auctionItemId: bidModal.item.id
      });
      closeBidModal();
      fetchItems();
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
        <p className="mt-3 text-muted">Loading auction items...</p>
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

  return (
    <div className="container py-5">
      <div className="text-center mb-5">
        <h1 className="display-4 fw-bold mb-3" style={{ color: '#2d3748' }}>
          <i className="fas fa-gavel me-3" style={{ color: '#667eea' }}></i>
          Live Auctions
        </h1>
        <p className="text-muted fs-5">Discover amazing items and place your bids</p>
      </div>
      
      <div className="row g-4">
        {items.map((item) => (
          <div key={item.id} className="col-md-6 col-lg-4">
            <Link to={`/auction/${item.id}`} style={{ textDecoration: 'none', color: 'inherit', display: 'block', height: '100%' }}>
              <div className="card h-100 shadow-sm" style={{ 
                borderRadius: '16px', 
                overflow: 'hidden',
                transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                border: 'none',
                display: 'flex',
                flexDirection: 'column',
                minHeight: '420px',
                background: '#fff'
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.transform = 'translateY(-5px)';
                e.currentTarget.style.boxShadow = '0 10px 30px rgba(0,0,0,0.15)';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 0.125rem 0.25rem rgba(0,0,0,0.075)';
              }}>
                <div style={{ position: 'relative', width: '100%', aspectRatio: '16/9', background: '#f7fafc', overflow: 'hidden' }}>
                  <img
                    src={item.imageUrl ? (item.imageUrl.startsWith('http') ? item.imageUrl : `http://localhost:5100${item.imageUrl}`) : '/images/no-image.png'}
                    alt={item.title}
                    className="card-img-top"
                    style={{ 
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                      transition: 'transform 0.3s ease',
                      borderRadius: 0
                    }}
                    onError={e => { e.target.onerror = null; e.target.src = '/images/no-image.png'; }}
                    onMouseOver={(e) => e.target.style.transform = 'scale(1.05)'}
                    onMouseOut={(e) => e.target.style.transform = 'scale(1)'}
                  />
                  {item.timeLeft === 'Ended' && (
                    <div style={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      right: 0,
                      bottom: 0,
                      background: 'rgba(0,0,0,0.7)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      zIndex: 2
                    }}>
                      <span className="badge bg-danger fs-6 px-4 py-2" style={{ borderRadius: '20px' }}>
                        AUCTION ENDED
                      </span>
                    </div>
                  )}
                </div>
                <div className="card-body p-4 d-flex flex-column" style={{ flex: 1, justifyContent: 'space-between' }}>
                  <div>
                    <h5 className="card-title fw-bold mb-2" style={{ color: '#2d3748', fontSize: '1.25rem', lineHeight: 1.2 }}>{item.title}</h5>
                    <p className="card-text text-muted mb-3" style={{ fontSize: '1rem', lineHeight: 1.4, minHeight: '2.5em', maxHeight: '2.5em', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{item.description}</p>
                  </div>
                  <div style={{ background: '#f7fafc', borderRadius: '12px', padding: '1rem', marginTop: 'auto' }}>
                    <div className="d-flex justify-content-between align-items-center mb-2">
                      <span className="text-muted">Current Bid:</span>
                      <span className="fs-5 fw-bold" style={{ color: '#667eea' }}>
                        ₹{item.highestBid !== null && item.highestBid !== undefined
                          ? Number(item.highestBid).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })
                          : (item.startingPrice !== null && item.startingPrice !== undefined
                              ? Number(item.startingPrice).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })
                              : '0.00')}
                      </span>
                    </div>
                    <div className="d-flex justify-content-between align-items-center">
                      <span className="text-muted"><i className="fas fa-users me-1"></i>{item.bidCount} bids</span>
                      <span className="text-muted"><i className="fas fa-clock me-1"></i>{item.timeLeft}</span>
                    </div>
                    <div className="mt-2 text-center" style={{ background: '#e6fffa', borderRadius: '8px', padding: '0.5em 0' }}>
                      <small className="text-muted">
                        <i className="fas fa-trophy text-success me-1"></i>
                        Leading: <span className="fw-semibold">
                          {item.winningUser && item.highestBid ? (
                            <>
                              {item.winningUser} <span style={{ color: '#667eea' }}>
                                (₹{Number(item.highestBid).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })})
                              </span>
                            </>
                          ) : 'No bids yet'}
                        </span>
                      </small>
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          </div>
        ))}
      </div>
      
      {bidModal.open && (
        <div className="modal show d-block" style={{ 
          backgroundColor: 'rgba(0,0,0,0.5)'
        }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content" style={{ borderRadius: '20px', border: 'none' }}>
              <div className="modal-header border-0 pb-0">
                <div className="w-100">
                  <div className="text-center mb-3">
                    <div style={{ 
                      width: '60px', 
                      height: '60px', 
                      background: '#667eea',
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      margin: '0 auto'
                    }}>
                      <i className="fas fa-gavel text-white fs-4"></i>
                    </div>
                  </div>
                  <h4 className="modal-title text-center fw-bold" style={{ color: '#2d3748' }}>
                    Place Your Bid
                  </h4>
                </div>
                <button 
                  type="button" 
                  className="btn-close position-absolute" 
                  style={{ top: '20px', right: '20px' }}
                  onClick={closeBidModal}
                ></button>
              </div>
              
              <div className="modal-body px-4 pb-4">
                <div className="text-center mb-4">
                  <h5 className="mb-2">{bidModal.item.title}</h5>
                  <div className="p-3" style={{ background: '#f7fafc', borderRadius: '12px' }}>
                    <small className="text-muted d-block mb-1">Current Highest Bid</small>
                    <span className="fs-3 fw-bold" style={{ color: '#667eea' }}>
                      ₹{bidModal.item.highestBid !== null && bidModal.item.highestBid !== undefined
                        ? Number(bidModal.item.highestBid).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })
                        : (bidModal.item.startingPrice !== null && bidModal.item.startingPrice !== undefined
                            ? Number(bidModal.item.startingPrice).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })
                            : '0.00')}
                    </span>
                  </div>
                </div>
                
                <div className="mb-3">
                  <label className="form-label fw-semibold text-secondary">
                    <i className="fas fa-rupee-sign me-2"></i>Your Bid Amount
                  </label>
                  <input
                    type="number"
                    min={Number(bidModal.item.highestBid ?? bidModal.item.startingPrice) + 1}
                    value={bidAmount}
                    onChange={e => setBidAmount(e.target.value)}
                    className="form-control form-control-lg"
                    placeholder={`Enter more than ₹${Number(bidModal.item.highestBid ?? bidModal.item.startingPrice)}`}
                    style={{ 
                      borderRadius: '12px',
                      border: '1.5px solid #e2e8f0',
                      fontSize: '18px'
                    }}
                  />
                </div>
                
                {bidError && (
                  <div className="alert alert-danger d-flex align-items-center" role="alert" style={{ 
                    borderRadius: '10px',
                    border: 'none',
                    backgroundColor: '#fee',
                    color: '#c53030'
                  }}>
                    <i className="fas fa-exclamation-circle me-2"></i>
                    {bidError}
                  </div>
                )}
                
                <div className="d-flex gap-2 mt-4">
                  <button 
                    className="btn btn-primary flex-fill fw-semibold"
                    onClick={handleBid}
                    style={{
                      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                      border: 'none',
                      padding: '12px',
                      borderRadius: '10px'
                    }}
                  >
                    Submit Bid
                  </button>
                  <button 
                    className="btn btn-outline-secondary flex-fill fw-semibold"
                    onClick={closeBidModal}
                    style={{
                      padding: '12px',
                      borderRadius: '10px'
                    }}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AuctionItemList