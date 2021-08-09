import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Button, message, Input, Table, Space, Select } from 'antd';
import NotFound from './../NotFound';
import BackFooter from './BackFooter';
import jwt_decode from "jwt-decode";

function DeliveryChallan() {

    // --------------------------------------------------------------------
    // Base Urls

    const baseUrl = "http://localhost:8000/"

    // --------------------------------------------------------------------
    // states

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
    const [l, setloggedin] = useState(true)

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
            delete axios.defaults.headers.common["Authorization"];
        }

        setTimeout(() => {
            // console.log(client)
            // console.log(projects)
            return 0;
        }, 200);
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
            render: (text, record) => (
                <Space size="middle">
                    <Button onClick={() => { updatecol(record) }} type="button">Select</Button>
                </Space>
            ),
        },
    ];


    // --------------------------------------------------------------------
    // Dynamic Table ADD/DELETE

    const addHandler = () => {
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
        values.splice(index, 1);
        setInputField(values);
        setQuery({ ...query, initialItemRow: values });
    }

    // --------------------------------------------------------------------
    // Form change handlers

    const handleProjectChangeFrom = (value, index) => {
        setVisibility(true)
        axios.get(baseUrl.concat("stock/?project_id=" + value ))
            .then(response => {
                setMats(response.data)
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
        if(visibility) {
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

    const updatecol = (record) => {
        const values = [...inputFields];
        const index = searchstates.idx;
        values[index].mat_id = record.mat_id;
        values[index].mat_name = record.mat_name;
        // values[index].quantity = record.quantity;
        values[index].zzmax = record.quantity;
        values[index].unit = record.unit;
        setInputField(values);
        setQuery({ ...query, initialItemRow: values })
        setSearch({ ...searchstates, isSearchVisible: false })
        window.scrollTo({
            top: 0,
            left: 0,
            behavior: 'smooth'
        });
    }


    // --------------------------------------------------------------------
    // Validations before Submission

    const blurHandler = (entered, max) => {
        if(entered <= 0 || entered > max) {
            message.error("Please check quantity again !")
        }

    }

    // --------------------------------------------------------------------
    // Submission

    const submitHandler = (e) => {
        e.preventDefault();
        console.log(query)

        if(query.to_project === query.from_project){
            message.error("Invalid Project !")
        }


        axios.post(baseUrl.concat("sitetransfer/"), query)
            .then(response => {

                message.open({
                    type: 'success',
                    content: <p>Delivery Challan made successfully. <Button type="link" onClick={handlePrint}>Click here to Print</Button></p>,
                    duration: 10,
                });
                console.log(response)

                // updating stock

                // let limit = query.initialItemRow.length
                // var proj = query.project_id;
                // for (var i = 0; i < limit; i++) {
                //     var current = query.initialItemRow[i].rec_quant;
                //     var mat = query.initialItemRow[i].mat_id;
                //     var matid = query.initialItemRow[i].mat_id;
                //     var matname = query.initialItemRow[i].mat_name;
                //     var matunit = query.initialItemRow[i].unit;
                //     axios.get(baseUrl.concat("stock/?project_id=" + proj + "&mat_id=" + mat))
                //         .then(response => {
                //             console.log("RESPONSE OF GET : ", response.data)
                //             console.log("LENGTH OF RESPONSE", response.data.length)
                //             if (response.data.length === 0) {
                //                 axios.post(baseUrl.concat("stock/"), {
                //                     project_id: proj,
                //                     recieved: current,
                //                     quantity: current,
                //                     mat_id: matid,
                //                     mat_name: matname,
                //                     unit: matunit,
                //                 })
                //                     .then(response => {
                //                         console.log(response)
                //                     })
                //             } else {
                //                 var id = response.data.id
                //                 var total_recieved = response.data.recieved + current;
                //                 var quant = response.data.quantity + current;
                //                 axios.put(baseUrl.concat("stock/" + id + "/"), { recieved: total_recieved, quantity: quant })
                //                     .then(response => {
                //                         console.log(response)
                //                     })
                //                     .catch(error => {
                //                         console.log(error)
                //                     })
                //             }

                //         })
                //         .catch(error => {
                //             console.log(error)
                //         })
                // }

                // clearing fields
                setQuery({
                    initialItemRow: [],
                })
                setInputField([
                    {
                        mat_id: "",
                        mat_name: "----",
                        quantity: "",
                        unit: "---",
                    },
                ])
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
    // Print Api

    const handlePrint = () => {
        console.log("Printing....")
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
    if (l) {
        return (
            <div>
                <br /><br /><br /><br /><br /><br /><br /><br /><br />
                <form onSubmit={submitHandler}>
                    <Select placeholder="Select Project From" style={{ width: 300 }} onChange={handleProjectChangeFrom}>
                        {projects.map((project, index) => (
                            <Option value={project.id}>{project.project_name}</Option>
                        ))}
                    </Select>
                    <Select placeholder="Select Project To" style={{ width: 300 }} onChange={handleProjectChangeTo}>
                        {projects.map((project, index) => (
                            <Option value={project.id}>{project.project_name}</Option>
                        ))}
                    </Select>

                    {/* if needed to add another field <Input type="text" value={query.grn_id} placeholder="grn_id" name="grn_id" onChange={event => formChangeHandler(event)} className="col-md-2" /> &nbsp; */}

                    <Button type="button" onClick={addHandler}>Add</Button><br /><br />

                    <div className="row">
                        <div className="col-md-1"><p> </p></div>
                        <div className="table-responsive col-md-10">
                            <table className="table table-hover table-bordered">
                                <thead>
                                    <tr className="info">
                                        <div className="row">
                                            <th className="col-md-2">Select Material</th>
                                            <th className="col-md-4">Material Name</th>
                                            <th className="col-md-2">Quantity</th>
                                            <th className="col-md-1">Unit</th>
                                            <th className="col-md-1">Delete</th>
                                        </div>
                                    </tr>
                                </thead>
                                <tbody>
                                    {inputFields.map((inputField, index) => (
                                        <tr key={index}>
                                            <div className="row">
                                                <td className="col-md-2"><Button type="button" onClick={() => showMaterial(index)}>Select Material</Button></td>
                                                <td className="col-md-4">{inputField.mat_name}</td>
                                                <td className="col-md-2"><Input type="text" value={inputField.quantity} placeholder={`Available : ${inputField.zzmax}`} name="quantity" onChange={event => changeHandler(index, event)} onBlur={() => blurHandler(inputField.quantity, inputField.zzmax)}/></td>
                                                <td className="col-md-1">{inputField.unit}</td>
                                                <td className="col-md-1"><Button danger="true" type="button" onClick={() => { deleteRowHandler(index) }}>Delete</Button></td>
                                            </div>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                        <div className="col-md-1"><p> </p></div>
                    </div> <br />

                    <Button type="submit" onClick={submitHandler}>Submit</Button>
                </form>
                <br /><br />
                { searchstates.isSearchVisible ?
                    (<div>
                        <br /><br />
                        <div className="row">
                            <div className="col-sm-1"><p> </p></div>
                            <div className="col-sm-10"><Table dataSource={mats} columns={columns1} /></div>
                            <div className="col-sm-1"><p> </p></div>
                        </div>
                    </div>) : (
                        <div><p> </p></div>
                    )
                }

                <br /><br /><br /><br />
                <div className="row">
                    <div className="col-sm-10"><p> </p></div>
                    <div className="col-sm-1"><Button type="link" className="float-right" onClick={refreshHandler}>Refresh</Button></div>
                    <div className="col-sm-1"><p> </p></div>
                </div>
                <br /><br /><br /><br />
                <BackFooter />
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