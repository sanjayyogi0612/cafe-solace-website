# Café Solace — website

An editorial, scroll-animated single-page site for **Café Solace**, Bhakrota (Ajmer Road), Jaipur.
Built to feel like a premium brand page (loader counter, smooth Lenis scroll, GSAP parallax + reveals,
animated stat counters, marquee, live Google Map) while staying 100% static — no build step.

## Run locally
```bash
python3 -m http.server 8799
# open http://localhost:8799
```

## Deploy to Vercel
```bash
npm i -g vercel      # once
vercel               # from this folder → follow prompts (framework: Other / static)
vercel --prod        # push to production
```
Or: push this folder to GitHub and "Import Project" on vercel.com (no settings needed — it's static).

## Files
| File | What it holds |
|------|----------------|
| `index.html` | Page structure + section content |
| `styles.css` | Full design system (Café Solace navy / cream / gold palette) |
| `app.js` | Loader, Lenis smooth scroll, GSAP hero + parallax, reveals, counters, menu render + filters |
| `menu-data.js` | The complete menu (edit prices/items here — the page rebuilds itself) |
| `assets/` | Drop your photos here (see below) |

## Editing the menu
Open `menu-data.js` — it's a plain list of `{ cat, items: [ [name, price], … ] }`.
Change a price, add a dish, reorder categories — the menu grid and filter chips update automatically.

## Photos — drop these into `assets/`
The site shows labelled placeholders until real images exist. Name each file exactly as below
(**.jpg**, landscape unless noted). You can use the café's own Google/Instagram photos, **or**
generate images with the prompts below. Keep them warm-toned to match the navy + gold theme.

| Filename | Used for | Suggested AI prompt |
|----------|----------|---------------------|
| `assets/hero.jpg` | Full-screen hero (dark, cinematic) | *"Moody cinematic wide interior of a cozy modern Indian café at dusk, warm tan leather chairs, carved wooden ceiling with recessed lights, stone feature wall, soft golden ambient glow, shallow depth of field, editorial photography, dark navy tones"* |
| `assets/interior-1.jpg` | Tall gallery image | *"Vertical shot of café seating — tan diamond-tufted chairs and round marble tables, warm lamps, grey textured wallpaper, inviting and calm, natural window light"* |
| `assets/interior-2.jpg` | Gallery | *"Detail of a decorative carved wooden café ceiling with geometric panels and a hanging brass lantern chandelier, warm tones"* |
| `assets/exterior.jpg` | Gallery | *"Street-view façade of 'Café Solace' with black signage and gold lettering, glass arched windows, evening, welcoming entrance with steps"* |
| `assets/italian-pizza.jpg` | Signature card | *"Top-down of a thin-crust Italian veg pizza, bubbling cheese, basil, fresh from a wood oven, on a rustic board, warm light"* |
| `assets/cold-coffee.jpg` | Signature card | *"Tall glass of thick cold coffee topped with a scoop of vanilla ice cream and chocolate drizzle, café table, dreamy bokeh"* |
| `assets/chilli-potato.jpg` | Signature card | *"Bowl of honey chilli potato, glossy red sauce, spring onion and sesame garnish, Indo-Chinese street-food styling, moody dark background"* |

Once a file is present it replaces the placeholder automatically — no code change needed.

## Data sources
Details (address, hours, rating, reviews, price band, phone, Instagram) were compiled from the
café's **Google Business Profile, Zomato, Justdial and Swiggy** listings and the café's own menu boards.
Update the ratings block in `index.html` (search `reviews__platforms`) if the numbers change.
