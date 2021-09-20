import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Button, message, Input, Select, Modal, Spin } from 'antd';
import NotFound from './../../NotFound';
import BackFooter from './../BackFooter';
import jwt_decode from "jwt-decode";
import PageNotFound from '../../PageNotFound';

function ProjectData() {

    // --------------------------------------------------------------------
    // Base Urls

    const baseUrl = "http://localhost:8000/"

    // --------------------------------------------------------------------
    // states
    const [l, setloggedin] = useState(true);
    const [r, setR] = useState(false);
    const [isAdmin, setAdmin] = useState(false);

    const [projects, setProjects] = useState([]);
    const [visibility, setVisibility] = useState(false);
    const [dataVisibility, setDataVisibilty] = useState(false);
    const [req, setReq] = useState([]);
    const [query, setQuery] = useState({
        id: "",
        mat_id: "",
        utilized: "",
        quantity: "",
        project_id: "",
    });
    const [currentIndex, setCurrentIndex] = useState(0);

    useEffect(() => {
        if (localStorage.getItem("token")) {
            axios.defaults.headers.common["Authorization"] = `JWT ${localStorage.getItem('token')}`;

            axios.get(baseUrl.concat("userdata/?user=" + jwt_decode(localStorage.getItem("token")).user_id))
                .then(res => {
                    if (res.data[0].role === "admin") {
                        setAdmin(true);
                        axios.get(baseUrl.concat("projects"))
                            .then(res => {
                                setProjects(res.data);
                            })
                            .then(() => {
                                setR(true);
                            })
                    }
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

    // --------------------------------------------------------------------
    // Modal

    const [ModalDetails, setModalDetails] = useState(false)

    const handleCancelDetails = () => {
        setModalDetails(false)
    }

    const showModalDetails = (index) => {
        setCurrentIndex(index);
        setModalDetails(true);
        setQuery(req[index]);
    }


    // --------------------------------------------------------------------
    // Adding rows

    const [newItem, setNewItem] = useState({
        mat_id: "",
        mat_name: "",
        hsn_id: "",
        quantity: "",
        utilized: 0,
        unit: "",
        project_id: "",
    })
    var nxtLid;
    const [ModalDetailsNew, setModalDetailsNew] = useState(false)

    const handleCancelDetailsNew = () => {
        setModalDetailsNew(false)
    }

    const showModalDetailsNew = () => {
        setModalDetailsNew(true)
    }

    const handleFormChangeNew = (event) => {
        setNewItem({ ...newItem, [event.target.name]: event.target.value });
    }

    const addHandler = () => {
        console.log(newItem)
        axios.post(baseUrl.concat("reqlimit/"), newItem)
            .then(() => {
                message.success("New Material Added Successfully");
            })
            .catch(err => {
                console.log(err);
            })
        setModalDetailsNew(false);
    }


    // --------------------------------------------------------------------
    // Form change handlers

    const onChangeProject = (value, index) => {
        setDataVisibilty(false);
        axios.get(baseUrl.concat("reqlimit/?project_id=" + value))
            .then(res => {
                res.data.sort(function (a, b) {
                    return a.mat_id - b.mat_id;
                });
                // var len = res.data.length;
                // if (len !== 0) {
                //     var lid = res.data[len - 1].mat_id;
                //     nxtLid = parseInt(lid) + 1;

                // } else {
                //     nxtLid = 1;
                // }
                setReq(res.data);
                console.log(res.data)
                setVisibility(true);
            })
            .then(() => {
                setDataVisibilty(true);
            })
        // .then(() => {
        //     setNewItem({ ...newItem, project_id: value, mat_id: nxtLid });
        // })
    }

    const handleFormChange = (event) => {
        setQuery({ ...query, quantity: event.target.value });
    }

    const changeMatName = (value) => {
        setQuery({
            ...query,
            mat_id: value,
        })
    }


    // --------------------------------------------------------------------
    // Submission

    const submitHandler = (e) => {
        e.preventDefault();
        console.log(query);
        var id = query.id;
        axios.patch(baseUrl.concat("reqlimit/" + id + "/"), {quantity: query.quantity})
            .then(res => {
                console.log(res);
                message.success(`Limit for ${query.mat_name} updated successfully `);
            })
            .then(() => {
                axios.get(baseUrl.concat("reqlimit/?project_id=" + query.project_id))
                    .then(res => {
                        setReq(res.data);
                    })
                    .then(() => {
                        setQuery({
                            ...query,
                            mat_id: "",
                            quantity: "",
                            utilized: 0,
                        })
                    })
                setModalDetails(false);
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
    if (l && r) {
        return (
            <div>
                {isAdmin ? <div>
                    <br /><br /><br /><br />
                    <h4 className="page-title">Update Requisition Limits</h4>
                    <form onSubmit={submitHandler}>
                        <br /><br />

                        <div className="row">
                            <div className="col-sm-1"></div>
                            <div className="col-sm-10">
                                <h6>Select Project</h6>
                                <Select placeholder="Select Project" onChange={onChangeProject} style={{ width: 200}}>
                                    {projects.map((project, index) => (
                                        <Option value={project.id}>{project.project_name}</Option>
                                    ))}
                                </Select>
                            </div>
                            <div className="col-sm-1"></div>
                        </div>
                        <br /><br />

                        {visibility ?
                            <div>
                                <div className="row">
                                    <div className="col-lg-1"></div>
                                    <div className="col-lg-11"><Button type="button" style={{ background: "yellowgreen", color: "white", borderRadius: "10px" }} onClick={showModalDetailsNew}>+ Add Material</Button></div>
                                </div>
                                <br />
                                <div className="row print-center ">
                                    <div className="center table-responsive col-lg-10 col-md-12">
                                        <table className="table table-hover table-bordered ">
                                            <thead className="thead-light">
                                                <tr className="row">
                                                    <th className="col-md-2">Material ID</th>
                                                    <th className="col-md-2">Material Name</th>
                                                    <th className="col-md-2">Utilized Quantity (Cumulative)</th>
                                                    <th className="col-md-2">Quantity Limit</th>
                                                    <th className="col-md-2">Unit</th>
                                                    <th className="col-md-2">Action</th>
                                                </tr>
                                            </thead>
                                            {dataVisibility ? req.map((r, index) => (
                                                <tbody>
                                                    <tr key={index} className="row">
                                                        <td className="col-md-2">{r.mat_id}</td>
                                                        <td className="col-md-2">{r.mat_name}</td>
                                                        <td className="col-md-2">{parseFloat(r.utilized).toFixed(4)}</td>
                                                        <td className="col-md-2">{parseFloat(r.quantity).toFixed(4)}</td>
                                                        <td className="col-md-2">{r.unit}</td>
                                                        <td className="col-md-2"><Button type="primary" size="small" onClick={() => showModalDetails(index)}>Change</Button></td>
                                                    </tr>
                                                </tbody>
                                            ))
                                                :
                                                <div>
                                                    <br /><br /><br />
                                                    <Spin tip="Loading..." />
                                                </div>
                                            }
                                        </table>
                                    </div>
                                </div>
                            </div>


                            : <p></p>}


                        <br /><br />



                    </form>
                    <br /><br />

                    <br /><br /><br /><br />
                    <div className="row">
                        <div className="col-sm-10"><p> </p></div>
                        <div className="col-sm-1"><Button type="link" style={{ background: "#027c86", color: "white", borderRadius: "10px" }} className="float-right" onClick={refreshHandler}>Refresh</Button></div>
                        <div className="col-sm-1"><p> </p></div>
                    </div>
                    <br /><br /><br /><br />
                    <BackFooter />


                    <Modal
                        title="Change Item Details"
                        footer={[
                            <Button type="button" style={{ borderRadius: "10px " }} key="back" onClick={handleCancelDetails}>Go back</Button>,
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
                                    <td><Input style={{ borderRadius: "8px" }} value={query.quantity} onChange={event => handleFormChange(event)} type="text" /></td>
                                    <td>{query.unit}</td>
                                </tr>
                            </tbody>
                        </table>
                    </Modal>


                    <Modal
                        title="Change Item Details"
                        footer={[
                            <Button type="button" style={{ borderRadius: "10px " }} key="backN" onClick={handleCancelDetailsNew}>Go back</Button>,
                            <Button type="primary" key="submitN" onClick={addHandler} >Submit</Button>,
                        ]}
                        visible={ModalDetailsNew} onCancel={handleCancelDetailsNew}
                    >
                        <table className="table table-bordered table-hover">
                            <thead>
                                <tr>
                                    <td>Material Name</td>
                                    <td>Quantity Limit</td>
                                    <td>Unit</td>
                                    <td>HSN ID</td>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td>
                                        <Select
                                            showSearch
                                            style ={{ width: 200 }}
                                            placeholder="Select Material"
                                            optionFilterProp="children"
                                            onChange={changeMatName}
                                            filterOption={(input, option) =>
                                                option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                                            }
                                        >
                                            {/* {allmats.map((m, index) => (
                                                <Option value={m.id}>{m.mat_name}</Option>
                                            ))} */}
                                        </Select>
                                    </td>
                                    {/* <td><Input style={{ borderRadius: "8px" }} value={newItem.mat_name} name="mat_name" onChange={event => handleFormChangeNew(event)} type="text" /></td> */}
                                    <td><Input style={{ borderRadius: "8px" }} value={newItem.quantity} name="quantity" onChange={event => handleFormChangeNew(event)} type="text" /></td>
                                    <td><Input style={{ borderRadius: "8px" }} value={newItem.unit} name="unit" onChange={event => handleFormChangeNew(event)} type="text" /></td>
                                    <td><Input style={{ borderRadius: "8px" }} value={newItem.hsn_id} name="hsn_id" onChange={event => handleFormChangeNew(event)} type="text" /></td>
                                </tr>
                            </tbody>
                        </table>
                    </Modal>
                </div>
                    :
                    <PageNotFound />
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

export default ProjectData;