import NavLink from "./NavLink";
import NavGroup from "./NavGroup";
import logout from "../../assets/imgs/logout.png";
import { useEffect, useState, useLocation } from "react";
import pdf from "../../assets/Files/Admin Portal Documentation.pdf";
import MapCategory from "../maps/MapCategory";
import Advocacy from "../PublishedInstances/Advocacy";

export default function Navigation2(props) {
  const [toggleNav, setToggleNav] = useState(true);
  const logoutMethod = () => {
    fetch("/api/auth/logout", {
      method: "get",
      credentials: "include",
    })
      .then((res) => {
        return res.json();
      })
      .then((data) => {
        localStorage.clear();
        window.location.href = "/";
      })
      .catch((e) => {});
  };

  const [role, setRole] = useState();

  var jwt = require("jsonwebtoken");

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (token) {
      var decoded = jwt.decode(token);
      setRole(decoded.Role);
    } else {
      setRole();
    }
  }, []);

  return (
    <div className="Utils">
      {toggleNav ? (
        <>
          <div className="Navigation">
            <div className="div1">
              <NavGroup title="PUBLISHED DATA">
                <NavLink
                  active={props.active}
                  url="/animalhealthdata"
                  txt="Animal Health"
                />
                <NavLink
                  active={props.active}
                  url="/communitydata"
                  txt="Community Engagement"
                />
                <NavLink
                  active={props.active}
                  url="/mapdata"
                  txt="Advocacy and Innovation"
                />
                <NavLink
                  active={props.active}
                  url="/communicationsdata"
                  txt="Communication"
                />
                <NavLink
                  active={props.active}
                  url="/partnersdata"
                  txt="Partners"
                />
              </NavGroup>
            </div>
            <div className="div2">
              <div
                className="logout"
                onClick={() => {
                  logoutMethod();
                }}
              >
                <img src={logout} alt="" />
                <h4>Logout</h4>
              </div>
              <div>
                <p>
                  Powered by <br></br>
                  <a href="https://www.neatline.co.ke/" target="_blank">
                    Neatline Geoservices.
                  </a>
                </p>
              </div>
            </div>
          </div>
        </>
      ) : (
        <>
          <div className="hideNav">
            <i
              className="fa fa-bars"
              onClick={() => {
                setToggleNav(true);
              }}
            ></i>
          </div>
        </>
      )}
    </div>
  );
}
