import React from 'react';
import { Navbar, Nav, Container, Button } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const NavigationBar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  // Hardcoded admin check - show admin panel for specific email or Admin role
  const isAdmin = user && (
    user.email === 'admin@auction.com' || 
    user.role === 'Admin' || 
    (user.roles && user.roles.includes('Admin'))
  );

  return (
    <Navbar expand="lg" className="py-3 shadow-sm" style={{ 
      background: 'rgba(255, 255, 255, 0.95)',
      backdropFilter: 'blur(10px)',
      borderBottom: '1px solid rgba(0,0,0,0.05)'
    }}>
      <Container>
        <Navbar.Brand 
          as={Link} 
          to="/" 
          className="fw-bold fs-4 d-flex align-items-center"
          style={{ 
            color: '#2d3748',
            transition: 'transform 0.2s ease'
          }}
          onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
          onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
        >
          <div style={{
            width: '40px',
            height: '40px',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            borderRadius: '10px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginRight: '12px',
            boxShadow: '0 4px 15px rgba(102, 126, 234, 0.2)'
          }}>
            <i className="fas fa-gavel text-white"></i>
          </div>
          Auction House
        </Navbar.Brand>
        
        <Navbar.Toggle 
          aria-controls="basic-navbar-nav"
          style={{ 
            border: 'none',
            padding: '4px 12px',
            borderRadius: '8px'
          }}
        >
          <span className="navbar-toggler-icon" style={{
            backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 30 30'%3e%3cpath stroke='rgba(102, 126, 234, 0.8)' stroke-linecap='round' stroke-miterlimit='10' stroke-width='2' d='M4 7h22M4 15h22M4 23h22'/%3e%3c/svg%3e")`
          }}></span>
        </Navbar.Toggle>
        
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ms-auto align-items-center">
            <Nav.Link 
              as={Link} 
              to="/auctions"
              className="mx-2 fw-semibold"
              style={{ 
                color: '#4a5568',
                transition: 'color 0.2s ease',
                position: 'relative'
              }}
              onMouseOver={(e) => e.currentTarget.style.color = '#667eea'}
              onMouseOut={(e) => e.currentTarget.style.color = '#4a5568'}
            >
              <i className="fas fa-gavel me-2"></i>
              Auctions
            </Nav.Link>
            
            <Nav.Link 
              as={Link} 
              to="/about"
              className="mx-2 fw-semibold"
              style={{ 
                color: '#4a5568',
                transition: 'color 0.2s ease',
                position: 'relative'
              }}
              onMouseOver={(e) => e.currentTarget.style.color = '#667eea'}
              onMouseOut={(e) => e.currentTarget.style.color = '#4a5568'}
            >
              <i className="fas fa-info-circle me-2"></i>
              About
            </Nav.Link>
            
            {user && !isAdmin && (
              <Nav.Link 
                as={Link} 
                to="/my-bids"
                className="mx-2 fw-semibold"
                style={{ 
                  color: '#4a5568',
                  transition: 'color 0.2s ease'
                }}
                onMouseOver={(e) => e.currentTarget.style.color = '#667eea'}
                onMouseOut={(e) => e.currentTarget.style.color = '#4a5568'}
              >
                <i className="fas fa-gavel me-2"></i>
                My Bids
              </Nav.Link>
            )}
            
            <div className="d-flex align-items-center ms-lg-4">
              {user ? (
                <>
                  <div className="d-flex align-items-center me-3" style={{
                    padding: '8px 16px',
                    background: '#f7fafc',
                    borderRadius: '25px'
                  }}>
                    <div style={{
                      width: '32px',
                      height: '32px',
                      borderRadius: '50%',
                      background: isAdmin ? 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)' : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      marginRight: '10px'
                    }}>
                      <i className={`fas ${isAdmin ? 'fa-crown' : 'fa-user'} text-white text-sm`}></i>
                    </div>
                    <span className="fw-semibold" style={{ color: '#2d3748' }}>
                      {isAdmin ? 'Admin' : (user.username || user.email)}
                    </span>
                  </div>
                  
                  {isAdmin && (
                    <Button
                      as={Link}
                      to="/admin"
                      className="me-2 fw-semibold border-0"
                      style={{
                        background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
                        padding: '8px 20px',
                        borderRadius: '25px',
                        transition: 'transform 0.2s ease',
                        boxShadow: '0 4px 15px rgba(240, 147, 251, 0.3)'
                      }}
                      onMouseOver={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
                      onMouseOut={(e) => e.currentTarget.style.transform = 'translateY(0)'}
                    >
                      <i className="fas fa-cog me-2"></i>
                      Admin Panel
                    </Button>
                  )}
                  
                  <Button
                    variant="outline"
                    onClick={handleLogout}
                    className="fw-semibold"
                    style={{
                      borderColor: '#e2e8f0',
                      color: '#4a5568',
                      borderRadius: '25px',
                      padding: '8px 20px',
                      transition: 'all 0.2s ease'
                    }}
                    onMouseOver={(e) => {
                      e.currentTarget.style.borderColor = '#667eea';
                      e.currentTarget.style.color = '#667eea';
                      e.currentTarget.style.transform = 'translateY(-2px)';
                    }}
                    onMouseOut={(e) => {
                      e.currentTarget.style.borderColor = '#e2e8f0';
                      e.currentTarget.style.color = '#4a5568';
                      e.currentTarget.style.transform = 'translateY(0)';
                    }}
                  >
                    <i className="fas fa-sign-out-alt me-2"></i>
                    Logout
                  </Button>
                </>
              ) : (
                <>
                  <Nav.Link 
                    as={Link} 
                    to="/login" 
                    className="me-3 fw-semibold"
                    style={{ 
                      color: '#4a5568',
                      transition: 'color 0.2s ease'
                    }}
                    onMouseOver={(e) => e.currentTarget.style.color = '#667eea'}
                    onMouseOut={(e) => e.currentTarget.style.color = '#4a5568'}
                  >
                    <i className="fas fa-sign-in-alt me-2"></i>
                    Login
                  </Nav.Link>
                  
                  <Button 
                    as={Link} 
                    to="/register"
                    className="fw-semibold border-0"
                    style={{
                      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                      padding: '8px 24px',
                      borderRadius: '25px',
                      transition: 'transform 0.2s ease',
                      boxShadow: '0 4px 15px rgba(102, 126, 234, 0.3)'
                    }}
                    onMouseOver={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
                    onMouseOut={(e) => e.currentTarget.style.transform = 'translateY(0)'}
                  >
                    <i className="fas fa-user-plus me-2"></i>
                    Register
                  </Button>
                </>
              )}
            </div>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default NavigationBar;