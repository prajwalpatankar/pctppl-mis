import axios from 'axios';
import React, { Component } from 'react';
//import Table from 'react-bootstrap/Table'

import { Table, Input, Button, Space } from 'antd';
import Highlighter from 'react-highlight-words';
import { SearchOutlined } from '@ant-design/icons';
import NotFound from './../NotFound';

class RequisitionTable extends Component {
  constructor(props) {
    super(props)
    if (localStorage.getItem("token")) {
      axios.defaults.headers.common["Authorization"] = `JWT ${localStorage.getItem('token')}`;
    } else {
      delete axios.defaults.headers.common["Authorization"];
    }
    this.state = {
      reqs: [],
      filtered_reqs: [],
    }
  }

  componentDidMount() {
    axios.get('http://localhost:8000/requisition/')
      .then(res => {
        const reqs = res.data;
        this.setState({ reqs });
        let filtered_reqs = reqs.filter(function (reqs) {
          return (reqs.isapproved_site === "R" || reqs.isapproved_master === "R")
        })
        this.setState({ filtered_reqs });
      })

  }

  // -----------------------------------------------------------------------------------------------------------

  getColumnSearchProps = dataIndex => ({
    filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
      <div style={{ padding: 8 }}>
        <Input style={{ borderRadius: "8px " }} 
          ref={node => {
            this.searchInput = node;
          }}
          placeholder={`Search ${dataIndex}`}
          value={selectedKeys[0]}
          onChange={e => setSelectedKeys(e.target.value ? [e.target.value] : [])}
          onPressEnter={() => this.handleSearch(selectedKeys, confirm, dataIndex)}
          style={{ width: 188, marginBottom: 8, display: 'block' }}
        />
        <Space>
          <Button
            type="primary"
            onClick={() => this.handleSearch(selectedKeys, confirm, dataIndex)}
            icon={<SearchOutlined />}
            size="small"
            style={{ width: 90 }}
          >
            Search
              </Button>
          <Button onClick={() => this.handleReset(clearFilters)} size="small" style={{ width: 90 }}>
            Reset
              </Button>
          <Button
            type="link" style={{ background: "#027c86", color: "white", borderRadius: "10px" }} 
            size="small"
            onClick={() => {
              confirm({ closeDropdown: false });
              this.setState({
                searchText: selectedKeys[0],
                searchedColumn: dataIndex,
              });
            }}
          >
            Filter
              </Button>
        </Space>
      </div>
    ),
    filterIcon: filtered => <SearchOutlined style={{ color: filtered ? '#1890ff' : undefined }} />,
    onFilter: (value, record) =>
      record[dataIndex]
        ? record[dataIndex].toString().toLowerCase().includes(value.toLowerCase())
        : '',
    onFilterDropdownVisibleChange: visible => {
      if (visible) {
        setTimeout(() => this.searchInput.select(), 100);
      }
    },
    render: text =>
      this.state.searchedColumn === dataIndex ? (
        <Highlighter
          highlightStyle={{ backgroundColor: '#ffc069', padding: 0 }}
          searchWords={[this.state.searchText]}
          autoEscape
          textToHighlight={text ? text.toString() : ''}
        />
      ) : (
        text
      ),
  });

  handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
    this.setState({
      searchText: selectedKeys[0],
      searchedColumn: dataIndex,
    });
  };

  handleReset = clearFilters => {
    clearFilters();
    this.setState({ searchText: '' });
  };

  // -----------------------------------------------------------------------------------------------------------
  render() {
    const columns = [
      {
        title: 'Requisition ID',
        dataIndex: 'req_id',
        key: 'req_id',
        width: '20%',
        ...this.getColumnSearchProps('req_id'),
      },
      {
        title: 'Approved on site',
        dataIndex: 'isapproved_site',
        key: 'isapproved_site',
        width: '30%',
        ...this.getColumnSearchProps('isapproved_site'),
      },
      {
        title: 'Approved Master',
        dataIndex: 'isapproved_master',
        key: 'isapproved_master',
        ...this.getColumnSearchProps('isapproved_master'),
      },
    ];

    if (localStorage.getItem('token')) {
      return (
        <div>
          <br /><br /><br /><br />
          <div className="row">
            <div className="col-md-1">
              <p> </p>
            </div>
            <Table columns={columns} dataSource={this.state.reqs} className="col-md-10" />
            <div className="col-md-1">
              <p> </p>
            </div>
          </div>
        </div>

      );
    } else {
      return (
        <NotFound />
      )
    }
  }
}

export default RequisitionTable;