import React, { useState, useEffect } from 'react';
import { Configuration, OpenAIApi } from 'openai'; // 필요한 모듈 임포트
import InitState from './InitState';
import PageMenu from '../components/PageMenu';
import { useLocation } from 'react-router-dom';

import Amplify from 'aws-amplify';
import { API, graphqlOperation } from 'aws-amplify';
import { createScript } from '../graphql/mutations';
import awsExports from "../aws-exports";

Amplify.configure(awsExports);

function Summary(props) {
    const [chatHistory, setChatHistory] = useState([]);
    const [summary, setSummary] = useState('');  // 요약된 내용을 저장할 상태
    const [result, setResult] = useState('');
    const [openaiInstance, setOpenAIInstance] = useState(null);
    const [languageFilter, setLanguageFilter] = useState('all'); // all, korean, english
    const [filterKorean, setFilterKorean] = useState([]);;
    const [filterEnglish, setFilterEnglish] = useState([]);;
    const [filterKorean2, setFilterKorean2] = useState([]);;
    const [filterEnglish2, setFilterEnglish2] = useState([]);;
    
    const location = useLocation();
    const searchParams = new URLSearchParams(location.search);
    const patientId = searchParams.get('patientId');
    const patientEmail = searchParams.get('patientEmail');
    const patientName = searchParams.get('patientName');
    const onsetDate = searchParams.get('onsetDate');
    

    // 페이지 로드 시, Polly의 저장된 채팅 내역 불러옴
    useEffect(() => {
        const storedChatHistory = localStorage.getItem('chatHistory');
        if (storedChatHistory) {
            setChatHistory(JSON.parse(storedChatHistory));
        }
    }, []);

    // OpenAI 인스턴스 설정    
    useEffect(() => {
        const configuration = new Configuration({
            apiKey:  process.env.REACT_APP_OPENAI_API_KEY, 
        });
        setOpenAIInstance(new OpenAIApi(configuration));
    },[]);

    useEffect(() => {
        const getSummary = async (script) => {
            //user 예시
            const user = 
                `
                홍길동님, 안녕하세요. 저는 김의사입니다. 어떤 증상으로 오셨나요?
                I've been having continuous headaches and dizziness lately, and sometimes I feel nauseous. It's been concerning me.
                그동안 이런 증상이 얼마 동안 지속되었나요?
                It's been about a week now
                알겠습니다. 증상을 자세히 듣고 몇 가지 검사가 필요할 것 같네요. 먼저 혈압과 체온을 측정하고, 혈액 검사와 뇌 전도 검사도 해보겠습니다.
                Alright. When should I go for these tests?
                가능하면 오늘 바로 검사를 받아보시는 게 좋겠습니다. 검사 결과를 토대로 정확한 원인을 찾고 적절한 치료 방법을 제시해드릴 수 있을 거예요.
                Understood. I'll head for the tests right away.
                좋습니다. 검사가 끝나면 다시 상담을 통해 결과를 설명해드릴게요. 궁금한 점이나 우려사항이 있으면 언제든지 말씀해주세요.
                `
                
            //assistant 예시
            const assistant = 
                `
                환자의 증상 정보:
                - 최근에 계속해서 두통과 어지러움, 메스꺼움을 느끼고 있음
                의사의 소견:
                - 검사가 필요하며, 혈압, 체온, 혈액 검사, 뇌 전도 검사를 진행할 예정
                - 검사 결과를 토대로 정확한 원인을 찾고 적절한 치료 방법을 제시할 예정
                기타사항:
                - 검사는 가능하면 오늘 바로 받아보는 게 좋음
                - 검사 후 상담을 통해 결과 설명 및 질문이나 우려사항은 언제든지 말하기.
                `
                
            
            const messages = [
                { role: 'system', content: "너는 환자와 의사 간 대화를 한국어로 요약할거야.  <key : value> 형태로 제공해주고 <key : value> 마다 줄바꿈 해줘. key 는 환자의 증상 정보, 의사 소견, 기타사항 이고, value 는 key에 대한 요약이야. key 안에 value가 한 개도 없으면 '내용없음' 이라고 말해줘. 환자의 감사 및 의사의 친절 등 진료와 관련 없는 내용은 요약하지 않아도 돼." },
                { role: 'user', content: user },
                { role: 'assistant', content: assistant },
                { role: 'user', content: script }
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
                console.error(error);
                return "요약 중 오류가 발생했습니다.";
            }
        };

        const generateSummary = async () => {
            const result = await getSummary(chatHistory.join(" "));

            const joinedChatHistory = chatHistory.join("\n");
            
            const filteredKorean2 = joinedChatHistory.split('\n').filter(message => /[\u3131-\u314e\u314f-\u3163\uac00-\ud7a3]/g.test(message));
            const filteredEnglish2 = joinedChatHistory.split('\n').filter(message => !/[\u3131-\u314e\u314f-\u3163\uac00-\ud7a3]/g.test(message));
            
     
            const filteredKorean = filteredKorean2.join("\n");
            const filteredEnglish = filteredEnglish2.join("\n");
            
            // console.log('filteredKorean_DB', filteredKoreanDB);
            
            setFilterKorean2(filteredKorean2);
            setFilterEnglish2(filteredEnglish2);
            
            setFilterKorean(filteredKorean);
            setFilterEnglish(filteredEnglish);
            
            console.log('filteredEnglish', filteredEnglish);
            
            const summaryWithLineBreaks = result.split('\n').map((sentence, index) => (
                <p key={index}>{sentence}</p>
            ));
            setResult(result);
            setSummary(summaryWithLineBreaks);
        };
    

        if (chatHistory.length) {
            generateSummary();
        }
    }, [chatHistory, openaiInstance]);
    
    const handleSaveClick = async () => {
        // createScriptRecord 함수를 호출하여 script를 생성
        await createScriptRecord(patientEmail, patientName, patientId, filterKorean, filterEnglish, result, onsetDate);
    };
    
    async function createScriptRecord(patientEmail, patientName, scriptId, filterKorean, filterEnglish, summary, onsetDate) {
          try {
            const input = {
              email: patientEmail, // 환자 이메일 또는 다른 식별자를 사용할 수 있음
              name: patientName,
              patientID: scriptId,
              script: filterKorean,
              scripteng: filterEnglish,
              summary: summary,
              date: onsetDate,
            };
        
            const result = await API.graphql(graphqlOperation(createScript, { input }));
            console.log('Script created:', result);
        
            return result.data.createScript; // 생성된 Script 객체 반환
          } catch (error) {
            console.error('Error creating Script:', error);
            throw error;
          }
    }
    

    


    const getFilteredMessages = () => {
        const joinedChatHistory = chatHistory.join("\n");
    
        if (languageFilter === 'korean') {
            return filterKorean2; // 한국어 메시지에 대한 filterKorean 사용
        }
        if (languageFilter === 'english') {
            return filterEnglish2; // 영어 메시지에 대한 filterEnglish 사용
        }
        return joinedChatHistory.split('\n');
    };
    
    

    return (
        <div>
            <InitState/>
            <PageMenu />
            <div style={styles.container}>
                <h1>Script & Summary</h1>
                    <div style={styles.buttonGroup2}>
                        <button style={styles.back} onClick={() => props.history.push('/script')}>Back</button>
                        <div style={{ flex: 1 }}></div>
                        <button style={styles.save_button} onClick={handleSaveClick}>Save</button>
                        <button style={styles.end_button} onClick={() => props.history.push('/')}>End</button>
                    </div>
                <div style={styles.content}>
                    <div style={styles.left}>
                        <div style={styles.template_left}>
                            <h2 style={styles.h2}>Script</h2>
                            <div style={styles.buttonGroup}>
                                <button style={styles.button1} onClick={() => setLanguageFilter('all')}>All</button>
                                <button style={styles.button2} onClick={() => setLanguageFilter('korean')}>Lang A</button>
                                <button style={styles.button2} onClick={() => setLanguageFilter('english')}>Lang B</button>
                            </div>
                            <ul style={styles.list}>
                                {getFilteredMessages().map((message, index) => (
                                    <li key={index} style={styles.listItem}>
                                        {index % 2 === 0 ? (
                                            <span style={styles.bullet1}>●</span>
                                        ) : (
                                            <span style={styles.bullet2}>○</span>
                                        )}
                                        {message}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                    <div style={styles.right}>
                        <div style={styles.template_right}>
                            <h2 style={styles.h2}>Summary</h2>
                            <p style={styles.summary}>{summary}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
export default Summary;

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


    list: {
        listStyleType: 'none',
        paddingLeft: 0,
        margin: 0,
    },
    listItem: {
        display: 'flex',
        justifyContent: 'flex-start',
        marginBottom: '1rem',
        alignItems: 'center',
        padding: '0.5rem 1rem',
        borderBottom: '1px solid #ccc',
    },
    listItemRight: {
        display: 'flex',
        justifyContent: 'flex-end',
        marginBottom: '1rem',
        alignItems: 'center',
    },
    message: {
        padding: '0.5rem 1rem',
        borderRadius: '10px',
        maxWidth: '70%',
    },
    inputMessage: {
        backgroundColor: '#f0f0f0',
        marginRight: '2rem',
    },
    translatedMessage: {
        backgroundColor: '#007bff',
        color: 'white',
        marginLeft: '2rem',
    },
    
    buttonGroup: {
        display: 'flex',
        gap: '0.2rem',
        marginBottom: '2rem',
        fontSize: '15px',
    },
    
    button1: {
        width : '80px',
        padding: '0.5rem 1rem', // 버튼 안의 내용과 패딩을 조정하여 버튼 크기 조정
        fontSize: '14px', // 원하는 폰트 크기로 조정
        border: 'none',
        borderRadius: '5px',
        backgroundColor: '#34495e',
        color: 'white',
        cursor: 'pointer',
    },
        
    button2: {
        width : '80px',
        padding: '0.5rem 1rem', // 버튼 안의 내용과 패딩을 조정하여 버튼 크기 조정
        fontSize: '14px', // 원하는 폰트 크기로 조정
        border: 'none',
        borderRadius: '5px',
        backgroundColor: '#fab1a0',
        color: 'white',
        cursor: 'pointer',
    },
    
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
    }
};
