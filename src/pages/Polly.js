import React, { useState, useEffect, useRef } from 'react';
import { Configuration, OpenAIApi } from 'openai';
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';
import './Polly.css';
import { useHistory, Link } from 'react-router-dom';
import InitState from './InitState';
import PageMenu from '../components/PageMenu';
import Summary from './Summary';

import Amplify from 'aws-amplify';
import { API, graphqlOperation } from 'aws-amplify';
import { listPatients } from '../graphql/queries';
import awsExports from "../aws-exports";
import { Dropdown } from 'semantic-ui-react'

Amplify.configure(awsExports);


function Polly (props) {
    const history = useHistory(); // Initialize useHistory
    const [chatMessages, setChatMessages] = useState([]);
    const [typedMessage, setTypedMessage] = useState("");
    const { transcript, resetTranscript, listening } = useSpeechRecognition();
    const [openaiInstance, setOpenAIInstance] = useState(null);
    const chatBoxRef = useRef(null); // chatBoxRef 생성
    const [onsetDate, setOnsetDate] = useState('');
    const [items, setItems] = useState([]);
    const [selectedName, setSelectedName] = useState('');
    const [SelectedEmail, setSelectedEmail] = useState('');
    const [SelectedId, setSelectedId] = useState('');
    
    const dropdownStyle = {
        marginTop: '1em',
        marginLeft: '1em',
    };
    
    async function listPatientItem() {
        const patients = await API.graphql(graphqlOperation(listPatients));
        setItems(patients.data.listPatients.items);
    }

    useEffect(() => {
        listPatientItem();
    }, []);

    useEffect(() => {
        const configuration = new Configuration({
            apiKey: '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',
        });
        setOpenAIInstance(new OpenAIApi(configuration));
    }, []);

    useEffect(() => {
        setTypedMessage(transcript);
    }, [transcript]);

    // chatMessages 상태가 변경될 때 스크롤 조절하는 useEffect
    useEffect(() => {
        if (chatBoxRef.current) {
            chatBoxRef.current.scrollTop = chatBoxRef.current.scrollHeight;
        }
    }, [chatMessages]);

    const handleSend = async () => {
        if (!openaiInstance) return;

        if (typedMessage.trim() === '') {
            return;

        }

        const updatedChatMessages = [...chatMessages, { content: typedMessage, role: 'user' }];
        setChatMessages(updatedChatMessages);
        
        
        try {
            const assistantMessage = await getAssistantReply(typedMessage);
            const updatedChatMessagesWithResponse = [...updatedChatMessages, { content: assistantMessage, role: 'assistant' }];
            setChatMessages(updatedChatMessagesWithResponse);
            resetTranscript();
            setTypedMessage("");
            

        } catch (error) {
            console.error(error);
        }
    };
    
    const handleChatEnd = () => {
        if (!SelectedId || !onsetDate) {
            // 모델 형태의 알람을 사용하여 사용자에게 메시지 표시
            alert('환자와 진단일을 선택하세요.');
            return; // 함수 종료
        }
        // 전체 채팅 내역을 새 페이지로 전달하고 이동
        const chatHistory = chatMessages.map(message => message.content);
        localStorage.setItem('chatHistory', JSON.stringify(chatHistory));
        history.push(`/Summary?patientId=${SelectedId}&patientEmail=${SelectedEmail}&onsetDate=${onsetDate}`);
    };

    const getAssistantReply = async (userMessage) => {
        let instruction = "";
        if (/[\u3131-\u314e\u314f-\u3163\uac00-\ud7a3]/g.test(userMessage)) {
            instruction = "Please translate the following Korean sentence into English.You can only speak translation";
        } else {
            instruction = "Please translate the following English sentence into Korean.You can only speak translation";
        }
    
        const messages = [
            { role: 'system', content: instruction },
            { role: 'user', content: userMessage }
        ];
    
        try {
            const completion = await openaiInstance.createChatCompletion({
                model: 'gpt-3.5-turbo',
                temperature: 0.5,
                max_tokens: 1025,
                messages: messages,
            });
            return completion.data.choices[0].message.content;
        } catch (error) {
            throw error;
        }
    };
    
    const handleSelectPatient = (item) => {
        setSelectedName(item.name);
        setSelectedEmail(item.email);
        setSelectedId(item.id);
    };

    const toggleVoiceRecording = () => {
        if (listening) {
            SpeechRecognition.stopListening();
        } else {
            SpeechRecognition.startListening({ continuous: true }); // 계속적으로 음성을 인식합니다.
        }
    };
    


    return (
        <div>
            <InitState/>
            <PageMenu />
            <div className="polly-container">
                <h1>Real-time translation</h1>
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
                <label className="date-" htmlFor="onsetDate">진단단일:</label>
                <input className="date-selection" type="date" id="onsetDate" value={onsetDate} onChange={(e) => setOnsetDate(e.target.value)} required />
                    <div style={styles.buttonGroup2}>
                        <div style={{ flex: 1 }}></div>
                        <button style={styles.save_button}>Save</button>
                        <button style={styles.summary_button} onClick={handleChatEnd}>Summary</button>
                    </div>
                {listening ? <p>Listening…</p> : null}
                <div className="input-box">
                    <button 
                        onClick={toggleVoiceRecording}
                        className={listening ? "stop-voice" : "start-voice"}
                    >
                        {listening ? "Stop Voice" : "Start Voice"}
                    </button>
                
                    <input 
                        type="text" 
                        placeholder="Type your text here…"
                        value={typedMessage}
                        onChange={(e) => setTypedMessage(e.target.value)}
                        onKeyPress={(e) => {
                            if (e.key === 'Enter') {
                                handleSend();
                            }  
                        }}
                    />
                    <button onClick={handleSend}>Send</button>
                    <button onClick={resetTranscript}>Delete</button>
                </div>
                <div className="chat-box" ref={chatBoxRef}>
                    {chatMessages.map((message, index) => (
                        <div key={index} className={`chat-message ${message.role}`}>
                            <p>{message.content}</p>
                        </div>
                    ))}
                </div>
            </div>
            {/*<button className="back-button" onClick={() => props.history.push('/')}>Back to Main</button>*/}
        </div>
    );
};


export default Polly;


const styles = {
    container: { width: 400, margin: '0 auto', display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: 20 },
    todo: { marginBottom: 15 },
    input: { border: 'none', backgroundColor: '#ddd', marginBottom: 10, padding: 8, fontSize: 18 },
    todoName: { fontSize: 20, fontWeight: 'bold' },
    todoDescription: { marginBottom: 0 },
    button: { backgroundColor: 'black', color: 'white', outline: 'none', fontSize: 18, padding: '12px 0px' },
    back: {
    marginLeft: '1.5rem',
    },
    
    buttonGroup2: {
        display: 'flex',
        marginBottom: '1rem',
        fontSize: '13px',
        padding: '0.1rem 0.1rem'
    },
    
    save_button: {
    },
    
    summary_button: {
        marginRight: '1.5rem',
    },
      
    }