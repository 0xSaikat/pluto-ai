import { useState } from 'react';
import { sendAIChat } from '../api';

function AIChatModal({ isOpen, onClose, context = {} }) {
  const [messages, setMessages] = useState([
    {
      sender: 'ai',
      text: 'Hello! I am Pluto AI Security Assistant. Ask me anything about code vulnerabilities, CWE standards, or security fixes!',
    },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userText = input;
    setInput('');
    setMessages((prev) => [...prev, { sender: 'user', text: userText }]);
    setLoading(true);

    try {
      const res = await sendAIChat(userText, context);
      setMessages((prev) => [...prev, { sender: 'ai', text: res.reply }]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        { sender: 'ai', text: `Error: ${err.message || 'Could not connect to AI Assistant'}` },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(0, 0, 0, 0.75)',
        backdropFilter: 'blur(4px)',
        zIndex: 1000,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px',
      }}
    >
      <div
        style={{
          width: '100%',
          maxWidth: '600px',
          height: '600px',
          background: '#111',
          border: '1px solid #00bcd433',
          borderRadius: '16px',
          display: 'flex',
          flexDirection: 'column',
          boxShadow: '0 20px 40px rgba(0,0,0,0.8)',
          overflow: 'hidden',
        }}
      >
        {/* Header */}
        <div
          style={{
            padding: '16px 24px',
            background: '#16161a',
            borderBottom: '1px solid #222',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{ fontSize: '20px' }}>🛡️</span>
            <div>
              <h3 style={{ color: '#fff', margin: 0, fontSize: '16px' }}>Pluto AI Security Assistant</h3>
              <p style={{ color: '#00bcd4', margin: 0, fontSize: '12px' }}>Online • AI Powered</p>
            </div>
          </div>
          <button
            onClick={onClose}
            style={{
              background: 'transparent',
              border: 'none',
              color: '#888',
              fontSize: '20px',
              cursor: 'pointer',
            }}
          >
            ✕
          </button>
        </div>

        {/* Messages */}
        <div
          style={{
            flex: 1,
            padding: '20px',
            overflowY: 'auto',
            display: 'flex',
            flexDirection: 'column',
            gap: '12px',
          }}
        >
          {messages.map((m, idx) => (
            <div
              key={idx}
              style={{
                alignSelf: m.sender === 'user' ? 'flex-end' : 'flex-start',
                maxWidth: '85%',
                background: m.sender === 'user' ? '#00bcd4' : '#1a1a24',
                color: m.sender === 'user' ? '#000' : '#e0e0e0',
                padding: '12px 16px',
                borderRadius: m.sender === 'user' ? '16px 16px 2px 16px' : '16px 16px 16px 2px',
                fontSize: '14px',
                lineHeight: '1.5',
                whiteSpace: 'pre-wrap',
              }}
            >
              {m.text}
            </div>
          ))}
          {loading && (
            <div
              style={{
                alignSelf: 'flex-start',
                background: '#1a1a24',
                color: '#00bcd4',
                padding: '12px 16px',
                borderRadius: '16px',
                fontSize: '13px',
              }}
            >
              Pluto AI is thinking...
            </div>
          )}
        </div>

        {/* Input Form */}
        <form
          onSubmit={handleSend}
          style={{
            padding: '16px',
            borderTop: '1px solid #222',
            background: '#16161a',
            display: 'flex',
            gap: '10px',
          }}
        >
          <input
            type="text"
            placeholder="Ask AI Assistant about code security..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            style={{
              flex: 1,
              padding: '12px 16px',
              background: '#0d0d12',
              border: '1px solid #333',
              borderRadius: '8px',
              color: '#fff',
              fontSize: '14px',
              outline: 'none',
            }}
          />
          <button
            type="submit"
            disabled={loading}
            style={{
              padding: '12px 20px',
              background: loading ? '#333' : '#00bcd4',
              color: '#000',
              border: 'none',
              borderRadius: '8px',
              fontWeight: 'bold',
              cursor: loading ? 'not-allowed' : 'pointer',
            }}
          >
            Send
          </button>
        </form>
      </div>
    </div>
  );
}

export default AIChatModal;
