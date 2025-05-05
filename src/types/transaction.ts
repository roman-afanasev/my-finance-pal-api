export interface Transaction {
  id?: number;
  amount: number;
  description: string;
  category: string;
  date: Date | string;
  createdAt?: Date;
}
