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
      await axios.post('http://localhost:5100/api/payments/confirm', { AuctionId: auctionId }, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setPaySuccess(auctionId);
      fetchData();
    } catch (err) {
      setPayError(err.response?.data || 'Payment failed');
    } finally {
      setPayLoading(null);
    }
  };

  // Helper to format time left
  const formatTimeLeft = (endTime) => {
    const now = new Date();
    const end = new Date(endTime);
    const diff = end - now;
    if (diff <= 0) return 'Ended';
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
    const minutes = Math.floor((diff / (1000 * 60)) % 60);
    const seconds = Math.floor((diff / 1000) % 60);
    return `${days}d ${hours}h ${minutes}m ${seconds}s`;
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

  if (isAdmin) {
    return (
      <div className="container py-5">
        <div className="alert alert-danger" style={{ borderRadius: '12px', border: 'none', backgroundColor: '#fee', color: '#c53030' }}>
          <i className="fas fa-shield-alt me-2"></i>
          Access denied. Admins cannot view the user dashboard.
        </div>
      </div>
    );
  }

  return (
    <div className="container py-5">
      <h2 className="fw-bold mb-2" style={{ color: '#2d3748' }}>Your Dashboard</h2>
      <p className="text-muted mb-4">View all your bids and won auctions</p>
      <Tabs activeKey={activeTab} onSelect={setActiveTab} className="mb-4">
        <Tab eventKey="bids" title="Your Bids">
          <Table hover className="mb-0 align-middle">
            <thead>
              <tr>
                <th>Listing</th>
                <th>Time Left</th>
                <th>Your Bid</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {bids.length === 0 ? (
                <tr><td colSpan="5" className="text-center py-4">You have not placed any bids yet.</td></tr>
              ) : bids.map((bid, idx) => {
                const auctionEnded = bid.auctionEndTime && new Date(bid.auctionEndTime) <= new Date();
                const isUserHighest = bid.isWinning && auctionEnded;
                const isBackendWinner = (bid.isCompleted || bid.isPaid) && bid.winnerUserId && user.id && bid.winnerUserId === user.id;
                const canPay = (isBackendWinner || isUserHighest) && !bid.isPaid;
                return (
                  <tr key={bid.id || idx}>
                    <td>
                      <div className="d-flex align-items-center gap-3">
                        <img src={
                          bid.auctionImageUrl
                            ? (bid.auctionImageUrl.startsWith('http')
                                ? bid.auctionImageUrl
                                : `http://localhost:5100${bid.auctionImageUrl}`)
                            : '/images/no-image.png'
                        } alt="Auction" style={{ width: 48, height: 48, borderRadius: 8, objectFit: 'cover', border: '1px solid #eee' }} />
                        <div>
                          <div className="fw-semibold">{bid.auctionTitle}</div>
                          <div className="text-muted small" style={{ maxWidth: 200, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{bid.auctionDescription}</div>
                        </div>
                      </div>
                    </td>
                    <td>{formatTimeLeft(bid.auctionEndTime)}</td>
                    <td>₹{Number(bid.amount).toLocaleString('en-IN', { minimumFractionDigits: 2 })}</td>
                    <td>
                      {(isBackendWinner || isUserHighest) ? (
                        <Badge bg="success">Won</Badge>
                      ) : bid.isWinning ? (
                        <Badge bg="warning" text="dark">Winning</Badge>
                      ) : (
                        <Badge bg="secondary">Outbid</Badge>
                      )}
                    </td>
                    <td>
                      {canPay && (
                        <Button 
                          variant="success" 
                          size="sm" 
                          className="fw-semibold px-3"
                          onClick={() => navigate(`/payment/${bid.auctionItemId}`)}
                        >
                          Pay Now
                        </Button>
                      )}
                      {paySuccess === bid.auctionItemId && (
                        <span className="text-success ms-2">Paid!</span>
                      )}
                      {payError && payLoading === bid.auctionItemId && (
                        <div className="text-danger small mt-1">{payError}</div>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </Table>
        </Tab>
        <Tab eventKey="won" title="Won Auctions">
          <Table hover className="mb-0 align-middle">
            <thead>
              <tr>
                <th>Listing</th>
                <th>Ended On</th>
                <th>Your Bid</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {wonUnpaid.length === 0 ? (
                <tr><td colSpan="5" className="text-center py-4">No won auctions pending payment.</td></tr>
              ) : wonUnpaid.map((bid, idx) => (
                <tr key={bid.id || idx}>
                  <td>
                    <div className="d-flex align-items-center gap-3">
                      <img src={
                        bid.auctionImageUrl
                          ? (bid.auctionImageUrl.startsWith('http')
                              ? bid.auctionImageUrl
                              : `http://localhost:5100${bid.auctionImageUrl}`)
                          : '/images/no-image.png'
                      } alt="Auction" style={{ width: 48, height: 48, borderRadius: 8, objectFit: 'cover', border: '1px solid #eee' }} />
                      <div>
                        <div className="fw-semibold">{bid.auctionTitle}</div>
                        <div className="text-muted small" style={{ maxWidth: 200, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{bid.auctionDescription}</div>
                      </div>
                    </div>
                  </td>
                  <td>{formatDateTime(bid.auctionEndTime)}</td>
                  <td>₹{Number(bid.amount).toLocaleString('en-IN', { minimumFractionDigits: 2 })}</td>
                  <td><Badge bg="danger">Payment Pending</Badge></td>
                  <td>
                    <Button 
                      variant="success" 
                      size="sm" 
                      className="fw-semibold px-3"
                      onClick={() => navigate(`/payment/${bid.auctionItemId}`)}
                    >
                      Pay Now
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Tab>
        <Tab eventKey="payments" title="Payments">
          <Table hover className="mb-0">
            <thead>
              <tr>
                <th>Auction Id</th>
                <th>Amount</th>
                <th>Status</th>
                <th>Transaction Id</th>
                <th>Timestamp</th>
                <th>Gateway</th>
              </tr>
            </thead>
            <tbody>
              {payments.length === 0 ? (
                <tr><td colSpan="6" className="text-center py-4">No payments found.</td></tr>
              ) : payments.map((p, idx) => (
                <tr key={p.id || idx}>
                  <td>{p.auctionId}</td>
                  <td>₹{Number(p.amount).toLocaleString('en-IN', { minimumFractionDigits: 2 })}</td>
                  <td>{p.status}</td>
                  <td>{p.transactionId}</td>
                  <td>{formatDateTime(p.timestamp)}</td>
                  <td>{p.gateway}</td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Tab>
      </Tabs>
    </div>
  );
};

export default UserDashboard; 