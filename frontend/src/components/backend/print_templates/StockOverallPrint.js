import axios from 'axios';
import React, { useState, useEffect } from 'react';
import jwt_decode from 'jwt-decode';
import { baseUrl } from './../../../constants/Constants';


const StockOverallPrint = (props) => {
    // const baseUrl = 'http://localhost:8000/';

    const [stock, setStock] = useState([{
        mat_id: "",
        mat_name: "",
        quantity: "",
        recieved: "",
        unit: "",
    }]);
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
                    axios.get(baseUrl.concat("stock/?project_id=" + id))
                        .then(response => {
                            setStock(response.data)

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
    }, [props.match.params])



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
                            <td className="col-sm-12 border-top border-bottom border-dark"><b>STOCK STATEMENT - OVERALL </b></td>
                        </tr>
                        <tr className="row print-center">
                            <td className="col-sm-12 border-top border-bottom border-dark"><b>{project.project_name}</b></td>
                        </tr>

                        <b>
                            <tr className="row">
                                <td className="col-sm-1 border border-dark">Sr. No.</td>
                                <td className="col-sm-1 border border-dark">Item ID</td>
                                <td className="col-sm-4 border border-dark">Item Description</td>
                                <td className="col-sm-2 border border-dark">Cumulative recieved</td>
                                <td className="col-sm-2 border border-dark">Available</td>
                                <td className="col-sm-2 border border-dark">Unit</td>
                            </tr>
                        </b>
                        {stock.map((r, index) => (
                            <tr className="row" key="index">
                                <td className="col-sm-1 border border-dark">{index + 1}</td>
                                <td className="col-sm-1 border border-dark">{r.mat_id}<br /></td>
                                <td className="col-sm-4 border border-dark">{r.mat_name}</td>
                                <td className="col-sm-2 border border-dark">{r.recieved}</td>
                                <td className="col-sm-2 border border-dark">{r.quantity}</td>
                                <td className="col-sm-2 border border-dark">{r.unit}</td>
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

export default StockOverallPrint;