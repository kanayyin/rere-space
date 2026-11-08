// Entry point untuk jalan lokal (npm run dev) ATAU kalau nanti mau deploy
// terpisah ke Railway/Render. Vercel tidak memakai file ini — Vercel memakai
// /api/index.js yang mengimpor app.js langsung sebagai serverless function.
import app from './app.js';

const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
  console.log(`PastelShop backend running on port ${PORT}`);
});
