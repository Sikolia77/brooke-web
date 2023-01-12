import { useState, useEffect } from "react";
import Item from "./Item";
import BuildQuery from "./BottomPanel/BuildQuery";
import Search from "./BottomPanel/Search";
// import Print from "./BottomPanel/Print";

export default function BottomPanel(props) {
  const [show, setShow] = useState(false);
  const [showing, setShowing] = useState(1);

  const toggle = (number) => {
    setShow(!show);
    setShowing(number);
  };

  return (
    <div className="BottomPanel">
      {show && (
        <div className="Popup">
          <i
            onClick={() => {
              toggle();
            }}
            className="fa fa-close"
          >
            &#xf00d;
          </i>
          {showing === 1 && (
            <BuildQuery body={props.body} updateBody={props.updateBody} />
          )}
          {showing === 2 && (
            <Search body={props.body} updateBody={props.updateBody} />
          )}
          {/* {showing === 3 && (
            <AOI body={props.body} updateBody={props.updateBody} />
          )} */}
          {/* {showing === 4 && (
            <Print
              body={props.body}
              printMap={props.printMap}
              updateBody={props.updateBody}
              simpleMapScreenshoter={props.simpleMapScreenshoter}
              pChartImgUrl={props.pChartImgUrl}
              setPChartImgUrl={props.setPChartImgUrl}
              bChartImgUrl={props.bChartImgUrl}
              setBChartImgUrl={props.setBChartImgUrl}
            />
          )} */}
        </div>
      )}

      <div className="opts">
        <Item txt="Query" id={1} toggle={toggle} />
        <Item txt="Search" id={2} toggle={toggle} />
        {/* <Item txt="AOI" id={3} toggle={toggle} /> */}
        <Item txt="Print" id={4} toggle={toggle} />
      </div>
    </div>
  );
}
