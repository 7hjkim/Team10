import React, { useState, useEffect } from 'react';
import Amplify from 'aws-amplify';
import { Input, Button, Table } from 'semantic-ui-react';
import { API, graphqlOperation } from 'aws-amplify';
import { updatePatient, deletePatient } from '../graphql/mutations';
import { listPatients } from '../graphql/queries';
import awsExports from "../aws-exports";
import { Link } from 'react-router-dom';
Amplify.configure(awsExports);


//Patients DB CRUD Table
function PatientsTable(props) {
    const [items, setItems] = useState([]);   //환자정보 변수
    const [searchTerm, setSearchTerm] = useState('');   //환자검색 변수
    
    //환자정보 DB 가져오기
    useEffect(() => {  
        async function fetchData() {
            const patients = await API.graphql(graphqlOperation(listPatients));
            setItems(patients.data.listPatients.items);
        }
        fetchData();
    }, []);
    
    //환자 이름 필터링
    const filteredItems = items.filter(item =>   
        item.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    
    //Delete 기능
    async function deletePatientItem(patientId) {   
        try {
            await API.graphql(graphqlOperation(deletePatient, { input: { id: patientId } }));
            const updatedItems = items.filter(item => item.id !== patientId);
            setItems(updatedItems);
        } catch (error) {
            console.error('Error deleting patient item:', error);
        }
    }
    
    //Edit 기능 (email, name, birth, phone)
    async function editPatientItem(patient) {   
        const updatedEmail = prompt('Enter new email', patient.email);
        const updatedName = prompt('Enter new name', patient.name);
        const updatedBirth = prompt('Enter new birthdate (ex. 991122)', patient.birth);
        const updatedPhone = prompt('Enter new phone number', patient.phone);
        
        //null이 아닌 경우 DB 업데이트
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
            
            //DB 업데이트 성공 시 item 업데이트
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

    return (
        <div>
            <Input
                icon='search'
                placeholder='Search by patient name...'
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                style={{ marginTop: '20px', marginBottom: '20px' }}
            />
            <div style={styles.container}>
                <Table>
                    <Table.Header>
                        <Table.Row style={styles.headercell}>
                            <Table.HeaderCell>Name</Table.HeaderCell>
                            <Table.HeaderCell>Email</Table.HeaderCell>
                            <Table.HeaderCell>Birth</Table.HeaderCell>
                            <Table.HeaderCell>Phone</Table.HeaderCell>
                            <Table.HeaderCell></Table.HeaderCell>
                        </Table.Row>
                    </Table.Header>
                    <Table.Body>
                        {filteredItems.map((item, index) => (
                            <Table.Row key={index} style={styles.bodycell}>
                                <Table.Cell ><Link to={`/patient/${item.id}`}>{item.name}</Link></Table.Cell>
                                <Table.Cell>{item.email}</Table.Cell>
                                <Table.Cell>{item.birth}</Table.Cell>
                                <Table.Cell>{item.phone}</Table.Cell>                            
                                <Table.Cell>       
                                    <div style={styles.button}>
                                        <Button color='blue' onClick={() => editPatientItem(item)}>
                                            Edit
                                        </Button>
                                        <Button color='red' onClick={() => deletePatientItem(item.id)}>
                                            Delete
                                        </Button>
                                    </div>
                                </Table.Cell>
                            </Table.Row>
                        ))}
                    </Table.Body>
                </Table>
            </div>
        </div>
    );
}

export default PatientsTable;

const styles = {
    container: {
        maxWidth: '100%', /* 예시로 가로 크기 제한 */
        maxHeight: '600px',
        overflowY: 'auto',
        padding: '10px',
        border: '1px solid #ccc',
        marginBottom: '20px',    
    },
    
    headercell: {
        textAlign: 'center',
        verticalAlign: 'middle',
        fontSize: '16px', 
        fontWeight: 'bold', 
        padding: '10px',
    },
    
    bodycell: {
        textAlign: 'center',
        verticalAlign: 'middle',
        fontSize: '13px', 
    },
    
    button : {
        display: 'flex',
        justifyContent: 'flex-end',
        gap: '10px',
    },
  }