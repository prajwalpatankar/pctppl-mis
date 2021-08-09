import React , { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Table } from 'react-bootstrap';
import NotFound from './../NotFound';
import BackFooter from './BackFooter';
import axios from 'axios';
import jwt_decode from "jwt-decode";


function Menu() {

    const baseUrl = 'http://localhost:8000/';

    const [gg, setgg] = useState(false);
    const [wp, setwp] = useState(false);
    const [l, setloggedin] = useState(true);
    
    
    useEffect(() => {
        if (localStorage.getItem("token")) {
            axios.defaults.headers.common["Authorization"] = `JWT ${localStorage.getItem('token')}`;
    
            // setClient(jwt_decode(localStorage.getItem("token")))
    
            axios.get(baseUrl.concat("userdata/?user=" + jwt_decode(localStorage.getItem("token")).user_id))
                .then(res => {
    
                    if (res.data[0].role === "admin") {
                        setgg(true)
                    } else if (res.data[0].role === "Project Manager") {
                        setwp(true)
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
            delete axios.defaults.headers.common["Authorization"];
        }
    
        setTimeout(() => {
            return 0;
        }, 200);
    }, [])

    if (l) {
        return (
            <div>
                <br /><br /><br /><br />
                <h4>MAIN MENU</h4>
                <Table className="table table-hover">
                    <tbody>
                        <tr>
                            <td>
                                <ul>
                                    <h4>Purchse Requisitions</h4>
                                    <li><Link to="/1req">New Purchase Requisition</Link></li>
                                    <li><Link to="/1viewreq">View Purchase Requisition</Link></li>
                                    {gg ? <li><Link to="/1master">Approve Purchase requisitions</Link></li> : wp ? <li><Link to="/1reqsite">Approve Purchase requisitions</Link></li> : <p></p> }
                                </ul>                                
                            </td>
                        </tr>
                        <tr>
                            <td>
                                <ul>
                                    <h4>Purchase Orders</h4>
                                    <li><Link to="/1po">New Purchase Order</Link></li>
                                    <li><Link to="/1po">View Purchase Orders</Link>----</li>
                                </ul>                                
                            </td>
                        </tr>
                        <tr>
                            <td>
                                <ul>
                                    <h4>Goods Recipt Note</h4>
                                    <li><Link to="/1grn">New GRN</Link></li>
                                    <li><Link to="/">View GRN</Link>----</li>
                                </ul>                                
                            </td>
                        </tr>
                        <tr>
                            <td>
                                <ul>
                                    <h4>Avaialble Stock details</h4>
                                    <li><Link to="/1stock">View Stock</Link></li>

                                </ul>                                
                            </td>
                        </tr>
                        <tr>
                            <td>
                                <ul>
                                    <h4>Material Issue and Transfer</h4>
                                    <li><Link to="/1issue">New Issue Slip</Link></li>
                                    <li><Link to="/1delivery">Site-to-site Material Transfer</Link></li>
                                </ul>                                
                            </td>
                        </tr>
                        <tr>
                            <td>
                                <ul>
                                    <h4>Material Master</h4>
                                    <li><Link to="/1material">Add New Material</Link></li>
                                </ul>                                
                            </td>
                        </tr>
                        <tr>
                            <td>
                                <ul>
                                    <h4>Suppliers</h4>
                                    <li><Link to="/1supplier">Add New Supplier</Link></li>
                                    <li><Link to="/1supplierUpdate">Update Supplier Details</Link></li>
                                </ul>                                
                            </td>
                        </tr>
                        {gg ? 
                        <tr>
                            <td>
                                <ul>
                                    
                                    <h4>Admin Panel</h4>
                                    <li><Link to="/1projects">New Project</Link></li>                                    
                                    <li><Link to="/1newuser">New User</Link></li>
                               </ul>                                
                            </td>
                        </tr>
                        : <p> </p> }
                    </tbody>
                </Table>
                <BackFooter />
            </div>
        )
    } else {
        return (
            <NotFound />
        )
    }
}

export default Menu;