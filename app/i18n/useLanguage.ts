'use client';

import { useState, useEffect, useCallback } from 'react';
import { translations, Language } from './translations';

export const useLanguage = () => {
  const [language, setLanguage] = useState<Language>('es');
  const [isClient, setIsClient] = useState(false);

  // Detectar idioma del navegador al montar el componente
  useEffect(() => {
    setIsClient(true);
    
    // Primero, intentar obtener el idioma guardado en localStorage
    const savedLanguage = localStorage.getItem('language') as Language | null;
    if (savedLanguage && (savedLanguage === 'es' || savedLanguage === 'en')) {
      setLanguage(savedLanguage);
      return;
    }

    // Si no hay idioma guardado, detectar del navegador
    const browserLanguage = navigator.language.split('-')[0];
    if (browserLanguage === 'es') {
      setLanguage('es');
      localStorage.setItem('language', 'es');
    } else if (browserLanguage === 'en') {
      setLanguage('en');
      localStorage.setItem('language', 'en');
    } else {
      // Por defecto, usar español
      setLanguage('es');
      localStorage.setItem('language', 'es');
    }
  }, []);

  // Función para cambiar el idioma
  const changeLanguage = useCallback((newLanguage: Language) => {
    setLanguage(newLanguage);
    localStorage.setItem('language', newLanguage);
  }, []);

  // Función para obtener traducciones
  const t = useCallback((path: string): string => {
    const keys = path.split('.');
    let value: any = translations[language];

    for (const key of keys) {
      if (value && typeof value === 'object' && key in value) {
        value = value[key];
      } else {
        return path; // Retornar la ruta si no encuentra la traducción
      }
    }

    return typeof value === 'string' ? value : path;
  }, [language]);

  return {
    language,
    changeLanguage,
    t,
    isClient,
  };
};

