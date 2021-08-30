import React , { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Table } from 'react-bootstrap';
import NotFound from './../NotFound';
import BackFooter from './BackFooter';
import axios from 'axios';
import jwt_decode from "jwt-decode";
import { Spin } from 'antd'


function Menu() {

    const baseUrl = 'http://localhost:8000/';

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
                    console.log(error.response.status)
                    if (error.response.status === 401) {
                        localStorage.removeItem('token')
                        setloggedin(false);
                    }
                })
    
        } else {
            delete axios.defaults.headers.common["Authorization"];
            setloggedin(false);
        }
    
        setTimeout(() => {
            
            return 0;
        }, 50);
    }, [])

    if (l&& r) {
        return (
            <div>
                <br /><br /><br /><br />
                <h4 className="page-title">MAIN MENU</h4>
                <Table className="table">
                    <tbody>
                        <tr>
                            <td>
                                <ul className="menu-list">
                                    <h5 className="menu-title">Purchase Requisitions</h5>
                                    <li className="menu-item"><p><Link className="menu-item-a" to="/1req">New Purchase Requisition</Link></p></li>
                                    <li className="menu-item"><p><Link className="menu-item-a" to="/1viewreq">View Purchase Requisition</Link></p></li>
                                    {/* {adm ? <li className="menu-item"><p><Link className="menu-item-a" to="/1master">Approve Purchase requisitions</Link></p></li> : wp ? <li className="menu-item"><p><Link className="menu-item-a" to="/1reqsite">Approve Purchase requisitions</Link></p></li> : <p></p> } */}
                                    {adm ? <li className="menu-item"><p><Link className="menu-item-a" to="/1master">Approve Purchase requisitions</Link></p></li> : <p></p> }
                                </ul>                                
                            </td>
                        </tr>
                        { (adm || po ) ? 
                        <tr>
                            <td>
                                <ul className="menu-list">
                                    <h5 className="menu-title">Purchase Orders</h5>
                                    <li className="menu-item"><p><Link className="menu-item-a" to="/1po">New Purchase Order</Link></p></li>
                                    <li className="menu-item"><p><Link className="menu-item-a" to="/1viewpo">View Purchase Orders</Link></p></li>
                                </ul>                                
                            </td>
                        </tr>
                        : <p></p> }

                        <tr>
                            <td>
                                <ul className="menu-list">
                                    <h5 className="menu-title">Goods Recipt Note</h5>
                                    <li className="menu-item"><p><Link className="menu-item-a" to="/1grn">New GRN</Link></p></li>
                                    <li className="menu-item"><p><Link className="menu-item-a" to="/1viewgrn">View GRN</Link></p></li>
                                </ul>                                
                            </td>
                        </tr>
                        <tr>
                            <td>
                                <ul className="menu-list">
                                    <h5 className="menu-title">Avaialble Stock details</h5>
                                    <li className="menu-item"><p><Link className="menu-item-a" to="/1stock">View Stock</Link></p></li>

                                </ul>                                
                            </td>
                        </tr>
                        <tr>
                            <td>
                                <ul className="menu-list">
                                    <h5 className="menu-title">Material Issue and Transfer</h5>
                                    <li className="menu-item"><p><Link className="menu-item-a" to="/1issue">New Issue Slip</Link></p></li>
                                    <li className="menu-item"><p><Link className="menu-item-a" to="/1delivery">Site-to-site Material Transfer</Link></p></li>
                                </ul>                                
                            </td>
                        </tr>
                        {/* <tr>
                            <td>
                                <ul className="menu-list">
                                    <h5 className="menu-title">Material Master</h5>
                                    <li className="menu-item"><p><Link className="menu-item-a" to="/1material">Add New Material</Link></p></li>
                                </ul>                                
                            </td>
                        </tr> */}
                        { (adm || po ) ? 
                        <tr>
                            <td>
                                <ul className="menu-list">
                                    <h5 className="menu-title">Suppliers</h5>
                                    <li className="menu-item"><p><Link className="menu-item-a" to="/1supplier">Add New Supplier</Link></p></li>
                                    <li className="menu-item"><p><Link className="menu-item-a" to="/1supplierUpdate">Update Supplier Details</Link></p></li>
                                    <li className="menu-item"><p><Link className="menu-item-a" to="/1viewsupplier">View Supplier Details</Link></p></li>
                                </ul>                                
                            </td>
                        </tr>
                        : <p></p> }
                        {adm ? 
                        <tr>
                            <td>
                                <ul className="menu-list">                                   
                                    <h5 className="menu-title">Admin Panel</h5>
                                    <li className="menu-item"><p><Link className="menu-item-a" to="/1projects">New Project</Link></p></li>                                    
                                    <li className="menu-item"><p><Link className="menu-item-a" to="/1newuser">New User</Link></p></li>
                                    <li className="menu-item"><p><Link className="menu-item-a" to="/1projectData">Update Requisition Limit</Link></p></li>
                               </ul>                                
                            </td>
                        </tr>
                        : <p> </p> }
                    </tbody>
                </Table>
                <BackFooter />
            </div>
        )
    } 
    else if(!r) {
      return (
        <div className="print-center">
            <br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br />
            <Spin tip="Loading..." />
        </div>
    )
  
    }else {
        return (
            <NotFound />
        )
    }
}

export default Menu;