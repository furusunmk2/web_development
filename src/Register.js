// Register.js
import React, { useState } from 'react';
import { Container, TextField, Button, Typography } from '@mui/material';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';

function Register() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate(); // useNavigateフックの使用

  const handleRegister = async () => {
    if (password !== confirmPassword) {
      setMessage('パスワードが一致しません');
      return;
    }

    try {
      const response = await axios.post('http://localhost:3001/register', { username, password });
      console.log('Registration response:', response);
      if (response.data && response.status === 200) {
        setMessage('登録成功');
        navigate('/'); // 登録成功後にログイン画面に遷移
      } else {
        setMessage('登録失敗');
      }
    } catch (error) {
      console.error('Registration error:', error.response ? error.response.data : error.message);
      setMessage('登録失敗: ' + (error.response ? error.response.data.message : error.message));
    }
  };

  return (
    <Container>
      <Typography variant="h6" style={{ marginTop: '2em', textAlign: 'center' }}>
        ユーザー登録
      </Typography>
      <TextField
        label="ユーザー名"
        variant="outlined"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        style={{ margin: '10px 0' }}
        fullWidth
      />
      <TextField
        label="パスワード"
        type="password"
        variant="outlined"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        style={{ margin: '10px 0' }}
        fullWidth
      />
      <TextField
        label="パスワード確認"
        type="password"
        variant="outlined"
        value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}
        style={{ margin: '10px 0' }}
        fullWidth
      />
      <Button
        variant="contained"
        color="primary"
        onClick={handleRegister}
        style={{ marginTop: '10px' }}
      >
        登録
      </Button>
      {message && <Typography style={{ marginTop: '10px', textAlign: 'center' }}>{message}</Typography>}
      <Typography variant="body1" style={{ marginTop: '10px', textAlign: 'center' }}>
        既にアカウントを持っていますか? <Link to="/">ログイン</Link>
      </Typography>

    </Container>
  );
}

export default Register;
