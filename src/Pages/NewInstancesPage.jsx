import "../Styles/NewInstancesPage.scss";
import { useState, useEffect } from "react";
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
  const [currentUser, setCurrentUser] = useState();
  const [isAuthenticated, setIsAuthenticated] = useState(true);

  var jwt = require("jsonwebtoken");

  useEffect(() => {
    const token = localStorage.getItem("cilbup_ksa");
    if (token) {
      try {
        var decoded = jwt.decode(token);
        setCurrentUser(decoded);

        if (Date.now() >= decoded.exp * 1000) {
          setIsAuthenticated(false);
        } else {
          setIsAuthenticated(true);
        }
      } catch (error) {
        setIsAuthenticated(false);
      }
    } else {
      setIsAuthenticated(false);
    }
  }, [isAuthenticated]);

  return (
    <div className="NewinstancesPage">
      <Header
        isAuthenticated={isAuthenticated}
        setIsAuthenticated={setIsAuthenticated}
        currentUser={currentUser}
        setCurrentUser={setCurrentUser}
      />
      <div className="newData">
        <Navigation active="Create Map" />
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
