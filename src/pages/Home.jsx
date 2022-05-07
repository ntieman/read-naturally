import React from 'react';
import { Link } from 'react-router-dom';

import Page from '../components/Page';

const Home = () => {
  return (
    <Page title="Home">
      <div className="container">
        <div className="row">
          <div className="col">
            <p>Thank you for taking the time to evaluate this assessment.</p>
            <p>The main project pages are available here:</p>
            <ul>
              <li>
                <Link to="/students">Students</Link> - table of student information.
              </li>
              <li>
                <Link to="/add-student">Add Student </Link> - new student form.
              </li>
            </ul>
          </div>
        </div>
      </div>
    </Page>
  )
}

export default Home;