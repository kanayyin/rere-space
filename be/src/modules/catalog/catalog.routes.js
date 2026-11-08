import { Router } from 'express';
import prisma from '../../lib/prisma.js';
import { serializeProduct } from '../../lib/serializers.js';
import { ApiError } from '../../lib/errors.js';

export const catalogRouter = Router();

catalogRouter.get('/categories', async (req, res, next) => {
  try {
    const products = await prisma.product.findMany({ select: { category: true } });
    const cats = [...new Set(products.map((p) => p.category))].sort();
    res.json({ data: cats });
  } catch (err) { next(err); }
});

catalogRouter.get('/products', async (req, res, next) => {
  try {
    const { category, q } = req.query;
    const products = await prisma.product.findMany({
      where: {
        ...(category ? { category: { equals: category, mode: 'insensitive' } } : {}),
        ...(q ? { name: { contains: q, mode: 'insensitive' } } : {}),
      },
      include: { options: { orderBy: [{ sortOrder: 'asc' }, { name: 'asc' }] } },
      orderBy: [{ sortOrder: 'asc' }, { name: 'asc' }],
    });
    res.json({ data: products.map(serializeProduct) });
  } catch (err) { next(err); }
});

catalogRouter.get('/products/:slug', async (req, res, next) => {
  try {
    const product = await prisma.product.findFirst({
      where: { slug: req.params.slug },
      include: { options: { orderBy: [{ sortOrder: 'asc' }, { name: 'asc' }] } },
    });
    if (!product) throw ApiError.notFound('Produk tidak ditemukan.');
    res.json({ data: serializeProduct(product) });
  } catch (err) { next(err); }
});
