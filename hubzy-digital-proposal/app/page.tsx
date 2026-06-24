'use client';

import React, { useState, useRef, useEffect } from 'react';
import { 
  Check, 
  CheckCircle2, 
  FileText, 
  Handshake, 
  MousePointerClick, 
  Info, 
  AlertCircle, 
  X, 
  ShieldCheck, 
  Download, 
  Calendar, 
  Sparkles, 
  Edit2, 
  RotateCcw, 
  ArrowLeft,
  ChevronRight,
  Share2
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

// Pricing data structures
interface Plan {
  id: 'essencial' | 'profissional' | 'completo';
  name: string;
  subtitle: string;
  price: number;
  setup: number;
  features: string[];
}

interface AdditionalService {
  id: 'seo_articles' | 'social_media' | 'paid_traffic';
  name: string;
  desc: string;
  price: number;
}

// Proposal generator data
interface ProposalConfig {
  clientName: string;
  clientCnpj: string;
  clientResponsible: string;
  clientEmail: string;
  clientPhone: string;
  validityDate: string;
  observation: string;
  notifyEmail: string;
}

const PLANS: Plan[] = [
  {
    id: 'essencial',
    name: 'Essencial',
    subtitle: 'Presença digital completa',
    price: 497,
    setup: 500,
    features: [
      'Google Meu Negócio',
      '1 rede social',
      'Site institucional',
      'Hospedagem + e-mail',
    ]
  },
  {
    id: 'profissional',
    name: 'Profissional',
    subtitle: 'Marketing digital ativo',
    price: 897,
    setup: 800,
    features: [
      'Tudo do Essencial',
      '2 redes sociais',
      'Tráfego Pago (Ads)',
      '4 posts/mês',
    ]
  },
  {
    id: 'completo',
    name: 'Completo',
    subtitle: 'Solução total com conteúdo',
    price: 1497,
    setup: 1200,
    features: [
      'Tudo do Profissional',
      'Blog 4 artigos/mês',
      '8 posts/mês',
      'Relatório mensal',
    ]
  }
];

const ADDITIONAL_SERVICES: AdditionalService[] = [
  {
    id: 'seo_articles',
    name: 'Artigos para Blog (SEO)',
    desc: '4 textos mensais otimizados para buscas orgânicas.',
    price: 297
  },
  {
    id: 'social_media',
    name: 'Posts adicionais para redes sociais',
    desc: '8 artes/mês extras para Instagram e Facebook.',
    price: 197
  },
  {
    id: 'paid_traffic',
    name: 'Gestão de Tráfego Pago',
    desc: 'Criação e otimização de campanhas Google Ads + Meta Ads (verba de mídia não inclusa).',
    price: 397
  }
];

// Helper functions defined outside the React component to ensure purity
function generateRandomHash(): string {
  const chars = '0123456789ABCDEF';
  let hash = '';
  for (let i = 0; i < 24; i++) {
    hash += chars[Math.floor(Math.random() * 16)];
  }
  return hash;
}

function generateDocId(): string {
  const num = Math.floor(100000 + Math.random() * 900000);
  return `PROP-${num}`;
}

export default function ProposalApp() {
  // State management
  const [selectedPlanId, setSelectedPlanId] = useState<'essencial' | 'profissional' | 'completo'>('profissional');
  const [selectedServices, setSelectedServices] = useState<string[]>([]);
  
  // Customization of proposal details (for great interactivity)
  const [clientName, setClientName] = useState('');
  const [isEditingClient, setIsEditingClient] = useState(false);
  const [clientInput, setClientInput] = useState('');

  // Proposal Generator Modal
  const [isGeneratorOpen, setIsGeneratorOpen] = useState(true);
  const [proposalConfig, setProposalConfig] = useState<ProposalConfig>({
    clientName: '',
    clientCnpj: '',
    clientResponsible: '',
    clientEmail: '',
    clientPhone: '',
    validityDate: '',
    observation: '',
    notifyEmail: 'suporte@hubzydigital.dev.br',
  });
  const [proposalReady, setProposalReady] = useState(false);

  // Default validity date: 30 days from now + leitura de query params
  useEffect(() => {
    const d = new Date();
    d.setDate(d.getDate() + 30);
    const defaultValidity = d.toISOString().split('T')[0];

    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const cliente = params.get('cliente');
      if (cliente) {
        // Carrega dados da URL
        const plano = (params.get('plano') || 'profissional') as 'essencial' | 'profissional' | 'completo';
        const servicos = params.get('servicos') ? params.get('servicos')!.split(',').filter(Boolean) : [];
        const validade = params.get('validade') || defaultValidity;
        setProposalConfig({
          clientName: cliente,
          clientCnpj: params.get('cnpj') || '',
          clientResponsible: params.get('responsavel') || '',
          clientEmail: params.get('email') || '',
          clientPhone: params.get('telefone') || '',
          validityDate: validade,
          observation: params.get('obs') || '',
          notifyEmail: 'suporte@hubzydigital.dev.br',
        });
        setClientName(cliente);
        setClientInput(cliente);
        setSelectedPlanId(plano);
        setSelectedServices(servicos);
        setIsGeneratorOpen(false);
        setProposalReady(true);
      } else {
        setProposalConfig(prev => ({ ...prev, validityDate: defaultValidity }));
      }
    }
  }, []);

  const [generatedLink, setGeneratedLink] = useState('');
  const [linkCopied, setLinkCopied] = useState(false);

  const handleGeneratorSubmit = () => {
    if (!proposalConfig.clientName.trim() || !proposalConfig.clientResponsible.trim()) return;
    setClientName(proposalConfig.clientName);
    setClientInput(proposalConfig.clientName);

    // Gera link com query params
    const base = typeof window !== 'undefined' ? window.location.origin : 'https://proposta.hubzydigital.dev.br';
    const params = new URLSearchParams({
      cliente: proposalConfig.clientName,
      cnpj: proposalConfig.clientCnpj,
      responsavel: proposalConfig.clientResponsible,
      email: proposalConfig.clientEmail,
      telefone: proposalConfig.clientPhone,
      validade: proposalConfig.validityDate,
      plano: selectedPlanId,
      servicos: selectedServices.join(','),
      obs: proposalConfig.observation,
    });
    const link = `${base}?${params.toString()}`;
    setGeneratedLink(link);
    setProposalReady(true);
  };

  const copyLink = () => {
    navigator.clipboard.writeText(generatedLink);
    setLinkCopied(true);
    setTimeout(() => setLinkCopied(false), 2500);
  };

  // Modals state
  const [isSummaryOpen, setIsSummaryOpen] = useState(false);
  const [isSigningOpen, setIsSigningOpen] = useState(false);
  
  // Signature panel state
  const [signerName, setSignerName] = useState('');
  const [signerEmail, setSignerEmail] = useState('');
  const [signatureType, setSignatureType] = useState<'draw' | 'type'>('draw');
  const [typedSignature, setTypedSignature] = useState('');
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [signingError, setSigningError] = useState('');
  
  // Signature Drawing Canvas state
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [hasDrawn, setHasDrawn] = useState(false);

  // Proposal Complete/Signed state
  const [signedProposal, setSignedProposal] = useState<any | null>(null);

  // Selected plan object
  const currentPlan = PLANS.find(p => p.id === selectedPlanId) || PLANS[1];

  // Calculations
  const planMonthlyPrice = currentPlan.price;
  const planSetupPrice = currentPlan.setup;
  const servicesMonthlyPrice = selectedServices.reduce((sum, serviceId) => {
    const service = ADDITIONAL_SERVICES.find(s => s.id === serviceId);
    return sum + (service ? service.price : 0);
  }, 0);
  const totalMonthly = planMonthlyPrice + servicesMonthlyPrice;

  // Format validity date for display
  const formatDate = (dateStr: string) => {
    if (!dateStr) return '';
    const [y, m, d] = dateStr.split('-');
    return `${d}/${m}/${y}`;
  };

  // Toggle dynamic services selection
  const toggleService = (serviceId: string) => {
    if (selectedServices.includes(serviceId)) {
      setSelectedServices(selectedServices.filter(id => id !== serviceId));
    } else {
      setSelectedServices([...selectedServices, serviceId]);
    }
  };

  // Canvas drawing operations
  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.strokeStyle = '#7f19be';
    ctx.lineWidth = 3;
    ctx.lineCap = 'round';

    const coords = getCanvasCoords(e, canvas);
    ctx.beginPath();
    ctx.moveTo(coords.x, coords.y);
    setIsDrawing(true);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    e.preventDefault();
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const coords = getCanvasCoords(e, canvas);
    ctx.lineTo(coords.x, coords.y);
    ctx.stroke();
    setHasDrawn(true);
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    setHasDrawn(false);
  };

  const getCanvasCoords = (
    e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>,
    canvas: HTMLCanvasElement
  ) => {
    const rect = canvas.getBoundingClientRect();
    if ('touches' in e) {
      if (e.touches.length === 0) return { x: 0, y: 0 };
      return {
        x: e.touches[0].clientX - rect.left,
        y: e.touches[0].clientY - rect.top,
      };
    } else {
      return {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      };
    }
  };

  // Handle Client Name Change Save
  const saveClientName = () => {
    if (clientInput.trim()) {
      setClientName(clientInput);
      setIsEditingClient(false);
    }
  };

  // Trigger signature submission
  const handleSignatureSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSigningError('');

    if (!signerName.trim()) {
      setSigningError('Por favor, informe seu nome completo.');
      return;
    }
    if (!signerEmail.trim() || !signerEmail.includes('@')) {
      setSigningError('Por favor, informe um e-mail válido.');
      return;
    }
    if (!termsAccepted) {
      setSigningError('Você precisa concordar com os termos da proposta comercial.');
      return;
    }

    let signatureImage = '';
    if (signatureType === 'draw') {
      if (!hasDrawn) {
        setSigningError('Por favor, faça a sua assinatura na tela ou mude para a opção de digitar.');
        return;
      }
      // Get signature image as base64
      const canvas = canvasRef.current;
      if (canvas) {
        signatureImage = canvas.toDataURL();
      }
    } else {
      if (!typedSignature.trim()) {
        setSigningError('Por favor, digite seu nome no campo de assinatura.');
        return;
      }
    }

    // Generate dynamic hash certificate
    const randomHash = generateRandomHash();
    const docId = generateDocId();

    const newSignedProposal = {
      docId,
      clientName,
      signerName,
      signerEmail,
      plan: currentPlan,
      services: selectedServices.map(id => ADDITIONAL_SERVICES.find(s => s.id === id)).filter(Boolean),
      oneTimePrice: planMonthlyPrice,
      monthlyPrice: servicesMonthlyPrice,
      signatureType,
      signatureImage,
      typedSignature: signatureType === 'type' ? typedSignature : '',
      timestamp: new Date().toLocaleString('pt-BR', { timeZone: 'America/Sao_Paulo' }),
      certificate: `HUBZY-${randomHash.toUpperCase()}`,
      ip: '186.234.120.45' // Simulated safe brazilian IP
    };

    setSignedProposal(newSignedProposal);
    setIsSigningOpen(false);
    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="relative min-h-screen font-sans bg-background text-on-surface pb-36">
      
      {/* Top Bar Header */}
      <header className="fixed top-0 left-0 w-full z-40 bg-surface-card/90 backdrop-blur-md border-b border-border-subtle shadow-sm transition-all duration-300">
        <div className="max-w-[1200px] mx-auto flex justify-between items-center px-6 py-4">
          <div className="flex items-center gap-4">
            <span className="text-xl font-bold tracking-tight text-primary">Hubzy Digital</span>
            <span className="hidden md:block w-px h-6 bg-border-subtle mx-2"></span>
            
            <div className="hidden md:flex items-center gap-2">
              {isEditingClient ? (
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={clientInput}
                    onChange={(e) => setClientInput(e.target.value)}
                    className="border border-outline-variant rounded px-2 py-0.5 text-sm font-medium focus:outline-none focus:ring-1 focus:ring-primary"
                    placeholder="Nome do cliente"
                    id="client_name_input"
                    autoFocus
                  />
                  <button 
                    onClick={saveClientName} 
                    className="text-xs bg-primary text-white px-2 py-1 rounded hover:bg-surface-tint"
                    id="save_client_btn"
                  >
                    Salvar
                  </button>
                  <button 
                    onClick={() => { setClientInput(clientName); setIsEditingClient(false); }} 
                    className="text-xs text-secondary hover:underline"
                    id="cancel_client_btn"
                  >
                    Cancelar
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-secondary">{clientName}</span>
                  <button 
                    onClick={() => setIsEditingClient(true)} 
                    className="text-gray-400 hover:text-primary transition-colors p-1 rounded-full hover:bg-surface-container-low"
                    title="Editar nome do cliente"
                    id="edit_client_btn"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}
            </div>
          </div>
          
          <nav className="hidden md:flex items-center gap-6">
            <a href="#proposta" className="text-sm font-medium text-primary border-b-2 border-primary pb-1">Proposta</a>
            <a href="#how-it-works" className="text-sm font-medium text-secondary hover:text-primary transition-colors">Como funciona</a>
            <a href="#planos" className="text-sm font-medium text-secondary hover:text-primary transition-colors">Planos</a>
            <a href="#adicionais" className="text-sm font-medium text-secondary hover:text-primary transition-colors">Serviços</a>
          </nav>
          
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsGeneratorOpen(true)}
              className="border border-primary text-primary px-4 py-2 rounded-lg text-xs font-semibold hover:bg-primary/5 transition-all flex items-center gap-1.5"
              id="nav_generator_btn"
            >
              <Edit2 className="w-3.5 h-3.5" /> Gerar Proposta
            </button>
          
            <button 
              onClick={() => {
                if (signedProposal) {
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                } else {
                  setIsSigningOpen(true);
                }
              }}
              className="bg-primary text-on-primary px-5 py-2 rounded-lg text-xs font-semibold hover:bg-surface-tint transition-all active:scale-95 shadow-sm"
              id="nav_accept_btn"
            >
              {signedProposal ? 'Ver Assinatura' : 'Aceitar Proposta'}
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Container */}
      <main className="max-w-[900px] mx-auto pt-28 px-4 md:px-6">
        
        {/* Animated Banner on Signed Proposal Success */}
        {signedProposal && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8 p-6 bg-green-50 border border-green-200 rounded-2xl shadow-sm text-green-800 flex flex-col md:flex-row items-center justify-between gap-4"
            id="signed_banner"
          >
            <div className="flex items-center gap-4 text-center md:text-left">
              <div className="p-3 bg-green-100 text-green-600 rounded-full shrink-0">
                <ShieldCheck className="w-8 h-8" />
              </div>
              <div>
                <h2 className="text-lg font-bold">Proposta Comercial Assinada Digitalmente!</h2>
                <p className="text-sm opacity-90">Sua via de segurança está pronta. O projeto do <strong>{clientName}</strong> já pode ser iniciado.</p>
                <div className="mt-1 flex flex-wrap gap-x-4 text-xs font-mono opacity-75">
                  <span>Doc: {signedProposal.docId}</span>
                  <span>Chave: {signedProposal.certificate}</span>
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-3 shrink-0">
              <button 
                onClick={() => window.print()}
                className="flex items-center gap-2 bg-white border border-green-300 hover:bg-green-100/50 text-green-800 text-xs font-semibold px-4 py-2.5 rounded-lg transition-colors"
                id="print_signed_btn"
              >
                <Download className="w-4 h-4" /> Imprimir / PDF
              </button>
              
              <button 
                onClick={() => {
                  if (confirm('Deseja redefinir ou editar os planos e assinar novamente?')) {
                    setSignedProposal(null);
                  }
                }}
                className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white text-xs font-semibold px-4 py-2.5 rounded-lg transition-colors"
                id="reset_signed_btn"
              >
                <RotateCcw className="w-4 h-4" /> Alterar
              </button>
            </div>
          </motion.div>
        )}

        {/* Proposta Title Header */}
        <section className="mb-12 text-center pt-6" id="proposta">
          <span className="text-[11px] font-bold tracking-widest text-primary uppercase bg-primary-container/20 px-3 py-1.5 rounded-full mb-3 inline-block">
            Proposta Digital Hubzy
          </span>
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-on-surface mb-3">
            Proposta Comercial
          </h1>
          <p className="text-base md:text-lg text-secondary max-w-2xl mx-auto font-medium">
            Desenvolvimento de presença digital e estratégias de crescimento acelerado para <span className="text-primary font-semibold">{clientName || '—'}</span>.
          </p>

          {proposalConfig.observation && (
            <div className="mt-4 max-w-xl mx-auto text-xs text-secondary bg-surface-container-low border border-border-subtle rounded-xl px-4 py-3 text-left">
              <span className="font-semibold text-on-surface block mb-0.5">Observação:</span>
              {proposalConfig.observation}
            </div>
          )}
          
          <div className="mt-4 flex justify-center items-center gap-2 text-xs text-gray-500 font-mono">
            <Calendar className="w-3.5 h-3.5 text-primary" />
            <span>Emitido em: {new Date().toLocaleDateString('pt-BR', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
            <span className="text-gray-300">•</span>
            <span>Válido até: {formatDate(proposalConfig.validityDate) || '—'}</span>
          </div>
        </section>

        {/* How it Works Section */}
        <section className="mb-16" id="how-it-works">
          <h2 className="text-lg font-bold tracking-tight text-on-surface mb-8 text-center uppercase tracking-widest text-secondary text-xs">
            Fluxo de Contratação
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative">
            <div className="hidden md:block absolute top-1/2 left-0 w-full h-0.5 bg-border-subtle -z-10 -translate-y-1/2"></div>
            
            {/* Step 1 */}
            <div className="bg-surface-card rounded-2xl p-6 border border-border-subtle card-shadow text-center relative hover:border-primary/30 hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
              <div className="w-12 h-12 bg-primary/10 text-primary rounded-full flex items-center justify-center mx-auto mb-4 font-bold shadow-inner">
                <MousePointerClick className="w-5 h-5" />
              </div>
              <h3 className="text-base font-semibold text-on-surface mb-2">1. Seleção</h3>
              <p className="text-xs text-secondary leading-relaxed">
                Escolha o plano principal e selecione as soluções adicionais ideais para seu negócio.
              </p>
            </div>

            {/* Step 2 */}
            <div className="bg-surface-card rounded-2xl p-6 border border-border-subtle card-shadow text-center relative hover:border-primary/30 hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
              <div className="w-12 h-12 bg-primary/10 text-primary rounded-full flex items-center justify-center mx-auto mb-4 font-bold shadow-inner">
                <FileText className="w-5 h-5" />
              </div>
              <h3 className="text-base font-semibold text-on-surface mb-2">2. Resumo</h3>
              <p className="text-xs text-secondary leading-relaxed">
                Confira o escopo selecionado e os valores detalhados no rodapé interativo.
              </p>
            </div>

            {/* Step 3 */}
            <div className="bg-surface-card rounded-2xl p-6 border border-border-subtle card-shadow text-center relative hover:border-primary/30 hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
              <div className="w-12 h-12 bg-primary/10 text-primary rounded-full flex items-center justify-center mx-auto mb-4 font-bold shadow-inner">
                <Handshake className="w-5 h-5" />
              </div>
              <h3 className="text-base font-semibold text-on-surface mb-2">3. Acordo</h3>
              <p className="text-xs text-secondary leading-relaxed">
                Assine digitalmente na tela. Você receberá a via eletrônica registrada.
              </p>
            </div>
          </div>
        </section>

        {/* Pricing Cards Section */}
        <section className="mb-16 scroll-mt-24" id="planos">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-xl font-bold tracking-tight text-on-surface">Planos Principais</h2>
              <p className="text-xs text-secondary mt-1">Selecione o plano central da sua presença digital</p>
            </div>
            {signedProposal && (
              <span className="text-xs bg-green-100 text-green-800 font-semibold px-2.5 py-1 rounded-full flex items-center gap-1.5">
                <Check className="w-3.5 h-3.5" /> Escopo Fechado
              </span>
            )}
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch">
            
            {PLANS.map((plan) => {
              const isSelected = selectedPlanId === plan.id;
              const isPopular = plan.id === 'profissional';
              
              return (
                <div 
                  key={plan.id}
                  onClick={() => {
                    if (signedProposal) return; // Locked if signed
                    setSelectedPlanId(plan.id);
                  }}
                  className={`bg-surface-card rounded-2xl p-6 border flex flex-col relative transition-all duration-300 cursor-pointer ${
                    isSelected 
                      ? 'border-primary ring-2 ring-primary/20 scale-[1.03] shadow-xl -translate-y-1 z-10' 
                      : 'border-border-subtle hover:border-purple-300 hover:shadow-xl hover:-translate-y-1'
                  } ${signedProposal ? 'pointer-events-none opacity-85' : ''}`}
                  id={`plan_card_${plan.id}`}
                >
                  {isPopular && (
                    <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-primary text-on-primary px-3.5 py-1 rounded-full font-bold text-[9px] uppercase tracking-wider shadow-sm">
                      Mais Popular
                    </div>
                  )}

                  <div className="mb-6 pt-2">
                    <h3 className={`text-lg font-bold ${isSelected ? 'text-primary' : 'text-on-surface'}`}>{plan.name}</h3>
                    <div className="text-secondary text-xs mt-1 min-h-[16px]">{plan.subtitle}</div>
                    <div className="mt-4 flex items-baseline">
                      <span className="text-sm font-semibold text-secondary mr-1">R$</span>
                      <span className="text-3xl font-extrabold tracking-tight text-on-surface">
                        {plan.price.toLocaleString('pt-BR')}
                      </span>
                      <span className="text-xs text-secondary ml-1 font-medium">/mês</span>
                    </div>
                    <div className="text-[11px] text-secondary mt-1">
                      Setup: <span className="font-semibold text-on-surface">R$ {plan.setup.toLocaleString('pt-BR')}</span> (único)
                    </div>
                  </div>

                  <ul className="space-y-3 mb-8 flex-grow">
                    {plan.features.map((feature, idx) => (
                      <li key={idx} className="flex items-start gap-2.5 text-xs text-secondary leading-normal">
                        <Check className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>

                  <button 
                    disabled={!!signedProposal}
                    className={`w-full py-2.5 px-4 rounded-xl font-semibold text-xs transition-all active:scale-95 text-center ${
                      isSelected 
                        ? 'bg-primary text-on-primary hover:bg-surface-tint shadow-sm' 
                        : 'border border-primary text-primary hover:bg-primary/5'
                    }`}
                    id={`select_btn_${plan.id}`}
                  >
                    {isSelected ? 'Selecionado' : 'Selecionar'}
                  </button>
                </div>
              );
            })}

          </div>
        </section>

        {/* Additional Services Section */}
        <section className="mb-16 scroll-mt-24" id="adicionais">
          <div className="mb-6">
            <h2 className="text-xl font-bold tracking-tight text-on-surface">Serviços Adicionais</h2>
            <p className="text-xs text-secondary mt-1">Potencialize seus resultados com canais e recorrência mensal</p>
          </div>

          <div className="bg-surface-card rounded-2xl border border-border-subtle card-shadow overflow-hidden">
            {ADDITIONAL_SERVICES.map((service) => {
              const isChecked = selectedServices.includes(service.id);
              
              return (
                <div 
                  key={service.id}
                  onClick={() => {
                    if (signedProposal) return; // Locked if signed
                    toggleService(service.id);
                  }}
                  className={`p-5 border-b last:border-b-0 border-border-subtle flex items-center justify-between transition-all duration-300 cursor-pointer ${
                    isChecked 
                      ? 'bg-primary-container/10' 
                      : 'hover:bg-surface-container-low'
                  } ${signedProposal ? 'pointer-events-none opacity-85' : ''}`}
                  id={`service_item_${service.id}`}
                >
                  <div className="flex items-start gap-4">
                    <div className="mt-1 shrink-0">
                      <input 
                        type="checkbox"
                        checked={isChecked}
                        onChange={() => {}} // Controlled by outer div click
                        disabled={!!signedProposal}
                        className="w-5 h-5 rounded-md border-outline text-primary focus:ring-primary focus:ring-offset-0 transition-colors"
                        id={`checkbox_${service.id}`}
                      />
                    </div>
                    <div>
                      <h4 className="text-sm font-semibold text-on-surface">{service.name}</h4>
                      <p className="text-xs text-secondary mt-1">{service.desc}</p>
                    </div>
                  </div>

                  <div className="font-semibold text-sm md:text-base text-on-surface whitespace-nowrap ml-4 pl-2 text-right">
                    + R$ {service.price.toLocaleString('pt-BR')}
                    <span className="text-xs font-normal text-secondary block">/mês</span>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Informative Security Disclaimer */}
        <section className="p-5 bg-surface-container-low rounded-2xl border border-border-subtle flex items-start gap-4 mb-12">
          <Info className="w-5 h-5 text-primary shrink-0 mt-0.5" />
          <div>
            <h4 className="text-xs font-semibold text-on-surface">Segurança da Assinatura</h4>
            <p className="text-[11px] text-secondary leading-relaxed mt-1">
              Esta proposta comercial é um documento eletrônico certificado de acordo com a MP nº 2.200-2/2001. A assinatura eletrônica possui validade jurídica respaldada pela legislação brasileira, registrando o carimbo de tempo, IP e dados declarados.
            </p>
          </div>
        </section>
      </main>

      {/* Sticky Bottom Summary CTA bar */}
      <div className="fixed bottom-0 left-0 w-full bg-surface-card border-t border-border-subtle shadow-[0_-4px_20px_rgba(46,71,115,0.08)] z-35 px-6 py-4">
        <div className="max-w-[900px] mx-auto flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-4 text-center sm:text-left">
            <div className="flex flex-col">
              <span className="text-[10px] font-bold text-secondary uppercase tracking-wider">Investimento</span>
              <div className="flex items-baseline gap-2.5 mt-0.5">
                <span className="text-xl md:text-2xl font-black text-primary">
                  R$ {totalMonthly.toLocaleString('pt-BR')}
                </span>
                <span className="text-xs text-secondary font-medium">/mês</span>
                <span className="text-gray-300 text-sm">|</span>
                <span className="text-xs text-secondary">
                  Setup R$ {planSetupPrice.toLocaleString('pt-BR')}
                </span>
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <button 
              onClick={() => setIsSummaryOpen(true)}
              className="flex-1 sm:flex-none px-5 py-3 rounded-xl border border-primary text-primary font-bold text-xs hover:bg-primary/5 transition-all text-center"
              id="sticky_view_summary_btn"
            >
              Ver Resumo
            </button>
            
            {signedProposal ? (
              <div className="flex-1 sm:flex-none bg-green-100 text-green-800 border border-green-300 px-5 py-3 rounded-xl font-bold text-xs flex items-center justify-center gap-2">
                <CheckCircle2 className="w-4 h-4" /> Proposta Assinada
              </div>
            ) : (
              <button 
                onClick={() => setIsSigningOpen(true)}
                className="flex-1 sm:flex-none px-6 py-3 rounded-xl bg-tertiary-container text-on-tertiary-container font-bold text-xs hover:bg-orange-800 transition-all shadow-sm text-center active:scale-95"
                id="sticky_sign_btn"
              >
                Assinar Proposta
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Footer Details */}
      <footer className="w-full py-12 px-6 bg-surface-container-lowest border-t border-border-subtle mt-16">
        <div className="max-w-[900px] mx-auto flex flex-col md:flex-row justify-between items-center gap-4 text-center md:text-left">
          <div className="text-xs tracking-wider text-secondary">
            © 2026 HUBZY DIGITAL. TODOS OS DIREITOS RESERVADOS.
          </div>
          <div className="flex items-center gap-6 text-xs text-secondary">
            <a href="#" className="hover:text-primary underline">Política de Privacidade</a>
            <a href="#" className="hover:text-primary underline">Termos de Serviço</a>
            <a href="#" className="hover:text-primary underline">Suporte Técnico</a>
          </div>
        </div>
      </footer>

      {/* MODAL 1: Resumo da Proposta */}
      <AnimatePresence>
        {isSummaryOpen && (
          <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-2xl max-w-lg w-full overflow-hidden shadow-2xl border border-border-subtle flex flex-col"
              id="summary_modal"
            >
              <div className="p-6 border-b border-border-subtle flex justify-between items-center bg-surface-container-low">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-primary" />
                  <h3 className="text-base font-bold text-on-surface">Resumo Técnico do Escopo</h3>
                </div>
                <button 
                  onClick={() => setIsSummaryOpen(false)}
                  className="text-gray-400 hover:text-on-surface p-1 rounded-full hover:bg-surface-container-highest transition-colors"
                  id="close_summary_modal_btn"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-6 space-y-5 overflow-y-auto max-h-[70vh]">
                <div>
                  <span className="text-[10px] font-bold text-secondary uppercase tracking-widest block mb-1">Cliente Beneficiário</span>
                  <div className="text-sm font-semibold text-on-surface">{clientName}</div>
                </div>

                <div className="border-t border-border-subtle pt-4">
                  <span className="text-[10px] font-bold text-secondary uppercase tracking-widest block mb-2">Plano Principal Escolhido</span>
                  <div className="bg-primary/5 rounded-xl p-4 border border-primary/15 flex justify-between items-center">
                    <div>
                      <div className="text-sm font-bold text-primary">{currentPlan.name}</div>
                      <div className="text-xs text-secondary mt-0.5">{currentPlan.subtitle}</div>
                    </div>
                    <div className="text-right">
                      <div className="text-base font-black text-on-surface">R$ {planMonthlyPrice.toLocaleString('pt-BR')}</div>
                      <div className="text-[10px] text-secondary">taxa de ativação única</div>
                    </div>
                  </div>
                </div>

                <div className="border-t border-border-subtle pt-4">
                  <span className="text-[10px] font-bold text-secondary uppercase tracking-widest block mb-2">Serviços Adicionais Adicionados</span>
                  {selectedServices.length === 0 ? (
                    <div className="text-xs text-gray-400 italic">Nenhum serviço recorrente selecionado.</div>
                  ) : (
                    <div className="space-y-2">
                      {selectedServices.map(serviceId => {
                        const service = ADDITIONAL_SERVICES.find(s => s.id === serviceId);
                        if (!service) return null;
                        return (
                          <div key={service.id} className="flex justify-between items-center text-xs p-2.5 bg-surface-container-low rounded-lg border border-border-subtle">
                            <div>
                              <div className="font-semibold text-on-surface">{service.name}</div>
                            </div>
                            <div className="font-bold text-on-surface">
                              + R$ {service.price.toLocaleString('pt-BR')}/mês
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>

                <div className="border-t border-border-subtle pt-4 bg-primary/5 -mx-6 -mb-6 p-6 space-y-3">
                  <div className="flex justify-between items-center text-xs text-secondary">
                    <span>Setup / implantação (único):</span>
                    <span className="font-bold text-on-surface">R$ {planSetupPrice.toLocaleString('pt-BR')}</span>
                  </div>
                  <div className="flex justify-between items-center text-xs text-secondary">
                    <span>Mensalidade base ({currentPlan.name}):</span>
                    <span className="font-bold text-on-surface">R$ {planMonthlyPrice.toLocaleString('pt-BR')}/mês</span>
                  </div>
                  {servicesMonthlyPrice > 0 && (
                    <div className="flex justify-between items-center text-xs text-secondary">
                      <span>Adicionais:</span>
                      <span className="font-bold text-on-surface">+ R$ {servicesMonthlyPrice.toLocaleString('pt-BR')}/mês</span>
                    </div>
                  )}
                  <div className="border-t border-dashed border-primary/20 pt-3 flex justify-between items-center">
                    <span className="text-xs font-bold text-primary">Total mensal:</span>
                    <div className="text-right">
                      <span className="text-lg font-black text-primary">R$ {totalMonthly.toLocaleString('pt-BR')}/mês</span>
                      <span className="text-[10px] text-secondary block mt-0.5">+ setup R$ {planSetupPrice.toLocaleString('pt-BR')} na adesão</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-4 border-t border-border-subtle flex justify-end gap-2.5 bg-surface-container-low">
                <button 
                  onClick={() => setIsSummaryOpen(false)}
                  className="px-4 py-2 border border-outline-variant rounded-xl text-xs font-semibold hover:bg-surface-container-highest transition-colors"
                  id="summary_back_btn"
                >
                  Voltar
                </button>
                <button 
                  onClick={() => {
                    setIsSummaryOpen(false);
                    setIsSigningOpen(true);
                  }}
                  className="px-5 py-2 bg-primary text-on-primary rounded-xl text-xs font-semibold hover:bg-surface-tint transition-colors"
                  id="summary_to_sign_btn"
                >
                  Ir para Assinatura
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* MODAL 2: Assinatura da Proposta */}
      <AnimatePresence>
        {isSigningOpen && (
          <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 overflow-y-auto">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-2xl max-w-xl w-full overflow-hidden shadow-2xl border border-border-subtle flex flex-col my-8"
              id="signing_modal"
            >
              <div className="p-5 border-b border-border-subtle flex justify-between items-center bg-surface-container-low">
                <div className="flex items-center gap-2">
                  <Handshake className="w-5 h-5 text-primary" />
                  <h3 className="text-base font-bold text-on-surface">Assinatura Digital da Proposta</h3>
                </div>
                <button 
                  onClick={() => setIsSigningOpen(false)}
                  className="text-gray-400 hover:text-on-surface p-1 rounded-full hover:bg-surface-container-highest transition-colors"
                  id="close_signing_modal_btn"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSignatureSubmit} className="flex flex-col flex-grow">
                <div className="p-5 space-y-4 overflow-y-auto max-h-[70vh]">
                  
                  {signingError && (
                    <div className="p-3.5 bg-red-50 border border-red-200 rounded-xl text-red-800 text-xs flex items-start gap-2.5">
                      <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                      <span>{signingError}</span>
                    </div>
                  )}

                  <div className="bg-primary/5 rounded-xl p-4 border border-primary/10 text-xs text-secondary leading-relaxed">
                    Você está assinando a proposta para: <strong>{clientName}</strong>. <br />
                    Escopo: <strong>Plano {currentPlan.name}</strong> 
                    {selectedServices.length > 0 && ` + ${selectedServices.length} serviço(s) adicional(is)`}.
                  </div>

                  {/* Input Fields */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-[10px] font-bold text-secondary uppercase tracking-widest block mb-1">
                        Seu Nome Completo *
                      </label>
                      <input 
                        type="text"
                        required
                        value={signerName}
                        onChange={(e) => {
                          setSignerName(e.target.value);
                          if (signatureType === 'type') {
                            setTypedSignature(e.target.value);
                          }
                        }}
                        placeholder="Ex: João da Silva Santos"
                        className="w-full border border-border-subtle rounded-xl px-3.5 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                        id="signer_name_field"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] font-bold text-secondary uppercase tracking-widest block mb-1">
                        Seu E-mail Corporativo *
                      </label>
                      <input 
                        type="email"
                        required
                        value={signerEmail}
                        onChange={(e) => setSignerEmail(e.target.value)}
                        placeholder="Ex: joao@centroautomotivo.com.br"
                        className="w-full border border-border-subtle rounded-xl px-3.5 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                        id="signer_email_field"
                      />
                    </div>
                  </div>

                  {/* Signature Type Tabs */}
                  <div className="border-t border-border-subtle pt-4">
                    <span className="text-[10px] font-bold text-secondary uppercase tracking-widest block mb-2">
                      Como deseja assinar?
                    </span>
                    <div className="flex bg-surface-container-low p-1 rounded-xl gap-1">
                      <button
                        type="button"
                        onClick={() => setSignatureType('draw')}
                        className={`flex-1 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                          signatureType === 'draw' 
                            ? 'bg-white text-primary shadow-sm' 
                            : 'text-secondary hover:text-on-surface'
                        }`}
                        id="tab_draw_btn"
                      >
                        Desenhar na Tela
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setSignatureType('type');
                          if (!typedSignature && signerName) {
                            setTypedSignature(signerName);
                          }
                        }}
                        className={`flex-1 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                          signatureType === 'type' 
                            ? 'bg-white text-primary shadow-sm' 
                            : 'text-secondary hover:text-on-surface'
                        }`}
                        id="tab_type_btn"
                      >
                        Digitar Assinatura
                      </button>
                    </div>
                  </div>

                  {/* Signature Inputs */}
                  {signatureType === 'draw' ? (
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-[10px] font-bold text-secondary uppercase tracking-widest">
                          Faça sua assinatura abaixo:
                        </span>
                        <button
                          type="button"
                          onClick={clearCanvas}
                          className="text-[10px] font-bold text-primary hover:underline flex items-center gap-1 p-1 rounded hover:bg-primary/5 transition-colors"
                          id="clear_canvas_btn"
                        >
                          <RotateCcw className="w-3 h-3" /> Limpar Tela
                        </button>
                      </div>
                      
                      <div className="border-2 border-dashed border-border-subtle rounded-xl bg-gray-50 overflow-hidden relative h-36">
                        <canvas
                          ref={canvasRef}
                          width={520}
                          height={144}
                          onMouseDown={startDrawing}
                          onMouseMove={draw}
                          onMouseUp={stopDrawing}
                          onMouseLeave={stopDrawing}
                          onTouchStart={startDrawing}
                          onTouchMove={draw}
                          onTouchEnd={stopDrawing}
                          className="w-full h-full cursor-crosshair absolute inset-0 touch-none"
                        />
                        {!hasDrawn && (
                          <div className="absolute inset-0 flex items-center justify-center text-gray-400 text-xs pointer-events-none select-none">
                            Use o mouse ou seu dedo para desenhar a assinatura
                          </div>
                        )}
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold text-secondary uppercase tracking-widest block">
                        Assinatura Cursiva Gerada:
                      </label>
                      <input 
                        type="text"
                        value={typedSignature}
                        onChange={(e) => setTypedSignature(e.target.value)}
                        placeholder="Nome para exibição na assinatura"
                        className="w-full border border-border-subtle rounded-xl px-3.5 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                        id="typed_sig_input"
                      />
                      <div className="border border-border-subtle rounded-xl bg-purple-50/30 p-5 text-center min-h-[80px] flex items-center justify-center">
                        <span className="font-serif italic text-2xl text-primary font-light select-none tracking-wider">
                          {typedSignature || 'Sua Assinatura'}
                        </span>
                      </div>
                    </div>
                  )}

                  {/* Agreement Terms */}
                  <div className="border-t border-border-subtle pt-4 flex items-start gap-2.5">
                    <input 
                      type="checkbox"
                      required
                      id="accept_terms_cb"
                      checked={termsAccepted}
                      onChange={(e) => setTermsAccepted(e.target.checked)}
                      className="mt-0.5 w-4 h-4 rounded border-outline text-primary focus:ring-primary focus:ring-offset-0"
                    />
                    <label htmlFor="accept_terms_cb" className="text-[11px] text-secondary leading-relaxed select-none cursor-pointer">
                      Declaro que revisei os planos, valores e concordo em formalizar o aceite eletrônico desta Proposta Comercial sob as condições descritas no documento de Hubzy Digital.
                    </label>
                  </div>

                </div>

                <div className="p-4 border-t border-border-subtle flex justify-end gap-2.5 bg-surface-container-low">
                  <button 
                    type="button"
                    onClick={() => setIsSigningOpen(false)}
                    className="px-4 py-2 border border-outline-variant rounded-xl text-xs font-semibold hover:bg-surface-container-highest transition-colors"
                    id="sign_back_btn"
                  >
                    Voltar
                  </button>
                  <button 
                    type="submit"
                    className="px-5 py-2.5 bg-primary text-on-primary rounded-xl text-xs font-bold hover:bg-surface-tint transition-colors flex items-center gap-2"
                    id="confirm_sign_btn"
                  >
                    <Check className="w-4 h-4" /> Confirmar Assinatura
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* MODAL GERADOR DE PROPOSTAS */}
      <AnimatePresence>
        {isGeneratorOpen && (
          <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4 overflow-y-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-2xl max-w-xl w-full overflow-hidden shadow-2xl border border-border-subtle flex flex-col my-8"
              id="generator_modal"
            >
              <div className="p-5 border-b border-border-subtle flex justify-between items-center bg-surface-container-low">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-primary" />
                  <h3 className="text-base font-bold text-on-surface">Gerar nova proposta</h3>
                </div>
                {proposalReady && (
                  <button
                    onClick={() => setIsGeneratorOpen(false)}
                    className="text-gray-400 hover:text-on-surface p-1 rounded-full hover:bg-surface-container-highest transition-colors"
                    id="close_generator_btn"
                  >
                    <X className="w-5 h-5" />
                  </button>
                )}
              </div>

              <div className="p-5 space-y-4 overflow-y-auto max-h-[75vh]">
                <p className="text-xs text-secondary leading-relaxed">
                  Preencha os dados do cliente. O plano e serviços adicionais são selecionados diretamente na proposta.
                </p>

                {/* Dados do cliente */}
                <div>
                  <span className="text-[10px] font-bold text-secondary uppercase tracking-widest block mb-2">Dados do cliente</span>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div className="md:col-span-2">
                      <label className="text-[11px] font-semibold text-secondary block mb-1">Nome da empresa *</label>
                      <input
                        type="text"
                        value={proposalConfig.clientName}
                        onChange={e => setProposalConfig(p => ({ ...p, clientName: e.target.value }))}
                        placeholder="Ex: Centro Automotivo São Paulo Ltda"
                        className="w-full border border-border-subtle rounded-xl px-3.5 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                        id="gen_company"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] font-semibold text-secondary block mb-1">CNPJ / CPF</label>
                      <input
                        type="text"
                        value={proposalConfig.clientCnpj}
                        onChange={e => setProposalConfig(p => ({ ...p, clientCnpj: e.target.value }))}
                        placeholder="00.000.000/0001-00"
                        className="w-full border border-border-subtle rounded-xl px-3.5 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                        id="gen_cnpj"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] font-semibold text-secondary block mb-1">Responsável *</label>
                      <input
                        type="text"
                        value={proposalConfig.clientResponsible}
                        onChange={e => setProposalConfig(p => ({ ...p, clientResponsible: e.target.value }))}
                        placeholder="Nome do responsável"
                        className="w-full border border-border-subtle rounded-xl px-3.5 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                        id="gen_responsible"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] font-semibold text-secondary block mb-1">E-mail do cliente</label>
                      <input
                        type="email"
                        value={proposalConfig.clientEmail}
                        onChange={e => setProposalConfig(p => ({ ...p, clientEmail: e.target.value }))}
                        placeholder="cliente@empresa.com.br"
                        className="w-full border border-border-subtle rounded-xl px-3.5 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                        id="gen_email"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] font-semibold text-secondary block mb-1">Telefone / WhatsApp</label>
                      <input
                        type="text"
                        value={proposalConfig.clientPhone}
                        onChange={e => setProposalConfig(p => ({ ...p, clientPhone: e.target.value }))}
                        placeholder="(19) 99999-9999"
                        className="w-full border border-border-subtle rounded-xl px-3.5 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                        id="gen_phone"
                      />
                    </div>
                  </div>
                </div>

                {/* Validade */}
                <div>
                  <span className="text-[10px] font-bold text-secondary uppercase tracking-widest block mb-2">Validade da proposta</span>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div>
                      <label className="text-[11px] font-semibold text-secondary block mb-1">Válida até</label>
                      <input
                        type="date"
                        value={proposalConfig.validityDate}
                        onChange={e => setProposalConfig(p => ({ ...p, validityDate: e.target.value }))}
                        className="w-full border border-border-subtle rounded-xl px-3.5 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                        id="gen_validity"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] font-semibold text-secondary block mb-1">Seu e-mail (notificação de aceite)</label>
                      <input
                        type="email"
                        value={proposalConfig.notifyEmail}
                        onChange={e => setProposalConfig(p => ({ ...p, notifyEmail: e.target.value }))}
                        placeholder="suporte@hubzydigital.dev.br"
                        className="w-full border border-border-subtle rounded-xl px-3.5 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                        id="gen_notify"
                      />
                    </div>
                  </div>
                </div>

                {/* Observação */}
                <div>
                  <span className="text-[10px] font-bold text-secondary uppercase tracking-widest block mb-2">Observação personalizada (opcional)</span>
                  <textarea
                    value={proposalConfig.observation}
                    onChange={e => setProposalConfig(p => ({ ...p, observation: e.target.value }))}
                    placeholder="Ex: Proposta elaborada após reunião de 23/06. Inclui desconto de lançamento de 10% no setup."
                    rows={3}
                    className="w-full border border-border-subtle rounded-xl px-3.5 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary resize-none"
                    id="gen_obs"
                  />
                </div>

                {/* Plano pré-selecionado */}
                <div>
                  <span className="text-[10px] font-bold text-secondary uppercase tracking-widest block mb-2">Plano pré-selecionado</span>
                  <div className="grid grid-cols-3 gap-2">
                    {PLANS.map(plan => (
                      <button
                        key={plan.id}
                        type="button"
                        onClick={() => setSelectedPlanId(plan.id)}
                        className={`p-3 rounded-xl border text-left transition-all ${
                          selectedPlanId === plan.id
                            ? 'border-primary bg-primary/5 ring-2 ring-primary/20'
                            : 'border-border-subtle hover:border-primary/40'
                        }`}
                      >
                        <div className="text-xs font-bold text-on-surface">{plan.name}</div>
                        <div className="text-sm font-black text-primary mt-0.5">R${plan.price}<span className="text-[10px] font-normal text-secondary">/mês</span></div>
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="p-4 border-t border-border-subtle bg-surface-container-low flex flex-col gap-3">
                {generatedLink && (
                  <div className="bg-primary/5 border border-primary/20 rounded-xl p-3 space-y-2">
                    <div className="text-[10px] font-bold text-primary uppercase tracking-widest">Link da proposta gerado</div>
                    <div className="text-[11px] text-secondary break-all font-mono bg-white border border-border-subtle rounded-lg px-3 py-2 leading-relaxed">
                      {generatedLink}
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={copyLink}
                        className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${linkCopied ? 'bg-green-100 text-green-700 border border-green-300' : 'bg-primary text-white hover:bg-surface-tint'}`}
                      >
                        {linkCopied ? <><CheckCircle2 className="w-3.5 h-3.5" /> Copiado!</> : <><Share2 className="w-3.5 h-3.5" /> Copiar link</>}
                      </button>
                      <a
                        href={`https://wa.me/?text=${encodeURIComponent('Olá! Segue sua proposta comercial Hubzy Digital: ' + generatedLink)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-1 py-2 rounded-lg text-xs font-bold bg-green-500 text-white hover:bg-green-600 transition-all flex items-center justify-center gap-1.5"
                      >
                        Enviar WhatsApp
                      </a>
                    </div>
                  </div>
                )}
                <div className="flex justify-end gap-2.5">
                  {proposalReady && (
                    <button
                      onClick={() => setIsGeneratorOpen(false)}
                      className="px-4 py-2 border border-outline-variant rounded-xl text-xs font-semibold hover:bg-surface-container-highest transition-colors"
                      id="gen_cancel_btn"
                    >
                      {generatedLink ? 'Ver proposta' : 'Cancelar'}
                    </button>
                  )}
                  <button
                    onClick={handleGeneratorSubmit}
                    disabled={!proposalConfig.clientName.trim() || !proposalConfig.clientResponsible.trim()}
                    className="px-5 py-2.5 bg-primary text-on-primary rounded-xl text-xs font-bold hover:bg-surface-tint transition-colors flex items-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed"
                    id="gen_submit_btn"
                  >
                    <ChevronRight className="w-4 h-4" /> {generatedLink ? 'Atualizar link' : 'Gerar link da proposta'}
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
