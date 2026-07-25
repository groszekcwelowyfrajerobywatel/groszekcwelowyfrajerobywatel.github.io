const cardContainer = document.querySelector('.card-container');
let startX;
let scrollLeft;

cardContainer.addEventListener('mousedown', (e) => {
  startX = e.pageX - cardContainer.offsetLeft;
  scrollLeft = cardContainer.scrollLeft;
  cardContainer.style.cursor = 'grabbing';
});

cardContainer.addEventListener('mouseleave', () => {
  cardContainer.style.cursor = 'grab';
});

cardContainer.addEventListener('mouseup', () => {
  cardContainer.style.cursor = 'grab';
});

cardContainer.addEventListener('mousemove', (e) => {
  if (!startX) return;
  e.preventDefault();
  const x = e.pageX - cardContainer.offsetLeft;
  const walk = (x - startX) * 2; 
  cardContainer.scrollLeft = scrollLeft - walk;
});


cardContainer.addEventListener('touchstart', (e) => {
  startX = e.touches[0].pageX - cardContainer.offsetLeft;
  scrollLeft = cardContainer.scrollLeft;
});

cardContainer.addEventListener('touchmove', (e) => {
  if (!startX) return;
  e.preventDefault();
  const x = e.touches[0].pageX - cardContainer.offsetLeft;
  const walk = (x - startX) * 2; 
  cardContainer.scrollLeft = scrollLeft - walk;
});

// Wyświetl dane użytkownika z localStorage
var params = new URLSearchParams(window.location.search);
var data = {};

// Czytaj z URL jeśli istnieje
for (var key of params.keys()){
  data[key] = params.get(key);
}

// Jeśli URL pusty, czytaj z localStorage
if(Object.keys(data).length === 0) {
  var keys = Object.keys(localStorage);
  for(var i = 0; i < keys.length; i++) {
    if(keys[i].startsWith('user_')) {
      data[keys[i].replace('user_', '')] = localStorage.getItem(keys[i]);
    }
  }
}

// Jeśli ma zdjęcie, wyświetl je na karcie
if(data['image']) {
  var cards = document.querySelectorAll('.card');
  if(cards.length > 0) {
    cards[0].style.backgroundImage = `url(${data['image']})`;
  }
}