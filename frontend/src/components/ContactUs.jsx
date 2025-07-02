import React, { useState } from 'react';
import { Card, Form, Button, Container, Row, Col, Accordion } from 'react-bootstrap';
import { toast } from 'react-toastify';

const ContactUs = () => {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.name.trim() || !form.email.trim() || !form.subject.trim() || !form.message.trim()) {
      toast.error('Please fill in all fields.');
      return;
    }
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      toast.success('Your message has been sent!');
      setForm({ name: '', email: '', subject: '', message: '' });
    }, 1200);
  };

  return (
    <Container fluid className="p-0">
      <div className="position-relative">
        {/* Background Shape */}
        <div 
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '500px',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            clipPath: 'polygon(0 0, 100% 0, 100% 65%, 0 100%)',
            zIndex: -1
          }}
        />

        <Container className="py-5">
          <Row className="justify-content-center">
            <Col lg={10}>
              <div className="text-center text-white mb-5">
                <h1 className="fw-bold mb-3">Get in Touch</h1>
                <p className="lead">We're here to help and answer any questions you might have.</p>
              </div>

              <Row className="g-4">
                {/* Contact Information */}
                <Col lg={4}>
                  <Card className="border-0 shadow-lg h-100" style={{ borderRadius: '20px' }}>
                    <Card.Body className="p-4">
                      <h4 className="fw-bold mb-4" style={{ color: '#2d3748' }}>Contact Information</h4>
                      
                      <div className="mb-4">
                        <div className="d-flex align-items-center mb-3">
                          <div className="me-3" style={{
                            width: '40px',
                            height: '40px',
                            borderRadius: '12px',
                            background: 'linear-gradient(135deg, #667eea20 0%, #764ba220 100%)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                          }}>
                            <i className="fas fa-map-marker-alt" style={{ color: '#667eea' }}></i>
                          </div>
                          <div>
                            <h6 className="fw-bold mb-1">Address</h6>
                            <p className="text-muted mb-0">123 Auction Street, Mumbai, Maharashtra 400001</p>
                          </div>
                        </div>

                        <div className="d-flex align-items-center mb-3">
                          <div className="me-3" style={{
                            width: '40px',
                            height: '40px',
                            borderRadius: '12px',
                            background: 'linear-gradient(135deg, #667eea20 0%, #764ba220 100%)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                          }}>
                            <i className="fas fa-phone" style={{ color: '#667eea' }}></i>
                          </div>
                          <div>
                            <h6 className="fw-bold mb-1">Phone</h6>
                            <p className="text-muted mb-0">+91 9876543210</p>
                          </div>
                        </div>

                        <div className="d-flex align-items-center">
                          <div className="me-3" style={{
                            width: '40px',
                            height: '40px',
                            borderRadius: '12px',
                            background: 'linear-gradient(135deg, #667eea20 0%, #764ba220 100%)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                          }}>
                            <i className="fas fa-envelope" style={{ color: '#667eea' }}></i>
                          </div>
                          <div>
                            <h6 className="fw-bold mb-1">Email</h6>
                            <p className="text-muted mb-0">contact@auctions.com</p>
                          </div>
                        </div>
                      </div>

                      {/* Social Media Links */}
                      <div className="mt-5">
                        <h6 className="fw-bold mb-3">Follow Us</h6>
                        <div className="d-flex gap-2">
                          {['facebook', 'twitter', 'linkedin', 'instagram'].map((social) => (
                            <a
                              key={social}
                              href={`#${social}`}
                              className="btn btn-light"
                              style={{
                                width: '40px',
                                height: '40px',
                                borderRadius: '12px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                transition: 'all 0.3s ease'
                              }}
                            >
                              <i className={`fab fa-${social}`}></i>
                            </a>
                          ))}
                        </div>
                      </div>
                    </Card.Body>
                  </Card>
                </Col>

                {/* Contact Form */}
                <Col lg={8}>
                  <Card className="border-0 shadow-lg" style={{ borderRadius: '20px' }}>
                    <Card.Body className="p-4">
                      <Form onSubmit={handleSubmit}>
                        <Row>
                          <Col md={6}>
                            <Form.Group className="mb-4">
                              <Form.Label className="fw-medium">Name</Form.Label>
                              <Form.Control
                                type="text"
                                name="name"
                                value={form.name}
                                onChange={handleChange}
                                placeholder="Your name"
                                required
                                style={{
                                  borderRadius: '12px',
                                  padding: '12px 16px',
                                  border: '1.5px solid #e2e8f0',
                                  transition: 'all 0.3s ease'
                                }}
                              />
                            </Form.Group>
                          </Col>
                          <Col md={6}>
                            <Form.Group className="mb-4">
                              <Form.Label className="fw-medium">Email</Form.Label>
                              <Form.Control
                                type="email"
                                name="email"
                                value={form.email}
                                onChange={handleChange}
                                placeholder="Your email"
                                required
                                style={{
                                  borderRadius: '12px',
                                  padding: '12px 16px',
                                  border: '1.5px solid #e2e8f0',
                                  transition: 'all 0.3s ease'
                                }}
                              />
                            </Form.Group>
                          </Col>
                        </Row>

                        <Form.Group className="mb-4">
                          <Form.Label className="fw-medium">Subject</Form.Label>
                          <Form.Control
                            type="text"
                            name="subject"
                            value={form.subject}
                            onChange={handleChange}
                            placeholder="Subject"
                            required
                            style={{
                              borderRadius: '12px',
                              padding: '12px 16px',
                              border: '1.5px solid #e2e8f0',
                              transition: 'all 0.3s ease'
                            }}
                          />
                        </Form.Group>

                        <Form.Group className="mb-4">
                          <Form.Label className="fw-medium">Message</Form.Label>
                          <Form.Control
                            as="textarea"
                            rows={4}
                            name="message"
                            value={form.message}
                            onChange={handleChange}
                            placeholder="Type your message here..."
                            required
                            style={{
                              borderRadius: '12px',
                              padding: '12px 16px',
                              border: '1.5px solid #e2e8f0',
                              transition: 'all 0.3s ease',
                              resize: 'vertical'
                            }}
                          />
                        </Form.Group>

                        <Button
                          type="submit"
                          className="w-100 fw-medium border-0"
                          disabled={loading}
                          style={{
                            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                            borderRadius: '12px',
                            padding: '14px',
                            fontSize: '1rem',
                            transition: 'all 0.3s ease'
                          }}
                        >
                          {loading ? (
                            <>
                              <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                              Sending...
                            </>
                          ) : (
                            'Send Message'
                          )}
                        </Button>
                      </Form>
                    </Card.Body>
                  </Card>
                </Col>
              </Row>

              {/* FAQ Section (replaces Map) */}
              <div className="mt-5">
                <h3 className="fw-bold mb-4" style={{ color: '#2d3748' }}>Frequently Asked Questions</h3>
                <Accordion defaultActiveKey="0" style={{ borderRadius: '16px', boxShadow: '0 2px 16px rgba(102,126,234,0.08)' }}>
                  <Accordion.Item eventKey="0">
                    <Accordion.Header>How do I register for an account?</Accordion.Header>
                    <Accordion.Body>
                      Click the <strong>Register</strong> link in the navigation bar and fill out the required information. You'll receive a confirmation email after signing up.
                    </Accordion.Body>
                  </Accordion.Item>
                  <Accordion.Item eventKey="1">
                    <Accordion.Header>How do I place a bid?</Accordion.Header>
                    <Accordion.Body>
                      Browse available auctions, select an item, and enter your bid amount on the item's detail page. You must be logged in to place a bid.
                    </Accordion.Body>
                  </Accordion.Item>
                  <Accordion.Item eventKey="2">
                    <Accordion.Header>How do I know if I've won an auction?</Accordion.Header>
                    <Accordion.Body>
                      If you win, you'll receive a notification and the item will appear in your dashboard under <strong>Won Auctions</strong>.
                    </Accordion.Body>
                  </Accordion.Item>
                  <Accordion.Item eventKey="3">
                    <Accordion.Header>How do I make a payment?</Accordion.Header>
                    <Accordion.Body>
                      After winning an auction, go to your dashboard and click <strong>Pay Now</strong> next to the item. Follow the instructions to complete your payment securely.
                    </Accordion.Body>
                  </Accordion.Item>
                  <Accordion.Item eventKey="4">
                    <Accordion.Header>Who do I contact for support?</Accordion.Header>
                    <Accordion.Body>
                      Use the contact form above or email us at <a href="mailto:khanfahad0924@gmail.com">contact@auctions.com</a>. We'll get back to you as soon as possible!
                    </Accordion.Body>
                  </Accordion.Item>
                </Accordion>
              </div>
            </Col>
          </Row>
        </Container>
      </div>
    </Container>
  );
};

export default ContactUs;