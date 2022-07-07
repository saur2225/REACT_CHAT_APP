import React from 'react'
import './UserScreen.css';
import friend from './images/friend.png';
import Logout from './Logout';
const UserScreen = (props) => {
    const openChat = (event) => {
        props.chatWithUser(event);
    }
    const onSignoutSuccess = () => {
        props.loginCheck(false);
   }
    return (
        <div className="containerrr">
            <div className="userHeader">
                All Friends
            </div>
            <div className="logoutContainer">
                    <Logout signoutCheck= {onSignoutSuccess}/>
                </div>
            {props.allUsers.map((users) => {
                return <div className="friend" key={users.uniqueId} onClick={() => {openChat(users)}}><span className="avatar"><img src={friend} /></span><span>{users.name}</span></div>
            })}
        </div>
    )
}
export default UserScreen;