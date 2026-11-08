import { Router } from 'express';
import prisma from '../../lib/prisma.js';
import { requireAdmin } from '../../middleware/auth.js';

export const dashboardRouter = Router();
dashboardRouter.use(requireAdmin);

dashboardRouter.get('/', async (req, res, next) => {
  try {
    const now = new Date();
    const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    const [ordersToday, pendingOrders, completedThisMonth, recentOrders] = await Promise.all([
      prisma.order.count({ where: { createdAt: { gte: startOfDay } } }),
      prisma.order.count({ where: { status: 'PENDING' } }),
      prisma.order.findMany({
        where: { status: 'COMPLETED', updatedAt: { gte: startOfMonth } },
        include: { items: true },
      }),
      prisma.order.findMany({
        orderBy: { createdAt: 'desc' },
        take: 5,
        include: { items: true },
      }),
    ]);

    const revenueThisMonth = completedThisMonth.reduce((s, o) => s + o.totalAmount, 0);
    const costThisMonth = completedThisMonth.reduce((s, o) =>
      s + o.items.reduce((si, i) => si + (i.costPrice != null ? i.costPrice * i.quantity : 0), 0), 0);
    const profitThisMonth = completedThisMonth.reduce((s, o) =>
      s + o.items.reduce((si, i) => si + (i.costPrice != null ? (i.unitPrice - i.costPrice) * i.quantity : 0), 0), 0);
    const itemsMissingCost = completedThisMonth.reduce((s, o) =>
      s + o.items.filter((i) => i.costPrice == null).length, 0);

    res.json({
      data: {
        ordersToday,
        pendingOrders,
        revenueThisMonth,
        costThisMonth,
        profitThisMonth,
        itemsMissingCost,
        recentOrders: recentOrders.map((o) => ({
          id: o.id,
          orderCode: o.orderCode,
          customerName: o.customerName,
          totalAmount: o.totalAmount,
          status: o.status,
          createdAt: o.createdAt,
        })),
      },
    });
  } catch (err) { next(err); }
});
