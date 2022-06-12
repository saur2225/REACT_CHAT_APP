import React, {useState} from 'react';
import {GoogleLogin, GoogleLogout} from 'react-google-login';
import GoogleButton from 'react-google-button';


function Login(props) {
    const clientId = "766883049818-9cebifn20g9ob7s52lpvkfm4hsboic95.apps.googleusercontent.com";


    const onLoginSuccess = (res) => {
        props.checkLogin(true);
    }
    const onFailureSuccess = () => {
        props.checkLogin(false);
    }
    return (
        <div>
                <GoogleLogin
                    clientId={clientId}
                    render={renderProps => (
                        <GoogleButton onClick={renderProps.onClick} style={{backgroundColor: '#7166E8', color: '#FFFFFF'}}>This is my custom Google button</GoogleButton>
                      )}
                    buttonText="Login"
                    onSuccess={onLoginSuccess}
                    onFailure={onFailureSuccess}
                    cookiePolicy={'single_host_origin'}
                    isSignedIn={true}
                /> 
        </div>
        
    )
}
export default Login;