import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useNavigate } from 'react-router-dom';

export default function StartFarming() {
    const { t } = useLanguage();
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        soilType: 'Alluvial',
        crop: '',
        waterFacility: 'Borewell'
    });

    const handleSubmit = (e) => {
        e.preventDefault();

        // Growth duration lookup in days
        const cropDurations = {
            'Rice': 120,
            'Paddy': 120,
            'Cotton': 180,
            'Maize': 110,
            'Wheat': 130,
            'Chilli': 150,
            'Tobacco': 120,
            'Banana': 300
        };

        const targetDays = cropDurations[formData.crop] || 120;

        // Save to local storage for tracking on Home page
        const trackingData = {
            ...formData,
            startDate: new Date().toISOString(),
            targetDays: targetDays,
            lastUpdate: "Just started"
        };
        localStorage.setItem('activeCrop', JSON.stringify(trackingData));
        navigate('/');
    };

    return (
        <div className="container" style={{ paddingTop: '120px', maxWidth: '600px' }}>
            <div className="card" style={{ padding: '40px' }}>
                <h2 style={{ color: 'var(--color-primary)', marginBottom: '10px' }}>{t('farmingStartTitle')}</h2>
                <p style={{ color: '#666', marginBottom: '30px' }}>{t('farmingStartDesc')}</p>

                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    <div>
                        <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600 }}>{t('soilType')}</label>
                        <select
                            value={formData.soilType}
                            onChange={(e) => setFormData({ ...formData, soilType: e.target.value })}
                            style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #ccc' }}
                        >
                            <option value="Alluvial">{t('alluvial')}</option>
                            <option value="Black">{t('black')}</option>
                            <option value="Red">{t('red')}</option>
                            <option value="Clay">{t('clay')}</option>
                            <option value="Sandy">{t('sandy')}</option>
                        </select>
                    </div>

                    <div>
                        <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600 }}>{t('cropNameLabel')}</label>
                        <input
                            type="text"
                            required
                            placeholder={t('cropNameLabel')}
                            value={formData.crop}
                            onChange={(e) => setFormData({ ...formData, crop: e.target.value })}
                            style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #ccc' }}
                        />
                    </div>

                    <div>
                        <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600 }}>{t('waterFacility')}</label>
                        <select
                            value={formData.waterFacility}
                            onChange={(e) => setFormData({ ...formData, waterFacility: e.target.value })}
                            style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #ccc' }}
                        >
                            <option value="Borewell">{t('borewell')}</option>
                            <option value="Canal">{t('canal')}</option>
                            <option value="Rainfed">{t('rainfed')}</option>
                            <option value="Drip">{t('drip')}</option>
                        </select>
                    </div>

                    <button type="submit" className="btn-primary" style={{ padding: '15px', marginTop: '10px' }}>
                        {t('submitFarming')}
                    </button>
                </form>
            </div>
        </div>
    );
}
