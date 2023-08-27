import React, { useState, useEffect } from 'react';

import Amplify from 'aws-amplify';
import { API, graphqlOperation } from 'aws-amplify';
import { createDiagnosis } from '../graphql/mutations';
import { listPatients } from '../graphql/queries';
import awsExports from "../aws-exports";
import { Dropdown } from 'semantic-ui-react'
import InitState from './InitState';
import PageMenu from '../components/PageMenu';

Amplify.configure(awsExports);

const MedicalCertificate = (props) => {
    // 환자 정보 및 진단서 관련 상태 변수
    const [patientName, setPatientName] = useState(''); 
    const [onsetDate, setOnsetDate] = useState(''); 
    const [diagnosis, setDiagnosis] = useState(''); 
    const [treatment, setTreatment] = useState(''); 
    const [futureTreatment, setFutureTreatment] = useState(''); 
    const [nextAppointment, setNextAppointment] = useState(''); 
    const [translatedContent, setTranslatedContent] = useState(''); 
    
    // 환자 목록 및 선택된 환자 관련 상태 변수
    const [items, setItems] = useState([]); 
    const [selectedName, setSelectedName] = useState(''); 
    const [SelectedEmail, setSelectedEmail] = useState(''); 
    const [SelectedId, setSelectedId] = useState(''); 
    
    const dropdownStyle = {
        marginTop: '1em',
        marginLeft: '1em',
    };
    
    // 환자 목록을 가져오는 함수
    async function listPatientItem() {
        const patients = await API.graphql(graphqlOperation(listPatients));
        setItems(patients.data.listPatients.items);
    }
    
    // 컴포넌트가 로드될 때 한 번 실행되어 환자 목록을 가져옴
    useEffect(() => {
        listPatientItem();
    }, []);
    
    const validateForm = () => {
        if (!patientName || !onsetDate || !nextAppointment || !diagnosis || !treatment || !futureTreatment) {
            alert("모든 필수 입력 필드를 채워주세요.");
            return false;
        }
        return true;
    };

    // 번역 및 저장 함수
    const getTranslate = async () => {
        try {
            const response = await fetch("https://y33tqo6n7l6bisqnr5uyu747y40jozlo.lambda-url.ap-northeast-2.on.aws/translate", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    patientName,
                    onsetDate,
                    diagnosis,
                    treatment,
                    futureTreatment,
                    nextAppointment,
                }),
            });

            const data = await response.json();
            setTranslatedContent(data.assistant);
            
            // 진단 기록을 생성하는 함수 호출
            await createDiagnosisRecord(SelectedEmail, selectedName, SelectedId, data.assistant, onsetDate);
        } catch (error) {
            console.error(error);
        }
        
        // 진단 기록 생성 함수
        async function createDiagnosisRecord(SelectedEmail, selectedName, SelectedId, diagnosis, onsetDate) {
          try {
            const input = {
              email: SelectedEmail, 
              name: selectedName,
              patientID: SelectedId,
              diagnosis: diagnosis, 
              date: onsetDate,
            };
        
            const result = await API.graphql(graphqlOperation(createDiagnosis, { input }));
            console.log('Diagnosis created:', result);
        
            return result.data.createScript; // 생성된 Script 객체 반환
          } catch (error) {
            console.error('Error creating Diagnosis:', error);
            throw error;
          }
        }
    };
    
    // 환자 선택 핸들러
    const handleSelectPatient = (item) => {
        setSelectedName(item.name);
        setSelectedEmail(item.email);
        setSelectedId(item.id);
        setPatientName(item.name);
    };

    
    return (
        <div>
            <InitState/>
            <PageMenu />
            <div style={styles.container}>
                <h1>Medical Diagnosis Report Translator</h1>
                <div>
                    <Dropdown text={selectedName || 'Select Patient'} pointing='top left' style={dropdownStyle}>
                        <Dropdown.Menu>
                            {items.map((item, index) => (
                                <Dropdown.Item key={index} icon='address card' text={item.name +' '+ item.birth} onClick={() => {
                                    handleSelectPatient(item);
                                }} />
                            ))}
                        </Dropdown.Menu>
                    </Dropdown>
                </div>
                <div style={styles.buttonGroup2}>
                    <div style={{ flex: 1 }}></div>
                    <button style={styles.save_button}>Save</button>
                    <button style={styles.end_button} onClick={() => props.history.push('/')}>End</button>
                </div>
                <div style={styles.content}>
                    <div style={styles.left}>
                        <div style={styles.template_left}>
                            <h2 style={styles.h2}>Diagnosis Form</h2>
                            <form id="medicalCertificateForm">
                                <label htmlFor="patientName" style={styles.label}>환자 이름:</label>
                                <input type="text" id="patientName" value={patientName} onChange={(e) => setPatientName(e.target.value)} style={styles.input} required />
                
                                <label htmlFor="onsetDate" style={styles.label}>발병일:</label>
                                <input type="date" id="onsetDate" value={onsetDate} onChange={(e) => setOnsetDate(e.target.value)} style={styles.input} required />
                
                                <label htmlFor="nextAppointment" style={styles.label}>진단일:</label>
                                <input type="date" id="nextAppointment" value={nextAppointment} onChange={(e) => setNextAppointment(e.target.value)} style={styles.input} required />
                
                                <label htmlFor="diagnosis" style={styles.label}>진단명:</label>
                                <textarea id="diagnosis" value={diagnosis} onChange={(e) => setDiagnosis(e.target.value)} style={styles.textarea_left} required />
                
                                <label htmlFor="treatment" style={styles.label}>치료 내용:</label>
                                <textarea id="treatment" value={treatment} onChange={(e) => setTreatment(e.target.value)} style={styles.textarea_left} required />
                
                                <label htmlFor="futureTreatment" style={styles.label}>향후 치료 계획:</label>
                                <textarea id="futureTreatment" value={futureTreatment} onChange={(e) => setFutureTreatment(e.target.value)} style={styles.textarea_left} required />
                
                                <button type="button" onClick={() => {
                                    if (validateForm()) {
                                        getTranslate();
                                    }
                                }} style={styles.button}>
                                    Start
                                </button>
                            </form>
                        </div>
                    </div>
                    <div style={styles.right}>
                        <div style={styles.template_right}>
                            <h2 style={styles.h2}>Translation Results</h2>
                            <textarea id="translatedContent" value={translatedContent} readOnly style={styles.textarea_right}></textarea>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        );
}
export default MedicalCertificate;


// 스타일 및 레이아웃을 정의하는 스타일 객체
const styles = {
    container: {
        fontFamily: 'Arial, sans-serif',
        backgroundColor: '#f9f9f9',
        padding: '20px',
        width: '80vw',
        minHeight: '88vh',
        margin: '0 auto',
        borderRadius: '12px',
        boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.1)',
    },
    
    content: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginTop: '1rem',
    },
    left: {
        flex: 1,
        padding: '1rem',
        borderRight: '1px solid #ccc',
    },
    right: {
        flex: 1,
        padding: '1rem',
        // display: 'flex',
        // borderRight: '1px solid #ccc',
        justifyContent: 'center',
        alignItems: 'center',
    },
    
    template_left: {
        width: '100%',
        padding: '2rem',
        border: '1px solid #ccc',
        borderRadius: 5,
        backgroundColor: '#f9f9f9',
        boxShadow: '0px 0px 10px rgba(0,0,0,0.1)',
    },



    template_right: {
        width: '100%',
        padding: '2rem',
        border: '1px solid #ccc',
        borderRadius: 5,
        backgroundColor: '#f9f9f9',
        boxShadow: '0px 0px 10px rgba(0,0,0,0.1)',
    },
    
    
    buttonGroup2: {
        display: 'flex',
        marginBottom: '1rem',
        fontSize: '13px',
        padding: '0.1rem 0.1rem'
    },
    
    save_button: {
    },
    
    end_button: {
        marginRight: '1.5rem',
    },
    
    bullet1: {
        marginRight: '10px',
        // color: '#FF5733', // 원하는 색상으로 변경
    },
    bullet2: {
        marginRight: '10px',
        // color: '#3498DB', // 원하는 색상으로 변경
    },
    
    h2: {
        marginBottom: '30px',
        textAlign: 'center'
    },
    form: {
        marginBottom: '20px',
    },
    
    label: {
        display: 'block',
        marginBottom: '5px',
        marginTop: '15px',
        fontWeight: 'bold',
    },
    
    input: {
        width: '100%',
        padding: '8px',
        marginBottom: '15px',
        border: '1px solid #ccc',
        borderRadius: '5px',
        margin: '0 auto', 
    },
    
    textarea_left: {
        width: '100%',
        padding: '10px',
        border: '1px solid #ccc',
        borderRadius: '5px',
        minHeight: '100px',
        resize: 'none',
    },
    
    textarea_right: {
        width: '100%',
        padding: '10px',
        border: '1px solid #ccc',
        borderRadius: '5px',
        backgroundColor: '#f9f9f9',
        minHeight: '716px',
    },
    
    button: {
        display: 'block',
        width: '100%',
        padding: '10px',
        backgroundColor: '#007bff',
        color: '#fff',
        marginTop: '20px',
        border: 'none',
        borderRadius: '5px',
        cursor: 'pointer',
        transition: 'background-color 0.3s',
        minHeight: '50px',
    },
};


