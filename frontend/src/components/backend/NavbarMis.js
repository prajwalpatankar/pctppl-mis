import React, { useState, useEffect } from 'react';
import { Navbar, Nav } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import './../../App.css';
import axios from 'axios';
import { message } from 'antd';
import jwt_decode from 'jwt-decode';


function  NavbarMis() {
    const baseUrl = 'http://localhost:8000/';
    const [l,setL] = useState(false);

    useEffect(() => {
        if (localStorage.getItem("token")) {
            axios.defaults.headers.common["Authorization"] = `JWT ${localStorage.getItem('token')}`;
            axios.get(baseUrl.concat("userdata/?user=" + jwt_decode(localStorage.getItem("token")).user_id))
                .then(res => {
                    setL(true)
                })
                .catch(error => {
                    if (error.response.status === 401) {
                        localStorage.removeItem('token')
                    }
                })
        }
        setTimeout(() => {
            return 0;
        }, 200);
    }, [])


    const handleLogout = () => {
        delete axios.defaults.headers.common["Authorization"];
        localStorage.removeItem('token');
        message.success("Successfully Logged Out")
        setL(false);
    }

    if (l) {
        // if (this.state.isMobile) {
        //     return (
        //         <div className="nav-display">
        //             <Navbar fixed="top" bg="white" expand="lg">
        //                 <Navbar.Brand><Link to="/"><img src="assets/img/final_logo_PNG.png" alt="pctppl_logo" height="60px" /></Link></Navbar.Brand>
        //                 <Navbar.Toggle aria-controls="basic-navbar-nav" />
        //                 <Navbar.Collapse id="basic-navbar-nav">
        //                     <Nav className="mr-auto mobile-nav-ul-pp">
        //                         <Nav.Link><Link to="/1Menu"><h6>Main Menu</h6></Link></Nav.Link>
        //                         <Nav.Link onClick={this.handleLogout}><Link to="/"><h6>Log Out</h6></Link></Nav.Link>
        //                     </Nav>
        //                 </Navbar.Collapse>
        //             </Navbar>
        //             {/* <Navbar fixed="top" bg="white" expand="lg">
        //                 <Navbar.Brand><Link to="/"><img src="assets/img/final_logo_PNG.png" alt="pctppl_logo" height="60px" /></Link></Navbar.Brand>
        //                 <Nav.Link><Link to="/1Menu"><h6>Main Menu</h6></Link></Nav.Link>
        //                 <Nav.Link onClick={this.handleLogout}><Link to="/"><h6>Log Out</h6></Link></Nav.Link>
        //             </Navbar> */}
        //         </div>
        //     )
        // }
        // else {
            return (
                <div className="nav-display">
                    <header id="header" className="fixed-top">
                        <div className="container d-flex align-items-center">
                            <h1 className="logo mr-auto"><Link to="/"><img src="assets/img/final_logo_PNG.png" alt="pctppl_logo"></img></Link></h1>
                            <nav className="nav-menu d-none d-lg-block">
                                <ul>
                                    <li className="nav-item"><Link to="/1Menu">Main Menu</Link></li>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                                    <li className="nav-item" onClick={handleLogout}><Link to="/">Log Out</Link></li>
                                </ul>
                            </nav>
                        </div>
                    </header>
                </div>
            );
        // }
    } else {
        // if (this.state.isMobile) {
        //     return (
        //         <div>
        //             <Navbar fixed="top" bg="white" expand="lg">
        //                 <Navbar.Brand><Link to="/"><img src="assets/img/final_logo_PNG.png" alt="pctppl_logo" height="60px" /></Link></Navbar.Brand>
        //             </Navbar>
        //         </div>
        //     )
        // }
        // else {
            return (
                <div>
                    <header id="header" className="fixed-top">
                        <div className="container d-flex align-items-center">
                            <h1 className="logo mr-auto"><Link to="/"><img src="assets/img/final_logo_PNG.png" alt="pctppl_logo"></img></Link></h1>
                        </div>
                    </header>
                </div>
            );
        // }
    }
}






// class NavbarMis extends Component {
//     constructor(props) {
//         super(props);
//         this.state = { isMobile: false };
//         if (window.innerWidth < 1000) {
//             this.state = { isMobile: true };
//         }
//     }
//     componentDidMount() {
//         window.addEventListener('resize', () => {   //check screensize
//             this.setState({
//                 isMobile: window.innerWidth < 1000
//             });
//         }, false);

//     }
// }


export default NavbarMis;