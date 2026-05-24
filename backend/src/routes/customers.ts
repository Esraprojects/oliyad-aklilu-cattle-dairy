import { Router, Response } from 'express';
import prisma from '../utils/prisma';
import { authenticate, AuthRequest } from '../middleware/auth';

const router = Router();
router.use(authenticate);

router.get('/', async (_req, res: Response) => {
  const customers = await prisma.customer.findMany({ orderBy: { name: 'asc' } });
  res.json(customers);
});

router.post('/', async (req: AuthRequest, res: Response) => {
  const customer = await prisma.customer.create({ data: req.body });
  res.status(201).json(customer);
});

router.put('/:id', async (req: AuthRequest, res: Response) => {
  const customer = await prisma.customer.update({ where: { id: req.params.id }, data: req.body });
  res.json(customer);
});

export default router;
