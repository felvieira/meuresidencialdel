
import React, { useState, useEffect } from 'react';
import { useApp } from '@/contexts/AppContext';
import DashboardLayout from '@/components/DashboardLayout';
import { supabase } from '@/integrations/supabase/client';
import { Card } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { PasswordChangeSection } from '@/components/minha-assinatura/PasswordChangeSection';
import { toast } from 'sonner';
import { ProfileCondominiumInfo } from '@/components/profile/ProfileCondominiumInfo';
import { ProfileRepresentativeInfo } from '@/components/profile/ProfileRepresentativeInfo';
import { AlertCircle, UserCog } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';

const UserProfile = () => {
  const { user, isAuthenticated } = useApp();
  const [isLoading, setIsLoading] = useState(false);
  const [condominiumData, setCondominiumData] = useState<any>(null);
  const isMobile = useIsMobile();
  
  const fetchCondominiumData = async (matricula: string) => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('condominiums')
        .select('*')
        .eq('matricula', matricula)
        .single();
        
      if (error) {
        throw error;
      }
      
      setCondominiumData(data);
    } catch (error) {
      console.error('Error fetching condominium data:', error);
      toast.error('Erro ao carregar dados do condomínio');
    } finally {
      setIsLoading(false);
    }
  };
  
  useEffect(() => {
    if (user?.matricula) {
      fetchCondominiumData(user.matricula);
    }
  }, [user]);

  // Show restricted access message for residents
  if (isAuthenticated && user?.isResident) {
    return (
      <DashboardLayout>
        <div className="container mx-auto py-6">
          <h1 className="text-2xl font-bold mb-6">Meu Perfil</h1>
          <Card className="p-6 border-l-4 border-l-amber-500 border-t-4 border-t-brand-600">
            <div className="flex items-start gap-4">
              <AlertCircle className="h-6 w-6 text-amber-500 flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-medium text-lg mb-2">Acesso Restrito</h3>
                <p className="text-gray-600">
                  Esta página não está disponível para o perfil de Morador. 
                  Caso precise atualizar suas informações de perfil, 
                  por favor entre em contato com o administrador do seu condomínio.
                </p>
              </div>
            </div>
          </Card>
        </div>
      </DashboardLayout>
    );
  }

  if (!isAuthenticated || !user) {
    return (
      <DashboardLayout>
        <div className="container mx-auto py-6">
          <h1 className="text-2xl font-bold mb-6">Meu Perfil</h1>
          <p>Esta página está disponível apenas para usuários autenticados.</p>
        </div>
      </DashboardLayout>
    );
  }
  
  return (
    <DashboardLayout>
      <div className="container mx-auto py-6">
        <div className="flex items-center gap-3 mb-6">
          <UserCog className="h-7 w-7 text-brand-600" />
          <h1 className="text-2xl font-bold">Meu Perfil</h1>
        </div>
        
        {isLoading ? (
          <Card className="p-6 mb-6 border-t-4 border-t-brand-600">
            <div className="animate-pulse">
              <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
            </div>
          </Card>
        ) : condominiumData ? (
          <div className="grid grid-cols-1 gap-6">
            <ProfileCondominiumInfo condominiumData={condominiumData} />
            <ProfileRepresentativeInfo condominiumData={condominiumData} />
            <PasswordChangeSection userMatricula={user.matricula} />
          </div>
        ) : (
          <Card className="p-6 mb-6 border-t-4 border-t-brand-600">
            <p>Nenhuma informação disponível</p>
          </Card>
        )}
      </div>
    </DashboardLayout>
  );
};

export default UserProfile;
