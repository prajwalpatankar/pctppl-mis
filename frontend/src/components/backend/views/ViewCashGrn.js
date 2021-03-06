import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Table, Spin, Button, Space, Modal, Select } from 'antd';
import BackFooter from '../BackFooter';
import NotFound from '../../NotFound';
import jwt_decode from "jwt-decode";
import { baseUrl } from './../../../constants/Constants';


function ViewCashGrn() {
    // const baseUrl = 'http://localhost:8000/';


    const [l, setloggedin] = useState(true);
    const [r, setR] = useState(false);

    const [projectsAll, setProjectsAll] = useState([]);
    const [projects, setProjects] = useState([]);
    const [grn, setGrn] = useState([]);

    const [empty, setEmpty] = useState(false);


    useEffect(() => {
        if (localStorage.getItem("token")) {
            axios.defaults.headers.common["Authorization"] = `JWT ${localStorage.getItem('token')}`;

            axios.get(baseUrl.concat("userdata/?user=" + jwt_decode(localStorage.getItem("token")).user_id))
                .then(res => {

                    axios.get(baseUrl.concat("projects"))
                        .then(resProj => {
                            setProjectsAll(resProj.data);

                            if (res.data[0].role === "admin" || res.data[0].role === "Purchase Officer") {
                                axios.get(baseUrl.concat("projects"))
                                    .then(res => {
                                        setProjects(res.data);
                                        if (res.data.length === 0) {
                                            setEmpty(true)
                                        }
                                    })
                            } else if (res.data[0].role === "Project Manager") {
                                axios.get(baseUrl.concat("projects/?pm=" + jwt_decode(localStorage.getItem("token")).user_id))
                                    .then(res => {
                                        setProjects(res.data);
                                        if (res.data.length === 0) {
                                            setEmpty(true)
                                        }
                                    })
                            } else {
                                axios.get(baseUrl.concat("projects/?user=" + jwt_decode(localStorage.getItem("token")).user_id))
                                    .then(res => {
                                        setProjects(res.data);
                                        if (res.data.length === 0) {
                                            setEmpty(true)
                                        }
                                    })
                            }
                            axios.get(baseUrl.concat("grn/?po_id=CASH"))
                                .then(res1 => {
                                    res1.data.sort(function (a, b) {
                                        return b.id - a.id;
                                    });

                                    setGrn(res1.data);
                                })
                        })

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
            setR(true)
            return 0;
        }, 50);
    }, [])

    // --------------------------------------------------------------------
    // Modal

    const [ModalDetails, setModalDetails] = useState(false)
    const [current_items, setItem] = useState([]);

    const handleCancelDetails = () => {
        setModalDetails(false)
    }

    const showModalDetails = (record) => {
        setModalDetails(true)
        setItem(record.initialItemRow)
        console.log(current_items)
    }

    // --------------------------------------------------------------------
    // Printing

    // const handlePrint = (record) => {
    //     window.open('/grn:' + record.id)
    // }

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
            title: 'GRN Id',
            dataIndex: 'grn_id',
            key: 'grn_id',
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
                    <Button type="link" style={{ background: "#027c86", color: "white", borderRadius: "10px" }} onClick={() => { showModalDetails(record) }}>View Details</Button>
                </Space>
            ),
        },
        // {
        //     title: 'Print GRN',
        //     key: 'print_grn',
        //     render: (text, record) => (
        //         <Space size="middle">
        //             <Button type="link" style={{ background: "#027c86", color: "white", borderRadius: "10px" }}  onClick={() => { handlePrint(record) }}>Print</Button>
        //         </Space>
        //     ),
        // },
    ];

    // --------------------------------------------------------------------
    // AntD 

    const { Option } = Select;


    // --------------------------------------------------------------------
    // Handle Project Change

    const handleProjectChange = (value) => {
        axios.get(baseUrl.concat("grn/?project_id=" + value + "&po_id=CASH"))
            .then(res1 => {
                res1.data.sort(function (a, b) {
                    return b.id - a.id;
                });
                setGrn(res1.data);
            })
            .catch(error => {
                console.log(error.response.status)
                if (error.response.status === 401) {
                    localStorage.removeItem('token')
                    setloggedin(false);
                }
            })
    }



    // --------------------------------------------------------------------
    // html

    if (l && r) {
        if (empty) {
            return (
                <div className="print-center">
                    <br /><br /><br /><br /><br /><br /><br />
                    <h3>Unauthorised.</h3>
                </div>
            )
        } else {


            return (
                <div>
                    <br /><br /><br /><br />
                    <h4 className="page-title"> Cash Goods Recipt Notes</h4>
                    <br />
                    <div className="row">
                        <div className="col-sm-1"></div>
                        <div className="col-sm-10">
                            <h6>Select Project</h6>
                            <Select placeholder="Select Project" onChange={handleProjectChange}>
                                {projects.map((project, index) => (
                                    <Option value={project.id}>{project.project_name}</Option>
                                ))}
                            </Select>
                        </div>
                        <div className="col-sm-1"></div>
                    </div>
                    <br /><br /><br />
                    <Table rowClassName={(record, index) => index % 2 === 0 ? 'table-row-light' : 'table-row-dark'} dataSource={grn} columns={columns} />

                    <Modal
                        title="Purchase Requisition Details"
                        footer={[
                            <Button type="button" style={{ borderRadius: "10px " }} key="back" onClick={handleCancelDetails}>Go back</Button>,
                        ]}
                        visible={ModalDetails} onCancel={handleCancelDetails}
                    >
                        <table className="table table-bordered table-hover">
                            <thead>
                                <tr>
                                    <td>Material Name</td>
                                    <td>Quantity</td>
                                    <td>Unit</td>
                                </tr>
                            </thead>
                            <tbody>
                                {current_items.map((item, index) => (
                                    <tr>
                                        <td>{item.mat_name}</td>
                                        <td>{item.quantity}</td>
                                        <td>{item.unit}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </Modal>

                    <br /><br /><br /><br /><br />
                    <BackFooter />
                </div>
            )
        }
    }
    else if (!r) {
        return (
            <div className="print-center">
                <br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br />
                <Spin tip="Loading..." />
            </div>
        )

    }
    else {
        return (
            <NotFound />
        )

    }
}

export default ViewCashGrn;