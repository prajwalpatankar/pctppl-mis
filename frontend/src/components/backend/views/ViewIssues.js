import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Input, Select, Table, Spin, Button, Space, message, Modal } from 'antd';
import BackFooter from '../BackFooter';
import NotFound from '../../NotFound';
import jwt_decode from "jwt-decode";

function ViewIssues() {
    const baseUrl = 'http://localhost:8000/';

    const [orig_stock, setOrigStock] = useState([]);
    const [stock, setStock] = useState([]);
    const [issueDetails, setIssueDetails] = useState([]);
    const [transfers, setTransfers] = useState([]);
    const [transfersInner, setTransfersInner] = useState([]);
    const [projects, setProjects] = useState([]);
    const [value, setValue] = useState('');

    const [l, setloggedin] = useState(true);
    const [r, setR] = useState(false);
    const [rendered, setRendered] = useState(false);

    const [visibility, setVisibility] = useState(false);
    const [currentItem, setCurrentItem] = useState({
        mat_name: "",
        unit: "",
    });

    useEffect(() => {
        if (localStorage.getItem("token")) {
            axios.defaults.headers.common["Authorization"] = `JWT ${localStorage.getItem('token')}`;

            // setClient(jwt_decode(localStorage.getItem("token")))

            axios.get(baseUrl.concat("userdata/?user=" + jwt_decode(localStorage.getItem("token")).user_id))
                .then(res => {

                    if (res.data[0].role === "admin" || res.data[0].role === "Purchase Officer") {
                        axios.get(baseUrl.concat("projects"))
                            .then(res => {
                                setProjects(res.data);
                            })

                    } else if (res.data[0].role === "Project Manager") {
                        axios.get(baseUrl.concat("projects/?pm=" + jwt_decode(localStorage.getItem("token")).user_id))
                            .then(res => {
                                setProjects(res.data);
                            })
                    } else {
                        axios.get(baseUrl.concat("projects/?user=" + jwt_decode(localStorage.getItem("token")).user_id))
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
            setloggedin(false);
            delete axios.defaults.headers.common["Authorization"];
        }

        setTimeout(() => {
            setR(true);
            return 0;
        }, 50);
    }, [])


    const handleProjectChange = (value) => {
        axios.get(baseUrl.concat("stock/?project_id=" + value))
            .then(response => {
                setStock(response.data)
                setOrigStock(response.data)
            })
            .catch(error => {
                console.log(error.response.status)
                if (error.response.status === 401) {
                    localStorage.removeItem('token')
                    setloggedin(false);
                }
            })
    }


    const handleCancelDetails = () => {
        setVisibility(false);
    }
    

    const flatten = (ary, mat_id) => {
        var ret = [];
        for(var i = 0; i < ary.length; i++) {
            for( var j=0; j < ary[i].initialItemRow.length; j++){         
                if( toString(ary[i].initialItemRow[j].mat_id) === toString(mat_id) ){                   
                    ret.push(ary[i].initialItemRow[j]);
                    continue;
                }
            }
        }
        return ret;
    }

    const handleViewDetails = (record) => {
        setRendered(false);
        setCurrentItem(record);
        axios.get(baseUrl.concat("issue/?project_id=" + record.project_id + "&mat_id=" + record.mat_id))
            .then(response => {
                axios.get(baseUrl.concat("sitetransfer/?from_proj=" + record.project_id + "&initialItemRow__mat_id=" + record.mat_id))
                    .then(res => {
                        console.log("transfer Response:", res.data, response.data)
                        if (response.data.length === 0 && res.data.length === 0) {
                            message.error(`Material ${record.mat_name} has not been issued yet`);
                        } else {
                            let flattened = flatten(res.data, record.mat_id);
                            console.log("flattened : ", flattened);                            
                            response.data.sort(function (a, b) {
                                return b.id - a.id;
                            });
                            flattened.sort(function (a, b) {
                                return b.id - a.id;
                            });
                            res.data.sort(function (a, b) {
                                return b.id - a.id;
                            });

                            setIssueDetails(response.data);
                            setTransfers(res.data);
                            setTransfersInner(flattened);
                        }
                    })
                    .then(() =>{
                        setTimeout(() =>{
                            setVisibility(true);
                            setRendered(true);
                        }, 100)
                    })
            })
        // open Modal here        
    }



    const columns = [
        {
            title: 'Material Id',
            dataIndex: 'mat_id',
            key: 'mat_id',
        },
        {
            title: 'Material Name',
            dataIndex: 'mat_name',
            key: 'mat_name',
        },
        {
            title: 'Unit',
            dataIndex: 'unit',
            key: 'unit',
        },
        {
            title: 'Details',
            key: 'details',
            render: (text, record) => (
                <Space size="middle">
                    <Button type="link" style={{ background: "#027c86", color: "white", borderRadius: "10px" }} onClick={() => { handleViewDetails(record) }}>View Details</Button>
                </Space>
            ),
        },
    ];

    // --------------------------------------------------------------------
    // Antd

    const { Option } = Select;

    // --------------------------------------------------------------------
    // html

    if (l && r) {
        return (
            <div>
                <br /><br /><br /><br />
                <h4 className="page-title">Materials Issues</h4>
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

                <br />



                <br /><br /><br />
                <div className="row">
                    <p className="col-md-1" />
                    <div className="col-md-2">
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
                                const filteredData = orig_stock.filter(entry =>
                                    entry.mat_name.toLowerCase().match(currValue.toLowerCase())
                                );
                                setStock(filteredData);
                            }}
                        />
                    </div>
                    <p className="col-md-9" />
                </div>
                <br />
                <Table rowClassName={(record, index) => index % 2 === 0 ? 'table-row-light' : 'table-row-dark'} dataSource={stock} columns={columns} />

                <Modal
                    title={`Item Issue Details - ${currentItem.mat_name} `}
                    footer={[
                        <Button type="button" style={{ borderRadius: "10px " }} key="back" onClick={handleCancelDetails}>Go back</Button>,
                    ]}
                    visible={visibility} onCancel={handleCancelDetails}
                >
                    <table className="table table-bordered table-hover">
                        <thead>
                            <tr className="table-row-heading">
                                <td><b>Date</b></td>
                                <td><b>Time</b></td>
                                <td><b>Quantity Utitlized</b></td>
                                <td><b>Unit</b></td>
                            </tr>
                        </thead>
                        <tbody>
                            {issueDetails.length !== 0 ?
                                issueDetails.map((item) => (
                                    <tr className="table-row-light">
                                        <td>{item.created_date_time.substring(8, 10)}-{item.created_date_time.substring(5, 7)}-{item.created_date_time.substring(0, 4)} </td>
                                        <td>{item.created_date_time.substring(11, 13)}:{item.created_date_time.substring(14, 16)}:{item.created_date_time.substring(17, 19)} </td>
                                        <td>{item.quantity}</td>
                                        <td>{currentItem.unit}</td>
                                    </tr>
                                ))
                                :
                                <p />
                            }
                            {transfersInner.length !== 0 && transfers.length !== 0 && rendered ?                            
                                transfers.map((item, index) => (
                                    <tr className="table-row-dark">
                                        <td>{item.created_date_time.substring(8, 10)}-{item.created_date_time.substring(5, 7)}-{item.created_date_time.substring(0, 4)} </td>
                                        <td>{item.created_date_time.substring(11, 13)}:{item.created_date_time.substring(14, 16)}:{item.created_date_time.substring(17, 19)} </td>
                                        <td>{transfersInner[index].quantity}</td>
                                        <td>{currentItem.unit}</td>
                                    </tr>
                                ))
                                :
                                <br />
                            }

                        </tbody>
                    </table>
                </Modal>


                <br /><br />
                <br /><br /><br /><br /><br /><br /><br /><br /><br /><br />
                <BackFooter />
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

    }
    else {
        return (
            <NotFound />
        )

    }
}

export default ViewIssues;