
import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'sonner';
import { AppProvider } from '@/contexts/AppContext';
import { queryClient } from '@/lib/react-query';
import AuthRequired from '@/components/AuthRequired';
import AdminOnly from '@/components/AdminOnly';
import Index from '@/pages/Index';
import Login from '@/pages/Login';
import Dashboard from '@/pages/Dashboard';
import UserProfile from '@/pages/UserProfile';
import FinanceiroDashboard from '@/pages/FinanceiroDashboard';
import FinanceiroReceitasDespesas from '@/pages/FinanceiroReceitasDespesas';
import FinanceiroRecebimentoPix from '@/pages/FinanceiroRecebimentoPix';
import FinanceiroPrestacaoContas from '@/pages/FinanceiroPrestacaoContas';
import CadastroGestor from '@/pages/CadastroGestor';
import CadastroPlanos from '@/pages/CadastroPlanos';
import CadastroChavePix from '@/pages/CadastroChavePix';
import Moradores from '@/pages/Moradores';
import Comunicados from '@/pages/Comunicados';
import Documentos from '@/pages/Documentos';
import AreasComuns from '@/pages/AreasComuns';
import Dedetizacoes from '@/pages/Dedetizacoes';
import MinhaAssinatura from '@/pages/MinhaAssinatura';
import FaleConosco from '@/pages/FaleConosco';
import GerenciarAvisos from '@/pages/GerenciarAvisos';
import MinhasCobrancas from '@/pages/MinhasCobrancas';
import BusinessContratos from '@/pages/BusinessContratos';
import SugestaoReclamacao from '@/pages/SugestaoReclamacao';
import GaragemLivre from '@/pages/GaragemLivre';
import GaragensDisponiveisCondominio from '@/pages/GaragensDisponiveisCondominio';

// We'll create placeholder components for the missing pages
const GerarFaturas = () => <div>Gerar Faturas (Em Desenvolvimento)</div>;
const Servicos = () => <div>Serviços (Em Desenvolvimento)</div>;

function App() {
  return (
    <BrowserRouter>
      <QueryClientProvider client={queryClient}>
        <AppProvider>
          <div className="app">
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/login" element={<Login />} />
              <Route path="/dashboard" element={<AuthRequired><Dashboard /></AuthRequired>} />
              <Route path="/perfil" element={<AuthRequired><UserProfile /></AuthRequired>} />
              
              {/* Financeiro Routes */}
              <Route path="/financeiro/dashboard" element={<AuthRequired><FinanceiroDashboard /></AuthRequired>} />
              <Route path="/financeiro/receitas-despesas" element={<AuthRequired><FinanceiroReceitasDespesas /></AuthRequired>} />
              <Route path="/financeiro/recebimento-pix" element={<AuthRequired><FinanceiroRecebimentoPix /></AuthRequired>} />
              <Route path="/financeiro/prestacao-contas" element={<AuthRequired><FinanceiroPrestacaoContas /></AuthRequired>} />
              
              {/* Admin Routes */}
              <Route path="/cadastro-gestor" element={<AdminOnly><CadastroGestor /></AdminOnly>} />
              <Route path="/cadastro-planos" element={<AdminOnly><CadastroPlanos /></AdminOnly>} />
              <Route path="/cadastro-chave-pix" element={<AdminOnly><CadastroChavePix /></AdminOnly>} />
              <Route path="/gerar-faturas" element={<AuthRequired><GerarFaturas /></AuthRequired>} />
              <Route path="/gerenciar-avisos" element={<AuthRequired><GerenciarAvisos /></AuthRequired>} />
              <Route path="/contratos" element={<AdminOnly><BusinessContratos /></AdminOnly>} />
              
              {/* Manager Routes */}
              <Route path="/moradores" element={<AuthRequired><Moradores /></AuthRequired>} />
              <Route path="/comunicados" element={<AuthRequired><Comunicados /></AuthRequired>} />
              <Route path="/documentos" element={<AuthRequired><Documentos /></AuthRequired>} />
              <Route path="/areas-comuns" element={<AuthRequired><AreasComuns /></AuthRequired>} />
              <Route path="/dedetizacoes" element={<AuthRequired><Dedetizacoes /></AuthRequired>} />
              <Route path="/servicos" element={<AuthRequired><Servicos /></AuthRequired>} />
              <Route path="/minha-assinatura" element={<AuthRequired><MinhaAssinatura /></AuthRequired>} />
              <Route path="/contato" element={<AuthRequired><FaleConosco /></AuthRequired>} />
              
              {/* Resident Routes */}
              <Route path="/minhas-cobrancas" element={<AuthRequired><MinhasCobrancas /></AuthRequired>} />
              <Route path="/sugestao-reclamacao" element={<AuthRequired><SugestaoReclamacao /></AuthRequired>} />
              <Route path="/garagem-livre" element={<AuthRequired><GaragemLivre /></AuthRequired>} />
              <Route path="/garagens-disponiveis" element={<AuthRequired><GaragensDisponiveisCondominio /></AuthRequired>} />
            </Routes>
            <Toaster />
          </div>
        </AppProvider>
      </QueryClientProvider>
    </BrowserRouter>
  );
}

export default App;
