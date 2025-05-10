import React, { useEffect, useState, useRef } from 'react';
import io from 'socket.io-client';

const socket = io('http://localhost:3001');

function App() {
  const [username, setUsername] = useState('');
  const [tempUsername, setTempUsername] = useState('');
  const [message, setMessage] = useState('');
  const [messageList, setMessageList] = useState([]);
  const chatBoxRef = useRef(null);

  const sendMessage = () => {
    if (message.trim() !== '') {
      const messageData = {
        author: username,
        message,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      socket.emit('send_message', messageData);
      setMessage('');
    }
  };

  useEffect(() => {
    socket.on('receive_message', (data) => {
      setMessageList((list) => [...list, data]);
    });
    return () => {
      socket.off('receive_message');
    };
  }, []);

  useEffect(() => {
    chatBoxRef.current?.scrollTo(0, chatBoxRef.current.scrollHeight);
  }, [messageList]);

  const joinChat = () => {
    if (tempUsername.trim() !== '') {
      setUsername(tempUsername.trim());
    }
  };

  if (!username) {
    return (
      <div style={styles.loginContainer}>
        <div style={styles.loginBox}>
          <h2>Welcome to Chat</h2>
          <input
            style={styles.input}
            placeholder="Enter your username..."
            value={tempUsername}
            onChange={(e) => setTempUsername(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && joinChat()}
          />
          <button style={styles.button} onClick={joinChat}>Join</button>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.chatContainer}>
      <div style={styles.header}>
        <h2>💬 Chat App</h2>
        <span style={styles.username}>Logged in as: <strong>{username}</strong></span>
      </div>

      <div style={styles.chatBox} ref={chatBoxRef}>
        {messageList.map((msg, index) => (
          <div
            key={index}
            style={{
              ...styles.messageContainer,
              justifyContent: msg.author === username ? 'flex-end' : 'flex-start',
            }}
          >
            <div
              style={{
                ...styles.messageBubble,
                backgroundColor: msg.author === username ? '#4CAF50' : '#f0f0f0',
                color: msg.author === username ? '#fff' : '#000',
              }}
            >
              <div style={styles.authorRow}>
                <div style={styles.avatar}>{msg.author.charAt(0).toUpperCase()}</div>
                <div style={styles.author}>{msg.author}</div>
              </div>
              <div>{msg.message}</div>
              <div style={styles.time}>{msg.time}</div>
            </div>
          </div>
        ))}
      </div>

      <div style={styles.inputArea}>
        <input
          style={styles.input}
          value={message}
          placeholder="Type a message..."
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
        />
        <button style={styles.button} onClick={sendMessage}>Send</button>
      </div>
    </div>
  );
}

const styles = {
  loginContainer: {
    height: '100vh',
    background: '#1e1e2f',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loginBox: {
    background: '#fff',
    padding: '30px 40px',
    borderRadius: '12px',
    boxShadow: '0 10px 30px rgba(0,0,0,0.2)',
    textAlign: 'center',
  },
  chatContainer: {
    height: '100vh',
    display: 'flex',
    flexDirection: 'column',
    fontFamily: 'Arial, sans-serif',
    background: '#f8f9fa',
  },
  header: {
    padding: '15px 20px',
    background: '#343a40',
    color: '#fff',
    display: 'flex',
    justifyContent: 'space-between',
  },
  username: {
    fontSize: '14px',
  },
  chatBox: {
    flex: 1,
    padding: '20px',
    overflowY: 'auto',
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
  },
  messageContainer: {
    display: 'flex',
  },
  messageBubble: {
    maxWidth: '65%',
    padding: '12px 16px',
    borderRadius: '12px',
    position: 'relative',
    fontSize: '15px',
  },
  authorRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    marginBottom: 5,
  },
  avatar: {
    backgroundColor: '#bbb',
    color: '#fff',
    borderRadius: '50%',
    width: 24,
    height: 24,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    fontSize: '14px',
  },
  author: {
    fontWeight: 'bold',
    fontSize: '14px',
  },
  time: {
    fontSize: '12px',
    marginTop: 5,
    textAlign: 'right',
    opacity: 0.7,
  },
  inputArea: {
    display: 'flex',
    padding: '10px 20px',
    borderTop: '1px solid #ccc',
    background: '#fff',
  },
  input: {
    flex: 1,
    padding: '10px 14px',
    fontSize: '16px',
    border: '1px solid #ccc',
    borderRadius: '6px',
    outline: 'none',
  },
  button: {
    marginLeft: '10px',
    padding: '10px 18px',
    backgroundColor: '#007bff',
    color: '#fff',
    border: 'none',
    borderRadius: '6px',
    fontSize: '16px',
    cursor: 'pointer',
  },
};

export default App;
