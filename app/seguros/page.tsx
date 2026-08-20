import type { Metadata } from "next";
import SegurosClient from "./SegurosClient";

export const metadata: Metadata = {
  title: "Seguros para el agro — MIIDO × AgroSafe",
  description:
    "Protege tus cultivos, animales, maquinaria, flotas y colaboradores. Cotiza gratis y recibe una propuesta con el respaldo de las principales aseguradoras de Chile. En alianza con AgroSafe, corredora certificada CMF.",
};

export default function AgrosafePage() {
  return <SegurosClient />;
}
