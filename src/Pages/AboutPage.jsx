import React from "react";
import Header from "../components/Utils/header";
import about1Background from "../assets/imgs/about_1_background.jpg";
import about2Background from "../assets/imgs/donkey.png";

export default function AboutPage(props) {
  return (
    <div className="AboutPage">
      <Header
        isAuthenticated={props.isAuthenticated}
        setIsAuthenticated={props.setIsAuthenticated}
        currentUser={props.currentUser}
        setCurrentUser={props.setCurrentUser}
      />
      <section className="aboutPage section-1">
        <div className="text-main">
          {/* <h1>About</h1> */}
          <h2>The GIS Portal</h2>
          <p>
            The data portal is our one stop platform that allows you to access,
            visualize and analyze our collections of data. The portal helps our
            users save time by availing useful, relevant and easy to understand
            sets of data. It also provides spatial data analysis and
            visualization (also known as GIS) capabilities. <br />
            <br /> By availing data remotely through this portal, we have
            facilitated institutions and individuals to save time and
            operational costs taken to access and set up data locally as would
            be the case in an analogue setup. <br />
          </p>
        </div>
        <div
          className="img-hero"
          style={{
            backgroundImage: `url(${about2Background})`,
          }}
        ></div>
      </section>
      <section className="aboutPage section-3">
        <h2>GIS Portal Purpose and Functionality</h2>

        <div className="container">
          <div>
            <h4>Disseminating Spatial Data</h4>
            <p>
              This platform enables the organisation to share spatial data and
              maps in diverse formats such as PDF, Shapefiles, KML, GeoJSON, and
              Web Services.
            </p>
          </div>
          <div>
            <h4>Data Analysis</h4>
            <p>
              The platform provides several data analysis capabilities. Users
              can build simple to complex queries for the analysis of data
              attributes. The portal's search function allows query for specific
              data.
            </p>
          </div>

          <div>
            <h4>Report Generation</h4>
            <p>
              After perfoming their data analysis, users are able to generate a
              report of their interaction with the data automatically. The
              portal allows export generation of PDF reports from its available
              templates which users can edit and export.
            </p>
          </div>
          <div>
            <h4>Download Data</h4>
            <p>
              Users are able to download spatial data in different data formats.
              Data available to users ranges from thematic data, topographical
              maps, cadastral maps to aerial images and web services.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
