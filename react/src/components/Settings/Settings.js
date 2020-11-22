import { faArrowAltCircleLeft } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";
import Menu from "../Menu/Menu";
import MenuItem from "../Menu/MenuItem";
import { Link } from "react-router-dom";

const Settings = (props) => (
  <div className="main-page">
    <Link to="/">
      <FontAwesomeIcon icon={faArrowAltCircleLeft} size="2x" />
    </Link>
    <Menu name="Units">
      <MenuItem onClick={() => localStorage.setItem("units", "metric")}>
        Metric (meters)
      </MenuItem>
      <MenuItem onClick={() => localStorage.setItem("units", "imperial")}>
        Imperial (feet/miles)
      </MenuItem>
    </Menu>
  </div>
);

export default Settings;
