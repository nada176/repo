import React from 'react';
import './PromoSection.css';
import { MdArrowForward } from 'react-icons/md'; // This is assuming you're using Material icons for the arrow

const PromoSection = () => {
  return (
    <section className="promo-section">
      <div className="promo-content">
        <h2>Giving every patient the opportunity to shine</h2>
        <button className="promo-button">
          <MdArrowForward />
        </button>
      </div>
    </section>
  );
};

export default PromoSection;
