import React from 'react';
import { Link } from 'react-router-dom'; // Import the Link component
import './navigationBar.css'; // Your existing CSS import

const NavigationBar = () => {
  return (
    <nav className="navBar">
      <ul className="navList">
        <li className="navItem active">
          {/* Use the `Link` component instead of `<a>` tags */}
          <Link to="/">about us</Link>
        </li>
        <li className="navItem">
          <Link to="/services">services</Link>
        </li>
        <li className="navItem">
          <Link to="/prices">prices</Link>
        </li>
        <li className="navItem">
          <Link to="/news">latest news</Link>
        </li>
        <li className="navItem">
          <Link to="/contacts">contacts</Link>
        </li>
      </ul>
    </nav>
  );
};

export default NavigationBar;
