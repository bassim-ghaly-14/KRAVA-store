document.addEventListener('DOMContentLoaded', () => {
  const cartItemsContainer = document.getElementById('cartItems');
  const cartTotalEl = document.getElementById('cartTotal');
  const clearCartBtn = document.getElementById('clearCart');
  const checkoutBtn = document.getElementById('checkout');

  const modalBg = document.getElementById('checkoutModal');
  const modalContent = document.getElementById('modalContent');
  const closeModalBtn = document.getElementById('closeModal');
  const confirmPurchaseBtn = document.getElementById('confirmPurchase');

  let cart = JSON.parse(localStorage.getItem('kravaCart')) || [];

  function saveCart(){
    localStorage.setItem('kravaCart', JSON.stringify(cart));
    renderCart();
  }

  function renderCart(){
    cartItemsContainer.innerHTML = '';
    if(cart.length === 0){
      cartItemsContainer.innerHTML = '<p>Your cart is empty!</p>';
      cartTotalEl.textContent = '0';
      return;
    }

    let total = 0;
    cart.forEach((item, idx) => {
      total += item.price * item.quantity;

      const div = document.createElement('div');
      div.className = 'cart-item';
      div.innerHTML = `
        <img src="${item.img}" alt="${item.name}">
        <div class="cart-item-details">
          <div class="cart-item-title">${item.name}</div>
          <div class="cart-item-price">${item.price} ج.م</div>
          <div class="cart-item-qty">
            <button class="decrease" data-idx="${idx}">-</button>
            <span>${item.quantity}</span>
            <button class="increase" data-idx="${idx}">+</button>
          </div>
        </div>
        <button class="remove" data-idx="${idx}">🗑️</button>
      `;
      cartItemsContainer.appendChild(div);
    });
    cartTotalEl.textContent = total;

    cartItemsContainer.querySelectorAll('.remove').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const idx = e.target.dataset.idx;
        if(confirm(`Remove "${cart[idx].name}" from cart?`)){
          cart.splice(idx,1);
          saveCart();
        }
      });
    });

    cartItemsContainer.querySelectorAll('.increase').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const idx = e.target.dataset.idx;
        cart[idx].quantity += 1;
        saveCart();
      });
    });

    cartItemsContainer.querySelectorAll('.decrease').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const idx = e.target.dataset.idx;
        if(cart[idx].quantity > 1){
          cart[idx].quantity -= 1;
          saveCart();
        }
      });
    });
  }

  clearCartBtn.addEventListener('click', () => {
    if(cart.length > 0 && confirm('Are you sure you want to empty your cart?')){
      cart = [];
      saveCart();
    }
  });

  checkoutBtn.addEventListener('click', () => {
    if(cart.length === 0){
      alert('Your cart is empty!');
      return;
    }
    let summary = cart.map(i => `${i.name} × ${i.quantity} = ${i.price*i.quantity} ج.م`).join('<br>');
    summary += `<br><strong>Total: ${cart.reduce((a,b)=>a+b.price*b.quantity,0)} ج.م</strong>`;
    modalContent.innerHTML = summary;
    modalBg.style.display = 'flex';
  });

  closeModalBtn.addEventListener('click', () => modalBg.style.display = 'none');

  confirmPurchaseBtn.addEventListener('click', () => {
    alert('Thank you for your purchase!');
    cart = [];
    saveCart();
    modalBg.style.display = 'none';
  });

  renderCart();
});
// chef-belly