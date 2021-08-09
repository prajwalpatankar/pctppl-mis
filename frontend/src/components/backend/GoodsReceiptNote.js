import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Button, message, Input, Table, Space, Select } from 'antd';
import NotFound from './../NotFound';
import BackFooter from './BackFooter';
import jwt_decode from "jwt-decode";

function GoodsReceiptNote() {

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
            rec_quant: "",
            item_rate: "",
            unit: "---"
        },
    ]);

    const [query, setQuery] = useState({
        grn_id: "",
        po_id: "",
        project_id: "",
        initialItemRow: [],
    });

    const [visibility, setVisibility] = useState({
        project: false,
        po: false
    });

    const [pos, setPos] = useState([]); //initially set pos empty
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

            axios.get(baseUrl.concat("po"))
                .then(res => {
                    setPos(res.data);
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
        isSearchVisiblePO: false,
    })

    // --------------------------------------------------------------------
    // Columns for antd Table

    const columns = [
        {
            title: 'PO ID',
            dataIndex: 'po_id',
            key: 'po_id',
        },
        {
            title: 'Action',
            key: 'action',
            render: (text, record) => (
                <Space size="middle">
                    <Button onClick={() => { updatePOID(record) }} type="button">Select</Button>
                </Space>
            ),
        },
    ];

    const columns1 = [
        {
            title: 'Material Name',
            dataIndex: 'mat_name',
            key: 'name',
        },
        {
            title: 'Rate',
            dataIndex: 'item_rate',
            key: 'item_rate',
        },
        {
            title: 'Quantity',
            dataIndex: 'quantity',
            key: 'quantity',
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
            rec_quant: "",
            item_rate: "",
            unit: "---",
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

    const handleProjectChange = (value, index) => {
        setVisibility({...visibility, project: true})
        setQuery({ ...query, project_id: value });
    }

    const formChangeHandler = (event) => {  //for outer form
        setQuery({ ...query, [event.target.name]: event.target.value });
    }

    const changeHandler = (index, event) => {   //inner form 
        const values = [...inputFields];
        values[index][event.target.name] = event.target.value;
        setInputField(values);
        setQuery({ ...query, initialItemRow: values })
    }

    // --------------------------------------------------------------------
    // Visibility handlers 

    const showMaterial = (index) => {
        if(visibility.project && visibility.po) {
            if (searchstates.isSearchVisible) {
                setSearch({ ...searchstates, isSearchVisible: false });
            } else {
                setSearch({ ...searchstates, isSearchVisible: true, idx: index });
            }
        } else if(visibility.project && !visibility.po){
            message.error("Please Select a Purchase Order ")
        } else {
            message.error("Please Select a Project ")
        }
    }

    const showPO = () => {
        if (searchstates.isSearchVisiblePO) {
            setSearch({ ...searchstates, isSearchVisiblePO: false });
        } else {
            setSearch({ ...searchstates, isSearchVisiblePO: true });
        }
    }

    // --------------------------------------------------------------------
    // Update Rows 

    const updatePOID = (record) => {
        setVisibility({...visibility, po: true})
        setQuery({ ...query, po_id: record.po_id })
        setSearch({ ...searchstates, isSearchVisiblePO: false });
        window.scrollTo({
            top: 0,
            left: 0,
            behavior: 'smooth'
        });
        setMats(record.initialItemRow)
    }

    const updatecol = (record) => {
        const values = [...inputFields];
        const index = searchstates.idx;
        values[index].mat_id = record.mat_id;
        values[index].mat_name = record.mat_name;
        values[index].item_rate = record.item_rate;
        values[index].quantity = record.quantity;
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
    // Submission

    const submitHandler = (e) => {
        e.preventDefault();
        console.log(query)
        axios.post(baseUrl.concat("grn/"), query)
            .then(response => {

                message.open({
                    type: 'success',
                    content: <p>GRN made successfully. <Button type="link" onClick={handlePrint}>Click here to Print</Button></p>,
                    duration: 10,
                });
                console.log(response)

                // updating stock

                let limit = query.initialItemRow.length
                var proj = query.project_id;
                for (var i = 0; i < limit; i++) {
                    var current = query.initialItemRow[i].rec_quant;
                    var mat = query.initialItemRow[i].mat_id;
                    var matid = query.initialItemRow[i].mat_id;
                    var matname = query.initialItemRow[i].mat_name;
                    var matunit = query.initialItemRow[i].unit;
                    axios.get(baseUrl.concat("stock/?project_id=" + proj + "&mat_id=" + mat))
                        .then(response => {
                            if (response.data.length === 0) {
                                axios.post(baseUrl.concat("stock/"), {
                                    project_id: proj,
                                    recieved: current,
                                    quantity: current,
                                    mat_id: matid,
                                    mat_name: matname,
                                    unit: matunit,
                                })
                                    .then(response => {
                                        console.log(response)
                                    })
                            } else {
                                let update = response.data[0];
                                update.recieved = parseFloat(update.recieved) + parseFloat(current);
                                update.quantity = parseFloat(update.quantity) + parseFloat(current);
                                var id = response.data[0].id
                                axios.put(baseUrl.concat("stock/" + id + "/"), update)
                                    .then(response => {
                                        console.log(response)
                                    })
                                    .catch(error => {
                                        console.log(error)
                                    })
                            }

                        })
                        .catch(error => {
                            console.log(error)
                        })
                }

                // clearing fields
                setQuery({...query,
                    grn_id: "",
                    po_id: "",
                    initialItemRow: [],
                })
                setInputField([
                    {
                        mat_id: "",
                        mat_name: "----",
                        quantity: "",
                        rec_quant: "",
                        item_rate: "",
                        unit: "---",
                    },
                ])
                setVisibility({...query, po:false});
                setMats([]);
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
                    <Select placeholder="Select Project" style={{ width: 300 }} onChange={handleProjectChange}>
                        {projects.map((project, index) => (
                            <Option value={project.id}>{project.project_name}</Option>
                        ))}
                    </Select>

                    <Input type="text" value={query.grn_id} placeholder="grn_id" name="grn_id" onChange={event => formChangeHandler(event)} className="col-md-2" /> &nbsp;

                    <Input disabled="true" placeholder="Purchase Order ID" name="po_id" value={query.po_id} className="col-md-2" /> &nbsp;

                    <Button type="button" onClick={() => showPO()}>Select PO</Button>&nbsp;<br /><br />

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
                                            <th className="col-md-1">Rate</th>
                                            <th className="col-md-1">PO Quantity</th>
                                            <th className="col-md-2">Recieved Quantity</th>
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
                                                <td className="col-md-1"><Input type="text" value={inputField.item_rate} placeholder="Rate" name="item_rate" disabled="true" /></td>
                                                <td className="col-md-1"><Input type="text" value={inputField.quantity} placeholder="Quantity" name="quantity" disabled="true" /></td>
                                                <td className="col-md-2"><Input type="text" value={inputField.rec_quant} placeholder="Recieved Quantity" name="rec_quant" onChange={event => changeHandler(index, event)} /></td>
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

                { searchstates.isSearchVisiblePO ?
                    (<div>
                        <br /><br />
                        <div className="row">
                            <div className="col-sm-1"><p> </p></div>
                            <div className="col-sm-10"><Table dataSource={pos} columns={columns} /></div>
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


export default GoodsReceiptNote;