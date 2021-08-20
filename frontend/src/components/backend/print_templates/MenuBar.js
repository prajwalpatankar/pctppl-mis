import React from 'react';

function MenuBar() {
    return (
        <div>
            <div className="highest-z ">
                <header id="header" className="fixed-top row">
                    <div className="col-md-4 print-left">
                        <p>ID</p>
                    </div>
                    <div className="col-md-4">
                        <h1 className="logoPrint "><img src="assets/img/final_logo_PNG.png" alt="pctppl_logo"></img></h1>
                    </div>
                    <div className="col-md-4">
                        <p>Date</p>
                    </div>
                </header>
            </div>
            <br /><br /><br /><br />
        </div>
    )
}

export default MenuBar;


