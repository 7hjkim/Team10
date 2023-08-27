// Copyright 2019 Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0

import React, {useState, useEffect, useContext} from 'react'
import { Grid, Divider} from 'semantic-ui-react'
import styled from 'styled-components';

import AppContext from '../context/AppContext'

import InitState from './InitState'
import PageMenu from '../components/PageMenu'
import PatientsTable from '../components/PatientsTable'
import AddPatients from '../components/AddPatients'

function Info(props) {
    // 상태 변수들 선언 및 초기화
    const [ordering, setOrdering] = useState(false)
    const [card, setCard] = useState(0)
    const [totalPurchase, setTotal] = useState(0)
    const [orderComplete, setOrderComplete] = useState(false)
    
    // AppContext로부터 사용자 정보, 카트 정보, 아이템 정보를 가져옴
    var {user, cart, items, clearCart} = useContext(AppContext)

    const quantText = (cart.items.length === 1) ? '1 item' : cart.items.length + ' items'

   function handlePatientClick(patientId) {
        // 클릭한 환자의 정보를 보여주는 페이지로 이동
        props.history.push(`/patient/${patientId}`);
    }
    function handleCardUpdate(e) {
        setCard(e.value)
    }

    function submitOrder() {
        setOrderComplete(true)
    }
    
    // 카트에 있는 아이템들의 총 가격 계산
    useEffect(() => {
        function calculateTotal() {
            var total = 0
            var _item = null
    
            cart.items.map((item) => {
                var _product = items.filter(function (el) {
                    return el.id === item.id
                })
    
                _product.length === 1 ? _item = _product[0] : _item = null
                total += (_item.price * item.quantity)
                return null
            })
    
            setTotal(parseFloat(total).toFixed(2))
            return parseFloat(total).toFixed(2)
        }

        calculateTotal()
    }, [cart.items, items])
    
    // 주문 완료 시 동작
    useEffect(() => {
        if (orderComplete) {

            console.log("Purchase price", totalPurchase)

            var _mTotal = parseFloat(totalPurchase).toFixed(2)
        
            clearCart()

            props.history.push('ordercomplete')
        }
    }, [orderComplete, props.history, clearCart, totalPurchase]);
    
    // 사용자 정보 속성을 가져오는 함수
    function getAtt(name) {
        return user ? user[name] : ""
    }

    return (
        <div>
            <InitState/>
            <PageMenu/>
            <div style={mainDiv}>
                <Grid columns={1}>
                    <Grid.Row>
                        <Grid columns={2}>
                            <Grid.Row>
                                <Grid.Column width={2}>
                                    <BoldText>Hospital Info.</BoldText>
                                </Grid.Column>
                                <Grid.Column width={4}>
                                    <NormalText>{getAtt('given_name')}</NormalText>
                                </Grid.Column>
                            </Grid.Row>
                        </Grid>
                    </Grid.Row>
                    <Divider />
                    <Grid.Row>
                        <Grid columns={2}>
                            <Grid.Row>
                                <Grid.Column width={11}>
                                    <BoldText>Patients Info.</BoldText>
                                    <PatientsTable/>
                                </Grid.Column>
                                <Grid.Column width={3}>
                                    <AddPatients />
                                </Grid.Column>
                            </Grid.Row>
                        </Grid>
                    </Grid.Row>
                </Grid>
            </div>
        </div>
    )
}

export default Info

const mainDiv = {
    marginLeft: '5em',
    marginRight: '1em',
    marginTop: '2em'
}

const BoldText = styled.div`
    font-size: 17px;
    font-weight: bold;
`;

const NormalText = styled.div`
    font-size: 1em;
`;