import React, { createContext, useContext, useState, useEffect } from 'react';
import { toast } from "sonner";
import { supabase } from '@/integrations/supabase/client';

interface Condominium {
  matricula: string;
  nomeCondominio: string;
}

interface User {
  id: string;
  email: string;
  nome: string;
  role: string;
  matricula: string;
  isAdmin: boolean;
  isManager: boolean;
  isResident: boolean;
  unit?: string;
  telefone?: string;
  nomeCondominio?: string;
  selectedCondominium?: string;
  residentId?: string;
  condominiums?: {
    matricula: string;
    nomeCondominio: string;
  }[];
}

interface AppContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  isAuthenticated: boolean;
  isLoading: boolean;
  switchCondominium: (matricula: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem('condoUser');
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        console.log("Stored user from localStorage:", parsedUser);
        console.log("Is stored user admin?", parsedUser.isAdmin);
        console.log("Is stored user resident?", parsedUser.isResident);
        setUser(parsedUser);
      } catch (e) {
        console.error("Error parsing stored user:", e);
        localStorage.removeItem('condoUser');
      }
    }
    setIsLoading(false);
  }, []);

  const login = async (emailOrMatricula: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    try {
      if (emailOrMatricula.toLowerCase() === 'meuresidencialcom@gmail.com' && password === 'Bigdream@2025') {
        const adminUser = {
          nome: 'IGOR COSTA ALVES',
          email: 'meuresidencialcom@gmail.com',
          isAdmin: true,
          isResident: false
        };
        
        console.log("Admin user created:", adminUser);
        setUser(adminUser);
        localStorage.setItem('condoUser', JSON.stringify(adminUser));
        toast.success("Login realizado com sucesso!");
        return true;
      }
      
      const { data: emailData, error: emailError } = await supabase
        .from('condominiums')
        .select('*')
        .eq('emaillegal', emailOrMatricula.toLowerCase())
        .eq('senha', password)
        .eq('ativo', true);
      
      if (emailError) {
        console.error("Erro ao verificar credenciais por email:", emailError);
      }
      
      const { data: matriculaData, error: matriculaError } = await supabase
        .from('condominiums')
        .select('*')
        .eq('matricula', emailOrMatricula)
        .eq('senha', password)
        .eq('ativo', true);
      
      if (matriculaError) {
        console.error("Erro ao verificar credenciais por matrícula:", matriculaError);
      }
      
      const emailDataArray = emailData || [];
      const matriculaDataArray = matriculaData || [];
      const allCondominiums = [...emailDataArray, ...matriculaDataArray];
      
      const typedCondominiums = allCondominiums as Array<{
        matricula: string;
        nomecondominio: string;
        nomelegal: string;
        emaillegal: string;
        rua?: string;
        numero?: string;
        complemento?: string;
        bairro?: string;
        cidade?: string;
        estado?: string;
        cep?: string;
      }>;
      
      const uniqueCondominiums = Array.from(
        new Map(typedCondominiums.map(item => [item.matricula, item])).values()
      );
      
      if (uniqueCondominiums.length > 0) {
        const condosFormatted = uniqueCondominiums.map(condo => ({
          matricula: condo.matricula,
          nomeCondominio: condo.nomecondominio || 'Condomínio'
        }));
        
        const firstCondo = uniqueCondominiums[0];
        
        const managerUser = {
          nome: firstCondo.nomelegal || firstCondo.matricula,
          email: firstCondo.emaillegal || '',
          isAdmin: false,
          isResident: false,
          matricula: firstCondo.matricula,
          nomeCondominio: firstCondo.nomecondominio || 'Condomínio',
          condominiums: condosFormatted,
          selectedCondominium: firstCondo.matricula,
          rua: firstCondo.rua,
          numero: firstCondo.numero,
          complemento: firstCondo.complemento,
          bairro: firstCondo.bairro,
          cidade: firstCondo.cidade,
          estado: firstCondo.estado,
          cep: firstCondo.cep,
        };
        
        setUser(managerUser);
        localStorage.setItem('condoUser', JSON.stringify(managerUser));
        toast.success("Login realizado com sucesso!");
        return true;
      }
      
      const { data: residents, error: residentError } = await supabase
        .from('residents')
        .select('*')
        .eq('email', emailOrMatricula.toLowerCase())
        .eq('cpf', password);
      
      if (residentError) {
        console.error("Erro ao verificar credenciais de morador:", residentError);
      }
      
      if (residents && residents.length > 0) {
        const resident = residents[0];
        
        const { data: condoData, error: condoError } = await supabase
          .from('condominiums')
          .select('*')
          .eq('matricula', resident.matricula)
          .eq('ativo', true)
          .single();
        
        if (condoError) {
          console.error("Erro ao obter dados do condomínio do morador:", condoError);
          toast.error("Não foi possível obter os dados do condomínio associado a este morador.");
          return false;
        }
        
        if (!condoData) {
          toast.error("Condomínio não encontrado ou inativo.");
          return false;
        }
        
        const residentUser = {
          nome: resident.nome_completo,
          email: resident.email || '',
          isAdmin: false,
          isResident: true,
          residentId: resident.id,
          matricula: resident.matricula,
          unit: resident.unidade,
          nomeCondominio: condoData.nomecondominio || 'Condomínio',
          rua: condoData.rua,
          numero: condoData.numero,
          complemento: condoData.complemento,
          bairro: condoData.bairro,
          cidade: condoData.cidade,
          estado: condoData.estado,
          cep: condoData.cep,
        };
        
        setUser(residentUser);
        localStorage.setItem('condoUser', JSON.stringify(residentUser));
        toast.success("Login de morador realizado com sucesso!");
        
        try {
          if (!resident.user_id) {
            console.log("Resident login successful - future auth integration will be implemented");
          }
        } catch (authError) {
          console.error("Error in resident auth setup:", authError);
        }
        
        return true;
      }
      
      toast.error("Credenciais inválidas ou usuário inativo. Tente novamente.");
      return false;
    } catch (error) {
      console.error("Erro ao realizar login:", error);
      toast.error("Erro ao realizar login. Tente novamente.");
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const switchCondominium = (matricula: string) => {
    if (!user || !user.condominiums) return;
    
    const selectedCondo = user.condominiums.find(c => c.matricula === matricula);
    if (!selectedCondo) return;
    
    supabase.from('condominiums')
      .select('*')
      .eq('matricula', matricula)
      .single()
      .then(({ data, error }) => {
        if (error || !data) {
          console.error("Error fetching condominium details:", error);
          return;
        }
        
        const updatedUser = {
          ...user,
          matricula: selectedCondo.matricula,
          nomeCondominio: selectedCondo.nomeCondominio,
          selectedCondominium: selectedCondo.matricula,
          rua: data.rua,
          numero: data.numero,
          complemento: data.complemento,
          bairro: data.bairro,
          cidade: data.cidade,
          estado: data.estado,
          cep: data.cep,
        };
        
        setUser(updatedUser);
        localStorage.setItem('condoUser', JSON.stringify(updatedUser));
        toast.success(`Condomínio alterado para ${selectedCondo.nomeCondominio}`);
      });
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('condoUser');
    toast.info("Logout realizado com sucesso");
  };

  return (
    <AppContext.Provider value={{ user, login, logout, isAuthenticated: !!user, isLoading, switchCondominium }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
