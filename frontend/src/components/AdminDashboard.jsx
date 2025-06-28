import React, { useState, useEffect } from 'react';
import { Card, Table, Button, Modal, Form, Alert, Row, Col, Badge, Tabs, Tab } from 'react-bootstrap';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';

const AdminDashboard = () => {
  const { user } = useAuth();
  const [auctions, setAuctions] = useState([]);
  const [bids, setBids] = useState([]);
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedAuction, setSelectedAuction] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    startingPrice: '',
    imageUrl: '',
    endTime: ''
  });
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [activeTab, setActiveTab] = useState('summary');
  const userId = window.localStorage.getItem('userId');

  useEffect(() => {
    fetchData();
    fetchPayments();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [auctionsResponse, bidsResponse] = await Promise.all([
        axios.get('http://localhost:5100/api/auctionitems'),
        axios.get('http://localhost:5100/api/bids')
      ]);
      setAuctions(auctionsResponse.data);
      setBids(bidsResponse.data);
    } catch (error) {
      setError('Failed to load data');
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchPayments = async () => {
    try {
      const res = await axios.get('http://localhost:5100/api/payments/logs', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setPayments(res.data);
    } catch (err) {
      // ignore for now
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImageFile(file);
    if (file) {
      setImagePreview(URL.createObjectURL(file));
    } else {
      setImagePreview(null);
    }
  };

  const handleAddAuction = async (e) => {
    e.preventDefault();
    
    // Validate form data
    if (!formData.title.trim()) {
      setError('Title is required');
      return;
    }
    
    if (!formData.description.trim()) {
      setError('Description is required');
      return;
    }
    
    if (!formData.startingPrice || parseFloat(formData.startingPrice) <= 0) {
      setError('Starting price must be greater than 0');
      return;
    }
    
    if (!formData.endTime) {
      setError('End time is required');
      return;
    }
    
    const endDateLocal = new Date(formData.endTime);
    const endDateUTC = new Date(endDateLocal.getTime() - endDateLocal.getTimezoneOffset() * 60000);
    if (endDateUTC <= new Date()) {
      setError('End time must be in the future');
      return;
    }
    
    let imageUrl = formData.imageUrl?.trim() || '';
    if (imageFile) {
      const uploadData = new FormData();
      uploadData.append('image', imageFile);
      try {
        const uploadRes = await axios.post('http://localhost:5100/api/auctionitems/upload-image', uploadData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        imageUrl = uploadRes.data.imageUrl;
      } catch (uploadErr) {
        setError(uploadErr.response?.data || 'Image upload failed');
        return;
      }
    }
    
    try {
      // Format the data properly for the backend
      const auctionData = {
        title: formData.title.trim(),
        description: formData.description.trim(),
        startingPrice: parseFloat(formData.startingPrice),
        imageUrl,
        endTime: endDateUTC.toISOString()
      };

      await axios.post('http://localhost:5100/api/auctionitems', auctionData);
      handleCloseAddModal();
      fetchData();
    } catch (error) {
      console.error('Error adding auction:', error.response?.data || error.message);
      setError(error.response?.data || 'Failed to add auction');
    }
    setImageFile(null);
    setImagePreview(null);
  };

  const handleEditAuction = async (e) => {
    e.preventDefault();
    
    // Validate form data
    if (!formData.title.trim()) {
      setError('Title is required');
      return;
    }
    
    if (!formData.description.trim()) {
      setError('Description is required');
      return;
    }
    
    if (!formData.startingPrice || parseFloat(formData.startingPrice) <= 0) {
      setError('Starting price must be greater than 0');
      return;
    }
    
    if (!formData.endTime) {
      setError('End time is required');
      return;
    }
    
    const endDateLocal = new Date(formData.endTime);
    const endDateUTC = new Date(endDateLocal.getTime() - endDateLocal.getTimezoneOffset() * 60000);
    if (endDateUTC <= new Date()) {
      setError('End time must be in the future');
      return;
    }
    
    let imageUrl = formData.imageUrl?.trim() || '';
    if (imageFile) {
      const uploadData = new FormData();
      uploadData.append('image', imageFile);
      try {
        const uploadRes = await axios.post('http://localhost:5100/api/auctionitems/upload-image', uploadData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        imageUrl = uploadRes.data.imageUrl;
      } catch (uploadErr) {
        setError(uploadErr.response?.data || 'Image upload failed');
        return;
      }
    }
    
    try {
      // Format the data properly for the backend
      const auctionData = {
        id: selectedAuction.id,
        title: formData.title.trim(),
        description: formData.description.trim(),
        startingPrice: parseFloat(formData.startingPrice),
        imageUrl,
        endTime: endDateUTC.toISOString()
      };

      await axios.put(`http://localhost:5100/api/auctionitems/${selectedAuction.id}`, auctionData);
      handleCloseEditModal();
      fetchData();
    } catch (error) {
      console.error('Error updating auction:', error.response?.data || error.message);
      setError(error.response?.data || 'Failed to update auction');
    }
    setImageFile(null);
    setImagePreview(null);
  };

  const handleDeleteAuction = async (id) => {
    if (window.confirm('Are you sure you want to delete this auction?')) {
      try {
        await axios.delete(`http://localhost:5100/api/auctionitems/${id}`);
        fetchData();
      } catch (error) {
        setError('Failed to delete auction');
      }
    }
  };

  const handleCloseAddModal = () => {
    setShowAddModal(false);
    setError('');
    setFormData({ title: '', description: '', startingPrice: '', imageUrl: '', endTime: '' });
    setImageFile(null);
    setImagePreview(null);
  };

  const handleCloseEditModal = () => {
    setShowEditModal(false);
    setSelectedAuction(null);
    setError('');
    setFormData({ title: '', description: '', startingPrice: '', imageUrl: '', endTime: '' });
    setImageFile(null);
    setImagePreview(null);
  };

  const openEditModal = (auction) => {
    setSelectedAuction(auction);
    
    // Format the date for datetime-local input (YYYY-MM-DDTHH:MM)
    const endDateLocal = new Date(auction.endTime);
    const endDateUTC = new Date(endDateLocal.getTime() - endDateLocal.getTimezoneOffset() * 60000);
    const formattedDate = endDateUTC.toISOString().slice(0, 16); // Remove seconds and timezone
    
    setFormData({
      title: auction.title,
      description: auction.description,
      startingPrice: auction.startingPrice.toString(),
      imageUrl: auction.imageUrl || '',
      endTime: formattedDate
    });
    setShowEditModal(true);
  };

  const formatDate = (dateString) => {
    const d = new Date(dateString);
    return d.toLocaleString('en-IN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  };

  const getStatusBadge = (auction) => {
    const now = new Date();
    const end = new Date(auction.endTime);
    const diff = end - now;
    const isWinner = auction.isCompleted && auction.winnerUserId && userId && auction.winnerUserId === userId;
    if (auction.isCompleted || auction.isPaid || diff <= 0) {
      return <Badge style={{ 
        background: '#ff4d4f', // Strong red for ended/won
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

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
        <div style={{ textAlign: 'center' }}>
          <div className="spinner-border text-primary" role="status" style={{ width: '3rem', height: '3rem' }}>
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-3 text-muted">Loading admin dashboard...</p>
        </div>
      </div>
    );
  }

  // Use same hardcoded admin check logic
  const isAdmin = user && (
    user.email === 'admin@auction.com' || 
    user.role === 'Admin' || 
    (user.roles && user.roles.includes('Admin'))
  );

  if (!isAdmin) {
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
          <i className="fas fa-shield-alt me-2"></i>
          Access denied. Admin privileges required.
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
            background: '#f093fb',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto'
          }}>
            <i className="fas fa-crown text-white" style={{ fontSize: '32px' }}></i>
          </div>
        </div>
        <h1 className="display-4 fw-bold mb-3" style={{ color: '#2d3748' }}>Admin Dashboard</h1>
        <p className="text-muted fs-5">Manage your auctions and monitor bidding activity</p>
      </div>

      <div className="d-flex justify-content-between align-items-center mb-4">
        <div className="d-flex align-items-center">
          <Badge style={{ 
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            padding: '10px 20px',
            borderRadius: '25px',
            fontSize: '16px',
            marginRight: '12px'
          }}>
            <i className="fas fa-gavel me-2"></i>
            {auctions.length} Total Auctions
          </Badge>
          <Badge style={{ 
            background: 'linear-gradient(135deg, #4299e1 0%, #3182ce 100%)',
            padding: '10px 20px',
            borderRadius: '25px',
            fontSize: '16px'
          }}>
            <i className="fas fa-hand-paper me-2"></i>
            {bids.length} Total Bids
          </Badge>
        </div>
        <Button 
          onClick={() => setShowAddModal(true)}
          style={{
            background: 'linear-gradient(135deg, #48bb78 0%, #38a169 100%)',
            border: 'none',
            borderRadius: '25px',
            padding: '12px 24px',
            fontWeight: '600',
            transition: 'transform 0.2s ease',
            boxShadow: '0 4px 15px rgba(72, 187, 120, 0.3)'
          }}
          onMouseOver={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
          onMouseOut={(e) => e.currentTarget.style.transform = 'translateY(0)'}
        >
          <i className="fas fa-plus-circle me-2"></i>
          Add New Auction
        </Button>
      </div>

      {error && (
        <Alert 
          variant="danger" 
          dismissible 
          onClose={() => setError('')}
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

      <Tabs
        id="admin-dashboard-tabs"
        activeKey={activeTab}
        onSelect={setActiveTab}
        className="mb-4"
        style={{
          borderBottom: 'none'
        }}
      >
        <Tab 
          eventKey="summary" 
          title={
            <span style={{ 
              padding: '10px 20px',
              borderRadius: '25px',
              background: activeTab === 'summary' ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' : 'transparent',
              color: activeTab === 'summary' ? 'white' : '#667eea',
              fontWeight: '600',
              display: 'inline-block'
            }}>
              <i className="fas fa-list me-2"></i>
              Auction Items
            </span>
          }
        >
          <Card className="border-0 shadow-sm" style={{ borderRadius: '20px' }}>
            <Card.Body className="p-0">
              <div className="table-responsive">
                <Table hover className="mb-0">
                  <thead style={{ backgroundColor: '#f8fafc' }}>
                    <tr>
                      <th className="border-0 py-3 px-4 fw-semibold text-secondary">Title</th>
                      <th className="border-0 py-3 px-4 fw-semibold text-secondary">Current Price</th>
                      <th className="border-0 py-3 px-4 fw-semibold text-secondary">Bids</th>
                      <th className="border-0 py-3 px-4 fw-semibold text-secondary">End Time</th>
                      <th className="border-0 py-3 px-4 fw-semibold text-secondary">Winner</th>
                      <th className="border-0 py-3 px-4 fw-semibold text-secondary">Status</th>
                      <th className="border-0 py-3 px-4 fw-semibold text-secondary">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {auctions.map((auction) => (
                      <tr 
                        key={auction.id}
                        style={{ transition: 'background 0.2s ease' }}
                        onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#f8fafc'}
                        onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                      >
                        <td className="py-3 px-4">
                          <div className="d-flex align-items-center">
                            <img
                              src={auction.imageUrl ? (auction.imageUrl.startsWith('http') ? auction.imageUrl : `http://localhost:5100${auction.imageUrl}`) : '/images/no-image.png'}
                              alt={auction.title}
                              style={{
                                width: '40px',
                                height: '40px',
                                objectFit: 'cover',
                                borderRadius: '10px',
                                background: '#f7fafc',
                                border: '1px solid #e2e8f0',
                                marginRight: '12px'
                              }}
                              onError={e => { e.target.onerror = null; e.target.src = '/images/no-image.png'; }}
                            />
                            <span className="fw-semibold">{auction.title}</span>
                          </div>
                        </td>
                        <td className="py-3 px-4">
                        <span className="fw-bold" style={{ color: '#667eea' }}>
                            {auction.highestBid !== null && auction.highestBid !== undefined
                              ? '₹' + Number(auction.highestBid).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
                              : (auction.startingPrice !== null && auction.startingPrice !== undefined
                                  ? '₹' + Number(auction.startingPrice).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
                                  : '0.00')}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <span className="badge bg-light text-dark px-3 py-2" style={{ borderRadius: '15px' }}>
                            {auction.bidCount} bids
                          </span>
                        </td>
                        <td className="py-3 px-4 text-muted">
                          <small>
                            <i className="far fa-calendar me-1"></i>
                            {formatDate(auction.endTime)}
                          </small>
                        </td>
                        <td className="py-3 px-4">
                          {(auction.isCompleted || new Date(auction.endTime) <= new Date())
                            ? (
                                auction.winnerUserName
                                  || (auction.bids && auction.bids.length > 0
                                      ? (auction.bids[0].UserName || auction.bids[0].userName || auction.bids[0].userEmail || auction.bids[0].UserEmail || '-')
                                      : '-')
                            )
                            : '-'}
                        </td>
                        <td className="py-3 px-4">{getStatusBadge(auction)}</td>
                        <td className="py-3 px-4">
                          <Button
                            size="sm"
                            className="me-2"
                            onClick={() => openEditModal(auction)}
                            style={{
                              background: 'linear-gradient(135deg, #63b3ed 0%, #4299e1 100%)',
                              color: 'white',
                              border: 'none',
                              borderRadius: '8px',
                              padding: '6px 12px',
                              fontWeight: '600',
                              boxShadow: '0 2px 8px rgba(66, 153, 225, 0.08)',
                              transition: 'all 0.2s ease'
                            }}
                            onMouseOver={(e) => {
                              e.currentTarget.style.background = 'linear-gradient(135deg, #4299e1 0%, #3182ce 100%)';
                            }}
                            onMouseOut={(e) => {
                              e.currentTarget.style.background = 'linear-gradient(135deg, #63b3ed 0%, #4299e1 100%)';
                            }}
                          >
                            <i className="fas fa-edit me-1"></i>
                            Edit
                          </Button>
                          <Button
                            size="sm"
                            onClick={() => handleDeleteAuction(auction.id)}
                            style={{
                              background: 'linear-gradient(135deg, #feb2b2 0%, #f56565 100%)',
                              color: 'white',
                              border: 'none',
                              borderRadius: '8px',
                              padding: '6px 12px',
                              fontWeight: '600',
                              boxShadow: '0 2px 8px rgba(245, 101, 101, 0.08)',
                              transition: 'all 0.2s ease'
                            }}
                            onMouseOver={(e) => {
                              e.currentTarget.style.background = 'linear-gradient(135deg, #f56565 0%, #c53030 100%)';
                            }}
                            onMouseOut={(e) => {
                              e.currentTarget.style.background = 'linear-gradient(135deg, #feb2b2 0%, #f56565 100%)';
                            }}
                          >
                            <i className="fas fa-trash me-1"></i>
                            Delete
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </div>
            </Card.Body>
          </Card>
        </Tab>
        
        <Tab 
          eventKey="bids" 
          title={
            <span style={{ 
              padding: '10px 20px',
              borderRadius: '25px',
              background: activeTab === 'bids' ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' : 'transparent',
              color: activeTab === 'bids' ? 'white' : '#667eea',
              fontWeight: '600',
              display: 'inline-block'
            }}>
              <i className="fas fa-history me-2"></i>
              Recent Bids
            </span>
          }
        >
          <Card className="border-0 shadow-sm" style={{ borderRadius: '20px', height: '600px' }}>
            <Card.Header 
              className="bg-white border-0 p-4" 
              style={{ 
                borderBottom: '1px solid #f0f4f8',
                borderRadius: '20px 20px 0 0'
              }}
            >
              <div className="d-flex justify-content-between align-items-center">
                <h5 className="mb-0 fw-bold" style={{ color: '#2d3748' }}>
                  <i className="fas fa-history me-2" style={{ color: '#4299e1' }}></i>
                  Recent Bidding Activity
                </h5>
                <Badge style={{ 
                  background: 'linear-gradient(135deg, #4299e1 0%, #3182ce 100%)',
                  padding: '8px 16px',
                  borderRadius: '20px',
                  fontSize: '14px'
                }}>
                  {bids.length} Total Bids
                </Badge>
              </div>
            </Card.Header>
            <Card.Body style={{ 
              maxHeight: '500px', 
              overflowY: 'auto', 
              padding: '0',
              scrollbarWidth: 'thin',
              scrollbarColor: '#667eea #f0f4f8'
            }}>
              <style>
                {`
                  .card-body::-webkit-scrollbar {
                    width: 8px;
                  }
                  .card-body::-webkit-scrollbar-track {
                    background: #f0f4f8;
                    border-radius: 10px;
                  }
                  .card-body::-webkit-scrollbar-thumb {
                    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                    border-radius: 10px;
                  }
                  .card-body::-webkit-scrollbar-thumb:hover {
                    background: linear-gradient(135deg, #764ba2 0%, #667eea 100%);
                  }
                `}
              </style>
              {bids.length === 0 ? (
                <div className="text-center py-5">
                  <i className="fas fa-gavel text-muted mb-3" style={{ fontSize: '3rem' }}></i>
                  <p className="text-muted">No bids placed yet</p>
                </div>
              ) : (
                bids.slice(0, 50).map((bid, index) => (
                  <div 
                    key={bid.id} 
                    className="px-4 py-3"
                    style={{ 
                      borderBottom: index < bids.length - 1 ? '1px solid #f0f4f8' : 'none',
                      transition: 'background 0.2s ease'
                    }}
                    onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#f8fafc'}
                    onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                  >
                    <div className="d-flex justify-content-between align-items-start">
                      <div className="d-flex align-items-center">
                        <div style={{
                          width: '40px',
                          height: '40px',
                          borderRadius: '50%',
                          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          marginRight: '12px'
                        }}>
                          <i className="fas fa-user text-white" style={{ fontSize: '16px' }}></i>
                        </div>
                        <div>
                          <div className="d-flex align-items-center">
                            <strong style={{ color: '#2d3748', fontSize: '16px' }}>
                              {bid.amount !== null && bid.amount !== undefined
                                ? '₹' + bid.amount.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
                                : '0.00'}
                            </strong>
                            <span className="badge ms-2" style={{ 
                              background: '#e6f0ff',
                              color: '#667eea',
                              fontSize: '11px',
                              padding: '4px 8px',
                              borderRadius: '12px'
                            }}>
                              BID
                            </span>
                          </div>
                          <small className="text-muted d-block">
                            {bid.userName || bid.userEmail || 'Anonymous User'}
                          </small>
                        </div>
                      </div>
                      <div className="text-end">
                        <small className="text-muted d-block">
                          <i className="fas fa-gavel me-1"></i>
                          {bid.auctionTitle}
                        </small>
                        <small className="text-muted">
                          <i className="far fa-clock me-1"></i>
                          {bid.timestamp ? new Date(bid.timestamp).toLocaleString() : 'N/A'}
                        </small>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </Card.Body>
          </Card>
        </Tab>

        <Tab 
          eventKey="payments" 
          title={
            <span style={{ 
              padding: '10px 20px',
              borderRadius: '25px',
              background: activeTab === 'payments' ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' : 'transparent',
              color: activeTab === 'payments' ? 'white' : '#667eea',
              fontWeight: '600',
              display: 'inline-block'
            }}>
              <i className="fas fa-receipt me-2"></i>
              Payments
            </span>
          }
        >
          <Card className="border-0 shadow-sm" style={{ borderRadius: '20px' }}>
            <Card.Body className="p-0">
              <div className="table-responsive">
                <Table hover className="mb-0">
                  <thead style={{ backgroundColor: '#f8fafc' }}>
                    <tr>
                      <th className="border-0 py-3 px-4 fw-semibold text-secondary">AuctionId</th>
                      <th className="border-0 py-3 px-4 fw-semibold text-secondary">UserId</th>
                      <th className="border-0 py-3 px-4 fw-semibold text-secondary">Amount</th>
                      <th className="border-0 py-3 px-4 fw-semibold text-secondary">Status</th>
                      <th className="border-0 py-3 px-4 fw-semibold text-secondary">TransactionId</th>
                      <th className="border-0 py-3 px-4 fw-semibold text-secondary">Timestamp</th>
                      <th className="border-0 py-3 px-4 fw-semibold text-secondary">Gateway</th>
                    </tr>
                  </thead>
                  <tbody>
                    {payments.length === 0 ? (
                      <tr><td colSpan="7" className="text-center py-4">No payments yet</td></tr>
                    ) : payments.map((p, idx) => (
                      <tr key={p.id || idx}>
                        <td className="py-3 px-4">{p.auctionId}</td>
                        <td className="py-3 px-4">{p.userId}</td>
                        <td className="py-3 px-4">₹{Number(p.amount).toLocaleString('en-IN', { minimumFractionDigits: 2 })}</td>
                        <td className="py-3 px-4">{p.status}</td>
                        <td className="py-3 px-4">{p.transactionId}</td>
                        <td className="py-3 px-4">{new Date(p.timestamp).toLocaleString('en-IN')}</td>
                        <td className="py-3 px-4">{p.gateway}</td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </div>
            </Card.Body>
          </Card>
        </Tab>
      </Tabs>

      {/* Add Auction Modal */}
      <Modal show={showAddModal} onHide={handleCloseAddModal} size="lg">
        <Modal.Header 
          closeButton 
          style={{ 
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            color: 'white',
            border: 'none'
          }}
        >
          <Modal.Title>
            <i className="fas fa-plus-circle me-2"></i>
            Add New Auction
          </Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleAddAuction}>
          <Modal.Body className="p-4">
            <Form.Group className="mb-4">
              <Form.Label className="fw-semibold text-secondary">
                <i className="fas fa-heading me-2"></i>Title
              </Form.Label>
              <Form.Control
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                required
                style={{ 
                  borderRadius: '10px', 
                  border: '1.5px solid #e2e8f0',
                  padding: '12px'
                }}
              />
            </Form.Group>
            <Form.Group className="mb-4">
              <Form.Label className="fw-semibold text-secondary">
                <i className="fas fa-align-left me-2"></i>Description
              </Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                required
                style={{ 
                  borderRadius: '10px', 
                  border: '1.5px solid #e2e8f0',
                  padding: '12px'
                }}
              />
            </Form.Group>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-4">
                  <Form.Label className="fw-semibold text-secondary">
                    <i className="fas fa-indian-rupee-sign me-2"></i>Starting Price
                  </Form.Label>
                  <Form.Control
                    type="number"
                    min="0"
                    step="0.01"
                    value={formData.startingPrice}
                    onChange={(e) => setFormData({ ...formData, startingPrice: e.target.value })}
                    required
                    style={{ 
                      borderRadius: '10px', 
                      border: '1.5px solid #e2e8f0',
                      padding: '12px'
                    }}
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-4">
                  <Form.Label className="fw-semibold text-secondary">
                    <i className="fas fa-calendar-alt me-2"></i>End Time
                  </Form.Label>
                  <Form.Control
                    type="datetime-local"
                    value={formData.endTime}
                    onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
                    required
                    style={{ 
                      borderRadius: '10px', 
                      border: '1.5px solid #e2e8f0',
                      padding: '12px'
                    }}
                  />
                </Form.Group>
              </Col>
            </Row>
            <Form.Group className="mb-4">
              <Form.Label className="fw-semibold text-secondary">
                <i className="fas fa-image me-2"></i>Image (Required)
              </Form.Label>
              <Form.Control
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                required
                style={{ borderRadius: '10px', border: '1.5px solid #e2e8f0', padding: '12px' }}
              />
              {imagePreview && (
                <div className="mt-2 text-center">
                  <img src={imagePreview} alt="Preview" style={{ maxWidth: '100%', maxHeight: '200px', borderRadius: '10px', border: '1px solid #e2e8f0' }} />
                </div>
              )}
              {!imagePreview && formData.imageUrl && (
                <div className="mt-2 text-center">
                  <img src={formData.imageUrl} alt="Current" style={{ maxWidth: '100%', maxHeight: '200px', borderRadius: '10px', border: '1px solid #e2e8f0' }} />
                </div>
              )}
            </Form.Group>
          </Modal.Body>
          <Modal.Footer style={{ borderTop: '1px solid #f0f4f8' }}>
            <Button 
              variant="secondary" 
              onClick={handleCloseAddModal}
              style={{
                borderRadius: '10px',
                padding: '10px 20px',
                fontWeight: '600'
              }}
            >
              Cancel
            </Button>
            <Button 
              type="submit"
              style={{
                background: 'linear-gradient(135deg, #48bb78 0%, #38a169 100%)',
                border: 'none',
                borderRadius: '10px',
                padding: '10px 20px',
                fontWeight: '600'
              }}
            >
              <i className="fas fa-plus me-2"></i>
              Add Auction
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>

      {/* Edit Auction Modal - same as Add Modal but with different title and submit button */}
      <Modal show={showEditModal} onHide={handleCloseEditModal} size="lg">
        <Modal.Header 
          closeButton 
          style={{ 
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            color: 'white',
            border: 'none'
          }}
        >
          <Modal.Title>
            <i className="fas fa-edit me-2"></i>
            Edit Auction
          </Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleEditAuction}>
          <Modal.Body className="p-4">
            <Form.Group className="mb-4">
              <Form.Label className="fw-semibold text-secondary">
                <i className="fas fa-heading me-2"></i>Title
              </Form.Label>
              <Form.Control
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                required
                style={{ 
                  borderRadius: '10px', 
                  border: '1.5px solid #e2e8f0',
                  padding: '12px'
                }}
              />
            </Form.Group>
            <Form.Group className="mb-4">
              <Form.Label className="fw-semibold text-secondary">
                <i className="fas fa-align-left me-2"></i>Description
              </Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                required
                style={{ 
                  borderRadius: '10px', 
                  border: '1.5px solid #e2e8f0',
                  padding: '12px'
                }}
              />
            </Form.Group>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-4">
                  <Form.Label className="fw-semibold text-secondary">
                    <i className="fas fa-indian-rupee-sign me-2"></i>Starting Price
                  </Form.Label>
                  <Form.Control
                    type="number"
                    min="0"
                    step="0.01"
                    value={formData.startingPrice}
                    onChange={(e) => setFormData({ ...formData, startingPrice: e.target.value })}
                    required
                    style={{ 
                      borderRadius: '10px', 
                      border: '1.5px solid #e2e8f0',
                      padding: '12px'
                    }}
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-4">
                  <Form.Label className="fw-semibold text-secondary">
                    <i className="fas fa-calendar-alt me-2"></i>End Time
                  </Form.Label>
                  <Form.Control
                    type="datetime-local"
                    value={formData.endTime}
                    onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
                    required
                    style={{ 
                      borderRadius: '10px', 
                      border: '1.5px solid #e2e8f0',
                      padding: '12px'
                    }}
                  />
                </Form.Group>
              </Col>
            </Row>
            <Form.Group className="mb-4">
              <Form.Label className="fw-semibold text-secondary">
                <i className="fas fa-image me-2"></i>Image (Required)
              </Form.Label>
              <Form.Control
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                required
                style={{ borderRadius: '10px', border: '1.5px solid #e2e8f0', padding: '12px' }}
              />
              {imagePreview && (
                <div className="mt-2 text-center">
                  <img src={imagePreview} alt="Preview" style={{ maxWidth: '100%', maxHeight: '200px', borderRadius: '10px', border: '1px solid #e2e8f0' }} />
                </div>
              )}
              {!imagePreview && formData.imageUrl && (
                <div className="mt-2 text-center">
                  <img src={formData.imageUrl} alt="Current" style={{ maxWidth: '100%', maxHeight: '200px', borderRadius: '10px', border: '1px solid #e2e8f0' }} />
                </div>
              )}
            </Form.Group>
          </Modal.Body>
          <Modal.Footer style={{ borderTop: '1px solid #f0f4f8' }}>
            <Button 
              variant="secondary" 
              onClick={handleCloseEditModal}
              style={{
                borderRadius: '10px',
                padding: '10px 20px',
                fontWeight: '600'
              }}
            >
              Cancel
            </Button>
            <Button 
              type="submit"
              style={{
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                border: 'none',
                borderRadius: '10px',
                padding: '10px 20px',
                fontWeight: '600'
              }}
            >
              <i className="fas fa-save me-2"></i>
              Update Auction
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </div>
  );
};

export default AdminDashboard;
       
       