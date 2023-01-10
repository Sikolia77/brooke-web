import React, { useEffect, useState } from "react";
import bg0 from "../../assets/imgs/bg0.jpg";
import bg1 from "../../assets/imgs/bg1.jpg";
import bg2 from "../../assets/imgs/bg2.jpg";
import bg3 from "../../assets/imgs/bg3.jpg";
import bg4 from "../../assets/imgs/bg4.jpg";
import bg5 from "../../assets/imgs/bg5.jpg";
import Cards from "./Cards";

const Item = (props) => {
  if (props.txt === props.current)
    return (
      <button
        onClick={() => {
          window.location.href = `/category/${props.cat}`;
        }}
        className="active"
      >
        {props.txt}
      </button>
    );
  else
    return (
      <button
        onClick={() => {
          window.location.href = `/category/${props.cat}`;
        }}
      >
        {props.txt}
      </button>
    );
};

export default class HeroSlide extends React.Component {
  constructor(props) {
    super(props);

    const images = [bg0, bg1, bg2, bg3, bg4, bg5];

    this.state = {
      images,
      currentImg: 0,
    };
  }

  componentDidMount() {
    this.interval = setInterval(() => this.changeBackgroundImage(), 12500);
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
          <div>
            <div className="div2equal">
              <div className="left">
                <h1>{this.props.item.title}</h1>
                <h3>{this.props.item.subtitle}</h3>
                <p>{this.props.item.p}</p>
                <button
                  onClick={() => {
                    if (this.props.item.cat === "data")
                      window.location.href = `/${this.props.item.cat}`;
                    else
                      window.location.href = `/category/${this.props.item.cat}`;
                  }}
                >
                  <span>{this.props.item.label}</span>
                </button>
              </div>
              <div className="right">
                <Cards data={this.props.item.imgs} />
              </div>
            </div>
            <div className="options">
              <Item
                cat="Advocacy"
                current={this.props.item.subtitle}
                txt="Advocacy and Innovation"
              />
              <Item
                cat="Community"
                current={this.props.item.subtitle}
                txt="Community Engagement"
              />
              <Item
                cat="Animal"
                current={this.props.item.subtitle}
                txt="Animal Health"
              />
            </div>
          </div>
        </div>
      </div>
    );
  }
}
