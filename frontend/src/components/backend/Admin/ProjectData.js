import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Button, message, Input, Select, Modal, Spin } from 'antd';
import NotFound from './../../NotFound';
import { baseUrl } from './../../../constants/Constants';
import BackFooter from './../BackFooter';
import jwt_decode from "jwt-decode";
import PageNotFound from '../../PageNotFound';

function ProjectData() {

    // --------------------------------------------------------------------
    // Base Urls

    // const baseUrl = "http://localhost:8000/"

    // --------------------------------------------------------------------
    // states
    const [l, setloggedin] = useState(true);
    const [r, setR] = useState(false);
    const [isAdmin, setAdmin] = useState(false);

    const [projects, setProjects] = useState([]);
    const [visibility, setVisibility] = useState(false);
    const [dataVisibility, setDataVisibilty] = useState(false);
    const [req, setReq] = useState([]);
    const [reqOrig, setReqOrig] = useState([]);
    const [query, setQuery] = useState({
        id: "",
        mat_id: "",
        utilized: "",
        quantity: "",
        project_id: "",
    });

    const [value, setValue] = useState('');
    const [allmats, setAllMats] = useState([]);
    const [matValidation, setMatValidation] = useState(false);

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

                                axios.get(baseUrl.concat("materials"))
                                    .then(resMats => {
                                        setAllMats(resMats.data);
                                    })
                                    .then(() => {
                                        setR(true);
                                    })
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
        if (matValidation) {
            axios.post(baseUrl.concat("reqlimit/"), newItem)
                .then(() => {
                    message.success("New Material Added Successfully");

                    axios.get(baseUrl.concat("reqlimit/?project_id=" + newItem.project_id))
                        .then(res => {
                            res.data.sort(function (a, b) {
                                return a.mat_id - b.mat_id;
                            });
                            setReq(res.data);
                            setReqOrig(res.data);
                            console.log(res.data);

                            setNewItem({ 
                                ...newItem, 
                                project_id: value,
                                mat_id: "",
                                mat_name: "",
                                hsn_id: "",
                                quantity: "",
                                utilized: 0,
                                unit: "",                                
                            });
                            setVisibility(true);
                        })
                })
                .catch(err => {
                    console.log(err);
                })
            setModalDetailsNew(false);
        } else {
            message.error("Material Already Exists !")
        }

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
                setReqOrig(res.data);
                console.log(res.data);

                setNewItem({ ...newItem, project_id: value });
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
        let filteredReqs = reqOrig.filter(function (o) {
            return o.mat_id === value
        })
        let matData = allmats.filter(function (o) {
            return o.id === value;
        })
        console.log(matData)
        if (filteredReqs.length === 0) {
            setNewItem({
                ...newItem,
                mat_id: value,
                mat_name: matData[0].mat_name,
                unit: matData[0].unit,
                hsn_id: matData[0].hsn_id,
            })
            setMatValidation(true);
        } else {
            message.error("Material Limit Already exists !")
            setTimeout(() => {
                message.info("Please use the Search Material functionality to search for your material");
            }, 200)
        }
        console.log(newItem)

    }


    // --------------------------------------------------------------------
    // Submission

    const submitHandler = (e) => {
        e.preventDefault();
        console.log(query);
        var id = query.id;
        axios.patch(baseUrl.concat("reqlimit/" + id + "/"), { quantity: query.quantity })
            .then(res => {
                console.log(res);
                message.success(`Limit for ${query.mat_name} updated successfully `);
            })
            .then(() => {
                axios.get(baseUrl.concat("reqlimit/?project_id=" + query.project_id))
                    .then(res => {
                        setReq(res.data);
                        setReqOrig(res.data);
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
                                <Select placeholder="Select Project" onChange={onChangeProject} style={{ width: 200 }}>
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
                                    <div className="col-lg-3">
                                        <h6>
                                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-search" viewBox="0 0 16 16">
                                                <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0z" />
                                            </svg>&nbsp;&nbsp;
                                            Search Material
                                        </h6>
                                        <Input style={{ borderRadius: "8px", width: 300 }}
                                            placeholder="Material Name"
                                            value={value}
                                            onChange={e => {
                                                const currValue = e.target.value;
                                                setValue(currValue);
                                                const filteredData = reqOrig.filter(entry =>
                                                    entry.mat_name.toLowerCase().match(currValue.toLowerCase())
                                                );
                                                setReq(filteredData);
                                            }}
                                        />
                                    </div>
                                    <div className="col-lg-8"></div>
                                </div>
                                <br /><br /><br />



                                <div className="row">
                                    <div className="col-lg-1"></div>
                                    <div className="col-lg-3">
                                        <Button type="button" style={{ background: "yellowgreen", color: "white", borderRadius: "10px" }} onClick={showModalDetailsNew}>+ Add Material</Button></div>
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
                                            style={{ width: 200 }}
                                            placeholder="Select Material"
                                            optionFilterProp="children"
                                            onChange={changeMatName}
                                            filterOption={(input, option) =>
                                                option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                                            }
                                        >
                                            {allmats.map((m, index) => (
                                                <Option value={m.id}>{m.mat_name}</Option>
                                            ))}
                                        </Select>
                                    </td>
                                    {/* <td><Input style={{ borderRadius: "8px" }} value={newItem.mat_name} name="mat_name" onChange={event => handleFormChangeNew(event)} type="text" /></td> */}
                                    <td><Input style={{ borderRadius: "8px" }} value={newItem.quantity} name="quantity" onChange={event => handleFormChangeNew(event)} type="text" /></td>
                                    <td><Input style={{ borderRadius: "8px" }} value={newItem.unit} name="unit" onChange={event => handleFormChangeNew(event)} type="text" disabled /></td>
                                    <td><Input style={{ borderRadius: "8px" }} value={newItem.hsn_id} name="hsn_id" onChange={event => handleFormChangeNew(event)} type="text" disabled /></td>
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