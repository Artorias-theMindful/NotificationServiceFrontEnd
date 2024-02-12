import { Box } from '@mui/material';
import UserList from './lists/UserList';
import './App.css';

export type User = {
  id: number,
  username: string
}

function App() {
  return (
    <div className="App">
      <Box>
        <UserList />
      </Box>
    </div>
  );
}

export default App;
