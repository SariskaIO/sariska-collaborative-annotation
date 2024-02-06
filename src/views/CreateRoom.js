import { Avatar, Box, Button, Container, CssBaseline, TextField, Typography, makeStyles } from '@material-ui/core'
import React, { useEffect, useState } from 'react'
import 
LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Copyright from '../components/shared/Copyright';
import { colors } from '../assets/styles/colors';
import { useStore } from '../context';
import { setUserName } from '../context/actions/user';
import { SET_ROOM_NAME, SET_USER_NAME } from '../context/actions/types';
import { useNavigate } from 'react-router-dom';
import { setRoomName } from '../context/actions/room';

const useStyles = makeStyles((theme) => ({
    paper: {
      marginTop:
       theme.spacing(8),
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
    },
    avatar: {
      margin: theme.spacing(1),
      backgroundColor: colors.primary,
    },
    form: {
      width: '100%', // Fix IE 11 issue.
      marginTop: theme.spacing(1),
    },
    submit: {
      margin: theme.spacing(3, 0, 2),
      padding: theme.spacing(1)
    },
  }));

const initialState = {
    roomName: JSON.parse(localStorage.getItem("sariska-chat-room"))?.session_id || '',
    userName: JSON.parse(localStorage.getItem("sariska-chat-user"))?.name || '',
    error: ''
}

const CreateRoom = () => {
    const classes = useStyles();
    const [state, setState] = useState(initialState);
    const { dispatch } = useStore();
    const navigate = useNavigate();
    
    const handleChange = (e) => {
        const {name, value} = e.target;
        setState(state => ({...state, [name]: value}));
    }
    
    const handleSubmit = (e) => {
        e.preventDefault();
        if(!state.roomName && !state.userName) {
          setState(state => ({...state, ['error']: 'Required fields can not be kept blank'}))
          return;
        }
        if(JSON.parse(localStorage.getItem('sariska-chat-roomName')) !== state.roomName){
          dispatch(setRoomName(SET_ROOM_NAME, state.roomName));
        }
        if(JSON.parse(localStorage.getItem('sariska-chat-userName')) !== state.userName){
          dispatch(setUserName(SET_USER_NAME, state.userName));
        }
        navigate('/chat');
    }

    useEffect(()=>{
      setState(state => ({
        ...state, 
        roomName: JSON.parse(localStorage.getItem("sariska-chat-room"))?.session_id || '',
        userName: JSON.parse(localStorage.getItem("sariska-chat-user"))?.name || ''
      }))
    },[])

  return (
    <Box sx={{width: '100%', height: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
        <Container component="main" maxWidth="xs">
      <CssBaseline />
      <div className={classes.paper}>
        <Avatar className={classes.avatar}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          Create Room
        </Typography>
        <form className={classes.form} noValidate>
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            label="Room Name"
            name="roomName"
            value={state.roomName}
            onChange={handleChange}
            autoFocus
          />
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            name="userName"
            label="Username"
            value={state.userName}
            onChange={handleChange}
          />
          {state.error ? <Typography style={{color: 'red', textAlign: 'left'}}>( * ) {state.error}</Typography> : null }
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            className={classes.submit}
            onClick={handleSubmit}
          >
            Start Chat
          </Button>
        </form>
      </div>
      <Box mt={8}>
        <Copyright />
      </Box>
    </Container>
    </Box>
  )
}

export default CreateRoom