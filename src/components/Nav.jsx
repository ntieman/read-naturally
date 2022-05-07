import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import propTypes from 'prop-types';

const Nav = () => {
  const { pathname } = useLocation();
  const [open, setOpen] = useState(false);

  const NavLink = ({ to, children, ...props }) => {
    let className = 'nav-item nav-link';

    if(
      (to.length === 1 && pathname === to)
      || (to.length > 1 && pathname.includes(to))
    ) {
      className += ' active';
    }
  
    return (
      <Link
        className={className}
        to={to}
        {...props}
      >{children}</Link>
    )
  }

  NavLink.propTypes = {
    to: propTypes.string.isRequired,
    children: propTypes.node.isRequired
  }

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light mb-3">
      <a className="navbar-brand" href="#" role="button">Read Naturally Assessment Exercise</a>
      <button
        className="navbar-toggler"
        type="button" data-toggle="collapse"
        data-target="#navbarNavAltMarkup"
        aria-controls="navbarNavAltMarkup"
        aria-expanded="false"
        aria-label="Toggle navigation"
        onClick={() => setOpen(!open)}
      >
        <span className="navbar-toggler-icon"></span>
      </button>
      <div className={`navbar-collapse` + (open ? '' : ' collapse')} id="navbarNavAltMarkup">
        <div className="navbar-nav">
          <NavLink to="/">Home</NavLink>
          <NavLink to="/students">Students</NavLink>
          <NavLink to="/add-student">Add Student</NavLink>
        </div>
      </div>
    </nav>
  );
}

export default Nav;