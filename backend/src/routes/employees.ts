import { Router, Response } from 'express';
import prisma from '../utils/prisma';
import { authenticate, AuthRequest } from '../middleware/auth';

const router = Router();
router.use(authenticate);

router.get('/', async (_req, res: Response) => {
  const employees = await prisma.employee.findMany({
    include: { user: { select: { email: true, role: true } } },
    orderBy: { name: 'asc' },
  });
  res.json(employees);
});

router.post('/', async (req: AuthRequest, res: Response) => {
  const employee = await prisma.employee.create({ data: req.body });
  res.status(201).json(employee);
});

router.put('/:id', async (req: AuthRequest, res: Response) => {
  const employee = await prisma.employee.update({ where: { id: req.params.id }, data: req.body });
  res.json(employee);
});

router.delete('/:id', async (req: AuthRequest, res: Response) => {
  await prisma.employee.update({ where: { id: req.params.id }, data: { isActive: false } });
  res.json({ message: 'Employee deactivated' });
});

router.get('/:id/payroll', async (req: AuthRequest, res: Response) => {
  const payrolls = await prisma.payroll.findMany({
    where: { employeeId: req.params.id },
    orderBy: [{ year: 'desc' }, { month: 'desc' }],
  });
  res.json(payrolls);
});

router.post('/:id/payroll', async (req: AuthRequest, res: Response) => {
  const { month, year, bonus = 0, deductions = 0, notes } = req.body;
  const employee = await prisma.employee.findUnique({ where: { id: req.params.id } });
  if (!employee) return res.status(404).json({ error: 'Employee not found' });

  const netSalary = employee.salary + bonus - deductions;
  const payroll = await prisma.payroll.create({
    data: { employeeId: req.params.id, month, year, baseSalary: employee.salary, bonus, deductions, netSalary, notes },
  });
  res.status(201).json(payroll);
});

router.put('/payroll/:payrollId/pay', async (req: AuthRequest, res: Response) => {
  const payroll = await prisma.payroll.update({
    where: { id: req.params.payrollId },
    data: { isPaid: true, paidAt: new Date() },
  });
  res.json(payroll);
});

export default router;
