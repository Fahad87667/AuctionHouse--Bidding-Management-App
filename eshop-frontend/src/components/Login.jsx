import React, { useState } from 'react';
import { Card, Form, Button, Alert, Container, Row, Col } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Login = () => {
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const result = await login(identifier, password);
    
    if (result.success) {
      navigate('/');
    } else {
      setError(result.error);
    }
    
    setLoading(false);
  };

  const handleAdminLogin = () => {
    setIdentifier('admin');
    setPassword('Admin123');
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
                    <i className="fas fa-lock text-white" style={{ fontSize: '32px' }}></i>
                  </div>
                </div>
                <h2 className="fw-bold mb-2" style={{ color: '#2d3748' }}>Welcome Back</h2>
                <p className="text-muted">Sign in to continue to your account</p>
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
                    <i className="fas fa-user me-2"></i>Username or Email
                  </Form.Label>
                  <Form.Control
                    type="text"
                    value={identifier}
                    onChange={(e) => setIdentifier(e.target.value)}
                    placeholder="Enter your username or email"
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

                <Form.Group className="mb-4">
                  <Form.Label className="fw-semibold text-secondary mb-2">
                    <i className="fas fa-key me-2"></i>Password
                  </Form.Label>
                  <Form.Control
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
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
                  onMouseOver={(e) => !loading && (e.target.style.transform = 'translateY(-2px)')}
                  onMouseOut={(e) => e.target.style.transform = 'translateY(0)'}
                >
                  {loading ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                      Signing in...
                    </>
                  ) : (
                    <>
                      <i className="fas fa-sign-in-alt me-2"></i>
                      Sign In
                    </>
                  )}
                </Button>
              </Form>

              <div style={{ position: 'relative', marginBottom: '24px' }}>
                <hr style={{ borderColor: '#e2e8f0' }} />
                <span style={{ 
                  position: 'absolute', 
                  top: '-12px', 
                  left: '50%', 
                  transform: 'translateX(-50%)', 
                  background: 'white', 
                  padding: '0 16px',
                  color: '#718096',
                  fontSize: '14px'
                }}>
                  or continue with
                </span>
              </div>

              <Button
                size="lg"
                className="w-100 mb-3 fw-semibold"
                onClick={handleAdminLogin}
                style={{ 
                  background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
                  border: 'none',
                  borderRadius: '12px',
                  padding: '14px',
                  fontSize: '16px',
                  transition: 'transform 0.2s ease',
                  boxShadow: '0 4px 15px rgba(240, 147, 251, 0.3)'
                }}
                onMouseOver={(e) => e.target.style.transform = 'translateY(-2px)'}
                onMouseOut={(e) => e.target.style.transform = 'translateY(0)'}
              >
                <i className="fas fa-user-shield me-2"></i>
                Quick Admin Access
              </Button>
              
              <div className="text-center mb-4">
                <div style={{ 
                  background: '#f7fafc', 
                  padding: '12px', 
                  borderRadius: '10px',
                  border: '1px dashed #cbd5e0'
                }}>
                  <small className="text-muted">
                    <i className="fas fa-info-circle me-1"></i>
                    Admin: <code style={{ color: '#5a67d8' }}>admin / Admin123</code>
                  </small>
                </div>
              </div>

              <div className="text-center">
                <p className="mb-0 text-muted">
                  Don't have an account?{' '}
                  <Link 
                    to="/register" 
                    className="text-decoration-none fw-semibold"
                    style={{ color: '#667eea' }}
                  >
                    Create one here
                  </Link>
                </p>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Login;