import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { useInView } from 'react-intersection-observer';
import { 
  ArrowRight, 
  Building, 
  Calendar, 
  CheckCircle2, 
  Coins, 
  FileText, 
  Key, 
  Lock, 
  MessageSquare, 
  Quote, 
  Shield, 
  Star, 
  Users, 
  Wallet 
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { usePlans } from '@/hooks/use-plans';
import { 
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle
} from '@/components/ui/navigation-menu';
import { Card, CardContent } from '@/components/ui/card';

const FadeInSection = ({ children, delay = 0, className = '' }) => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  return (
    <div
      ref={ref}
      className={`${className} transition-all duration-1000 ease-out ${
        inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
      }`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
};

const Feature = ({ icon, title, description, delay }) => {
  const Icon = icon;
  
  return (
    <FadeInSection delay={delay} className="flex flex-col items-start p-6 bg-white rounded-lg shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border border-transparent hover:border-brand-200 relative overflow-hidden group">
      <div className="absolute top-0 right-0 w-20 h-20 bg-brand-100 rounded-full -translate-x-10 -translate-y-10 opacity-0 group-hover:opacity-50 transition-all duration-500"></div>
      <div className="absolute bottom-0 left-0 h-1 w-0 bg-gradient-to-r from-brand-400 to-brand-600 group-hover:w-full transition-all duration-300"></div>
      
      <div className="h-12 w-12 flex items-center justify-center rounded-full bg-brand-100 text-brand-600 mb-4 z-10 group-hover:scale-110 transition-transform duration-300">
        <Icon size={24} className="group-hover:text-brand-700 transition-colors duration-300" />
      </div>
      <h3 className="text-xl font-semibold mb-2 group-hover:text-brand-600 transition-colors duration-300">{title}</h3>
      <p className="text-gray-600 z-10">{description}</p>
    </FadeInSection>
  );
};

const PlanCard = ({ plan, featured = false, delay }) => {
  const commonFeatures = [
    "Gestão financeira completa",
    "Comunicados e avisos",
    "Reserva de áreas comuns",
    "Controle de dedetizações",
    "Gestão de documentos",
    "Recebimento via PIX",
    "Controle de vagas",
    "Suporte técnico"
  ];

  const topBorderClass = plan.codigo === "BASICO" || plan.codigo === "PREMIUM" 
    ? "border-t-4 border-t-[#1EAEDB]" 
    : featured ? "border-t-4 border-t-brand-500" : "";

  return (
    <FadeInSection delay={delay} className={`rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 ${topBorderClass} ${featured ? 'border-2 border-brand-500 transform scale-105' : 'border border-gray-200'}`}>
      <div className={`p-6 ${featured ? 'bg-gradient-to-r from-brand-600 to-brand-700 text-white' : 'bg-white text-gray-800'}`}>
        <h3 className="text-xl font-bold mb-2">{plan.nome}</h3>
        <div className="text-3xl font-bold mb-4">{plan.valor}</div>
      </div>
      <div className="bg-white p-6">
        <ul className="space-y-3">
          <li className="flex items-start">
            <CheckCircle2 className="h-5 w-5 text-green-500 mr-2 flex-shrink-0" />
            <div className="flex">
              <span className="font-bold px-3 py-1 bg-brand-100 text-brand-800 rounded-full">
                {plan.codigo === "PREMIUM" 
                  ? "Até 50 moradores" 
                  : plan.codigo === "PADRAO" 
                    ? "Até 50 moradores"
                    : `Até ${plan.max_moradores || '30'} moradores`}
              </span>
            </div>
          </li>
          
          {commonFeatures.map((feature, index) => (
            <li key={index} className="flex items-start">
              <CheckCircle2 className="h-5 w-5 text-green-500 mr-2 flex-shrink-0" />
              <span>{feature}</span>
            </li>
          ))}
        </ul>
        <Link to="/login" className="w-full">
          <Button className={`w-full mt-6 ${featured ? 'bg-brand-600 hover:bg-brand-700' : 'bg-gray-100 text-gray-800 hover:bg-gray-200'}`}>
            Escolher Plano
          </Button>
        </Link>
      </div>
    </FadeInSection>
  );
};

const TestimonialCard = ({ author, role, company, content, stars = 5, delay = 0 }) => {
  return (
    <FadeInSection delay={delay}>
      <Card className="h-full transform transition-all duration-300 hover:scale-105 hover:shadow-xl border-t-4 border-t-brand-500 overflow-hidden">
        <CardContent className="p-0">
          <div className="relative">
            <div className="absolute top-0 right-0 w-32 h-32 bg-brand-100 rounded-full -translate-x-16 -translate-y-16 opacity-30"></div>
            <div className="absolute -bottom-8 -left-8 w-24 h-24 bg-blue-100 rounded-full opacity-30"></div>
            
            <div className="relative p-6">
              <div className="mb-4 flex text-yellow-400">
                {[...Array(stars)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 fill-current" />
                ))}
              </div>
              
              <div className="relative">
                <Quote className="absolute -left-2 -top-2 text-brand-200 w-8 h-8 opacity-40" />
                <p className="text-gray-600 mb-6 pl-5 relative z-10">
                  "{content}"
                </p>
              </div>
              
              <div className="flex items-center mt-2">
                <div className="mr-4 h-12 w-12 rounded-full bg-brand-100 flex items-center justify-center">
                  <span className="text-brand-700 font-bold">{author.split(' ').map(n => n[0]).join('')}</span>
                </div>
                <div>
                  <h4 className="font-bold text-gray-900">{author}</h4>
                  <p className="text-sm text-brand-600">{role} - {company}</p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </FadeInSection>
  );
};

const LandingPage = () => {
  const { plans, isLoading } = usePlans();
  const [activePlans, setActivePlans] = useState([]);
  const heroRef = useRef(null);
  
  useEffect(() => {
    if (!isLoading) {
      if (plans.length > 0) {
        setActivePlans(plans);
      } else {
        setActivePlans([
          {
            id: "1",
            codigo: "BASICO",
            nome: "Plano Básico",
            valor: "R$ 99,90",
            max_moradores: 30
          },
          {
            id: "2",
            codigo: "PADRAO",
            nome: "Plano Padrão",
            valor: "R$ 199,90",
            max_moradores: 50
          },
          {
            id: "3",
            codigo: "PREMIUM",
            nome: "Plano Premium",
            valor: "R$ 299,90",
            max_moradores: 50
          }
        ]);
      }
    }
  }, [isLoading, plans]);
  
  useEffect(() => {
    const handleScroll = () => {
      if (heroRef.current) {
        const scrollPosition = window.scrollY;
        heroRef.current.style.transform = `translateY(${scrollPosition * 0.4}px)`;
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    if (element) {
      window.scrollTo({
        top: element.offsetTop - 80,
        behavior: 'smooth'
      });
    }
  };

  return (
    <div className="w-full overflow-x-hidden bg-gradient-to-b from-blue-50 to-white">
      <header className="fixed top-0 left-0 right-0 bg-white/90 backdrop-blur-sm z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center">
            <Building className="h-7 w-7 text-brand-600" />
            <span className="text-xl font-bold ml-2">MeuResidencial</span>
          </div>
          
          <div className="hidden md:flex items-center space-x-4">
            <NavigationMenu>
              <NavigationMenuList>
                <NavigationMenuItem>
                  <button 
                    onClick={() => scrollToSection('features')}
                    className={navigationMenuTriggerStyle()}
                  >
                    Funcionalidades
                  </button>
                </NavigationMenuItem>
                <NavigationMenuItem>
                  <button 
                    onClick={() => scrollToSection('plans')}
                    className={navigationMenuTriggerStyle()}
                  >
                    Planos
                  </button>
                </NavigationMenuItem>
                <NavigationMenuItem>
                  <button 
                    onClick={() => scrollToSection('testimonials')}
                    className={navigationMenuTriggerStyle()}
                  >
                    Clientes
                  </button>
                </NavigationMenuItem>
              </NavigationMenuList>
            </NavigationMenu>
            
            <Link to="/login">
              <Button size="sm" className="group bg-brand-600 hover:bg-brand-700 text-white">
                Acessar Meu Residencial
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Button>
            </Link>
          </div>
          
          <div className="md:hidden">
            <Link to="/login">
              <Button size="sm" className="bg-brand-600 hover:bg-brand-700 text-white">
                Acessar
              </Button>
            </Link>
          </div>
        </div>
      </header>
      
      <section className="relative overflow-hidden pt-24">
        <div 
          className="absolute inset-0 z-0 bg-gradient-to-r from-brand-800/30 to-brand-600/30"
          ref={heroRef}
        />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-20 relative z-10">
          <div className="flex flex-col lg:flex-row items-center">
            <div className="lg:w-1/2 mb-12 lg:mb-0">
              <FadeInSection delay={0}>
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight mb-6">
                  Gestão de condomínios <span className="text-brand-600">simplificada</span>
                </h1>
              </FadeInSection>
              
              <FadeInSection delay={200}>
                <p className="text-xl text-gray-700 mb-8">
                  Ofereça aos síndicos total autonomia para uma gestão eficiente e transparente, com todas as ferramentas necessárias em um único lugar.
                </p>
              </FadeInSection>
            </div>
            
            <div className="lg:w-1/2 relative">
              <FadeInSection delay={600} className="relative">
                <div className="absolute -top-10 -left-10 w-40 h-40 bg-brand-200 rounded-full filter blur-3xl opacity-40 animate-pulse" />
                <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-blue-200 rounded-full filter blur-3xl opacity-40 animate-pulse" />
                <img 
                  src="/placeholder.svg"
                  alt="Gestão de condomínios" 
                  className="relative z-10 rounded-xl shadow-2xl w-full max-w-lg mx-auto"
                />
              </FadeInSection>
            </div>
          </div>
        </div>
        
        <div className="absolute -bottom-1 left-0 right-0">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320">
            <path fill="white" fillOpacity="1" d="M0,96L48,106.7C96,117,192,139,288,128C384,117,480,75,576,80C672,85,768,139,864,138.7C960,139,1056,85,1152,64C1248,43,1344,53,1392,58.7L1440,64L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path>
          </svg>
        </div>
      </section>
      
      <section id="features" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <FadeInSection>
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Funcionalidades Completas</h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Tudo o que o síndico precisa para uma gestão transparente e eficiente em um único sistema
              </p>
            </div>
          </FadeInSection>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Feature 
              icon={Wallet}
              title="Gestão Financeira" 
              description="Controle completo de receitas, despesas e prestação de contas com relatórios detalhados."
              delay={100}
            />
            <Feature 
              icon={Users}
              title="Cadastro de Moradores" 
              description="Gerencie facilmente os moradores do condomínio com informações completas e atualizadas."
              delay={200}
            />
            <Feature 
              icon={MessageSquare}
              title="Comunicados" 
              description="Envie avisos e comunicados importantes para todos os moradores com facilidade."
              delay={300}
            />
            <Feature 
              icon={Calendar}
              title="Reserva de Áreas" 
              description="Sistema para agendamento e reserva de áreas comuns do condomínio."
              delay={400}
            />
            <Feature 
              icon={FileText}
              title="Documentos" 
              description="Armazenamento e compartilhamento de documentos importantes do condomínio."
              delay={500}
            />
            <Feature 
              icon={Shield}
              title="Segurança" 
              description="Controle de acesso e permissões para diferentes perfis de usuários."
              delay={600}
            />
            <Feature 
              icon={Coins}
              title="Recebimento PIX" 
              description="Facilidade para recebimento de pagamentos via PIX integrado ao sistema."
              delay={700}
            />
            <Feature 
              icon={Building}
              title="Gestão Empresarial" 
              description="Ferramentas para gestão completa da administração do condomínio."
              delay={800}
            />
            <Feature 
              icon={Key}
              title="Controle de Vagas" 
              description="Gerenciamento de vagas de garagem e espaços privativos."
              delay={900}
            />
          </div>
        </div>
      </section>
      
      <section id="plans" className="py-20 bg-gradient-to-b from-white to-blue-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <FadeInSection>
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Planos que se Adaptam às Suas Necessidades</h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Escolha o plano ideal para o seu condomínio, com preços acessíveis e funcionalidades completas
              </p>
            </div>
          </FadeInSection>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {activePlans.map((plan, index) => (
              <PlanCard 
                key={plan.id} 
                plan={plan} 
                featured={index === 1} 
                delay={index * 200}
              />
            ))}
          </div>
        </div>
      </section>
      
      <section id="testimonials" className="py-20 bg-white relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-64 bg-gradient-to-b from-blue-50 to-transparent"></div>
        <div className="absolute -top-20 -right-20 w-64 h-64 bg-brand-100 rounded-full filter blur-3xl opacity-30"></div>
        <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-blue-100 rounded-full filter blur-3xl opacity-30"></div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <FadeInSection>
            <div className="text-center mb-16">
              <div className="inline-block mb-4 px-6 py-2 rounded-full bg-brand-100 text-brand-800">
                <div className="flex items-center space-x-2">
                  <MessageSquare className="h-5 w-5" />
                  <span className="font-semibold">Depoimentos</span>
                </div>
              </div>
              <h2 className="text-3xl md:text-5xl font-bold text-gray-900 mb-4 bg-clip-text text-transparent bg-gradient-to-r from-brand-600 to-brand-800">
                O Que Nossos Clientes Dizem
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Síndicos que transformaram a gestão de seus condomínios com nossa plataforma
              </p>
            </div>
          </FadeInSection>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <TestimonialCard 
              author="Ricardo Pereira"
              role="Síndico"
              company="Edifício Aurora"
              content="O MeuResidencial transformou completamente a gestão do nosso condomínio. Antes era tudo manual e agora temos controle total com muito mais transparência."
              delay={100}
            />
            
            <TestimonialCard 
              author="Mariana Silva"
              role="Síndica"
              company="Condomínio Parque Verde"
              content="A facilidade de comunicação com os moradores e o controle financeiro são extraordinários. Economizamos tempo e dinheiro com essa plataforma."
              delay={200}
            />
            
            <TestimonialCard 
              author="Carlos Almeida"
              role="Síndico"
              company="Residencial Montanha"
              content="Os moradores adoraram a transparência que o sistema proporciona. As reservas de áreas comuns funcionam perfeitamente e sem conflitos."
              delay={300}
            />
          </div>
          
          <FadeInSection delay={400} className="mt-16 text-center">
            <Button 
              onClick={() => scrollToSection('plans')}
              size="lg" 
              className="group bg-brand-600 hover:bg-brand-700 text-white shadow-lg hover:shadow-xl transition-all duration-300"
            >
              Experimente Agora
              <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Button>
          </FadeInSection>
        </div>
      </section>
      
      <section className="py-20 bg-gradient-to-r from-brand-600 to-brand-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <FadeInSection className="text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Pronto para transformar a gestão do seu condomínio?</h2>
            <p className="text-xl text-blue-100 max-w-3xl mx-auto">
              Comece hoje mesmo e descubra como é fácil ter o controle total do seu condomínio em suas mãos.
            </p>
          </FadeInSection>
        </div>
      </section>
      
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between">
            <div className="mb-8 md:mb-0">
              <div className="flex items-center mb-4">
                <Building className="h-7 w-7 text-brand-400" />
                <h3 className="text-2xl font-bold text-white ml-2">MeuResidencial</h3>
              </div>
              <p className="text-gray-400 max-w-md">
                A solução completa para a gestão eficiente do seu condomínio, proporcionando transparência e facilidade para síndicos e moradores.
              </p>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-3 gap-8">
              <div>
                <h4 className="text-lg font-semibold mb-4">Plataforma</h4>
                <ul className="space-y-2">
                  <li><button onClick={() => scrollToSection('features')} className="text-gray-400 hover:text-white transition-colors">Funcionalidades</button></li>
                  <li><button onClick={() => scrollToSection('plans')} className="text-gray-400 hover:text-white transition-colors">Planos</button></li>
                  <li><button onClick={() => scrollToSection('testimonials')} className="text-gray-400 hover:text-white transition-colors">Depoimentos</button></li>
                </ul>
              </div>
              
              <div>
                <h4 className="text-lg font-semibold mb-4">Empresa</h4>
                <ul className="space-y-2">
                  <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Sobre nós</a></li>
                  <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Contato</a></li>
                  <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Blog</a></li>
                </ul>
              </div>
              
              <div>
                <h4 className="text-lg font-semibold mb-4">Legal</h4>
                <ul className="space-y-2">
                  <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Termos de Uso</a></li>
                  <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Privacidade</a></li>
                </ul>
              </div>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm">
              &copy; {new Date().getFullYear()} MeuResidencial. Todos os direitos reservados.
            </p>
            
            <div className="flex space-x-4 mt-4 md:mt-0">
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <span className="sr-only">Facebook</span>
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                </svg>
              </a>
              
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <span className="sr-only">Instagram</span>
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                </svg>
              </a>
              
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <span className="sr-only">Twitter</span>
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                </svg>
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
