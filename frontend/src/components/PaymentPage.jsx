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
      await axios.post('http://localhost:5100/api/payments/confirm', { AuctionId: auctionId }, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setPaySuccess(true);
      setShowModal(false);
      setTimeout(() => navigate('/dashboard'), 2000);
    } catch (err) {
      setPayError(err.response?.data || 'Payment failed');
    } finally {
      setPayLoading(false);
    }
  };

  if (loading) return <div className="text-center mt-5"><Spinner animation="border" /></div>;
  if (!auction) return <div className="text-center mt-5 text-danger">Auction not found.</div>;

  return (
    <div className="container py-5 d-flex justify-content-center align-items-center" style={{ minHeight: '70vh' }}>
      <Card style={{ maxWidth: 500, width: '100%', boxShadow: '0 4px 24px rgba(102,126,234,0.08)' }}>
        <Card.Body>
          <h3 className="fw-bold mb-3" style={{ color: '#2d3748' }}>Confirm Payment</h3>
          <div className="mb-3">
            <strong>Product:</strong> {auction.title}
          </div>
          <div className="mb-3">
            <strong>Description:</strong> {auction.description}
          </div>
          <div className="mb-3">
            <strong>Ends On:</strong> {new Date(auction.endTime).toLocaleString('en-IN', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit', hour12: true })}
          </div>
          <div className="mb-3">
            <strong>Winning Bid:</strong> <span className="fw-bold">₹{Number(auction.highestBid).toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
          </div>
          <div className="mb-3">
            <strong>Status:</strong> {auction.isPaid ? <Badge bg="success">Paid</Badge> : <Badge bg="warning" text="dark">Pending</Badge>}
          </div>
          {paySuccess ? (
            <div className="alert alert-success">Payment successful! Redirecting to dashboard...</div>
          ) : (
            <Button 
              variant="success" 
              className="w-100 fw-semibold" 
              size="lg" 
              disabled={payLoading || auction.isPaid || intentLoading}
              onClick={handlePay}
            >
              {payLoading || intentLoading ? <Spinner size="sm" animation="border" /> : 'Confirm Payment'}
            </Button>
          )}
          {payError && <div className="text-danger mt-3">{payError}</div>}

          {/* Mock Payment Modal */}
          <Modal show={showModal} onHide={() => setShowModal(false)} centered>
            <Modal.Header closeButton>
              <Modal.Title>Mock Payment</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <div className="mb-3">Simulate payment for <strong>{auction.title}</strong>?</div>
              <div className="mb-3">Amount: <strong>₹{Number(auction.highestBid).toLocaleString('en-IN', { minimumFractionDigits: 2 })}</strong></div>
              <Button variant="success" className="w-100" onClick={handleConfirm} disabled={payLoading}>
                {payLoading ? <Spinner size="sm" animation="border" /> : 'Pay Now'}
              </Button>
            </Modal.Body>
          </Modal>
        </Card.Body>
      </Card>
    </div>
  );
};

export default PaymentPage; 