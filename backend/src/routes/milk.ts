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
    where.recordedAt = {};
    if (from) (where.recordedAt as Record<string, unknown>).gte = new Date(from as string);
    if (to) (where.recordedAt as Record<string, unknown>).lte = new Date(to as string);
  }
  const records = await prisma.milkRecord.findMany({
    where,
    include: { cattle: { select: { tagNumber: true, name: true } }, user: { select: { name: true } } },
    orderBy: { recordedAt: 'desc' },
    take: 200,
  });
  res.json(records);
});

router.post('/', async (req: AuthRequest, res: Response) => {
  const record = await prisma.milkRecord.create({
    data: { ...req.body, recordedBy: req.user!.id },
    include: { cattle: { select: { tagNumber: true, name: true } } },
  });
  res.status(201).json(record);
});

router.get('/summary', async (_req: AuthRequest, res: Response) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const monthStart = new Date(today.getFullYear(), today.getMonth(), 1);

  const [todayTotal, monthTotal, dailyBySession] = await Promise.all([
    prisma.milkRecord.aggregate({ where: { recordedAt: { gte: today } }, _sum: { liters: true } }),
    prisma.milkRecord.aggregate({ where: { recordedAt: { gte: monthStart } }, _sum: { liters: true } }),
    prisma.milkRecord.groupBy({
      by: ['session'],
      where: { recordedAt: { gte: today } },
      _sum: { liters: true },
    }),
  ]);
  res.json({ todayTotal: todayTotal._sum.liters || 0, monthTotal: monthTotal._sum.liters || 0, bySession: dailyBySession });
});

export default router;
