// ============================================
// PRODUCT DETAIL PAGE HANDLER
// Reads ?id=<product_id> from the URL and fills product-detail.html
// with the matching record from productsData (js/data.js).
// ============================================

(function() {
  'use strict';

  var SITE_NAME = 'Josera';

  function setMetaDescription(text) {
    var meta = document.querySelector('meta[name="description"]');
    if (meta && text) meta.setAttribute('content', text);
    var og = document.querySelector('meta[property="og:description"]');
    if (og && text) og.setAttribute('content', text);
  }

  function showNotFound() {
    var content = document.querySelector('.product-detail-content');
    content.innerHTML =
      '<div class="product-not-found">' +
        '<p>Ապրանքը չի գտնվել։</p>' +
        '<p><a class="cta-button" href="index.html">Վերադառնալ գլխավոր էջ</a></p>' +
      '</div>';
    document.title = 'Ապրանքը չի գտնվել - ' + SITE_NAME;
  }

  /**
   * Load product detail from URL parameter
   */
  function loadProductDetail() {
    var params = new URLSearchParams(window.location.search);
    var productId = params.get('id');

    if (!productId || typeof productsData === 'undefined' ||
        !Object.prototype.hasOwnProperty.call(productsData, productId)) {
      showNotFound();
      return;
    }

    var product = productsData[productId];

    // Text content
    document.getElementById('productName').textContent = product.name || '—';
    document.getElementById('productType').textContent = product.type || '';
    document.getElementById('productMini').textContent = product.mini || '';
    document.getElementById('productDesc').textContent = product.description || '';

    // Page title + description (browser tab, bookmarks, link previews rendered with JS)
    document.title = (product.name || 'Ապրանք') + ' - ' + SITE_NAME;
    var ogTitle = document.querySelector('meta[property="og:title"]');
    if (ogTitle) ogTitle.setAttribute('content', document.title);
    setMetaDescription(product.mini);

    // Packaging
    var packagingEl = document.getElementById('productPackaging');
    packagingEl.innerHTML = '';
    if (product.packaging) {
      var packDiv = document.createElement('div');
      packDiv.className = 'packaging-value';
      packDiv.textContent = product.packaging;
      packagingEl.appendChild(packDiv);
    }

    // Veterinary diets: show "use on a vet's advice" note
    var vetNote = document.getElementById('vetNote');
    if (vetNote) vetNote.hidden = product.category !== 'help';

    // Image
    var imgEl = document.getElementById('productImage');
    if (product.image) {
      imgEl.src = product.image;
      imgEl.alt = product.name || 'Ապրանք';
      imgEl.hidden = false;
    }
  }

  /**
   * Back button: previous page if there is one, otherwise the home page
   * (e.g. when the product was opened directly from a QR code).
   */
  function setupBackButton() {
    var backBtn = document.getElementById('backBtn');
    if (!backBtn) return;
    backBtn.addEventListener('click', function () {
      var cameFromThisSite = document.referrer &&
        document.referrer.indexOf(window.location.host) !== -1;
      if (cameFromThisSite && window.history.length > 1) {
        window.history.back();
      } else {
        window.location.href = 'index.html';
      }
    });
  }

  function init() {
    loadProductDetail();
    setupBackButton();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
