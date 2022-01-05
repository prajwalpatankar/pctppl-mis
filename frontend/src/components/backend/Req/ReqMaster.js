import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Button, message, Input, Table, Space, Select, Modal, Spin, notification } from 'antd';
import { EditOutlined, CheckSquareFilled, DeleteOutlined } from '@ant-design/icons';
import NotFound from './../../NotFound';
import { baseUrl } from './../../../constants/Constants';
import BackFooter from './../BackFooter';
import jwt_decode from "jwt-decode";
import PageNotFound from '../../PageNotFound';

function ReqMaster() {

    // --------------------------------------------------------------------
    // Base Urls

    // const baseUrl = "http://localhost:8000/"

    // --------------------------------------------------------------------
    // states
    const [l, setloggedin] = useState(true);
    const [r, setR] = useState(false);
    const [isAdmin, setAdmin] = useState(false);

    const [projects, setProjects] = useState([]);
    const [projectsAll, setProjectsAll] = useState([]);
    const [req, setReq] = useState([]);
    const [rows, setRows] = useState([]);
    // const [reqlimit, setReqLimit] = useState([]);
    const [query, setQuery] = useState({
        id: "",
        mat_id: "",
        mat_name: "",
        utilized: "",
        quantity: "",
        unit: "",
        project_id: "",
        initialItemRow: [],
    });

    useEffect(() => {
        if (localStorage.getItem("token")) {
            axios.defaults.headers.common["Authorization"] = `JWT ${localStorage.getItem('token')}`;

            axios.get(baseUrl.concat("userdata/?user=" + jwt_decode(localStorage.getItem("token")).user_id))
                .then(res => {
                    if (res.data[0].role === "admin") {
                        setAdmin(true);
                        axios.get(baseUrl.concat("projects"))
                            .then(res => {
                                setProjects(res.data);
                                setProjectsAll(res.data);
                                axios.get(baseUrl.concat("requisition"))
                                    .then(resR => {
                                        resR.data.sort(function (a, b) {
                                            return b.id - a.id;
                                        });
                                        let filtered_reqs = resR.data.filter(function (r) {
                                            return r.isapproved_master === "N"
                                        })
                                        setReq(filtered_reqs);
                                    })
                                    .then(() => {
                                        setR(true);
                                    })
                            })
                    } else {
                        setR(true);
                    }
                })
                .catch(error => {
                    console.log(error.response.status)
                    if (error.response.status === 401) {
                        localStorage.removeItem('token')
                        setloggedin(false);
                        setR(true);
                    }
                })
        } else {
            setloggedin(false);
            delete axios.defaults.headers.common["Authorization"];
            setR(true);
        }

        setTimeout(() => {
            return 0;
        }, 50);
    }, [])


    // --------------------------------------------------------------------
    // AntD table columns

    const columns = [
        {
            title: 'Project',
            dataIndex: 'project_id',
            key: 'project_id',
            render: (text, record) => <p>{(projectsAll.find(p => p.id === text)).project_name}</p>,
        },
        {
            title: 'Requisition Id',
            dataIndex: 'req_id',
            key: 'req_id',
        },
        {
            title: 'Date',
            dataIndex: 'created_date_time',
            key: 'created_date_time',
            render: (text) => <p>{text.substring(8, 10)}-{text.substring(5, 7)}-{text.substring(0, 4)}</p>,
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
            title: 'Approve',
            key: 'approve',
            render: (text, record) => (
                <Space size="middle">
                    <Button type="primary" onClick={() => { showModalDetails(record) }}>Approve</Button>
                </Space>
            ),
        },
    ];

    // --------------------------------------------------------------------
    // Modal

    const [ModalDetails, setModalDetails] = useState(false);
    const [quantChangeArr, setQuantChangeArr] = useState([]);
    const [updateCounter, setUpdateCounter] = useState([]);
    const [deleteWatcher, setDeleteWatcher] = useState([]);

    const handleCancelDetails = () => {
        setModalDetails(false);
    }


    const showModalDetails = (record) => {
        setDeleteWatcher([]);
        // create new array, set everything false for all items, and 0 to check unaltered values
        var falseArray = new Array(record.initialItemRow.length).fill(false);
        setQuantChangeArr(falseArray);
        var zeroArray = new Array(record.initialItemRow.length).fill({ count: 0 });
        setUpdateCounter(zeroArray);
        // axios.get(baseUrl.concat("reqlimit/?project_id=" + record.project_id))
        //     .then(res => {
        //         setReqLimit(res.data);
        //     })
        setModalDetails(true);
        // pass by value (copy)
        let values = JSON.parse(JSON.stringify(record));
        let rowValues = JSON.parse(JSON.stringify(record.initialItemRow));
        setQuery(values);
        setRows(rowValues);
    }


    const handleQuantityChange = (index, event) => {   //inner form 
        const values = [...rows];
        values[index][event.target.name] = event.target.value;
        setRows(values);
    }

    const handleIndividitualQuantityChange = (index, event) => {   //inner form 
        const values = [...quantChangeArr];
        values[index] = !values[index]
        setQuantChangeArr(values);
    }

    const saveIndividitualQuantityChange = (index, event) => {   //inner form 

        // query.initialItemRow[index] is original item
        // rows[index] is the changed item

        if (parseFloat(query.initialItemRow[index].quantity) !== parseFloat(rows[index].quantity)) {
            var difference = parseFloat(rows[index].quantity) - parseFloat(query.initialItemRow[index].quantity);
            console.log(difference);
            console.log("changed")
            axios.get(baseUrl.concat("reqlimit/?project_id=" + query.project_id + "&mat_id=" + query.initialItemRow[index].mat_id))
                .then(resLimit => {

                    if (parseFloat(resLimit.data[0].utilized) + parseFloat(difference) > resLimit.data[0].quantity) {
                        message.error("Requisition Quantity not allowed");
                    }
                    else {

                        // const prevQuery = {...query};
                        // prevQuery.initialItemRow[index] = rows[index];
                        // setQuery(prevQuery);

                        message.success("Please click 'Approve' to save changes");

                        const counter = [...updateCounter];
                        counter[index] = {
                            ...resLimit.data[0],
                            count: 1,
                            utilized: (parseFloat(resLimit.data[0].utilized) + parseFloat(difference)),
                        };
                        setUpdateCounter(counter);

                        const values = [...quantChangeArr];
                        values[index] = false
                        setQuantChangeArr(values);
                    }

                    // axios.patch(baseUrl.concat("reqlimit/" + resLimit.data[0].id +"/"), { ...resLimit.data[0], utilized: (parseFloat(resLimit.data[0].utilized) + parseFloat(difference)) })
                    // .then(res => {
                    //     console.log(res)
                    // })
                })

        } else {
            console.log("NC");
            const values = [...quantChangeArr];
            values[index] = false
            setQuantChangeArr(values);

            const counter = [...updateCounter];
            counter[index] = { count: 0 };
            setUpdateCounter(counter);


        }
    }


    const deleteItem = (index, key) => {
        const valuesDelete = [...rows];
        const backupDeletedItem = [...deleteWatcher];        
        backupDeletedItem.push(valuesDelete[index]);
        valuesDelete.splice(index,1);
        setRows(valuesDelete);
        setDeleteWatcher(backupDeletedItem);
        message.success("Item Deleted from requisition, Please Click approve to save changes");
        notification.close(key);
    }


    const deleteItemConfirmation = (index, event) => {
        const key = `open${Date.now()}`;
        const btn = (
            <Button style={{ color: "red" }} size="small" onClick={() => deleteItem(index, key)}>
                Delete
            </Button>
        );
        notification.open({
            message: `Delete Item  ?`,
            description:
                `Are you sure you want to delete item ${query.initialItemRow[index].mat_name} from the requisition ? `,
            btn,
            key,
            closable: true,
        });
    }






    // --------------------------------------------------------------------
    // Form change handlers

    const onChangeProject = (value, index) => {
        axios.get(baseUrl.concat("requisition/?project_id=" + value))
            .then(resR => {
                resR.data.sort(function (a, b) {
                    return b.id - a.id;
                });
                let filtered_reqs = resR.data.filter(function (r) {
                    return r.isapproved_master === "N"
                })
                setReq(filtered_reqs);
            })
            .then(() => {
                setR(true);
            })
    }

    const allProjects = () => {
        axios.get(baseUrl.concat("requisition/"))
            .then(resR => {
                resR.data.sort(function (a, b) {
                    return b.id - a.id;
                });
                let filtered_reqs = resR.data.filter(function (r) {
                    return r.isapproved_master === "N"
                })
                setReq(filtered_reqs);
            })
            .then(() => {
                setR(true);
            })
    }


    // --------------------------------------------------------------------
    // Submission

    const quantityDeleter = (item) => {
        console.log(item)
        axios.get(baseUrl.concat("reqlimit/?project_id=" + query.project_id + "&mat_id=" + item.mat_id))
        .then(reqResponse => {
            axios.patch(baseUrl.concat("reqlimit/" + reqResponse.data[0].id + "/"), { utilized: ( parseFloat(reqResponse.data[0].utilized) - parseFloat(item.quantity) ) })
            .then(res => {
                console.log(res);
            })
        })
    }



    const quantityUpadater = (item) => {

        axios.patch(baseUrl.concat("reqlimit/" + item.id + "/"), { utilized: item.utilized })
            .then(res => {
                console.log(res)
            })

    }


    const submitHandler = () => {

        for (var j = 0; j < quantChangeArr.length; j++) {
            if (quantChangeArr[j] === true) {
                message.error("Please confirm quantity by clicking save");
                return;
            }
        }

        const key = 'updatable';
        message.loading({ content: 'Processing...', key });

        for(var k=0; k < deleteWatcher.length; k++){
            quantityDeleter(deleteWatcher[k]);
        }


        for (var i = 0; i < query.initialItemRow.length; i++) {
            if (updateCounter[i].count === 1) {
                quantityUpadater(updateCounter[i])
            }
        }

        axios.patch(baseUrl.concat("requisition/" + query.id + "/"), { ...query, initialItemRow: rows, isapproved_master: "Y" })
            .then(() => {
                message.success({ content: 'Requisition Aprroved', key, duration: 2 });
                setModalDetails(false)
                axios.get(baseUrl.concat("requisition"))
                    .then(resR => {
                        resR.data.sort(function (a, b) {
                            return b.id - a.id;
                        });
                        let filtered_reqs = resR.data.filter(function (r) {
                            return r.isapproved_master === "N"
                        })
                        setReq(filtered_reqs);
                        setRows([])
                        setQuery({
                            id: "",
                            mat_id: "",
                            mat_name: "",
                            utilized: "",
                            quantity: "",
                            unit: "",
                            project_id: "",
                            initialItemRow: [],
                        });
                    })
            })
            .catch(err => {
                console.log(err);
                message.error({ content: 'Error occured while approving requisition', key, duration: 2 });
            })
    }




    // const quantityUpadater11 = (origRow, currentRow, reqLimitArray) => {
    //     if (parseFloat(origRow.quantity) !== parseFloat(currentRow.quantity)) {
    //         var updateQuant = parseFloat(currentRow.quantity) - parseFloat(origRow.quantity);
    //         let limits = reqlimit.filter(function (o) {
    //             return o.mat_id === currentRow.mat_id
    //         })
    //         let obj = limits[0];
    //         obj.utilized = parseFloat(obj.utilized) + parseFloat(updateQuant);
    //         if (parseFloat(obj.utilized) > parseFloat(obj.quantity)) {
    //             message.error(`Requisition limit exceeds for ${obj.mat_name}`)
    //             return;
    //         }
    //         reqLimitArray.push(obj);
    //     }
    // }

    // const submitHandler11 = () => {
    //     const key = 'updatable';
    //     message.loading({ content: 'Processing...', key });
    //     var id = query.id;
    //     var origRows = query.initialItemRow;
    //     let reqLimitArray = [];
    //     for (var i = 0; i < origRows.length; i++) {
    //         // if (parseFloat(origRows[i].quantity) !== parseFloat(rows[i].quantity)) {
    //         //     var updateQuant = parseFloat(rows[i].quantity) - parseFloat(origRows[i].quantity);
    //         //     let obj = reqlimit.find(o => o.mat_id === rows[i].mat_id)
    //         //     obj.utilized = parseFloat(obj.utilized) + parseFloat(updateQuant);
    //         //     if (parseFloat(obj.utilized) > parseFloat(obj.quantity)) {
    //         //         message.error(`Requisition limit exceeds for ${obj.mat_name}`)
    //         //         return;
    //         //     }
    //         //     reqLimitArray.push(obj);
    //         //     // console.log(obj);
    //         // }
    //         quantityUpadater(origRows[i], rows[i], reqLimitArray);
    //     }
    //     for (var j = 0; j < reqLimitArray.length; j++) {
    //         axios.patch(baseUrl.concat("reqlimit/" + reqLimitArray[j].id + "/"), { utilized: reqLimitArray[j].utilized })
    //             .catch(err => {
    //                 console.log(err)
    //             })
    //     }
    //     axios.patch(baseUrl.concat("requisition/" + id + "/"), { ...query, initialItemRow: rows, isapproved_master: "Y" })
    //         .then(() => {
    //             message.success({ content: 'Requisition Aprroved', key, duration: 2 });
    //             setModalDetails(false)
    //             axios.get(baseUrl.concat("requisition"))
    //                 .then(resR => {
    //                     resR.data.sort(function (a, b) {
    //                         return b.id - a.id;
    //                     });
    //                     let filtered_reqs = resR.data.filter(function (r) {
    //                         return r.isapproved_master === "N"
    //                     })
    //                     setReq(filtered_reqs);
    //                     setRows([])
    //                     setQuery({
    //                         id: "",
    //                         mat_id: "",
    //                         mat_name: "",
    //                         utilized: "",
    //                         quantity: "",
    //                         unit: "",
    //                         project_id: "",
    //                         initialItemRow: [],
    //                     });
    //                 })
    //         })
    //         .catch(err => {
    //             console.log(err);
    //             message.error({ content: 'Error occured while approving requisition', key, duration: 2 });
    //         })
    // }

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
                {isAdmin ? <div>
                    <br /><br /><br /><br />
                    <h4 className="page-title">Approve Purchase Requisitions</h4>
                    <form onSubmit={submitHandler}>
                        <br /><br />

                        <div className="row">
                            <div className="col-sm-1"></div>
                            <div className="col-sm-10">
                                <h6>Sort by Project</h6>
                                <Select placeholder="Select Project" onChange={onChangeProject}>
                                    {projects.map((project, index) => (
                                        <Option value={project.id}>{project.project_name}</Option>
                                    ))}
                                </Select>
                                &nbsp;&nbsp;
                                <Button type="button" style={{ background: "yellowgreen", color: "white", borderRadius: "10px" }} onClick={allProjects}>All Projects</Button>
                            </div>
                            <div className="col-sm-1"></div>
                        </div>
                        <br /><br />



                        <Table rowClassName={(record, index) => index % 2 === 0 ? 'table-row-light' : 'table-row-dark'} dataSource={req} columns={columns} />
                        <br /><br />
                    </form>
                    <br /><br />

                    <br /><br /><br /><br />
                    <div className="row">
                        <div className="col-sm-10"><p> </p></div>
                        <div className="col-sm-1"><Button type="link" style={{ background: "#027c86", color: "white", borderRadius: "10px" }} className="float-right" onClick={refreshHandler}>Refresh</Button></div>
                        <div className="col-sm-1"><p> </p></div>
                    </div>
                    <br /><br /><br /><br />
                    <BackFooter />


                    <Modal
                        width={740}
                        title="Change Item Details"
                        footer={[
                            <Button type="button" style={{ borderRadius: "10px " }} key="back" onClick={handleCancelDetails}>Go back</Button>,
                            <Button type="primary" key="submit" onClick={submitHandler}>Approve</Button>,
                        ]}
                        visible={ModalDetails} onCancel={handleCancelDetails}
                    >
                        <table className="table table-bordered table-hover print-center">
                            <thead>
                                <tr>
                                    <td>Material ID</td>
                                    <td>Material Name</td>
                                    <td>Description</td>
                                    <td>Quantity Limit</td>
                                    <td>Unit</td>
                                    <td>Action</td>
                                </tr>
                            </thead>
                            {rows.map((r, index) => (
                                <tbody>
                                    <tr key={index}>
                                        <td>{r.mat_id}</td>
                                        <td>{r.mat_name}</td>
                                        <td>{r.description}</td>
                                        <td>
                                            {quantChangeArr[index]
                                                ?
                                                <Input style={{ borderRadius: "8px", width: 220 }} name="quantity" value={r.quantity} onChange={event => handleQuantityChange(index, event)} />
                                                :
                                                <p>{r.quantity}</p>
                                            }
                                        </td>
                                        <td>{r.unit}</td>
                                        <td>
                                            {quantChangeArr[index]
                                                ?
                                                <Button type="button" style={{ background: "yellowgreen", color: "white", borderRadius: "10px" }} onClick={event => saveIndividitualQuantityChange(index, event)}><CheckSquareFilled style={{ fontSize: '20px' }} /></Button>
                                                :
                                                <Button type="button" style={{ borderRadius: "10px" }} onClick={event => handleIndividitualQuantityChange(index, event)}><EditOutlined style={{ fontSize: '20px' }} /></Button>
                                            }
                                            &nbsp;&nbsp;
                                            <Button type="button" style={{ color: "red", borderRadius: "10px" }} onClick={event => deleteItemConfirmation(index, event)}><DeleteOutlined style={{ fontSize: '20px' }} /></Button>
                                        </td>

                                    </tr>
                                </tbody>
                            ))}
                        </table>
                    </Modal>
                </div>
                    :
                    <PageNotFound />
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
        console.log("NOT SIGNED IN")
        return (
            <NotFound />
        )
    }
}

export default ReqMaster;
// 328320#Pctppl

// pct user : pctppl#328320
//passphrase : prajwal

/*
Your identification has been saved in /root/.ssh/id_rsa
Your public key has been saved in /root/.ssh/id_rsa.pub
The key fingerprint is:
SHA256:qNrKAJrfEgjOkLunHqyoVwHNwQq96R04LVk3P8ic3t4 root@ubuntu-cmis-pctppl
The key's randomart image is:
+---[RSA 3072]----+
| . +..           |
|. o = o          |
| o X + =         |
|+ O + =.o        |
|*+ + +..S.       |
|*+o o.. .        |
|++ o.  . .       |
|++=+    . E      |
|B==oo            |
+----[SHA256]-----+


ssh-rsa AAAAB3NzaC1yc2EAAAADAQABAAABgQDHCR2FZ11xhhrozXD0HC6JGRo3PnBR58RdZoWuPjTXpXncz6yTc3nx8x/3YInF5YnRPgQ1hDQ9GH2dOVXJyPY7SSO5Jj/S44/7si+wPg5lXdzgr4/cuJN+5N8q0tPr+dR1AY3ZPH7eSAlv0h6k+UsUcYNq3Vpkt4JrIxENRRTgICYqvOsZ4o4FPdLAioWgQMEbD5FHlastC4bm9EZNUDfZrkPWNOxc5TkmBY9AOvE+yQOirqEawpK3M9bM7ya6Ja5aA1XQRsUR5vG/3XgX5uWQlSSCpj6xQ4guGkkAbfLfXsM8yxT7JzXbV2ooLz49kTbPxLkmjvLgSAAWqQ7pHL+EhkgevTS8bp+b3kzx6SnocrZVx3pBxrL/TpmYEE4D/hU6CW69sw7KqwRIdIHAuZy6lLA4SQSgWIpGC5XtuQOLbyDVUIMGHNnUkuMEoLyJKgvZamRiteAtP84jX4oUHqwLpy5WDPvVEB4yoDy5kXgYM5Q5DGq3Q+g4ft7InrfEE+c= pctppl@ubuntu-cmis-pctppl





*/