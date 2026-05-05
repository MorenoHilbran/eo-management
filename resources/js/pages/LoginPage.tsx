import React, { useState } from 'react';
import { useMutation } from '@/hooks';

interface LoginPageProps {
    onLoginSuccess?: (token: string) => void;
}

export default function LoginPage({ onLoginSuccess }: LoginPageProps) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errors, setErrors] = useState<Record<string, string>>({});

    const { mutate: login, loading } = useMutation<string>(
        async (credentials: { email: string; password: string }) => {
            const { apiClient } = await import('@/lib/api-client');
            const response = await apiClient.post('/login', credentials);
            return { data: response.data.access_token as string };
        },
        {
            onSuccess: (token) => {
                localStorage.setItem('auth_token', token);
                localStorage.setItem('sanctum_token', token);
                localStorage.setItem('user_email', email);
                
                // Redirect or callback
                if (onLoginSuccess) {
                    onLoginSuccess(token);
                } else {
                    window.location.href = '/dashboard';
                }
            },
            onError: (error: any) => {
                const message = error.response?.data?.message || String(error);
                setErrors({ form: message });
            },
        }
    );

    const validateForm = () => {
        const newErrors: Record<string, string> = {};
        if (!email) newErrors.email = 'Email harus diisi';
        if (!password) newErrors.password = 'Password harus diisi';
        return newErrors;
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const newErrors = validateForm();
        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }
        login({ email, password });
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg shadow-xl p-8 w-full max-w-md">
                {/* Header */}
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-gray-900">Event Manager</h1>
                    <p className="text-gray-600 mt-2">Sistem Manajemen Event Profesional</p>
                </div>

                {/* Error Message */}
                {errors.form && (
                    <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                        <p className="text-sm text-red-600">{errors.form}</p>
                    </div>
                )}

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Email */}
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                            Email
                        </label>
                        <input
                            type="email"
                            id="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className={`mt-2 w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                                errors.email ? 'border-red-500' : 'border-gray-300'
                            }`}
                            placeholder="admin@example.com"
                            disabled={loading}
                            autoComplete="email"
                        />
                        {errors.email && (
                            <p className="mt-1 text-xs text-red-600">{errors.email}</p>
                        )}
                    </div>

                    {/* Password */}
                    <div>
                        <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                            Password
                        </label>
                        <input
                            type="password"
                            id="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className={`mt-2 w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                                errors.password ? 'border-red-500' : 'border-gray-300'
                            }`}
                            placeholder="••••••••"
                            disabled={loading}
                            autoComplete="current-password"
                        />
                        {errors.password && (
                            <p className="mt-1 text-xs text-red-600">{errors.password}</p>
                        )}
                    </div>

                    {/* Login Button */}
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 disabled:bg-gray-400 transition-colors"
                    >
                        {loading ? 'Logging in...' : 'Login'}
                    </button>
                </form>

              
              
            </div>
        </div>
    );
}
