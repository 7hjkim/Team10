import React from 'react';
import { Icon, Button } from 'semantic-ui-react';
import '../css/Footer.css'; // Import your custom CSS file for styling

const Footer = () => {
  return (
    <div className="container-fluid text-light mt-5 py-5">
      <div className="container py-5">
        <div className="row g-5">
          {/* Contact Information */}
          <div className="col-lg-3 col-md-6">
            <h4 className="d-inline-block text-primary text-uppercase border-bottom border-5 border-secondary mb-4">
              Get In Touch
            </h4>
            <p className="mb-4">No dolore ipsum accusam no lorem. Invidunt sed clita kasd clita et et dolor sed dolor</p>
            <p className="mb-2"><Icon name="map marker alternate" className="text-primary me-3" />123 Street, New York, USA</p>
            <p className="mb-2"><Icon name="envelope" className="text-primary me-3" />info@example.com</p>
            <p className="mb-0"><Icon name="phone" className="text-primary me-3" />+012 345 67890</p>
          </div>

          {/* Quick Links */}
          <div className="col-lg-3 col-md-6">
            <h4 className="d-inline-block text-primary text-uppercase border-bottom border-5 border-secondary mb-4">
              Quick Links
            </h4>
            <div className="d-flex flex-column justify-content-start">
              <a className="text-light mb-2" href="#"><Icon name="angle right" className="me-2" />Home</a>
              <a className="text-light mb-2" href="#"><Icon name="angle right" className="me-2" />About Us</a>
              <a className="text-light mb-2" href="#"><Icon name="angle right" className="me-2" />Our Services</a>
              <a className="text-light mb-2" href="#"><Icon name="angle right" className="me-2" />Meet The Team</a>
            </div>
          </div>


          {/* Newsletter and Social Icons */}
          <div className="col-lg-3 col-md-6" position="right">
            <h4 className="d-inline-block text-primary text-uppercase border-bottom border-5 border-secondary mb-4">
              Newsletter
            </h4>
            <form action="">
              <div className="input-group">
                <input type="text" className="form-control p-3 border-0" placeholder="Your Email Address" />
                <Button className="btn btn-primary">Sign Up</Button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Footer;
