import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Button, message, Input, Table, Space, Select, Modal, Spin } from 'antd';
import NotFound from './../../NotFound';
import BackFooter from './../BackFooter';
import jwt_decode from "jwt-decode";

function ReqMaster() {

    // --------------------------------------------------------------------
    // Base Urls

    const baseUrl = "http://localhost:8000/"

    // --------------------------------------------------------------------
    // states
    const [l, setloggedin] = useState(true);
    const [r, setR] = useState(false);

    const [projects, setProjects] = useState([]);
    const [projectsAll, setProjectsAll] = useState([]);
    const [req, setReq] = useState([]);
    const [rows, setRows] = useState([]);
    const [reqlimit, setReqLimit] = useState([]);
    const [query, setQuery] = useState({
        id: "",
        mat_id: "",
        mat_name: "",
        utilized: "",
        quantity: "",
        unit: "",
        project_id: "",
        initialItemRow: [],
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
                                setProjectsAll(res.data);
                                axios.get(baseUrl.concat("requisition"))
                                    .then(resR => {
                                        resR.data.sort(function (a, b) {
                                            return b.id - a.id;
                                        });
                                        let filtered_reqs = resR.data.filter(function (r) {
                                            return r.isapproved_master === "N"
                                        })
                                        setReq(filtered_reqs);
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
            setR(true);
        }

        setTimeout(() => {
            return 0;
        }, 50);
    }, [])


    // --------------------------------------------------------------------
    // AntD table columns

    const columns = [
        {
            title: 'Project',
            dataIndex: 'project_id',
            key: 'project_id',
            render: (text, record) => <p>{(projectsAll.find(p => p.id === text)).project_name}</p>,
        },
        {
            title: 'Requisition Id',
            dataIndex: 'req_id',
            key: 'req_id',
        },
        {
            title: 'Date',
            dataIndex: 'created_date_time',
            key: 'created_date_time',
            render: (text) => <p>{text.substring(8, 10)}-{text.substring(5, 7)}-{text.substring(0, 4)}</p>,
        },
        {
            title: 'Details',
            key: 'details',
            render: (text, record) => (
                <Space size="middle">
                    <Button type="link" style={{ background: "#027c86", color: "white", borderRadius: "10px" }}  onClick={() => { showModalDetails(record) }}>View Details</Button>
                </Space>
            ),
        },
        {
            title: 'Approve',
            key: 'approve',
            render: (text, record) => (
                <Space size="middle">
                    <Button type="primary" onClick={() => { showModalDetails(record) }}>Approve</Button>
                </Space>
            ),
        },
    ];

    // --------------------------------------------------------------------
    // Modal

    const [ModalDetails, setModalDetails] = useState(false)
    const [quantChange, setQuantChange] = useState(false);

    const handleCancelDetails = () => {
        setModalDetails(false)
        setQuantChange(false);
    }


    const showModalDetails = (record) => {
        axios.get(baseUrl.concat("reqlimit/?project_id=" + record.project_id))
            .then(res => {
                setReqLimit(res.data);
                console.log(reqlimit)
            })
        setModalDetails(true);
        let values = JSON.parse(JSON.stringify(record));
        let rowValues = JSON.parse(JSON.stringify(record.initialItemRow));
        console.log(values)
        setQuery(values);
        setRows(rowValues);
    }

    const flipQuant = () => {
        setQuantChange(!quantChange);
    }

    const handleQuantityChange = (index, event) => {   //inner form 
        const values = [...rows];
        values[index][event.target.name] = event.target.value;
        setRows(values);
    }



    // --------------------------------------------------------------------
    // Form change handlers

    const onChangeProject = (value, index) => {
        axios.get(baseUrl.concat("requisition/?project_id=" + value))
            .then(resR => {
                resR.data.sort(function (a, b) {
                    return b.id - a.id;
                });
                let filtered_reqs = resR.data.filter(function (r) {
                    return r.isapproved_master === "N"
                })
                setReq(filtered_reqs);
            })
            .then(() => {
                setR(true);
            })
    }


    // --------------------------------------------------------------------
    // Submission

    const submitHandler = () => {
        const key = 'updatable';
        message.loading({ content: 'Processing...', key });
        var id = query.id;
        var origRows = query.initialItemRow;
        let reqLimitArray = [];
        for (var i = 0; i < origRows.length; i++) {
            if (parseFloat(origRows[i].quantity) !== parseFloat(rows[i].quantity)) {
                var updateQuant = parseFloat(rows[i].quantity) - parseFloat(origRows[i].quantity);
                let obj = reqlimit.find(o => o.mat_id === rows[i].mat_id)
                obj.utilized = parseFloat(obj.utilized) + parseFloat(updateQuant);
                if (parseFloat(obj.utilized) > parseFloat(obj.quantity)) {
                    message.error(`Requisition limit exceeds for ${obj.mat_name}`)
                    return;
                }
                reqLimitArray.push(obj);
                // console.log(obj);
            }
        }
        for (var i = 0; i < reqLimitArray.length; i++) {
            axios.patch(baseUrl.concat("reqlimit/" + reqLimitArray[i].id + "/"), reqLimitArray[i])
                .catch(err => {
                    console.log(err)
                })
        }
        axios.patch(baseUrl.concat("requisition/" + id + "/"), { ...query, initialItemRow: rows, isapproved_master: "Y" })
            .then(() => {
                message.success({ content: 'Requisition Aprroved', key, duration: 2 });
                setModalDetails(false)
                axios.get(baseUrl.concat("requisition"))
                    .then(resR => {
                        resR.data.sort(function (a, b) {
                            return b.id - a.id;
                        });
                        let filtered_reqs = resR.data.filter(function (r) {
                            return r.isapproved_master === "N"
                        })
                        setReq(filtered_reqs);
                        setRows([])
                        setQuery({
                            id: "",
                            mat_id: "",
                            mat_name: "",
                            utilized: "",
                            quantity: "",
                            unit: "",
                            project_id: "",
                            initialItemRow: [],
                        });
                    })
            })
            .catch(err => {
                console.log(err);
                message.error({ content: 'Error occured while approving requisition', key, duration: 2 });
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
                <br /><br /><br /><br />
                <h4 className="page-title">Approve Purchase Requisitions</h4>
                <form onSubmit={submitHandler}>
                    <br /><br />

                    <div className="row">
                        <div className="col-sm-1"></div>
                        <div className="col-sm-10">
                            <h6>Sort by Project</h6>
                            <Select placeholder="Select Project" style={{ width: 300 }} onChange={onChangeProject}>
                                {projects.map((project, index) => (
                                    <Option value={project.id}>{project.project_name}</Option>
                                ))}
                            </Select>
                        </div>
                        <div className="col-sm-1"></div>
                    </div>
                    <br /><br />



                    <Table rowClassName={(record, index) => index % 2 === 0 ? 'table-row-light' : 'table-row-dark'} dataSource={req} columns={columns} />
                    <br /><br />
                </form>
                <br /><br />

                <br /><br /><br /><br />
                <div className="row">
                    <div className="col-sm-10"><p> </p></div>
                    <div className="col-sm-1"><Button type="link" style={{ background: "#027c86", color: "white", borderRadius: "10px" }}  className="float-right" onClick={refreshHandler}>Refresh</Button></div>
                    <div className="col-sm-1"><p> </p></div>
                </div>
                <br /><br /><br /><br />
                <BackFooter />


                <Modal
                    title="Change Item Details"
                    footer={[
                        <Button type="button" style={{ borderRadius: "10px " }} key="back" onClick={handleCancelDetails}>Go back</Button>,
                        <Button type="button" style={{ borderRadius: "10px " }} key="changequant" onClick={flipQuant}>Change Quantities</Button>,
                        <Button type="primary" key="submit" onClick={submitHandler}>Approve</Button>,
                    ]}
                    visible={ModalDetails} onCancel={handleCancelDetails}
                >
                    <table className="table table-bordered table-hover print-center">
                        <thead>
                            <tr>
                                <td>Material ID</td>
                                <td>Material Name</td>
                                <td>Description</td>
                                <td>Quantity Limit</td>
                                <td>Unit</td>
                            </tr>
                        </thead>
                        {rows.map((r, index) => (
                            <tbody>
                                <tr key={index}>
                                    <td>{r.mat_id}</td>
                                    <td>{r.mat_name}</td>
                                    <td>{r.description}</td>
                                    <td>{quantChange ? <Input style={{ borderRadius: "8px " }}  name="quantity" value={r.quantity} onChange={event => handleQuantityChange(index, event)} /> : <p>{r.quantity}</p>}</td>
                                    <td>{r.unit}</td>
                                </tr>
                            </tbody>
                        ))}
                    </table>
                </Modal>

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

export default ReqMaster;