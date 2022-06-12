import React, {useState} from 'react';
import {GoogleLogout} from 'react-google-login';
import './logout.css';

function Logout(props) {
    const clientId = "766883049818-9cebifn20g9ob7s52lpvkfm4hsboic95.apps.googleusercontent.com";
    const onSignoutSuccess = () => {
        props.signoutCheck();  
    }
    return (
        <div className="logoutButton">
        <GoogleLogout
            clientId={clientId}
            buttonText="Logout"
            onLogoutSuccess={onSignoutSuccess}
        ></GoogleLogout> 
        </div>
        
    )
}
export default Logout;