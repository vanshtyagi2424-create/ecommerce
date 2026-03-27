/* ============================================
   SIKARWAR GROUP - Main JavaScript
   ============================================ */

// ---- MENU DRAWER ----
const menuToggle = document.getElementById('menuToggle');
const menuDrawer = document.getElementById('menuDrawer');
const drawerClose = document.getElementById('drawerClose');
const drawerOverlay = document.getElementById('drawerOverlay');

if (menuToggle) {
  menuToggle.addEventListener('click', () => {
    menuDrawer.classList.add('open');
    drawerOverlay.classList.add('show');
    document.body.style.overflow = 'hidden';
  });
}
if (drawerClose) {
  drawerClose.addEventListener('click', closeDrawer);
}
if (drawerOverlay) {
  drawerOverlay.addEventListener('click', closeDrawer);
}
function closeDrawer() {
  if (menuDrawer) menuDrawer.classList.remove('open');
  if (drawerOverlay) drawerOverlay.classList.remove('show');
  document.body.style.overflow = '';
}

// ---- SLIDESHOW ----
const slides = document.querySelectorAll('.slide');
const dotBtns = document.querySelectorAll('.dot-btn');
let currentSlide = 0;
let slideInterval;

function goToSlide(n) {
  slides.forEach(s => s.classList.remove('active'));
  dotBtns.forEach(d => d.classList.remove('active'));
  currentSlide = (n + slides.length) % slides.length;
  if (slides[currentSlide]) slides[currentSlide].classList.add('active');
  if (dotBtns[currentSlide]) dotBtns[currentSlide].classList.add('active');
}

if (slides.length > 0) {
  slideInterval = setInterval(() => goToSlide(currentSlide + 1), 4000);

  dotBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      clearInterval(slideInterval);
      goToSlide(parseInt(btn.dataset.index));
      slideInterval = setInterval(() => goToSlide(currentSlide + 1), 4000);
    });
  });

  const prevBtn = document.getElementById('prevSlide');
  const nextBtn = document.getElementById('nextSlide');
  if (prevBtn) prevBtn.addEventListener('click', () => { clearInterval(slideInterval); goToSlide(currentSlide - 1); slideInterval = setInterval(() => goToSlide(currentSlide + 1), 4000); });
  if (nextBtn) nextBtn.addEventListener('click', () => { clearInterval(slideInterval); goToSlide(currentSlide + 1); slideInterval = setInterval(() => goToSlide(currentSlide + 1), 4000); });
}

// ---- CATEGORY PILLS ----
document.querySelectorAll('.pill').forEach(pill => {
  pill.addEventListener('click', function(e) {
    e.preventDefault();
    document.querySelectorAll('.pill').forEach(p => p.classList.remove('active'));
    this.classList.add('active');
  });
});

// ---- PRODUCT PAGE: SELECT COLOR ----
function selectColor(el, name, color) {
  document.querySelectorAll('.swatch').forEach(s => s.classList.remove('active'));
  el.classList.add('active');
  document.getElementById('colorLabel').textContent = name;
  const mockEl = document.getElementById('mainImgMock');
  if (mockEl) {
    mockEl.style.background = `linear-gradient(160deg, ${color} 0%, ${darken(color)} 100%)`;
  }
  // Update thumbs
  const thumbs = document.querySelectorAll('.thumb');
  thumbs.forEach(t => t.classList.remove('active'));
}

function darken(hex) {
  // Simple darken
  return hex.replace(/[0-9a-f]/gi, c => Math.max(0, parseInt(c, 16) - 3).toString(16));
}

// ---- PRODUCT PAGE: SELECT SIZE ----
function selectSize(el, size) {
  document.querySelectorAll('.size-btn').forEach(s => s.classList.remove('active'));
  el.classList.add('active');
  document.getElementById('sizeLabel').textContent = size;
}

// ---- PRODUCT PAGE: WISHLIST ----
const wishlistBtn = document.getElementById('wishlistBtn');
if (wishlistBtn) {
  wishlistBtn.addEventListener('click', () => {
    if (wishlistBtn.textContent === '♡') {
      wishlistBtn.textContent = '♥';
      wishlistBtn.style.color = '#e53e3e';
    } else {
      wishlistBtn.textContent = '♡';
      wishlistBtn.style.color = '';
    }
  });
}

// Wishlist buttons on cards
document.querySelectorAll('.wishlist-btn').forEach(btn => {
  btn.addEventListener('click', function(e) {
    e.preventDefault();
    if (this.textContent === '♡') {
      this.textContent = '♥';
      this.style.color = '#e53e3e';
    } else {
      this.textContent = '♡';
      this.style.color = '';
    }
  });
});

// ---- PRODUCT PAGE: ACCORDION ----
function toggleAcc(el) {
  const body = el.nextElementSibling;
  const isOpen = body.classList.contains('open');
  // Close all
  document.querySelectorAll('.acc-body').forEach(b => b.classList.remove('open'));
  document.querySelectorAll('.acc-header').forEach(h => h.classList.remove('open'));
  if (!isOpen) {
    body.classList.add('open');
    el.classList.add('open');
  }
}

// ---- PRODUCT PAGE: ADD TO CART ----
function addToCart() {
  const sizeLabel = document.getElementById('sizeLabel');
  if (sizeLabel && sizeLabel.textContent === 'Select Size') {
    alert('Please select a size first!');
    return;
  }
  // Update cart count
  const cartCounts = document.querySelectorAll('.cart-count');
  cartCounts.forEach(c => {
    c.textContent = parseInt(c.textContent) + 1;
  });
  showToast('Item added to cart! 🛒');
}

// ---- THUMB GALLERY ----
document.querySelectorAll('.thumb').forEach((thumb, i) => {
  thumb.addEventListener('click', function() {
    document.querySelectorAll('.thumb').forEach(t => t.classList.remove('active'));
    this.classList.add('active');
    const color = this.dataset.color;
    const mockEl = document.getElementById('mainImgMock');
    if (mockEl && color) {
      mockEl.style.background = `linear-gradient(160deg, ${color} 0%, ${color}99 100%)`;
    }
  });
});

// ---- CART PAGE: QUANTITY ----
const cartData = {
  item1: { qty: 1, price: 849 },
  item2: { qty: 1, price: 999 }
};

function changeQty(itemId, delta) {
  const qtyEl = document.getElementById(`${itemId}-qty`);
  if (!qtyEl) return;
  cartData[itemId].qty = Math.max(1, cartData[itemId].qty + delta);
  qtyEl.textContent = cartData[itemId].qty;
  updateCartSummary();
}

function removeItem(itemId) {
  const el = document.getElementById(itemId);
  if (el) {
    el.style.opacity = '0';
    el.style.transform = 'translateX(-20px)';
    el.style.transition = 'all 0.3s';
    setTimeout(() => el.remove(), 300);
  }
  cartData[itemId].qty = 0;
  updateCartSummary();
}

function updateCartSummary() {
  let total = 0;
  let mrp = 0;
  Object.values(cartData).forEach(item => {
    total += item.price * item.qty;
    mrp += item.price * 2 * item.qty; // mrp is double
  });
  const discount = mrp - total;
  const couponAmt = window.appliedCoupon ? Math.round(total * 0.1) : 0;
  const finalTotal = total - couponAmt;

  if (document.getElementById('mrpTotal')) document.getElementById('mrpTotal').textContent = `₹${mrp.toLocaleString()}`;
  if (document.getElementById('discountAmt')) document.getElementById('discountAmt').textContent = `− ₹${discount.toLocaleString()}`;
  if (document.getElementById('totalAmt')) document.getElementById('totalAmt').textContent = `₹${finalTotal.toLocaleString()}`;
  if (document.getElementById('savingsLine')) document.getElementById('savingsLine').textContent = `🎉 You are saving ₹${(discount + couponAmt).toLocaleString()} on this order!`;
}

// ---- COUPON CODE ----
window.appliedCoupon = false;
function applyCoupon() {
  const input = document.getElementById('couponInput');
  const msg = document.getElementById('couponMsg');
  if (!input || !msg) return;
  const code = input.value.trim().toUpperCase();

  if (code === 'STYLE10') {
    window.appliedCoupon = true;
    msg.textContent = '✅ Coupon applied! Extra 10% OFF';
    msg.className = 'coupon-msg success';
    document.getElementById('couponRow').style.display = 'flex';
    updateCartSummary();
    // Update coupon discount display
    const total = Object.values(cartData).reduce((s, i) => s + i.price * i.qty, 0);
    document.getElementById('couponDiscount').textContent = `− ₹${Math.round(total * 0.1)}`;
  } else if (code === '') {
    msg.textContent = 'Please enter a coupon code';
    msg.className = 'coupon-msg error';
  } else {
    msg.textContent = '❌ Invalid coupon code. Try STYLE10';
    msg.className = 'coupon-msg error';
  }
}

// ---- CART TABS ----
function showTab(tab) {
  const cartView = document.getElementById('cartView');
  const checkoutView = document.getElementById('checkoutView');
  const tabCart = document.getElementById('tabCart');
  const tabCheckout = document.getElementById('tabCheckout');
  if (!cartView || !checkoutView) return;

  if (tab === 'cart') {
    cartView.style.display = '';
    checkoutView.style.display = 'none';
    if (tabCart) tabCart.classList.add('active');
    if (tabCheckout) tabCheckout.classList.remove('active');
  } else {
    cartView.style.display = 'none';
    checkoutView.style.display = '';
    if (tabCart) tabCart.classList.remove('active');
    if (tabCheckout) tabCheckout.classList.add('active');
  }
}

// ---- PAYMENT SELECTION ----
function selectPayment(type) {
  const payOnline = document.getElementById('payOnline');
  const payCOD = document.getElementById('payCOD');
  const upiSection = document.getElementById('upiSection');

  if (payOnline) payOnline.classList.remove('active');
  if (payCOD) payCOD.classList.remove('active');

  if (type === 'online') {
    if (payOnline) payOnline.classList.add('active');
    if (upiSection) upiSection.style.display = '';
  } else {
    if (payCOD) payCOD.classList.add('active');
    if (upiSection) upiSection.style.display = 'none';
  }
}

// ---- FORM VALIDATION & ORDER PLACE ----
function placeOrder() {
  const firstName = document.getElementById('firstName');
  const lastName = document.getElementById('lastName');
  const email = document.getElementById('email');
  const phone = document.getElementById('phone');
  const address = document.getElementById('address');
  const city = document.getElementById('city');
  const pincode = document.getElementById('pincode');

  const fields = [firstName, lastName, email, phone, address, city, pincode];
  let valid = true;

  fields.forEach(f => {
    if (f && !f.value.trim()) {
      f.style.borderColor = '#e53e3e';
      valid = false;
    } else if (f) {
      f.style.borderColor = '';
    }
  });

  if (!valid) {
    alert('Please fill in all required fields.');
    return;
  }

  // Show success modal
  const modal = document.getElementById('successModal');
  const overlay = document.getElementById('modalOverlay');
  if (modal) modal.style.display = 'flex';
  if (overlay) overlay.style.display = 'block';
}

// ---- TOAST NOTIFICATION ----
function showToast(message) {
  const existing = document.getElementById('toast');
  if (existing) existing.remove();

  const toast = document.createElement('div');
  toast.id = 'toast';
  toast.textContent = message;
  toast.style.cssText = `
    position: fixed; bottom: 80px; left: 50%; transform: translateX(-50%);
    background: #0a0a0a; color: white; padding: 12px 24px;
    border-radius: 50px; font-size: 14px; font-weight: 600;
    z-index: 999; white-space: nowrap; box-shadow: 0 4px 20px rgba(0,0,0,0.3);
    animation: fadeInUp 0.3s ease;
  `;
  document.body.appendChild(toast);
  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transition = 'opacity 0.3s';
    setTimeout(() => toast.remove(), 300);
  }, 2500);
}

// Inject toast animation
const style = document.createElement('style');
style.textContent = `@keyframes fadeInUp { from { opacity:0; transform:translateX(-50%) translateY(10px); } to { opacity:1; transform:translateX(-50%) translateY(0); } }`;
document.head.appendChild(style);
