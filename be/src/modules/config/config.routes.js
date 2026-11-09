import { Router } from 'express';

export const configRouter = Router();

configRouter.get('/', (req, res) => {
  res.json({
    data: {
      storeName: process.env.STORE_NAME || 'Sourire',
      adminWhatsapp: process.env.ADMIN_WHATSAPP || '',
    },
  });
});
