"use client"

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { Button } from "@/src/components/ui/button"
import { AnimatePresence, motion } from "framer-motion"
import { useLanguageContext } from '@/app/i18n/LanguageProvider'

// Definición de tipos para los casos de uso
interface UseCase {
  id: string
  name: string
  videoUrl: string
  title: string
  description: string
  bullets: string[]
}

// Array de casos de uso
const useCases: UseCase[] = [
  {
    id: 'campo-completo',
    name: 'Campo completo',
    videoUrl: 'https://www.tella.tv/video/cm47fh5kh001603mo2gc10opu/embed?b=0&title=0&a=1&loop=1&autoPlay=true&t=0&muted=1&wt=0',
    title: 'Gestión integral del campo desde WhatsApp',
    description: 'Desde fertilización hasta mantenciones: todo se registra con mensajes simples. MIIDO centraliza los datos, genera reportes y mejora la toma de decisiones en tiempo real.',
    bullets: [
      'Todas las operaciones en un solo sistema',
      'Información centralizada y en tiempo real',
      'Reportes automáticos por área y actividad',
      'obten información de la operación con un simple mensaje en Whatsapp'
    ]
  },
  {
    id: 'maquinarias',
    name: 'Maquinaria',
    videoUrl: 'https://www.tella.tv/video/cmahdig8g00020bjy1e9g75tv/embed?b=1&title=1&a=1&loop=0&t=0&muted=0&wt=1',
    title: 'Control de maquinarias en tiempo real',
    description: 'Con MIIDO, basta un mensaje por WhatsApp para registrar la detención de una máquina. Sin apps ni procesos complejos. Un ingenio azucarero en Costa Rica ya gestiona más de 200 equipos así.',
    bullets: [
      'Registro instantáneo desde el campo',
      'Recibe alertas sobre problemas en el sistema',
      'Carga Gantt automática',
      'Analítica de uso y tiempo de paro'
    ]
  },
  {
    id: 'Labores',
    name: 'Labores',
    videoUrl: 'https://www.tella.tv/video/cm47fh5kh001603mo2gc10opu/embed?b=0&title=0&a=1&loop=1&autoPlay=true&t=0&muted=1&wt=0',
    title: 'Registro y costos de labores en un solo mensaje',
    description: 'Los encargados del campo mandan por WhatsApp zona, actividad y cuántas personas trabajaron. MIIDO calcula todo automáticamente: costos, eficiencia y reportes listos para decidir.',
    bullets: [
      'Costo total y por acre en automático',
      'Ranking de jefes cuadrilla más eficientes',
      'Análisis por tipo de labor agrícola',
      'Estadística con lenguaje natural'
    ]
  },
  {
    id: 'Fertilización',
    name: 'Fertilzación',
    videoUrl: 'https://www.tella.tv/video/cm47fh5kh001603mo2gc10opu/embed?b=0&title=0&a=1&loop=1&autoPlay=true&t=0&muted=1&wt=0',
    title: 'Fertilización con control total desde WhatsApp',
    description: 'Los encargados mandan la dosis por sector y MIIDO calcula el costo total, por litro y por aplicación.También pueden consultar stock y precios de cada producto al instante desde el mismo chat.',
    bullets: [
      'Costo por aplicación y por litro automático',
      'Control de stock y precios de fertilizantes',
      'Registro y análisis por sector de riego',
      'Consultas en el mismo chat'
    ]
  },
  {
    id: 'Combustible',
    name: 'Combustible',
    videoUrl: 'https://www.tella.tv/video/cm47fh5kh001603mo2gc10opu/embed?b=0&title=0&a=1&loop=1&autoPlay=true&t=0&muted=1&wt=0',
    title: 'Control de combustible sin cuadernos',
    description: 'Los operadores registran cada carga por WhatsApp. MIIDO calcula el uso por máquina, frecuencia de carga y rendimiento por hora o kilómetro.',
    bullets: [
      'Registro digital de cada carga',
      'Análisis por máquina, operador y fecha',
      'Rendimiento por hora y por kilómetro',
      'Analítica de uso de maquinas.'
    ]
  }
]

export default function UseCasesSection() {
  const { language } = useLanguageContext()
  const [activeTab, setActiveTab] = useState<string>(useCases[0].id)
  const [isMobile, setIsMobile] = useState<boolean>(false)

  // Detectar si es móvil para ajustar el diseño
  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }

    checkIfMobile()
    window.addEventListener('resize', checkIfMobile)

    return () => {
      window.removeEventListener('resize', checkIfMobile)
    }
  }, [])

  // Obtener el caso de uso activo
  const activeUseCase = useCases.find(useCase => useCase.id === activeTab) || useCases[0]

  return (
    <section className="w-full py-12 md:py-24 lg:py-32 relative overflow-hidden bg-white dark:bg-[#111827]">
      {/* Grid Overlay - similar a la primera sección */}
      <div className="absolute inset-0 -z-1 pointer-events-none">
        <div
          className="w-full h-full"
          style={{
            position: 'absolute',
            inset: 0,
            backgroundImage: `
              linear-gradient(to bottom, rgba(0, 0, 0, 0.04) 1px, transparent 1px),
              linear-gradient(to right, rgba(0, 0, 0, 0.04) 1px, transparent 1px)
            `,
            backgroundSize: '40px 40px',
            maskImage: 'linear-gradient(to bottom, black 60%, transparent 100%)',
            WebkitMaskImage: 'linear-gradient(to bottom, black 60%, transparent 100%)',
            opacity: 0.07,
            zIndex: 1
          }}
        />
      </div>

      {/* Grid Overlay para modo oscuro */}
      <div className="absolute inset-0 -z-1 pointer-events-none hidden dark:block">
        <div
          className="w-full h-full"
          style={{
            position: 'absolute',
            inset: 0,
            backgroundImage: `
              linear-gradient(to bottom, rgba(255, 255, 255, 0.04) 1px, transparent 1px),
              linear-gradient(to right, rgba(255, 255, 255, 0.04) 1px, transparent 1px)
            `,
            backgroundSize: '40px 40px',
            maskImage: 'linear-gradient(to bottom, black 60%, transparent 100%)',
            WebkitMaskImage: 'linear-gradient(to bottom, black 60%, transparent 100%)',
            opacity: 0.3,
            zIndex: 1
          }}
        />
      </div>

      <div className="container px-4 md:px-6 relative z-10">
        <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl text-center mb-12 text-gray-900 dark:text-white">
          {language === 'es' ? 'Casos de Uso' : 'Use Cases'}
        </h2>

        {/* Tabs de navegación - estilo similar a "Apoyados por" */}
        <div className="mb-12 overflow-x-auto pb-4">
          <div className="flex md:justify-center min-w-max bg-white dark:bg-[#111827] border border-[#38507E] rounded-full px-4 py-1.5 max-w-3xl mx-auto shadow-md dark:shadow-[0_0_15px_rgba(0,0,0,0.3)]">
            {useCases.map((useCase) => (
              <button
                key={useCase.id}
                onClick={() => setActiveTab(useCase.id)}
                className={`px-4 py-1.5 mx-1 rounded-full text-sm font-medium transition-all whitespace-nowrap
                  ${activeTab === useCase.id
                    ? 'bg-[#38507E] text-white'
                    : 'text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white'
                  }`}
              >
                {useCase.name}
              </button>
            ))}
          </div>
        </div>

        {/* Contenido principal - Layout con video a la izquierda y texto a la derecha */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          {/* Video a la izquierda */}
          <div className="order-2 md:order-1">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab + "-video"}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.4, ease: "easeInOut" }}
                className="relative border border-gray-200 dark:border-[#38507E] rounded-lg overflow-hidden shadow-lg dark:shadow-[0_0_20px_rgba(81,160,154,0.15)]"
                style={{ paddingBottom: '56.25%', height: 0 }}
              >
                <iframe
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    border: 0,
                  }}
                  src={activeUseCase.videoUrl}
                  allowFullScreen
                  allowTransparency={true}
                ></iframe>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Texto explicativo a la derecha */}
          <div className="order-1 md:order-2">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab + "-content"}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.4, ease: "easeInOut" }}
                className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-6 shadow-sm h-full"
              >
                <h3 className="text-xl font-medium mb-3 text-gray-900 dark:text-white">
                  {activeUseCase.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-300 text-sm mb-4">
                  {activeUseCase.description}
                </p>

                {/* Bullets más sutiles y en formato horizontal */}
                <div className="flex flex-wrap gap-3 mb-6">
                  {activeUseCase.bullets.map((bullet, index) => (
                    <motion.div
                      key={index}
                      className="inline-flex items-center bg-white/80 dark:bg-gray-700/50 px-3 py-1.5 rounded-full text-xs"
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.3, delay: index * 0.05 }}
                    >
                      <span className="w-1.5 h-1.5 bg-[#C2DB64] rounded-full mr-1.5 flex-shrink-0"></span>
                      <span className="text-gray-700 dark:text-gray-200">{bullet}</span>
                    </motion.div>
                  ))}
                </div>

                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.3 }}
                  className="flex justify-start"
                >
                  <Button className="bg-white dark:bg-[#111827] border border-[#38507E] hover:border-[#51A09A] text-gray-800 dark:text-white rounded-full shadow-md hover:shadow-lg px-6 py-2 text-sm">
                    {language === 'es' ? 'Ver cómo funciona' : 'See how it works'}
                  </Button>
                </motion.div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  )
}
