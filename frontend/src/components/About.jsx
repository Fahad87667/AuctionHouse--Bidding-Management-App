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
      image: '/images/car1.jpg', // Place image in public/images/developer2.jpg
      bio: 'Dedicated to crafting beautiful, intuitive interfaces that users love. Expert in modern frontend technologies and design principles.',
      github: 'https://github.com',
      linkedin: 'https://linkedin.com',
      email: 'sarah@auctionhouse.com',
      skills: ['UI/UX Design', 'React', 'CSS', 'Figma']
    }
  ];

  return (
    <div style={{ minHeight: '100vh', paddingTop: '80px', paddingBottom: '80px' }}>
      {/* Hero Section */}
      <div style={{ 
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        padding: '80px 0',
        marginBottom: '80px',
        position: 'relative',
        overflow: 'hidden'
      }}>
        <Container>
          <Row className="align-items-center">
            <Col lg={6}>
              <h1 className="display-3 fw-bold text-white mb-4">
                About Auction House
              </h1>
              <p className="lead text-white mb-4" style={{ opacity: 0.9 }}>
                We're passionate about creating the most trusted and user-friendly online auction platform. 
                Our mission is to connect buyers and sellers in a secure, transparent, and exciting marketplace.
              </p>
              <div className="d-flex gap-4">
                <div className="text-center">
                  <h2 className="fw-bold text-white mb-0">1000+</h2>
                  <p className="text-white-50">Active Users</p>
                </div>
                <div className="text-center">
                  <h2 className="fw-bold text-white mb-0">500+</h2>
                  <p className="text-white-50">Successful Auctions</p>
                </div>
                <div className="text-center">
                  <h2 className="fw-bold text-white mb-0">99%</h2>
                  <p className="text-white-50">Satisfaction Rate</p>
                </div>
              </div>
            </Col>
            <Col lg={6}>
              <div style={{ 
                width: '400px', 
                height: '400px',
                background: 'rgba(255,255,255,0.1)',
                borderRadius: '50%',
                margin: '0 auto',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                backdropFilter: 'blur(10px)'
              }}>
                <i className="fas fa-gavel text-white" style={{ fontSize: '150px' }}></i>
              </div>
            </Col>
          </Row>
        </Container>
        {/* Decorative shapes */}
        <div style={{
          position: 'absolute',
          top: '-50px',
          right: '-50px',
          width: '200px',
          height: '200px',
          background: 'rgba(255,255,255,0.1)',
          borderRadius: '50%'
        }}></div>
        <div style={{
          position: 'absolute',
          bottom: '-100px',
          left: '-100px',
          width: '300px',
          height: '300px',
          background: 'rgba(255,255,255,0.05)',
          borderRadius: '50%'
        }}></div>
      </div>

      {/* Our Story Section */}
      <Container className="mb-5">
        <Row className="mb-5">
          <Col lg={12} className="text-center">
            <h2 className="display-5 fw-bold mb-4" style={{ color: '#2d3748' }}>Our Story</h2>
            <p className="lead text-muted mx-auto" style={{ maxWidth: '800px' }}>
              Founded in 2023, Auction House started with a simple idea: make online auctions accessible, 
              secure, and enjoyable for everyone. What began as a small project has grown into a thriving 
              platform that connects collectors, enthusiasts, and sellers from around the world.
            </p>
          </Col>
        </Row>

        {/* Values Section */}
        <Row className="g-4 mb-5">
          <Col md={4}>
            <Card className="h-100 border-0 shadow-sm text-center p-4" style={{ borderRadius: '20px' }}>
              <div style={{
                width: '80px',
                height: '80px',
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 20px',
                boxShadow: '0 4px 15px rgba(102, 126, 234, 0.3)'
              }}>
                <i className="fas fa-shield-alt text-white fs-3"></i>
              </div>
              <h4 className="fw-bold mb-3" style={{ color: '#2d3748' }}>Trust & Security</h4>
              <p className="text-muted">
                Every transaction is protected with state-of-the-art security measures and buyer protection policies.
              </p>
            </Card>
          </Col>
          <Col md={4}>
            <Card className="h-100 border-0 shadow-sm text-center p-4" style={{ borderRadius: '20px' }}>
              <div style={{
                width: '80px',
                height: '80px',
                background: 'linear-gradient(135deg, #48bb78 0%, #38a169 100%)',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 20px',
                boxShadow: '0 4px 15px rgba(72, 187, 120, 0.3)'
              }}>
                <i className="fas fa-users text-white fs-3"></i>
              </div>
              <h4 className="fw-bold mb-3" style={{ color: '#2d3748' }}>Community First</h4>
              <p className="text-muted">
                We're building more than a platform - we're creating a community of passionate collectors and sellers.
              </p>
            </Card>
          </Col>
          <Col md={4}>
            <Card className="h-100 border-0 shadow-sm text-center p-4" style={{ borderRadius: '20px' }}>
              <div style={{
                width: '80px',
                height: '80px',
                background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 20px',
                boxShadow: '0 4px 15px rgba(240, 147, 251, 0.3)'
              }}>
                <i className="fas fa-rocket text-white fs-3"></i>
              </div>
              <h4 className="fw-bold mb-3" style={{ color: '#2d3748' }}>Innovation</h4>
              <p className="text-muted">
                Constantly improving our platform with cutting-edge features and the latest technology.
              </p>
            </Card>
          </Col>
        </Row>
      </Container>

      {/* Team Section */}
      <div style={{ background: '#f8fafc', padding: '80px 0' }}>
        <Container>
          <div className="text-center mb-5">
            <h2 className="display-5 fw-bold mb-3" style={{ color: '#2d3748' }}>Meet Our Team</h2>
            <p className="lead text-muted">The talented developers behind Auction House</p>
          </div>

          <Row className="g-5">
            {developers.map((dev, index) => (
              <Col lg={6} key={index} className="mb-5">
                <Card className="border-0 shadow-lg h-100 position-relative" style={{
                  borderRadius: '24px',
                  overflow: 'visible',
                  marginTop: '60px',
                  paddingTop: '80px',
                  background: 'white'
                }}>
                  <div style={{
                    position: 'absolute',
                    top: '-60px',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    width: '180px',
                    height: '180px',
                    borderRadius: '50%',
                    overflow: 'hidden',
                    border: '6px solid #fff',
                    boxShadow: '0 8px 32px rgba(102, 126, 234, 0.18)',
                    background: '#f7fafc'
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
                  <Card.Body className="text-center pt-5">
                    <h3 className="fw-bold mb-1" style={{ color: '#2d3748', marginTop: '40px' }}>{dev.name}</h3>
                    <p className="text-primary fw-semibold mb-3" style={{ fontSize: '18px' }}>{dev.role}</p>
                    <p className="text-muted mb-4">{dev.bio}</p>
                    {dev.skills && (
                      <div className="mb-4">
                        <h6 className="fw-bold text-secondary mb-2">Skills</h6>
                        <div className="d-flex flex-wrap gap-2 justify-content-center">
                          {dev.skills.map((skill, idx) => (
                            <span 
                              key={idx}
                              className="badge"
                              style={{ 
                                background: '#e6f0ff',
                                color: '#667eea',
                                padding: '6px 12px',
                                borderRadius: '20px',
                                fontWeight: '500'
                              }}
                            >
                              {skill}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                    <div className="d-flex justify-content-center gap-3">
                      <a href={dev.github} target="_blank" rel="noopener noreferrer" style={{ width: '40px', height: '40px', background: '#f7fafc', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#4a5568', transition: 'all 0.2s', textDecoration: 'none' }} onMouseOver={e => { e.currentTarget.style.background = 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'; e.currentTarget.style.color = 'white'; }} onMouseOut={e => { e.currentTarget.style.background = '#f7fafc'; e.currentTarget.style.color = '#4a5568'; }}><i className="fab fa-github"></i></a>
                      <a href={dev.linkedin} target="_blank" rel="noopener noreferrer" style={{ width: '40px', height: '40px', background: '#f7fafc', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#4a5568', transition: 'all 0.2s', textDecoration: 'none' }} onMouseOver={e => { e.currentTarget.style.background = 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'; e.currentTarget.style.color = 'white'; }} onMouseOut={e => { e.currentTarget.style.background = '#f7fafc'; e.currentTarget.style.color = '#4a5568'; }}><i className="fab fa-linkedin-in"></i></a>
                      {dev.email && <a href={`mailto:${dev.email}`} style={{ width: '40px', height: '40px', background: '#f7fafc', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#4a5568', transition: 'all 0.2s', textDecoration: 'none' }} onMouseOver={e => { e.currentTarget.style.background = 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'; e.currentTarget.style.color = 'white'; }} onMouseOut={e => { e.currentTarget.style.background = '#f7fafc'; e.currentTarget.style.color = '#4a5568'; }}><i className="fas fa-envelope"></i></a>}
                    </div>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        </Container>
      </div>
    </div>
  );
};

export default About;