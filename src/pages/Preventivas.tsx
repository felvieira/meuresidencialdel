import React, { useState, useEffect } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import { useApp } from '@/contexts/AppContext';
import { supabase } from '@/integrations/supabase/client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { format, parseISO } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { CalendarIcon, Check, Wrench, PlusCircle, Trash2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface MaintenanceItem {
  id: string;
  category: string;
  title: string;
  description: string | null;
  scheduled_date: string;
  completed: boolean;
  created_at: string;
  updated_at: string;
}

const MAINTENANCE_CATEGORIES = [
  'Inspeção Estrutural',
  'Sistema Hidráulico',
  'Elevadores',
  'Controle de Pragas',
  'Ar Condicionado',
  'Sistemas de Gás',
  'Portões',
  'Prevenção de Incêndios',
  'Sistemas de Segurança',
  'Fachadas'
].sort();

export default function Preventivas() {
  const { user } = useApp();
  const queryClient = useQueryClient();
  const [newItem, setNewItem] = useState({
    category: '',
    title: '',
    description: '',
    scheduled_date: new Date(),
  });
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  
  const matriculaFromUser = user?.matricula || '';
  
  const [userMatricula, setUserMatricula] = useState<string | null>(
    matriculaFromUser || localStorage.getItem('userMatricula')
  );

  useEffect(() => {
    if (matriculaFromUser) {
      localStorage.setItem('userMatricula', matriculaFromUser);
      setUserMatricula(matriculaFromUser);
      return;
    }
    
    const loadUserMatricula = async () => {
      try {
        const storedMatricula = localStorage.getItem('userMatricula');
        if (storedMatricula) {
          setUserMatricula(storedMatricula);
          return;
        }
        
        const { data, error } = await supabase.rpc('get_user_matricula');
        if (!error && data) {
          localStorage.setItem('userMatricula', data);
          setUserMatricula(data);
        } else if (error) {
          console.error('Error getting user matricula from RPC:', error);
          toast.error('Não foi possível carregar sua matrícula. Tente recarregar a página.');
        }
      } catch (err) {
        console.error('Error loading user matricula:', err);
      }
    };

    loadUserMatricula();
  }, [matriculaFromUser]);

  const { data: maintenanceItems = [], isLoading, error, refetch } = useQuery({
    queryKey: ['preventiveMaintenanceItems'],
    queryFn: async () => {
      try {
        const { data, error } = await supabase.rpc('get_preventive_maintenance');
        
        if (error) {
          throw error;
        }
        
        return data as MaintenanceItem[];
      } catch (error) {
        console.error('Error fetching maintenance items:', error);
        throw error;
      }
    },
  });

  const addMutation = useMutation({
    mutationFn: async (item: typeof newItem) => {
      try {
        if (!userMatricula) {
          throw new Error('Matrícula do usuário não encontrada');
        }

        const { data, error } = await supabase.rpc('add_preventive_maintenance', {
          p_category: item.category,
          p_title: item.title,
          p_description: item.description || null,
          p_scheduled_date: format(item.scheduled_date, 'yyyy-MM-dd')
        });

        if (error) {
          throw error;
        }

        return data;
      } catch (error) {
        console.error('Error adding maintenance item:', error);
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['preventiveMaintenanceItems'] });
      toast.success('Item de manutenção preventiva adicionado com sucesso.');
      setIsDialogOpen(false);
      resetForm();
    },
    onError: (error: any) => {
      toast.error(`Erro ao adicionar item: ${error.message || 'Erro desconhecido'}`);
    }
  });

  const toggleStatusMutation = useMutation({
    mutationFn: async (id: string) => {
      try {
        const { data, error } = await supabase.rpc('toggle_preventive_maintenance_status', {
          p_id: id
        });

        if (error) {
          throw error;
        }

        return data;
      } catch (error) {
        console.error('Error toggling maintenance status:', error);
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['preventiveMaintenanceItems'] });
      toast.success('Status atualizado com sucesso.');
    },
    onError: (error: any) => {
      toast.error(`Erro ao atualizar status: ${error.message || 'Erro desconhecido'}`);
    }
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      try {
        const { data, error } = await supabase.rpc('delete_preventive_maintenance', {
          p_id: id
        });

        if (error) {
          throw error;
        }

        return data;
      } catch (error) {
        console.error('Error deleting maintenance item:', error);
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['preventiveMaintenanceItems'] });
      toast.success('Item de manutenção excluído com sucesso.');
    },
    onError: (error: any) => {
      toast.error(`Erro ao excluir item: ${error.message || 'Erro desconhecido'}`);
    }
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setNewItem(prev => ({ ...prev, [name]: value }));
  };

  const handleCategoryChange = (value: string) => {
    setNewItem(prev => ({ ...prev, category: value }));
  };

  const handleDateChange = (date: Date | undefined) => {
    if (date) {
      setNewItem(prev => ({ ...prev, scheduled_date: date }));
    }
  };

  const handleAddItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newItem.category || !newItem.title || !newItem.scheduled_date) {
      toast.error('Por favor, preencha todos os campos obrigatórios.');
      return;
    }
    
    if (!userMatricula) {
      toast.error('Matrícula do usuário não encontrada. Tente recarregar a página.');
      return;
    }
    
    addMutation.mutate(newItem);
  };

  const handleToggleStatus = (id: string) => {
    toggleStatusMutation.mutate(id);
  };

  const handleDeleteItem = (id: string) => {
    if (window.confirm('Tem certeza que deseja excluir este item de manutenção preventiva?')) {
      deleteMutation.mutate(id);
    }
  };

  const resetForm = () => {
    setNewItem({
      category: '',
      title: '',
      description: '',
      scheduled_date: new Date(),
    });
  };

  const itemsByCategory = maintenanceItems.reduce((acc, item) => {
    const category = item.category;
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(item);
    return acc;
  }, {} as Record<string, MaintenanceItem[]>);

  const categoriesWithPendingItems = Object.keys(itemsByCategory).filter(category => 
    itemsByCategory[category].some(item => !item.completed)
  ).sort();

  const categoriesWithCompletedItems = Object.keys(itemsByCategory).filter(category => 
    itemsByCategory[category].every(item => item.completed) && itemsByCategory[category].length > 0
  ).sort();

  const hasAnyItems = maintenanceItems.length > 0;

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">Manutenções Preventivas</h2>
            <p className="text-muted-foreground">
              Gerencie suas manutenções preventivas agendadas.
            </p>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <PlusCircle className="mr-2 h-4 w-4" />
                Adicionar Nova
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Adicionar Nova Manutenção Preventiva</DialogTitle>
                <DialogDescription>
                  Preencha os detalhes da nova manutenção preventiva a ser agendada.
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleAddItem} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="category">Categoria *</Label>
                  <Select value={newItem.category} onValueChange={handleCategoryChange} required>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione uma categoria" />
                    </SelectTrigger>
                    <SelectContent>
                      {MAINTENANCE_CATEGORIES.map((category) => (
                        <SelectItem key={category} value={category}>
                          {category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="title">Título *</Label>
                  <Input 
                    id="title" 
                    name="title" 
                    value={newItem.title} 
                    onChange={handleInputChange} 
                    placeholder="Ex: Vistoria de extintores"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">Descrição</Label>
                  <Textarea 
                    id="description" 
                    name="description" 
                    value={newItem.description} 
                    onChange={handleInputChange}
                    placeholder="Detalhes sobre a manutenção"
                    rows={3}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="scheduled_date">Data Agendada *</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !newItem.scheduled_date && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {newItem.scheduled_date ? format(newItem.scheduled_date, "PPP", { locale: ptBR }) : <span>Escolha uma data</span>}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={newItem.scheduled_date}
                        onSelect={handleDateChange}
                        disabled={(date) =>
                          date < new Date(new Date().setHours(0, 0, 0, 0))
                        }
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>
                <DialogFooter>
                  <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                    Cancelar
                  </Button>
                  <Button type="submit" disabled={addMutation.isPending}>
                    {addMutation.isPending ? "Salvando..." : "Salvar"}
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {isLoading && (
          <div className="flex justify-center p-8">
            <div className="animate-pulse">Carregando...</div>
          </div>
        )}

        {error && (
          <Card className="border-destructive bg-destructive/10">
            <CardHeader>
              <CardTitle className="text-destructive">Erro ao carregar dados</CardTitle>
            </CardHeader>
            <CardContent>
              <p>Ocorreu um erro ao carregar as manutenções preventivas. Por favor, tente novamente mais tarde.</p>
              <Button 
                variant="outline" 
                className="mt-4" 
                onClick={() => refetch()}
              >
                Tentar novamente
              </Button>
            </CardContent>
          </Card>
        )}

        {!isLoading && !error && !hasAnyItems && (
          <Card>
            <CardContent className="flex flex-col items-center justify-center p-8 text-center">
              <Wrench className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-xl font-medium">Nenhuma manutenção preventiva cadastrada</h3>
              <p className="text-muted-foreground mt-2">
                Adicione sua primeira manutenção preventiva clicando no botão acima.
              </p>
            </CardContent>
          </Card>
        )}

        {!isLoading && hasAnyItems && (
          <>
            {categoriesWithPendingItems.length > 0 && (
              <div className="space-y-6">
                <h3 className="text-xl font-semibold">Manutenções Pendentes</h3>
                {categoriesWithPendingItems.map(category => (
                  <div key={category} className="space-y-4">
                    <h4 className="text-lg font-medium">{category}</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {itemsByCategory[category]
                        .filter(item => !item.completed)
                        .sort((a, b) => new Date(a.scheduled_date).getTime() - new Date(b.scheduled_date).getTime())
                        .map(item => (
                          <Card key={item.id}>
                            <CardHeader className="pb-2">
                              <div className="flex justify-between items-center">
                                <CardTitle className="text-lg">{item.title}</CardTitle>
                                <Badge variant={new Date(item.scheduled_date) < new Date() ? "destructive" : "secondary"}>
                                  {new Date(item.scheduled_date) < new Date() ? "Atrasado" : "Agendado"}
                                </Badge>
                              </div>
                              <CardDescription>
                                <div className="flex items-center gap-1 mt-1">
                                  <CalendarIcon className="h-4 w-4 text-muted-foreground" />
                                  <span>{format(new Date(item.scheduled_date), 'dd/MM/yyyy')}</span>
                                </div>
                              </CardDescription>
                            </CardHeader>
                            <CardContent>
                              {item.description && <p className="text-sm text-muted-foreground">{item.description}</p>}
                            </CardContent>
                            <CardFooter className="flex justify-between pt-2">
                              <Button 
                                variant="outline" 
                                size="sm" 
                                onClick={() => handleToggleStatus(item.id)}
                                disabled={toggleStatusMutation.isPending}
                              >
                                <Check className="h-4 w-4 mr-1" />
                                Concluir
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="text-destructive hover:text-destructive"
                                onClick={() => handleDeleteItem(item.id)}
                                disabled={deleteMutation.isPending}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </CardFooter>
                          </Card>
                        ))}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {categoriesWithCompletedItems.length > 0 && (
              <div className="space-y-6 mt-8">
                <h3 className="text-xl font-semibold">Manutenções Concluídas</h3>
                {categoriesWithCompletedItems.map(category => (
                  <div key={category} className="space-y-4">
                    <h4 className="text-lg font-medium">{category}</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {itemsByCategory[category]
                        .filter(item => item.completed)
                        .sort((a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime())
                        .map(item => (
                          <Card key={item.id} className="border-muted bg-muted/30">
                            <CardHeader className="pb-2">
                              <div className="flex justify-between items-center">
                                <CardTitle className="text-lg">{item.title}</CardTitle>
                                <Badge variant="outline" className="bg-green-100 text-green-800">
                                  Concluído
                                </Badge>
                              </div>
                              <CardDescription>
                                <div className="flex items-center gap-1 mt-1">
                                  <CalendarIcon className="h-4 w-4 text-muted-foreground" />
                                  <span>{format(new Date(item.scheduled_date), 'dd/MM/yyyy')}</span>
                                </div>
                              </CardDescription>
                            </CardHeader>
                            <CardContent>
                              {item.description && <p className="text-sm text-muted-foreground">{item.description}</p>}
                            </CardContent>
                            <CardFooter className="flex justify-between pt-2">
                              <Button 
                                variant="outline" 
                                size="sm" 
                                onClick={() => handleToggleStatus(item.id)}
                                disabled={toggleStatusMutation.isPending}
                              >
                                Reabrir
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="text-destructive hover:text-destructive"
                                onClick={() => handleDeleteItem(item.id)}
                                disabled={deleteMutation.isPending}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </CardFooter>
                          </Card>
                        ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </DashboardLayout>
  );
}
