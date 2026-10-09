// ============================================
// CATEGORY PAGE CARDS
// Builds the product cards on shun.html, katu.html, josi.html and
// bjshkakan.html from productsData (js/data.js).
// The page must contain: <div class="product-cards-grid" data-category="dog|cat|josi|help">
// ============================================

(function () {
  'use strict';

  var grid = document.querySelector('.product-cards-grid[data-category]');
  if (!grid || typeof productsData === 'undefined') return;

  var category = grid.getAttribute('data-category');
  var fragment = document.createDocumentFragment();

  Object.keys(productsData).forEach(function (id) {
    var product = productsData[id];
    if (product.category !== category) return;

    var link = document.createElement('a');
    link.className = 'product-card';
    link.href = 'product-detail.html?id=' + encodeURIComponent(id);

    var content = document.createElement('div');
    content.className = 'product-card-content';

    var text = document.createElement('div');
    text.className = 'text';

    var title = document.createElement('h2');
    title.textContent = product.name;

    var desc = document.createElement('div');
    desc.className = 'mini-desc';
    desc.textContent = product.card || product.mini || '';

    var img = document.createElement('img');
    img.src = product.image;
    img.alt = product.name;
    img.loading = 'lazy';
    img.decoding = 'async';

    text.appendChild(title);
    text.appendChild(desc);
    content.appendChild(text);
    content.appendChild(img);
    link.appendChild(content);
    fragment.appendChild(link);
  });

  grid.appendChild(fragment);
})();
