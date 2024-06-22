import React from 'react';
import HeroHome from '../../components/Hero/HeroHome';
import WelcomeSection from '../../components/WelcomeSection/WelcomeSection';
import ServicesSection from '../../components/ServiceCard/ServiceCard';
import StepByStepSection from '../../components/StepByStepSection/StepByStepSection';
import NewsEventsSection from '../../components/NewsEventsSection/NewsEventsSection';
import ImprovingSmileSection from '../../components/ImprovingSmileSection/ImprovingSmileSection';
import AdvantagesSection from '../../components/AdvantagesSection/AdvantagesSection';
import PromoSection from '../../components/PromoSection/PromoSection';

const Home = () => {
  return (
    <div>
      <HeroHome />
      <WelcomeSection />
      <ServicesSection />
      <StepByStepSection />
      <NewsEventsSection />
      <ImprovingSmileSection />
      <AdvantagesSection />
      <PromoSection />
    </div>
  );
};

export default Home;
