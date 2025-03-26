
import React, { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { supabase } from '@/integrations/supabase/client';
import DashboardLayout from '@/components/DashboardLayout';
import { useApp } from '@/contexts/AppContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { formatCurrency } from '@/utils/currency';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Loader2, AlertCircle, CheckCircle2, Clock, XCircle, FileDown } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from '@/components/ui/button';

interface Charge {
  id: string;
  unit: string;
  month: string;
  year: string;
  amount: string;
  status: 'pending' | 'paid' | 'overdue';
  due_date: string;
  payment_date: string | null;
}

const statusColors = {
  pending: {
    background: 'bg-yellow-100',
    text: 'text-yellow-800',
    border: 'border-yellow-200',
    icon: <Clock className="h-4 w-4 mr-1" />,
    label: 'Pendente'
  },
  paid: {
    background: 'bg-green-100',
    text: 'text-green-800',
    border: 'border-green-200',
    icon: <CheckCircle2 className="h-4 w-4 mr-1" />,
    label: 'Pago'
  },
  overdue: {
    background: 'bg-red-100',
    text: 'text-red-800',
    border: 'border-red-200',
    icon: <XCircle className="h-4 w-4 mr-1" />,
    label: 'Atrasado'
  }
};

function formatMonthYear(month: string, year: string) {
  const monthNames = [
    'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
    'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
  ];
  
  const monthIndex = parseInt(month) - 1;
  return `${monthNames[monthIndex]} de ${year}`;
}

function formatDate(dateString: string | null) {
  if (!dateString) return "-";
  const date = new Date(dateString);
  return format(date, 'dd/MM/yyyy', { locale: ptBR });
}

// Generate charges for all months of the current year
function generateMonthlyCharges(existingCharges: Charge[]): Charge[] {
  const currentYear = new Date().getFullYear().toString();
  const months = Array.from({ length: 12 }, (_, i) => (i + 1).toString().padStart(2, '0'));
  
  // Create a map of existing charges by month
  const existingChargesByMonth: Record<string, Charge> = {};
  
  existingCharges.forEach(charge => {
    if (charge.year === currentYear) {
      existingChargesByMonth[charge.month] = charge;
    }
  });
  
  // Generate pending charges for months that don't have one
  return months.map(month => {
    if (existingChargesByMonth[month]) {
      return existingChargesByMonth[month];
    } else {
      return {
        id: `pending-${month}-${currentYear}`,
        unit: existingCharges.length > 0 ? existingCharges[0].unit : 'N/A',
        month: month,
        year: currentYear,
        amount: existingCharges.length > 0 ? existingCharges[0].amount : '0',
        status: 'pending' as const, // Use 'as const' to ensure it's a literal type
        due_date: `${currentYear}-${month}-10`, // Assuming due date is the 10th of each month
        payment_date: null
      };
    }
  }).sort((a, b) => {
    // Sort by month (descending)
    return parseInt(b.month) - parseInt(a.month);
  });
}

const MinhasCobrancas = () => {
  const { user } = useApp();
  const [activeTab, setActiveTab] = useState<string>('pending');
  
  const residentId = user?.residentId;
  const matricula = user?.matricula;
  
  const { data: charges, isLoading, error } = useQuery({
    queryKey: ['resident-charges', residentId, matricula],
    queryFn: async () => {
      if (!residentId || !matricula) return [];

      const { data, error } = await supabase
        .from('resident_charges')
        .select('*')
        .eq('resident_id', residentId)
        .eq('matricula', matricula)
        .order('due_date', { ascending: false });
        
      if (error) {
        console.error('Error fetching charges:', error);
        throw new Error('Erro ao buscar cobranças');
      }
      
      const today = new Date();
      return (data || []).map((charge) => {
        const dueDate = new Date(charge.due_date);
        
        // Ensure status is one of the valid union types
        let status: 'pending' | 'paid' | 'overdue';
        if (charge.status === 'paid') {
          status = 'paid';
        } else if (charge.status === 'pending' && dueDate < today) {
          status = 'overdue';
        } else {
          status = 'pending';
        }
        
        return {
          ...charge,
          status
        } as Charge; // Type assertion to Charge
      });
    },
    enabled: !!residentId && !!matricula
  });
  
  const filteredCharges = useMemo(() => {
    if (!charges) return [];
    
    if (activeTab === 'pending') {
      // For pending tab, show all months of current year
      return generateMonthlyCharges(charges);
    } else if (activeTab === 'paid') {
      // For paid tab, show only paid charges (taxa de condominio)
      return charges.filter(charge => charge.status === 'paid');
    }
    
    return [];
  }, [charges, activeTab]);

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Minhas Cobranças</h1>
          <p className="text-muted-foreground">
            Acompanhe suas cobranças de condomínio
          </p>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle>Histórico de Cobranças</CardTitle>
            <CardDescription>
              Visualize e gerencie suas cobranças de condomínio
            </CardDescription>
            <Tabs value={activeTab} onValueChange={setActiveTab} className="mt-4">
              <TabsList>
                <TabsTrigger value="pending">Pendentes</TabsTrigger>
                <TabsTrigger value="paid">Pagas</TabsTrigger>
              </TabsList>
            </Tabs>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="h-8 w-8 animate-spin text-brand-600" />
                <span className="ml-2 text-lg text-muted-foreground">Carregando cobranças...</span>
              </div>
            ) : error ? (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Erro</AlertTitle>
                <AlertDescription>
                  Ocorreu um erro ao carregar as cobranças. Por favor, tente novamente mais tarde.
                </AlertDescription>
              </Alert>
            ) : filteredCharges.length === 0 ? (
              <Alert className="bg-blue-50 border-blue-200">
                <AlertCircle className="h-4 w-4 text-blue-600" />
                <AlertTitle>Nenhuma cobrança encontrada</AlertTitle>
                <AlertDescription>
                  Não existem cobranças {activeTab !== 'pending' && `com status "${statusColors[activeTab as keyof typeof statusColors].label}"`} registradas para este condomínio.
                </AlertDescription>
              </Alert>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Competência</TableHead>
                      <TableHead>Unidade</TableHead>
                      <TableHead>Valor</TableHead>
                      <TableHead>Vencimento</TableHead>
                      <TableHead>Pagamento</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredCharges.map((charge) => (
                      <TableRow key={charge.id}>
                        <TableCell className="font-medium">
                          {formatMonthYear(charge.month, charge.year)}
                        </TableCell>
                        <TableCell>{charge.unit}</TableCell>
                        <TableCell>{formatCurrency(parseFloat(charge.amount))}</TableCell>
                        <TableCell>{formatDate(charge.due_date)}</TableCell>
                        <TableCell>{formatDate(charge.payment_date)}</TableCell>
                        <TableCell>
                          <Badge 
                            className={`flex items-center ${statusColors[charge.status].background} ${statusColors[charge.status].text} ${statusColors[charge.status].border} border`}
                            variant="outline"
                          >
                            {statusColors[charge.status].icon}
                            {statusColors[charge.status].label}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          {charge.status !== 'paid' && (
                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-brand-600 hover:text-brand-800 hover:bg-brand-50"
                            >
                              <FileDown className="h-4 w-4 mr-1" />
                              Boleto
                            </Button>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default MinhasCobrancas;
