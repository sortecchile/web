"use client"

import { useState, useEffect, useRef } from 'react'
import { Button } from "@/src/components/ui/button"
import { Input } from "@/src/components/ui/input"
import { CheckCircle, BarChart2, Users, ArrowUp, Send, ChevronLeft, ChevronRight, MoreHorizontal, Edit2, Mic, MessageCircle, Menu, X, Plus, Minus, PlayCircle, Sun, Moon } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
import NewsSection from './NewsSection'
import UseCasesSection from './components/UseCasesSection'
import WorkflowBuilder from './components/WorkflowBuilder'
import IntegrationDemo from './components/IntegrationDemo'
import DashboardDemo from './components/DashboardDemo'

import dynamic from 'next/dynamic'
import { useDarkMode } from './hooks/useDarkMode'
import { useLanguageContext } from './i18n/LanguageProvider'
import { LanguageSwitcher } from './components/LanguageSwitcher'

const ReactPlayer = dynamic(() => import('react-player/lazy'), { ssr: false })


  // Waves

  function MultiWaveAudio() {
    const waveColors = ['#38507E', '#51A09A', '#C2DB64']
    const waveCount = 3

  const createWavePath = (offset: number) => {
      const points = []
      for (let i = 0; i <= 100; i++) {
        const x = i / 100
        const y = Math.sin(x * Math.PI * 4 + offset) * 0.15 + 0.5
        points.push(`${x * 100},${y * 100}`)
      }
      return `M0,50 ${points.join(' ')} 100,50`
    }
    return (
      <div className="w-full bg-background dark:bg-gray-900 overflow-hidden" style={{ height: '100px' }}>


        <svg width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none">
          {[...Array(waveCount)].map((_, index) => (
            <path
              key={index}
              d={createWavePath(index * 0.5)}
              fill="none"
              stroke={waveColors[index % waveColors.length]}
              strokeWidth="0.5"
              strokeOpacity="0.5"
              vectorEffect="non-scaling-stroke"
            />
          ))}
        </svg>
      </div>
    )
  }


export default function Component() {
  const { isDark, toggleDarkMode } = useDarkMode()
  const { t, language, isClient } = useLanguageContext()
  const [email, setEmail] = useState('')
  const [scrollProgress, setScrollProgress] = useState(0)
  const [scrollProgressNewSection, setScrollProgressNewSection] = useState(0)
  const [weekOffset, setWeekOffset] = useState(0)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [openQuestion, setOpenQuestion] = useState<number | null>(null)
  const demoRef = useRef<HTMLElement>(null)
  const newSectionRef = useRef<HTMLElement>(null)
  const contactRef = useRef<HTMLDivElement>(null)
  const aboutRef = useRef<HTMLDivElement>(null)
  // const howtRef = useRef<HTMLDivElement>(null) // Temporalmente comentado
  const casesRef = useRef<HTMLElement>(null)
  const testimonialsRef = useRef<HTMLElement>(null)
  const [playingVideo, setPlayingVideo] = useState<string | null>(null)
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [scrollY, setScrollY] = useState(0);
  const [loading, setLoading] = useState(true);
  const [animationsReady, setAnimationsReady] = useState(false);

  // Función helper para calcular thresholds de animación responsivos
  const getAnimationThreshold = (baseThreshold: number) => {
    if (typeof window === 'undefined') return baseThreshold;
    const isMobile = window.innerWidth < 768;
    const isTablet = window.innerWidth < 1024;
    const isShortScreen = window.innerHeight < 700; // Pantallas cortas como iPhone SE

    // En móviles, reducir los thresholds significativamente para que aparezcan más temprano
    // En pantallas cortas, reducir aún más
    // En tablets, reducir un 25%
    if (isMobile) {
      if (isShortScreen) {
        return baseThreshold * 0.2; // Muy temprano para pantallas pequeñas
      }
      return baseThreshold * 0.3; // Temprano para móviles normales
    } else if (isTablet) {
      return baseThreshold * 0.6;
    }
    return baseThreshold;
  };

  // Función helper para obtener duración de transición responsiva
  const getTransitionDuration = () => {
    if (typeof window === 'undefined') return '0.6s';
    const isMobile = window.innerWidth < 768;
    return isMobile ? '0.4s' : '0.6s'; // Transiciones más rápidas en móviles
  };

  // Función helper para obtener delay de transición responsivo
  const getTransitionDelay = (baseDelay: string) => {
    if (typeof window === 'undefined') return baseDelay;
    const isMobile = window.innerWidth < 768;
    if (isMobile) {
      // Reducir delays en móviles para que las animaciones sean más rápidas
      const delayValue = parseFloat(baseDelay.replace('s', ''));
      return `${delayValue * 0.5}s`;
    }
    return baseDelay;
  };

  const handlePlayVideo = (videoId: string) => {
    setPlayingVideo(videoId)
  }

  const [titles, setTitles] = useState({
    diagram: "Diagrama",
    totalCost: "Costo Total",
    harvest: "Cosecha",
    gantt: "Gantt"
  })
  const [editingTitle, setEditingTitle] = useState<string | null>(null)



  const handleContactClick = () => {
    if (contactRef.current) {
      contactRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }

  const handleaboutClick = () => {
    if (aboutRef.current) {
      aboutRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }

  // Temporalmente comentado
  // const handleHowClick = () => {
  //   if (howtRef.current) {
  //     howtRef.current.scrollIntoView({ behavior: 'smooth' });
  //   }
  // }

  const handleCasesClick = () => {
    if (casesRef.current) {
      casesRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }

  const handleTestimonialsClick = () => {
    if (testimonialsRef.current) {
      testimonialsRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email) {
      setAlertMessage('Por favor, ingresa tu correo electrónico');
      setShowAlert(true);
      setTimeout(() => setShowAlert(false), 3000);
      return;
    }

    try {
      await fetch('https://script.google.com/macros/s/AKfycbyZubcnX9yAltdVrXwN7htNZwC75a4aysJxkVmKxlP0KQoL31Vv-iNGNXcOUJffE6ww/exec', {
        method: 'POST',
        mode: 'no-cors',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      setAlertMessage('¡Gracias por registrarte en MIIDO! Te contactaremos en breve');
      setShowAlert(true);
      setTimeout(() => setShowAlert(false), 3000);
    } catch (error) {
      console.error('Error al guardar el correo:', error);
      setAlertMessage('Error al guardar el correo. Por favor, inténtalo de nuevo.');
      setShowAlert(true);
      setTimeout(() => setShowAlert(false), 3000);
    }

    setEmail('');
  };

  //Q&A:

  const toggleQuestion = (index: number) => {
    setOpenQuestion(openQuestion === index ? null : index)
  }

  const qaPairs = [
    {
      question: language === 'es' ? "¿Cómo funciona el sistema de voz de MIIDO?" : "How does MIIDO's voice system work?",
      answer: language === 'es' ? "MIIDO utiliza tecnología avanzada de reconocimiento de voz para convertir los mensajes de audio de WhatsApp en texto. Luego, nuestro sistema procesa este texto para extraer información relevante y organizarla en tareas, registros y consultas." : "MIIDO uses advanced voice recognition technology to convert WhatsApp audio messages into text. Our system then processes this text to extract relevant information and organize it into tasks, records, and queries."
    },
    {
      question: language === 'es' ? "¿Es segura la información que envío a través de WhatsApp?" : "Is the information I send through WhatsApp secure?",
      answer: language === 'es' ? "Sí, la seguridad es nuestra prioridad. Utilizamos encriptación de extremo a extremo y cumplimos con las normativas de protección de datos más estrictas para garantizar que tu información esté siempre protegida." : "Yes, security is our priority. We use end-to-end encryption and comply with the strictest data protection regulations to ensure your information is always protected."
    },
    {
      question: language === 'es' ? "¿Puedo integrar MIIDO con otros sistemas que ya uso?" : "Can I integrate MIIDO with other systems I already use?",
      answer: language === 'es' ? "Absolutamente. MIIDO está diseñado para ser flexible y se puede integrar con una variedad de sistemas de gestión empresarial, CRMs y otras herramientas de productividad. Contáctanos para discutir tus necesidades específicas de integración." : "Absolutely. MIIDO is designed to be flexible and can integrate with a variety of enterprise management systems, CRMs, and other productivity tools. Contact us to discuss your specific integration needs."
    },
    {
      question: language === 'es' ? "¿Qué tipo de soporte ofrecen?" : "What kind of support do you offer?",
      answer: language === 'es' ? "Ofrecemos soporte completo, incluyendo configuración inicial, capacitación para tu equipo y asistencia técnica continua. Nuestro equipo de soporte está disponible por chat, correo electrónico y llamadas telefónicas para asegurar que obtengas el máximo beneficio de MIIDO." : "We offer complete support, including initial setup, team training, and ongoing technical assistance. Our support team is available via chat, email, and phone calls to ensure you get the maximum benefit from MIIDO."
    },
    {
      question: language === 'es' ? "¿Es MIIDO una empresa verificada por Meta?" : "Is MIIDO a Meta-verified company?",
      answer: language === 'es' ? "Si, MIIDO pasó por todo el proceso de verificación de Meta." : "Yes, MIIDO has completed Meta's entire verification process."
    },
    {
      question: language === 'es' ? "¿En qué industrias puedo usar MIIDO?" : "What industries can I use MIIDO in?",
      answer: language === 'es' ? "Estamos enfocados en la industria Agro, pero nuestra tecnología puede ser usada en otras industrias como Logística, construcción, minería, etc." : "We are focused on the Agriculture industry, but our technology can be used in other industries such as Logistics, construction, mining, etc."
    }
  ]

// Texto principal

  const [typedText, setTypedText] = useState('')
  const fullText = "Empower Your Agriculture with AI Vertical Agents"

  useEffect(() => {
    let index = 0
    const intervalId = setInterval(() => {
      setTypedText(fullText.slice(0, index))
      index++
      if (index > fullText.length) {
        clearInterval(intervalId)
      }
    }, 100) // Ajusta este valor para cambiar la velocidad de escritura

    return () => clearInterval(intervalId)
  }, [])

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen)
  }
  const closeMobileMenu = () => {
    setMobileMenuOpen(false)
  }
  const handleNavClick = (ref: React.RefObject<HTMLElement>) => {
    if (ref.current) {
      ref.current.scrollIntoView({ behavior: 'smooth' });
    }
    closeMobileMenu();
  }





  useEffect(() => {
    const handleScroll = () => {
      if (demoRef.current) {
        const rect = demoRef.current.getBoundingClientRect()
        const sectionHeight = rect.height
        const viewportHeight = window.innerHeight

        // Ajustar el offset de inicio basado en el tamaño de pantalla
        // En móviles usar offsets más pequeños para que las animaciones empiecen antes
        const isMobile = window.innerWidth < 768
        const isTablet = window.innerWidth < 1024
        const isShortScreen = window.innerHeight < 700

        let startOffsetRatio = 0.4; // Default para desktop
        if (isMobile) {
          startOffsetRatio = isShortScreen ? 0.1 : 0.15; // Muy temprano para pantallas pequeñas
        } else if (isTablet) {
          startOffsetRatio = 0.25;
        }

        const startOffset = sectionHeight * startOffsetRatio
        const scrolled = viewportHeight - rect.top - startOffset
        const totalScrollDistance = sectionHeight - startOffset

        const progress = Math.max(0, Math.min(1, scrolled / totalScrollDistance))

        setScrollProgress(progress)
      }

      if (newSectionRef.current) {
        const rect = newSectionRef.current.getBoundingClientRect()
        const sectionHeight = rect.height
        const viewportHeight = window.innerHeight

        // Aplicar el mismo ajuste responsivo para la nueva sección
        const isMobile = window.innerWidth < 768
        const isTablet = window.innerWidth < 1024
        const isShortScreen = window.innerHeight < 700

        let startOffsetRatio = 0.4; // Default para desktop
        if (isMobile) {
          startOffsetRatio = isShortScreen ? 0.1 : 0.15; // Muy temprano para pantallas pequeñas
        } else if (isTablet) {
          startOffsetRatio = 0.25;
        }

        const startOffset = sectionHeight * startOffsetRatio
        const scrolled = viewportHeight - rect.top - startOffset
        const totalScrollDistance = sectionHeight - startOffset

        const progressNewSection = Math.max(0, Math.min(1, scrolled / totalScrollDistance))

        setScrollProgressNewSection(progressNewSection)
      }
    }

    window.addEventListener('scroll', handleScroll)
    handleScroll()

    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const ganttData = [
    { task: language === 'es' ? "Poda" : "Pruning", start: "12 ago.", end: "15 ago." },
    { task: language === 'es' ? "Cosecha" : "Harvest", start: "14 ago.", end: "17 ago." },
    { task: language === 'es' ? "Aplicacion de fertilizante (cop..." : "Fertilizer application (cop...", start: "18 ago.", end: "21 ago." },
    { task: language === 'es' ? "Aplicacion de fertilizante" : "Fertilizer application", start: "22 ago.", end: "28 ago." },
  ]

  const weeks = [
    { name: "W33 12 - 18", start: new Date(2024, 7, 12), end: new Date(2024, 7, 18) },
    { name: "W34 19 - 25", start: new Date(2024, 7, 19), end: new Date(2024, 7, 25) },
    { name: "W35 26 - 1 sep.", start: new Date(2024, 7, 26), end: new Date(2024, 8, 1) },
    { name: "W36 2 - 8", start: new Date(2024, 8, 2), end: new Date(2024, 8, 8) },
    { name: "W37 9 - 15", start: new Date(2024, 8, 9), end: new Date(2024, 8, 15) },
    { name: "W38 16 - 22", start: new Date(2024, 8, 16), end: new Date(2024, 8, 22) },
  ]

  const ganttChartWidth = 800
  const ganttChartHeight = 200
  const taskHeight = 30
  const weekWidth = ganttChartWidth / 6

  const getTaskPosition = (start: string) => {
    const startDate = new Date(2024, 7, parseInt(start.split(' ')[0]))
    const weekIndex = weeks.findIndex(week => startDate >= week.start && startDate <= week.end)
    return weekIndex * weekWidth + (startDate.getDate() - weeks[weekIndex].start.getDate()) * (weekWidth / 7)
  }

  const getTaskWidth = (start: string, end: string) => {
    const startDate = new Date(2024, 7, parseInt(start.split(' ')[0]))
    const endDate = new Date(2024, 7, parseInt(end.split(' ')[0]))
    return (endDate.getTime() - startDate.getTime()) / (24 * 60 * 60 * 1000) * (weekWidth / 7)
  }

  const handleTitleClick = (key: string) => {
    setEditingTitle(key)
  }

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (editingTitle) {
      setTitles(prev => ({ ...prev, [editingTitle]: e.target.value }))
    }
  }

  const handleTitleBlur = () => {
    setEditingTitle(null)
  }

  // Add parallax effect
  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Efecto para controlar el estado de carga
  useEffect(() => {
    // Simular tiempo de carga
    const loadingTimer = setTimeout(() => {
      setLoading(false);

      // Activar las animaciones después de que la pantalla de carga desaparezca
      const animationsTimer = setTimeout(() => {
        setAnimationsReady(true);
      }, 100); // Pequeño retraso para asegurar una transición suave

      return () => clearTimeout(animationsTimer);
    }, 2500); // 2.5 segundos de carga

    return () => clearTimeout(loadingTimer);
  }, []);

  // Estilos globales para animaciones
  useEffect(() => {
    const globalStyles = `
      @keyframes fadeInUp {
        from {
          opacity: 0;
          transform: translateY(20px);
        }
        to {
          opacity: 1;
          transform: translateY(0);
        }
      }

      @keyframes fadeInDown {
        from {
          opacity: 0;
          transform: translateY(-20px);
        }
        to {
          opacity: 1;
          transform: translateY(0);
        }
      }

      @keyframes pulse {
        0%, 100% {
          transform: scale(1);
        }
        50% {
          transform: scale(1.05);
        }
      }

      @keyframes float {
        0%, 100% {
          transform: translateY(0);
        }
        50% {
          transform: translateY(-10px);
        }
      }

      @keyframes rotate {
        from {
          transform: rotate(0deg);
        }
        to {
          transform: rotate(360deg);
        }
      }

      @keyframes dash {
        0% {
          stroke-dasharray: 1, 150;
          stroke-dashoffset: 0;
        }
        50% {
          stroke-dasharray: 90, 150;
          stroke-dashoffset: -35;
        }
        100% {
          stroke-dasharray: 90, 150;
          stroke-dashoffset: -124;
        }
      }

      @keyframes fadeOut {
        from {
          opacity: 1;
        }
        to {
          opacity: 0;
          visibility: hidden;
        }
      }

      @keyframes borderPulse {
        0% {
          border-color: #38507E;
        }
        50% {
          border-color: #C2DB64;
        }
        100% {
          border-color: #38507E;
        }
      }
    `;

    // Crear elemento de estilo
    const styleElement = document.createElement('style');
    styleElement.innerHTML = globalStyles;
    document.head.appendChild(styleElement);

    // Limpiar al desmontar
    return () => {
      if (styleElement && document.head.contains(styleElement)) {
        document.head.removeChild(styleElement);
      }
    };
  }, []);

  // No necesitamos la función createWavePath para el cargador de barras

  // Si está cargando, solo mostrar la pantalla de carga
  if (loading) {
    return (
      <div
        className="fixed inset-0 flex items-center justify-center bg-white dark:bg-gray-900 z-[9999]"
      >
        <div className="absolute inset-0 backdrop-blur-[2px]">
          {/* Grid Overlay para modo claro */}
          <div
            className="absolute inset-0 pointer-events-none dark:hidden"
            style={{
              backgroundImage: `
                linear-gradient(to bottom, rgba(0, 0, 0, 0.1) 1px, transparent 1px),
                linear-gradient(to right, rgba(0, 0, 0, 0.1) 1px, transparent 1px)
              `,
              backgroundSize: '40px 40px',
              maskImage: 'linear-gradient(to bottom, black 60%, transparent 100%)',
              WebkitMaskImage: 'linear-gradient(to bottom, black 60%, transparent 100%)',
              opacity: 0.3
            }}
          />

          {/* Grid Overlay para modo oscuro */}
          <div
            className="absolute inset-0 pointer-events-none hidden dark:block"
            style={{
              backgroundImage: `
                linear-gradient(to bottom, rgba(255, 255, 255, 0.04) 1px, transparent 1px),
                linear-gradient(to right, rgba(255, 255, 255, 0.04) 1px, transparent 1px)
              `,
              backgroundSize: '40px 40px',
              maskImage: 'linear-gradient(to bottom, black 60%, transparent 100%)',
              WebkitMaskImage: 'linear-gradient(to bottom, black 60%, transparent 100%)',
              opacity: 0.3
            }}
          />
        </div>

        <div
          className="w-full h-24 relative z-10 flex items-center justify-center"
        >
          <div className="flex items-end h-12 space-x-2">
            {[0, 1, 2, 3, 4].map((index) => (
              <div
                key={index}
                className={`bar-${index} w-3 bg-white dark:bg-[#111827] border border-[#38507E] dark:border-white rounded-t-md`}
                style={{ height: '20%' }}
              ></div>
            ))}
          </div>
        </div>

        <style jsx>{`
          .bar-0 {
            animation: barAnim 1.2s ease-in-out infinite;
          }

          .bar-1 {
            animation: barAnim 1.2s ease-in-out 0.2s infinite;
          }

          .bar-2 {
            animation: barAnim 1.2s ease-in-out 0.4s infinite;
          }

          .bar-3 {
            animation: barAnim 1.2s ease-in-out 0.6s infinite;
          }

          .bar-4 {
            animation: barAnim 1.2s ease-in-out 0.8s infinite;
          }

          @keyframes barAnim {
            0%, 100% {
              height: 20%;
              opacity: 0.9;
              border-color: #38507E;
            }
            50% {
              height: 80%;
              opacity: 1;
              border-color: #C2DB64;
            }
          }
        `}</style>
      </div>
    );
  }

  // Si no está cargando, mostrar el contenido principal
  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground overflow-x-hidden dark:bg-gray-900">
      {/* Estilos CSS para el scrollbar personalizado de WhatsApp */}
      <style dangerouslySetInnerHTML={{
        __html: `
          .whatsapp-scroll::-webkit-scrollbar {
            width: 4px;
          }
          .whatsapp-scroll::-webkit-scrollbar-track {
            background: transparent;
          }
          .whatsapp-scroll::-webkit-scrollbar-thumb {
            background: rgba(255, 255, 255, 0.2);
            border-radius: 2px;
          }
          .whatsapp-scroll::-webkit-scrollbar-thumb:hover {
            background: rgba(255, 255, 255, 0.3);
          }
          .whatsapp-scroll {
            scrollbar-width: thin;
            scrollbar-color: rgba(255, 255, 255, 0.2) transparent;
          }
        `
      }} />

      {showAlert && (
        <div className="fixed top-0 left-0 right-0 z-[9999] p-4 bg-green-500 dark:bg-green-600 text-white text-center transition-all duration-300 ease-in-out transform translate-y-0">
          <p>{alertMessage}</p>
        </div>
      )}
      <header className="fixed top-0 left-0 right-0 z-50 px-4 lg:px-6 h-14 flex items-center justify-between border-b bg-white dark:bg-gray-800 dark:border-gray-700">
        <div className="flex items-center justify-between w-full">
          <Link className="flex items-center justify-center" href="#">
            <div className="dark:hidden">
              <Image
                src="./miido-logo.png"
                alt="Company Logo"
                width={150}
                height={150}
              />
            </div>
            <div className="hidden dark:block">
              <Image
                src="./logo_blanco.png"
                alt="Company Logo"
                width={150}
                height={150}
              />
            </div>
            <span className="sr-only">MIIDO</span>
          </Link>
          <nav className="hidden md:flex gap-4 sm:gap-6">
            <button className="text-sm text-regular hover:underline underline-offset-4 text-black dark:text-white" onClick={() => handleNavClick(demoRef)}>
              {language === 'es' ? '¿Cómo funciona?' : 'How it works?'}
            </button>
            {/* Temporalmente oculto hasta tener todos los videos */}
            {/* <button className="text-sm text-regular hover:underline underline-offset-4 text-black dark:text-white" onClick={() => handleNavClick(casesRef)}>
              {language === 'es' ? 'Casos de uso' : 'Use Cases'}
            </button> */}
            <button className="text-sm text-regular hover:underline underline-offset-4 text-black dark:text-white" onClick={() => handleNavClick(testimonialsRef)}>
              {language === 'es' ? 'Testimonios' : 'Testimonials'}
            </button>
            <button className="text-sm text-regular hover:underline underline-offset-4 text-black dark:text-white" onClick={() => handleNavClick(aboutRef)}>
              {language === 'es' ? 'Últimas publicaciones' : 'Latest publications'}
            </button>
            <button className="text-sm text-regular hover:underline underline-offset-4 text-black dark:text-white" onClick={() => handleNavClick(contactRef)}>
              {language === 'es' ? 'Contáctanos' : 'Contact us'}
            </button>
          </nav>
          <div className="flex items-center gap-4">
            {/* Selector de idioma */}
            {isClient && <LanguageSwitcher />}

            {/* Botón Ingresar */}
            <a
              href="https://dashboard.miido.cl/login"
              target="_blank"
              rel="noopener noreferrer"
              className="relative group hidden md:block"
            >
              <Button
                className="bg-white hover:bg-white dark:bg-[#111827] dark:hover:bg-[#111827] border border-[#38507E] hover:border-[#C2DB64] text-gray-800 dark:text-white rounded-full shadow-md hover:shadow-lg px-6 py-2 text-sm transition-all duration-300"
              >
                {language === 'es' ? 'Ingresar' : 'Login'}
              </Button>
            </a>

            {/* Botón de menú móvil */}
            <button
              className="md:hidden"
              onClick={toggleMobileMenu}
              aria-label={mobileMenuOpen ? "Cerrar menú" : "Abrir menú"}
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </header>
      <div className={`fixed inset-0 z-40 transform ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'} transition-transform duration-300 ease-in-out md:hidden`}>
        <div className="bg-white h-full w-64 shadow-lg pt-20 px-4">
          <nav className="flex flex-col gap-4">
            <button className="text-sm text-regular hover:underline underline-offset-4 text-black dark:text-white" onClick={() => { handleNavClick(demoRef); closeMobileMenu(); }}>
              {language === 'es' ? '¿Cómo funciona?' : 'How it works?'}
            </button>
            {/* Temporalmente oculto hasta tener todos los videos */}
            {/* <button className="text-sm text-regular hover:underline underline-offset-4 text-black dark:text-white" onClick={() => { handleCasesClick(); closeMobileMenu(); }}>
              Casos de uso
            </button> */}
            <button className="text-sm text-regular hover:underline underline-offset-4 text-black dark:text-white" onClick={() => { handleTestimonialsClick(); closeMobileMenu(); }}>
              {language === 'es' ? 'Testimonios' : 'Testimonials'}
            </button>
            <button className="text-sm text-regular hover:underline underline-offset-4 text-black dark:text-white" onClick={() => { handleaboutClick(); closeMobileMenu(); }}>
              {language === 'es' ? 'Últimas publicaciones' : 'Latest publications'}
            </button>
            <button className="text-sm text-regular hover:underline underline-offset-4 text-black dark:text-white" onClick={() => { handleContactClick(); closeMobileMenu(); }}>
              {language === 'es' ? 'Contáctanos' : 'Contact us'}
            </button>

            {/* Botón Ingresar para móvil */}
            <a
              href="https://www.dashboard.miido.cl"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4"
            >
              <Button
                className="w-full bg-white hover:bg-white dark:bg-[#111827] dark:hover:bg-[#111827] border border-[#38507E] hover:border-[#C2DB64] text-gray-800 dark:text-white rounded-full shadow-md hover:shadow-lg px-6 py-2 text-sm transition-all duration-300"
              >
                {language === 'es' ? 'Ingresar' : 'Login'}
              </Button>
            </a>
          </nav>
        </div>
        <div className="bg-black bg-opacity-50 h-full w-full" onClick={closeMobileMenu}></div>
      </div>

      <main className="flex-1 pt-14">


        {/* Main section */}
        <section className="w-full py-8 md:py-10 lg:py-12 xl:py-16 relative overflow-hidden">
          {/* Enhanced Parallax background image */}
          {/* Grid Overlay para modo claro */}
          <div className="absolute inset-0 -z-1 pointer-events-none dark:hidden">
            <div
              className="w-full h-full"
              style={{
                position: 'absolute',
                inset: 0,
                backgroundImage: `
                  linear-gradient(to bottom, rgba(0, 0, 0, 0.1) 1px, transparent 1px),
                  linear-gradient(to right, rgba(0, 0, 0, 0.1) 1px, transparent 1px)
                `,
                backgroundSize: '40px 40px',
                maskImage: 'linear-gradient(to bottom, black 60%, transparent 100%)',
                WebkitMaskImage: 'linear-gradient(to bottom, black 60%, transparent 100%)',
                opacity: 0.3,
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
          <div
            className="absolute inset-0 -z-10"
            style={{
              transform: `translateY(${scrollY * 0.3}px)`,
              transition: 'transform 0.3s ease-out'
            }}
          >
            <Image
              src="/trees-aerial.png"
              alt="Trees"
              fill
              className="object-cover opacity-10"
            />
          </div>

          <div className="container px-4 md:px-6">
            {/* Backed by badge - centrado arriba */}
            <div className="flex justify-center mb-8">
              <div
                className="flex items-center gap-4 bg-white dark:bg-[#111827] border border-[#38507E] dark:border-[#1e293b] rounded-full px-4 py-1.5 shadow-md dark:shadow-[0_0_15px_rgba(0,0,0,0.3)] hover:border-[#C2DB64] transition-all duration-300"
                style={{
                  animation: animationsReady ? 'fadeInDown 0.8s ease-out forwards' : 'none',
                  opacity: animationsReady ? 0 : 1,
                  transform: animationsReady ? 'translateY(-20px)' : 'none'
                }}
              >
                <span className="text-xs text-ultra-light text-gray-800 dark:text-gray-300">{language === 'es' ? 'Apoyados por' : 'Backed by'}</span>
                <Image
                  src={isDark ? "./skydeck2.png" : "./skydeck.png"}
                  alt="Skydeck Logo"
                  width={100}
                  height={100}
                  className="w-16 sm:w-20 h-auto object-contain opacity-90 hover:opacity-100 transition-opacity"
                />
              </div>
            </div>

            {/* Layout de dos columnas estilo Notion */}
            <div className="flex flex-col lg:flex-row items-start gap-8 lg:gap-4">

              {/* Columna izquierda - Texto */}
              <div className="flex-1 flex flex-col items-center lg:items-start space-y-5 text-center lg:text-left max-w-xl">

                {/* Title Section */}
                <div className="space-y-6">
                  <h1
                    className="text-4xl sm:text-5xl md:text-6xl lg:text-5xl xl:text-6xl text-semibold tracking-tight bg-gradient-to-r from-[#38507E] via-[#51A09A] to-[#C2DB64] bg-clip-text text-transparent pb-1"
                    style={{
                      animation: animationsReady ? 'fadeInUp 0.8s ease-out forwards' : 'none',
                      opacity: animationsReady ? 0 : 1,
                      transform: animationsReady ? 'translateY(20px)' : 'none',
                      fontWeight: 600,
                      lineHeight: 1.2
                    }}
                  >
                    {language === 'es' ? 'AI agents en agricultura' : 'AI agents in agriculture'}
                  </h1>
                  <p
                    className="text-gray-500 text-lg md:text-xl dark:text-gray-400 text-light"
                    style={{
                      animation: animationsReady ? 'fadeInUp 0.8s ease-out 0.2s forwards' : 'none',
                      opacity: animationsReady ? 0 : 1,
                      transform: animationsReady ? 'translateY(20px)' : 'none',
                      fontWeight: 300
                    }}
                  >
                    {language === 'es'
                      ? 'Tu copiloto de IA en el campo: automatiza, predice y toma mejores decisiones agrícolas, '
                      : 'Your AI copilot in the field: automate, predict and make better agricultural decisions, '
                    }
                    <strong style={{ fontWeight: 400 }}>{language === 'es' ? 'sin complicaciones y desde WhatsApp' : 'without complications and from WhatsApp'}</strong>.
                  </p>
                </div>

                {/* CTA Buttons - Estilo Notion */}
                <div
                  className="flex flex-col sm:flex-row gap-3"
                  style={{
                    animation: animationsReady ? 'fadeInUp 0.8s ease-out 0.4s forwards' : 'none',
                    opacity: animationsReady ? 0 : 1,
                    transform: animationsReady ? 'translateY(20px)' : 'none'
                  }}
                >
                  <a
                    href="https://www.notion.so/miidocl/151f91071a0f80c19460e4c799042667?pvs=106"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center px-6 py-3 text-white bg-[#38507E] rounded-lg hover:bg-[#2d4066] focus:outline-none transform transition-all duration-300 hover:scale-105 hover:shadow-lg text-sm font-medium"
                  >
                    {language === 'es' ? 'Empieza gratis' : 'Start free'}
                  </a>
                  <button
                    onClick={() => handleNavClick(contactRef)}
                    className="inline-flex items-center justify-center px-6 py-3 text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none transform transition-all duration-300 hover:scale-105 text-sm font-medium"
                  >
                    {language === 'es' ? 'Solicitar demo' : 'Request a demo'}
                  </button>
                </div>

                <p
                  className="text-xs text-gray-500 dark:text-gray-400"
                  style={{
                    animation: animationsReady ? 'fadeInUp 0.8s ease-out 0.5s forwards' : 'none',
                    opacity: animationsReady ? 0 : 1,
                    transform: animationsReady ? 'translateY(20px)' : 'none'
                  }}
                >
                  {language === 'es' ? 'No se necesita tarjeta de crédito.' : 'No credit card required.'}
                </p>
              </div>

              {/* Columna derecha - Animación WorkflowBuilder (simpleMode) */}
              <div
                className="flex-1 w-full lg:max-w-2xl"
                style={{
                  animation: animationsReady ? 'fadeInUp 0.8s ease-out 0.3s forwards' : 'none',
                  opacity: animationsReady ? 0 : 1,
                  transform: animationsReady ? 'translateY(20px)' : 'none'
                }}
              >
                <WorkflowBuilder simpleMode={true} />
              </div>
            </div>
          </div>
          <div className="mt-16">
            <MultiWaveAudio />
          </div>
        </section>



        <section className="w-full py-4 bg-gray-1 md:-mt-16 sm:-mt-20 overflow-x-auto">
          <div className="container px-4 md:px-6">
            <div className="flex flex-nowrap md:justify-center sm:justify-center items-center gap-4 sm:gap-8 md:gap-12 lg:gap-20 pb-2">
              {/* Viña Errazuriz */}
      <div className="flex-shrink-0">
        <div
          className="dark:hidden transform transition-transform duration-300 hover:scale-110"
          style={{ animation: 'fadeInUp 0.8s ease-out 0.1s forwards', opacity: 0 }}
        >
          <Image
            src="./errazuriz-logo.png"
            alt="Viña Errazuriz"
            width={80}
            height={30}
            className="w-16 sm:w-20 md:w-24 lg:w-28 h-auto object-contain"
          />
        </div>
        <div
          className="hidden dark:block transform transition-transform duration-300 hover:scale-110"
          style={{ animation: 'fadeInUp 0.8s ease-out 0.1s forwards', opacity: 0 }}
        >
          <Image
            src="./errazuriz-logo-white.png"
            alt="Viña Errazuriz white"
            width={80}
            height={30}
            className="w-16 sm:w-20 md:w-24 lg:w-28 h-auto object-contain"
          />
        </div>
      </div>

      {/* La Ciudad Posible */}
      <div className="flex-shrink-0">
        <div
          className="dark:hidden transform transition-transform duration-300 hover:scale-110"
          style={{ animation: 'fadeInUp 0.8s ease-out 0.2s forwards', opacity: 0 }}
        >
          <Image
            src="./LCP.png"
            alt="La ciudad posible"
            width={90}
            height={30}
            className="w-18 sm:w-22 md:w-26 lg:w-32 h-auto object-contain"
          />
        </div>
        <div
          className="hidden dark:block transform transition-transform duration-300 hover:scale-110"
          style={{ animation: 'fadeInUp 0.8s ease-out 0.2s forwards', opacity: 0 }}
        >
          <Image
            src="./LCP-white.png"
            alt="La ciudad posible white"
            width={90}
            height={30}
            className="w-18 sm:w-22 md:w-26 lg:w-32 h-auto object-contain"
          />
        </div>
      </div>

      {/* Concha y Toro */}
      <div className="flex-shrink-0">
        <div className="dark:hidden transform transition-transform duration-300 hover:scale-110">
          <Image
            src="./cyt.png"
            alt="Concha y Toro"
            width={90}
            height={30}
            className="w-18 sm:w-22 md:w-26 lg:w-32 h-auto object-contain"
          />
        </div>
        <div className="hidden dark:block transform transition-transform duration-300 hover:scale-110">
          <Image
            src="./cyt-white.png"
            alt="Concha y Toro white"
            width={90}
            height={30}
            className="w-18 sm:w-22 md:w-26 lg:w-32 h-auto object-contain"
          />
        </div>
      </div>

      {/* Fundo Santa Eugenia */}
      <div className="flex-shrink-0">
        <div className="dark:hidden transform transition-transform duration-300 hover:scale-110">
          <Image
            src="./driscolls.png"
            alt="Fundo Santa Eugenia"
            width={80}
            height={30}
            className="w-16 sm:w-20 md:w-24 lg:w-28 h-auto object-contain"
          />
        </div>
        <div className="hidden dark:block transform transition-transform duration-300 hover:scale-110">
          <Image
            src="./driscolls-white.png"
            alt="Fundo Santa Eugenia white"
            width={80}
            height={30}
            className="w-16 sm:w-20 md:w-24 lg:w-28 h-auto object-contain"
          />
        </div>
      </div>

      {/* TMV Agroexportación */}
      <div className="flex-shrink-0">
        <div className="dark:hidden transform transition-transform duration-300 hover:scale-110">
          <Image
            src="./westfalia.png"
            alt="TMV Agroexportació"
            width={75}
            height={30}
            className="w-14 sm:w-18 md:w-22 lg:w-26 h-auto object-contain"
          />
        </div>
        <div className="hidden dark:block transform transition-transform duration-300 hover:scale-110">
          <Image
            src="./westfalia-white.png"
            alt="TMV Agroexportació white"
            width={75}
            height={30}
            className="w-14 sm:w-18 md:w-22 lg:w-26 h-auto object-contain"
          />
        </div>
      </div>

      {/* Startup Chile */}
      <div className="flex-shrink-0">
        <div className="dark:hidden transform transition-transform duration-300 hover:scale-110">
          <Image
            src="./TMV.png"
            alt="Startup Chile"
            width={90}
            height={30}
            className="w-18 sm:w-22 md:w-26 lg:w-32 h-auto object-contain"
          />
        </div>
        <div className="hidden dark:block transform transition-transform duration-300 hover:scale-110">
          <Image
            src="./TMV-white.png"
            alt="Startup Chile white"
            width={90}
            height={30}
            className="w-18 sm:w-22 md:w-26 lg:w-32 h-auto object-contain"
          />
        </div>
      </div>

      {/* Start Fellowship */}
      <div className="flex-shrink-0">
        <div className="dark:hidden transform transition-transform duration-300 hover:scale-110">
          <Image
            src="./start-fellowship.png"
            alt="Start Fellowship"
            width={80}
            height={30}
            className="w-16 sm:w-20 md:w-24 lg:w-28 h-auto object-contain"
          />
        </div>
        <div className="hidden dark:block transform transition-transform duration-300 hover:scale-110">
          <Image
            src="./start-fellowship-white.png"
            alt="Start Fellowship white"
            width={80}
            height={30}
            className="w-16 sm:w-20 md:w-24 lg:w-28 h-auto object-contain"
          />
        </div>
      </div>
            </div>
          </div>
        </section>
        {/* SECCIÓN "CÓMO FUNCIONA" COMENTADA TEMPORALMENTE */}
        {/* <section ref={howtRef} className="w-full py-12 md:py-24 lg:py-32 bg-gray-100 dark:bg-gray-800">
          <div className="container px-4 md:px-6">
            <h2
              className="text-3xl font-bold tracking-tighter sm:text-5xl text-center mb-12 text-gray-900 dark:text-white"
              style={{
                animation: 'fadeInUp 0.8s ease-out forwards',
                opacity: 0,
                transform: 'translateY(20px)'
              }}
            >¿Cómo funciona?</h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              {[1, 2, 3, 4].map((step) => (
                <div
                  key={step}
                  className="flex flex-col items-center text-center bg-white dark:bg-gray-800 rounded-2xl p-4 relative min-h-[320px] w-[240px] mx-auto dark:border-gray-700 hover:transform hover:scale-105 transition-all duration-300"
                  style={{
                    boxShadow: '-8px 8px 0px 0px #76a586',
                    border: '1px solid #e5e7eb',
                    animation: `fadeInUp 0.8s ease-out ${0.2 + step * 0.1}s forwards`,
                    opacity: 0,
                    transform: 'translateY(20px)'
                  }}
                >
                  <div
                    className="bg-[#c2db64] rounded-full w-10 h-10 flex items-center justify-center mb-4 absolute -top-5"
                    style={{
                      animation: `pulse 2s infinite ${step * 0.5}s`
                    }}
                  >
                    <span className="text-lg font-bold text-white">{step}</span>
                  </div>
                  <h3 className="text-lg font-semibold mb-3 mt-4 text-gray-800 dark:text-white dark:drop-shadow-sm">Paso {step}</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
                    {step === 1 && 'Subir la planificación del campo o nos conectampos a tu ERP.'}
                    {step === 2 && 'Recoger datos de los trabajadores vía WhatsApp.'}
                    {step === 3 && 'Correlacionar con el clima, inventario, planificación en el ERP.'}
                    {step === 4 && 'Recibir información procesable.'}
                  </p>
                  <div
                    className="my-4"
                    style={{
                      animation: `float 3s ease-in-out infinite ${step * 0.3}s`
                    }}
                  >
                    <Image
                      src={`/how_works/step${step}.png`}
                      alt={`Step ${step}`}
                      width={step === 1 ? 170 : step === 2 ? 150 : step === 3 ? 110 : 80}
                      height={step === 1 ? 80 : step === 2 ? 100 : step === 3 ? 90 : 140}
                      className="mx-auto object-contain"
                    />
                  </div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {step === 1 && 'Software totalmente personalizado.'}
                    {step === 2 && "Ej: 'Apliqué 20 kg de nitrógeno en el trimestre 3'."}
                    {step === 3 && 'Integración con diferentes fuentes de información.'}
                    {step === 4 && 'Todo directamente en una herramienta familiar.'}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section> */}
        <section className="w-full py-12 md:py-24 lg:py-32 overflow-hidden" ref={demoRef}>
  <div className="container px-4 md:px-6">
    {/* Paso 1 Badge */}
    <div className="flex justify-center mb-4">
      <span className="inline-flex items-center gap-2 px-4 py-1.5 bg-[#38507E]/10 dark:bg-[#38507E]/20 text-[#38507E] dark:text-[#7B9ED9] rounded-full text-sm font-medium">
        <span className="w-6 h-6 bg-[#38507E] text-white rounded-full flex items-center justify-center text-xs font-bold">1</span>
        {language === 'es' ? 'Paso 1' : 'Step 1'}
      </span>
    </div>
    <h2 className="text-3xl text-semibold tracking-tighter sm:text-5xl text-center mb-4 text-gray-900 dark:text-white">
      {language === 'es' ? 'Digitaliza tu campo a través de WhatsApp' : 'Digitize your field through WhatsApp'}
    </h2>
    <p className="mb-6 text-gray-600 dark:text-gray-400 text-center text-light max-w-2xl mx-auto">
      {language === 'es'
        ? 'Tus trabajadores envían audios con información del campo. Nosotros lo ordenamos y mostramos automáticamente en el Dashboard.'
        : 'Your workers send audios with field information. We organize it and display it automatically in the Dashboard.'
      }
    </p>
    <div className="flex flex-col lg:flex-row items-start justify-center gap-8">
      {/* iPhone Real Auténtico - RESPONSIVO */}
      <div className="w-full max-w-[280px] sm:max-w-[300px] mx-auto lg:sticky lg:top-4 lg:self-start">
        {/* Marco del iPhone - Negro mate como iPhone Pro */}
        <div className="relative bg-black rounded-[2.5rem] sm:rounded-[3rem] p-1.5 sm:p-2 shadow-2xl" style={{
          background: 'linear-gradient(145deg, #1a1a1a 0%, #000000 50%, #1a1a1a 100%)',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.8), inset 0 1px 0 rgba(255, 255, 255, 0.1)',
          width: '100%',
          maxWidth: '300px',
          height: 'auto',
          aspectRatio: '71.5/146.7' // Proporción exacta del iPhone real
        }}>

          {/* Pantalla del iPhone - Proporciones reales */}
          <div className="relative bg-[#0b141a] rounded-[2rem] sm:rounded-[2.5rem] overflow-hidden w-full" style={{ height: '580px' }}>

            {/* Barra de estado del iPhone - Proporcional */}
            <div className="absolute top-0 left-0 right-0 h-8 sm:h-10 flex justify-between items-center px-3 sm:px-5 pt-1 sm:pt-1.5 z-30">
              <div className="flex items-center gap-1">
                <span className="text-white text-xs sm:text-sm font-semibold">17:52</span>
              </div>
              <div className="flex items-center gap-1">
                {/* Señal celular */}
                <div className="flex gap-0.5">
                  <div className="w-1 h-2 bg-white rounded-full"></div>
                  <div className="w-1 h-2.5 bg-white rounded-full"></div>
                  <div className="w-1 h-3 bg-white rounded-full"></div>
                  <div className="w-1 h-3.5 bg-white rounded-full"></div>
                </div>
                {/* WiFi */}
                <svg className="w-4 h-4 text-white ml-1" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M1 9l2 2c4.97-4.97 13.03-4.97 18 0l2-2C16.93 2.93 7.07 2.93 1 9zm8 8l3 3 3-3c-1.65-1.66-4.34-1.66-6 0zm-4-4l2 2c2.76-2.76 7.24-2.76 10 0l2-2C15.14 9.14 8.87 9.14 5 13z"/>
                </svg>
                {/* Batería */}
                <div className="flex items-center ml-1">
                  <div className="w-6 h-3 border border-white rounded-sm relative">
                    <div className="w-4 h-1.5 bg-green-400 rounded-sm absolute top-0.5 left-0.5"></div>
                  </div>
                  <div className="w-0.5 h-1.5 bg-white rounded-r ml-0.5"></div>
                </div>
              </div>
            </div>

            {/* Isla dinámica - Proporcional */}
            <div className="absolute top-1 sm:top-1.5 left-1/2 transform -translate-x-1/2 w-20 sm:w-24 h-5 sm:h-6 bg-black rounded-full z-20 border border-gray-800"></div>

            {/* Contenido de WhatsApp con fondo oscuro - ESTRUCTURA FIJA PARA BARRA SIEMPRE VISIBLE */}
            <div className="bg-[#0b141a] flex-1 flex flex-col relative pt-8 sm:pt-10 h-full">
              {/* WhatsApp Header - Exacto como la imagen */}
             <div className="bg-[#202c33] px-2 sm:px-3 py-2 sm:py-2.5 flex items-center gap-2 sm:gap-3 h-12 sm:h-14 z-20">
                {/* Flecha de regreso */}
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>

              

                {/* Avatar con logo MIIDO más pequeño */}
                <div className="w-7 h-7 rounded-full bg-white flex items-center justify-center">
                  <svg className="w-4 h-4 text-black" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                  </svg>
                </div>

                {/* Info del contacto - TODO EN UNA LÍNEA */}
                <div className="flex-1 flex items-center gap-2 flex-nowrap whitespace-nowrap overflow-hidden">
                  <span className="text-white text-base font-medium truncate">Bot MIIDO</span>
                
                </div>
              </div>
              {/* Mensajes con fondo oscuro de WhatsApp - ALTURA FIJA PARA QUE LA BARRA SIEMPRE SE VEA */}
              <div
                className="flex-1 p-2.5 space-y-2.5 relative overflow-y-auto whatsapp-scroll"
                style={{
                  backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.03'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
                  backgroundColor: '#0b141a',
                  height: 'calc(100% - 60px)' // Altura fija menos el espacio para la barra de escribir
                }}
              >
                {/* Mensaje de texto del bot - Proporcional */}
                <div className="flex justify-start mb-2.5">
                  <div className="bg-[#202c33] rounded-lg p-2.5 max-w-[85%] relative">
                    <div className="absolute left-[-6px] top-2.5 w-0 h-0 border-t-[6px] border-t-transparent border-r-[6px] border-r-[#202c33] border-b-[6px] border-b-transparent"></div>
                    <div className="text-xs text-gray-300 mb-1">
                      {language === 'es'
                        ? 'Puedes hacer preguntas sobre toda la data de tu empresa o registrar información de lo que necesites!'
                        : 'You can ask questions about all your company data or register information about what you need!'
                      }
                    </div>
                    <div className="text-xs text-gray-300 mb-1.5">
                      {language === 'es' ? '¡Gracias por colaborar 🚜!' : 'Thank you for collaborating 🚜!'}
                    </div>
                    <div className="text-[10px] text-gray-500 mb-1.5">Powered by Miido</div>
                    <div className="flex justify-end">
                      <span className="text-[10px] text-gray-500">15:30</span>
                    </div>
                  </div>
                </div>

                {/* Mensajes de audio verdes */}
                {[
                  { duration: "0:11", time: "15:31" },
                  { duration: "0:15", time: "15:32" }
                ].map((audio, index) => {
                  const threshold = getAnimationThreshold(0.05 + (index * 0.05));
                  return (
                  <div
                    key={index}
                    className="flex justify-start mb-2.5"
                    style={{
                      opacity: scrollProgress > threshold ? 1 : 0,
                      transform: `translateY(${scrollProgress > threshold ? 0 : 30}px)`,
                      transition: `opacity ${getTransitionDuration()} ease-out, transform ${getTransitionDuration()} ease-out`,
                      transitionDelay: getTransitionDelay(`${index * 0.15}s`)
                    }}
                  >
                    <div className="bg-[#005c4b] rounded-lg p-2.5 max-w-[85%] relative">
                      <div className="absolute left-[-6px] top-2.5 w-0 h-0 border-t-[6px] border-t-transparent border-r-[6px] border-r-[#005c4b] border-b-[6px] border-b-transparent"></div>

                      <div className="flex items-center gap-2.5">
                        {/* Avatar del usuario - Proporcional */}
                        <div className="w-6 h-6 bg-gray-600 rounded-full flex items-center justify-center flex-shrink-0">
                          <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
                          </svg>
                        </div>

                        {/* Botón de play - Proporcional */}
                        <div className="w-6 h-6 bg-white rounded-full flex items-center justify-center flex-shrink-0">
                          <svg className="w-3 h-3 text-[#005c4b] ml-0.5" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M8 5v14l11-7z"/>
                          </svg>
                        </div>

                        {/* Barra de audio - Proporcional */}
                        <div className="flex-1 flex items-center gap-1.5">
                          <div className="flex items-center gap-0.5 flex-1">
                            {[...Array(15)].map((_, i) => {
                              const heights = [4, 8, 6, 10, 5, 12, 7, 9, 4, 11, 6, 8, 5, 9, 7]; // Alturas fijas para consistencia
                              const isActive = i < (scrollProgress * 15);
                              return (
                                <div
                                  key={i}
                                  className="w-1 rounded-full transition-all duration-300 ease-out"
                                  style={{
                                    height: `${heights[i]}px`,
                                    backgroundColor: isActive ? '#ffffff' : 'rgba(255,255,255,0.3)',
                                    transform: isActive ? 'scaleY(1.2)' : 'scaleY(1)',
                                    transitionDelay: `${i * 50}ms`
                                  }}
                                />
                              );
                            })}
                          </div>
                        </div>
                      </div>

                      <div className="flex justify-between items-center mt-1.5">
                        <span className="text-[10px] text-white/70 font-mono">{audio.duration}</span>
                        <div className="flex items-center gap-0.5">
                          <span className="text-[10px] text-white/70">{audio.time}</span>
                          <svg className="w-2.5 h-2.5 text-blue-400" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M9 16.2L4.8 12l-1.4 1.4L9 19 21 7l-1.4-1.4L9 16.2z"/>
                          </svg>
                          <svg className="w-2.5 h-2.5 text-blue-400" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M9 16.2L4.8 12l-1.4 1.4L9 19 21 7l-1.4-1.4L9 16.2z"/>
                          </svg>
                        </div>
                      </div>
                    </div>
                  </div>
                  );
                })}

                {/* Mensaje de texto largo - Proporcional */}
                <div
                  className="flex justify-start mb-2.5"
                  style={{
                    opacity: scrollProgress > getAnimationThreshold(0.15) ? 1 : 0,
                    transform: `translateY(${scrollProgress > getAnimationThreshold(0.15) ? 0 : 30}px)`,
                    transition: `opacity ${getTransitionDuration()} ease-out, transform ${getTransitionDuration()} ease-out`,
                    transitionDelay: getTransitionDelay('0.2s')
                  }}
                >
                  <div className="bg-[#202c33] rounded-lg p-2.5 max-w-[85%] relative">
                    <div className="absolute left-[-6px] top-2.5 w-0 h-0 border-t-[6px] border-t-transparent border-r-[6px] border-r-[#202c33] border-b-[6px] border-b-transparent"></div>
                    <div className="text-xs text-gray-300 mb-1.5">
                      {language === 'es'
                        ? 'En 2023 cosechaste 12,450 kilos de cerezas y en 2024 has cosechado 15,280 kilos hasta ahora. ¡Un aumento del 23%! La temporada alta fue en diciembre con 3,200 kilos. ¿Quieres ver más detalles?'
                        : 'In 2023 you harvested 12,450 kilos of cherries and in 2024 you have harvested 15,280 kilos so far. A 23% increase! Peak season was in December with 3,200 kilos. Would you like to see more details?'
                      }
                    </div>
                    <div className="flex justify-end">
                      <span className="text-[10px] text-gray-500">15:32</span>
                    </div>
                  </div>
                </div>

                {/* Audio del usuario sobre poda */}
                <div
                  className="flex justify-start mb-2.5"
                  style={{
                    opacity: scrollProgress > getAnimationThreshold(0.2) ? 1 : 0,
                    transform: `translateY(${scrollProgress > getAnimationThreshold(0.2) ? 0 : 30}px)`,
                    transition: `opacity ${getTransitionDuration()} ease-out, transform ${getTransitionDuration()} ease-out`,
                    transitionDelay: getTransitionDelay('0.25s')
                  }}
                >
                  <div className="bg-[#005c4b] rounded-lg p-2.5 max-w-[85%] relative">
                    <div className="absolute left-[-6px] top-2.5 w-0 h-0 border-t-[6px] border-t-transparent border-r-[6px] border-r-[#005c4b] border-b-[6px] border-b-transparent"></div>

                    <div className="flex items-center gap-2.5">
                      <div className="w-6 h-6 bg-gray-600 rounded-full flex items-center justify-center flex-shrink-0">
                        <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
                        </svg>
                      </div>

                      <div className="w-6 h-6 bg-white rounded-full flex items-center justify-center flex-shrink-0">
                        <svg className="w-3 h-3 text-[#005c4b] ml-0.5" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M8 5v14l11-7z"/>
                        </svg>
                      </div>

                      <div className="flex-1 flex items-center gap-1.5">
                        <div className="flex items-center gap-0.5 flex-1">
                          {[...Array(20)].map((_, i) => (
                            <div
                              key={i}
                              className="w-0.5 bg-white/30 rounded-full"
                              style={{
                                height: `${Math.random() * 8 + 2}px`,
                                backgroundColor: i < (scrollProgress * 20) ? 'white' : 'rgba(255,255,255,0.3)'
                              }}
                            />
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="flex justify-between items-center mt-1.5">
                      <span className="text-[10px] text-white/70 font-mono">0:08</span>
                      <div className="flex items-center gap-0.5">
                        <span className="text-[10px] text-white/70">15:33</span>
                        <svg className="w-2.5 h-2.5 text-blue-400" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M9 16.2L4.8 12l-1.4 1.4L9 19 21 7l-1.4-1.4L9 16.2z"/>
                        </svg>
                        <svg className="w-2.5 h-2.5 text-blue-400" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M9 16.2L4.8 12l-1.4 1.4L9 19 21 7l-1.4-1.4L9 16.2z"/>
                        </svg>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Respuesta del bot sobre poda */}
                <div
                  className="flex justify-start mb-2.5"
                  style={{
                    opacity: scrollProgress > getAnimationThreshold(0.25) ? 1 : 0,
                    transform: `translateY(${scrollProgress > getAnimationThreshold(0.25) ? 0 : 30}px)`,
                    transition: `opacity ${getTransitionDuration()} ease-out, transform ${getTransitionDuration()} ease-out`,
                    transitionDelay: getTransitionDelay('0.3s')
                  }}
                >
                  <div className="bg-[#202c33] rounded-lg p-2.5 max-w-[85%] relative">
                    <div className="absolute left-[-6px] top-2.5 w-0 h-0 border-t-[6px] border-t-transparent border-r-[6px] border-r-[#202c33] border-b-[6px] border-b-transparent"></div>
                    <div className="text-xs text-gray-300 mb-1.5">
                      {language === 'es'
                        ? 'La poda en 40 hectáreas con 15 personas ha sido registrada con éxito, ¿deseas que te ayude con algo más?'
                        : 'Pruning on 40 hectares with 15 people has been successfully registered. Would you like me to help you with anything else?'
                      }
                    </div>
                    <div className="flex justify-end">
                      <span className="text-[10px] text-gray-500">15:34</span>
                    </div>
                  </div>
                </div>

                {/* Audio del usuario sobre maquinaria */}
                <div
                  className="flex justify-start mb-2.5"
                  style={{
                    opacity: scrollProgress > getAnimationThreshold(0.3) ? 1 : 0,
                    transform: `translateY(${scrollProgress > getAnimationThreshold(0.3) ? 0 : 30}px)`,
                    transition: `opacity ${getTransitionDuration()} ease-out, transform ${getTransitionDuration()} ease-out`,
                    transitionDelay: getTransitionDelay('0.35s')
                  }}
                >
                  <div className="bg-[#005c4b] rounded-lg p-2.5 max-w-[85%] relative">
                    <div className="absolute left-[-6px] top-2.5 w-0 h-0 border-t-[6px] border-t-transparent border-r-[6px] border-r-[#005c4b] border-b-[6px] border-b-transparent"></div>

                    <div className="flex items-center gap-2.5">
                      <div className="w-6 h-6 bg-gray-600 rounded-full flex items-center justify-center flex-shrink-0">
                        <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
                        </svg>
                      </div>

                      <div className="w-6 h-6 bg-white rounded-full flex items-center justify-center flex-shrink-0">
                        <svg className="w-3 h-3 text-[#005c4b] ml-0.5" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M8 5v14l11-7z"/>
                        </svg>
                      </div>

                      <div className="flex-1 flex items-center gap-1.5">
                        <div className="flex items-center gap-0.5 flex-1">
                          {[...Array(15)].map((_, i) => {
                            const heights = [6, 9, 5, 11, 7, 10, 4, 8, 6, 12, 5, 9, 7, 10, 6]; // Alturas fijas
                            const isActive = i < (scrollProgress * 15);
                            return (
                              <div
                                key={i}
                                className="w-1 rounded-full transition-all duration-300 ease-out"
                                style={{
                                  height: `${heights[i]}px`,
                                  backgroundColor: isActive ? '#ffffff' : 'rgba(255,255,255,0.3)',
                                  transform: isActive ? 'scaleY(1.2)' : 'scaleY(1)',
                                  transitionDelay: `${i * 50}ms`
                                }}
                              />
                            );
                          })}
                        </div>
                      </div>
                    </div>

                    <div className="flex justify-between items-center mt-1.5">
                      <span className="text-[10px] text-white/70 font-mono">0:12</span>
                      <div className="flex items-center gap-0.5">
                        <span className="text-[10px] text-white/70">15:35</span>
                        <svg className="w-2.5 h-2.5 text-blue-400" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M9 16.2L4.8 12l-1.4 1.4L9 19 21 7l-1.4-1.4L9 16.2z"/>
                        </svg>
                        <svg className="w-2.5 h-2.5 text-blue-400" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M9 16.2L4.8 12l-1.4 1.4L9 19 21 7l-1.4-1.4L9 16.2z"/>
                        </svg>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Respuesta del bot sobre maquinaria */}
                <div
                  className="flex justify-start mb-2.5"
                  style={{
                    opacity: scrollProgress > getAnimationThreshold(0.35) ? 1 : 0,
                    transform: `translateY(${scrollProgress > getAnimationThreshold(0.35) ? 0 : 30}px)`,
                    transition: `opacity ${getTransitionDuration()} ease-out, transform ${getTransitionDuration()} ease-out`,
                    transitionDelay: getTransitionDelay('0.4s')
                  }}
                >
                  <div className="bg-[#202c33] rounded-lg p-2.5 max-w-[85%] relative">
                    <div className="absolute left-[-6px] top-2.5 w-0 h-0 border-t-[6px] border-t-transparent border-r-[6px] border-r-[#202c33] border-b-[6px] border-b-transparent"></div>
                    <div className="text-xs text-gray-300 mb-1.5">
                      {language === 'es'
                        ? 'Se ha registrado con éxito la falla de la maquinaria 125, en el cuartel 3 por rueda pinchada. ¿Quieres ver qué máquinas tienes con fallas y cuáles están reparadas?'
                        : 'Machinery 125 failure has been successfully registered in field 3 due to a flat tire. Would you like to see which machines have failures and which are repaired?'
                      }
                    </div>
                    <div className="flex justify-end">
                      <span className="text-[10px] text-gray-500">15:36</span>
                    </div>
                  </div>
                </div>
              </div>
              {/* Input estilo WhatsApp modo oscuro - POSICIÓN ABSOLUTA SIEMPRE EN EL FONDO */}
              <div className="bg-[#202c33] p-2.5 flex items-center gap-2.5 absolute bottom-0 left-0 right-0 z-20">
                {/* Botón de más - Proporcional */}
                <button className="text-gray-400 hover:text-gray-300">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                </button>

                {/* Input de mensaje - Proporcional */}
                <div className="flex-1 bg-[#2a3942] rounded-full px-3 py-1.5 flex items-center gap-1.5">
                  <input
                    type="text"
                    placeholder={language === 'es' ? 'Escribe un mensaje' : 'Type a message'}
                    className="flex-1 outline-none text-xs bg-transparent text-white placeholder-gray-400"
                  />
                </div>

                {/* Botón de cámara - Proporcional */}
                <button className="text-gray-400 hover:text-gray-300">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 15c1.66 0 2.99-1.34 2.99-3L15 6c0-1.66-1.34-3-3-3S9 4.34 9 6v6c0 1.66 1.34 3 3 3zm5.3-3c0 3-2.54 5.1-5.3 5.1S6.7 15 6.7 12H5c0 3.41 2.72 6.23 6 6.72V21h2v-2.28c3.28-.49 6-3.31 6-6.72h-1.7z"/>
                  </svg>
                </button>

                {/* Botón de micrófono - Proporcional */}
                <button className="w-10 h-10 bg-[#00a884] rounded-full flex items-center justify-center text-white hover:bg-[#008f72] transition-colors">
                  <Mic className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Indicador de inicio del iPhone */}
            <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 w-32 h-1 bg-white rounded-full opacity-60"></div>
          </div>
        </div>
      </div>
              {/* Dashboards / Indicadores - INSIGHTS OPERACIONALES */}
              <div className="w-full max-w-3xl space-y-8">
                 {/* Insights en Tiempo Real */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Widget: Gráfico de Barras - Estado de Maquinaria */}
                  <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 h-[220px]">
                    <div className="flex justify-between items-center mb-3">
                      <h3 className="text-sm font-semibold dark:text-white text-gray-700">{language === 'es' ? 'Estado de Maquinaria' : 'Machinery Status'}</h3>
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                        <span className="text-xs text-gray-500">{language === 'es' ? 'En vivo' : 'Live'}</span>
                      </div>
                    </div>

                    {/* Gráfico de Barras */}
                    <div className="h-32 flex items-end justify-center gap-6 mb-3 px-4">
                      {/* Barra Operativas */}
                      <div className="flex flex-col items-center">
                        <div className="relative h-24 w-8 bg-gray-200 rounded-t">
                          <div
                            className="absolute bottom-0 w-full bg-green-500 rounded-t transition-all duration-1000 ease-out"
                            style={{ height: `${Math.max(scrollProgress * 80, 8)}%` }}
                          ></div>
                        </div>
                        <span className="text-xs text-gray-600 dark:text-gray-400 mt-1">{language === 'es' ? 'Operativas' : 'Operational'}</span>
                        <span className="text-sm font-bold text-green-600">{Math.round(scrollProgress * 12)}</span>
                      </div>

                      {/* Barra Con Fallas */}
                      <div className="flex flex-col items-center">
                        <div className="relative h-24 w-8 bg-gray-200 rounded-t">
                          <div
                            className="absolute bottom-0 w-full bg-red-500 rounded-t transition-all duration-1000 ease-out delay-300"
                            style={{ height: `${Math.max(scrollProgress * 25, 8)}%` }}
                          ></div>
                        </div>
                        <span className="text-xs text-gray-600 dark:text-gray-400 mt-1">{language === 'es' ? 'Con Fallas' : 'With Failures'}</span>
                        <span className="text-sm font-bold text-red-600">{Math.round(scrollProgress * 3)}</span>
                      </div>

                      {/* Barra Mantenimiento */}
                      <div className="flex flex-col items-center">
                        <div className="relative h-24 w-8 bg-gray-200 rounded-t">
                          <div
                            className="absolute bottom-0 w-full bg-yellow-500 rounded-t transition-all duration-1000 ease-out delay-500"
                            style={{ height: `${Math.max(scrollProgress * 40, 8)}%` }}
                          ></div>
                        </div>
                        <span className="text-xs text-gray-600 dark:text-gray-400 mt-1">{language === 'es' ? 'Mantenim.' : 'Maintenance'}</span>
                        <span className="text-sm font-bold text-yellow-600">{Math.round(scrollProgress * 2)}</span>
                      </div>
                    </div>

                    {/* Indicador de última actualización */}
                    <div className="text-xs text-gray-500 text-center">
                      {language === 'es' ? 'Actualizado hace' : 'Updated'} {Math.round(scrollProgress * 2)} {language === 'es' ? 'min' : 'min ago'}
                    </div>
                  </div>
                  {/* Widget: Gráfico de Dona - Distribución de Cultivos */}
                  <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 h-[220px]">
                    <div className="flex justify-between items-center mb-3">
                      <h3 className="text-sm font-semibold dark:text-white text-gray-700">{language === 'es' ? 'Distribución de Cultivos' : 'Crop Distribution'}</h3>
                      <div className="flex items-center gap-1">
                        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                        <span className="text-xs text-green-600">{Math.round(scrollProgress * 450)} {language === 'es' ? 'hectáreas' : 'hectares'}</span>
                      </div>
                    </div>

                    {/* Gráfico de Dona */}
                    <div className="flex items-center justify-center mb-3">
                      <div className="relative w-24 h-24">
                        <svg className="w-24 h-24 transform -rotate-90" viewBox="0 0 100 100">
                          {/* Círculo de fondo */}
                          <circle cx="50" cy="50" r="40" fill="none" stroke="#e5e7eb" strokeWidth="8"/>

                          {/* Paltas - Verde */}
                          <circle
                            cx="50" cy="50" r="40" fill="none"
                            stroke="#22c55e" strokeWidth="8"
                            strokeDasharray={`${Math.round(scrollProgress * 180 / 450 * 251)} 251`}
                            strokeDashoffset="0"
                            className="transition-all duration-1000 ease-out"
                          />

                          {/* Arándanos - Azul */}
                          <circle
                            cx="50" cy="50" r="40" fill="none"
                            stroke="#3b82f6" strokeWidth="8"
                            strokeDasharray={`${Math.round(scrollProgress * 150 / 450 * 251)} 251`}
                            strokeDashoffset={`-${Math.round(scrollProgress * 180 / 450 * 251)}`}
                            className="transition-all duration-1000 ease-out delay-300"
                          />

                          {/* Cerezas - Rojo */}
                          <circle
                            cx="50" cy="50" r="40" fill="none"
                            stroke="#ef4444" strokeWidth="8"
                            strokeDasharray={`${Math.round(scrollProgress * 120 / 450 * 251)} 251`}
                            strokeDashoffset={`-${Math.round(scrollProgress * 330 / 450 * 251)}`}
                            className="transition-all duration-1000 ease-out delay-500"
                          />
                        </svg>

                        {/* Número central */}
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="text-center">
                            <div className="text-lg font-bold text-gray-900 dark:text-white">{Math.round(scrollProgress * 450)}</div>
                            <div className="text-xs text-gray-500">{language === 'es' ? 'hectáreas' : 'hectares'}</div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Leyenda */}
                    <div className="space-y-1 text-xs">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                          <span className="text-gray-600 dark:text-gray-400">{language === 'es' ? 'Paltas' : 'Avocados'}</span>
                        </div>
                        <span className="font-medium">{Math.round(scrollProgress * 180)} ha</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                          <span className="text-gray-600 dark:text-gray-400">{language === 'es' ? 'Arándanos' : 'Blueberries'}</span>
                        </div>
                        <span className="font-medium">{Math.round(scrollProgress * 150)} ha</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                          <span className="text-gray-600 dark:text-gray-400">{language === 'es' ? 'Cerezas' : 'Cherries'}</span>
                        </div>
                        <span className="font-medium">{Math.round(scrollProgress * 120)} ha</span>
                      </div>
                    </div>
                  </div>
                  {/* Widget: Gráfico de Líneas - Total Kilos Exportados por Semana */}
                  <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 md:col-span-2">
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="text-sm font-semibold dark:text-white text-gray-700">{language === 'es' ? 'Total kilos exportados por semana' : 'Total kilos exported per week'}</h3>
                      <div className="flex items-center gap-4 text-xs">
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-cyan-500 rounded-full"></div>
                          <span className="text-gray-500">{language === 'es' ? 'Total Kg Exp' : 'Total Kg Exp'}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                          <span className="text-gray-500">{language === 'es' ? 'Promedio Total US' : 'Average Total US'}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                          <span className="text-gray-500">{language === 'es' ? 'Mínimo Total US' : 'Minimum Total US'}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                          <span className="text-gray-500">{language === 'es' ? 'Máximo Total US' : 'Maximum Total US'}</span>
                        </div>
                      </div>
                    </div>

                    {/* Gráfico de Líneas Múltiples */}
                    <div className="h-40 mb-4">
                      <svg width="100%" height="100%" viewBox="0 0 500 160" className="overflow-visible">
                        {/* Grid lines */}
                        <defs>
                          <pattern id="exportGrid" width="50" height="32" patternUnits="userSpaceOnUse">
                            <path d="M 50 0 L 0 0 0 32" fill="none" stroke="#e5e7eb" strokeWidth="0.5"/>
                          </pattern>
                        </defs>
                        <rect width="100%" height="100%" fill="url(#exportGrid)" />

                        {/* Eje Y - Labels */}
                        <text x="15" y="20" fill="#6b7280" fontSize="10">350,000</text>
                        <text x="15" y="50" fill="#6b7280" fontSize="10">250,000</text>
                        <text x="15" y="80" fill="#6b7280" fontSize="10">150,000</text>
                        <text x="15" y="110" fill="#6b7280" fontSize="10">50,000</text>
                        <text x="15" y="140" fill="#6b7280" fontSize="10">0</text>

                        {/* Eje X - Semanas */}
                        <text x="50" y="155" fill="#6b7280" fontSize="10">46</text>
                        <text x="150" y="155" fill="#6b7280" fontSize="10">47</text>
                        <text x="250" y="155" fill="#6b7280" fontSize="10">48</text>
                        <text x="350" y="155" fill="#6b7280" fontSize="10">49</text>
                        <text x="450" y="155" fill="#6b7280" fontSize="10">52</text>

                        {/* Línea Total Kg Exp (Cyan) - Línea principal que sube dramáticamente */}
                        <polyline
                          fill="none"
                          stroke="#06b6d4"
                          strokeWidth="3"
                          strokeDasharray="800"
                          strokeDashoffset={800 - (scrollProgress * 800)}
                          points="50,120 100,110 150,100 200,80 250,60 300,50 350,45 400,25 450,15"
                          className="transition-all duration-1500 ease-out"
                        />

                        {/* Línea Máximo Total US (Amarillo) */}
                        <polyline
                          fill="none"
                          stroke="#eab308"
                          strokeWidth="2"
                          strokeDasharray="700"
                          strokeDashoffset={700 - (scrollProgress * 700)}
                          points="50,130 100,125 150,120 200,115 250,110 300,105 350,100 400,95 450,90"
                          className="transition-all duration-1500 ease-out"
                          style={{ transitionDelay: `${300}ms` }}
                        />

                        {/* Línea Promedio Total US (Rojo) */}
                        <polyline
                          fill="none"
                          stroke="#ef4444"
                          strokeWidth="2"
                          strokeDasharray="650"
                          strokeDashoffset={650 - (scrollProgress * 650)}
                          points="50,135 100,133 150,130 200,128 250,125 300,123 350,120 400,118 450,115"
                          className="transition-all duration-1500 ease-out"
                          style={{ transitionDelay: `${500}ms` }}
                        />

                        {/* Línea Mínimo Total US (Azul) */}
                        <polyline
                          fill="none"
                          stroke="#3b82f6"
                          strokeWidth="2"
                          strokeDasharray="600"
                          strokeDashoffset={600 - (scrollProgress * 600)}
                          points="50,140 100,138 150,135 200,133 250,130 300,128 350,125 400,123 450,120"
                          className="transition-all duration-1500 ease-out"
                          style={{ transitionDelay: `${700}ms` }}
                        />

                        {/* Puntos de datos finales */}
                        {scrollProgress > 0.8 && (
                          <>
                            <circle cx="450" cy="15" r="4" fill="#06b6d4" className="animate-pulse"/>
                            <circle cx="450" cy="90" r="3" fill="#eab308"/>
                            <circle cx="450" cy="115" r="3" fill="#ef4444"/>
                            <circle cx="450" cy="120" r="3" fill="#3b82f6"/>
                          </>
                        )}
                      </svg>
                    </div>

                    {/* Métricas clave */}
                    <div className="grid grid-cols-3 gap-4 text-center">
                      <div className="p-2 bg-cyan-50 dark:bg-cyan-900/20 rounded">
                        <div className="text-lg font-bold text-cyan-600">{Math.round(scrollProgress * 320000).toLocaleString()}</div>
                        <div className="text-xs text-gray-600 dark:text-gray-400">Kg exportados esta semana</div>
                      </div>
                      <div className="p-2 bg-green-50 dark:bg-green-900/20 rounded">
                        <div className="text-lg font-bold text-green-600">+{Math.round(scrollProgress * 180)}%</div>
                        <div className="text-xs text-gray-600 dark:text-gray-400">Crecimiento vs sem. anterior</div>
                      </div>
                      <div className="p-2 bg-blue-50 dark:bg-blue-900/20 rounded">
                        <div className="text-lg font-bold text-blue-600">${Math.round(scrollProgress * 2.8 * 100)/100}</div>
                        <div className="text-xs text-gray-600 dark:text-gray-400">Precio promedio por kg</div>
                      </div>
                    </div>
                  </div>
                  {/* Widget: Stress de Plantas por Huerto */}
                  <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700">
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="text-sm font-semibold dark:text-white text-gray-700">{language === 'es' ? 'Stress de Plantas por Huerto' : 'Plant Stress by Orchard'}</h3>
                      <div className="flex items-center gap-1">
                        <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                        <span className="text-xs text-red-600">{language === 'es' ? 'Alerta activa' : 'Active alert'}</span>
                      </div>
                    </div>

                    {/* Gráfico de Barras Horizontales */}
                    <div className="space-y-3">
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-gray-600 dark:text-gray-400 w-16">{language === 'es' ? 'Huerto A' : 'Orchard A'}</span>
                        <div className="flex-1 bg-gray-200 rounded-full h-3">
                          <div
                            className="bg-red-500 h-3 rounded-full transition-all duration-1000 ease-out"
                            style={{ width: `${scrollProgress * 85}%` }}
                          ></div>
                        </div>
                        <span className="text-xs font-medium text-red-600">{Math.round(scrollProgress * 85)}%</span>
                      </div>

                      <div className="flex items-center gap-2">
                        <span className="text-xs text-gray-600 dark:text-gray-400 w-16">{language === 'es' ? 'Huerto B' : 'Orchard B'}</span>
                        <div className="flex-1 bg-gray-200 rounded-full h-3">
                          <div
                            className="bg-yellow-500 h-3 rounded-full transition-all duration-1000 ease-out delay-200"
                            style={{ width: `${scrollProgress * 65}%` }}
                          ></div>
                        </div>
                        <span className="text-xs font-medium text-yellow-600">{Math.round(scrollProgress * 65)}%</span>
                      </div>

                      <div className="flex items-center gap-2">
                        <span className="text-xs text-gray-600 dark:text-gray-400 w-16">{language === 'es' ? 'Huerto C' : 'Orchard C'}</span>
                        <div className="flex-1 bg-gray-200 rounded-full h-3">
                          <div
                            className="bg-green-500 h-3 rounded-full transition-all duration-1000 ease-out delay-400"
                            style={{ width: `${scrollProgress * 35}%` }}
                          ></div>
                        </div>
                        <span className="text-xs font-medium text-green-600">{Math.round(scrollProgress * 35)}%</span>
                      </div>

                      <div className="flex items-center gap-2">
                        <span className="text-xs text-gray-600 dark:text-gray-400 w-16">{language === 'es' ? 'Huerto D' : 'Orchard D'}</span>
                        <div className="flex-1 bg-gray-200 rounded-full h-3">
                          <div
                            className="bg-green-500 h-3 rounded-full transition-all duration-1000 ease-out delay-600"
                            style={{ width: `${scrollProgress * 28}%` }}
                          ></div>
                        </div>
                        <span className="text-xs font-medium text-green-600">{Math.round(scrollProgress * 28)}%</span>
                      </div>
                    </div>

                    {/* Leyenda de niveles de stress */}
                    <div className="mt-4 flex justify-between text-xs">
                      <div className="flex items-center gap-1">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        <span className="text-gray-600 dark:text-gray-400">{language === 'es' ? 'Bajo' : 'Low'} (&lt;40%)</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                        <span className="text-gray-600 dark:text-gray-400">{language === 'es' ? 'Medio' : 'Medium'} (40-70%)</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                        <span className="text-gray-600 dark:text-gray-400">{language === 'es' ? 'Alto' : 'High'} (&gt;70%)</span>
                      </div>
                    </div>
                  </div>

                  {/* Widget: Eficiencia de Labores por Persona */}
                  <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700">
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="text-sm font-semibold dark:text-white text-gray-700">{language === 'es' ? 'Eficiencia de Labores por Persona' : 'Labor Efficiency by Person'}</h3>
                      <span className="text-xs text-gray-500">{language === 'es' ? 'Última semana' : 'Last week'}</span>
                    </div>

                    {/* Lista de trabajadores con eficiencia */}
                    <div className="space-y-3">
                      <div className="flex items-center gap-3">
                        <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center">
                          <span className="text-xs font-medium text-green-700">JP</span>
                        </div>
                        <div className="flex-1">
                          <div className="flex justify-between items-center mb-1">
                            <span className="text-xs font-medium text-gray-700 dark:text-gray-300">Juan Pérez</span>
                            <span className="text-xs font-bold text-green-600">{Math.round(scrollProgress * 94)}%</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div
                              className="bg-green-500 h-2 rounded-full transition-all duration-1000 ease-out"
                              style={{ width: `${scrollProgress * 94}%` }}
                            ></div>
                          </div>
                          <span className="text-xs text-gray-500">{language === 'es' ? 'Cosecha' : 'Harvest'} - {Math.round(scrollProgress * 850)} kg/día</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center">
                          <span className="text-xs font-medium text-blue-700">MG</span>
                        </div>
                        <div className="flex-1">
                          <div className="flex justify-between items-center mb-1">
                            <span className="text-xs font-medium text-gray-700 dark:text-gray-300">María González</span>
                            <span className="text-xs font-bold text-blue-600">{Math.round(scrollProgress * 87)}%</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div
                              className="bg-blue-500 h-2 rounded-full transition-all duration-1000 ease-out delay-200"
                              style={{ width: `${scrollProgress * 87}%` }}
                            ></div>
                          </div>
                          <span className="text-xs text-gray-500">{language === 'es' ? 'Poda' : 'Pruning'} - {Math.round(scrollProgress * 45)} {language === 'es' ? 'árboles/día' : 'trees/day'}</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <div className="w-6 h-6 bg-yellow-100 rounded-full flex items-center justify-center">
                          <span className="text-xs font-medium text-yellow-700">CR</span>
                        </div>
                        <div className="flex-1">
                          <div className="flex justify-between items-center mb-1">
                            <span className="text-xs font-medium text-gray-700 dark:text-gray-300">Carlos Ruiz</span>
                            <span className="text-xs font-bold text-yellow-600">{Math.round(scrollProgress * 72)}%</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div
                              className="bg-yellow-500 h-2 rounded-full transition-all duration-1000 ease-out delay-400"
                              style={{ width: `${scrollProgress * 72}%` }}
                            ></div>
                          </div>
                          <span className="text-xs text-gray-500">{language === 'es' ? 'Riego' : 'Irrigation'} - {Math.round(scrollProgress * 12)} ha/día</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

        </section>

        {/* Paso 2: Integra todas tus fuentes de datos */}
        <section className="w-full py-12 md:py-24 lg:py-32 bg-gray-50 dark:bg-gray-800/50 overflow-hidden">
          <div className="container px-4 md:px-6">
            {/* Paso 2 Badge */}
            <div className="flex justify-center mb-4">
              <span className="inline-flex items-center gap-2 px-4 py-1.5 bg-[#F97316]/10 dark:bg-[#F97316]/20 text-[#F97316] rounded-full text-sm font-medium">
                <span className="w-6 h-6 bg-[#F97316] text-white rounded-full flex items-center justify-center text-xs font-bold">2</span>
                {language === 'es' ? 'Paso 2' : 'Step 2'}
              </span>
            </div>
            <h2 className="text-3xl text-semibold tracking-tighter sm:text-5xl text-center mb-4 text-gray-900 dark:text-white">
              {language === 'es' ? 'Integra todas tus fuentes de datos' : 'Integrate all your data sources'}
            </h2>
            <p className="mb-10 text-gray-600 dark:text-gray-400 text-center text-light max-w-2xl mx-auto">
              {language === 'es'
                ? 'Nos conectamos con múltiples plataformas, ERPs y sistemas agrícolas. Toda tu información en un solo lugar.'
                : 'We connect with multiple platforms, ERPs and agricultural systems. All your information in one place.'
              }
            </p>

            <div className="flex items-center justify-center">
              {/* Lista de integraciones disponibles - Temporalmente comentado */}
              {/* <div className="w-full max-w-xs space-y-4">
                <h3 className="text-lg font-semibold text-gray-800 dark:text-white text-center lg:text-left mb-4">
                  {language === 'es' ? 'Integraciones disponibles' : 'Available integrations'}
                </h3>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { name: 'SAP', color: '#0FAAFF' },
                    { name: 'Wiseconn', color: '#3B82F6' },
                    { name: 'Odoo', color: '#714B67' },
                    { name: 'Salesforce', color: '#00A1E0' },
                    { name: 'Excel', color: '#217346' },
                    { name: 'INIA', color: '#22C55E' },
                  ].map((item, idx) => (
                    <div
                      key={idx}
                      className="flex items-center gap-2 px-3 py-2 bg-white dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600 shadow-sm hover:shadow-md hover:border-[#F97316] transition-all cursor-pointer"
                    >
                      <div
                        className="w-6 h-6 rounded flex items-center justify-center text-white text-xs font-bold"
                        style={{ backgroundColor: item.color }}
                      >
                        {item.name.charAt(0)}
                      </div>
                      <span className="text-sm text-gray-700 dark:text-gray-200">{item.name}</span>
                    </div>
                  ))}
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400 text-center lg:text-left mt-4">
                  {language === 'es' ? '+ muchas más integraciones disponibles' : '+ many more integrations available'}
                </p>
              </div> */}

              {/* Demo de integración - Centrado */}
              <IntegrationDemo />
            </div>
          </div>
        </section>

        {/* Paso 3: Crea tus propios dashboards con IA */}
        <section className="w-full py-12 md:py-24 lg:py-32 overflow-hidden">
          <div className="container px-4 md:px-6">
            {/* Paso 3 Badge */}
            <div className="flex justify-center mb-4">
              <span className="inline-flex items-center gap-2 px-4 py-1.5 bg-[#14B8A6]/10 dark:bg-[#14B8A6]/20 text-[#14B8A6] rounded-full text-sm font-medium">
                <span className="w-6 h-6 bg-[#14B8A6] text-white rounded-full flex items-center justify-center text-xs font-bold">3</span>
                {language === 'es' ? 'Paso 3' : 'Step 3'}
              </span>
            </div>
            <h2 className="text-3xl text-semibold tracking-tighter sm:text-5xl text-center mb-4 text-gray-900 dark:text-white">
              {language === 'es' ? 'Crea dashboards con un simple chat de IA' : 'Create dashboards with a simple AI chat'}
            </h2>
            <p className="mb-10 text-gray-600 dark:text-gray-400 text-center text-light max-w-2xl mx-auto">
              {language === 'es'
                ? 'Genera reportes, gráficos y análisis personalizados solo preguntando. Sin código, sin complicaciones.'
                : 'Generate reports, charts and custom analytics just by asking. No code, no hassle.'
              }
            </p>

            {/* Demo del Dashboard Builder */}
            <DashboardDemo />

            {/* Features adicionales */}
            <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
              <div className="flex items-start gap-3 p-4 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm">
                <div className="w-10 h-10 rounded-lg bg-[#14B8A6]/10 flex items-center justify-center flex-shrink-0">
                  <span className="text-lg">📊</span>
                </div>
                <div>
                  <h4 className="font-medium text-gray-800 dark:text-white text-sm mb-1">
                    {language === 'es' ? 'Gráficos automáticos' : 'Auto-generated charts'}
                  </h4>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {language === 'es' ? 'La IA elige el mejor tipo de visualización para tus datos' : 'AI picks the best visualization type for your data'}
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-4 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm">
                <div className="w-10 h-10 rounded-lg bg-[#14B8A6]/10 flex items-center justify-center flex-shrink-0">
                  <span className="text-lg">🔄</span>
                </div>
                <div>
                  <h4 className="font-medium text-gray-800 dark:text-white text-sm mb-1">
                    {language === 'es' ? 'Datos en tiempo real' : 'Real-time data'}
                  </h4>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {language === 'es' ? 'Conectado a todas tus fuentes de datos integradas' : 'Connected to all your integrated data sources'}
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-4 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm">
                <div className="w-10 h-10 rounded-lg bg-[#14B8A6]/10 flex items-center justify-center flex-shrink-0">
                  <span className="text-lg">💬</span>
                </div>
                <div>
                  <h4 className="font-medium text-gray-800 dark:text-white text-sm mb-1">
                    {language === 'es' ? 'Lenguaje natural' : 'Natural language'}
                  </h4>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {language === 'es' ? 'Pregunta como le hablarías a un colega experto' : 'Ask as you would speak to an expert colleague'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>


       

        {/* Paso 4: Crea tus propios AI Workflows */}
        <section className="w-full py-12 md:py-24 lg:py-32 bg-gray-50 dark:bg-gray-800/50 overflow-hidden">
          <div className="container px-4 md:px-6">
            {/* Paso 4 Badge */}
            <div className="flex justify-center mb-4">
              <span className="inline-flex items-center gap-2 px-4 py-1.5 bg-[#8B5CF6]/10 dark:bg-[#8B5CF6]/20 text-[#8B5CF6] rounded-full text-sm font-medium">
                <span className="w-6 h-6 bg-[#8B5CF6] text-white rounded-full flex items-center justify-center text-xs font-bold">4</span>
                {language === 'es' ? 'Paso 4' : 'Step 4'}
              </span>
            </div>
            <h2 className="text-3xl text-semibold tracking-tighter sm:text-5xl text-center mb-4 text-gray-900 dark:text-white">
              {language === 'es' ? 'Crea tus propios AI Workflows' : 'Create your own AI Workflows'}
            </h2>
            <p className="mb-10 text-gray-600 dark:text-gray-400 text-center text-light max-w-2xl mx-auto">
              {language === 'es'
                ? 'Automatiza procesos complejos conectando bloques de IA, integraciones y acciones. Sin código, 100% visual.'
                : 'Automate complex processes by connecting AI blocks, integrations and actions. No code, 100% visual.'
              }
            </p>
          </div>

          {/* WorkflowBuilder con casos de uso */}
          <WorkflowBuilder hideTitle={true} />
        </section>

        {/* Principales beneficios */}
        <section className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl text-center mb-6 text-gray-900 dark:text-white">{language === 'es' ? 'Principales beneficios' : 'Main Benefits'}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="flex items-start space-x-4">
                <Users className="h-6 w-6 text-primary mt-1" style={{color: '#38507E'}} />
                <div>
                  <h3 className="text-xl text-medium mb-2 text-gray-900 dark:text-white">{language === 'es' ? 'Amigable con el usuario' : 'User-Friendly'}</h3>
                  <p className="text-gray-500 dark:text-gray-400 text-light">{language === 'es' ? 'Aprovecha la familiaridad de WhatsApp para una adopción fácil en todo tu equipo.' : 'Leverage WhatsApp familiarity for easy adoption across your team.'}</p>
                </div>
              </div>
              <div className="flex items-start space-x-4">
                <BarChart2 className="h-6 w-6 text-primary mt-1" style={{ color: '#51A09A'}} />
                <div>
                  <h3 className="text-xl text-medium mb-2 text-gray-900 dark:text-white">{language === 'es' ? 'Información accionable' : 'Actionable Information'}</h3>
                  <p className="text-gray-500 dark:text-gray-400 text-light">{language === 'es' ? 'Convierte los mensajes de voz en datos estructurados para una mejor toma de decisiones.' : 'Convert voice messages into structured data for better decision-making.'}</p>
                </div>
              </div>
              <div className="flex items-start space-x-4">
                <Mic className="h-6 w-6 text-primary mt-1" style={{ color:'#51A09A'}}/>
                <div>
                  <h3 className="text-xl text-medium mb-2 text-gray-900 dark:text-white">{language === 'es' ? 'Enfoque centrado en la voz' : 'Voice-First Approach'}</h3>
                  <p className="text-gray-500 dark:text-gray-400 text-light">{language === 'es' ? 'Ideal para industrias donde escribir no siempre es conveniente o posible.' : 'Ideal for industries where typing is not always convenient or possible.'}</p>
                </div>
              </div>
              <div className="flex items-start space-x-4">
                <CheckCircle className="h-6 w-6 text-primary mt-1" style={{ color: '#C2DB64'}}/>
                <div>
                  <h3 className="text-xl text-medium mb-2 text-gray-900 dark:text-white">{language === 'es' ? 'Flujos de trabajo optimizados' : 'Optimized Workflows'}</h3>
                  <p className="text-gray-500 dark:text-gray-400 text-light">{language === 'es' ? 'Simplifica la creación de tareas, el seguimiento y la recopilación de información en un solo lugar.' : 'Simplify task creation, tracking, and information collection in one place.'}</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        
        <MultiWaveAudio />

        {/* Casos de Uso Section - Temporalmente comentado hasta tener todos los videos */}
        {/* <section ref={casesRef}>
          <UseCasesSection />
        </section> */}

{/* Haz preguntas sobre la data Seccion  */}

<section ref={newSectionRef} className="w-full py-12 md:py-24 lg:py-32 overflow-hidden">
  <div className="container px-4 md:px-6">
  <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl text-center mb-6 text-gray-900 dark:text-white">
      {language === 'es' ? 'Haz preguntas sobre la data levantada' : 'Ask Questions About Collected Data'}
    </h2>
    <p className="mb-6 text-gray-500 dark:text-gray-400 text-center">{language === 'es' ? 'Puedes hacer preguntas en el mismo chat, sobre toda la información que las personas están levantando. ¡Mira este ejemplo!' : 'You can ask questions in the same chat about all the information people are collecting. Check out this example!'}</p>
    <div className="flex flex-col lg:flex-row items-start justify-center gap-8">
      {/* iPhone Real Auténtico - Proporciones exactas 146.7mm x 71.5mm */}
      <div className="w-full max-w-[300px] mx-auto">
        {/* Marco del iPhone - Negro mate como iPhone Pro */}
        <div className="relative bg-black rounded-[3rem] p-2 shadow-2xl" style={{
          background: 'linear-gradient(145deg, #1a1a1a 0%, #000000 50%, #1a1a1a 100%)',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.8), inset 0 1px 0 rgba(255, 255, 255, 0.1)',
          width: '300px',
          height: '615px', // 300px * 2.05 = 615px (proporción real iPhone)
          aspectRatio: '71.5/146.7' // Proporción exacta del iPhone real
        }}>

          {/* Pantalla del iPhone - Proporciones reales */}
          <div className="relative bg-[#0b141a] rounded-[2.5rem] overflow-hidden w-full h-full">

            {/* Barra de estado del iPhone - Proporcional */}
            <div className="absolute top-0 left-0 right-0 h-10 flex justify-between items-center px-5 pt-1.5 z-30">
              <div className="flex items-center gap-1">
                <span className="text-white text-sm font-semibold">17:52</span>
              </div>
              <div className="flex items-center gap-1">
                {/* Señal celular */}
                <div className="flex gap-0.5">
                  <div className="w-1 h-2 bg-white rounded-full"></div>
                  <div className="w-1 h-2.5 bg-white rounded-full"></div>
                  <div className="w-1 h-3 bg-white rounded-full"></div>
                  <div className="w-1 h-3.5 bg-white rounded-full"></div>
                </div>
                {/* WiFi */}
                <svg className="w-4 h-4 text-white ml-1" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M1 9l2 2c4.97-4.97 13.03-4.97 18 0l2-2C16.93 2.93 7.07 2.93 1 9zm8 8l3 3 3-3c-1.65-1.66-4.34-1.66-6 0zm-4-4l2 2c2.76-2.76 7.24-2.76 10 0l2-2C15.14 9.14 8.87 9.14 5 13z"/>
                </svg>
                {/* Batería */}
                <div className="flex items-center ml-1">
                  <div className="w-6 h-3 border border-white rounded-sm relative">
                    <div className="w-4 h-1.5 bg-green-400 rounded-sm absolute top-0.5 left-0.5"></div>
                  </div>
                  <div className="w-0.5 h-1.5 bg-white rounded-r ml-0.5"></div>
                </div>
              </div>
            </div>

            {/* Isla dinámica - Proporcional */}
            <div className="absolute top-1.5 left-1/2 transform -translate-x-1/2 w-24 h-6 bg-black rounded-full z-20 border border-gray-800"></div>

            {/* Contenido de WhatsApp con fondo oscuro - ESTRUCTURA FIJA PARA BARRA SIEMPRE VISIBLE */}
            <div className="bg-[#0b141a] flex-1 flex flex-col relative pt-10 h-full">
              {/* WhatsApp Header - Exacto como la imagen */}
             <div className="bg-[#202c33] px-3 py-2.5 flex items-center gap-3 h-14 z-20">
                {/* Flecha de regreso */}
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>

                {/* Número 357 */}
                <span className="text-white text-base font-normal">357</span>

                {/* Avatar con logo MIIDO más pequeño */}
                <div className="w-7 h-7 rounded-full bg-white flex items-center justify-center">
                  <svg className="w-4 h-4 text-black" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                  </svg>
                </div>

                {/* Info del contacto - TODO EN UNA LÍNEA */}
                <div className="flex-1 flex items-center gap-2 flex-nowrap whitespace-nowrap overflow-hidden">
                  <span className="text-white text-base font-medium truncate">Bot MIIDO</span>
                  <span className="text-[#8696a0] text-sm">Miido Tareas</span>
                  <svg className="w-3 h-3 text-[#53bdeb]" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                  </svg>
                  <span className="text-[#8696a0] text-sm">• Business account</span>
                </div>
              </div>

              {/* Mensajes con fondo oscuro de WhatsApp - SCROLLEABLE */}
              <div
                className="flex-1 p-2.5 space-y-2.5 relative overflow-y-auto scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-transparent"
                style={{
                  backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.03'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
                  backgroundColor: '#0b141a',
                  maxHeight: 'calc(100% - 116px)', // Espacio para header (56px) + input (60px)
                  minHeight: '400px',
                  scrollbarWidth: 'thin',
                  scrollbarColor: '#4a5568 transparent'
                }}
              >
                {/* Mensajes con animación de scroll */}
                {[
                  { text: "¿Cuándo empezamos la cosecha la temporada anterior?", type: "question" },
                  { text: "La cosecha empezó el 15 de diciembre del año pasado.", type: "answer" },
                  { text: "¿Cómo va la cosecha?", type: "question" },
                  { text: "chart", type: "chart" }, // Mensaje especial para el gráfico
                  { text: "¿Cuál fue el rendimiento del último trimestre?", type: "question" },
                  { text: "El rendimiento del último trimestre fue de 2,850 kg por hectárea, un 15% superior al trimestre anterior.", type: "answer" },
                  { text: "¿Qué huertos tienen mejor productividad?", type: "question" },
                  { text: "Los huertos C y D tienen la mejor productividad con 3,200 kg/ha y 3,100 kg/ha respectivamente.", type: "answer" }
                ].map((message, index) => (
                  <div
                    key={index}
                    className={`flex ${message.type === 'question' ? 'justify-end' : 'justify-start'} mb-2.5`}
                    style={{
                      opacity: scrollProgressNewSection > index / 8 ? 1 : 0,
                      transform: `translateY(${scrollProgressNewSection > index / 8 ? 0 : 20}px)`,
                      transition: 'opacity 0.5s ease-out, transform 0.5s ease-out'
                    }}
                  >
                    {message.type === 'chart' ? (
                      // Gráfico de evolución de cosecha
                      <div className="bg-[#202c33] rounded-lg p-3 max-w-[90%] relative">
                        <div className="absolute left-[-6px] top-2.5 w-0 h-0 border-t-[6px] border-t-transparent border-r-[6px] border-r-[#202c33] border-b-[6px] border-b-transparent"></div>

                        <div className="text-xs text-gray-300 mb-2">
                          📊 Evolución de la cosecha - Últimos 7 días
                        </div>

                        {/* Mini gráfico de líneas */}
                        <div className="bg-[#0b141a] rounded p-2 mb-2">
                          <svg width="200" height="80" viewBox="0 0 200 80" className="w-full">
                            {/* Grid lines */}
                            <defs>
                              <pattern id="miniGrid" width="25" height="16" patternUnits="userSpaceOnUse">
                                <path d="M 25 0 L 0 0 0 16" fill="none" stroke="#374151" strokeWidth="0.5"/>
                              </pattern>
                            </defs>
                            <rect width="100%" height="100%" fill="url(#miniGrid)" />

                            {/* Línea de progreso de cosecha - ESTÁTICA */}
                            <polyline
                              fill="none"
                              stroke="#22c55e"
                              strokeWidth="2"
                              points="20,60 45,55 70,45 95,40 120,30 145,25 170,15"
                            />

                            {/* Puntos de datos estáticos */}
                            <circle cx="20" cy="60" r="2" fill="#22c55e"/>
                            <circle cx="45" cy="55" r="2" fill="#22c55e"/>
                            <circle cx="70" cy="45" r="2" fill="#22c55e"/>
                            <circle cx="95" cy="40" r="2" fill="#22c55e"/>
                            <circle cx="120" cy="30" r="2" fill="#22c55e"/>
                            <circle cx="145" cy="25" r="2" fill="#22c55e"/>
                            <circle cx="170" cy="15" r="2" fill="#22c55e"/>

                            {/* Labels de días */}
                            <text x="20" y="75" fill="#9ca3af" fontSize="8" textAnchor="middle">L</text>
                            <text x="45" y="75" fill="#9ca3af" fontSize="8" textAnchor="middle">M</text>
                            <text x="70" y="75" fill="#9ca3af" fontSize="8" textAnchor="middle">M</text>
                            <text x="95" y="75" fill="#9ca3af" fontSize="8" textAnchor="middle">J</text>
                            <text x="120" y="75" fill="#9ca3af" fontSize="8" textAnchor="middle">V</text>
                            <text x="145" y="75" fill="#9ca3af" fontSize="8" textAnchor="middle">S</text>
                            <text x="170" y="75" fill="#9ca3af" fontSize="8" textAnchor="middle">D</text>
                          </svg>
                        </div>

                        {/* Métricas */}
                        <div className="grid grid-cols-2 gap-2 text-xs">
                          <div className="bg-[#0b141a] rounded p-1.5 text-center">
                            <div className="text-green-400 font-bold">72%</div>
                            <div className="text-gray-400">Completado</div>
                          </div>
                          <div className="bg-[#0b141a] rounded p-1.5 text-center">
                            <div className="text-blue-400 font-bold">1,250 kg</div>
                            <div className="text-gray-400">Hoy</div>
                          </div>
                        </div>

                        <div className="flex justify-end mt-2">
                          <span className="text-[10px] text-gray-500">15:38</span>
                        </div>
                      </div>
                    ) : (
                      // Mensajes normales
                      <div className={`${message.type === 'question' ? 'bg-[#005c4b]' : 'bg-[#202c33]'} rounded-lg p-2.5 max-w-[85%] relative`}>
                        {/* Triángulo de mensaje */}
                        <div className={`absolute ${message.type === 'question' ? 'right-[-6px]' : 'left-[-6px]'} top-2.5 w-0 h-0 ${message.type === 'question' ? 'border-t-[6px] border-t-transparent border-l-[6px] border-l-[#005c4b] border-b-[6px] border-b-transparent' : 'border-t-[6px] border-t-transparent border-r-[6px] border-r-[#202c33] border-b-[6px] border-b-transparent'}`}></div>
                        <div className="text-xs text-gray-300 mb-1">
                          {message.text}
                        </div>
                        <div className="flex justify-end">
                          <span className="text-[10px] text-gray-500">15:3{6 + index}</span>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* Input estilo WhatsApp modo oscuro - POSICIÓN ABSOLUTA SIEMPRE EN EL FONDO */}
              <div className="bg-[#202c33] p-2.5 flex items-center gap-2.5 absolute bottom-0 left-0 right-0 z-20">
                {/* Botón de más - Proporcional */}
                <button className="text-gray-400 hover:text-gray-300">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                </button>

                {/* Input de mensaje - Proporcional */}
                <div className="flex-1 bg-[#2a3942] rounded-full px-3 py-1.5 flex items-center gap-1.5">
                  <input
                    type="text"
                    placeholder="Escribe un mensaje"
                    className="flex-1 outline-none text-xs bg-transparent text-white placeholder-gray-400"
                  />
                </div>

                {/* Botón de cámara - Proporcional */}
                <button className="text-gray-400 hover:text-gray-300">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 15c1.66 0 2.99-1.34 2.99-3L15 6c0-1.66-1.34-3-3-3S9 4.34 9 6v6c0 1.66 1.34 3 3 3zm5.3-3c0 3-2.54 5.1-5.3 5.1S6.7 15 6.7 12H5c0 3.41 2.72 6.23 6 6.72V21h2v-2.28c3.28-.49 6-3.31 6-6.72h-1.7z"/>
                  </svg>
                </button>

                {/* Botón de micrófono - Proporcional */}
                <button className="w-10 h-10 bg-[#00a884] rounded-full flex items-center justify-center text-white hover:bg-[#008f72] transition-colors">
                  <Mic className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Indicador de inicio del iPhone */}
            <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 w-32 h-1 bg-white rounded-full opacity-60"></div>
          </div>
        </div>
      </div>
    </div>
  </div>
</section>




{/* Nuestros clientes nos aman  **/}
        {/* Nuestros clientes nos aman */}
        <section ref={testimonialsRef} className="w-full py-12 md:py-24 lg:py-32 bg-gray-50 dark:bg-gray-900">
  <div className="container px-4 md:px-6">
    <h2
      className="text-3xl text-semibold tracking-tighter sm:text-5xl text-center mb-12 text-gray-900 dark:text-white"
      style={{
        animation: 'fadeInUp 0.8s ease-out forwards',
        opacity: 0,
        transform: 'translateY(20px)'
      }}
    >
      {language === 'es' ? 'Nuestros clientes nos aman' : 'Our clients love us'}
    </h2>
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">

      {/* Guillermo */}
      <div
        className="bg-white dark:bg-gray-800 shadow-md rounded-lg overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2"
        style={{
          animation: 'fadeInUp 0.8s ease-out 0.2s forwards',
          opacity: 0,
          transform: 'translateY(20px)'
        }}
      >
        <div className="relative aspect-[2/4]">
          {playingVideo === 'ted-wright' ? (
            <ReactPlayer
              url="https://youtu.be/5L_QTMlP-8ohttps://youtube.com/shorts/5L_QTMlP-8o?feature=share"
              width="100%"
              height="100%"
              playing
              controls
              style={{ position: 'relative', top: 0, left: 0 }}
            />
          ) : (
            <>
              <Image
                src="/Guillermo.jpg"
                alt="Ted Wright"
                fill
                style={{ objectFit: 'cover' }}
              />
              <div
                className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-30 cursor-pointer transform transition-transform duration-300 hover:scale-110"
                onClick={() => handlePlayVideo('ted-wright')}
              >
                <PlayCircle className="w-12 h-12 text-white opacity-80" />
              </div>
            </>
          )}
        </div>
        <div className="p-4">
          <h3 className="text-medium text-base text-gray-900 dark:text-white">Guillermo Baeza</h3>
          <p className="text-sm text-gray-600 dark:text-gray-300 text-ultra-light">{language === 'es' ? 'Jefe de campo en Agrícola Manantiales (Curicó) 🇨🇱' : 'Field Manager at Agrícola Manantiales (Curicó) 🇨🇱'}</p>
        </div>
      </div>

      {/* Felipe */}
      <div
        className="bg-white dark:bg-gray-800 shadow-md rounded-lg overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2"
        style={{
          animation: 'fadeInUp 0.8s ease-out 0.4s forwards',
          opacity: 0,
          transform: 'translateY(20px)'
        }}
      >
        <div className="p-6">
          <blockquote
            className="text-sm italic mb-4 mt-40 text-gray-800 dark:text-gray-200 text-light"
            style={{
              animation: 'fadeInUp 0.8s ease-out 0.6s forwards',
              opacity: 0
            }}
          >
            {language === 'es' ? '&quot;MIIDO se ha convertido en nuestra herramienta más valiosa para dar inteligencia a los datos que se levantan en el día a día de la operación.&quot;' : '&quot;MIIDO has become our most valuable tool for adding intelligence to the data we collect in our daily operations.&quot;'}
          </blockquote>
          <div
            className="flex items-center"
            style={{
              animation: 'fadeInUp 0.8s ease-out 0.7s forwards',
              opacity: 0
            }}
          >
            <Image
              src="/taglespa.svg"
              alt="Felipe Sanchez"
              width={40}
              height={40}
              className="rounded-full mr-3 hover:scale-110 transition-transform duration-300"
            />
            <div>
              <h3 className="text-medium text-sm text-gray-900 dark:text-white">Felipe Sanchez</h3>
              <p className="text-xs text-gray-600 dark:text-gray-300 text-ultra-light">{language === 'es' ? 'Gerente General - Fundo Santa Eugenia (Paine) 🇨🇱' : 'General Manager - Fundo Santa Eugenia (Paine) 🇨🇱'}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Tatiana */}
      <div
        className="bg-white dark:bg-gray-800 shadow-md rounded-lg overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2"
        style={{
          animation: 'fadeInUp 0.8s ease-out 0.6s forwards',
          opacity: 0,
          transform: 'translateY(20px)'
        }}
      >
        <div className="relative aspect-[2/4]">
          {playingVideo === 'Tatiana Morera' ? (
            <ReactPlayer
              url="https://youtu.be/nDjZ9ySfCkc"
              width="100%"
              height="100%"
              playing
              controls
            />
          ) : (
            <>
              <Image
                src="/tatiana.jpg"
                alt="Tatiana"
                fill
                style={{ objectFit: 'cover' }}
              />
              <div
                className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-30 cursor-pointer transform transition-transform duration-300 hover:scale-110"
                onClick={() => handlePlayVideo('Tatiana Morera')}
              >
                <PlayCircle className="w-12 h-12 text-white opacity-80" />
              </div>
            </>
          )}
        </div>
        <div className="p-4">
          <h3 className="text-medium text-sm text-gray-900 dark:text-white">Tatiana Morera</h3>
          <p className="text-xs text-gray-600 dark:text-gray-300 text-ultra-light">{language === 'es' ? 'Fundadora de TMV Agroexportación (Costa Rica) 🇨🇷🍍' : 'Founder of TMV Agroexportación (Costa Rica) 🇨🇷🍍'}</p>
        </div>
      </div>

    </div>
  </div>
</section>

        {/* Backed by Section */}


        <section ref={aboutRef}>
          <NewsSection />
        </section>

        <section className="w-full py-12 md:py-24 lg:py-32 bg-gray-50 dark:bg-gray-900">
  <div className="container px-4 md:px-6">
    <h2
      className="text-3xl text-semibold tracking-tighter sm:text-5xl text-center mb-12 text-gray-800 dark:text-white"
      style={{
        animation: 'fadeInUp 0.8s ease-out forwards',
        opacity: 0,
        transform: 'translateY(20px)'
      }}
    >
      {language === 'es' ? 'Preguntas Frecuentes' : 'Frequently Asked Questions'}
    </h2>
    <div className="max-w-3xl mx-auto space-y-4">
      {qaPairs.map((pair, index) => (
        <div
          key={index}
          className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-all duration-300"
          style={{
            animation: `fadeInUp 0.8s ease-out ${0.2 + index * 0.1}s forwards`,
            opacity: 0,
            transform: 'translateY(20px)'
          }}
        >
          <button
            className="flex justify-between items-center w-full p-4 text-left bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            onClick={() => toggleQuestion(index)}
          >
            <span className="text-medium text-gray-800 dark:text-white">{pair.question}</span>
            {openQuestion === index ? (
              <Minus className="h-5 w-5 text-gray-500 dark:text-gray-300 transform transition-transform duration-300" />
            ) : (
              <Plus className="h-5 w-5 text-gray-500 dark:text-gray-300 transform transition-transform duration-300 hover:rotate-90" />
            )}
          </button>
          {openQuestion === index && (
            <div
              className="p-4 bg-white dark:bg-gray-800"
              style={{
                animation: 'fadeInDown 0.3s ease-out forwards',
                opacity: 0
              }}
            >
              <p className="text-gray-600 dark:text-gray-300 text-light">{pair.answer}</p>
            </div>
          )}
        </div>
      ))}
    </div>
  </div>
</section>




        <section ref={contactRef} className="w-full py-12 md:py-24 bg-gray-1 dark:bg-gray-900">
        <MultiWaveAudio />

          <div className="container px-2 md:px-6 ">
            <div className="flex flex-col items-center space-y-4 text-center">
              <div className="space-y-2">
                <h2
                  className="pb-4 text-3xl text-semibold tracking-tighter mb:px-60 sm:text-4xl md:text-5xl lg:text-6xl leading-[1.2] bg-gradient-to-r from-[#38507E] via-[#51A09A] to-[#C2DB64] bg-clip-text text-transparent"
                  style={{
                    animation: 'fadeInUp 0.8s ease-out forwards',
                    opacity: 0,
                    transform: 'translateY(20px)'
                  }}
                >
                  {language === 'es' ? 'Sube a tu gente al tren de la tecnología.' : 'Get Your Team on the Technology Train.'}
                </h2>
                <p
                  className="mx-auto max-w-[600px] text-gray-500 md:text-xl dark:text-gray-400 text-light"
                  style={{
                    animation: 'fadeInUp 0.8s ease-out 0.2s forwards',
                    opacity: 0,
                    transform: 'translateY(20px)'
                  }}
                >
                  {language === 'es' ? 'Únete a una digitalización inclusiva y optimiza los procesos de tu compañía hoy mismo.' : 'Join an inclusive digitalization and optimize your company processes today.'}
                </p>
              </div>
              <div
                className="w-full max-w-sm space-y-2"
                style={{
                  animation: 'fadeInUp 0.8s ease-out 0.4s forwards',
                  opacity: 0,
                  transform: 'translateY(20px)'
                }}
              >
                <form onSubmit={handleSubmit} className="flex space-x-2">
                  <Input
                    className="max-w-lg flex-1 focus:ring-2 focus:ring-[#51A09A] transition-all duration-300"
                    placeholder={language === 'es' ? 'Ingresa tu mail' : 'Enter your email'}
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                  <Button
                    type="submit"
                    className="bg-[#38507E] hover:bg-[#51A09A] transition-colors duration-300 transform hover:scale-105"
                  >
                    {language === 'es' ? 'Comienza ahora' : 'Start Now'}
                  </Button>
                </form>
                <p
                  className="text-xs text-gray-500 dark:text-gray-400"
                  style={{
                    animation: 'fadeInUp 0.8s ease-out 0.6s forwards',
                    opacity: 0
                  }}
                >
                  {language === 'es' ? '1 mes gratis, sin tarjeta de crédito.' : '1 month free, no credit card required.'}
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>
      <footer className="flex flex-col gap-2 sm:flex-row py-6 w-full shrink-0 items-center px-4 md:px-6 border-t">
        <p className="text-xs text-gray-500 dark:text-gray-400">© 2023 Citylink SpA. {language === 'es' ? 'Todos los derechos reservados.' : 'All rights reserved.'}</p>
        <nav className="sm:ml-auto flex gap-4 sm:gap-6">
          <Link className="text-xs hover:underline underline-offset-4" href="#">
            {language === 'es' ? 'Términos de Servicio' : 'Terms of Service'}
          </Link>
          <Link className="text-xs hover:underline underline-offset-4" href="#">
            {language === 'es' ? 'Privacidad' : 'Privacy'}
          </Link>
        </nav>
      </footer>

      {/* WhatsApp floating button */}
      <a
  href="https://wa.me/56966163647"
  target="_blank"
  rel="noopener noreferrer"
  className="fixed bottom-4 right-4 flex items-center bg-green-500 hover:bg-green-600 text-white rounded-full px-4 py-2 shadow-lg transition-all duration-300 ease-in-out z-50 hover:scale-105 transform"
  aria-label="Chat on WhatsApp"
  style={{
    animation: 'fadeInUp 0.5s ease-out 1s forwards',
    opacity: 0,
    transform: 'translateY(20px)'
  }}
>
  <MessageCircle size={20} className="mr-2 animate-pulse" />
  <span className="text-sm text-medium">{language === 'es' ? '¡Habla con nosotros!' : 'Talk to us!'}</span>
</a>


      {/* Update responsive styling to hide the image on smaller screens */}
      <style jsx>{`
        .trees-image {
          width: 600px;
          height: 600px;
        }

        @media (max-width: 1024px) {
          .trees-image {
            display: none !important;
          }
        }

        @keyframes float {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-10px);
          }
        }

        @keyframes pulse {
          0%, 100% {
            transform: scale(1);
          }
          50% {
            transform: scale(1.05);
          }
        }
      `}</style>

      {/* Add a toggle button for dark mode */}
      <button
  className="fixed bottom-20 right-4 bg-gray-200 dark:bg-gray-700 p-3 rounded-full shadow-lg transition-all duration-300 ease-in-out z-50 hover:scale-110 transform"
  onClick={toggleDarkMode}
  aria-label="Toggle dark mode"
  style={{
    animation: 'fadeInUp 0.5s ease-out 1.2s forwards',
    opacity: 0,
    transform: 'translateY(20px)'
  }}
>
  {isDark ? (
    <Sun className="h-6 w-6 text-yellow-500" />
  ) : (
    <Moon className="h-6 w-6 text-gray-700" />
  )}
</button>
    </div>
  )
}


