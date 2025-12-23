import React, { useState, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { showWeatherNotification } from '../utils/notificationHelper';

export default function WeatherWidget() {
    const { t } = useLanguage();
    const [forecast, setForecast] = useState([]);
    const [locationName, setLocationName] = useState('Loading...');
    const [cityInput, setCityInput] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Try to load from cache first for instant speed
        const cached = localStorage.getItem('weatherCache');
        if (cached) {
            const parsed = JSON.parse(cached);
            setForecast(parsed.forecast);
            setLocationName(parsed.cityName);
            setLoading(false);
        }

        // Auto-detect location on first load
        if (!navigator.geolocation) {
            fetchWeather();
        } else {
            navigator.geolocation.getCurrentPosition(
                (pos) => {
                    fetchWeather(`?lat=${pos.coords.latitude}&lon=${pos.coords.longitude}`);
                },
                (err) => {
                    fetchWeather(); // Fallback to default city
                }
            );
        }
    }, []);

    const fetchWeather = (params = '') => {
        setLoading(true);
        fetch(`http://localhost:5000/api/weather${params}`)
            .then(res => res.json())
            .then(data => {
                if (data.forecast) {
                    setForecast(data.forecast);
                    setLocationName(data.cityName);
                    // Update cache
                    localStorage.setItem('weatherCache', JSON.stringify(data));

                    // Check for severe weather alerts
                    const severeWeather = data.forecast.find(day =>
                        ['Rain', 'Thunderstorm', 'Tornado', 'Squall', 'Ash', 'Sand', 'Dust'].includes(day.condition)
                    );
                    if (severeWeather) {
                        showWeatherNotification(
                            `Weather Alert: ${severeWeather.condition}`,
                            `In ${data.cityName}: ${severeWeather.temp} with ${severeWeather.condition.toLowerCase()}. Plan your farming accordingly.`
                        );
                    }
                } else if (data.error) {
                    alert(`Weather Error: ${data.error}`);
                }
                setLoading(false);
            })
            .catch(err => {
                console.error("Weather fetch failed", err);
                setLoading(false);
            });
    };

    const handleSearch = (e) => {
        e.preventDefault();
        if (cityInput.trim()) {
            fetchWeather(`?city=${encodeURIComponent(cityInput)}`);
            setCityInput('');
        }
    };

    const handleCurrentLocation = () => {
        if (!navigator.geolocation) {
            alert("Geolocation is not supported by your browser");
            return;
        }
        setLoading(true);
        navigator.geolocation.getCurrentPosition(
            (pos) => {
                fetchWeather(`?lat=${pos.coords.latitude}&lon=${pos.coords.longitude}`);
            },
            (err) => {
                alert("Unable to retrieve your location. Please check your browser permissions.");
                setLoading(false);
            }
        );
    };

    return (
        <section id="weather" className="container" style={{ padding: '60px 20px', scrollMarginTop: '80px' }}>
            <div className="glass-panel" style={{ padding: '40px', borderRadius: 'var(--radius-lg)' }}>
                {/* Header & Controls */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '30px', flexWrap: 'wrap', gap: '20px' }}>
                    <div>
                        <h2 style={{ color: 'var(--color-primary)' }}>{t('weatherForecastTitle')}</h2>
                        <p style={{ color: '#666' }}>{locationName}</p>
                    </div>

                    <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                        <form onSubmit={handleSearch} style={{ display: 'flex', gap: '5px' }}>
                            <input
                                type="text"
                                placeholder={t('weatherSearchPlaceholder')}
                                value={cityInput}
                                onChange={(e) => setCityInput(e.target.value)}
                                style={{
                                    padding: '10px 15px',
                                    borderRadius: '25px',
                                    border: '1px solid #ddd',
                                    width: '200px'
                                }}
                            />
                            <button type="submit" className="btn-primary" style={{ padding: '10px 20px' }}>🔍</button>
                        </form>
                        <button
                            onClick={handleCurrentLocation}
                            className="btn-primary"
                            style={{ padding: '10px 20px', backgroundColor: 'var(--color-secondary)' }}
                            title="Use My Location"
                        >
                            📍
                        </button>
                    </div>
                </div>

                {loading ? (
                    <div style={{ textAlign: 'center', padding: '40px' }}>{t('loadingWeather')}</div>
                ) : (
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
                        gap: '15px'
                    }}>
                        {forecast.map((day, index) => (
                            <div key={index} className="card" style={{
                                textAlign: 'center',
                                background: 'white',
                                padding: '20px 10px',
                                transition: 'transform 0.3s ease'
                            }}>
                                <h4 style={{ color: '#888', marginBottom: '10px', fontSize: '0.9rem' }}>{day.day}</h4>
                                <div style={{ fontSize: '2.5rem', margin: '10px 0' }}>{day.icon}</div>
                                <h3 style={{ fontSize: '1.5rem', color: 'var(--color-text-main)' }}>{day.temp}</h3>
                                <p style={{ color: 'var(--color-secondary)', fontWeight: 500, fontSize: '0.9rem' }}>{day.condition}</p>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </section>
    );
}
