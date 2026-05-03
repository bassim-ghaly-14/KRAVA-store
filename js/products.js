/* =========================
   PRODUCTS DATA
========================= */
const products = [
  {
    name: "The Game",
    price: 600,
    oldPrice: 750,
    colors: [
      { name: "pink", hex: "#ff9acb", images: ["game1.JPG","game1back.JPG"] },
      { name: "white", hex: "#ffffff", images: ["game4.JPG","game4back.JPG"] },
      { name: "gray", hex: "#b3b3b3", images: ["game2.JPG","game2back.JPG"] },
      { name: "blue", hex: "#9fd6ff", images: ["game5.JPG","game5back.JPG"] },
      { name: "black", hex: "#000000", images: ["game3.JPG","game3back.JPG"] }
    ],
    sizes: ["M","L","XL","2XL"]
  },

  {
    name: "NO FEAR",
    price: 600,
    oldPrice: 750,
    colors: [
      { name: "blue", hex: "#9fd6ff", images: ["no4.JPG"] },
      { name: "pink", hex: "#ff9acb", images: ["no3.JPG"] },
      { name: "white", hex: "#ffffff", images: ["no1.JPG"] },
      { name: "black", hex: "#000000", images: ["no5.JPG"] },
      { name: "gray", hex: "#b3b3b3", images: ["no2.JPG"] }
    ],
    sizes: ["M","L","XL","2XL"]
  },

  {
    name: "World is Mine",
    price: 500,
    oldPrice: 750,
    colors: [
      { name: "white", hex: "#ffffff", images: ["map5.JPG","map5b.JPG"] },
      { name: "gray", hex: "#b3b3b3", images: ["map4.JPG","map4b.JPG"] },
      { name: "pink", hex: "#ff9acb", images: ["map2.JPG","map2b.JPG"] },
      { name: "blue", hex: "#9fd6ff", images: ["map3.JPG","map3b.JPG"] },
      { name: "black", hex: "#000000", images: ["map1.JPG","map1b.JPG"] }
    ],
    sizes: ["M","L","XL","2XL"]

  }
];

/* =========================
   RENDER PRODUCTS
========================= */
const grid = document.getElementById("productsGrid");

function renderProducts(){

  grid.innerHTML = products.map(p => {

    const first = p.colors[0];

    return `
      <article class="product-card" data-price="${p.price}" data-name="${p.name}">

        <figure class="product-media">

          <div class="product-images">
            ${first.images.map((img,i)=>`
              <img src="images/hoodie/${img}" class="${i===0?'active':''}">
            `).join("")}
          </div>

          <div class="image-dots">
            ${first.images.map((_,i)=>`
              <span class="dot ${i===0?'active':''}"></span>
            `).join("")}
          </div>

        </figure>

        <div class="product-body">

          <h3 class="product-title">${p.name}</h3>

          <p class="product-price">
            ${p.oldPrice ? `<span class="discount">${p.oldPrice}</span>` : ""}
            ${p.price} EGP
          </p>

          <div class="colors">
            <span class="label">Colors:</span>
            <div class="color-list">
              ${p.colors.map((c,i)=>`
                <span class="color ${i===0?'active':''}" data-index="${i}" style="--clr:${c.hex}"></span>
              `).join("")}
            </div>
          </div>

          <div class="avl-size">
            <span class="label">Size:</span>
            <div class="size-list">
              ${p.sizes.map(s=>`<span class="size">${s}</span>`).join("")}
            </div>
          </div>

          <div class="product-actions">
            <button class="btn btn-primary add-cart">Add to cart</button>
          </div>

        </div>

      </article>
    `;
  }).join("");
}

renderProducts();

/* =========================
   PRODUCT INTERACTIONS
========================= */
document.querySelectorAll(".product-card").forEach((card, index) => {

  const product = products[index];

  const media = card.querySelector(".product-media");
  const colors = card.querySelectorAll(".color");
  const imagesContainer = card.querySelector(".product-images");
  const dots = card.querySelectorAll(".dot");

  let currentColor = 0;
  let currentIndex = 0;

  function loadColor(i){

    const imgs = product.colors[i].images;

    imagesContainer.innerHTML = imgs.map((img,idx)=>`
      <img src="images/hoodie/${img}" class="${idx===0?'active':''}">
    `).join("");

    currentIndex = 0;
  }

  function show(i){

    const imgs = imagesContainer.querySelectorAll("img");

    imgs.forEach(img=>img.classList.remove("active"));
    dots.forEach(d=>d.classList.remove("active"));

    currentIndex = (i + imgs.length) % imgs.length;

    imgs[currentIndex].classList.add("active");
    if(dots[currentIndex]) dots[currentIndex].classList.add("active");
  }

  /* arrows (scoped - no conflicts) */
  const prev = document.createElement("button");
  const next = document.createElement("button");

  prev.className = "img-nav prev";
  next.className = "img-nav next";

  prev.innerHTML = "‹";
  next.innerHTML = "›";

  media.appendChild(prev);
  media.appendChild(next);

  next.addEventListener("click", e=>{
    e.stopPropagation();
    show(currentIndex + 1);
  });

  prev.addEventListener("click", e=>{
    e.stopPropagation();
    show(currentIndex - 1);
  });

  /* swipe */
  let startX = 0;

  media.addEventListener("touchstart", e=>{
    startX = e.touches[0].clientX;
  });

  media.addEventListener("touchend", e=>{
    const endX = e.changedTouches[0].clientX;

    if(startX - endX > 50) show(currentIndex + 1);
    if(endX - startX > 50) show(currentIndex - 1);
  });

  /* color switch */
  colors.forEach((c,i)=>{
    c.addEventListener("click", ()=>{

      colors.forEach(x=>x.classList.remove("active"));
      c.classList.add("active");

      currentColor = i;
      loadColor(i);

    });
  });

  /* dots */
  dots.forEach((d,i)=>{
    d.addEventListener("click", ()=>show(i));
  });

  /* init */
  loadColor(0);
  show(0);

});

/* =========================
   SORTING (SAFE)
========================= */
document.getElementById("sortSelect").addEventListener("change", e=>{

  const mode = e.target.value;
  const cards = Array.from(document.querySelectorAll(".product-card"));

  if(mode === "price-asc"){
    cards.sort((a,b)=>a.dataset.price - b.dataset.price);
  } else if(mode === "price-desc"){
    cards.sort((a,b)=>b.dataset.price - a.dataset.price);
  }

  cards.forEach(c=>grid.appendChild(c));

});
