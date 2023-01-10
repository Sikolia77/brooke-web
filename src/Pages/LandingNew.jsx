import "../Styles/landing.scss";
import React, { useState } from "react";
import Header from "../components/Utils/header";
import "leaflet/dist/leaflet.css";
import { Swiper, SwiperSlide } from "swiper/react/swiper-react.js";
import HeroSlide from "../components/Landing/HeroSlide";
// Styles must use direct files imports
import "swiper/swiper.scss"; // core Swiper
import "swiper/modules/effect-cards/effect-cards.scss"; // Navigation module
import "swiper/modules/pagination/pagination.scss"; // Pagination module
// import Swiper core and required modules
import SwiperCore, { Autoplay, Pagination, Navigation } from "swiper";
import { myData } from "../assets/data/landing";

SwiperCore.use([Autoplay, Pagination, Navigation]);

export default function LandingPage(props) {
  const [toggleRegister, setToggleRegister] = useState(false);
  const [toggleHeaderTheme, changeHeaderTheme] = useState(false);

  return (
    <div className="landingnew">
      <Header
        isAuthenticated={props.isAuthenticated}
        setIsAuthenticated={props.setIsAuthenticated}
        currentUser={props.currentUser}
        setCurrentUser={props.setCurrentUser}
        toggleRegisterfromLanding={toggleRegister}
        changeHeaderTheme={toggleHeaderTheme}
        parent="landing"
      />
      <div className="lcontainer">
        <div className="wrap">
          <div className="top">
            <Swiper
              centeredSlides={true}
              autoplay={{
                delay: 12500,
                disableOnInteraction: false,
              }}
              pagination={{
                clickable: true,
              }}
              navigation={true}
              className="mySwiper"
            >
              {myData.map((item, index) => {
                return (
                  <SwiperSlide key={index} className="hero">
                    <HeroSlide item={item} />
                  </SwiperSlide>
                );
              })}
            </Swiper>
          </div>
        </div>
      </div>
    </div>
  );
}
