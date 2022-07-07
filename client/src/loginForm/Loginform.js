import React, {useState} from 'react';
import Login from '../Login';
import './Loginform.css';
//image imports ---
import cir22 from '../images/cir22.gif';
import user from '../images/user.png';
import lock from '../images/lock.png';
import arrow from '../images/right-arrow.png';
import done from '../images/done.gif';

export default function Loginform(props) {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showSignUp, setshowSignUp] = useState(false);
    const [showOTPscreen, setshowOTPscreen] = useState(false);
    const [otpValue1, setotpValue1] = useState([]);
    const [otpValue2, setotpValue2] = useState([]);
    const [otpValue3, setotpValue3] = useState([]);
    const [otpValue4, setotpValue4] = useState([]);

    const [successSignup, setsuccessSignup] = useState(false);

    const setLoginSetup = (isLogged) => {
        props.loginState(isLogged);
    }
    const joinRoom = () => {
        if (email !== "" && password !== "") {
            fetch('http://localhost:9100/app/login', {
                method: 'POST',
                body: JSON.stringify({
                        email: email,
                        password: password
                    }),
                headers: {
                    "content-type": "application/json; charset=UTF-8"
                }
            }).then(response => {
                response.json().then((data) => {
                    getAllUsers(data);
                })
            }).catch(() => {
                console.log("login failed");
            })
            props.loginState(true)
        }
    }

    const getAllUsers = (currentUser)=>{
        fetch('http://localhost:9100/app/allUser', {
            method: 'GET',
            headers: {
                "content-type": "application/json; charset=UTF-8"
            }
        }).then(response => {
            let res;
            response.json().then((data) => {
                res = data;
                props.setAllUsers(res, currentUser);
            });
        }).catch(() => {
            console.log("login failed");
        })
    }

    const registerUser = () => {
        if (email !== "" && password !== "" && name !== "") {
            fetch('http://localhost:9100/app/signup', {
                method: 'POST',
                body: JSON.stringify({
                    name: name,
                    email: email,
                    password: password
                }),
                headers: {
                    "Content-type": "application/json; charset=UTF-8"
                }
            }).then(response => {
                setshowOTPscreen(true);
                return response.json()
            })

        }
    }

    const googleLoginSuccess = (userData) => {
        getAllUsers(userData);
    }
    const changeSignupState = () => {
        setshowSignUp(!showSignUp);
    }

    const verifyOtp = () => {
        let finalOtp = otpValue1+otpValue2+otpValue3+otpValue4;
        fetch('http://localhost:9100/app/checkOTPverification', {
            method: 'POST',
            body: JSON.stringify({
                otp: finalOtp,
                name: name,
                email: email,
                password: password
            }),
            headers: {
                "Content-type": "application/json; charset=UTF-8"
            }
        }).then(response => {
            signUpSuccess(response);
            return response.json()
        })
    }


    const signUpSuccess = (data) => {
        console.log("suuss", data);
        setshowOTPscreen(false);
        setsuccessSignup(true);
        setTimeout(() => {
            setsuccessSignup(false);
            getAllUsers(data);
            props.loginState(true)
        }, 4000)
    }
    return (
        <div>
        {showOTPscreen && <div className='topOverlay'></div>}
        {!successSignup && <div className="form" style={{gap: showSignUp ? '10px' : '20px'}}>
            <img className="gitIllustration" src={cir22}></img>
            {showSignUp && <div className="content">
                <div className="fullname">
                    <span className="avt1"><img className="avatars" src={user} /></span>
                    <input type="text" autoComplete="off" placeholder="Enter your full name" onChange={(event) => { setName(event.target.value) }} />
                </div>
            </div>}
            <div className="content">
                <div className="name">
                    <span className="avt1"><img className="avatars" src={user} /></span>
                    <input type="text" autoComplete="off" placeholder="Enter your email ID" onChange={(event) => { setEmail(event.target.value) }} />
                </div>
            </div>
            <div className="content">
                <div className="roomId">
                    <span className="avt1"><img className="avatars" src={lock} /></span>
                    <input className="pass" autoComplete="off" type="text" placeholder="Enter your password" onChange={(event) => { setPassword(event.target.value) }} />
                </div>
            </div>
            <button onClick={showSignUp  ? registerUser : joinRoom }>{!showSignUp ? 'Sign in' : 'Sign up'}<span className="goNext"><img src={arrow} /></span></button>
            <span className="signupask"> {!showSignUp ? "Don't have an account?" :  "Already a user?"}<span className="signUp" onClick={changeSignupState}>{!showSignUp ? ' Sign up' : ' Sign in'}</span> now</span>
            <p><span>or</span></p>
            <div className="g-signin">
                <Login checkLogin = {setLoginSetup} googleLogin = {googleLoginSuccess}/>
            </div>
        </div>}
            {showOTPscreen && <div className='otpVerification'>
                <span className='verifyOtp'>Verify OTP</span>
                <span className='hint'>Please check you mail for OTP verification</span>
                    <div className='OTP-boxes'>
                        <input type="text" maxLength="1" className="otpContainer" onChange={(event) => { setotpValue1(event.target.value) }}/>
                        <input type="text" maxLength="1" className="otpContainer" onChange={(event) => { setotpValue2(event.target.value) }}/>
                        <input type="text" maxLength="1" className="otpContainer" onChange={(event) => { setotpValue3(event.target.value) }}/>
                        <input type="text" maxLength="1" className="otpContainer" onChange={(event) => { setotpValue4(event.target.value) }}/>
                    </div>
                <button className='Verify' onClick={verifyOtp}>Verify</button>
            </div>}
            {successSignup && <div className="doneContainer"><img src={done} /></div>}
        </div>
    )
}
