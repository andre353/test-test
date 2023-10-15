import {addPreloader, removePreloader} from './utils.js';
import API_URI from './consts';

const renderPrice = (wrapper, data) => {
  data.forEach((item) => {
    const priceItem = document.createElement('li');
    priceItem.classList.add('price__item');

    priceItem.innerHTML = `
      <span class="price__item-title">${item.name}</span>
      <span class="price__item-count">${item.price} руб</span>
    `;

    wrapper.append(priceItem);    
  });
};

const renderService = (wrapper, data) => {
  const labels = data.map((item) => {
    const labelItem = document.createElement('label');
    labelItem.classList.add('radio');

    labelItem.innerHTML = `
      <input class="radio__input" type="radio" name="service" value="${item.id}">
      <span class="radio__label">${item.name}</span>
    `;
    return labelItem;
  });
  wrapper.append(...labels);
  // console.log(wrapper);    
};

export const initService = async () => {
  const priceList = document.querySelector('.price__list');
  const reserveFieldsetService = document.querySelector('.reserve__fieldset_service');
  priceList.textContent = '';
  addPreloader(priceList);
  reserveFieldsetService.innerHTML = '<legend class="reserve__legend">Услуга</legend>';
  addPreloader(reserveFieldsetService);

  const response = await fetch(`${API_URI}/api`);
  const data = await response.json();
  renderPrice(priceList, data);
  renderService(reserveFieldsetService, data)

  removePreloader(priceList);  
  removePreloader(reserveFieldsetService);  
}