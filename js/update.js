document.addEventListener('DOMContentLoaded', () => {

const cartCountEl = document.querySelector('.cart-count');
const addCartBtns = document.querySelectorAll('.add-cart');
const sortSelect = document.getElementById('sortSelect');
const productsGrid = document.getElementById('productsGrid');
const yearEl = document.getElementById('year');

yearEl.textContent = new Date().getFullYear();

/* Cart */
let cartCount = 0;
cartCountEl.textContent = cartCount;

addCartBtns.forEach(btn => {
  btn.addEventListener('click', () => {

    // UI
    cartCount++;
    cartCountEl.textContent = cartCount;

    btn.textContent = '✓ Added';
    btn.disabled = true;

    setTimeout(() => {
      btn.textContent = 'Add more';
      btn.disabled = false;
    }, 1000);

    // Storage
    const card = btn.closest('.product-card');
    const item = {
      name: card.querySelector('.product-title').textContent,
      price: parseFloat(card.dataset.price),
      img: card.querySelector('.product-media img').src,
      quantity: 1
    };

    let cart = JSON.parse(localStorage.getItem('kravaCart')) || [];
    const exist = cart.find(i => i.name === item.name);

    if(exist) exist.quantity++;
    else cart.push(item);

    localStorage.setItem('kravaCart', JSON.stringify(cart));
  });
});

/* Sorting */
function sortProducts(mode){
  const items = Array.from(productsGrid.querySelectorAll('.product-card'));

  if(mode === 'price-asc'){
    items.sort((a,b)=>a.dataset.price - b.dataset.price);
  } else if(mode === 'price-desc'){
    items.sort((a,b)=>b.dataset.price - a.dataset.price);
  }

  items.forEach(i => productsGrid.appendChild(i));
}

sortSelect.addEventListener('change', e => {
  sortProducts(e.target.value);
});

/* Product image dots */
document.querySelectorAll('.product-card').forEach(card=>{
  const images = card.querySelectorAll('img');
  const dots = card.querySelectorAll('.dot');

  dots.forEach((dot,i)=>{
    dot.addEventListener('click',()=>{
      images.forEach(img=>img.classList.remove('active'));
      dots.forEach(d=>d.classList.remove('active'));
      images[i].classList.add('active');
      dot.classList.add('active');
    });
  });
});

});

/* Slider */
const slider = document.querySelector('.slider');
const slides = document.querySelectorAll('.slide');
const prev = document.querySelector('.prev');
const next = document.querySelector('.next');

let index = 0;
let slideWidth = 0;

window.addEventListener('load', () => {
  slideWidth = slides[0].offsetWidth + 20;
});

function showSlide(i){
  if(i < 0) index = slides.length - 1;
  else if(i >= slides.length) index = 0;
  else index = i;

  slider.style.transform = `translateX(-${index * slideWidth}px)`;
}

prev.addEventListener('click', ()=>showSlide(index - 1));
next.addEventListener('click', ()=>showSlide(index + 1));

setInterval(()=>showSlide(index + 1),3000);

// chef-belly