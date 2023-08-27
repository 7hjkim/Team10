//Real-time Translation Page
import React, { useState, useEffect, useRef } from 'react';
import { Configuration, OpenAIApi } from 'openai';
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';
import { useHistory } from 'react-router-dom';

//For Comopents & CSS
import InitState from './InitState';
import PageMenu from '../components/PageMenu';
import '../css/Script.css';

//For DB
import Amplify from 'aws-amplify';
import { API, graphqlOperation } from 'aws-amplify';
import { listPatients } from '../graphql/queries';
import awsExports from "../aws-exports";
import { Dropdown } from 'semantic-ui-react'

Amplify.configure(awsExports);   //aws 서비스 연결


function Scirpt (props) {
    const history = useHistory(); // Initialize useHistory
    const [chatMessages, setChatMessages] = useState([]);
    const [typedMessage, setTypedMessage] = useState("");
    const { transcript, resetTranscript, listening } = useSpeechRecognition();
    const [openaiInstance, setOpenAIInstance] = useState(null);
    const chatBoxRef = useRef(null); // chatBoxRef 생성
    
    //For DB 
    const [onsetDate, setOnsetDate] = useState('');
    const [items, setItems] = useState([]);
    const [selectedName, setSelectedName] = useState('');
    const [SelectedEmail, setSelectedEmail] = useState('');
    const [SelectedId, setSelectedId] = useState('');
    const dropdownStyle = {
        marginTop: '1em',
        marginLeft: '1em',
    };
    
    
    // 환자 목록 가져오기
    async function listPatientItem() {
        const patients = await API.graphql(graphqlOperation(listPatients));
        setItems(patients.data.listPatients.items);
    }

    useEffect(() => {
        listPatientItem();
    }, []);

    //For gpt api Key
    useEffect(() => {
        const configuration = new Configuration({
            apiKey: process.env.REACT_APP_OPENAI_API_KEY,
        });
        setOpenAIInstance(new OpenAIApi(configuration));
    }, []);

    //텍스트화한 음성인식 TypeMessage에 업데이트
    useEffect(() => {
        setTypedMessage(transcript);
    }, [transcript]);

    //chatMessages 상태가 변경될 때 스크롤 조절하는 useEffect
    useEffect(() => {
        if (chatBoxRef.current) {
            chatBoxRef.current.scrollTop = chatBoxRef.current.scrollHeight;
        }
    }, [chatMessages]);

     //채팅 메세지 전송 처리
    const handleSend = async () => {
        if (!openaiInstance) return;    //openaiInstance 초기화 안될 시 실행 안함

        
        if (typedMessage.trim() === '') {    
            return;     //메세지 내용이 없으면 실행 안함

        }
        
        //채팅창 입력 시 chatMessages에 업데이트
        const updatedChatMessages = [...chatMessages, { content: typedMessage, role: 'user' }];
        setChatMessages(updatedChatMessages);
        
        
        try {
            const assistantMessage = await getAssistantReply(typedMessage); //getAssistantReply 함수 호출
            const updatedChatMessagesWithResponse = [...updatedChatMessages, { content: assistantMessage, role: 'assistant' }];
            setChatMessages(updatedChatMessagesWithResponse);   //gpt 답변 받아 chatMessages에 업데이트
            resetTranscript();   //transcript 초기화
            setTypedMessage("");     //사용자 입력 메세지 초기화
            

        } catch (error) {       //예외처리
            console.error(error);
        }
    };
    
    
    const handleChatEnd = () => {
        if (!SelectedId || !onsetDate) {
            //환자와 날짜 미선택 시 경고 메세지 전송
            alert('환자와 진단일을 선택하세요.');
            return; 
        }
        // 전체 채팅 내역을 summary 페이지로 전달
        const chatHistory = chatMessages.map(message => message.content);
        localStorage.setItem('chatHistory', JSON.stringify(chatHistory));
        history.push(`/Summary?patientId=${SelectedId}&patientEmail=${SelectedEmail}&patientName=${selectedName}&onsetDate=${onsetDate}`);
    };
    
    // gpt 설정
    const getAssistantReply = async (userMessage) => {
        //gpt role 정해주기
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
    
    //환자 선택 및 저장 함수
    const handleSelectPatient = (item) => {
        setSelectedName(item.name);
        setSelectedEmail(item.email);
        setSelectedId(item.id);
    };
    
    //음성 입력 중지, 시작
    const toggleVoiceRecording = () => {
        if (listening) {
            SpeechRecognition.stopListening();
        } else {
            SpeechRecognition.startListening({ continuous: true }); // 계속적으로 음성을 인식합니다.
        }
    };
    


    return (
        <div>
            {/* 페이지 메뉴 불러오기*/}
            <InitState/>   
            <PageMenu /> 
            {/* script container*/}
            <div className="scirpt-container">
                <h1>Real-time translation</h1>
                {/*환자명 선택*/}
                <div style={styles.inputGroup}>
                    <Dropdown text={selectedName || 'Select Patient'} pointing='top left' style={styles.dropdown}>
                        <Dropdown.Menu>
                            {items.map((item, index) => (
                                <Dropdown.Item key={index} icon='address card' text={item.name +' '+ item.birth} onClick={() => {
                                    handleSelectPatient(item);
                                }} />
                            ))}
                        </Dropdown.Menu>
                    </Dropdown>
                </div>
                {/*날짜 선택*/}
                <div style={styles.inputGroup}>
                    <label className="date-text" htmlFor="onsetDate" style={styles.label}>진단일:</label>
                    <input className="date-selection" type="date" id="onsetDate" value={onsetDate} onChange={(e) => setOnsetDate(e.target.value)} style={styles.dateInput} required />
                    <button style={styles.summary_button} onClick={handleChatEnd}>Summary</button>
                </div>
                {/*음성 동작 표시*/}
                {listening ? <p>Listening…</p> : null}
                {/*챗 입력박스*/}
                <div className="input-box">
                    {/*음성 시작&중지 버튼*/}
                    <button 
                        onClick={toggleVoiceRecording}
                        className={listening ? "stop-voice" : "start-voice"}
                    >
                        {listening ? "Stop Voice" : "Start Voice"}
                    </button>
                    {/*텍스트 입력창*/}
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
                    {/*챗 send&delete 버튼*/}
                    <button onClick={handleSend}>Send</button>
                    <button onClick={resetTranscript}>Delete</button>
                </div>
                {/*채팅메세지 배열*/}
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


export default Scirpt;

//추가 css
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
    
    summary_button: {
        marginRight: '1.5rem',
        marginLeft: 'auto',
    },
    inputGroup: {
        display: 'flex',
        alignItems: 'center',
        marginBottom: '1em',
     },
    
    label: {
        minWidth: '50px', // Adjust as needed
        marginLeft: '0.5rem',
        flexShrink: 0, // Prevent the label from shrinking
     },
    
    dateInput: {
        width: '10%',
        padding: '8px',
        border: '1px solid #ccc',
        borderRadius: '4px',
        boxSizing: 'border-box',
        fontSize: '14px',
     },
    
    dropdown: {
        marginLeft: '0.5em', // Adjust as needed
     },
      
    }
