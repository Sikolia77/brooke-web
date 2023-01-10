import { useState } from "react";

export default function Input(props) {
  const [value, setValue] = useState(props.value);

  return (
    <input
      type={props.type}
      onChange={(e) => {
        props.onChange(e);
        setValue(e.target.value);
      }}
      value={value}
      min={props.min}
      max={props.max}
    />
  );
}
