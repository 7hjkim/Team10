import React from 'react'
import { Container, Header } from 'semantic-ui-react'
import { withAuthenticator } from 'aws-amplify-react'
import { BrowserRouter as Router, Route, Switch, Link } from 'react-router-dom';

import signUpConfig from './config/signUpConfig'

import InitState from './pages/InitState'
import TopMenu from './components/TopMenu'
import HeroSection from './components/HeroSection'
import ServicesSection from './components/ServicesSection'
import AboutSection from './components/AboutSection'
import Footer from './components/Footer'

import './App.css'

class App extends React.Component {
    constructor(props, context) {
      super(props, context);
    }
  
    render() {
        if (this.props.authState == "signedIn") {
            return functionApp();
        } else {
            return null;
        }
    }
  }
  
function functionApp() {
    return (

        <div style={styles}>
            <InitState />
            <TopMenu />
            <AppContent />
        </div>
    );
}

function AppContent() {
    return (
        <div className="App">
         <HeroSection />
         <ServicesSection />
         <AboutSection />
          <Footer />
        </div>
    );
}


export default withAuthenticator(App, { signUpConfig })

const styles = {
    marginLeft: '1em',
    marginRight: '1em'
}