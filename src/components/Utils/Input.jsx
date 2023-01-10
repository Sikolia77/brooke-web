import React from "react";

export default class Input extends React.Component {
  constructor(props) {
    super(props);
    this.value = React.createRef();
    this.getValue = this.getValue.bind(this);
  }

  getValue = () => {
    this.props.updateValue(this.value.current.value);
  };

  render() {
    return (
      <div className="input">
        <label htmlFor="input">{this.props.label}</label>
        <input
          ref={this.value}
          onChange={() => {
            this.getValue();
          }}
          type="text"
          name="input"
          placeholder={this.props.placeholder}
        />
      </div>
    );
  }
}
