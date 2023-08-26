import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Amplify, { API, graphqlOperation } from 'aws-amplify';
import { getPatient } from '../graphql/queries';
import { listScripts } from '../graphql/queries';
import { listDiagnoses } from '../graphql/queries';
import { Card, Image, Icon, Modal, Button} from 'semantic-ui-react';  // 필요한 Semantic UI React 컴포넌트를 임포트합니다.
import styled from 'styled-components';

const scrollableContainerStyle = {
  maxHeight: '300px', // 원하는 높이로 설정하세요.
  overflowY: 'scroll',
};

function PatientInfo() {
  const { patientId } = useParams();
  const [patient, setPatient] = useState(null);
  const [scripts, setScripts] = useState([]);
  const [diagnoses, setDiagnoses] = useState([]);
  const [selectedScript, setSelectedScript] = useState(null); // 선택한 스크립트를 저장할 상태
  const [selectedDiagnosis, setSelectedDiagnosis] = useState(null);
  const [modalOpen, setModalOpen] = useState(false); // 모달 열기/닫기 상태

  useEffect(() => {
    async function fetchPatient() {
      try {
        const patientData = await API.graphql(graphqlOperation(getPatient, { id: patientId }));
        setPatient(patientData.data.getPatient);
      } catch (error) {
        console.error("Error fetching patient:", error);
      }
    }
    
    async function fetchScripts() {
      try {
        // Script 테이블에서 특정 patientId와 일치하는 스크립트 목록을 가져옵니다.
        const scriptData = await API.graphql(graphqlOperation(listScripts, {
          filter: { patientID: { eq: patientId } }
        }));
        setScripts(scriptData.data.listScripts.items);
      } catch (error) {
        console.error("Error fetching scripts:", error);
      }
    }
    
    async function fetchDiagnoses() {
      try {
        const diagnosisData = await API.graphql(graphqlOperation(listDiagnoses, {
          filter: { patientID: { eq: patientId } }
        }));
        setDiagnoses(diagnosisData.data.listDiagnoses.items);
      } catch (error) {
        console.error("Error fetching diagnoses:", error);
      }
    }

    fetchPatient();
    fetchScripts();
    fetchDiagnoses();
  }, [patientId]);
  
  const handleScriptClick = (script) => {
    setSelectedScript(script); // 선택한 스크립트 설정
    setModalOpen(true); // 모달 열기
  };
  
  const handleDiagnosisClick = (diagnosis) => {
    setSelectedDiagnosis(diagnosis);
    setModalOpen(true);
  };

  // 모달 닫기 핸들러
  const handleCloseModal = () => {
    setSelectedScript(null); // 선택한 스크립트 초기화
    setModalOpen(false); // 모달 닫기
  };

  return (
    <div>
      {patient ? (
        <Card>
          <Image src='https://react.semantic-ui.com/images/avatar/large/matthew.png' wrapped ui={false} />  {/* 환자의 이미지를 표시하려면 이 URL을 변경하세요 */}
          <Card.Content>
            <Card.Header>{patient.name}</Card.Header>
            <Card.Meta>
              <span className='date'>{patient.birth}</span>
            </Card.Meta>
            <Card.Description>
              <p><Icon name='mail outline' /> {patient.email}</p>
              <p><Icon name='phone' /> {patient.phone}</p>
            </Card.Description>
          </Card.Content>
        </Card>
      ) : (
        <p>Loading...</p>
      )}
      
      <h2>Scripts</h2>
      <ScrollableContainer style={scrollableContainerStyle}>
        {scripts.map(script => (
          <div key={script.id} onClick={() => handleScriptClick(script)}>
            <p>{script.date}</p>
          </div>
        ))}
      </ScrollableContainer>
      
      <h2>Diagnoses</h2>
      <ScrollableContainer style={scrollableContainerStyle}>
        {diagnoses.map(diagnosis => (
          <div key={diagnosis.id} onClick={() => handleDiagnosisClick(diagnosis)}>
            <p>{diagnosis.date}</p>
          </div>
        ))}
      </ScrollableContainer>
      
      
      <Modal open={modalOpen} onClose={handleCloseModal} size="small">
        <Modal.Header>Script Details</Modal.Header>
        <Modal.Content>
          {selectedScript && (
            <div>
              <p>Date: {selectedScript.date}</p>
              <p>Script: {selectedScript.script}</p>
              <p>Summary: {selectedScript.summary}</p>
            </div>
          )}
          {selectedDiagnosis && (
            <div>
              <p>Date: {selectedDiagnosis.date}</p>
              <p>Diagnosis: {selectedDiagnosis.diagnosis}</p>
            </div>
          )}
        </Modal.Content>
        <Modal.Actions>
          <Button onClick={handleCloseModal}>Close</Button>
        </Modal.Actions>
      </Modal>
      
    </div>
  );
}

export default PatientInfo;

const ScrollableContainer = styled.div`
    max-width: 1000px; /* 예시로 가로 크기 제한 */
    max-height: 600px; 
    overflow-y: auto;
    padding: 10px;
    border: 1px solid #ccc;
    margin-bottom: 20px;
`;