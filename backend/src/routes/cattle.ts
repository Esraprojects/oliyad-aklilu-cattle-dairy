import { Router, Response } from 'express';
import prisma from '../utils/prisma';
import { authenticate, AuthRequest } from '../middleware/auth';

const router = Router();
router.use(authenticate);

router.get('/', async (_req: AuthRequest, res: Response) => {
  const cattle = await prisma.cattle.findMany({
    orderBy: { createdAt: 'desc' },
    include: { weightRecords: { orderBy: { recordedAt: 'desc' }, take: 1 } },
  });
  res.json(cattle);
});

router.get('/stats', async (_req: AuthRequest, res: Response) => {
  const [total, active, dairy, fattening] = await Promise.all([
    prisma.cattle.count(),
    prisma.cattle.count({ where: { status: 'ACTIVE' } }),
    prisma.cattle.count({ where: { category: 'DAIRY', status: 'ACTIVE' } }),
    prisma.cattle.count({ where: { category: 'FATTENING', status: 'ACTIVE' } }),
  ]);
  res.json({ total, active, dairy, fattening });
});

router.get('/:id', async (req: AuthRequest, res: Response) => {
  const cattle = await prisma.cattle.findUnique({
    where: { id: req.params.id },
    include: {
      weightRecords: { orderBy: { recordedAt: 'desc' } },
      healthRecords: { orderBy: { recordedAt: 'desc' } },
      feedingLogs: { include: { feed: true }, orderBy: { fedAt: 'desc' }, take: 20 },
      milkRecords: { orderBy: { recordedAt: 'desc' }, take: 30 },
    },
  });
  if (!cattle) return res.status(404).json({ error: 'Cattle not found' });
  res.json(cattle);
});

router.post('/', async (req: AuthRequest, res: Response) => {
  const data = req.body;
  const cattle = await prisma.cattle.create({ data });
  if (data.currentWeight) {
    await prisma.weightRecord.create({
      data: { cattleId: cattle.id, weight: data.currentWeight, notes: 'Initial weight' },
    });
  }
  res.status(201).json(cattle);
});

router.put('/:id', async (req: AuthRequest, res: Response) => {
  const cattle = await prisma.cattle.update({
    where: { id: req.params.id },
    data: req.body,
  });
  res.json(cattle);
});

router.delete('/:id', async (req: AuthRequest, res: Response) => {
  await prisma.cattle.delete({ where: { id: req.params.id } });
  res.json({ message: 'Cattle deleted' });
});

router.post('/:id/weight', async (req: AuthRequest, res: Response) => {
  const { weight, notes } = req.body;
  const record = await prisma.weightRecord.create({
    data: { cattleId: req.params.id, weight, notes },
  });
  await prisma.cattle.update({ where: { id: req.params.id }, data: { currentWeight: weight } });
  res.status(201).json(record);
});

router.post('/:id/health', async (req: AuthRequest, res: Response) => {
  const record = await prisma.healthRecord.create({
    data: { cattleId: req.params.id, ...req.body },
  });
  res.status(201).json(record);
});

export default router;
