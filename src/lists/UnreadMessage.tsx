import React from 'react';
import { useEffect, useState } from 'react';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import Typography from '@mui/material/Typography';
import Checkbox from '@mui/material/Checkbox';
import ListItemSecondaryAction from '@mui/material/ListItemSecondaryAction';
import { User } from '../App';
import { Api } from '../Api';
import styles from './UnreadMessage.module.css';

const api = new Api()

export type Notification = {
  id: number,
  created_by: string,
  text: string,
  created_at: string
}

type UnreadMessagesListProps = {
  user: User,
  notifications: Notification[]
}

type MessagesListItemProps = {
  notification: Notification,
  user: User
}

function UnreadMessagesList(props: UnreadMessagesListProps) {
  return (
    <List className={styles.UnreadMessagesList}>
      Unread Messages
      {props.notifications.map((notification) => (
        <MessagesListItem
          notification={notification}
          user={props.user}
        />
      ))}
    </List>
  );
}

function MessagesListItem(props: MessagesListItemProps) {

  const [isRead, setIsRead] = useState(false);
  const [username, setUsername] = useState('');

  useEffect(() => {
    const asyncSetUsername = async () => {
      const data = await api.getUser(Number(props.notification.created_by))
      setUsername(data.username);
    }
    asyncSetUsername()
  }, [props.notification.created_by]);

  const handleCheckboxChange = async () => {
    const isSuccess = await api.readMessage(props.notification.id)
    console.log(isSuccess)
    setIsRead(isSuccess)
  };

  return (
    <ListItem className={styles.UnreadMessagesListItem}>
      <ListItemSecondaryAction>
        <Typography>
          Mark as read
        </Typography>
        <Checkbox
          checked={isRead}
          onChange={handleCheckboxChange}
        />
      </ListItemSecondaryAction>
      <ListItemText
        primary={username}
        secondary={
          <React.Fragment>
            <Typography>
              {props.notification.text}
            </Typography>
            <Typography>
              Date: {props.notification.created_at}
            </Typography>
          </React.Fragment>
        }
      />
    </ListItem>
  );
}

export default UnreadMessagesList;