import React from "react";
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

    const images = [bg0, bg1, bg2,bg3,bg4,bg5];

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
            className="landingHeader"
            isAuthenticated={this.props.isAuthenticated}
            setIsAuthenticated={this.props.setIsAuthenticated}
            currentUser={this.props.currentUser}
            setCurrentUser={this.props.setCurrentUser}
          />

          <div className="div2equal">
            <div>
              <h4>Welcome to</h4>
              <br></br>
              <h1>
                Kenya Space <br></br> Agency
              </h1>
              <br></br>
              <h3>
                <i className="fa  fa-angle-right"></i> Data Portal
              </h3>
              <h3>
                <i className="fa  fa-angle-right"></i> Open Data Cube
              </h3>
            </div>
            <div>
              <p>
                KSA Data Portal creates and maintains a range of significant
                spatial datasets that are useful to a number of stakeholders.
              </p>
              <p>
                These datasets are now being made available to the public
                through this portal.
              </p>
              <p>
                The spatial portal provides access to spatial datasets through
                an intuitive public interface that allows the searching, viewing
                and downloading of data.
              </p>
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
