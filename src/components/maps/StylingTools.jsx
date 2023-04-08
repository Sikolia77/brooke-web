import { useState } from "react";
import Charts from "./SidePanel/Charts";
import Export from "./SidePanel/Export";
import Layers from "./SidePanel/Layers";
import Metadata from "./SidePanel/Metadata";
import Bar from "./SidePanel/Others/Bar";
import MyStyler from "./SidePanel/Topo/MyStyler";
import Styles from "./SidePanel/Topo/Styles";
import Data from "./SidePanel/Data";
import DataTopo from "./SidePanel/DataTopo";
import stylingicon from "../../assets/imgs/styling.png";
export default function StyleMap(props) {
  const [show, setShow] = useState(false);
  const [showing, setShowing] = useState(0);
  const [styler, setStyler] = useState(null);

  const openStyler = (value) => {
    setStyler(value);
  };

  const toggle = (number) => {
    setShow(!show);
    setShowing(number);
  };

  return (
    <div className="stylingicon">
      {props.body && (
        <>
          <div className="bar">
            {!props.worldData && <Bar id={2} toggle={toggle} icon={stylingicon} />}
          </div>
          {show && (
            <>
              <div className="Popup">
                <i
                  onClick={() => {
                    toggle();
                  }}
                  className="fa fa-close"
                >
                  &#xf00d;
                </i>
                {showing === 0 && !props.update && (
                  <>
                    {props.body.attributes.Theme !== "Topo Map" ? (
                      <Data body={props.body} updateBody={props.updateBody} />
                    ) : (
                      <DataTopo
                        body={props.body}
                        updateBody={props.updateBody}
                      />
                    )}
                  </>
                )}
                {showing === 1 &&
                  props.body.attributes.Theme !== "Topo Map" && (
                    <Charts
                      body={props.body}
                      updateBody={props.updateBody}
                      pChartImgUrl={props.pChartImgUrl}
                      setPChartImgUrl={props.setPChartImgUrl}
                      bChartImgUrl={props.bChartImgUrl}
                      setBChartImgUrl={props.setBChartImgUrl}
                    />
                  )}
                {showing === 2 && (
                  <>
                    {props.body.attributes.Theme !== "Topo Map" ? (
                      <Layers body={props.body} updateBody={props.updateBody} />
                    ) : (
                      <Styles
                        body={props.body}
                        updateBody={props.updateBody}
                        openStyler={openStyler}
                      />
                    )}
                  </>
                )}
                {showing === 3 && (
                  <Metadata body={props.body} updateBody={props.updateBody} />
                )}
              </div>
              {props.body.styles?.length > 0 && styler != null && (
                <MyStyler
                  body={props.body}
                  updateBody={props.updateBody}
                  index={styler}
                  openStyler={openStyler}
                />
              )}
            </>
          )}
        </>
      )}
    </div>
  );
}
