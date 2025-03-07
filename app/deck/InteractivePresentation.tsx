"use client";

import React, { useState, useRef } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { Navigation, Pagination, Thumbs } from "swiper/modules";

const slides = [
  "/slides/1.png",
  "/slides/2.png",
  "/slides/3.png",
  // Agrega todas las rutas de tus imágenes aquí
];

const InteractivePresentation: React.FC<{ email: string }> = ({ email }) => {
  const [swiperRef, setSwiperRef] = useState<any>(null);
  const [zoom, setZoom] = useState(1); // Nivel de zoom
  const timestamps = useRef<Record<string, number>>({}); // Tiempos por slide
  const [currentSlide, setCurrentSlide] = useState<number>(0); // Slide actual
  const [isSaving, setIsSaving] = useState(false); // Indicador de guardado
  const [saveStatus, setSaveStatus] = useState<string | null>(null); // Estado del guardado

  // Controla el zoom
  const handleZoomIn = () => setZoom((prev) => Math.min(prev + 0.2, 2));
  const handleZoomOut = () => setZoom((prev) => Math.max(prev - 0.2, 0.5));
  const handleResetZoom = () => setZoom(1);

  // Calcula el tiempo al cambiar de lámina
  const onSlideChange = (swiper: any) => {
    const newIndex = swiper.activeIndex;

    // Calcula el tiempo pasado en la lámina anterior
    const currentTime = Date.now();
    if (currentSlide !== null) {
      const slideKey = currentSlide.toString();
      if (!timestamps.current[slideKey]) {
        timestamps.current[slideKey] = 0;
      }
      timestamps.current[slideKey] += currentTime - (timestamps.current[`${slideKey}_start`] || currentTime);
    }

    // Actualiza el tiempo de inicio para la nueva lámina
    timestamps.current[`${newIndex}_start`] = Date.now();
    setCurrentSlide(newIndex);
  };

  // Calcula los tiempos acumulados para enviar
  const calculateAndValidateTimes = () => {
    const data = { ...timestamps.current };
    Object.keys(data).forEach((key) => {
      if (key.includes("_start")) {
        delete data[key]; // Elimina las claves de tiempo de inicio
      }
    });
    return data;
  };

  // Envía los tiempos acumulados al backend usando el proxy
  const saveTimesToGoogleSheets = async () => {
    setIsSaving(true);
    const times = calculateAndValidateTimes(); // Calcula los tiempos
    console.log("Datos enviados al backend:", { email, times }); // Agrega este log
  
    try {
      const response = await fetch("/api/proxy", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          times,
        }),
      });
  
      if (!response.ok) throw new Error("Error al guardar datos");
      const result = await response.json();
  
      if (result.success) {
        setSaveStatus("Datos guardados exitosamente");
      } else {
        throw new Error(result.error || "Error desconocido");
      }
    } catch (error) {
      console.error("Error al enviar los datos:", error);
      setSaveStatus("Error al guardar los datos");
    } finally {
      setIsSaving(false);
    }
  };
  

  return (
    <div style={{ width: "100%", maxWidth: "800px", margin: "0 auto", position: "relative" }}>
      {/* Controles de Zoom */}
      <div style={{ position: "absolute", top: "10px", right: "10px", zIndex: 10, display: "flex", gap: "10px" }}>
        <button onClick={handleZoomIn} style={{ padding: "5px 10px", background: "#38507e", color: "#fff", borderRadius: "4px" }}>+</button>
        <button onClick={handleZoomOut} style={{ padding: "5px 10px", background: "#38507e", color: "#fff", borderRadius: "4px" }}>-</button>
        <button onClick={handleResetZoom} style={{ padding: "5px 10px", background: "#38507e", color: "#fff", borderRadius: "4px" }}>Reset</button>
      </div>

      {/* Visor Principal */}
      <Swiper
        navigation
        pagination={{ clickable: true }}
        modules={[Navigation, Pagination, Thumbs]}
        style={{ width: "100%", height: "500px", transform: `scale(${zoom})`, transformOrigin: "center" }}
        onSwiper={(swiper) => setSwiperRef(swiper)}
        onSlideChange={onSlideChange}
      >
        {slides.map((slide, index) => (
          <SwiperSlide key={index}>
            <img src={slide} alt={`Slide ${index + 1}`} style={{ width: "100%", height: "100%", objectFit: "contain" }} />
          </SwiperSlide>
        ))}
      </Swiper>

      {/* Botón para Guardar Datos */}
      <button
        onClick={saveTimesToGoogleSheets}
        style={{ marginTop: "20px", padding: "10px 20px", backgroundColor: "#007bff", color: "#fff", border: "none", borderRadius: "4px" }}
      >
        Guardar Datos
      </button>

      {/* Feedback de Estado */}
      <div style={{ marginTop: "10px", textAlign: "center" }}>
        {isSaving && <p>Guardando datos...</p>}
        {saveStatus && <p>{saveStatus}</p>}
      </div>
    </div>
  );
};

export default InteractivePresentation;
