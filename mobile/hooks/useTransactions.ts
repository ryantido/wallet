import * as React from 'react';
import { Alert } from 'react-native';

const API_URL = process.env.EXPO_PUBLIC_API_URL;

type Transaction = Record<string, any>;

type CreateTransactionInput = {
  user_id: string;
  title: string;
  amount: number;
  category: string;
};

export const useTransactions = (userId: string) => {
  const [transactions, setTransactions] = React.useState<Transaction[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [summary, setSummary] = React.useState({
    balance: 0,
    income: 0,
    expenses: 0,
  });

  const fetchTransactions = React.useCallback(async () => {
    try {
      const response = await fetch(`${API_URL}/${userId}`);
      const data: Transaction[] = await response.json();
      setTransactions(data as Transaction[]);      
    } catch (error) {
      console.error('Error fetching transactions:', error);
    }
  }, [userId]);

  const fetchSummary = React.useCallback(async () => {
    try {
      const response = await fetch(`${API_URL}/summary/${userId}`);
      const { total_income: income, total_expense: expenses } = await response.json();

      const balance = income - expenses;
      setSummary({ balance, income, expenses });
    } catch (error) {
      console.error('Error fetching summary:', error);
    }
  }, [userId]);

  const loadData = React.useCallback(async () => {
    if (!userId) return;
    setLoading(true);
    try {
      await Promise.all([fetchTransactions(), fetchSummary()]);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  }, [fetchSummary, fetchTransactions, userId]);

  const deleteTransaction = async (id: string) => {
    try {
      await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
      await loadData();
      Alert.alert('Success', 'Transaction deleted successfully.');
    } catch (error) {
      console.error('Error deleting transaction:', error);
      Alert.alert(
        'Une erreur est survenue',
        error instanceof Error ? error.message : 'Une erreur est survenue'
      );
    }
  };

  const createTransaction = async ({
    user_id,
    title,
    amount,
    category,
  }: CreateTransactionInput) => {
    try {
      const response = await fetch(`${API_URL}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ user_id, title, amount, category }),
      });
      await response.json();
      await loadData();
      Alert.alert('Success', 'Transaction created successfully.');
    } catch (error) {
      console.error('Error creating transaction:', error);
      Alert.alert(
        'Une erreur est survenue',
        error instanceof Error ? error.message : 'Une erreur est survenue'
      );
    }
  };

  React.useEffect(() => {
    loadData();
  }, [loadData]);


  return {
    transactions,
    summary,
    loading,
    deleteTransaction,
    createTransaction,
    loadData,
  };
};
