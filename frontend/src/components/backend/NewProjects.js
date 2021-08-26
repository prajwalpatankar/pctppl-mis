import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Input, Button, message, Select , Spin } from 'antd';
import BackFooter from './BackFooter';
import NotFound from '../NotFound';
import PageNotFound from '../PageNotFound';
import jwt_decode from "jwt-decode";

function NewProjects() {
    const baseUrl = 'http://localhost:8000/';

    const [l, setloggedin] = useState(true);
    const [r, setR] = useState(false);

    const [formvalue, SetFormvalue] = useState({
        project_name: "",
        location: "",
        user: "",
        pm: "",
    })

    const [userList, setUserList] = useState([])
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
                .catch(error => {
                    console.log(error.response.status)
                    if (error.response.status === 401) {
                        localStorage.removeItem('token')
                        setloggedin(false);
                    }
                })
            axios.get(baseUrl.concat("user/"))
                .then(res => {
                    setUserList(res.data);
                })
                .catch(error => {
                    console.log(error.response.status)
                    if (error.response.status === 401) {
                        localStorage.removeItem('token')
                        setloggedin(false);
                    }
                })
        } else {
            setloggedin(false);
            delete axios.defaults.headers.common["Authorization"];
        }
        setTimeout(() => {
            setR(true);
            return 0;
        }, 50);
    }, [])


    const ChangeHandler = (e) => {
        SetFormvalue({ ...formvalue, [e.target.name]: e.target.value })
    }

    const changePM = (value) => {
        SetFormvalue({
            ...formvalue,
            pm: value,
        })
    }

    const changeSK = (value) => {
        SetFormvalue({
            ...formvalue,
            user: value,
        })
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log(formvalue);
        message.loading({ content: 'Creating Project ...', key, duration: 4 });

        axios.post(baseUrl.concat("projects/"), formvalue)
            .then(response => {
                console.log(response)
                // clear fields
                SetFormvalue({
                    ...formvalue,
                    project_name: "",
                    location: "",
                })

            })
            .catch(error => {
                console.log(error)
                setTimeout(() => {
                    message.error({ content: 'Error in creating Project. Please try again !', key, duration: 4 });
                }, 100);
                if (error.response.status === 401) {
                    localStorage.removeItem('token')
                    setloggedin(false);
                }
            })

    }

    // antd
    const key = 'updatable';
    const { Option } = Select;

    if (l&& r) {
        return (
            <div>
                {isAdmin ?
                    <div>
                        <div className="container col-md-6 col-xl-3">
                            <br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br />
                            <h3>Create a New Project</h3>
                            <form onSubmit={event => handleSubmit(event)}>
                                <div>
                                    <Input type="text" name="project_name" placeholder="Project Name" value={formvalue.project_name} onChange={event => ChangeHandler(event)} /> <br /><br />
                                </div>
                                <div>
                                    <Input type="text" name="location" placeholder="Location" value={formvalue.location} onChange={event => ChangeHandler(event)} /> <br /><br />
                                </div>
                                <div>
                                    <Select
                                        showSearch
                                        style={{ width: 300 }}
                                        placeholder="Select Project Manager"
                                        optionFilterProp="children"
                                        onChange={changePM}
                                        filterOption={(input, option) =>
                                            option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                                        }
                                    >
                                        {userList.map((user, index) => (
                                            <Option value={user.id}>{user.username}</Option>
                                        ))}
                                    </Select><br /><br />
                                </div>
                                <div>
                                    <Select
                                        showSearch
                                        style={{ width: 300 }}
                                        placeholder="Select Storekeeper"
                                        optionFilterProp="children"
                                        onChange={changeSK}
                                        filterOption={(input, option) =>
                                            option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                                        }
                                    >
                                        {userList.map((user, index) => (
                                            <Option value={user.id}>{user.username}</Option>
                                        ))}
                                    </Select><br /><br />
                                </div>
                                <div>
                                    <Button type="submit" onClick={event => handleSubmit(event)}> Submit </Button>
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
    else if(!r) {
      return (
        <div className="print-center">
            <br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br />
            <Spin tip="Loading..." />
        </div>
    )
  
    }else {
        console.log("NOT SIGNED IN")
        return (
            <NotFound />
        )
    }
}

export default NewProjects;