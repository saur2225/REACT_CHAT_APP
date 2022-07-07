import React, {useState} from 'react';
import {GoogleLogin, GoogleLogout} from 'react-google-login';
import GoogleButton from 'react-google-button';


function Login(props) {
    const clientId = "766883049818-9cebifn20g9ob7s52lpvkfm4hsboic95.apps.googleusercontent.com";
    const onLoginSuccess = (res) => {
        console.log(res);

        fetch('http://localhost:9100/app/checkUser', {
            method: 'POST',
            body: JSON.stringify({
                    email: res.profileObj.email,
                    name: res.profileObj.name,
                }),
            headers: {
                "content-type": "application/json; charset=UTF-8"
            }
        }).then(response => {
            response.json().then((data) => {
                console.log("data received", data);
                props.googleLogin(data);
            })
        }).catch(() => {
            console.log("login failed");
        })

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