import './App.css';
import 'antd/dist/antd.css';
import { BrowserRouter, Route, Switch } from 'react-router-dom'
import { useEffect } from 'react';
import axios from 'axios';
import NavbarMis from './components/backend/NavbarMis';
import Requisition from './components/backend/Req/Requisition';
import RequisitionSite from './components/backend/Requisition_site';
import PurchaseOrder from './components/backend/PO/PurchaseOrder';
import GoodsReceiptNote from './components/backend/GRN/GoodsReceiptNote';
import Login from './components/backend/Login';
import NewUser from './components/backend/Admin/NewUser';
import NewProjects from './components/backend/Admin/NewProjects';
import Menu from './components/backend/Menu';
import ViewStock from './components/backend/views/ViewStock';
import Issue from './components/backend/IssueAndTransfer/Issue';
import DeliveryChallan from './components/backend/IssueAndTransfer/DeliveryChallan';
import PageNotFound from './components/PageNotFound';
import Material from './components/backend/Material';
import Supplier from './components/backend/Supplier/Suppliers';
import UpdateSupplier from './components/backend/Supplier/UpdateSupplier';
import ProjectData from './components/backend/Admin/ProjectData';
import RequisitionPrint from './components/backend/print_templates/RequisitionPrint';
import POPrint from './components/backend/print_templates/POPrint';
import GRNPrint from './components/backend/print_templates/GRNPrint';
import StockOverallPrint from './components/backend/print_templates/StockOverallPrint';
import StockIndividualPrint from './components/backend/print_templates/StockIndividualPrint';

import ViewPO from './components/backend/views/ViewPO';
import ViewGRN from './components/backend/views/ViewGRN';
import ViewSuppliers from './components/backend/views/ViewSuppliers';
import RequisitionView from './components/backend/Req/RequisitionView';
import ReqMaster from './components/backend/Req/ReqMaster';


function App() {


  useEffect(() => {
    if (localStorage.getItem("token")) {
      axios.defaults.headers.common["Authorization"] = `JWT ${localStorage.getItem('token')}`;
    } else {
      delete axios.defaults.headers.common["Authorization"];
    }
  });


  return (

    <BrowserRouter>
      <div className="App-mis">
        <NavbarMis />
        <Switch >
          <Route exact path='/' component={Login} />
          <Route path='/1req' component={Requisition} />
          <Route path='/1reqsite' component={RequisitionSite} />
          <Route path='/1Menu' component={Menu} />          
          <Route path='/1newuser' component={NewUser} />
          <Route path='/1projects' component={NewProjects} />
          <Route path='/1master' component={ReqMaster} />
          <Route path='/1po' component={PurchaseOrder} />
          <Route path='/1grn' component={GoodsReceiptNote} />
          <Route path='/1stock' component={ViewStock} />
          <Route path='/1issue' component={Issue} />
          <Route path='/1delivery' component={DeliveryChallan} />
          <Route path='/1material' component={Material} />
          <Route path='/1supplier' component={Supplier} />
          <Route path='/1supplierUpdate' component={UpdateSupplier} />
          <Route path='/1projectData' component={ProjectData} />

          {/* Views */}  
          <Route path='/1viewreq' component={RequisitionView} />
          <Route path='/1viewpo' component={ViewPO} />
          <Route path='/1viewgrn' component={ViewGRN} />
          <Route path='/1viewsupplier' component={ViewSuppliers} />

          {/* Printing */}

          <Route path='/purchaserequisition:id' component={RequisitionPrint} />
          <Route path='/po:id' component={POPrint} />
          <Route path='/grn:id' component={GRNPrint} />
          <Route path='/stock:id' component={StockOverallPrint} />
          <Route path='/onestock:id' component={StockIndividualPrint} />

          <Route component={PageNotFound} />
        </Switch>
      </div>
    </BrowserRouter>
  );
}

export default App;
