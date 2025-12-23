import React from 'react';
import CropSuggestion from '../components/CropSuggestion';
import { useLanguage } from '../context/LanguageContext';

export default function Crops() {
    const { t } = useLanguage();
    return (
        <div className="container" style={{ paddingTop: '100px', paddingBottom: '40px' }}>
            <h1>{t('crops')}</h1>
            <p>{t('smartCropDesc')}</p>
            <CropSuggestion />
        </div>
    );
}
