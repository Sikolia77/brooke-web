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

export default function NewInstancesPage(props) {
  const [type, setType] = useState(null);

  return (
    <div className="hello">
      <Header active="Admin" />
      <div className="cont">
        <div className="publishedData">
          <Navigation active="Publish Instance" />
          <div className="NewInstancesPage">
            {!type ? (
              <>
                <MapContainer
                  style={{ width: "100%", height: "93vh" }}
                  center={[-1.2921, 36.8219]}
                  zoom={8}
                  maxZoom={12}
                  zoomControl={false}
                >
                  <TileLayer
                    attribution={myData[0].attribution}
                    url={myData[0].url}
                  />
                </MapContainer>
                <Options setType={setType} />
              </>
            ) : (
              <>
                {type === "Advocacy" && <Advocacy theme={type} />}
                {type === "Community" && <CommunityEngagement theme={type} />}
                {type === "Health" && <AnimalHealth theme={type} />}
                {type === "Communication" && <Communication theme={type} />}
                {type === "Topo Map" && <TopoMap theme={type} />}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
