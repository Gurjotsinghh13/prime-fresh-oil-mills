# Prime Fresh Oil Mills – eCell Qualification Challenge 01

Static site (HTML + CSS + vanilla JS). No build step.

## One thing left to fill: the address
The owner has not confirmed the factory address, so the site shows a highlighted placeholder (the brief's requirement #4 needs an address).
Open `js/config.js`, replace `address`, set `addressConfirmed: true`. The "Open in Maps" button then appears on its own.

## What is real vs. illustrative
- **Real, from the Drive assets / owner chat:** logo, phone +91 90572 92529, email, the 7 seed/cake photos, the 2 facility videos, the product scope (oils, seeds, de-oiled cakes), and the bestsellers (Yellow Mustard Oil, groundnut seeds, sesame seeds and oil).
- **Hero image:** the yellow mustard seed photo is captioned "Raw material: yellow mustard seeds", so it is never presented as the oil. Replace it with a real oil pack photo if the owner supplies one.
- **Illustrated:** the two oil cards (Yellow Mustard Oil, Sesame Oil) use a drawn oil drop and are tagged "Illustration", because no oil pack photo was provided. A seed photo is never passed off as oil. Drop real oil photos into `assets/products/` and set `image` (remove `illus`) in `config.js` when you get them.
- **Deliberately not claimed:** prices, pack sizes, MOQ, certifications, capacities, shelf life, delivery times, business hours.
- **Not used:** `Sesame_Seeds_Photo_1` (it carries a third-party "DNA हिंदी" watermark). The clean `Photo_2` is used for Sesame Seeds.
- **Logo:** the file used is the one you attached (no "MUSTARD OIL" words). If the owner's original still has them, swap `assets/logo-emblem.png` and `assets/logo-full.png`.

## Multi-product quote list (bonus feature)
Buyers like FMCG companies, oil brands and private-label businesses often source several products from one manufacturer, so the site works like a quote list:
- **Add to quote** on any catalog card (oils, seeds, cakes). Tap again to remove. The hero buttons add Yellow Mustard Oil and jump to the form.
- A floating **"N products in your quote"** button follows the buyer while browsing, and hides once the form is on screen.
- In the form, every product is its own line with **quantity, unit (Tonnes / Kg / Litres) and packing**, plus a remove button and an "add another product" dropdown.
- Validation needs at least one product and a quantity above 0 on every line.
- Submitting (or WhatsApp) gives **one consolidated request**: a confirmation summary and a numbered WhatsApp message listing every line. Frontend only, nothing is transmitted.
- Packing options are *buyer preferences* (edit in `config.js` under `packing`), not claims about stock or pack sizes.

## Run locally
Open `index.html`, or `python3 -m http.server 8000`.

## Deploy (free public URL)
- **Netlify Drop:** app.netlify.com/drop, drag this whole folder.
- **Vercel:** `npx vercel --prod` inside the folder.
- **GitHub Pages:** push and enable Pages.

Then paste the URL, your pitch-video link and `DESIGN_EXPLANATION.md` into the submission form.
