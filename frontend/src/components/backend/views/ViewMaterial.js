import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Table, Spin, Button, Space, Modal } from 'antd';
import BackFooter from '../BackFooter';
import NotFound from '../../NotFound';
import jwt_decode from "jwt-decode";
import { baseUrl } from './../../../constants/Constants';





function ViewMaterial() {
    // const baseUrl = 'http://localhost:8000/';


    const [l, setloggedin] = useState(true);
    const [r, setR] = useState(false);

    const [matAll, setmatAll] = useState([]);

    const [empty, setEmpty] = useState(false);


    useEffect(() => {
        if (localStorage.getItem("token")) {
            axios.defaults.headers.common["Authorization"] = `JWT ${localStorage.getItem('token')}`;

            axios.get(baseUrl.concat("userdata/?user=" + jwt_decode(localStorage.getItem("token")).user_id))
                .then(() => {
                    axios.get(baseUrl.concat("materials"))
                    .then(resMat => {
                        // console.log(resMat.data)
                        if (resMat.data.length === 0) {
                            setEmpty(true)
                        } 
                        setmatAll(resMat.data);
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
            setR(true)
            return 0;
        }, 50);
    }, [])

    // --------------------------------------------------------------------
    // AntD table columns

    const columns = [
        {
            title: 'ID',
            dataIndex: 'id',
            key: 'id',
        },
        {
            title: 'Material Name',
            dataIndex: 'mat_name',
            key: 'mat_name',
        },
        {
            title: 'HSN ID',
            dataIndex: 'hsn_id',
            key: 'hsn_id',
        },
        {
            title: 'Unit',
            dataIndex: 'unit',
            key: 'unit',
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
                    <h4 className="page-title">Material Master</h4>
                    <br />
                    <Table  rowClassName={(index) => index % 2 === 0 ? 'table-row-light' :  'table-row-dark'} dataSource={matAll} columns={columns} />
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

export default ViewMaterial;