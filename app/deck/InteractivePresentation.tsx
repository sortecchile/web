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
  const timestamps = useRef<Record<string, number>>({}); // Tiempos por slide con claves dinámicas
  const [currentSlide, setCurrentSlide] = useState<number>(0); // Slide actual

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
      if (!timestamps.current[currentSlide.toString()]) {
        timestamps.current[currentSlide.toString()] = 0;
      }
      timestamps.current[currentSlide.toString()] += currentTime - (timestamps.current[currentSlide.toString() + "_start"] || currentTime);
    }

    // Actualiza el tiempo de inicio para la nueva lámina
    timestamps.current[newIndex.toString() + "_start"] = Date.now();
    setCurrentSlide(newIndex);
  };

  // Envía los tiempos acumulados a Google Sheets
  const saveTimesToGoogleSheets = async () => {
    console.log("Datos que se envían:", {
      email,
      times: timestamps.current,
    });
  
    try {
      const response = await fetch("https://script.google.com/macros/s/AKfycbyIGHo34BrN8HQbJaeoYJ2wBfGPozEG1qDQhhIc3T1yjQFT4OMkoCg3w7P-l_Cl5djG/exec", {
        method: "POST",
        redirect: "follow",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          times: timestamps.current,
        }),
      });
  
      const text = await response.text();
      console.log("Respuesta del servidor (bruta):", text);
    } catch (error) {
      console.error("Error al enviar los datos:", error);
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

      <button
        onClick={saveTimesToGoogleSheets}
        style={{ marginTop: "20px", padding: "10px 20px", backgroundColor: "#007bff", color: "#fff", border: "none", borderRadius: "4px" }}
      >
        Guardar Datos
      </button>
    </div>
  );
};

export default InteractivePresentation;
