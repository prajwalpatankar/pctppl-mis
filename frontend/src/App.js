import './App.css';
import 'antd/dist/antd.css';
import { BrowserRouter, Route, Switch } from 'react-router-dom'
import { useEffect } from 'react';
import axios from 'axios';
import NavbarMis from './components/backend/NavbarMis';
import Master from './components/backend/Master';
import Requisition from './components/backend/Requisition';
import RequisitionSite from './components/backend/Requisition_site';
import PurchaseOrder from './components/backend/PurchaseOrder';
import GoodsReceiptNote from './components/backend/GoodsReceiptNote';
import Login from './components/backend/Login';
import NewUser from './components/backend/NewUser';
import NewProjects from './components/backend/NewProjects';
import Menu from './components/backend/Menu';
import ViewStock from './components/backend/ViewStock';
import Issue from './components/backend/Issue';
import DeliveryChallan from './components/backend/DeliveryChallan';
import PageNotFound from './components/PageNotFound';
import RequisitionTable from './components/backend/RequisitionTable';
import Material from './components/backend/Material';
import Supplier from './components/backend/Suppliers';
import UpdateSupplier from './components/backend/UpdateSupplier';
import ProjectData from './components/backend/ProjectData';
import RequisitionPrint from './components/backend/print_templates/RequisitionPrint';
import POPrint from './components/backend/print_templates/POPrint';
import GRNPrint from './components/backend/print_templates/GRNPrint';


function App() {


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
      <div className="App-mis">
        {/* <NavbarMis /> */}
        <Switch >
          <Route exact path='/' component={Login} />
          <Route path='/1req' component={Requisition} />
          <Route path='/1reqsite' component={RequisitionSite} />
          <Route path='/1viewreq' component={RequisitionTable} />
          <Route path='/1Menu' component={Menu} />          
          <Route path='/1newuser' component={NewUser} />
          <Route path='/1projects' component={NewProjects} />
          <Route path='/1master' component={Master} />
          <Route path='/1po' component={PurchaseOrder} />
          <Route path='/1grn' component={GoodsReceiptNote} />
          <Route path='/1stock' component={ViewStock} />
          <Route path='/1issue' component={Issue} />
          <Route path='/1delivery' component={DeliveryChallan} />
          <Route path='/1material' component={Material} />
          <Route path='/1supplier' component={Supplier} />
          <Route path='/1supplierUpdate' component={UpdateSupplier} />
          <Route path='/1projectData' component={ProjectData} />


          {/* Printing */}

          <Route path='/purchaserequisition:id' component={RequisitionPrint} />
          <Route path='/po:id' component={POPrint} />
          <Route path='/grn:id' component={GRNPrint} />
          

          <Route component={PageNotFound} />
        </Switch>
      </div>
    </BrowserRouter>
  );
}

export default App;
