import React from 'react';
import { useLanguage } from '../context/LanguageContext';

export default function MarketPrice() {
    const { t } = useLanguage();
    const [prices, setPrices] = React.useState([]);

    React.useEffect(() => {
        fetch('http://localhost:5000/api/market')
            .then(res => res.json())
            .then(data => setPrices(data));
    }, []);

    if (prices.length === 0) return <div className="container" style={{ padding: '40px' }}>{t('loadingPrices')}</div>;

    return (
        <section id="market" className="container" style={{ padding: '60px 20px' }}>
            <h2 style={{ color: 'var(--color-primary)', marginBottom: '30px' }}>{t('mandiPricesTitle')}</h2>

            <div className="card" style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '600px' }}>
                    <thead>
                        <tr style={{ background: 'var(--color-accent)', color: 'var(--color-primary)', textAlign: 'left' }}>
                            <th style={{ padding: '16px', borderRadius: '8px 0 0 8px' }}>{t('cropHeader')}</th>
                            <th style={{ padding: '16px' }}>{t('regionHeader')}</th>
                            <th style={{ padding: '16px' }}>{t('currentPriceHeader')}</th>
                            <th style={{ padding: '16px' }}>{t('lastUpdatedHeader')}</th>
                            <th style={{ padding: '16px', borderRadius: '0 8px 8px 0' }}>{t('trendHeader')}</th>
                        </tr>
                    </thead>
                    <tbody>
                        {prices.map((item, index) => (
                            <tr key={index} style={{ borderBottom: '1px solid #eee' }}>
                                <td style={{ padding: '16px', fontWeight: 600 }}>{item.crop}</td>
                                <td style={{ padding: '16px', color: '#666' }}>{item.mandi}</td>
                                <td style={{ padding: '16px', fontWeight: 700, color: 'var(--color-text-main)' }}>{item.price}</td>
                                <td style={{ padding: '16px', fontSize: '0.9rem', color: '#888' }}>{item.last_updated}</td>
                                <td style={{ padding: '16px' }}>
                                    {item.trend === 'up' && <span style={{ color: 'green' }}>{t('rising')}</span>}
                                    {item.trend === 'down' && <span style={{ color: 'red' }}>{t('falling')}</span>}
                                    {item.trend === 'stable' && <span style={{ color: 'orange' }}>{t('stable')}</span>}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </section>
    );
}
