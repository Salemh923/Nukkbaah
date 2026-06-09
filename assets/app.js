/* ===================================================
   نُخبة Theme — Main JavaScript
   Compatible with Salla platform
   =================================================== */

(function () {
  'use strict';

  /* ── Cart, Wishlist, Compare Counters ──────────── */
  function updateCounters() {
    try {
      var cart = JSON.parse(localStorage.getItem('nukhba_cart') || '[]');
      var wish = JSON.parse(localStorage.getItem('nukhba_wishlist') || '[]');
      var compare = JSON.parse(localStorage.getItem('nukhba_compare') || '[]');

      var cartTotal = cart.reduce(function (s, i) { return s + (i.qty || 1); }, 0);
      setCounter('cartCount', cartTotal);
      setCounter('wishCount', wish.length);
      setCounter('compareCount', compare.length);
    } catch (e) {}
  }

  function setCounter(id, total) {
    var el = document.getElementById(id);
    if (!el) return;
    el.innerText = total;
    el.style.display = total > 0 ? 'flex' : 'none';
  }

  /* ── Toast Notification ────────────────────────── */
  function showToast(message) {
    var old = document.querySelector('.toast');
    if (old) old.remove();

    var toast = document.createElement('div');
    toast.className = 'toast';
    toast.innerText = message;
    document.body.appendChild(toast);

    setTimeout(function () {
      if (toast.parentNode) toast.remove();
    }, 1800);
  }

  /* ── Filter Buttons ────────────────────────────── */
  function initFilters() {
    var filterBtns = document.querySelectorAll('.filter-btn');
    filterBtns.forEach(function (btn) {
      btn.addEventListener('click', function () {
        filterBtns.forEach(function (b) { b.classList.remove('active'); });
        btn.classList.add('active');

        var filter = btn.dataset.filter || 'all';
        var cards = document.querySelectorAll('.product-card-item');
        cards.forEach(function (card) {
          if (filter === 'all') {
            card.style.display = '';
          } else {
            var cardFilter = card.dataset.filter || '';
            card.style.display = cardFilter.indexOf(filter) !== -1 ? '' : 'none';
          }
        });
      });
    });
  }

  /* ── Search Live Filter ────────────────────────── */
  function initSearch() {
    var searchInput = document.querySelector('.search');
    if (!searchInput) return;

    searchInput.addEventListener('input', function () {
      var q = this.value.toLowerCase().trim();
      var cards = document.querySelectorAll('.product-card-item');

      cards.forEach(function (card) {
        var text = (card.dataset.search || card.textContent || '').toLowerCase();
        card.style.display = !q || text.indexOf(q) !== -1 ? '' : 'none';
      });
    });
  }

  /* ── Product Modal ─────────────────────────────── */
  function openModal(id) {
    var modal = document.getElementById('productModal');
    if (!modal) return;
    var content = document.getElementById('modalContent');
    if (!content) return;

    /* Data is injected per-page via data-product attributes */
    var card = document.querySelector('[data-product-id="' + id + '"]');
    if (!card) return;

    var name = card.dataset.name || '';
    var meta = card.dataset.meta || '';
    var price = card.dataset.price || '';
    var oldPrice = card.dataset.oldPrice || '';
    var image = card.dataset.image || '';
    var condition = card.dataset.condition || '';
    var badge = card.dataset.badge || '';
    var warranty = card.dataset.warranty || '';
    var city = card.dataset.city || '';
    var delivery = card.dataset.delivery || '';
    var seller = card.dataset.seller || '';
    var check = card.dataset.check || '';
    var rating = card.dataset.rating || '';
    var reviews = card.dataset.reviews || '';
    var productUrl = card.dataset.url || '#';

    var priceHtml = parseFloat(price).toLocaleString('ar-SA') + ' ريال';
    if (oldPrice) {
      priceHtml += ' <span class="old">' + parseFloat(oldPrice).toLocaleString('ar-SA') + ' ريال</span>';
    }

    content.innerHTML = [
      '<img src="' + image + '" alt="' + name + '">',
      '<div>',
      '<h2>' + name + '</h2>',
      '<p>' + meta + '</p>',
      '<div class="rating">★ ' + rating + ' من 5 — ' + reviews + ' تقييم</div>',
      '<div class="specs">',
      '<div class="spec"><b>الحالة</b>' + condition + '</div>',
      '<div class="spec"><b>الفحص</b>' + badge + '</div>',
      '<div class="spec"><b>الضمان</b>' + warranty + '</div>',
      '<div class="spec"><b>المدينة</b>' + city + '</div>',
      '<div class="spec"><b>التوصيل</b>' + delivery + '</div>',
      '<div class="spec"><b>البائع</b>' + seller + '</div>',
      '</div>',
      check ? '<p><b style="color:var(--gold2)">نتيجة الفحص:</b><br>' + check + '</p>' : '',
      '<p class="price">' + priceHtml + '</p>',
      '<div class="hero-actions">',
      '<a href="' + productUrl + '" class="btn">عرض الصفحة الكاملة</a>',
      '</div>',
      '</div>'
    ].join('');

    modal.classList.add('show');
  }

  function closeModal() {
    var modal = document.getElementById('productModal');
    if (modal) modal.classList.remove('show');
  }

  /* ── Modal Click-outside ───────────────────────── */
  function initModal() {
    var modal = document.getElementById('productModal');
    if (!modal) return;

    modal.addEventListener('click', function (e) {
      if (e.target === modal) closeModal();
    });

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') closeModal();
    });
  }

  /* ── Image Gallery (product page) ─────────────── */
  function initGallery() {
    var thumbs = document.querySelectorAll('.product-thumb');
    var mainImg = document.querySelector('.product-main-img');
    if (!mainImg || !thumbs.length) return;

    thumbs.forEach(function (thumb) {
      thumb.addEventListener('click', function () {
        thumbs.forEach(function (t) { t.classList.remove('active'); });
        thumb.classList.add('active');
        mainImg.src = thumb.src;
      });
    });
  }

  /* ── Sticky Header Shadow ──────────────────────── */
  function initStickyHeader() {
    var header = document.querySelector('.luxury-header');
    if (!header) return;

    window.addEventListener('scroll', function () {
      if (window.scrollY > 10) {
        header.style.boxShadow = '0 8px 40px rgba(0,0,0,.6)';
      } else {
        header.style.boxShadow = '';
      }
    }, { passive: true });
  }

  /* ── Quantity Controls ─────────────────────────── */
  function initQuantity() {
    document.addEventListener('click', function (e) {
      if (e.target.classList.contains('qty-plus')) {
        var input = e.target.parentNode.querySelector('.qty-input');
        if (input) input.value = parseInt(input.value || 1) + 1;
      }
      if (e.target.classList.contains('qty-minus')) {
        var input = e.target.parentNode.querySelector('.qty-input');
        if (input && parseInt(input.value) > 1) input.value = parseInt(input.value) - 1;
      }
    });
  }

  /* ── Condition Selector (sell page) ───────────── */
  function initConditionSelect() {
    var options = document.querySelectorAll('.condition-option');
    options.forEach(function (opt) {
      opt.addEventListener('click', function () {
        options.forEach(function (o) { o.classList.remove('selected'); });
        opt.classList.add('selected');
        var input = document.getElementById('selectedCondition');
        if (input) input.value = opt.dataset.value || '';
      });
    });
  }

  /* ── Salla Event Integration ───────────────────── */
  /* Listen to Salla cart events to keep counters in sync */
  if (typeof window.salla !== 'undefined') {
    salla.event.on('cart.updated', function (data) {
      var cartEl = document.getElementById('cartCount');
      if (cartEl && data && data.count !== undefined) {
        setCounter('cartCount', data.count);
      }
    });

    salla.event.on('wishlist.updated', function (data) {
      var wishEl = document.getElementById('wishCount');
      if (wishEl && data && data.count !== undefined) {
        setCounter('wishCount', data.count);
      }
    });
  }

  /* ── Expose globals for inline onclick attrs ───── */
  window.openProductModal = openModal;
  window.closeModal = closeModal;
  window.showToast = showToast;

  /* ── Init ──────────────────────────────────────── */
  document.addEventListener('DOMContentLoaded', function () {
    updateCounters();
    initFilters();
    initSearch();
    initModal();
    initGallery();
    initStickyHeader();
    initQuantity();
    initConditionSelect();
  });

})();
