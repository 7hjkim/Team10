import React from 'react';
import { Link } from 'react-router-dom'; // react-router-dom에서 Link를 불러옴
import '../css/PageDesign.css';

// 각 서비스 아이템을 표시하는 함수형 컴포넌트
const ServiceItem1 = ({ iconClass, title, description1, description2, description3, linkTo, imageSrc, buttonText }) => (
  <div className="col-lg-6 mb-5">
    <div className="service-item bg-light rounded d-flex flex-column justify-content-center" style={styles.service_container}>
      <div className="service-image mb-4 align-items-center">
        <img src={imageSrc} alt={title} style={{ width: '300px', height: '280px' }} />
      </div>
      <h4 className="mb-3">{title}</h4>
      <div style={styles.description1}>
        <p className="m-0">{description1}</p>
      </div>
      <div style={styles.description1}>
        <p className="m-0 text-start">{description2}</p>
      </div>
      <div style={styles.description1}>
        <p className="m-0 text-start">{description3}</p>
      </div>
      <Link to={linkTo} className="btn btn-lg btn-primary rounded-pill" style={styles.service_button}>{buttonText}</Link>
    </div>
  </div>
);

const ServiceItem2 = ({ iconClass, title, description1, description2, description3, linkTo, imageSrc, buttonText }) => (
  <div className="col-lg-6 mb-5">
    <div className="service-item bg-light rounded d-flex flex-column justify-content-center" style={styles.service_container}>
      <div className="service-image mb-4 align-items-center">
        <img src={imageSrc} alt={title} style={{ width: '300px', height: '280px' }} />
      </div>
      <h4 className="mb-3">{title}</h4>
      <div style={styles.description2}>
        <p className="m-0">{description1}</p>
      </div>
      <div style={styles.description2}>
        <p className="m-0 text-start">{description2}</p>
      </div>
      <div style={styles.description2}>
        <p className="m-0 text-start">{description3}</p>
      </div>
      <Link to={linkTo} className="btn btn-lg btn-primary rounded-pill" style={styles.service_button}>{buttonText}</Link>
    </div>
  </div>
);

// 서비스 섹션 컴포넌트
const ServicesSection = () => {
  const services1 = [
    {
      iconClass: "fa fa-2x fa-user-md",
      title: "실시간 음성인식 및 텍스트 번역 요약 서비스",
      description1: "▶ 실시간 음성인식 후 텍스트로 변환",
      description2: "▶ 텍스트 실시간 양방향 번역",
      description3: "▶ 진료 대화 요약",
      linkTo: "/polly", // 해당 경로로 수정
      imageSrc: "/images/Script.png", // 이미지 경로로 수정
      buttonText: "대화 번역 및 요약"
    }
  ];
  const services2 = [
    {
      iconClass: "fa fa-2x fa-procedures",
      title: "진단서 번역 및 이메일 발송 서비스",
      description1: "▶ 진단서 내용 번역",
      description2: " ",
      description3: "▶ 환자 이메일로 진단서 전송",
      linkTo: "/reko", // 해당 경로로 수정
      imageSrc: "/images/Diagnosis.png", // 이미지 경로로 수정
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
            {services1.map((service, index) => (
              <ServiceItem1
                key={index}
                iconClass={service.iconClass}
                title={service.title}
                description1={service.description1}
                description2={service.description2}
                description3={service.description3}
                linkTo={service.linkTo}
                imageSrc={service.imageSrc}
                buttonText={service.buttonText}
              />
            ))}
              {services2.map((service, index) => (
              <ServiceItem2
                key={index}
                iconClass={service.iconClass}
                title={service.title}
                description1={service.description1}
                description2={service.description2}
                description3={service.description3}
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

// 스타일 정의
const styles = {
  description1: {
    textAlign: 'left',
    marginLeft: '45px',
    marginBottom: '10px',
  },
  description2: {
    textAlign: 'left',
    marginLeft: '100px',
    marginBottom: '16px',
  },
  service_container: {
    height: '600px',
  },
  service_button: {
    marginBottom: `10px`,
  }
};
