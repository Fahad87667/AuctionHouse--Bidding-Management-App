import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { Link } from 'react-router-dom';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer style={{ 
      background: '#1a202c',
      color: 'white',
      marginTop: '80px',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Straight decorative line */}
      <div style={{
        position: 'absolute',
        top: '0',
        left: '0',
        right: '0',
        height: '4px',
        background: 'linear-gradient(90deg, #667eea 0%, #764ba2 100%)'
      }}></div>

      <Container style={{ paddingTop: '60px', paddingBottom: '40px' }}>
        <Row className="g-5 mb-5">
          <Col lg={4} md={6}>
            <div className="mb-4">
              <div className="d-flex align-items-center mb-3">
                <div style={{
                  width: '50px',
                  height: '50px',
                  background: '#667eea',
                  borderRadius: '12px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginRight: '15px'
                }}>
                  <i className="fas fa-gavel text-white fs-5"></i>
                </div>
                <h3 className="mb-0 fw-bold">Auction House</h3>
              </div>
              <p className="text-light opacity-75">
                Your trusted platform for online auctions. Discover unique items, 
                place competitive bids, and win amazing deals every day.
              </p>
              <div className="d-flex gap-3 mt-4">
                <a 
                  href="https://github.com/fahad87667" 
                  target="_blank" rel="noopener noreferrer"
                  className="text-white opacity-75"
                  style={{
                    width: '40px',
                    height: '40px',
                    background: 'rgba(255,255,255,0.1)',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    transition: 'all 0.3s ease',
                    textDecoration: 'none'
                  }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.background = 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)';
                    e.currentTarget.style.transform = 'translateY(-3px)';
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.background = 'rgba(255,255,255,0.1)';
                    e.currentTarget.style.transform = 'translateY(0)';
                  }}
                >
                  <i className="fab fa-github"></i>
                </a>
                
                <a 
                  href="https://instagram.com/fahadkhan_369" 
                  target="_blank" rel="noopener noreferrer"
                  className="text-white opacity-75"
                  style={{
                    width: '40px',
                    height: '40px',
                    background: 'rgba(255,255,255,0.1)',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    transition: 'all 0.3s ease',
                    textDecoration: 'none'
                  }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.background = 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)';
                    e.currentTarget.style.transform = 'translateY(-3px)';
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.background = 'rgba(255,255,255,0.1)';
                    e.currentTarget.style.transform = 'translateY(0)';
                  }}
                >
                  <i className="fab fa-instagram"></i>
                </a>
                <a 
                  href="https://linkedin.com/in/fahad-khan-50b141233" 
                  target="_blank" rel="noopener noreferrer"
                  className="text-white opacity-75"
                  style={{
                    width: '40px',
                    height: '40px',
                    background: 'rgba(255,255,255,0.1)',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    transition: 'all 0.3s ease',
                    textDecoration: 'none'
                  }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.background = 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)';
                    e.currentTarget.style.transform = 'translateY(-3px)';
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.background = 'rgba(255,255,255,0.1)';
                    e.currentTarget.style.transform = 'translateY(0)';
                  }}
                >
                  <i className="fab fa-linkedin-in"></i>
                </a><a 
                  href="https://twitter.com" 
                  target="_blank" rel="noopener noreferrer"
                  className="text-white opacity-75"
                  style={{
                    width: '40px',
                    height: '40px',
                    background: 'rgba(255,255,255,0.1)',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    transition: 'all 0.3s ease',
                    textDecoration: 'none'
                  }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.background = 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)';
                    e.currentTarget.style.transform = 'translateY(-3px)';
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.background = 'rgba(255,255,255,0.1)';
                    e.currentTarget.style.transform = 'translateY(0)';
                  }}
                >
                  <i className="fab fa-twitter"></i>
                </a>
              </div>
            </div>
          </Col>

          <Col lg={2} md={6}>
            <h5 className="fw-bold mb-4">Quick Links</h5>
            <ul className="list-unstyled">
              <li className="mb-2">
                <Link 
                  to="/" 
                  className="text-light opacity-75 text-decoration-none"
                  style={{ transition: 'all 0.3s ease' }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.color = '#667eea';
                    e.currentTarget.style.paddingLeft = '5px';
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.color = 'rgba(255,255,255,0.75)';
                    e.currentTarget.style.paddingLeft = '0';
                  }}
                >
                  <i className="fas fa-chevron-right me-2" style={{ fontSize: '12px' }}></i>
                  Live Auctions
                </Link>
              </li>
              <li className="mb-2">
                <Link 
                  to="/my-bids" 
                  className="text-light opacity-75 text-decoration-none"
                  style={{ transition: 'all 0.3s ease' }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.color = '#667eea';
                    e.currentTarget.style.paddingLeft = '5px';
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.color = 'rgba(255,255,255,0.75)';
                    e.currentTarget.style.paddingLeft = '0';
                  }}
                >
                  <i className="fas fa-chevron-right me-2" style={{ fontSize: '12px' }}></i>
                  My Bids
                </Link>
              </li>
              <li className="mb-2">
                <Link 
                  to="/register" 
                  className="text-light opacity-75 text-decoration-none"
                  style={{ transition: 'all 0.3s ease' }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.color = '#667eea';
                    e.currentTarget.style.paddingLeft = '5px';
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.color = 'rgba(255,255,255,0.75)';
                    e.currentTarget.style.paddingLeft = '0';
                  }}
                >
                  <i className="fas fa-chevron-right me-2" style={{ fontSize: '12px' }}></i>
                  Register
                </Link>
              </li>
              <li className="mb-2">
                <Link 
                  to="/login" 
                  className="text-light opacity-75 text-decoration-none"
                  style={{ transition: 'all 0.3s ease' }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.color = '#667eea';
                    e.currentTarget.style.paddingLeft = '5px';
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.color = 'rgba(255,255,255,0.75)';
                    e.currentTarget.style.paddingLeft = '0';
                  }}
                >
                  <i className="fas fa-chevron-right me-2" style={{ fontSize: '12px' }}></i>
                  Login
                </Link>
              </li>
            </ul>
          </Col>

          <Col lg={3} md={6}>
            <h5 className="fw-bold mb-4">Auction Info</h5>
            <ul className="list-unstyled">
              <li className="mb-3 d-flex align-items-start">
                <i className="fas fa-check-circle me-3 mt-1" style={{ color: '#48bb78' }}></i>
                <span className="text-light opacity-75">Secure bidding platform</span>
              </li>
              <li className="mb-3 d-flex align-items-start">
                <i className="fas fa-check-circle me-3 mt-1" style={{ color: '#48bb78' }}></i>
                <span className="text-light opacity-75">Real-time bid updates</span>
              </li>
              <li className="mb-3 d-flex align-items-start">
                <i className="fas fa-check-circle me-3 mt-1" style={{ color: '#48bb78' }}></i>
                <span className="text-light opacity-75">Verified sellers only</span>
              </li>
              <li className="mb-3 d-flex align-items-start">
                <i className="fas fa-check-circle me-3 mt-1" style={{ color: '#48bb78' }}></i>
                <span className="text-light opacity-75">24/7 customer support</span>
              </li>
            </ul>
          </Col>

          <Col lg={3} md={6}>
            <h5 className="fw-bold mb-4">Contact Us</h5>
            <ul className="list-unstyled">
              <li className="mb-3 d-flex align-items-start">
                <i className="fas fa-map-marker-alt me-3 mt-1" style={{ color: '#667eea' }}></i>
                <span className="text-light opacity-75">
                  123 Auction Street<br />
                  Mumbai, Maharashtra 400001
                </span>
              </li>
              <li className="mb-3 d-flex align-items-center">
                <i className="fas fa-phone me-3" style={{ color: '#667eea' }}></i>
                <span className="text-light opacity-75">+91 9876543210</span>
              </li>
              <li className="mb-3 d-flex align-items-center">
                <i className="fas fa-envelope me-3" style={{ color: '#667eea' }}></i>
                <span className="text-light opacity-75">support@auctionhouse.com</span>
              </li>
              <li className="mb-3 d-flex align-items-center">
                <i className="fas fa-clock me-3" style={{ color: '#667eea' }}></i>
                <span className="text-light opacity-75">Mon - Fri: 9:00 AM - 6:00 PM</span>
              </li>
            </ul>
          </Col>
        </Row>

        <hr style={{ borderColor: 'rgba(255,255,255,0.1)' }} />

        <Row className="align-items-center pt-4">
          <Col md={6}>
            <p className="mb-0 text-light opacity-75">
              &copy; {currentYear} Auction House. All rights reserved.
            </p>
          </Col>
          <Col md={6} className="text-md-end">
            <Link 
              to="#" 
              className="text-light opacity-75 text-decoration-none me-4"
              style={{ transition: 'color 0.3s ease' }}
              onMouseOver={(e) => e.currentTarget.style.color = '#667eea'}
              onMouseOut={(e) => e.currentTarget.style.color = 'rgba(255,255,255,0.75)'}
            >
              Privacy Policy
            </Link>
            <Link 
              to="#" 
              className="text-light opacity-75 text-decoration-none me-4"
              style={{ transition: 'color 0.3s ease' }}
              onMouseOver={(e) => e.currentTarget.style.color = '#667eea'}
              onMouseOut={(e) => e.currentTarget.style.color = 'rgba(255,255,255,0.75)'}
            >
              Terms of Service
            </Link>
            <Link 
              to="#" 
              className="text-light opacity-75 text-decoration-none"
              style={{ transition: 'color 0.3s ease' }}
              onMouseOver={(e) => e.currentTarget.style.color = '#667eea'}
              onMouseOut={(e) => e.currentTarget.style.color = 'rgba(255,255,255,0.75)'}
            >
              FAQ
            </Link>
          </Col>
        </Row>
      </Container>
    </footer>
  );
};

export default Footer;