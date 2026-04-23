// Kids Play — Негізгі JavaScript файлы

// Аттракционды жою функциясы
async function deleteAttraction(id) {
  const confirmed = confirm('Аттракционды шынымен жоясыз ба?');
  if (!confirmed) return;

  try {
    const response = await fetch(`/attraction/${id}`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' }
    });

    const data = await response.json();
    if (data.success) {
      alert('Аттракцион сәтті жойылды');
      location.reload();
    } else {
      alert('Қате: ' + data.message);
    }
  } catch (err) {
    alert('Желі қатесі орын алды');
    console.error(err);
  }
}

// Фильтр функциясы (feature/filter branch-ынан)
function filterAttractions() {
  const category = document.getElementById('filterCategory')?.value || '';
  const maxPrice = document.getElementById('filterPrice')?.value || '';

  const cards = document.querySelectorAll('.attraction-card');
  cards.forEach(card => {
    const cardCategory = card.dataset.category || '';
    const cardPrice = parseFloat(card.dataset.price) || 0;

    let show = true;
    if (category && cardCategory !== category) show = false;
    if (maxPrice && cardPrice > parseFloat(maxPrice)) show = false;

    card.style.display = show ? 'block' : 'none';
  });
}

// Фильтр элементтері болса, тыңдаушы қос
const filterCategory = document.getElementById('filterCategory');
const filterPrice = document.getElementById('filterPrice');

if (filterCategory) filterCategory.addEventListener('change', filterAttractions);
if (filterPrice) filterPrice.addEventListener('input', filterAttractions);

// Брондау формасын жіберу (feature/booking branch-ынан)
const bookingForm = document.getElementById('bookingForm');
if (bookingForm) {
  bookingForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const formData = new FormData(bookingForm);
    const data = Object.fromEntries(formData);

    // Валидация
    if (!data.name || !data.phone || !data.date) {
      alert('Барлық өрістерді толтырыңыз');
      return;
    }

    // Сервер болмаса, alert қайтару
    alert(`Брондау сәтті!
Аты: ${data.name}
Телефон: ${data.phone}
Күні: ${data.date}`);
    bookingForm.reset();
  });
}

console.log('Kids Play сайты іске қосылды!');
