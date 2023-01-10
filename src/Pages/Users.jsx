import "../Styles/users.scss";
import Header2 from "../components/Utils/Header2";
import Navigation from "../components/Utils/Navigation";
import Users from "../components/Users/Users";
import UsrStats from "../components/Users/UsrStats";
import { useState } from "react";

export default function UsersPage(props) {
  const [total, setTotal] = useState(0);
  const [active, setActive] = useState(0);
  const [inactive, setInactive] = useState(0);
  const [time, setTime] = useState("");

  return (
    <div className="dataPage">
      <Navigation active="Users" />
      <div className="MainsContent">
        <Header2 active="Private Users" />
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
