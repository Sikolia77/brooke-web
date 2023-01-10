import { useState } from "react";

export default function Accordion(props) {
    const [show, setShow] = useState(false);
    const [arrow, setArrow] = useState("fa fa-angle-up");

    const toggle = () => {
        setShow(!show)
        if(show){
            setArrow("fa fa-angle-down");
        } else  setArrow("fa fa-angle-up");
    };

    return (
        <div className="accordion">
            <div className="accordion-header" onClick={() => {
                toggle();
            }}>
                <h4>{props.title}</h4>
                <h4></h4>
                <i className={arrow}></i>
            </div>
            {show && (
                <>
                {props.children}
                </>
            )}
        </div>
    )
}