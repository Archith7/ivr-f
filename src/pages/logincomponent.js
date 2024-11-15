import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import io from 'socket.io-client';

const socket = io('http://localhost:3000');

const LoginComponent = () => {
  const [loginId, setLoginId] = useState('');
  const history = useNavigate();

  const handleLogin = () => {
    const id = prompt('Enter your login ID:');
    setLoginId(id);

    if (id) {
      if (id === 'admin123') {
        socket.emit('adminLogin', id, (response) => {
          if (response.success) {
            alert('Admin logged in successfully');
            history.push('/call');
          } else {
            alert(response.message);
          }
        });
      } else {
        socket.emit('userLogin', id, (response) => {
          if (response.success) {
            alert('User logged in successfully');
            history.push('/call');
          } else {
            alert(response.message);
          }
        });
      }
    }
  };

  return (
    <div>
      <button onClick={handleLogin}>Call Virtual Agent</button>
    </div>
  );
};

export default LoginComponent;
