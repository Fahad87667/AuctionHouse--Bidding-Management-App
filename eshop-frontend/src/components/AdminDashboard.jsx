import React, { useState, useEffect } from 'react';
import { Card, Table, Button, Modal, Form, Alert, Row, Col, Badge, Tabs, Tab } from 'react-bootstrap';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';

const AdminDashboard = () => {
  const { user } = useAuth();
  const [auctions, setAuctions] = useState([]);
  const [bids, setBids] = useState([]);
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
  const [activeTab, setActiveTab] = useState('summary');

  useEffect(() => {
    fetchData();
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
    
    const endDate = new Date(formData.endTime);
    if (endDate <= new Date()) {
      setError('End time must be in the future');
      return;
    }
    
    try {
      // Format the data properly for the backend
      const auctionData = {
        title: formData.title.trim(),
        description: formData.description.trim(),
        startingPrice: parseFloat(formData.startingPrice),
        imageUrl: formData.imageUrl?.trim() || '',
        endTime: endDate.toISOString()
      };

      await axios.post('http://localhost:5100/api/auctionitems', auctionData);
      handleCloseAddModal();
      fetchData();
    } catch (error) {
      console.error('Error adding auction:', error.response?.data || error.message);
      setError(error.response?.data || 'Failed to add auction');
    }
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
    
    const endDate = new Date(formData.endTime);
    if (endDate <= new Date()) {
      setError('End time must be in the future');
      return;
    }
    
    try {
      // Format the data properly for the backend
      const auctionData = {
        id: selectedAuction.id,
        title: formData.title.trim(),
        description: formData.description.trim(),
        startingPrice: parseFloat(formData.startingPrice),
        imageUrl: formData.imageUrl?.trim() || '',
        endTime: endDate.toISOString()
      };

      await axios.put(`http://localhost:5100/api/auctionitems/${selectedAuction.id}`, auctionData);
      handleCloseEditModal();
      fetchData();
    } catch (error) {
      console.error('Error updating auction:', error.response?.data || error.message);
      setError(error.response?.data || 'Failed to update auction');
    }
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
  };

  const handleCloseEditModal = () => {
    setShowEditModal(false);
    setSelectedAuction(null);
    setError('');
    setFormData({ title: '', description: '', startingPrice: '', imageUrl: '', endTime: '' });
  };

  const openEditModal = (auction) => {
    setSelectedAuction(auction);
    
    // Format the date for datetime-local input (YYYY-MM-DDTHH:MM)
    const endDate = new Date(auction.endTime);
    const formattedDate = endDate.toISOString().slice(0, 16); // Remove seconds and timezone
    
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
    return new Date(dateString).toLocaleString();
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
    } else if (diff < 1000 * 60 * 60) {
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
            background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto',
            boxShadow: '0 4px 15px rgba(240, 147, 251, 0.3)'
          }}>
            <i className="fas fa-crown text-white" style={{ fontSize: '32px' }}></i>
          </div>
        </div>
        <h1 className="display-4 fw-bold mb-3" style={{ color: '#2d3748' }}>Admin Dashboard</h1>
        <p className="text-muted fs-5">Manage your auctions and monitor bidding activity</p>
      </div>

      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1>Admin Dashboard</h1>
        <Button variant="success" style={{ fontWeight: 600, borderRadius: 24, padding: '12px 32px', fontSize: 18 }} onClick={() => setShowAddModal(true)}>
          Add New Auction
        </Button>
      </div>

      <div className="mb-4">
        <Tabs
          id="admin-dashboard-tabs"
          activeKey={activeTab}
          onSelect={(k) => setActiveTab(k)}
          className="mb-3"
          variant="pills"
          style={{ borderRadius: '25px', overflow: 'hidden' }}
        >
          <Tab eventKey="summary" title={<span style={{ color: activeTab === 'summary' ? 'white' : '#764ba2' }}> <i className="fas fa-chart-bar me-2"></i>Summary</span>} tabClassName={activeTab === 'summary' ? 'tab-gradient' : ''}>
            <div className="d-flex gap-3 mb-4">
              <span className="badge" style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', padding: '12px 28px', borderRadius: '25px', fontSize: '18px', fontWeight: 600 }}>
                <i className="fas fa-list me-2"></i>{auctions.length} Total Auctions
              </span>
              <span className="badge" style={{ background: 'linear-gradient(135deg, #38b2ac 0%, #4299e1 100%)', padding: '12px 28px', borderRadius: '25px', fontSize: '18px', fontWeight: 600 }}>
                <i className="fas fa-gavel me-2"></i>{bids.length} Total Bids
              </span>
            </div>
          </Tab>
          <Tab eventKey="recent" title={<span style={{ color: activeTab === 'recent' ? 'white' : '#764ba2' }}> <i className="fas fa-history me-2"></i>Recent Bids</span>} tabClassName={activeTab === 'recent' ? 'tab-gradient' : ''}>
            <Card className="shadow-sm border-0 mb-4">
              <Card.Body style={{ maxHeight: '400px', overflowY: 'auto' }}>
                <Table responsive hover className="mb-0 align-middle">
                  <thead>
                    <tr>
                      <th>Amount</th>
                      <th>Auction</th>
                      <th>User</th>
                      <th>Time</th>
                    </tr>
                  </thead>
                  <tbody>
                    {bids.slice(0, 10).map((bid) => (
                      <tr key={bid.id}>
                        <td className="fw-bold" style={{ color: '#667eea' }}>${bid.amount}</td>
                        <td>{bid.auctionTitle}</td>
                        <td>{bid.userName || 'User'}</td>
                        <td>{bid.timestamp ? new Date(bid.timestamp).toLocaleString() : 'N/A'}</td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </Card.Body>
            </Card>
          </Tab>
        </Tabs>
      </div>

      <Card className="mb-4 border-0 shadow-sm">
        <Card.Header className="bg-white border-0">
          <h4 className="fw-bold mb-0" style={{ color: '#2d3748' }}>
            <i className="fas fa-table me-2" style={{ color: '#667eea' }}></i>
            Auction Items
          </h4>
        </Card.Header>
        <Card.Body className="p-0">
          <Table responsive hover className="mb-0 align-middle">
            <thead>
              <tr>
                <th>Title</th>
                <th>Current Price</th>
                <th>Bids</th>
                <th>End Time</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {auctions.map((auction) => (
                <tr key={auction.id}>
                  <td>
                    <img
                      src={auction.imageUrl || 'https://via.placeholder.com/48x48?text=No+Image'}
                      alt={auction.title}
                      style={{
                        width: '48px',
                        height: '48px',
                        objectFit: 'cover',
                        borderRadius: '12px',
                        background: '#f7fafc',
                        border: '1px solid #e2e8f0',
                        marginRight: '8px'
                      }}
                    />
                    <span className="fw-semibold ms-2">{auction.title}</span>
                  </td>
                  <td className="text-primary fw-bold">
                    ${auction.highestBid !== null && auction.highestBid !== undefined
                      ? Number(auction.highestBid).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })
                      : (auction.startingPrice !== null && auction.startingPrice !== undefined
                          ? Number(auction.startingPrice).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })
                          : '0.00')}
                  </td>
                  <td>
                    <span style={{
                      background: '#f7fafc',
                      borderRadius: '12px',
                      padding: '6px 16px',
                      fontWeight: 600,
                      fontSize: '15px',
                      color: '#4a5568'
                    }}>{auction.bidCount} bids</span>
                  </td>
                  <td>{new Date(auction.endTime).toLocaleString('en-GB')}</td>
                  <td>{getStatusBadge(auction.endTime)}</td>
                  <td>
                    <div className="d-flex gap-2">
                      <Button
                        size="sm"
                        variant="outline-primary"
                        style={{
                          background: '#f0f4ff',
                          color: '#2b6cb0',
                          border: 'none',
                          fontWeight: 600,
                          borderRadius: '8px',
                          boxShadow: '0 2px 8px rgba(102, 126, 234, 0.08)',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '6px',
                          transition: 'background 0.2s, color 0.2s'
                        }}
                        onClick={() => openEditModal(auction)}
                        onMouseOver={e => { e.currentTarget.style.background = '#e2e8f0'; e.currentTarget.style.color = '#1a365d'; }}
                        onMouseOut={e => { e.currentTarget.style.background = '#f0f4ff'; e.currentTarget.style.color = '#2b6cb0'; }}
                      >
                        <i className="fas fa-edit"></i> Edit
                      </Button>
                      <Button
                        size="sm"
                        variant="outline-danger"
                        style={{
                          background: '#fff5f5',
                          color: '#e53e3e',
                          border: 'none',
                          fontWeight: 600,
                          borderRadius: '8px',
                          boxShadow: '0 2px 8px rgba(229, 62, 62, 0.08)',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '6px',
                          transition: 'background 0.2s, color 0.2s'
                        }}
                        onClick={() => handleDeleteAuction(auction.id)}
                        onMouseOver={e => { e.currentTarget.style.background = '#fed7d7'; e.currentTarget.style.color = '#742a2a'; }}
                        onMouseOut={e => { e.currentTarget.style.background = '#fff5f5'; e.currentTarget.style.color = '#e53e3e'; }}
                      >
                        <i className="fas fa-trash"></i> Delete
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Card.Body>
      </Card>

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
                    <i className="fas fa-dollar-sign me-2"></i>Starting Price
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
                <i className="fas fa-image me-2"></i>Image URL (Optional)
              </Form.Label>
              <Form.Control
                type="url"
                value={formData.imageUrl}
                onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                style={{ 
                  borderRadius: '10px', 
                  border: '1.5px solid #e2e8f0',
                  padding: '12px'
                }}
              />
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

      {/* Edit Auction Modal */}
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
                    <i className="fas fa-dollar-sign me-2"></i>Starting Price
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
                <i className="fas fa-image me-2"></i>Image URL (Optional)
              </Form.Label>
              <Form.Control
                type="url"
                value={formData.imageUrl}
                onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                style={{ 
                  borderRadius: '10px', 
                  border: '1.5px solid #e2e8f0',
                  padding: '12px'
                }}
              />
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