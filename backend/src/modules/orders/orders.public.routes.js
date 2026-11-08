import { Router } from 'express';
import prisma from '../../lib/prisma.js';
import { serializeOrder } from '../../lib/serializers.js';
import { ApiError } from '../../lib/errors.js';

export const ordersPublicRouter = Router();

function generateOrderCode() {
  const ts = Date.now().toString(36).toUpperCase();
  const rand = Math.random().toString(36).slice(2, 6).toUpperCase();
  return `PS-${ts}-${rand}`;
}

ordersPublicRouter.post('/', async (req, res, next) => {
  try {
    const { customerName, customerWhatsapp, note, items } = req.body;
    if (!customerName?.trim()) throw ApiError.badRequest('Nama pelanggan wajib diisi.');
    if (!customerWhatsapp?.trim()) throw ApiError.badRequest('Nomor WhatsApp wajib diisi.');
    if (!Array.isArray(items) || items.length === 0) throw ApiError.badRequest('Minimal 1 item pesanan.');

    const optionIds = items.map((i) => i.optionId);
    const options = await prisma.productOption.findMany({ where: { id: { in: optionIds } }, include: { product: true } });

    let totalAmount = 0;
    const orderItems = items.map((item) => {
      const option = options.find((o) => o.id === item.optionId);
      if (!option) throw ApiError.badRequest(`Varian tidak ditemukan: ${item.optionId}`);
      if (!option.isActive || !option.product.isActive) throw ApiError.badRequest(`Varian ${option.name} tidak tersedia.`);
      const qty = Math.max(1, Math.min(20, Number(item.quantity) || 1));
      const subtotal = option.price * qty;
      totalAmount += subtotal;
      return {
        productName: option.product.name,
        optionName: option.name,
        unitPrice: option.price,
        quantity: qty,
        productOptionId: option.id,
      };
    });

    const order = await prisma.order.create({
      data: {
        orderCode: generateOrderCode(),
        customerName: customerName.trim(),
        customerWhatsapp: customerWhatsapp.trim(),
        note: note?.trim() || null,
        totalAmount,
        items: { create: orderItems },
      },
      include: { items: true },
    });

    res.status(201).json({ data: serializeOrder(order) });
  } catch (err) { next(err); }
});

ordersPublicRouter.get('/:orderCode', async (req, res, next) => {
  try {
    const { whatsapp } = req.query;
    const order = await prisma.order.findFirst({
      where: { orderCode: req.params.orderCode, ...(whatsapp ? { customerWhatsapp: whatsapp } : {}) },
      include: { items: true },
    });
    if (!order) throw ApiError.notFound('Pesanan tidak ditemukan.');
    res.json({ data: serializeOrder(order) });
  } catch (err) { next(err); }
});
