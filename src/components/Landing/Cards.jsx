import React from "react";
// Import Swiper React components
import { Swiper, SwiperSlide } from "swiper/react/swiper-react.js";
// Styles must use direct files imports
import "swiper/swiper.scss"; // core Swiper
import "swiper/modules/effect-cards/effect-cards.scss"; // Navigation module
import "swiper/modules/pagination/pagination.scss"; // Pagination module
import "./Cards.scss";
// import Swiper core and required modules
import SwiperCore, { Autoplay, EffectCards } from "swiper";
// install Swiper modules
SwiperCore.use([Autoplay, EffectCards]);

const Item = (props) => {
  return (
    <div className="items">
      <img src={props.item.image} alt="" />
      <h4>{props.item.txt}</h4>
    </div>
  );
};

export default function Cards(props) {
  return (
    <>
      <Swiper
        effect={"cards"}
        autoplay={{
          delay: 2500,
          disableOnInteraction: false,
        }}
        grabCursor={true}
        className="cardSwiper"
      >
        {props.data?.map((item, index) => {
          return (
            <SwiperSlide key={index} className="card">
              <Item item={item} />
            </SwiperSlide>
          );
        })}
      </Swiper>
    </>
  );
}
