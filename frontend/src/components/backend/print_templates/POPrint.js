import axios from 'axios';
import React, { useState, useEffect } from 'react';
import jwt_decode from 'jwt-decode';

const numWords = require('num-words');

const POPrint = (props) => {
    const baseUrl = 'http://localhost:8000/';

    const [po, setPo] = useState({
        created_date_time: "----------",
        contact_person: "",
        payment_terms: "",
        other_terms: "",
        delivery_schedule: "",
        transport: 0.00,
        other_charges: 0.00,
    });

    const [complete, setComplete] = useState(false);

    const [rows, setRows] = useState([]); //rows of po
    const [project, setProject] = useState({
        project_name: "",
        made_by: "",
    });

    const [supplier, setSupplier] = useState({
        supp_name: "--",
        supp_address: "",
    });

    const [hsn, setHsn] = useState([]);
    var amounts = [{ tax_rate: "", taxable_value: "", cgst: "", amount: "" }];
    const [billing, setBilling] = useState([]);

    const [finalAmount, setFinalAmount] = useState({
        total_value: 0.00,
        gross_value: 0.00,
        cgst: 0.00,
        taxable_value: 0.00,
    })

    var rate = {
        tax_rate: "",
    }

    useEffect(() => {
        if (localStorage.getItem("token")) {
            axios.defaults.headers.common["Authorization"] = `JWT ${localStorage.getItem('token')}`;
            axios.get(baseUrl.concat("userdata/?user=" + jwt_decode(localStorage.getItem("token")).user_id))
                .then(res => {
                    var id = props.match.params.id.substring(1);


                    axios.get(baseUrl.concat("hsn"))
                        .then(response => {
                            setHsn(response.data)

                            axios.get(baseUrl.concat("po/" + id))
                                .then(res => {
                                    setPo(res.data)
                                    setRows(res.data.initialItemRow)

                                    axios.get(baseUrl.concat("projects/" + res.data.project_id))
                                        .then(res1 => {
                                            setProject(res1.data);

                                            axios.get(baseUrl.concat("supplier/" + res.data.supp_id))
                                                .then(res2 => {
                                                    setSupplier(res2.data);
                                                    totalValue(res.data, response.data);
                                                })


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


    const totalValue = (purchase, taxes) => {
        let mats = purchase.initialItemRow;
        var sum = 0;        
        var taxable = 0;
        var gst = 0;
        for (var i = 0; i < mats.length; i++) {
            rate = taxes.find(({ hsn_id }) => hsn_id === mats[i].hsn_id);
            console.log(rate.tax_rate)
            amounts[i]["tax_rate"] = rate["tax_rate"];
            amounts[i]["taxable_value"] = ( parseFloat(mats[i].quantity) * parseFloat(mats[i].item_rate) ) - parseFloat(mats[i].discount)
            amounts[i]["cgst"] = amounts[i]["taxable_value"] *  amounts[i]["tax_rate"] * 0.5 / 100;
            amounts[i]["amount"] = amounts[i]["taxable_value"] + amounts[i]["cgst"] + amounts[i]["cgst"];
            taxable += amounts[i]["taxable_value"];
            gst += amounts[i]["cgst"];
            sum += amounts[i]["amount"];
            amounts = [...amounts, { tax_rate: "", taxable_value: "", cgst: "", amount: "" }]
        }
        setBilling(amounts);
        var gross = sum + parseFloat(purchase.transport) + parseFloat(purchase.other_charges);
        setFinalAmount({total_value: sum, gross_value: gross, cgst: gst, taxable_value: taxable});
        setComplete(true);
        setTimeout(() => {
            window.print();
        }, 300);
        
    }

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
                            <td className="col-sm-1"><b>Supplier</b></td>
                            <td className="col-sm-5">{supplier.supp_name}</td>
                            <td className="col-sm-1"><b>PO#</b></td>
                            <td className="col-sm-2">{po.po_id}</td>
                            <td className="col-sm-1"><b>Date :</b></td>
                            <td className="col-sm-2">{po.created_date_time.substring(8, 10)}-{po.created_date_time.substring(5, 7)}-{po.created_date_time.substring(0, 4)}</td>
                        </tr>
                        <tr className="row">
                            <td className="col-sm-6"> </td>
                            <td className="col-sm-1"><b>Project :</b></td>
                            <td className="col-sm-5">{project.project_name}</td>
                        </tr>

                        <tr className="row">
                            <td className="col-sm-1"><b>Address:</b></td>
                            <td className="col-sm-5">{supplier.supp_address}</td>
                            <td className="col-sm-1"><b>Delivery Address:</b></td>
                            <td className="col-sm-5">{project.location}</td>
                        </tr>
                        <tr className="row">
                            <td className="col-sm-1"><b>Contact :</b></td>
                            <td className="col-sm-5">{supplier.contact_person} - {supplier.contact}</td>
                            <td className="col-sm-1"><b>Contact :</b></td>
                            <td className="col-sm-5">{po.contact_person}</td>
                        </tr>
                        <tr className="row">
                            <td className="col-sm-6"> </td>
                            <td className="col-sm-1"><b>State :</b></td>
                            <td className="col-sm-2">Maharashtra</td>
                            <td className="col-sm-1"><b>GSTN :</b></td>
                            <td className="col-sm-2">27AALCP6418K1ZX</td>
                        </tr>
                        <tr className="row">
                            <td className="col-sm-1"><b>State :</b></td>
                            <td className="col-sm-2">{supplier.state}</td>
                            <td className="col-sm-1"><b>GSTN :</b></td>
                            <td className="col-sm-2">{supplier.gst}</td>
                            <td className="col-sm-1"><b>Billing Address:</b></td>
                            <td className="col-sm-5">S.No.75,Flat No 503,Wonder City,Katraj-Dehu Road Highway,Katraj,Pune-411046</td>
                        </tr>


                        <tr className="row">
                            <td className="col-sm-6"> </td>
                            <td className="col-sm-1"><b>State :</b></td>
                            <td className="col-sm-2">Maharashtra</td>
                            <td className="col-sm-1"><b>GSTN :</b></td>
                            <td className="col-sm-2">27AALCP6418K1ZX</td>
                        </tr>
                        <b>
                            <tr className="row">
                                <td className="col-sm-1 border border-dark">Item ID<br />HSN Code</td>
                                <td className="col-sm-3 border border-dark">Item Description</td>
                                <td className="col-sm-1 border border-dark">Unit</td>
                                <td className="col-sm-1 border border-dark">Quantity</td>
                                <td className="col-sm-1 border border-dark">Rate</td>
                                <td className="col-sm-1 border border-dark">Discount</td>
                                <td className="col-sm-1 border border-dark">Taxable Value</td>
                                <td className="col-sm-1 border border-dark">Tax Rate<br />Amounts<br />SGST<br />CGST</td>
                                <td className="col-sm-2 border border-dark">Amount</td>
                            </tr>
                        </b>
                        {rows.map((r, index) => (
                            <tr className="row" key="index">
                                <td className="col-sm-1 border border-dark">{r.mat_id}<br />{r.hsn_id}</td>
                                <td className="col-sm-3 border border-dark">{r.mat_name}</td>
                                <td className="col-sm-1 border border-dark">{r.unit}</td>
                                <td className="col-sm-1 border border-dark">{parseFloat(r.quantity).toFixed(2)}</td>
                                <td className="col-sm-1 border border-dark">{parseFloat(r.item_rate).toFixed(2)}</td>
                                <td className="col-sm-1 border border-dark">{parseFloat(r.discount).toFixed(2)}</td>
                                <td className="col-sm-1 border border-dark">{parseFloat(billing[index].taxable_value).toFixed(2)}</td>
                                <td className="col-sm-1 border border-dark">{billing[index].tax_rate}%<br />{parseFloat(billing[index].cgst).toFixed(2)}<br />{parseFloat(billing[index].cgst).toFixed(2)}</td>
                                <td className="col-sm-2 border border-dark">{parseFloat(billing[index].amount).toFixed(2)}</td>
                            </tr>
                        ))}
                        <b>
                            <tr className="row">
                                <td className="col-sm-8 border-left border-top border-dark"> </td>
                                <td className="col-sm-2 border border-dark">Total Value:</td>
                                <td className="col-sm-2 border border-dark">{ parseFloat(finalAmount.total_value).toFixed(2) }</td>
                            </tr>
                        </b>
                        <tr className="row">
                                <td className="col-sm-8 border-left border-top border-dark"> </td>
                                <td className="col-sm-2 border border-dark"><b>Total Taxable Value:<br />CGST<br />SGST</b><br />&nbsp;</td>
                                <td className="col-sm-2 border border-dark">{ parseFloat(finalAmount.taxable_value).toFixed(2) }<br />{ parseFloat(finalAmount.cgst).toFixed(2) }<br />{ parseFloat(finalAmount.cgst).toFixed(2) }<br />&nbsp;</td>
                        </tr>

                        <tr className="row">
                            <td className="col-sm-8 border-left border-dark"><b>Transport     :</b></td>
                            <td className="col-sm-2 border border-dark"> </td>
                            <td className="col-sm-2 border border-dark">{ parseFloat(po.transport).toFixed(2)}</td>
                        </tr>
                        <tr className="row">
                            <td className="col-sm-8 border-left border-bottom border-dark"><b>Other Charges :</b></td>
                            <td className="col-sm-2 border border-dark"> </td>
                            <td className="col-sm-2 border border-dark">{ parseFloat(po.other_charges).toFixed(2)}</td>
                        </tr>
                        <b>
                            <tr className="row">
                                <td className="col-sm-8 border border-dark">Total Add Ons</td>
                                <td className="col-sm-2 border border-dark"></td>
                                <td className="col-sm-2 border border-dark">{ (parseFloat(po.transport) + parseFloat(po.other_charges)).toFixed(2) }</td>
                            </tr>
                        </b>
                        <b>
                            <tr className="row">
                                <td className="col-sm-8 border border-dark">Rs. { numWords(parseInt(finalAmount.gross_value))} Only</td>
                                <td className="col-sm-2 border border-dark">Gross Value</td>
                                <td className="col-sm-2 border border-dark">{ parseFloat(finalAmount.gross_value).toFixed(2)}</td>
                            </tr>
                        </b>
                        <br />
                        <tr>
                            <td className="col-sm-12 "><b>Delivery Schedule  :</b>{po.delivery_schedule}</td>
                        </tr>
                        <tr>
                            <td className="col-sm-12"><b>Payment Terms :</b>{po.payment_terms}</td>
                        </tr>
                        <tr>
                            <td className="col-sm-12"><b>Other Terms &#38; Conditions :</b>{po.other_terms}</td>
                        </tr>
                        <br /><br /><br />
                        <tr className="row">
                                <td className="col-sm-3 border-bottom border-dark">{po.made_by}</td>
                                <td className="col-sm-3 border-bottom border-dark"></td>
                                <td className="col-sm-3 border-bottom border-dark"></td>
                                <td className="col-sm-3 border-bottom border-dark">{supplier.supp_name}</td>
                            </tr>
                        <b>
                            <tr className="row">
                                <td className="col-sm-3 border-top border-bottom border-dark">Prepared By</td>
                                <td className="col-sm-3 border-top border-bottom border-dark">Purchase (Authorised Sign.)</td>
                                <td className="col-sm-3 border-top border-bottom border-dark">Approved By</td>
                                <td className="col-sm-3 border-top border-bottom border-dark">Received &#38; Accepted By</td>
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
                <div className="divFooter">{po.created_date_time.substring(8, 10)}-{po.created_date_time.substring(5, 7)}-{po.created_date_time.substring(0, 4)}&nbsp;&nbsp;&nbsp;{po.created_date_time.substring(11,19)}</div>
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

export default POPrint;