import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Table, Spin, Button, Space, Modal, Popconfirm, message } from 'antd';
import BackFooter from '../BackFooter';
import NotFound from '../../NotFound';
import jwt_decode from "jwt-decode";
import { baseUrl } from './../../../constants/Constants';
import { DeleteOutlined } from '@ant-design/icons';


function ViewGRN() {
    // const baseUrl = 'http://localhost:8000/';


    const [l, setloggedin] = useState(true);
    const [r, setR] = useState(false);
    const [isAdmin, setIsAdmin] = useState(false);

    const [projectsAll, setProjectsAll] = useState([]);
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
                                setIsAdmin(true);
                                axios.get(baseUrl.concat("projects"))
                                    .then(res => {
                                        if (res.data.length === 0) {
                                            setEmpty(true)
                                        }
                                    })
                            } else if (res.data[0].role === "Project Manager") {
                                axios.get(baseUrl.concat("projects/?pm=" + jwt_decode(localStorage.getItem("token")).user_id))
                                    .then(res => {
                                        if (res.data.length === 0) {
                                            setEmpty(true)
                                        }
                                    })
                            } else {
                                axios.get(baseUrl.concat("projects/?user=" + jwt_decode(localStorage.getItem("token")).user_id))
                                    .then(res => {
                                        if (res.data.length === 0) {
                                            setEmpty(true)
                                        }
                                    })
                            }
                            axios.get(baseUrl.concat("grn"))
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
    // Deletion (ADMIN + PO)

    const updateQuantitites = (record, project_id) => {
        axios.get(baseUrl.concat("stock/?project_id=" + project_id + "&mat_id=" + record.mat_id))
            .then(stockRes => {
                axios.put(
                    baseUrl.concat("stock/" + stockRes.data[0].id + "/"),
                    {
                        ...stockRes.data[0],
                        quantity: (parseFloat(stockRes.data[0].quantity) - parseFloat(record.accepted)),
                        recieved: (parseFloat(stockRes.data[0].recieved) - parseFloat(record.accepted)),
                    }
                )
                .then(res => {
                    console.log(res);
                })
            })
    }

    const handleDeleteGRN = (record) => {
        console.log(record);
        for (var i = 0; i < record.initialItemRow.length; i++) {
            updateQuantitites(record.initialItemRow[i], record.project_id);
        }
        axios.delete(baseUrl.concat("grn/" + record.id))
        .then(() => {
            message.success("GRN " + record.grn_id + "has been deleted");
        })
        .catch(error => {
            console.log(error);
        })

    }

    // --------------------------------------------------------------------
    // Printing

    const handlePrint = (record) => {
        window.open('/grn:' + record.id)
    }

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
    ];

    const columnsAdmin = [
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
        {
            title: 'Print GRN',
            key: 'print_grn',
            render: (text, record) => (
                <Space size="middle">
                    <Button type="link" style={{ background: "#027c86", color: "white", borderRadius: "10px" }} onClick={() => { handlePrint(record) }}>Print</Button>
                </Space>
            ),
        },
        {
            title: 'Delete GRN',
            key: 'delete_grn',
            render: (text, record) => (
                <Space size="middle">
                    <Button type="link" style={{ background: "#027c86", color: "white", borderRadius: "10px" }} >
                        <Popconfirm
                            title="Are you sure to delete this GRN?"
                            onConfirm={() => handleDeleteGRN(record)}
                            okText="Yes"
                            cancelText="No"
                        >
                            <DeleteOutlined style={{ fontSize: '20px' }} />
                        </Popconfirm>
                    </Button>

                </Space>
            ),
        },
    ];



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
                    <h4 className="page-title">Goods Recipt Notes</h4>
                    <br />
                    {isAdmin ?
                        <Table rowClassName={(record, index) => index % 2 === 0 ? 'table-row-light' : 'table-row-dark'} dataSource={grn} columns={columnsAdmin} />
                        :
                        <Table rowClassName={(record, index) => index % 2 === 0 ? 'table-row-light' : 'table-row-dark'} dataSource={grn} columns={columns} />
                    }

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

export default ViewGRN;