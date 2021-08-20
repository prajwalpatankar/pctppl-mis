import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Button, message, Input, Table, Space, Select, Modal } from 'antd';
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
    const [visibility, setVisibility] = useState(false);
    const [req, setReq] = useState([]);
    const [query, setQuery] = useState({
        id: "",
        mat_id: "",
        mat_name: "",
        utilized: "",
        quantity: "",
        unit: "",
        project_id: "",
    });

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
    // Modal

    const [ModalDetails, setModalDetails] = useState(false)

    const handleCancelDetails = () => {
        setModalDetails(false)
    }

    const showModalDetails = (index) => {
        setModalDetails(true)
        setQuery(req[index]);
    }



    // --------------------------------------------------------------------
    // Form change handlers

    const handleProjectChange = (value, index) => {
        axios.get(baseUrl.concat("reqlimit/?project_id=" + value))
            .then(res => {
                setReq(res.data);
                setVisibility(true);
            })
    }

    const handleFormChange = (event) => {
        setQuery({ ...query, quantity: event.target.value });
    }

    // --------------------------------------------------------------------
    // Submission

    const submitHandler = (e) => {
        e.preventDefault();
        console.log(query);
        var id = query.id;
        axios.patch(baseUrl.concat("reqlimit/" + id + "/"), query)
            .then(res => {
                console.log(res);
                message.success(`Limit for ${query.mat_name} updated successfully `);
                axios.get(baseUrl.concat("reqlimit/?project_id=" + query.project_id))
                    .then(res => {
                        setReq(res.data);
                    })
            })
            .catch(err => {
                console.log(err);
            })

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

                    {visibility ?
                        <div className="row">
                            <div className="col-md-1"><p></p></div>
                            <div className="table-responsive col-md-10">
                                <table className="table table-hover table-bordered">
                                    <thead className="row">
                                        <th className="col-md-2">Material ID</th>
                                        <th className="col-md-2">Material Name</th>
                                        <th className="col-md-2">Utilized Quantity (Cumulative)</th>
                                        <th className="col-md-2">Quantity Limit</th>
                                        <th className="col-md-2">Unit</th>
                                        <th className="col-md-2">Action</th>
                                    </thead>
                                    <tbody>
                                        {req.map((r, index) => (
                                            <tr key={index} className="row">
                                                <td className="col-md-2">{r.mat_id}</td>
                                                <td className="col-md-2">{r.mat_name}</td>
                                                <td className="col-md-2">{r.utilized}</td>
                                                <td className="col-md-2">{r.quantity}</td>
                                                <td className="col-md-2">{r.unit}</td>
                                                <td className="col-md-2"><Button type="button" onClick={() => showModalDetails(index)}>Change</Button></td>
                                                

                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                            <div className="col-md-1"><p></p></div>
                        </div>


                        : <p></p>}


                    <br /><br />
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


                <Modal
                    title="Change Item Details"
                    footer={[
                        <Button type="button" key="back" onClick={handleCancelDetails}>Go back</Button>,
                        <Button type="primary" key="submit" onClick={submitHandler}>Submit</Button>,
                    ]}
                    visible={ModalDetails} onCancel={handleCancelDetails}
                >
                    <table className="table table-bordered table-hover">
                        <thead>
                            <tr>
                                <td>Material ID</td>
                                <td>Material Name</td>
                                <td>Utitlized</td>
                                <td>Quantity Limit</td>
                                <td>Unit</td>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>{query.mat_id}</td>
                                <td>{query.mat_name}</td>
                                <td>{query.utilized}</td>
                                <td><Input value={query.quantity} onChange={event => handleFormChange(event)} type="text" /></td>
                                <td>{query.unit}</td>
                            </tr>
                        </tbody>
                    </table>
                </Modal>

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