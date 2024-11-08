// src/Chatbot.js
import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import './Chatbot.css';

const Chatbot = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const inputRef = useRef(null);

  useEffect(() => {
    inputRef.current.focus();
  }, []);

  const handleSend = async () => {
    if (input.trim()) {
      const userMessage = { text: input, isUser: true };
      setMessages((prevMessages) => [...prevMessages, userMessage]);
      setInput("");

      try {
        // Send user message to backend API
        const response = await axios.post("http://localhost:5000/generate", {
          prompt: input,
          
        });
        console.log("API Response:", response);

        // Get the bot response
        const botMessage = { text: response.data.response, isUser: false };
        setMessages((prevMessages) => [...prevMessages, botMessage]);
      } catch (error) {
        console.error("Error generating response:", error);
        const errorMessage = { text: "Sorry, there was an error.", isUser: false };
        setMessages((prevMessages) => [...prevMessages, errorMessage]);
      }
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && input.trim()) {
      handleSend();
      e.preventDefault();
    }
  };

  return (
    <div className="chatbot-container">
      <div className="header">Chatbot</div>
      <div className="chat-area">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`message ${msg.isUser ? 'user' : 'bot'}`}
          >
            {msg.isUser ? (
              <span className="user-icon">👨</span>
            ) : (
              <span className="bot-icon">🤖</span>
            )}
            <div className={`message-bubble ${msg.isUser ? 'user' : 'bot'}`}>
              {msg.text}
            </div>
          </div>
        ))}
      </div>
      <div className="input-area">
        <input
          type="text"
          className="input-box"
          placeholder="Type a message..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          ref={inputRef}
          name="prompt"
        />
        <button className="send-button" onClick={handleSend}>Send</button>
      </div>
    </div>
  );
};

export default Chatbot;
