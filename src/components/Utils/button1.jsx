import React from "react";

export default function Button1(props) {
  return (
    <div className="button">
      <button onClick={()=>props.handleClick()}>{props.label}</button>
    </div>
  );
}
