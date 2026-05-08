import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../../lib/api';
import { useAuth } from '../../../context/AuthContext';
import { Phone, Lock, ArrowRight, Plane, Package, MapPin, Newspaper, Tag, Headphones, UserPlus, LogIn, Mail, MessageCircle, Share2, Camera, Globe } from 'lucide-react';

const CustomerLogin = () => {
    const navigate = useNavigate();
    const { login, user, isCustomer, loading: authLoading } = useAuth();
    const [step, setStep] = useState(1);
    const [phone, setPhone] = useState('');
    const [code, setCode] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    React.useEffect(() => {
        if (!authLoading && isCustomer) {
            navigate('/user');
        }
    }, [isCustomer, authLoading, navigate]);

    if (authLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-white">
                <div className="w-12 h-12 border-4 border-[#F59E0B] border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    const handleRequestOtp = async (e) => {
        e.preventDefault();
        if (!phone || phone.length < 10) {
            setError('Please enter a valid 10-digit mobile number');
            return;
        }
        
        try {
            setLoading(true);
            setError('');
            await api.post('/auth/customer/request-otp', { phone });
            setStep(2);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to request OTP');
        } finally {
            setLoading(false);
        }
    };

    const handleVerifyOtp = async (e) => {
        e.preventDefault();
        if (!code || code.length < 4) {
            setError('Please enter a valid OTP');
            return;
        }

        try {
            setLoading(true);
            setError('');
            const res = await api.post('/auth/customer/verify-otp', { phone, code });
            if (res && res.data) {
                login(res.data.user, res.data.token);
                navigate('/user');
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Invalid OTP');
        } finally {
            setLoading(false);
        }
    };

    const navItems = [
        { icon: <Plane size={16} />, label: 'Airport Transfer' },
        { icon: <Package size={16} />, label: 'Tours Package' },
        { icon: <MapPin size={16} />, label: 'Outstation' },
        { icon: <Newspaper size={16} />, label: 'Posts' },
        { icon: <Tag size={16} />, label: 'Offers' },
        { icon: <Headphones size={16} />, label: 'Contact' },
        { icon: <UserPlus size={16} />, label: 'Become a Partner' },
    ];

    return (
        <div className="min-h-screen bg-gray-50 font-outfit flex flex-col">
            <div className="bg-[#1E1B4B] text-white py-2 px-6 hidden md:flex justify-end gap-6 text-[10px] font-bold uppercase tracking-widest border-b border-white/5">
                <div className="flex items-center gap-2">
                    <Mail size={12} className="text-[#F59E0B]" />
                    <span>support@nammataxi.com</span>
                </div>
                <div className="flex items-center gap-2">
                    <Phone size={12} className="text-[#F59E0B]" />
                    <span>+91 80 4112 4112</span>
                </div>
                <div className="flex items-center gap-2">
                    <Phone size={12} className="text-[#F59E0B]" />
                    <span>+91 8884418188</span>
                </div>
            </div>

            <header className="bg-[#1E1B4B] text-white px-6 py-4 flex justify-between items-center sticky top-0 z-50">
                <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate('/')}>
                    <div className="w-10 h-10 bg-[#F59E0B] rounded-lg flex items-center justify-center shadow-lg">
                        <span className="text-[#1E1B4B] font-black text-2xl">N</span>
                    </div>
                    <div className="flex flex-col">
                        <span className="font-black text-xl tracking-tighter leading-none">NAMMATAXI</span>
                        <span className="text-[8px] font-bold text-[#F59E0B] uppercase tracking-widest">— Your Journey.Our Priority —</span>
                    </div>
                </div>

                <nav className="hidden lg:flex items-center gap-8">
                    {navItems.map((item, i) => (
                        <div key={i} className="flex flex-col items-center gap-1 cursor-pointer group transition-all">
                            <div className="text-white group-hover:text-[#F59E0B] transition-colors">{item.icon}</div>
                            <span className="text-[9px] font-bold uppercase tracking-wider group-hover:text-[#F59E0B] transition-colors">{item.label}</span>
                        </div>
                    ))}
                </nav>

                <button 
                    onClick={() => navigate('/user/bookings')}
                    className="bg-[#F59E0B] text-[#1E1B4B] px-6 py-2.5 rounded-full font-black text-xs shadow-xl active:scale-95 transition-all flex items-center gap-2"
                >
                    <Package size={16} />
                    My Bookings
                </button>
            </header>

            <main className="flex-1 flex flex-col items-center py-16 px-6 bg-white relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-48 bg-[#1E1B4B] -z-10 flex flex-col items-center justify-center">
                    <div className="flex items-center gap-4 text-white">
                        <div className="w-12 h-12 bg-[#F59E0B] rounded-2xl flex items-center justify-center text-[#1E1B4B] shadow-2xl">
                            <Lock size={24} />
                        </div>
                        <h1 className="text-3xl font-black uppercase tracking-tight">Login to My Bookings</h1>
                    </div>
                </div>

                <div className="w-full max-w-md bg-white rounded-[2rem] shadow-[0_20px_50px_rgba(0,0,0,0.1)] border border-gray-100 mt-20 overflow-hidden animate-slide-up">
                    <div className="bg-[#312E81] p-8 text-center text-white">
                        <div className="flex justify-center mb-4">
                            <div className="flex flex-col items-center">
                                <span className="font-black text-2xl tracking-tighter leading-none">NAMMATAXI</span>
                                <span className="text-[8px] font-bold text-[#F59E0B] uppercase tracking-widest">— Your Journey.Our Priority —</span>
                            </div>
                        </div>
                        <h2 className="text-2xl font-black mb-2">Welcome Back</h2>
                        <p className="text-white/60 text-xs font-medium uppercase tracking-widest">Enter your mobile number to receive an OTP</p>
                    </div>

                    <div className="p-8">
                        {error && (
                            <div className="bg-red-50 text-red-500 text-[10px] font-black uppercase tracking-widest p-4 rounded-xl mb-6 text-center border border-red-100">
                                {error}
                            </div>
                        )}

                        {step === 1 ? (
                            <form onSubmit={handleRequestOtp} className="space-y-6">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1 flex items-center gap-2">
                                        <Phone size={12} /> MOBILE NUMBER
                                    </label>
                                    <div className="relative">
                                        <input 
                                            type="tel" 
                                            placeholder="Enter 10-digit mobile number"
                                            className="w-full bg-gray-50 border border-gray-100 rounded-2xl p-4 text-sm font-bold focus:outline-none focus:border-[#F59E0B] focus:bg-white transition-all pr-32"
                                            value={phone}
                                            onChange={e => {
                                                const val = e.target.value.replace(/\D/g, '');
                                                if (val.length <= 10) setPhone(val);
                                            }}
                                            maxLength={10}
                                        />
                                        <button 
                                            type="submit"
                                            disabled={loading}
                                            className="absolute right-2 top-2 bottom-2 bg-[#F59E0B] text-[#1E1B4B] px-4 rounded-xl font-black text-[10px] uppercase tracking-widest shadow-lg active:scale-95 transition-all disabled:opacity-50"
                                        >
                                            {loading ? '...' : 'Send OTP'}
                                        </button>
                                    </div>
                                </div>
                            </form>
                        ) : (
                            <form onSubmit={handleVerifyOtp} className="space-y-6">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1 flex items-center gap-2">
                                        <Lock size={12} /> ENTER OTP
                                    </label>
                                    <input 
                                        type="text" 
                                        placeholder="6-digit OTP"
                                        className="w-full bg-gray-50 border border-gray-100 rounded-2xl p-4 text-sm font-bold text-center tracking-[0.5em] focus:outline-none focus:border-[#F59E0B] focus:bg-white transition-all"
                                        value={code}
                                        onChange={e => setCode(e.target.value)}
                                        maxLength={6}
                                    />
                                </div>
                                <button 
                                    type="submit" 
                                    disabled={loading}
                                    className="w-full bg-[#F59E0B] text-[#1E1B4B] p-5 rounded-2xl font-black uppercase text-xs tracking-[0.1em] shadow-[0_10px_20px_rgba(245,158,11,0.2)] hover:shadow-none transition-all flex items-center justify-center gap-3 active:scale-95 disabled:opacity-50"
                                >
                                    <LogIn size={18} />
                                    {loading ? 'Verifying...' : 'Login & View Bookings'}
                                </button>
                                <button 
                                    type="button" 
                                    onClick={() => setStep(1)}
                                    className="w-full text-center text-gray-400 text-[10px] font-bold uppercase tracking-widest hover:text-[#1E1B4B] transition-colors"
                                >
                                    Change Mobile Number
                                </button>
                            </form>
                        )}
                        <p className="mt-8 text-center text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                            New to NAMMATAXI? <span className="text-[#F59E0B] cursor-pointer hover:underline" onClick={() => navigate('/')}>Book a cab first</span>
                        </p>
                    </div>
                </div>
            </main>

            <div className="bg-[#1E1B4B] py-12 px-6 flex flex-col items-center gap-6 border-b border-white/5">
                 <div className="flex flex-col items-center gap-4">
                    <p className="text-white/60 text-xs font-medium text-center">Book your cab now and travel comfortably across Bangalore and beyond.</p>
                    <button 
                        onClick={() => navigate('/')}
                        className="bg-[#F59E0B] text-[#1E1B4B] px-10 py-4 rounded-full font-black text-sm shadow-2xl active:scale-95 transition-all flex items-center gap-3"
                    >
                        <Plane size={20} />
                        Book Now
                    </button>
                 </div>
            </div>

            <footer className="bg-[#0F172A] text-white py-20 px-6">
                <div className="max-w-7xl mx-auto grid md:grid-cols-4 gap-12">
                    <div className="col-span-1 md:col-span-1">
                        <div className="flex items-center gap-2 mb-6">
                            <div className="w-8 h-8 bg-[#F59E0B] rounded-lg flex items-center justify-center">
                                <span className="text-[#1E1B4B] font-black text-xl">N</span>
                            </div>
                            <div className="flex flex-col">
                                <span className="font-black text-lg tracking-tighter leading-none">NAMMATAXI</span>
                                <span className="text-[7px] font-bold text-[#F59E0B] uppercase tracking-widest">— Your Journey.Our Priority —</span>
                            </div>
                        </div>
                        <p className="text-gray-400 text-xs leading-relaxed mb-8">
                            NAMMATAXI is the most trusted and preferred Bangalore Airport taxi service provider. Book online with ease — AC, Non-AC, SUV, Sedan, and Tempo Traveller.
                        </p>
                        <div className="flex gap-4">
                            {[MessageCircle, Share2, Camera, Globe].map((Icon, i) => (
                                <div key={i} className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center hover:bg-[#F59E0B] hover:text-[#1E1B4B] transition-all cursor-pointer">
                                    <Icon size={14} />
                                </div>
                            ))}
                        </div>
                    </div>

                    <div>
                        <h4 className="font-black text-sm uppercase tracking-widest mb-8 flex items-center gap-2">Explore <div className="w-8 h-1 bg-[#F59E0B] rounded-full"></div></h4>
                        <ul className="space-y-4 text-xs font-bold text-gray-400 uppercase tracking-wider">
                            <li className="hover:text-white cursor-pointer transition-colors flex items-center gap-2"><ArrowRight size={12} className="text-[#F59E0B]" /> Offers & Coupons</li>
                            <li className="hover:text-white cursor-pointer transition-colors flex items-center gap-2"><ArrowRight size={12} className="text-[#F59E0B]" /> Terms & Conditions</li>
                            <li className="hover:text-white cursor-pointer transition-colors flex items-center gap-2"><ArrowRight size={12} className="text-[#F59E0B]" /> Cancellation Policy</li>
                            <li className="hover:text-white cursor-pointer transition-colors flex items-center gap-2"><ArrowRight size={12} className="text-[#F59E0B]" /> Contact Us</li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="font-black text-sm uppercase tracking-widest mb-8 flex items-center gap-2">Services <div className="w-8 h-1 bg-[#F59E0B] rounded-full"></div></h4>
                        <ul className="space-y-4 text-xs font-bold text-gray-400 uppercase tracking-wider">
                            <li className="hover:text-white cursor-pointer transition-colors flex items-center gap-2"><ArrowRight size={12} className="text-[#F59E0B]" /> Airport Transfer</li>
                            <li className="hover:text-white cursor-pointer transition-colors flex items-center gap-2"><ArrowRight size={12} className="text-[#F59E0B]" /> Tours Package</li>
                            <li className="hover:text-white cursor-pointer transition-colors flex items-center gap-2"><ArrowRight size={12} className="text-[#F59E0B]" /> Outstation</li>
                            <li className="hover:text-white cursor-pointer transition-colors flex items-center gap-2"><ArrowRight size={12} className="text-[#F59E0B]" /> Become a Driver</li>
                            <li className="hover:text-white cursor-pointer transition-colors flex items-center gap-2"><ArrowRight size={12} className="text-[#F59E0B]" /> Become a Partner</li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="font-black text-sm uppercase tracking-widest mb-8 flex items-center gap-2">Contact Info <div className="w-8 h-1 bg-[#F59E0B] rounded-full"></div></h4>
                        <ul className="space-y-6 text-xs font-bold text-gray-400 uppercase tracking-wider">
                            <li className="flex gap-3 items-start">
                                <MapPin size={16} className="text-[#F59E0B] flex-shrink-0" />
                                <span>12/1 7th Cross, 1st Main, Maruti Nagar, Madiwala, Bangalore 560068</span>
                            </li>
                            <li className="flex gap-3 items-center">
                                <Mail size={16} className="text-[#F59E0B]" />
                                <span>support@nammataxi.com</span>
                            </li>
                            <li className="flex gap-3 items-center">
                                <Phone size={16} className="text-[#F59E0B]" />
                                <span>+91 80 4112 4112</span>
                            </li>
                            <li className="flex gap-3 items-center">
                                <Phone size={16} className="text-[#F59E0B]" />
                                <span>+91 8884418188</span>
                            </li>
                            <li className="flex gap-3 items-center">
                                <MapPin size={16} className="text-[#F59E0B]" />
                                <span className="text-white hover:underline cursor-pointer">www.nammataxi.com</span>
                            </li>
                        </ul>
                    </div>
                </div>
                <div className="mt-20 pt-8 border-t border-white/5 text-center">
                    <p className="text-[10px] font-bold text-gray-500 uppercase tracking-[0.2em]">
                        © 2026 <span className="text-[#F59E0B]">NAMMATAXI.</span> All Rights Reserved. | Crafted with 💛 in Bangalore
                    </p>
                </div>
            </footer>
        </div>
    );
};

export default CustomerLogin;
