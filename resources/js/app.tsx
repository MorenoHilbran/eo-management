import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Layout from '@/layouts/Layout';
import LoginPage from '@/pages/LoginPage';
import DashboardPage from '@/pages/DashboardPage';
import EventsPage from '@/pages/EventsPage';
import EventDetailPage from '@/pages/EventDetailPage';
import VendorsPage from '@/pages/VendorsPage';
import TransactionsPage from '@/pages/TransactionsPage';
import SOPsPage from '@/pages/SOPsPage';

// Protected route component
function ProtectedRoute({ element }: { element: React.ReactElement }) {
    const token =
        localStorage.getItem('auth_token') ||
        localStorage.getItem('sanctum_token');
    return token ? element : <Navigate to="/login" replace />;
}

export default function App() {
    return (
        <BrowserRouter>
            <Routes>
                {/* Public Routes */}
                <Route path="/login" element={<LoginPage />} />

                {/* Protected Routes */}
                <Route path="/" element={<ProtectedRoute element={<Layout />} />}>
                    <Route index element={<Navigate to="/dashboard" replace />} />
                    <Route path="dashboard" element={<DashboardPage />} />
                    <Route path="events" element={<EventsPage />} />
                    <Route path="events/:eventId" element={<EventDetailPage />} />
                    <Route path="events/create" element={<EventsPage />} />
                    <Route path="vendors" element={<VendorsPage />} />
                    <Route path="transactions" element={<TransactionsPage />} />
                    <Route path="sops" element={<SOPsPage />} />
                </Route>

                {/* Fallback */}
                <Route path="*" element={<Navigate to="/dashboard" replace />} />
            </Routes>
        </BrowserRouter>
    );
}
