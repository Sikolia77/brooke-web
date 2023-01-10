import "../Styles/InstancesPage.scss";
import { useEffect, useState } from "react";
import UsrStats from "../components/Instances/UsrStats";
import Header2 from "../components/Utils/Header2";
import Header from "../components/Utils/header";
import MapCategory from "../components/maps/MapCategory";
import Navigation from "../components/Utils/Navigation";

export default function InstancesPage(props) {
  const [categories, setCategories] = useState(null);
  const [time, setTime] = useState(null);
  const [stats, setStats] = useState({
    total: null,
    categories: null,
    active: null,
  });

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

  return (
    <div className="wrappers">
      <div className="publishedData">
        <div className="MainsContent">
          <div className="InstancesPage">
            {categories &&
              categories.map((item, index) => {
                return <MapCategory key={index} category={item.Category} />;
              })}
          </div>
        </div>
      </div>
    </div>
  );
}
