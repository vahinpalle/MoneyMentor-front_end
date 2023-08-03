import React, { useState, useEffect, useRef } from 'react';
import './App.css';

function App() {
  const [userMessage, setUserMessage] = useState('');
  const [chatHistory, setChatHistory] = useState([]);
  const [error, setError] = useState(null);
  
  const chatEndRef = useRef(null);

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, [chatHistory]);

  const handleMessageChange = (event) => {
    setUserMessage(event.target.value);
  }

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await fetch('http://localhost:3000/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          message: userMessage
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      const botReply = data.reply;
      setChatHistory(chatHistory => [...chatHistory, {message: userMessage, sender: 'You'}, {message: botReply, sender: 'MoneyMentor'}]);
      setUserMessage('');

    } catch (error) {
      setError(error.message);
    }
  }

  return (
    <div className="App">
      <header className="App-header">
        <h1>MoneyMentor</h1>
      </header>
      <main>
        <div className="Chatbox">
          {chatHistory.map((chat, index) => (
            <div key={index} className={`chat-message ${chat.sender}`}>
              <strong>{chat.sender}:</strong> {chat.message}
            </div>
          ))}
          <div ref={chatEndRef} />
        </div>
        <form onSubmit={handleSubmit}>
          <input type="text" className="chat-input" placeholder="Type your message here..." value={userMessage} onChange={handleMessageChange} />
          <button type="submit" className="chat-button">Send</button>
        </form>
        {error && <div className="error">{error}</div>}
      </main>
    </div>
  );
}

export default App;
