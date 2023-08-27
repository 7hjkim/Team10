// Copyright 2019 Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0

import React, {useEffect, useContext} from 'react'
import { Auth, API } from 'aws-amplify'
import isoCountries from '../config/isoCountries'
import AppContext from '../context/AppContext'

function InitState() {
    // AppContext로부터 아이템 정보, 사용자 정보, 상태 관리 함수들을 가져옴
    const {items, user, storeUser, addItems} = useContext(AppContext)

    // 컴포넌트가 마운트될 때 실행되는 useEffect
    useEffect(() => {
        if (items.length === 0) {
            // API를 통해 아이템 정보를 가져옴
            API.get('amplifyworkshopapi', '/items')
            .then(response => {
                addItems(response.data)// 가져온 아이템 정보를 상태에 추가
            })
            .catch(error => {
                console.log(error.response)
            })
        }
    }, [items.length, addItems])
    
    // 컴포넌트가 마운트될 때 및 user 상태가 변경될 때 실행되는 useEffect
    useEffect(() => {
        Auth.currentAuthenticatedUser()
            .then(data => {
                if (user === null) {
                    // 개발환경일 때 사용자 정보 출력
                    if (!process.env.NODE_ENV || process.env.NODE_ENV === 'development') {
                        console.log(data)
                    }

                    var countryCode = null
                    
                    // 개발환경일 때 Pinpoint 엔드포인트 업데이트
                    if (!process.env.NODE_ENV || process.env.NODE_ENV === 'development') {
                        console.log('Updating Pinpoint endpoint [InitState]')
                    }
                    
                    // 사용자의 국가 코드를 확인하여 국가 코드 설정
                    if (isoCountries.hasOwnProperty(data.attributes['custom:country'])) {
                        countryCode = isoCountries[data.attributes['custom:country']]
                    }

                    // storeUser 함수를 사용하여 사용자 정보 상태 업데이트
                    storeUser(data.attributes)
                }

                if (user != null) {
                    
                }
            })
    }, [user, storeUser])

    return (
        <React.Fragment>

        </React.Fragment>
    )
}

export default InitState