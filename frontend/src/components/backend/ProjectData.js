import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Button, message, Input, Table, Space, Select } from 'antd';
import NotFound from './../NotFound';
import BackFooter from './BackFooter';
import jwt_decode from "jwt-decode";

function ProjectData() {

    // --------------------------------------------------------------------
    // Base Urls

    const baseUrl = "http://localhost:8000/"

    // --------------------------------------------------------------------
    // states

    const [projects, setProjects] = useState([]);
    const [l, setloggedin] = useState(true);
    const [query, setQuery] = useState({
        project_id: "",
        exc_file: "",
    })

    useEffect(() => {
        if (localStorage.getItem("token")) {
            axios.defaults.headers.common["Authorization"] = `JWT ${localStorage.getItem('token')}`;

            axios.get(baseUrl.concat("userdata/?user=" + jwt_decode(localStorage.getItem("token")).user_id))
                .then(res => {
                    if (res.data[0].role === "admin") {
                        axios.get(baseUrl.concat("projects"))
                            .then(res => {
                                setProjects(res.data);
                            })

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

        setTimeout(() => {
            return 0;
        }, 200);
    }, [])
    

    // --------------------------------------------------------------------
    // Form change handlers

    const handleProjectChange = (value, index) => {
        setQuery({ ...query, project_id: value });
    }

    const handleImageChange = (e) => {
        setQuery({ ...query, exc_file: e.target.files[0]})

    }

    // --------------------------------------------------------------------
    // Submission

    const submitHandler = (e) => {
        e.preventDefault();
        console.log(query);
        
    }


    // --------------------------------------------------------------------
    // Extras

    const refreshHandler = () => {
        window.location.reload();
    }


    // --------------------------------------------------------------------
    // Antd

    const { Option } = Select;

    // --------------------------------------------------------------------
    // html
    if (l) {
        return (
            <div>
                <br /><br /><br /><br /><br /><br /><br /><br /><br />
                <form onSubmit={submitHandler}>
                    <Select placeholder="Select Project" style={{ width: 300 }} onChange={handleProjectChange}>
                        {projects.map((project, index) => (
                            <Option value={project.id}>{project.project_name}</Option>
                        ))}
                    </Select>
                    <br /><br />

                    <Input type="file" accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"  onChange={handleImageChange} style={{ width: 300 }} required/>
                    <br /><br />

                    <Button type="submit" onClick={submitHandler}>Submit</Button>
                </form>
                <br /><br />

                <br /><br /><br /><br />
                <div className="row">
                    <div className="col-sm-10"><p> </p></div>
                    <div className="col-sm-1"><Button type="link" className="float-right" onClick={refreshHandler}>Refresh</Button></div>
                    <div className="col-sm-1"><p> </p></div>
                </div>
                <br /><br /><br /><br />
                <BackFooter />
            </div>
        )

    } else {
        console.log("NOT SIGNED IN")
        return (
            <NotFound />
        )
    }
}

export default ProjectData;