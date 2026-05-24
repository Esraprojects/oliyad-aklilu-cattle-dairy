import { Router, Response } from 'express';
import prisma from '../utils/prisma';
import { authenticate, AuthRequest } from '../middleware/auth';

const router = Router();
router.use(authenticate);

router.get('/', async (_req, res: Response) => {
  const feeds = await prisma.feed.findMany({ orderBy: { name: 'asc' } });
  res.json(feeds);
});

router.post('/', async (req: AuthRequest, res: Response) => {
  const feed = await prisma.feed.create({ data: req.body });
  res.status(201).json(feed);
});

router.put('/:id', async (req: AuthRequest, res: Response) => {
  const feed = await prisma.feed.update({ where: { id: req.params.id }, data: req.body });
  res.json(feed);
});

router.put('/:id/stock', async (req: AuthRequest, res: Response) => {
  const { quantity, operation } = req.body;
  const feed = await prisma.feed.findUnique({ where: { id: req.params.id } });
  if (!feed) return res.status(404).json({ error: 'Feed not found' });
  const newQty = operation === 'add' ? feed.stockQty + quantity : Math.max(0, feed.stockQty - quantity);
  const updated = await prisma.feed.update({ where: { id: req.params.id }, data: { stockQty: newQty } });
  res.json(updated);
});

router.delete('/:id', async (req: AuthRequest, res: Response) => {
  await prisma.feed.delete({ where: { id: req.params.id } });
  res.json({ message: 'Feed deleted' });
});

export default router;
