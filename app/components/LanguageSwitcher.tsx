'use client';

import { useLanguageContext } from '@/app/i18n/LanguageProvider';

export const LanguageSwitcher = () => {
  const { language, changeLanguage, isClient } = useLanguageContext();

  if (!isClient) {
    return null;
  }

  return (
    <div className="flex items-center gap-0.5 bg-gradient-to-r from-gray-700 to-gray-800 rounded-lg p-0.5 border border-gray-600 shadow-lg hover:shadow-xl transition-shadow duration-300">
      <button
        onClick={() => changeLanguage('es')}
        className={`px-3 py-1.5 rounded text-xs font-semibold transition-all duration-300 ${
          language === 'es'
            ? 'bg-gradient-to-r from-[#51A09A] to-[#3d8a85] text-white shadow-md'
            : 'text-gray-400 hover:text-gray-200'
        }`}
      >
        ES
      </button>
      <div className="w-px h-4 bg-gray-600"></div>
      <button
        onClick={() => changeLanguage('en')}
        className={`px-3 py-1.5 rounded text-xs font-semibold transition-all duration-300 ${
          language === 'en'
            ? 'bg-gradient-to-r from-[#51A09A] to-[#3d8a85] text-white shadow-md'
            : 'text-gray-400 hover:text-gray-200'
        }`}
      >
        EN
      </button>
    </div>
  );
};

