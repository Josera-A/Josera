# Product Detail System — Developer Note

> Full project documentation is in [README.md](README.md). This note only covers how product pages work.

## How it works

1. Category pages (`shun.html`, `katu.html`, `josi.html`, `bjshkakan.html`) contain hand-written product cards.
2. Each card links to the shared template: `product-detail.html?id=<product_id>`.
3. `product-detail.html` loads, in order: `js/script.js`, `js/data.js`, `js/product-detail.js`.
4. `js/product-detail.js` reads `id` from the URL, looks it up in the global `productsData` object (`js/data.js`) and fills:

   | Element id | Field |
   |---|---|
   | `#productName` | `name` |
   | `#productType` | `type` |
   | `#productMini` | `mini` |
   | `#productDesc` | `description` |
   | `#productPackaging` | `packaging` (shown as a badge) |
   | `#productImage` | `image` (+ `alt` = `name`) |

   Values are inserted with `textContent` (plain text only).
5. Missing or unknown `id` → the content area shows "Ապրանքը չի գտնվել։" (product not found).
6. "← Վերադառնալ" button → `history.back()`, or `index.html` when there is no history (e.g. opened from a QR code).

No backend is involved; everything runs in the browser and works on GitHub Pages and from `file://`.

## Product record

```js
'josera_kids': {
  name: 'Josera Kids',
  type: 'Գերմանական սուպեր պրեմիում դասի կեր',
  mini: 'Նախատեսված է միջին և մեծ ցեղատեսակի ձագուկների համար (2–15 ամսական)։',
  description: 'Պարունակում է թռչնամիս։ ...',
  packaging: '12.5 kg',
  image: 'pictures/dog/dog-josera_kids.webp'
},
```

## Card template (category pages)

```html
<a class="product-card" href="product-detail.html?id=PRODUCT_ID">
    <div class="product-card-content">
        <div class="text">
            <h2>Product Name</h2>
            <div class="mini-desc">Short text</div>
        </div>
        <img src="pictures/<folder>/<file>.webp" alt="Product Name">
    </div>
</a>
```

Image folders and naming (case-sensitive on GitHub Pages):

| Folder | Pattern |
|---|---|
| `pictures/dog/` | `dog-josera_<name>.webp` |
| `pictures/cat/` | `cat-josera_<name>.webp` |
| `pictures/josi/` | `josi&cat_<name>.webp` / `josi&dog_<name>.webp` |
| `pictures/help/` | `help&josera_<name>.webp` |

## Checklist when adding/changing a product

- [ ] Record added/updated in `js/data.js` (unique lowercase ID, comma between records)
- [ ] Card added/updated on the category page with the same ID
- [ ] Image exists at exactly the path used in both places (same letter case)
- [ ] Card text and `mini` in `data.js` say the same thing
- [ ] `product-detail.html?id=<id>` opens correctly on desktop and phone
- [ ] No existing ID was renamed (printed QR codes may use it)

The complete list of product IDs per category is in README.md, section 7.
