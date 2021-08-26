import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Input, Select, Button , Spin } from 'antd';
import BackFooter from './BackFooter';
import NotFound from '../NotFound';
import jwt_decode from "jwt-decode";

function Supplier() {
    const baseUrl = 'http://localhost:8000/';

    const [query, setQuery] = useState({
        supp_name : "",
        supp_address : "",
        contact_person : "",
        contact : "",
        state : "",
        gst : "",
    });

    const ind_states = [ { "key": "AN", "name": "Andaman and Nicobar Islands" }, { "key": "AP", "name": "Andhra Pradesh" }, { "key": "AR", "name": "Arunachal Pradesh" }, { "key": "AS", "name": "Assam" }, { "key": "BR", "name": "Bihar" }, { "key": "CG", "name": "Chandigarh" }, { "key": "CH", "name": "Chhattisgarh" }, { "key": "DH", "name": "Dadra and Nagar Haveli" }, { "key": "DD", "name": "Daman and Diu" }, { "key": "DL", "name": "Delhi" }, { "key": "GA", "name": "Goa" }, { "key": "GJ", "name": "Gujarat" }, { "key": "HR", "name": "Haryana" }, { "key": "HP", "name": "Himachal Pradesh" }, { "key": "JK", "name": "Jammu and Kashmir" }, { "key": "JH", "name": "Jharkhand" }, { "key": "KA", "name": "Karnataka" }, { "key": "KL", "name": "Kerala" }, { "key": "LD", "name": "Lakshadweep" }, { "key": "MP", "name": "Madhya Pradesh" }, { "key": "MH", "name": "Maharashtra" }, { "key": "MN", "name": "Manipur" }, { "key": "ML", "name": "Meghalaya" }, { "key": "MZ", "name": "Mizoram" }, { "key": "NL", "name": "Nagaland" }, { "key": "OR", "name": "Odisha" }, { "key": "PY", "name": "Puducherry" }, { "key": "PB", "name": "Punjab" }, { "key": "RJ", "name": "Rajasthan" }, { "key": "SK", "name": "Sikkim" }, { "key": "TN", "name": "Tamil Nadu" }, { "key": "TS", "name": "Telangana" }, { "key": "TR", "name": "Tripura" }, { "key": "UK", "name": "Uttar Pradesh" }, { "key": "UP", "name": "Uttarakhand" }, { "key": "WB", "name": "West Bengal" } ]
    const [l, setloggedin] = useState(true);
    const [r, setR] = useState(false);

    useEffect(() => {
        if (localStorage.getItem("token")) {
            axios.defaults.headers.common["Authorization"] = `JWT ${localStorage.getItem('token')}`;


            axios.get(baseUrl.concat("userdata/?user=" + jwt_decode(localStorage.getItem("token")).user_id))
                .then(res => {
                    
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
            setR(true);
            return 0;
        }, 50);
    }, [])



    // --------------------------------------------------------------------
    // Handling Form changes

    const onSearchState = (value) => {
        setQuery({ ...query, state: value });
    }

    const formChangeHandler = (e) => {
        setQuery({ ...query, [e.target.name]: e.target.value })
        console.log(query);
    }


    // --------------------------------------------------------------------
    // Submission

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log(query);

        axios.post(baseUrl.concat("supplier/"), query)
        .then( res => {
            console.log(res);
        })
        .catch( error => {
            if (error.response.status === 401) {
                localStorage.removeItem('token')
                setloggedin(false);
            }
        })

        setQuery ({
            supp_name : "",
            supp_address : "",
            contact_person : "",
            contact : "",
            state : "",
            gst : "",
        })

        
    }



    // --------------------------------------------------------------------
    // Print Api

    // const handlePrint = () => {
    //     console.log("Printing....")
    // }

    // --------------------------------------------------------------------
    // Extras

    // const refreshHandler = () => {
    //     window.location.reload();
    // }


    // --------------------------------------------------------------------
    // Antd

    const { Option } = Select;
    const { TextArea } = Input;

    // --------------------------------------------------------------------
    // html

    if (l && r) {
        return (
            <div>
                <br /><br /><br /><br /><br /><br /><br />
                <span>
                    <h4>Supplier Name &nbsp;&nbsp;&nbsp;&nbsp;
                    <Input placeholder="Supplier Name" name="supp_name" value={query.supp_name} onChange={formChangeHandler} style={{ width: 300 }} />
                    </h4>
                </span>
                <span>
                    <h4>Address &nbsp;&nbsp;&nbsp;&nbsp;
                    <TextArea rows={2} placeholder="Address" name="supp_address" value={query.supp_address} onChange={formChangeHandler} style={{ width: 300 }} />
                    </h4>
                </span>
                <span>
                    <h4>Contact Person &nbsp;&nbsp;&nbsp;&nbsp;
                    <Input placeholder="HSN ID" name="contact_person" value={query.contact_person} onChange={formChangeHandler} style={{ width: 300 }} />
                    </h4>
                </span>
                <span>
                    <h4>Contact No. &nbsp;&nbsp;&nbsp;&nbsp;
                    <Input placeholder="Contact Number" name="contact" value={query.contact} onChange={formChangeHandler} style={{ width: 300 }} type="number" />
                    </h4>
                </span>
                <span>
                    <h4>State &nbsp;&nbsp;&nbsp;&nbsp;
                        <Select placeholder="Select State" style={{ width: 300 }} onChange={onSearchState}>
                            {ind_states.map((state, index) => (
                                <Option value={state.name}>{state.name}</Option>
                            ))}
                        </Select>
                    </h4>
                </span>
                <span>
                    <h4>GST No. &nbsp;&nbsp;&nbsp;&nbsp;
                    <Input placeholder="GST Number" name="gst" value={query.gst} onChange={formChangeHandler} style={{ width: 300 }} />
                    </h4>
                </span>

                <br /><br />
                <Button type="submit" onClick={handleSubmit} > Submit </Button>
                <br /><br /><br /><br /><br /><br /><br />
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
  
    }
    else {
        return (
            <NotFound />
        )
    }
}

export default Supplier;