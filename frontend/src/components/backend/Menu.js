import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Table } from 'react-bootstrap';
import NotFound from './../NotFound';
import BackFooter from './BackFooter';
import axios from 'axios';
import jwt_decode from "jwt-decode";
import { Spin, Button } from 'antd'
import { baseUrl } from './../../constants/Constants';


function Menu() {

    // // const baseUrl = 'http://localhost:8000/';

    const [l, setloggedin] = useState(true);
    const [r, setR] = useState(false);

    const [adm, setadm] = useState(false);
    const [po, setPO] = useState(false);



    useEffect(() => {
        if (localStorage.getItem("token")) {
            axios.defaults.headers.common["Authorization"] = `JWT ${localStorage.getItem('token')}`;

            // setClient(jwt_decode(localStorage.getItem("token")))

            axios.get(baseUrl.concat("userdata/?user=" + jwt_decode(localStorage.getItem("token")).user_id))
                .then(res => {
                    console.log(res)
                    if (res.data[0].role === "admin") {
                        setadm(true);
                    } else if (res.data[0].role === "Purchase Officer") {
                        setPO(true);
                    }
                })
                .then(res => {
                    setR(true);
                })
                .catch(error => {
                    if (error.response) {
                        if (error.response.status === 401) {
                            localStorage.removeItem('token')
                            setloggedin(false);
                            setR(true);
                        }
                        console.log(error.response.data);
                        console.log(error.response.status);
                        console.log(error.response.headers);
                    } else if (error.request) {
                        console.log(error.request);
                        setloggedin(false);
                        setR(true);
                    } else {
                        console.log('Error', error.message);
                    }
                })

        } else {
            delete axios.defaults.headers.common["Authorization"];
            setloggedin(false);
            setR(true);
        }

        setTimeout(() => {

            return 0;
        }, 50);
    }, [])

    if (l && r) {
        return (
            <div>
                <br /><br /><br /><br /><br />
                <div className="row">
                    <div className="col-md-4 col-sm-12"> </div>
                    <div className="col-md-2 col-sm-12"><h4 className="page-title main-menu">MAIN MENU</h4></div>
                    <div className="col-md-6 col-sm-12"> </div>
                </div>
                {/* <h4 className="page-title main-menu">MAIN MENU</h4> */}
                <br />
                <div className="row">
                    <div className="col-xl-2 col-lg-1"> </div>
                    <div className="col-xl-8 col-lg-10">
                        <Table className="table">
                            <tbody>
                                <tr>
                                    <td>
                                        <ul className="menu-list">
                                            <h5 className="menu-title">Purchase Requisitions</h5>
                                            <li className="menu-item"><Button type="link" style={{ background: "#7FCDD8", color: "white", borderRadius: "10px" }}><p><Link className="menu-item-a" to="/1req">New Purchase Requisition</Link></p></Button></li>
                                            <li className="menu-item"><Button type="link" style={{ background: "#7FCDD8", color: "white", borderRadius: "10px" }}><p><Link className="menu-item-a" to="/1viewreq">View Purchase Requisition</Link></p></Button></li>
                                            {/* {adm ? <li className="menu-item"><Button type="link" style={{ background: "#7FCDD8", color: "white", borderRadius: "10px" }}><p><Link className="menu-item-a" to="/1master">Approve Purchase requisitions</Link></p></Button></li> : wp ? <li className="menu-item"><Button type="link" style={{ background: "#7FCDD8", color: "white", borderRadius: "10px" }}><p><Link className="menu-item-a" to="/1reqsite">Approve Purchase requisitions</Link></p></Button></li> : <p></p> } */}
                                            {
                                                adm ?
                                                    <li className="menu-item"><Button type="link" style={{ background: "#7FCDD8", color: "white", borderRadius: "10px" }}><p><Link className="menu-item-a" to="/1master">Approve Purchase requisitions</Link></p></Button></li>
                                                    :
                                                    <p></p>
                                            }
                                        </ul>
                                    </td>
                                </tr>
                                {
                                    (adm || po) ?
                                        <tr>
                                            <td>
                                                <ul className="menu-list">
                                                    <h5 className="menu-title">Purchase Orders</h5>
                                                    <li className="menu-item"><Button type="link" style={{ background: "#7FCDD8", color: "white", borderRadius: "10px" }}><p><Link className="menu-item-a" to="/1po">New Purchase Order</Link></p></Button></li>
                                                    <li className="menu-item"><Button type="link" style={{ background: "#7FCDD8", color: "white", borderRadius: "10px" }}><p><Link className="menu-item-a" to="/updatepo">Update Purchase Orders</Link></p></Button></li>
                                                    <li className="menu-item"><Button type="link" style={{ background: "#7FCDD8", color: "white", borderRadius: "10px" }}><p><Link className="menu-item-a" to="/1viewpo">View Purchase Orders</Link></p></Button></li>
                                                </ul>
                                            </td>
                                        </tr>
                                        : <p></p>
                                }

                                <tr>
                                    <td>
                                        <ul className="menu-list">
                                            <h5 className="menu-title">Goods Recipt Note</h5>
                                            <li className="menu-item"><Button type="link" style={{ background: "#7FCDD8", color: "white", borderRadius: "10px" }}><p><Link className="menu-item-a" to="/1grn">New GRN</Link></p></Button></li>
                                            <li className="menu-item"><Button type="link" style={{ background: "#7FCDD8", color: "white", borderRadius: "10px" }}><p><Link className="menu-item-a" to="/1cashgrn">New Cash GRN</Link></p></Button></li>
                                            <li className="menu-item"><Button type="link" style={{ background: "#7FCDD8", color: "white", borderRadius: "10px" }}><p><Link className="menu-item-a" to="/1viewgrn">View GRN</Link></p></Button></li>
                                        </ul>
                                    </td>
                                </tr>
                                <tr>
                                    <td>
                                        <ul className="menu-list">
                                            <h5 className="menu-title">Avaialble Stock details</h5>
                                            <li className="menu-item"><Button type="link" style={{ background: "#7FCDD8", color: "white", borderRadius: "10px" }}><p><Link className="menu-item-a" to="/1stock">View Stock</Link></p></Button></li>

                                        </ul>
                                    </td>
                                </tr>
                                <tr>
                                    <td>
                                        <ul className="menu-list">
                                            <h5 className="menu-title">Material Issue</h5>
                                            <li className="menu-item"><Button type="link" style={{ background: "#7FCDD8", color: "white", borderRadius: "10px" }}><p><Link className="menu-item-a" to="/1issue">New Issue Slip</Link></p></Button></li>
                                            <li className="menu-item"><Button type="link" style={{ background: "#7FCDD8", color: "white", borderRadius: "10px" }}><p><Link className="menu-item-a" to="/1viewissues">View Issue Details</Link></p></Button></li>
                                        </ul>
                                    </td>
                                </tr>

                                <tr>
                                    <td>
                                        <ul className="menu-list">
                                            <h5 className="menu-title">Site to Site Transfer</h5>
                                            <li className="menu-item"><Button type="link" style={{ background: "#7FCDD8", color: "white", borderRadius: "10px" }}><p><Link className="menu-item-a" to="/1delivery">Site-to-site Material Transfer</Link></p></Button></li>
                                        </ul>
                                    </td>
                                </tr>

                                {
                                    (adm || po) ?
                                        <tr>
                                            <td>
                                                <ul className="menu-list">
                                                    <h5 className="menu-title">Suppliers</h5>
                                                    <li className="menu-item"><Button type="link" style={{ background: "#7FCDD8", color: "white", borderRadius: "10px" }}><p><Link className="menu-item-a" to="/1supplier">Add New Supplier</Link></p></Button></li>
                                                    <li className="menu-item"><Button type="link" style={{ background: "#7FCDD8", color: "white", borderRadius: "10px" }}><p><Link className="menu-item-a" to="/1supplierUpdate">Update Supplier Details</Link></p></Button></li>
                                                    <li className="menu-item"><Button type="link" style={{ background: "#7FCDD8", color: "white", borderRadius: "10px" }}><p><Link className="menu-item-a" to="/1viewsupplier">View Supplier Details</Link></p></Button></li>
                                                </ul>
                                            </td>
                                        </tr>
                                        :
                                        <p></p>
                                }
                                <tr>
                                    <td>
                                        <ul className="menu-list">
                                            <h5 className="menu-title">Material Master</h5>
                                            <li className="menu-item"><Button type="link" style={{ background: "#7FCDD8", color: "white", borderRadius: "10px" }}><p><Link className="menu-item-a" to="/1material">Add Material</Link></p></Button></li>
                                            <li className="menu-item"><Button type="link" style={{ background: "#7FCDD8", color: "white", borderRadius: "10px" }}><p><Link className="menu-item-a" to="/1viewmaterial">View Materials</Link></p></Button></li>
                                            <li className="menu-item"><Button type="link" style={{ background: "#7FCDD8", color: "white", borderRadius: "10px" }}><p><Link className="menu-item-a" to="/1hsn">Add / Change HSN</Link></p></Button></li>
                                        </ul>
                                    </td>
                                </tr>
                                {adm ?
                                    <tr>
                                        <td>
                                            <ul className="menu-list">
                                                <h5 className="menu-title">Admin Panel</h5>
                                                <li className="menu-item"><Button type="link" style={{ background: "#7FCDD8", color: "white", borderRadius: "10px" }}><p><Link className="menu-item-a" to="/1projects">New Project</Link></p></Button></li>
                                                <li className="menu-item"><Button type="link" style={{ background: "#7FCDD8", color: "white", borderRadius: "10px" }}><p><Link className="menu-item-a" to="/1newuser">New User</Link></p></Button></li>
                                                <li className="menu-item"><Button type="link" style={{ background: "#7FCDD8", color: "white", borderRadius: "10px" }}><p><Link className="menu-item-a" to="/1uploadreqs">Add Requisition Limits</Link></p></Button></li>
                                                <li className="menu-item"><Button type="link" style={{ background: "#7FCDD8", color: "white", borderRadius: "10px" }}><p><Link className="menu-item-a" to="/1projectData">Update Requisition Limit</Link></p></Button></li>
                                            </ul>
                                        </td>
                                    </tr>
                                    :
                                    <p></p>
                                }
                            </tbody>
                        </Table>
                    </div>
                    <div className="col-xl-2 col-lg-1"> </div>
                </div>
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
        return (
            <NotFound />
        )
    }
}

export default Menu;