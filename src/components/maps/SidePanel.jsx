import { useState } from "react";
import Charts from "../maps/SidePanel/Charts";
import Export from "../maps/SidePanel/Export";
import Layers from "../maps/SidePanel/Layers";
import Metadata from "../maps/SidePanel/Metadata";
import Bar from "../maps/SidePanel/Others/Bar";
import MyStyler from "./SidePanel/Topo/MyStyler";
import Styles from "./SidePanel/Topo/Styles";
import Data from "./SidePanel/Data";
import DataTopo from "./SidePanel/DataTopo";
export default function SidePanel(props) {
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
    <div className="sidepanel">
      {props.body && (
        <>
          <div className="bar">
            {props.update ||
              (props.new && <Bar txt="Data" id={0} toggle={toggle} />)}
            {!props.worldData && <Bar txt="Styling" id={2} toggle={toggle} />}
            {!props.worldData && props.body.attributes.Theme !== "Topo Map" && (
              <Bar txt="Analysis" id={1} toggle={toggle} />
            )}

            {/* <Bar txt="Data" id={0} toggle={toggle} />
            <Bar txt="Analysis" id={1} toggle={toggle} />
            <Bar txt="Layers" id={2} toggle={toggle} /> */}
            <Bar txt="Metadata" id={3} toggle={toggle} />
            <Bar txt="Export" id={4} toggle={toggle} />
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
                {showing === 4 && (
                  <Export
                    body={props.body}
                    updateBody={props.updateBody}
                    instanceId={props.instanceId}
                    instance={props.body}
                  />
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
