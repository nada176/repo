import React from 'react';
import './AdvantagesSection.css';

const AdvantageItem = ({ title, text }) => (
  <div className="col-md-4 advantage-item">
    <h3>{title}</h3>
    <p>{text}</p>
    <button className="btn btn-primary">READ MORE</button>
  </div>
);

const AdvantagesSection = () => {
  return (
    <div className="container advantages-section">
      <div className="row">
        <AdvantageItem
          title="Easy to remove"
          text="Caertrsra vaesare rafreatrs ertyasea slasec vastpai aotaryse squem ipsmuia doamct amodi tea incidunt."
        />
        <AdvantageItem
          title="No drilling"
          text="Saftey seyteras ertya eerrtsra vaesas ertayse squrem ipsum quioislasvec vastpais alor. Ceramodi stincidun tanamet."
        />
        <AdvantageItem
          title="Safe & Viable"
          text="Leramodi tea incidamet. Dafafes setyras ertya eaerrtsra vaesastarsye qurem ipsum quioislasvec vastpais alor."
        />
      </div>
    </div>
  );
};

export default AdvantagesSection;
