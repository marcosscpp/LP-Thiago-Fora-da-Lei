import { library, dom } from "@fortawesome/fontawesome-svg-core";
import {
  faChevronLeft,
  faChevronRight,
  faTimes,
  faCheck,
  faArrowUp,
  faArrowRight,
  faPlay,
} from "@fortawesome/free-solid-svg-icons";
import {
  faFacebookF,
  faInstagram,
  faYoutube,
  faLinkedinIn,
} from "@fortawesome/free-brands-svg-icons";

import enableSwiper from "./modules/swiper-init";
import SmoothScroll from "./modules/smooth-scroll";
import Form from "./modules/form";

library.add(
  faChevronLeft,
  faChevronRight,
  faArrowUp,
  faArrowRight,
  faTimes,
  faCheck,
  faPlay,
  faFacebookF,
  faInstagram,
  faYoutube,
  faLinkedinIn
);
dom.watch();

fetch("../php/pageview.php")

enableSwiper();

const smoothScroll = new SmoothScroll("[href^='#']").init();

const form = new Form("form");
