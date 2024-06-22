import React from 'react';
import { FaUser, FaShoppingBasket } from 'react-icons/fa';
import { FiCamera } from 'react-icons/fi';
import './ServicesSection.css';

const ServiceCard = ({ Icon, title, description }) => (
  <div className="serviceCard">
    <Icon className="serviceIcon" />
    <h3 className="serviceTitle">{title}</h3>
    <p className="serviceDescription">{description}</p>
    <button className="moreButton">More</button>
  </div>
);

const ServicesSection = () => {
  return (
    <div className="servicesSection">
      <ServiceCard 
        Icon={FaUser} 
        title="MUTASA KRAIUSE FASADIRTA"
        description="Ersvitaer tyasemosera voleres natur auditut..."
      />
      <ServiceCard 
        Icon={FiCamera} 
        title="GEROS VASERERIAS LYTRASAS"
        description="Nertyane ritasertases ecaboes metrasa..."
      />
      <ServiceCard 
        Icon={FaShoppingBasket} 
        title="DASERTA VERONAS CERASAS MIAS"
        description="Beciegast nvetasaert asetyeas aset..."
      />
    </div>
  );
};

export default ServicesSection;
