import axios from 'axios';
import React, { useState, useEffect } from 'react';
import MenuBar from './MenuBar';
import jwt_decode from 'jwt-decode';



const RequisitionPrint = (props) => {
    const baseUrl = 'http://localhost:8000/';

    const [req, setReq] = useState({
        created_date_time: "----------",
    });
    const [rows, setRows] = useState([]); //rows of req
    const [project, setProject] = useState({
        project_name: "",
        made_by: "",
    });


    useEffect(() => {
        if (localStorage.getItem("token")) {
            axios.defaults.headers.common["Authorization"] = `JWT ${localStorage.getItem('token')}`;
            axios.get(baseUrl.concat("userdata/?user=" + jwt_decode(localStorage.getItem("token")).user_id))
                .then(res => {
                    var id = props.match.params.id.substring(1);
                    axios.get(baseUrl.concat("requisition/" + id))
                        .then(res => {
                            setReq(res.data)
                            setRows(res.data.initialItemRow)
                            
                            axios.get(baseUrl.concat("projects/" + res.data.project_id))
                            .then( res => {
                                setProject(res.data);
                                window.print()
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
    return (
        <div className="App-print-center">

            <div>
                <div className="highest-z ">
                    <header id="header" className="fixed-top row">
                        <div className="col-md-4 print-left">
                            <p>Project : {project.project_name}</p>
                        </div>
                        <div className="col-md-4">
                            <h1 className="logoPrint "><img src="assets/img/final_logo_PNG.png" alt="pctppl_logo"></img></h1>
                        </div>
                        <div className="col-md-4">
                            <p>Date : {req.created_date_time.substring(8, 10)}-{req.created_date_time.substring(5, 7)}-{req.created_date_time.substring(0, 4)}</p>
                        </div>
                    </header>
                </div>
                <br /><br /><br /><br />
            </div>

            <b><u>MATERIAL REQUISITION / PURCHASE FORM</u></b>
            <div className="print-left">
                <p>To,<br /><b>Store Department / Puchase Department</b><br />Please issue the following materials as per details at the earliest.</p>
            </div>
            <table id="divcontents" className="table table-bordered">
                <thead>
                    <tr>
                        <th>Material ID</th>
                        <th>Material Name</th>
                        <th>Quantity</th>
                        <th>Unit</th>
                        <th>Description</th>
                        <th>Required by</th>
                    </tr>
                </thead>
                <tbody>
                    {rows.map((r, index) => (
                        <tr key={index}>
                            <td>{r.mat_id}</td>
                            <td>{r.mat_name}</td>
                            <td>{r.quantity}</td>
                            <td>{r.unit}</td>
                            <td>{r.description}</td>
                            <td>{r.required_date.substring(8, 10)}-{r.required_date.substring(5, 7)}-{r.required_date.substring(0, 4)}</td>
                        </tr>
                    ))}
                </tbody>

            </table>
            <br /><br /><br /><br /><br />
            <div className="row">
                <p className="col-md-1"></p>
                <p className="col-md-3">Prepared By<br />{req.made_by}</p>
                <p className="col-md-4"></p>
                <span className="col-md-3">
                    {(req.isapproved_master === "Y") ? <p>Approved</p> : <p>Approval Pending</p>}
                    </span>
                <p className="col-md-1"></p>
            </div>

            {/* <button onClick={handlePrint} >Print</button> */}
        </div>
    )
}

export default RequisitionPrint;