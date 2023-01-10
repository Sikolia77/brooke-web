import React, {  } from "react";

export default class Select extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selected: props.selected ? props.selected : undefined,
    };
    this.value = React.createRef();
    this.onchange = this.onchange.bind(this);
  }

  componentDidUpdate(prevProps) {
    if (
      this.props.label === "Select Column" &&
      prevProps.selected !== this.props.body.style.column
    ) {
      this.setState({ selected: this.props.body.style.column });
    }
  }

  onchange = () => {
    let d = this.props.body;
    if (this.props.label === "Select Column") {
      d.style.column = this.value.current.value;
      if (this.props.body.style.classification === "Unique Classification") {
        d.style.classes = this.props.calculateUniqueClasses(
          this.value.current.value
        );
      } else {
        d.style.classes = this.props.calculateRangeClasses(
          this.value.current.value
        );
      }
    } else {
      let keys = Object.keys(this.props.body.data.layer.features[0].properties);
      d.style.column = keys[0];
      if (this.value.current.value === "Unique Classification") {
        d.style.classes = this.props.calculateUniqueClasses(keys[0]);
      } else {
        d.style.classes = this.props.calculateRangeClasses(keys[0]);
      }
      d.style.classification = this.value.current.value;
    }
    this.props.updateBody(d);
    this.setState({ selected: this.value.current.value });
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
