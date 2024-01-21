import React, { useEffect, useState } from 'react';
import logo from './logo.svg';
import MessageUserList from './lists/MessageUser';
import UnreadMessagesList from './lists/UnreadMessage';
import UserList from './lists/UserList';
import './App.css';
import Grid from '@mui/material/Unstable_Grid2';
import { Box } from '@mui/material';
import axios from 'axios';
import { UnaryExpression } from 'typescript';
export type User = {
  id: number,
  username: string
}
function App() {
  return (
    <div className="App">
      <Box sx={{ flexGrow: 1 }}>
        <UserList/>
      </Box>
    </div>
  );
}


export default App;
