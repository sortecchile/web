'use client';

import { useState, useEffect, useRef } from 'react';
import { useLanguageContext } from '../i18n/LanguageProvider';
import { Check, Lock, Eye, EyeOff, ChevronDown, MousePointer2 } from 'lucide-react';

// Lista de softwares/integraciones disponibles
const integrations = [
  { id: 'wiseconn', name: 'Wiseconn (Dropcontrol)', logo: '/integrations/wiseconn.png', color: '#3B82F6' },
  { id: 'sap', name: 'SAP', logo: '/integrations/sap.png', color: '#0FAAFF' },
  { id: 'agroinventario', name: 'Agroinventario', logo: '/integrations/agroinventario.png', color: '#22C55E' },
  { id: 'salesforce', name: 'Salesforce', logo: '/integrations/salesforce.png', color: '#00A1E0' },
  { id: 'odoo', name: 'Odoo', logo: '/integrations/odoo.png', color: '#714B67' },
  { id: 'excel', name: 'Excel / Google Sheets', logo: '/integrations/excel.png', color: '#217346' },
];

const IntegrationDemo = () => {
  const { language } = useLanguageContext();
  const [selectedIntegration, setSelectedIntegration] = useState(integrations[0]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [animationStep, setAnimationStep] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const [cursorPos, setCursorPos] = useState({ x: 200, y: 50 });
  const [isClicking, setIsClicking] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);

  // Intersection Observer para detectar cuando la sección es visible
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

  // Función para simular click
  const simulateClick = () => {
    setIsClicking(true);
    setTimeout(() => setIsClicking(false), 150);
  };

  // Animación automática cuando es visible
  useEffect(() => {
    if (!isVisible) return;

    const steps = [
      // Cursor aparece y se mueve al dropdown
      { delay: 300, action: () => setCursorPos({ x: 350, y: 20 }) },
      { delay: 800, action: () => setCursorPos({ x: 200, y: 85 }) },
      { delay: 1200, action: () => { simulateClick(); } },
      { delay: 1400, action: () => { setIsDropdownOpen(true); setAnimationStep(1); } },
      // Cursor se mueve a SAP y hace click
      { delay: 1800, action: () => setCursorPos({ x: 120, y: 135 }) },
      { delay: 2200, action: () => { simulateClick(); } },
      { delay: 2400, action: () => { setSelectedIntegration(integrations[1]); setIsDropdownOpen(false); } },
      // Cursor se mueve al campo de usuario
      { delay: 2800, action: () => setCursorPos({ x: 200, y: 160 }) },
      { delay: 3200, action: () => { simulateClick(); setAnimationStep(2); } },
      { delay: 3600, action: () => setUsername('admin@empresa') },
      // Cursor se mueve al campo de contraseña
      { delay: 4000, action: () => setCursorPos({ x: 200, y: 220 }) },
      { delay: 4400, action: () => { simulateClick(); setAnimationStep(3); } },
      { delay: 4800, action: () => setPassword('••••••••') },
      // Cursor se mueve al botón de conectar
      { delay: 5200, action: () => setCursorPos({ x: 200, y: 280 }) },
      { delay: 5600, action: () => { simulateClick(); } },
      { delay: 5800, action: () => setIsConnecting(true) },
      { delay: 7500, action: () => { setIsConnecting(false); setIsConnected(true); } },
      // Cursor desaparece y reset
      { delay: 8000, action: () => setCursorPos({ x: 350, y: 350 }) },
      { delay: 11000, action: () => { // Reset y repetir
        setIsConnected(false);
        setUsername('');
        setPassword('');
        setSelectedIntegration(integrations[0]);
        setAnimationStep(0);
        setCursorPos({ x: 350, y: 20 });
        setIsVisible(false);
        setTimeout(() => setIsVisible(true), 100);
      }},
    ];

    const timeouts: NodeJS.Timeout[] = [];

    steps.forEach(({ delay, action }) => {
      const timeout = setTimeout(action, delay);
      timeouts.push(timeout);
    });

    return () => timeouts.forEach(t => clearTimeout(t));
  }, [isVisible]);

  return (
    <div ref={sectionRef} className="w-full max-w-md mx-auto relative">
      {/* Cursor animado */}
      <div
        className="absolute z-50 pointer-events-none transition-all duration-500 ease-out"
        style={{
          left: cursorPos.x,
          top: cursorPos.y,
          transform: isClicking ? 'scale(0.8)' : 'scale(1)',
        }}
      >
        <MousePointer2
          className={`w-6 h-6 drop-shadow-lg transition-all duration-150 ${isClicking ? 'text-[#F97316]' : 'text-gray-800 dark:text-white'}`}
          style={{
            filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.3))',
            fill: isClicking ? '#F97316' : 'transparent'
          }}
        />
        {isClicking && (
          <div className="absolute -inset-2 bg-[#F97316]/30 rounded-full animate-ping" />
        )}
      </div>

      {/* Caja de integración estilo WorkflowBuilder */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border-2 border-[#F97316] overflow-hidden transition-all duration-300 hover:shadow-3xl">
        {/* Header de la caja */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100 dark:border-gray-700 bg-gradient-to-r from-[#F97316]/5 to-transparent">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-[#F97316] flex items-center justify-center shadow-lg">
              <span className="text-xs text-white font-bold">API</span>
            </div>
            <span className="text-sm font-semibold text-gray-800 dark:text-white">
              {language === 'es' ? 'Conectar Integración' : 'Connect Integration'}
            </span>
          </div>
          {isConnected && (
            <div className="flex items-center gap-1.5 px-2 py-1 bg-green-100 dark:bg-green-900/30 rounded-full">
              <Check className="w-3 h-3 text-green-600" />
              <span className="text-xs text-green-600 font-medium">
                {language === 'es' ? 'Conectado' : 'Connected'}
              </span>
            </div>
          )}
        </div>

        {/* Contenido */}
        <div className="p-5 space-y-4">
          {/* Selector de plataforma */}
          <div className="space-y-2">
            <label className="text-xs font-medium text-gray-600 dark:text-gray-400">
              {language === 'es' ? 'Selecciona tu plataforma' : 'Select your platform'}
            </label>
            <div className="relative">
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="w-full flex items-center justify-between px-3 py-2.5 bg-gray-50 dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600 hover:border-[#F97316] transition-colors cursor-pointer"
              >
                <div className="flex items-center gap-2">
                  <div 
                    className="w-6 h-6 rounded flex items-center justify-center text-white text-xs font-bold"
                    style={{ backgroundColor: selectedIntegration.color }}
                  >
                    {selectedIntegration.name.charAt(0)}
                  </div>
                  <span className="text-sm text-gray-700 dark:text-gray-200">{selectedIntegration.name}</span>
                </div>
                <ChevronDown className={`w-4 h-4 text-gray-500 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
              </button>

              {/* Dropdown de opciones */}
              {isDropdownOpen && (
                <div className="absolute top-full left-0 right-0 mt-1 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-600 shadow-xl z-10 overflow-hidden">
                  {integrations.map((integration) => (
                    <button
                      key={integration.id}
                      onClick={() => {
                        setSelectedIntegration(integration);
                        setIsDropdownOpen(false);
                      }}
                      className={`w-full flex items-center gap-2 px-3 py-2.5 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors ${
                        selectedIntegration.id === integration.id ? 'bg-[#F97316]/10' : ''
                      }`}
                    >
                      <div 
                        className="w-6 h-6 rounded flex items-center justify-center text-white text-xs font-bold"
                        style={{ backgroundColor: integration.color }}
                      >
                        {integration.name.charAt(0)}
                      </div>
                      <span className="text-sm text-gray-700 dark:text-gray-200">{integration.name}</span>
                      {selectedIntegration.id === integration.id && (
                        <Check className="w-4 h-4 text-[#F97316] ml-auto" />
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Campo de usuario */}
          <div className="space-y-2">
            <label className="text-xs font-medium text-gray-600 dark:text-gray-400">
              {language === 'es' ? 'Usuario o Email' : 'Username or Email'}
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder={language === 'es' ? 'tu@empresa.com' : 'you@company.com'}
              className="w-full px-3 py-2.5 bg-gray-50 dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600 text-sm text-gray-700 dark:text-gray-200 placeholder-gray-400 focus:outline-none focus:border-[#F97316] focus:ring-1 focus:ring-[#F97316] transition-all"
            />
          </div>

          {/* Campo de contraseña */}
          <div className="space-y-2">
            <label className="text-xs font-medium text-gray-600 dark:text-gray-400">
              {language === 'es' ? 'Contraseña o API Key' : 'Password or API Key'}
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full px-3 py-2.5 pr-10 bg-gray-50 dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600 text-sm text-gray-700 dark:text-gray-200 placeholder-gray-400 focus:outline-none focus:border-[#F97316] focus:ring-1 focus:ring-[#F97316] transition-all"
              />
              <button
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Botón de conectar */}
          <button
            disabled={isConnecting || isConnected}
            className={`w-full py-3 rounded-lg font-medium text-sm flex items-center justify-center gap-2 transition-all duration-300 ${
              isConnected
                ? 'bg-green-500 text-white cursor-default'
                : isConnecting
                ? 'bg-[#F97316] text-white cursor-wait'
                : 'bg-[#F97316] text-white hover:bg-[#EA580C] cursor-pointer'
            }`}
          >
            {isConnected ? (
              <>
                <Check className="w-4 h-4" />
                {language === 'es' ? '¡Conectado exitosamente!' : 'Successfully connected!'}
              </>
            ) : isConnecting ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                {language === 'es' ? 'Conectando...' : 'Connecting...'}
              </>
            ) : (
              <>
                <Lock className="w-4 h-4" />
                {language === 'es' ? 'Conectar de forma segura' : 'Connect securely'}
              </>
            )}
          </button>

          {/* Mensaje de seguridad */}
          <p className="text-xs text-center text-gray-500 dark:text-gray-400">
            🔒 {language === 'es' ? 'Conexión encriptada de extremo a extremo' : 'End-to-end encrypted connection'}
          </p>
        </div>
      </div>
    </div>
  );
};

export default IntegrationDemo;

