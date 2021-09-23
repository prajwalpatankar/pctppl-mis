import axios from 'axios';
import React, { useState, useEffect } from 'react';
import jwt_decode from 'jwt-decode';
import { Empty } from 'antd';


const StockIndividualPrint = (props) => {
    const baseUrl = 'http://localhost:8000/';

    const [grn, setgrn] = useState([]);
    const [grnInner, setgrnInner] = useState([]);
    const [transfers, setTransfers] = useState([]);
    const [transfersInner, setTransfersInner] = useState([]);
    const [stock, setStock] = useState([{
        quantity: "",
        recieved: "",
        unit: "",
    }]);


    const [project, setProject] = useState({
        project_name: "0",
    });
    const [projectsAll, setProjectsAll] = useState();

    const [complete, setComplete] = useState(false);

    useEffect(() => {
        if (localStorage.getItem("token")) {
            axios.defaults.headers.common["Authorization"] = `JWT ${localStorage.getItem('token')}`;
            axios.get(baseUrl.concat("userdata/?user=" + jwt_decode(localStorage.getItem("token")).user_id))
                .then(res => {
                    var url = props.match.params.id.substring(1);
                    console.log("url: ", url)
                    var id = url.substring(0, url.indexOf('-'))
                    console.log("id: ", id)
                    var mat = url.substring(url.indexOf('-') + 1, url.indexOf('&') )
                    console.log("mat: ", mat)
                    var from_date = url.substring(url.indexOf('&') + 1, url.indexOf('$') )
                    from_date = from_date.substring(0,10);
                    console.log(from_date);
                    var to_date = url.substring(url.indexOf('$') + 1)
                    to_date = to_date.substring(0,10);
                    console.log(to_date);

                    axios.get(baseUrl.concat("projects"))
                        .then(resProj => {
                            setProjectsAll(resProj.data);
                        })
                        .then(() => {                             
                            axios.get(baseUrl.concat("grn/?created_date_time_after=" + from_date + "&created_date_time_before=" + to_date + "&project_id=" + id + "&initialItemRow__mat_id=" + mat ))
                                .then(response => {
                                    console.log("GRN : ", response.data)
                                    let flattenedGRN = flatten(response.data, mat);
                                    flattenedGRN.sort(function (a, b) {
                                        return b.id - a.id;
                                    });
                                    response.data.sort(function (a, b) {
                                        return b.id - a.id;
                                    });

                                    setgrnInner(flattenedGRN);
                                    setgrn(response.data)

                                    axios.get(baseUrl.concat("projects/" + id + "/"))
                                        .then(res1 => {
                                            setProject(res1.data);

                                            axios.get(baseUrl.concat("sitetransfer/?created_date_time_after=" + from_date + "&created_date_time_before=" + to_date + "&to_project=" + id + "&initialItemRow__mat_id=" + mat))
                                                .then(resST => {
                                                    console.log("Transfers : ", resST.data)
                                                    let flattened = flatten(resST.data, mat);
                                                    resST.data.sort(function (a, b) {
                                                        return b.id - a.id;
                                                    });
                                                    setTransfers(resST.data);
                                                    setTransfersInner(flattened);
                                                    if (response.data.length !== 0) {
                                                        document.title = "Stock Staement - " + response.data[0].initialItemRow[0].mat_name + " -- " + response.data[0].created_date_time.substring(8, 10) + "-" + response.data[0].created_date_time.substring(5, 7) + "-" + response.data[0].created_date_time.substring(0, 4)
                                                    } else if (resST.data.length !== 0) {
                                                        document.title = "Stock Staement - " + flattened[0].mat_name + " -- " + resST.data[0].created_date_time.substring(8, 10) + "-" + resST.data[0].created_date_time.substring(5, 7) + "-" + resST.data[0].created_date_time.substring(0, 4)
                                                    }
                                                    axios.get(baseUrl.concat("stock/?mat_id=" + mat + "&project_id=" + id))
                                                        .then((resStock) => {
                                                            console.log("stock Det ", resStock.data)
                                                            setStock(resStock.data);
                                                        })
                                                        .then(() => {
                                                            setTimeout(() => {
                                                                setComplete(true);
                                                                window.print();
                                                                return 0;
                                                            }, 50);

                                                        })
                                                })

                                        })


                                })
                                .catch(error => {
                                    console.log(error.response.status)
                                    if (error.response.status === 401) {
                                        localStorage.removeItem('token')
                                    }
                                })
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

    const flatten = (ary, mat_id) => {
        var ret = [];
        for (var i = 0; i < ary.length; i++) {
            for (var j = 0; j < ary[i].initialItemRow.length; j++) {
                if (ary[i].initialItemRow[j].mat_id === mat_id) {
                    ret.push(ary[i].initialItemRow[j]);
                    continue;
                }
            }
        }
        return ret;
    }


    const ProjectFinder = (r) => {
        return ((projectsAll.find(p => p.id === r.from_project)).project_name)
    }

    // --------------------------------------------------------------------
    // html
    if (complete) {
        if (grn.length !== 0 || transfers.length !== 0) {
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
                            {grn.length !== 0 ?
                                <tr className="row print-center">
                                    <td className="col-sm-12 border-top border-bottom border-dark"><b>STOCK STATEMENT - {grn[0].initialItemRow[0].mat_name} </b></td>
                                </tr>
                                :
                                <tr className="row print-center">
                                    <td className="col-sm-12 border-top border-bottom border-dark"><b>STOCK STATEMENT - {transfers[0].initialItemRow[0].mat_name} </b></td>
                                </tr>
                            }

                            <tr className="row print-center">
                                <td className="col-sm-12 border-top border-bottom border-dark"><b>{project.project_name}</b></td>
                            </tr>
                            <br />

                            {grn.length !== 0 ?
                                <tr className="row ">
                                    <td className="col-sm-12 "><b>Material Name :</b> &nbsp; {grnInner[0].mat_name}</td>
                                </tr>
                                :
                                <tr className="row ">
                                    <td className="col-sm-12 "><b>Material Name :</b> &nbsp; {transfersInner[0].mat_name}</td>
                                </tr>
                            }
                            <br />

                            {grn.length !== 0 ?
                                <div className="print-center">
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
                                            <td className="col-sm-2 border border-dark">{parseFloat(grnInner[index].quantity).toFixed(2)}</td>
                                            <td className="col-sm-2 border border-dark">{parseFloat(grnInner[index].rec_quant).toFixed(2)}</td>
                                            <td className="col-sm-2 border border-dark"><b>{parseFloat(grnInner[index].accepted).toFixed(2)}</b></td>
                                            <td className="col-sm-1 border border-dark">{r.initialItemRow[0].unit}</td>
                                        </tr>
                                    ))}
                                </div>
                                :

                                <div />
                            }
                            <br /><br /><br />
                            {transfers.length !== 0 ?
                                <div className="print-center">
                                    <b>
                                        <tr className="row">
                                            <td className="col-sm-1 border border-dark">Sr. No.</td>
                                            <td className="col-sm-4 border border-dark">Recieved From Site</td>
                                            <td className="col-sm-4 border border-dark">Recieved Date &#38; Time</td>
                                            <td className="col-sm-2 border border-dark">Quantity</td>
                                            <td className="col-sm-1 border border-dark">Unit</td>
                                        </tr>
                                    </b>

                                    {transfers.map((r, index) => (
                                        <tr className="row" key="index">
                                            <td className="col-sm-1 border border-dark">{index + 1}</td>
                                            <td className="col-sm-4 border border-dark">{ProjectFinder(r)}</td>
                                            <td className="col-sm-4 border border-dark">{r.created_date_time.substring(8, 10)}-{r.created_date_time.substring(5, 7)}-{r.created_date_time.substring(0, 4)}&nbsp;&nbsp;&nbsp;{r.created_date_time.substring(11, 19)}<br /></td>
                                            <td className="col-sm-2 border border-dark"><b>{parseFloat(transfersInner[index].quantity).toFixed(2)}</b></td>
                                            <td className="col-sm-1 border border-dark">{r.initialItemRow[0].unit}</td>
                                        </tr>
                                    ))}
                                </div>
                                :
                                <div>


                                </div>
                            }

                            <br /><br /><br />
                            <tr className="row">
                                <td ><b>Total Quantity Recieved :</b> {stock[0].recieved} {stock[0].unit}</td>
                            </tr>
                            <tr className="row">
                                <td ><b>Total Quantity Available :</b> {stock[0].quantity} {stock[0].unit}</td>
                            </tr>
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
                    <br /><br /><br /><br /><br /><br />
                    <Empty />
                </div>
            )
        }
    }
    else {
        return (
            <div>
                <p>Loading ....</p>
            </div>
        )
    }

}

export default StockIndividualPrint;