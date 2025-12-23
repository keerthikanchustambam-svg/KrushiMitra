import React, { createContext, useContext, useState } from 'react';
import { translations } from '../translations';

const LanguageContext = createContext();

export function useLanguage() {
    return useContext(LanguageContext);
}

export function LanguageProvider({ children }) {
    const [language, setLanguage] = useState('en'); // Default 'en'

    const t = translations[language];

    // Helper function to get text, falling back to key if missing
    const getText = (key) => {
        return t[key] || key;
    }

    const value = {
        language,
        setLanguage,
        t: getText,
        translations: t
    };

    return (
        <LanguageContext.Provider value={value}>
            {children}
        </LanguageContext.Provider>
    );
}
