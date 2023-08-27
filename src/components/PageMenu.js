import React, { useContext, useEffect } from 'react';
import { Image, Menu, Button } from 'semantic-ui-react';
import { Link, useHistory } from 'react-router-dom';
import AppContext from '../context/AppContext';
import { Auth } from 'aws-amplify';
import '../css/TopMenu.css';

function PageMenu() {
  const { user } = useContext(AppContext);
  const history = useHistory(); // useHistory를 초기화하여 페이지 이동을 관리

  // 사용자의 이름을을 가져오는 함수
  function getAtt(name) {
    return user ? user[name] : '';
  }
  
  useEffect(() => {
    getAtt();
  }, []);
  
  // 로그아웃 함수
  async function signOut() {
    try {
      await Auth.signOut();
      // 로그아웃 후 홈 페이지로 리다이렉트
      history.push('/');
    } catch (error) {
      console.log('error signing out: ', error);
    }
  }
  
  // 홈 페이지로 이동하는 함수
  function backToHome() {
    history.push('/');
  }

  return (
    <div className="top-menu-container">
      <Menu fixed="top" borderless inverted className="custom-menu">
        <Menu.Item as={Link} to="/" className="logo-item" onClick={backToHome}>
          <Image src='/images/AI MEDICO logo.png' className="ui medium image" />
        </Menu.Item>
        <Menu.Menu position="right">
          <Menu.Item as={Link} to="/script" className="menu-item">
            Script Translate
          </Menu.Item>
          <Menu.Item as={Link} to="/reko" className="menu-item">
            Diagnosis Translate
          </Menu.Item>
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

export default PageMenu;

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
