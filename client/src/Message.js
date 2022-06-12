import React from 'react'

const chat = ({ message, userName, isSameUser }) => {
    if (!(message && userName)) {
        return null
    }
    let avatar = <div className="chatter_avatar" style={{ background: isSameUser ? 'grey' : '#2F2E41', borderRadius: !isSameUser && 'none' }}>
        <img src={`https://avatars.dicebear.com/api/avataaars/${userName}.svg?radius=50&size=60`} />
    </div>
    return (
        <div className="msg_content">
            <div className="message" style={{ float: isSameUser ? 'right' : 'left' }}>
                {!isSameUser && avatar}
                <div className="msg" style={isSameUser ? ({ borderBottomLeftRadius: 20, background: '#7166E8' }) : { borderBottomRightRadius: 20, background: '#F5F5F7', color: '#000000' }}>
                    {!isSameUser && <span className="sender_name">{userName}</span>}
                    <span className="msgBox">{message}</span>
                    <span className="timer">9:11 PM</span>
                </div>
                {isSameUser && avatar}
            </div>
        </div >
    )
}

export default chat
