import React, { Component } from 'react';
import { Link } from 'react-router-dom';

class PageNotFound extends Component {

  render() {
    return (
      <div>
        <br /><br /><br /><br /><br /><br /><br /><br /><br /><br />
        <div className="section-title">
          <h2 className="page-title ">404</h2>
          <h6 className="title-description">Uh Oh! Looks like you got lost!</h6>
        </div>
        <Link to="/">
          Go Home
        </Link>
        <br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br />
      </div>
    );
  }
}

export default PageNotFound;