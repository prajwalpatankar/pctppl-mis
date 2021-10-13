import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Button, message, Input, Table, Space, Select, Spin } from 'antd';
import NotFound from './../../NotFound';
import { baseUrl } from './../../../constants/Constants';
import BackFooter from './../BackFooter';
import jwt_decode from "jwt-decode";

function DeliveryChallan() {

    // --------------------------------------------------------------------
    // Base Urls

    // const baseUrl = "http://localhost:8000/"

    // --------------------------------------------------------------------
    // states

    const [l, setloggedin] = useState(true);
    const [r, setR] = useState(false);


    const [projects, setProjects] = useState([]);

    const [inputFields, setInputField] = useState([
        {
            mat_id: "",
            mat_name: "----",
            quantity: "",
            unit: "---",
            zzmax: 0,
        },
    ]);

    const [query, setQuery] = useState({
        from_project: "",
        to_project: "",
        initialItemRow: [],
    });

    const [visibility, setVisibility] = useState(false);

    const [mats, setMats] = useState([]);
    const [matsOrig, setMatsOrig] = useState([]);
    const [usedMats, setUsedMats] = useState([]);
    const [searchValue, setSearchValue] = useState('');


    useEffect(() => {
        if (localStorage.getItem("token")) {
            axios.defaults.headers.common["Authorization"] = `JWT ${localStorage.getItem('token')}`;

            axios.get(baseUrl.concat("userdata/?user=" + jwt_decode(localStorage.getItem("token")).user_id))
                .then(res => {

                    if (res.data[0].role === "admin") {
                        axios.get(baseUrl.concat("projects"))
                            .then(res => {
                                setProjects(res.data);
                            })

                    } else if (res.data[0].role === "Project Manager") {
                        axios.get(baseUrl.concat("projects/?pm=" + jwt_decode(localStorage.getItem("token")).user_id))
                            .then(res => {
                                setProjects(res.data);
                            })
                    } else {
                        axios.get(baseUrl.concat("projects/?user=" + jwt_decode(localStorage.getItem("token")).user_id))
                            .then(res => {
                                setProjects(res.data);
                            })
                    }
                })
                .catch(error => {
                    console.log(error.response.status)
                    if (error.response.status === 401) {
                        localStorage.removeItem('token')
                        setloggedin(false);
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
            setloggedin(false);
            delete axios.defaults.headers.common["Authorization"];
        }

        setTimeout(() => {
            setR(true);
            return 0;
        }, 50);
    }, [])

    const [searchstates, setSearch] = useState({
        mat: "",
        isSearchVisible: false,
        idx: "",
    })

    // --------------------------------------------------------------------
    // Columns for antd Table

    const columns1 = [
        {
            title: 'Material Name',
            dataIndex: 'mat_name',
            key: 'name',
        },
        {
            title: 'Quantity Available',
            dataIndex: 'quantity',
            key: 'quantity',
        },
        {
            title: 'Unit',
            dataIndex: 'unit',
            key: 'unit',
        },
        {
            title: 'Action',
            key: 'action',
            render: (text, record, index) => (
                <Space size="middle">
                    <Button onClick={() => { updatecol(record, index) }} type="button">Select</Button>
                </Space>
            ),
        },
    ];


    // --------------------------------------------------------------------
    // Dynamic Table ADD/DELETE

    const addHandler = () => {
        var len = inputFields.length;
        if ((len !== 0) && (inputFields[len - 1].mat_name === "----")) {
            message.error("Please update existing row before adding another row");
            return;
        }
        setInputField([...inputFields, {
            mat_id: "",
            mat_name: "----",
            quantity: "",
            unit: "---",
            zzmax: 0,
        }])
    }

    const deleteRowHandler = (index) => {
        const values = [...inputFields];
        if (values[index].mat_name !== "----") {
            const values_updated = [...usedMats];
            setMats([...mats, values_updated[index]]);
            setMatsOrig([...mats, values_updated[index]]);
            values_updated.splice(index, 1);
            setUsedMats(values_updated);
        }
        values.splice(index, 1);
        setInputField(values);
        setQuery({ ...query, initialItemRow: values });
        if (values.length === 0) {
            setSearch({ ...searchstates, isSearchVisible: false });
        }
    }

    // --------------------------------------------------------------------
    // Form change handlers

    const handleProjectChangeFrom = (value, index) => {
        setVisibility(true)
        axios.get(baseUrl.concat("stock/?project_id=" + value))
            .then(response => {
                console.log("mats : ", response.data)
                setMats(response.data)
                setMatsOrig(response.data)
            })
        setQuery({ ...query, from_project: value });
    }

    const handleProjectChangeTo = (value, index) => {
        setQuery({ ...query, to_project: value });
    }

    // const formChangeHandler = (event) => {  //for outer form
    //     setQuery({ ...query, [event.target.name]: event.target.value });
    // }

    const changeHandler = (index, event) => {   //inner form 
        const values = [...inputFields];
        values[index][event.target.name] = event.target.value;
        setInputField(values);
        setQuery({ ...query, initialItemRow: values })
    }

    // --------------------------------------------------------------------
    // Visibility handlers 

    const showMaterial = (index) => {
        if (visibility) {
            if (searchstates.isSearchVisible) {
                setSearch({ ...searchstates, isSearchVisible: false });
            } else {
                setSearch({ ...searchstates, isSearchVisible: true, idx: index });
            }
        } else {
            message.error("Please Select a Project")
        }

    }


    // --------------------------------------------------------------------
    // Update Rows 

    const updatecol = (record, indexrow) => {
        setUsedMats([...usedMats, record])
        const values = [...inputFields];
        const index = searchstates.idx;
        let currentValue = { ...inputFields[index] };
        values[index].mat_id = record.mat_id;
        values[index].mat_name = record.mat_name;
        // values[index].quantity = record.quantity;
        values[index].zzmax = record.quantity;
        values[index].unit = record.unit;
        setInputField(values);
        setQuery({ ...query, initialItemRow: values })
        setSearch({ ...searchstates, isSearchVisible: false })
        var temp_limit = [...mats];
        temp_limit.splice(indexrow, 1);
        if (currentValue.mat_name !== "----") {
            temp_limit.push({
                mat_id: currentValue.mat_id,
                mat_name: currentValue.mat_name,
                quantity: currentValue.zzmax,
                unit: currentValue.unit,
            });
        }
        setMats(temp_limit);
        setMatsOrig(temp_limit)
        window.scrollTo({
            top: 0,
            left: 0,
            behavior: 'smooth'
        });
    }


    // --------------------------------------------------------------------
    // Validations before Submission

    const blurHandler = (entered, max) => {
        if (entered <= 0 || entered > max) {
            message.error("Please check quantity again !")
        }

    }

    // --------------------------------------------------------------------
    // Submission

    const handleSubmitStockUpdates = (updateQuery, to_proj, from_proj) => {
        var current = updateQuery.quantity;
        var mat = updateQuery.mat_id;
        var matid = updateQuery.mat_id;

        // Addition
        axios.get(baseUrl.concat("stock/?project_id=" + to_proj + "&mat_id=" + mat))
            .then(response => {
                console.log("ADD RES =>", response.data)
                if (response.data.length === 0) {
                    axios.post(baseUrl.concat("stock/"), {
                        project_id: to_proj,
                        recieved: current,
                        quantity: current,
                        mat_id: matid,
                        mat_name: updateQuery.mat_name,
                        unit: updateQuery.unit
                    })
                        .then(res => {
                            console.log(res)
                        })
                        .catch(err => {
                            console.log("error here")
                            console.log(err)
                        })
                } else {
                    let update = response.data[0];
                    update.recieved = parseFloat(update.recieved) + parseFloat(current);
                    update.quantity = parseFloat(update.quantity) + parseFloat(current);
                    var id = response.data[0].id
                    axios.patch(baseUrl.concat("stock/" + id + "/"), update)
                        .catch(error => {
                            console.log(error)
                        })
                }
            })
            .then(res => {

                // Subtraction
                axios.get(baseUrl.concat("stock/?project_id=" + from_proj + "&mat_id=" + mat))
                    .then(response1 => {
                        let update1 = response1.data[0];
                        update1.quantity = parseFloat(update1.quantity) - parseFloat(current);
                        axios.patch(baseUrl.concat("stock/" + update1.id + "/"), update1)
                            .catch(error => {
                                console.log(error)
                            })
                    })
                    .catch(error => {
                        console.log(error)
                    })
            })

            .catch(error => {
                console.log(error)
            })
    }

    const submitHandler = (e) => {
        e.preventDefault();
        console.log(query)

        if (query.to_project === query.from_project) {
            message.error("Invalid Project !")
        }


        axios.post(baseUrl.concat("sitetransfer/"), query)
            .then(response => {

                message.open({
                    type: 'success',
                    content: <p>Delivery Challan made successfully</p>,
                    duration: 10,
                });

                // updating stock

                let limit = query.initialItemRow.length
                var to_proj = query.to_project;
                var from_proj = query.from_project;
                for (var i = 0; i < limit; i++) {
                    handleSubmitStockUpdates(query.initialItemRow[i], to_proj, from_proj)
                    // var current = query.initialItemRow[i].quantity;
                    // var mat = query.initialItemRow[i].mat_id;
                    // var matid = query.initialItemRow[i].mat_id;
                    // var matname = query.initialItemRow[i].mat_name;
                    // var matunit = query.initialItemRow[i].unit;

                    // // Addition
                    // axios.get(baseUrl.concat("stock/?project_id=" + to_proj + "&mat_id=" + mat))
                    //     .then(response => {
                    //         if (response.data.length === 0) {
                    //             axios.post(baseUrl.concat("stock/"), {
                    //                 project_id: to_proj,
                    //                 recieved: current,
                    //                 quantity: current,
                    //                 mat_id: matid,
                    //                 mat_name: matname,
                    //                 unit: matunit,
                    //             })
                    //                 .catch(err => {
                    //                     console.log(err)
                    //                 })
                    //         } else {
                    //             let update = response.data[0];
                    //             update.recieved = parseFloat(update.recieved) + parseFloat(current);
                    //             update.quantity = parseFloat(update.quantity) + parseFloat(current);
                    //             var id = response.data[0].id
                    //             axios.patch(baseUrl.concat("stock/" + id + "/"), update)
                    //                 .catch(error => {
                    //                     console.log(error)
                    //                 })
                    //         }
                    //     })
                    //     .then(res => {

                    //         // Subtraction
                    //         axios.get(baseUrl.concat("stock/?project_id=" + from_proj + "&mat_id=" + mat))
                    //             .then(response1 => {
                    //                 let update1 = response1.data[0];
                    //                 update1.quantity = parseFloat(update1.quantity) - parseFloat(current);
                    //                 axios.patch(baseUrl.concat("stock/" + update1.id + "/"), update1)
                    //                     .catch(error => {
                    //                         console.log(error)
                    //                     })
                    //             })
                    //             .catch(error => {
                    //                 console.log(error)
                    //             })
                    //     })

                    //     .catch(error => {
                    //         console.log(error)
                    //     })
                }

                // clearing fields
                setInputField([
                    {
                        mat_id: "",
                        mat_name: "----",
                        quantity: "",
                        unit: "---",
                        zzmax: 0
                    },
                ])

            })
            .then(() => {
                console.log("QUERY:", query)
                axios.get(baseUrl.concat("stock/?project_id=" + query.from_project))
                    .then(response => {
                        setMats(response.data)
                        setMatsOrig(response.data)
                        setQuery({
                            ...query,
                            initialItemRow: [],
                        })
                    })
            })
            .catch(error => {
                console.log(error.response.status)
                if (error.response.status === 401) {
                    localStorage.removeItem('token')
                    setloggedin(false);
                }
            })
    }

    // --------------------------------------------------------------------
    // Extras

    const refreshHandler = () => {
        window.location.reload();
    }


    // --------------------------------------------------------------------
    // Antd

    const { Option } = Select;

    // --------------------------------------------------------------------
    // html
    if (l && r) {
        return (
            <div>
                <br /><br /><br /><br />
                <h4 className="page-title">New Material Transfer Challan</h4>
                <br /><br />
                <form onSubmit={submitHandler}>

                    <div className="row">
                        <div className="col-sm-1"></div>
                        <div className="col-sm-3">
                            <h6>Select Project (From)</h6>
                            <Select placeholder="Select Project From" onChange={handleProjectChangeFrom}>
                                {projects.map((project, index) => (
                                    <Option value={project.id}>{project.project_name}</Option>
                                ))}
                            </Select>
                        </div>
                        <div className="col-sm-3">
                            <h6>Select Project (To)</h6>
                            <Select placeholder="Select Project To" onChange={handleProjectChangeTo}>
                                {projects.map((project, index) => (
                                    <Option value={project.id}>{project.project_name}</Option>
                                ))}
                            </Select>
                        </div>
                        <div className="col-sm-5"></div>
                    </div>




                    {/* if needed to add another field <Input style={{ borderRadius: "8px", width: 300 }}  type="text" value={query.grn_id} placeholder="grn_id" name="grn_id" onChange={event => formChangeHandler(event)} className="col-md-2" /> &nbsp; */}


                    <br /><br /><br /><br />
                    <div className="row">
                        <div className="col-sm-1"></div>
                        <div className="col-sm-10">
                            <Button type="button" style={{ background: "yellowgreen", color: "white", borderRadius: "10px" }} onClick={addHandler}>+ Add Row</Button>
                        </div>
                        <div className="col-sm-1"></div>
                    </div>
                    <br />

                    <div className="row print-center ">
                        <div className="center table-responsive col-lg-10 col-md-12">
                            <table className="table table-hover table-bordered ">
                                <thead className="thead-light">
                                    <tr className="row">
                                        <th className="col-md-2">Select Material</th>
                                        <th className="col-md-4">Material Name</th>
                                        <th className="col-md-2">Available quantity</th>
                                        <th className="col-md-2">Quantity</th>
                                        <th className="col-md-1">Unit</th>
                                        <th className="col-md-1">Delete</th>
                                    </tr>
                                </thead>

                                {inputFields.map((inputField, index) => (
                                    <tbody>
                                        <tr key={index} className="row">
                                            <td className="col-md-2"><Button type="button" style={{ borderRadius: "10px " }} size="small" onClick={() => showMaterial(index)}>Select Material</Button></td>
                                            <td className="col-md-4">{inputField.mat_name}</td>
                                            <td className="col-md-2"><Input style={{ borderRadius: "8px" }} type="text" disabled="true" value={inputField.zzmax} /></td>
                                            <td className="col-md-2"><Input style={{ borderRadius: "8px" }} type="text" value={inputField.quantity} placeholder={`Available : ${inputField.zzmax}`} name="quantity" onChange={event => changeHandler(index, event)} onBlur={() => blurHandler(inputField.quantity, inputField.zzmax)} /></td>
                                            <td className="col-md-1">{inputField.unit}</td>
                                            <td className="col-md-1"><Button danger="true" style={{ borderRadius: "10px " }} size="small" type="button" onClick={() => { deleteRowHandler(index) }}>Delete</Button></td>
                                        </tr>
                                    </tbody>
                                ))}
                            </table>
                        </div>
                    </div> <br />

                    <div className="submit-button">
                        <Button type="submit" style={{ background: "dodgerblue", color: "white", borderRadius: "10px " }} onClick={submitHandler}>Submit</Button>
                    </div>
                </form>
                <br /><br />
                {searchstates.isSearchVisible ?
                    (<div>
                        <br /><br />
                        <div className="row">
                            <div className="col-sm-1"><p> </p></div>
                            <div className="col-sm-10">

                                <h6>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-search" viewBox="0 0 16 16">
                                        <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0z" />
                                    </svg>&nbsp;&nbsp;
                                    Search Material
                                </h6>
                                <Input style={{ borderRadius: "8px", width: 300 }}
                                    placeholder="Material Name"
                                    value={searchValue}
                                    onChange={e => {
                                        const currValue = e.target.value;
                                        setSearchValue(currValue);
                                        const filteredData = matsOrig.filter(entry =>
                                            entry.mat_name.toLowerCase().match(currValue.toLowerCase())
                                        );
                                        setMats(filteredData);
                                    }}
                                />
                                <br /><br />

                                <Table rowClassName={(record, index) => index % 2 === 0 ? 'table-row-light' : 'table-row-dark'} dataSource={mats} columns={columns1} />
                            </div>
                            <div className="col-sm-1"><p> </p></div>
                        </div>
                    </div>) : (
                        <div><p> </p></div>
                    )
                }

                <br /><br /><br /><br />
                <div className="row">
                    <div className="col-sm-10"><p> </p></div>
                    <div className="col-sm-1"><Button type="link" style={{ background: "#027c86", color: "white", borderRadius: "10px" }} className="float-right" onClick={refreshHandler}>Refresh</Button></div>
                    <div className="col-sm-1"><p> </p></div>
                </div>
                <br /><br /><br /><br /><br /><br /><br /><br />
                <BackFooter />
            </div>
        )

    }
    else if (!r) {
        return (
            <div className="print-center">
                <br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br />
                <Spin tip="Loading..." />
            </div>
        )

    } else {
        console.log("NOT SIGNED IN")
        return (
            <NotFound />
        )
    }


}


export default DeliveryChallan;