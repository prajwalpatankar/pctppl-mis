import 'antd/dist/antd.css';
import { BrowserRouter, Route, Switch } from 'react-router-dom'
// import Navbar1 from './components/Navbar';
// import NotFound from '../NotFound';
import Master from './Master';
import Requisition from './Requisition';
import RequisitionSite from './Requisition_site';
import PurchaseOrder from './PurchaseOrder';
import GoodsReceiptNote from './GoodsReceiptNote';
import Login from './Login';
import NewUser from './NewUser';
import NewProjects from './NewProjects';
import axios from 'axios';
import Menu from './Menu';
import ViewStock from './ViewStock';
import Issue from './Issue';
import DeliveryChallan from './DeliveryChallan';

import { useEffect } from 'react';

// import UserContext from "./context/user/userContext";





function RouterMIS() {


  useEffect(() => {
    if (localStorage.getItem("token")) {
      axios.defaults.headers.common["Authorization"] = `JWT ${localStorage.getItem('token')}`;
      console.log("in")
    } else {
      delete axios.defaults.headers.common["Authorization"];
      console.log("out")
    }
  });


  return (
    <BrowserRouter>
      <div className="App">
        {/* <Navbar1 /> */}
        <Switch >
          <Route path='/1Menu' component={Menu} />
          <Route path='/login' component={Login} />
          <Route path='/1newuser' component={NewUser} />
          <Route path='/1projects' component={NewProjects} />
          <Route path='/1master' component={Master} />
          <Route path='/1req' component={Requisition} />
          <Route path='/1reqsite' component={RequisitionSite} />
          <Route path='/1po' component={PurchaseOrder} />
          <Route path='/1grn' component={GoodsReceiptNote} />
          <Route path='/1stock' component={ViewStock} />
          <Route path='/1issue' component={Issue} />
          <Route path='/1delivery' component={DeliveryChallan} />

          {/* <Route component={NotFound} /> */}
        </Switch>
      </div>
    </BrowserRouter>
  );
}

export default RouterMIS;
