import { Router, Request, Response, NextFunction } from 'express';
import prisma from '../config/db';
import { Transaction } from '../types/transaction';

const router = Router();

// POST: Create a new transaction
router.post('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { amount, description, category, date } = req.body as Transaction;

    if (!amount || !description || !category || !date) {
      return res.status(400).json({ error: 'Все поля обязательны' });
    }

    const transaction = await prisma.transaction.create({
      data: {
        amount,
        description,
        category,
        date: new Date(date),
      },
    });

    res.status(201).json(transaction);
  } catch (error) {
    next(error);
  }
});

// GET: Get all transactions with optional filtering and pagination
router.get('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { page = 1, limit = 10, category, minAmount, maxAmount } = req.query;
    const skip = (Number(page) - 1) * Number(limit);

    const where = {
      ...(category && { category: String(category) }),
      ...(minAmount && { amount: { gte: Number(minAmount) } }),
      ...(maxAmount && { amount: { lte: Number(maxAmount) } }),
    };

    const transactions = await prisma.transaction.findMany({
      where,
      skip,
      take: Number(limit),
      orderBy: {
        date: 'desc',
      },
    });

    const total = await prisma.transaction.count({ where });
    res.json({
      data: transactions,
      total,
      page: Number(page),
      limit: Number(limit),
    });
  } catch (error) {
    next(error);
  }
});

// PUT: Update an existing transaction
router.put('/:id', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const { amount, description, category, date } = req.body as Transaction;

    if (!id || (!amount && !description && !category && !date)) {
      return res.status(400).json({ error: 'ID и хотя бы одно поле для обновления обязательны' });
    }

    const transaction = await prisma.transaction.update({
      where: { id: Number(id) },
      data: {
        ...(amount && { amount }),
        ...(description && { description }),
        ...(category && { category }),
        ...(date && { date: new Date(date) }),
      },
    });

    res.json(transaction);
  } catch (error) {
    if ((error as any).code === 'P2025') {
      return res.status(404).json({ error: 'Транзакция не найдена' });
    }
    next(error);
  }
});

// DELETE: Delete a transaction
router.delete('/:id', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ error: 'ID обязателен' });
    }

    await prisma.transaction.delete({
      where: { id: Number(id) },
    });

    res.status(204).send();
  } catch (error) {
    if ((error as any).code === 'P2025') {
      return res.status(404).json({ error: 'Транзакция не найдена' });
    }
    next(error);
  }
});

export default router;
