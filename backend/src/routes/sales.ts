import { Router, Response } from 'express';
import prisma from '../utils/prisma';
import { authenticate, AuthRequest } from '../middleware/auth';

const router = Router();
router.use(authenticate);

router.get('/', async (_req: AuthRequest, res: Response) => {
  const sales = await prisma.sale.findMany({
    include: { customer: true, items: true, user: { select: { name: true } } },
    orderBy: { saleDate: 'desc' },
  });
  res.json(sales);
});

router.get('/:id', async (req: AuthRequest, res: Response) => {
  const sale = await prisma.sale.findUnique({
    where: { id: req.params.id },
    include: { customer: true, items: { include: { cattle: { select: { tagNumber: true, name: true, breed: true } } } }, user: { select: { name: true } } },
  });
  if (!sale) return res.status(404).json({ error: 'Sale not found' });
  res.json(sale);
});

router.post('/', async (req: AuthRequest, res: Response) => {
  const { customerId, type, items, dueDate, notes } = req.body;
  const totalAmount = items.reduce((sum: number, i: { totalPrice: number }) => sum + i.totalPrice, 0);
  const count = await prisma.sale.count();
  const invoiceNumber = `INV-${String(count + 1).padStart(5, '0')}`;

  const sale = await prisma.sale.create({
    data: {
      invoiceNumber,
      customerId,
      type,
      totalAmount,
      soldBy: req.user!.id,
      dueDate: dueDate ? new Date(dueDate) : undefined,
      notes,
      items: { create: items },
    },
    include: { customer: true, items: true },
  });

  if (type === 'CATTLE') {
    for (const item of items) {
      if (item.cattleId) {
        await prisma.cattle.update({ where: { id: item.cattleId }, data: { status: 'SOLD' } });
      }
    }
  }

  res.status(201).json(sale);
});

router.put('/:id/payment', async (req: AuthRequest, res: Response) => {
  const { paidAmount } = req.body;
  const sale = await prisma.sale.findUnique({ where: { id: req.params.id } });
  if (!sale) return res.status(404).json({ error: 'Sale not found' });

  const newPaid = sale.paidAmount + paidAmount;
  const status = newPaid >= sale.totalAmount ? 'PAID' : newPaid > 0 ? 'PARTIAL' : 'PENDING';
  const updated = await prisma.sale.update({
    where: { id: req.params.id },
    data: { paidAmount: newPaid, status },
  });
  res.json(updated);
});

router.get('/summary/stats', async (_req: AuthRequest, res: Response) => {
  const monthStart = new Date();
  monthStart.setDate(1); monthStart.setHours(0, 0, 0, 0);
  const [total, month, pending] = await Promise.all([
    prisma.sale.aggregate({ _sum: { totalAmount: true } }),
    prisma.sale.aggregate({ where: { saleDate: { gte: monthStart } }, _sum: { totalAmount: true } }),
    prisma.sale.count({ where: { status: 'PENDING' } }),
  ]);
  res.json({ totalRevenue: total._sum.totalAmount || 0, monthRevenue: month._sum.totalAmount || 0, pendingCount: pending });
});

export default router;
