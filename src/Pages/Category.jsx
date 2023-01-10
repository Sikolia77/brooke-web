import "../Styles/landing.scss";
import React, { useState } from "react";
import Header from "../components/Utils/header";
import "leaflet/dist/leaflet.css";
import { useEffect } from "react";
import MapCategory from "../components/maps/MapCategory";

export default function Category(props) {
  const [data, setData] = useState();
  const instanceId = window.location.pathname.split("/")[2].replace("%20", " ");

  useEffect(() => {
    fetch(`/api/gis/category/${props.category}/0`, {
      method: "get",
      credentials: "include",
    })
      .then((res) => {
        if (res.ok) return res.json();
        else throw Error("");
      })
      .then((data) => {
        setData(data);
      })
      .catch((e) => {});
  }, []);

  return (
    <div>
      <div className="headings">
        <Header
          isAuthenticated={props.isAuthenticated}
          setIsAuthenticated={props.setIsAuthenticated}
          currentUser={props.currentUser}
          setCurrentUser={props.setCurrentUser}
        />
      </div>
      <div className="InstancesPage">
        <MapCategory category={instanceId} />
      </div>
    </div>
  );
}
