import React, { useState } from 'react';
import CreateChannel from '../components/channel/CreateChannel';
import UseEventHandler from '../components/channel/UseEventHandler';
import ChatWindow from '../components/messages/ChatWindow';
import { useStore } from '../context';
import { SET_ROOM, SET_USER } from '../context/actions/types';
import { setUser } from '../context/actions/user';
import { setRoom } from '../context/actions/room';
import BackdropLoader from '../components/shared/BackdropLoader';
import { apiCall } from '../utils';
import { useNavigate } from 'react-router-dom';

const Chat = ()=> {
  const [messages, setMessages] = useState([]);
  const { users, rooms, dispatch } = useStore();
  const [loading, setLoading] = useState(false);
  const [newVotes, setNewVotes] = useState([]);
  const [messageId, setMessageId] = useState(null);
  const navigate = useNavigate();

  const chatChannel = CreateChannel(`chat:${rooms.roomName}`, {});

  if(!JSON.parse(localStorage.getItem("sariska-chat-userName"))){
    navigate('/')
  }

  UseEventHandler(chatChannel, 'user_joined', setLoading, async (response) => {
       const {room, user}  = response;
            let userDetails = {id : user.id, name: user.name};
            let roomDetails = {session_id : room.session_id, created_by: room.created_by, inserted_at: room.inserted_at};
            dispatch(setRoom(SET_ROOM, roomDetails));
            dispatch(setUser(SET_USER, userDetails));
  });

  UseEventHandler(chatChannel, 'ping', setLoading, message => {
    console.info('ping', message)
  })
  
  UseEventHandler(chatChannel, "presence_state",setLoading, (response) => {
    
    console.log('presences', response);
  })
  UseEventHandler(chatChannel, "presence_diff",setLoading, (response) => {
    
    console.log('presence_diff', response);
  })

  UseEventHandler(chatChannel, 'new_message', setLoading, message => {
      setMessages(messages => [...messages, message])
  });


  UseEventHandler(chatChannel, 'new_vote', setLoading, vote => {
    let channel_id = rooms.room?.session_id;
    const fetchVotes = async() => {
      await fetchTotalVotes(channel_id, vote.message_id)
    }
    fetchVotes();
  });


  UseEventHandler(chatChannel, 'archived_message', setLoading, message => {
      setMessages(messages => [...messages, message])
  });

  UseEventHandler(chatChannel, 'archived_message_count', setLoading, payload => {
     const { page: { count }} = payload;
     console.log('total archived message count', count); 
  });

  const pushMessage = ( content, type )=>{
    const new_message = {
      created_by_name: users.user.name,  
      x: "uu", 
      y: { x: "ghhg"}
    };
    if(type){
      new_message['content_type'] = type;
      new_message['content'] = content.question;
      new_message['options'] = content.options;
    }else{
      new_message['content'] = content;
    }
    chatChannel.push('new_message', new_message);
};

const pushVote = ( content )=>{
  const new_vote = {
    user_id: users.user.id,
    message_id: content.message_id,
    answer: content.answer,  
    x: "uu", 
    y: { x: "ghhg"}
  };
  chatChannel.push('new_vote', new_vote);
};

const fetchTotalVotes = async ( channel_id, message_id) => {
  let path = `/rooms/${channel_id}/messages/${message_id}/poll/votes`;
  try {
    const response = await apiCall(path, "GET");
    if(response.status === 200){
      setMessageId(message_id);
      setNewVotes(response.votes);
    }
  } catch (e) {
    console.log(e);
  }
};

  return (
      <div className="App">
        <BackdropLoader open={loading} />
        <ChatWindow 
          messages={messages} 
          pushMessage={pushMessage} 
          loading={loading} 
          pushVote={pushVote} 
          newVotes={newVotes} 
          fetchTotalVotes={fetchTotalVotes}
          messageId={messageId}
          />
      </div>
  );
}

export default Chat;