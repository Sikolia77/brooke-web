import { useState } from "react";
import AddData from "./Topo/AddData";
import ShowLayers from "./Topo/ShowLayers";

export default function DataTopo(props) {
  const [showing, setShowing] = useState(true);

  const toggleShowing = () => {
    setShowing(!showing);
  };

  return (
    <div className="items">
      <h3>Data</h3>
      {showing ? (
        <ShowLayers
          body={props.body}
          updateBody={props.updateBody}
          toggleShowing={toggleShowing}
        />
      ) : (
        <AddData
          body={props.body}
          updateBody={props.updateBody}
          toggleShowing={toggleShowing}
        />
      )}
    </div>
  );
}
