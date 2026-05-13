'use client'

import { type FormEvent, useState, useEffect, useRef } from 'react'
import Image from 'next/image'
import { Shield, BarChart3, Users, Smartphone, FileText, Bot, ChevronDown, CheckCircle2, ArrowRight, Sun, Moon, Send } from 'lucide-react'
import { Button } from '@/src/components/ui/button'
import { Input } from '@/src/components/ui/input'

interface FormData {
  name: string
  email: string
  company: string
  position: string
  hectares: string
  species: string
  region: string
  needDate: string
}

interface WaitlistResponse {
  error?: string
}

type SubmitStatus = 'idle' | 'success' | 'error'

const EMPTY_FORM_DATA: FormData = {
  name: '',
  email: '',
  company: '',
  position: '',
  hectares: '',
  species: '',
  region: '',
  needDate: ''
}

export default function Home() {
  const waitlistRef = useRef<HTMLElement>(null)
  const trustRef = useRef<HTMLElement>(null)
  const queHacemosRef = useRef<HTMLElement>(null)
  const porQueRef = useRef<HTMLElement>(null)
  const comoRef = useRef<HTMLElement>(null)
  const alertasRef = useRef<HTMLElement>(null)
  
  const [formData, setFormData] = useState<FormData>(EMPTY_FORM_DATA)
  const [showSticky, setShowSticky] = useState(false)
  const [visible, setVisible] = useState<Record<string, boolean>>({})
  const [isDark, setIsDark] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<SubmitStatus>('idle')
  const [submitMessage, setSubmitMessage] = useState('')

  useEffect(() => {
    const onScroll = () => {
      setShowSticky(window.scrollY > 100)
      
      const checks = [
        { ref: trustRef, id: 'trust' },
        { ref: queHacemosRef, id: 'que-hacemos' },
        { ref: porQueRef, id: 'por-que' },
        { ref: comoRef, id: 'como' },
        { ref: alertasRef, id: 'alertas' },
        { ref: waitlistRef, id: 'waitlist' }
      ]
      const newVis: Record<string, boolean> = {}
      checks.forEach(({ ref, id }) => {
        if (ref.current) {
          const rect = ref.current.getBoundingClientRect()
          newVis[id] = rect.top < window.innerHeight * 0.8
        }
      })
      setVisible(newVis)
    }
    window.addEventListener('scroll', onScroll)
    onScroll()
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const scrollToWaitlist = () => {
    waitlistRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  const toggleDarkMode = () => {
    setIsDark(!isDark)
    document.documentElement.classList.toggle('dark')
  }

  const handleSubmit = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault()
    setIsSubmitting(true)
    setSubmitStatus('idle')
    setSubmitMessage('')

    try {
      const response = await fetch('/api/waitlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })
      const result = await response.json().catch(() => ({})) as WaitlistResponse

      if (!response.ok) {
        throw new Error(result.error || 'No pudimos registrar tu inscripción. Intenta nuevamente.')
      }

      setSubmitStatus('success')
      setSubmitMessage('Gracias por inscribirte. Te contactaremos pronto.')
      setFormData(EMPTY_FORM_DATA)
    } catch (error) {
      const message = error instanceof Error ? error.message : 'No pudimos registrar tu inscripción. Intenta nuevamente.'
      setSubmitStatus('error')
      setSubmitMessage(message)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <main className="bg-white text-gray-900">
      {/* HEADER */}
      <header className={`fixed top-0 left-0 right-0 z-50 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 transition-shadow ${showSticky ? 'shadow-sm' : ''}`}>
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Image src="./miido-logo.png" alt="MIIDO" width={100} height={32} className="dark:hidden" />
            <Image src="./logo_blanco.png" alt="MIIDO" width={100} height={32} className="hidden dark:block" />
            <span className="text-miido-navy dark:text-white font-bold text-lg border-l border-gray-300 dark:border-gray-600 pl-3">Workers</span>
          </div>
          <div className="flex items-center gap-3">
            <Button 
              onClick={toggleDarkMode}
              className="bg-miido-navy/10 dark:bg-white/10 text-miido-navy dark:text-miido-lime hover:bg-miido-navy/20 dark:hover:bg-white/20 w-10 h-10 p-0 rounded-lg"
              aria-label="Toggle dark mode"
            >
              {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </Button>
            <Button 
              onClick={scrollToWaitlist}
              className="bg-miido-navy dark:bg-miido-lime text-white dark:text-miido-navy hover:bg-miido-navy/90 dark:hover:bg-miido-lime/90 text-sm font-semibold px-5 py-2 rounded-lg"
            >
              Inscríbete a la lista →
            </Button>
          </div>
        </div>
      </header>

      {/* HERO */}
      <section className="pt-32 pb-20 px-4 bg-miido-bg dark:bg-gray-900">
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-12 items-center">
          <div>
            <div className="inline-flex items-center gap-2 bg-miido-navy/5 dark:bg-miido-navy/20 text-miido-navy dark:text-miido-lime px-4 py-2 rounded-full text-sm text-medium mb-6">
              <Shield className="w-4 h-4" />
              Empresa de Servicios Transitorios · Ley 20.123
            </div>
            
            <h1 className="text-4xl md:text-5xl text-semibold text-miido-navy dark:text-white leading-tight mb-6">
              Contratista agrícola para tu fundo todo el año
            </h1>
            
            <p className="text-xl text-light text-gray-600 dark:text-gray-300 mb-2">Formal. Medible. Sin sorpresas.</p>
            
            <p className="text-lg text-light text-gray-600 dark:text-gray-300 mb-10 max-w-lg">
              Cuadrillas para plantación, poda, raleo, amarra, deshoje, cosecha, packing y mantención. 
              Operación con data en tiempo real.
            </p>
            
            <Button 
              onClick={scrollToWaitlist}
              className="bg-miido-lime text-miido-navy hover:bg-miido-lime/90 text-lg font-bold py-6 px-10 rounded-lg"
            >
              Inscríbete a la lista de espera →
            </Button>

            <div className="grid grid-cols-3 gap-6 mt-16 max-w-md">
              {[
                { label: 'Cobertura', value: '365 días' },
                { label: 'Formalidad', value: '100%' },
                { label: 'Data', value: 'Real-time' }
              ].map((stat, i) => (
                <div key={i} className="border-l-2 border-miido-teal pl-3">
                  <div className="text-xl text-semibold text-miido-navy">{stat.value}</div>
                  <div className="text-sm text-gray-500 mt-1">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
          
          <div className="rounded-2xl h-96 relative overflow-hidden border border-gray-200 shadow-lg bg-gradient-to-br from-green-800 via-green-700 to-green-900">
            <div className="absolute inset-0 flex items-center justify-center text-white">
              <div className="text-center">
                <div className="text-6xl mb-4">🌾</div>
                <p className="text-xl text-semibold mb-2">Cuadrilla en faena</p>
                <p className="text-sm text-green-200">Insertar foto real de equipo</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* TRUST SECTION */}
      <section ref={trustRef} id="trust" className="py-12 px-4 bg-white dark:bg-gray-900 border-y border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto">
          <p className="text-center text-sm text-gray-500 dark:text-gray-400 mb-8 text-medium">CONFÍAN EN NOSOTROS</p>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-8 items-center justify-items-center opacity-60 hover:opacity-100 transition-opacity">
            {[
              { light: 'errazuriz-logo.png', dark: 'errazuriz-logo-white.png', alt: 'Viña Errazuriz' },
              { light: 'LCP.png', dark: 'LCP-white.png', alt: 'La Ciudad Posible' },
              { light: 'cyt.png', dark: 'cyt-white.png', alt: 'Concha y Toro' },
              { light: 'driscolls.png', dark: 'driscolls-white.png', alt: 'Driscolls' },
              { light: 'westfalia.png', dark: 'westfalia-white.png', alt: 'Westfalia' },
              { light: 'TMV.png', dark: 'TMV-white.png', alt: 'TMV' },
              { light: 'start-fellowship.png', dark: 'start-fellowship-white.png', alt: 'Start Fellowship' }
            ].map((logo, i) => (
              <div key={i} className={`${visible['trust'] ? 'opacity-100' : 'opacity-0'} transition-opacity duration-500`} style={{ transitionDelay: `${i * 50}ms` }}>
                <Image src={`./${logo.light}`} alt={logo.alt} width={120} height={40} className="object-contain dark:hidden" />
                <Image src={`./${logo.dark}`} alt={logo.alt} width={120} height={40} className="object-contain hidden dark:block" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* QUÉ HACEMOS */}
      <section ref={queHacemosRef} id="que-hacemos" className="py-20 px-4 bg-miido-bg dark:bg-gray-800">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl md:text-4xl text-semibold text-miido-navy dark:text-white mb-4">Qué hacemos</h2>
          <p className="text-lg text-light text-gray-600 dark:text-gray-300 max-w-2xl mb-16">Tres pilares que garantizan continuidad operacional y cumplimiento legal.</p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                title: 'Cubrimos toda la temporada',
                desc: 'Desde poda hasta cosecha y packing. Un solo proveedor para todo el ciclo agrícola.',
                border: 'border-miido-navy',
                iconBg: 'bg-miido-navy/10'
              },
              {
                title: 'Empleador formal',
                desc: 'EST inscrita. F30-1 al día. Cotizaciones previsionales pagadas al día.',
                border: 'border-miido-teal',
                iconBg: 'bg-miido-teal/10'
              },
              {
                title: 'Operación con data',
                desc: 'Productividad real (kg/HH, ha/día). No planillas. No excusas.',
                border: 'border-miido-lime',
                iconBg: 'bg-miido-lime/10'
              }
            ].map((block, i) => (
              <div 
                key={i} 
                className={`bg-white dark:bg-gray-900 p-8 rounded-xl border-l-4 ${block.border} ${visible['que-hacemos'] ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'} transition-all duration-500`}
                style={{ transitionDelay: `${i * 100}ms` }}
              >
                <div className={`w-12 h-12 ${block.iconBg} rounded-lg flex items-center justify-center mb-6`}>
                  <Users className="w-6 h-6 text-miido-navy dark:text-miido-lime" />
                </div>
                <h3 className="text-xl text-semibold mb-3 text-miido-navy dark:text-white">{block.title}</h3>
                <p className="text-light text-gray-600 dark:text-gray-300 leading-relaxed">{block.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* POR QUÉ IMPORTA */}
      <section ref={porQueRef} id="por-que" className="py-24 px-4 bg-white dark:bg-gray-900 border-t border-gray-100 dark:border-gray-700">
        <div className="max-w-6xl mx-auto">
          <div className="mb-16">
            <h2 className="text-3xl md:text-4xl text-semibold text-miido-navy dark:text-white mb-4">¿Por qué importa?</h2>
            <p className="text-lg text-light text-gray-600 dark:text-gray-300">El costo de elegir mal a tu contratista impacta directamente en tu operación.</p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-12 items-start">
            {/* El Problema */}
            <div className={`${visible['por-que'] ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'} transition-all duration-700`}>
              <div className="bg-miido-bg dark:bg-gray-800 p-8 rounded-2xl border border-gray-200 dark:border-gray-700">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 bg-gray-200 dark:bg-gray-700 rounded-lg flex items-center justify-center">
                    <svg className="w-5 h-5 text-gray-600 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                  </div>
                  <h3 className="text-xl text-semibold text-gray-900 dark:text-white">El problema</h3>
                </div>
                <p className="text-lg text-light text-gray-700 dark:text-gray-300 leading-relaxed">
                  No es encontrar gente. Es depender de un contratista{' '}
                  <span className="text-miido-navy dark:text-miido-lime text-medium">sin visibilidad, sin respaldo y sin plan B.</span>
                </p>
              </div>
            </div>

            {/* La Solución */}
            <div className={`${visible['por-que'] ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'} transition-all duration-700 delay-200`}>
              <div className="bg-miido-navy p-8 rounded-2xl text-white">
                <div className="flex items-center gap-3 mb-8">
                  <div className="w-10 h-10 bg-miido-lime/20 rounded-lg flex items-center justify-center">
                    <CheckCircle2 className="w-5 h-5 text-miido-lime" />
                  </div>
                  <h3 className="text-xl text-semibold">La solución MIIDO</h3>
                </div>
                <div className="space-y-5">
                  {[
                    { icon: Shield, text: 'Riesgo laboral subsidiario cubierto' },
                    { icon: BarChart3, text: 'Productividad visible (kg/HH, ha/día)' },
                    { icon: FileText, text: 'F30-1 limpio y verificable' },
                    { icon: Users, text: 'Un solo proveedor todo el año' }
                  ].map((item, i) => (
                    <div key={i} className="flex items-center gap-3">
                      <item.icon className="w-5 h-5 text-miido-lime flex-shrink-0" />
                      <span className="text-lg text-light">{item.text}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Divisor sutil */}
      <div className="relative py-8">
        <div className="max-w-7xl mx-auto px-4">
          <div className="h-0.5 bg-gradient-to-r from-miido-navy via-miido-teal to-miido-lime opacity-30"></div>
        </div>
      </div>

      {/* CÓMO LO HACEMOS */}
      <section ref={comoRef} id="como" className="py-24 px-4 bg-white dark:bg-gray-900">
        <div className="max-w-7xl mx-auto">
          <div className="mb-16">
            <h2 className="text-3xl md:text-4xl text-semibold text-miido-navy dark:text-white mb-4">Cómo lo hacemos</h2>
            <p className="text-lg text-light text-gray-600 dark:text-gray-300 max-w-2xl">Flujo de información en tiempo real, desde el terreno hasta tu dashboard.</p>
          </div>
          
          {/* Desktop: Horizontal Flow */}
          <div className="hidden md:block">
            <div className="relative">
              {/* Connection Line */}
              <div className="absolute top-16 left-0 right-0 h-0.5 bg-gradient-to-r from-miido-navy via-miido-teal to-miido-lime"></div>
               
              <div className="grid grid-cols-4 gap-6 relative">
                {[
                  { 
                    icon: Smartphone, 
                    title: 'App Cuadrilla', 
                    desc: 'Registro en terreno',
                    color: 'text-miido-navy',
                    step: '1',
                    bg: 'bg-miido-navy/5',
                    border: 'border-miido-navy'
                  },
                  { 
                    icon: BarChart3, 
                    title: 'Dashboard', 
                    desc: 'Ves productividad real',
                    color: 'text-miido-teal',
                    step: '2',
                    bg: 'bg-miido-teal/5',
                    border: 'border-miido-teal'
                  },
                  { 
                    icon: FileText, 
                    title: 'Integración', 
                    desc: 'Cumplimiento automático',
                    color: 'text-miido-lime',
                    step: '3',
                    bg: 'bg-miido-lime/5',
                    border: 'border-miido-lime'
                  },
                  { 
                    icon: Bot, 
                    title: 'AI Planning', 
                    desc: 'Planificación y asignación',
                    color: 'text-miido-navy',
                    step: '4',
                    bg: 'bg-miido-navy/5',
                    border: 'border-miido-navy'
                  }
                ].map((item, i) => (
                  <div 
                    key={i}
                    className={`relative ${visible['como'] ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'} transition-all duration-500 group`}
                    style={{ transitionDelay: `${i * 150}ms` }}
                  >
                    {/* Step Number */}
                    <div className={`absolute -top-8 left-1/2 -translate-x-1/2 w-8 h-8 ${item.bg} border-2 ${item.border} rounded-full flex items-center justify-center text-sm font-bold ${item.color} z-10 bg-white dark:bg-gray-900`}>
                      {item.step}
                    </div>
                    
                    {/* Card */}
                    <div className={`bg-white dark:bg-gray-800 p-6 rounded-2xl border-2 ${item.border} text-center hover:shadow-lg transition-all duration-300 hover:-translate-y-2 group-hover:border-opacity-100`}>
                      <div className={`w-16 h-16 ${item.bg} rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300`}>
                        <item.icon className={`w-8 h-8 ${item.color}`} />
                      </div>
                      <h3 className="text-lg text-semibold text-miido-navy dark:text-white mb-2">{item.title}</h3>
                      <p className="text-light text-gray-600 dark:text-gray-300 text-sm">{item.desc}</p>
                      
                      {/* Connector Arrow */}
                      {i < 3 && (
                        <div className="hidden md:block absolute top-16 -right-3 transform translate-x-1/2 z-20">
                          <ArrowRight className={`w-6 h-6 ${i === 0 ? 'text-miido-teal' : i === 1 ? 'text-miido-lime' : 'text-miido-navy'}`} />
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Mobile: Vertical Flow */}
          <div className="md:hidden space-y-6">
            {[
              { icon: Smartphone, title: 'App Cuadrilla', desc: 'Registro en terreno', color: 'text-miido-navy dark:text-miido-lime', bg: 'bg-miido-navy/5 dark:bg-miido-navy/20', border: 'border-miido-navy' },
              { icon: BarChart3, title: 'Dashboard', desc: 'Ves productividad real', color: 'text-miido-teal dark:text-miido-lime', bg: 'bg-miido-teal/5 dark:bg-miido-teal/20', border: 'border-miido-teal' },
              { icon: FileText, title: 'Integración', desc: 'Cumplimiento automático', color: 'text-miido-lime dark:text-miido-lime', bg: 'bg-miido-lime/5 dark:bg-miido-lime/20', border: 'border-miido-lime' },
              { icon: Bot, title: 'AI Planning', desc: 'Planificación inteligente', color: 'text-miido-navy dark:text-miido-lime', bg: 'bg-miido-navy/5 dark:bg-miido-navy/20', border: 'border-miido-navy' }
            ].map((item, i) => (
              <div 
                key={i}
                className={`flex items-start gap-4 ${visible['como'] ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-4'} transition-all duration-500`}
                style={{ transitionDelay: `${i * 100}ms` }}
              >
                <div className={`flex-shrink-0 w-12 h-12 ${item.bg} rounded-xl border-2 ${item.border} flex items-center justify-center`}>
                  <item.icon className={`w-6 h-6 ${item.color}`} />
                </div>
                <div className="flex-1 pt-2">
                  <h3 className="text-semibold text-miido-navy dark:text-white">{item.title}</h3>
                  <p className="text-sm text-light text-gray-600 dark:text-gray-300">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Data Flow Animation Hint */}
          <div className={`text-center mt-12 ${visible['como'] ? 'opacity-100' : 'opacity-0'} transition-opacity duration-1000 delay-700`}>
            <p className="text-sm text-gray-500 inline-flex items-center gap-2">
              <svg className="w-4 h-4 text-miido-teal animate-pulse" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-8.707l-3-3a1 1 0 00-1.414 0l-3 3a1 1 0 001.414 1.414L9 9.414V13a1 1 0 102 0V9.414l1.293 1.293a1 1 0 001.414-1.414z" clipRule="evenodd" />
              </svg>
              Información fluye en tiempo real →
            </p>
          </div>
        </div>
      </section>

      {/* ALERTAS WHATSAPP */}
      <section ref={alertasRef} id="alertas" className="py-24 px-4 bg-miido-bg dark:bg-gray-900">
        <div className="max-w-7xl mx-auto">
          <div className="mb-16 text-center">
            <h2 className="text-3xl md:text-4xl text-semibold text-miido-navy dark:text-white mb-4">Alertas en WhatsApp</h2>
            <p className="text-lg text-light text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Recibe notificaciones en tiempo real cuando haya cupos disponibles en tu zona. Solo responde &quot;Sí&quot; y nosotros nos encargamos del resto.
            </p>
          </div>

          {/* Phone Mockup */}
          <div className="max-w-sm mx-auto">
            <div className="bg-[#0b141a] rounded-[3rem] p-3 shadow-2xl border-8 border-gray-800">
              <div className="bg-[#0b141a] rounded-[2.5rem] overflow-hidden h-[600px] flex flex-col">
                {/* Status Bar */}
                <div className="flex justify-between items-center px-6 py-3 text-white text-sm">
                  <span>9:41</span>
                  <div className="flex gap-1">
                    <div className="w-4 h-3 border border-white rounded-sm"></div>
                    <div className="w-4 h-3 border border-white rounded-sm"></div>
                    <div className="w-6 h-3 bg-green-500 rounded-sm"></div>
                  </div>
                </div>

                {/* WhatsApp Header */}
                <div className="bg-miido-navy px-4 py-3 flex items-center gap-3">
                  <div className="w-10 h-10 bg-miido-lime/20 rounded-full flex items-center justify-center">
                    <Users className="w-5 h-5 text-miido-lime" />
                  </div>
                  <div>
                    <h3 className="text-white font-semibold text-sm">MIIDO Workers</h3>
                    <p className="text-green-400 text-xs">en línea</p>
                  </div>
                </div>

                {/* Chat Messages */}
                <div className="flex-1 bg-[url('data:image/svg+xml,...')] bg-opacity-10 p-4 space-y-3 overflow-y-auto">
                  {/* New Alert Message */}
                  <div className={`transition-all duration-1000 ${visible['alertas'] ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
                    <div className="bg-miido-navy rounded-2xl rounded-tl-none px-4 py-3 max-w-[90%] border border-miido-teal/30">
                      <p className="text-miido-lime text-xs font-semibold mb-1">📋 NUEVO CUPO</p>
                      <p className="text-white text-sm leading-relaxed">
                        <span className="font-semibold">Región:</span> Valparaíso<br/>
                        <span className="font-semibold">Especie:</span> Cereza<br/>
                        <span className="font-semibold">Hectáreas:</span> 150ha<br/>
                        <span className="font-semibold">Fecha:</span> 15 Marzo 2026
                      </p>
                      <button className="mt-3 bg-miido-lime text-miido-navy font-bold px-4 py-2 rounded-lg text-sm hover:bg-miido-lime/90 transition-colors w-full">
                        ¡Quiero este cupo!
                      </button>
                      <span className="text-[10px] text-gray-400 mt-2 block">10:20 AM</span>
                    </div>
                  </div>

                  {/* User Response */}
                  <div className={`flex justify-end ${visible['alertas'] ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-4'} transition-all duration-500`} style={{ transitionDelay: '200ms' }}>
                    <div className="bg-[#005c4b] rounded-2xl rounded-tr-none px-4 py-3 max-w-[85%]">
                      <p className="text-white text-sm">
                        Sí, me interesa. ¿Cuándo podrían llegar?
                      </p>
                      <span className="text-[10px] text-gray-300 mt-1 block text-right">10:21 AM</span>
                    </div>
                  </div>

                  {/* MIIDO Reply */}
                  <div className={`${visible['alertas'] ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-4'} transition-all duration-500`} style={{ transitionDelay: '400ms' }}>
                    <div className="bg-miido-navy rounded-2xl rounded-tl-none px-4 py-3 max-w-[85%]">
                      <p className="text-white text-sm leading-relaxed">
                        👍 Podemos enviar un equipo el <span className="text-miido-lime font-semibold">lunes a las 7:00 AM</span>.
                        <br/>Adjunto te envío la información del capataz y la cuadrilla asignada.
                      </p>
                      <span className="text-[10px] text-gray-400 mt-2 block">10:22 AM</span>
                    </div>
                  </div>

                  {/* Confirmation */}
                  <div className={`flex justify-end ${visible['alertas'] ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-4'} transition-all duration-500`} style={{ transitionDelay: '600ms' }}>
                    <div className="bg-[#005c4b] rounded-2xl rounded-tr-none px-4 py-3 max-w-[85%]">
                      <p className="text-white text-sm">
                        Perfecto. Quedo atento.
                      </p>
                      <span className="text-[10px] text-gray-300 mt-1 block text-right">10:23 AM</span>
                    </div>
                  </div>
                </div>

                {/* Input Area */}
                <div className="bg-[#202c33] p-3 flex items-center gap-2">
                  <div className="flex-1 bg-[#0b141a] rounded-full px-4 py-2 text-gray-400 text-sm">
                    Escribe un mensaje...
                  </div>
                  <div className="w-10 h-10 bg-miido-lime rounded-full flex items-center justify-center">
                    <Send className="w-5 h-5 text-miido-navy" />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <p className="text-center text-sm text-gray-500 dark:text-gray-400 mt-8 max-w-lg mx-auto">
            <span className="text-miido-navy dark:text-miido-lime font-semibold">Notificación en tiempo real</span> → 
            Recibes un mensaje cuando se abran cupos en tu región.
          </p>
        </div>
      </section>

      {/* WAITLIST */}
      <section ref={waitlistRef} id="waitlist" className="py-24 px-4 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-miido-navy via-[#2a3d5c] to-miido-teal"></div>
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-5"></div>
        <div className="absolute top-0 right-0 w-96 h-96 bg-miido-lime/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-miido-teal/10 rounded-full blur-3xl"></div>
        
        <div className="max-w-2xl mx-auto relative">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm text-miido-lime px-4 py-2 rounded-full text-sm text-medium mb-6">
              <Users className="w-4 h-4" />
              Lista de espera exclusiva
            </div>
            <h2 className="text-3xl md:text-4xl text-semibold text-white mb-4">Lista de espera</h2>
            <p className="text-lg text-light text-gray-300">Te contactamos cuando abramos cupos en tu zona.</p>
          </div>
          
          <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-800 rounded-2xl p-8 md:p-12 shadow-2xl">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">Nombre y apellido *</label>
                <Input 
                  required value={formData.name} 
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="border-gray-300 focus:border-miido-navy focus:ring-miido-navy/50 rounded-lg"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">Email corporativo *</label>
                <Input 
                  type="email" required value={formData.email} 
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  className="border-gray-300 focus:border-miido-navy focus:ring-miido-navy/50 rounded-lg"
                />
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">Empresa / fundo *</label>
                <Input 
                  required value={formData.company} 
                  onChange={(e) => setFormData({...formData, company: e.target.value})}
                  className="border-gray-300 focus:border-miido-navy focus:ring-miido-navy/50 rounded-lg"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">Cargo *</label>
                <Input 
                  required value={formData.position} 
                  onChange={(e) => setFormData({...formData, position: e.target.value})}
                  className="border-gray-300 focus:border-miido-navy focus:ring-miido-navy/50 rounded-lg"
                />
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">Hectáreas *</label>
                <select 
                  required value={formData.hectares} 
                  onChange={(e) => setFormData({...formData, hectares: e.target.value})}
                  className="w-full p-3 border border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-white rounded-lg focus:border-miido-navy focus:ring-miido-navy/50"
                >
                  <option value="">Selecciona rango</option>
                  <option value="Menos de 50 ha">Menos de 50 ha</option>
                  <option value="50 – 200 ha">50 – 200 ha</option>
                  <option value="200 – 500 ha">200 – 500 ha</option>
                  <option value="Más de 500 ha">Más de 500 ha</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">Especie principal *</label>
                <select 
                  required value={formData.species} 
                  onChange={(e) => setFormData({...formData, species: e.target.value})}
                  className="w-full p-3 border border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-white rounded-lg focus:border-miido-navy focus:ring-miido-navy/50"
                >
                  <option value="">Selecciona especie</option>
                  <option>Palto</option>
                  <option>Cereza</option>
                  <option>Arándano</option>
                  <option>Uva de mesa</option>
                  <option>Manzana</option>
                  <option>Otra</option>
                </select>
              </div>
            </div>
            
            <div className="mt-6">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">Región *</label>
              <select 
                required value={formData.region} 
                onChange={(e) => setFormData({...formData, region: e.target.value})}
                className="w-full p-3 border border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-white rounded-lg focus:border-miido-navy focus:ring-miido-navy/50"
              >
                <option value="">Selecciona región</option>
                <option>Arica y Parinacota</option>
                <option>Tarapacá</option>
                <option>Antofagasta</option>
                <option>Atacama</option>
                <option>Coquimbo</option>
                <option>Valparaíso</option>
                <option>Metropolitana</option>
                <option>O&apos;Higgins</option>
                <option>Maule</option>
                <option>Ñuble</option>
                <option>Biobío</option>
                <option>La Araucanía</option>
                <option>Los Ríos</option>
                <option>Los Lagos</option>
                <option>Aysén</option>
                <option>Magallanes</option>
              </select>
            </div>
            
            <div className="mt-6">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">¿Cuándo necesitas cuadrilla? (opcional)</label>
              <Input 
                placeholder="Ej: Marzo 2026" value={formData.needDate} 
                onChange={(e) => setFormData({...formData, needDate: e.target.value})}
                className="border-gray-300 focus:border-miido-navy focus:ring-miido-navy/50 rounded-lg"
              />
            </div>
            
            <Button 
              type="submit" 
              disabled={isSubmitting}
              className="w-full bg-miido-lime text-miido-navy hover:bg-miido-lime/90 dark:hover:bg-miido-lime/80 text-lg font-bold py-6 rounded-lg mt-8 shadow-lg hover:shadow-xl transform hover:scale-[1.02] transition-all duration-300"
            >
              {isSubmitting ? 'Enviando...' : 'Inscribirme a la lista de espera →'}
            </Button>

            {submitMessage && (
              <p
                aria-live="polite"
                className={`text-center text-sm font-medium mt-4 ${
                  submitStatus === 'success'
                    ? 'text-miido-navy dark:text-miido-lime'
                    : 'text-red-600 dark:text-red-400'
                }`}
              >
                {submitMessage}
              </p>
            )}
            
            <p className="text-center text-sm text-light text-gray-500 dark:text-gray-400 mt-4">
              Te contactaremos en menos de 24 horas hábiles.
            </p>
          </form>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="py-12 px-4 bg-gray-900 dark:bg-gray-950 text-gray-400">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex items-center gap-3">
            <Image src="./logo_blanco.png" alt="MIIDO" width={100} height={32} className="dark:block" />
            <span className="text-white font-bold text-lg border-l border-gray-700 pl-3">Workers</span>
          </div>
          <div className="text-center md:text-left space-y-1">
            <p className="text-miido-lime/90 text-light">contacto@miido.cl</p>
            <p className="text-sm text-light">Av. Providencia 1234, Oficina 567, Santiago, Chile</p>
          </div>
          <a href="/privacidad" className="hover:text-miido-lime transition-colors">Política de Privacidad</a>
        </div>
      </footer>

      {/* Mobile Sticky CTA */}
      {showSticky && (
        <div className="fixed bottom-4 left-4 right-4 z-50 md:hidden">
          <Button 
            onClick={scrollToWaitlist}
            className="w-full bg-miido-navy dark:bg-miido-lime text-white dark:text-miido-navy hover:bg-miido-navy/90 dark:hover:bg-miido-lime/90 font-bold py-5 rounded-xl shadow-2xl"
          >
            Inscríbete a la lista →
          </Button>
        </div>
      )}
    </main>
  )
}
