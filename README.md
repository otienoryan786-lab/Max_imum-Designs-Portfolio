# Max_imum Designs website

A fast, static site built with HTML, CSS and JavaScript. No build step or backend is required.

## Publish with GitHub Pages
1. Push the project files to a GitHub repository.
2. In **Settings > Pages**, choose **Deploy from a branch**, select `main` and the `/ (root)` folder, then save.
3. The current public address is `https://otienoryan786-lab.github.io/Max_imum-Designs/`. It is also referenced in `index.html`, `sitemap.xml` and `robots.txt`. Update those references if the domain or repository URL changes.

## Edit the site
- **Prices and service options:** `prices.js`. The price list and quote form use this file.
- **Homepage copy, launch offer and campaign reel:** `index.html`. The launch offer is limited to the first 5 accepted quotations and ends on 31 December 2026 or when those places are filled, whichever comes first. Remove or update the offer in `index.html`, its price note, and the offer terms in `terms.html` when it ends; do not imply that it combines with other discounts.
- **Promotional campaign assets:** `Max_imum_Promotional_Materials/11_Promotional_Materials/` is the source pack. The homepage uses a curated web-ready copy in `assets/promotional/`: the launch reel, its cover, the launch post, and the 1200 × 630 social-share image for Open Graph and Twitter previews. Update the curated copies and references in `index.html` when replacing these materials.
- **Colours and layout:** the `:root` variables and component styles in `style.css`. Follow the supplied brand guidelines: Midnight Ink, Max Violet, Volt Lime, Cloud, Lilac, Graphite and Slate; use Lime as an accent, not as a background for small text.
- **Portfolio content:** `portfolio-data.js`. Add project images to `assets/portfolio/` as JPG files (about 1400 px wide), then list their filenames without `.jpg` in each project's `images` array. Set `featured: true` for projects to include them in the case-study section; keep project type and deliverables factual. The interactive page is rendered by `portfolio.js`.
- **Work images:** `assets/img/` and `assets/portfolio/`. Keep images close to their existing aspect ratios. Keep the JPG originals as fallbacks; after adding or replacing JPGs, run `node scripts/optimize-images.mjs` to regenerate the responsive WebP files and `assets/image-sizes.js` (Google Chrome is required for this optional image task).
- **Business details:** `business-details.js`. Empty registration fields are hidden. Only add an ODPC statement after verifying it.
- **Contact:** search for the phone number `254112816303` and email `maxthompson786@gmail.com`. Confirm that public contact details and social handles are current.
- **Policies:** `policies.html`, `privacy.html`, `service-terms.html`, `ai-policy.html` and `terms.html`. Review business-specific details and dates before publishing.
- **PDF portfolio:** replace `downloads/Max_imum_Designs_Portfolio_2026.pdf` when the portfolio changes.

The quote form opens WhatsApp or an email app with a prepared message; it does not store submissions. The homepage chat guide answers common questions locally in the browser and does not send or store chat messages. It is automated, not live support; visitors can use its WhatsApp link to contact Ryan. If you later connect a chat or form service, update the Privacy Policy.

## Preview locally
Open the folder in VS Code and use Live Server, or run `python -m http.server 8000` from this folder and visit http://localhost:8000.

## Checks
Run `node tests/check-site.mjs` to check local page and asset links, in-page anchors, duplicate IDs, responsive image variants and basic document structure. GitHub Actions runs the same check for pushes and pull requests.

## Custom domain
For a `.co.ke` or `.ke` domain, configure it under **Settings > Pages > Custom domain** and add the DNS records GitHub provides.
