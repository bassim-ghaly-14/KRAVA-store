document.addEventListener('DOMContentLoaded', () => {
  // عناصر مهمة
  const themeToggle = document.getElementById('themeToggle');
  const htmlRoot = document.documentElement; // سند لكامل المستند
  const body = document.body;
  const cartCountEl = document.querySelector('.cart-count');
  const addCartBtns = document.querySelectorAll('.add-cart');
  const sortSelect = document.getElementById('sortSelect');
  const productsGrid = document.getElementById('productsGrid');
  const yearEl = document.getElementById('year');

  // ضبط السنة تلقائيًا في الفوتر
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ========= Theme (light/dark) ========= */
  // قراءة إعداد المستخدم من localStorage
  const savedTheme = localStorage.getItem('krava-theme'); // 'dark' أو 'light'
  if (savedTheme === 'dark') {
    document.documentElement.setAttribute('data-theme', 'dark');
    themeToggle.textContent = '☀️';
    themeToggle.setAttribute('aria-pressed', 'true');
  } else {
    // افتراضياً light
    document.documentElement.removeAttribute('data-theme');
    themeToggle.textContent = '🌙';
    themeToggle.setAttribute('aria-pressed', 'false');
  }

  // عند الضغط على زر التبديل
  themeToggle.addEventListener('click', () => {
    const current = document.documentElement.getAttribute('data-theme');
    if (current === 'dark') {
      document.documentElement.removeAttribute('data-theme');
      localStorage.setItem('krava-theme', 'light');
      themeToggle.textContent = '🌙';
      themeToggle.setAttribute('aria-pressed', 'false');
    } else {
      document.documentElement.setAttribute('data-theme', 'dark');
      localStorage.setItem('krava-theme', 'dark');
      themeToggle.textContent = '☀️';
      themeToggle.setAttribute('aria-pressed', 'true');
    }
  });

  /* ========= سلة التسوق (مؤقتة) ========= */
  // عداد سلة بسيط (يمكن تغييره لربط API لاحقاً)
  let cartCount = 0;
  cartCountEl.textContent = cartCount;

  addCartBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      // نحدث العداد
      cartCount += 1;
      cartCountEl.textContent = cartCount;

      // feedback صغير
      btn.textContent = '✓ Added';
      btn.disabled = true;
      setTimeout(() => {
        btn.textContent = 'Add more';
        btn.disabled = false;
      }, 1000);
    });
  });

  /* ========= فرز المنتجات (client-side) ========= */
  // وظيفة بسيطة تعيد ترتيب البطاقات داخل الشبكة
  function sortProducts(mode){
    const items = Array.from(productsGrid.querySelectorAll('.product-card'));

    if(mode === 'price-asc'){
      items.sort((a,b) => parseFloat(a.dataset.price) - parseFloat(b.dataset.price));
    }else if(mode === 'price-desc'){
      items.sort((a,b) => parseFloat(b.dataset.price) - parseFloat(a.dataset.price));
    }else{
      // featured — ترتيب افتراضي: حسب الاسم أو كما هو في DOM
      items.sort((a,b) => {
        const na = a.dataset.name || a.querySelector('.product-title').textContent;
        const nb = b.dataset.name || b.querySelector('.product-title').textContent;
        return na.localeCompare(nb, 'ar') ;
      });
    }

    // تطبيق الترتيب على DOM
    items.forEach(item => productsGrid.appendChild(item));
  }

  // حدث تغيير select
  sortSelect.addEventListener('change', (e) => {
    sortProducts(e.target.value);
  });

  // نفذ الفرز الافتراضي
  sortProducts(sortSelect.value);

  /* ========= معاينة المنتج (نسخة مصغرة) ========= */
  // سيتم فتح نافذة منبثقة بسيطة أو يمكن استبدالها بـ modal حقيقي لاحقًا.
  document.querySelectorAll('.view-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const card = e.target.closest('.product-card');
      const title = card.querySelector('.product-title').textContent;
      const price = card.querySelector('.product-price').textContent;
      const imgSrc = card.querySelector('.product-media img').src;

      // معاينة بسيطة بواسطة window.open (يمكن تصميم modal بدلها)
      const w = window.open('', '_blank', 'noopener,noreferrer,width=700,height=700');
      w.document.write(`
        <html lang="ar" dir="rtl">
          <head><meta charset="utf-8"><title>${title}</title></head>
          <body style="font-family:Arial, Helvetica; background:${getComputedStyle(document.documentElement).getPropertyValue('--bg')}; color:${getComputedStyle(document.documentElement).getPropertyValue('--text')}; padding:20px;">
            <h2>${title}</h2>
            <img src="${imgSrc}" alt="${title}" style="max-width:100%; border-radius:12px; box-shadow:0 8px 28px rgba(0,0,0,0.12)"/>
            <p style="font-weight:800; color:${getComputedStyle(document.documentElement).getPropertyValue('--brand-red')};">${price}</p>
            <p><small>Quick Preview — Close Window & return.</small></p>
          </body>
        </html>
      `);
      w.document.close();
    });
  });

});
// Hoodies Slider Section
const slider = document.querySelector('.slider');
  const slides = document.querySelectorAll('.slide');
  const prev = document.querySelector('.prev');
  const next = document.querySelector('.next');
  let index = 0;
  let slideWidth = slides[0].offsetWidth + 20; // including gap
  let autoPlayInterval;
  let isAutoplay = true;

  // Navigation functions
  function showSlide(i){
    if(i < 0) index = slides.length - 1;
    else if(i >= slides.length) index = 0;
    else index = i;
    slider.style.transform = `translateX(-${index * slideWidth}px)`;
  }

  prev.addEventListener('click', () => {
    showSlide(index - 1);
  });

  next.addEventListener('click', () => {
    showSlide(index + 1);
  });

  // // Autoplay
  function startAutoplay(){
    if(isAutoplay) {
      autoPlayInterval = setInterval(() => {
        showSlide(index + 1);
      }, 3000);
    }
  }

  function stopAutoplay(){
    clearInterval(autoPlayInterval);
  }

  slider.addEventListener('mouseenter', stopAutoplay);
  slider.addEventListener('mouseleave', startAutoplay);

  // Resize event);
  window.addEventListener('resize', () => {
    slideWidth = slides[0].offsetWidth + 20;
  });

  // Initialize
  showSlide(index);
  startAutoplay();
  // card slider
  document.querySelectorAll('.product-card').forEach(card=>{
  const images = card.querySelectorAll('.product-images img');
  const dots = card.querySelectorAll('.image-dots .dot');

  dots.forEach((dot,i)=>{
    dot.addEventListener('click',()=>{
      images.forEach(img=>img.classList.remove('active'));
      dots.forEach(d=>d.classList.remove('active'));

      images[i].classList.add('active');
      dot.classList.add('active');
    });
  });
});

addCartBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    const card = btn.closest('.product-card');
    const item = {
      name: card.querySelector('.product-title').textContent,
      price: parseFloat(card.dataset.price),
      img: card.querySelector('.product-media img').src,
      quantity: 1
    };

    let cart = JSON.parse(localStorage.getItem('kravaCart')) || [];
    const exist = cart.find(i => i.name === item.name);
    if(exist){ exist.quantity += 1; } else { cart.push(item); }
    localStorage.setItem('kravaCart', JSON.stringify(cart));
  });
});

  // chef-belly