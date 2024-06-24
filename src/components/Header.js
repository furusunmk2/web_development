import React from 'react';
import { AppBar, Toolbar, Typography, Button, IconButton } from '@mui/material';
import { AccountCircle } from '@mui/icons-material';

function Header({ loggedIn, handleLogout, handleLogin, username, currentList }) {
  return (
    <AppBar position="static" style={{ background:"#060f3e",color:'beige'}}>
      <Toolbar>
        {loggedIn && (
          <IconButton edge="start" onClick={handleLogout}  aria-label="account" style={{ color:'#f5f5dc' }}>
            <AccountCircle />
          </IconButton>
        )}
         {loggedIn ? (
        <Typography variant="h6" style={{ flexGrow: 1 }}>
          {username}
        </Typography>
        ) : (
        <Typography  variant="h5" style={{ flexGrow: 1,color:"#060f3e"}}>
          m
        </Typography>
        )}
        {loggedIn ? (
        <Typography variant="h6" style={{ flexGrow: 1 }}>
        {currentList}memo
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
