import React from 'react';
import './ImprovingSmileSection.css';
import smileImage from '../../assets/images/hero-1.jpg'; // Adjust the import path to your image location

const ImprovingSmileSection = () => {
  return (
    <div className="improving-smile-section">
      <div className="text-content">
        <h2>IMPROVING THE LOOK OF YOUR SMILE!</h2>
        <div className="image-content">
      <img src={smileImage} alt="Improving Smile" />

      </div>
        <p>Beciegast nveriti vitaesaert a sety kertya aset aplicabo sere nerafae lorem ipsumod itaut miuyas. Monsequ senutur magni dolores eoqui ratione voluptate mseuqi nesciunt, neque porro quisquam est, qui dolorem ipsum, quia dolor sit, amet, consectetur, adipisci velit, sed quia non numquam eius modi tempora incidunt, ut labore et dolore magnam aliquam quaerat voluptatem.</p>
        <button>READ MORE</button>
      </div>
      
    </div>
  );
};

export default ImprovingSmileSection;
