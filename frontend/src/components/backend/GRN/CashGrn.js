import React, { useEffect, useState } from 'react';
import axios from 'axios';
import NotFound from '../../NotFound';
import { Button, message, Input, Table, Space, Select, Spin } from 'antd';
import BackFooter from '../BackFooter';
import jwt_decode from 'jwt-decode';
import { baseUrl } from './../../../constants/Constants';

const cashSupplier = 4;

function CashGrn() {

    // --------------------------------------------------------------------
    // Base Urls

    // const baseUrl = "http://localhost:8000/"

    // --------------------------------------------------------------------
    // States

    const [l, setloggedin] = useState(true);
    const [r, setR] = useState(false);

    const [inputFields, setInputField] = useState([
        {
            mat_id: "",
            hsn_id: "",
            mat_name: "----",
            quantity: "",
            rec_quant: "",
            accepted: "",
            item_rate: "",
            unit: "---"
        },
    ]);

    const [query, setQuery] = useState({
        grn_id: "",
        po_id: "CASH",
        vehicle_no: "-",
        challan_no: "-",
        supp_id: cashSupplier,
        project_id: "",
        initialItemRow: [],
    });

    const [visibility, setVisibility] = useState(false);

    const [limitToUpdate, setLimitToUpdate] = useState([]);

    const [projects, setProjects] = useState([]);

    const [searchValue, setSearchValue] = useState('');



    const [limiter, setLimiter] = useState([]);
    const [orig_limiter, setOrigLimiter] = useState([]);

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
    // AntD Vriables

    const { Option } = Select;

    const columns = [
        {
            title: 'Material Name',
            dataIndex: 'mat_name',
            key: 'mat_name',
        },
        {
            title: 'Utilized Quantity',
            dataIndex: 'utilized',
            key: 'utilized',
        },
        {
            title: 'Total permitted Quantity',
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
            hsn_id: "",
            mat_name: "----",
            quantity: "",
            rec_quant: "",
            accepted: "",
            item_rate: "",
            unit: "---"

        }])
    }

    const deleteRowHandler = (index) => {
        const values = [...inputFields];
        if (values[index].mat_name !== "----") {
            const values_updated = [...limitToUpdate];
            setLimiter([...limiter, values_updated[index]]);
            setOrigLimiter([...limiter, values_updated[index]]);
            values_updated.splice(index, 1);
            setLimitToUpdate(values_updated);
        }
        values.splice(index, 1);
        setInputField(values);
        setQuery({ ...query, initialItemRow: values });
        if (values.length === 0) {
            setSearch({ ...searchstates, isSearchVisible: false });
        }

        setSearch({
            mat: "",
            isSearchVisible: false,
            idx: "",
        })
    }

    // --------------------------------------------------------------------
    // Form change handlers

    const onChangeProject = (value) => {
        setLimitToUpdate([]);
        setInputField([        {
            mat_id: "",
            hsn_id: "",
            mat_name: "----",
            quantity: "",
            rec_quant: "",
            accepted: "",
            item_rate: "",
            unit: "---"
        }]);
        axios.get(baseUrl.concat("reqlimit/?project_id=" + value))
            .then(res => {
                setLimiter(res.data);
                setOrigLimiter(res.data);
            })
        axios.get(baseUrl.concat("grn/?project_id=" + value))
            .then(res => {
                var len = res.data.length;
                if (len !== 0) {
                    var proj_string = res.data[len - 1].grn_id.substring(0, 9);
                    var id_string = res.data[len - 1].grn_id.substring(9);
                    id_string = parseInt(id_string) + 1;
                    len = 5 - id_string.toString().length
                    while (len !== 0) {
                        proj_string = proj_string + 0;
                        len--;
                    }
                    id_string = proj_string + id_string;
                    setQuery({ ...query, project_id: value, grn_id: id_string })
                } else {
                    console.log(len)
                    axios.get(baseUrl.concat("projects/" + value + "/"))
                        .then(res => {
                            var id_string = res.data.identifier + "-GRN-00001";
                            setQuery({ ...query, project_id: value, grn_id: id_string })
                        })
                }
            })
        setVisibility(true);
    }

    const changeHandlerQuantity = (index, event) => {
        const values = [...inputFields];
        values[index].quantity = event.target.value;
        values[index].rec_quant = event.target.value;
        values[index].accepted = event.target.value;
        setInputField(values);
        setQuery({ ...query, initialItemRow: values })
    }

    const changeHandler = (index, event) => {
        const values = [...inputFields];
        values[index][event.target.name] = event.target.value;
        setInputField(values);
        setQuery({ ...query, initialItemRow: values })
    }



    // --------------------------------------------------------------------
    // Visibility and search handlers 

    const showMaterial = (index) => {
        if (visibility) {
            if (searchstates.isSearchVisible) {
                setSearch({ ...searchstates, isSearchVisible: false });
            } else {
                setSearch({ ...searchstates, isSearchVisible: true, idx: index });
            }
        }
        else {
            message.error("Please Select a Project ")
        }

    }


    // --------------------------------------------------------------------
    // Update Rows 

    const updatecol = (record, indexrow) => {
        var temp_orig_limiter = [...orig_limiter];
        temp_orig_limiter.splice(orig_limiter.findIndex(item => item.id === record.id), 1);
        setOrigLimiter(temp_orig_limiter);
        setLimiter(temp_orig_limiter);
        setSearchValue('');
        setLimitToUpdate([...limitToUpdate, record])
        const values = [...inputFields];
        const index = searchstates.idx;
        values[index].mat_id = record.mat_id;
        values[index].hsn_id = record.hsn_id;
        values[index].mat_name = record.mat_name
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

    const reqLimitUpdator = (i) => {
        limitToUpdate[i].utilized = parseFloat(inputFields[i].quantity) + parseFloat(limitToUpdate[i].utilized);
        axios.patch(baseUrl.concat("reqlimit/" + limitToUpdate[i].id + "/"), { utilized: limitToUpdate[i].utilized })
            .catch(error => {
                console.log(error)
            })
    }

    const HandleSubmitStockUpdates = (updateQuery, proj) => {
        var current = updateQuery.rec_quant;
        var mat = updateQuery.mat_id;
        var matid = updateQuery.mat_id;
        var matname = updateQuery.mat_name;
        var matunit = updateQuery.unit;
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
                    axios.patch(baseUrl.concat("stock/" + id + "/"), update)
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




    const submitHandler = (e) => {
        e.preventDefault();
        console.log(query)
        var len = inputFields.length;
        if (inputFields[len - 1].mat_name === "----") {
            message.error("Material not selected in last row!")
            return;
        }

        for (var i = 0; i < limitToUpdate.length; i++) {
            if (inputFields[i].quantity > (limitToUpdate[i].quantity - limitToUpdate[i].utilized)) {
                message.error(`Quantities entered for ${inputFields[i].mat_name} exceed limit ! Please contact the Director to increase the limit.`);
                return;
            }
        }

        for (i = 0; i < limitToUpdate.length; i++) {
            reqLimitUpdator(i);
        }



        axios.post(baseUrl.concat("grn/"), query)
            .then(response => {

                message.open({
                    type: 'success',
                    // content: <p>GRN made successfully. <Button type="link" style={{ background: "#027c86", color: "white", borderRadius: "10px" }} onClick={handlePrint}>Click here to Print</Button></p>,
                    content: <p>GRN made successfully</p>,
                    duration: 10,
                });
                console.log(response)

                // updating stock

                let limit = query.initialItemRow.length
                var proj = query.project_id;
                for (var i = 0; i < limit; i++) {
                    HandleSubmitStockUpdates(query.initialItemRow[i], proj);
                }


                var proj_string = query.grn_id.substring(0, 9);
                var id_string = query.grn_id.substring(9);
                id_string = parseInt(id_string) + 1;
                var len = 5 - id_string.toString().length
                while (len !== 0) {
                    proj_string = proj_string + 0;
                    len--;
                }
                id_string = proj_string + id_string;
                // clearing fields
                setQuery({
                    ...query,
                    grn_id: id_string,
                    po_id: "CASH",
                    vehicle_no: "-",
                    challan_no: "-",
                    supp_id: cashSupplier,
                    initialItemRow: [],
                })
                setInputField([
                    {
                        mat_id: "",
                        hsn_id: "",
                        mat_name: "----",
                        quantity: "",
                        rec_quant: "",
                        accepted: "",
                        item_rate: "",
                        unit: "---",
                    },
                ])
                setVisibility({ ...visibility, po: false });
                window.open('/grn:' + response.data.id)
            })
            .then(res => {
                axios.get(baseUrl.concat("reqlimit/?project_id=" + query.project_id))
                    .then(res => {
                        setLimiter(res.data);
                        setOrigLimiter(res.data);
                    })
            })
            .catch(error => {
                console.log(error.response.status)
                if (error.response.status === 401) {
                    localStorage.removeItem('token')
                    setloggedin(false);
                } else if (error.response.status === 400) {
                    message.error("Please fill all the details !")
                }
            })

    }

    // --------------------------------------------------------------------
    // Extras

    const refreshHandler = () => {
        window.location.reload();
    }


    // --------------------------------------------------------------------
    // HTML
    if (l && r) {
        return (
            <div>

                <br />
                <br /><br /><br /><br />
                <h4 className="page-title">New Cash Goods Receipt Note</h4>
                <form onSubmit={submitHandler}>

                    <div className="row">
                        <div className="col-sm-1"></div>
                        <div className="col-sm-10">
                            <h6>Select Project</h6>
                            <Select placeholder="Select Project" onChange={onChangeProject}>
                                {projects.map((project, index) => (
                                    <Option value={project.id}>{project.project_name}</Option>
                                ))}
                            </Select>
                        </div>
                        <div className="col-sm-1"></div>
                    </div>

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
                                        <th className="col-md-2">Quantity</th>
                                        <th className="col-md-1">Unit</th>
                                        <th className="col-md-2">Rate</th>
                                        {/* <th className="col-md-2">Expected Date (YYYY/MM/DD)</th> */}
                                        <th className="col-md-1">Delete</th>
                                    </tr>
                                </thead>
                                {inputFields.map((inputField, index) => (
                                    <tbody>
                                        <tr key={index} className="row">
                                            <td className="col-md-2"><Button type="button" style={{ borderRadius: "10px " }} size="small" onClick={() => showMaterial(index)}>Select</Button></td>
                                            <td className="col-md-4">{inputField.mat_name}</td>
                                            <td className="col-md-2"><Input style={{ borderRadius: "8px" }} required={true} type="text" value={inputField.quantity} placeholder="Quantity" name="quantity" onChange={event => changeHandlerQuantity(index, event)} /></td>
                                            <td className="col-md-1">{inputField.unit}</td>
                                            <td className="col-md-2"><Input style={{ borderRadius: "8px" }} required={true} type="text" value={inputField.item_rate} placeholder="Item Rate" name="item_rate" onChange={event => changeHandler(index, event)} /></td>                                            
                                            {/* <td className="col-md-2"><Input style={{ borderRadius: "8px" }} type="date" placeholder="Select Date" name="required_date" onChange={event => changeDateHandler(index, event)} /></td> */}
                                            <td className="col-md-1"><Button danger="true" style={{ borderRadius: "10px " }} size="small" type="button" onClick={() => { deleteRowHandler(index) }}>Delete</Button></td>
                                        </tr>
                                    </tbody>
                                ))}
                            </table>
                        </div>
                    </div> <br />
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
                                            const filteredData = orig_limiter.filter(entry =>
                                                entry.mat_name.toLowerCase().match(currValue.toLowerCase())
                                            );
                                            setLimiter(filteredData);
                                        }}
                                    />
                                    <br /><br />

                                    <Table rowClassName={(record, index) => index % 2 === 0 ? 'table-row-light' : 'table-row-dark'} dataSource={limiter} columns={columns} pagination={false} />
                                </div>
                                <div className="col-sm-1"><p> </p></div>
                            </div>
                        </div>) : (
                            <div><p> </p></div>
                        )
                    }

                    <br /><br />
                    <div className="submit-button">
                        <Button type="submit" style={{ background: "dodgerblue", color: "white", borderRadius: "10px " }} onClick={submitHandler}>Submit</Button>
                    </div>
                </form>
                <br /><br />
                <br /><br />
                <div className="row">
                    <div className="col-sm-10"><p> </p></div>
                    <div className="col-sm-1"><Button type="link" style={{ background: "#027c86", color: "white", borderRadius: "10px" }} className="float-right" onClick={refreshHandler}>Refresh</Button></div>
                    <div className="col-sm-1"><p> </p></div>
                </div>
                <br /><br /><br /><br />
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
        return (
            <NotFound />
        )
    }


}


export default CashGrn;