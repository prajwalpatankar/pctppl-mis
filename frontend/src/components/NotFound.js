import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Result, Button } from 'antd';

class NotFound extends Component {

  render() {
    return (
      <div>
        <br /><br /><br /><br />
        <Result
          status="warning"
          title="Session Expired. Please Login again"
          extra={
            <Button type="primary" key="console">
              <Link to="/">Login</Link>
            </Button>
          }
        />
      </div>
    );
  }
}

export default NotFound;