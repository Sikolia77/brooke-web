import React, { useEffect, useState } from "react";
import bg0 from "../../assets/imgs/bg0.jpg";
import bg1 from "../../assets/imgs/bg1.jpg";
import bg2 from "../../assets/imgs/bg2.jpg";
import bg3 from "../../assets/imgs/bg3.jpg";
import bg4 from "../../assets/imgs/bg4.jpg";
import bg5 from "../../assets/imgs/bg5.jpg";
import Header from "../Utils/header";

export default class Hero extends React.Component {
  constructor(props) {
    super(props);

    const images = [bg0, bg1, bg2, bg3, bg4, bg5];

    this.state = {
      images,
      currentImg: 0,
    };
  }

  componentDidMount() {
    this.interval = setInterval(() => this.changeBackgroundImage(), 10000);
  }

  componentWillUnmount() {
    if (this.interval) {
      clearInterval(this.interval);
    }
  }

  changeBackgroundImage() {
    let newCurrentImg = 0;
    const { images, currentImg } = this.state;
    const noOfImages = images.length;

    if (currentImg !== noOfImages - 1) {
      newCurrentImg = currentImg + 1;
    }

    this.setState({ currentImg: newCurrentImg });
  }

  render() {
    const { images, currentImg } = this.state;
    const urlString = `url('${images[currentImg]}')`;

    return (
      <div className="cf" style={{ backgroundImage: urlString }}>
        <div className="overlay">
          <Header
            isAuthenticated={props.isAuthenticated}
            setIsAuthenticated={props.setIsAuthenticated}
            currentUser={props.currentUser}
            setCurrentUser={props.setCurrentUser}
          />

          <div className="div2equal">
            <div className="contentSection">
              <div className="aboutUs">
                <div>
                  <h1>About KSA</h1>
                  <div className="descriptionContent">
                    <p>
                      KSA is mandated to promote, coordinate and regulate space
                      related activities in the country. This will be achieved
                      through promotion of research and innovations in space
                      science, technology and respective applications as well as
                      enhancing the regulatory framework. It will also spur
                      Kenya’s competitiveness and positioning in playing a
                      critical role in the regional and global space agenda
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div>
              <h1>About Data Portal</h1>
              <div className="descriptionContent">
                <p>
                  The KSA Data Portal is a tool for the handling and management
                  of geospatial data. It facilitates the dissemination and
                  sharing of geospatial data and maps across stakeholders
                  promoting the ease of access to geospatial resources.
                  <br />
                  The KSA Data Portal provides a framework for updating and
                  sharing information in real-time for planning and management
                  purposes. The Data Portal supports a range of users such as
                  education institutions, research firms, and government
                  agencies.
                </p>
              </div>
            </div>
          </div>

          <div className="cats">
            <h4>
              <i className="fa  fa-angle-right"></i> Thematic Maps
            </h4>
            <h4>
              <i className="fa  fa-angle-right"></i>Topegraphic Maps
            </h4>
            <h4>
              <i className="fa  fa-angle-right"></i>Basemaps and
              Satellite/Aerial/Drone Images
            </h4>
            <h4>
              <i className="fa  fa-angle-right"></i>Spatial Data
            </h4>
          </div>
        </div>
      </div>
    );
  }
}
