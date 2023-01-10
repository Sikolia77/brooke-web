import React from "react";

export default class SelectMain extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selected: props.selected ? props.selected : undefined,
    };
    this.value = React.createRef();
    this.onchange = this.onchange.bind(this);
  }

  onchange = () => {
    this.setState({ selected: this.value.current.value });
    this.props.getSelected(this.value.current.value);
  };

  render() {
    return (
      <div className="select">
        <label htmlFor="select">{this.props.label}</label>
        <select
          ref={this.value}
          onChange={() => {
            this.onchange();
          }}
          value={this.state.selected}
        >
          {this.props.data.map((item) => {
            return (
              <option key={item} value={item}>
                {item}
              </option>
            );
          })}
        </select>
      </div>
    );
  }
}
