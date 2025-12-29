'use client';

import { useState, useEffect, useRef } from 'react';
import { useLanguageContext } from '../i18n/LanguageProvider';
import { Play, Database, Brain, MessageCircle, MousePointer2, Plus, Droplets, Cloud, X, Bug, Package, Satellite } from 'lucide-react';

// Position type
type BlockPositions = Record<string, { x: number; y: number }>;

// Initial block positions for default demo
const initialPositions: BlockPositions = {
  trigger: { x: 20, y: 80 },
  integration: { x: 245, y: 30 },
  ai: { x: 500, y: 30 },
  whatsapp: { x: 745, y: 30 }
};

// Use case specific positions (5 blocks layout) - Irrigation
const irrigationPositions: BlockPositions = {
  trigger: { x: 20, y: 100 },
  wiseconn: { x: 180, y: 30 },
  weather: { x: 180, y: 170 },
  ai: { x: 420, y: 100 },
  whatsapp: { x: 660, y: 100 }
};

// Use case specific positions (6 blocks layout) - Pest Monitoring
const pestPositions: BlockPositions = {
  trigger: { x: 15, y: 200 },
  inventory: { x: 180, y: 10 },
  weather: { x: 180, y: 110 },
  ndvi: { x: 180, y: 260 },
  pests: { x: 180, y: 400 },
  ai: { x: 430, y: 200 },
  whatsapp: { x: 680, y: 200 }
};

// Connection type
type Connection = { from: string; to: string };

// Initial connections
const initialConnections: Connection[] = [
  { from: 'trigger', to: 'integration' },
  { from: 'integration', to: 'ai' },
  { from: 'ai', to: 'whatsapp' }
];

// Irrigation use case connections
const irrigationConnections: Connection[] = [
  { from: 'trigger', to: 'wiseconn' },
  { from: 'trigger', to: 'weather' },
  { from: 'wiseconn', to: 'ai' },
  { from: 'weather', to: 'ai' },
  { from: 'ai', to: 'whatsapp' }
];

// Pest monitoring use case connections
const pestConnections: Connection[] = [
  { from: 'trigger', to: 'inventory' },
  { from: 'trigger', to: 'weather' },
  { from: 'trigger', to: 'ndvi' },
  { from: 'trigger', to: 'pests' },
  { from: 'inventory', to: 'ai' },
  { from: 'weather', to: 'ai' },
  { from: 'ndvi', to: 'ai' },
  { from: 'pests', to: 'ai' },
  { from: 'ai', to: 'whatsapp' }
];

// Use case type
type UseCase = 'default' | 'irrigation' | 'pests';

// Block popup info for irrigation use case
const irrigationPopups = {
  trigger: {
    es: 'Ejecuta el workflow automáticamente cada mañana a las 6:00 AM para calcular las necesidades de riego del día.',
    en: 'Runs the workflow automatically every morning at 6:00 AM to calculate daily irrigation needs.'
  },
  wiseconn: {
    es: 'Conecta con Dropcontrol de Wiseconn para obtener datos de humedad del suelo, estado de válvulas y programas de riego actuales.',
    en: 'Connects to Wiseconn Dropcontrol to get soil moisture data, valve status and current irrigation schedules.'
  },
  weather: {
    es: 'Obtiene datos meteorológicos de estaciones INIA, temperatura, humedad relativa, radiación solar y velocidad del viento para calcular ET0.',
    en: 'Gets weather data from INIA stations, temperature, relative humidity, solar radiation and wind speed to calculate ET0.'
  },
  ai: {
    es: 'Calcula ET0 (evapotranspiración de referencia), aplica Kc del cultivo según su etapa fenológica y determina si se necesita regar hoy o no.',
    en: 'Calculates ET0 (reference evapotranspiration), applies crop Kc based on phenological stage and determines if irrigation is needed today.'
  },
  whatsapp: {
    es: 'Envía recomendación de riego al encargado: "Regar Cuartel 3 por 2.5 horas. ET0: 4.2mm, Kc: 0.85, Déficit: 12mm"',
    en: 'Sends irrigation recommendation to manager: "Irrigate Block 3 for 2.5 hours. ET0: 4.2mm, Kc: 0.85, Deficit: 12mm"'
  }
};

// Block popup info for pest monitoring use case
const pestPopups = {
  trigger: {
    es: 'Ejecuta el workflow cada 6 horas para monitorear cambios en clima, plagas y disponibilidad de productos fitosanitarios.',
    en: 'Runs the workflow every 6 hours to monitor changes in weather, pests and phytosanitary product availability.'
  },
  inventory: {
    es: 'Conecta con Agroinventario para obtener el stock actual de productos fitosanitarios: fungicidas, insecticidas, herbicidas y sus fechas de vencimiento.',
    en: 'Connects to Agroinventario to get current stock of phytosanitary products: fungicides, insecticides, herbicides and expiration dates.'
  },
  weather: {
    es: 'Monitorea pronóstico de lluvias, humedad y temperatura. Condiciones de alta humedad favorecen el desarrollo de hongos como Botrytis y Mildiu.',
    en: 'Monitors rain forecast, humidity and temperature. High humidity conditions favor fungal development like Botrytis and Mildew.'
  },
  ndvi: {
    es: 'Analiza imágenes satelitales NDVI para detectar estrés vegetal temprano, zonas con baja vigorosidad y posibles focos de enfermedad antes de que sean visibles.',
    en: 'Analyzes NDVI satellite imagery to detect early plant stress, low vigor zones and possible disease outbreaks before they become visible.'
  },
  pests: {
    es: 'Recopila datos de monitoreo de plagas registrados en MIIDO: trampas, conteos visuales, síntomas reportados por trabajadores en terreno.',
    en: 'Collects pest monitoring data recorded in MIIDO: traps, visual counts, symptoms reported by field workers.'
  },
  ai: {
    es: 'Cruza pronóstico de lluvia + inventario + historial de plagas. Predice riesgo de brotes y verifica disponibilidad de productos preventivos como Mancozeb o Captan.',
    en: 'Cross-references rain forecast + inventory + pest history. Predicts outbreak risk and verifies availability of preventive products like Mancozeb or Captan.'
  },
  whatsapp: {
    es: '⚠️ "Alerta: Lluvia pronosticada en 48hrs. No hay stock de Mancozeb 80 WP. Últimos reportes muestran Botrytis en Cuartel 5. Acción recomendada: adquirir fungicida preventivo."',
    en: '⚠️ "Alert: Rain forecast in 48hrs. No stock of Mancozeb 80 WP. Recent reports show Botrytis in Block 5. Recommended action: acquire preventive fungicide."'
  }
};

interface WorkflowBuilderProps {
  simpleMode?: boolean;
}

const WorkflowBuilder = ({ simpleMode = false }: WorkflowBuilderProps) => {
  const { language } = useLanguageContext();
  const [currentStep, setCurrentStep] = useState(0);
  const [animationStep, setAnimationStep] = useState(0);
  const [isAnimating, setIsAnimating] = useState(true);
  const [isVisible, setIsVisible] = useState(false);
  const [blockPositions, setBlockPositions] = useState(initialPositions);
  const [draggingBlock, setDraggingBlock] = useState<string | null>(null);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [connections, setConnections] = useState<Connection[]>([]);
  const [draggingConnection, setDraggingConnection] = useState<{ from: string; mousePos: { x: number; y: number } } | null>(null);
  const [selectedUseCase, setSelectedUseCase] = useState<UseCase>('default');
  const [useCaseAnimating, setUseCaseAnimating] = useState(false);
  const [useCaseStep, setUseCaseStep] = useState(0);
  const [activePopup, setActivePopup] = useState<string | null>(null);
  const sectionRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLDivElement>(null);



  // Intersection Observer for triggering animation
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !isVisible) {
          setIsVisible(true);
        }
      },
      { threshold: 0.3 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, [isVisible]);

  // State to track animation cycle for looping
  const [animationCycle, setAnimationCycle] = useState(0);

  // Animation sequence - loops in simpleMode, runs once otherwise
  useEffect(() => {
    if (!isVisible || !isAnimating) return;

    const steps = [
      { delay: 500, step: 1 },   // Trigger appears
      { delay: 1500, step: 2 },  // Mouse moves to add integration
      { delay: 2500, step: 3 },  // Integration block appears
      { delay: 3500, step: 4 },  // Connection line 1 appears
      { delay: 4500, step: 5 },  // AI block appears
      { delay: 5500, step: 6 },  // Connection line 2 appears
      { delay: 6500, step: 7 },  // WhatsApp block appears
      { delay: 7500, step: 8 },  // Complete
    ];

    const timeouts: NodeJS.Timeout[] = [];

    // Reset animation step at the start of each cycle
    setAnimationStep(0);

    steps.forEach(({ delay, step }) => {
      const timeout = setTimeout(() => {
        setAnimationStep(step);
      }, delay);
      timeouts.push(timeout);
    });

    // Handle completion
    const completionTimeout = setTimeout(() => {
      if (simpleMode) {
        // In simpleMode, trigger a new animation cycle after a brief pause
        setAnimationCycle(prev => prev + 1);
      } else {
        // Animation complete - switch to interactive mode
        setIsAnimating(false);
        setCurrentStep(3); // Show all blocks active
        setConnections(initialConnections); // Set initial connections
      }
    }, 9000);
    timeouts.push(completionTimeout);

    return () => timeouts.forEach(t => clearTimeout(t));
  }, [isVisible, isAnimating, simpleMode, animationCycle]);

  // Cursor positions for animation
  const getCursorPosition = () => {
    switch (animationStep) {
      case 1: return { x: 100, y: 120 };
      case 2: return { x: 280, y: 60 };
      case 3: return { x: 280, y: 60 };
      case 4: return { x: 450, y: 60 };
      case 5: return { x: 530, y: 60 };
      case 6: return { x: 700, y: 60 };
      case 7: return { x: 780, y: 60 };
      case 8: return { x: 850, y: 40 };
      default: return { x: 100, y: 120 };
    }
  };

  const cursorPos = getCursorPosition();

  // Get the effective step for display (animation step mapped to 0-3, or currentStep if interactive)
  const getDisplayStep = () => {
    if (isAnimating) {
      if (animationStep >= 7) return 3;
      if (animationStep >= 5) return 2;
      if (animationStep >= 3) return 1;
      if (animationStep >= 1) return 0;
      return -1;
    }
    return currentStep;
  };

  const displayStep = getDisplayStep();

  // Handle use case selection
  const handleUseCaseSelect = (useCase: UseCase) => {
    if (useCase === selectedUseCase || useCaseAnimating) return;

    setSelectedUseCase(useCase);
    setUseCaseAnimating(true);
    setUseCaseStep(0);
    setConnections([]);
    setActivePopup(null);

    if (useCase === 'irrigation') {
      // Set irrigation positions
      setBlockPositions(irrigationPositions);

      // Animate the irrigation use case
      const steps = [
        { delay: 300, step: 1 },   // Trigger appears
        { delay: 800, step: 2 },   // Wiseconn appears with popup
        { delay: 1800, step: 3 },  // Weather appears with popup
        { delay: 2800, step: 4 },  // AI appears with popup
        { delay: 3800, step: 5 },  // WhatsApp appears with popup
        { delay: 4800, step: 6 },  // All connected, interactive
      ];

      steps.forEach(({ delay, step }) => {
        setTimeout(() => {
          setUseCaseStep(step);
          if (step === 1) setActivePopup('trigger');
          if (step === 2) setActivePopup('wiseconn');
          if (step === 3) setActivePopup('weather');
          if (step === 4) setActivePopup('ai');
          if (step === 5) setActivePopup('whatsapp');
          if (step === 6) {
            setUseCaseAnimating(false);
            setConnections(irrigationConnections);
            setTimeout(() => setActivePopup(null), 2000);
          }
        }, delay);
      });
    } else if (useCase === 'pests') {
      // Set pest monitoring positions
      setBlockPositions(pestPositions);

      // Animate the pest monitoring use case
      const steps = [
        { delay: 300, step: 1 },   // Trigger appears
        { delay: 700, step: 2 },   // Inventory appears
        { delay: 1200, step: 3 },  // Weather appears
        { delay: 1700, step: 4 },  // NDVI appears
        { delay: 2200, step: 5 },  // Pests appears
        { delay: 2800, step: 6 },  // AI appears
        { delay: 3500, step: 7 },  // WhatsApp appears
        { delay: 4200, step: 8 },  // All connected, interactive
      ];

      steps.forEach(({ delay, step }) => {
        setTimeout(() => {
          setUseCaseStep(step);
          if (step === 1) setActivePopup('trigger');
          if (step === 2) setActivePopup('inventory');
          if (step === 3) setActivePopup('weather');
          if (step === 4) setActivePopup('ndvi');
          if (step === 5) setActivePopup('pests');
          if (step === 6) setActivePopup('ai');
          if (step === 7) setActivePopup('whatsapp');
          if (step === 8) {
            setUseCaseAnimating(false);
            setConnections(pestConnections);
            setTimeout(() => setActivePopup(null), 2000);
          }
        }, delay);
      });
    } else {
      // Reset to default
      setBlockPositions(initialPositions);
      setUseCaseAnimating(false);
      setUseCaseStep(0);
      setConnections(initialConnections);
    }
  };

  // Block drag handlers
  const handleMouseDown = (blockId: string, e: React.MouseEvent) => {
    if (isAnimating) return;
    e.stopPropagation();

    const rect = (e.target as HTMLElement).closest('.draggable-block')?.getBoundingClientRect();
    if (!rect) return;

    setDraggingBlock(blockId);
    setDragOffset({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!canvasRef.current) return;
    const canvasRect = canvasRef.current.getBoundingClientRect();

    // Handle block dragging
    if (draggingBlock) {
      const newX = e.clientX - canvasRect.left - dragOffset.x;
      const newY = e.clientY - canvasRect.top - dragOffset.y;

      // Constrain to canvas bounds
      const constrainedX = Math.max(0, Math.min(newX, canvasRect.width - 160));
      const constrainedY = Math.max(0, Math.min(newY, canvasRect.height - 180));

      setBlockPositions(prev => ({
        ...prev,
        [draggingBlock]: { x: constrainedX, y: constrainedY }
      }));
    }

    // Handle connection dragging
    if (draggingConnection) {
      const mouseX = e.clientX - canvasRect.left;
      const mouseY = e.clientY - canvasRect.top;
      setDraggingConnection(prev => prev ? { ...prev, mousePos: { x: mouseX, y: mouseY } } : null);
    }
  };

  const handleMouseUp = () => {
    setDraggingBlock(null);
    setDraggingConnection(null);
  };

  // Connection drag handlers
  const handleConnectionStart = (blockId: string, e: React.MouseEvent) => {
    if (isAnimating) return;
    e.stopPropagation();

    if (!canvasRef.current) return;
    const canvasRect = canvasRef.current.getBoundingClientRect();

    setDraggingConnection({
      from: blockId,
      mousePos: { x: e.clientX - canvasRect.left, y: e.clientY - canvasRect.top }
    });
  };

  const handleConnectionEnd = (blockId: string, e: React.MouseEvent) => {
    e.stopPropagation();

    if (draggingConnection && draggingConnection.from !== blockId) {
      // Check if connection already exists
      const connectionExists = connections.some(
        c => c.from === draggingConnection.from && c.to === blockId
      );

      if (!connectionExists) {
        // Add new connection
        setConnections(prev => [...prev, { from: draggingConnection.from, to: blockId }]);
      }
    }

    setDraggingConnection(null);
  };

  // Remove connection
  const handleRemoveConnection = (from: string, to: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setConnections(prev => prev.filter(c => !(c.from === from && c.to === to)));
  };

  // Get output connection point position
  const getOutputPos = (blockId: string) => {
    const pos = blockPositions[blockId];
    if (!pos) return { x: 0, y: 0 };
    return { x: pos.x + 144, y: pos.y + 32 };
  };

  // Get input connection point position
  const getInputPos = (blockId: string) => {
    const pos = blockPositions[blockId];
    if (!pos) return { x: 0, y: 0 };
    return { x: pos.x, y: pos.y + 32 };
  };

  // Calculate connection line paths based on block positions
  const getConnectionPath = (fromBlock: string, toBlock: string) => {
    const from = getOutputPos(fromBlock);
    const to = getInputPos(toBlock);

    // Create a smooth bezier curve
    const midX = (from.x + to.x) / 2;
    return `M ${from.x} ${from.y} C ${midX} ${from.y}, ${midX} ${to.y}, ${to.x} ${to.y}`;
  };

  // Get dragging connection path
  const getDraggingPath = () => {
    if (!draggingConnection) return '';
    const from = getOutputPos(draggingConnection.from);
    const to = draggingConnection.mousePos;
    const midX = (from.x + to.x) / 2;
    return `M ${from.x} ${from.y} C ${midX} ${from.y}, ${midX} ${to.y}, ${to.x} ${to.y}`;
  };

  // Get connection color based on target block
  const getConnectionColor = (toBlock: string) => {
    switch (toBlock) {
      case 'integration': return '#F97316';
      case 'ai': return '#14B8A6';
      case 'whatsapp': return '#22C55E';
      default: return '#6B7280';
    }
  };

  return (
    <section ref={sectionRef} className={`w-full ${simpleMode ? 'py-0' : 'py-16 md:py-24'}`}>
      <div className={simpleMode ? 'px-0' : 'container px-4 md:px-6'}>
        {/* Title - only show when not in simpleMode */}
        {!simpleMode && (
          <div className="text-center mb-12">
            <h2 className="text-3xl text-semibold tracking-tighter sm:text-5xl mb-4 text-gray-900 dark:text-white">
              {language === 'es' ? 'Crea tus propios Workflows' : 'Create your own Workflows'}
            </h2>
            <p className="mx-auto max-w-[700px] text-gray-500 md:text-xl dark:text-gray-400 text-light">
              {language === 'es'
                ? 'Automatiza procesos conectando integraciones, IA y WhatsApp en minutos. Sin código, sin complicaciones.'
                : 'Automate processes by connecting integrations, AI and WhatsApp in minutes. No code, no hassle.'}
            </p>
          </div>
        )}

        {/* Animation status indicator - Comentado */}
        {/* {isAnimating && (
          <div className="text-center mb-4">
            <span className="inline-flex items-center gap-2 px-4 py-2 bg-[#38507E]/10 text-[#38507E] rounded-full text-sm text-medium">
              <span className="w-2 h-2 bg-[#38507E] rounded-full animate-pulse"></span>
              {language === 'es' ? 'Creando workflow...' : 'Creating workflow...'}
            </span>
          </div>
        )} */}

        {/* Use Case Buttons - appear after initial animation (hidden in simpleMode) */}
        {!isAnimating && !simpleMode && (
          <div className="flex flex-wrap justify-center gap-3 mb-6">
            <button
              onClick={() => handleUseCaseSelect('default')}
              className={`px-4 py-2 rounded-full text-sm transition-all flex items-center gap-2 ${
                selectedUseCase === 'default'
                  ? 'bg-[#38507E] text-white shadow-lg'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'
              }`}
            >
              <Play className="w-4 h-4" />
              {language === 'es' ? 'Demo General' : 'General Demo'}
            </button>
            <button
              onClick={() => handleUseCaseSelect('irrigation')}
              className={`px-4 py-2 rounded-full text-sm transition-all flex items-center gap-2 ${
                selectedUseCase === 'irrigation'
                  ? 'bg-[#51A09A] text-white shadow-lg'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'
              }`}
            >
              <Droplets className="w-4 h-4" />
              {language === 'es' ? 'Riego y Clima' : 'Irrigation & Weather'}
            </button>
            {/* Pest use case button - commented out for now
            <button
              onClick={() => handleUseCaseSelect('pests')}
              className={`px-4 py-2 rounded-full text-sm transition-all flex items-center gap-2 ${
                selectedUseCase === 'pests'
                  ? 'bg-[#EF4444] text-white shadow-lg'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'
              }`}
            >
              <Bug className="w-4 h-4" />
              {language === 'es' ? 'Plagas e Inventario' : 'Pests & Inventory'}
            </button>
            */}
          </div>
        )}

        {/* Workflow Canvas */}
        <div
          className={`relative ${simpleMode ? 'overflow-hidden' : 'overflow-x-auto max-w-5xl mx-auto'}`}
          style={simpleMode ? {
            width: `${950 * 0.8}px`,
            height: `${340 * 0.8}px`
          } : undefined}
        >
          <div
            ref={canvasRef}
            className={`relative rounded-2xl shadow-2xl overflow-hidden ${simpleMode ? 'w-[950px] origin-top-left' : 'min-w-[950px]'} ${!isAnimating ? 'cursor-grab' : ''} ${draggingBlock ? 'cursor-grabbing' : ''}`}
            style={{
              minHeight: selectedUseCase === 'pests' ? '520px' : '340px',
              background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)',
              ...(simpleMode && {
                transform: 'scale(0.8)',
                transformOrigin: 'top left',
              })
            }}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
          >
            {/* Grid Background - dots pattern like real MIIDO */}
            <div
              className="absolute inset-0"
              style={{
                backgroundImage: 'radial-gradient(circle, #cbd5e1 1.5px, transparent 1.5px)',
                backgroundSize: '24px 24px'
              }}
            ></div>

            {/* Canvas Content */}
            <div className="relative p-6" style={{ minHeight: '280px' }}>

              {/* Connection Lines SVG - Curved bezier lines */}
              <svg className="absolute inset-0 w-full h-full" style={{ zIndex: 1 }}>
                {/* Animation mode - fixed paths */}
                {isAnimating && (
                  <>
                    {displayStep >= 1 && (
                      <path
                        d="M 155 140 C 200 140, 200 90, 245 90"
                        fill="none"
                        stroke="#F97316"
                        strokeWidth="3"
                        className="transition-all duration-300"
                        style={{
                          strokeDasharray: 200,
                          strokeDashoffset: displayStep >= 1 ? 0 : 200,
                        }}
                      />
                    )}
                    {displayStep >= 2 && (
                      <path
                        d="M 400 90 C 450 90, 450 90, 500 90"
                        fill="none"
                        stroke="#14B8A6"
                        strokeWidth="3"
                        className="transition-all duration-300"
                        style={{
                          strokeDasharray: 200,
                          strokeDashoffset: displayStep >= 2 ? 0 : 200,
                        }}
                      />
                    )}
                    {displayStep >= 3 && (
                      <path
                        d="M 655 90 C 700 90, 700 90, 745 90"
                        fill="none"
                        stroke="#22C55E"
                        strokeWidth="3"
                        className="transition-all duration-300"
                        style={{
                          strokeDasharray: 200,
                          strokeDashoffset: displayStep >= 3 ? 0 : 200,
                        }}
                      />
                    )}
                  </>
                )}

                {/* Interactive mode - dynamic connections */}
                {!isAnimating && connections.map((conn, idx) => (
                  <g key={idx}>
                    {/* Invisible wider path for easier clicking */}
                    <path
                      d={getConnectionPath(conn.from, conn.to)}
                      fill="none"
                      stroke="transparent"
                      strokeWidth="20"
                      className="cursor-pointer"
                      style={{ pointerEvents: 'stroke' }}
                      onClick={(e) => handleRemoveConnection(conn.from, conn.to, e)}
                    />
                    {/* Visible connection line */}
                    <path
                      d={getConnectionPath(conn.from, conn.to)}
                      fill="none"
                      stroke={getConnectionColor(conn.to)}
                      strokeWidth="3"
                      className="transition-all duration-300 pointer-events-none"
                    />
                    {/* X button in the middle of the connection */}
                    <g
                      className="cursor-pointer hover:scale-110 transition-transform"
                      style={{ pointerEvents: 'all' }}
                      onClick={(e) => handleRemoveConnection(conn.from, conn.to, e)}
                    >
                      <circle
                        cx={(getOutputPos(conn.from).x + getInputPos(conn.to).x) / 2}
                        cy={(getOutputPos(conn.from).y + getInputPos(conn.to).y) / 2}
                        r="8"
                        fill="white"
                        stroke="#EF4444"
                        strokeWidth="2"
                        className="opacity-0 hover:opacity-100 transition-opacity"
                      />
                      <text
                        x={(getOutputPos(conn.from).x + getInputPos(conn.to).x) / 2}
                        y={(getOutputPos(conn.from).y + getInputPos(conn.to).y) / 2 + 1}
                        textAnchor="middle"
                        dominantBaseline="middle"
                        fontSize="10"
                        fill="#EF4444"
                        fontWeight="bold"
                        className="opacity-0 hover:opacity-100 transition-opacity pointer-events-none"
                      >
                        ×
                      </text>
                    </g>
                  </g>
                ))}

                {/* Dragging connection preview */}
                {draggingConnection && (
                  <path
                    d={getDraggingPath()}
                    fill="none"
                    stroke="#6B7280"
                    strokeWidth="3"
                    strokeDasharray="8 4"
                    className="pointer-events-none"
                  />
                )}
              </svg>

              {/* ========== DEFAULT USE CASE BLOCKS ========== */}
              {(selectedUseCase === 'default' || isAnimating) && (
              <>
              {/* TRIGGER Block - Purple/Violet */}
              <div
                className={`draggable-block absolute ${!isAnimating ? 'cursor-grab active:cursor-grabbing' : ''} ${
                  displayStep >= 0 ? 'opacity-100 scale-100' : 'opacity-0 scale-90'
                } ${draggingBlock === 'trigger' ? 'z-20 scale-105' : ''}`}
                style={{
                  left: isAnimating ? '20px' : `${blockPositions.trigger.x}px`,
                  top: isAnimating ? '80px' : `${blockPositions.trigger.y}px`,
                  zIndex: draggingBlock === 'trigger' ? 20 : 2,
                  transition: draggingBlock === 'trigger' ? 'none' : 'all 0.3s ease'
                }}
                onMouseDown={(e) => handleMouseDown('trigger', e)}
              >
                <div className={`bg-white rounded-xl shadow-lg w-36 border-2 border-[#8B5CF6] overflow-hidden transition-shadow duration-300 ${draggingBlock === 'trigger' ? 'shadow-2xl' : 'hover:shadow-xl'}`}>
                  {/* Header */}
                  <div className="flex items-center gap-2 px-3 py-2 border-b border-gray-100">
                    <div className="w-5 h-5 rounded-full bg-[#8B5CF6] flex items-center justify-center">
                      <Play className="w-3 h-3 text-white" fill="white" />
                    </div>
                    <span className="text-xs text-medium text-gray-800">Trigger</span>
                  </div>
                  {/* Content */}
                  <div className="p-3 space-y-2">
                    <div className="text-[10px] text-gray-500">{language === 'es' ? 'Tipo de Trigger' : 'Trigger Type'}</div>
                    <div className="flex gap-1">
                      <span className="px-2 py-0.5 bg-[#8B5CF6]/10 text-[#8B5CF6] rounded text-[10px] text-medium">Manual</span>
                      <span className="px-2 py-0.5 bg-gray-100 text-gray-500 rounded text-[10px]">{language === 'es' ? 'Programado' : 'Scheduled'}</span>
                    </div>
                    <button className="w-full mt-2 py-1.5 bg-[#22C55E] hover:bg-[#16A34A] text-white rounded-lg text-[10px] text-medium flex items-center justify-center gap-1 transition-colors pointer-events-none">
                      <Play className="w-3 h-3" fill="white" />
                      {language === 'es' ? 'Ejecutar Workflow' : 'Run Workflow'}
                    </button>
                  </div>
                  {/* Output connection dot */}
                  <div
                    className={`absolute -right-2 top-7 w-4 h-4 bg-[#F97316] rounded-full border-2 border-white shadow-sm ${!isAnimating ? 'cursor-crosshair hover:scale-125 hover:ring-2 hover:ring-[#F97316]/30' : ''} transition-all`}
                    onMouseDown={(e) => handleConnectionStart('trigger', e)}
                  ></div>
                </div>
              </div>

              {/* INTEGRATION Block - Orange */}
              <div
                className={`draggable-block absolute ${!isAnimating ? 'cursor-grab active:cursor-grabbing' : ''} ${
                  displayStep >= 1 ? 'opacity-100 scale-100' : 'opacity-40 scale-95'
                } ${draggingBlock === 'integration' ? 'z-20 scale-105' : ''}`}
                style={{
                  left: isAnimating ? '245px' : `${blockPositions.integration.x}px`,
                  top: isAnimating ? '30px' : `${blockPositions.integration.y}px`,
                  zIndex: draggingBlock === 'integration' ? 20 : 2,
                  transition: draggingBlock === 'integration' ? 'none' : 'all 0.3s ease'
                }}
                onMouseDown={(e) => handleMouseDown('integration', e)}
              >
                <div className={`bg-white rounded-xl shadow-lg w-40 border-2 border-[#F97316] overflow-hidden transition-shadow duration-300 ${draggingBlock === 'integration' ? 'shadow-2xl' : 'hover:shadow-xl'}`}>
                  {/* Header */}
                  <div className="flex items-center justify-between px-3 py-2 border-b border-gray-100">
                    <div className="flex items-center gap-2">
                      <div className="w-5 h-5 rounded-full bg-[#F97316] flex items-center justify-center">
                        <span className="text-[8px] text-white font-bold">API</span>
                      </div>
                      <span className="text-xs text-medium text-gray-800">{language === 'es' ? 'Integraciones' : 'Integrations'}</span>
                    </div>
                    <div className="w-4 h-4 rounded-full bg-[#F97316] flex items-center justify-center">
                      <span className="text-[8px] text-white">⚙</span>
                    </div>
                  </div>
                  {/* Content */}
                  <div className="p-3 space-y-2">
                    <div className="text-[10px] text-gray-500">{language === 'es' ? 'Selección de app' : 'App selection'}</div>
                    <div className="px-2 py-1.5 bg-gray-50 rounded border border-gray-200 text-[10px] text-gray-700">
                      Dropcontrol (Wiseconn)
                    </div>
                    <div className="text-[10px] text-[#F97316] text-medium">{language === 'es' ? 'Autenticación' : 'Authentication'}</div>
                    <div className="space-y-1">
                      <div className="px-2 py-1 bg-[#22C55E]/10 rounded text-[10px] text-[#22C55E] flex items-center gap-1">
                        <span>✓</span> {language === 'es' ? 'Conectado' : 'Connected'}
                      </div>
                    </div>
                  </div>
                  {/* Input connection dot */}
                  <div
                    className={`absolute -left-2 top-7 w-4 h-4 bg-[#F97316] rounded-full border-2 border-white shadow-sm ${!isAnimating && draggingConnection ? 'cursor-crosshair hover:scale-125 hover:ring-2 hover:ring-[#F97316]/30 animate-pulse' : ''} transition-all`}
                    onMouseUp={(e) => handleConnectionEnd('integration', e)}
                  ></div>
                  {/* Output connection dot */}
                  <div
                    className={`absolute -right-2 top-7 w-4 h-4 bg-[#14B8A6] rounded-full border-2 border-white shadow-sm ${!isAnimating ? 'cursor-crosshair hover:scale-125 hover:ring-2 hover:ring-[#14B8A6]/30' : ''} transition-all`}
                    onMouseDown={(e) => handleConnectionStart('integration', e)}
                  ></div>
                </div>
              </div>

              {/* AI Block - Teal */}
              <div
                className={`draggable-block absolute ${!isAnimating ? 'cursor-grab active:cursor-grabbing' : ''} ${
                  displayStep >= 2 ? 'opacity-100 scale-100' : 'opacity-40 scale-95'
                } ${draggingBlock === 'ai' ? 'z-20 scale-105' : ''}`}
                style={{
                  left: isAnimating ? '500px' : `${blockPositions.ai.x}px`,
                  top: isAnimating ? '30px' : `${blockPositions.ai.y}px`,
                  zIndex: draggingBlock === 'ai' ? 20 : 2,
                  transition: draggingBlock === 'ai' ? 'none' : 'all 0.3s ease'
                }}
                onMouseDown={(e) => handleMouseDown('ai', e)}
              >
                <div className={`bg-white rounded-xl shadow-lg w-40 border-2 border-[#14B8A6] overflow-hidden transition-shadow duration-300 ${draggingBlock === 'ai' ? 'shadow-2xl' : 'hover:shadow-xl'}`}>
                  {/* Header */}
                  <div className="flex items-center justify-between px-3 py-2 border-b border-gray-100">
                    <div className="flex items-center gap-2">
                      <div className="w-5 h-5 rounded-full bg-[#14B8A6] flex items-center justify-center">
                        <span className="text-[8px] text-white font-bold">IA</span>
                      </div>
                      <span className="text-xs text-medium text-gray-800">{language === 'es' ? 'Inteligencia Artificial' : 'Artificial Intelligence'}</span>
                    </div>
                    <div className="w-4 h-4 rounded-full bg-[#14B8A6] flex items-center justify-center">
                      <span className="text-[8px] text-white">⚙</span>
                    </div>
                  </div>
                  {/* Content */}
                  <div className="p-3 space-y-2">
                    <div className="text-[10px] text-gray-500">{language === 'es' ? 'Modelo' : 'Model'}</div>
                    <div className="px-2 py-1.5 bg-gray-50 rounded border border-gray-200 text-[10px] text-gray-700">
                      GPT-4o Mini
                    </div>
                    <div className="text-[10px] text-gray-500">{language === 'es' ? 'System Prompt' : 'System Prompt'}</div>
                    <div className="px-2 py-1.5 bg-gray-50 rounded border border-gray-200 text-[9px] text-gray-600 leading-tight">
                      {language === 'es' ? 'Eres un asistente útil...' : 'You are a helpful assistant...'}
                    </div>
                  </div>
                  {/* Input connection dot */}
                  <div
                    className={`absolute -left-2 top-7 w-4 h-4 bg-[#14B8A6] rounded-full border-2 border-white shadow-sm ${!isAnimating && draggingConnection ? 'cursor-crosshair hover:scale-125 hover:ring-2 hover:ring-[#14B8A6]/30 animate-pulse' : ''} transition-all`}
                    onMouseUp={(e) => handleConnectionEnd('ai', e)}
                  ></div>
                  {/* Output connection dot */}
                  <div
                    className={`absolute -right-2 top-7 w-4 h-4 bg-[#22C55E] rounded-full border-2 border-white shadow-sm ${!isAnimating ? 'cursor-crosshair hover:scale-125 hover:ring-2 hover:ring-[#22C55E]/30' : ''} transition-all`}
                    onMouseDown={(e) => handleConnectionStart('ai', e)}
                  ></div>
                </div>
              </div>

              {/* WhatsApp Block - Green */}
              <div
                className={`draggable-block absolute ${!isAnimating ? 'cursor-grab active:cursor-grabbing' : ''} ${
                  displayStep >= 3 ? 'opacity-100 scale-100' : 'opacity-40 scale-95'
                } ${draggingBlock === 'whatsapp' ? 'z-20 scale-105' : ''}`}
                style={{
                  left: isAnimating ? '745px' : `${blockPositions.whatsapp.x}px`,
                  top: isAnimating ? '30px' : `${blockPositions.whatsapp.y}px`,
                  zIndex: draggingBlock === 'whatsapp' ? 20 : 2,
                  transition: draggingBlock === 'whatsapp' ? 'none' : 'all 0.3s ease'
                }}
                onMouseDown={(e) => handleMouseDown('whatsapp', e)}
              >
                <div className={`bg-white rounded-xl shadow-lg w-40 border-2 border-[#22C55E] overflow-hidden transition-shadow duration-300 ${draggingBlock === 'whatsapp' ? 'shadow-2xl' : 'hover:shadow-xl'}`}>
                  {/* Header */}
                  <div className="flex items-center justify-between px-3 py-2 border-b border-gray-100">
                    <div className="flex items-center gap-2">
                      <div className="w-5 h-5 rounded-full bg-[#22C55E] flex items-center justify-center">
                        <span className="text-[8px] text-white font-bold">WA</span>
                      </div>
                      <span className="text-xs text-medium text-gray-800">WhatsApp</span>
                    </div>
                    <div className="w-4 h-4 rounded-full bg-[#22C55E] flex items-center justify-center">
                      <span className="text-[8px] text-white">⚙</span>
                    </div>
                  </div>
                  {/* Content */}
                  <div className="p-3 space-y-2">
                    <div className="text-[10px] text-gray-500">{language === 'es' ? 'Trabajadores' : 'Workers'}</div>
                    <div className="px-2 py-1.5 bg-gray-50 rounded border border-gray-200 text-[10px] text-gray-700">
                      {language === 'es' ? 'Seleccionar trabajador' : 'Select worker'}
                    </div>
                    <div className="text-[10px] text-gray-500">{language === 'es' ? 'Mensaje' : 'Message'}</div>
                    <div className="px-2 py-1.5 bg-gray-50 rounded border border-gray-200 text-[9px] text-gray-400 italic">
                      {language === 'es' ? 'Escribe tu mensaje aquí...' : 'Write your message here...'}
                    </div>
                  </div>
                  {/* Input connection dot */}
                  <div
                    className={`absolute -left-2 top-7 w-4 h-4 bg-[#22C55E] rounded-full border-2 border-white shadow-sm ${!isAnimating && draggingConnection ? 'cursor-crosshair hover:scale-125 hover:ring-2 hover:ring-[#22C55E]/30 animate-pulse' : ''} transition-all`}
                    onMouseUp={(e) => handleConnectionEnd('whatsapp', e)}
                  ></div>
                </div>
              </div>
              </>
              )}
              {/* END DEFAULT USE CASE BLOCKS */}

              {/* ========== IRRIGATION USE CASE BLOCKS ========== */}
              {selectedUseCase === 'irrigation' && !isAnimating && (
                <>
                  {/* IRRIGATION: Trigger Block */}
                  <div
                    className={`draggable-block absolute transition-all duration-500 ${useCaseStep >= 1 || !useCaseAnimating ? 'opacity-100 scale-100' : 'opacity-0 scale-90'}`}
                    style={{
                      left: `${irrigationPositions.trigger.x}px`,
                      top: `${irrigationPositions.trigger.y}px`,
                      zIndex: activePopup === 'trigger' ? 30 : 2
                    }}
                    onClick={() => !useCaseAnimating && setActivePopup(activePopup === 'trigger' ? null : 'trigger')}
                  >
                    <div className="bg-white rounded-xl shadow-lg w-36 border-2 border-[#8B5CF6] overflow-hidden">
                      <div className="flex items-center gap-2 px-3 py-2 border-b border-gray-100">
                        <div className="w-5 h-5 rounded-full bg-[#8B5CF6] flex items-center justify-center">
                          <Play className="w-3 h-3 text-white" fill="white" />
                        </div>
                        <span className="text-xs text-medium text-gray-800">Trigger</span>
                      </div>
                      <div className="p-3 space-y-2">
                        <div className="text-[10px] text-gray-500">{language === 'es' ? 'Programación' : 'Schedule'}</div>
                        <div className="px-2 py-0.5 bg-[#8B5CF6]/10 text-[#8B5CF6] rounded text-[10px] text-medium">
                          {language === 'es' ? 'Diario 6:00 AM' : 'Daily 6:00 AM'}
                        </div>
                      </div>
                      <div className="absolute -right-2 top-7 w-4 h-4 bg-[#F97316] rounded-full border-2 border-white shadow-sm"></div>
                    </div>
                    {/* Popup */}
                    {activePopup === 'trigger' && (
                      <div className="absolute left-full ml-3 top-0 w-64 bg-white rounded-xl shadow-2xl border border-gray-200 p-4 z-40">
                        <button onClick={(e) => { e.stopPropagation(); setActivePopup(null); }} className="absolute top-2 right-2 text-gray-400 hover:text-gray-600">
                          <X className="w-4 h-4" />
                        </button>
                        <div className="flex items-center gap-2 mb-2">
                          <div className="w-6 h-6 rounded-full bg-[#8B5CF6] flex items-center justify-center">
                            <Play className="w-3 h-3 text-white" fill="white" />
                          </div>
                          <span className="text-sm font-medium text-gray-800">Trigger</span>
                        </div>
                        <p className="text-xs text-gray-600 leading-relaxed">
                          {irrigationPopups.trigger[language]}
                        </p>
                      </div>
                    )}
                  </div>

                  {/* IRRIGATION: Wiseconn Block */}
                  <div
                    className={`draggable-block absolute transition-all duration-500 ${useCaseStep >= 2 || !useCaseAnimating ? 'opacity-100 scale-100' : 'opacity-0 scale-90'}`}
                    style={{
                      left: `${irrigationPositions.wiseconn.x}px`,
                      top: `${irrigationPositions.wiseconn.y}px`,
                      zIndex: activePopup === 'wiseconn' ? 30 : 2
                    }}
                    onClick={() => !useCaseAnimating && setActivePopup(activePopup === 'wiseconn' ? null : 'wiseconn')}
                  >
                    <div className="bg-white rounded-xl shadow-lg w-44 border-2 border-[#3B82F6] overflow-hidden">
                      <div className="flex items-center gap-2 px-3 py-2 border-b border-gray-100">
                        <div className="w-5 h-5 rounded-full bg-[#3B82F6] flex items-center justify-center">
                          <Droplets className="w-3 h-3 text-white" />
                        </div>
                        <span className="text-xs text-medium text-gray-800">Wiseconn</span>
                      </div>
                      <div className="p-3 space-y-2">
                        <div className="text-[10px] text-gray-500">Dropcontrol API</div>
                        <div className="px-2 py-1 bg-[#22C55E]/10 rounded text-[10px] text-[#22C55E] flex items-center gap-1">
                          <span>✓</span> {language === 'es' ? 'Conectado' : 'Connected'}
                        </div>
                        <div className="text-[9px] text-gray-400">{language === 'es' ? 'Humedad suelo, válvulas' : 'Soil moisture, valves'}</div>
                      </div>
                      <div className="absolute -left-2 top-7 w-4 h-4 bg-[#3B82F6] rounded-full border-2 border-white shadow-sm"></div>
                      <div className="absolute -right-2 top-7 w-4 h-4 bg-[#14B8A6] rounded-full border-2 border-white shadow-sm"></div>
                    </div>
                    {/* Popup */}
                    {activePopup === 'wiseconn' && (
                      <div className="absolute left-full ml-3 top-0 w-64 bg-white rounded-xl shadow-2xl border border-gray-200 p-4 z-40">
                        <button onClick={(e) => { e.stopPropagation(); setActivePopup(null); }} className="absolute top-2 right-2 text-gray-400 hover:text-gray-600">
                          <X className="w-4 h-4" />
                        </button>
                        <div className="flex items-center gap-2 mb-2">
                          <div className="w-6 h-6 rounded-full bg-[#3B82F6] flex items-center justify-center">
                            <Droplets className="w-3 h-3 text-white" />
                          </div>
                          <span className="text-sm font-medium text-gray-800">Wiseconn</span>
                        </div>
                        <p className="text-xs text-gray-600 leading-relaxed">
                          {irrigationPopups.wiseconn[language]}
                        </p>
                      </div>
                    )}
                  </div>

                  {/* IRRIGATION: Weather Block */}
                  <div
                    className={`draggable-block absolute transition-all duration-500 ${useCaseStep >= 3 || !useCaseAnimating ? 'opacity-100 scale-100' : 'opacity-0 scale-90'}`}
                    style={{
                      left: `${irrigationPositions.weather.x}px`,
                      top: `${irrigationPositions.weather.y}px`,
                      zIndex: activePopup === 'weather' ? 30 : 2
                    }}
                    onClick={() => !useCaseAnimating && setActivePopup(activePopup === 'weather' ? null : 'weather')}
                  >
                    <div className="bg-white rounded-xl shadow-lg w-44 border-2 border-[#F59E0B] overflow-hidden">
                      <div className="flex items-center gap-2 px-3 py-2 border-b border-gray-100">
                        <div className="w-5 h-5 rounded-full bg-[#F59E0B] flex items-center justify-center">
                          <Cloud className="w-3 h-3 text-white" />
                        </div>
                        <span className="text-xs text-medium text-gray-800">{language === 'es' ? 'Clima INIA' : 'INIA Weather'}</span>
                      </div>
                      <div className="p-3 space-y-2">
                        <div className="text-[10px] text-gray-500">{language === 'es' ? 'Estación' : 'Station'}</div>
                        <div className="px-2 py-1.5 bg-gray-50 rounded border border-gray-200 text-[10px] text-gray-700">
                          La Platina
                        </div>
                        <div className="text-[9px] text-gray-400">{language === 'es' ? 'Temp, HR, Rad, Viento' : 'Temp, RH, Rad, Wind'}</div>
                      </div>
                      <div className="absolute -left-2 top-7 w-4 h-4 bg-[#F59E0B] rounded-full border-2 border-white shadow-sm"></div>
                      <div className="absolute -right-2 top-7 w-4 h-4 bg-[#14B8A6] rounded-full border-2 border-white shadow-sm"></div>
                    </div>
                    {/* Popup */}
                    {activePopup === 'weather' && (
                      <div className="absolute left-full ml-3 top-0 w-64 bg-white rounded-xl shadow-2xl border border-gray-200 p-4 z-40">
                        <button onClick={(e) => { e.stopPropagation(); setActivePopup(null); }} className="absolute top-2 right-2 text-gray-400 hover:text-gray-600">
                          <X className="w-4 h-4" />
                        </button>
                        <div className="flex items-center gap-2 mb-2">
                          <div className="w-6 h-6 rounded-full bg-[#F59E0B] flex items-center justify-center">
                            <Cloud className="w-3 h-3 text-white" />
                          </div>
                          <span className="text-sm font-medium text-gray-800">{language === 'es' ? 'Clima INIA' : 'INIA Weather'}</span>
                        </div>
                        <p className="text-xs text-gray-600 leading-relaxed">
                          {irrigationPopups.weather[language]}
                        </p>
                      </div>
                    )}
                  </div>

                  {/* IRRIGATION: AI Block */}
                  <div
                    className={`draggable-block absolute transition-all duration-500 ${useCaseStep >= 4 || !useCaseAnimating ? 'opacity-100 scale-100' : 'opacity-0 scale-90'}`}
                    style={{
                      left: `${irrigationPositions.ai.x}px`,
                      top: `${irrigationPositions.ai.y}px`,
                      zIndex: activePopup === 'ai' ? 30 : 2
                    }}
                    onClick={() => !useCaseAnimating && setActivePopup(activePopup === 'ai' ? null : 'ai')}
                  >
                    <div className="bg-white rounded-xl shadow-lg w-44 border-2 border-[#14B8A6] overflow-hidden">
                      <div className="flex items-center justify-between px-3 py-2 border-b border-gray-100">
                        <div className="flex items-center gap-2">
                          <div className="w-5 h-5 rounded-full bg-[#14B8A6] flex items-center justify-center">
                            <span className="text-[8px] text-white font-bold">IA</span>
                          </div>
                          <span className="text-xs text-medium text-gray-800">{language === 'es' ? 'Inteligencia Artificial' : 'Artificial Intelligence'}</span>
                        </div>
                        <div className="w-4 h-4 rounded-full bg-[#14B8A6] flex items-center justify-center">
                          <span className="text-[8px] text-white">⚙</span>
                        </div>
                      </div>
                      <div className="p-3 space-y-2">
                        <div className="text-[10px] text-gray-500">{language === 'es' ? 'Modelo' : 'Model'}</div>
                        <div className="px-2 py-1.5 bg-gray-50 rounded border border-gray-200 text-[10px] text-gray-700">
                          GPT-4o Mini
                        </div>
                        <div className="text-[10px] text-gray-500">{language === 'es' ? 'System Prompt' : 'System Prompt'}</div>
                        <div className="px-2 py-1.5 bg-gray-50 rounded border border-gray-200 text-[8px] text-gray-600 leading-tight">
                          {language === 'es'
                            ? 'Calcula ET0 con Penman-Monteith FAO-56. Aplica Kc según etapa fenológica. Determina déficit hídrico y recomienda tiempo de riego...'
                            : 'Calculate ET0 with Penman-Monteith FAO-56. Apply Kc based on phenological stage. Determine water deficit and recommend irrigation time...'}
                        </div>
                      </div>
                      <div className="absolute -left-2 top-7 w-4 h-4 bg-[#14B8A6] rounded-full border-2 border-white shadow-sm"></div>
                      <div className="absolute -right-2 top-7 w-4 h-4 bg-[#22C55E] rounded-full border-2 border-white shadow-sm"></div>
                    </div>
                    {/* Popup */}
                    {activePopup === 'ai' && (
                      <div className="absolute left-full ml-3 top-0 w-64 bg-white rounded-xl shadow-2xl border border-gray-200 p-4 z-40">
                        <button onClick={(e) => { e.stopPropagation(); setActivePopup(null); }} className="absolute top-2 right-2 text-gray-400 hover:text-gray-600">
                          <X className="w-4 h-4" />
                        </button>
                        <div className="flex items-center gap-2 mb-2">
                          <div className="w-6 h-6 rounded-full bg-[#14B8A6] flex items-center justify-center">
                            <Brain className="w-3 h-3 text-white" />
                          </div>
                          <span className="text-sm font-medium text-gray-800">{language === 'es' ? 'Inteligencia Artificial' : 'Artificial Intelligence'}</span>
                        </div>
                        <p className="text-xs text-gray-600 leading-relaxed">
                          {irrigationPopups.ai[language]}
                        </p>
                      </div>
                    )}
                  </div>

                  {/* IRRIGATION: WhatsApp Block */}
                  <div
                    className={`draggable-block absolute transition-all duration-500 ${useCaseStep >= 5 || !useCaseAnimating ? 'opacity-100 scale-100' : 'opacity-0 scale-90'}`}
                    style={{
                      left: `${irrigationPositions.whatsapp.x}px`,
                      top: `${irrigationPositions.whatsapp.y}px`,
                      zIndex: activePopup === 'whatsapp' ? 30 : 2
                    }}
                    onClick={() => !useCaseAnimating && setActivePopup(activePopup === 'whatsapp' ? null : 'whatsapp')}
                  >
                    <div className="bg-white rounded-xl shadow-lg w-44 border-2 border-[#22C55E] overflow-hidden">
                      <div className="flex items-center gap-2 px-3 py-2 border-b border-gray-100">
                        <div className="w-5 h-5 rounded-full bg-[#22C55E] flex items-center justify-center">
                          <MessageCircle className="w-3 h-3 text-white" />
                        </div>
                        <span className="text-xs text-medium text-gray-800">WhatsApp</span>
                      </div>
                      <div className="p-3 space-y-2">
                        <div className="text-[10px] text-gray-500">{language === 'es' ? 'Destinatario' : 'Recipient'}</div>
                        <div className="px-2 py-1.5 bg-gray-50 rounded border border-gray-200 text-[10px] text-gray-700">
                          {language === 'es' ? 'Encargado Riego' : 'Irrigation Manager'}
                        </div>
                        <div className="text-[9px] text-gray-400 italic">{language === 'es' ? '"Regar Cuartel 3..."' : '"Irrigate Block 3..."'}</div>
                      </div>
                      <div className="absolute -left-2 top-7 w-4 h-4 bg-[#22C55E] rounded-full border-2 border-white shadow-sm"></div>
                    </div>
                    {/* Popup */}
                    {activePopup === 'whatsapp' && (
                      <div className="absolute right-full mr-3 top-0 w-64 bg-white rounded-xl shadow-2xl border border-gray-200 p-4 z-40">
                        <button onClick={(e) => { e.stopPropagation(); setActivePopup(null); }} className="absolute top-2 right-2 text-gray-400 hover:text-gray-600">
                          <X className="w-4 h-4" />
                        </button>
                        <div className="flex items-center gap-2 mb-2">
                          <div className="w-6 h-6 rounded-full bg-[#22C55E] flex items-center justify-center">
                            <MessageCircle className="w-3 h-3 text-white" />
                          </div>
                          <span className="text-sm font-medium text-gray-800">WhatsApp</span>
                        </div>
                        <p className="text-xs text-gray-600 leading-relaxed">
                          {irrigationPopups.whatsapp[language]}
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Irrigation SVG Connections */}
                  <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ zIndex: 1 }}>
                    {(useCaseStep >= 6 || !useCaseAnimating) && connections.map((conn, idx) => {
                      const fromPos = irrigationPositions[conn.from as keyof typeof irrigationPositions];
                      const toPos = irrigationPositions[conn.to as keyof typeof irrigationPositions];
                      if (!fromPos || !toPos) return null;

                      const fromX = fromPos.x + 144;
                      const fromY = fromPos.y + 32;
                      const toX = toPos.x;
                      const toY = toPos.y + 32;
                      const midX = (fromX + toX) / 2;

                      const colors: Record<string, string> = {
                        'wiseconn': '#3B82F6',
                        'weather': '#F59E0B',
                        'ai': '#14B8A6',
                        'whatsapp': '#22C55E'
                      };

                      return (
                        <path
                          key={idx}
                          d={`M ${fromX} ${fromY} C ${midX} ${fromY}, ${midX} ${toY}, ${toX} ${toY}`}
                          fill="none"
                          stroke={colors[conn.to] || '#6B7280'}
                          strokeWidth="3"
                          className="transition-all duration-500"
                        />
                      );
                    })}
                  </svg>
                </>
              )}

              {/* ========== PEST MONITORING USE CASE BLOCKS ========== */}
              {selectedUseCase === 'pests' && !isAnimating && (
                <>
                  {/* PEST: Trigger Block */}
                  <div
                    className={`draggable-block absolute transition-all duration-500 ${useCaseStep >= 1 || !useCaseAnimating ? 'opacity-100 scale-100' : 'opacity-0 scale-90'}`}
                    style={{
                      left: `${pestPositions.trigger.x}px`,
                      top: `${pestPositions.trigger.y}px`,
                      zIndex: activePopup === 'trigger' ? 30 : 2
                    }}
                    onClick={() => !useCaseAnimating && setActivePopup(activePopup === 'trigger' ? null : 'trigger')}
                  >
                    <div className="bg-white rounded-xl shadow-lg w-32 border-2 border-[#8B5CF6] overflow-hidden">
                      <div className="flex items-center gap-2 px-3 py-2 border-b border-gray-100">
                        <div className="w-5 h-5 rounded-full bg-[#8B5CF6] flex items-center justify-center">
                          <Play className="w-3 h-3 text-white" />
                        </div>
                        <span className="text-xs text-medium text-gray-800">Trigger</span>
                      </div>
                      <div className="p-2">
                        <div className="text-[9px] text-gray-500 mb-1">{language === 'es' ? 'Cada 6 horas' : 'Every 6 hours'}</div>
                      </div>
                      <div className="absolute -right-2 top-6 w-4 h-4 bg-[#8B5CF6] rounded-full border-2 border-white shadow-sm"></div>
                    </div>
                    {activePopup === 'trigger' && (
                      <div className="absolute left-full ml-3 top-0 w-56 bg-white rounded-xl shadow-2xl border border-gray-200 p-4 z-40">
                        <button onClick={(e) => { e.stopPropagation(); setActivePopup(null); }} className="absolute top-2 right-2 text-gray-400 hover:text-gray-600">
                          <X className="w-4 h-4" />
                        </button>
                        <p className="text-xs text-gray-600 leading-relaxed">{pestPopups.trigger[language]}</p>
                      </div>
                    )}
                  </div>

                  {/* PEST: Inventory Block - Integration style */}
                  <div
                    className={`draggable-block absolute transition-all duration-500 ${useCaseStep >= 2 || !useCaseAnimating ? 'opacity-100 scale-100' : 'opacity-0 scale-90'}`}
                    style={{
                      left: `${pestPositions.inventory.x}px`,
                      top: `${pestPositions.inventory.y}px`,
                      zIndex: activePopup === 'inventory' ? 30 : 2
                    }}
                    onClick={() => !useCaseAnimating && setActivePopup(activePopup === 'inventory' ? null : 'inventory')}
                  >
                    <div className="bg-white rounded-xl shadow-lg w-40 border-2 border-[#6366F1] overflow-hidden">
                      <div className="flex items-center justify-between px-3 py-2 border-b border-gray-100">
                        <div className="flex items-center gap-2">
                          <div className="w-5 h-5 rounded-full bg-[#6366F1] flex items-center justify-center">
                            <Database className="w-3 h-3 text-white" />
                          </div>
                          <span className="text-xs text-medium text-gray-800">{language === 'es' ? 'Integración' : 'Integration'}</span>
                        </div>
                        <div className="w-4 h-4 rounded-full bg-[#6366F1] flex items-center justify-center">
                          <span className="text-[8px] text-white">⚙</span>
                        </div>
                      </div>
                      <div className="p-2 space-y-1">
                        <div className="text-[9px] text-gray-500">{language === 'es' ? 'Plataforma' : 'Platform'}</div>
                        <div className="px-2 py-1 bg-gray-50 rounded border border-gray-200 text-[9px] text-gray-700">
                          Agroinventario
                        </div>
                      </div>
                      <div className="absolute -left-2 top-7 w-4 h-4 bg-[#6366F1] rounded-full border-2 border-white shadow-sm"></div>
                      <div className="absolute -right-2 top-7 w-4 h-4 bg-[#14B8A6] rounded-full border-2 border-white shadow-sm"></div>
                    </div>
                    {activePopup === 'inventory' && (
                      <div className="absolute left-full ml-3 top-0 w-64 bg-white rounded-xl shadow-2xl border border-gray-200 p-4 z-40">
                        <button onClick={(e) => { e.stopPropagation(); setActivePopup(null); }} className="absolute top-2 right-2 text-gray-400 hover:text-gray-600">
                          <X className="w-4 h-4" />
                        </button>
                        <div className="flex items-center gap-2 mb-2">
                          <div className="w-6 h-6 rounded-full bg-[#6366F1] flex items-center justify-center">
                            <Database className="w-3 h-3 text-white" />
                          </div>
                          <span className="text-sm font-medium text-gray-800">{language === 'es' ? 'Integración' : 'Integration'}</span>
                        </div>
                        <p className="text-xs text-gray-600 leading-relaxed">{pestPopups.inventory[language]}</p>
                      </div>
                    )}
                  </div>

                  {/* PEST: Weather Block */}
                  <div
                    className={`draggable-block absolute transition-all duration-500 ${useCaseStep >= 3 || !useCaseAnimating ? 'opacity-100 scale-100' : 'opacity-0 scale-90'}`}
                    style={{
                      left: `${pestPositions.weather.x}px`,
                      top: `${pestPositions.weather.y}px`,
                      zIndex: activePopup === 'weather' ? 30 : 2
                    }}
                    onClick={() => !useCaseAnimating && setActivePopup(activePopup === 'weather' ? null : 'weather')}
                  >
                    <div className="bg-white rounded-xl shadow-lg w-36 border-2 border-[#F59E0B] overflow-hidden">
                      <div className="flex items-center gap-2 px-3 py-2 border-b border-gray-100">
                        <div className="w-5 h-5 rounded-full bg-[#F59E0B] flex items-center justify-center">
                          <Cloud className="w-3 h-3 text-white" />
                        </div>
                        <span className="text-xs text-medium text-gray-800">{language === 'es' ? 'Clima' : 'Weather'}</span>
                      </div>
                      <div className="p-2">
                        <div className="text-[8px] text-gray-500">{language === 'es' ? 'Pronóstico' : 'Forecast'}</div>
                      </div>
                      <div className="absolute -left-2 top-6 w-4 h-4 bg-[#F59E0B] rounded-full border-2 border-white shadow-sm"></div>
                      <div className="absolute -right-2 top-6 w-4 h-4 bg-[#14B8A6] rounded-full border-2 border-white shadow-sm"></div>
                    </div>
                    {activePopup === 'weather' && (
                      <div className="absolute left-full ml-3 top-0 w-64 bg-white rounded-xl shadow-2xl border border-gray-200 p-4 z-40">
                        <button onClick={(e) => { e.stopPropagation(); setActivePopup(null); }} className="absolute top-2 right-2 text-gray-400 hover:text-gray-600">
                          <X className="w-4 h-4" />
                        </button>
                        <div className="flex items-center gap-2 mb-2">
                          <div className="w-6 h-6 rounded-full bg-[#F59E0B] flex items-center justify-center">
                            <Cloud className="w-3 h-3 text-white" />
                          </div>
                          <span className="text-sm font-medium text-gray-800">{language === 'es' ? 'Clima' : 'Weather'}</span>
                        </div>
                        <p className="text-xs text-gray-600 leading-relaxed">{pestPopups.weather[language]}</p>
                      </div>
                    )}
                  </div>

                  {/* PEST: Satellite Block */}
                  <div
                    className={`draggable-block absolute transition-all duration-500 ${useCaseStep >= 4 || !useCaseAnimating ? 'opacity-100 scale-100' : 'opacity-0 scale-90'}`}
                    style={{
                      left: `${pestPositions.ndvi.x}px`,
                      top: `${pestPositions.ndvi.y}px`,
                      zIndex: activePopup === 'ndvi' ? 30 : 2
                    }}
                    onClick={() => !useCaseAnimating && setActivePopup(activePopup === 'ndvi' ? null : 'ndvi')}
                  >
                    <div className="bg-white rounded-xl shadow-lg w-40 border-2 border-[#10B981] overflow-hidden">
                      <div className="flex items-center justify-between px-3 py-2 border-b border-gray-100">
                        <div className="flex items-center gap-2">
                          <div className="w-5 h-5 rounded-full bg-[#10B981] flex items-center justify-center">
                            <Satellite className="w-3 h-3 text-white" />
                          </div>
                          <span className="text-xs text-medium text-gray-800">{language === 'es' ? 'Satélite' : 'Satellite'}</span>
                        </div>
                        <div className="w-4 h-4 rounded-full bg-[#10B981] flex items-center justify-center">
                          <span className="text-[8px] text-white">⚙</span>
                        </div>
                      </div>
                      <div className="p-2 space-y-1">
                        <div className="text-[9px] text-gray-500">{language === 'es' ? 'Fuente' : 'Source'}</div>
                        <div className="px-2 py-1 bg-gray-50 rounded border border-gray-200 text-[9px] text-gray-700">
                          Sentinel-2
                        </div>
                        <div className="text-[9px] text-gray-500">{language === 'es' ? 'Índice' : 'Index'}</div>
                        <div className="px-2 py-1 bg-gray-50 rounded border border-gray-200 text-[9px] text-gray-700">
                          NDVI
                        </div>
                      </div>
                      <div className="absolute -left-2 top-7 w-4 h-4 bg-[#10B981] rounded-full border-2 border-white shadow-sm"></div>
                      <div className="absolute -right-2 top-7 w-4 h-4 bg-[#14B8A6] rounded-full border-2 border-white shadow-sm"></div>
                    </div>
                    {activePopup === 'ndvi' && (
                      <div className="absolute left-full ml-3 top-0 w-64 bg-white rounded-xl shadow-2xl border border-gray-200 p-4 z-40">
                        <button onClick={(e) => { e.stopPropagation(); setActivePopup(null); }} className="absolute top-2 right-2 text-gray-400 hover:text-gray-600">
                          <X className="w-4 h-4" />
                        </button>
                        <div className="flex items-center gap-2 mb-2">
                          <div className="w-6 h-6 rounded-full bg-[#10B981] flex items-center justify-center">
                            <Satellite className="w-3 h-3 text-white" />
                          </div>
                          <span className="text-sm font-medium text-gray-800">{language === 'es' ? 'Satélite' : 'Satellite'}</span>
                        </div>
                        <p className="text-xs text-gray-600 leading-relaxed">{pestPopups.ndvi[language]}</p>
                      </div>
                    )}
                  </div>

                  {/* PEST: Pests Monitoring Block */}
                  <div
                    className={`draggable-block absolute transition-all duration-500 ${useCaseStep >= 5 || !useCaseAnimating ? 'opacity-100 scale-100' : 'opacity-0 scale-90'}`}
                    style={{
                      left: `${pestPositions.pests.x}px`,
                      top: `${pestPositions.pests.y}px`,
                      zIndex: activePopup === 'pests' ? 30 : 2
                    }}
                    onClick={() => !useCaseAnimating && setActivePopup(activePopup === 'pests' ? null : 'pests')}
                  >
                    <div className="bg-white rounded-xl shadow-lg w-44 border-2 border-[#EF4444] overflow-hidden">
                      <div className="flex items-center justify-between px-3 py-2 border-b border-gray-100">
                        <div className="flex items-center gap-2">
                          <div className="w-5 h-5 rounded-full bg-[#EF4444] flex items-center justify-center">
                            <Bug className="w-3 h-3 text-white" />
                          </div>
                          <span className="text-xs text-medium text-gray-800">{language === 'es' ? 'Monitoreo de Plagas' : 'Pest Monitoring'}</span>
                        </div>
                      </div>
                      <div className="p-2 space-y-1">
                        <div className="text-[9px] text-gray-500">{language === 'es' ? 'Fuente de datos' : 'Data source'}</div>
                        <div className="px-2 py-1 bg-gray-50 rounded border border-gray-200 text-[9px] text-gray-700">
                          MIIDO WhatsApp
                        </div>
                      </div>
                      <div className="absolute -left-2 top-7 w-4 h-4 bg-[#EF4444] rounded-full border-2 border-white shadow-sm"></div>
                      <div className="absolute -right-2 top-7 w-4 h-4 bg-[#14B8A6] rounded-full border-2 border-white shadow-sm"></div>
                    </div>
                    {activePopup === 'pests' && (
                      <div className="absolute left-full ml-3 top-0 w-64 bg-white rounded-xl shadow-2xl border border-gray-200 p-4 z-40">
                        <button onClick={(e) => { e.stopPropagation(); setActivePopup(null); }} className="absolute top-2 right-2 text-gray-400 hover:text-gray-600">
                          <X className="w-4 h-4" />
                        </button>
                        <div className="flex items-center gap-2 mb-2">
                          <div className="w-6 h-6 rounded-full bg-[#EF4444] flex items-center justify-center">
                            <Bug className="w-3 h-3 text-white" />
                          </div>
                          <span className="text-sm font-medium text-gray-800">{language === 'es' ? 'Monitoreo de Plagas' : 'Pest Monitoring'}</span>
                        </div>
                        <p className="text-xs text-gray-600 leading-relaxed">{pestPopups.pests[language]}</p>
                      </div>
                    )}
                  </div>

                  {/* PEST: AI Block */}
                  <div
                    className={`draggable-block absolute transition-all duration-500 ${useCaseStep >= 6 || !useCaseAnimating ? 'opacity-100 scale-100' : 'opacity-0 scale-90'}`}
                    style={{
                      left: `${pestPositions.ai.x}px`,
                      top: `${pestPositions.ai.y}px`,
                      zIndex: activePopup === 'ai' ? 30 : 2
                    }}
                    onClick={() => !useCaseAnimating && setActivePopup(activePopup === 'ai' ? null : 'ai')}
                  >
                    <div className="bg-white rounded-xl shadow-lg w-44 border-2 border-[#14B8A6] overflow-hidden">
                      <div className="flex items-center justify-between px-3 py-2 border-b border-gray-100">
                        <div className="flex items-center gap-2">
                          <div className="w-5 h-5 rounded-full bg-[#14B8A6] flex items-center justify-center">
                            <span className="text-[8px] text-white font-bold">IA</span>
                          </div>
                          <span className="text-xs text-medium text-gray-800">{language === 'es' ? 'Inteligencia Artificial' : 'AI'}</span>
                        </div>
                      </div>
                      <div className="p-2 space-y-1">
                        <div className="text-[9px] text-gray-500">{language === 'es' ? 'Modelo' : 'Model'}</div>
                        <div className="px-2 py-1 bg-gray-50 rounded border border-gray-200 text-[9px] text-gray-700">GPT-4o Mini</div>
                        <div className="text-[9px] text-gray-500">{language === 'es' ? 'System Prompt' : 'System Prompt'}</div>
                        <div className="px-2 py-1 bg-gray-50 rounded border border-gray-200 text-[7px] text-gray-600 leading-tight">
                          {language === 'es'
                            ? 'Cruza pronóstico + inventario + historial plagas. Predice brotes y verifica stock de Mancozeb, Captan...'
                            : 'Cross forecast + inventory + pest history. Predict outbreaks, check Mancozeb, Captan stock...'}
                        </div>
                      </div>
                      <div className="absolute -left-2 top-8 w-4 h-4 bg-[#14B8A6] rounded-full border-2 border-white shadow-sm"></div>
                      <div className="absolute -right-2 top-8 w-4 h-4 bg-[#22C55E] rounded-full border-2 border-white shadow-sm"></div>
                    </div>
                    {activePopup === 'ai' && (
                      <div className="absolute left-full ml-3 top-0 w-64 bg-white rounded-xl shadow-2xl border border-gray-200 p-4 z-40">
                        <button onClick={(e) => { e.stopPropagation(); setActivePopup(null); }} className="absolute top-2 right-2 text-gray-400 hover:text-gray-600">
                          <X className="w-4 h-4" />
                        </button>
                        <div className="flex items-center gap-2 mb-2">
                          <div className="w-6 h-6 rounded-full bg-[#14B8A6] flex items-center justify-center">
                            <Brain className="w-3 h-3 text-white" />
                          </div>
                          <span className="text-sm font-medium text-gray-800">{language === 'es' ? 'Inteligencia Artificial' : 'AI'}</span>
                        </div>
                        <p className="text-xs text-gray-600 leading-relaxed">{pestPopups.ai[language]}</p>
                      </div>
                    )}
                  </div>

                  {/* PEST: WhatsApp Block */}
                  <div
                    className={`draggable-block absolute transition-all duration-500 ${useCaseStep >= 7 || !useCaseAnimating ? 'opacity-100 scale-100' : 'opacity-0 scale-90'}`}
                    style={{
                      left: `${pestPositions.whatsapp.x}px`,
                      top: `${pestPositions.whatsapp.y}px`,
                      zIndex: activePopup === 'whatsapp' ? 30 : 2
                    }}
                    onClick={() => !useCaseAnimating && setActivePopup(activePopup === 'whatsapp' ? null : 'whatsapp')}
                  >
                    <div className="bg-white rounded-xl shadow-lg w-44 border-2 border-[#22C55E] overflow-hidden">
                      <div className="flex items-center gap-2 px-3 py-2 border-b border-gray-100">
                        <div className="w-5 h-5 rounded-full bg-[#22C55E] flex items-center justify-center">
                          <MessageCircle className="w-3 h-3 text-white" />
                        </div>
                        <span className="text-xs text-medium text-gray-800">WhatsApp</span>
                      </div>
                      <div className="p-2 space-y-1">
                        <div className="text-[8px] text-gray-500">{language === 'es' ? 'Mensaje de ejemplo' : 'Sample message'}</div>
                        <div className="px-2 py-1.5 bg-[#DCF8C6] rounded text-[7px] text-gray-700 leading-tight">
                          ⚠️ {language === 'es' ? 'Lluvia en 48hrs. Sin stock Mancozeb. Botrytis en Cuartel 5.' : 'Rain in 48hrs. No Mancozeb stock. Botrytis in Block 5.'}
                        </div>
                      </div>
                      <div className="absolute -left-2 top-6 w-4 h-4 bg-[#22C55E] rounded-full border-2 border-white shadow-sm"></div>
                    </div>
                    {activePopup === 'whatsapp' && (
                      <div className="absolute right-full mr-3 top-0 w-72 bg-white rounded-xl shadow-2xl border border-gray-200 p-4 z-40">
                        <button onClick={(e) => { e.stopPropagation(); setActivePopup(null); }} className="absolute top-2 right-2 text-gray-400 hover:text-gray-600">
                          <X className="w-4 h-4" />
                        </button>
                        <div className="flex items-center gap-2 mb-2">
                          <div className="w-6 h-6 rounded-full bg-[#22C55E] flex items-center justify-center">
                            <MessageCircle className="w-3 h-3 text-white" />
                          </div>
                          <span className="text-sm font-medium text-gray-800">WhatsApp</span>
                        </div>
                        <p className="text-xs text-gray-600 leading-relaxed">{pestPopups.whatsapp[language]}</p>
                        <div className="mt-3 p-2 bg-green-50 rounded-lg border border-green-200">
                          <p className="text-[10px] text-green-700 font-medium">{language === 'es' ? 'Resultado: Mejor producción, menos pérdidas' : 'Result: Better production, fewer losses'}</p>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Pest SVG Connections */}
                  <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ zIndex: 1 }}>
                    {(useCaseStep >= 8 || !useCaseAnimating) && connections.map((conn, idx) => {
                      const fromPos = pestPositions[conn.from];
                      const toPos = pestPositions[conn.to];
                      if (!fromPos || !toPos) return null;

                      const fromX = fromPos.x + 130;
                      const fromY = fromPos.y + 28;
                      const toX = toPos.x;
                      const toY = toPos.y + 28;
                      const midX = (fromX + toX) / 2;

                      const colors: Record<string, string> = {
                        'inventory': '#6366F1',
                        'weather': '#F59E0B',
                        'ndvi': '#10B981',
                        'pests': '#EF4444',
                        'ai': '#14B8A6',
                        'whatsapp': '#22C55E'
                      };

                      return (
                        <path
                          key={idx}
                          d={`M ${fromX} ${fromY} C ${midX} ${fromY}, ${midX} ${toY}, ${toX} ${toY}`}
                          fill="none"
                          stroke={colors[conn.to] || '#6B7280'}
                          strokeWidth="2"
                          className="transition-all duration-500"
                        />
                      );
                    })}
                  </svg>
                </>
              )}

              {/* Animated Cursor - only during animation */}
              {isAnimating && animationStep >= 1 && animationStep < 8 && (
                <div
                  className="absolute transition-all duration-700 ease-in-out pointer-events-none"
                  style={{
                    left: `${cursorPos.x}px`,
                    top: `${cursorPos.y}px`,
                    zIndex: 20
                  }}
                >
                  <MousePointer2 className="w-6 h-6 text-gray-700 drop-shadow-lg" />
                  {(animationStep === 2 || animationStep === 4 || animationStep === 6) && (
                    <div className="absolute -top-1 -right-1 w-4 h-4 bg-[#8B5CF6] rounded-full flex items-center justify-center animate-pulse">
                      <Plus className="w-3 h-3 text-white" />
                    </div>
                  )}
                </div>
              )}

              {/* Mini map hint */}
              <div className="absolute bottom-3 right-20 flex gap-1">
                <div className="w-4 h-4 bg-[#38507E] rounded opacity-60"></div>
                <div className="w-4 h-4 bg-[#38507E] rounded opacity-60"></div>
                <div className="w-4 h-4 bg-[#51A09A] rounded opacity-60"></div>
                <div className="w-4 h-4 bg-[#51A09A] rounded opacity-60"></div>
              </div>
            </div>
          </div>

          {/* Interaction hints - only show after animation (hidden in simpleMode) */}
          {!isAnimating && !simpleMode && (
            <div className="mt-4 text-center space-y-1">
              <span className="block text-sm text-gray-400 dark:text-gray-500 text-light">
                {language === 'es' ? '👆 Arrastra los bloques para moverlos' : '👆 Drag blocks to move them'}
              </span>
              <span className="block text-sm text-gray-400 dark:text-gray-500 text-light">
                {language === 'es' ? '🔗 Arrastra desde los puntos de colores para conectar • Haz clic en una línea para desconectar' : '🔗 Drag from colored dots to connect • Click on a line to disconnect'}
              </span>
            </div>
          )}

          {/* Feature highlights below (hidden in simpleMode) */}
          {!simpleMode && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
              <div className="text-center p-4">
                <div className="w-12 h-12 mx-auto mb-3 bg-[#38507E]/10 rounded-full flex items-center justify-center">
                  <Database className="w-6 h-6 text-[#38507E]" />
                </div>
                <h3 className="text-medium text-gray-900 dark:text-white mb-1">
                  {language === 'es' ? '+20 Integraciones' : '+20 Integrations'}
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 text-ultra-light">
                  {language === 'es' ? 'Dropcontrol, SAP, y más' : 'Dropcontrol, SAP, and more'}
                </p>
              </div>
              <div className="text-center p-4">
                <div className="w-12 h-12 mx-auto mb-3 bg-[#51A09A]/10 rounded-full flex items-center justify-center">
                  <Brain className="w-6 h-6 text-[#51A09A]" />
                </div>
                <h3 className="text-medium text-gray-900 dark:text-white mb-1">
                  {language === 'es' ? 'IA Personalizada' : 'Custom AI'}
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 text-ultra-light">
                  {language === 'es' ? 'Define lo que necesitas en lenguaje natural' : 'Define what you need in natural language'}
                </p>
              </div>
              <div className="text-center p-4">
                <div className="w-12 h-12 mx-auto mb-3 bg-[#25D366]/10 rounded-full flex items-center justify-center">
                  <MessageCircle className="w-6 h-6 text-[#25D366]" />
                </div>
                <h3 className="text-medium text-gray-900 dark:text-white mb-1">
                  {language === 'es' ? 'WhatsApp Nativo' : 'Native WhatsApp'}
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 text-ultra-light">
                  {language === 'es' ? 'Interactúa desde donde ya estás' : 'Interact from where you already are'}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default WorkflowBuilder;

