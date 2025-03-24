import React from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Users, FileText, MapPin } from 'lucide-react';
import { useApp } from '@/contexts/AppContext';
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Separator } from '@/components/ui/separator';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

interface LocationStats {
  states: [string, number][];
  cities: Record<string, [string, number][]>;
  neighborhoods: [string, number][];
}

interface DashboardStats {
  activeManagers: number;
  invoicePreference: number;
  locationStats: LocationStats;
}

interface NewsItem {
  id: string;
  title: string;
  short_description: string;
  full_content: string;
  is_active: boolean;
  created_at: string;
}

const Dashboard = () => {
  const { user } = useApp();
  const [selectedState, setSelectedState] = useState<string | null>(null);
  const [isStateDetailOpen, setIsStateDetailOpen] = useState(false);
  const [latestNews, setLatestNews] = useState<NewsItem | null>(null);
  const [newsDialogOpen, setNewsDialogOpen] = useState(false);
  
  const [stats, setStats] = useState<DashboardStats>({
    activeManagers: 0,
    invoicePreference: 0,
    locationStats: {
      states: [],
      cities: {},
      neighborhoods: []
    }
  });
  
  useEffect(() => {
    fetchDashboardData();
    if (!user?.isAdmin) {
      fetchLatestNews();
    }
  }, [user?.isAdmin]);
  
  const fetchLatestNews = async () => {
    try {
      const { data, error } = await supabase
        .from('news_items')
        .select('*')
        .eq('is_active', true)
        .order('created_at', { ascending: false })
        .limit(1)
        .single();
      
      if (error && error.code !== 'PGRST116') {
        console.error('Error fetching latest news:', error);
        return;
      }
      
      if (data) {
        setLatestNews(data);
      }
    } catch (error) {
      console.error('Error in fetchLatestNews:', error);
    }
  };

  async function fetchDashboardData() {
    try {
      const { count: activeCount, error: activeError } = await supabase
        .from('condominiums')
        .select('*', { count: 'exact', head: true })
        .eq('ativo', true);
      
      if (activeError) throw activeError;
      
      const { count: invoiceCount, error: invoiceError } = await supabase
        .from('condominiums')
        .select('*', { count: 'exact', head: true })
        .eq('tipodocumento', 'notaFiscal');
      
      if (invoiceError) throw invoiceError;
      
      const { data: locationData, error: locationError } = await supabase
        .from('condominiums')
        .select('estado, cidade, bairro');
      
      if (locationError) throw locationError;
      
      const stateCount: Record<string, number> = {};
      const cityByState: Record<string, Record<string, number>> = {};
      const neighborhoodCount: Record<string, number> = {};
      
      locationData.forEach(item => {
        if (item.estado) {
          stateCount[item.estado] = (stateCount[item.estado] || 0) + 1;
          
          if (item.cidade) {
            if (!cityByState[item.estado]) {
              cityByState[item.estado] = {};
            }
            cityByState[item.estado][item.cidade] = (cityByState[item.estado][item.cidade] || 0) + 1;
          }
        }
        
        if (item.cidade) {
        }
        
        if (item.bairro) {
          neighborhoodCount[item.bairro] = (neighborhoodCount[item.bairro] || 0) + 1;
        }
      });
      
      const topStates = Object.entries(stateCount)
        .sort((a, b) => b[1] - a[1]);
          
      const citiesByState: Record<string, [string, number][]> = {};
      Object.entries(cityByState).forEach(([state, cities]) => {
        citiesByState[state] = Object.entries(cities).sort((a, b) => b[1] - a[1]);
      });
      
      const topNeighborhoods = Object.entries(neighborhoodCount)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5);
      
      setStats({
        activeManagers: activeCount || 0,
        invoicePreference: invoiceCount || 0,
        locationStats: {
          states: topStates,
          cities: citiesByState,
          neighborhoods: topNeighborhoods
        }
      });
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    }
  }

  const handleStateClick = (state: string) => {
    setSelectedState(state);
    setIsStateDetailOpen(true);
  };

  const getGreeting = () => {
    if (user?.isAdmin) {
      return (
        <>
          <h1 className="text-3xl font-bold tracking-tight">Olá, {user.nome}</h1>
          <p className="text-muted-foreground">Aqui está seu Dashboard Gerencial.</p>
        </>
      );
    } else {
      return (
        <>
          <h1 className="text-3xl font-bold tracking-tight">
            Olá {user?.nome || 'Representante'}
          </h1>
          <p className="text-muted-foreground">
            Você está gerenciando o {user?.nomeCondominio || 'Condomínio'}
          </p>
        </>
      );
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR', { 
      day: '2-digit', 
      month: '2-digit', 
      year: 'numeric' 
    });
  };

  const renderAdminDashboard = () => (
    <>
      <section className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card className="card-hover border-t-4 border-t-brand-600 shadow-md">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Gestores Ativos</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.activeManagers}</div>
            <p className="text-xs text-muted-foreground">
              Gestores com status ativo no sistema
            </p>
          </CardContent>
        </Card>
        
        <Card className="card-hover border-t-4 border-t-brand-600 shadow-md">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Preferência por Nota Fiscal</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.invoicePreference}</div>
            <p className="text-xs text-muted-foreground">
              Gestores que optam por nota fiscal
            </p>
          </CardContent>
        </Card>
        
        <Card className="card-hover border-t-4 border-t-brand-600 shadow-md">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Distribuição Geográfica</CardTitle>
            <MapPin className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="mt-2">
              <h4 className="text-sm font-medium text-muted-foreground">Por Estado</h4>
              <ul className="text-sm mt-1">
                {stats.locationStats.states.map(([state, count]) => (
                  <li 
                    key={state} 
                    className="flex justify-between items-center py-1 px-2 hover:bg-gray-100 rounded cursor-pointer"
                    onClick={() => handleStateClick(state)}
                  >
                    <span>{state}</span>
                    <span className="font-medium">{count}</span>
                  </li>
                ))}
              </ul>
            </div>
          </CardContent>
        </Card>
      </section>
    </>
  );

  const renderManagerDashboard = () => (
    <section className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {latestNews && (
        <Card 
          className="card-hover border-t-4 border-t-brand-600 shadow-md cursor-pointer"
          onClick={() => setNewsDialogOpen(true)}
        >
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">{latestNews.title}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">{latestNews.short_description}</p>
            <div className="mt-2 text-xs text-gray-500">
              Publicado em: {formatDate(latestNews.created_at)}
            </div>
          </CardContent>
        </Card>
      )}
      
      <Card className="card-hover border-t-4 border-t-brand-600 shadow-md">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium">Bem-vindo ao seu Dashboard</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Este é o seu painel de controle onde você pode gerenciar seu condomínio.
          </p>
        </CardContent>
      </Card>
    </section>
  );

  return (
    <DashboardLayout>
      <div className="flex flex-col space-y-6 pb-6 animate-fade-in">
        <header className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center rounded-lg bg-blue-100 px-3 py-1 text-sm font-medium text-blue-800 mb-2">
              <span className="mr-2">👋</span>
              <span>Bem-vindo de volta</span>
            </div>
            {getGreeting()}
          </div>
        </header>

        <Separator className="mb-6" />

        {user?.isAdmin ? renderAdminDashboard() : renderManagerDashboard()}
      </div>

      <Sheet open={isStateDetailOpen} onOpenChange={setIsStateDetailOpen}>
        <SheetContent>
          <SheetHeader>
            <SheetTitle>Cidades em {selectedState}</SheetTitle>
          </SheetHeader>
          <div className="mt-6">
            {selectedState && stats.locationStats.cities[selectedState] ? (
              <ul className="space-y-2">
                {stats.locationStats.cities[selectedState].map(([city, count]) => (
                  <li key={city} className="flex justify-between items-center py-2 border-b">
                    <span>{city}</span>
                    <span className="font-medium">{count}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-muted-foreground">Sem dados de cidades para este estado.</p>
            )}
          </div>
        </SheetContent>
      </Sheet>

      {latestNews && (
        <Dialog open={newsDialogOpen} onOpenChange={setNewsDialogOpen}>
          <DialogContent className="sm:max-w-[525px]">
            <DialogHeader>
              <DialogTitle>{latestNews.title}</DialogTitle>
            </DialogHeader>
            <div className="mt-4 space-y-4">
              <p className="text-muted-foreground">
                {latestNews.full_content}
              </p>
              <div className="text-sm text-gray-500">
                Publicado em: {formatDate(latestNews.created_at)}
              </div>
            </div>
            <div className="mt-4 flex justify-end">
              <Button onClick={() => setNewsDialogOpen(false)}>Fechar</Button>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </DashboardLayout>
  );
};

export default Dashboard;
