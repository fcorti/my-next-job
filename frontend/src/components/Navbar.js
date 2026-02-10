import React from 'react';
import { Link } from 'react-router-dom';
import './Navbar.css';

function Navbar() {
  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-brand">
          My Next Job
        </Link>
        <div className="navbar-menu">
          <Link to="/skills" className="nav-link">
            1. Skills & Experience
          </Link>
          <Link to="/opportunities" className="nav-link">
            2. Find Opportunities
          </Link>
          <Link to="/pipeline" className="nav-link">
            3. Manage Pipeline
          </Link>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
