import React, { Component } from 'react';
// import { Link } from 'react-router-dom';
import '../../App.css'

class BackFooter extends Component {
    render() {
        return (

            <footer id="footer">
                <div className="container d-md-flex py-4">

                    <div className="mr-md-auto text-center text-md-left">
                        <div className="copyright">
                            &copy; Copyright <strong><span>PCTPPL</span></strong>. All Rights Reserved
                        </div>
                        <div className="credits">
                            Made with ❤ by <a href="https://github.com/prajwalpatankar"><strong><span>PCTPPL </span></strong>Web Team. <br /></a>
                        </div>

                    </div>
                    <div className="social-links text-center text-md-right pt-3 pt-md-0">
                        <img src="assets/img/final_logo_PNG.png" height="50px" alt="LOGO" />
                    </div>
                </div>
            </footer>
        );
    }
}

export default BackFooter;