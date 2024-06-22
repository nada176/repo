// StepByStepSection.js
import React from 'react';
import './StepByStepSection.css'; // Make sure to create this CSS file for styling
import procedureImage from '../../assets/images/hero-1.jpg'; // Update this path to the location of your image

const StepByStepSection = () => {
  return (
    <div className="step-by-step-section" style={{ backgroundImage: `url(${procedureImage})` }}>
      <div className="procedure-text">
        <h2>Step by step procedure</h2>
        <p>Natsreallus doloiubus egetemesers niloecase magna oncum san erahas res adelas maltaliqueo.</p>
        {/* You can add more content here if needed */}
      </div>
    </div>
  );
};

export default StepByStepSection;
