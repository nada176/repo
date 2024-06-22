import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import NavigationBar from './components/NavigationBar/NavigationBar';
import Footer from './components/Footer/Footer';
import Home from './pages/Home/Home';
import Services from './pages/Services/Services';
import './App.css';

const App = () => {
  return (
    <Router>
      <div className="App">
        <NavigationBar />
        <Routes>
  <Route path="/" element={<Home key="home" />} />
  <Route path="/services" element={<Services key="services" />} />
</Routes>

        <Footer />
      </div>
    </Router>
  );
};

export default App;
