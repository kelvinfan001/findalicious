import React from 'react';

class RadiusButtons extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            active: "one"
        }
    }

    _handleClick(radius) {
        this.setState({ active: radius });
    }

    render() {
        const buttonStyle = {
            width: "27%",
            display: "inline-block",
            fontSize: "small",
            backgroundColor: "#b6b6b6"
        };
        const buttonActiveStyle = {
            width: "27%",
            display: "inline-block",
            fontSize: "small",
            fontWeight: "bolder",
            backgroundColor: "#858585",
            boxShadow: "0 0px rgba(153, 153, 153, 0.24)",
            transform: "translateY(1px)"
        }
        return (
            <div style={{ paddingBottom: "20px", paddingTop: "20px" }}>
                <button
                    onTouchStart=""
                    onClick={this._handleClick.bind(this, "one")}
                    style={this.state.active === "one" ? buttonActiveStyle : buttonStyle}>
                    1KM
                </button>
                <button
                    onTouchStart=""
                    onClick={this._handleClick.bind(this, "two")}
                    style={this.state.active === "two" ? buttonActiveStyle : buttonStyle}>
                    2KM
                </button>
                <button
                    onTouchStart=""
                    onClick={this._handleClick.bind(this, "five")}
                    style={this.state.active === "five" ? buttonActiveStyle : buttonStyle}>
                    5KM
                </button>
            </div >
        )
    }
}

export default RadiusButtons;