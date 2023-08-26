import React, { useState, useEffect } from 'react';
import Amplify from 'aws-amplify';
import { Grid, Divider, Input, Segment, Button, Message } from 'semantic-ui-react';
import styled from 'styled-components';
import { API, graphqlOperation } from 'aws-amplify';
import { createPatient, updatePatient, deletePatient } from '../graphql/mutations';
import { listPatients } from '../graphql/queries';
import awsExports from "../aws-exports";
import { Link } from 'react-router-dom';
Amplify.configure(awsExports);

function CheckoutSummary(props) {
    const { user } = props;
    const [items, setItems] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        async function fetchData() {
            const patients = await API.graphql(graphqlOperation(listPatients));
            setItems(patients.data.listPatients.items);
        }
        fetchData();
    }, []);

    const filteredItems = items.filter(item => 
        item.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    async function deletePatientItem(patientId) {
        try {
            await API.graphql(graphqlOperation(deletePatient, { input: { id: patientId } }));
            const updatedItems = items.filter(item => item.id !== patientId);
            setItems(updatedItems);
        } catch (error) {
            console.error('Error deleting patient item:', error);
        }
    }

    async function editPatientItem(patient) {
        const updatedEmail = prompt('Enter new email', patient.email);
        const updatedName = prompt('Enter new name', patient.name);
        const updatedBirth = prompt('Enter new birthdate (ex. 991122)', patient.birth);
        const updatedPhone = prompt('Enter new phone number', patient.phone);

        if (
            updatedEmail !== null &&
            updatedName !== null &&
            updatedBirth !== null &&
            updatedPhone !== null
        ) {
            const updatedPatient = {
                id: patient.id,
                email: updatedEmail,
                name: updatedName,
                birth: updatedBirth,
                phone: updatedPhone,
            };

            try {
                await API.graphql(graphqlOperation(updatePatient, { input: updatedPatient }));
                const updatedItems = items.map(item => 
                    item.id === patient.id ? { ...item, ...updatedPatient } : item
                );
                setItems(updatedItems);
            } catch (error) {
                console.error('Error updating patient item:', error);
            }
        }
    }

    function getAtt(name) {
        return user ? user[name] : ""
    }

    return (
        <div>
            <Grid columns={3}>
                <Grid.Row>
                    <Grid.Column width={4}>
                        <BoldText>Doctor</BoldText>
                    </Grid.Column>
                    <Grid.Column width={7}>
                        <NormalText>{getAtt('given_name') + ' ' + getAtt('family_name')}</NormalText>
                    </Grid.Column>
                </Grid.Row>
                <Divider />
                <Grid.Row>
                    <Grid.Column width={4}>
                        <BoldText>Patient</BoldText>
                    </Grid.Column>
                </Grid.Row>
                <Grid.Row>
                    <Grid.Column width={1}></Grid.Column>
                    <Grid.Column width={15}></Grid.Column>
                </Grid.Row>
            </Grid>
            
            <Input
                icon='search'
                placeholder='Search by patient name...'
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                style={{ marginBottom: '20px' }}
            />
            <ScrollableContainer>
                {filteredItems.map((item, index) => (
                    <div key={index}>
                        <PatientItem>
                            <PatientInfo>
                                <InfoLabel>Name:</InfoLabel> 
                                <Link to={`/patient/${item.id}`}>{item.name}</Link> {/* 여기서 수정 */}
                                <DividerVertical>|</DividerVertical>
                                <InfoLabel>Email:</InfoLabel> {item.email} <DividerVertical>|</DividerVertical> 
                                <InfoLabel>Birth:</InfoLabel> {item.birth} <DividerVertical>|</DividerVertical> 
                                <InfoLabel>Phone:</InfoLabel> {item.phone}
                            </PatientInfo>
                            <ButtonGroup>
                                <Button color='blue' onClick={() => editPatientItem(item)}>
                                    Edit
                                </Button>
                                <Button color='red' onClick={() => deletePatientItem(item.id)}>
                                    Delete
                                </Button>
                            </ButtonGroup>
                        </PatientItem>
                        {index !== filteredItems.length - 1 && <Divider />}
                    </div>
                ))}
            </ScrollableContainer>
        </div>
    );
}

export default CheckoutSummary;

const PatientInfo = styled.div`
    font-size: 17px;  // 원하는 폰트 크기로 조절하세요.
`;


const BoldText = styled.div`
    font-size: 17px;
    font-weight: bold;
`;

const NormalText = styled.div`
    font-size: 1em;
`;

const PatientItem = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 10px;
`;

const ButtonGroup = styled.div`
    display: flex;
    gap: 10px;
`;

const ScrollableContainer = styled.div`
    max-width: 1000px; /* 예시로 가로 크기 제한 */
    max-height: 600px; 
    overflow-y: auto;
    padding: 10px;
    border: 1px solid #ccc;
    margin-bottom: 20px;
`;

const InfoLabel = styled.span`
    font-weight: bold;
    margin-right: 5px;
`;

const DividerVertical = styled.span`
    margin: 0 10px;
    color: #ccc;
`;