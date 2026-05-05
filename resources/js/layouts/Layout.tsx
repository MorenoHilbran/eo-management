import React from 'react';
import { Outlet, useLocation, useNavigate, Link } from 'react-router-dom';
import { BarChart3, Calendar, Users, CreditCard, FileText, Menu, ChevronLeft, LogOut } from 'lucide-react';

export default function Layout() {
    const location = useLocation();
    const navigate = useNavigate();
    const [sidebarOpen, setSidebarOpen] = React.useState(true);

    const handleLogout = () => {
        localStorage.removeItem('auth_token');
        localStorage.removeItem('sanctum_token');
        localStorage.removeItem('user_email');
        navigate('/login');
    };

    const isActive = (path: string) => location.pathname.startsWith(path);

    const menuItems = [
        { label: 'Dashboard', path: '/dashboard', icon: <BarChart3 className="w-5 h-5" /> },
        { label: 'Events', path: '/events', icon: <Calendar className="w-5 h-5" /> },
        { label: 'Vendors', path: '/vendors', icon: <Users className="w-5 h-5" /> },
        { label: 'Transactions', path: '/transactions', icon: <CreditCard className="w-5 h-5" /> },
        { label: 'SOPs', path: '/sops', icon: <FileText className="w-5 h-5" /> },
    ];

    return (
        <div className="min-h-screen bg-gray-50/50">
            {/* Sidebar */}
            <aside
                className={`fixed left-0 top-0 h-screen bg-white text-gray-800 border-r border-gray-200 transition-all duration-300 z-40 ${
                    sidebarOpen ? 'w-64' : 'w-20'
                }`}
            >
                {/* Logo */}
                <div className="h-16 flex items-center justify-between px-4 border-b border-gray-100">
                    {sidebarOpen && <span className="text-lg font-semibold text-gray-900 tracking-tight">Event Management</span>}
                    <button
                        onClick={() => setSidebarOpen(!sidebarOpen)}
                        className="p-1.5 hover:bg-gray-100 rounded-md transition-colors text-gray-500"
                    >
                        {sidebarOpen ? <ChevronLeft className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                    </button>
                </div>

                {/* Menu */}
                <nav className="p-3 space-y-1 mt-2">
                    {menuItems.map((item) => (
                        <Link
                            key={item.path}
                            to={item.path}
                            className={`flex items-center gap-3 px-3 py-2.5 rounded-md transition-colors ${
                                isActive(item.path)
                                    ? 'bg-blue-50 text-blue-600 font-medium'
                                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                            }`}
                            title={!sidebarOpen ? item.label : undefined}
                        >
                            <span className={isActive(item.path) ? 'text-blue-600' : 'text-gray-400'}>{item.icon}</span>
                            {sidebarOpen && <span>{item.label}</span>}
                        </Link>
                    ))}
                </nav>

                {/* Logout Button */}
                <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-100 bg-white">
                    <button
                        onClick={handleLogout}
                        className={`flex items-center justify-center gap-2 w-full py-2 bg-red-50 hover:bg-red-100 text-red-600 font-medium rounded-md transition-colors text-sm ${!sidebarOpen && 'px-2'}`}
                        title={!sidebarOpen ? 'Logout' : undefined}
                    >
                        <LogOut className="w-4 h-4" />
                        {sidebarOpen && 'Logout'}
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className={`${sidebarOpen ? 'ml-64' : 'ml-20'} transition-all duration-300`}>
                {/* Top Bar */}
                <header className="h-16 bg-white/80 backdrop-blur-sm border-b border-gray-200 px-8 flex justify-between items-center sticky top-0 z-30">
                    <div>
                        <h2 className="text-lg font-semibold text-gray-800">
                            Event Management
                        </h2>
                    </div>
                    <div className="flex items-center gap-3">
                        <span className="text-sm font-medium text-gray-600">
                            {localStorage.getItem('user_email') || 'User'}
                        </span>
                        <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-700 font-semibold text-sm">
                            {(localStorage.getItem('user_email')?.[0] || 'U').toUpperCase()}
                        </div>
                    </div>
                </header>

                {/* Page Content */}
                <div className="p-8 max-w-7xl mx-auto">
                    <Outlet />
                </div>
            </main>
        </div>
    );
}
