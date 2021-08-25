import axios from 'axios';
import React, { useState, useEffect } from 'react';
import jwt_decode from 'jwt-decode';

const numWords = require('num-words');

const GRNPrint = (props) => {
    const baseUrl = 'http://localhost:8000/';

    const [grn, setgrn] = useState({
        grn_id: "",
        po_id: "",
        vehicle_no: "",
        challan_no: "",
        challan_date: "",
        supp_id: "",
        project_id: "",
    });

    const [complete, setComplete] = useState(false);

    const [rows, setRows] = useState([]); //rows of grn
    const [project, setProject] = useState({
        project_name: "",
        made_by: "",
    });

    const [supplier, setSupplier] = useState({
        supp_name: "",
        supp_address: "",
    });

    useEffect(() => {
        if (localStorage.getItem("token")) {
            axios.defaults.headers.common["Authorization"] = `JWT ${localStorage.getItem('token')}`;
            axios.get(baseUrl.concat("userdata/?user=" + jwt_decode(localStorage.getItem("token")).user_id))
                .then(res => {
                    var id = props.match.params.id.substring(1);




                    axios.get(baseUrl.concat("grn/" + id))
                        .then(res => {
                            setgrn(res.data)
                            setRows(res.data.initialItemRow)

                            axios.get(baseUrl.concat("projects/" + res.data.project_id))
                                .then(res1 => {
                                    setProject(res1.data);

                                    axios.get(baseUrl.concat("supplier/" + res.data.supp_id))
                                        .then(res => {
                                            setSupplier(res.data);
                                            setComplete(true);
                                            window.print()
                                        })


                                })

                        })
                        .catch(err => {
                            console.log(err);
                        })
                })
                .catch(error => {
                    if (error.response.status === 401) {
                        localStorage.removeItem('token')
                    }
                })
        }
        setTimeout(() => {
            return 0;
        }, 200);
    }, [])



    // --------------------------------------------------------------------
    // html
    if (complete) {
        return (
            <div className="print-left wrapper">
                <table className="container table table-borderless">
                    <thead>
                        <tr className="row print-center">
                            <th className="col-sm-4"> </th>
                            <th className="col-sm-4"><h1 className="logoPrint "><img src="assets/img/final_logo_PNG.png" alt="pctppl_logo"></img></h1></th>
                            <th className="col-sm-4"> </th>
                        </tr>
                        <tr className="row print-center">
                            <td className="col-sm-12"><h7><b>S.No.75,Flat No 503,Wonder City,Katraj-Dehu Road Highway,Katraj,Pune-411046</b></h7></td>
                        </tr>
                    </thead>
                    <tbody>
                        <tr className="row print-center">
                            <td className="col-sm-12 border-top border-bottom border-dark"><b>PURCHASE ORDER</b></td>
                        </tr>
                        <tr className="row print-center">
                            <td className="col-sm-12 border-top border-dark"> </td>
                        </tr>
                        <tr className="row">
                            <td className="col-sm-1"><b>Project :</b></td>
                            <td className="col-sm-5">{project.project_name}</td>
                            <td className="col-sm-1"><b>GRN ID :</b></td>
                            <td className="col-sm-2">{grn.grn_id}</td>
                            <td className="col-sm-1"><b>Date :</b></td>
                            <td className="col-sm-2">{grn.created_date_time.substring(8, 10)}-{grn.created_date_time.substring(5, 7)}-{grn.created_date_time.substring(0, 4)}</td>
                        </tr>

                        <tr className="row">
                            <td className="col-sm-1"><b>Supplier</b></td>
                            <td className="col-sm-5">{supplier.supp_name}</td>
                            <td className="col-sm-3"><b>Chln No.:</b> &nbsp;&nbsp;&nbsp;&nbsp; {grn.challan_no}</td>
                            <td className="col-sm-3"><b>Chln Date:</b> &nbsp;&nbsp; {grn.challan_date.substring(8, 10)}-{grn.challan_date.substring(5, 7)}-{grn.challan_date.substring(0, 4)}</td>
                        </tr>

                        <tr className="row">
                            <td className="col-sm-2"><b>Supplier GSTN :</b></td>
                            <td className="col-sm-1">{supplier.gst}</td>
                            <td className="col-sm-3"> </td>
                            <td className="col-sm-1"><b>Veh No. :</b></td>
                            <td className="col-sm-2">{grn.vehicle_no}</td>
                            <td className="col-sm-3"> </td>

                        </tr>
                        <br /><br /><br />

                        <b>
                            <tr className="row">
                                <td className="col-sm-1 border border-dark">Sr. No.</td>
                                <td className="col-sm-1 border border-dark">Item ID<br />HSN Code</td>
                                <td className="col-sm-3 border border-dark">Item Description</td>
                                <td className="col-sm-1 border border-dark">Unit</td>
                                <td className="col-sm-1 border border-dark">PO Quantity</td>
                                <td className="col-sm-1 border border-dark">Challan Quantity</td>
                                <td className="col-sm-1 border border-dark">Accepted Quantity</td>
                                <td className="col-sm-1 border border-dark">Rate</td>
                                <td className="col-sm-2 border border-dark">Remarks / Specifications</td>

                            </tr>
                        </b>
                        {rows.map((r, index) => (
                            <tr className="row" key="index">
                                <td className="col-sm-1 border border-dark">{index + 1}</td>
                                <td className="col-sm-1 border border-dark">{r.mat_id}<br />{r.hsn_id}</td>
                                <td className="col-sm-3 border border-dark">{r.mat_name}</td>
                                <td className="col-sm-1 border border-dark">{r.unit}</td>
                                <td className="col-sm-1 border border-dark">{parseFloat(r.quantity).toFixed(2)}</td>
                                <td className="col-sm-1 border border-dark">{parseFloat(r.rec_quant).toFixed(2)}</td>
                                <td className="col-sm-1 border border-dark">{parseFloat(r.accepted).toFixed(2)}</td>
                                <td className="col-sm-1 border border-dark">{parseFloat(r.item_rate).toFixed(2)}</td>
                                <td className="col-sm-2 border border-dark"></td>


                            </tr>
                        ))}

                        <br /><br /><br />
                        <tr className="row">
                                <td className="col-sm-1 border-bottom border-dark"></td>
                                <td className="col-sm-3 border-bottom border-dark">{grn.made_by}</td>
                                <td className="col-sm-8 border-bottom border-dark"></td>
                            </tr>
                        <b>
                            <tr className="row">
                                <td className="col-sm-1 border-top border-bottom border-dark"></td>
                                <td className="col-sm-3 border-top border-bottom border-dark">Prepared By</td>
                                <td className="col-sm-8 border-top border-bottom border-dark"></td>
                            </tr>
                        </b>


                        <tr className="row">
                            <td className="col-sm-9 border-top border-dark"> </td>
                            <td className="col-sm-3 border-top border-dark">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Subject to Pune Jurisdiction.</td>
                        </tr>
                        <tr className="row print-center">
                            <td className="col-sm-12"><b>Reg. Office : S.No.75,Flat No 503,Wonder City,Katraj-Dehu Road Highway,Katraj,Pune-411046 Pune Maharashtra (India) 411046</b></td>
                        </tr>
                        <tr className="row">
                            <td className="col-sm-12"><b># Kindly mention Purchase Order ID on all documents like Delivery Challan/ Invoice etc</b></td>
                        </tr>

                    </tbody>
                </table>
                <div className="divFooter">{grn.created_date_time.substring(8, 10)}-{grn.created_date_time.substring(5, 7)}-{grn.created_date_time.substring(0, 4)}&nbsp;&nbsp;&nbsp;{grn.created_date_time.substring(11, 19)}</div>
            </div>
        )
    } else {
        return (
            <div>
                <p>Loading ....</p>
            </div>
        )
    }

}

export default GRNPrint;