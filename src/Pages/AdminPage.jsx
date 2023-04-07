import React, { useRef, useState, useEffect, useLocation } from "react";
import Header from "../components/Utils/Header2";
import UsrStats from "../components/Instances/UsrStats";
import MapCategory from "../components/maps/MapCategory";
import Navigation from "../components/Utils/Navigation";

export default function AdminPage(props) {
  const [isAuthenticated, setIsAuthenticated] = useState(true);
  const [currentUser, setCurrentUser] = useState();
  const [categories, setCategories] = useState(null);
  const [time, setTime] = useState(null);
  const [stats, setStats] = useState({
    total: null,
    categories: null,
    active: null,
  });

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

  useEffect(() => {
    fetch("/api/gis/category", {
      method: "get",
      credentials: "include",
    })
      .then((res) => {
        if (res.ok) return res.json();
        else throw Error("");
      })
      .then((data) => {
        var today = new Date();
        var date =
          today.getFullYear() +
          "-" +
          (today.getMonth() + 1) +
          "-" +
          today.getDate();
        var time =
          today.getHours() +
          ":" +
          today.getMinutes() +
          ":" +
          today.getSeconds();
        var dateTime = date + " " + time;

        let d = stats;
        d.total = data?.total;
        d.categories = data?.result?.length;
        d.active = data?.active;
        setTime(dateTime);
        setStats(d);
        setCategories(data?.result);
      })
      .catch((e) => {
        console.log(e);
      });
  }, []);

  return (
    <div className="AdminPage">
      <div className="MainsContent">
        <div className="headings2">
          <Header
            active="Admin"
            isAuthenticated={props.isAuthenticated}
            setIsAuthenticated={props.setIsAuthenticated}
            currentUser={currentUser}
            setCurrentUser={setCurrentUser}
          />
        </div>

        <div className="publishedData">
          <Navigation active="Summary" />
          <div className="MainsContent">
            <div className="InstancesPage">
              <UsrStats stats={stats} time={time} />
              {categories &&
                categories.map((item, index) => {
                  return <MapCategory key={index} category={item.Category} />;
                })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
