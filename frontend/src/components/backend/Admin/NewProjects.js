import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Input, Button, message, Select, Spin, Table } from 'antd';
import BackFooter from './../BackFooter';
import NotFound from './../../NotFound';
import PageNotFound from './../../PageNotFound';
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
        identifier: "",
    })

    const [userList, setUserList] = useState([])
    const [isAdmin, setAdmin] = useState(false);
    const [projectsAll, setProjectsAll] = useState([]);
    const [projects, setProjects] = useState([]);


    useEffect(() => {
        if (localStorage.getItem("token")) {
            axios.defaults.headers.common["Authorization"] = `JWT ${localStorage.getItem('token')}`;

            axios.get(baseUrl.concat("userdata/?user=" + jwt_decode(localStorage.getItem("token")).user_id))
                .then(res => {

                    if (res.data[0].role === "admin") {
                        setAdmin(true);
                    }
                    axios.get(baseUrl.concat("projects"))
                        .then(res => {
                            setProjectsAll(res.data);
                            setProjects(res.data);

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
            axios.get(baseUrl.concat("user/"))
                .then(res => {
                    setUserList(res.data);
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
        }
        setTimeout(() => {
            return 0;
        }, 50);
    }, [])

    const columns = [
        {
            title: 'Project Identifier',
            dataIndex: 'identifier',
            key: 'identifier',
        },
        {
            title: 'Project Name',
            dataIndex: 'project_name',
            key: 'project_name',
        },
    ]

    const ChangeHandler = (e) => {
        SetFormvalue({ ...formvalue, [e.target.name]: e.target.value })
    }

    const IdentifierChangeHandler = (e) => {
        SetFormvalue({ ...formvalue, [e.target.name]: e.target.value });
        var values = projectsAll;
        values = values.filter(el => el.identifier.toString().toLowerCase().indexOf(e.target.value.toLowerCase()) !== -1);
        setProjects(values)
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

    const submitHandler = (e) => {
        e.preventDefault();
        console.log(formvalue);
        if (formvalue.identifier.length !== 4) {
            message.error("Only 4 lettered Identifier is allowed")
            return
        }
        message.loading({ content: 'Creating Project ...', key, duration: 4 });

        axios.post(baseUrl.concat("projects/"), formvalue)
            .then(response => {
                console.log(response)
                message.success({ content: "Project Created Successfully", key, duration: 4 })
                // clear fields
                SetFormvalue({
                    ...formvalue,
                    project_name: "",
                    location: "",
                    identifier: "",
                })
                setTimeout(() => {
                    window.location.reload();
                }, 1000)

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

    if (l && r) {
        return (
            <div>
                {isAdmin ?
                    <div>
                        <br /><br /><br /><br />
                        <h4 className="page-title">New Project</h4>
                        <br /><br /><br /><br /><br />
                        <div className="row">
                            <div className="container col-md-6 col-xl-3">
                                <form onSubmit={event => submitHandler(event)}>
                                    <div>
                                        <h6>Project Name :</h6>
                                        <Input style={{ borderRadius: "8px", width: 300 }} type="text" name="project_name" placeholder="Project Name" value={formvalue.project_name} onChange={event => ChangeHandler(event)} /> <br /><br />
                                    </div>
                                    <div>
                                        <h6>Project Identifier :</h6>
                                        <Input style={{ borderRadius: "8px", width: 300 }} type="text" name="identifier" placeholder="4 lettered Project Identifier" value={formvalue.identifier} onChange={event => IdentifierChangeHandler(event)} /> <br /><br />
                                        {formvalue.identifier === "" ?
                                            <p></p>
                                            :
                                            formvalue.identifier.length !== 4 ?
                                                <p className="unavailable-red">Only 4 lettered Identifier Allowed</p>
                                                :
                                                projects.length === 0 ?
                                                    <p className="available-green">Identifier Available</p>
                                                    :
                                                    <p className="unavailable-red">Identifier Not Available</p>
                                        }
                                    </div>
                                    <div>
                                        <h6>Location / Address :</h6>
                                        <Input style={{ borderRadius: "8px", width: 300 }} type="text" name="location" placeholder="Location" value={formvalue.location} onChange={event => ChangeHandler(event)} /> <br /><br />
                                    </div>
                                    <div>
                                        <h6>Select Project Manager :</h6>
                                        <Select
                                            showSearch

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
                                        <h6>Select Store Keeper :</h6>
                                        <Select
                                            showSearch

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
                                        <Button type="submit" style={{ background: "dodgerblue", color: "white", borderRadius: "10px " }} onClick={submitHandler}>Submit</Button>
                                    </div>
                                </form> <br /><br />
                            </div>

                            <div className="container col-md-6 col-xl-3">
                                <Table rowClassName={(record, index) => index % 2 === 0 ? 'table-row-light' : 'table-row-dark'} dataSource={projects} columns={columns} />
                            </div>
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
        console.log("NOT SIGNED IN")
        return (
            <NotFound />
        )
    }
}

export default NewProjects;