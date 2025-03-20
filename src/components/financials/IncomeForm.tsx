
import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useApp } from '@/contexts/AppContext';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { supabase } from '@/integrations/supabase/client';
import { FinancialIncome } from '@/hooks/use-finances';
import { formatCurrencyInput } from '@/utils/currency';

const incomeCategories = [
  { value: 'taxa_condominio', label: 'Taxa de Condomínio' },
  { value: 'reserva_area_comum', label: 'Reserva Área Comum' },
  { value: 'taxa_extra', label: 'Taxa Extra' },
  { value: 'outros', label: 'Outros' }
];

const incomeSchema = z.object({
  category: z.string().min(1, { message: 'Categoria é obrigatória' }),
  amount: z.string().min(1, { message: 'Valor é obrigatório' }),
  reference_month: z.string().min(1, { message: 'Mês de referência é obrigatório' }),
  payment_date: z.string().optional(),
  unit: z.string().optional(),
  observations: z.string().optional()
});

interface IncomeFormProps {
  onSubmit: (data: FinancialIncome) => Promise<void>;
  initialData?: FinancialIncome;
}

export const IncomeForm = ({ onSubmit, initialData }: IncomeFormProps) => {
  const { user } = useApp();
  const [units, setUnits] = useState<{ value: string; label: string; }[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const form = useForm<z.infer<typeof incomeSchema>>({
    resolver: zodResolver(incomeSchema),
    defaultValues: initialData || {
      category: '',
      amount: '',
      reference_month: new Date().toISOString().substring(0, 7), // YYYY-MM format
      payment_date: new Date().toISOString().substring(0, 10), // YYYY-MM-DD format
      unit: '',
      observations: ''
    }
  });

  // Fetch units for the current condominium
  useEffect(() => {
    const fetchUnits = async () => {
      if (!user?.selectedCondominium) return;
      
      try {
        const { data, error } = await supabase
          .from('residents')
          .select('unidade')
          .eq('matricula', user.selectedCondominium)
          .order('unidade');
        
        if (error) throw error;
        
        const uniqueUnits = [...new Set(data.map(item => item.unidade))];
        setUnits(uniqueUnits.map(unit => ({ value: unit, label: unit })));
      } catch (error) {
        console.error('Error fetching units:', error);
      }
    };
    
    fetchUnits();
  }, [user?.selectedCondominium]);
  
  const handleSubmit = async (values: z.infer<typeof incomeSchema>) => {
    if (!user?.selectedCondominium) return;
    
    setIsSubmitting(true);
    try {
      // Create a valid FinancialIncome object with all required fields
      await onSubmit({
        ...values,
        matricula: user.selectedCondominium,
        category: values.category, // Explicitly include required fields
        amount: values.amount, 
        reference_month: values.reference_month,
        id: initialData?.id
      });
      
      if (!initialData) {
        form.reset({
          category: '',
          amount: '',
          reference_month: new Date().toISOString().substring(0, 7),
          payment_date: new Date().toISOString().substring(0, 10),
          unit: '',
          observations: ''
        });
      }
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>{initialData ? 'Editar Receita' : 'Nova Receita'}</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="category"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Categoria*</FormLabel>
                  <Select 
                    onValueChange={field.onChange} 
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione uma categoria" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {incomeCategories.map(category => (
                        <SelectItem key={category.value} value={category.value}>
                          {category.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="amount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Valor*</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="0,00"
                      isCurrency
                      onChange={(e) => {
                        const formattedValue = formatCurrencyInput(e.target.value.replace(/\D/g, ''));
                        field.onChange(formattedValue);
                      }}
                      value={field.value ? `R$ ${field.value}` : ''}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="reference_month"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Mês de Referência*</FormLabel>
                    <FormControl>
                      <Input
                        type="month"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="payment_date"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Data de Pagamento</FormLabel>
                    <FormControl>
                      <Input
                        type="date"
                        {...field}
                        value={field.value || ''}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <FormField
              control={form.control}
              name="unit"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Unidade</FormLabel>
                  <Select 
                    onValueChange={field.onChange} 
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione uma unidade" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {units.map(unit => (
                        <SelectItem key={unit.value} value={unit.value}>
                          {unit.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="observations"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Observações</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Observações sobre esta receita"
                      {...field}
                      value={field.value || ''}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <div className="flex justify-end pt-4">
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? 'Salvando...' : initialData ? 'Atualizar' : 'Adicionar'}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};
