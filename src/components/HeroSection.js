import React from 'react';
import '../css/HeroSection.css'; // Make sure to import your custom CSS file for styling

const HeroSection = () => {
  const heroBackground = {
    backgroundImage: `url('../images/hero.jpg')`,
    backgroundSize: 'cover',
    backgroundPosition: 'center top'
  };

  return (
    <div className="container-fluid bg-primary py-5 mb-5 hero-header" style={heroBackground} id="hero-section">
      <div className="container py-5">
        <div className="row justify-content-start">
          <div className="col-lg-8 text-center text-lg-start">
            <h3 className="d-inline-block text-primary text-uppercase border-bottom border-5" style={{ borderColor: 'rgba(256, 256, 256, .3)' }}>Welcome To AI Medico</h3>
            <h1 className="display-1 text-white mb-md-4">AI Medical Coordinator</h1>
            <div className="pt-2">
              <a href="" className="btn btn-light rounded-pill py-md-3 px-md-5 mx-2">대화 번역 및 요약</a>
              <a href="" className="btn btn-outline-light rounded-pill py-md-3 px-md-5 mx-2">진단서 번역</a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
