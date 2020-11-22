import React from "react";

const Menu = (props) => (
  <div>
    <h3> {props.name} </h3>
    {props.children}
  </div>
);

export default Menu;
