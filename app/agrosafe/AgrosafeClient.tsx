"use client"

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import {
  CheckCircle, MessageCircle, Menu, X, Plus, Minus, Sun, Moon,
  Sprout, Tractor, Truck, Car, HeartPulse, Scale, Paperclip, ShieldCheck, Loader2
} from 'lucide-react'
import { Button } from "@/src/components/ui/button"
import { Input } from "@/src/components/ui/input"
import { useDarkMode } from '../hooks/useDarkMode'

const API_BASE = 'https://agrosafe.cl/api'
const WA_NUMBER = '56942964199'
const WA_COTIZAR = `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent('Hola, vengo de MIIDO y quiero cotizar un seguro para mi campo, mi flota o mi maquinaria.')}`
const WA_POLIZA = `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent('Hola, vengo de MIIDO. Tengo una propuesta de otra corredora y quiero que me la mejoren. Les envío mi póliza / cotización.')}`
const WA_SINIESTRO = `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent('Hola, vengo de MIIDO y necesito asistencia con un siniestro de mi campo, vehículo, maquinaria o de un colaborador.')}`
const SINIESTRO_URL = 'https://agrosafe.cl/miido/siniestro'

// Productos del formulario (valores idénticos a los que espera el API de AgroSafe)
const PRODUCTOS = [
  { value: 'agropecuario', label: 'Seguros Agropecuarios', desc: 'Campo protegido: cultivos, animales y patrimonio.', Icon: Sprout },
  { value: 'maquinas', label: 'Maquinaria agrícola', desc: 'Tractores, cosechadoras, pulverizadoras, etc.', Icon: Tractor },
  { value: 'flotas', label: 'Flotas de vehículos', desc: 'Autos, camionetas y camiones de la empresa.', Icon: Truck },
  { value: 'autos_colaboradores', label: 'Autos para colaboradores', desc: 'Autos a precio flota para tu equipo.', Icon: Car },
  { value: 'accidentes_personales', label: 'Accidentes personales', desc: 'Seguro colectivo para tus colaboradores.', Icon: HeartPulse },
  { value: 'responsabilidad_civil', label: 'Responsabilidad Civil', desc: 'Reclamos de terceros por errores o accidentes.', Icon: Scale },
]

const LINEAS = [
  {
    kicker: 'BENEFICIO PARA COLABORADORES',
    title: 'Seguro de autos para colaboradores a precio flota',
    desc: 'El seguro de su auto a precio flota con hasta 60% de ahorro, con pólizas individuales y sin costo para la empresa.',
    tag: 'Hasta 60% de ahorro · Sin costo para la empresa',
    Icon: Car,
  },
  {
    kicker: 'AUTOS · CAMIONETAS · CAMIONES',
    title: 'Flotas de vehículos',
    desc: 'Asegura toda la flota de la empresa bajo una sola póliza, con administración centralizada y tarifas por volumen.',
    tag: 'Una póliza para toda la flota',
    Icon: Truck,
  },
  {
    kicker: 'COLABORADORES · TEMPOREROS · CUADRILLAS',
    title: 'Accidentes personales',
    desc: 'Seguro colectivo de accidentes personales para proteger a los colaboradores del campo dentro y fuera de la faena.',
    tag: 'Cobertura colectiva para tu equipo',
    Icon: HeartPulse,
  },
  {
    kicker: 'TRACTORES · COSECHADORAS · PULVERIZADORAS',
    title: 'Maquinaria agrícola',
    desc: 'Cubre los daños físicos de tu maquinaria y la responsabilidad civil por daños a terceros causados por el equipo.',
    tag: 'Daños físicos + Responsabilidad Civil',
    Icon: Tractor,
  },
  {
    kicker: 'RECLAMOS DE TERCEROS · PATRIMONIO PROTEGIDO',
    title: 'Responsabilidad Civil',
    desc: 'Protege tu patrimonio ante reclamos de terceros por errores, negligencias o accidentes.',
    tag: 'Tu patrimonio a resguardo',
    Icon: Scale,
  },
  {
    kicker: 'CULTIVOS · ANIMALES · PLANTACIONES · PATRIMONIO',
    title: 'Seguros Agropecuarios · Campo Protegido',
    desc: 'Protege tus cultivos, animales y patrimonio frente a los riesgos climáticos, incendios, accidentes y enfermedades. Incluye 10 categorías especializadas según tu tipo de producción.',
    tag: '10 categorías disponibles',
    Icon: Sprout,
  },
]

const CATEGORIAS = [
  {
    num: '01', kicker: 'CLIMA ADVERSO', title: 'Seguro por afectación climática',
    desc: 'Protege tu producción frente a los eventos climáticos adversos que más afectan al agro, trasladando la pérdida económica a la aseguradora.',
    coberturas: ['Sequía', 'Helada', 'Granizo', 'Lluvia', 'Nieve', 'Viento'],
  },
  {
    num: '02', kicker: 'PLANTACIONES FRUTALES', title: 'Seguro Incendio Frutal',
    desc: 'Protege la plantación de especies frutales, los frutos y el sistema de riego frente a incendios y otras coberturas.',
    coberturas: ['Incendio ordinario', 'Daños materiales por viento, inundación y desbordamiento de cauces', 'Avalancha, aluviones y deslizamientos', 'Daños por aeronaves', 'Incendio y daños por huelga, saqueo o desorden popular', 'Incendio por combustión espontánea', 'Daños por explosión', 'Daños por peso de nieve o hielo', 'Incendio y daños materiales por sismo'],
  },
  {
    num: '03', kicker: 'BOVINOS · OVINOS · CERDOS · AVES · ABEJAS', title: 'Seguro Pecuario',
    desc: 'Brinda cobertura a la pérdida patrimonial de animales ante riesgos de la naturaleza.',
    coberturas: ['Eventos de la naturaleza', 'Enfermedad no exótica', 'Ataque de animales', 'Accidentes', 'Enfermedades exóticas'],
  },
  {
    num: '04', kicker: 'CULTIVOS DE TEMPORADA', title: 'Seguro de Cultivos Anuales',
    desc: 'Permite a los productores agrícolas traspasar las pérdidas económicas derivadas de daños ocurridos por fenómenos climáticos cubiertos por la póliza contratada.',
    coberturas: ['Sequía (en suelos de secano)', 'Lluvia', 'Helada', 'Nieve', 'Viento', 'Granizo'],
  },
  {
    num: '05', kicker: 'SIEMBRAS Y PRADERAS', title: 'Seguro de Incendio de Sementeras',
    desc: 'Protege tu cultivo por daños provocados por incendio en el propio predio o por propagación desde otros predios.',
    coberturas: ['Incendio ordinario', 'Daños por aeronaves', 'Incendio y daños por huelga o saqueo', 'Daños por explosión'],
  },
  {
    num: '06', kicker: 'PLANTACIONES FORESTALES', title: 'Seguro Incendio Forestal',
    desc: 'Protege las plantaciones forestales de daños provocados por incendio y otras coberturas.',
    coberturas: ['Incendio ordinario', 'Daños por aeronaves', 'Incendio y daños por huelga, saqueo o desorden popular', 'Incendio por combustión espontánea', 'Incendio por fenómenos de la naturaleza, excepto sismo', 'Daños por explosión', 'Avalancha, aluviones y deslizamientos', 'Daños materiales por viento, inundación y desbordamiento de cauces'],
  },
  {
    num: '07', kicker: 'UVA · MANZANA · PERA', title: 'Seguro Vides y Pomáceas',
    desc: 'Permite a los productores agrícolas traspasar las pérdidas económicas derivadas de daños ocurridos por fenómenos climáticos cubiertos por la póliza contratada.',
    coberturas: ['Helada', 'Granizo', 'Lluvia', 'Nieve', 'Viento'],
  },
  {
    num: '08', kicker: 'BERRIES · KIWI · OLIVOS', title: 'Seguro Berries, Kiwi y Olivos',
    desc: 'Permite a los productores agrícolas traspasar las pérdidas económicas derivadas de daños ocurridos por fenómenos climáticos cubiertos por la póliza contratada.',
    coberturas: ['Heladas', 'Granizo'],
  },
  {
    num: '09', kicker: 'CEREZA · DURAZNO · CIRUELA · NECTARÍN', title: 'Seguro Carozos',
    desc: 'Permite a los productores agrícolas traspasar las pérdidas económicas derivadas de daños ocurridos por fenómenos climáticos cubiertos por la póliza contratada.',
    coberturas: ['Granizo', 'Lluvia en cosecha'],
  },
  {
    num: '10', kicker: 'NUECES · AVELLANAS', title: 'Seguro Nogales y Avellanos',
    desc: 'Permite a los productores agrícolas traspasar las pérdidas económicas derivadas de daños ocurridos por fenómenos climáticos cubiertos por la póliza contratada.',
    coberturas: ['Lluvia en cosecha', 'Helada'],
  },
]

const BENEFICIOS = [
  { title: 'Cobertura climática', desc: 'Helada, granizo, sequía, lluvia, viento', destacado: true },
  { title: 'Incendio de predios', desc: 'Frutal, forestal y sementeras', destacado: false },
  { title: 'Pérdida de animales', desc: 'Bovinos, ovinos, cerdos, aves y abejas', destacado: true },
  { title: 'Daños físicos de maquinaria', desc: 'Robo, incendio, colisión, vuelco', destacado: false },
  { title: 'Responsabilidad civil', desc: 'Daños a terceros', destacado: true },
  { title: 'Accidentes personales', desc: 'Colectivo para colaboradores', destacado: false },
  { title: 'Autos a precio flota', desc: 'Beneficio para tu equipo', destacado: false },
  { title: 'Asistencia en terreno', desc: 'Te acompañamos en el proceso', destacado: false },
  { title: 'Aseguradoras top de Chile', desc: 'BCI, SURA, Zurich, MAPFRE y más', destacado: false },
  { title: 'Ejecutivo asignado', desc: 'Un solo punto de contacto', destacado: false },
]

const FAQS = [
  {
    q: '¿Qué seguros puedo cotizar con la alianza MIIDO × AgroSafe?',
    a: 'Son 5 productos pensados para el mundo agrícola: (1) seguro de autos a precio flota para los colaboradores, (2) seguro de flotas de autos, camionetas y camiones, (3) seguro de maquinaria agrícola (tractores, cosechadoras, pulverizadoras y más), (4) seguro colectivo de accidentes personales para los colaboradores y (5) Seguros Agropecuarios "Campo Protegido", que agrupa 10 categorías para cultivos, plantaciones y animales.',
  },
  {
    q: '¿Qué es el seguro Campo Protegido?',
    a: 'Es la línea de Seguros Agropecuarios. Protege tus cultivos, animales y patrimonio frente a los riesgos climáticos, incendios, accidentes y enfermedades. Incluye seguro por afectación climática, incendio frutal, pecuario, cultivos anuales, incendio de sementeras, incendio forestal, vides y pomáceas, berries/kiwi/olivos, carozos y nogales/avellanos.',
  },
  {
    q: '¿Qué cubre el seguro por afectación climática?',
    a: 'Cubre las pérdidas económicas provocadas por los eventos climáticos adversos que más afectan al agro: sequía, helada, granizo, lluvia, nieve y viento. Las coberturas específicas se ajustan según la especie y la zona en que produces.',
  },
  {
    q: '¿Puedo asegurar mis animales?',
    a: 'Sí. El Seguro Pecuario cubre la pérdida patrimonial de bovinos, ovinos, cerdos, aves y abejas ante eventos de la naturaleza, enfermedades no exóticas, enfermedades exóticas, ataque de animales y accidentes.',
  },
  {
    q: '¿Qué significa "autos a precio flota para los colaboradores"?',
    a: 'Es un beneficio para tu equipo: se negocia con la aseguradora para que los autos particulares de tus colaboradores accedan a la misma tarifa preferente que se aplica a una flota de empresa, sin que la empresa tenga que asumir el costo.',
  },
  {
    q: '¿Qué cubre el seguro de maquinaria agrícola?',
    a: 'Cubre los daños físicos de la maquinaria (incendio, robo, colisión, vuelco, entre otros) y la Responsabilidad Civil por daños corporales y/o materiales que el equipo cause a terceros.',
  },
  {
    q: '¿Qué es el seguro colectivo de accidentes personales?',
    a: 'Es una póliza que protege a tus colaboradores ante accidentes, con indemnización por muerte accidental, invalidez y gastos médicos. Se contrata de forma colectiva, por lo que el costo por persona es mucho menor que uno individual.',
  },
  {
    q: '¿Puedo asegurar mi flota completa?',
    a: 'Sí. Se aseguran autos, camionetas y camiones de la empresa bajo una sola póliza, con administración centralizada, un solo vencimiento y tarifas por volumen.',
  },
  {
    q: '¿Cuánto demora recibir mi propuesta?',
    a: 'Apenas completas el formulario, un ejecutivo de AgroSafe te contacta rápidamente con una propuesta clara, comparando entre las principales aseguradoras del país.',
  },
  {
    q: '¿Puedo mantener mi aseguradora actual?',
    a: 'Sí. AgroSafe trabaja con BCI Seguros, SURA, Zurich, Reale, HDI, MAPFRE y Renta Nacional, por lo que se busca la mejor alternativa, incluso con tu aseguradora actual si así lo prefieres.',
  },
  {
    q: '¿Tiene algún costo cotizar?',
    a: 'No. Cotizar es totalmente gratis y sin compromiso. Solo pagas la prima de la póliza si decides contratar tu seguro.',
  },
]

const ASEGURADORAS = [
  { file: 'bci.png', name: 'BCI Seguros' },
  { file: 'sura.png', name: 'SURA' },
  { file: 'zurich.png', name: 'Zurich' },
  { file: 'reale.png', name: 'Reale' },
  { file: 'hdi.png', name: 'HDI' },
  { file: 'mapfre.png', name: 'MAPFRE' },
  { file: 'renta-nacional.png', name: 'Renta Nacional' },
]

const PASOS_SINIESTRO = [
  {
    title: '1. Contáctanos de inmediato',
    desc: 'Apenas ocurra el siniestro — en el cultivo, con un animal, en la maquinaria, en un vehículo o con un colaborador — llama o escribe por WhatsApp.',
  },
  {
    title: '2. Te guiamos con la denuncia',
    desc: 'Te ayudamos a reunir la documentación (informes, fotos del predio, facturas) y a presentar el siniestro ante la aseguradora.',
  },
  {
    title: '3. Hacemos el seguimiento',
    desc: 'Acompañamos tu caso hasta que la aseguradora lo resuelva. No quedas solo en el proceso.',
  },
]

// Validación de RUT chileno (módulo 11)
function validarRut(rut: string): boolean {
  const limpio = rut.replace(/[.\s-]/g, '').toUpperCase()
  if (!/^\d{7,8}[\dK]$/.test(limpio)) return false
  const cuerpo = limpio.slice(0, -1)
  const dv = limpio.slice(-1)
  let suma = 0
  let multiplo = 2
  for (let i = cuerpo.length - 1; i >= 0; i--) {
    suma += parseInt(cuerpo[i]) * multiplo
    multiplo = multiplo === 7 ? 2 : multiplo + 1
  }
  const resto = 11 - (suma % 11)
  const dvEsperado = resto === 11 ? '0' : resto === 10 ? 'K' : String(resto)
  return dv === dvEsperado
}

function validarTelefono(fono: string): boolean {
  const digitos = fono.replace(/\D/g, '')
  return digitos.length >= 8 && digitos.length <= 12
}

function validarEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)
}

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

function LeadForm() {
  const [tipos, setTipos] = useState<string[]>([])
  const [nombre, setNombre] = useState('')
  const [email, setEmail] = useState('')
  const [rut, setRut] = useState('')
  const [celular, setCelular] = useState('')
  const [file, setFile] = useState<File | null>(null)
  const [honeypot, setHoneypot] = useState('')
  const [errores, setErrores] = useState<Record<string, string>>({})
  const [enviando, setEnviando] = useState(false)
  const [enviado, setEnviado] = useState(false)
  const [mensajeError, setMensajeError] = useState('')
  const [avisoPoliza, setAvisoPoliza] = useState('')

  const toggleTipo = (value: string) => {
    setTipos(prev => prev.includes(value) ? prev.filter(t => t !== value) : [...prev, value])
  }

  const handleFile = (f: File | null) => {
    if (f && f.size > 10 * 1024 * 1024) {
      setErrores(prev => ({ ...prev, file: 'El archivo supera los 10MB' }))
      return
    }
    setErrores(prev => { const { file: _omit, ...rest } = prev; return rest })
    setFile(f)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (honeypot) return // bot detectado

    const errs: Record<string, string> = {}
    if (tipos.length === 0) errs.tipos = 'Selecciona al menos un producto'
    if (!nombre.trim()) errs.nombre = 'Ingresa tu nombre o razón social'
    if (!validarEmail(email)) errs.email = 'Email inválido'
    if (!validarRut(rut)) errs.rut = 'RUT inválido (persona o empresa)'
    if (!validarTelefono(celular)) errs.celular = 'Teléfono inválido'
    setErrores(errs)
    if (Object.keys(errs).length > 0) return

    setEnviando(true)
    setMensajeError('')
    setAvisoPoliza('')
    try {
      const params = typeof window !== 'undefined' ? new URLSearchParams(window.location.search) : null
      const ref = params?.get('ref')
      const res = await fetch(`${API_BASE}/leads`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nombre: nombre.trim(),
          email: email.trim(),
          rut: rut.trim(),
          celular: celular.trim(),
          tipo_industria: tipos,
          partner: 'MIIDO',
          ...(ref ? { ref } : {}),
        }),
      })
      if (!res.ok) {
        let detalle = ''
        try {
          const data = await res.json()
          if (typeof data?.detail === 'string') detalle = data.detail
        } catch { /* respuesta sin cuerpo JSON */ }
        setMensajeError(detalle || 'No pudimos enviar tu solicitud. Intenta nuevamente.')
        return
      }
      const data = await res.json().catch(() => null)
      if (file && data?.id) {
        try {
          const fd = new FormData()
          fd.append('file', file)
          const up = await fetch(`${API_BASE}/leads/${data.id}/current-policy`, { method: 'POST', body: fd })
          if (!up.ok) setAvisoPoliza('No pudimos adjuntar tu póliza, pero recibimos tu solicitud.')
        } catch {
          setAvisoPoliza('No pudimos adjuntar tu póliza, pero recibimos tu solicitud.')
        }
      }
      setEnviado(true)
    } catch {
      setMensajeError('No pudimos enviar tu solicitud. Revisa tu conexión e intenta nuevamente.')
    } finally {
      setEnviando(false)
    }
  }

  const reiniciar = () => {
    setTipos([]); setNombre(''); setEmail(''); setRut(''); setCelular('')
    setFile(null); setErrores({}); setEnviado(false); setMensajeError(''); setAvisoPoliza('')
  }

  if (enviado) {
    return (
      <div className="border border-gray-200 dark:border-gray-700 rounded-lg shadow-md bg-white dark:bg-gray-800 p-8 flex flex-col items-center text-center space-y-4">
        <CheckCircle className="h-12 w-12 text-[#51A09A]" />
        <h3 className="text-xl text-semibold text-gray-800 dark:text-white">¡Solicitud enviada!</h3>
        <p className="text-gray-600 dark:text-gray-300 text-light">
          Te contactaremos rápidamente con una propuesta hecha a medida, comparando entre las principales aseguradoras de Chile.
        </p>
        {avisoPoliza && (
          <p className="text-sm text-amber-600 dark:text-amber-400">{avisoPoliza}</p>
        )}
        <button
          onClick={reiniciar}
          className="text-sm text-[#38507E] dark:text-[#C2DB64] hover:underline underline-offset-4"
        >
          Enviar otra solicitud
        </button>
      </div>
    )
  }

  return (
    <form
      onSubmit={handleSubmit}
      noValidate
      className="border border-gray-200 dark:border-gray-700 rounded-lg shadow-md bg-white dark:bg-gray-800 p-5 sm:p-6 space-y-5"
    >
      {/* Honeypot anti-bots */}
      <input
        type="text"
        value={honeypot}
        onChange={(e) => setHoneypot(e.target.value)}
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
        className="absolute opacity-0 h-0 w-0 pointer-events-none"
        placeholder="No completar este campo"
      />

      <div className="space-y-1">
        <h3 className="text-lg text-semibold text-gray-800 dark:text-white">Cotízanos tu seguro, completa y te contactamos.</h3>
        <p className="text-sm text-gray-500 dark:text-gray-400 text-light">Tenemos la mejor cobertura y precio del mercado.</p>
      </div>

      <div className="space-y-2">
        <p className="text-sm text-medium text-gray-800 dark:text-white">
          ¿Qué quieres asegurar? <span className="text-red-500">*</span>
          <span className="ml-2 text-xs text-gray-400 font-normal">Puedes elegir más de uno</span>
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {PRODUCTOS.map(({ value, label, desc, Icon }) => {
            const activo = tipos.includes(value)
            return (
              <button
                type="button"
                key={value}
                onClick={() => toggleTipo(value)}
                className={`flex items-start gap-2.5 p-3 rounded-lg border text-left transition-all duration-200 ${
                  activo
                    ? 'border-[#38507E] bg-[#38507E]/5 dark:bg-[#38507E]/20 ring-1 ring-[#38507E]'
                    : 'border-gray-200 dark:border-gray-600 hover:border-[#51A09A] bg-white dark:bg-gray-800'
                }`}
              >
                <Icon className={`h-5 w-5 mt-0.5 shrink-0 ${activo ? 'text-[#38507E] dark:text-[#C2DB64]' : 'text-gray-400'}`} />
                <span>
                  <span className="block text-sm text-medium text-gray-800 dark:text-white">{label}</span>
                  <span className="block text-xs text-gray-500 dark:text-gray-400 text-light">{desc}</span>
                </span>
              </button>
            )
          })}
        </div>
        {errores.tipos && <p className="text-xs text-red-600">{errores.tipos}</p>}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div className="space-y-1 sm:col-span-2">
          <label className="text-sm text-medium text-gray-800 dark:text-white" htmlFor="as-nombre">Nombre o razón social *</label>
          <Input id="as-nombre" value={nombre} onChange={e => setNombre(e.target.value)}
            placeholder="Agrícola Los Aromos SpA"
            className="focus:ring-2 focus:ring-[#51A09A] transition-all duration-300 dark:bg-gray-900" />
          {errores.nombre && <p className="text-xs text-red-600">{errores.nombre}</p>}
        </div>
        <div className="space-y-1">
          <label className="text-sm text-medium text-gray-800 dark:text-white" htmlFor="as-email">Email de contacto *</label>
          <Input id="as-email" type="email" value={email} onChange={e => setEmail(e.target.value)}
            placeholder="contacto@tucampo.cl"
            className="focus:ring-2 focus:ring-[#51A09A] transition-all duration-300 dark:bg-gray-900" />
          {errores.email && <p className="text-xs text-red-600">{errores.email}</p>}
        </div>
        <div className="space-y-1">
          <label className="text-sm text-medium text-gray-800 dark:text-white" htmlFor="as-rut">RUT (persona o empresa) *</label>
          <Input id="as-rut" value={rut} onChange={e => setRut(e.target.value)}
            placeholder="76.123.456-7"
            className="focus:ring-2 focus:ring-[#51A09A] transition-all duration-300 dark:bg-gray-900" />
          {errores.rut && <p className="text-xs text-red-600">{errores.rut}</p>}
        </div>
        <div className="space-y-1 sm:col-span-2">
          <label className="text-sm text-medium text-gray-800 dark:text-white" htmlFor="as-fono">Teléfono de contacto *</label>
          <Input id="as-fono" type="tel" value={celular} onChange={e => setCelular(e.target.value)}
            placeholder="+56 9 1234 5678"
            className="focus:ring-2 focus:ring-[#51A09A] transition-all duration-300 dark:bg-gray-900" />
          {errores.celular && <p className="text-xs text-red-600">{errores.celular}</p>}
        </div>
      </div>

      <div className="space-y-2">
        <p className="text-xs text-gray-500 dark:text-gray-400 tracking-wide uppercase">Opcional · ¿Quieres mejorar tu seguro?</p>
        <label className="flex items-center gap-2 p-3 rounded-lg border border-dashed border-gray-300 dark:border-gray-600 hover:border-[#51A09A] cursor-pointer transition-colors">
          <Paperclip className="h-4 w-4 text-gray-400 shrink-0" />
          <span className="text-sm text-gray-600 dark:text-gray-300 text-light truncate">
            {file ? file.name : 'Adjúntanos tu póliza actual — PDF o imagen (máx. 10MB)'}
          </span>
          <input
            type="file"
            accept="application/pdf,image/*"
            className="hidden"
            onChange={e => handleFile(e.target.files?.[0] ?? null)}
          />
        </label>
        {errores.file && <p className="text-xs text-red-600">{errores.file}</p>}
      </div>

      {mensajeError && (
        <p className="text-sm text-red-600 bg-red-50 dark:bg-red-900/20 rounded-lg p-3">{mensajeError}</p>
      )}

      <Button
        type="submit"
        disabled={enviando}
        className="w-full bg-[#38507E] hover:bg-[#2d4066] text-white transition-all duration-300 hover:shadow-lg"
      >
        {enviando ? (
          <span className="flex items-center gap-2"><Loader2 className="h-4 w-4 animate-spin" /> Enviando…</span>
        ) : (
          'Quiero cotizar mi seguro'
        )}
      </Button>
      <p className="text-xs text-center text-gray-500 dark:text-gray-400">
        Sin costo y sin compromiso. Tus datos están protegidos.
      </p>
    </form>
  )
}

export default function AgrosafeClient() {
  const { isDark, toggleDarkMode } = useDarkMode()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [openQuestion, setOpenQuestion] = useState<number | null>(null)
  const [openCategoria, setOpenCategoria] = useState<number | null>(null)

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
    setMobileMenuOpen(false)
  }

  const navItems = [
    { id: 'seguros', label: 'Seguros' },
    { id: 'campo-protegido', label: 'Campo Protegido' },
    { id: 'siniestros', label: 'Siniestros' },
    { id: 'faq', label: 'Preguntas frecuentes' },
  ]

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground overflow-x-hidden dark:bg-gray-900">
      <style dangerouslySetInnerHTML={{
        __html: `
          @keyframes fadeInUp {
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: translateY(0); }
          }
          @keyframes fadeInDown {
            from { opacity: 0; transform: translateY(-20px); }
            to { opacity: 1; transform: translateY(0); }
          }
        `
      }} />

      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 px-4 lg:px-6 h-14 flex items-center justify-between border-b bg-white dark:bg-gray-800 dark:border-gray-700">
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center gap-3">
            <Link className="flex items-center justify-center" href="/">
              <div className="dark:hidden">
                <Image src="/miido-logo.png" alt="MIIDO" width={110} height={37} />
              </div>
              <div className="hidden dark:block">
                <Image src="/logo_blanco.png" alt="MIIDO" width={110} height={37} />
              </div>
              <span className="sr-only">MIIDO</span>
            </Link>
            <span className="text-gray-300 dark:text-gray-600 text-lg font-light select-none">×</span>
            <div className="dark:hidden">
              <Image src="/agrosafe/logo.png" alt="AgroSafe" width={92} height={28} className="h-7 w-auto object-contain" />
            </div>
            <div className="hidden dark:block">
              <Image src="/agrosafe/logo-white.png" alt="AgroSafe" width={92} height={28} className="h-7 w-auto object-contain" />
            </div>
          </div>
          <nav className="hidden md:flex gap-4 sm:gap-6 items-center">
            {navItems.map(item => (
              <button
                key={item.id}
                className="text-sm text-regular hover:underline underline-offset-4 text-black dark:text-white"
                onClick={() => scrollTo(item.id)}
              >
                {item.label}
              </button>
            ))}
            <button
              onClick={() => scrollTo('cotizar')}
              className="inline-flex items-center justify-center px-5 py-1.5 text-white bg-[#38507E] rounded-full hover:bg-[#2d4066] text-sm font-medium shadow-md hover:shadow-lg transition-all duration-300"
            >
              Cotizar mi seguro
            </button>
          </nav>
          <button
            className="md:hidden"
            onClick={() => setMobileMenuOpen(o => !o)}
            aria-label={mobileMenuOpen ? 'Cerrar menú' : 'Abrir menú'}
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </header>

      {/* Menú móvil */}
      <div className={`fixed inset-0 z-40 transform ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'} transition-transform duration-300 ease-in-out md:hidden`}>
        <div className="bg-white dark:bg-gray-800 h-full w-64 shadow-lg pt-20 px-4">
          <nav className="flex flex-col gap-4">
            {navItems.map(item => (
              <button
                key={item.id}
                className="text-sm text-regular text-left hover:underline underline-offset-4 text-black dark:text-white"
                onClick={() => scrollTo(item.id)}
              >
                {item.label}
              </button>
            ))}
            <button
              onClick={() => scrollTo('cotizar')}
              className="mt-4 inline-flex items-center justify-center px-5 py-2 text-white bg-[#38507E] rounded-full hover:bg-[#2d4066] text-sm font-medium shadow-md transition-all duration-300"
            >
              Cotizar mi seguro
            </button>
          </nav>
        </div>
        <div className="bg-black bg-opacity-50 h-full w-full" onClick={() => setMobileMenuOpen(false)}></div>
      </div>

      <main className="flex-1 pt-14">

        {/* Hero + formulario */}
        <section className="w-full py-10 md:py-14 lg:py-16 relative overflow-hidden">
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

          <div className="container px-4 md:px-6 relative">
            <div className="flex justify-center mb-8">
              <div
                className="flex items-center gap-3 bg-white dark:bg-[#111827] border border-[#38507E] dark:border-[#1e293b] rounded-full px-4 py-1.5 shadow-md hover:border-[#C2DB64] transition-all duration-300"
                style={{ animation: 'fadeInDown 0.8s ease-out forwards', opacity: 0 }}
              >
                <ShieldCheck className="h-4 w-4 text-[#51A09A]" />
                <span className="text-xs text-ultra-light text-gray-800 dark:text-gray-300">
                  En alianza con <strong className="text-regular">AgroSafe.cl</strong> · Corredora certificada CMF · Chile
                </span>
              </div>
            </div>

            <div className="flex flex-col lg:flex-row items-start gap-10 lg:gap-8">
              <div className="flex-1 flex flex-col items-center lg:items-start space-y-6 text-center lg:text-left max-w-xl">
                <h1
                  className="text-4xl sm:text-5xl md:text-6xl lg:text-5xl xl:text-6xl text-semibold tracking-tight bg-gradient-to-r from-[#38507E] via-[#51A09A] to-[#C2DB64] bg-clip-text text-transparent pb-1"
                  style={{ animation: 'fadeInUp 0.8s ease-out forwards', opacity: 0, fontWeight: 600, lineHeight: 1.2 }}
                >
                  Protegemos todo lo que mueve al agro.
                </h1>
                <p
                  className="text-gray-500 text-lg md:text-xl dark:text-gray-400 text-light"
                  style={{ animation: 'fadeInUp 0.8s ease-out 0.2s forwards', opacity: 0 }}
                >
                  Cultivos, animales, maquinaria, flotas y las personas que hacen funcionar tu campo. Cotiza rápido y recibe una propuesta con la mejor cobertura y el respaldo de las principales aseguradoras de Chile.
                </p>

                <ul
                  className="space-y-3 text-left"
                  style={{ animation: 'fadeInUp 0.8s ease-out 0.3s forwards', opacity: 0 }}
                >
                  {[
                    <span key="1"><strong className="text-regular">Campo Protegido:</strong> cultivos, animales y patrimonio frente a clima, incendios y enfermedades.</span>,
                    <span key="2"><strong className="text-regular">Flotas y maquinaria:</strong> daños físicos más responsabilidad civil por daños a terceros.</span>,
                    <span key="3"><strong className="text-regular">Colaboradores:</strong> seguro de su auto a precio flota con hasta 60% de ahorro, más seguro colectivo de accidentes personales.</span>,
                    <span key="4"><strong className="text-regular">Tu partner en el siniestro:</strong> te acompañamos en todo el proceso.</span>,
                  ].map((texto, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm md:text-base text-gray-600 dark:text-gray-300 text-light">
                      <CheckCircle className="h-5 w-5 mt-0.5 shrink-0 text-[#51A09A]" />
                      {texto}
                    </li>
                  ))}
                </ul>

                <div
                  className="flex flex-col sm:flex-row gap-3"
                  style={{ animation: 'fadeInUp 0.8s ease-out 0.4s forwards', opacity: 0 }}
                >
                  <button
                    onClick={() => scrollTo('cotizar')}
                    className="inline-flex items-center justify-center px-6 py-3 text-white bg-[#38507E] rounded-lg hover:bg-[#2d4066] focus:outline-none transform transition-all duration-300 hover:scale-105 hover:shadow-lg text-sm font-medium"
                  >
                    Cotizar mi seguro
                  </button>
                  <a
                    href={SINIESTRO_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center px-6 py-3 text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none transform transition-all duration-300 hover:scale-105 text-sm font-medium"
                  >
                    Gestionemos tu siniestro
                  </a>
                </div>
                <p
                  className="text-xs text-gray-500 dark:text-gray-400"
                  style={{ animation: 'fadeInUp 0.8s ease-out 0.5s forwards', opacity: 0 }}
                >
                  Sin costo de cotización · Propuesta hecha a medida
                </p>
              </div>

              <div
                id="cotizar"
                className="flex-1 w-full lg:max-w-xl scroll-mt-20"
                style={{ animation: 'fadeInUp 0.8s ease-out 0.3s forwards', opacity: 0 }}
              >
                <LeadForm />
              </div>
            </div>
          </div>
          <div className="mt-12">
            <MultiWaveAudio />
          </div>
        </section>

        {/* Aseguradoras */}
        <section className="w-full py-4 md:-mt-16 sm:-mt-20 overflow-x-auto">
          <div className="container px-4 md:px-6">
            <p className="text-center text-xs text-gray-400 dark:text-gray-500 mb-4 uppercase tracking-wide">
              Con el respaldo de las principales aseguradoras de Chile
            </p>
            <div className="flex flex-nowrap md:justify-center sm:justify-center items-center gap-6 sm:gap-8 md:gap-10 lg:gap-14 pb-2">
              {ASEGURADORAS.map((a, i) => (
                <div key={a.file} className="flex-shrink-0">
                  <div
                    className="transform transition-transform duration-300 hover:scale-110"
                    style={{ animation: `fadeInUp 0.8s ease-out ${0.1 + i * 0.05}s forwards`, opacity: 0 }}
                  >
                    <Image
                      src={`/agrosafe/insurers/${a.file}`}
                      alt={a.name}
                      width={100}
                      height={36}
                      className="h-8 w-auto object-contain opacity-70 hover:opacity-100 transition-opacity dark:bg-white/90 dark:rounded dark:px-1.5 dark:py-0.5"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Líneas de seguros */}
        <section id="seguros" className="w-full py-12 md:py-24 lg:py-28 overflow-hidden scroll-mt-14">
          <div className="container px-4 md:px-6">
            <div className="text-center max-w-3xl mx-auto mb-12 space-y-4">
              <h2 className="text-3xl text-semibold tracking-tighter sm:text-5xl bg-gradient-to-r from-[#38507E] via-[#51A09A] to-[#C2DB64] bg-clip-text text-transparent pb-1">
                Una sola corredora para todo tu campo.
              </h2>
              <p className="text-gray-500 md:text-xl dark:text-gray-400 text-light">
                Desde el cultivo y los animales hasta la maquinaria, la flota y las personas que hacen funcionar tu campo, con el respaldo de las principales aseguradoras de Chile.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {LINEAS.map((linea, i) => (
                <div
                  key={linea.title}
                  className="border border-gray-200 dark:border-gray-700 rounded-lg p-6 bg-white dark:bg-gray-800 shadow-sm hover:shadow-md hover:border-[#51A09A] transition-all duration-300 flex flex-col gap-3"
                  style={{ animation: `fadeInUp 0.8s ease-out ${0.1 + i * 0.08}s forwards`, opacity: 0 }}
                >
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-lg bg-[#38507E]/10 dark:bg-[#38507E]/30 flex items-center justify-center">
                      <linea.Icon className="h-5 w-5 text-[#38507E] dark:text-[#C2DB64]" />
                    </div>
                    <span className="text-[10px] tracking-widest text-gray-400 dark:text-gray-500">{linea.kicker}</span>
                  </div>
                  <h3 className="text-lg text-medium text-gray-800 dark:text-white">{linea.title}</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-300 text-light flex-1">{linea.desc}</p>
                  <p className="text-xs text-medium text-[#38507E] dark:text-[#C2DB64]">{linea.tag}</p>
                </div>
              ))}
            </div>
            <div className="mt-10 text-center">
              <p className="text-gray-500 dark:text-gray-400 text-light mb-4">
                ¿No sabes qué seguro necesitas? Cuéntanos qué haces en tu campo o empresa y armamos la combinación de coberturas que mejor te protege, sin costo.
              </p>
              <button
                onClick={() => scrollTo('cotizar')}
                className="inline-flex items-center justify-center px-6 py-3 text-white bg-[#38507E] rounded-lg hover:bg-[#2d4066] transform transition-all duration-300 hover:scale-105 hover:shadow-lg text-sm font-medium"
              >
                Quiero asesoría
              </button>
            </div>
          </div>
        </section>

        {/* Campo Protegido: 10 categorías */}
        <section id="campo-protegido" className="w-full py-12 md:py-24 lg:py-28 bg-gray-50 dark:bg-gray-800/50 overflow-hidden scroll-mt-14">
          <div className="container px-4 md:px-6">
            <div className="text-center max-w-3xl mx-auto mb-12 space-y-4">
              <p className="text-xs tracking-widest text-gray-400 dark:text-gray-500 uppercase">Seguros Agropecuarios</p>
              <h2 className="text-3xl text-semibold tracking-tighter sm:text-5xl text-gray-800 dark:text-white">
                Campo Protegido: 10 categorías para tu producción.
              </h2>
              <p className="text-gray-500 md:text-xl dark:text-gray-400 text-light">
                Protege tus cultivos, animales y patrimonio frente a los riesgos climáticos, incendios, accidentes y enfermedades. Elige la categoría que calza con tu tipo de producción.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-5xl mx-auto">
              {CATEGORIAS.map((cat, i) => {
                const abierta = openCategoria === i
                const visibles = abierta ? cat.coberturas : cat.coberturas.slice(0, 4)
                return (
                  <div
                    key={cat.num}
                    className="border border-gray-200 dark:border-gray-700 rounded-lg p-5 bg-white dark:bg-gray-800 shadow-sm hover:shadow-md transition-all duration-300"
                    style={{ animation: `fadeInUp 0.8s ease-out ${0.05 + i * 0.05}s forwards`, opacity: 0 }}
                  >
                    <div className="flex items-baseline gap-3 mb-1">
                      <span className="text-2xl text-semibold bg-gradient-to-r from-[#38507E] via-[#51A09A] to-[#C2DB64] bg-clip-text text-transparent">{cat.num}</span>
                      <span className="text-[10px] tracking-widest text-gray-400 dark:text-gray-500">{cat.kicker}</span>
                    </div>
                    <h3 className="text-base text-medium text-gray-800 dark:text-white mb-1.5">{cat.title}</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-300 text-light mb-3">{cat.desc}</p>
                    <p className="text-[10px] tracking-widest text-gray-400 uppercase mb-2">
                      Coberturas · {cat.coberturas.length}
                    </p>
                    <ul className="space-y-1 mb-2">
                      {visibles.map(cob => (
                        <li key={cob} className="flex items-start gap-2 text-sm text-gray-600 dark:text-gray-300 text-light">
                          <CheckCircle className="h-3.5 w-3.5 mt-1 shrink-0 text-[#51A09A]" />
                          {cob}
                        </li>
                      ))}
                    </ul>
                    {cat.coberturas.length > 4 && (
                      <button
                        onClick={() => setOpenCategoria(abierta ? null : i)}
                        className="text-xs text-[#38507E] dark:text-[#C2DB64] hover:underline underline-offset-4"
                      >
                        {abierta ? 'Ver menos' : `Ver las ${cat.coberturas.length} coberturas`}
                      </button>
                    )}
                  </div>
                )
              })}
            </div>
            <div className="mt-10 text-center max-w-2xl mx-auto">
              <h3 className="text-xl text-medium text-gray-800 dark:text-white mb-2">¿No sabes cuál categoría te conviene?</h3>
              <p className="text-gray-500 dark:text-gray-400 text-light mb-4">
                Cuéntanos qué produces y armamos la combinación de categorías que mejor protege tu campo, comparando entre las principales aseguradoras de Chile.
              </p>
              <button
                onClick={() => scrollTo('cotizar')}
                className="inline-flex items-center justify-center px-6 py-3 text-white bg-[#38507E] rounded-lg hover:bg-[#2d4066] transform transition-all duration-300 hover:scale-105 hover:shadow-lg text-sm font-medium"
              >
                Cotizar mi campo
              </button>
              <p className="text-xs text-gray-400 dark:text-gray-500 mt-4">
                * Las coberturas y condiciones finales dependen de la póliza y aseguradora seleccionada en tu propuesta.
              </p>
            </div>
          </div>
        </section>

        {/* Mejoramos tu póliza */}
        <section className="w-full py-12 md:py-24 overflow-hidden">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center space-y-4 text-center max-w-3xl mx-auto">
              <p className="text-xs tracking-widest text-gray-400 dark:text-gray-500 uppercase">Líderes del mercado agrícola</p>
              <h2 className="text-3xl text-semibold tracking-tighter sm:text-4xl md:text-5xl leading-[1.2] bg-gradient-to-r from-[#38507E] via-[#51A09A] to-[#C2DB64] bg-clip-text text-transparent pb-1">
                Tenemos la mejor cobertura y precio del mercado.
              </h2>
              <p className="text-gray-500 md:text-xl dark:text-gray-400 text-light">
                ¿Tienes una propuesta mejor? Envíanos tu póliza y siempre te la mejoramos. Comparamos tu propuesta actual y te devolvemos la mejor oferta del mercado, sin costo.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 pt-2">
                <a
                  href={WA_POLIZA}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 px-6 py-3 text-white bg-green-500 hover:bg-green-600 rounded-lg transform transition-all duration-300 hover:scale-105 hover:shadow-lg text-sm font-medium"
                >
                  <MessageCircle size={18} />
                  Envíanos tu póliza por WhatsApp
                </a>
                <button
                  onClick={() => scrollTo('cotizar')}
                  className="inline-flex items-center justify-center px-6 py-3 text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transform transition-all duration-300 hover:scale-105 text-sm font-medium"
                >
                  Cotizar ahora
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Tu seguro incluye */}
        <section className="w-full py-12 md:py-24 bg-gray-50 dark:bg-gray-800/50 overflow-hidden">
          <div className="container px-4 md:px-6">
            <div className="text-center max-w-3xl mx-auto mb-12 space-y-4">
              <p className="text-xs tracking-widest text-gray-400 dark:text-gray-500 uppercase">Tu seguro incluye</p>
              <h2 className="text-3xl text-semibold tracking-tighter sm:text-5xl text-gray-800 dark:text-white">
                Cobertura completa para tu campo y tu empresa.
              </h2>
              <p className="text-gray-500 md:text-xl dark:text-gray-400 text-light">
                Clima, incendio, animales, maquinaria, flotas y personas. Beneficios reales para operar tranquilo en el predio, en la faena y en la carretera.
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 max-w-6xl mx-auto">
              {BENEFICIOS.map((b, i) => (
                <div
                  key={b.title}
                  className="relative border border-gray-200 dark:border-gray-700 rounded-lg p-4 bg-white dark:bg-gray-800 shadow-sm hover:shadow-md hover:border-[#51A09A] transition-all duration-300"
                  style={{ animation: `fadeInUp 0.8s ease-out ${0.05 + i * 0.04}s forwards`, opacity: 0 }}
                >
                  {b.destacado && (
                    <span className="absolute -top-2 right-3 text-[9px] tracking-widest bg-[#C2DB64] text-gray-800 rounded-full px-2 py-0.5 font-medium">
                      DESTACADO
                    </span>
                  )}
                  <h3 className="text-sm text-medium text-gray-800 dark:text-white mb-1">{b.title}</h3>
                  <p className="text-xs text-gray-500 dark:text-gray-400 text-light">{b.desc}</p>
                </div>
              ))}
            </div>
            <p className="text-xs text-center text-gray-400 dark:text-gray-500 mt-8">
              Sin costo de cotización · Respuesta rápida · * Las coberturas y beneficios finales dependen de la póliza y aseguradora seleccionada en tu propuesta.
            </p>
          </div>
        </section>

        {/* Siniestros */}
        <section id="siniestros" className="w-full py-12 md:py-24 overflow-hidden scroll-mt-14">
          <div className="container px-4 md:px-6">
            <div className="text-center max-w-3xl mx-auto mb-12 space-y-4">
              <p className="text-xs tracking-widest text-gray-400 dark:text-gray-500 uppercase">Siniestros</p>
              <h2 className="text-3xl text-semibold tracking-tighter sm:text-5xl bg-gradient-to-r from-[#38507E] via-[#51A09A] to-[#C2DB64] bg-clip-text text-transparent pb-1">
                ¿Tuviste un siniestro? Te acompañamos.
              </h2>
              <p className="text-gray-500 md:text-xl dark:text-gray-400 text-light">
                No te dejamos solo en el peor momento. El equipo te guía paso a paso en la denuncia y el seguimiento, hasta que tu caso quede resuelto.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto mb-10">
              {PASOS_SINIESTRO.map((paso, i) => (
                <div
                  key={paso.title}
                  className="border border-gray-200 dark:border-gray-700 rounded-lg p-6 bg-white dark:bg-gray-800 shadow-sm hover:shadow-md transition-all duration-300"
                  style={{ animation: `fadeInUp 0.8s ease-out ${0.1 + i * 0.1}s forwards`, opacity: 0 }}
                >
                  <h3 className="text-base text-medium text-gray-800 dark:text-white mb-2">{paso.title}</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-300 text-light">{paso.desc}</p>
                </div>
              ))}
            </div>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <a
                href={SINIESTRO_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center px-6 py-3 text-white bg-[#38507E] rounded-lg hover:bg-[#2d4066] transform transition-all duration-300 hover:scale-105 hover:shadow-lg text-sm font-medium"
              >
                Gestionar mi siniestro online
              </a>
              <a
                href={WA_SINIESTRO}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 text-white bg-green-500 hover:bg-green-600 rounded-lg transform transition-all duration-300 hover:scale-105 hover:shadow-lg text-sm font-medium"
              >
                <MessageCircle size={18} />
                Asistencia por WhatsApp
              </a>
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section id="faq" className="w-full py-12 md:py-24 bg-gray-50 dark:bg-gray-900 scroll-mt-14">
          <div className="container px-4 md:px-6">
            <h2 className="text-3xl text-semibold tracking-tighter sm:text-5xl text-center mb-12 text-gray-800 dark:text-white">
              Preguntas Frecuentes
            </h2>
            <div className="max-w-3xl mx-auto space-y-4">
              {FAQS.map((pair, index) => (
                <div
                  key={index}
                  className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-all duration-300"
                  style={{ animation: `fadeInUp 0.8s ease-out ${0.1 + index * 0.05}s forwards`, opacity: 0 }}
                >
                  <button
                    className="flex justify-between items-center w-full p-4 text-left bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                    onClick={() => setOpenQuestion(openQuestion === index ? null : index)}
                  >
                    <span className="text-medium text-gray-800 dark:text-white">{pair.q}</span>
                    {openQuestion === index ? (
                      <Minus className="h-5 w-5 shrink-0 text-gray-500 dark:text-gray-300 transform transition-transform duration-300" />
                    ) : (
                      <Plus className="h-5 w-5 shrink-0 text-gray-500 dark:text-gray-300 transform transition-transform duration-300 hover:rotate-90" />
                    )}
                  </button>
                  {openQuestion === index && (
                    <div
                      className="p-4 bg-white dark:bg-gray-800"
                      style={{ animation: 'fadeInDown 0.3s ease-out forwards', opacity: 0 }}
                    >
                      <p className="text-gray-600 dark:text-gray-300 text-light">{pair.a}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA final */}
        <section className="w-full py-12 md:py-24 dark:bg-gray-900">
          <MultiWaveAudio />
          <div className="container px-2 md:px-6">
            <div className="flex flex-col items-center space-y-4 text-center">
              <h2 className="pb-4 text-3xl text-semibold tracking-tighter sm:text-4xl md:text-5xl leading-[1.2] bg-gradient-to-r from-[#38507E] via-[#51A09A] to-[#C2DB64] bg-clip-text text-transparent">
                Opera tranquilo. Nosotros protegemos tu campo.
              </h2>
              <p className="mx-auto max-w-[600px] text-gray-500 md:text-xl dark:text-gray-400 text-light">
                Cotiza gratis en menos de 2 minutos y recibe una propuesta hecha a medida.
              </p>
              <button
                onClick={() => scrollTo('cotizar')}
                className="inline-flex items-center justify-center px-8 py-3 text-white bg-[#38507E] rounded-lg hover:bg-[#51A09A] transform transition-all duration-300 hover:scale-105 hover:shadow-lg text-sm font-medium"
              >
                Cotizar mi seguro
              </button>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Sin costo y sin compromiso.
              </p>
            </div>
          </div>
        </section>
      </main>

      <footer className="flex flex-col gap-3 py-6 w-full shrink-0 px-4 md:px-6 border-t">
        <div className="flex flex-col gap-2 sm:flex-row items-center">
          <p className="text-xs text-gray-500 dark:text-gray-400">
            © {new Date().getFullYear()} MIIDO · En alianza con AgroSafe.cl, corredora de seguros.
          </p>
          <nav className="sm:ml-auto flex gap-4 sm:gap-6">
            <a className="text-xs hover:underline underline-offset-4" href="mailto:Contacto@AgroSafe.cl">
              Contacto@AgroSafe.cl
            </a>
            <Link className="text-xs hover:underline underline-offset-4" href="/privacidad">
              Privacidad
            </Link>
            <Link className="text-xs hover:underline underline-offset-4" href="/">
              miido.cl
            </Link>
          </nav>
        </div>
        <p className="text-[10px] text-gray-400 dark:text-gray-500 text-center sm:text-left">
          Corredora inscrita en el Registro de Corredores de Seguros de la Comisión para el Mercado Financiero (CMF), Chile. Respaldados por BCI Seguros · SURA · Zurich · Reale · HDI · MAPFRE · Renta Nacional. Datos protegidos · Cotizar es gratis y sin compromiso.
        </p>
      </footer>

      {/* Botón flotante WhatsApp */}
      <a
        href={WA_COTIZAR}
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-4 right-4 flex items-center bg-green-500 hover:bg-green-600 text-white rounded-full px-4 py-2 shadow-lg transition-all duration-300 ease-in-out z-50 hover:scale-105 transform"
        aria-label="Chat on WhatsApp"
        style={{ animation: 'fadeInUp 0.5s ease-out 1s forwards', opacity: 0 }}
      >
        <MessageCircle size={20} className="mr-2 animate-pulse" />
        <span className="text-sm text-medium">¡Habla con nosotros!</span>
      </a>

      {/* Toggle dark mode */}
      <button
        className="fixed bottom-20 right-4 bg-gray-200 dark:bg-gray-700 p-3 rounded-full shadow-lg transition-all duration-300 ease-in-out z-50 hover:scale-110 transform"
        onClick={toggleDarkMode}
        aria-label="Toggle dark mode"
        style={{ animation: 'fadeInUp 0.5s ease-out 1.2s forwards', opacity: 0 }}
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
