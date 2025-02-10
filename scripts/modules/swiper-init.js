import Swiper from "swiper";
import { Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";

export default function enableSwiper() {
  const swiperClients = new Swiper('[data-swiper="cases"]', {
    modules: [Navigation],
    loop: true,
    navigation: {
      nextEl: '.next',
      prevEl: '.prev',
    },
    spaceBetween: 30,
    breakpoints: {
      1520: {
        slidesPerView: 4,
      },

      840: {
        slidesPerView: 3,
      },

      640: {
        slidesPerView: 2,
      },
      540: {
        slidesPerView: 1,
      },
    },
  });
}
