import { useEffect, useState } from 'react';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import Typography from '@mui/material/Typography';
import Checkbox from '@mui/material/Checkbox';
import ListItemSecondaryAction from '@mui/material/ListItemSecondaryAction';
import axios from 'axios';
import { User } from '../App';
import React from 'react';

export type Notification = {
  id: number,
  created_by: string,
  text: string,
  created_at: string
}
function UnreadMessagesList(props: {user: User, notifications: Notification[]}) {
  return (
    <List sx={{
      marginBottom: 2,
      border: '1px solid #ccc',
      borderRadius: '4px',
      backgroundColor: '#f9f9f9',
      padding: '10px',
    }}> Unread Messages
      {props.notifications.map((notification) => (
        <MessagesListItem
          notification={notification}
          user={props.user}
        />
      ))}
    </List>
  );
}

function MessagesListItem(props: { notification: Notification, user: User }) {
  const [isRead, setIsRead] = useState(false);
  const [username, setUsername] = useState('');
  useEffect(() => {
    axios.get(`http://localhost:5000/users/${props.notification.created_by}`, {
      headers: {
        'Content-Type': 'application/json',
      },
    })
    .then((response) => {
      setUsername(response.data.user[0].username);
    })
  }, [props.notification.created_by]);
  const handleCheckboxChange = () => {
    axios.post(`http://localhost:5000/users/${props.user.id}/notifications/${props.notification.id}`).then((responce) =>{
      if(responce.status == 200){
        setIsRead(true);  
      }
    })
  };
  return (
    <ListItem alignItems="flex-start" sx={{
      marginBottom: 2,
      border: '1px solid #ccc',
      borderRadius: '4px',
      backgroundColor: '#f9f9f9',
      padding: '10px',
    }}>
      <ListItemSecondaryAction>
      <Typography variant="body2" color="textSecondary">
          Mark as read
        </Typography>
        <Checkbox
          checked={isRead}
          onChange={handleCheckboxChange}
          color="primary"
        />
      </ListItemSecondaryAction>
      <ListItemText
  primary={username}
  secondary={
    <React.Fragment>
      <Typography variant="body1">
        {props.notification.text}
      </Typography>
      <Typography variant="caption" color="textSecondary">
        Date: {props.notification.created_at}
      </Typography>
    </React.Fragment>
  }
/>
    </ListItem>
  );
}

export default UnreadMessagesList;