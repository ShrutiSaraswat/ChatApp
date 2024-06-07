"use client";
import React, { createContext, useReducer, useContext } from "react";

// Initial state
const initialState = {
  selectedConversation: null,
  messages: [],
};

// Reducer function to handle state changes
const conversationReducer = (state, action) => {
  switch (action.type) {
    case "SET_SELECTED_CONVERSATION":
      return {
        ...state,
        selectedConversation: action.payload,
      };
    case "SET_MESSAGES":
      return {
        ...state,
        messages: action.payload,
      };
    default:
      return state;
  }
};

// Create context
const ConversationContext = createContext();

// Provider component
export const ConversationProvider = ({ children }) => {
  const [state, dispatch] = useReducer(conversationReducer, initialState);

  const setSelectedConversation = (selectedConversation) => {
    dispatch({
      type: "SET_SELECTED_CONVERSATION",
      payload: selectedConversation,
    });
  };

  const setMessages = (messages) => {
    dispatch({ type: "SET_MESSAGES", payload: messages });
  };

  return (
    <ConversationContext.Provider
      value={{
        selectedConversation: state.selectedConversation,
        messages: state.messages,
        setSelectedConversation,
        setMessages,
      }}
    >
      {children}
    </ConversationContext.Provider>
  );
};

// Custom hook to use the conversation context
export const useConversation = () => {
  return useContext(ConversationContext);
};
