import React from 'react';
import '../css/bootstrap.min.css';
import { Image } from 'semantic-ui-react';
import '../css/PageDesign.css'; 

// 팀 멤버 컴포넌트
const TeamMember = ({ name, university, major, imageSrc }) => (
  <div className="col-sm-4 col-md-2">
    <div className="team-member bg-light rounded d-flex flex-column align-items-center justify-content-center text-center" style = {styles.team_container}>
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
  // 팀 멤버 정보 배열
  const teamMembers = [
    {
      name: "김현준",
      university: "을지대학교",
      major: "의료IT학과",
      imageSrc: "../images/member1.jpg"
    },
    {
      name: "김도현",
      university: "명지대학교",
      major: "데이터테크놀로지학과",
      imageSrc: "../images/member2.jpg"
    },
    {
      name: "문지은",
      university: "방송통신대학교",
      major: "통계학과",
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
      university: "단국대학교",
      major: "정보통계학과",
      imageSrc: "../images/member5.jpg"
    },
    {
      name: "이준호",
      university: "을지대학교",
      major: "의료IT마케팅학과",
      imageSrc: "../images/member6.jpg"
    },
  ];

  // 팀 소개 문구
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

const styles = {
  team_container: {
    height: '300px',
    width: '200px',
    margin: 'auto'
  }
};
