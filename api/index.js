// Serverless function Vercel. Semua request ke /api/* diarahkan ke sini
// lewat rewrite di vercel.json, lalu diteruskan ke Express app yang sama
// dengan yang dipakai untuk development lokal (be/src/app.js).
import app from '../be/src/app.js';

export default app;
