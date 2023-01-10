import React, { useRef, useState, useEffect } from "react";
import Header from "../../components/Utils/header";
import Navigation from "../../components/Utils/Navigation";
import Pagination from "../Utils/pagination";
import Thumbnail from "../maps/Thumbnail";
import InstancesPage from "../../Pages/InstancesPage";
import MapCategory from "../maps/MapCategory";
import UsrStats from "../Instances/UsrStats";

export default function Advocacy(props) {
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

  useEffect(() => {
    console.log("res");
    fetch("/api/gis/category", {
      method: "get",
      credentials: "include",
    })
      .then((res) => {
        console.log(res);
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

  useEffect(() => {
    fetch(`/api/gis/category/${props.category}/${offset}`)
      .then((res) => {
        if (res.ok) return res.json();
        else throw Error("");
      })
      .then((data) => {
        setData(data);
      })
      .catch((e) => {});
  }, [offset]);

  function scrollPages(offset) {
    setOffset(offset);
  }

  return (
    <div className="AdminPage">
      <div className="MainsContent">
        <Header
          active="Admin"
          isAuthenticated={props.isAuthenticated}
          setIsAuthenticated={props.setIsAuthenticated}
          currentUser={props.currentUser}
          setCurrentUser={props.setCurrentUser}
        />
        <div className="publishedData">
          <Navigation active="Published Instances" />
          <div className="MainsContent">
            <div className="InstancesPage">
              <UsrStats stats={stats} time={time} />
              {categories &&
                categories.map((item, index) => {
                  return <MapCategory key={index} category="Advocacy" />;
                })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
