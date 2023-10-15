reserveForm.addEventListener('submit', async (e) => {
  e.preventDefault();

  const formData = new FormData(reserveForm);
  const json = JSON.stringify(Object.fromEntries(formData));

  const response = await fetch(`${API_URI}api/order`, {
    method: 'post',
    body: json,
  });

  const data = await response.json();
  console.log('data: ', data);
});