import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Button, message, Input, Table, Space, Select, Modal, Spin } from 'antd';
import NotFound from './../../NotFound';
import { baseUrl } from './../../../constants/Constants';
import BackFooter from './../BackFooter';
import jwt_decode from 'jwt-decode';
import PageNotFound from '../../PageNotFound';

function PurchaseOrder() {

    // const baseUrl = "http://localhost:8000/";

    const [l, setloggedin] = useState(true);
    const [r, setR] = useState(false);
    const [store, setStore] = useState(false);

    const [inputFields, setInputField] = useState([
        {
            mat_id: "",
            hsn_id: "",
            mat_name: "----",
            description: "",
            quantity: "",
            unit: "---",
            item_rate: "",
            discount: "",
        },
    ]);

    const [query, setQuery] = useState({
        po_id: "",
        project_id: "",
        initialItemRow: [],
        supp_id: "",
        contact_person: "",
        payment_terms: "",
        other_terms: "",
        delivery_schedule: "",
        transport: "",
        other_charges: "",
    });

    const [suppliers, setSuppliers] = useState([]);
    const [projects, setProjects] = useState([]);

    // const [materials, setMaterials] = useState([]); //initially set materials empty
    // const [subcategories, setSubCategories] = useState([]);
    // const [categories, setCategories] = useState([]);
    const [reqs, setReqs] = useState([]);
    // const [pos, setPos] = useState([]);


    useEffect(() => {
        if (localStorage.getItem("token")) {
            axios.defaults.headers.common["Authorization"] = `JWT ${localStorage.getItem('token')}`;

            axios.get(baseUrl.concat("userdata/?user=" + jwt_decode(localStorage.getItem("token")).user_id))
                .then(res => {
                    // axios.get(baseUrl.concat("user/" + res.data[0].user))
                    //     .then(res => {
                    //         setQuery({ ...query, made_by: res.data.username })
                    //     })

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
                    } else if (res.data[0].role === "Store") {
                        setStore(true);
                    } else {
                        axios.get(baseUrl.concat("projects"))
                        .then(res => {
                            setProjects(res.data);
                        })
                    }
                    axios.get(baseUrl.concat("supplier"))
                        .then(res => {
                            setSuppliers(res.data);
                        })
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



    // const [searchstates, setSearch] = useState({
    //     mat: "",
    //     isSearchVisible: false,
    //     idx: "",
    // })


    // const columns = [
    //     {
    //         title: 'Material Name',
    //         dataIndex: 'desc',
    //         key: 'desc',
    //     },
    //     {
    //         title: 'Unit',
    //         dataIndex: 'unit',
    //         key: 'unit',
    //     },
    //     {
    //         title: 'HSN / SAC Code',
    //         dataIndex: 'hsan_id',
    //         key: 'hsan_id',
    //     },
    //     {
    //         title: 'Action',
    //         key: 'action',
    //         render: (text, record) => (
    //             <Space size="middle">
    //                 <Button onClick={() => { updatecol(record) }} type="button">Select</Button>
    //             </Space>
    //         ),
    //     },
    // ];

    const columns1 = [
        {
            title: 'Requisition ID',
            dataIndex: 'req_id',
            key: 'req_id',
        },
        {
            title: 'Details',
            key: 'details',
            render: (text, record) => (
                <Space size="middle">
                    <Button type="link" style={{ background: "#027c86", color: "white", borderRadius: "10px" }} onClick={() => { showModalDetails(record) }}>View Details</Button>
                </Space>
            ),
        },
        {
            title: 'Requisition Date',
            dataIndex: 'created_date_time',
            key: 'created_date_time',
            render: (text) => (
                <p>{text.substring(0, 10).toString().split("-").reverse().join("/")}</p>
            ),
        },
        {
            title: 'Completed',
            key: 'completed',
            render: (text, record, index) => (
                <Space size="middle">
                    <Button type="button" size="small" style={{ background: "yellowgreen", color: "white", borderRadius: "10px" }} onClick={() => { markCompleted(record, index) }}>Mark as Completed</Button>
                </Space>
            ),
        },
    ];


    // const columspo = [
    //     {
    //         title: 'Project Name',
    //         dataIndex: 'project_name',
    //         key: 'project_name',
    //     },
    //     {
    //         title: 'Supplier',
    //         dataIndex: 'supp_id',
    //         key: 'supp_id',
    //     },
    //     {
    //         title: 'Details',
    //         key: 'details',
    //         render: (text, record) => (
    //             <Space size="middle">
    //                 <Button type="link" style={{ background: "#027c86", color: "white", borderRadius: "10px" }}  onClick={() => { showModalPO(record) }}>View Details</Button>
    //             </Space>
    //         ),
    //     },
    //     {
    //         title: 'Action',
    //         key: 'action',
    //         render: (text, record) => (
    //             <Space size="middle">
    //                 <Button type="link" style={{ background: "#027c86", color: "white", borderRadius: "10px" }}  onClick={handlePrint}>Print</Button>
    //             </Space>
    //         ),
    //     },
    // ];




    const onChangeSupplier = (value) => {
        setQuery({ ...query, supp_id: value });
    }

    const onChangeProject = (value) => {  //for outer form
        message.info("Please click 'View Details' from Purchase Requisitions to select Material")
        setQuery({ ...query, project_id: value });
        axios.get(baseUrl.concat("requisition/?project_id=" + value + "&completed=N&isaprroved_master=Y"))
            .then(res => {
                res.data.sort(function (a, b) {
                    return b.id - a.id;
                });
                setReqs(res.data)
            })

        axios.get(baseUrl.concat("po/?project_id=" + value))
            .then(res => {
                var len = res.data.length;
                if (len !== 0) {
                    var proj_string = res.data[len - 1].po_id.substring(0, 8);
                    var id_string = res.data[len - 1].po_id.substring(8);
                    id_string = parseInt(id_string) + 1;
                    len = 5 - id_string.toString().length
                    while (len !== 0) {
                        proj_string = proj_string + 0;
                        len--;
                    }
                    id_string = proj_string + id_string;
                    setQuery({ ...query, project_id: value, po_id: id_string })
                } else {
                    console.log(len)
                    axios.get(baseUrl.concat("projects/" + value + "/"))
                        .then(res => {
                            var id_string = res.data.identifier + "-PO-00001";
                            setQuery({ ...query, project_id: value, po_id: id_string })
                        })
                }

            })
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


    const markCompleted = (record, index) => {
        record.completed = "Y";
        axios.patch(baseUrl.concat("requisition/" + record.id + "/"), record)
            .then(res => {
                message.success("Purchase Requisition Granted");
            })
        const values = [...reqs];
        values.splice(index, 1);
        setReqs(values);
    }




    const submitHandler = (e) => {
        e.preventDefault();
        var len = inputFields.length;
        if (inputFields[len - 1].mat_name === "----") {
            message.error("Material not selected in last row!")
            return;
        }
        console.log(query)
        axios.post(baseUrl.concat("po/"), query)
            .then(response => {
                message.info("Please mark Requisition as completed if necessary")
                message.success("Purchase Order Made successfully", 5)
                console.log(response)

                var proj_string = query.po_id.substring(0, 8);
                var id_string = query.po_id.substring(8);
                id_string = parseInt(id_string) + 1;
                var len = 5 - id_string.toString().length
                while (len !== 0) {
                    proj_string = proj_string + 0;
                    len--;
                }
                id_string = proj_string + id_string;
                setQuery({
                    ...query,
                    po_id: id_string,
                    initialItemRow: [],
                    contact_person: "",
                    payment_terms: "",
                    other_terms: "",
                    delivery_schedule: "",
                    transport: "",
                    other_charges: "",
                })
                setInputField([
                    {
                        mat_id: "",
                        hsn_id: "",
                        mat_name: "----",
                        quantity: "",
                        unit: "---",
                        item_rate: "",
                        discount: "",
                    },
                ])
                window.open('/po:' + response.data.id)
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


    // This function is not necessary for POs
    // const addHandler = () => {
    //     var len = inputFields.length;
    //     if ((len !== 0) && (inputFields[len - 1].mat_name === "----")) {
    //         message.error("Please update exissting row before adding another row");
    //         return;
    //     }
    //     setInputField([...inputFields, {
    //         mat_id: "",
    //         hsn_id: "", 
    //         mat_name: "----",
    //         quantity: "",
    //         unit: "---",
    //         item_rate: "",
    //     }])
    // }

    const deleteRowHandler = (index) => {
        const values = [...inputFields];
        values.splice(index, 1);
        setInputField(values);
        setQuery({ ...query, initialItemRow: values });
    }

    const refreshHandler = () => {
        window.location.reload();
    }


    // const showMaterial = (index) => {
    //     if (searchstates.isSearchVisible) {
    //         setSearch({ ...searchstates, isSearchVisible: false });
    //     } else {
    //         setSearch({ ...searchstates, isSearchVisible: true, idx: index });
    //     }
    // }

    // const searchChangeHandler = (event) => {
    //     setSearch({ ...searchstates, [event.target.name]: event.target.value });
    // }

    // const onSearchMat = () => {
    //     const searchval = searchstates.mat;
    //     axios.get(baseUrl.concat("material-master/?search=" + searchval))
    //         .then(res => {
    //             setMaterials(res.data);
    //         })
    // }

    // const onSearchCat = (value) => {
    //     axios.get(baseUrl.concat("material-sub-category/?search=" + value))
    //         .then(res => {
    //             setSubCategories(res.data);
    //         })
    // }

    // const onSearchSubCat = (value) => {
    //     axios.get(baseUrl.concat("material-master/?search=" + value))
    //         .then(res => {
    //             setMaterials(res.data);
    //         })
    // }

    // const updatecol = (record) => {
    //     const values = [...inputFields];
    //     const index = searchstates.idx;
    //     values[index].mat_id = record.mat_id;
    // values[index].hsn_id = record.hsn_id;                        
    //     values[index].mat_name = record.desc;  //check once later
    //     values[index].unit = record.unit;
    //     setInputField(values);
    //     setQuery({ ...query, initialItemRow: values })
    //     setSearch({ ...searchstates, isSearchVisible: false })

    //     window.scrollTo({
    //         top: 0,
    //         left: 0,
    //         behavior: 'smooth'
    //     });
    // }


    // --------------------------------------------------------------------
    // Modal

    const [ModalDetails, setModalDetails] = useState({
        details: false,
        po: false
    })
    const [current_items, setItem] = useState([]);

    const handleCancelDetails = () => {
        setModalDetails({ ...ModalDetails, details: false })
    }

    // const handleCancelPO = () => {
    //     setModalDetails({ ...ModalDetails, po: false })
    // }

    const showModalDetails = (record) => {
        setModalDetails({ ...ModalDetails, details: true })
        setItem(record.initialItemRow)
        console.log(current_items)
    }

    // const showModalPO = (record) => {
    //     setModalDetails({ ...ModalDetails, po: true })
    //     setItem(record.initialItemRow)
    //     console.log(current_items)
    // }

    const selectMaterial = (record) => {
        if (inputFields.length === 1 && inputFields[0].mat_name === "----") {
            setInputField([{
                mat_id: record.mat_id,
                hsn_id: record.hsn_id,
                mat_name: record.mat_name,
                description: record.description,
                quantity: record.quantity,
                unit: record.unit,
                item_rate: "",
                discount: "",
            }])
        } else {
            setInputField([...inputFields, {
                mat_id: record.mat_id,
                hsn_id: record.hsn_id,
                mat_name: record.mat_name,
                description: record.description,
                quantity: record.quantity,
                unit: record.unit,
                item_rate: "",
                discount: "",
            }])
        }

    }

    // --------------------------------------------------------------------
    // Antd Configs

    // const { Search } = Input;
    const { Option } = Select;
    const { TextArea } = Input;
    // const { TextArea } = Input;


    // --------------------------------------------------------------------
    // Print Api


    // --------------------------------------------------------------------
    // html
    if (l && r) {
        return (
            <div>
                {store ?
                    <PageNotFound />
                    :
                    <div>


                        <br /><br /><br /><br />
                        <h4 className="page-title">New Purchase Requisition</h4>
                        <br /><br />
                        <form onSubmit={submitHandler}>
                            <div className="row">
                                <div className="col-sm-1"></div>
                                <div className="col-sm-3">
                                    <h6>Select Project</h6>
                                    <Select  placeholder="Select Project" onChange={onChangeProject}>
                                        {projects.map((project, index) => (
                                            <Option value={project.id}>{project.project_name}</Option>
                                        ))}
                                    </Select>
                                </div>
                                <div className="col-sm-3">
                                    <h6>Select Supplier</h6>
                                    <Select
                                        showSearch
                                        
                                        placeholder="Select Supplier"
                                        optionFilterProp="children"
                                        filterOption={(input, option) =>
                                            option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                                        }
                                        name="supp_id"
                                        onChange={onChangeSupplier}
                                    >
                                        {suppliers.map((supp, index) => (
                                            <Option value={supp.id}>{supp.supp_name}</Option>
                                        ))}
                                    </Select>
                                </div>
                                <div className="col-sm-3">
                                    <h6>Contact Person Details</h6>
                                    <Input style={{ borderRadius: "8px", width: 300 }} type="text" value={query.contact_person} placeholder="Contact Person" name="contact_person" onChange={event => formChangeHandler(event)} />
                                </div>
                                <div className="col-sm-2"></div>
                            </div>
                            <br />
                            <div className="row">
                                <div className="col-sm-1"></div>
                                <div className="col-sm-3">
                                    <h6>Payment Terms</h6>
                                    <TextArea style={{ borderRadius: "8px", width: 300 }} rows={4} type="text" value={query.payment_terms} placeholder="Payment Terms" name="payment_terms" onChange={event => formChangeHandler(event)} />

                                </div>
                                <div className="col-sm-3">
                                    <h6>Other Terms</h6>
                                    <TextArea style={{ borderRadius: "8px", width: 300 }} rows={4} type="text" value={query.other_terms} placeholder="Other Terms" name="other_terms" onChange={event => formChangeHandler(event)} />

                                </div>
                                <div className="col-sm-3">
                                    <h6>Delivery Schedule</h6>
                                    <TextArea style={{ borderRadius: "8px", width: 300 }} rows={4} type="text" value={query.delivery_schedule} placeholder="Delivery Schedule" name="delivery_schedule" onChange={event => formChangeHandler(event)} />

                                </div>
                                <div className="col-sm-2"></div>
                            </div>

                            <br />

                            <div className="row">
                                <div className="col-sm-1"></div>
                                <div className="col-sm-3">
                                    <h6>Transport Charges</h6>
                                    <Input style={{ borderRadius: "8px", width: 300 }} type="text" value={query.transport} placeholder="Transport Charges" name="transport" onChange={event => formChangeHandler(event)} />
                                </div>
                                <div className="col-sm-3">
                                    <h6>Other Charges</h6>
                                    <Input style={{ borderRadius: "8px", width: 300 }} type="text" value={query.other_charges} placeholder="Other Charges" name="other_charges" onChange={event => formChangeHandler(event)} />
                                </div>
                                <div className="col-sm-5"></div>
                            </div>



                            <br /><br />
                            {/* <Button type="button" style={{ borderRadius: "10px " }} onClick={addHandler}>Add</Button><br /><br /> */}

                            <div className="row print-center ">
                                <div className="center table-responsive col-lg-10 col-md-12">
                                    <table className="table table-hover table-bordered ">
                                        <thead className="thead-light">
                                            <tr className="row">
                                                {/* <th className="col-md-2">Select Material</th> */}
                                                <th className="col-md-2">Material Name</th>
                                                <th className="col-md-2">Specifications</th>
                                                <th className="col-md-2">Rate</th>
                                                <th className="col-md-2">Discount</th>
                                                <th className="col-md-2">Quantity</th>
                                                <th className="col-md-1">Unit</th>
                                                <th className="col-md-1">Delete</th>
                                            </tr>
                                        </thead>

                                        {inputFields.map((inputField, index) => (
                                            <tbody>
                                                <tr key={index} className="row">
                                                    {/* <td className="col-md-2"><Button type="button" style={{ borderRadius: "10px " }} onClick={() => showMaterial(index)}>Select Material</Button></td> */}
                                                    <td className="col-md-2"><p style={{ marginTop: "10px" }}>{inputField.mat_name}</p></td>
                                                    <td className="col-md-2"><TextArea style={{ borderRadius: "8px" }}  type="text" value={inputField.description} placeholder="Specification" name="description" onChange={event => changeHandler(index, event)} /></td>
                                                    <td className="col-md-2"><Input style={{ borderRadius: "8px", marginTop: "10px" }} type="number" value={inputField.item_rate} placeholder="Rate" name="item_rate" onChange={event => changeHandler(index, event)} step="0.01" /></td>
                                                    <td className="col-md-2"><Input style={{ borderRadius: "8px", marginTop: "10px" }} type="number" value={inputField.discount} placeholder="Discount" name="discount" onChange={event => changeHandler(index, event)} step="0.01" /></td>
                                                    <td className="col-md-2"><Input style={{ borderRadius: "8px", marginTop: "10px" }} type="text" value={inputField.quantity} placeholder="Quantity" name="quantity" onChange={event => changeHandler(index, event)} /></td>
                                                    <td className="col-md-1"><p style={{ marginTop: "10px" }}>{inputField.unit}</p></td>
                                                    <td className="col-md-1"><Button danger="true" style={{ borderRadius: "10px", marginTop: "10px" }} size="small" type="button" onClick={() => { deleteRowHandler(index) }}>Delete</Button></td>
                                                </tr>
                                            </tbody>
                                        ))}
                                    </table>
                                </div>
                            </div>





                            <br /><br />
                            <div className="submit-button">
                                <Button type="submit" style={{ background: "dodgerblue", color: "white", borderRadius: "10px " }} onClick={submitHandler}>Submit</Button>
                            </div>
                        </form>
                        <br /><br />
                        {/* {searchstates.isSearchVisible ?
                    (<div>
                        <div className="row">
                            <div className="col-md-1"></div>
                            <div className="col-md-5">
                                <h6>Search Material by Category</h6>
                                <Select placeholder="Select Category"  onChange={onSearchCat}>
                                    {categories.map((category, index) => (
                                        <Option value={category.cat_id}>{category.cat_name}</Option>
                                    ))}
                                </Select>
                                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                                <Select placeholder="Select Sub Category"  onChange={onSearchSubCat}>
                                    {subcategories.map((category, index) => (
                                        <Option value={category.subcat_id}>{category.subcat_name}</Option>
                                    ))}
                                </Select>
                            </div>
                            <div className="col-md-2"> </div>
                            <div className="col-md-3">
                                <h6>Search Material by name</h6>
                                <Search placeholder="Search Material" name="mat" onChange={event => searchChangeHandler(event)} onSearch={onSearchMat} enterButton />
                            </div>
                            <div className="col-md-1"> </div>
                        </div>

                        <br /><br />
                        <div className="row">
                            <div className="col-sm-1"><p> </p></div>
                            <div className="col-sm-10"><Table  rowClassName={(record, index) => index % 2 === 0 ? 'table-row-light' :  'table-row-dark'} dataSource={materials} columns={columns} /></div>
                            <div className="col-sm-1"><p> </p></div>
                        </div>
                    </div>) : (
                        <div><p> </p></div>
                    )
                } */}




                        <h6> &nbsp;&nbsp;&nbsp;Select Items from Purchase Requisitions</h6>
                        <Table rowClassName={(record, index) => index % 2 === 0 ? 'table-row-light' : 'table-row-dark'} dataSource={reqs} columns={columns1} />


                        {/* <Table  rowClassName={(record, index) => index % 2 === 0 ? 'table-row-light' :  'table-row-dark'} dataSource={pos} columns={columspo} /> */}



                        <Modal
                            title="Requisition Details"
                            footer={[
                                <Button type="button" style={{ borderRadius: "10px " }} key="back" onClick={handleCancelDetails}>Go back</Button>,
                            ]}
                            visible={ModalDetails.details} onCancel={handleCancelDetails}
                        >
                            <table className="table table-bordered table-hover">
                                <thead>
                                    <tr>
                                        <td>Action</td>
                                        <td>Material Name</td>
                                        <td>Quantity</td>
                                        <td>Unit</td>
                                        <td>Description</td>
                                    </tr>
                                </thead>
                                <tbody>
                                    {current_items.map((item, index) => (
                                        <tr>
                                            <td><Button type="link" style={{ background: "#027c86", color: "white", borderRadius: "10px" }} onClick={() => { selectMaterial(item) }} >Select</Button></td>
                                            <td>{item.mat_name}</td>
                                            <td>{item.quantity}</td>
                                            <td>{item.unit}</td>
                                            <td>{item.description}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </Modal>

                        {/* Not sure why the following modal exists, forgot to remove maybe */}
                        {/* <Modal
                            title="Purchase Order Details"
                            footer={[
                                <Button type="button" style={{ borderRadius: "10px " }} key="back" onClick={handleCancelPO}>Go back</Button>,
                            ]}
                            visible={ModalDetails.po} onCancel={handleCancelPO}
                        >
                            <table className="table table-bordered table-hover">
                                <thead>
                                    <tr>
                                        <td>Material Name</td>
                                        <td>Quantity</td>
                                        <td>Unit</td>
                                        <td>Rate</td>
                                    </tr>
                                </thead>
                                <tbody>
                                    {current_items.map((item, index) => (
                                        <tr>
                                            <td>{item.mat_name}</td>
                                            <td>{item.quantity}</td>
                                            <td>{item.unit}</td>
                                            <td>{item.item_rate}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </Modal> */}
                        <div className="row">
                            <div className="col-sm-10"><p> </p></div>
                            <div className="col-sm-1"><Button type="link" style={{ background: "#027c86", color: "white", borderRadius: "10px" }} className="float-right" onClick={refreshHandler}>Refresh</Button></div>
                            <div className="col-sm-1"><p> </p></div>
                        </div>
                        <br /><br /><br /><br />
                        <BackFooter />
                    </div>
                }
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


export default PurchaseOrder;