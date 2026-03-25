import React, { lazy, useRef } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
const contact = lazy(() => import("./components/Contact"));

const App = () => {
  const swiperRef = useRef<any>(null); // ref барои идора кардани свайпер

  return (
    <div style={{ width: "600px", margin: "0 auto" }}>
      <Swiper
        onSwiper={(swiper) => (swiperRef.current = swiper)} // гирифтани объект свайпер
        slidesPerView={3} // чанд слайд намоиш дода шавад
        spaceBetween={20} // фосилаи байни слайдҳо
      >
        <SwiperSlide style={{ background: "#ff9999", height: "150px" }}>
          Slide 1
        </SwiperSlide>
        <SwiperSlide style={{ background: "#99ff99", height: "150px" }}>
          Slide 2
        </SwiperSlide>
        <SwiperSlide style={{ background: "#9999ff", height: "150px" }}>
          Slide 3
        </SwiperSlide>
        <SwiperSlide style={{ background: "#ffcc99", height: "150px" }}>
          Slide 4
        </SwiperSlide>
        <SwiperSlide style={{ background: "#cc99ff", height: "150px" }}>
          Slide 5
        </SwiperSlide>
      </Swiper>

      {/* Кнопкаҳои ҳаракат */}
      <div style={{ marginTop: "20px", textAlign: "center" }}>
        <button
          onClick={() => swiperRef.current?.slidePrev()} // ба слайди қаблӣ ҳаракат
          style={{ marginRight: "10px" }}
        >
          ← Prev
        </button>
        <button onClick={() => swiperRef.current?.slideNext()}>Next →</button>{" "}
        {/* ба слайди навбатӣ ҳаракат */}
      </div>
    </div>
  );
};

export default App;
