import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Input, Button, message } from 'antd';
import { useHistory } from "react-router-dom";
import BackFooter from './BackFooter';
import { Spin } from 'antd';

function Login() {
    const baseUrl = 'http://localhost:8000/';

    const history = useHistory();

    const [rendered, setR] = useState(false);

    const [formvalue, SetFormvalue] = useState({
        username: "",
        password: "",
    })

    useEffect(() => {
        if (localStorage.getItem("token")) {
            axios.defaults.headers.common["Authorization"] = `JWT ${localStorage.getItem('token')}`;

            axios.get(baseUrl.concat("current_user"))
                .then(res => {
                    history.push("/1Menu")
                })
                .catch(error => {
                    console.log(error.response.status)
                    if (error.response.status === 401) {
                        localStorage.removeItem('token')
                        setR(true);
                    }
                })

        } else {
            setR(true);
            delete axios.defaults.headers.common["Authorization"];
        }

        setTimeout(() => {
            return 0;
        }, 200);
    })

    const ChangeHandler = (e) => {
        SetFormvalue({ ...formvalue, [e.target.name]: e.target.value })
    }


    const handle_login = (e) => {
        e.preventDefault();
        const key = 'updatable';
        message.loading({ content: 'Loading...', key });
        console.log(formvalue);
        fetch(baseUrl.concat("token-auth/"), {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formvalue)
        })
            .then(res => res.json())
            .then((json) => {
                if (json.token) {
                    localStorage.setItem('token', json.token);
                    setTimeout(() => {
                        message.success({ content: 'Verified', key, duration: 2 });
                        history.push('/1Menu');
                        window.location.reload();
                    }, 100);
                } else {
                    setTimeout(() => {
                        message.error({ content: 'Invalid Username or Password!', key, duration: 2 });
                    }, 100);
                }
            });
    };


    //  // original 1 user
    // const HandleSubmit = (e) => {
    //     const key = 'updatable';
    //     message.loading({ content: 'Loading...', key });
    //     e.preventDefault()
    //     console.log(formvalue)
    //     axios.get(baseUrl.concat("userdata/?username=" + formvalue.username + "&password=" + formvalue.password))
    //         .then(res => {
    //             console.log(res.data);
    //             if (res.data.length === 1) {
    //                 setTimeout(() => {
    //                     message.success({ content: 'Verified', key, duration: 2 });
    //                 }, 100);
    //                 let role = res.data[0].role
    //                 if (role === "admin") {
    //                     history.push('/1master')      // have to change urls
    //                 } else if (role === "pm") {
    //                     history.push('/1reqsite')     // have to change urls
    //                 } else if (role === "ho") {
    //                     history.push('/1po')
    //                 } else {
    //                     history.push('/1req')
    //                 }
    //                 console.log(res.data[0].role)
    //             } else {
    //                 setTimeout(() => {
    //                     message.error({ content: 'Invalid Username or Password!', key, duration: 2 });
    //                 }, 100);
    //                 SetFormvalue({
    //                     username: "",
    //                     password: "",
    //                 })

    //             }
    //         })
    //         .catch(function (error) {
    //             console.log("FFFF");
    //         })

    // }
    if (rendered) {
        return (
            <div className="login-page-bg">
                {/* <div className="container col-md-6 col-xl-3">
                    <br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br />
                    <h3>Sign in</h3>
                    <form onSubmit={event => handle_login(event)}>
                        <div>
                            <Input style={{ borderRadius: "8px " }}  type="text" name="username" placeholder="Username" value={formvalue.username} onChange={event => ChangeHandler(event)} /> <br /><br />
                        </div>
                        <div>
                            <Input style={{ borderRadius: "8px " }}  type="password" name="password" placeholder="Password" value={formvalue.password} onChange={event => ChangeHandler(event)} /> <br /><br />
                        </div>
                        <div>
                            <Button type="submit" onClick={event => handle_login(event)}> Submit </Button>
                        </div>
                    </form> <br /><br /><br /><br /><br /><br />
                    <img src="assets/img/final_logo_PNG.png" width="200px" alt="logo" /><br /><br /><p>MIS system</p><br /> <br /><br /><br /><br />
                </div> */}
                <div className="print-center" >
                    <img src="assets/img/final_logo_JPG1.jpg" alt="pctppl_logo" height="90px" className="logo-login"/>
                </div>

                <div class="container1">
                    <div class="screen">
                        <div class="screen__content">
                            <form class="login" onSubmit={event => handle_login(event)}>
                                <div class="login__field">
                                    <i class="login__icon fas fa-user"></i>
                                    <input type="text" class="login__input" type="text" name="username" placeholder="Username" value={formvalue.username} onChange={event => ChangeHandler(event)} />
                                </div>
                                <div class="login__field">
                                    <i class="login__icon fas fa-lock"></i>
                                    <input type="password" class="login__input" name="password" placeholder="Password" value={formvalue.password} onChange={event => ChangeHandler(event)} />
                                </div>
                                <button class="button login__submit">
                                    <span class="button__text" onClick={event => handle_login(event)} >Log In</span>
                                    <i class="button__icon fas fa-chevron-right"></i>
                                </button>
                            </form>
                        </div>
                        <div class="screen__background">
                            <span class="screen__background__shape screen__background__shape4"></span>
                            <span class="screen__background__shape screen__background__shape3"></span>
                            <span class="screen__background__shape screen__background__shape2"></span>
                            <span class="screen__background__shape screen__background__shape1"></span>
                        </div>
                    </div>
                </div>
            </div>
        )
    } else {
        return (
            <div className="print-center">
                <br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br />
                <Spin tip="Loading..." />
            </div>

        )

    }
}

export default Login;