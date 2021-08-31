import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Input, Select, Button, Space, Table, Spin, message } from 'antd';
import BackFooter from './../BackFooter';
import NotFound from './../../NotFound';
import jwt_decode from "jwt-decode";

function UpdateSupplier() {
    const baseUrl = 'http://localhost:8000/';

    const [query, setQuery] = useState({
        id: "",
        supp_name: "",
        supp_address: "",
        contact_person: "",
        contact: "",
        state: "",
        gst: "",
    });

    const [suppliers, setSuppliers] = useState([]);
    const [searchstates, setSearch] = useState({
        searchname: "",
    })

    const [visibility, setVisibility] = useState(false);

    const ind_states = [{ "key": "AN", "name": "Andaman and Nicobar Islands" }, { "key": "AP", "name": "Andhra Pradesh" }, { "key": "AR", "name": "Arunachal Pradesh" }, { "key": "AS", "name": "Assam" }, { "key": "BR", "name": "Bihar" }, { "key": "CG", "name": "Chandigarh" }, { "key": "CH", "name": "Chhattisgarh" }, { "key": "DH", "name": "Dadra and Nagar Haveli" }, { "key": "DD", "name": "Daman and Diu" }, { "key": "DL", "name": "Delhi" }, { "key": "GA", "name": "Goa" }, { "key": "GJ", "name": "Gujarat" }, { "key": "HR", "name": "Haryana" }, { "key": "HP", "name": "Himachal Pradesh" }, { "key": "JK", "name": "Jammu and Kashmir" }, { "key": "JH", "name": "Jharkhand" }, { "key": "KA", "name": "Karnataka" }, { "key": "KL", "name": "Kerala" }, { "key": "LD", "name": "Lakshadweep" }, { "key": "MP", "name": "Madhya Pradesh" }, { "key": "MH", "name": "Maharashtra" }, { "key": "MN", "name": "Manipur" }, { "key": "ML", "name": "Meghalaya" }, { "key": "MZ", "name": "Mizoram" }, { "key": "NL", "name": "Nagaland" }, { "key": "OR", "name": "Odisha" }, { "key": "PY", "name": "Puducherry" }, { "key": "PB", "name": "Punjab" }, { "key": "RJ", "name": "Rajasthan" }, { "key": "SK", "name": "Sikkim" }, { "key": "TN", "name": "Tamil Nadu" }, { "key": "TS", "name": "Telangana" }, { "key": "TR", "name": "Tripura" }, { "key": "UK", "name": "Uttar Pradesh" }, { "key": "UP", "name": "Uttarakhand" }, { "key": "WB", "name": "West Bengal" }]
    const [l, setloggedin] = useState(true);
    const [r, setR] = useState(false);


    useEffect(() => {
        if (localStorage.getItem("token")) {
            axios.defaults.headers.common["Authorization"] = `JWT ${localStorage.getItem('token')}`;


            axios.get(baseUrl.concat("userdata/?user=" + jwt_decode(localStorage.getItem("token")).user_id))
                // .then(res => {
                //     axios.get(baseUrl.concat("supplier"))
                //         .then(res => {
                //             setSuppliers(res.data);
                //         })
                // })
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
            message.info("Click search icon to view all suppliers");
            return 0;
        }, 50);
    }, [])

    const columns = [
        {
            title: 'Supplier Name',
            dataIndex: 'supp_name',
            key: 'supp_name',
        },
        {
            title: 'State',
            dataIndex: 'state',
            key: 'state',
        },
        {
            title: 'Action',
            key: 'action',
            render: (text, record) => (
                <Space size="middle">
                    <Button onClick={() => { updateRecord(record) }} type="button">Select</Button>
                </Space>
            ),
        },
    ];


    // --------------------------------------------------------------------
    // Visibility and search handlers 


    const searchChangeHandler = (event) => {
        setSearch({ [event.target.name]: event.target.value });
    }

    const onSearchSupp = () => {
        const searchval = searchstates.searchname;
        axios.get(baseUrl.concat("supplier/?search=" + searchval))
            .then(res => {
                setSuppliers(res.data);
            })
    }

    // --------------------------------------------------------------------
    // Handling Form changes

    const updateRecord = (record) => {
        setVisibility(true);
        setQuery(record);
    }

    const onSearchState = (value) => {
        setQuery({ ...query, state: value });
    }

    const formChangeHandler = (e) => {
        setQuery({ ...query, [e.target.name]: e.target.value })
        console.log(query);
    }


    // --------------------------------------------------------------------
    // Submission

    const submitHandler = (e) => {
        setVisibility(false);
        e.preventDefault();
        console.log(query);

        axios.put(baseUrl.concat("supplier/" + query.id + "/"), query)
            .then(res => {
                console.log(res);
            })
            .catch(error => {
                if (error.response.status === 401) {
                    localStorage.removeItem('token')
                    setloggedin(false);
                }
            })

        setQuery({
            id: "",
            supp_name: "",
            supp_address: "",
            contact_person: "",
            contact: "",
            state: "",
            gst: "",
        })


    }



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
    const { TextArea } = Input;
    const { Search } = Input;

    // --------------------------------------------------------------------
    // html

    if (l && r) {
        return (
            <div>
                <br /><br /><br /><br />
                <h4 className="page-title">Update Supplier Details </h4>
                <br /><br /><br />
                <div className="row">

                    <span className="col-sm-1"> </span>
                    <span className="col-sm-10">
                        <h6>Search Supplier</h6>
                        <Search placeholder="Search Supplier" name="searchname" onChange={event => searchChangeHandler(event)} onSearch={onSearchSupp} enterButton style={{ width: 300 }} />

                    </span>
                    <span className="col-sm-1"> </span>
                </div>
                <br /><br /><br />
                <div className="row">
                    <div className="col-sm-1"><p> </p></div>
                    <div className="col-sm-10"><Table rowClassName={(record, index) => index % 2 === 0 ? 'table-row-light' : 'table-row-dark'} dataSource={suppliers} columns={columns} /></div>
                    <div className="col-sm-1"><p> </p></div>
                </div>
                <br /><br />

                {visibility ?

                    <div>
                        <div className="row">
                            <div className="col-md-2"></div>
                            <div className="col-md-3">
                                <h6>Supplier Name</h6>
                                <Input placeholder="Supplier Name" name="supp_name" value={query.supp_name} onChange={formChangeHandler} style={{ width: 300 }} />

                            </div>
                            <div className="col-md-3">
                                <h6>Address</h6>
                                <TextArea rows={2} placeholder="Address" name="supp_address" value={query.supp_address} onChange={formChangeHandler} style={{ width: 300 }} />

                            </div>
                            <div className="col-md-3">
                                <h6>Contact Person</h6>
                                <Input placeholder="Contact Person Name" name="contact_person" value={query.contact_person} onChange={formChangeHandler} style={{ width: 300 }} />

                            </div>
                            <div className="col-md-1"></div>
                        </div>
                        <br /><br />
                        <div className="row">
                            <div className="col-md-2"></div>
                            <div className="col-md-3">
                                <h6>Contact No.</h6>
                                <Input placeholder="Contact Number" name="contact" value={query.contact} onChange={formChangeHandler} style={{ width: 300 }} type="number" />

                            </div>
                            <div className="col-md-3">
                                <h6>State</h6>
                                <Input placeholder="State" name="state" value={query.state} style={{ width: 300 }} disabled="True" />
                                <Select placeholder="Change State" style={{ width: 300 }} onChange={onSearchState} >
                                    {ind_states.map((state, index) => (
                                        <Option value={state.name}>{state.name}</Option>
                                    ))}
                                </Select>

                            </div>
                            <div className="col-md-3">
                                <h6>GST No.</h6>
                                <Input placeholder="GST Number" name="gst" value={query.gst} onChange={formChangeHandler} style={{ width: 300 }} />

                            </div>
                            <div className="col-md-1"></div>
                        </div>

                        <br /><br />
                        <div className="submit-button">
                            <Button type="submit" style={{ background: "dodgerblue", color: "white" }} onClick={submitHandler}>Submit</Button>
                        </div>

                    </div>
                    :
                    <div>
                        <br /><br /><br /><br /><br /><br /><br />
                    </div>
                }


                <br /><br /><br /><br /><br /><br /><br />
                <BackFooter />
            </div >
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

export default UpdateSupplier;