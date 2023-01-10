import { useState } from "react";
import Social from "./SocialMain";

export default function FooterItem(props) {
  const [show, setShow] = useState(true);

  const handleClick = () => {
    setShow(!show);
  };

  return (
    <div className="section">
      <div className="hd">
        <h3>{props.title}</h3>

        {!show && (
          <i
            onClick={() => {
              handleClick();
            }}
            className="fa fa-plus"
          ></i>
        )}
        {show && (
          <i
            onClick={() => {
              handleClick();
            }}
            className="fa fa-minus"
          ></i>
        )}
      </div>
      <hr />
      <p>{props.info}</p>
      <p>{props.mail}</p>
      <p>{props.num1}</p>
      <p>{props.num2}</p>
      {show && (
        <>
          <p className="info" onClick={() => window.location.href=props.link1}>{props.i1}</p>
          <p className="info" onClick={() => window.location.href=props.link2}>{props.i2}</p>
          <p className="info" onClick={() => window.location.href=props.link3}>{props.i3}</p>
          <p className="info" onClick={() => window.location.href=props.link4}>{props.i4}</p>
          <p className="info"><a className="info" href={props.link5} target="_blank">{props.i5}</a></p>
          {props.social && <Social/>}
        </>
      )}
    </div>
  );
}
