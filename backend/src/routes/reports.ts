import { Router, Response } from 'express';
import prisma from '../utils/prisma';
import { authenticate, AuthRequest } from '../middleware/auth';

const router = Router();
router.use(authenticate);

router.get('/milk', async (req: AuthRequest, res: Response) => {
  const { from, to } = req.query;
  const where: Record<string, unknown> = {};
  if (from || to) {
    where.recordedAt = {};
    if (from) (where.recordedAt as Record<string, unknown>).gte = new Date(from as string);
    if (to) (where.recordedAt as Record<string, unknown>).lte = new Date(to as string);
  }
  const records = await prisma.milkRecord.findMany({
    where,
    include: { cattle: { select: { tagNumber: true, name: true, breed: true } } },
    orderBy: { recordedAt: 'asc' },
  });
  const total = records.reduce((s, r) => s + r.liters, 0);
  res.json({ records, total, count: records.length });
});

router.get('/feeding-cost', async (req: AuthRequest, res: Response) => {
  const { from, to } = req.query;
  const where: Record<string, unknown> = {};
  if (from || to) {
    where.fedAt = {};
    if (from) (where.fedAt as Record<string, unknown>).gte = new Date(from as string);
    if (to) (where.fedAt as Record<string, unknown>).lte = new Date(to as string);
  }
  const [summary, byFeed] = await Promise.all([
    prisma.feedingLog.aggregate({ where, _sum: { cost: true, quantity: true }, _count: true }),
    prisma.feedingLog.groupBy({ by: ['feedId'], where, _sum: { cost: true, quantity: true } }),
  ]);
  const feeds = await prisma.feed.findMany({ where: { id: { in: byFeed.map(b => b.feedId) } } });
  const byFeedDetailed = byFeed.map(b => ({
    ...b,
    feed: feeds.find(f => f.id === b.feedId),
  }));
  res.json({ summary, byFeed: byFeedDetailed });
});

router.get('/sales', async (req: AuthRequest, res: Response) => {
  const { from, to } = req.query;
  const where: Record<string, unknown> = {};
  if (from || to) {
    where.saleDate = {};
    if (from) (where.saleDate as Record<string, unknown>).gte = new Date(from as string);
    if (to) (where.saleDate as Record<string, unknown>).lte = new Date(to as string);
  }
  const [sales, byType] = await Promise.all([
    prisma.sale.findMany({ where, include: { customer: true }, orderBy: { saleDate: 'desc' } }),
    prisma.sale.groupBy({ by: ['type'], where, _sum: { totalAmount: true }, _count: true }),
  ]);
  const total = sales.reduce((s, r) => s + r.totalAmount, 0);
  res.json({ sales, byType, total });
});

router.get('/weight-gain', async (_req: AuthRequest, res: Response) => {
  const cattle = await prisma.cattle.findMany({
    where: { status: 'ACTIVE' },
    include: { weightRecords: { orderBy: { recordedAt: 'asc' } } },
    orderBy: { tagNumber: 'asc' },
  });
  const data = cattle.map(c => ({
    id: c.id,
    tagNumber: c.tagNumber,
    name: c.name,
    breed: c.breed,
    initialWeight: c.initialWeight,
    currentWeight: c.currentWeight,
    gain: c.currentWeight - c.initialWeight,
    gainPercent: (((c.currentWeight - c.initialWeight) / c.initialWeight) * 100).toFixed(1),
    weightRecords: c.weightRecords,
  }));
  res.json(data);
});

export default router;
