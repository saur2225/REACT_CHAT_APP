import './App.css';
import io from 'socket.io-client'
import { useState, useEffect } from 'react';
import Chat from './chats';
import { gapi } from 'gapi-script';
import UserScreen from './UserScreen';
import Loginform from './loginForm/Loginform';
import chat from './Message';


const socket = io.connect(`${window.location.host.split(':')[0]}:9100`)

const clientId = '766883049818-9cebifn20g9ob7s52lpvkfm4hsboic95.apps.googleusercontent.com';

function App() {

  const [showChatSection, setshowChatSection] = useState(false);
  const [allDbUsers, setallDbUsers] = useState([]);
  const [isLoggedIn, setisLoggedIn] = useState(false);
  const [chatUser, setchatUser] = useState(false);
  const [userData, setUserData] = useState();
  const [currUser, setcurrUser] = useState();
  const [privateRoom, setPrivateRoom] = useState();
  const [allUserMgs, setallUserMsgs] = useState([]);

  // const [receivedMsg, setreceivedMsg] = useState([]);
  
  let isInitialized = undefined;


  const setAllUsersData = (data, loggedInUser) => {
    setcurrUser(loggedInUser);
    setallDbUsers(data);
  }

  useEffect(() => {
    function start(){
      gapi.client.init({
        clientId: clientId,
        scope: ""
      })
    };
    gapi.load('client:auth2', start);
  });


  useEffect(() => {
    socket.on("receive_all_Users", (data) => {
      setallDbUsers(data);
    });
  },[socket])

  const userSelected = (userData) => {
    console.log([userData.uniqueId, currUser[0].uniqueId].sort().join("--"));
    setPrivateRoom([userData.uniqueId, currUser[0].uniqueId].sort().join("--"));
    socket.emit('join_room', [userData.uniqueId, currUser[0].uniqueId].sort().join("--"));
    socket.emit('user_selected', userData);

    getAllMsgs([userData.uniqueId, currUser[0].uniqueId].sort().join("--"));
    console.log("get ll ca",privateRoom);
    setUserData(userData);
  }

  const getAllMsgs = (pr) => {
    fetch('http://localhost:9100/app/getAllMsgs', {
      method: 'POST',
      body: JSON.stringify({
              email: currUser[0].email,
              room: pr
          }),
      headers: {
          "content-type": "application/json; charset=UTF-8"
      }
  }).then(response => {
    response.json().then((data) => {
      setallUserMsgs(data);
      setchatUser(true);
    })
  }).catch(() => {
      console.log("login failed");
  })
  }
  // useEffect(() => {
  //   if (showChatSection) {
  //     socket.emit("room_joined", {email: email, password: password});
  //   }
  // }, [showChatSection])


  const setLoginState = (val) => {
    console.log("ye h val", val);
    setshowChatSection(val);
  }
  return (
    <div className="App">
      {!showChatSection && <Loginform socket={socket} loginState = {setLoginState} setAllUsers = {setAllUsersData}/>}
      {/* {showChatSection && <Chat socket={socket} username={username} room={room} loginCheck={setLoginSetup}/>} */}
      {showChatSection && !chatUser && <UserScreen socket={socket} allUsers = {allDbUsers} chatWithUser = {userSelected} loginCheck={setLoginState}/>}
      {chatUser && showChatSection && <Chat socket={socket} friend = {userData} loggedInUser = {currUser} allMsgs = {allUserMgs} currentRoom = {[userData.uniqueId, currUser[0].uniqueId].sort().join("--")} loginCheck={setLoginState}/>}
    </div>
  );
}

export default App;
