import React from "react";

export default function AccordionBody(props) {
    let url = "http://localhost:3004/uploads/" + props.file;
    return (
        <div className="accordion-body">
            <p>{props.description}</p>
            {/* <div className="accordion-footer">
                <a href={url}>Open File</a>
            </div> */}
        </div>
    )
}