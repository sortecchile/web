"use client"

import { useState, useEffect, useRef } from 'react'
import { Button } from "@/src/components/ui/button"
import { Input } from "@/src/components/ui/input"
import { CheckCircle, BarChart2, Users, ArrowUp, Send, ChevronLeft, ChevronRight, MoreHorizontal, Edit2, Mic, MessageCircle, Menu, X, Plus, Minus, PlayCircle, Sun, Moon } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
import NewsSection from './NewsSection'
import UseCasesSection from './components/UseCasesSection'

import dynamic from 'next/dynamic'
import { useDarkMode } from './hooks/useDarkMode'

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
  const howtRef = useRef<HTMLDivElement>(null)
  const casesRef = useRef<HTMLElement>(null)
  const [playingVideo, setPlayingVideo] = useState<string | null>(null)
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [scrollY, setScrollY] = useState(0);
  const [loading, setLoading] = useState(true);
  const [animationsReady, setAnimationsReady] = useState(false);

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

  const handleHowClick = () => {
    if (howtRef.current) {
      howtRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }

  const handleCasesClick = () => {
    if (casesRef.current) {
      casesRef.current.scrollIntoView({ behavior: 'smooth' });
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
      question: "¿Cómo funciona el sistema de voz de MIIDO?",
      answer: "MIIDO utiliza tecnología avanzada de reconocimiento de voz para convertir los mensajes de audio de WhatsApp en texto. Luego, nuestro sistema procesa este texto para extraer información relevante y organizarla en tareas, registros y consultas."
    },
    {
      question: "¿Es segura la información que envío a través de WhatsApp?",
      answer: "Sí, la seguridad es nuestra prioridad. Utilizamos encriptación de extremo a extremo y cumplimos con las normativas de protección de datos más estrictas para garantizar que tu información esté siempre protegida."
    },
    {
      question: "¿Puedo integrar MIIDO con otros sistemas que ya uso?",
      answer: "Absolutamente. MIIDO está diseñado para ser flexible y se puede integrar con una variedad de sistemas de gestión empresarial, CRMs y otras herramientas de productividad. Contáctanos para discutir tus necesidades específicas de integración."
    },
    {
      question: "¿Qué tipo de soporte ofrecen?",
      answer: "Ofrecemos soporte completo, incluyendo configuración inicial, capacitación para tu equipo y asistencia técnica continua. Nuestro equipo de soporte está disponible por chat, correo electrónico y llamadas telefónicas para asegurar que obtengas el máximo beneficio de MIIDO."
    },
    {
      question: "¿Es MIIDO una empresa verificada por Meta?",
      answer: "Si, MIIDO pasó por todo el proceso de verificación de Meta."
    },
    {
      question: "¿En qué industrias puedo usar MIIDO?",
      answer: "Estamos enfocados en la industria Agro, pero nuestra tecnología puede ser usada en otras industrias como Logística, construcción, minería, etc."
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

        const startOffset = sectionHeight * 0.4
        const scrolled = viewportHeight - rect.top - startOffset
        const totalScrollDistance = sectionHeight - startOffset

        const progress = Math.max(0, Math.min(1, scrolled / totalScrollDistance))

        setScrollProgress(progress)
      }

      if (newSectionRef.current) {
        const rect = newSectionRef.current.getBoundingClientRect()
        const sectionHeight = rect.height
        const viewportHeight = window.innerHeight

        const startOffset = sectionHeight * 0.4
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
    { task: "Poda", start: "12 ago.", end: "15 ago." },
    { task: "Cosecha", start: "14 ago.", end: "17 ago." },
    { task: "Aplicacion de fertilizante (cop...", start: "18 ago.", end: "21 ago." },
    { task: "Aplicacion de fertilizante", start: "22 ago.", end: "28 ago." },
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
            <button className="text-sm font-medium hover:underline underline-offset-4 text-black dark:text-white" onClick={() => handleNavClick(howtRef)}>
              Cómo funciona?
            </button>
            {/* Temporalmente oculto hasta tener todos los videos */}
            {/* <button className="text-sm font-medium hover:underline underline-offset-4 text-black dark:text-white" onClick={() => handleNavClick(casesRef)}>
              Casos de uso
            </button> */}
            <button className="text-sm font-medium hover:underline underline-offset-4 text-black dark:text-white" onClick={() => handleNavClick(aboutRef)}>
              Últimas publicaciones
            </button>
            <button className="text-sm font-medium hover:underline underline-offset-4 text-black dark:text-white" onClick={() => handleNavClick(contactRef)}>
              Contáctanos
            </button>
          </nav>
          <div className="flex items-center gap-4">
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
                Ingresar
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
            <button className="text-sm font-medium hover:underline underline-offset-4 text-black dark:text-white" onClick={() => { handleHowClick(); closeMobileMenu(); }}>
              Cómo funciona?
            </button>
            {/* Temporalmente oculto hasta tener todos los videos */}
            {/* <button className="text-sm font-medium hover:underline underline-offset-4 text-black dark:text-white" onClick={() => { handleCasesClick(); closeMobileMenu(); }}>
              Casos de uso
            </button> */}
            <button className="text-sm font-medium hover:underline underline-offset-4 text-black dark:text-white" onClick={() => { handleaboutClick(); closeMobileMenu(); }}>
              Últimas publicaciones
            </button>
            <button className="text-sm font-medium hover:underline underline-offset-4 text-black dark:text-white" onClick={() => { handleContactClick(); closeMobileMenu(); }}>
              Contáctanos
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
                Ingresar
              </Button>
            </a>
          </nav>
        </div>
        <div className="bg-black bg-opacity-50 h-full w-full" onClick={closeMobileMenu}></div>
      </div>

      <main className="flex-1 pt-14">


        {/* Main section */}
        <section className="w-full py-24 md:py-24 lg:py-32 xl:py-48 relative overflow-hidden">
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
            {/* Backed by - Ahora como div dentro de la sección principal */}
            <div
              className="flex items-center justify-center gap-6 bg-white dark:bg-[#111827] border border-[#38507E] dark:border-[#1e293b] rounded-full px-6 py-1.5 max-w-sm mx-auto -mt-12 mb-12 shadow-md dark:shadow-[0_0_15px_rgba(0,0,0,0.3)] hover:border-[#C2DB64] transition-all duration-300"
              style={{
                animation: animationsReady ? 'fadeInDown 0.8s ease-out forwards' : 'none',
                opacity: animationsReady ? 0 : 1,
                transform: animationsReady ? 'translateY(-20px)' : 'none'
              }}
            >
              <span className="text-xs font-medium text-gray-800 dark:text-gray-300">Apoyados por</span>
              <div className="flex items-center gap-6">
                <Image
                  src="./platanus-logo.png"
                  alt="Platanus Logo"
                  width={70}
                  height={8}
                  className="object-contain opacity-90 hover:opacity-100 transition-opacity hover:scale-110 transform transition-transform duration-300"
                />
                <Image
                  src="./IICA-logo.png"
                  alt="IICA Logo"
                  width={60}
                  height={8}
                  className="object-contain opacity-90 hover:opacity-100 transition-opacity hover:scale-110 transform transition-transform duration-300"
                />
              </div>
            </div>

            <div className="flex flex-col items-center space-y-6 text-center">
              {/* Title Section */}
              <div className="space-y-2">
                <h1
                  className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none bg-gradient-to-r from-[#38507E] via-[#51A09A] to-[#C2DB64] bg-clip-text text-transparent h-24 flex items-center justify-center"
                  style={{
                    animation: animationsReady ? 'fadeInUp 0.8s ease-out forwards' : 'none',
                    opacity: animationsReady ? 0 : 1,
                    transform: animationsReady ? 'translateY(20px)' : 'none'
                  }}
                >
                  Vertical AI agents en agricultura
                  <span className="animate-blink">|</span>
                </h1>
                <p
                  className="mx-auto max-w-[700px] text-gray-500 md:text-xl dark:text-gray-400"
                  style={{
                    animation: animationsReady ? 'fadeInUp 0.8s ease-out 0.2s forwards' : 'none',
                    opacity: animationsReady ? 0 : 1,
                    transform: animationsReady ? 'translateY(20px)' : 'none'
                  }}
                >
                  Tu copiloto de IA en el campo: automatiza, predice y toma mejores decisiones agrícolas, <strong>sin complicaciones y desde WhatsApp</strong>.
                </p>
              </div>

              {/* Updated CTA button with hover animation */}
              <div className="w-full max-w-sm space-y-2">
                <div
                  className="flex space-x-2"
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
                    className="max-w-lg flex-1 inline-flex items-center justify-center px-4 py-2 text-white bg-[#1A202C] rounded-md hover:bg-[#2D3748] focus:outline-none transform transition-all duration-300 hover:scale-105 hover:shadow-lg relative overflow-hidden group"
                  >
                    <span className="relative z-10">Empieza gratis!</span>
                    <span className="absolute inset-0 bg-[#2D3748] transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></span>
                  </a>
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  No se necesita tarjeta de crédito.
                </p>
              </div>

              {/* Embedded Video Section without parallax */}
              <div
                className="w-full max-w-[700px] mt-8"
                style={{
                  animation: animationsReady ? 'fadeInUp 0.8s ease-out 0.6s forwards' : 'none',
                  opacity: animationsReady ? 0 : 1,
                  transform: animationsReady ? 'translateY(20px)' : 'none'
                }}
              >
                <div
                  style={{
                    position: 'relative',
                    paddingBottom: '56.25%',
                    height: 0,
                    borderRadius: '12px',
                    overflow: 'hidden',
                    boxShadow: '0 10px 30px rgba(0, 0, 0, 0.1)',
                    transition: 'transform 0.3s ease-out, box-shadow 0.3s ease-out',
                  }}
                  className="hover:shadow-2xl hover:scale-[1.02] transform transition-all duration-300"
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
                    src="https://www.tella.tv/video/cmafppfb0000u0dl2hlbv44t2/embed?b=1&title=1&a=1&loop=0&t=0&muted=0&wt=1"
                    allowFullScreen
                    allowTransparency={true}
                  ></iframe>
                </div>
                <p
                  className="mt-4 text-sm text-gray-500 dark:text-gray-400"
                  style={{
                    animation: animationsReady ? 'fadeInUp 0.8s ease-out 0.8s forwards' : 'none',
                    opacity: animationsReady ? 0 : 1,
                    transform: animationsReady ? 'translateY(20px)' : 'none'
                  }}
                >
                  Descubre cómo MIIDO transforma tu flujo de trabajo.
                </p>

                {/* Botón para ver casos de éxito - Temporalmente comentado */}
                {/* <div className="mt-6 flex justify-center">
                  <Button
                    onClick={handleCasesClick}
                    className="bg-white dark:bg-[#111827] border border-[#38507E] hover:border-[#51A09A] text-gray-800 dark:text-white rounded-full shadow-md hover:shadow-lg px-6 py-2 text-sm"
                  >
                    Ver casos de éxito
                  </Button>
                </div> */}
              </div>
            </div>
          </div>
          <MultiWaveAudio />
        </section>



        <section className="w-full py-2 bg-gray-1 md:-mt-24 sm:-mt-32 overflow-x-auto">
          <div className="container px-4 md:px-6">
            <div className="flex flex-nowrap md:justify-center sm:justify-center  items-center gap-20">
              {/* Viña Errazuriz */}
      <>
        <div
          className="dark:hidden transform transition-transform duration-300 hover:scale-110"
          style={{ animation: 'fadeInUp 0.8s ease-out 0.1s forwards', opacity: 0 }}
        >
          <Image src="./errazuriz-logo.png" alt="Viña Errazuriz" width={120} height={40} />
        </div>
        <div
          className="hidden dark:block transform transition-transform duration-300 hover:scale-110"
          style={{ animation: 'fadeInUp 0.8s ease-out 0.1s forwards', opacity: 0 }}
        >
          <Image src="./errazuriz-logo-white.png" alt="Viña Errazuriz white" width={120} height={40} />
        </div>
      </>

      {/* La Ciudad Posible */}
      <>
        <div
          className="dark:hidden transform transition-transform duration-300 hover:scale-110"
          style={{ animation: 'fadeInUp 0.8s ease-out 0.2s forwards', opacity: 0 }}
        >
          <Image src="./LCP.png" alt="La ciudad posible" width={140} height={40} />
        </div>
        <div
          className="hidden dark:block transform transition-transform duration-300 hover:scale-110"
          style={{ animation: 'fadeInUp 0.8s ease-out 0.2s forwards', opacity: 0 }}
        >
          <Image src="./LCP-white.png" alt="La ciudad posible white" width={140} height={40} />
        </div>
      </>

      {/* Concha y Toro */}
      <>
        <div className="dark:hidden">
          <Image src="./cyt.png" alt="Concha y Toro" width={140} height={40} />
        </div>
        <div className="hidden dark:block">
          <Image src="./cyt-white.png" alt="Concha y Toro white" width={140} height={40} />
        </div>
      </>

      {/* Fundo Santa Eugenia */}
      <>
        <div className="dark:hidden">
          <Image src="./driscolls.png" alt="Fundo Santa Eugenia" width={120} height={40} />
        </div>
        <div className="hidden dark:block">
          <Image src="./driscolls-white.png" alt="Fundo Santa Eugenia white" width={120} height={40} />
        </div>
      </>

      {/* TMV Agroexportación */}
      <>
        <div className="dark:hidden">
          <Image src="./westfalia.png" alt="TMV Agroexportació" width={110} height={40} />
        </div>
        <div className="hidden dark:block">
          <Image src="./westfalia-white.png" alt="TMV Agroexportació white" width={110} height={40} />
        </div>
      </>

      {/* Startup Chile */}
      <>
        <div className="dark:hidden">
          <Image src="./TMV.png" alt="Startup Chile" width={140} height={40} />
        </div>
        <div className="hidden dark:block">
          <Image src="./TMV-white.png" alt="Startup Chile white" width={140} height={40} />
        </div>
      </>

      {/* Start Fellowship */}
      <>
        <div className="dark:hidden">
          <Image src="./start-fellowship.png" alt="Start Fellowship" width={120} height={40} />
        </div>
        <div className="hidden dark:block">
          <Image src="./start-fellowship-white.png" alt="Start Fellowship white" width={120} height={40} />
        </div>
      </>
            </div>
          </div>
        </section>
        <section ref={howtRef} className="w-full py-12 md:py-24 lg:py-32 bg-gray-100 dark:bg-gray-800">
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
        </section>
        <section className="w-full py-12 md:py-24 lg:py-32 overflow-hidden" ref={demoRef}>
  <div className="container px-4 md:px-6">
    <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl text-center mb-6 text-gray-900 dark:text-white">
      Véalo en acción
    </h2>
    <p className="mb-6 text-gray-600 dark:text-gray-400 text-center">
      Todos los audios que se envíen en el día a día de la operación, lo ordenamos y mostramos automáticamente en el Dashboard.
    </p>
    <div className="flex flex-col lg:flex-row items-start justify-center gap-8">
      {/* Simulación WhatsApp */}
      <div className="w-full max-w-sm">
        <div className="border-2 border-gray-200 dark:border-gray-700 rounded-[3rem] p-2 bg-white dark:bg-gray-900 shadow-xl">
          <div className="bg-gray-100 dark:bg-gray-800 rounded-[2.5rem] p-2">
            <div className="bg-white dark:bg-gray-900 rounded-[2rem] h-[500px] overflow-y-auto flex flex-col">
              {/* Header */}
              <div className="bg-gray-100 dark:bg-gray-800 p-4 flex items-center gap-2">
                <div className="w-10 h-10 rounded-full overflow-hidden">
                  <Image
                    src="./logo2.png"
                    alt="Company Logo"
                    width={5}
                    height={10}
                    className="w-full h-full"
                  />
                </div>
                <div className="flex items-center">
                  <p className="font-semibold text-gray-900 dark:text-white">MIIDO</p>
                  <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" className="w-5 h-5 text-blue-500 ml-1">
                    <path fillRule="evenodd" d="M8.6 3.8A4.5 4.5 0 0112 2.3a4.5 4.5 0 013.4 1.5 4.5 4.5 0 013.5 1.3 4.5 4.5 0 011.3 3.5A4.5 4.5 0 0121.8 12a4.5 4.5 0 01-1.5 3.4 4.5 4.5 0 01-1.3 3.5 4.5 4.5 0 01-3.5 1.3A4.5 4.5 0 0112 21.8a4.5 4.5 0 01-3.4-1.5 4.5 4.5 0 01-3.5-1.3 4.5 4.5 0 01-1.3-3.5A4.5 4.5 0 012.3 12c0-1.4.6-2.6 1.5-3.4a4.5 4.5 0 011.3-3.5 4.5 4.5 0 013.5-1.3zM15.6 10.2a.75.75 0 10-1.2-.9l-3.2 4.5-1.6-1.6a.75.75 0 10-1.1 1.1l2.3 2.3a.75.75 0 001.1-.1l3.8-5.3z" clipRule="evenodd" />
                  </svg>
                </div>
                <p className="text-xs text-gray-500 ml-auto">Online</p>
              </div>
              {/* Mensajes */}
              <div className="flex-1 p-4 space-y-4">
                {["Registro: cosechamos 500 kg en el cuartel 6 de cerezas",
                  "Tareas: Terminada la tarea de poda",
                  "Pregunta: Cuándo empezamos la cosecha la temporada anterior?",
                  "Recordatorio: Hacer cambio de aceite Tractor",
                  "Completado: Cosecha terminada"].map((message, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-2"
                    style={{
                      opacity: scrollProgress > index / 5 ? 1 : 0,
                      transform: `translateY(${scrollProgress > index / 5 ? 0 : 20}px)`,
                      transition: 'opacity 0.3s ease-out, transform 0.3s ease-out'
                    }}
                  >
                    <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                      <Mic className="h-4 w-4 text-white" />
                    </div>
                    <div className="bg-green-100 dark:bg-green-900 rounded-lg p-2 max-w-[80%] text-sm text-gray-900 dark:text-white">
                      {message}
                    </div>
                  </div>
                ))}
              </div>
              {/* Input */}
              <div className="bg-gray-100 dark:bg-gray-800 p-4 flex items-center gap-2">
                <Input className="flex-1 dark:bg-gray-700 dark:text-white" placeholder="Escribe un mensaje" />
                <Button size="icon">
                  <Send className="h-4 w-4" />
                  <span className="sr-only">Enviar mensaje</span>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
              {/* Dashboards / Indicadores */}
              <div className="w-full max-w-3xl space-y-8">
                 {/* Diagrama */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-white dark:bg-gray-800 p-3 rounded-lg shadow-lg h-[180px]">
                    <div className="flex justify-between items-center mb-2">
                      {editingTitle === 'diagram' ? (
                        <input
                          type="text"
                          value={titles.diagram}
                          onChange={handleTitleChange}
                          onBlur={handleTitleBlur}
                          className="text-base font-semibold bg-transparent border-b border-gray-300 focus:outline-none focus:border-blue-500"
                          autoFocus
                        />
                      ) : (
                        <h3 className="text-base font-semibold flex items-center gap-2 dark:text-white" onClick={() => handleTitleClick('diagram')} >
                          {titles.diagram}
                          <Edit2 className="w-4 h-4 text-gray-400" />
                        </h3>
                      )}
                      <MoreHorizontal className="text-gray-400 h-4 w-4" />
                    </div>
                    <svg width="100%" height="130" viewBox="0 0 200 130">
                      <rect x="30" y={130 - 40 * scrollProgress} width="40" height={40 * scrollProgress} fill="#ff4d4f" />
                      <rect x="100" y={130 - 80 * scrollProgress} width="40" height={80 * scrollProgress} fill="#52c41a" />
                      <text x="50" y="125" textAnchor="middle" fill="black" fontSize="12">{Math.round(scrollProgress * 1)}</text>
                      <text x="120" y="125" textAnchor="middle" fill="black" fontSize="12">{Math.round(scrollProgress * 3)}</text>
                      <text x="50" y="140" textAnchor="middle" fill="black" fontSize="10">Detenido</text>
                      <text x="120" y="140" textAnchor="middle" fill="black" fontSize="10">Listo</text>
                      <line x1="0" y1="130" x2="200" y2="130" stroke="#e5e7eb" strokeWidth="1" />
                      <line x1="0" y1="0" x2="0" y2="130" stroke="#e5e7eb" strokeWidth="1" />
                      {[0, 2, 4].map((value, index) => (
                        <text key={index} x="-5" y={130 - value * 32.5} textAnchor="end" fill="black" fontSize="10">{value}</text>
                      ))}
                    </svg>
                  </div>
                  <div className=" bg-white dark:bg-gray-800 p-3 rounded-lg shadow-lg h-[180px]">
                    <div className="flex justify-between items-center">
                      {editingTitle === 'totalCost' ? (
                        <input
                          type="text"
                          value={titles.totalCost}
                          onChange={handleTitleChange}
                          onBlur={handleTitleBlur}
                          className="text-base font-semibold bg-transparent border-b border-gray-300 focus:outline-none focus:border-blue-500"
                          autoFocus
                        />
                      ) : (
                        <h3 className="text-base font-semibold flex items-center gap-2 dark:text-white" onClick={() => handleTitleClick('totalCost')} >
                          {titles.totalCost}
                          <Edit2 className="w-4 h-4 text-gray-400" />
                        </h3>
                      )}
                      <MoreHorizontal className="text-gray-400 h-4 w-4" />
                    </div>
                    <div className="flex items-center justify-center flex-1">
                      <span className="text-4xl font-bold text-gray-900 dark:text-white justify-center">${Math.round(scrollProgress * 2100)}</span>
                    </div>
                  </div>
                  <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-lg md:col-span-2">
                    <div className="flex justify-between items-center mb-4">
                      {editingTitle === 'harvest' ? (
                        <input
                          type="text"
                          value={titles.harvest}
                          onChange={handleTitleChange}
                          onBlur={handleTitleBlur}
                          className="text-lg font-semibold bg-transparent border-b border-gray-300 focus:outline-none focus:border-blue-500"
                          autoFocus
                        />
                      ) : (
                        <h3 className="text-lg font-semibold flex items-center gap-2 dar:text-white" onClick={() => handleTitleClick('harvest')}>
                          {titles.harvest}
                          <Edit2 className="w-4 h-4 text-gray-400" />
                        </h3>
                      )}
                      <MoreHorizontal className="text-gray-400" />
                    </div>
                    <div className="relative h-8 bg-gray-200 rounded-full overflow-hidden mb-2">
                      <div
                        className="absolute top-0 left-0 h-full bg-green-500"
                        style={{ width: `${42.9 * scrollProgress}%` }}
                      ></div>
                      <div
                        className="absolute top-0 left-0 h-full bg-red-500"
                        style={{ width: `${5 * scrollProgress}%`, left: `${42.9 * scrollProgress}%` }}
                      ></div>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="flex items-center"><span className="w-3 h-3 bg-green-500 rounded-full mr-1"></span> Listo</span>
                      <span className="flex items-center"><span className="w-3 h-3 bg-red-500 rounded-full mr-1"></span> Detenido</span>
                      <span className="flex items-center"><span className="w-3 h-3 bg-gray-500 rounded-full mr-1"></span> No iniciado</span>
                    </div>
                    <div className="mt-2 text-right text-lg font-semibold dark:text-white">{(42.9 * scrollProgress).toFixed(1)}% Listo</div>
                  </div>
                  <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-lg md:col-span-2 overflow-x-auto">
                    <div className="flex justify-between items-center mb-4 min-w-[600px]">
                      {editingTitle === 'gantt' ? (
                        <input
                          type="text"
                          value={titles.gantt}
                          onChange={handleTitleChange}
                          onBlur={handleTitleBlur}
                          className="text-lg font-semibold bg-transparent border-b border-gray-300 focus:outline-none focus:border-blue-500"
                          autoFocus
                        />
                      ) : (
                        <h3 className="text-lg font-semibold flex items-center gap-2 dark:text-white" onClick={() => handleTitleClick('gantt')} >
                          {titles.gantt}
                          <Edit2 className="w-4 h-4 text-gray-400" />
                        </h3>
                      )}
                      <div className="flex items-center space-x-2">
                        <Button variant="outline" size="sm">Referencia</Button>
                        <Button variant="outline" size="sm">Ajuste automático</Button>
                        <select className="bg-white text-black rounded px-2 py-1 text-sm border border-gray-300">
                          <option>Semanas</option>
                        </select>
                        <Button variant="outline" size="icon" className="w-8 h-8 p-0">
                          <ChevronLeft className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="icon" className="w-8 h-8 p-0">
                          <ChevronRight className="h-4 w-4" />
                        </Button>
                        <MoreHorizontal className="text-gray-400" />
                      </div>
                    </div>
                    <svg width={ganttChartWidth} height={ganttChartHeight} viewBox={`0 0 ${ganttChartWidth} ${ganttChartHeight}`}>
                      {weeks.map((week, index) => (
                        <g key={week.name} transform={`translate(${index * weekWidth}, 0)`}>
                          <rect x="0" y="0" width={weekWidth} height="30" fill="#f3f4f6" />
                          <text x={weekWidth / 2} y="20" textAnchor="middle" fill="black" fontSize="12">
                            {week.name}
                          </text>
                        </g>
                      ))}
                      {ganttData.map((task, index) => (
                        <g key={task.task} transform={`translate(0, ${40 + index * taskHeight})`}>
                          <text x="-5" y={taskHeight / 2} textAnchor="end" fill="black" fontSize="12" dominantBaseline="middle">
                            {task.task}
                          </text>
                          <rect
                            x={getTaskPosition(task.start)}
                            y="0"
                            width={getTaskWidth(task.start, task.end) * scrollProgress}
                            height={taskHeight - 10}
                            fill="#3b82f6"
                            rx="5"
                            ry="5"
                          />
                        </g>
                      ))}
                    </svg>
                  </div>
                </div>
              </div>
            </div>
          </div>

        </section>
        <MultiWaveAudio />

        <section className="w-full py-12 md:py-24 lg:py-32">

          <div className="container px-4 md:px-6">
          <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl text-center mb-6 text-gray-900 dark:text-white">Principales beneficios</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="flex items-start space-x-4">
                <Users className="h-6 w-6 text-primary mt-1" style={{color: '#38507E'}} />
                <div>
                  <h3 className="text-xl font-bold mb-2 text-gray-900 dark:text-white" >Amigable con el usuario</h3>
                  <p className="text-gray-500 dark:text-gray-400">Aprovecha la familiaridad de WhatsApp para una adopción fácil en todo tu equipo.</p>
                </div>
              </div>
              <div className="flex items-start space-x-4">
                <BarChart2 className="h-6 w-6 text-primary mt-1" style={{ color: '#51A09A'}} />
                <div>
                  <h3 className="text-xl font-bold mb-2 text-gray-900 dark:text-white" >Información accionable</h3>
                  <p className="text-gray-500 dark:text-gray-400">Convierte los mensajes de voz en datos estructurados para una mejor toma de decisiones.</p>
                </div>
              </div>
              <div className="flex items-start space-x-4">
                <Mic className="h-6 w-6 text-primary mt-1" style={{ color:'#51A09A'}}/>
                <div>
                  <h3 className="text-xl font-bold mb-2 text-gray-900 dark:text-white" >Enfoque centrado en la voz</h3>
                  <p className="text-gray-500 dark:text-gray-400">Ideal para industrias donde escribir no siempre es conveniente o posible.</p>
                </div>
              </div>
              <div className="flex items-start space-x-4">
                <CheckCircle className="h-6 w-6 text-primary mt-1" style={{ color: '#C2DB64'}}/>
                <div>
                  <h3 className="text-xl font-bold mb-2 text-gray-900 dark:text-white">Flujos de trabajo optimizados</h3>
                  <p className="text-gray-500 dark:text-gray-400">Simplifica la creación de tareas, el seguimiento y la recopilación de información en un solo lugar.</p>
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

        <MultiWaveAudio />
{/* Haz preguntas sobre la data Seccion  */}

<section ref={newSectionRef} className="w-full py-12 md:py-24 lg:py-32 overflow-hidden">
  <div className="container px-4 md:px-6">
  <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl text-center mb-6 text-gray-900 dark:text-white">
      Haz preguntas sobre la data levantada
    </h2>
    <p className="mb-6 text-gray-500 dark:text-gray-400 text-center">Puedes hacer preguntas en el mismo chat, sobre toda la información que las personas están levantando. ¡Mira este ejemplo!</p>
    <div className="flex flex-col lg:flex-row items-start justify-center gap-8 ">
      <div className="w-full max-w-sm ">
        <div className="border-2 border-gray-200 rounded-[3rem] p-2 bg-white shadow-xl dark:bg-gray-800">
          <div className="bg-gray-100 rounded-[2.5rem] p-2 dark:bg-gray-800">
            <div className="bg-white dark:bg-gray-900 rounded-[2rem] h-[500px] overflow-y-auto flex flex-col">
              <div className="bg-gray-100 p-4 flex items-center gap-2 dark:bg-gray-800 ">
                <div className="w-10 h-10 rounded-full overflow-hidden">
                  <Image
                    src="./logo2.svg"
                    alt="Company Logo"
                    width={5}
                    height={10}
                    className="w-full h-full"
                  />
                </div>
                <div className="flex items-center">
                  <p className="font-semibold dark:text-white">MIIDO</p>
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 text-blue-500 ml-1">
                    <path fillRule="evenodd" d="M8.603 3.799A4.49 4.49 0 0112 2.25c1.357 0 2.573.6 3.397 1.549a4.49 4.49 0 013.498 1.307 4.491 4.491 0 011.307 3.497A4.49 4.49 0 0121.75 12a4.49 4.49 0 01-1.549 3.397 4.491 4.491 0 01-1.307 3.497 4.491 4.491 0 01-3.497 1.307A4.49 4.49 0 0112 21.75a4.49 4.49 0 01-3.397-1.549 4.49 4.49 0 01-3.498-1.306 4.491 4.491 0 01-1.307-3.498A4.49 4.49 0 012.25 12c0-1.357.6-2.573 1.549-3.397a4.49 4.49 0 011.307-3.497 4.49 4.49 0 013.497-1.307zm7.007 6.387a.75.75 0 10-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 00-1.06 1.06l2.25 2.25a.75.75 0 001.14-.094l3.75-5.25z" clipRule="evenodd" />
                  </svg>
                </div>
                <div><p className="text-xs text-gray-500 ml-auto dark:text-gray-400">Online</p></div>
              </div>
              <div className="flex-1 p-4 space-y-4 ">
                {["Pregunta: ¿Cuándo empezamos la cosecha la temporada anterior?",
                  "Respuesta: La cosecha empezó el 15 de diciembre del año pasado.",
                  "Pregunta: ¿Cómo va avanzando la cosecha?",
                  "Respuesta: La cosecha va en un 30% del total.",
                  "Pregunta: ¿Cuál fue el rendimiento del último trimestre?"].map((message, index) => (
                  <div
                    key={index}
                    className={`flex items-center gap-2 ${index % 2 === 0 ? 'justify-end' : 'justify-start'}`}
                    style={{
                      opacity: scrollProgressNewSection > index / 5 ? 1 : 0,
                      transform: `translateY(${scrollProgressNewSection > index / 5 ? 0 : 20}px)`,
                      transition: 'opacity 0.3s ease-out, transform 0.3s ease-out'
                    }}
                  >
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${index % 2 === 0 ? 'bg-blue-500 ' : 'bg-green-500 ' }`}>
                      <Mic className="h-4 w-4 text-primary " />
                    </div>
                    <div className={`rounded-lg p-2 max-w-[80%] ${index % 2 === 0 ? 'bg-blue-100 dark:bg-blue-800' : 'bg-green-100 dark:bg-green-800'}`}>
                      <p className="text-sm">{message}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="bg-gray-100 p-4 flex items-center gap-2 dark:bg-gray-800">
                <Input className="flex-1" placeholder="Type a message" />
                <Button size="icon">
                  <Send className="h-4 w-4" />
                  <span className="sr-only">Enviar mensaje</span>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</section>




{/* Nuestros clientes nos aman  **/}
        {/* Nuestros clientes nos aman */}
        <section className="w-full py-12 md:py-24 lg:py-32 bg-gray-50 dark:bg-gray-900">
  <div className="container px-4 md:px-6">
    <h2
      className="text-3xl font-bold tracking-tighter sm:text-5xl text-center mb-12 text-gray-900 dark:text-white"
      style={{
        animation: 'fadeInUp 0.8s ease-out forwards',
        opacity: 0,
        transform: 'translateY(20px)'
      }}
    >
      Nuestros clientes nos aman
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
          <h3 className="font-semibold text-base text-gray-900 dark:text-white">Guillermo Baeza</h3>
          <p className="text-sm text-gray-600 dark:text-gray-300">Jefe de campo en Agrícola Manantiales (Curicó) 🇨🇱</p>
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
            className="text-sm italic mb-4 mt-40 text-gray-800 dark:text-gray-200"
            style={{
              animation: 'fadeInUp 0.8s ease-out 0.6s forwards',
              opacity: 0
            }}
          >
            &quot;MIIDO se ha convertido en nuestra herramienta más valiosa para dar inteligencia a los datos que se levantan en el día a día de la operación.&quot;
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
              <h3 className="font-semibold text-sm text-gray-900 dark:text-white">Felipe Sanchez</h3>
              <p className="text-xs text-gray-600 dark:text-gray-300">Gerente General - Fundo Santa Eugenia (Paine) 🇨🇱</p>
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
          <h3 className="font-semibold text-sm text-gray-900 dark:text-white">Tatiana Morera</h3>
          <p className="text-xs text-gray-600 dark:text-gray-300">Fundadora de TMV Agroexportación (Costa Rica) 🇨🇷🍍</p>
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
      className="text-3xl font-bold tracking-tighter sm:text-5xl text-center mb-12 text-gray-800 dark:text-white"
      style={{
        animation: 'fadeInUp 0.8s ease-out forwards',
        opacity: 0,
        transform: 'translateY(20px)'
      }}
    >
      Preguntas Frecuentes
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
            <span className="font-medium text-gray-800 dark:text-white">{pair.question}</span>
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
              <p className="text-gray-600 dark:text-gray-300">{pair.answer}</p>
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
                  className="pb-4 text-3xl font-bold tracking-tighter mb:px-60 sm:text-4xl md:text-5xl lg:text-6xl leading-[1.2] bg-gradient-to-r from-[#38507E] via-[#51A09A] to-[#C2DB64] bg-clip-text text-transparent"
                  style={{
                    animation: 'fadeInUp 0.8s ease-out forwards',
                    opacity: 0,
                    transform: 'translateY(20px)'
                  }}
                >
                  Sube a tu gente al tren de la tecnología.
                </h2>
                <p
                  className="mx-auto max-w-[600px] text-gray-500 md:text-xl dark:text-gray-400"
                  style={{
                    animation: 'fadeInUp 0.8s ease-out 0.2s forwards',
                    opacity: 0,
                    transform: 'translateY(20px)'
                  }}
                >
                  Únete a una digitalización inclusiva y optimiza los procesos de tu compañía hoy mismo.
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
                    placeholder="Ingresa tu mail"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                  <Button
                    type="submit"
                    className="bg-[#38507E] hover:bg-[#51A09A] transition-colors duration-300 transform hover:scale-105"
                  >
                    Comienza ahora
                  </Button>
                </form>
                <p
                  className="text-xs text-gray-500 dark:text-gray-400"
                  style={{
                    animation: 'fadeInUp 0.8s ease-out 0.6s forwards',
                    opacity: 0
                  }}
                >
                  1 mes gratis, sin tarjeta de crédito.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>
      <footer className="flex flex-col gap-2 sm:flex-row py-6 w-full shrink-0 items-center px-4 md:px-6 border-t">
        <p className="text-xs text-gray-500 dark:text-gray-400">© 2023 Citylink SpA. All rights reserved.</p>
        <nav className="sm:ml-auto flex gap-4 sm:gap-6">
          <Link className="text-xs hover:underline underline-offset-4" href="#">
            Terms of Service
          </Link>
          <Link className="text-xs hover:underline underline-offset-4" href="#">
            Privacy
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
  <span className="text-sm font-medium">¡Habla con nosotros!</span>
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

      {/* Update image container styles */}
      <div
        className="absolute -top-[30%] -right-[0%] hidden md:block overflow-hidden pointer-events-none"
        style={{
          animation: 'float 6s ease-in-out infinite'
        }}
      >
        <Image
          src="/trees-aerial.png"
          alt="Trees"
          width={300}
          height={300}
          className="object-cover"
        />
      </div>

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


