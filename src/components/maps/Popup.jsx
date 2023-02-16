import { useRef } from "react";
import { useState } from "react";
import { useLayoutEffect } from "react";
import { useEffect } from "react";

export default function Popup(props) {
  const ref = useRef(null);
  const [width, setWidth] = useState(150);
  const [height, setHeight] = useState(250);

  useLayoutEffect(() => {
    setWidth(ref.current.offsetWidth / 2);
    setHeight(ref.current.offsetHeight + 20);
  }, []);

  return (
    <div
      ref={ref}
      style={{ top: props.top - height, left: props.left - width }}
      className="popup"
    >
      <div className="wrapper">
        {props.many?.data ? (
          <div className="many">
            <h3>Details</h3>
            <div className="hd">
              <h4>Name</h4>
              <h4>AccountNo</h4>
              <h4>Meter No.</h4>
              <h4>Current Balance</h4>
              <h4>Previous Balance</h4>
              <h4>Invoice Amount</h4>
              <h4>Location</h4>
            </div>
            {props.many?.data.map((item, index) => {
              return (
                <div key={index} className="dt">
                  {<p>{item.Name}</p>}
                  {<p>{item.AccountNo}</p>}
                  {<p>{item.MeterNo}</p>}
                  {<p>{item.CurrentBal}</p>}
                  {<p>{item.PreviousBal}</p>}
                  {<p>{item.InvoiceAmount}</p>}
                  <p>{item.Location}</p>
                </div>
              );
            })}
            <h4>Total customers in group: {props.many.count}</h4>
          </div>
        ) : (
          <div className="single">
            {console.log(props.single)}
            {props.current === "incidences" ? (
              <>
                <h3>
                  {props.single.Date.split("T")[0].replaceAll("-", "/")} {" - "}{" "}
                  {props.single.Date.split("T")[1].substr(0, 5)}
                </h3>
                <img
                  src={
                    "http://102.222.147.190/api/uploads/" +
                    props.single.Image.split("\\")[1]
                  }
                  alt=""
                />
                <p>
                  Type: <span>{props.single.Type}</span>
                </p>
                <p>
                  Description: <span>{props.single.Description}</span>
                </p>
                <p>
                  SerialNo: <span>{props.single.SerialNo}</span>
                </p>
                <p>
                  Status: <span>{props.single.Status}</span>
                </p>
              </>
            ) : (
              <>
                <h3>Details</h3>
                <p>
                  Name: <span>{props.single.Name}</span>
                </p>
                <p>
                  Account No: <span>{props.single.AccountNo}</span>
                </p>
                <p>
                  Meter No: <span>{props.single.MeterNo}</span>
                </p>
                <p>
                  Current Balance: <span>{props.single.CurrentBal}</span>
                </p>
                <p>
                  Invoice Amount: <span>{props.single.InvoiceAmount}</span>
                </p>
                <p>
                  Previous Balance: <span>{props.single.PreviousBal}</span>
                </p>
                <p>
                  Location: <span>{props.single.Location}</span>
                </p>

                <h4>Explore more in the data section</h4>
              </>
            )}
          </div>
        )}
        <i className="fa fa-caret-down"></i>
      </div>
    </div>
  );
}
