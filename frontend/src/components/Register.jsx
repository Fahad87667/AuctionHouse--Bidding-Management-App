import React, { useState } from 'react';
import { Card, Form, Button, Alert, Container, Row, Col } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { toast } from 'react-toastify';

const Register = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [username, setUsername] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!username.trim()) {
      setError('Username is required');
      toast.error('Username is required');
      return;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      toast.error('Passwords do not match');
      return;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters long');
      toast.error('Password must be at least 6 characters long');
      return;
    }
    setLoading(true);
    const result = await register(username, email, password, confirmPassword);
    if (result.success) {
      toast.success(`Registration successful! Welcome ${username}`);
      navigate('/');
    } else {
      setError(result.error);
      toast.error(result.error || 'Registration failed');
    }
    setLoading(false);
  };

  return (
    <Container className="py-5" style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)' }}>
      <Row className="justify-content-center align-items-center" style={{ minHeight: '85vh' }}>
        <Col md={8} lg={6} xl={5}>
          <Card className="shadow-lg border-0" style={{ borderRadius: '20px', overflow: 'hidden' }}>
            <div style={{ height: '8px', background: 'linear-gradient(90deg, #667eea 0%, #764ba2 100%)' }}></div>
            <Card.Body className="p-5">
              <div className="text-center mb-4">
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
                    <i className="fas fa-user-plus text-white" style={{ fontSize: '32px' }}></i>
                  </div>
                </div>
                <h2 className="fw-bold mb-2" style={{ color: '#2d3748' }}>Create Account</h2>
                <p className="text-muted">Join our auction community today!</p>
              </div>

              {error && (
                <Alert 
                  variant="danger" 
                  dismissible 
                  onClose={() => setError('')}
                  style={{ borderRadius: '12px', border: 'none', backgroundColor: '#fee', color: '#c53030' }}
                >
                  <i className="fas fa-exclamation-circle me-2"></i>
                  {error}
                </Alert>
              )}

              <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-4">
                  <Form.Label className="fw-semibold text-secondary mb-2">
                    <i className="fas fa-user me-2"></i>Username
                  </Form.Label>
                  <Form.Control
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Choose a username"
                    required
                    style={{ 
                      borderRadius: '12px', 
                      padding: '12px 16px',
                      border: '1.5px solid #e2e8f0',
                      fontSize: '16px',
                      transition: 'all 0.3s ease'
                    }}
                    className="shadow-sm"
                  />
                  <Form.Text className="text-muted mt-1" style={{ fontSize: '13px' }}>
                    This will be your public display name
                  </Form.Text>
                </Form.Group>

                <Form.Group className="mb-4">
                  <Form.Label className="fw-semibold text-secondary mb-2">
                    <i className="fas fa-envelope me-2"></i>Email Address
                  </Form.Label>
                  <Form.Control
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    required
                    style={{ 
                      borderRadius: '12px', 
                      padding: '12px 16px',
                      border: '1.5px solid #e2e8f0',
                      fontSize: '16px',
                      transition: 'all 0.3s ease'
                    }}
                    className="shadow-sm"
                  />
                  <Form.Text className="text-muted mt-1" style={{ fontSize: '13px' }}>
                    We'll use this for notifications
                  </Form.Text>
                </Form.Group>

                <Form.Group className="mb-4">
                  <Form.Label className="fw-semibold text-secondary mb-2">
                    <i className="fas fa-lock me-2"></i>Password
                  </Form.Label>
                  <Form.Control
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Create a password"
                    required
                    style={{ 
                      borderRadius: '12px', 
                      padding: '12px 16px',
                      border: '1.5px solid #e2e8f0',
                      fontSize: '16px',
                      transition: 'all 0.3s ease'
                    }}
                    className="shadow-sm"
                  />
                  <Form.Text className="text-muted mt-1" style={{ fontSize: '13px' }}>
                    Minimum 6 characters required
                  </Form.Text>
                </Form.Group>

                <Form.Group className="mb-4">
                  <Form.Label className="fw-semibold text-secondary mb-2">
                    <i className="fas fa-lock me-2"></i>Confirm Password
                  </Form.Label>
                  <Form.Control
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Confirm your password"
                    required
                    style={{ 
                      borderRadius: '12px', 
                      padding: '12px 16px',
                      border: '1.5px solid #e2e8f0',
                      fontSize: '16px',
                      transition: 'all 0.3s ease'
                    }}
                    className="shadow-sm"
                  />
                </Form.Group>

                <Button
                  type="submit"
                  size="lg"
                  className="w-100 mb-4 fw-semibold border-0"
                  disabled={loading}
                  style={{ 
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    borderRadius: '12px',
                    padding: '14px',
                    fontSize: '16px',
                    transition: 'transform 0.2s ease',
                    boxShadow: '0 4px 15px rgba(102, 126, 234, 0.3)'
                  }}
                  onMouseOver={(e) => e.target.style.transform = 'translateY(-2px)'}
                  onMouseOut={(e) => e.target.style.transform = 'translateY(0)'}
                >
                  {loading ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                      Creating Account...
                    </>
                  ) : (
                    'Create Account'
                  )}
                </Button>
              </Form>

              <div className="text-center">
                <p className="mb-0 text-muted">
                  Already have an account?{' '}
                  <Link 
                    to="/login" 
                    className="text-decoration-none fw-semibold"
                    style={{ color: '#667eea' }}
                  >
                    Sign in here
                  </Link>
                </p>
              </div>
            </Card.Body>
          </Card>

          {/* Admin Info Card */}
          {/* <Card className="mt-4 border-0" style={{ 
            borderRadius: '16px', 
            background: 'rgba(255, 255, 255, 0.9)',
            backdropFilter: 'blur(10px)'
          }}>
            <Card.Body className="p-4">
              <div className="text-center">
                <div className="mb-3">
                  <div style={{ 
                    width: '48px', 
                    height: '48px', 
                    background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
                    borderRadius: '12px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto'
                  }}>
                    <i className="fas fa-info text-white"></i>
                  </div>
                </div>
                <h6 className="fw-bold mb-2" style={{ color: '#2d3748' }}>
                  Admin Access
                </h6>
                <p className="mb-3 text-muted small">
                  Need admin access? Use these credentials:
                </p>
                <div style={{ 
                  backgroundColor: '#f7fafc', 
                  padding: '12px', 
                  borderRadius: '10px',
                  border: '1px dashed #cbd5e0'
                }}>
                  <code style={{ color: '#5a67d8' }}>
                    Email: admin@auction.com<br/>
                    Password: Admin123!
                  </code>
                </div>
                <small className="text-muted d-block mt-3">
                  <Link 
                    to="/login" 
                    className="text-decoration-none"
                    style={{ color: '#667eea' }}
                  >
                    Go to login page →
                  </Link>
                </small>
              </div>
            </Card.Body>
          </Card> */}
        </Col>
      </Row>
    </Container>
  );
};

export default Register;