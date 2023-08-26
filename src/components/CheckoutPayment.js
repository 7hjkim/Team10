import Amplify from 'aws-amplify';
import React from 'react'
import { useState, useEffect } from 'react';
import { Card, Button, Divider, Grid, Input } from 'semantic-ui-react'
import styled from 'styled-components'
import { API, graphqlOperation } from 'aws-amplify';
import { createPatient } from '../graphql/mutations';
import awsExports from "../aws-exports";

Amplify.configure(awsExports);


function CheckoutPayment(props) {
    const {total} = props
    const [items, setItems] = useState([]);
    const [itemEmail, setItemEmail] = useState('');
    const [itemName, setItemName] = useState('');
    const [itemBirth, setItemBirth] = useState('');
    const [itemPhone, setItemPhone] = useState('');

    async function createPatientItem() {
        const patient = {
            email: itemEmail,
            name: itemName,
            birth: itemBirth,
            phone: itemPhone,
        };
        await API.graphql(graphqlOperation(createPatient, { input: patient }));
        
        window.location.reload();
    };

    return(
        <div>
            <Card fluid>
                <Card.Content>
                    <Button fluid color='orange' loading={props.placedOrder} onClick={createPatientItem}>Add Patient</Button>
                    <Divider/>
                    <Input
                        placeholder="이메일 *"
                        value={itemEmail}
                        onChange={(event) => setItemEmail(event.target.value)}
                    />
                    <Input
                        placeholder="이름 *"
                        value={itemName}
                        onChange={(event) => setItemName(event.target.value)}
                    />
                    <Input
                        placeholder="주민번호 앞 6자리 *"
                        value={itemBirth}
                        onChange={(event) => {
                            const inputText = event.target.value;
                            setItemBirth(inputText.substring(0, 6));
                        }}
                    />
                    <Input
                        placeholder="전화번호(-없이) *"
                        value={itemPhone}
                        onChange={(event) => setItemPhone(event.target.value)}
                    />
                    <Divider/>
                </Card.Content>
              </Card>
        </div>
    )
}

export default CheckoutPayment

const BoldText = styled.div`
  font-size: 17px;
  font-weight: bold;
  margin-bottom: 1em;
`

const SummaryText = styled.div`
  font-size: .9em;
  padding-right: 0em;
`

const TotalText = styled.div`
  font-size: 1.2em;
  font-weight: bold
  color: #B12704;
`