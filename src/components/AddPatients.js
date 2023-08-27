import Amplify from 'aws-amplify';
import React from 'react'
import { useState } from 'react';
import { Button, Divider, Input } from 'semantic-ui-react'
import styled from 'styled-components'
import { API, graphqlOperation } from 'aws-amplify';
import { createPatient } from '../graphql/mutations';
import awsExports from "../aws-exports";

Amplify.configure(awsExports);

// 이메일 유효성 검사 함수 정의
function isEmailValid(email) {
    // 간단한 이메일 형식 검증 정규 표현식
    const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
    return emailPattern.test(email);
}

// 환자 정보 추가 컴포넌트 정의
function AddPatients(props) {
    const [itemEmail, setItemEmail] = useState('');
    const [itemName, setItemName] = useState('');
    const [itemBirth, setItemBirth] = useState('');
    const [itemPhone, setItemPhone] = useState('');

    // 환자 정보 생성 함수
    async function createPatientItem() {
        
        // 필수 필드들이 모두 입력되었는지 검사
        if (!itemEmail || !itemName || !itemBirth || !itemPhone) {
            alert('모든 필수 필드를 입력하세요.');
            return;
        }
        
        // 이메일 유효성 검사
        if (!isEmailValid(itemEmail)) {
            alert('올바른 이메일 형식이 아닙니다.');
            return;
        }
        
        // 환자 객체 생성
        const patient = {
            email: itemEmail,
            name: itemName,
            birth: itemBirth,
            phone: itemPhone,
        };
        // AWS Amplify를 사용하여 환자 정보 생성 뮤테이션 실행
        await API.graphql(graphqlOperation(createPatient, { input: patient }));
        
        window.location.reload();
    };

    return(
        <div>
            <CardContent>
                <h3 style={{ marginBottom: '22px',textAlign: 'center', fontSize: '17px',
    fontWeight: 'bold' }}>Add Patients</h3>
                <InputField>
                    <Input
                        placeholder="이름 *"
                        value={itemName}
                        onChange={(event) => setItemName(event.target.value)} 
                        style={{ width: '100%' }}
                    />
                    <Input
                        placeholder="이메일 *"
                        value={itemEmail}
                        onChange={(event) => setItemEmail(event.target.value)}
                        style={{ width: '100%' }}
                    />
                    <Input
                        placeholder="주민번호 앞 6자리 *"
                        value={itemBirth}
                        onChange={(event) => {
                            const inputText = event.target.value;
                            setItemBirth(inputText.substring(0, 6))
                        }}
                        style={{ width: '100%' }}
                    />
                    <Input
                        placeholder="전화번호(-없이) *"
                        value={itemPhone}
                        onChange={(event) => setItemPhone(event.target.value)}
                        style={{ width: '100%' }}
                    />
                </InputField>
                <Divider/>
                <Button fluid color='green' loading={props.placedOrder} onClick={createPatientItem}>Add</Button>
            </CardContent>
        </div>
    )
}

export default AddPatients;

const SummaryText = styled.div`
  font-size: .9em;
  padding-right: 0em;
`

const InputField = styled.div`
  font-size: 1.2em;
  font-weight: bold;
  color: #B12704;
`

const CardContent = styled.div`
  border: 1px solid #ccc;
  box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.1);
  padding: 30px;
  width: 300px; 
  margin-top: 103px;
  margin-left: 30px;
`;
