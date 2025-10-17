export const translations = {
  es: {
    // Header
    header: {
      title: "Empower Your Agriculture with AI Vertical Agents",
      subtitle: "Automatiza tus operaciones agrícolas con inteligencia artificial",
    },
    // Navigation
    nav: {
      home: "Inicio",
      features: "Características",
      cases: "Casos de Uso",
      about: "Acerca de",
      contact: "Contacto",
    },
    // Hero Section
    hero: {
      title: "Empower Your Agriculture with AI Vertical Agents",
      subtitle: "Automatiza tus operaciones agrícolas con inteligencia artificial",
      cta: "Comenzar",
    },
    // See it in action
    seeInAction: {
      title: "Véalo en acción",
      subtitle: "Interactúa con nuestro asistente de IA",
      inputPlaceholder: "Escribe un mensaje",
      audioMessage: "Mensaje de audio",
    },
    // Messages in chat
    messages: {
      greeting: "¡Hola! Soy tu asistente agrícola de IA. ¿En qué puedo ayudarte hoy?",
      pruningQuestion: "¿Cómo está el progreso de la poda en el cuartel 2?",
      pruningResponse: "La poda en el cuartel 2 está al 85% de avance. Se han podado 340 de 400 árboles. Tiempo estimado de finalización: 2 horas.",
      machineryQuestion: "Registra una falla en la maquinaria 125",
      machineryResponse: "Se ha registrado con éxito la falla de la maquinaria 125, en el cuartel 3 por rueda pinchada. ¿Quieres ver qué máquinas tienes con fallas y cuáles están reparadas?",
      thanks: "¡Gracias por colaborar 🚜!",
      poweredBy: "Powered by Miido",
    },
    // Features
    features: {
      title: "Características",
      feature1: "Automatización de procesos",
      feature2: "Análisis en tiempo real",
      feature3: "Reportes inteligentes",
    },
    // CTA
    cta: {
      title: "¿Listo para transformar tu operación agrícola?",
      button: "Solicitar Demo",
    },
  },
  en: {
    // Header
    header: {
      title: "Empower Your Agriculture with AI Vertical Agents",
      subtitle: "Automate your agricultural operations with artificial intelligence",
    },
    // Navigation
    nav: {
      home: "Home",
      features: "Features",
      cases: "Use Cases",
      about: "About",
      contact: "Contact",
    },
    // Hero Section
    hero: {
      title: "Empower Your Agriculture with AI Vertical Agents",
      subtitle: "Automate your agricultural operations with artificial intelligence",
      cta: "Get Started",
    },
    // See it in action
    seeInAction: {
      title: "See it in action",
      subtitle: "Interact with our AI assistant",
      inputPlaceholder: "Type a message",
      audioMessage: "Audio message",
    },
    // Messages in chat
    messages: {
      greeting: "Hello! I'm your AI agricultural assistant. How can I help you today?",
      pruningQuestion: "How is the pruning progress in field 2?",
      pruningResponse: "Pruning in field 2 is 85% complete. 340 out of 400 trees have been pruned. Estimated completion time: 2 hours.",
      machineryQuestion: "Register a failure in machinery 125",
      machineryResponse: "Machinery 125 failure has been successfully registered in field 3 due to a flat tire. Would you like to see which machines have failures and which are repaired?",
      thanks: "Thank you for collaborating 🚜!",
      poweredBy: "Powered by Miido",
    },
    // Features
    features: {
      title: "Features",
      feature1: "Process automation",
      feature2: "Real-time analysis",
      feature3: "Smart reports",
    },
    // CTA
    cta: {
      title: "Ready to transform your agricultural operation?",
      button: "Request Demo",
    },
  },
};

export type Language = "es" | "en";
export type TranslationKey = keyof typeof translations.es;

