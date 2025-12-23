import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';

export default function LoginModal({ isOpen, onClose }) {
    const [mobile, setMobile] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState(''); // New State
    const [name, setName] = useState(''); // New State
    const [isSignUp, setIsSignUp] = useState(false);
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const { login, signup, updateUserProfile } = useAuth();
    const { t } = useLanguage();

    if (!isOpen) return null;

    async function handleSubmit(e) {
        e.preventDefault();
        try {
            setError('');
            setIsLoading(true);

            // MOCK: Map mobile to email
            const dummyEmail = `${mobile}@agriassist.com`;

            if (isSignUp) {
                // Validation
                if (password !== confirmPassword) {
                    throw new Error("Passwords do not match");
                }
                if (!name.trim()) {
                    throw new Error("Name is required");
                }

                const userCredential = await signup(dummyEmail, password);
                await updateUserProfile(userCredential.user, name);
            } else {
                await login(dummyEmail, password);
            }

            onClose();
            // Reset form
            setMobile(''); setPassword(''); setName(''); setConfirmPassword('');
        } catch (err) {
            console.error(err);
            if (err.message === "Passwords do not match" || err.message === "Name is required") {
                setError(err.message);
            } else if (err.code === 'auth/operation-not-allowed') {
                setError('Email/Password Login is not enabled in Firebase Console.');
            } else if (err.code === 'auth/configuration-not-found') {
                setError('Firebase Auth is not enabled. Go to Console -> Authentication -> Get Started.');
            } else if (err.code === 'auth/invalid-email') {
                setError('Invalid Mobile Number format.');
            } else if (err.code === 'auth/email-already-in-use') {
                setError('Mobile Number already registered. Try login.');
            } else if (err.code === 'auth/weak-password') {
                setError('Password should be at least 6 characters.');
            } else if (err.code === 'auth/user-not-found' || err.code === 'auth/wrong-password' || err.code === 'auth/invalid-credential') {
                setError('Invalid Mobile Number or Password.');
            } else {
                setError(`Failed: ${err.message} (${err.code})`);
            }
        }
    } // Close handleSubmit

    const toggleMode = () => {
        setIsSignUp(!isSignUp);
        setError('');
        setPassword('');
        setConfirmPassword('');
    }; // Close toggleMode

    return (
        <div style={{
            position: 'fixed',
            top: 0, left: 0, right: 0, bottom: 0,
            backgroundColor: 'rgba(0,0,0,0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 2000
        }}>
            <div className="glass-panel" style={{ padding: '2rem', width: '90%', maxWidth: '400px', backgroundColor: 'white' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                    <h2 style={{ margin: 0 }}>{isSignUp ? 'Create Account' : t('login')}</h2>
                    <button onClick={onClose} style={{ background: 'none', border: 'none', fontSize: '1.5rem', cursor: 'pointer' }}>×</button>
                </div>

                {error && <div style={{ color: 'red', marginBottom: '1rem', fontSize: '0.9rem' }}>{error}</div>}

                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>

                    {isSignUp && (
                        <div>
                            <label>Full Name</label>
                            <input
                                type="text"
                                required
                                placeholder="Farmer Name"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                style={{ width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid #ccc' }}
                            />
                        </div>
                    )}

                    <div>
                        <label>Mobile Number</label>
                        <input
                            type="tel"
                            required
                            placeholder="9876543210"
                            pattern="[0-9]{10}"
                            value={mobile}
                            onChange={(e) => setMobile(e.target.value)}
                            style={{ width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid #ccc' }}
                        />
                    </div>
                    <div>
                        <label>Password</label>
                        <input
                            type="password"
                            required
                            placeholder="Min 6 chars"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            style={{ width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid #ccc' }}
                        />
                    </div>

                    {isSignUp && (
                        <div>
                            <label>Confirm Password</label>
                            <input
                                type="password"
                                required
                                placeholder="Re-enter password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                style={{ width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid #ccc' }}
                            />
                        </div>
                    )}
                    <button
                        type="submit"
                        disabled={isLoading}
                        className="btn-primary"
                        style={{ padding: '0.75rem', marginTop: '1rem' }}
                    >
                        {isLoading ? 'Please Wait...' : (isSignUp ? 'Sign Up & Login' : t('login'))}
                    </button>
                </form>

                <div style={{ marginTop: '1rem', textAlign: 'center', fontSize: '0.9rem' }}>
                    {isSignUp ? "Already have an account?" : "New User?"}
                    <button
                        onClick={toggleMode}
                        style={{
                            background: 'none',
                            border: 'none',
                            color: 'var(--color-primary)',
                            fontWeight: 'bold',
                            cursor: 'pointer',
                            textDecoration: 'underline',
                            marginLeft: '5px'
                        }}
                    >
                        {isSignUp ? "Login" : "Create Account"}
                    </button>
                </div>
            </div>
        </div>
    );
}
