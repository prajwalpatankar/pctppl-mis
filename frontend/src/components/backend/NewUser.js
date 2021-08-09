import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Input, Button, message, Select } from 'antd';
import BackFooter from './BackFooter';
import NotFound from './../NotFound';
import jwt_decode from 'jwt-decode';
import PageNotFound from '../PageNotFound';

function NewUser() {
    const baseUrl = 'http://localhost:8000/';

    const [formvalue, SetFormvalue] = useState({
        username: "",
        password: "",
    })

    var roleid = 0;

    const [rolesList, setRolesList] = useState([])
    const [isAdmin, setAdmin] = useState(false);
    const [l, setloggedin] = useState(true);
    useEffect(() => {
        if (localStorage.getItem("token")) {
            axios.defaults.headers.common["Authorization"] = `JWT ${localStorage.getItem('token')}`;

            axios.get(baseUrl.concat("userdata/?user=" + jwt_decode(localStorage.getItem("token")).user_id))
                .then(res => {

                    if (res.data[0].role === "admin") {
                        setAdmin(true);
                    }
                })
                .catch(error => {
                    console.log(error.response.status)
                    if (error.response.status === 401) {
                        localStorage.removeItem('token')
                        setloggedin(false);
                    }
                })
        } else {
            delete axios.defaults.headers.common["Authorization"];
        }
        axios.get(baseUrl.concat("role/"))
            .then(res => {
                setRolesList(res.data);
            })
        setTimeout(() => {
            return 0;
        }, 200);
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

        axios.post(baseUrl.concat("user/"), formvalue)
            .then(response => {
                console.log(response)
                let new_user_id = response.data.id;
                console.log(new_user_id)
                message.loading({ content: 'Assigning Role...', key, duration: 2 });
                // assign role to user ( abstract user model)
                axios.post(baseUrl.concat("userdata/"), { user: new_user_id, role: roleid })
                    .then(response => {
                        console.log(response)
                        setTimeout(() => {
                            message.success({ content: 'New User Created', key, duration: 2 });
                        }, 100);
                    })
            })
            .catch(error => {
                console.log(error)
                message.error({ content: 'Failed to create User', key, duration: 2 });
                if (error.response.status === 401) {
                    localStorage.removeItem('token')
                    setloggedin(false);
                }
            })

        // create a new user (original model)
        // fetch(baseUrl.concat("users/"), {
        //     method: 'POST',
        //     headers: {
        //         'Content-Type': 'application/json'
        //     },
        //     body: JSON.stringify(formvalue)
        // })
        //     .then(res => res.json())
        //     .then((json) => {
        //         if (json.token) {
        //             // get new user id
        //             axios.get(baseUrl.concat("user/?username=" + formvalue.username))
        //                 .then(response => {
        //                     console.log("got id : ", response.data[0].id)
        //                     setRole({
        //                         ...role,
        //                         user: response.data[0].id,
        //                     })
        //                     message.loading({ content: 'Assigning Role...', key, duration: 2 });
        //                     // assign role to user ( abstract user model)
        //                     axios.post(baseUrl.concat("userdata/"), role)
        //                         .then(response => {
        //                             console.log(response)
        //                             setTimeout(() => {
        //                                 message.success({ content: 'New User Created', key, duration: 2 });
        //                             }, 100);
        //                         })
        //                 })
        //         } else {
        //             setTimeout(() => {
        //                 message.error({ content: 'User Already exists', key, duration: 2 });
        //             }, 100);
        //         }
        //     });

        // clear fields
        SetFormvalue({
            username: "",
            password: "",
        })

    };


    const { Option } = Select;
    if (l) {
        return (
            <div>
                {isAdmin ? 
                <div>
                <div className="container col-md-6 col-xl-3">
                    <br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br />
                    <h3>Create New User</h3>
                    <form onSubmit={event => handle_signup(event)}>
                        <div>
                            <Input type="text" name="username" placeholder="Username" value={formvalue.username} onChange={event => ChangeHandler(event)} /> <br /><br />
                        </div>
                        <div>
                            <Input type="password" name="password" placeholder="Password" value={formvalue.password} onChange={event => ChangeHandler(event)} /> <br /><br />
                        </div>
                        <div>
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
    } else {
        return (
            <NotFound />
        )
    }
}

export default NewUser;