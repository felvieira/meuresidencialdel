import React from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { ChartContainer } from '@/components/ui/chart';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useBusinessExpenses } from '@/hooks/use-business-expenses';
import { useBusinessContracts } from '@/hooks/use-business-contracts';
import { format, subMonths, startOfMonth, differenceInCalendarMonths } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { formatToBRL } from '@/utils/currency';
import { BarChart3, DollarSign, PieChartIcon, FileText } from 'lucide-react';
import { Separator } from '@/components/ui/separator';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d', '#ffc658', '#8dd1e1'];

const CATEGORY_DISPLAY_NAMES: Record<string, string> = {
  'aluguel': 'Aluguel',
  'servicos-contabeis': 'Serviços Contábeis',
  'folha-pagamento': 'Folha de Pagamento',
  'impostos': 'Impostos',
  'marketing': 'Marketing',
  'tecnologia': 'Tecnologia',
  'materiais': 'Materiais',
  'servicos-terceirizados': 'Serviços Terceirizados',
  'despesas-administrativas': 'Despesas Administrativas',
  'outros': 'Outros'
};

const BusinessManagement: React.FC = () => {
  const { expenses } = useBusinessExpenses();
  const { contracts } = useBusinessContracts();

  const totalExpenses = expenses.reduce((sum, expense) => sum + expense.amount, 0);

  const activeContracts = contracts ? contracts.filter(contract => contract.status === 'active').length : 0;

  const getLast12MonthsData = () => {
    const today = new Date();
    const monthlyData = [];
    
    for (let i = 11; i >= 0; i--) {
      const monthDate = subMonths(today, i);
      const monthStr = format(monthDate, 'MMM/yy', { locale: ptBR });
      
      const monthlyExpenses = expenses.filter(expense => {
        const expenseDate = new Date(expense.date);
        const expenseMonth = startOfMonth(expenseDate);
        const currentMonth = startOfMonth(monthDate);
        return differenceInCalendarMonths(expenseMonth, currentMonth) === 0;
      });
      
      const total = monthlyExpenses.reduce((sum, expense) => sum + expense.amount, 0);
      
      monthlyData.push({
        month: monthStr,
        total: total
      });
    }
    
    return monthlyData;
  };

  const getCategoryData = () => {
    const categoryTotals: Record<string, number> = {};
    
    expenses.forEach(expense => {
      if (!categoryTotals[expense.category]) {
        categoryTotals[expense.category] = 0;
      }
      categoryTotals[expense.category] += expense.amount;
    });
    
    return Object.entries(categoryTotals).map(([name, value]) => ({
      name,
      displayName: CATEGORY_DISPLAY_NAMES[name] || name,
      value
    }));
  };

  const monthlyData = getLast12MonthsData();
  const categoryData = getCategoryData();

  const formatTooltipValue = (value: number) => {
    return formatToBRL(value);
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold tracking-tight">Business Management</h1>
        </div>
        
        <div className="prose dark:prose-invert max-w-none">
          <p className="text-muted-foreground">
            Painel de controle financeiro para gestão das despesas empresariais. Acompanhe os gastos por categoria e a evolução mensal.
          </p>
        </div>
        
        <Separator className="my-4" />
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="md:col-span-1">
            <CardHeader className="pb-2">
              <div className="flex items-center">
                <DollarSign className="h-5 w-5 mr-2 text-blue-500" />
                <CardTitle>Resumo Financeiro</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="border-r pr-6">
                  <div className="flex flex-col items-center">
                    <p className="text-sm text-gray-500 mb-1">Despesa Total</p>
                    <p className="text-xl font-bold text-blue-600">
                      {formatToBRL(totalExpenses)}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      {expenses.length} registros
                    </p>
                  </div>
                </div>
                <div className="pl-6">
                  <div className="flex flex-col items-center">
                    <p className="text-sm text-gray-500 mb-1">Contratos Ativos</p>
                    <p className="text-xl font-bold text-green-600">
                      {activeContracts}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      de {contracts ? contracts.length : 0} total
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="md:col-span-1">
            <CardHeader>
              <div className="flex items-center">
                <PieChartIcon className="h-5 w-5 mr-2 text-blue-500" />
                <CardTitle>Despesas por Categoria</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <div className="h-60">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={categoryData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                      nameKey="name"
                      label={({ displayName, percent }) => 
                        `${displayName}: ${(percent * 100).toFixed(0)}%`
                      }
                    >
                      {categoryData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip 
                      formatter={(value: number) => formatToBRL(value)}
                      labelFormatter={(name) => {
                        const item = categoryData.find(c => c.name === name);
                        return item?.displayName || name;
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mt-4">
                {categoryData.map((category, index) => (
                  <div key={category.name} className="flex items-center text-xs">
                    <div 
                      className="w-3 h-3 mr-1 rounded-sm" 
                      style={{ backgroundColor: COLORS[index % COLORS.length] }}
                    />
                    <span className="truncate">{category.displayName}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
          
          <Card className="md:col-span-2">
            <CardHeader className="pb-2">
              <div className="flex items-center">
                <BarChart3 className="h-5 w-5 mr-2 text-blue-500" />
                <CardTitle>Evolução de Despesas (Últimos 12 Meses)</CardTitle>
              </div>
              <CardDescription>
                Acompanhe a evolução mensal das despesas empresariais
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={monthlyData}
                    margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis tickFormatter={formatTooltipValue} />
                    <Tooltip 
                      formatter={(value: number) => [formatToBRL(value), 'Total']} 
                      labelFormatter={(label) => `Mês: ${label}`}
                    />
                    <Legend />
                    <Bar 
                      dataKey="total" 
                      name="Despesas" 
                      fill="#6366f1" 
                      radius={[4, 4, 0, 0]} 
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default BusinessManagement;
