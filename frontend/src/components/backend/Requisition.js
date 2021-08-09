import React, { useEffect, useState } from 'react';
import axios from 'axios';
import RequisitionTable from './RequisitionTable';
import NotFound from './../NotFound';
import { Button, message, Input, Table, Space, Select } from 'antd';
import BackFooter from './BackFooter';
import jwt_decode from 'jwt-decode';

function Requisition() {

  // --------------------------------------------------------------------
  // Base Urls

  const baseUrl = "http://localhost:8000/"

  // --------------------------------------------------------------------
  // States

  const [inputFields, setInputField] = useState([
    {
      mat_id: "",
      mat_name: "----",
      quantity: "",
      description: "",
      unit: "---",
      required_date: "",
    },
  ]);

  const [query, setQuery] = useState({
    req_id: "",
    project_id: "",
    made_by: "",
    message: "posted",
    initialItemRow: [],
    completed: "N",
    isapproved_master: "N",
  });

  const [visibility, setVisibility] = useState(false);

  const [limitToUpdate, setLimitToUpdate] = useState([]);

  const [projects, setProjects] = useState([]);
  const [l, setloggedin] = useState(true);

  const [limiter, setLimiter] = useState([]);

  useEffect(() => {
    if (localStorage.getItem("token")) {
      axios.defaults.headers.common["Authorization"] = `JWT ${localStorage.getItem('token')}`;

      axios.get(baseUrl.concat("userdata/?user=" + jwt_decode(localStorage.getItem("token")).user_id))
        .then(res => {

          setQuery({ ...query, made_by: res.data[0].user })

          if (res.data[0].role === "admin") {
            axios.get(baseUrl.concat("projects"))
              .then(res => {
                setProjects(res.data);
              })

          } else if (res.data[0].role === "Project Manager") {
            axios.get(baseUrl.concat("projects/?pm=" + jwt_decode(localStorage.getItem("token")).user_id))
              .then(res => {
                setProjects(res.data);
              })
          } else {
            axios.get(baseUrl.concat("projects/?user=" + jwt_decode(localStorage.getItem("token")).user_id))
              .then(res => {
                setProjects(res.data);
              })
          }
        })
        .catch(error => {
          if (error.response.status === 401) {
            localStorage.removeItem('token')
            setloggedin(false);
          }
        })
    }
    setTimeout(() => {
      return 0;
    }, 200);
  }, [])

  const [searchstates, setSearch] = useState({
    mat: "",
    isSearchVisible: false,
    idx: "",
  })


  // --------------------------------------------------------------------
  // AntD Vriables

  const { Option } = Select;

  const columns = [
    {
      title: 'Material Name',
      dataIndex: 'mat_name',
      key: 'mat_name',
    },
    {
      title: 'Utilized Quantity',
      dataIndex: 'utilized',
      key: 'utilized',
    },
    {
      title: 'Total permitted Quantity',
      dataIndex: 'quantity',
      key: 'quantity',
    },
    {
      title: 'Unit',
      dataIndex: 'unit',
      key: 'unit',
    },
    {
      title: 'Action',
      key: 'action',
      render: (text, record, index) => (
        <Space size="middle">
          <Button onClick={() => { updatecol(record, index) }} type="button">Select</Button>
        </Space>
      ),
    },
  ];

  // --------------------------------------------------------------------
  // Dynamic Table ADD/DELETE

  const addHandler = () => {
    var len = inputFields.length;
    if ((len !== 0) && (inputFields[len - 1].mat_name === "----")) {
      message.error("Please update exissting row before adding another row");
      return;
    }
    setInputField([...inputFields, {
      mat_id: "",
      mat_name: "----",
      quantity: "",
      description: "",
      unit: "---",
      required_date: "",
    }])
  }

  const deleteRowHandler = (index) => {
    const values = [...inputFields];
    if (values[index].mat_name !== "----") {
      const values_updated = [...limitToUpdate];
      setLimiter([...limiter, values_updated[index]]);
      values_updated.splice(index, 1);
      setLimitToUpdate(values_updated);
    }
    values.splice(index, 1);
    setInputField(values);
    setQuery({ ...query, initialItemRow: values });
  }

  // --------------------------------------------------------------------
  // Form change handlers

  const onChangeProject = (value) => {
    setLimitToUpdate([]);
    setInputField([{
      mat_id: "",
      mat_name: "----",
      quantity: "",
      description: "",
      unit: "---",
      required_date: "",
    },]);
    axios.get(baseUrl.concat("reqlimit/?project_id=" + value))
      .then(res => {
        setLimiter(res.data);
      })
    axios.get(baseUrl.concat("requisition/?project_id=" + value))
      .then(res => {
        var len = res.data.length;
        if (len !== 0) {
          var proj_string = res.data[len - 1].req_id.substring(0, 8);
          var id_string = res.data[len - 1].req_id.substring(8);
          id_string = parseInt(id_string) + 1;
          len = 5 - id_string.toString().length
          while (len !== 0) {
            proj_string = proj_string + 0;
            len--;
          }
          id_string = proj_string + id_string;
          setQuery({ ...query, project_id: value, req_id: id_string })
        } else {
          console.log(len)
          axios.get(baseUrl.concat("projects/" + value + "/"))
            .then(res => {
              var id_string = res.data.identifier + "-PR-00001";
              setQuery({ ...query, project_id: value, req_id: id_string })
            })
        }

      })
    setVisibility(true);
  }

  const changeHandler = (index, event) => {   //inner form 
    const values = [...inputFields];
    values[index][event.target.name] = event.target.value;
    setInputField(values);
    setQuery({ ...query, initialItemRow: values })
  }

  const changeDateHandler = (index, event) => {   //inner form
    let tempdate = event.target.value;
    tempdate = tempdate + "T12:00";
    const values = [...inputFields];
    values[index][event.target.name] = tempdate;
    setInputField(values);
    setQuery({ ...query, initialItemRow: values })
  }

  // --------------------------------------------------------------------
  // Visibility and search handlers 

  const showMaterial = (index) => {
    if (visibility) {
      if (searchstates.isSearchVisible) {
        setSearch({ ...searchstates, isSearchVisible: false });
      } else {
        setSearch({ ...searchstates, isSearchVisible: true, idx: index });
      }
    }
    else {
      message.error("Please Select a Project ")
    }

  }


  // --------------------------------------------------------------------
  // Update Rows 

  const updatecol = (record, indexrow) => {
    setLimitToUpdate([...limitToUpdate, record])
    const values = [...inputFields];
    const index = searchstates.idx;
    console.log(record);
    values[index].mat_id = record.mat_id;
    // values[index].mat_name = record.desc;  //check once later
    values[index].mat_name = record.mat_name
    values[index].unit = record.unit;
    setInputField(values);
    setQuery({ ...query, initialItemRow: values })
    setSearch({ ...searchstates, isSearchVisible: false })
    var temp_limit = limiter;
    temp_limit.splice(indexrow, 1)
    setLimiter(temp_limit);
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: 'smooth'
    });
  }

  // --------------------------------------------------------------------
  // Submission

  const submitHandler = (e) => {
    e.preventDefault();
    console.log(query)
    var len = inputFields.length;
    if(inputFields[len-1].mat_name === "----" ){
      message.error("Material not selected in last row!")
      return;
  }
    let n = limitToUpdate.length
    for (var i = 0; i < n; i++) {
      if (inputFields[i].quantity > (limitToUpdate[i].quantity - limitToUpdate[i].utilized)) {
        message.error(`Quantities entered for ${inputFields[i].mat_name} exceed limit ! Please contact the Director to increase the limit.`);
        return;
      }
    }
    axios.post(baseUrl.concat("requisition/"), query)
      .then(response => {
        console.log(response)
        for (i = 0; i < n; i++) {
          limitToUpdate[i].utilized = parseFloat(inputFields[i].quantity) + parseFloat(limitToUpdate[i].utilized);
          axios.patch(baseUrl.concat("reqlimit/" + limitToUpdate[i].id + "/"), limitToUpdate[i])
            .then(res => {
              message.success("Requisition sent successfully", 5)
            })
        }

        var proj_string = query.req_id.substring(0, 8);
        var id_string = query.req_id.substring(8);
        id_string = parseInt(id_string) + 1;
        var len = 5 - id_string.toString().length
        while (len !== 0) {
            proj_string = proj_string + 0;
            len--;
        }
        id_string = proj_string + id_string;
        setQuery({
          ...query,
          req_id: id_string,
          message: "posted",
          initialItemRow: [],
          completed: "N",
          isapproved_master: "N",
        })
        setInputField([]) //clear first
        setLimitToUpdate([]);
        axios.get(baseUrl.concat("reqlimit/?project_id=" + query.project_id))
        .then(res => {
          setLimiter(res.data);
        })
        //init again
        setInputField([
        {
          mat_id: "",
          mat_name: "----",
          quantity: "",
          description: "",
          unit: "---",
          required_date: "",
        },
        ])
        setTimeout(refreshHandler,200);
      })
      .catch(error => {
        console.log(error.response.status)
        if (error.response.status === 401) {
          localStorage.removeItem('token')
          setloggedin(false);
        } else if (error.response.status === 400) {
          message.error("Please fill all the details !")
        }
      })
  }

  // --------------------------------------------------------------------
  // Extras

  const refreshHandler = () => {
    window.location.reload();
  }


  // --------------------------------------------------------------------
  // HTML
  if (l) {
    return (
      <div>
        <br /><br /><br /><br /><br /><br /><br /><br /><br />
        <form onSubmit={submitHandler}>
          <Select placeholder="Select Project" style={{ width: 300 }} onChange={onChangeProject}>
            {projects.map((project, index) => (
              <Option value={project.id}>{project.project_name}</Option>
            ))}
          </Select>
          <Button type="button" onClick={addHandler}>Add</Button><br /><br /><br /><br />

          <div className="row">
            <div className="col-md-1"><p> </p></div>
            <div className="table-responsive col-md-10">
              <table className="table table-hover table-bordered">
                <thead>
                  <tr className="info">
                    <div className="row">
                      <th className="col-md-1">Select Material</th>
                      <th className="col-md-2">Material Name</th>
                      <th className="col-md-3">Description</th>
                      <th className="col-md-1">Quantity</th>
                      <th className="col-md-1">Unit</th>
                      <th className="col-md-2">Expected Date (YYYY/MM/DD)</th>
                      <th className="col-md-1">Delete</th>
                    </div>
                  </tr>
                </thead>
                <tbody>
                  {inputFields.map((inputField, index) => (
                    <tr key={index}>
                      <div className="row">
                        <td className="col-md-1"><Button type="button" size="small" onClick={() => showMaterial(index)}>Select Material</Button></td>
                        <td className="col-md-2">{inputField.mat_name}</td>
                        <td className="col-md-3"><Input type="text" value={inputField.description} placeholder="Description" name="description" onChange={event => changeHandler(index, event)} /></td>
                        <td className="col-md-1"><Input required={true} type="text" value={inputField.quantity} placeholder="Quantity" name="quantity" onChange={event => changeHandler(index, event)} /></td>
                        <td className="col-md-1">{inputField.unit}</td>
                        <td className="col-md-2"><Input type="date" placeholder="Select Date" name="required_date" onChange={event => changeDateHandler(index, event)} /></td>
                        <td className="col-md-1"><Button danger="true" type="button" onClick={() => { deleteRowHandler(index) }}>Delete</Button></td>
                      </div>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="col-md-1"><p> </p></div>
          </div> <br />
          {searchstates.isSearchVisible ?
            (<div>
              <br /><br />
              <div className="row">
                <div className="col-sm-1"><p> </p></div>
                <div className="col-sm-10"><Table dataSource={limiter} columns={columns} pagination={false} /></div>
                <div className="col-sm-1"><p> </p></div>
              </div>
            </div>) : (
              <div><p> </p></div>
            )
          }

          <Button type="submit" onClick={submitHandler}>Submit</Button>
        </form>
        <br /><br />


        <RequisitionTable />
        <div className="row">
          <div className="col-sm-10"><p> </p></div>
          <div className="col-sm-1"><Button type="link" className="float-right" onClick={refreshHandler}>Refresh</Button></div>
          <div className="col-sm-1"><p> </p></div>
        </div>
        <br /><br /><br /><br />
        <BackFooter />
      </div>
    )

  } else {
    return (
      <NotFound />
    )
  }


}


export default Requisition;