# Max_imum Designs website: open it in your code editor and save it on GitHub

Your live site: https://otienoryan786-lab.github.io/Max_imum-Designs/
Your repository (assumed from the address): https://github.com/otienoryan786-lab/Max_imum-Designs
The project folder is `maximum-designs-website/` (this is the code base).

## 1. What is in the project
```
maximum-designs-website/
  index.html            home page (services, prices, work, process, about, FAQ, quote form)
  portfolio.html        NEW portfolio page (filters, project pop-ups, roadmap, PDF download)
  policies.html, privacy.html, service-terms.html, ai-policy.html, terms.html
  css/style.css         all styles (colours are variables at the top: :root)
  js/prices.js          every price on the site (edit prices here only)
  js/portfolio-data.js  NEW every portfolio project and roadmap item (edit the portfolio here only)
  js/business-details.js your registered name, number, address (edit once, policies update)
  js/main.js, portfolio.js, details.js   the code that draws the pages (usually no edits needed)
  js/max.js, css/max.css  Max the animated design buddy, welcome screen and helper (edit his words here)
  js/healthcheck.js       the interactive Brand Health Check (edit questions and fixes here)
  js/tools.js             logo preview and quote builder
  welcome.html, brand-health-check.html, playground.html   the interactive pages
  assets/logo/, assets/img/, assets/portfolio/   logos and images
  downloads/            the PDF portfolio
  README.md, sitemap.xml, robots.txt, .nojekyll, .gitignore, .editorconfig, .vscode/
```

## 2. Open it in VS Code
1. Unzip `maximum-designs-website.zip`.
2. Open VS Code, choose File > Open Folder, and pick the `maximum-designs-website` folder.
3. When VS Code suggests the extensions (Live Server, Prettier), click Install. (Or search "Live Server" by Ritwick Dey in the Extensions tab.)
4. Right-click `index.html` (or `portfolio.html`) and choose **Open with Live Server**. Your browser opens, and every time you save a file the page refreshes.
Without VS Code extensions: open a terminal in the folder and run `python -m http.server 8000`, then visit http://localhost:8000.

## 3. Add a new project to the portfolio
1. Put 1 to 4 images in `assets/portfolio/` (JPG, about 1400 px wide, under 150 KB each). Example: `bakery-logo-1.jpg`.
2. Open `js/portfolio-data.js`. Copy a whole project block (from `{` to `}`) inside `"projects"`, paste it at the top, and change `id`, `title`, `cat` (Branding, Print, Social, Documents, Motion or Web), `type` (for example "Client project"), `date`, `summary`, `challenge`, `approach`, `deliverables`, `tags`, and `images` (file names without `.jpg`).
3. Save and check the page in Live Server. Remember a comma between blocks.
4. To finish a roadmap item, change its `"status"` from `"Planned"` to `"Completed"`, then add a full project for it.
5. Update the PDF portfolio when you add many projects, and replace `downloads/Max_imum_Designs_Portfolio_2026.pdf`.
Only add client work with the client's permission (use the Portfolio and Testimonial Consent Form).

## 4. Save it on GitHub
Pick ONE of these. A is the simplest. B is what developers use every day.

### A. Upload in the browser (no Git needed)
1. Go to https://github.com/otienoryan786-lab/Max_imum-Designs and click **Add file > Upload files**.
2. Open the unzipped `maximum-designs-website` folder on your computer, select EVERYTHING inside it (not the folder itself), and drag it into the browser. Folders upload too.
3. In "Commit changes", type a message such as `Add portfolio page, project data and PDF portfolio`.
4. Choose **Commit directly to the main branch** and click **Commit changes**.
5. Wait 1 to 2 minutes. Open the site and press Ctrl+F5 to refresh.

### B. Git and VS Code (recommended)
First time only:
1. Install Git from https://git-scm.com and restart VS Code.
2. In a terminal, set your name and email (use your GitHub email):
```
git config --global user.name "Ryan Otieno"
git config --global user.email "maxthompson786@gmail.com"
```
3. Get your repository onto your computer:
```
git clone https://github.com/otienoryan786-lab/Max_imum-Designs.git
cd Max_imum-Designs
```
4. Copy everything from the `maximum-designs-website` folder into this cloned folder (replace files when asked). Open the cloned folder in VS Code.

Every time you change something:
```
git status
git add .
git commit -m "Add portfolio page, project data and PDF portfolio"
git push origin main
```
VS Code can do the same with buttons: open the Source Control tab (the branch icon), type the message, click Commit, then Sync Changes.
When Git asks you to sign in, choose the browser sign-in. GitHub no longer accepts account passwords in the terminal. If it asks for a token, create one at GitHub > Settings > Developer settings > Personal access tokens, with "repo" permission, and use it as the password.

### C. GitHub Desktop (no commands)
Install GitHub Desktop, sign in, File > Clone repository > Max_imum-Designs, copy the project files into the folder, then write a summary, click **Commit to main**, then **Push origin**.

## 5. Check that it is live
- On GitHub open Settings > Pages. It should say "Your site is live".
- Open the Actions tab: a green tick means the update published; a red cross means a problem (click it to read the error).
- Open https://otienoryan786-lab.github.io/Max_imum-Designs/portfolio.html and press Ctrl+F5.

## 6. If something goes wrong
- **"rejected (fetch first)"** when pushing: run `git pull --rebase origin main`, then `git push origin main`.
- **Branch is `master`, not `main`:** run `git branch` to see it, and push to that name.
- **Images or pages not found:** GitHub Pages file names are case-sensitive. `Logo.JPG` and `logo.jpg` are different.
- **Page looks old:** press Ctrl+F5, wait 2 minutes, and check the Actions tab.
- **Never commit private files** (KRA PIN, business-details.json from the toolkit, signed contracts). The `.gitignore` in the project protects the common ones, but the repository is public.

## 7. Good commit messages
- `Add interactive welcome with Max, Brand Health Check and logo and quote tools`
- `Add launch offer banner, Brand Health Check section and source field`
- `Add portfolio page, project data and PDF portfolio`
- `Add case study: [client name] logo and social kit`
- `Update prices for 2027`
- `Update business details`
- `Fix broken image link on portfolio page`
