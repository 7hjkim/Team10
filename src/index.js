import React from 'react';
import ReactDOM from 'react-dom';
import { Route, BrowserRouter as Router, Switch } from 'react-router-dom'
import Amplify from 'aws-amplify'

import AppProvider from './context/AppProvider'

import App from './App';
import Product from './pages/Product'
import Checkout from './pages/Checkout'
import PlacedOrder from './pages/PlacedOrder'
import Reko from './pages/Reko'
import Polly from './pages/Polly'
import Summary from './pages/Summary';
import PatientInfo from './pages/PatientInfo';  // PatientInfo의 실제 경로로 변경해주세요.

import awsconfig from './aws-exports'
import { ChatProvider } from './ChatContext';

Amplify.configure(awsconfig)

const routing = (
    <AppProvider>
        <Router>
            <Switch>
                <ChatProvider>
                    <Route exact path="/" component={App} />
                    <Route path="/product/:id" component={Product} />
                    <Route path="/checkout" component={Checkout} />
                    <Route path="/ordercomplete" component={PlacedOrder}/>
                    <Route path="/Polly" component={Polly} />
                    <Route path="/reko" component={Reko} />
                    <Route path="/Summary" component={Summary} />
                    <Route path="/patient/:patientId" component={PatientInfo} />  {/* PatientInfo 라우트 추가 */}
                </ChatProvider>
                <Route component={App} />
            </Switch>
        </Router>
    </AppProvider>
)

ReactDOM.render(routing, document.getElementById('root'));
