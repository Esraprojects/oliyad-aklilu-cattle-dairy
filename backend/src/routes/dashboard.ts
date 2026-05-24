import { Router, Response } from 'express';
import prisma from '../utils/prisma';
import { authenticate, AuthRequest } from '../middleware/auth';

const router = Router();
router.use(authenticate);

router.get('/stats', async (_req: AuthRequest, res: Response) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const monthStart = new Date(today.getFullYear(), today.getMonth(), 1);

  const [
    totalCattle, activeCattle, dairyCattle, fatteningCattle,
    todayMilk, monthMilk, monthRevenue, totalRevenue,
    totalEmployees, pendingSales, lowStockFeeds,
  ] = await Promise.all([
    prisma.cattle.count(),
    prisma.cattle.count({ where: { status: 'ACTIVE' } }),
    prisma.cattle.count({ where: { category: 'DAIRY', status: 'ACTIVE' } }),
    prisma.cattle.count({ where: { category: 'FATTENING', status: 'ACTIVE' } }),
    prisma.milkRecord.aggregate({ where: { recordedAt: { gte: today } }, _sum: { liters: true } }),
    prisma.milkRecord.aggregate({ where: { recordedAt: { gte: monthStart } }, _sum: { liters: true } }),
    prisma.sale.aggregate({ where: { saleDate: { gte: monthStart } }, _sum: { totalAmount: true } }),
    prisma.sale.aggregate({ _sum: { totalAmount: true } }),
    prisma.employee.count({ where: { isActive: true } }),
    prisma.sale.count({ where: { status: 'PENDING' } }),
    prisma.feed.count({ where: { stockQty: { lte: prisma.feed.fields.minStock } } }),
  ]);

  res.json({
    cattle: { total: totalCattle, active: activeCattle, dairy: dairyCattle, fattening: fatteningCattle },
    milk: { today: todayMilk._sum.liters || 0, month: monthMilk._sum.liters || 0 },
    revenue: { month: monthRevenue._sum.totalAmount || 0, total: totalRevenue._sum.totalAmount || 0 },
    employees: totalEmployees,
    pendingSales,
    lowStockFeeds,
  });
});

router.get('/recent-activity', async (_req: AuthRequest, res: Response) => {
  const [recentSales, recentMilk, recentHealth] = await Promise.all([
    prisma.sale.findMany({ take: 5, orderBy: { createdAt: 'desc' }, include: { customer: true } }),
    prisma.milkRecord.findMany({ take: 5, orderBy: { recordedAt: 'desc' }, include: { cattle: { select: { tagNumber: true } } } }),
    prisma.healthRecord.findMany({ take: 5, orderBy: { recordedAt: 'desc' }, include: { cattle: { select: { tagNumber: true } } } }),
  ]);
  res.json({ recentSales, recentMilk, recentHealth });
});

router.get('/milk-trend', async (_req: AuthRequest, res: Response) => {
  const days = 30;
  const from = new Date();
  from.setDate(from.getDate() - days);

  const records = await prisma.milkRecord.findMany({
    where: { recordedAt: { gte: from } },
    select: { recordedAt: true, liters: true },
    orderBy: { recordedAt: 'asc' },
  });

  const dailyMap: Record<string, number> = {};
  records.forEach(r => {
    const key = r.recordedAt.toISOString().split('T')[0];
    dailyMap[key] = (dailyMap[key] || 0) + r.liters;
  });

  const trend = Object.entries(dailyMap).map(([date, liters]) => ({ date, liters }));
  res.json(trend);
});

export default router;
