import { useEffect, useState } from 'react';
import axios from 'axios';
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
const StyledBadge = styled(Badge)<BadgeProps>(({ theme }) => ({
  '& .MuiBadge-badge': {
    right: 10,
    top: 0,
    border: `2px solid ${theme.palette.background.paper}`,
    padding: '0 4px',
  },
}));
export default function UserList() {
  const [users, setUsers] = useState([] as User[])
  useEffect(() => {
    axios.get(`http://localhost:5000/users`, {
      headers: {
        'Content-Type': 'application/json'
      }
    })
    .then((response) => {
       setUsers(response.data.user)
    })
  }, []);
    return (<List>
      {users.map((user) => (
        <UserListItem user={user} key={user.id}/>
      ))}
    </List>)
  }
  function UserListItem(props: {user: User}) {
    const [isSelected, changeSelected] = useState(false as boolean)
    useEffect(
      () => {
        const socket = new WebSocket('ws://localhost:5001')
        socket.onopen = () => {
          const sendUser = {
            clientId: props.user.id
          }
          socket.send(JSON.stringify(sendUser))
        }
        
        socket.addEventListener('message', () => {
          getNotifications().then((result) =>{
            setNotifications(result)
          })
        })
      }, [props.user.id]
    )
    const handleButton = () => {
      changeSelected(!isSelected)
      getNotifications().then((result) =>{
        setNotifications(result)
      })
    }
    const handleInnerClick = (event: React.MouseEvent) => {
      event.stopPropagation();
    };
  const [notifications, setNotifications] = useState([] as Notification[])
  async function getNotifications(): Promise<Notification[]> {
    const response = await axios.get(`http://localhost:5000/users/${props.user.id}/notifications/notRead`, {
      headers: {
        'Content-Type': 'application/json'
      }
    });
  
    return response.data.notifications as Notification[];
  }
  useEffect(() => {
    const fetchNotifications = async () => {
        setNotifications(await getNotifications())
    }
    fetchNotifications()
  }, [])
  return (
    <ListItem disablePadding>
  <ListItemButton disableRipple={isSelected} onClick={handleButton}>
    <StyledBadge badgeContent={`${notifications.length}`} color="secondary">
    </StyledBadge>
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <ListItemText primary={`${props.user.username}`} />
      </Grid>
      <Grid item xs={6} onClick={handleInnerClick}>
        {isSelected && <UnreadMessagesList user={props.user} notifications={notifications}/>}
      </Grid>
      <Grid item xs={6} onClick={handleInnerClick}>
        {isSelected && <MessageUserList user={props.user}/>}
      </Grid>
    </Grid>
  </ListItemButton>
</ListItem>
  );
  }