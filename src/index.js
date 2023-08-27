import React from 'react';
import ReactDOM from 'react-dom';
import { Route, BrowserRouter as Router, Switch } from 'react-router-dom'
import Amplify from 'aws-amplify'

import AppProvider from './context/AppProvider'

import App from './App';
import Info from './pages/Info'
import Reko from './pages/Reko'
import Script from './pages/Script'
import Summary from './pages/Summary';
import PatientInfo from './pages/PatientInfo';  // PatientInfo의 실제 경로로 변경해주세요.

import awsconfig from './aws-exports'
// import { ChatProvider } from './ChatContext';

Amplify.configure(awsconfig)

const routing = (
    <AppProvider>
        <Router>
            <Switch>
                <Route exact path="/" component={App} />
                <Route path="/info" component={Info} />
                <Route path="/script" component={Script} />
                <Route path="/reko" component={Reko} />
                <Route path="/Summary" component={Summary} />
                <Route path="/patient/:patientId" component={PatientInfo} />  {/* PatientInfo 라우트 추가 */}
                <Route component={App} />
            </Switch>
        </Router>
    </AppProvider>
)

ReactDOM.render(routing, document.getElementById('root'));

