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
            <div>
                <div className="container col-md-6 col-xl-3">
                    <br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br />
                    <h3>Sign in</h3>
                    <form onSubmit={event => handle_login(event)}>
                        <div>
                            <Input type="text" name="username" placeholder="Username" value={formvalue.username} onChange={event => ChangeHandler(event)} /> <br /><br />
                        </div>
                        <div>
                            <Input type="password" name="password" placeholder="Password" value={formvalue.password} onChange={event => ChangeHandler(event)} /> <br /><br />
                        </div>
                        <div>
                            <Button type="submit" onClick={event => handle_login(event)}> Submit </Button>
                        </div>
                    </form> <br /><br /><br /><br /><br /><br />
                    <img src="assets/img/final_logo_PNG.png" width="200px" alt="logo" /><br /><br /><p>MIS system</p><br /> <br /><br /><br /><br />
                </div>
                <BackFooter />
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