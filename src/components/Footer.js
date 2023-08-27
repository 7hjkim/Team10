import React from 'react';
import { Icon} from 'semantic-ui-react';
import '../css/Footer.css'; 

const Footer = () => {
  return (
    <div className="container-fluid text-light mt-5 py-5">
      <div className="container py-5">
        <div className="row justify-content-center g-5">
          {/* 연락처 정보 */}
          <div className="col-lg-3 col-md-6" style={styles.get_touch}>
            <h4 className="d-inline-block text-primary text-uppercase border-bottom border-5 border-secondary mb-4">
              Get In Touch
            </h4>
            {/* 연락처 정보 설명 */}
            <p className="mb-4">팀명: 3355팀 | 프로젝트명: AI MEDICO </p>
            <p><Icon name="map marker alternate" className="text-primary me-3" />경기도 성남시 수정구 산성대로 553 (양지동212)</p>
            <p className="mb-2"><Icon name="envelope" className="text-primary me-3" />Team3355@eulji.co.kr</p>
            <p className="mb-2" style={styles.copyright}>COPYRIGHT © 2023 AI MEDICO. ALL RIGHTS RESERVED.</p>
          </div>

          {/* 빠른 링크 */}
          <div className="col-lg-3 col-md-6">
            <h4 className="d-inline-block text-primary text-uppercase border-bottom border-5 border-secondary mb-4">
              Quick Links
            </h4>
            <div className="d-flex flex-column justify-content-start">
              {/* 각각의 빠른 링크 */}
              <a className="text-light mb-2" href="/"><Icon name="angle right" className="me-2" />Home</a>
              <a className="text-light mb-2" href="/script"><Icon name="angle right" className="me-2" />Script Translation and Summary</a>
              <a className="text-light mb-2" href="/reko"><Icon name="angle right" className="me-2" />Diagnosis Translation</a>
              <a className="text-light mb-2" href="/checkout"><Icon name="angle right" className="me-2" />Patient Info</a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Footer;

const styles = {
 get_touch: {
   width: '600px'
 },
 copyright: {
   marginTop: '30px'
 }
};