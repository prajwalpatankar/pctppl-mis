import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Table, Spin, Button, Space, Modal } from 'antd';
import BackFooter from '../BackFooter';
import NotFound from '../../NotFound';
import jwt_decode from "jwt-decode";


function ViewSuppliers() {
    const baseUrl = 'http://localhost:8000/';


    const [l, setloggedin] = useState(true);
    const [r, setR] = useState(false);
    const [supplier, setSupplier] = useState([]);

    const [empty, setEmpty] = useState(false);


    useEffect(() => {
        if (localStorage.getItem("token")) {
            axios.defaults.headers.common["Authorization"] = `JWT ${localStorage.getItem('token')}`;

            axios.get(baseUrl.concat("userdata/?user=" + jwt_decode(localStorage.getItem("token")).user_id))
                .then(res => {
                    axios.get(baseUrl.concat("supplier"))
                        .then(res1 => {
                            if(res1.data.length === 0 ){
                                setEmpty(true);
                            }
                            else {
                                setSupplier(res1.data);
                            }
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
    // AntD table columns

    const columns = [
        {
            title: 'Supplier Name',
            dataIndex: 'supp_name',
            key: 'supp_name',
        },
        {
            title: 'Contact Person',
            dataIndex: 'contact_person',
            key: 'contact_person',
        },
        {
            title: 'Contact ',
            dataIndex: 'contact',
            key: 'contact',
        },
        {
            title: 'State ',
            dataIndex: 'state',
            key: 'state',
        },
        {
            title: 'GST No. ',
            dataIndex: 'gst',
            key: 'gst',
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
                    <h4 className="page-title">Supplier Details</h4>
                    <br />
                    <Table dataSource={supplier} columns={columns} />
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

export default ViewSuppliers;