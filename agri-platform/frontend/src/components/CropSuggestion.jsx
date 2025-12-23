import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';

export default function CropSuggestion() {
    const { t } = useLanguage();
    const [formData, setFormData] = useState({
        soilType: 'Alluvial',
        water: 'Borewell',
        location: ''
    });
    const [suggestion, setSuggestion] = useState(null);
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const res = await fetch('http://localhost:5000/api/predict-crop', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });
            const data = await res.json();
            setSuggestion(data);
        } catch (err) {
            console.error(err);
            alert('Failed to connect to backend');
        }
        setLoading(false);
    };

    const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

    return (
        <section id="crops" className="" style={{ padding: '20px 0' }}>
            <h2 style={{ color: 'var(--color-primary)', textAlign: 'center', marginBottom: '40px' }}>
                {t('cropSuggestionsTitle')}
            </h2>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '40px', alignItems: 'start' }}>
                <form className="card" onSubmit={handleSubmit}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>

                        {/* Soil Type */}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                            <label style={{ fontWeight: 500 }}>{t('soilType')}</label>
                            <select name="soilType" value={formData.soilType} onChange={handleChange} style={{ padding: '10px', borderRadius: '8px', border: '1px solid #ccc' }}>
                                <option value="Alluvial">{t('alluvial')}</option>
                                <option value="Black">{t('black')}</option>
                                <option value="Red">{t('red')}</option>
                                <option value="Clay">{t('clay')}</option>
                                <option value="Sandy">{t('sandy')}</option>
                            </select>
                        </div>

                        {/* Water Facility */}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                            <label style={{ fontWeight: 500 }}>{t('waterFacility')}</label>
                            <select name="water" value={formData.water} onChange={handleChange} style={{ padding: '10px', borderRadius: '8px', border: '1px solid #ccc' }}>
                                <option value="Borewell">{t('borewell')}</option>
                                <option value="Canal">{t('canal')}</option>
                                <option value="Rainfed">{t('rainfed')}</option>
                                <option value="Drip">{t('drip')}</option>
                            </select>
                        </div>

                        {/* Location */}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                            <label style={{ fontWeight: 500 }}>{t('location')}</label>
                            <input type="text" name="location" placeholder={t('locationPlaceholder')} required onChange={handleChange} style={{ padding: '10px', borderRadius: '8px', border: '1px solid #ccc' }} />
                        </div>

                    </div>
                    <button type="submit" disabled={loading} className="btn-primary" style={{ width: '100%', marginTop: '20px' }}>
                        {loading ? t('analyzing') : t('analyzeButton')}
                    </button>
                </form>

                {/* Results Panel */}
                <div className="card" style={{ background: suggestion ? 'var(--color-accent)' : '#f9f9f9', minHeight: '300px', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', textAlign: 'center' }}>
                    {!suggestion ? (
                        <div style={{ color: '#888' }}>
                            <div style={{ fontSize: '3rem', marginBottom: '10px' }}>🚜</div>
                            <p>{t('resultsPlaceholder')}</p>
                        </div>
                    ) : (
                        <div>
                            <h3 style={{ color: 'var(--color-primary)', fontSize: '2rem', marginBottom: '10px' }}>{suggestion.name}</h3>
                            <span style={{ background: 'var(--color-primary)', color: 'white', padding: '4px 12px', borderRadius: '20px', fontSize: '0.9rem' }}>
                                {suggestion.confidence} {t('match')}
                            </span>
                            <p style={{ marginTop: '20px', color: 'var(--color-text-main)' }}>{suggestion.tips}</p>
                        </div>
                    )}
                </div>
            </div>
        </section>
    );
}
