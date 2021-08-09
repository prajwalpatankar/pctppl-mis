import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Input, Select, Button, } from 'antd';
import BackFooter from './BackFooter';
import NotFound from '../NotFound';
import jwt_decode from "jwt-decode";

function Material() {
    const baseUrl = 'http://localhost:8000/';

    const [query, setQuery] = useState({
        mat_id: "M9",
        cat_id: "",
        subcat_id: "",
        desc: "",
        unit: "",
        hsan_id: "",
    });

    const [loggedin, setloggedin] = useState(true);
    const [cat, setCat] = useState([]);
    const [subcat, setSubCat] = useState([]);

    useEffect(() => {
        if (localStorage.getItem("token")) {
            axios.defaults.headers.common["Authorization"] = `JWT ${localStorage.getItem('token')}`;


            axios.get(baseUrl.concat("userdata/?user=" + jwt_decode(localStorage.getItem("token")).user_id))
                .then(res => {
                    axios.get(baseUrl.concat("material-category"))
                        .then(res => {
                            setCat(res.data);
                        })
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



    // --------------------------------------------------------------------
    // Handling Form changes

    const onSearchCat = (value) => {
        axios.get(baseUrl.concat("material-sub-category/?search=" + value))
            .then(res => {
                setSubCat(res.data);
            })
        setQuery({ ...query, cat_id: value });
    }

    const onSearchSubCat = (value) => {
        setQuery({ ...query, subcat_id: value });
    }

    const formChangeHandler = (e) => {
        setQuery({ ...query, [e.target.name]: e.target.value })
    }


    // --------------------------------------------------------------------
    // Submission

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log(query);

        axios.post(baseUrl.concat("material-master/"), query)
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
            ...query,
            desc: "",
            unit: "",
            hsan_id: "",
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

    // --------------------------------------------------------------------
    // html

    if (loggedin) {
        return (
            <div>
                <br /><br /><br /><br /><br /><br /><br />
                <span>
                    <h4>Select Category &nbsp;&nbsp;&nbsp;&nbsp;
                    <Select placeholder="Select Category" style={{ width: 300 }} onChange={onSearchCat}>
                            {cat.map((category, index) => (
                                <Option value={category.cat_id}>{category.cat_name}</Option>
                            ))}
                        </Select>
                    </h4>
                </span>
                <span>
                    <h4>Select Sub Category &nbsp;&nbsp;&nbsp;&nbsp;
                    <Select placeholder="Select Sub Category" style={{ width: 300 }} onChange={onSearchSubCat}>
                            {subcat.map((category, index) => (
                                <Option value={category.subcat_id}>{category.subcat_name}</Option>
                            ))}
                        </Select>
                    </h4>
                </span>
                <span>
                    <h4>Enter Material Name &nbsp;&nbsp;&nbsp;&nbsp;
                    <Input placeholder="Material Name" name="desc" value={query.desc} onChange={formChangeHandler} style={{ width: 300 }} />
                    </h4>
                </span>
                <span>
                    <h4>Enter unit &nbsp;&nbsp;&nbsp;&nbsp;
                    <Input placeholder="Unit" name="unit" value={query.unit} onChange={formChangeHandler} style={{ width: 300 }} />
                    </h4>
                </span>
                <span>
                    <h4>Enter HSN ID &nbsp;&nbsp;&nbsp;&nbsp;
                    <Input placeholder="HSN ID" name="hsan_id" value={query.hsan_id} onChange={formChangeHandler} style={{ width: 300 }} type="number" />
                    </h4>
                </span>

                <br /><br />
                <Button type="submit" onClick={handleSubmit} > Submit </Button>
                <br /><br /><br /><br /><br /><br /><br />
                <BackFooter />
            </div>
        )
    }
    else {
        return (
            <NotFound />
        )

    }
}

export default Material;