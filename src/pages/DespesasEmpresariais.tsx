
import { useState } from 'react';
import { toast } from 'sonner';
import { PlusCircle } from 'lucide-react';
import DashboardLayout from '@/components/DashboardLayout';
import { useApp } from '@/contexts/AppContext';
import { BusinessExpenseForm, BusinessExpense } from '@/components/business/BusinessExpenseForm';
import { BusinessExpensesList } from '@/components/business/BusinessExpensesList';
import { useBusinessExpenses } from '@/hooks/use-business-expenses';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useIsMobile } from '@/hooks/use-mobile';

const DespesasEmpresariais = () => {
  const { user } = useApp();
  const { addExpense, editExpense, isLoading } = useBusinessExpenses();
  const [isFormDialogOpen, setIsFormDialogOpen] = useState(false);
  const isMobile = useIsMobile();
  
  const handleExpenseSubmit = async (data: BusinessExpense) => {
    try {
      if (data.id) {
        // Edit existing expense
        await editExpense(data);
      } else {
        // Add new expense
        await addExpense(data);
      }
      
      // Close the form dialog after submitting
      setIsFormDialogOpen(false);
      
    } catch (error) {
      console.error('Error submitting expense:', error);
      toast.error('Erro ao salvar despesa');
    }
  };
  
  if (!user?.isAdmin) {
    return (
      <DashboardLayout>
        <div className="container mx-auto px-4 py-8">
          <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded">
            <p className="text-yellow-700">
              Esta funcionalidade está disponível apenas para administradores.
            </p>
          </div>
        </div>
      </DashboardLayout>
    );
  }
  
  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="container mx-auto px-4">
          <h1 className="text-3xl font-bold mb-6">Despesas Empresariais</h1>
          <div className="flex items-center justify-center h-64">
            <div className="animate-pulse text-lg text-gray-500">Carregando dados...</div>
          </div>
        </div>
      </DashboardLayout>
    );
  }
  
  // Using a centered dialog instead of side sheet or bottom drawer
  const FormDialog = (
    <Dialog open={isFormDialogOpen} onOpenChange={setIsFormDialogOpen}>
      <DialogTrigger asChild>
        <Button 
          className="gap-2" 
          onClick={() => setIsFormDialogOpen(true)}
        >
          <PlusCircle className="h-5 w-5" />
          Nova Despesa
        </Button>
      </DialogTrigger>
      <DialogContent className={`${isMobile ? 'w-[95%]' : 'w-[650px]'} max-w-[90vw] p-0`}>
        <DialogHeader className="border-b px-6 py-4">
          <DialogTitle className="text-xl font-semibold">Nova Despesa Empresarial</DialogTitle>
        </DialogHeader>
        <div className={`${isMobile ? 'px-4 py-4' : 'px-6 py-6'} overflow-y-auto max-h-[70vh]`}>
          <BusinessExpenseForm onSubmit={handleExpenseSubmit} />
        </div>
      </DialogContent>
    </Dialog>
  );
  
  return (
    <DashboardLayout>
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold">Despesas Empresariais</h1>
            <p className="text-gray-500 mt-1">Gestão de despesas empresariais</p>
          </div>
          <div>
            {FormDialog}
          </div>
        </div>
        
        <div className="border-t pt-6 mt-6">
          <h2 className="text-xl font-semibold mb-4">Lista de Despesas</h2>
          <BusinessExpensesList />
        </div>
      </div>
    </DashboardLayout>
  );
};

export default DespesasEmpresariais;
