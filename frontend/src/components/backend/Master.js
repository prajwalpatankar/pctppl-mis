import axios from 'axios';
import React, { Component } from 'react';
import { Modal, Button, Input, message } from 'antd';
import Table from 'react-bootstrap/Table'
import 'antd/dist/antd.css';
import NotFound from './../NotFound';
import BackFooter from './BackFooter';


class Master extends Component {
    constructor(props) {
        super(props)
        if (localStorage.getItem("token")) {
            axios.defaults.headers.common["Authorization"] = `JWT ${localStorage.getItem('token')}`;
        } else {
            delete axios.defaults.headers.common["Authorization"];
        }

        this.state = {
            message: "",
            current_req: {},
            reqs: [],
            filtered_reqs: [],
            reqs_approved: [],
            current_items: [],
            setIsModalVisible: false,
            setIsModalVisibleDetails: false,
        }
    }

    componentDidMount() {
        axios.get('http://localhost:8000/requisition/')
            .then(res => {
                const reqs = res.data;
                this.setState({ reqs });
                let filtered_reqs = reqs.filter(function (reqs) {
                    return reqs.isapproved_master === "N"
                })
                this.setState({ filtered_reqs });

                let reqs_approved = reqs.filter(function (reqs) {
                    return (reqs.isapproved_master === "Y")
                })
                this.setState({ reqs_approved });
            })
            .catch(error => {
                console.log(error.response.status)
                if (error.response.status === 401) {
                    localStorage.removeItem('token')
                    // asdd state here 
                }
            })
    }

    approveHandler = (e, requisition) => {
        e.preventDefault()
        requisition.isapproved_master = "Y"
        console.log(requisition)
        axios.put(`http://localhost:8000/requisition/${requisition.id}/`, requisition)
            .then(response => {
                console.log("response :", response)
                message.success("Requisition Approved Successfully", 5)
                this.componentDidMount()
            })
            .catch(error => [
                console.log(error)
            ])
        setTimeout(this.componentDidMount(), 300);
    }

    rejectHandler = () => {

        axios.get(`http://localhost:8000/requisition/${this.state.current_req.id}/`)
            .then(res => {
                const reqs_curr = res.data;
                console.log("this :  ", reqs_curr)
                if (reqs_curr.isapproved_master === "Y") {
                    message.error('The requisition has already been approved !');
                } else {
                    let requisition = this.state.current_req
                    requisition.message = this.state.message
                    requisition.isapproved_master = "R"
                    console.log(requisition)
                    axios.put(`http://localhost:8000/requisition/${requisition.id}/`, requisition)
                        .then(response => {
                            console.log(response)
                            this.componentDidMount()
                        })
                        .catch(error => [
                            console.log(error)
                        ])
                    this.setState({ setIsModalVisible: false, message: "" });
                    setTimeout(this.componentDidMount(), 300);
                }
            })
    }

    handleChange = (e) => {
        this.setState({ message: e.target.value })
    }

    showModal = (e, requisition) => {
        this.setState({ setIsModalVisible: true, current_req: requisition });
        console.log(requisition)
    };

    showModalDetails = (e, requisition) => {
        this.setState({ setIsModalVisibleDetails: true, current_items: requisition.initialItemRow });
        console.log(this.state)
    };

    handleCancel = () => {
        this.setState({ setIsModalVisible: false });
    };

    handleCancelDetails = () => {
        this.setState({ setIsModalVisibleDetails: false });
    };


    render() {
        const length1 = this.state.filtered_reqs.length
        if (localStorage.getItem('token')) {
            return (
                <div><br /><br /><br /><br /><br /><br /><br />
                    {/* {this.state.filtered_reqs.map((requisition, index) => (
                    <p>
                        {requisition.req_id}
                        <button type="submit" onClick={(e) => { this.approveHandler(e, requisition) }}>Approve</button>
                        &nbsp; &nbsp; &nbsp;
                        <button type="submit" onClick={(e) => { this.rejectHandler(e, requisition) }}>Reject</button>
                        &nbsp; &nbsp; &nbsp;


                        <Button type="primary" onClick={(e) => this.showModal(e, requisition)}>
                            Reject
                        </Button>
                    </p>
                ))} */}
                    <h3>Pending Approvals</h3>
                    <div className="row">
                        <div className="col-md-1"><p> </p></div>
                        <Table className=" table table-bordered table-hover col-md-10">
                            <thead>
                                <tr>

                                    <th> #</th>
                                    <th>ID</th>
                                    <th>Details</th>
                                    <th>Approve</th>
                                    <th>Reject</th>
                                </tr>
                            </thead>
                            {length1 ? (
                                <tbody>
                                    {this.state.filtered_reqs.map((requisition, index) => (
                                        <tr>
                                            <td> {index + 1}</td>
                                            <td>{requisition.req_id}</td>
                                            <td><Button type="link" onClick={(e) => { this.showModalDetails(e, requisition) }}>view details</Button></td>
                                            <td><Button type="submit" size="small" onClick={(e) => { this.approveHandler(e, requisition) }}>Approve</Button></td>
                                            <td><Button type="submit" size="small" danger="true" onClick={(e) => { this.showModal(e, requisition) }}>Reject</Button></td>
                                        </tr>
                                    ))}
                                </tbody>
                            ) : (
                                <tbody>
                                    <tr>
                                        <td>-</td>
                                        <td>-</td>
                                        <td>No pending approvals</td>
                                        <td>-</td>
                                        <td>-</td>
                                    </tr>
                                </tbody>
                            )}
                        </Table>


                        <div className="col-md-1"><p> </p></div>


                    </div>


                    <Modal
                        title="Reject Requisition ?"
                        visible={this.state.setIsModalVisible}
                        footer={[
                            <Button type="button" key="back" onClick={this.handleCancel}>Go back</Button>,
                            <Button type="button" danger="true" onClick={this.rejectHandler}>Reject</Button>
                        ]}
                        onCancel={this.handleCancel}
                    >
                        <Input.TextArea rows={4} value={this.state.message} placeholder="Necessary Changes" onChange={this.handleChange} />
                    </Modal>

                    <Modal
                        title="Requisition Details"
                        footer={[
                            <Button type="button" key="back" onClick={this.handleCancelDetails}>Go back</Button>,
                        ]}
                        visible={this.state.setIsModalVisibleDetails} onCancel={this.handleCancelDetails}
                    >
                        <Table className="table table-bordered table-hover">
                            <thead>
                                <tr>
                                    <td>Material Name</td>
                                    <td>Quantity</td>
                                    <td>Unit</td>
                                    <td>Description</td>
                                </tr>
                            </thead>
                            <tbody>
                                {this.state.current_items.map((item, index) => (
                                    <tr>
                                        <td>{item.mat_name}</td>
                                        <td>{item.quantity}</td>
                                        <td>{item.unit}</td>
                                        <td>{item.description}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </Table>
                    </Modal>
                    <br /><br /><br />
                    <hr />
                    <br /><br /><br /><br /><br />
                    <h3>Recently Approved Requisitions</h3>
                    <div className="row">
                        <div className="col-md-1"><p> </p></div>
                        <Table className="col-md-10">
                            <thead>
                                <tr>
                                    <th>#</th>
                                    <th>ID</th>
                                    <th>Details</th>
                                    <th>Make Changes</th>
                                </tr>
                            </thead>
                            <tbody>
                                {this.state.reqs_approved.map((requisition, index) => (
                                    <tr>
                                        <td>{index + 1}</td>
                                        <td>{requisition.req_id}</td>
                                        <td><Button type="link" onClick={(e) => { this.showModalDetails(e, requisition) }}>view details</Button></td>
                                        <td><Button type="link" danger="true" onClick={(e) => { this.showModal(e, requisition) }}>Change</Button></td>
                                    </tr>
                                ))}
                            </tbody>
                        </Table>
                        <div className="col-md-1"><p> </p></div>
                    </div>
                    <br /><br /><br /><br />
                    <BackFooter />
                </div>

            );
        } else {
            console.log("NOT SIGNED IN")
            return (
                <NotFound />
            )
        }
    }
}

export default Master;
