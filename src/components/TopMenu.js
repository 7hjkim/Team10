import React, { useContext, useEffect, useState } from 'react';
import { Icon, Image, Input, Menu, Button, Dropdown } from 'semantic-ui-react';
import { Link, useHistory } from 'react-router-dom';
import AppContext from '../context/AppContext';
import { Auth } from 'aws-amplify';
import '../css/TopMenu.css'; // Import your custom CSS file for styling

function TopMenu() {
  const { user, cart } = useContext(AppContext);
  const history = useHistory(); // Initialize useHistory

  function getAtt(name) {
    return user ? user[name] : '';
  }
  
  useEffect(() => {
    getAtt();
  }, []);

  async function signOut() {
    try {
      await Auth.signOut();
      // Redirect to the home page after logout
      history.push('/');
    } catch (error) {
      console.log('error signing out: ', error);
    }
  }
  
  function backToHome() {
    // Go to the homepage when logo-item is clicked
    history.push('/');
  }
  
  function scrollToAboutSection() {
    const aboutSection = document.getElementById('about-section');
    if (aboutSection) {
      const offset = 100;
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
      window.scrollTo({
        top: serviceSection.offsetTop - offset,
        behavior: 'smooth'
      });
    }
  }

  return (
    <div className="top-menu-container">
      <Menu fixed="top" borderless inverted className="custom-menu">
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
              <Dropdown.Item as={Link} to="/polly">Script Translate</Dropdown.Item>
              <Dropdown.Item as={Link} to="/reko">Diagnosis Translate</Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
          {user ? (
            <Menu.Item className="user-item">
              <span className="user-name">{getAtt('given_name') + ' ' + getAtt('family_name')}</span>
              <span className="user-buttons">
                <Button onClick={signOut}>Logout</Button>
              </span>
            </Menu.Item>
          ) : (
            <Menu.Item className="user-item">
              <Button as={Link} to="/login">Login</Button>
            </Menu.Item>
          )}
          <Menu.Item as={Link} to="/checkout" className="patient-item">
            <Button
              color="yellow"
              icon="user md"
              content="Info"
            />
          </Menu.Item>
        </Menu.Menu>
      </Menu>
    </div>
  );
}

export default TopMenu;
