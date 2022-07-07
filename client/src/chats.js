import React, { useEffect, useState } from 'react';
import send from './images/send.png';
import attachment from './images/attached.png';
import noMsg from './images/noMsg.gif';
import ChatMessage from './Message';
import Logout from './Logout';
import { GoogleLogout } from 'react-google-login';
import './chats.css';

function Chat({ socket, friend, loggedInUser, allMsgs, currentRoom, loginCheck }) {
    console.log("cloggedInUser", loggedInUser[0].messages);
    console.log("allMsgs", allMsgs);
    const [currentMesage, setCurrentMessage] = useState("");
    const [receivedMsg, setreceivedMsg] = useState(allMsgs);
    const [showChats, setShowChats] = useState(false);
    const clientId = "766883049818-9cebifn20g9ob7s52lpvkfm4hsboic95.apps.googleusercontent.com";
    
    const sendMessage = async (e) => {
        if (currentMesage !== "" && (e.which === 13 || e.type === "click")) {
                setShowChats(true);
                const messageData = {
                    room: currentRoom,
                    currentUser: loggedInUser[0].uniqueId,
                    author: loggedInUser[0].name,
                    friend: friend.uniqueId,
                    message: currentMesage,
                    time: +new Date()
                }
                socket.emit("send_message", messageData)
                setreceivedMsg(previousData => [...previousData, messageData]);
                setCurrentMessage('');
                setTimeout(() => {
                    let elem = document.getElementsByClassName('msg_container');
                    console.log(elem[0].scrollHeight);
                    elem[0].scrollTop = elem[0].scrollHeight+100;

                }, 100)
            }
    }
        useEffect(() => {
            setTimeout(() => {
                let elem = document.getElementsByClassName('msg_container');
                console.log(elem[0].scrollHeight);
                elem[0].scrollTop = elem[0].scrollHeight+100;

            }, 100)
            if(allMsgs.length > 0){
                setShowChats(true);
            }
            // setreceivedMsg(...loggedInUser[0].messages);
            socket.on("receive_message", (data) => {
                setShowChats(true);
                setreceivedMsg(previousData => [...previousData, data]);
            });
       },[socket])

       const onSignoutSuccess = () => {
            loginCheck(false);
       }

    return (
        <div className="main_container">
            <div className="chat-header">
            </div>
            <div className="chat-body">
                <div className="logoutContainer">
                    <Logout signoutCheck= {onSignoutSuccess}/>
                </div>
                <div className="msg_container">
                    {!showChats && <div className="empty">
                        <img className="noImg" src={noMsg}/>  
                        <span className="noMsg">No messages</span>
                    </div>}
                    {showChats && receivedMsg.map((message, _) => {
                        return <ChatMessage key={_} message={message.message} userName={message.author} isSameUser={message.author === loggedInUser[0].name ? true : false} />
                    })}
                </div>
            </div>
            <div className="chat-footer">
                <div className="content_msg">
                    <button><img className="assess" src={attachment} /></button>
                    <input type="text" placeholder="Type message..." value={currentMesage} onKeyDown={sendMessage}  onInput={(event) => { setCurrentMessage(event.target.value) }} />
                    <button onClick={sendMessage}><img className="assess" src={send} /></button>
                </div>
            </div>
        </div>
    )
}

export default Chat;