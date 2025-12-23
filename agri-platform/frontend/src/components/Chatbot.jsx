import React, { useState, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';

export default function Chatbot() {
    const { t, language } = useLanguage();
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([]);

    // Set initial message when language changes
    useEffect(() => {
        setMessages([{ role: 'bot', text: t('botWelcome') }]);
    }, [language, t]);

    const [input, setInput] = useState('');

    const handleSend = () => {
        if (!input.trim()) return;

        const userMsg = input;
        setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
        setInput('');

        // Mock AI Response
        setTimeout(() => {
            let botResponse = t('botDefault');
            const lowerMsg = userMsg.toLowerCase();

            if (lowerMsg.includes('weather') || lowerMsg.includes('వాతావరణం')) {
                botResponse = t('botWeather');
            } else if (lowerMsg.includes('crop') || lowerMsg.includes('plant') || lowerMsg.includes('పంట')) {
                botResponse = t('botCrop');
            } else if (lowerMsg.includes('price') || lowerMsg.includes('market') || lowerMsg.includes('ధర')) {
                botResponse = t('botMarket');
            } else if (lowerMsg.includes('hello') || lowerMsg.includes('hi') || lowerMsg.includes('నమస్తే')) {
                botResponse = t('botHello');
            }

            setMessages(prev => [...prev, { role: 'bot', text: botResponse }]);
        }, 1000);
    };

    return (
        <>
            {/* Floating Button */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                style={{
                    position: 'fixed',
                    bottom: '20px',
                    right: '20px',
                    width: '60px',
                    height: '60px',
                    borderRadius: '50%',
                    backgroundColor: 'var(--color-primary)',
                    color: 'white',
                    border: 'none',
                    fontSize: '24px',
                    boxShadow: 'var(--shadow-lg)',
                    cursor: 'pointer',
                    zIndex: 1100
                }}
            >
                💬
            </button>

            {/* Chat Window */}
            {isOpen && (
                <div className="glass-panel" style={{
                    position: 'fixed',
                    bottom: '90px',
                    right: '20px',
                    width: '300px',
                    height: '400px',
                    backgroundColor: 'white',
                    zIndex: 1100,
                    display: 'flex',
                    flexDirection: 'column',
                    overflow: 'hidden'
                }}>
                    {/* Header */}
                    <div style={{ padding: '15px', backgroundColor: 'var(--color-primary)', color: 'white', fontWeight: 'bold', display: 'flex', justifyContent: 'space-between' }}>
                        <span>{t('chatbotTitle')}</span>
                        <span onClick={() => setIsOpen(false)} style={{ cursor: 'pointer' }}>×</span>
                    </div>

                    {/* Messages */}
                    <div style={{ flex: 1, padding: '15px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                        {messages.map((msg, idx) => (
                            <div key={idx} style={{
                                alignSelf: msg.role === 'user' ? 'flex-end' : 'flex-start',
                                backgroundColor: msg.role === 'user' ? '#e1ffc7' : '#f0f0f0',
                                padding: '8px 12px',
                                borderRadius: '12px',
                                maxWidth: '80%',
                                fontSize: '0.9rem'
                            }}>
                                {msg.text}
                            </div>
                        ))}
                    </div>

                    {/* Input */}
                    <div style={{ padding: '10px', borderTop: '1px solid #eee', display: 'flex', gap: '5px', alignItems: 'center' }}>
                        <input
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                            placeholder={t('chatbotPlaceholder')}
                            style={{ flex: 1, padding: '8px', borderRadius: '20px', border: '1px solid #ccc' }}
                        />

                        {/* Voice Button */}
                        <button
                            onClick={() => {
                                const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
                                if (!SpeechRecognition) {
                                    alert("Speech recognition is not supported in this browser.");
                                    return;
                                }
                                const recognition = new SpeechRecognition();
                                recognition.lang = language === 'te' ? 'te-IN' : 'en-US';
                                recognition.start();
                                recognition.onresult = (event) => {
                                    setInput(event.results[0][0].transcript);
                                };
                            }}
                            style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '18px' }}
                            title="Voice Input"
                        >
                            🎤
                        </button>

                        <button onClick={handleSend} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '18px' }}>➤</button>
                    </div>
                </div>
            )}
        </>
    );
}
