import API_URI from './consts';
import { addPreloader, removePreloader } from './utils';

const addDisabled  = (arr) => {
  arr.forEach(elem => {
    elem.disabled = true;
  })
};

const removeDisabled  = (arr) => {
  arr.forEach(elem => {
    elem.disabled = false;
  })
};

const renderSpec = (wrapper, data) => {
  const labels = data.map((item) => {
    const label = document.createElement('label');
    label.classList.add('radio');

    label.innerHTML = `
      <input class="radio__input" type="radio" name="spec" value="${item.id}">
      <span class="radio__label radio__label_spec"><img src=${API_URI}${item.img} alt=${item.name}/><span>${item.name}</span></span>
    `;
    return label;
  });

  wrapper.append(...labels);
};

const renderMonth = (wrapper, data) => {
  const labels = data.map((item) => {
    const label = document.createElement('label');
    label.classList.add('radio');

    label.innerHTML = `
      <input class="radio__input" type="radio" name="month" value="${item}">
      <span class="radio__label">${new Date(item).toLocaleDateString('ru-RU', {month: 'long'})}</span>
    `;
    return label;
  });

  wrapper.append(...labels);
};

const renderDay = (wrapper, data, month) => {
  const labels = data.map((day) => {
    const label = document.createElement('label');
    label.classList.add('radio');

    label.innerHTML = `
      <input class="radio__input" type="radio" name="day" value="${day}">
      <span class="radio__label">${new Date(`${month}/${day}`).toLocaleDateString('ru-RU', {month: 'long', day: 'numeric'})}</span>
    `;
    return label;
  });

  wrapper.append(...labels);
};

const renderTime = (wrapper, data) => {
  const labels = data.map((time) => {
    const label = document.createElement('label');
    label.classList.add('radio');

    label.innerHTML = `
      <input class="radio__input" type="radio" name="time" value="${time}">
      <span class="radio__label">${time}</span>
    `;
    return label;
  });

  wrapper.append(...labels);
};

export const initReserve = () => {
  const reserveForm = document.querySelector('.reserve__form');
  const {fieldservice, fieldspec, fielddata, fieldmonth, fieldday, fieldtime, btn} = reserveForm;

  addDisabled([fieldspec, fielddata, fieldmonth, fieldday, fieldtime, btn]);
  
  reserveForm.addEventListener('change', async (event) => {
    const target = event.target;
    
    if (target.name === 'service') {
      addDisabled([fieldspec, fielddata, fieldmonth, fieldday, fieldtime, btn]);
      fieldspec.innerHTML = '<legend class="reserve__legend">Специалист</legend>';
      addPreloader(fieldspec);
      const response = await fetch(`${API_URI}/api?service=${target.value}`);
      const data = await response.json();
      renderSpec(fieldspec, data);
      removePreloader(fieldspec);
      removeDisabled([fieldspec]);
    } else if (target.name === 'spec') {
      addDisabled([fielddata, fieldmonth, fieldday, fieldtime, btn]);
      addPreloader(fieldmonth);
      const response = await fetch(`${API_URI}/api?spec=${target.value}`);
      const data = await response.json();
      fieldmonth.textContent = '';
      renderMonth(fieldmonth, data);
      removePreloader(fieldmonth);
      removeDisabled([fielddata, fieldmonth]);
    } else if (target.name === 'month') {
      addDisabled([fieldday, fieldtime, btn]);
      addPreloader(fieldday);
      const response = await fetch(
        `${API_URI}/api?spec=${reserveForm.spec.value}&month=${target.value}`);
      const data = await response.json();
      fieldday.textContent = '';
      renderDay(fieldday, data, target.value);
      removePreloader(fieldday);
      removeDisabled([fieldday]);
    } else if (target.name === 'day') {
      addDisabled([fieldtime, btn]);
      addPreloader(fieldtime);
      const response = await fetch(
        `${API_URI}/api?spec=${reserveForm.spec.value}&month=${reserveForm.month.value}&day=${target.value}`);
      const data = await response.json();
      fieldtime.textContent = '';
      renderTime(fieldtime, data);
      removePreloader(fieldtime);
      removeDisabled([fieldtime]);
    } else if (target.name === 'time') {
      removeDisabled([btn]);
    }
  });

  reserveForm.addEventListener('submit', async (e) => {
    e.preventDefault();
  
    const formData = new FormData(reserveForm);
    
    const json = JSON.stringify(Object.fromEntries(formData));
  
    const response = await fetch(`${API_URI}api/order`, {
      method: 'post',
      body: json,
    });
  
    const data = await response.json();
    
    addDisabled([
      fieldservice, 
      fieldspec, 
      fielddata, 
      fieldmonth, 
      fieldday, 
      fieldtime, 
      btn
    ]);

    const p = document.createElement('p');
    p.classList.add('form-message');
    p.textContent = `
      Спасибо за бронь №${data.id}! Ждем вас ${new Date(`${data.month}/${data.day}`).toLocaleDateString('ru-RU', {month: 'long', day: 'numeric'})}, время ${data.time}.
    `;

    reserveForm.append(p);
  });
}