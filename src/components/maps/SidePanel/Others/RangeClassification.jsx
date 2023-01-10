import { useState } from "react";
import Classes from "./Classes";
import Item from "./Item";
import Range from "./Range";
import MyError from "../../../Utils/MyError";

export default function RangeClassification(props) {
  const [editing, setEditing] = useState(false);

  const toggleEditing = (value) => {
    setEditing(value);
  };

  const addClass = () => {
    let d = props.body;
    d.style.classes?.push({
      name: `0 - 0`,
      color: getRandomColor(),
      enabled: true,
      count: 0,
      min: 0,
      max: 0,
    });
    props.updateBody(d);
    setEditing(true);
  };

  const getRandomColor = () => {
    var letters = "0123456789ABCDEF";
    var color = "#";
    for (var i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  };

  return (
    <div className="list">
      {props.isNumeric ? (
        <>
          <div
            className="div3equal"
            style={{ width: "fit-content", marginLeft: "auto" }}
          >
            <i
              className="fa fa-plus-square"
              onClick={() => {
                addClass();
              }}
            ></i>
            <i
              className="fa fa-eye"
              onClick={() => {
                toggleEditing(false);
              }}
            ></i>
            <i
              className="fa fa-edit"
              onClick={() => {
                toggleEditing(true);
              }}
            ></i>
          </div>
          <Item id={0} name={props.layer} />
          {!editing ? (
            <>
              {props.body.style.classes?.length > 0 &&
                props.body.style.classes.map((item, index) => {
                  return (
                    <Classes
                      key={index}
                      body={props.body}
                      updateBody={props.updateBody}
                      item={item}
                    />
                  );
                })}
            </>
          ) : (
            <>
              <>
                {props.body.style.classes?.length > 0 && (
                  <>
                    <div className="range">
                      <div className="cr"></div>
                      <div className="cr"></div>
                      <h6>Min</h6>
                      <h6>Max</h6>
                      <h6>Label</h6>
                    </div>
                    {props.body.style.classes.map((item, index) => {
                      return (
                        <Range
                          key={index}
                          body={props.body}
                          calculateCustomRangeClasses={
                            props.calculateCustomRangeClasses
                          }
                          updateBody={props.updateBody}
                          item={item}
                          id={index}
                        />
                      );
                    })}
                    <p>
                      We use equal interval classification with 5 classes. Feel
                      free to define a custom range classification.
                    </p>
                  </>
                )}
              </>
            </>
          )}
        </>
      ) : (
        <MyError txt="The selected column does not have valid data. Please select another column" />
      )}
    </div>
  );
}
