import React from 'react'
import { withAuthenticator } from 'aws-amplify-react';

import signUpConfig from './config/signUpConfig'

import InitState from './pages/InitState'
import TopMenu from './components/TopMenu'
import Carousel from './components/Carousel'
import ServicesSection from './components/ServicesSection'
import AboutSection from './components/AboutSection'
import Footer from './components/Footer'

import './App.css'

class App extends React.Component {
    constructor(props, context) {
        super(props, context);
    }
  
    render() {
        if (this.props.authState === "signedIn") { // 사용자 인증 상태를 확인하여 렌더링 결정
            return functionApp(); // 사용자가 로그인한 경우 functionApp 컴포넌트 렌더링
        } else {
            return null; // 로그인하지 않은 경우 null 반환하여 아무것도 렌더링하지 않음
        }
    }
}

// 사용자가 로그인한 경우에 렌더링되는 컴포넌트
function functionApp() {
    return (
        <div style={styles}>
            <InitState />
            <TopMenu />
            <AppContent />
        </div>
    );
}

// 앱 내용을 렌더링하는 컴포넌트
function AppContent() {
    return (
        <div className="App">
            <Carousel />
            <ServicesSection />
            <AboutSection />
            <Footer />
        </div>
    );
}

// AWS Amplify 인증 기능을 적용한 후, App 컴포넌트를 내보내기
export default withAuthenticator(App, { signUpConfig });

// 스타일 정의
const styles = {
    marginLeft: '1em',
    marginRight: '1em'
}