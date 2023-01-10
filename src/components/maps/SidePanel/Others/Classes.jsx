import React from "react";

export default class Classes extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      value: this.props.item.color,
      checked: this.props.item.enabled,
    };
    this.getColor = this.getColor.bind(this);
    this.onChange = this.onChange.bind(this);
  }

  getColor = (value) => {
    const pos = this.props.body.style.classes
      .map(function (e) {
        return e.name;
      })
      .indexOf(this.props.item.name);

    if (pos !== -1) {
      let bd = this.props.body;
      bd.style.classes[pos].color = value.target.value;
      this.props.updateBody(bd);
    }
    this.setState({ value: value.target.value });
  };

  onChange = (value) => {
    const pos = this.props.body.style.classes
      .map(function (e) {
        return e.name;
      })
      .indexOf(this.props.item.name);

    if (pos !== -1) {
      let bd = this.props.body;
      bd.style.classes[pos].enabled = value.target.checked;
      this.props.updateBody(bd);
    }
    this.setState({ checked: value.target.checked });
  };

  render() {
    return (
      <div className="classes">
        <input
          className="cb"
          checked={this.state.checked}
          type="checkbox"
          onChange={(e) => this.onChange(e)}
        />
        <input
          onChange={(e) => this.getColor(e)}
          className="cr"
          type="color"
          name=""
          id=""
          value={this.state.value}
        />
        <p>{this.props.item.name}</p>
      </div>
    );
  }
}
