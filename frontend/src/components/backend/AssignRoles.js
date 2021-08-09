// import React, { useState,useEffect } from 'react';
// import axios from 'axios';
// import { Input, Button, message, Select } from 'antd';
// import Footer from '../sections/Footer';

// function NewUser() {
//     const baseUrl = 'http://localhost:8000/';


//     const [formvalue, SetFormvalue] = useState({
//         user: "",
//         role: "",
//     })

//     const [updateflag, setFlag] = useState(false)

//     const [rolesList, setRolesList] = useState([])
//     const [userList, setUserList] = useState([])
//     useEffect(() => {
//         axios.get(baseUrl.concat("role/"))
//             .then(res => {
//                 setRolesList(res.data);
//             })
//         axios.get(baseUrl.concat("user/"))
//             .then(res => {
//                 setUserList(res.data)
//             })
//         setTimeout(() => {
//             return 0;
//         }, 200);
//     }, [])

//     const ChangeHandlerUser = (value) => {
//         SetFormvalue({ ...formvalue, user: value })
//         axios.get(baseUrl.concat("user/" + value))
//             .then(response => {
//                 console.log(response)
//             })
//             .catch(error => {
//                 console.log(error)
//             })
//     }

//     const ChangeHandlerRole = (value) => {
//         SetFormvalue({ ...formvalue, role: value })
//     }


//     const HandleSubmit = (e) => {
//         const key = 'updatable';
//         e.preventDefault()
//         console.log(formvalue)
//         if( updateflag){

//         } else {
//             axios.post(baseUrl.concat("userdata"), formvalue)
//             .then(res => {
//                 message.success("Roles updated Successfully")
//                 console.log(res)
//             })
//             .catch(function (error) {
//                 console.log("FFFF");
//             })
//         }
       

//     }

//     const { Option } = Select;

//     return (
//         <div>
//             <div className="container col-md-6 col-xl-3">
//                 <br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br />
//                 <h3>Select Role for the user</h3>
//                 <form onSubmit={event => HandleSubmit(event)}>
//                     <div>
//                         <Select placeholder="Select User" style={{ width: 300 }} onChange={ChangeHandlerUser}>
//                             {rolesList.map((rolez, index) => (
//                                 <Option value={rolez.role}>{rolez.role}</Option>
//                             ))}
//                         </Select><br /><br />
//                     </div>
//                     <div>
//                         <Select placeholder="Assign Role" style={{ width: 300 }} onChange={ChangeHandlerRole}>
//                             {rolesList.map((rolez, index) => (
//                                 <Option value={rolez.role}>{rolez.role}</Option>
//                             ))}
//                         </Select><br /><br />
//                     </div>
//                     <div>
//                         <Button type="submit" onClick={event => HandleSubmit(event)}> Submit </Button>
//                     </div>
//                 </form> <br /><br /><br /><br /><br /><br />
//                 <img src="assets/img/final_logo_PNG.png" width="200px" alt="logo" /><br /><br /><p>MIS system</p><br /> <br /><br /><br /><br />
//             </div>
//             <Footer />
//         </div>
//     )
// }

// export default NewUser;