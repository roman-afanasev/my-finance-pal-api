import { Router, Request, Response, NextFunction } from 'express';
import prisma from '../config/db';
import { Transaction } from '../types/transaction';

const router = Router();

// POST: Create a new transaction
router.post('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { amount, description, category, date } = req.body as Transaction;

    if (!amount || !description || !category || !date) {
      return res.status(400).json({ error: 'All fields are required' });
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

// GET: Get all transactions
router.get('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const transactions = await prisma.transaction.findMany({
      orderBy: {
        date: 'desc',
      },
    });
    res.json(transactions);
  } catch (error) {
    next(error);
  }
});

export default router;
