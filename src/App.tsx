
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AppProvider, useApp } from "@/contexts/AppContext";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import CadastroGestor from "./pages/CadastroGestor";
import CadastroPlanos from "./pages/CadastroPlanos";
import UnderConstruction from "./pages/UnderConstruction";
import NotFound from "./pages/NotFound";
import { useEffect } from "react";

const queryClient = new QueryClient();

// Protected route wrapper
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, isLoading } = useApp();
  
  if (isLoading) {
    // You could show a loading spinner here
    return <div className="min-h-screen flex items-center justify-center">Carregando...</div>;
  }
  
  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }
  
  return <>{children}</>;
};

// Auth route wrapper (redirects if already logged in)
const AuthRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, isLoading } = useApp();
  
  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center">Carregando...</div>;
  }
  
  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }
  
  return <>{children}</>;
};

// AnimationController to handle page transitions
const AnimationController = ({ children }: { children: React.ReactNode }) => {
  useEffect(() => {
    // Add transition class to the body when component mounts
    document.body.classList.add('page-transition-enter');
    document.body.classList.add('page-transition-enter-active');
    
    // Remove transition classes after animation completes
    const timeout = setTimeout(() => {
      document.body.classList.remove('page-transition-enter');
      document.body.classList.remove('page-transition-enter-active');
    }, 300);
    
    return () => {
      clearTimeout(timeout);
      // Add exit animation classes
      document.body.classList.add('page-transition-exit');
      document.body.classList.add('page-transition-exit-active');
      
      // Clean up exit classes after animation
      setTimeout(() => {
        document.body.classList.remove('page-transition-exit');
        document.body.classList.remove('page-transition-exit-active');
      }, 300);
    };
  }, []);
  
  return <>{children}</>;
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AppProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={
              <AnimationController>
                <AuthRoute>
                  <Login />
                </AuthRoute>
              </AnimationController>
            } />
            
            <Route path="/dashboard" element={
              <AnimationController>
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              </AnimationController>
            } />
            
            <Route path="/cadastro-gestor" element={
              <AnimationController>
                <ProtectedRoute>
                  <CadastroGestor />
                </ProtectedRoute>
              </AnimationController>
            } />
            
            <Route path="/cadastro-planos" element={
              <AnimationController>
                <ProtectedRoute>
                  <CadastroPlanos />
                </ProtectedRoute>
              </AnimationController>
            } />
            
            {/* Routes for pages that are not implemented yet */}
            <Route path="/moradores" element={
              <AnimationController>
                <ProtectedRoute>
                  <UnderConstruction />
                </ProtectedRoute>
              </AnimationController>
            } />
            
            <Route path="/financeiro" element={
              <AnimationController>
                <ProtectedRoute>
                  <UnderConstruction />
                </ProtectedRoute>
              </AnimationController>
            } />
            
            <Route path="/relatorios" element={
              <AnimationController>
                <ProtectedRoute>
                  <UnderConstruction />
                </ProtectedRoute>
              </AnimationController>
            } />
            
            <Route path="/agenda" element={
              <AnimationController>
                <ProtectedRoute>
                  <UnderConstruction />
                </ProtectedRoute>
              </AnimationController>
            } />
            
            <Route path="/notificacoes" element={
              <AnimationController>
                <ProtectedRoute>
                  <UnderConstruction />
                </ProtectedRoute>
              </AnimationController>
            } />
            
            <Route path="/avaliacoes" element={
              <AnimationController>
                <ProtectedRoute>
                  <UnderConstruction />
                </ProtectedRoute>
              </AnimationController>
            } />
            
            <Route path="/configuracoes" element={
              <AnimationController>
                <ProtectedRoute>
                  <UnderConstruction />
                </ProtectedRoute>
              </AnimationController>
            } />
            
            {/* Catch-all route */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </AppProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
