import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Home, Heart, ShoppingBag, Settings, Calendar } from 'lucide-react';

const BottomNav = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const path = location.pathname;

    return (
        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50">
            <div className="bg-obsidian/95 backdrop-blur-xl px-8 py-4 rounded-full shadow-2xl shadow-black/40 flex items-center gap-10 border border-white/5">
                <button 
                    onClick={() => navigate('/user')} 
                    className={`transition-all duration-300 ${path === '/user' ? 'text-white scale-110' : 'text-white/40 hover:text-white/60'}`}
                >
                    <Home size={22} strokeWidth={path === '/user' ? 2.5 : 2} />
                </button>
                <button 
                    onClick={() => navigate('/user/bookings')}
                    className={`transition-all duration-300 ${path === '/user/bookings' ? 'text-white scale-110' : 'text-white/40 hover:text-white/60'}`}
                >
                    <Calendar size={22} strokeWidth={path === '/user/bookings' ? 2.5 : 2} />
                </button>
                <button 
                    onClick={() => navigate('/user/notifications')}
                    className={`transition-all duration-300 ${path.includes('notifications') ? 'text-white scale-110' : 'text-white/40 hover:text-white/60'}`}
                >
                    <ShoppingBag size={22} strokeWidth={path.includes('notifications') ? 2.5 : 2} />
                </button>
                <button 
                    onClick={() => navigate('/user/profile')}
                    className={`transition-all duration-300 ${path.includes('profile') ? 'text-white scale-110' : 'text-white/40 hover:text-white/60'}`}
                >
                    <Settings size={22} strokeWidth={path.includes('profile') ? 2.5 : 2} />
                </button>
            </div>
        </div>
    );
};

export default BottomNav;
