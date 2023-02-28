import "../Styles/home.scss";
import React, { useState } from "react";
import Header from "../components/Utils/header";
import "leaflet/dist/leaflet.css";
import { useLocation } from "react-router-dom";

function DataLink(props) {
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

export default function Landing(props) {
  return (
    <div className="landpage">
      <div className="headings">
        <Header
          isAuthenticated={props.isAuthenticated}
          setIsAuthenticated={props.setIsAuthenticated}
          currentUser={props.currentUser}
          setCurrentUser={props.setCurrentUser}
        />
      </div>
      <div className="landingnew">
        <div className="lcontainer">
          <div className="wrap">
            <div className="top">
              <h1>BROOKE EAST AFRICA GIS PORTAL</h1>
            </div>
            <div className="about">
              <p>
                Brooke East Africa is a charity affliate organisation of Brooke
                UK that protects and improves the lives of working equines,
                which promote equine centric thriving communities and systems
              </p>
            </div>
            <div className="icons">
              <div className="depts">
                <DataLink txt="Partners" url="/publishedpartners" />
              </div>
              <div className="depts">
                <DataLink
                  txt="Community Engagement"
                  url="/publishedcommunity"
                />
              </div>
              <div className="depts">
                <DataLink txt="Animal Health" url="/publishedhealth" />
              </div>
              <div className="depts">
                <DataLink
                  txt="Innovation and Advocacy"
                  url="/publishedadvocacy"
                />
              </div>
              <div className="depts">
                <DataLink txt="Communication" url="/publishedcommunications" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
