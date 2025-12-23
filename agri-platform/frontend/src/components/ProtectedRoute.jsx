import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function ProtectedRoute({ children }) {
    const { currentUser } = useAuth();

    if (!currentUser) {
        // If not logged in, redirect to home (or show login modal logic can be handled in parent, 
        // but redirect is safer for strict protection)
        // For better UX, we could use a state to open login modal, but redirecting to home 
        // where they can click login is simplest for now.
        alert("Please sign in to access this feature.");
        return <Navigate to="/" replace />;
    }

    return children;
}
