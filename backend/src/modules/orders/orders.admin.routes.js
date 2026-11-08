import { Router } from 'express';
import prisma from '../../lib/prisma.js';
import { serializeOrder } from '../../lib/serializers.js';
import { ApiError } from '../../lib/errors.js';
import { requireAdmin } from '../../middleware/auth.js';

export const adminOrdersRouter = Router();
adminOrdersRouter.use(requireAdmin);

const VALID_STATUSES = ['PENDING', 'PAID', 'COMPLETED', 'CANCELLED'];
const TRANSITIONS = {
  PENDING: ['PAID', 'CANCELLED'],
  PAID: ['COMPLETED', 'CANCELLED'],
  COMPLETED: ['CANCELLED'],
  CANCELLED: [],
};

adminOrdersRouter.get('/', async (req, res, next) => {
  try {
    const { status, q, page = 1, pageSize = 20 } = req.query;
    const where = {
      ...(status ? { status } : {}),
      ...(q ? {
        OR: [
          { orderCode: { contains: q, mode: 'insensitive' } },
          { customerName: { contains: q, mode: 'insensitive' } },
          { customerWhatsapp: { contains: q } },
        ],
      } : {}),
    };
    const [total, items] = await Promise.all([
      prisma.order.count({ where }),
      prisma.order.findMany({
        where,
        include: { items: true },
        orderBy: { createdAt: 'desc' },
        skip: (Number(page) - 1) * Number(pageSize),
        take: Number(pageSize),
      }),
    ]);
    res.json({
      data: {
        items: items.map((o) => serializeOrder(o, true)),
        meta: { page: Number(page), pageSize: Number(pageSize), total, totalPages: Math.ceil(total / Number(pageSize)) },
      },
    });
  } catch (err) { next(err); }
});

adminOrdersRouter.get('/:id', async (req, res, next) => {
  try {
    const order = await prisma.order.findUnique({ where: { id: req.params.id }, include: { items: true } });
    if (!order) throw ApiError.notFound('Pesanan tidak ditemukan.');
    res.json({ data: serializeOrder(order, true) });
  } catch (err) { next(err); }
});

adminOrdersRouter.patch('/:id/status', async (req, res, next) => {
  try {
    const { status, adminNote } = req.body;
    if (!VALID_STATUSES.includes(status)) throw ApiError.badRequest('Status tidak valid.');
    const order = await prisma.order.findUnique({ where: { id: req.params.id } });
    if (!order) throw ApiError.notFound('Pesanan tidak ditemukan.');
    if (!TRANSITIONS[order.status].includes(status)) throw ApiError.badRequest(`Tidak bisa ubah dari ${order.status} ke ${status}.`);
    const updated = await prisma.order.update({
      where: { id: req.params.id },
      data: { status, adminNote: adminNote?.trim() || order.adminNote },
      include: { items: true },
    });
    res.json({ data: serializeOrder(updated, true) });
  } catch (err) { next(err); }
});

adminOrdersRouter.patch('/:id/costs', async (req, res, next) => {
  try {
    const { items } = req.body;
    if (!Array.isArray(items)) throw ApiError.badRequest('items harus array.');
    await Promise.all(items.map((i) =>
      prisma.orderItem.update({ where: { id: i.itemId }, data: { costPrice: i.costPrice ?? null } })
    ));
    const order = await prisma.order.findUnique({ where: { id: req.params.id }, include: { items: true } });
    res.json({ data: serializeOrder(order, true) });
  } catch (err) { next(err); }
});
