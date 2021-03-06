import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Button, message, Input, Table, Space, Select, Spin } from 'antd';
import NotFound from './../../NotFound';
import { baseUrl } from './../../../constants/Constants';
import BackFooter from './../BackFooter';
import jwt_decode from "jwt-decode";

function Issue() {

    // --------------------------------------------------------------------
    // Base Urls

    // const baseUrl = "http://localhost:8000/"

    // --------------------------------------------------------------------
    // states

    const [l, setloggedin] = useState(true);
    const [r, setR] = useState(false);

    const [projects, setProjects] = useState([]);

    const [query, setQuery] = useState({
        project_id: "",
        mat_id: "",
        mat_name: "----",
        quantity: 0,
        unit: "---"
    });

    // const [quant, setquant] = useState({
    //     project_id: "",
    //     mat_id: "",
    //     mat_name: "----",
    //     recieved: "",
    //     quantity: 0,
    //     unit: "---"
    // });

    const [quant, setQuant] = useState(0);

    const [mats, setMats] = useState([]);
    const [matsOrig, setMatsOrig] = useState([]);
    const [searchValue, setSearchValue] = useState('');
    const [id, setId] = useState();


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

    const [searchstates, setSearch] = useState(false)

    // --------------------------------------------------------------------
    // Columns for antd Table

    const columns = [
        {
            title: 'Material Name',
            dataIndex: 'mat_name',
            key: 'name',
        },
        {
            title: 'Quantity Available',
            dataIndex: 'quantity',
            key: 'quantity',
        },
        {
            title: 'Unit',
            dataIndex: 'unit',
            key: 'unit',
        },
        {
            title: 'Action',
            key: 'action',
            render: (text, record) => (
                <Space size="middle">
                    <Button onClick={() => { updatecol(record) }} size="small" type="button">Select</Button>
                </Space>
            ),
        },
    ];


    // --------------------------------------------------------------------
    // Dynamic Table ADD/DELETE



    // --------------------------------------------------------------------
    // Form change handlers

    const handleProjectChange = (value, index) => {
        setQuery({
            project_id: value,
            mat_id: "",
            mat_name: "----",
            quantity: 0,
            unit: "---",
        });
        axios.get(baseUrl.concat("stock/?project_id=" + value))
            .then(response => {
                setMats(response.data)
                setMatsOrig(response.data)
            })
    }

    const handleformChange = (e) => {
        setQuery({ ...query, quantity: e.target.value })
    }

    // --------------------------------------------------------------------
    // Visibility handlers 

    const showMaterial = () => {
        if (searchstates) {
            setSearch(false);
        } else {
            setSearch(true);
        }
    }

    // --------------------------------------------------------------------
    // Update Rows 

    const updatecol = (record) => {
        const values = query;
        values.mat_id = record.mat_id;
        values.mat_name = record.mat_name;
        values.quantity = 0;
        values.unit = record.unit;
        setQuery(values);
        setQuant(record.quantity)

        // const quant_values = quant;
        // quant_values.mat_id = record.mat_id;
        // quant_values.mat_name = record.mat_name;
        // quant_values.recieved = record.recieved;
        // quant_values.quantity = record.quantity;
        // quant_values.unit = record.unit;
        // setquant(quant_values);

        setId(record.id);
        setSearch(false);
        window.scrollTo({
            top: 0,
            left: 0,
            behavior: 'smooth'
        });
    }

    // --------------------------------------------------------------------
    // Submission

    const submitHandler = (e) => {
        e.preventDefault();
        console.log(query)
        if (quant >= parseFloat(query.quantity) && 0 < parseFloat(query.quantity)) {
            var remaining = parseFloat(quant) - parseFloat(query.quantity);
            axios.post(baseUrl.concat("issue/"), ({ project_id: query.project_id, mat_id: query.mat_id, quantity: query.quantity }))
                .then(response => {
                    console.log(response)
                    axios.put(baseUrl.concat("stock/" + id + "/"), {
                        quantity: remaining,
                        project_id: query.project_id,
                        mat_id: query.mat_id,
                        recieved: quant,
                    })
                        .then(response => {
                            console.log(response)
                            axios.get(baseUrl.concat("stock/?project_id=" + query.project_id))
                                .then(response => {
                                    setMats(response.data)
                                    setMatsOrig(response.data)
                                    message.success("Material Issue Successful")
                                })
                        })

                })
                .catch(error => {
                    message.error("Server Error")
                    console.log(error.response.status)
                    if (error.response.status === 401) {
                        localStorage.removeItem('token')
                        setloggedin(false);
                    }
                })
        } else {
            message.error("Invalid Quantity")
        }
        setQuery({
            ...query,
            quantity: 0,
        })
    }



    // --------------------------------------------------------------------
    // Extras

    const refreshHandler = () => {
        window.location.reload(false);
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
                <h4 className="page-title">New Issue Slip</h4>
                <form onSubmit={submitHandler}>
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

                    <br /><br />
                    <div className="row print-center ">
                        <div className="center table-responsive col-lg-8 col-md-12">
                            <table className="table table-hover table-bordered ">
                                <thead className="thead-light">
                                    <tr className="row">
                                        <th className="col-md-2">Select Material</th>
                                        <th className="col-md-4">Material Name</th>
                                        <th className="col-md-3">Quantity</th>
                                        <th className="col-md-3">Unit</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr className="row">
                                        <td className="col-md-2"><Button type="button" style={{ borderRadius: "10px " }} onClick={() => showMaterial()}>Select Material</Button></td>
                                        <td className="col-md-4">{query.mat_name}</td>
                                        <td className="col-md-3"><Input style={{ borderRadius: "8px" }} type="text" value={query.quantity} placeholder="Quantity" name="quantity" onChange={handleformChange} /></td>
                                        <td className="col-md-3">{query.unit}</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div> <br />

                    <div className="submit-button">
                        <Button type="submit" style={{ background: "dodgerblue", color: "white", borderRadius: "10px " }} onClick={submitHandler}>Submit</Button>
                    </div>
                </form>
                <br /><br />
                {searchstates ?
                    (<div>
                        <br /><br />
                        <div className="row">
                            <div className="col-sm-1"><p> </p></div>
                            <div className="col-sm-10">

                                <h6>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-search" viewBox="0 0 16 16">
                                        <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0z" />
                                    </svg>&nbsp;&nbsp;
                                    Search Material
                                </h6>
                                <Input style={{ borderRadius: "8px", width: 300 }}
                                    placeholder="Material Name"
                                    value={searchValue}
                                    onChange={e => {
                                        const currValue = e.target.value;
                                        setSearchValue(currValue);
                                        const filteredData = matsOrig.filter(entry =>
                                            entry.mat_name.toLowerCase().match(currValue.toLowerCase())
                                        );
                                        setMats(filteredData);
                                    }}
                                />
                                <br /><br />
                                <Table rowClassName={(record, index) => index % 2 === 0 ? 'table-row-light' : 'table-row-dark'} dataSource={mats} columns={columns} />

                            </div>
                            <div className="col-sm-1"><p> </p></div>
                        </div>
                    </div>) : (
                        <div><p> </p></div>
                    )
                }

                <br /><br />
                <div className="row">
                    <div className="col-sm-10"><p> </p></div>
                    <div className="col-sm-1"><Button type="link" style={{ background: "#027c86", color: "white", borderRadius: "10px" }} className="float-right" onClick={refreshHandler}>Refresh</Button></div>
                    <div className="col-sm-1"><p> </p></div>
                </div>
                <br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br />
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

    } else {
        console.log("NOT SIGNED IN")
        return (
            <NotFound />
        )
    }
}

export default Issue;