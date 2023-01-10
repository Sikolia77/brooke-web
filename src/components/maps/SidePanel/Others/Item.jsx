import React from "react";

export default class Item extends React.Component {
    render() {
    return (
      <div className="lyr">
        <input checked={this.props.checked} type="checkbox" name="" id="" />
        <div className="div"></div>
        <p>{this.props.name}</p>
      </div>
    );
  }
}
