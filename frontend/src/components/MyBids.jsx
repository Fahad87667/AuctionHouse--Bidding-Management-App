import React, { useEffect, useState } from 'react';
import { Table, Alert, Spinner, Badge } from 'react-bootstrap';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const MyBids = () => {
  const [bids, setBids] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const [paying, setPaying] = useState(null);
  const userId = window.localStorage.getItem('userId');

  useEffect(() => {
    const fetchBids = async () => {
      try {
        setLoading(true);
        const response = await axios.get('http://localhost:5100/api/bids/my-bids');
        setBids(response.data);
      } catch (err) {
        setError('Failed to load your bids.');
      } finally {
        setLoading(false);
      }
    };
    fetchBids();
  }, []);

  if (loading) return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
      <div style={{ textAlign: 'center' }}>
        <Spinner 
          animation="border" 
          variant="primary"
          style={{ width: '3rem', height: '3rem' }}
        />
        <p className="mt-3 text-muted">Loading your bids...</p>
      </div>
    </div>
  );
  
  if (error) return (
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
            <i className="fas fa-list-alt text-white" style={{ fontSize: '32px' }}></i>
          </div>
        </div>
        <h2 className="fw-bold mb-2" style={{ color: '#2d3748' }}>My Bid History</h2>
        <p className="text-muted">Track all your auction bids in one place</p>
      </div>
      
      {bids.length === 0 ? (
        <div className="text-center py-5">
          <div className="card border-0 shadow-sm mx-auto" style={{ maxWidth: '500px', borderRadius: '20px' }}>
            <div className="card-body p-5">
              <i className="fas fa-gavel text-muted mb-4" style={{ fontSize: '4rem' }}></i>
              <h5 className="mb-3">No Bids Yet</h5>
              <p className="text-muted mb-0">
                You haven't placed any bids yet. Start exploring our auctions to find amazing items!
              </p>
            </div>
          </div>
        </div>
      ) : (
        <div className="card border-0 shadow-sm" style={{ borderRadius: '20px', overflow: 'hidden' }}>
          <div className="card-header bg-white border-0 p-4" style={{ borderBottom: '1px solid #f0f4f8' }}>
            <div className="d-flex justify-content-between align-items-center">
              <h5 className="mb-0 fw-bold" style={{ color: '#2d3748' }}>
                <i className="fas fa-history me-2" style={{ color: '#667eea' }}></i>
                Your Bids
              </h5>
              <span className="badge" style={{ 
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                padding: '8px 16px',
                borderRadius: '20px',
                fontSize: '14px'
              }}>
                {bids.length} Total Bids
              </span>
            </div>
          </div>
          <div className="table-responsive">
            <Table hover className="mb-0" style={{ borderRadius: '0 0 20px 20px' }}>
              <thead style={{ backgroundColor: '#f8fafc' }}>
                <tr>
                  <th className="border-0 py-3 px-4 fw-semibold text-secondary">
                    <i className="fas fa-tag me-2"></i>Auction Item
                  </th>
                  <th className="border-0 py-3 px-4 fw-semibold text-secondary">
                    <i className="fas fa-indian-rupee-sign me-2"></i>Bid Amount
                  </th>
                  <th className="border-0 py-3 px-4 fw-semibold text-secondary">
                    <i className="fas fa-clock me-2"></i>Ends On
                  </th>
                  <th className="border-0 py-3 px-4 fw-semibold text-secondary">
                    <i className="fas fa-info-circle me-2"></i>Status
                  </th>
                </tr>
              </thead>
              <tbody>
                {bids.map((bid, index) => {
                  // Fallback: If auction is ended and this bid is the highest, show 'Won'
                  const auctionEnded = bid.auctionEndTime && new Date(bid.auctionEndTime) <= new Date();
                  const isUserHighest = bid.isWinning && auctionEnded;
                  const isBackendWinner = (bid.isCompleted || bid.isPaid) && bid.winnerUserId && userId && bid.winnerUserId === userId;
                  return (
                    <tr 
                      key={bid.id} 
                      style={{ 
                        transition: 'background 0.2s ease',
                        borderBottom: index === bids.length - 1 ? 'none' : '1px solid #f0f4f8'
                      }}
                      onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#f8fafc'}
                      onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                    >
                      <td className="py-4 px-4">
                        <div className="d-flex align-items-center">
                          <div style={{
                            width: '40px',
                            height: '40px',
                            borderRadius: '10px',
                            background: '#e6f0ff',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            marginRight: '12px'
                          }}>
                            <i className="fas fa-gavel" style={{ color: '#667eea' }}></i>
                          </div>
                          <span className="fw-semibold" style={{ color: '#2d3748' }}>
                            {bid.auctionTitle}
                          </span>
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <span className="fs-5 fw-bold" style={{ color: '#667eea' }}>
                          {'₹' + Number(bid.amount).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </span>
                      </td>
                      <td className="py-4 px-4 text-muted">
                        <i className="far fa-calendar me-2"></i>
                        {bid.auctionEndTime ? new Date(bid.auctionEndTime).toLocaleString('en-IN', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit', hour12: true }) : 'N/A'}
                      </td>
                      <td className="py-4 px-4">
                        {(isBackendWinner || isUserHighest) ? (
                          <Badge style={{ padding: '8px 16px', borderRadius: '20px', fontSize: '13px', background: 'linear-gradient(135deg, #48bb78 0%, #38a169 100%)', color: '#fff', fontWeight: '700', border: 'none' }}>Won</Badge>
                        ) : bid.isWinning ? (
                          <Badge style={{ padding: '8px 16px', borderRadius: '20px', fontSize: '13px', background: 'linear-gradient(135deg, #fbbf24 0%, #f59e42 100%)', color: '#222', fontWeight: '700', border: 'none' }}>Winning</Badge>
                        ) : (
                          <Badge style={{ padding: '8px 16px', borderRadius: '20px', fontSize: '13px',  background: 'linear-gradient(135deg, #dadada 0%, #dadada 100%)', color: '#222', fontWeight: '700', border: 'none' }}>Outbid</Badge>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </Table>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyBids;