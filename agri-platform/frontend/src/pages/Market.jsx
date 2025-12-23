import React from 'react';
import MarketPrice from '../components/MarketPrice';
import { useLanguage } from '../context/LanguageContext';

export default function Market() {
    const { t } = useLanguage();
    return (
        <div className="container" style={{ paddingTop: '100px', paddingBottom: '40px' }}>
            <h1>{t('market')}</h1>
            <p>{t('marketTrendsDesc')}</p>
            <MarketPrice />
        </div>
    );
}
