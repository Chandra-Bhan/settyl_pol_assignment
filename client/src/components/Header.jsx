import React from "react";
import { FaPrayingHands } from "react-icons/fa";
import { NavLink } from "react-router-dom";

function Header() {
  return (
    <header className="App-header">
      <div className="header">
        <div className="d-flex flex-column align-items-center">
          <div className="d-flex align-items-baseline">
            <NavLink className="page-link" to="/">
              <FaPrayingHands className="mr-2" />
              &nbsp; Create Poll
            </NavLink>
            |
            <NavLink className="page-link" to="/allpolls">
              <FaPrayingHands className="mr-2" />
              &nbsp; All Polls
            </NavLink>
          </div>
          <p className="mt-2 mb-0 font-italic">
            Create anonymous polls for free
          </p>
        </div>
      </div>
    </header>
  );
}

export default Header;
