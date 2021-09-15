import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Input, Button, message, Select, Spin } from 'antd';
import BackFooter from './../BackFooter';
import NotFound from './../../NotFound';
import jwt_decode from 'jwt-decode';
import PageNotFound from './../../PageNotFound';

function NewUser() {
    const baseUrl = 'http://localhost:8000/';

    const [l, setloggedin] = useState(true);
    const [r, setR] = useState(false);

    const [formvalue, SetFormvalue] = useState({
        username: "",
        password: "",
    })

    var roleid = 0;

    const [rolesList, setRolesList] = useState([])
    const [isAdmin, setAdmin] = useState(false);

    useEffect(() => {
        if (localStorage.getItem("token")) {
            axios.defaults.headers.common["Authorization"] = `JWT ${localStorage.getItem('token')}`;

            axios.get(baseUrl.concat("userdata/?user=" + jwt_decode(localStorage.getItem("token")).user_id))
                .then(res => {

                    if (res.data[0].role === "admin") {
                        setAdmin(true);
                    }
                })
                .then(() =>{
                    axios.get(baseUrl.concat("role/"))
                    .then(res => {
                        setRolesList(res.data);
                    })
                    .then(() =>{
                        setR(true);
                    })
                })
                .catch(error => {
                    console.log(error.response.status)
                    if (error.response.status === 401) {
                        localStorage.removeItem('token')
                        setloggedin(false);
                        setR(true);
                    }
                })
        } else {
            setloggedin(false);
            delete axios.defaults.headers.common["Authorization"];
            setR(true);
        }

        setTimeout(() => {
            return 0;
        }, 50);
    }, [])

    const ChangeHandler = (e) => {
        SetFormvalue({ ...formvalue, [e.target.name]: e.target.value })
    }

    const changeRole = (value) => {
        roleid = value;
    }

    const handle_signup = (e) => {
        e.preventDefault();
        console.log(formvalue);
        const key = 'updatable';
        message.loading({ content: 'Creating User ...', key, duration: 2 });

        // This function is not hashing the password. Check later why i used this code instead of one that follows.
        // axios.post(baseUrl.concat("user/"), formvalue)
        //     .then(response => {
        //         console.log(response)
        //         let new_user_id = response.data.id;
        //         console.log(new_user_id)
        //         message.loading({ content: 'Assigning Role...', key, duration: 2 });
        //         // assign role to user ( abstract user model)
        //         axios.post(baseUrl.concat("userdata/"), { user: new_user_id, role: roleid })
        //             .then(response => {
        //                 console.log(response)
        //                 setTimeout(() => {
        //                     message.success({ content: 'New User Created', key, duration: 2 });
        //                 }, 100);
        //             })
        //     })
        //     .catch(error => {
        //         console.log(error)
        //         message.error({ content: 'Failed to create User', key, duration: 2 });
        //         if (error.response.status === 401) {
        //             localStorage.removeItem('token')
        //             setloggedin(false);
        //         }
        //     })

        // create a new user (original model)
        fetch(baseUrl.concat("users/"), {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formvalue)
        })
            .then(res => res.json())
            .then((json) => {
                if (json.token) {
                    // get new user id
                    axios.get(baseUrl.concat("user/?username=" + formvalue.username))
                        .then(response => {
                            console.log("got id : ", response.data[0].id)
                            message.loading({ content: 'Assigning Role...', key, duration: 2 });
                            // assign role to user ( abstract user model)
                            axios.post(baseUrl.concat("userdata/"), { user: response.data[0].id, role: roleid })
                                .then(response => {
                                    console.log(response)
                                    setTimeout(() => {
                                        message.success({ content: 'New User Created', key, duration: 2 });
                                    }, 100);
                                })
                        })
                } else {
                    setTimeout(() => {
                        message.error({ content: 'User Already exists', key, duration: 2 });
                    }, 100);
                }
            });

        // clear fields
        SetFormvalue({
            username: "",
            password: "",
        })

    };


    const { Option } = Select;
    if (l && r) {
        return (
            <div>
                {isAdmin ?
                    <div>
                        <br /><br /><br /><br />
                        <h4 className="page-title">New User</h4>
                        <br /><br /><br /><br /><br />
                        <div className="container col-md-6 col-xl-3">
                            <form onSubmit={event => handle_signup(event)}>
                                <div>
                                    <h6>Username</h6>
                                    <Input style={{ borderRadius: "8px " }}  type="text" name="username" placeholder="Username" value={formvalue.username} onChange={event => ChangeHandler(event)} /> <br /><br />
                                </div>
                                <div>
                                    <h6>Password</h6>
                                    <Input style={{ borderRadius: "8px " }}  type="password" name="password" placeholder="Password" value={formvalue.password} onChange={event => ChangeHandler(event)} /> <br /><br />
                                </div>
                                <div>
                                    <h6>Assign a Role</h6>
                                    <Select placeholder="Assign Role" style={{ width: 300 }} onChange={changeRole}>
                                        {rolesList.map((rolez, index) => (
                                            <Option value={rolez.role}>{rolez.role}</Option>
                                        ))}
                                    </Select>
                                </div> <br /><br />
                                <div>
                                    <Button type="submit" onClick={event => handle_signup(event)}> Submit </Button>
                                </div>
                            </form> <br /><br /><br /><br /><br /><br />
                            <img src="assets/img/final_logo_PNG.png" width="200px" alt="logo" /><br /><br /><p>MIS system</p><br /> <br /><br /><br /><br />
                        </div>




                        <br /><br /><br /><br />
                        <BackFooter />
                    </div>
                    : <PageNotFound />
                }
            </div>
        )
    }
    else if (!r) {
        return (
            <div className="print-center">
                <br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br />
                <Spin tip="Loading..." />
            </div>
        )

    } else {
        return (
            <NotFound />
        )
    }
}

export default NewUser;