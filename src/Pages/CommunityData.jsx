import Header from "../components/Utils/header";
import { useEffect, useState } from "react";
import Maps from "../components/maps/NetworksMap";
import "../Styles/mapdata.scss";
import Navigation from "../components/Utils/Navigation2";

export default function CommunityData(props) {
  const [active, setActive] = useState(null);
  const [data, setData] = useState(null);
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
    <div className="mapdata">
      <div className="MainingsContent">
        <Header
          active="MapData"
          isAuthenticated={props.isAuthenticated}
          setIsAuthenticated={props.setIsAuthenticated}
          currentUser={currentUser}
          setCurrentUser={setCurrentUser}
        />
        <div className="home ">
          <Navigation active="Community Engagement" />
          <Maps url="CommunityEngagement" />
        </div>
      </div>
    </div>
  );
}
