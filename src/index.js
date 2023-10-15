import { initSlider } from './modules/slider';
import { initService } from './modules/service';
import { initReserve } from './modules/reserve';
// import { initFavicons } from './modules/favicons';

const init = () => {
  // initFavicons();
  initSlider();
  initService();
  initReserve();
}

window.addEventListener('DOMContentLoaded', init);

// DOMContentLoaded - загрузка без изображений