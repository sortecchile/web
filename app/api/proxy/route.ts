import { NextResponse } from "next/server";

export async function POST(request: Request) {
    try {
      const body = await request.json();
      const { email, times } = body;
  
      if (!email) {
        throw new Error("Falta el email en la solicitud");
      }
  
      if (!times || Object.keys(times).length === 0) {
        throw new Error("Faltan los tiempos o están vacíos");
      }
  
      const response = await fetch(
        "https://script.google.com/macros/s/AKfycbyIGHo34BrN8HQbJaeoYJ2wBfGPozEG1qDQhhIc3T1yjQFT4OMkoCg3w7P-l_Cl5djG/exec",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email, times }),
        }
      );
  
      if (!response.ok) {
        throw new Error(`Error en el Apps Script: ${response.statusText}`);
      }
  
      const data = await response.json();
      return NextResponse.json(data);
    } catch (error: any) {
      console.error("Error en el backend:", error.message || error);
      return NextResponse.json(
        { success: false, error: error.message || "Error desconocido" },
        { status: 500 }
      );
    }
  }
  