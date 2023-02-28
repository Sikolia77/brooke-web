import React, { useRef, useState, useEffect } from "react";
import Header from "../components/Utils/header";
import Navigation from "../components/Utils/Navigation";
import MapCategory from "../components/maps/MapCategory2";

export default function AnimalHealthPublished(props) {
  const [isAuthenticated, setIsAuthenticated] = useState(true);
  const [currentUser, setCurrentUser] = useState();
  const [categories, setCategories] = useState(null);
  const [time, setTime] = useState(null);
  const [stats, setStats] = useState({
    total: null,
    categories: null,
    active: null,
  });
  const [data, setData] = useState(null);
  const [offset, setOffset] = useState(0);
  let prg = "";

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
    <div className="AdminPage">
      <div className="MainsContent">
        <div className="headings">
          <Header
            active="Admin"
            isAuthenticated={props.isAuthenticated}
            setIsAuthenticated={props.setIsAuthenticated}
            currentUser={props.currentUser}
            setCurrentUser={props.setCurrentUser}
          />
        </div>

        <div className="publishedData">
          <div className="MainsContent">
            <div className="InstancesPage">
              <MapCategory category="Health" />;
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
