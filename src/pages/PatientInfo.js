import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Amplify, { API, graphqlOperation } from 'aws-amplify';
import { getPatient, listScripts, listDiagnoses } from '../graphql/queries';
import { Card, Image, Icon, Modal, Button } from 'semantic-ui-react';
import styled from 'styled-components';
import { Auth } from 'aws-amplify';
import AWS from 'aws-sdk';
import { useHistory } from 'react-router-dom';

// AWS 설정
AWS.config.update({ 
  region: 'ap-northeast-2',
  accessKeyId: 'AKIASQRH5MCLPRGVRSPL',
  secretAccessKey: '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'
});
const ses = new AWS.SES(); // Amazon Simple Email Service (SES) 객체 생성

//환자정보 함수
function PatientInfo() {
  const { patientId } = useParams();
  const [patient, setPatient] = useState(null);
  const [scripts, setScripts] = useState([]);
  const [diagnoses, setDiagnoses] = useState([]);
  const [selectedScript, setSelectedScript] = useState(null);
  const [selectedDiagnosis, setSelectedDiagnosis] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedScriptId, setSelectedScriptId] = useState(null);
  const [selectedDiagnosisId, setSelectedDiagnosisId] = useState(null);
  const [user, setUser] = useState(null);
  const [userEmail, setUserEmail] = useState('');
    const history = useHistory();

// 날짜 문자열을 변환하여 반환하는 함수
function convertToDate(dateString) {
  const year = dateString.substring(0, 2);
  const month = dateString.substring(2, 4);
  const day = dateString.substring(4, 6);
  return `${year}.${month}.${day}`;
}

  // 문자열 내 개행을 <br> 태그로 변환하는 함수
  function convertNewlineToBreak(str) {
    if (!str) return null;

    return str.split('\n').map((line, index) => (
      <span key={index}>
        {line}
        {index !== str.split('\n').length - 1 && <br />}
      </span>
    ));
  }
  
  
  
  
      function convertNewlineToBreak(str) {
        if (!str) return null;

        return str.split('\n').map((line, index) => (
            <span key={index}>
                {line}
                {index !== str.split('\n').length - 1 && <br />}
            </span>
        ));
    }

    function convertNewlineToString(str) {
        if (!str) return null;

        return str.replace(/\n/g, '<br/>');
    }


  useEffect(() => {
    // 현재 인증된 사용자 정보를 가져와서 사용자 상태에 설정
    async function fetchCurrentUser() {
      try {
        const authenticatedUser = await Auth.currentAuthenticatedUser();
        setUser(authenticatedUser);
        setUserEmail(authenticatedUser.attributes.email);
      } catch (error) {
        console.error("Error fetching current authenticated user:", error);
      }
    }
    
    // 환자 정보를 GraphQL을 통해 가져와서 환자 정보 상태에 설정
    async function fetchPatient() {
      try {
        const patientData = await API.graphql(graphqlOperation(getPatient, { id: patientId }));
        setPatient(patientData.data.getPatient);
      } catch (error) {
        console.error("Error fetching patient:", error);
      }
    }
    
    // 스크립트 정보를 GraphQL을 통해 가져와서 스크립트 정보 배열 상태에 설정
    async function fetchScripts() {
      try {
        const scriptData = await API.graphql(graphqlOperation(listScripts, {
          filter: { patientID: { eq: patientId } }
        }));
        setScripts(scriptData.data.listScripts.items);
      } catch (error) {
        console.error("Error fetching scripts:", error);
      }
    }
    
    // 진단서 정보를 GraphQL을 통해 가져와서 진단서 정보 배열 상태에 설정
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

    fetchCurrentUser();
    fetchPatient();
    fetchScripts();
    fetchDiagnoses();
  }, [patientId]);
  

const sendEmail = async (recipientEmail, subject, content) => {
    try {
      const userData = await Auth.currentUserInfo();
      const senderEmail = userData.attributes.email;

      const emailParams = {
        Source: senderEmail,
        Destination: {
          ToAddresses: [recipientEmail],
        },
        Message: {
          Subject: {
            Data: subject,
          },
          Body: {
            Html: {
              Data: content,
            },
          },
        },
      };

      await ses.sendEmail(emailParams).promise();
      return true;
    } catch (error) {
      console.error("Error sending email:", error);
      return false;
    }
};


  const handleScriptClick = (script) => {
    setSelectedScript(script);
    setModalOpen(true);
  };

  const handleDiagnosisClick = (diagnosis) => {
    setSelectedDiagnosis(diagnosis);
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setSelectedScript(null);
    setSelectedDiagnosis(null);
    setModalOpen(false);
  };

  const handleScriptLabelClick = (script) => {
    setSelectedScriptId(script.id);
    handleScriptClick(script);
  };

  const handleDiagnosisLabelClick = (diagnosis) => {
    setSelectedDiagnosisId(diagnosis.id);
    handleDiagnosisClick(diagnosis);
    
  };
  
    const handleScriptLabelChange = (script) => {
    setSelectedScriptId(script.id);
  };

  const handleDiagnosisLabelChange = (diagnosis) => {
    setSelectedDiagnosisId(diagnosis.id);
  };
  
    const handleBack = () => {
    history.goBack(); 
  };

const handleSendSelected = async () => {
  let scriptSent = false;
  let diagnosisSent = false;

  if (selectedScriptId) {
    const selectedScript = scripts.find(script => script.id === selectedScriptId);
    if (selectedScript) {
      const recipientEmail = patient.email;
      const emailSubject = "Selected Script";
      const formattedScript = selectedScript.script.replace(/(.*?,.*?),/g, "$1<br/>");
      const emailContent = `
        <div style="font-family: Arial, sans-serif; padding: 20px;">
          <h2 style="color: #333;">Script Details</h2>
          <p><strong>Date:</strong> ${new Date(selectedScript.date).toLocaleDateString()}</p>
          <p><strong>Script:</strong> ${formattedScript}</p>
          <hr style="margin: 20px 0;">
        </div>
      `;

      scriptSent = await sendEmail(recipientEmail, emailSubject, emailContent);
    }
  }

  if (selectedDiagnosisId) {
    const selectedDiagnosis = diagnoses.find(diagnosis => diagnosis.id === selectedDiagnosisId);
    if (selectedDiagnosis) {
      const recipientEmail = patient.email;
      const emailSubject = "Selected Diagnosis";
      const emailContent = `
        Date: ${new Date(selectedDiagnosis.date).toLocaleDateString()}
        Diagnosis: ${convertNewlineToString(selectedDiagnosis.diagnosis)}
      `;

      diagnosisSent = await sendEmail(recipientEmail, emailSubject, emailContent);
    }
  }

  if (scriptSent || diagnosisSent) {
    alert("메일이 성공적으로 전송되었습니다."); 
  }
};


  return (
    <Container>
      <ContentContainer>
        <PatientCard>
          {patient ? (
            <Card>
              <Image src='https://react.semantic-ui.com/images/avatar/large/matthew.png' wrapped ui={false} />
              <Card.Content>
                <div>{patient.name}</div>
             
                <Card.Meta>
                 <span className='date'>{convertToDate(patient.birth)}</span>


                </Card.Meta>
                <Card.Description>
                  <p><Icon name='mail outline' color="blue" /> {patient.email}</p>
                  <p><Icon name='phone' color="green" /> {patient.phone}</p>
                </Card.Description>
              </Card.Content>
            </Card>
          ) : (
            <p>Loading...</p>
          )}
        </PatientCard>
   <DataContainer>
          <SectionHeader>Scripts & Summary</SectionHeader>
<ScrollableContainer>
  {scripts.map(script => (
    <DataItem key={script.id}>
      <input
        type="radio"
        id={`script-${script.id}`}
        name="scriptSelection"
        value={script.id}
        checked={selectedScriptId === script.id}
        onChange={() => handleScriptLabelChange(script)}
      />
      <Label htmlFor={`script-${script.id}`} onClick={() => handleScriptLabelClick(script)}>
        {new Date(script.date).toLocaleDateString()}
      </Label>
    </DataItem>
  ))}
</ScrollableContainer>


          <SectionHeader>Medical Reports</SectionHeader>
          <ScrollableContainerDiagnoses>
            {diagnoses.map(diagnosis => (
<DataItem key={diagnosis.id}>
  <input
    type="radio"
    id={`diagnosis-${diagnosis.id}`}
    name="diagnosisSelection"
    value={diagnosis.id}
    checked={selectedDiagnosisId === diagnosis.id}
    onChange={() => handleDiagnosisLabelChange(diagnosis)}
  />
  <Label htmlFor={`diagnosis-${diagnosis.id}`} onClick={() => handleDiagnosisLabelClick(diagnosis)}>
    {new Date(diagnosis.date).toLocaleDateString()}
  </Label>
</DataItem>
            ))}
          </ScrollableContainerDiagnoses>

<ButtonContainer>
  <Button onClick={handleBack}>Back</Button>
  <Button color="orange" onClick={handleSendSelected}>Send</Button>
</ButtonContainer>
        </DataContainer>
      </ContentContainer>

      <Modal open={modalOpen} onClose={handleCloseModal} size="small" style={{height: '300px', position: 'fixed', top: '50%', left:'50%', transform: 'translate(-50%, -50%)'}}>
        <Modal.Header>Details</Modal.Header>
        <Modal.Content>
          {selectedScript && (
            <div>
              <p><strong>Date:</strong> {new Date(selectedScript.date).toLocaleDateString()}</p>
              <p><strong>Script:</strong> {convertNewlineToBreak(selectedScript.script)}</p>
              <p><strong>Summary:</strong> {convertNewlineToBreak(selectedScript.summary)}</p>
            </div>
          )}
          {selectedDiagnosis && (
            <div>
              <p><strong>Date:</strong> {new Date(selectedDiagnosis.date).toLocaleDateString()}</p>
              <p><strong>Diagnosis:</strong> {convertNewlineToBreak(selectedDiagnosis.diagnosis)}</p>
            </div>
          )}
        </Modal.Content>
        <Modal.Actions>
          <Button onClick={handleCloseModal}>Close</Button>
        </Modal.Actions>
      </Modal>
    </Container>
  );
}
const Container = styled.div`
  width: 70%;
  max-width: 1200px; // 원하는 최대 폭을 설정하세요. 필요에 따라 조정해 주세요.
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center; // 수직 방향 중앙 정렬
  margin: 50px auto; // 수평 방향 중앙 정렬
  background-color: #f8f8f8;
  padding: 40px 0;
  height: 100vh; // 화면 높이에 맞게 설정
  box-sizing: border-box;
`;

const ContentContainer = styled.div`
  width: 80%;
  display: flex;
  justify-content: space-between;
  background-color: #ffffff;
  padding: 40px 30px; /* Increase vertical padding to 40px */
  border-radius: 10px;
  box-shadow: 0 3px 10px rgba(0, 0, 0, 0.1);
`;

const PatientCard = styled.div`
  flex: 1;
  margin-right: 20px;
  .card {
    border-radius: 10px !important;
  }
`;

const DataContainer = styled.div`
  flex: 2;
`;

const SectionHeader = styled.h3`
  margin-bottom: 10px;
  color: #317873;
  border-bottom: 2px solid #317873;
  padding-bottom: 5px;
`;

const ScrollableContainer = styled.div`
  max-height: 200px;
  overflow-y: auto;
  border: 1px solid #ddd;
  padding: 10px;
  margin-bottom: 20px;
  border-radius: 10px;
`;

const ScrollableContainerDiagnoses = styled(ScrollableContainer)``;

const DataItem = styled.div`
  display: flex;
  align-items: center;
  cursor: pointer;
  padding: 5px 0;
  transition: background-color 0.3s;

  &:hover {
    background-color: #ffebcd;
  }

  input[type="radio"] {
    margin-right: 10px;
  }
`;

const ButtonContainer = styled.div`
  display: flex;
  justify-content: flex-end;
  margin-top: 20px;
`;

const Label = styled.label`
  display: block;
  margin-left: 10px;
  cursor: pointer;
`;



export default PatientInfo;