import Header from "../components/Utils/header";
import { useEffect, useState } from "react";
import Maps from "../components/maps/NetworksMap";
import "../Styles/mapdata.scss";
import Navigation from "../components/Utils/Navigation2";

export default function AnimalHealthData(props) {
  const [active, setActive] = useState(null);
  const [data, setData] = useState(null);

  return (
    <div className="mapdata">
      <div className="MainingsContent">
        <Header active="MapData" />
        <div className="home ">
          <Navigation active="Animal Health" />
          <Maps url="AnimalHealth"/>
        </div>
      </div>
    </div>
  );
}
