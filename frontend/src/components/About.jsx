import React from 'react';
import { Container, Row, Col, Card } from 'react-bootstrap';

// Import developer photos - place your images in src/assets/images/
// import developer1Photo from '../assets/images/developer1.jpg';
// import developer2Photo from '../assets/images/developer2.jpg';

const About = () => {
  const developers = [
    {
      name: 'Fahad Khan',
      role: 'Full Stack Developer',
      // Use imported image: image: developer1Photo,
      // Or use public folder: image: '/images/alex-johnson.jpg',
      // Placeholder for now:
      image: '/images/Fahad.jpg', // Place image in public/images/developer1.jpg
      bio: 'Passionate about creating seamless user experiences and robust backend systems. Specialized in React, Node.js, and cloud architecture.',
      github: 'https://github.com/Fahad87667',
      linkedin: 'https://linkedin.com/in/fahad-khan-50b141233',
      email: 'ftkhan61814@gmail.com',
      skills: ['React', 'C#', 'MySql', '.NET']
    },
    {
      name: 'Sarah Chen',
      role: 'Frontend Developer & UI/UX Designer',
      // Use imported image: image: developer2Photo,
      // Or use public folder: image: '/images/sarah-chen.jpg',
      // Placeholder for now:
      image: '/images/Rajesh.jpg', // Place image in public/images/developer2.jpg
      bio: 'Dedicated to crafting beautiful, intuitive interfaces that users love. Expert in modern frontend technologies and design principles.',
      github: 'https://github.com',
      linkedin: 'https://linkedin.com',
      email: 'sarah@auctionhouse.com',
      skills: ['UI/UX Design', 'React', 'CSS', 'Figma']
    }
  ];

  return (
    <div style={{ minHeight: '100vh', paddingTop: '40px', paddingBottom: '40px' }}>
      {/* Hero Section - New Design */}
      <div style={{ 
        background: '#ffffff',
        padding: '60px 0 32px',
        position: 'relative',
        overflow: 'hidden'
      }}>
        <div style={{
          position: 'absolute',
          top: '-50%',
          right: '-20%',
          width: '800px',
          height: '800px',
          background: 'linear-gradient(135deg, #667eea20 0%, #764ba220 100%)',
          borderRadius: '50%',
          filter: 'blur(80px)'
        }}></div>
        
        <Container>
          <Row>
            <Col lg={12} className="text-center">
              <span style={{
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                color: 'white',
                padding: '8px 24px',
                borderRadius: '30px',
                fontSize: '14px',
                fontWeight: '600',
                display: 'inline-block',
                marginBottom: '20px'
              }}>
                Welcome to Our Story
              </span>
              <h1 className="display-2 fw-bold mb-3" style={{
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text'
              }}>
                About Auction House
              </h1>
              <p className="lead text-muted mb-3" style={{ maxWidth: '700px', margin: '0 auto' }}>
                We're passionate about creating the most trusted and user-friendly online auction platform. 
                Our mission is to connect buyers and sellers in a secure, transparent, and exciting marketplace.
              </p>
            </Col>
          </Row>
        </Container>
      </div>

      {/* Stats Section - New Design */}
      <Container className="mb-3">
        <Row className="g-3">
          {[
            { number: '1000+', label: 'Active Users', icon: 'fa-users', color: '#667eea' },
            { number: '500+', label: 'Successful Auctions', icon: 'fa-gavel', color: '#764ba2' },
            { number: '99%', label: 'Satisfaction Rate', icon: 'fa-star', color: '#f5576c' }
          ].map((stat, idx) => (
            <Col md={4} key={idx}>
              <div style={{
                background: '#f8fafc',
                borderRadius: '16px',
                padding: '24px',
                textAlign: 'center',
                border: '2px solid transparent',
                transition: 'all 0.3s',
                height: '100%'
              }}
              onMouseEnter={e => {
                e.currentTarget.style.border = `2px solid ${stat.color}`;
                e.currentTarget.style.transform = 'translateY(-5px)';
              }}
              onMouseLeave={e => {
                e.currentTarget.style.border = '2px solid transparent';
                e.currentTarget.style.transform = 'translateY(0)';
              }}>
                <i className={`fas ${stat.icon}`} style={{ 
                  fontSize: '3rem', 
                  color: stat.color,
                  marginBottom: '20px',
                  display: 'block'
                }}></i>
                <h2 className="fw-bold mb-2" style={{ color: '#2d3748' }}>{stat.number}</h2>
                <p className="text-muted mb-0">{stat.label}</p>
              </div>
            </Col>
          ))}
        </Row>
      </Container>

      {/* Our Story Section - New Layout */}
      <div style={{ padding: '32px 0', background: '#fafbfc' }}>
        <Container>
          <Row className="align-items-center">
            <Col lg={6} className="mb-4 mb-lg-0">
              <div style={{
                background: 'white',
                padding: '32px',
                borderRadius: '24px',
                boxShadow: '0 20px 50px rgba(0,0,0,0.08)',
                position: 'relative'
              }}>
                <div style={{
                  position: 'absolute',
                  top: '30px',
                  left: '30px',
                  width: '80px',
                  height: '80px',
                  background: 'linear-gradient(135deg, #667eea15 0%, #764ba215 100%)',
                  borderRadius: '50%'
                }}></div>
                <h2 className="display-6 fw-bold mb-4" style={{ color: '#2d3748' }}>Our Story</h2>
                <p className="text-muted mb-4">
                  Founded in 2023, Auction House started with a simple idea: make online auctions accessible, 
                  secure, and enjoyable for everyone. What began as a small project has grown into a thriving 
                  platform that connects collectors, enthusiasts, and sellers from around the world.
                </p>
                <div style={{
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  height: '4px',
                  width: '60px',
                  borderRadius: '2px'
                }}></div>
              </div>
            </Col>
            <Col lg={6}>
              <Row className="g-2">
                {[
                  { icon: 'fa-shield-alt', title: 'Trust & Security', desc: 'Every transaction is protected with state-of-the-art security measures and buyer protection policies.' },
                  { icon: 'fa-users', title: 'Community First', desc: 'We\'re building more than a platform - we\'re creating a community of passionate collectors and sellers.' },
                  { icon: 'fa-rocket', title: 'Innovation', desc: 'Constantly improving our platform with cutting-edge features and the latest technology.' }
                ].map((value, idx) => (
                  <Col xs={12} key={idx}>
                    <div style={{
                      background: 'white',
                      padding: '18px',
                      borderRadius: '16px',
                      display: 'flex',
                      alignItems: 'start',
                      gap: '16px',
                      transition: 'all 0.3s',
                      cursor: 'pointer'
                    }}
                    onMouseEnter={e => {
                      e.currentTarget.style.boxShadow = '0 10px 30px rgba(102, 126, 234, 0.15)';
                      e.currentTarget.style.transform = 'translateX(10px)';
                    }}
                    onMouseLeave={e => {
                      e.currentTarget.style.boxShadow = 'none';
                      e.currentTarget.style.transform = 'translateX(0)';
                    }}>
                      <div style={{
                        minWidth: '50px',
                        height: '50px',
                        background: 'linear-gradient(135deg, #667eea10 0%, #764ba210 100%)',
                        borderRadius: '12px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}>
                        <i className={`fas ${value.icon}`} style={{ color: '#667eea' }}></i>
                      </div>
                      <div>
                        <h5 className="fw-bold mb-2" style={{ color: '#2d3748' }}>{value.title}</h5>
                        <p className="text-muted mb-0" style={{ fontSize: '14px' }}>{value.desc}</p>
                      </div>
                    </div>
                  </Col>
                ))}
              </Row>
            </Col>
          </Row>
        </Container>
      </div>

      {/* Team Section - New Design */}
      <Container className="py-3">
        <div className="text-center mb-3">
          <span style={{
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            color: 'white',
            padding: '8px 24px',
            borderRadius: '30px',
            fontSize: '14px',
            fontWeight: '600',
            display: 'inline-block',
            marginBottom: '12px'
          }}>
            Our Team
          </span>
          <h2 className="display-5 fw-bold mb-2" style={{ color: '#2d3748' }}>Meet the Developers</h2>
          <p className="lead text-muted">The talented minds behind Auction House</p>
        </div>

        <Row className="g-4 justify-content-center">
          {developers.map((dev, index) => (
            <Col lg={6} key={index}>
              <div style={{
                background: 'white',
                borderRadius: '24px',
                overflow: 'hidden',
                boxShadow: '0 10px 40px rgba(0,0,0,0.08)',
                transition: 'all 0.3s',
                height: '100%'
              }}
              onMouseEnter={e => {
                e.currentTarget.style.transform = 'translateY(-10px)';
                e.currentTarget.style.boxShadow = '0 20px 60px rgba(102, 126, 234, 0.2)';
              }}
              onMouseLeave={e => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 10px 40px rgba(0,0,0,0.08)';
              }}>
                <div style={{
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  height: '120px',
                  position: 'relative'
                }}>
                  <div style={{
                    position: 'absolute',
                    bottom: '-60px',
                    left: '30px',
                    width: '120px',
                    height: '120px',
                    borderRadius: '20px',
                    overflow: 'hidden',
                    border: '4px solid white',
                    boxShadow: '0 4px 20px rgba(0,0,0,0.1)'
                  }}>
                    <img
                      src={dev.image}
                      alt={dev.name}
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover'
                      }}
                      onError={(e) => {
                        e.target.src = `https://ui-avatars.com/api/?name=${dev.name.replace(' ', '+')}&background=667eea&color=fff&size=200`;
                      }}
                    />
                  </div>
                </div>
                
                <div style={{ padding: '18px', paddingTop: '60px' }}>
                  <h4 className="fw-bold mb-1" style={{ color: '#2d3748' }}>{dev.name}</h4>
                  <p style={{ color: '#764ba2', fontWeight: '600', marginBottom: '20px' }}>{dev.role}</p>
                  <p className="text-muted mb-4" style={{ fontSize: '15px' }}>{dev.bio}</p>
                  
                  {dev.skills && (
                    <div className="mb-3">
                      <div className="d-flex flex-wrap gap-2">
                        {dev.skills.map((skill, idx) => (
                          <span 
                            key={idx}
                            style={{ 
                              background: 'linear-gradient(135deg, #667eea10 0%, #764ba210 100%)',
                              color: '#667eea',
                              padding: '6px 16px',
                              borderRadius: '8px',
                              fontSize: '13px',
                              fontWeight: '500',
                              border: '1px solid #667eea20'
                            }}
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  <div className="d-flex gap-2">
                    <a 
                      href={dev.github} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      style={{ 
                        width: '36px', 
                        height: '36px', 
                        background: '#f8fafc', 
                        borderRadius: '8px', 
                        display: 'flex', 
                        alignItems: 'center', 
                        justifyContent: 'center', 
                        color: '#4a5568', 
                        transition: 'all 0.2s', 
                        textDecoration: 'none',
                        border: '1px solid #e2e8f0'
                      }} 
                      onMouseOver={e => { 
                        e.currentTarget.style.background = '#667eea'; 
                        e.currentTarget.style.color = 'white'; 
                        e.currentTarget.style.borderColor = '#667eea';
                      }} 
                      onMouseOut={e => { 
                        e.currentTarget.style.background = '#f8fafc'; 
                        e.currentTarget.style.color = '#4a5568';
                        e.currentTarget.style.borderColor = '#e2e8f0';
                      }}
                    >
                      <i className="fab fa-github"></i>
                    </a>
                    <a 
                      href={dev.linkedin} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      style={{ 
                        width: '36px', 
                        height: '36px', 
                        background: '#f8fafc', 
                        borderRadius: '8px', 
                        display: 'flex', 
                        alignItems: 'center', 
                        justifyContent: 'center', 
                        color: '#4a5568', 
                        transition: 'all 0.2s', 
                        textDecoration: 'none',
                        border: '1px solid #e2e8f0'
                      }} 
                      onMouseOver={e => { 
                        e.currentTarget.style.background = '#0077b5'; 
                        e.currentTarget.style.color = 'white';
                        e.currentTarget.style.borderColor = '#0077b5';
                      }} 
                      onMouseOut={e => { 
                        e.currentTarget.style.background = '#f8fafc'; 
                        e.currentTarget.style.color = '#4a5568';
                        e.currentTarget.style.borderColor = '#e2e8f0';
                      }}
                    >
                      <i className="fab fa-linkedin-in"></i>
                    </a>
                    {dev.email && (
                      <a 
                        href={`mailto:${dev.email}`} 
                        style={{ 
                          width: '36px', 
                          height: '36px', 
                          background: '#f8fafc', 
                          borderRadius: '8px', 
                          display: 'flex', 
                          alignItems: 'center', 
                          justifyContent: 'center', 
                          color: '#4a5568', 
                          transition: 'all 0.2s', 
                          textDecoration: 'none',
                          border: '1px solid #e2e8f0'
                        }} 
                        onMouseOver={e => { 
                          e.currentTarget.style.background = '#764ba2'; 
                          e.currentTarget.style.color = 'white';
                          e.currentTarget.style.borderColor = '#764ba2';
                        }} 
                        onMouseOut={e => { 
                          e.currentTarget.style.background = '#f8fafc'; 
                          e.currentTarget.style.color = '#4a5568';
                          e.currentTarget.style.borderColor = '#e2e8f0';
                        }}
                      >
                        <i className="fas fa-envelope"></i>
                      </a>
                    )}
                  </div>
                </div>
              </div>
            </Col>
          ))}
        </Row>
      </Container>

      {/* Call to Action Section - New Addition */}
      <div style={{ 
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        padding: '80px 0',
        marginTop: '80px',
        position: 'relative',
        overflow: 'hidden'
      }}>
        <div style={{
          position: 'absolute',
          top: '-50%',
          left: '-10%',
          width: '400px',
          height: '400px',
          background: 'rgba(255,255,255,0.1)',
          borderRadius: '50%'
        }}></div>
        <Container>
          <Row>
            <Col lg={12} className="text-center">
              <h2 className="display-5 fw-bold text-white mb-4">Ready to Start Your Auction Journey?</h2>
              <p className="lead text-white mb-4" style={{ opacity: 0.9 }}>
                Join thousands of satisfied users and experience the future of online auctions.
              </p>
              <button 
                className="btn btn-light btn-lg px-5 py-3" 
                style={{ 
                  borderRadius: '50px',
                  fontWeight: '600',
                  boxShadow: '0 10px 30px rgba(0,0,0,0.2)',
                  transition: 'all 0.3s'
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.transform = 'translateY(-3px)';
                  e.currentTarget.style.boxShadow = '0 15px 40px rgba(0,0,0,0.3)';
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 10px 30px rgba(0,0,0,0.2)';
                }}
              >
                Get Started Today
              </button>
            </Col>
          </Row>
        </Container>
      </div>
    </div>
  );
};

export default About;