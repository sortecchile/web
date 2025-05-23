"use client";

import React, { useState } from "react";
import InteractivePresentation from "./InteractivePresentation"; // Asegúrate de tener este componente correctamente configurado

const MailPopup: React.FC = () => {
  const [email, setEmail] = useState(""); // Almacena el email ingresado
  const [isEmailCaptured, setIsEmailCaptured] = useState(false); // Controla si el email fue enviado con éxito

  // Maneja el envío del email
  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
  
    if (email) {
      try {
        const response = await fetch("/api/proxy", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email,
            times: {}, // Envía un objeto vacío si no hay datos aún
          }),
        });
  
        const result = await response.json();
        console.log("Respuesta del proxy:", result);
  
        if (result.success) {
          console.log("Email enviado correctamente:", email);
          setIsEmailCaptured(true);
        } else {
          console.error("Error al guardar el email:", result.error);
          alert("Error al guardar el email: " + result.error);
        }
      } catch (error) {
        console.error("Error al enviar el email:", error);
        alert("Hubo un error al enviar el email.");
      }
    } else {
      alert("Por favor, ingresa un email válido.");
    }
  };
  

  return (
    <div>
      {/* Si el email no ha sido capturado, mostrar el popup */}
      {!isEmailCaptured ? (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            backgroundColor: "rgba(0,0,0,0.5)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1000,
          }}
        >
          <div
            style={{
              backgroundColor: "#fff",
              padding: "20px",
              borderRadius: "8px",
              boxShadow: "0 2px 10px rgba(0,0,0,0.3)",
              width: "300px",
              textAlign: "center",
            }}
          >
            <h2>¡Accede al Deck!</h2>
            <p>Por favor, ingresa tu email para continuar:</p>
            <form onSubmit={handleEmailSubmit}>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)} // Actualiza el email ingresado
                placeholder="Ingresa tu email"
                style={{
                  width: "100%",
                  padding: "10px",
                  margin: "10px 0",
                  borderRadius: "4px",
                  border: "1px solid #ccc",
                }}
                required
              />
              <button
                type="submit"
                style={{
                  padding: "10px 20px",
                  backgroundColor: "#007bff",
                  color: "white",
                  border: "none",
                  borderRadius: "4px",
                  cursor: "pointer",
                }}
              >
                Enviar
              </button>
            </form>
          </div>
        </div>
      ) : (
        // Si el email fue capturado, mostrar el componente interactivo
        <InteractivePresentation email={email} />
      )}
    </div>
  );
};

export default MailPopup;
