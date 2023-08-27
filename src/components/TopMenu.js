import React, { useContext, useEffect, useState } from 'react';
import { Icon, Image, Input, Menu, Button, Dropdown } from 'semantic-ui-react';
import { Link, useHistory } from 'react-router-dom';
import AppContext from '../context/AppContext';
import { Auth } from 'aws-amplify';
import '../css/TopMenu.css'; 

function TopMenu() {
  const { user, cart } = useContext(AppContext); // 앱 컨텍스트의 사용자 정보와 카트 정보 가져오기
  const history = useHistory(); // useHistory 초기화

  function getAtt(name) {
    return user ? user[name] : ''; // 사용자 정보에서 특정 속성값 가져오기
  }
  
  useEffect(() => {
    getAtt(); // 컴포넌트가 마운트되었을 때 사용자 정보 가져오기
  }, []);

  async function signOut() {
    try {
      await Auth.signOut(); // 로그아웃 시도
      // 로그아웃 후 홈 페이지로 리다이렉트
      history.push('/');
    } catch (error) {
      console.log('error signing out: ', error);
    }
  }
  
  function backToHome() {
    // 로고 아이템 클릭 시 홈 페이지로 이동
    history.push('/');
  }
  
  function scrollToAboutSection() {
    const aboutSection = document.getElementById('about-section');
    if (aboutSection) {
      const offset = 100;
      // 'About Us' 섹션으로 부드럽게 스크롤
      window.scrollTo({
        top: aboutSection.offsetTop - offset,
        behavior: 'smooth'
      });
    }
  }

  function scrollToServiceSection() {
    const serviceSection = document.getElementById('service-section');
    if (serviceSection) {
      const offset = 100;
      // 'Services' 섹션으로 부드럽게 스크롤
      window.scrollTo({
        top: serviceSection.offsetTop - offset,
        behavior: 'smooth'
      });
    }
  }

  return (
    <div className="top-menu-container">
      <Menu fixed="top" borderless inverted className="test" >
        <Menu.Item as={Link} to="/" className="logo-item" onClick={backToHome}>
          <Image src='/images/AI MEDICO logo.png' className="ui medium image" />
        </Menu.Item>
        <Menu.Menu position="right">
          <Dropdown item text="Home" className="menu-item" simple>
            <Dropdown.Menu>
              <Dropdown.Item onClick={scrollToServiceSection}>Services</Dropdown.Item>
              <Dropdown.Item onClick={scrollToAboutSection}>About Us</Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
          <Dropdown item text="Service Pages" className="menu-item" simple>
            <Dropdown.Menu>
              <Dropdown.Item as={Link} to="/script">Scripts & Summary</Dropdown.Item>
              <Dropdown.Item as={Link} to="/reko">Medical Reports</Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
          {user ? (
            <Menu.Item className="user-item">
              <span className="user-name">{getAtt('given_name')}</span>
              <span className="user-buttons">
                <Button onClick={signOut}>Logout</Button>
              </span>
            </Menu.Item>
          ) : (
            <Menu.Item className="user-item">
              <Button as={Link} to="/login">Login</Button>
            </Menu.Item>
          )}
          <Menu.Item as={Link} to="/info" className="patient-item" style={styles.patient_item}>
            <Button
              style={styles.info_button}
              icon="info"
              content="Info"
            />
          </Menu.Item>
        </Menu.Menu>
      </Menu>
    </div>
  );
}

export default TopMenu;

// 스타일 정의
const styles = {
  info_button: {
    backgroundColor: '#13c5dd',
    color: 'white',
    iconColor: 'white',
  },
  patient_item: {
    marginRight: '1.5rem',
  },
};
