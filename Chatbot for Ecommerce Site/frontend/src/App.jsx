import React, { useState } from 'react';
import './App.css';

function App() {
  const [query, setQuery] = useState('');
  const [chat, setChat] = useState([]);

  const handleSend = async () => {
    if (!query.trim()) return;

    setChat(prev => [...prev, { role: 'user', text: query }]);
    setQuery('');

    const response = await fetch('http://localhost:5000/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: query }),
    });

    const data = await response.json();
    setChat(prev => [...prev, { role: 'bot', text: data.response }]);
  };

  return (
    <div className="app">
      <h2>🛍️ E-Commerce Support Chatbot</h2>
      <div className="chat-box">
        {chat.map((msg, i) => (
          <div key={i} className={`message ${msg.role}`}>{msg.text}</div>
        ))}
      </div>
      <div className="input-area">
        <input value={query} onChange={e => setQuery(e.target.value)} placeholder="Ask about orders, products..." />
        <button onClick={handleSend}>Send</button>
      </div>
    </div>
  );
}

export default App;
