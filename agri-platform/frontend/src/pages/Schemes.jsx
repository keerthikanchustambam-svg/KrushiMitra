import React from 'react';
import SchemesComponent from '../components/Schemes';
import { useLanguage } from '../context/LanguageContext';

export default function Schemes() {
    const { t } = useLanguage();
    return (
        <div className="container" style={{ paddingTop: '100px', paddingBottom: '40px' }}>
            <h1>{t('schemes')}</h1>
            <p>{t('govtSchemesDesc')}</p>
            <SchemesComponent />
        </div>
    );
}
