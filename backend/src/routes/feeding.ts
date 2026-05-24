import { Router, Response } from 'express';
import prisma from '../utils/prisma';
import { authenticate, AuthRequest } from '../middleware/auth';

const router = Router();
router.use(authenticate);

router.get('/', async (req: AuthRequest, res: Response) => {
  const { cattleId, from, to } = req.query;
  const where: Record<string, unknown> = {};
  if (cattleId) where.cattleId = cattleId as string;
  if (from || to) {
    where.fedAt = {};
    if (from) (where.fedAt as Record<string, unknown>).gte = new Date(from as string);
    if (to) (where.fedAt as Record<string, unknown>).lte = new Date(to as string);
  }
  const logs = await prisma.feedingLog.findMany({
    where,
    include: { cattle: { select: { tagNumber: true, name: true } }, feed: true, user: { select: { name: true } } },
    orderBy: { fedAt: 'desc' },
    take: 100,
  });
  res.json(logs);
});

router.post('/', async (req: AuthRequest, res: Response) => {
  const { cattleId, feedId, quantity, notes, fedAt } = req.body;
  const feed = await prisma.feed.findUnique({ where: { id: feedId } });
  if (!feed) return res.status(404).json({ error: 'Feed not found' });

  const cost = feed.costPerUnit * quantity;
  const log = await prisma.feedingLog.create({
    data: { cattleId, feedId, quantity, cost, notes, recordedBy: req.user!.id, fedAt: fedAt ? new Date(fedAt) : undefined },
    include: { cattle: { select: { tagNumber: true, name: true } }, feed: true },
  });

  await prisma.feed.update({ where: { id: feedId }, data: { stockQty: { decrement: quantity } } });
  res.status(201).json(log);
});

router.get('/summary', async (_req: AuthRequest, res: Response) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const [todayLogs, monthLogs] = await Promise.all([
    prisma.feedingLog.aggregate({ where: { fedAt: { gte: today } }, _sum: { cost: true, quantity: true }, _count: true }),
    prisma.feedingLog.aggregate({
      where: { fedAt: { gte: new Date(today.getFullYear(), today.getMonth(), 1) } },
      _sum: { cost: true },
    }),
  ]);
  res.json({ today: todayLogs, month: monthLogs });
});

export default router;
