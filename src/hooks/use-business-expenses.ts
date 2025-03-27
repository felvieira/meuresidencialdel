
import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { 
  getBusinessExpenses, 
  saveBusinessExpense, 
  updateBusinessExpense,
  deleteBusinessExpense 
} from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface BusinessExpense {
  id: string;
  description: string;
  amount: number;
  date: string;
  category: string;
  payment_method: string;
  status: string;
  created_at?: string;
  updated_at?: string;
}

export const useBusinessExpenses = () => {
  const queryClient = useQueryClient();
  const [isLoading, setIsLoading] = useState(false);

  // Query to fetch all business expenses
  const { data: expensesData = [], isLoading: isLoadingExpenses, error } = useQuery({
    queryKey: ['business-expenses'],
    queryFn: getBusinessExpenses,
  });

  // Safely typecast expenses data and filter out any potential error objects
  const expenses = Array.isArray(expensesData) 
    ? expensesData
        .filter(item => {
          // Check if item is valid and has required properties
          return item !== null && 
                 typeof item === 'object' && 
                 !('error' in item) && 
                 'id' in item && 
                 'description' in item;
        })
        .map(item => {
          // Use type assertion after verification
          const validItem = item as any;
          return {
            id: validItem.id,
            description: validItem.description,
            amount: validItem.amount,
            date: validItem.date,
            category: validItem.category,
            payment_method: validItem.payment_method,
            status: validItem.status,
            created_at: validItem.created_at,
            updated_at: validItem.updated_at
          } as BusinessExpense;
        })
    : [];

  // Mutation to create a new expense
  const createExpenseMutation = useMutation({
    mutationFn: (expense: Omit<BusinessExpense, 'id' | 'created_at' | 'updated_at'>) => {
      setIsLoading(true);
      return saveBusinessExpense(expense);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['business-expenses'] });
      toast.success("Despesa registrada com sucesso");
      setIsLoading(false);
    },
    onError: (error) => {
      console.error("Erro ao registrar despesa:", error);
      toast.error("Erro ao registrar despesa");
      setIsLoading(false);
    }
  });

  // Mutation to update an existing expense
  const updateExpenseMutation = useMutation({
    mutationFn: ({ id, ...data }: { id: string } & Partial<Omit<BusinessExpense, 'id' | 'created_at' | 'updated_at'>>) => {
      setIsLoading(true);
      return updateBusinessExpense(id, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['business-expenses'] });
      toast.success("Despesa atualizada com sucesso");
      setIsLoading(false);
    },
    onError: (error) => {
      console.error("Erro ao atualizar despesa:", error);
      toast.error("Erro ao atualizar despesa");
      setIsLoading(false);
    }
  });

  // Mutation to delete an expense
  const deleteExpenseMutation = useMutation({
    mutationFn: (id: string) => {
      setIsLoading(true);
      return deleteBusinessExpense(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['business-expenses'] });
      toast.success("Despesa excluída com sucesso");
      setIsLoading(false);
    },
    onError: (error) => {
      console.error("Erro ao excluir despesa:", error);
      toast.error("Erro ao excluir despesa");
      setIsLoading(false);
    }
  });

  return {
    expenses,
    isLoading: isLoading || isLoadingExpenses,
    error,
    createExpense: (expense: Omit<BusinessExpense, 'id' | 'created_at' | 'updated_at'>) => createExpenseMutation.mutate(expense),
    updateExpense: (id: string, data: Partial<Omit<BusinessExpense, 'id' | 'created_at' | 'updated_at'>>) => updateExpenseMutation.mutate({ id, ...data }),
    deleteExpense: (id: string) => deleteExpenseMutation.mutate(id)
  };
};
