import React, { useState, useEffect } from 'react';
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
import { Api } from '../Api';
import styles from './MessageUserList.module.css';

const api = new Api()

type MessageUserListProps = {
  user: User
}

type MessageUserListItemProps = {
  chosenUser: User,
  userToSendMessage: User
}

function MessageUserList(props: MessageUserListProps) {
  const [otherUsers, setOtherUsers] = useState([] as User[]);
  const chosenUser = props.user;
  useEffect(() => {
    const asyncSetUsers = async () => {
      const data = await api.getUsersExceptChosen(chosenUser)
      setOtherUsers(data)
    }
    asyncSetUsers()
  }, [chosenUser]);
  return (
    <List className={styles.modalList}>
      {otherUsers.map((user: User) => (
        <MessageUserListItem key={user.id} chosenUser={chosenUser} userToSendMessage={user} />
      ))}
    </List>
  );
}

function MessageUserListItem(props: MessageUserListItemProps) {

  const [open, setOpen] = React.useState(false);

  const handleOpen = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    event.stopPropagation();
    setOpen(true);
  }

  const handleClose = () => setOpen(false);

  const [message, setMessage] = useState('')

  async function sendMessage() {
    await api.sendMessage(props.chosenUser, props.userToSendMessage, message)
    handleClose()
  }

  return (
    <div>
      <ListItem className={styles.messageUserListItem}
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
      >
        <Box>
          <div className={styles.modalContainer}>
            <TextField id="outlined-basic" label="Write your message" variant="outlined" value={message} onChange={(e) => setMessage(e.target.value)} />
            <Button variant="contained" endIcon={<SendIcon />} className={styles.modalSendButton} onClick={sendMessage}>
              Send
            </Button>
          </div>
        </Box>
      </Modal>
    </div >
  );
}

export default MessageUserList;