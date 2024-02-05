
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import IconButton from '@mui/material/IconButton';
import CommentIcon from '@mui/icons-material/Comment';
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import SendIcon from '@mui/icons-material/Send';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import type { User } from '../App'

function MessageUserList(props: { user: User }) {
  const [otherUsers, setOtherUsers] = useState([]);
  const [chosenUser, setChosenUser] = useState(props.user);
  useEffect(() => {
    axios.get(`http://localhost:5000/users/${props.user.id}/usersExceptChosen`, {
      headers: {
        'Content-Type': 'application/json'
      }
    })
    .then((response) => {
      setOtherUsers(response.data.otherUsers)
      setChosenUser(response.data.chosenUser[0])
    })
  }, [props.user]);
  return (
    <List sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}>
      {otherUsers.map((user: User) => (
        <MessageUserListItem key={user.id} chosenUser={chosenUser} userToSendMessage={user}/>
        
      ))}
    </List>
  );
}
const modalStyle = {
  position: 'absolute' as 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};
function MessageUserListItem(props: { chosenUser: User, userToSendMessage: User }) {
  const [open, setOpen] = React.useState(false);
  const handleOpen = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    event.stopPropagation();
    setOpen(true);
  }
  const handleClose = () => setOpen(false);
  const [message, setMessage] = useState('')
  function sendMessage(){
      axios.post(`http://localhost:5000/users/${props.chosenUser.id}/notifications`, {
          created_by: props.chosenUser.id,
          sent_to: props.userToSendMessage.id,
          text: message
      })
      handleClose()
  }
  return (
    <div>
    <ListItem sx={{
      marginBottom: 2,
      border: '1px solid #ccc',
      borderRadius: '4px', 
      backgroundColor: '#f9f9f9', 
      padding: '10px',
    }}
      disableGutters
      secondaryAction={
        <IconButton aria-label="comment" onClick={handleOpen}>
          <CommentIcon />
        </IconButton>
      }
    >
      <ListItemText primary={`${props.userToSendMessage.username}`} />
    </ListItem>
    <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={modalStyle}>
        <div style={{ display: 'flex', flexDirection: 'column'}}>
  <TextField id="outlined-basic" label="Write your message" variant="outlined"  value={message}
  onChange={(e) => setMessage(e.target.value)}/>
  <Button variant="contained" endIcon={<SendIcon />} style={{ marginTop: '10px' }}
  onClick={sendMessage}>
    Send
  </Button>
</div>
        </Box>
      </Modal>
    </div>
  );
}

export default MessageUserList;