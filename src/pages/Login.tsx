
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Building, Eye, EyeOff, Lock, Mail, Users, Wallet, Calendar, Bell, AlertCircle } from 'lucide-react';
import { useApp } from '@/contexts/AppContext';
import { toast } from 'sonner';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

const Login = () => {
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const { login } = useApp();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('manager');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!identifier || !password) {
      toast.error('Por favor, preencha todos os campos');
      return;
    }
    
    setLoading(true);
    const success = await login(identifier, password);
    if (success) {
      navigate('/dashboard');
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex flex-col sm:flex-row bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="sm:w-1/2 flex flex-col justify-center items-center p-8 sm:p-16 animate-fade-in">
        <div className="max-w-md w-full">
          <div className="mb-8 text-center sm:text-left">
            <div className="flex items-center justify-center sm:justify-start mb-4">
              <Building className="h-8 w-8 text-brand-600" />
              <h1 className="text-3xl font-bold text-gray-800 ml-2 font-display">MeuResidencial</h1>
            </div>
            <h2 className="text-2xl font-semibold text-gray-700 mb-1">Seja bem-vindo!</h2>
            <p className="text-gray-500">Faça login para acessar sua conta</p>
          </div>
          
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full mb-6">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="manager">Síndico/Admin</TabsTrigger>
              <TabsTrigger value="resident">Morador</TabsTrigger>
            </TabsList>
            
            <TabsContent value="manager">
              <Alert className="mb-4 bg-blue-50 border-blue-200">
                <AlertCircle className="h-4 w-4 text-blue-600" />
                <AlertTitle>Acesso de Síndico ou Administrador</AlertTitle>
                <AlertDescription>
                  Use seu email ou matrícula do condomínio e senha.
                </AlertDescription>
              </Alert>
            </TabsContent>
            
            <TabsContent value="resident">
              <Alert className="mb-4 bg-green-50 border-green-200">
                <AlertCircle className="h-4 w-4 text-green-600" />
                <AlertTitle>Acesso de Morador</AlertTitle>
                <AlertDescription>
                  Use seu email cadastrado e seu CPF como senha.
                </AlertDescription>
              </Alert>
            </TabsContent>
          </Tabs>
          
          <form onSubmit={handleLogin} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="identifier">
                {activeTab === 'manager' ? 'Email ou Matrícula' : 'Email'}
              </Label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  id="identifier"
                  type="text"
                  placeholder={activeTab === 'manager' ? "seu@email.com ou matrícula" : "seu@email.com"}
                  className="pl-9"
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  required
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">
                  {activeTab === 'manager' ? 'Senha' : 'CPF (Senha)'}
                </Label>
                {activeTab === 'manager' && (
                  <a href="#" className="text-xs text-brand-600 hover:underline">
                    Esqueceu a senha?
                  </a>
                )}
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder={activeTab === 'manager' ? "Sua senha" : "Seu CPF (apenas números)"}
                  className="pl-9"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <button
                  type="button"
                  className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
            </div>
            
            <Button
              type="submit"
              className="w-full bg-brand-600 hover:bg-brand-700 text-white"
              disabled={loading}
            >
              {loading ? 'Carregando...' : 'Entrar'}
            </Button>
          </form>
          
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-500">
              Não tem uma conta?{' '}
              <a href="#" className="text-brand-600 hover:underline">
                Entre em contato conosco
              </a>
            </p>
          </div>
        </div>
      </div>
      
      <div className="hidden sm:flex sm:w-1/2 bg-brand-700 text-white flex-col justify-center items-center p-16 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-brand-800 to-brand-600 opacity-90"></div>
        <div className="relative z-10 max-w-lg text-center">
          <h2 className="text-4xl font-bold mb-6 font-display">Gerencie seu condomínio com facilidade</h2>
          <p className="text-lg text-blue-100 mb-8">
            Uma plataforma completa para síndicos profissionais administrarem 
            condomínios de forma eficiente e moderna.
          </p>
          <div className="grid grid-cols-2 gap-4 text-left">
            <div className="flex items-start space-x-2">
              <div className="mt-1 rounded-full bg-brand-500/20 p-1">
                <Users className="h-4 w-4" />
              </div>
              <div>
                <h3 className="font-medium">Gestão de moradores</h3>
                <p className="text-sm text-blue-200">Cadastro e comunicação eficiente</p>
              </div>
            </div>
            <div className="flex items-start space-x-2">
              <div className="mt-1 rounded-full bg-brand-500/20 p-1">
                <Wallet className="h-4 w-4" />
              </div>
              <div>
                <h3 className="font-medium">Controle financeiro</h3>
                <p className="text-sm text-blue-200">Gestão de despesas e receitas</p>
              </div>
            </div>
            <div className="flex items-start space-x-2">
              <div className="mt-1 rounded-full bg-brand-500/20 p-1">
                <Calendar className="h-4 w-4" />
              </div>
              <div>
                <h3 className="font-medium">Agendamentos</h3>
                <p className="text-sm text-blue-200">Áreas comuns e manutenções</p>
              </div>
            </div>
            <div className="flex items-start space-x-2">
              <div className="mt-1 rounded-full bg-brand-500/20 p-1">
                <Bell className="h-4 w-4" />
              </div>
              <div>
                <h3 className="font-medium">Notificações</h3>
                <p className="text-sm text-blue-200">Avisos e comunicados</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
