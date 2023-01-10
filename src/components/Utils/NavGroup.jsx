import { useState } from "react";

export default function NavGroup(props) {
  const [show,setShow] = useState(true)
const [arrow, setArrow] = useState("fa fa-angle-up");

    const toggle = () => {
      setShow(!show)
      if(show){
        setArrow("fa fa-angle-down");
      }else  setArrow("fa fa-angle-up");
    };
  

  return (
    <div className="Utils">
      <div className="NavGroup">
        <div onClick={()=>{toggle()}} className="item">
          <h3>{props.title}</h3>
          <i className={arrow}></i>
        </div>
        {show && (
          <>
           {props.children}
          </>
        )}
      </div>
    </div>
  );
}