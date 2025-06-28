import React from 'react';
import { Carousel, Container, Row, Col, Card } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

const carouselItems = [
  {
    image: 'https://images.unsplash.com/photo-1519125323398-675f0ddb6308?auto=format&fit=crop&w=800&q=80',
    caption: 'Discover Rare Collectibles',
    subcaption: 'Bid on unique items from around the world.'
  },
  {
    image: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80',
    caption: 'Win Your Dream Auction',
    subcaption: 'Experience the thrill of live bidding.'
  },
  {
    image: 'https://images.unsplash.com/photo-1464983953574-0892a716854b?auto=format&fit=crop&w=800&q=80',
    caption: 'Trusted by Thousands',
    subcaption: 'Secure, transparent, and user-friendly platform.'
  }
];

const Home = () => {
  const navigate = useNavigate();
  return (
    <div style={{ minHeight: '100vh', background: '#ffffff' }}>
      {/* Hero Section with Carousel */}
      <div style={{ position: 'relative', background: '#f8f9fa', overflow: 'hidden' }}>
        <div style={{
          position: 'absolute',
          top: '-40%',
          right: '-20%',
          width: '600px',
          height: '600px',
          background: 'radial-gradient(circle, rgba(102, 126, 234, 0.1) 0%, transparent 70%)',
          borderRadius: '50%',
          pointerEvents: 'none'
        }}></div>
        
        <Container className="py-5" style={{ paddingTop: '120px' }}>
          <Row className="align-items-center">
            <Col lg={5} className="mb-5 mb-lg-0">
              <span style={{
                background: '#667eea',
                color: 'white',
                padding: '6px 20px',
                borderRadius: '20px',
                fontSize: '14px',
                fontWeight: '600',
                display: 'inline-block',
                marginBottom: '20px'
              }}>
                Welcome to Auction House
              </span>
              <h1 className="display-4 fw-bold mb-4" style={{ color: '#2d3748' }}>
                Where Every Bid
                <span style={{
                  display: 'block',
                  background: 'linear-gradient(90deg, #667eea 0%, #764ba2 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text'
                }}>
                  Tells a Story
                </span>
              </h1>
              <p className="lead text-muted mb-4">
                Join the premier online auction platform where collectors and enthusiasts find their perfect treasures.
              </p>
              <div className="d-flex gap-3">
                <button 
                  className="btn btn-lg px-4 py-3"
                  style={{
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    color: 'white',
                    border: 'none',
                    borderRadius: '12px',
                    fontWeight: '600',
                    transition: 'transform 0.2s',
                    boxShadow: '0 4px 15px rgba(102, 126, 234, 0.3)'
                  }}
                  onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-2px)'}
                  onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}
                  onClick={() => navigate('/auctions')}
                >
                  Start Bidding
                </button>
                <button 
                  className="btn btn-outline-secondary btn-lg px-4 py-3"
                  style={{
                    borderRadius: '12px',
                    fontWeight: '600',
                    borderWidth: '2px'
                  }}
                  onClick={() => navigate('/about')}
                >
                  Learn More
                </button>
              </div>
            </Col>
            
            <Col lg={7}>
              <div style={{
                position: 'relative',
                borderRadius: '20px',
                overflow: 'hidden',
                boxShadow: '0 20px 50px rgba(0, 0, 0, 0.15)'
              }}>
                <Carousel fade indicators={false} controls={true} interval={4000}>
                  {carouselItems.map((item, idx) => (
                    <Carousel.Item key={idx}>
                      <div style={{ position: 'relative' }}>
                        <img
                          className="d-block w-100"
                          src={item.image}
                          alt={item.caption}
                          style={{ height: '500px', objectFit: 'cover' }}
                        />
                        <div style={{
                          position: 'absolute',
                          bottom: 0,
                          left: 0,
                          right: 0,
                          background: 'linear-gradient(to top, rgba(0,0,0,0.8) 0%, transparent 100%)',
                          padding: '60px 40px 40px',
                        }}>
                          <h3 className="text-white fw-bold mb-2">{item.caption}</h3>
                          <p className="text-white-50 mb-0">{item.subcaption}</p>
                        </div>
                      </div>
                    </Carousel.Item>
                  ))}
                </Carousel>
              </div>
            </Col>
          </Row>
        </Container>
      </div>

      {/* Features Section */}
      <Container className="py-5">
        <div className="text-center mb-5">
          <h2 className="display-5 fw-bold mb-3">Why Choose Auction House?</h2>
          <p className="text-muted lead">Experience the future of online auctions</p>
        </div>
        
        <Row className="g-4">
          {[
            { icon: 'fa-shield-alt', title: 'Secure Bidding', desc: 'SSL encryption and buyer protection on every transaction', color: '#667eea' },
            { icon: 'fa-clock', title: 'Real-Time Updates', desc: 'Live notifications and instant bid confirmations', color: '#764ba2' },
            { icon: 'fa-users', title: 'Trusted Community', desc: 'Verified sellers and authentic product guarantees', color: '#48bb78' },
            { icon: 'fa-trophy', title: 'Best Deals', desc: 'Competitive prices and exclusive auction items', color: '#f5576c' }
          ].map((feature, idx) => (
            <Col md={6} lg={3} key={idx}>
              <Card 
                className="h-100 border-0 text-center p-4"
                style={{
                  background: '#f8f9fa',
                  borderRadius: '16px',
                  transition: 'all 0.3s',
                  cursor: 'pointer'
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.transform = 'translateY(-5px)';
                  e.currentTarget.style.boxShadow = '0 10px 30px rgba(0,0,0,0.1)';
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              >
                <div style={{
                  width: '60px',
                  height: '60px',
                  background: `${feature.color}15`,
                  borderRadius: '12px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 20px'
                }}>
                  <i className={`fas ${feature.icon}`} style={{ color: feature.color, fontSize: '24px' }}></i>
                </div>
                <h5 className="fw-bold mb-2">{feature.title}</h5>
                <p className="text-muted small mb-0">{feature.desc}</p>
              </Card>
            </Col>
          ))}
        </Row>
      </Container>

      {/* How It Works Section */}
      <div style={{ background: '#fafbfc', padding: '80px 0' }}>
        <Container>
          <div className="text-center mb-5">
            <h2 className="display-5 fw-bold mb-3">How It Works</h2>
            <p className="text-muted lead">Start winning in 3 simple steps</p>
          </div>
          
          <Row className="g-5 align-items-center">
            {[
              { step: '01', title: 'Create Account', desc: 'Sign up for free and get verified in minutes' },
              { step: '02', title: 'Find & Bid', desc: 'Browse thousands of auctions and place your bids' },
              { step: '03', title: 'Win & Receive', desc: 'Win auctions and get items delivered to your door' }
            ].map((item, idx) => (
              <Col md={4} key={idx}>
                <div className="text-center">
                  <div style={{
                    width: '80px',
                    height: '80px',
                    background: 'white',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto 20px',
                    boxShadow: '0 5px 20px rgba(0,0,0,0.08)',
                    fontSize: '24px',
                    fontWeight: 'bold',
                    color: '#667eea'
                  }}>
                    {item.step}
                  </div>
                  <h4 className="fw-bold mb-2">{item.title}</h4>
                  <p className="text-muted">{item.desc}</p>
                </div>
              </Col>
            ))}
          </Row>
        </Container>
      </div>

      

      {/* CTA Section */}
      
      <div style={{ 
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        padding: '80px 0',
        marginTop: '80px',
        position: 'relative',
        overflow: 'hidden'
      }}>
        <div style={{
          position: 'absolute',
          bottom: '-50%',
          left: '-10%',
          width: '400px',
          height: '400px',
          background: 'rgba(255,255,255,0.1)',
          borderRadius: '50%'
        }}></div>
        <div style={{
          position: 'absolute',
          top: '-30%',
          right: '-5%',
          width: '300px',
          height: '300px',
          background: 'rgba(255,255,255,0.05)',
          borderRadius: '50%'
        }}></div>
        
        <Container>
          <Row>
            <Col lg={12} className="text-center">
              <h2 className="display-4 fw-bold text-white mb-4">
                Ready to Start Winning?
              </h2>
              <p className="lead text-white mb-5" style={{ opacity: 0.9, maxWidth: '600px', margin: '0 auto' }}>
                Join thousands of bidders who have found their perfect items at unbeatable prices.
              </p>
              <div className="d-flex gap-3 justify-content-center flex-wrap">
                <button 
                  className="btn btn-light btn-lg px-5 py-3"
                  style={{
                    borderRadius: '50px',
                    fontWeight: '600',
                    boxShadow: '0 5px 20px rgba(0,0,0,0.2)',
                    transition: 'all 0.3s'
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.transform = 'translateY(-3px)';
                    e.currentTarget.style.boxShadow = '0 8px 30px rgba(0,0,0,0.3)';
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = '0 5px 20px rgba(0,0,0,0.2)';
                  }}
                  onClick={() => navigate('/register')}
                >
                  <i className="fas fa-user-plus me-2"></i>
                  Create Free Account
                </button>
                <button 
                  className="btn btn-outline-light btn-lg px-5 py-3"
                  style={{
                    borderRadius: '50px',
                    fontWeight: '600',
                    borderWidth: '2px',
                    transition: 'all 0.3s'
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.background = 'rgba(255,255,255,0.1)';
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.background = 'transparent';
                  }}
                  onClick={() => navigate('/auctions')}
                >
                  <i className="fas fa-search me-2"></i>
                  Browse Auctions
                </button>
              </div>
              
              {/* Trust badges */}
              <div className="mt-5 d-flex justify-content-center align-items-center gap-5 flex-wrap">
                <div className="text-white">
                  <i className="fas fa-lock me-2"></i>
                  <span style={{ opacity: 0.8 }}>Secure Payments</span>
                </div>
                <div className="text-white">
                  <i className="fas fa-shield-alt me-2"></i>
                  <span style={{ opacity: 0.8 }}>Buyer Protection</span>
                </div>
                <div className="text-white">
                  <i className="fas fa-certificate me-2"></i>
                  <span style={{ opacity: 0.8 }}>Verified Sellers</span>
                </div>
              </div>
            </Col>
          </Row>
        </Container>
      </div>

      {/* Testimonials Section */}
      <Container className="py-5 my-5">
        <div className="text-center mb-5">
          <h2 className="display-5 fw-bold mb-3">What Our Users Say</h2>
          <p className="text-muted lead">Success stories from our community</p>
        </div>
        
        <Row className="g-4">
          {[
            {
              name: 'Michael Chen',
              role: 'Collector',
              image: 'https://ui-avatars.com/api/?name=Michael+Chen&background=667eea&color=fff',
              text: "Found a rare vintage watch at an incredible price. The bidding process was smooth and exciting!",
              rating: 5
            },
            {
              name: 'Sarah Johnson',
              role: 'Art Enthusiast',
              image: 'https://ui-avatars.com/api/?name=Sarah+Johnson&background=764ba2&color=fff',
              text: "Best auction platform I've used. The authentication process gives me confidence in every purchase.",
              rating: 5
            },
            {
              name: 'David Park',
              role: 'Tech Buyer',
              image: 'https://ui-avatars.com/api/?name=David+Park&background=48bb78&color=fff',
              text: "Scored amazing deals on electronics. The real-time bidding feature keeps me on the edge of my seat!",
              rating: 5
            }
          ].map((testimonial, idx) => (
            <Col lg={4} key={idx}>
              <Card 
                className="h-100 border-0 p-4"
                style={{
                  borderRadius: '16px',
                  boxShadow: '0 5px 20px rgba(0,0,0,0.08)',
                  transition: 'all 0.3s'
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.transform = 'translateY(-5px)';
                  e.currentTarget.style.boxShadow = '0 10px 40px rgba(0,0,0,0.15)';
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 5px 20px rgba(0,0,0,0.08)';
                }}
              >
                <div className="d-flex align-items-center mb-3">
                  <img 
                    src={testimonial.image} 
                    alt={testimonial.name}
                    style={{
                      width: '50px',
                      height: '50px',
                      borderRadius: '50%',
                      marginRight: '15px'
                    }}
                  />
                  <div>
                    <h6 className="fw-bold mb-0">{testimonial.name}</h6>
                    <small className="text-muted">{testimonial.role}</small>
                  </div>
                </div>
                <div className="mb-3">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <i key={i} className="fas fa-star text-warning me-1"></i>
                  ))}
                </div>
                <p className="text-muted">{testimonial.text}</p>
              </Card>
            </Col>
          ))}
        </Row>
      </Container>
    </div>
  );
};

export default Home;