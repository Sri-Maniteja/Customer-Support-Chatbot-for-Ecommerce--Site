// File: frontend/src/App.jsx
import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([]);
  const messagesEndRef = useRef(null);

  const handleSend = async () => {
    if (!input.trim()) return;
    const userMsg = { sender: 'user', text: input };
    setMessages((prev) => [...prev, userMsg]);
    setInput('');

    try {
      const res = await axios.post('http://localhost:5000/api/chat', { message: input });
      const botMsg = { sender: 'bot', text: res.data.response };
      setMessages((prev) => [...prev, botMsg]);
    } catch {
      const botMsg = { sender: 'bot', text: 'Error processing your request.' };
      setMessages((prev) => [...prev, botMsg]);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') handleSend();
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <div className="chat-app">
      <h1 className="title">E-commerce Support Chatbot</h1>
      <div className="chat-box">
        <div className="messages">
          {messages.map((msg, idx) => (
            <div key={idx} className={`message ${msg.sender}`}>
              <p>{msg.text}</p>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
        <div className="input-area">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask about top products, order status, or inventory..."
          />
          <button onClick={handleSend}>Send</button>
        </div>
      </div>
    </div>
  );
}

export default App;
