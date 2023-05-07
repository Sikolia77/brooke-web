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
              <NavGroup title="Amimal Health">
                <NavLink active="Agrovets" url="/monitoring" txt="Agrovets" />
                <NavLink
                  active={props.active}
                  url=""
                  txt="Community Engagement"
                />
                <NavLink
                  active={props.active}
                  url=""
                  txt="Advocacy and Innovation"
                />
              </NavGroup>
              <NavGroup title="Community Engagement">
                <NavLink active={props.active} url="" txt="Equine Owners" />
                <NavLink active={props.active} url="" txt="Community Groups" />
                <NavLink active={props.active} url="" txt="Care Clubs" />
              </NavGroup>
              <NavGroup title="Advocacy and Innovation">
                <NavLink active={props.active} url="" txt="Agrovets" />
                <NavLink
                  active={props.active}
                  url=""
                  txt="Community Engagement"
                />
                <NavLink
                  active={props.active}
                  url=""
                  txt="Advocacy and Innovation"
                />
              </NavGroup>
              <NavGroup title="Partners">
                <NavLink active={props.active} url="" txt="Partners" />
              </NavGroup>
              <NavGroup title="Communication">
                <NavLink active={props.active} url="" txt="Communication" />
              </NavGroup>
            </div>
            <div className="div2">
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
