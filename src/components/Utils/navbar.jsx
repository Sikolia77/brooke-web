import React, { useState } from "react";
import ModalHeader from "./modal_header";
import { useLocation } from "react-router-dom";

function NavLink(props) {
  const location = useLocation();
  let link;
  if (props.url === location.pathname) {
    link = (
      <h4
        className="underline"
        onClick={() => {
          window.location.href = props.url;
        }}
      >
        {props.txt}
      </h4>
    );
  } else {
    link = (
      <h4
        onClick={() => {
          window.location.href = props.url;
        }}
      >
        {props.txt}
      </h4>
    );
  }
  return link;
}

export default function Navbar(props) {
  const [clicked, setClicked] = useState(false);

  const toggleMenu = () => {
    setClicked(!clicked);
  };

  const logout = () => {
    fetch("/api/auth/logout", {
      method: "get",
      credentials: "include",
    })
      .then((res) => {
        return res.json();
      })
      .then((data) => {
        window.location.href = "/login";
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <div>
      <div className="navbar" id="navbar">
        <div className="navbar">
          <div className="nav">
            <NavLink txt="Home" url="/" />
            <NavLink txt="Geoportal" url="/map" />
            <NavLink txt="Application Sectors" url="/application_sectors" />
            <NavLink txt="Collaborators" url="/collaborators" />
            <NavLink txt="Search" url="/search" />
            <NavLink txt="Contact Us" url="/contactus" />
            <NavLink txt="Admin" url="/admin" />
          </div>
        </div>
      </div>
      {clicked && (
        <ModalHeader
          active={props.active}
          logout={logout}
          toggleMenu={toggleMenu}
        />
      )}
    </div>
  );
}
