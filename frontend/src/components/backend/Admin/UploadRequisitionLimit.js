import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Input, Button, message, Select, Spin } from 'antd';
import BackFooter from './../BackFooter';
import NotFound from './../../NotFound';
import jwt_decode from 'jwt-decode';
import PageNotFound from './../../PageNotFound';
import * as XLSX from 'xlsx';


function UploadRequisitionLimit() {
    const baseUrl = 'http://localhost:8000/';

    const [l, setloggedin] = useState(true);
    const [r, setR] = useState(false);

    const [proj, setProj] = useState(0);
    const [projects, setProjects] = useState([]);
    const [mats, setMats] = useState([]);
    const [errorVar, setErrorVar] = useState(false);
    const [uploadVisibility, setUploadVisibility] = useState(false);
    const [visibilty, setVisibility] = useState(false);
    const [isAdmin, setAdmin] = useState(false);

    useEffect(() => {
        if (localStorage.getItem("token")) {
            axios.defaults.headers.common["Authorization"] = `JWT ${localStorage.getItem('token')}`;

            axios.get(baseUrl.concat("userdata/?user=" + jwt_decode(localStorage.getItem("token")).user_id))
                .then(res => {

                    if (res.data[0].role === "admin") {
                        setAdmin(true);
                    }
                })
                .then(() => {
                    axios.get(baseUrl.concat("projects"))
                        .then(resProj => {
                            setProjects(resProj.data);
                        })
                        .then(() => {
                            setR(true);
                        })
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
        }

        setTimeout(() => {
            return 0;
        }, 50);
    }, [])





    const onChangeProject = (value) => {
        setProj(value);
        setUploadVisibility(true);
    }

    const ChangeHandler = (e) => {
        e.preventDefault();

        var files = e.target.files, f = files[0];
        var reader = new FileReader();
        reader.onload = function (e) {
            var data = e.target.result;
            var workbook = XLSX.read(data, {
                type: "binary"
            });
            workbook.SheetNames.forEach(sheet => {
                let rowObject = XLSX.utils.sheet_to_row_object_array(
                    workbook.Sheets[sheet]
                );
                console.log(rowObject);
                setMats(rowObject);
                setVisibility(true);
            })
        };
        reader.readAsBinaryString(f)
    }

    const postRequestIndividual = (obj) => {
        axios.post(baseUrl.concat("reqlimit/"), { project_id: proj, mat_id: obj.mat_id, mat_name: obj.mat_name, unit: obj.unit, hsn_id: obj.hsn_id, utilized: 0, quantity: obj.quantity })
            .catch(err => {
                setErrorVar(true);
                console.log(err);
            })
    }

    const submitHandler = (e) => {
        e.preventDefault();
        const key = 'updatable';
        message.loading({ content: 'Processing...', key });
        for (var i = 0; i < mats.length; i++) {
            postRequestIndividual(mats[i]);
        }
        setTimeout(() => {
            if (errorVar) {
                message.error({ content: `Could not add limits for some Materials`, key, duration: 2 });
            } else {
                message.success({ content: "Limits added successfully. Limits can be edited later.", key, duration: 2 })
            }
            setVisibility(false);
            setUploadVisibility(false);
            setMats([]);
        }, 2000)

    };


    const { Option } = Select;
    if (l && r) {
        return (
            <div>
                {isAdmin ?
                    <div>
                        <br /><br /><br /><br />
                        <h4 className="page-title">Upload Material Limit for new Project</h4>
                        <br /><br /><br /><br /><br />
                        <div className="container col-md-6 col-xl-3">
                            <form onSubmit={event => submitHandler(event)}>
                                <div>
                                    <h6>Select Project</h6>
                                    <Select style={{ width: 300 }} placeholder="Select Project" onChange={onChangeProject}>
                                        {projects.map((project, index) => (
                                            <Option value={project.id}>{project.project_name}</Option>
                                        ))}
                                    </Select>
                                </div>
                                {uploadVisibility ?
                                    <div>
                                        <br /><br />
                                        <h6>Select Excel File :</h6>
                                        <Input style={{ borderRadius: "8px", width: 300 }} type="file" onChange={event => ChangeHandler(event)} /> <br /><br />
                                    </div>
                                    :
                                    <p />
                                }
                            </form>
                        </div>

                        {
                            visibilty ?

                                mats.length !== 0 ?
                                    <div>
                                        <br /><br />
                                        <div className="row">
                                            <div className="col-md-1" />
                                            <div className="col-md-10">
                                                <table className="table table-bordered table-hover print-center">
                                                    <thead>
                                                        <tr>
                                                            <td>Material ID</td>
                                                            <td>Material Name</td>
                                                            <td>Quantity Limit</td>
                                                            <td>Unit</td>
                                                        </tr>
                                                    </thead>
                                                    {mats.map((r, index) => (
                                                        <tbody>
                                                            <tr key={index}>
                                                                <td>{r.mat_id}</td>
                                                                <td>{r.mat_name}</td>
                                                                <td>{r.quantity}</td>
                                                                <td>{r.unit}</td>
                                                            </tr>
                                                        </tbody>
                                                    ))}
                                                </table>
                                            </div>
                                            <div className="col-md-1" />
                                        </div>
                                        <div className="submit-button">
                                            <Button type="submit" style={{ background: "dodgerblue", color: "white", borderRadius: "10px " }} onClick={submitHandler}>Submit</Button>
                                        </div>
                                    </div>
                                    :
                                    <p />


                                :
                                <p />
                        }

                        <br /><br /><br /><br />
                        <BackFooter />
                    </div >
                    : <PageNotFound />
                }
            </div >
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

export default UploadRequisitionLimit;