import axios from 'axios';
import React, { useState, useEffect } from 'react';
import jwt_decode from 'jwt-decode';


const StockIndividualPrint = (props) => {
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

    const [project, setProject] = useState({
        project_name: "0",
    });
    const [complete, setComplete] = useState(false);

    useEffect(() => {
        if (localStorage.getItem("token")) {
            axios.defaults.headers.common["Authorization"] = `JWT ${localStorage.getItem('token')}`;
            axios.get(baseUrl.concat("userdata/?user=" + jwt_decode(localStorage.getItem("token")).user_id))
                .then(res => {
                    var id = props.match.params.id.substring(1);
                    var mat = id.substring(id.indexOf('-')+1)
                    id = id.substring(0, id.indexOf('-'))

                    axios.get(baseUrl.concat("grn/?project_id=" + id + "&initialItemRow__mat_id=" + mat))
                        .then(response => {
                            setgrn(response.data)
                            axios.get(baseUrl.concat("projects/" + id + "/"))
                                .then(res1 => {
                                    setProject(res1.data);                                    
                                })
                                .then(() => {
                                    setComplete(true);
                                    window.print();
                                })  
                        })
                        .catch(error => {
                            console.log(error.response.status)
                            if (error.response.status === 401) {
                                localStorage.removeItem('token')
                            }
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
                            <td className="col-sm-12 border-top border-bottom border-dark"><b>STOCK STATEMENT - {grn[0].initialItemRow[0].mat_name} </b></td>
                        </tr>
                        <tr className="row print-center">
                            <td className="col-sm-12 border-top border-bottom border-dark"><b>{project.project_name}</b></td>
                        </tr>
                        <br />
                        <tr className="row ">
                            <td className="col-sm-12 "><b>Material Name :</b> &nbsp; {grn[0].initialItemRow[0].mat_name}</td>
                        </tr>
                        <br />
                        <b>
                            <tr className="row">
                                <td className="col-sm-1 border border-dark">Sr. No.</td>
                                <td className="col-sm-2 border border-dark">GRN No.</td>
                                <td className="col-sm-2 border border-dark">Recieved Date &#38; Time</td>
                                <td className="col-sm-2 border border-dark">PO Quantity</td>
                                <td className="col-sm-2 border border-dark">Quantity Recieved</td>
                                <td className="col-sm-2 border border-dark">Quantity Accepted</td>
                                <td className="col-sm-1 border border-dark">Unit</td>
                            </tr>
                        </b>

                        {grn.map((r, index) => (
                            <tr className="row" key="index">
                                <td className="col-sm-1 border border-dark">{index + 1}</td>
                                <td className="col-sm-2 border border-dark">{r.grn_id}</td>
                                <td className="col-sm-2 border border-dark">{r.created_date_time.substring(8, 10)}-{r.created_date_time.substring(5, 7)}-{r.created_date_time.substring(0, 4)}&nbsp;&nbsp;&nbsp;{r.created_date_time.substring(11, 19)}<br /></td>
                                <td className="col-sm-2 border border-dark">{parseFloat(r.initialItemRow[0].quantity).toFixed(2)}</td>
                                <td className="col-sm-2 border border-dark">{parseFloat(r.initialItemRow[0].rec_quant).toFixed(2)}</td>
                                <td className="col-sm-2 border border-dark"><b>{parseFloat(r.initialItemRow[0].accepted).toFixed(2)}</b></td>
                                <td className="col-sm-1 border border-dark">{r.initialItemRow[0].unit}</td>
                            </tr>
                        ))}

                        <br /><br /><br />
                        <tr className="row">
                            <td className="col-sm-12 border-bottom border-dark"></td>
                        </tr>

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
                <div className="divFooter">{new Date(Date.now()).toLocaleDateString("en-IN")} :: {(new Date()).getHours() + ":" + (new Date()).getMinutes() + ":" + (new Date()).getSeconds()}</div>
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

export default StockIndividualPrint;