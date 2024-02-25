import { useEffect, useState } from 'react';
import * as React from 'react';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import { Grid, List } from '@mui/material';
import Badge, { BadgeProps } from '@mui/material/Badge';
import { styled } from '@mui/material/styles';
import { User } from '../App';
import UnreadMessagesList from './UnreadMessage';
import MessageUserList from './MessageUser';
import { Notification } from './UnreadMessage';
import { Api } from '../Api';
import styles from './Badge.module.css'

const api = new Api()

const StyledBadge = styled(Badge)<BadgeProps>(() => ({
  '& .MuiBadge-badge': styles.badge,
}));

export default function UserList() {

  const [users, setUsers] = useState([] as User[])

  useEffect(() => {
    const asyncSetUsers = async () => {
      const userss = await api.getUsers()
      setUsers(userss)
    }
    asyncSetUsers()
  }, []);

  return (
    <List>
      {users.map((user) => (
        <UserListItem user={user} key={user.id} />
      ))}
    </List>
  )
}
type UserListItemProps = {
  user: User
}
function UserListItem(props: UserListItemProps) {
  const [isSelected, changeSelected] = useState(false as boolean)
  const [notifications, setNotifications] = useState([] as Notification[])
  useEffect(
    () => {
      const socket = new WebSocket(`${process.env.REACT_APP_SOCKET}`);
      socket.onopen = () => {
        const sendUser = {
          clientId: props.user.id
        };
        socket.send(JSON.stringify(sendUser));
      };
      socket.addEventListener('message', async () => {
        const result = await api.getNotifications(props.user.id);
        setNotifications(result);
      });
      window.addEventListener('beforeunload', () => {
        socket.close();
      });
      socket.onclose = () => {
        console.log('closing connection')
      }
      return () => {
        socket.close();
        // after each re-render curr socket will be closed
      };

    }, [props.user.id]
  )

  const handleButton = async () => {
    changeSelected(!isSelected)
    setNotifications(await api.getNotifications(props.user.id))
  }

  const handleInnerClick = (event: React.MouseEvent) => {
    event.stopPropagation();
  };

  useEffect(() => {
    const fetchNotifications = async () => {
      setNotifications(await api.getNotifications(props.user.id))
    }
    fetchNotifications()

  }, [props.user.id])
  return (
    <ListItem disablePadding>
      <ListItemButton disableRipple={isSelected} onClick={handleButton}>
        <StyledBadge badgeContent={`${notifications.length}`} className={styles.styledBadge}>
        </StyledBadge>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <ListItemText primary={`${props.user.username}`} />
          </Grid>
          <Grid item xs={6} onClick={handleInnerClick}>
            {isSelected && <UnreadMessagesList user={props.user} notifications={notifications} />}
          </Grid>
          <Grid item xs={6} onClick={handleInnerClick}>
            {isSelected && <MessageUserList user={props.user} />}
          </Grid>
        </Grid>
      </ListItemButton>
    </ListItem>
  );
}