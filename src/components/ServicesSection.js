import React from 'react';
import { Link } from 'react-router-dom'; // Import Link from react-router-dom
import '../css/PageDesign.css';

const ServiceItem = ({ iconClass, title, description, linkTo, imageSrc, buttonText }) => (
  <div className="col-lg-6 mb-5">
    <div className="service-item bg-light rounded d-flex flex-column align-items-center justify-content-center text-center">
      <div className="service-image mb-4">
        <img src={imageSrc} alt={title} style={{ width: '300px', height: '210px' }} />
      </div>
      <h4 className="mb-3">{title}</h4>
      <p className="m-0">{description}</p>
      <Link to={linkTo} className="btn btn-lg btn-primary rounded-pill">{buttonText}</Link>
    </div>
  </div>
);

const ServicesSection = () => {
  const services = [
    {
      iconClass: "fa fa-2x fa-user-md",
      title: "Script Translation and Summary",
      description: "이 서비스는 의사와 외국인 환자의 대화를 필사하고 필요한 언어로 번역하여 요약함으로써 의사와 외국인 환자 사이의 의사소통을 용이하게 합니다.",
      linkTo: "/polly", // Change this to the appropriate route
      imageSrc: "/images/Service1.png", // Change this to the path of the image
      buttonText: "대화 번역 및 요약"
    },
    {
      iconClass: "fa fa-2x fa-procedures",
      title: "Diagnosis Translation",
      description: "이 서비스는 병원에서 의사가 입력한 진단서의 내용을 번역하여 외국인 환자에게 SNS를 통해 제공함으로써 정확한 진단에 대한 이해를 돕습니다.",
      linkTo: "/reko", // Change this to the appropriate route
      imageSrc: "/images/Service2.png", // Change this to the path of the image
      buttonText: "진단서 번역"
    }
  ];

  return (
    <div className="services-container" id="service-section">
      <div className="container-fluid py-5">
        <div className="container">
          <div className="text-center mx-auto mb-5" style={{ maxWidth: '500px' }}>
            <h5 className="d-inline-block text-primary text-uppercase border-bottom border-5">
              Services</h5>
            <h1 className="display-4">AI MEDICO Services</h1>
          </div>
          <div className="row g-5">
            {services.map((service, index) => (
              <ServiceItem
                key={index}
                iconClass={service.iconClass}
                title={service.title}
                description={service.description}
                linkTo={service.linkTo}
                imageSrc={service.imageSrc}
                buttonText={service.buttonText}
              />
            ))}
          </div>
        </div>
      </div>
    </div>  
  );
};

export default ServicesSection;
