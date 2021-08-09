import React, { Component } from 'react';
import { Link } from 'react-router-dom';

class NotFound extends Component {

  render() {
    return (
      <div>
        <br /><br /><br /><br /><br /><br /><br /><br /><br /><br />
        <div className="section-title">
          <h2 className="page-title ">Loading ...</h2>
        </div>
        <Link to="/">
          Go Home
        </Link>
        <br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br />
      </div>
    );
  }
}

export default NotFound;