"use client"

import { useState, useEffect, useRef } from 'react'
import { Button } from "@/src/components/ui/button"
import { Input } from "@/src/components/ui/input"
import { CheckCircle, BarChart2, Users, ArrowUp, Send, ChevronLeft, ChevronRight, MoreHorizontal, Edit2, Mic, MessageCircle, Menu, X, Plus, Minus } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
import NewsSection from './NewsSection'

export default function Component() {
  const [email, setEmail] = useState('')
  const [scrollProgress, setScrollProgress] = useState(0)
  const [weekOffset, setWeekOffset] = useState(0)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [openQuestion, setOpenQuestion] = useState<number | null>(null)
  const demoRef = useRef<HTMLElement>(null)
  const contactRef = useRef<HTMLDivElement>(null)
  const aboutRef = useRef<HTMLDivElement>(null)
  const howtRef = useRef<HTMLDivElement>(null)

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log('Submitted email:', email)
    setEmail('')
  }

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

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      <header className="fixed top-0 left-0 right-0 z-50 px-4 lg:px-6 h-14 flex items-center justify-between border-b bg-white">
        <div className="flex items-center justify-between w-full">
          <Link className="flex items-center justify-center" href="#">
            <Image
              src="/logo.svg"
              alt="Company Logo"
              width={150}
              height={150}
            />
            <span className="sr-only">MIIDO</span>
          </Link>
          <nav className="hidden md:flex gap-4 sm:gap-6">
            <button className="text-sm font-medium hover:underline underline-offset-4 text-black" onClick={() => handleNavClick(howtRef)}>
              Cómo funciona?
            </button>
            <button className="text-sm font-medium hover:underline underline-offset-4 text-black" onClick={() => handleNavClick(aboutRef)}>
              Últimas publicaciones
            </button>
            <button className="text-sm font-medium hover:underline underline-offset-4 text-black" onClick={() => handleNavClick(contactRef)}>
              Contáctanos
            </button>
          </nav>
          <button 
            className="md:hidden"
            onClick={toggleMobileMenu}
            aria-label={mobileMenuOpen ? "Cerrar menú" : "Abrir menú"}
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </header>
      <div className={`fixed inset-0 z-40 transform ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'} transition-transform duration-300 ease-in-out md:hidden`}>
        <div className="bg-white h-full w-64 shadow-lg pt-20 px-4">
          <nav className="flex flex-col gap-4">
            <button className="text-sm font-medium hover:underline underline-offset-4 text-black" onClick={() => { handleHowClick(); closeMobileMenu(); }}>
              Cómo funciona?
            </button>
            <button className="text-sm font-medium hover:underline underline-offset-4 text-black" onClick={() => { handleaboutClick(); closeMobileMenu(); }}>
              Últimas publicaciones
            </button>
            <button className="text-sm font-medium hover:underline underline-offset-4 text-black" onClick={() => { handleContactClick(); closeMobileMenu(); }}>
              Contáctanos
            </button>
          </nav>
        </div>
        <div className="bg-black bg-opacity-50 h-full w-full" onClick={closeMobileMenu}></div>
      </div>

      <main className="flex-1 pt-14">
        <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center space-y-4 text-center">
              <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none" style={{ color: '#2F3D44' }}>
                  Controla tus procesos con la voz
                </h1>
                <p className="mx-auto max-w-[700px] text-gray-500 md:text-xl dark:text-gray-400">
                Optimiza tu flujo de trabajo con la herramienta que ya conoces. Crea tareas, registra y accede a información detallada, todo mediante mensajes de voz en WhatsApp.
                </p>
              </div>
              <div className='w-full max-w-sm space-y-2 flex items-center justify-center'>
                <Image
                  src="/whatsapp.svg"
                  alt="Company Logo"
                  width={150}
                  height={150}
                />
                <span className="sr-only">MIIDO</span>
              </div>
              <div className="w-full max-w-sm space-y-2">
                <form onSubmit={handleSubmit} className="flex space-x-2">
                  <Input
                    className="max-w-lg flex-1"
                    placeholder="Ingresa tu email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                  <Button type="submit">Comienza ahora</Button>
                </form>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Empieza tu prueba gratuita. No se requiere tarjeta de crédito.
                </p>
              </div>
            </div>
          </div>
        </section>
        <section className="w-full py-8 bg-gray-1"> 
          <div className="container px-4 md:px-6">
            <div className="flex flex-wrap justify-center items-center gap-20">
              <Image src="/errazuriz-logo.png" alt="Figma" width={120} height={40} />
              <Image src="/LCP.png" alt="Substack" width={140} height={40} />
              <Image src="/cyt.png" alt="Discord" width={140} height={40} />
              <Image src="/taglespa.svg" alt="Airbnb" width={100} height={40} />
              <Image src="/startup-chile.png" alt="Spotify" width={120} height={40} />
              <Image src="/start-fellowship.png" alt="Toyota" width={120} height={40} />
            </div>
          </div>
        </section>
        <section ref={howtRef} className="w-full py-12 md:py-24 lg:py-32 bg-gray-100 dark:bg-gray-800">
          <div className="container px-4 md:px-6">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl text-center mb-12" style={{ color: '#2F3D44' }}>¿Cómo funciona?</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="flex flex-col items-center text-center">
                <div className="mb-4">
                  <Mic className="h-12 w-12 text-primary" />
                </div>
                <h3 className="text-xl font-bold mb-2" style={{ color: '#2F3D44' }}>Envia un audio en Whatsapp</h3>
                <p className="text-gray-500 dark:text-gray-400">Usa WhatsApp para enviar mensajes de voz para tareas, información o consultas.</p>
              </div>
              <div className="flex flex-col items-center text-center">
                <div className="mb-4">
                  <CheckCircle className="h-12 w-12 text-primary" />
                </div>
                <h3 className="text-xl font-bold mb-2" style={{ color: '#2F3D44' }}>Procesamiento automatizado</h3>
                <p className="text-gray-500 dark:text-gray-400">Nuestro sistema procesa los mensajes de voz y organiza la información.</p>
              </div>
              <div className="flex flex-col items-center text-center">
                <div className="mb-4">
                  <BarChart2 className="h-12 w-12 text-primary" />
                </div>
                <h3 className="text-xl font-bold mb-2" style={{ color: '#2F3D44' }}>Obtén información detallada</h3>
                <p className="text-gray-500 dark:text-gray-400">Accede a datos organizados y obtén información detallada a través de nuestro intuitivo dashboard.</p>
              </div>
            </div>
          </div>
        </section>
        <section className="w-full py-12 md:py-24 lg:py-32 overflow-hidden" ref={demoRef}>
          <div className="container px-4 md:px-6">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl text-center mb-6" style={{ color: '#2F3D44' }}>Véalo en acción</h2>
            <p className="mb-6 text-gray-500 dark:text-gray-400 text-center">Todos los audios que se envíen en el día a día de la operación, lo ordenamos y mostramos automáticamente en el Dashboard.</p>
            <div className="flex flex-col lg:flex-row items-start justify-center gap-8">
              <div className="w-full max-w-sm">
                <div className="border-2 border-gray-200 rounded-[3rem] p-2 bg-white shadow-xl">
                  <div className="bg-gray-100 rounded-[2.5rem] p-2">
                    <div className="bg-white rounded-[2rem] h-[500px] overflow-y-auto flex flex-col">
                      <div className="bg-gray-100 p-4 flex items-center gap-2">
                        <div className="w-10 h-10 rounded-full overflow-hidden">
                          <Image
                            src="/logo2.svg"
                            alt="Company Logo"
                            width={5}
                            height={10}
                            className="w-full h-full"
                          />
                        </div>
                        <div className="flex items-center">
                          <p className="font-semibold">MIIDO</p>
                          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 text-blue-500 ml-1">
                            <path fillRule="evenodd" d="M8.603 3.799A4.49 4.49 0 0112 2.25c1.357 0 2.573.6 3.397 1.549a4.49 4.49 0 013.498 1.307 4.491 4.491 0 011.307 3.497A4.49 4.49 0 0121.75 12a4.49 4.49 0 01-1.549 3.397 4.491 4.491 0 01-1.307 3.497 4.491 4.491 0 01-3.497 1.307A4.49 4.49 0 0112 21.75a4.49 4.49 0 01-3.397-1.549 4.49 4.49 0 01-3.498-1.306 4.491 4.491 0 01-1.307-3.498A4.49 4.49 0 012.25 12c0-1.357.6-2.573 1.549-3.397a4.49 4.49 0 011.307-3.497 4.49 4.49 0 013.497-1.307zm7.007 6.387a.75.75 0 10-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 00-1.06 1.06l2.25 2.25a.75.75 0 001.14-.094l3.75-5.25z" clipRule="evenodd" />
                          </svg>
                        </div>
                        <div><p className="text-xs text-gray-500 ml-auto">Online</p></div>
                      </div>
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
                              <Mic className="h-4 w-4 text-primary " />
                            </div>
                            <div className="bg-green-100 rounded-lg p-2 max-w-[80%]">
                              <p className="text-sm">{message}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                      <div className="bg-gray-100 p-4 flex items-center gap-2">
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
              <div className="w-full max-w-3xl space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-white p-3 rounded-lg shadow-lg h-[180px]">
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
                        <h3 className="text-base font-semibold flex items-center gap-2" onClick={() => handleTitleClick('diagram')} style={{ color: '#2F3D44' }}>
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
                  <div className="bg-white p-3 rounded-lg shadow-lg h-[180px] flex flex-col justify-between">
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
                        <h3 className="text-base font-semibold flex items-center gap-2" onClick={() => handleTitleClick('totalCost')} style={{ color: '#2F3D44' }}>
                          {titles.totalCost}
                          <Edit2 className="w-4 h-4 text-gray-400" />
                        </h3>
                      )}
                      <MoreHorizontal className="text-gray-400 h-4 w-4" />
                    </div>
                    <div className="flex items-center justify-center flex-1">
                      <span className="text-4xl font-bold" style={{ color: '#2F3D44' }}>${Math.round(scrollProgress * 2100)}</span>
                    </div>
                  </div>
                  <div className="bg-white p-4 rounded-lg shadow-lg md:col-span-2">
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
                        <h3 className="text-lg font-semibold flex items-center gap-2" onClick={() => handleTitleClick('harvest')} style={{ color: '#2F3D44' }}>
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
                    <div className="mt-2 text-right text-lg font-semibold" style={{ color: '#2F3D44' }}>{(42.9 * scrollProgress).toFixed(1)}% Listo</div>
                  </div>
                  <div className="bg-white p-4 rounded-lg shadow-lg md:col-span-2">
                    <div className="flex justify-between items-center mb-4">
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
                        <h3 className="text-lg font-semibold flex items-center gap-2" onClick={() => handleTitleClick('gantt')} style={{ color: '#2F3D44' }}>
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
        <section className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl text-center mb-12" style={{ color: '#2F3D44' }}>Principales beneficios</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="flex items-start space-x-4">
                <Users className="h-6 w-6 text-primary mt-1" />
                <div>
                  <h3 className="text-xl font-bold mb-2" style={{ color: '#2F3D44' }}>Amigable con el usuario</h3>
                  <p className="text-gray-500 dark:text-gray-400">Aprovecha la familiaridad de WhatsApp para una adopción fácil en todo tu equipo.</p>
                </div>
              </div>
              <div className="flex items-start space-x-4">
                <BarChart2 className="h-6 w-6 text-primary mt-1" />
                <div>
                  <h3 className="text-xl font-bold mb-2" style={{ color: '#2F3D44' }}>Información accionable</h3>
                  <p className="text-gray-500 dark:text-gray-400">Convierte los mensajes de voz en datos estructurados para una mejor toma de decisiones.</p>
                </div>
              </div>
              <div className="flex items-start space-x-4">
                <Mic className="h-6 w-6 text-primary mt-1" />
                <div>
                  <h3 className="text-xl font-bold mb-2" style={{ color: '#2F3D44' }}>Enfoque centrado en la voz</h3>
                  <p className="text-gray-500 dark:text-gray-400">Ideal para industrias donde escribir no siempre es conveniente o posible.</p>
                </div>
              </div>
              <div className="flex items-start space-x-4">
                <CheckCircle className="h-6 w-6 text-primary mt-1" />
                <div>
                  <h3 className="text-xl font-bold mb-2" style={{ color: '#2F3D44' }}>Flujos de trabajo optimizados</h3>
                  <p className="text-gray-500 dark:text-gray-400">Simplifica la creación de tareas, el seguimiento y la recopilación de información en un solo lugar.</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section ref={aboutRef}>
          <NewsSection />
        </section>

        <section className="w-full py-12 md:py-24 lg:py-32 bg-gray-50">
          <div className="container px-4 md:px-6">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl text-center mb-12" style={{ color: '#2F3D44' }}>Preguntas Frecuentes</h2>
            <div className="max-w-3xl mx-auto space-y-4">
              {qaPairs.map((pair, index) => (
                <div key={index} className="border border-gray-200 rounded-lg overflow-hidden">
                  <button
                    className="flex justify-between items-center w-full p-4 text-left bg-white hover:bg-gray-50 transition-colors"
                    onClick={() => toggleQuestion(index)}
                  >
                    <span className="font-medium" style={{ color: '#2F3D44' }}>{pair.question}</span>
                    {openQuestion === index ? <Minus className="h-5 w-5 text-gray-500" /> : <Plus className="h-5 w-5 text-gray-500" />}
                  </button>
                  {openQuestion === index && (
                    <div className="p-4 bg-white">
                      <p className="text-gray-600">{pair.answer}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>


        <section ref={contactRef} className="w-full py-12 md:py-24 lg:py-32 bg-gray-1 dark:bg-gray-800">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl" style={{ color: '#2F3D44' }}>Sube a tu gente al tren de la tecnología.</h2>
                <p className="mx-auto max-w-[600px] text-gray-500 md:text-xl dark:text-gray-400">
                  Únete a una digitalización inclusiva y optimiza los procesos de tu compañía hoy mismo.
                </p>
              </div>
              <div className="w-full max-w-sm space-y-2">
                <form onSubmit={handleSubmit} className="flex space-x-2">
                  <Input
                    className="max-w-lg flex-1"
                    placeholder="Ingresa tu mail"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                  <Button type="submit">Comienza ahora</Button>
                </form>
                <p className="text-xs text-gray-500 dark:text-gray-400">
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
        href="https://wa.me/56966163647" // Replace with your actual WhatsApp number
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-4 right-4 bg-green-500 hover:bg-green-600 text-white rounded-full p-3 shadow-lg transition-all duration-300 ease-in-out z-50"
        aria-label="Chat on WhatsApp"
      >
        <MessageCircle size={24} />
      </a>
    </div>
  )
}