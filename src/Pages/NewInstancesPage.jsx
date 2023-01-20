import "../Styles/NewInstancesPage.scss";
import { useState } from "react";
import { MapContainer, TileLayer } from "react-leaflet";
import Options from "../components/maps/Options";
import Header2 from "../components/Utils/Header2";
import Navigation from "../components/Utils/Navigation";
import myData from "../assets/data/data";
import Advocacy from "../components/Advocacy/Advocacy";
import CommunityEngagement from "../components/CommunityEngagement/CommunityEngagement";
import AnimalHealth from "../components/AnimalHealth/AnimalHealth";
import WorldData from "../components/WorldData/WorldData";
import BaseMap from "../components/BaseMap/BaseMap";
import TopoMap from "../components/TopoMap/TopoMap";
import Header from "../components/Utils/header";
import Communication from "../components/Communication/Communication";
import Partners from "../components/Partners/Partners";

export default function NewInstancesPage(props) {
  const [type, setType] = useState(null);

  return (
    <div className="NewinstancesPage">
      <Header
        isAuthenticated={props.isAuthenticated}
        setIsAuthenticated={props.setIsAuthenticated}
        currentUser={props.currentUser}
        setCurrentUser={props.setCurrentUser}
      />
      <div className="newData">
        <Navigation active="Add Data" />
        <div className="dataSection">
          {!type ? (
            <>
              <Options setType={setType} />
            </>
          ) : (
            <>
              {type === "Advocacy" && <Advocacy theme={type} />}
              {type === "Community" && <CommunityEngagement theme={type} />}
              {type === "Health" && <AnimalHealth theme={type} />}
              {type === "Communication" && <Communication theme={type} />}
              {type === "Partners" && <Partners theme={type} />}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
