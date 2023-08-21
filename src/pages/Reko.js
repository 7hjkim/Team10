import React, { useState } from 'react';
import { useEffect } from "react";
import Amplify from 'aws-amplify';
import awsconfig from '../aws-exports';
import { Dropdown } from 'semantic-ui-react'
import { updateTodo } from '../graphql/mutations';
import { listTodos } from '../graphql/queries';
import { API, graphqlOperation } from 'aws-amplify';
import TopMenu from '../components/TopMenu'
import InitState from './InitState'

Amplify.configure(awsconfig);

const styles = {
    reset: {
        margin: 0,
        padding: 0,
        boxSizing: 'border-box',
    },
    body: {
        fontFamily: 'Arial, sans-serif',
        backgroundColor: '#f0f0f0',
        color: '#333',
    },
    container: {
        maxWidth: '600px',
        margin: '0 auto',
        padding: '20px',
        backgroundColor: '#fff',
        borderRadius: '10px',
        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
    },
    form: {
        marginBottom: '20px',
    },
    label: {
        display: 'block',
        marginBottom: '5px',
        fontWeight: 'bold',
    },
    input: {
        width: '100%',
        padding: '8px',
        marginBottom: '15px',
        border: '1px solid #ccc',
        borderRadius: '5px',
    },
    button: {
        display: 'block',
        width: '100%',
        padding: '10px',
        backgroundColor: '#007bff',
        color: '#fff',
        border: 'none',
        borderRadius: '5px',
        cursor: 'pointer',
        transition: 'background-color 0.3s',
    },
    buttonHover: {
        backgroundColor: '#0056b3',
    },
    h2: {
        marginTop: '20px',
    },
    textarea: {
        width: '100%',
        padding: '10px',
        border: '1px solid #ccc',
        borderRadius: '5px',
        backgroundColor: '#f9f9f9',
        height: '200px',
    },
};

const MedicalCertificate = () => {
    const [patientName, setPatientName] = useState('');
    const [onsetDate, setOnsetDate] = useState('');
    const [diagnosis, setDiagnosis] = useState('');
    const [treatment, setTreatment] = useState('');
    const [futureTreatment, setFutureTreatment] = useState('');
    const [nextAppointment, setNextAppointment] = useState('');
    const [translatedContent, setTranslatedContent] = useState('');
    const [items, setItems] = useState([]);
    const [selectedName, setSelectedName] = useState('');
    const [selectedId, setSelectedId] = useState('');

    const dropdownStyle = {
        marginTop: '1em',
        marginLeft: '1em',
    };

    async function listTodoItem() {
        try {
            const todos = await API.graphql(graphqlOperation(listTodos));
            console.log(30, todos.data.listTodos.items);
            setItems(todos.data.listTodos.items);
        } catch (error) {
            console.error(error);
        }
    }
    
    async function updateSpecificTodoItem(todoId, updatedDescription) {
      const updatedTodo = { id: todoId, description: updatedDescription };
      await API.graphql(graphqlOperation(updateTodo, { input: updatedTodo }));
  }

    useEffect(() => {
        listTodoItem(); // todo 항목을 가져와 todoItems 상태에 설정
    }, []);
    
    const handleSelectPatient = (item) => {
        setSelectedName(item.name);
        setSelectedId(item.id);
        setPatientName(item.name); // Set the selected patient name in the input field
    };

    const getTranslate = async () => {
        if (!selectedId) {
            alert('환자를 선택하세요!'); // Display an alert if no patient is selected
            return;
        }
        try {
            const response = await fetch("https://piz4tubexwxmenkveheqwft4540opdtm.lambda-url.ap-northeast-2.on.aws/translate", {
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
            
            updateSpecificTodoItem(selectedId, data.assistant);
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <div style={styles.container}>
            <InitState />
            <TopMenu />
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
            <h1>진단서 번역</h1>
            <form id="medicalCertificateForm">
                <label htmlFor="patientName" style={styles.label}>환자 이름:</label>
                <input type="text" id="patientName" value={patientName} onChange={(e) => setPatientName(e.target.value)} style={styles.input} required />

                <label htmlFor="onsetDate" style={styles.label}>발병일:</label>
                <input type="date" id="onsetDate" value={onsetDate} onChange={(e) => setOnsetDate(e.target.value)} style={styles.input} required />

                <label htmlFor="nextAppointment" style={styles.label}>다음 예약일:</label>
                <input type="date" id="nextAppointment" value={nextAppointment} onChange={(e) => setNextAppointment(e.target.value)} style={styles.input} required />

                <label htmlFor="diagnosis" style={styles.label}>진단명:</label>
                <input type="text" id="diagnosis" value={diagnosis} onChange={(e) => setDiagnosis(e.target.value)} style={styles.input} required />

                <label htmlFor="treatment" style={styles.label}>치료 내용:</label>
                <input type="text" id="treatment" value={treatment} onChange={(e) => setTreatment(e.target.value)} style={styles.input} required />

                <label htmlFor="futureTreatment" style={styles.label}>향후 치료 계획:</label>
                <input type="text" id="futureTreatment" value={futureTreatment} onChange={(e) => setFutureTreatment(e.target.value)} style={styles.input} required />
                <button type="button" onClick={getTranslate} style={styles.button}>번역하기</button>
            </form>

            <h2 style={styles.h2}>번역본</h2>
            <textarea id="translatedContent" value={translatedContent} readOnly style={styles.textarea}></textarea>

            
        </div>
    );
};

export default MedicalCertificate;
