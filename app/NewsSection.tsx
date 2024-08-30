import { useRef, useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { ChevronLeft, ChevronRight } from 'lucide-react'

const NewsSection = () => {
  const scrollContainerRef = useRef<HTMLDivElement>(null)
  const [showLeftArrow, setShowLeftArrow] = useState(false)
  const [showRightArrow, setShowRightArrow] = useState(true)

  const newsItems = [
    {
        id: 7,
        title: "Agricultura 4.0 para cerezos",
        description: "Participamos en MIIDO en el Seminario Agricultura 4.0 para cerezos, organizado por Copeval. ",
        image: "/Cerezas.svg",
      },
    {
        id: 6,
        title: "GTT Maule",
        description: "Encuentro regional de GTT del Maule realizado ayer en el Liceo Agrícola San José de Duao. #agrotech.",
        image: "/gtt.png",
      },
    {
      id: 1,
      title: "Seleccionados por Startup Chile",
      description: "Fuimos seleccionados para el programa Build2 e ignite 5 de Startup Chile, una de las mejores aceleradoras de negocios del mundo.",
      image: "/StartupChile.svg",
    },
    {
      id: 2,
      title: "Primer lugar competencia mundial Babson Collaborative Global student Challenge",
      description: "Competimos con más de 2000 emprendedores de todo el mundo y ganamos el primer lugar, permitiéndonos estudiar en la Universidad #1 de emprendimiento en el mundo.",
      image: "/babson.svg",
    },
    {
      id: 3,
      title: "Acelerados en Suiza 🇨🇭 - START Fellowship",
      description: "Acelerados en Suiza con la posibilidad de conocer el ecosistema europeo y la industria agro en el continente viejo.",
      image: "/START.svg",
    },
    // Add more news items as needed
  ]

  useEffect(() => {
    const container = scrollContainerRef.current
    if (container) {
      const handleScroll = () => {
        setShowLeftArrow(container.scrollLeft > 0)
        setShowRightArrow(
          container.scrollLeft < container.scrollWidth - container.clientWidth
        )
      }
      container.addEventListener('scroll', handleScroll)
      handleScroll() // Check initial state
      return () => container.removeEventListener('scroll', handleScroll)
    }
  }, [])

  const scroll = (direction: 'left' | 'right') => {
    const container = scrollContainerRef.current
    if (container) {
      const scrollAmount = container.clientWidth
      container.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth',
      })
    }
  }

  return (
    <section className="w-full py-12 md:py-24 lg:py-32 bg-gray-100 dark:bg-gray-800">
      <div className="container px-4 md:px-6">
        <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl text-center mb-12 text-primary">Últimas publicaciones</h2>
        <div className="relative">
          {showLeftArrow && (
            <button
              onClick={() => scroll('left')}
              className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white dark:bg-gray-800 p-2 rounded-full shadow-md"
              aria-label="Scroll left"
            >
              <ChevronLeft className="h-6 w-6" />
            </button>
          )}
          {showRightArrow && (
            <button
              onClick={() => scroll('right')}
              className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white dark:bg-gray-800 p-2 rounded-full shadow-md"
              aria-label="Scroll right"
            >
              <ChevronRight className="h-6 w-6" />
            </button>
          )}
          <div
            ref={scrollContainerRef}
            className="flex overflow-x-auto space-x-6 pb-4 scrollbar-hide"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {newsItems.map((item) => (
              <div key={item.id} className="flex-shrink-0 w-full max-w-sm">
                <div className="bg-white dark:bg-gray-900 rounded-lg shadow-lg overflow-hidden">
                  <Image src={item.image} alt={item.title} width={400} height={400} className="w-full h-48 object-cover" />
                  <div className="p-6">
                    <h3 className="text-xl font-bold mb-2">{item.title}</h3>
                    <p className="text-gray-600 dark:text-gray-400 mb-4">{item.description}</p>
                    
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

export default NewsSection