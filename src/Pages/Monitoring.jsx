import Header from "../components/Utils/Header2";
import { useEffect, useState } from "react";
import "../Styles/mapdata.scss";
import Navigation from "../components/Utils/Navigation3";
import MonitoringData from "../components/Monitoring/MonitoringData";

export default function Monitoring(props) {
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
        <div className="headings2">
          <Header
            active="Monitoring"
            isAuthenticated={isAuthenticated}
            setIsAuthenticated={setIsAuthenticated}
            currentUser={currentUser}
            setCurrentUser={setCurrentUser}
          />
        </div>
        <div className="home ">
          <Navigation active="Monitoring" />
          <MonitoringData
            active="Agrovets"
            url="/api/agrovets/monitoring/all"
            title="Agrovets"
          />
        </div>
      </div>
    </div>
  );
}
