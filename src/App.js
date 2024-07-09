// App.js
// App.js
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { AppBar, Toolbar, Typography, Button, Container, TextField, List, ListItem, ListItemText, IconButton, Switch, CssBaseline } from '@mui/material';
import { Add as AddIcon, Delete as DeleteIcon, Edit as EditIcon, AccountCircle } from '@mui/icons-material';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import Header from './components/Header';
import Footer from './components/Footer';
import Menu from './components/Menu';
import Register from './Register';
import axios from 'axios';
import './App.css';

const theme = createTheme({
  palette: {
    primary: {
      main: "#060f3e",
    },
    secondary: {
      main: '#d3d3d3',
    },
  },
});

function App() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [userId, setUserId] = useState(null);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [userLists, setUserLists] = useState({});
  const [newListName, setNewListName] = useState('');
  const [currentList, setCurrentList] = useState('');
  const [newItem, setNewItem] = useState('');
  const [editIndex, setEditIndex] = useState(-1);
  const [editedName, setEditedName] = useState('');

  useEffect(() => {
    if (loggedIn) {
      fetchUserInventories();
    }
  }, [loggedIn]);

  useEffect(() => {
    if (currentList) {
      fetchListItems(currentList);
    }
  }, [currentList]);

  const fetchUserInventories = async () => {
    try {
      const response = await axios.get('http://localhost:3001/inventories', { params: { userId } });
      if (response.data) {
        const lists = response.data.reduce((acc, list) => {
          acc[list.id] = { name: list.name, items: [] };
          return acc;
        }, {});
        setUserLists(lists);
      }
    } catch (error) {
      console.error('Error fetching inventories:', error.response ? error.response.data : error.message);
    }
  };

  const fetchListItems = async (listId) => {
    try {
      const response = await axios.get('http://localhost:3001/products', { params: { listId } });
      if (response.data) {
        setUserLists(prevState => ({
          ...prevState,
          [listId]: { ...prevState[listId], items: response.data }
        }));
      }
    } catch (error) {
      console.error('Error fetching list items:', error.response ? error.response.data : error.message);
    }
  };

  const handleLogin = async () => {
    try {
      const response = await axios.post('http://localhost:3001/login', { username, password });
      if (response.data && response.status === 200) {
        setUserId(response.data.userId);
        setLoggedIn(true);
        fetchUserInventories(); // ユーザーのインベントリを取得
      } else {
        console.error('Login failed');
      }
    } catch (error) {
      console.error('Login error:', error.response ? error.response.data : error.message);
    }
  };

  const handleLogout = () => {
    setLoggedIn(false);
    setUserId(null);
    setUserLists({});
    setCurrentList('');
    setUsername('');
    setPassword('');
  };

  const handleAddList = async () => {
    if (newListName && loggedIn) {
      try {
        const response = await axios.post('http://localhost:3001/addList', { userId, listName: newListName });
        if (response.data) {
          const newList = { name: newListName, items: [] };
          setUserLists({ ...userLists, [response.data.inventoryId]: newList });
          setNewListName('');
        }
      } catch (error) {
        console.error('Error adding list:', error.response ? error.response.data : error.message);
      }
    }
  };

  const handleAddItem = async (listId, newItem) => {
    if (newItem && loggedIn) {
      try {
        const response = await axios.post('http://localhost:3001/addItem', { listId, itemName: newItem, quantity: 1 });
        if (response.data) {
          const newItemObj = { id: response.data.itemId, name: newItem, quantity: 1, active: true };
          setUserLists(prevState => ({
            ...prevState,
            [listId]: { ...prevState[listId], items: [...prevState[listId].items, newItemObj] }
          }));
          setNewItem('');
        }
      } catch (error) {
        console.error('Error adding item:', error.response ? error.response.data : error.message);
      }
    }
  };

  const handleDeleteItem = async (listId, itemId) => {
    if (loggedIn) {
      try {
        await axios.delete('http://localhost:3001/deleteItem', { data: { itemId } });
        setUserLists(prevState => ({
          ...prevState,
          [listId]: { ...prevState[listId], items: prevState[listId].items.filter(item => item.id !== itemId) }
        }));
      } catch (error) {
        console.error('Error deleting item:', error.response ? error.response.data : error.message);
      }
    }
  };

  const handleToggleItem = async (listId, index) => {
    if (loggedIn) {
      const items = [...userLists[listId].items];
      const item = items[index];
      item.active = !item.active;
      try {
        await axios.put('http://localhost:3001/updateItem', { itemId: item.id, quantity: item.quantity, active: item.active });
        setUserLists(prevState => ({
          ...prevState,
          [listId]: { ...prevState[listId], items }
        }));
      } catch (error) {
        console.error('Error toggling item:', error.response ? error.response.data : error.message);
      }
    }
  };

  const handleQuantityChange = (listId, index, quantity) => {
    const items = [...userLists[listId].items];
    const item = items[index];
    item.quantity = quantity;
    setUserLists(prevState => ({
      ...prevState,
      [listId]: { ...prevState[listId], items }
    }));
  };

  const handleQuantityBlur = async (listId, index) => {
    const item = userLists[listId].items[index];
    try {
      await axios.put('http://localhost:3001/updateItem', { itemId: item.id, quantity: item.quantity, active: item.active });
      fetchListItems(listId); // アイテムを再フェッチして更新を反映
    } catch (error) {
      console.error('Error updating item quantity:', error.response ? error.response.data : error.message);
    }
  };

  const handleDeleteList = async (listId) => {
    if (loggedIn) {
      if (window.confirm(`リスト "${userLists[listId].name}" を削除しますか？`)) {
        try {
          await axios.delete('http://localhost:3001/deleteList', { data: { listId } });
          const updatedUserLists = { ...userLists };
          delete updatedUserLists[listId];
          setUserLists(updatedUserLists);
          setCurrentList('');
        } catch (error) {
          console.error('Error deleting list:', error.response ? error.response.data : error.message);
        }
      }
    }
  };

  const handleEditItem = (index) => {
    setEditIndex(index);
    setEditedName(userLists[currentList].items[index].name);
  };

  const handleRenameItem = async (listId, index) => {
    if (loggedIn) {
      const items = [...userLists[listId].items];
      const item = items[index];
      item.name = editedName;
      try {
        await axios.put('http://localhost:3001/updateItem', { itemId: item.id, quantity: item.quantity, active: item.active });
        setUserLists(prevState => ({
          ...prevState,
          [listId]: { ...prevState[listId], items }
        }));
        setEditIndex(-1);
      } catch (error) {
        console.error('Error renaming item:', error.response ? error.response.data : error.message);
      }
    }
  };

  const handleCancelEdit = () => {
    setEditIndex(-1);
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <div id="root">
          <Header loggedIn={loggedIn} handleLogout={handleLogout} username={username} currentList={currentList} userLists={userLists} />
          <div style={{ display: 'flex' }} className="main-content">
            {loggedIn && (
              <Menu
                lists={Object.keys(userLists).map(listId => ({ id: listId, name: userLists[listId].name }))}
                currentList={currentList}
                setCurrentList={setCurrentList}
                newListName={newListName}
                setNewListName={setNewListName}
                handleAddList={handleAddList}
                handleDeleteList={handleDeleteList}
              />
            )}
            <Container style={{ marginTop: '2em', flexGrow: 1 }}>
              <Routes>
                <Route path="/" element={
                  loggedIn ? (
                    <>
                      {currentList && (
                        <>
                          <TextField
                            label="アイテムを入力"
                            variant="outlined"
                            value={newItem}
                            onChange={(e) => setNewItem(e.target.value)}
                            fullWidth
                          />
                          <Button
                            variant="contained"
                            color="primary"
                            onClick={() => handleAddItem(currentList, newItem)}
                            startIcon={<AddIcon />}
                            style={{ marginTop: '1em', color: '#f5f5dc' }}
                          >
                            追加
                          </Button>
                          <List style={{ marginTop: '2em' }}>
                            {(userLists[currentList]?.items || []).map((item, index) => (
                              <ListItem
                                key={item.id}
                                style={{ opacity: item.active ? 1 : 0.5 }}
                                secondaryAction={
                                  editIndex === index ? (
                                    <>
                                      <TextField
                                        value={editedName}
                                        onChange={(e) => setEditedName(e.target.value)}
                                        style={{ marginRight: '1em' }}
                                      />
                                      <Button
                                        onClick={() => handleRenameItem(currentList, index)}
                                      >
                                        名前変更
                                      </Button>
                                      <Button
                                        onClick={handleCancelEdit}
                                      >
                                        キャンセル
                                      </Button>
                                    </>
                                  ) : (
                                    <>
                                      <IconButton edge="end" style={{ marginRight: '0.2em', color: '#060f3e' }} aria-label="edit" onClick={() => handleEditItem(index)}>
                                        <EditIcon />
                                      </IconButton>
                                      <IconButton edge="end" style={{ marginRight: '0.2em', color: '#060f3e' }} aria-label="delete" onClick={() => handleDeleteItem(currentList, item.id)}>
                                        <DeleteIcon />
                                      </IconButton>
                                      <TextField
                                        type="number"
                                        value={item.quantity !== undefined ? item.quantity : ''}
                                        size='small'
                                        onChange={(e) => handleQuantityChange(currentList, index, parseInt(e.target.value))}
                                        onBlur={() => handleQuantityBlur(currentList, index)}
                                        style={{ width: '60px', marginRight: '1em' }}
                                      />
                                    </>
                                  )
                                }
                              >
                                <Switch
                                  checked={item.active}
                                  onChange={() => handleToggleItem(currentList, index)}
                                  inputProps={{ 'aria-label': 'controlled' }}
                                />
                                <ListItemText primary={item.name} />
                              </ListItem>
                            ))}
                          </List>
                        </>
                      )}
                    </>
                  ) : (
                    <div style={{ textAlign: 'center' }}>
                      <Typography variant="h6">
                        ログインしてください
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
                      <Button
                        variant="contained"
                        color="primary"
                        onClick={handleLogin}
                      >
                        ログイン
                      </Button>
                      <Typography variant="body1" style={{ marginTop: '10px' }}>
                        アカウントを持っていませんか? <Link to="/register">登録</Link>
                      </Typography>
                    </div>
                  )
                } />
                <Route path="/register" element={<Register />} />
              </Routes>
            </Container>
          </div>
          <Footer className="footer" />
        </div>
      </Router>
    </ThemeProvider>
  );
}

export default App;
