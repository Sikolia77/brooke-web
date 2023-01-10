import "../Styles/createuser.scss";
import Header from "../components/Utils/header";
import { useEffect, useState } from "react";
import NewPortalUser from "../components/Users/NewPortalUser";
import UserActivity from "../components/Users/UserActivity";
import Navigation from "../components/Utils/Navigation";

const Item = (props) => {
  const onClick = () => {
    props.setActive(props.txt);
  };
  return (
    <>
      {props.txt === props.active ? (
        <h4
          onClick={() => {
            onClick();
          }}
          className="active"
        >
          {props.txt}
        </h4>
      ) : (
        <h4
          onClick={() => {
            onClick();
          }}
          className="item"
        >
          {props.txt}
        </h4>
      )}
    </>
  );
};

const Filter = (props) => {
  const onClick = () => {
    props.setFilter(props.txt);
  };

  return (
    <>
      {props.txt === props.active ? (
        <h5
          onClick={() => {
            onClick();
          }}
          className="active"
        >
          {props.txt}
        </h5>
      ) : (
        <h5
          onClick={() => {
            onClick();
          }}
          className="item"
        >
          {props.txt}
        </h5>
      )}
    </>
  );
};

export default function Users(props) {
  const [active, setActive] = useState("Portal Users");
  const [data, setData] = useState(null);
  const [filter, setFilter] = useState("All Users");
  const [stats, setStats] = useState({ total: 0, active: 0, inactive: 0 });

  const toggleActive = (v) => {
    setActive(v);
  };

  useEffect(() => {
    if (active === "Portal Users" || active === "Mobile App Users") {
      setData(data);
      let url = active === "Portal Users" ? "auth" : "mobile";
      fetch(`/api/${url}/activity/0`)
        .then((res) => {
          if (res.ok) return res.json();
          else throw Error("");
        })
        .then((data) => {
          setData(data);
        })
        .catch((e) => {});
    }
  }, [active]);

  return (
    <div className="users">
      <Header active="Users" />
      <div className="newusercontent">
        <Navigation active="Create User" />
        <div className="bot">
          <div className="main">
            <NewPortalUser />
          </div>
          <div className="right">
            {data &&
              data.map((item, index) => {
                return (
                  <UserActivity
                    key={index}
                    Name={item.Name}
                    created={item.createdAt}
                    updated={item.updatedAt}
                  />
                );
              })}
          </div>
        </div>
      </div>
    </div>
  );
}
