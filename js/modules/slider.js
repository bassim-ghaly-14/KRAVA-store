/* =========================
   KRAVA SLIDER
========================= */

export function initSlider() {

  const slider = document.querySelector(".slider");
  const slides = document.querySelectorAll(".slide");

  const prev = document.querySelector(".prev");
  const next = document.querySelector(".next");

  if (!slider || !slides.length) return;

  let index = 0;

  function update() {
    const width = slides[0].offsetWidth + 20;
    slider.style.transform = `translateX(-${index * width}px)`;
  }

  function nextSlide() {
    index = (index + 1) % slides.length;
    update();
  }

  function prevSlide() {
    index = (index - 1 + slides.length) % slides.length;
    update();
  }

  next?.addEventListener("click", nextSlide);
  prev?.addEventListener("click", prevSlide);

  setInterval(nextSlide, 3500);

  window.addEventListener("resize", update);
}