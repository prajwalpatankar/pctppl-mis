import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Input, Select, Button, Spin, message } from 'antd';
import BackFooter from '../BackFooter';
import NotFound from '../../NotFound';
import jwt_decode from "jwt-decode";
import { baseUrl } from './../../../constants/Constants';

function Material() {
    // const baseUrl = 'http://localhost:8000/';

    const [query, setQuery] = useState({
        mat_name: "",
        unit: "",
        hsn_id: "",
    });
    const [hsn, setHsn] = useState([]);

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
                    })
                    .then(() => {
                        setR(true);
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
        }, 100);
    }, [])



    // --------------------------------------------------------------------
    // Handling Form changes

    const onSearchHsn = (value) => {
        setQuery({ ...query, hsn_id: value });
    }

    const formChangeHandler = (e) => {
        setQuery({ ...query, [e.target.name]: e.target.value })
    }


    // --------------------------------------------------------------------
    // Submission

    const submitHandler = (e) => {
        e.preventDefault();
        console.log(query);

        axios.post(baseUrl.concat("materials/"), query)
            .then(() => {
                message.success("Material added successfully")
            })
            .catch(error => {
                if (error.response.status === 401) {
                    localStorage.removeItem('token')
                    setloggedin(false);
                }
            })

        setQuery({
            mat_name: "",
            unit: "",
            hsn_id: "",
        })


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
                <h4 className="page-title">New Material</h4>
                <br /><br /><br />
                <div className="row">
                    <div className="col-md-2"></div>
                    <div className="col-md-3">
                        <h6>Material Name</h6>
                        <Input style={{ borderRadius: "8px", width: 300 }}  placeholder="Material Name" name="mat_name" value={query.mat_name} onChange={formChangeHandler} />
                    </div>
                    <div className="col-md-3">
                        <h6>Unit</h6>
                        <Input style={{ borderRadius: "8px", width: 300 }}  placeholder="Unit" name="unit" value={query.unit} onChange={formChangeHandler}  />
                    </div>
                    <div className="col-md-3">
                        <h6>HSN ID</h6>
                        <Select placeholder="Select HSN ID" style={{ width:225 }} onChange={onSearchHsn}>
                            {hsn.map((h, index) => (
                                <Option value={h.hsn_id}>{h.hsn_id}</Option>
                            ))}
                        </Select>
                    </div>
                    <div className="col-md-1"></div>
                </div>

                <br /><br />
                <div className="submit-button">
                    <Button type="submit" style={{ background: "dodgerblue", color: "white", borderRadius: "10px " }} onClick={submitHandler}>Submit</Button>
                </div>
                <br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br />
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

export default Material;