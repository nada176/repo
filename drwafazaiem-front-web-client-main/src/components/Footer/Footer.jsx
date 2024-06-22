import React from 'react';
import './footer.css';
import { FaTwitter, FaFacebookF, FaGoogle, FaInstagram, FaLinkedinIn } from 'react-icons/fa';

const Footer = () => {
  return (
    <>
      <footer className="footer">
        <div className="footer-content">
          <p>© 2024 | Privacy Policy</p>
          <div className="social-icons">
            <FaTwitter />
            <FaFacebookF />
            <FaGoogle />
            <FaInstagram />
            <FaLinkedinIn />
          </div>
          <address>
            28 Jackson Blvd Ste 1020 Chicago<br />
            IL 60604-2340
          </address>
        </div>
      </footer>
      <div className="map-container">
        <iframe
          title="Google Maps Tunisia"
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d5128138.622956953!2d7.536764685747392!3d33.84394064221611!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x1302c99ec0ea5fdf%3A0x4dd05a8def161f73!2sTunisia!5e0!3m2!1sen!2s!4v1614603319402!5m2!1sen!2s"
          width="600"
          height="450"
          style={{ border: 0 }}
          allowFullScreen=""
          loading="lazy"
        ></iframe>
      </div>
    </>
  );
};

export default Footer;
