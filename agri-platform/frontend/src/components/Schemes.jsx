import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';

export default function Schemes() {
    const { t } = useLanguage();
    const [schemes, setSchemes] = useState([]);

    React.useEffect(() => {
        fetch('http://localhost:5000/api/schemes')
            .then(res => res.json())
            .then(data => setSchemes(data));
    }, []);

    return (
        <section id="schemes" className="container" style={{ padding: '60px 20px', background: '#eaf4e0', borderRadius: '24px', margin: '40px auto' }}>
            <h2 style={{ color: 'var(--color-primary)', textAlign: 'center', marginBottom: '40px' }}>{t('schemesTitle')}</h2>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '30px' }}>
                {schemes.map((scheme, index) => (
                    <div key={index} className="card" style={{ borderLeft: '5px solid var(--color-secondary)' }}>
                        <h3 style={{ color: 'var(--color-primary)', marginBottom: '10px' }}>{scheme.name}</h3>
                        <p style={{ color: '#666', marginBottom: '15px' }}>{scheme.eligibility}</p>
                        <div style={{ background: 'var(--color-accent)', color: 'var(--color-text-main)', padding: '10px', borderRadius: '8px', fontWeight: 600 }}>
                            {t('benefitLabel')}: {scheme.benefit}
                        </div>
                        <button className="btn-primary" style={{ width: '100%', marginTop: '20px', padding: '10px' }}>{t('checkEligibility')}</button>
                    </div>
                ))}
            </div>
        </section>
    );
}
