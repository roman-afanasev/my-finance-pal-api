import express, { Request, Response, NextFunction } from 'express';
import transactionRoutes from './routes/transactions';

const app = express();

// Middleware
app.use(express.json());

// Routes
app.use('/api/transactions', transactionRoutes);

// Error handling
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
