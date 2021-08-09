import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Button, message, Input, Table, Space, Select, Modal } from 'antd';
import NotFound from './../NotFound';
import BackFooter from './BackFooter';

function PurchaseOrder() {

    const baseUrl = "http://localhost:8000/"

    const [inputFields, setInputField] = useState([
        {
            mat_id: "",
            mat_name: "----",
            quantity: "",
            unit: "---",
            item_rate: "",
        },
    ]);

    const [query, setQuery] = useState({
        po_id: "",
        project_id: "",
        initialItemRow: [],
        delivery_loc: "",
        supp_id: "",
    });

    const [suppliers, setSuppliers] = useState([]);
    const [projects, setProjects] = useState([]);

    // const [materials, setMaterials] = useState([]); //initially set materials empty
    // const [subcategories, setSubCategories] = useState([]);
    // const [categories, setCategories] = useState([]);
    const [reqs, setReqs] = useState([]);
    // const [pos, setPos] = useState([]);
    const [l, setloggedin] = useState(true);

    useEffect(() => {
        if (localStorage.getItem("token")) {
            axios.defaults.headers.common["Authorization"] = `JWT ${localStorage.getItem('token')}`;
        } else {
            delete axios.defaults.headers.common["Authorization"];
        }
        axios.get(baseUrl.concat("projects"))
            .then(res => {
                setProjects(res.data);
            })
            .catch(error => {
                console.log(error.response.status)
                if (error.response.status === 401) {
                    localStorage.removeItem('token')
                    setloggedin(false);
                }
            })




        axios.get(baseUrl.concat("supplier"))
            .then(res => {
                setSuppliers(res.data);
            })

        // axios.get(baseUrl.concat("po"))
        //     .then(res => {
        //         setPos(res.data);
        //     })

        setTimeout(() => {
            return 0;
        }, 200);
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
                    <Button type="link" onClick={() => { showModalDetails(record) }}>View Details</Button>
                </Space>
            ),
        },
        {
            title: 'Requisition Date',
            dataIndex: 'created_date_time',
            key: 'created_date_time',
            render: (text) => (
                <p>{text.substring(0,10).toString().split("-").reverse().join("/")}</p>
            ),
        },
        {
            title: 'Completed',
            key: 'completed',
            render: (text, record, index) => (
                <Space size="middle">
                    <Button type="primary" onClick={() => { markCompleted(record, index) }}>Mark as Completed</Button>
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
    //                 <Button type="link" onClick={() => { showModalPO(record) }}>View Details</Button>
    //             </Space>
    //         ),
    //     },
    //     {
    //         title: 'Action',
    //         key: 'action',
    //         render: (text, record) => (
    //             <Space size="middle">
    //                 <Button type="link" onClick={handlePrint}>Print</Button>
    //             </Space>
    //         ),
    //     },
    // ];




    const onChangeSupplier = (value) => {
        setQuery({ ...query, supp_id: value });
    }

    const onChangeProject = (value) => {  //for outer form
        setQuery({ ...query, project_id: value });
        axios.get(baseUrl.concat("requisition/?project_id=" + value + "&completed=N&isaprroved_master=Y"))
            .then(res => {
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
                message.success("Purchase Requisition Complete");
            })
        const values = [...reqs];
        values.splice(index, 1);
        setReqs(values);
    }




    const submitHandler = (e) => {
        e.preventDefault();
        console.log(query)
        var len = inputFields.length;
        if(inputFields[len-1].mat_name === "----" ){
            message.error("Material not selected in last row!")
            return;
        }
        axios.post(baseUrl.concat("po/"), query)
            .then(response => {
                message.open({
                    type: 'success',
                    content: <p>Purchase Order Successful. <Button type="link" onClick={handlePrint}>Click here to Print</Button></p>,
                    duration: 10,
                });
                // message.success("Purchase Order Made successfully", 5)
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
                    delivery_loc: "",
                })
                setInputField([
                    {
                        mat_id: "",
                        mat_name: "----",
                        quantity: "",
                        unit: "---",
                        item_rate: "",
                    },
                ])
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

    const addHandler = () => {
        var len = inputFields.length;
        if ((len !== 0) && (inputFields[len - 1].mat_name === "----")) {
            message.error("Please update exissting row before adding another row");
            return;
        }
        setInputField([...inputFields, {
            mat_id: "",
            mat_name: "----",
            quantity: "",
            unit: "---",
            item_rate: "",
        }])
    }

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

    const handleCancelPO = () => {
        setModalDetails({ ...ModalDetails, po: false })
    }

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
                mat_name: record.mat_name,
                quantity: record.quantity,
                unit: record.unit,
                item_rate: "",
            }])
        } else {
            setInputField([...inputFields, {
                mat_id: record.mat_id,
                mat_name: record.mat_name,
                quantity: record.quantity,
                unit: record.unit,
                item_rate: "",

            }])
        }

    }

    // --------------------------------------------------------------------
    // Antd Configs

    // const { Search } = Input;
    const { Option } = Select;
    const { TextArea } = Input;


    // --------------------------------------------------------------------
    // Print Api

    const handlePrint = () => {
        console.log("Printing....")
    }

    // --------------------------------------------------------------------
    // html
    if (l) {
        return (
            <div>
                <br /><br /><br /><br /><br /><br /><br /><br /><br />
                <form onSubmit={submitHandler}>
                    <Select style={{ width: 300 }} placeholder="Select Project" onChange={onChangeProject}>
                        {projects.map((project, index) => (
                            <Option value={project.id}>{project.project_name}</Option>
                        ))}
                    </Select>
                    {/* <Input type="text" value={query.project_name} placeholder="project_name" name="project_name" onChange={event => formChangeHandler(event)} className="col-md-2" /> */}
                    &nbsp;
                    <Select
                        showSearch
                        style={{ width: 300 }}
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
                    <br /><br />
                    <TextArea rows={4} placeholder="Delivery Location" style={{ width: 300 }} value={query.delivery_loc} name="delivery_loc" onChange={event => formChangeHandler(event)} />
                    {/* <Input type="text" value={query.supp_id} placeholder="Supplier" name="supp_id" onChange={event => formChangeHandler(event)} className="col-md-2" /> */}
                    <br /><br /><br /><br />
                    <Button type="button" onClick={addHandler}>Add</Button><br /><br />

                    <div className="row">
                        <div className="col-md-1"><p> </p></div>
                        <div className="table-responsive col-md-10">
                            <table className="table table-hover table-bordered">
                                <thead>
                                    <tr className="info">
                                        <div className="row">
                                            {/* <th className="col-md-2">Select Material</th> */}
                                            <th className="col-md-3">Material Name</th>
                                            <th className="col-md-4">Rate</th>
                                            <th className="col-md-1">Quantity</th>
                                            <th className="col-md-1">Unit</th>
                                            <th className="col-md-1">Delete</th>
                                        </div>
                                    </tr>
                                </thead>
                                <tbody>
                                    {inputFields.map((inputField, index) => (
                                        <tr key={index}>
                                            <div className="row">
                                                {/* <td className="col-md-2"><Button type="button" onClick={() => showMaterial(index)}>Select Material</Button></td> */}
                                                <td className="col-md-3">{inputField.mat_name}</td>
                                                <td className="col-md-4"><Input type="number" value={inputField.item_rate} placeholder="Rate" name="item_rate" onChange={event => changeHandler(index, event)} step="0.01" /></td>
                                                <td className="col-md-1"><Input type="text" value={inputField.quantity} placeholder="Quantity" name="quantity" onChange={event => changeHandler(index, event)} /></td>
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
                {/* {searchstates.isSearchVisible ?
                    (<div>
                        <div className="row">
                            <div className="col-md-1"></div>
                            <div className="col-md-5">
                                <h6>Search Material by Category</h6>
                                <Select placeholder="Select Category" style={{ width: 300 }} onChange={onSearchCat}>
                                    {categories.map((category, index) => (
                                        <Option value={category.cat_id}>{category.cat_name}</Option>
                                    ))}
                                </Select>
                                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                                <Select placeholder="Select Sub Category" style={{ width: 300 }} onChange={onSearchSubCat}>
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
                            <div className="col-sm-10"><Table dataSource={materials} columns={columns} /></div>
                            <div className="col-sm-1"><p> </p></div>
                        </div>
                    </div>) : (
                        <div><p> </p></div>
                    )
                } */}


                <div className="row">
                    <div className="col-sm-10"><p> </p></div>
                    <div className="col-sm-1"><Button type="link" className="float-right" onClick={refreshHandler}>Refresh</Button></div>
                    <div className="col-sm-1"><p> </p></div>
                </div>

                <h5>Select Items from Purchase Requisitions</h5>
                <Table dataSource={reqs} columns={columns1}/>


                {/* <Table dataSource={pos} columns={columspo} /> */}



                <Modal
                    title="Requisition Details"
                    footer={[
                        <Button type="button" key="back" onClick={handleCancelDetails}>Go back</Button>,
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
                                    <td><Button type="link" onClick={() => { selectMaterial(item) }} >Select</Button></td>
                                    <td>{item.mat_name}</td>
                                    <td>{item.quantity}</td>
                                    <td>{item.unit}</td>
                                    <td>{item.description}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </Modal>


                <Modal
                    title="Purchase Order Details"
                    footer={[
                        <Button type="button" key="back" onClick={handleCancelPO}>Go back</Button>,
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
                </Modal>
                <br /><br /><br /><br />
                <BackFooter />
            </div>
        )
    } else {
        return (
            <NotFound />
        )
    }


}


export default PurchaseOrder;