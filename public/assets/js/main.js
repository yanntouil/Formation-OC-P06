







import IndexController from './controller/index.js';
import PhotographerController from './controller/photographer.js';


if (window.location.pathname.split("/").pop() == 'index.html') IndexController.mount();
else if (window.location.pathname.split("/").pop() == 'photographer.html') PhotographerController.mount();