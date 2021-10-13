import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Input, Button, Space, Table, Spin, message, Modal } from 'antd';
import BackFooter from './../BackFooter';
import NotFound from './../../NotFound';
import { baseUrl } from './../../../constants/Constants';
import jwt_decode from "jwt-decode";

function HSN() {
    // const baseUrl = 'http://localhost:8000/';

    const [query, setQuery] = useState({
        hsn_id: "",
        tax_rate: "",
    });
    const [hsn, setHsn] = useState([]);
    const [hsnAll, setHsnAll] = useState([]);
    const [value, setValue] = useState('');

    const [visibility, setVisibility] = useState(false);

    const [l, setloggedin] = useState(true);
    const [r, setR] = useState(false);


    useEffect(() => {
        if (localStorage.getItem("token")) {
            axios.defaults.headers.common["Authorization"] = `JWT ${localStorage.getItem('token')}`;


            axios.get(baseUrl.concat("userdata/?user=" + jwt_decode(localStorage.getItem("token")).user_id))
                .then(() => {
                    axios.get(baseUrl.concat("hsn"))
                        .then(res => {
                            setHsn(res.data);
                            setHsnAll(res.data);
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
            setR(true);
            return 0;
        }, 50);
    }, [])

    const columns = [
        {
            title: 'HSN ID',
            dataIndex: 'hsn_id',
            key: 'hsn_id',
        },
        {
            title: 'Tax Rate',
            key: 'tax_rate',
            render: (record) => <p> {record.tax_rate} % </p>,

        },
        {
            title: 'Action',
            key: 'action',
            render: (record) => (
                <Space size="middle">
                    <Button style={{ borderRadius: "10px" }} onClick={() => { updateRecord(record) }} type="button">Select</Button>
                </Space>
            ),
        },
    ];


    // --------------------------------------------------------------------
    // Visibility Handlers

    const handleCancelDetails = () => {
        setVisibility(false);
    }

    // --------------------------------------------------------------------
    // Handling Form changes

    const updateRecord = (record) => {
        setVisibility(true);
        setQuery(record);
    }

    const formChangeHandler = (e) => {
        setQuery({ ...query, [e.target.name]: e.target.value })
    }


    // --------------------------------------------------------------------
    // Submission

    const submitHandler = (e) => {
        setVisibility(false);
        e.preventDefault();
        console.log(query);

        axios.put(baseUrl.concat("hsn/" + query.id + "/"), query)
            .then(() => {
                message.success("Tax Rate Updated");
                setVisibility(false);
                axios.get(baseUrl.concat("hsn"))
                .then(res => {
                    setHsn(res.data);
                    setHsnAll(res.data)
                })
            })
            .catch(error => {
                if (error.response.status === 401) {
                    localStorage.removeItem('token')
                    setloggedin(false);
                }
            })

        setQuery({
            hsn_id: "",
            tax_rate: "",
        })


    }


    // --------------------------------------------------------------------
    // html

    if (l && r) {
        return (
            <div>
                <br /><br /><br /><br />
                <h4 className="page-title">Tax Details (HSN)</h4>
                <br /><br /><br />
                <div className="row">
                    <p className="col-md-1" />
                    <div className="col-md-2">
                        <h6>
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-search" viewBox="0 0 16 16">
                                <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0z" />
                            </svg>&nbsp;&nbsp;
                            Search HSN ID
                        </h6>

                        <Input style={{ borderRadius: "8px", width: 300 }}
                            placeholder="Search HSN ID"
                            value={value}
                            onChange={e => {
                                const currValue = e.target.value;
                                setValue(currValue);
                                const filteredData = hsnAll.filter(entry =>
                                    entry.hsn_id.toLowerCase().match(currValue.toLowerCase())
                                );
                                setHsn(filteredData);
                            }}
                        />
                    </div>
                    <p className="col-md-9" />
                </div>
                <br /><br /><br />
                <div className="row">
                    <div className="col-sm-1"><p> </p></div>
                    <div className="col-sm-10"><Table rowClassName={(record, index) => index % 2 === 0 ? 'table-row-light' : 'table-row-dark'} dataSource={hsn} columns={columns} /></div>
                    <div className="col-sm-1"><p> </p></div>
                </div>
                <br /><br />

                <Modal
                        title="Change Item Details"
                        footer={[
                            <Button type="button" style={{ borderRadius: "10px " }} key="back" onClick={handleCancelDetails}>Go back</Button>,
                            <Button type="primary" key="submit" onClick={submitHandler}>Update</Button>,
                        ]}
                        visible={visibility} onCancel={handleCancelDetails}
                    >
                        <table className="table table-bordered table-hover print-center">
                            <thead>
                                <tr>
                                    <td>HSN ID</td>
                                    <td>Tax Rate</td>
                                </tr>
                            </thead>
                                <tbody>
                                    <tr>
                                        <td>{query.hsn_id}</td>
                                        <td><Input style={{ borderRadius: "8px", width: 220 }} placeholder={query.tax_rate} name="tax_rate" value={r.quantity} onChange={event => formChangeHandler(event)} suffix="%" /></td>
                                    </tr>
                                </tbody>
                        </table>
                    </Modal>

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

export default HSN;