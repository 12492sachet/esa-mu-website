# ESA-MU Frontend

**Engineering Students' Association of Moi University**  
Built with: React 18 · TypeScript · Tailwind CSS · Vite

---

## Quick Start (XAMPP / WAMP / Laragon)

### 1. Install Node.js
Download and install from https://nodejs.org (LTS version)

### 2. Place this folder
Put the `esamu-frontend` folder anywhere on your computer (not inside htdocs).

### 3. Install dependencies
Open a terminal inside `esamu-frontend/` and run:
```bash
npm install
```

### 4. Start development server
```bash
npm run dev
```
Open http://localhost:5173 in your browser.

---

## Pages

| Route                      | Page                  |
|----------------------------|-----------------------|
| `/`                        | Home (Hero + previews)|
| `/about`                   | About ESA-MU          |
| `/team`                    | Team members          |
| `/gallery`                 | Photo gallery         |
| `/blog`                    | Blog list             |
| `/blog/:id`                | Blog post detail      |
| `/exam-bank`               | Exam bank with filters|
| `/marketplace`             | Product listing       |
| `/marketplace/cart`        | Shopping cart         |
| `/marketplace/checkout`    | M-Pesa checkout       |
| `/contact`                 | Contact form          |
| `/admin`                   | Admin dashboard       |
| `/admin/login`             | Admin login           |

---

## Connecting to Backend

Edit `vite.config.ts` — the proxy target points to your PHP backend:
```ts
proxy: {
  '/api': {
    target: 'http://localhost/esamu-backend/public',
    changeOrigin: true,
  }
}
```

Change `esamu-backend` to whatever folder name you use in htdocs.

---

## Building for Production

```bash
npm run build
```

Output goes to `dist/`. Copy the contents of `dist/` into your web server's public folder.

---

## Tech Stack

- **React 18** with TypeScript
- **Vite** for fast development builds
- **Tailwind CSS** for styling (crimson theme matching ESA-MU logo)
- **React Router v6** for client-side routing
- **Axios** for API calls
- **Google Fonts**: Playfair Display (headings) + DM Sans (body)

---

## Folder Structure

```
src/
├── components/     # Navbar, Footer
├── context/        # CartContext, AuthContext
├── pages/          # All page components
├── services/       # API service layer (api.ts)
├── types/          # TypeScript interfaces
├── App.tsx         # Router setup
├── main.tsx        # Entry point
└── index.css       # Global styles + Tailwind
```

---

## Next Steps

1. Build the **PHP backend** (next phase)
2. Connect exam bank to real PDF uploads
3. Wire M-Pesa Daraja API to checkout
4. Add admin authentication with JWT
