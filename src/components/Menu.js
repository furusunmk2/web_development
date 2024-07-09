//menu.js

import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { TextField, Button, IconButton, createTheme, ThemeProvider } from '@mui/material';
import { Add as AddIcon, Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';

const menuTheme = createTheme({
  palette: {
    primary: {
      main: '#060f3e', // プライマリーカラー
    },
    secondary: {
      main: '#060f3e', // セカンダリーカラー
    },
  },
});

function Menu({ lists, currentList, setCurrentList, newListName, setNewListName, handleAddList, handleDeleteList }) {
  const [showForm, setShowForm] = useState(false);
  const [isNewListSelected, setIsNewListSelected] = useState(false);
  const [editIndex, setEditIndex] = useState(-1);
  const [editedName, setEditedName] = useState('');

  const toggleForm = () => {
    if (editIndex !== -1) {
      setEditIndex(-1); // 名前変更をキャンセル
    }
    setShowForm(!showForm);
    setCurrentList(''); // フォームを表示する際にcurrentListをリセットする
    setIsNewListSelected(!showForm); // NewList選択状態を切り替え
  };

  const handleAddListAndHideForm = () => {
    handleAddList();
    setShowForm(false); // リスト追加後にフォームを非表示にする
    setIsNewListSelected(false); // NewList選択状態を解除
  };

  const handleListClick = (listId) => {
    setCurrentList(listId);
    setShowForm(false); // リストを選択した際にフォームを非表示にする
    setIsNewListSelected(false); // NewList選択状態を解除
  };

  const handleEditItem = (index) => {
    if (showForm) {
      setShowForm(false); // 新規リスト作成をキャンセル
    }
    setEditIndex(index);
    setEditedName(lists[index].name);
  };

  const handleRenameItem = (index) => {
    // リスト名の変更ロジックを追加
    lists[index].name = editedName;
    setEditIndex(-1);
  };

  const handleDeleteItem = (index) => {
    // 確認画面を表示
    if (window.confirm('このリストを削除しますか？')) {
      handleDeleteList(lists[index].id);
      setEditIndex(-1);
    }
  };

  const handleCancelEdit = () => {
    setEditIndex(-1);
  };

  const handleListNameChange = (e) => {
    const value = e.target.value;
    if (value.length <= 16 && [...value].length <= 8) {
      setNewListName(value);
    }
  };

  const handleEditNameChange = (e) => {
    const value = e.target.value;
    if (value.length <= 16 && [...value].length <= 8) {
      setEditedName(value);
    }
  };

  return (
    <ThemeProvider theme={menuTheme}>
      <div style={styles.menuContainer}>
        <h2 style={styles.menuTitle}>Menu</h2>
        <ul style={styles.menuList}>
          <li>
            <button 
              onClick={toggleForm} 
              style={{
                color:"#060f6e",
                ...styles.menuButton,
                ...(isNewListSelected && styles.menuLinkActive)
              }}
            >
              NewList
            </button>
          </li>
          {lists.map((list, index) => (
            <li key={list.id} style={styles.menuListItem}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
                <Link
                  size="small"
                  to="/"
                  onClick={() => handleListClick(list.id)}
                  style={{
                    ...styles.menuLink,
                    ...(currentList === list.id && styles.menuLinkActive)
                  }}
                >
                  {list.name}
                </Link>
                <div style={styles.actionButtons}>
                  <IconButton style={{ color:'#060f3e' }} edge="end" size="small" aria-label="edit" onClick={() => handleEditItem(index)}>
                    <EditIcon />
                  </IconButton>
                  <IconButton style={{ color:'#060f3e' }} edge="end" size="small" aria-label="delete" onClick={() => handleDeleteItem(index)}>
                    <DeleteIcon />
                  </IconButton>
                </div>
              </div>
              {editIndex === index && (
                <div style={{ marginTop: '1em' }}>
                  <div style={styles.editForm}>
                    <TextField
                      size="small"
                      value={editedName}
                      onChange={handleEditNameChange}
                      style={{ marginBottom: '1em', marginRight: '1em' }} // 下に余白を追加
                      fullWidth
                    />
                    <div style={styles.buttonGroup}>
                      <Button size="small" onClick={() => handleRenameItem(index)} style={{ marginLeft:"0.5em" ,marginRight: '1em',background:'#060f3e',color:'#f5f5dc'}}>
                        名前変更
                      </Button>
                      <Button size="small" onClick={handleCancelEdit} style={{ marginRight:"0.5em" ,background:'#060f3e',color:'#f5f5dc'}}>
                        キャンセル
                      </Button>
                    </div>
                  </div>
                </div>
              )}
            </li>
          ))}
        </ul>
        {showForm && (
          <div style={{ marginTop: '1em' }}>
            <div style={{ marginBottom: '1em' }}>
              <TextField
                label="新しいリスト名を入力"
                variant="outlined"
                value={newListName}
                onChange={handleListNameChange}
                size="small" // フォームを小さくする
                fullWidth
              />
            </div>
            <Button
              variant="contained"
              color="primary"
              onClick={handleAddListAndHideForm}
              startIcon={<AddIcon />}
              size="small" // ボタンを小さくする
              fullWidth
            >
              リストを追加
            </Button>
          </div>
        )}
      </div>
    </ThemeProvider>  
  );
}

const styles = {
  menuContainer: {
    backgroundColor: "beige", // 背景色を変更
    padding: '1em',
    width: '200px',
    height: '100vh',
  },
  menuTitle: {
    color:"#060f6e", // タイトルの色を変更
  },
  menuList: {
    listStyleType: 'none',
    padding: 0,
  },
  menuListItem: {
    display: 'flex',
    flexDirection: 'column', // 行の方向を列に変更
  },
  menuLink: {
    color: "#060f9e", // リンクの色を変更
    textDecoration: 'none',
    display: 'block',

  },
  menuLinkActive: {
    // 選択中の項目の色を変更
    fontWeight: 'bold',
  },
  menuButton: {
    background: 'none',
    border: 'none',
    padding: '0',
    color: '#060f9e', // ボタンの色を変更
    textDecoration: 'underline',
    cursor: 'pointer',
  },
  actionButtons: {
    display: 'flex',
    gap: '0.5em',
  },
  editForm: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
  },
  buttonGroup: {
    display: 'flex',
    flexDirection: 'row',
  },
  EditIcon: {
    color:'#060f3e',
  },
};

export default Menu;
