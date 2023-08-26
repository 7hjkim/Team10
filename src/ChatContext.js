// ChatContext.js

import React, { createContext, useState, useContext } from 'react';

const ChatContext = createContext();

export const useChat = () => {
    return useContext(ChatContext);
};

export const ChatProvider = ({ children }) => {
    const [chatMessages, setChatMessages] = useState([]);

    const resetChat = () => {
        setChatMessages([]);
    };

    return (
        <ChatContext.Provider value={{ chatMessages, setChatMessages, resetChat }}>
            {children}
        </ChatContext.Provider>
    );
};
