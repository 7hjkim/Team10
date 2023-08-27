// Copyright 2019 Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0

import React, { useState } from 'react'
import AppContext from './AppContext'

const AppProvider = ({ children }) => {

    // 카트 아이템 수를 증가시키는 함수
    const incrementItems = () => {
        setAppContext(prevState => {
            return {
                ...prevState,
                cart: { itemCount: prevState.cart.itemCount + 1 }
            }
        });
    }

    // 카트에 아이템을 추가하는 함수
    const addItemToCart = (item, quantity) => {
        setAppContext(prevState => {
            var newItems = Object.assign({}, prevState);
            newItems.cart.items.push({ id: item.id, quantity: quantity });
            return {
                ...prevState,
                cart: { items: newItems.cart.items }
            }
        });
    }

    // 아이템 목록을 업데이트하는 함수
    const addItems = (items) => {
        setAppContext(prevState => {
            return {
                ...prevState,
                items
            }
        });
    }

    // 사용자 정보를 저장하는 함수
    const storeUser = (user) => {
        setAppContext(prevState => {
            return {
                ...prevState,
                user
            }
        });
    }

    // 카트를 비우는 함수
    const clearCart = () => {
        setAppContext(prevState => {
            return {
                ...prevState,
                cart: { items: [] }
            }
        });
    }
    
    // 초기 앱 상태 정의
    const appState = {
        cart: { items: [] },
        items: [],
        user: null,
        addItemToCart,
        incrementItems,
        addItems,
        storeUser,
        clearCart
    }

    const [appContext, setAppContext] = useState(appState);

    // 앱 컨텍스트를 제공하는 컴포넌트 반환
    return (
        <AppContext.Provider value={appContext}>
            {children}
        </AppContext.Provider>
    );
}

export default AppProvider;
