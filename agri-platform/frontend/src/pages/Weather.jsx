import React from 'react';
import WeatherWidget from '../components/WeatherWidget';
import { useLanguage } from '../context/LanguageContext';

export default function Weather() {
    const { t } = useLanguage();
    return (
        <div className="container" style={{ paddingTop: '100px', paddingBottom: '40px' }}>
            <h1>{t('weather')}</h1>
            <p>{t('weatherAlertsDesc')}</p>
            <WeatherWidget />
        </div>
    );
}
