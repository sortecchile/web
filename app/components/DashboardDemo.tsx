'use client';

import { useState, useEffect, useRef } from 'react';
import { useLanguageContext } from '../i18n/LanguageProvider';
import { Send, Sparkles, TrendingUp, BarChart3, PieChart, Activity, Droplets, Thermometer, Clock, Leaf, FlaskConical, DollarSign } from 'lucide-react';

type DashboardType = 'harvest' | 'irrigation' | 'fertilizer';

const DashboardDemo = () => {
  const { language } = useLanguageContext();
  const [typedText, setTypedText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [showDashboard, setShowDashboard] = useState(false);
  const [dashboardStep, setDashboardStep] = useState(0);
  const [dashboardType, setDashboardType] = useState<DashboardType>('harvest');
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);

  const prompts = {
    harvest: language === 'es'
      ? 'Hazme un dashboard completo de cosecha del último mes'
      : 'Create a complete harvest dashboard for last month',
    irrigation: language === 'es'
      ? 'Dame un dashboard completo del riego de mi campo'
      : 'Give me a complete irrigation dashboard for my field',
    fertilizer: language === 'es'
      ? 'Muéstrame el uso de fertilizantes en el campo'
      : 'Show me fertilizer usage in the field'
  };

  // Intersection Observer
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

  // Función para animar un dashboard
  const animateDashboard = async (type: DashboardType) => {
    const promptText = prompts[type];
    setDashboardType(type);

    // Escribir texto
    setIsTyping(true);
    for (let i = 0; i <= promptText.length; i++) {
      await new Promise(r => setTimeout(r, 40));
      setTypedText(promptText.slice(0, i));
    }
    setIsTyping(false);

    // Generar
    await new Promise(r => setTimeout(r, 400));
    setIsGenerating(true);

    // Mostrar dashboard progresivamente
    await new Promise(r => setTimeout(r, 700));
    setShowDashboard(true);

    for (let i = 1; i <= 4; i++) {
      await new Promise(r => setTimeout(r, 350));
      setDashboardStep(i);
    }

    setIsGenerating(false);

    // Mantener visible
    await new Promise(r => setTimeout(r, 4000));
  };

  // Animación principal con loop
  useEffect(() => {
    if (!isVisible) return;

    const runAnimation = async () => {
      // Dashboard 1: Cosecha
      await animateDashboard('harvest');

      // Limpiar para el siguiente
      setShowDashboard(false);
      setDashboardStep(0);
      setTypedText('');
      await new Promise(r => setTimeout(r, 500));

      // Dashboard 2: Riego
      await animateDashboard('irrigation');

      // Limpiar para el siguiente
      setShowDashboard(false);
      setDashboardStep(0);
      setTypedText('');
      await new Promise(r => setTimeout(r, 500));

      // Dashboard 3: Fertilizantes
      await animateDashboard('fertilizer');

      // Reset completo y reiniciar
      await new Promise(r => setTimeout(r, 2000));
      setTypedText('');
      setShowDashboard(false);
      setDashboardStep(0);
      setIsVisible(false);
      setTimeout(() => setIsVisible(true), 100);
    };

    runAnimation();
  }, [isVisible]);

  return (
    <div ref={sectionRef} className="w-full max-w-4xl mx-auto">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 overflow-hidden">
        {/* Header del dashboard */}
        <div className="flex items-center justify-between px-4 py-3 bg-gradient-to-r from-[#14B8A6]/10 to-transparent border-b border-gray-100 dark:border-gray-700">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#14B8A6] to-[#0D9488] flex items-center justify-center shadow-lg">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <span className="text-sm font-semibold text-gray-800 dark:text-white">
              {language === 'es' ? 'Dashboard Builder AI' : 'AI Dashboard Builder'}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-red-400"></div>
            <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
            <div className="w-3 h-3 rounded-full bg-green-400"></div>
          </div>
        </div>

        {/* Área del dashboard */}
        <div className="p-4 min-h-[320px] bg-gray-50 dark:bg-gray-900/50">
          {!showDashboard ? (
            <div className="flex items-center justify-center h-[280px]">
              {isGenerating ? (
                <div className="text-center space-y-4">
                  <div className="w-16 h-16 mx-auto border-4 border-[#14B8A6] border-t-transparent rounded-full animate-spin"></div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 animate-pulse">
                    {language === 'es' ? 'Generando dashboard...' : 'Generating dashboard...'}
                  </p>
                </div>
              ) : (
                <div className="text-center text-gray-400 dark:text-gray-500">
                  <BarChart3 className="w-16 h-16 mx-auto mb-3 opacity-30" />
                  <p className="text-sm">
                    {language === 'es' ? 'Escribe un prompt para crear tu dashboard' : 'Write a prompt to create your dashboard'}
                  </p>
                </div>
              )}
            </div>
          ) : (
            <div className="space-y-3">
              {/* Título del dashboard generado */}
              <div className={`transition-all duration-500 ${dashboardStep >= 1 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
                <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
                  {dashboardType === 'harvest'
                    ? (language === 'es' ? '📊 Dashboard de Cosecha - Último Mes' : '📊 Harvest Dashboard - Last Month')
                    : dashboardType === 'irrigation'
                    ? (language === 'es' ? '💧 Dashboard de Riego - Mi Campo' : '💧 Irrigation Dashboard - My Field')
                    : (language === 'es' ? '🧪 Dashboard de Fertilizantes' : '🧪 Fertilizer Dashboard')
                  }
                </h3>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {language === 'es' ? 'Generado automáticamente por IA' : 'Auto-generated by AI'}
                </p>
              </div>

              {/* KPIs - Dinámicos según tipo */}
              <div className={`grid grid-cols-3 gap-3 transition-all duration-500 ${dashboardStep >= 2 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
                {dashboardType === 'harvest' ? (
                  <>
                    <div className="bg-white dark:bg-gray-800 rounded-xl p-3 border border-gray-200 dark:border-gray-700 shadow-sm">
                      <div className="flex items-center gap-2 mb-1">
                        <TrendingUp className="w-4 h-4 text-green-500" />
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                          {language === 'es' ? 'Total Cosechado' : 'Total Harvested'}
                        </span>
                      </div>
                      <p className="text-xl font-bold text-gray-800 dark:text-white">12,450 <span className="text-xs font-normal text-gray-500">kg</span></p>
                      <p className="text-xs text-green-500">↑ 15% vs mes anterior</p>
                    </div>
                    <div className="bg-white dark:bg-gray-800 rounded-xl p-3 border border-gray-200 dark:border-gray-700 shadow-sm">
                      <div className="flex items-center gap-2 mb-1">
                        <Activity className="w-4 h-4 text-blue-500" />
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                          {language === 'es' ? 'Rendimiento' : 'Yield'}
                        </span>
                      </div>
                      <p className="text-xl font-bold text-gray-800 dark:text-white">8.2 <span className="text-xs font-normal text-gray-500">t/ha</span></p>
                      <p className="text-xs text-blue-500">↑ 5% vs promedio</p>
                    </div>
                    <div className="bg-white dark:bg-gray-800 rounded-xl p-3 border border-gray-200 dark:border-gray-700 shadow-sm">
                      <div className="flex items-center gap-2 mb-1">
                        <PieChart className="w-4 h-4 text-purple-500" />
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                          {language === 'es' ? 'Calidad Premium' : 'Premium Quality'}
                        </span>
                      </div>
                      <p className="text-xl font-bold text-gray-800 dark:text-white">78%</p>
                      <p className="text-xs text-purple-500">Categoría A</p>
                    </div>
                  </>
                ) : dashboardType === 'irrigation' ? (
                  <>
                    <div className="bg-white dark:bg-gray-800 rounded-xl p-3 border border-gray-200 dark:border-gray-700 shadow-sm">
                      <div className="flex items-center gap-2 mb-1">
                        <Droplets className="w-4 h-4 text-blue-500" />
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                          {language === 'es' ? 'Agua Utilizada' : 'Water Used'}
                        </span>
                      </div>
                      <p className="text-xl font-bold text-gray-800 dark:text-white">2,340 <span className="text-xs font-normal text-gray-500">m³</span></p>
                      <p className="text-xs text-green-500">↓ 12% vs mes anterior</p>
                    </div>
                    <div className="bg-white dark:bg-gray-800 rounded-xl p-3 border border-gray-200 dark:border-gray-700 shadow-sm">
                      <div className="flex items-center gap-2 mb-1">
                        <Thermometer className="w-4 h-4 text-orange-500" />
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                          {language === 'es' ? 'Eficiencia' : 'Efficiency'}
                        </span>
                      </div>
                      <p className="text-xl font-bold text-gray-800 dark:text-white">94.2%</p>
                      <p className="text-xs text-green-500">↑ 3% optimizado</p>
                    </div>
                    <div className="bg-white dark:bg-gray-800 rounded-xl p-3 border border-gray-200 dark:border-gray-700 shadow-sm">
                      <div className="flex items-center gap-2 mb-1">
                        <Clock className="w-4 h-4 text-cyan-500" />
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                          {language === 'es' ? 'Hrs. Riego' : 'Irrigation Hrs'}
                        </span>
                      </div>
                      <p className="text-xl font-bold text-gray-800 dark:text-white">156 <span className="text-xs font-normal text-gray-500">hrs</span></p>
                      <p className="text-xs text-blue-500">18 sectores</p>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="bg-white dark:bg-gray-800 rounded-xl p-3 border border-gray-200 dark:border-gray-700 shadow-sm">
                      <div className="flex items-center gap-2 mb-1">
                        <FlaskConical className="w-4 h-4 text-emerald-500" />
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                          {language === 'es' ? 'Nitrógeno (N)' : 'Nitrogen (N)'}
                        </span>
                      </div>
                      <p className="text-xl font-bold text-gray-800 dark:text-white">245 <span className="text-xs font-normal text-gray-500">kg/ha</span></p>
                      <p className="text-xs text-green-500">Óptimo</p>
                    </div>
                    <div className="bg-white dark:bg-gray-800 rounded-xl p-3 border border-gray-200 dark:border-gray-700 shadow-sm">
                      <div className="flex items-center gap-2 mb-1">
                        <Leaf className="w-4 h-4 text-lime-500" />
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                          {language === 'es' ? 'Fósforo (P)' : 'Phosphorus (P)'}
                        </span>
                      </div>
                      <p className="text-xl font-bold text-gray-800 dark:text-white">82 <span className="text-xs font-normal text-gray-500">kg/ha</span></p>
                      <p className="text-xs text-yellow-500">↑ Revisar dosis</p>
                    </div>
                    <div className="bg-white dark:bg-gray-800 rounded-xl p-3 border border-gray-200 dark:border-gray-700 shadow-sm">
                      <div className="flex items-center gap-2 mb-1">
                        <DollarSign className="w-4 h-4 text-amber-500" />
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                          {language === 'es' ? 'Costo Total' : 'Total Cost'}
                        </span>
                      </div>
                      <p className="text-xl font-bold text-gray-800 dark:text-white">$18,450</p>
                      <p className="text-xs text-green-500">↓ 8% vs presupuesto</p>
                    </div>
                  </>
                )}
              </div>

              {/* Gráfico simulado - Dinámico */}
              <div className={`bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700 shadow-sm transition-all duration-500 ${dashboardStep >= 3 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    {dashboardType === 'harvest'
                      ? (language === 'es' ? 'Evolución Diaria de Cosecha' : 'Daily Harvest Evolution')
                      : dashboardType === 'irrigation'
                      ? (language === 'es' ? 'Consumo de Agua por Sector' : 'Water Consumption by Sector')
                      : (language === 'es' ? 'Aplicación de Nutrientes por Cuartel' : 'Nutrient Application by Block')
                    }
                  </span>
                  <span className="text-xs text-gray-500 px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded">
                    {language === 'es' ? 'Barras' : 'Bars'}
                  </span>
                </div>
                {/* Gráfico de barras animado */}
                <div className="flex items-end gap-1 h-24">
                  {(dashboardType === 'harvest'
                    ? [40, 65, 55, 80, 70, 90, 85, 75, 95, 60, 70, 88]
                    : dashboardType === 'irrigation'
                    ? [85, 72, 90, 65, 78, 82, 55, 70, 88, 60, 75, 68]
                    : [70, 85, 60, 90, 75, 80, 65, 78, 88, 72, 82, 68]
                  ).map((height, idx) => (
                    <div
                      key={idx}
                      className={`flex-1 rounded-t transition-all duration-700 ${
                        dashboardType === 'harvest'
                          ? 'bg-gradient-to-t from-[#14B8A6] to-[#0D9488]'
                          : dashboardType === 'irrigation'
                          ? 'bg-gradient-to-t from-[#3B82F6] to-[#60A5FA]'
                          : 'bg-gradient-to-t from-[#22C55E] to-[#86EFAC]'
                      }`}
                      style={{
                        height: dashboardStep >= 4 ? `${height}%` : '0%',
                        transitionDelay: `${idx * 50}ms`
                      }}
                    />
                  ))}
                </div>
                <div className="flex justify-between mt-2 text-[10px] text-gray-400">
                  {dashboardType === 'harvest' ? (
                    <><span>1</span><span>5</span><span>10</span><span>15</span><span>20</span><span>25</span><span>30</span></>
                  ) : dashboardType === 'irrigation' ? (
                    <><span>S1</span><span>S2</span><span>S3</span><span>S4</span><span>S5</span><span>S6</span><span>S7</span></>
                  ) : (
                    <><span>C1</span><span>C2</span><span>C3</span><span>C4</span><span>C5</span><span>C6</span><span>C7</span></>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Input de chat */}
        <div className="p-4 border-t border-gray-100 dark:border-gray-700 bg-white dark:bg-gray-800">
          <div className="flex items-center gap-3">
            <div className="flex-1 relative">
              <input
                type="text"
                value={typedText}
                readOnly
                placeholder={language === 'es' ? 'Pregunta lo que quieras...' : 'Ask anything...'}
                className="w-full px-4 py-3 pr-12 bg-gray-50 dark:bg-gray-700 rounded-xl border border-gray-200 dark:border-gray-600 text-sm text-gray-700 dark:text-gray-200 placeholder-gray-400 focus:outline-none"
              />
              {isTyping && (
                <span className="absolute right-4 top-1/2 -translate-y-1/2 w-0.5 h-5 bg-[#14B8A6] animate-pulse"></span>
              )}
            </div>
            <button 
              className={`p-3 rounded-xl transition-all ${
                isGenerating 
                  ? 'bg-[#14B8A6] text-white animate-pulse' 
                  : typedText 
                  ? 'bg-[#14B8A6] text-white hover:bg-[#0D9488]' 
                  : 'bg-gray-200 dark:bg-gray-600 text-gray-400'
              }`}
            >
              <Send className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardDemo;

