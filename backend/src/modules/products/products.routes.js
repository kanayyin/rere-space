import { Router } from 'express';
import prisma from '../../lib/prisma.js';
import { serializeProduct } from '../../lib/serializers.js';
import { ApiError } from '../../lib/errors.js';
import { requireAdmin } from '../../middleware/auth.js';

export const adminProductsRouter = Router();
adminProductsRouter.use(requireAdmin);

function slugify(name) {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
}

async function uniqueSlug(name, excludeId) {
  const base = slugify(name);
  let slug = base;
  let i = 1;
  while (true) {
    const existing = await prisma.product.findFirst({ where: { slug, NOT: excludeId ? { id: excludeId } : undefined } });
    if (!existing) return slug;
    slug = `${base}-${i++}`;
  }
}

adminProductsRouter.get('/', async (req, res, next) => {
  try {
    const { q, category, page = 1, pageSize = 20 } = req.query;
    const where = {
      ...(category ? { category: { equals: category, mode: 'insensitive' } } : {}),
      ...(q ? { name: { contains: q, mode: 'insensitive' } } : {}),
    };
    const [total, items] = await Promise.all([
      prisma.product.count({ where }),
      prisma.product.findMany({
        where,
        include: { options: { orderBy: [{ sortOrder: 'asc' }] } },
        orderBy: [{ sortOrder: 'asc' }, { name: 'asc' }],
        skip: (Number(page) - 1) * Number(pageSize),
        take: Number(pageSize),
      }),
    ]);
    res.json({
      data: { items: items.map(serializeProduct), meta: { page: Number(page), pageSize: Number(pageSize), total, totalPages: Math.ceil(total / Number(pageSize)) } },
    });
  } catch (err) { next(err); }
});

adminProductsRouter.get('/:id', async (req, res, next) => {
  try {
    const product = await prisma.product.findUnique({ where: { id: req.params.id }, include: { options: { orderBy: [{ sortOrder: 'asc' }] } } });
    if (!product) throw ApiError.notFound('Produk tidak ditemukan.');
    res.json({ data: serializeProduct(product) });
  } catch (err) { next(err); }
});

adminProductsRouter.post('/', async (req, res, next) => {
  try {
    const { name, category, description, imageUrl, isActive = true, sortOrder = 0, options = [] } = req.body;
    if (!name?.trim()) throw ApiError.badRequest('Nama produk wajib diisi.');
    if (!category?.trim()) throw ApiError.badRequest('Kategori wajib diisi.');
    if (options.length === 0) throw ApiError.badRequest('Minimal 1 varian harga.');
    const slug = await uniqueSlug(name);
    const product = await prisma.product.create({
      data: {
        name: name.trim(), slug, category: category.trim(),
        description: description?.trim() || null,
        imageUrl: imageUrl?.trim() || null,
        isActive, sortOrder: Number(sortOrder) || 0,
        options: { create: options.map((o, i) => ({ name: o.name.trim(), price: Number(o.price), isActive: o.isActive ?? true, sortOrder: Number(o.sortOrder ?? i) })) },
      },
      include: { options: { orderBy: [{ sortOrder: 'asc' }] } },
    });
    res.status(201).json({ data: serializeProduct(product) });
  } catch (err) { next(err); }
});

adminProductsRouter.put('/:id', async (req, res, next) => {
  try {
    const { name, category, description, imageUrl, isActive, sortOrder, options = [] } = req.body;
    const existing = await prisma.product.findUnique({ where: { id: req.params.id }, include: { options: true } });
    if (!existing) throw ApiError.notFound('Produk tidak ditemukan.');
    const slug = await uniqueSlug(name || existing.name, req.params.id);
    const incomingIds = options.filter((o) => o.id).map((o) => o.id);
    await prisma.productOption.deleteMany({ where: { productId: req.params.id, id: { notIn: incomingIds } } });
    const product = await prisma.product.update({
      where: { id: req.params.id },
      data: {
        name: name?.trim() ?? existing.name, slug,
        category: category?.trim() ?? existing.category,
        description: description?.trim() || null,
        imageUrl: imageUrl?.trim() || null,
        isActive: isActive ?? existing.isActive,
        sortOrder: sortOrder !== undefined ? Number(sortOrder) : existing.sortOrder,
        options: {
          upsert: options.map((o, i) => ({
            where: { id: o.id || 'new' },
            update: { name: o.name.trim(), price: Number(o.price), isActive: o.isActive ?? true, sortOrder: Number(o.sortOrder ?? i) },
            create: { name: o.name.trim(), price: Number(o.price), isActive: o.isActive ?? true, sortOrder: Number(o.sortOrder ?? i) },
          })),
        },
      },
      include: { options: { orderBy: [{ sortOrder: 'asc' }] } },
    });
    res.json({ data: serializeProduct(product) });
  } catch (err) { next(err); }
});

adminProductsRouter.delete('/:id', async (req, res, next) => {
  try {
    await prisma.product.delete({ where: { id: req.params.id } });
    res.json({ data: { ok: true } });
  } catch (err) { next(err); }
});
