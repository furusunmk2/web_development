import React, { useEffect, useState } from 'react';
import { AppBar, Toolbar, Typography, Button, IconButton } from '@mui/material';
import { AccountCircle } from '@mui/icons-material';

function Header({ loggedIn, handleLogout, username, currentList, userLists }) {
  const [listName, setListName] = useState('');

  useEffect(() => {
    if (currentList && userLists[currentList]) {
      setListName(userLists[currentList].name);
    } else {
      setListName('');
    }
  }, [currentList, userLists]);

  return (
    <AppBar position="static" style={{ background: "#060f3e", color: 'beige' }}>
      <Toolbar>
        {loggedIn && (
          <IconButton edge="start" onClick={handleLogout} aria-label="account" style={{ color: '#f5f5dc' }}>
            <AccountCircle />
          </IconButton>
        )}
        {loggedIn ? (
          <Typography variant="h6" style={{ flexGrow: 1 }}>
            {username}
          </Typography>
        ) : (
          <Typography variant="h5" style={{ flexGrow: 1, color: "#060f3e" }}>
            m
          </Typography>
        )}
        {loggedIn ? (
          <Typography variant="h6" style={{ flexGrow: 1 }}>
            {listName ? `${listName} memo` : 'memo'}
          </Typography>
        ) : (
          <Typography variant="h6" style={{ flexGrow: 1 }}>
            memomemo
          </Typography>
        )}
        {loggedIn ? (
          <Button color="inherit" onClick={handleLogout}>ログアウト</Button>
        ) : (
          <Button hidden>ログイン</Button>
        )}
      </Toolbar>
    </AppBar>
  );
}

export default Header;
