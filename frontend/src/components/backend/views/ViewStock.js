import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Input, Select, Table, Spin, Button, Space } from 'antd';
import BackFooter from '../BackFooter';
import NotFound from '../../NotFound';
import jwt_decode from "jwt-decode";

function ViewStock() {
    const baseUrl = 'http://localhost:8000/';

    const [orig_stock, setOrigStock] = useState([]);
    const [stock, setStock] = useState([]);
    const [projects, setProjects] = useState([]);
    const [value, setValue] = useState('');
    const [l, setloggedin] = useState(true);
    const [r, setR] = useState(false);
    const [printValid, setPrintValid] = useState(false);
    const [project_id, setProjectID] = useState(0);

    useEffect(() => {
        if (localStorage.getItem("token")) {
            axios.defaults.headers.common["Authorization"] = `JWT ${localStorage.getItem('token')}`;

            // setClient(jwt_decode(localStorage.getItem("token")))

            axios.get(baseUrl.concat("userdata/?user=" + jwt_decode(localStorage.getItem("token")).user_id))
                .then(res => {

                    if (res.data[0].role === "admin") {
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
        setPrintValid(true);
        console.log(value);
        setProjectID(value);
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

    const handlePrint = () => {
        window.open('/stock:' + project_id);
    }

    const handleIndividualPrint = (record) => {
        window.open('/onestock:' + project_id + "-" + record.mat_id);
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
            title: 'Cumulative recieved',
            dataIndex: 'recieved',
            key: 'recieved',
        },
        {
            title: 'Available',
            dataIndex: 'quantity',
            key: 'quantity',
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
                    <Button type="link" onClick={() => { handleIndividualPrint(record) }}>Print Details</Button>
                </Space>
            ),
        },
    ];

    // --------------------------------------------------------------------
    // Print Api

    // const handlePrint = () => {
    //     console.log("Printing....")
    // }

    // --------------------------------------------------------------------
    // Extras

    // const refreshHandler = () => {
    //     window.location.reload();
    // }


    // --------------------------------------------------------------------
    // Antd

    const { Option } = Select;

    // --------------------------------------------------------------------
    // html

    if (l && r) {
        return (
            <div>
                <br /><br /><br /><br />
                <h4 className="page-title">Stock Statement</h4>
                <div className="row">
                    <div className="col-sm-1"></div>
                    <div className="col-sm-10">
                        <h6>Select Project</h6>
                        <Select placeholder="Select Project" style={{ width: 300 }} onChange={handleProjectChange}>
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

                        <Input
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
                <Table dataSource={stock} columns={columns} />
                <br /><br />
                {printValid ?
                    <div className="submit-button">
                        <Button type="primary" onClick={handlePrint}>Download Statement</Button>
                    </div>
                    : <p></p>
                }
                <br /><br /><br /><br /><br />
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

export default ViewStock;