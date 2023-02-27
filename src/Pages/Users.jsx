import "../Styles/users.scss";
import Header2 from "../components/Utils/Header2";
import Navigation from "../components/Utils/Navigation";
import Users from "../components/Users/Users";
import UsrStats from "../components/Users/UsrStats";
import { useState, useEffect } from "react";
import Header from "../components/Utils/header";

export default function UsersPage(props) {
  const [total, setTotal] = useState(0);
  const [active, setActive] = useState(0);
  const [inactive, setInactive] = useState(0);
  const [time, setTime] = useState("");
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
    <div className="users">
      <Header
        active="Users"
        isAuthenticated={isAuthenticated}
        setIsAuthenticated={setIsAuthenticated}
        currentUser={currentUser}
        setCurrentUser={setCurrentUser}
      />
      <div className="newusercontent">
        <Navigation active="Users" />
        <div className="UsersPage">
          <UsrStats
            total={total}
            active={active}
            inactive={inactive}
            time={time}
          />
          <Users
            setTotal={setTotal}
            setActive={setActive}
            setInactive={setInactive}
            setTime={setTime}
          />
        </div>
        ;
      </div>
    </div>
  );
}
