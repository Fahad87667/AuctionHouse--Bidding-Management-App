import React, { useState } from 'react';
import { Card, Form, Button, Alert, Container, Row, Col } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { toast } from 'react-toastify';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const { login, user } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const result = await login(email, password);
    
    if (result.success) {
      toast.success('Logged in successfully!');
      navigate('/');
    } else {
      setError(result.error);
      toast.error(result.error || 'Login failed');
    }
    
    setLoading(false);
  };

  return (
    <Container className="py-5" style={{ minHeight: '100vh', background: '#f5f7fa' }}>
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
                    background: '#667eea',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto'
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
                <Form.Group className="mb-4" controlId="formEmail">
                  <Form.Label className="fw-semibold text-secondary mb-2">
                    <i className="fas fa-envelope me-2"></i>Email
                  </Form.Label>
                  <Form.Control
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    style={{ borderRadius: '12px', padding: '14px', fontSize: '16px' }}
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
                    background: '#667eea',
                    borderRadius: '12px',
                    padding: '14px',
                    fontSize: '16px',
                    transition: 'transform 0.2s ease'
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