import { Router } from 'express';

export const configRouter = Router();

configRouter.get('/', (req, res) => {
  res.json({
    data: {
      storeName: process.env.STORE_NAME || 'PastelShop',
      adminWhatsapp: process.env.ADMIN_WHATSAPP || '',
    },
  });
});
