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
      <div>
        <div className="cf" style={{ backgroundImage: urlString }}>
          <div className="overlay">
            <Header
              isAuthenticated={this.props.isAuthenticated}
              setIsAuthenticated={this.props.setIsAuthenticated}
              currentUser={this.props.currentUser}
              setCurrentUser={this.props.setCurrentUser}
            />
            <div className="msg">
              <h1>Let's Start a Conversation</h1>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
