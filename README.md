# Rupinder Kaur — Portfolio

A bold, creative portfolio site for a Software Developer in Test (SDET),
built with **Next.js**. Designed to deploy on **Vercel** in one click.

---

## 🚀 Deploy to Vercel (3 steps)

### 1. Put this code on GitHub

Create an **empty** new repo on GitHub (no README/.gitignore), then from this
folder run:

```bash
git init
git add .
git commit -m "Initial portfolio"
git branch -M main
git remote add origin https://github.com/<YOUR_USERNAME>/<YOUR_REPO>.git
git push -u origin main
```

### 2. Import into Vercel

1. Go to **https://vercel.com/new**
2. Sign in with GitHub and select this repository.
3. Vercel auto-detects Next.js — just click **Deploy**. No settings to change.

Your site goes live at `https://<your-repo>.vercel.app`.

### 3. (Optional) Add a custom domain

In the Vercel project → **Settings → Domains**, add your domain and follow the
DNS instructions.

---

## ✏️ How to edit the content (no coding required)

**Everything on the site lives in one file:** [`data/content.js`](data/content.js)

Open it and change the text between the quotes. For example, to add real links,
fill these in:

```js
export const links = {
  email: "rupinder88uiet@gmail.com",
  linkedin: "https://www.linkedin.com/in/rupinderkkaur",
  github: "https://github.com/<username>",
  resume: "/resume.pdf",
};
```

- Buttons for empty (`""`) links are hidden automatically.
- **Resume:** drop a `resume.pdf` into the `public/` folder, then set
  `resume: "/resume.pdf"`.
- After editing, `git commit` + `git push` — Vercel redeploys automatically.

---

## 🖥️ Run it locally (optional)

```bash
npm install
npm run dev
```

Open http://localhost:3000

---

## 🎨 Design notes

- **Concept:** "Code & Cultivate" — engineering precision meets her creative
  life (gardening, fusion cooking, interior design).
- **Fonts:** Fraunces (display), Sora (body), JetBrains Mono (code accents).
- **Palette:** warm cream canvas, deep-ink showcase, garden-green / chili-coral
  / amber / plum accents.
- Animated **RK** monogram, scroll-reveal animations, film-grain texture.
- Fully responsive; respects `prefers-reduced-motion`.

To tweak colors, edit the CSS variables at the top of
[`app/globals.css`](app/globals.css).
