
import DashboardLayout from '@/components/DashboardLayout';
import { AccountingReport } from '@/components/financials/AccountingReport';
import { Separator } from '@/components/ui/separator';
import { useIsMobile } from '@/hooks/use-mobile';

const FinanceiroPrestacaoContas = () => {
  const isMobile = useIsMobile();
  
  return (
    <DashboardLayout>
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h1 className={`${isMobile ? 'text-xl' : 'text-3xl'} font-bold mb-2`}>Prestação de Contas</h1>
            <Separator className="mb-2" />
            <p className={`text-gray-600 mt-1 ${isMobile ? 'text-sm' : ''}`}>
              Relatório mensal de receitas e despesas do condomínio por data de pagamento
            </p>
          </div>
        </div>
        
        <AccountingReport />
      </div>
    </DashboardLayout>
  );
};

export default FinanceiroPrestacaoContas;
