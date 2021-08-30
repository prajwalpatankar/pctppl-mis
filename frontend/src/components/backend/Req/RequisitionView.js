import React from 'react';
import BackFooter from '../BackFooter';
import ViewReq from '../views/ViewReq';


function RequisitionView() {

return(
    <div>
        <br /><br /><br /><br />
        <h4 className="page-title">Purchase Requisitions</h4>
        <ViewReq />
        <BackFooter />
    </div>
)

}

export default RequisitionView;