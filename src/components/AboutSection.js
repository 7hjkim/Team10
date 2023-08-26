import React from 'react';
import '../css/bootstrap.min.css';
import { Container, Header, Image } from 'semantic-ui-react';
import '../css/PageDesign.css'; // Import your CSS file for styling

const TeamMember = ({ name, university, major, imageSrc }) => (
  <div className="col-sm-4 col-md-2">
    <div className="team-member bg-light rounded d-flex flex-column align-items-center justify-content-center text-center">
      <div className="member-avatar mb-3">
        <Image src={imageSrc} size='medium'  circular style={{ width: '120px', height: '130px' }}/>
      </div>
      <h6 className="mb-0">{name}</h6>
      <p/>
      <p className="m-0">{university}</p>
      <p className="m-1">{major}</p>
    </div>
  </div>
);

const AboutSection = () => {
  const teamMembers = [
    {
      name: "김현준",
      university: "을지대학교",
      major: "의료IT학과",
      imageSrc: "../images/member1.jpg"
    },
    {
      name: "김도현",
      university: "-",
      major: "-",
      imageSrc: "../images/member2.jpg"
    },
    {
      name: "문지은",
      university: "-",
      major: "-",
      imageSrc: "../images/member3.jpg"
    },
    {
      name: "석지우",
      university: "을지대학교",
      major: "의료IT학과",
      imageSrc: "../images/member4.jpg"
    },
    {
      name: "이재훈",
      university: "-",
      major: "-",
      imageSrc: "../images/member5.jpg"
    },
    {
      name: "이준호",
      university: "을지대학교",
      major: "의료IT마케팅학과",
      imageSrc: "../images/member6.jpg"
    },
  ];

  const teamDescription = "우리 팀은 을지대학교 학생 3명과 타 대학 학생 3명의 시너지를 상징하는 '3355팀'이라는 개념을 수용해 AI 의료 코디네이터 프로젝트에 공동으로 착수했습니다.";

  return (
    <div className="about-container" id="about-section">
      <div className="container-fluid py-5">
        <div className="container">
          
          <div className="text-center mx-auto mb-5" style={{ maxWidth: '500px' }}>
            <h5 className="d-inline-block text-primary text-uppercase border-bottom border-5">About Us</h5>
            <h1 className="display-4">Meet Our Team</h1>
            <p className="lead">{teamDescription}</p>
          </div>
          <div className="row g-5">
            {teamMembers.map((member, index) => (
              <TeamMember
                key={index}
                name={member.name}
                university={member.university}
                major={member.major}
                imageSrc={member.imageSrc}
              />
            ))}
          </div>
        </div>
      </div>
      
    </div>
    
  );
};

export default AboutSection;
