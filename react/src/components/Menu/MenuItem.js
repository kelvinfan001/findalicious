import React from "react";

const MenuItem = (props) => (
  <button onClick={props.onClick}> {props.children} </button>
);

export default MenuItem;
