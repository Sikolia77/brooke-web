import React from "react";

export default class Range extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      value: this.props.item.color,
      min: this.props.item.min,
      max: this.props.item.max,
      label: this.props.item.name,
      checked: this.props.item.enabled,
    };
    this.color = React.createRef();
    this.min = React.createRef();
    this.max = React.createRef();
    this.label = React.createRef();
    this.getColor = this.getColor.bind(this);
    this.getMin = this.getMin.bind(this);
    this.getMax = this.getMax.bind(this);
    this.getLabel = this.getLabel.bind(this);
    this.onChange = this.onChange.bind(this);
  }

  getMin = () => {
    this.setState({ min: this.min.current.value });
  };

  minOut = () => {
    let d = this.props.body;
    d.style.classes[this.props.id].min = parseInt(this.min.current.value);
    d.style.classes[this.props.id].count =
      this.props.calculateCustomRangeClasses(
        parseInt(this.min.current.value),
        parseInt(this.max.current.value)
      );
    const txt = this.label.current.value.split("-");
    if (txt.length > 1) {
      this.setState({
        label: `${this.withCommas(this.min.current.value)} - ${txt[0]}`,
      });
      d.style.classes[this.props.id].name = this.label.current.value;
    }

    this.props.updateBody(d);
  };

  getMax = () => {
    this.setState({ max: this.max.current.value });
  };

  maxOut = () => {
    let d = this.props.body;
    d.style.classes[this.props.id].max = parseInt(this.max.current.value);
    d.style.classes[this.props.id].count =
      this.props.calculateCustomRangeClasses(
        parseInt(this.min.current.value),
        parseInt(this.max.current.value)
      );
    const txt = this.label.current.value.split("-");
    if (txt.length > 1) {
      this.setState({
        label: `${txt[0]} - ${this.withCommas(this.max.current.value)}`,
      });
      d.style.classes[this.props.id].name = this.label.current.value;
    }

    this.props.updateBody(d);
  };

  removeClass = () => {
    let d = this.props.body;
    d.style.classes.splice(this.props.id, 1);
    this.props.updateBody(d);
  };

  getLabel = () => {
    this.setState({ label: this.label.current.value });
  };

  labelOut = () => {
    let d = this.props.body;
    d.style.classes[this.props.id].name = this.label.current.value;
    this.props.updateBody(d);
  };

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

  withCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }

  render() {
    return (
      <div className="range">
        <i
          onClick={() => {
            this.removeClass();
          }}
          className="fa fa-minus-square"
        ></i>
        <input
          ref={this.color}
          onChange={(e) => this.getColor(e)}
          className="cr"
          type="color"
          name=""
          id=""
          value={this.state.value}
        />
        <input
          ref={this.min}
          onChange={() => this.getMin()}
          type="number"
          value={this.state.min}
          onBlur={(e) => {
            this.minOut();
          }}
        />
        <input
          ref={this.max}
          onChange={() => this.getMax()}
          type="number"
          value={this.state.max}
          onBlur={(e) => {
            this.maxOut();
          }}
        />
        <input
          ref={this.label}
          onChange={() => this.getLabel()}
          type="text"
          placeholder="label"
          value={this.state.label}
          onBlur={(e) => {
            this.labelOut();
          }}
        />
      </div>
    );
  }
}
