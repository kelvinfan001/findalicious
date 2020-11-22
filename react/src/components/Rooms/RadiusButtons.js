import convert from "convert-units";
import React from "react";
import { getUnitSetting, Unit } from "../../Units/Units";

class RadiusButtons extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      active: 1,
    };
  }

  _handleClick(radius) {
    this.setState({ active: radius });
    var updateRadius = this.props.updateRadius;
    updateRadius(radius);
  }

  render() {
    const buttonStyle = {
      width: "auto",
      display: "inline-block",
      fontSize: "small",
      backgroundColor: "#b6b6b6",
    };
    const buttonActiveStyle = {
      width: "auto",
      display: "inline-block",
      fontSize: "small",
      fontWeight: "bolder",
      backgroundColor: "#858585",
      boxShadow: "0 0px rgba(153, 153, 153, 0.24)",
      transform: "translateY(1px)",
    };

    const containerStyle = {
      paddingBottom: "20px",
      paddingTop: "20px",
      display: "flex",
      justifyContent: "space-evenly",
      alignItems: "center",
    };
    return (
      <div style={containerStyle}>
        <button
          onClick={this._handleClick.bind(
            this,
            convert(1)
              .from(getUnitSetting() === "metric" ? "km" : "mi")
              .to("km")
          )}
          style={this.state.active === 1 ? buttonActiveStyle : buttonStyle}
        >
          {Unit(1, { imperial: "mi", metric: "km" })}
        </button>
        <button
          onClick={this._handleClick.bind(
            this,
            convert(2)
              .from(getUnitSetting() === "metric" ? "km" : "mi")
              .to("km")
          )}
          style={this.state.active === 2 ? buttonActiveStyle : buttonStyle}
        >
          {Unit(2, { imperial: "mi", metric: "km" })}
        </button>
        <button
          onClick={this._handleClick.bind(
            this,
            convert(5)
              .from(getUnitSetting() === "metric" ? "km" : "mi")
              .to("km")
          )}
          style={this.state.active === 5 ? buttonActiveStyle : buttonStyle}
        >
          {Unit(5, { imperial: "mi", metric: "km" })}
        </button>
      </div>
    );
  }
}

export default RadiusButtons;
