import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plane, Package, MapPin, Newspaper, Tag, Headphones, UserPlus, Phone, Mail, MessageCircle, Share2, Camera, Globe, ChevronRight, Calendar, Clock, Star, ShieldCheck, Zap } from 'lucide-react';
import SEO from '../components/SEO';
import heroTaxi from '../../../assets/hero_taxi.png';

const LandingPage = () => {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('airport');
    const [airportMode, setAirportMode] = useState('pickup');
    
    // Form States
    const [pickupLocation, setPickupLocation] = useState('');
    const [dropLocation, setDropLocation] = useState('');
    const [pickupDate, setPickupDate] = useState('');
    const [pickupTime, setPickupTime] = useState('');
    const [phone, setPhone] = useState('');
    const [showTimeDropdown, setShowTimeDropdown] = useState(false);

    const navItems = [
        { icon: <Plane size={16} />, label: 'Airport Transfer' },
        { icon: <Package size={16} />, label: 'Tours Package' },
        { icon: <MapPin size={16} />, label: 'Outstation' },
        { icon: <Newspaper size={16} />, label: 'Posts' },
        { icon: <Tag size={16} />, label: 'Offers' },
        { icon: <Headphones size={16} />, label: 'Contact' },
        { icon: <UserPlus size={16} />, label: 'Become a Partner' },
    ];

    const handleBookingSubmit = (e) => {
        e.preventDefault();
        // For now, redirect to login to continue booking
        navigate('/user/login');
    };

    return (
        <div className="min-h-screen bg-[#0F172A] font-outfit text-white overflow-x-hidden">
            <SEO pageName="home" />
            
            {/* Top Bar */}
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

            {/* Header */}
            <header className="bg-[#1E1B4B]/80 backdrop-blur-md px-6 py-4 flex justify-between items-center sticky top-0 z-50 border-b border-white/5">
                <div className="flex items-center gap-2">
                    <div className="w-10 h-10 bg-[#F59E0B] rounded-lg flex items-center justify-center shadow-lg">
                        <span className="text-[#1E1B4B] font-black text-2xl">N</span>
                    </div>
                    <div className="flex flex-col">
                        <span className="font-black text-xl tracking-tighter leading-none text-white">NAMMATAXI</span>
                        <span className="text-[8px] font-bold text-[#F59E0B] uppercase tracking-widest">— Your Journey.Our Priority —</span>
                    </div>
                </div>

                <nav className="hidden lg:flex items-center gap-8">
                    {navItems.map((item, i) => (
                        <div key={i} className="flex flex-col items-center gap-1 cursor-pointer group transition-all">
                            <div className="text-white/70 group-hover:text-[#F59E0B] transition-colors">{item.icon}</div>
                            <span className="text-[9px] font-bold uppercase tracking-wider group-hover:text-[#F59E0B] transition-colors">{item.label}</span>
                        </div>
                    ))}
                </nav>

                <button 
                    onClick={() => navigate('/user/login')}
                    className="bg-[#F59E0B] text-[#1E1B4B] px-6 py-2.5 rounded-full font-black text-xs shadow-xl active:scale-95 transition-all flex items-center gap-2"
                >
                    <Package size={16} />
                    My Bookings
                </button>
            </header>

            {/* Hero Section */}
            <main className="relative pt-20 pb-32 px-6">
                <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 items-center">
                    {/* Left: Text Content */}
                    <div className="animate-fade-in-up">
                        <h1 className="text-5xl lg:text-7xl font-black leading-[1.1] mb-8">
                            Bangalore's Most <br />
                            <span className="text-[#F59E0B]">Trusted</span> Airport Taxi
                        </h1>
                        
                        <ul className="space-y-4 mb-10">
                            {[
                                'Airport Pickup starting from ₹ 699/-',
                                'Airport Drop starting from ₹ 849/-',
                                'Airport Round Trip from ₹ 1,499/-',
                                'No Surge, No Hidden Charges, No Toll (Airport routes)',
                                '24/7 Support — No Worry About Flight Delays',
                                'Free Rescheduling on Flight Delays'
                            ].map((text, i) => (
                                <li key={i} className="flex items-center gap-3 text-lg font-medium text-white/80">
                                    <div className="w-5 h-5 bg-[#F59E0B]/20 rounded-full flex items-center justify-center shrink-0">
                                        <ShieldCheck size={14} className="text-[#F59E0B]" />
                                    </div>
                                    {text}
                                </li>
                            ))}
                        </ul>

                        <div className="flex flex-wrap gap-4">
                            <div className="bg-[#1E1B4B] p-4 rounded-2xl border border-white/5 flex items-center gap-4">
                                <div className="w-12 h-12 bg-[#F59E0B] rounded-xl flex items-center justify-center text-[#1E1B4B]">
                                    <Tag size={24} />
                                </div>
                                <div>
                                    <p className="text-[10px] font-black uppercase tracking-widest text-[#F59E0B]">Active Offers</p>
                                    <p className="font-bold text-sm">AIRPORT PICKUP 10.00 AM TO 4.00PM</p>
                                    <p className="text-xs text-white/50">5% OFF • Max ₹300</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right: Booking Form */}
                    <div className="bg-white rounded-[2rem] shadow-2xl overflow-hidden animate-slide-up">
                        <div className="flex border-b border-gray-100">
                            {[
                                { id: 'airport', label: 'Airport', icon: <Plane size={14} /> },
                                { id: 'tours', label: 'Tours', icon: <Package size={14} /> },
                                { id: 'outstation', label: 'Outstation', icon: <MapPin size={14} /> }
                            ].map((tab) => (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id)}
                                    className={`flex-1 py-5 flex items-center justify-center gap-2 text-xs font-black uppercase tracking-widest transition-all
                                        ${activeTab === tab.id ? 'bg-white text-[#1E1B4B] border-b-2 border-[#F59E0B]' : 'bg-gray-50 text-gray-400'}`}
                                >
                                    {tab.icon}
                                    {tab.label}
                                </button>
                            ))}
                        </div>

                        <div className="p-8">
                            {activeTab === 'airport' && (
                                <div className="flex gap-2 mb-8">
                                    <button 
                                        onClick={() => setAirportMode('pickup')}
                                        className={`flex-1 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all border
                                            ${airportMode === 'pickup' ? 'bg-[#F59E0B]/10 border-[#F59E0B] text-[#F59E0B]' : 'bg-gray-50 border-gray-100 text-gray-400'}`}
                                    >
                                        <div className="flex items-center justify-center gap-2"><Plane size={12} className="rotate-45" /> Airport Pickup</div>
                                    </button>
                                    <button 
                                        onClick={() => setAirportMode('drop')}
                                        className={`flex-1 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all border
                                            ${airportMode === 'drop' ? 'bg-[#F59E0B]/10 border-[#F59E0B] text-[#F59E0B]' : 'bg-gray-50 border-gray-100 text-gray-400'}`}
                                    >
                                        <div className="flex items-center justify-center gap-2"><Plane size={12} className="-rotate-135" /> Airport Drop</div>
                                    </button>
                                    <button 
                                        onClick={() => setAirportMode('round')}
                                        className={`flex-1 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all border
                                            ${airportMode === 'round' ? 'bg-[#F59E0B]/10 border-[#F59E0B] text-[#F59E0B]' : 'bg-gray-50 border-gray-100 text-gray-400'}`}
                                    >
                                        <div className="flex items-center justify-center gap-2"><Globe size={12} /> Round Trip</div>
                                    </button>
                                </div>
                            )}

                            <form onSubmit={handleBookingSubmit} className="space-y-6">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
                                        <MapPin size={12} className="text-[#F59E0B]" /> Pickup Place
                                    </label>
                                    <input 
                                        type="text" 
                                        placeholder="Enter pickup location..."
                                        className="w-full bg-gray-50 border border-gray-100 rounded-2xl p-4 text-sm font-bold text-gray-900 focus:outline-none focus:border-[#F59E0B] focus:bg-white transition-all"
                                        value={pickupLocation}
                                        onChange={(e) => setPickupLocation(e.target.value)}
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
                                        <MapPin size={12} className="text-[#F59E0B]" /> Drop Place
                                    </label>
                                    <input 
                                        type="text" 
                                        placeholder="Enter destination..."
                                        className="w-full bg-gray-50 border border-gray-100 rounded-2xl p-4 text-sm font-bold text-gray-900 focus:outline-none focus:border-[#F59E0B] focus:bg-white transition-all"
                                        value={dropLocation}
                                        onChange={(e) => setDropLocation(e.target.value)}
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2 relative">
                                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
                                            <Calendar size={12} className="text-[#F59E0B]" /> Pickup Date
                                        </label>
                                        <input 
                                            type="date" 
                                            className="w-full bg-gray-50 border border-gray-100 rounded-2xl p-4 text-sm font-bold text-gray-900 focus:outline-none focus:border-[#F59E0B] focus:bg-white transition-all cursor-pointer relative z-10"
                                            value={pickupDate}
                                            onChange={(e) => setPickupDate(e.target.value)}
                                            onClick={(e) => {
                                                try {
                                                    e.target.showPicker();
                                                } catch (err) {
                                                    console.warn('showPicker not supported');
                                                }
                                            }}
                                        />
                                    </div>
                                    <div className="space-y-2 relative">
                                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
                                            <Clock size={12} className="text-[#F59E0B]" /> Pickup Time
                                        </label>
                                        <div className="relative">
                                            <div 
                                                onClick={() => setShowTimeDropdown(!showTimeDropdown)}
                                                className="w-full bg-gray-50 border border-gray-100 rounded-2xl p-4 text-sm font-bold text-gray-900 focus:outline-none border-gray-100 cursor-pointer flex justify-between items-center transition-all hover:bg-white hover:border-[#F59E0B]"
                                            >
                                                <span>{pickupTime ? Array.from({ length: 96 }).map((_, i) => {
                                                    const h = Math.floor(i / 4);
                                                    const m = (i % 4) * 15;
                                                    const val = `${h.toString().padStart(2, '0')}:${m === 0 ? '00' : m}`;
                                                    if (val === pickupTime) {
                                                        const ampm = h >= 12 ? 'PM' : 'AM';
                                                        const dh = h % 12 === 0 ? 12 : h % 12;
                                                        return `${dh}:${m === 0 ? '00' : m} ${ampm}`;
                                                    }
                                                    return null;
                                                }).find(Boolean) : 'Select time'}</span>
                                                <ChevronRight size={16} className={`text-gray-400 transition-transform ${showTimeDropdown ? 'rotate-90' : 'rotate-0'}`} />
                                            </div>

                                            {showTimeDropdown && (
                                                <div className="absolute top-full left-0 w-full mt-2 bg-white border border-gray-100 rounded-2xl shadow-2xl z-[100] max-h-60 overflow-y-auto no-scrollbar py-2 animate-in fade-in slide-in-from-top-2 duration-200">
                                                    {Array.from({ length: 96 }).map((_, i) => {
                                                        const hour = Math.floor(i / 4);
                                                        const minute = (i % 4) * 15;
                                                        const ampm = hour >= 12 ? 'PM' : 'AM';
                                                        const displayHour = hour % 12 === 0 ? 12 : hour % 12;
                                                        const displayMinute = minute === 0 ? '00' : minute;
                                                        const timeString = `${displayHour}:${displayMinute} ${ampm}`;
                                                        const value = `${hour.toString().padStart(2, '0')}:${displayMinute}`;
                                                        
                                                        return (
                                                            <div 
                                                                key={i}
                                                                onClick={() => {
                                                                    setPickupTime(value);
                                                                    setShowTimeDropdown(false);
                                                                }}
                                                                className={`px-6 py-3 text-[13px] font-bold cursor-pointer transition-colors hover:bg-[#F59E0B]/5 hover:text-[#F59E0B]
                                                                    ${pickupTime === value ? 'bg-[#F59E0B]/10 text-[#F59E0B]' : 'text-gray-600'}`}
                                                            >
                                                                {timeString}
                                                            </div>
                                                        );
                                                    })}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
                                        <Phone size={12} className="text-[#F59E0B]" /> Phone Number
                                    </label>
                                    <input 
                                        type="tel" 
                                        placeholder="10-digit mobile number"
                                        className="w-full bg-gray-50 border border-gray-100 rounded-2xl p-4 text-sm font-bold text-gray-900 focus:outline-none focus:border-[#F59E0B] focus:bg-white transition-all"
                                        value={phone}
                                        onChange={(e) => setPhone(e.target.value)}
                                        maxLength={10}
                                    />
                                </div>

                                <button 
                                    type="submit"
                                    className="w-full bg-[#F59E0B] text-[#1E1B4B] p-5 rounded-2xl font-black uppercase text-xs tracking-widest shadow-2xl hover:shadow-none transition-all active:scale-95 mt-4"
                                >
                                    Login & Book Now
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </main>

            {/* Features/Stats Section */}
            <section className="bg-white text-[#1E1B4B] py-24 px-6">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-20">
                        <h2 className="text-4xl font-black mb-4 uppercase tracking-tight">Incredible Destinations at Incredible Deals</h2>
                        <p className="text-gray-500 font-medium">Book your cab now and travel comfortably across Bangalore and beyond.</p>
                        <div className="w-20 h-1.5 bg-[#F59E0B] mx-auto rounded-full mt-6"></div>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        {[
                            { title: 'Zero Cancellations', desc: 'Once you book, your ride is guaranteed. We respect your time.', icon: <Zap size={32} /> },
                            { title: 'Flat Pricing', desc: 'No hidden charges or surge pricing. What you see is what you pay.', icon: <Tag size={32} /> },
                            { title: 'Clean Fleet', desc: 'Sanitized cars and professional drivers for a premium experience.', icon: <ShieldCheck size={32} /> }
                        ].map((feature, i) => (
                            <div key={i} className="bg-gray-50 p-10 rounded-[3rem] border border-gray-100 hover:border-[#F59E0B]/20 transition-all group">
                                <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center text-[#F59E0B] mb-8 shadow-sm group-hover:scale-110 transition-transform">
                                    {feature.icon}
                                </div>
                                <h3 className="text-2xl font-black mb-4 uppercase tracking-tight">{feature.title}</h3>
                                <p className="text-gray-500 font-medium leading-relaxed">{feature.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="bg-[#0F172A] text-white py-24 px-6 border-t border-white/5">
                <div className="max-w-7xl mx-auto grid md:grid-cols-4 gap-16">
                    <div>
                        <div className="flex items-center gap-2 mb-8">
                            <div className="w-10 h-10 bg-[#F59E0B] rounded-lg flex items-center justify-center">
                                <span className="text-[#1E1B4B] font-black text-2xl">N</span>
                            </div>
                            <div className="flex flex-col">
                                <span className="font-black text-xl tracking-tighter leading-none">NAMMATAXI</span>
                                <span className="text-[8px] font-bold text-[#F59E0B] uppercase tracking-widest">— Your Journey.Our Priority —</span>
                            </div>
                        </div>
                        <p className="text-white/50 text-sm leading-relaxed mb-8">
                            NAMMATAXI is the most trusted and preferred Bangalore Airport taxi service provider. Book online with ease.
                        </p>
                        <div className="flex gap-4">
                            {[MessageCircle, Share2, Camera, Globe].map((Icon, i) => (
                                <div key={i} className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center hover:bg-[#F59E0B] hover:text-[#1E1B4B] transition-all cursor-pointer">
                                    <Icon size={18} />
                                </div>
                            ))}
                        </div>
                    </div>

                    <div>
                        <h4 className="font-black text-sm uppercase tracking-widest mb-10 flex items-center gap-3">
                            Explore <div className="w-8 h-1 bg-[#F59E0B] rounded-full"></div>
                        </h4>
                        <ul className="space-y-4 text-xs font-bold text-white/40 uppercase tracking-widest">
                            <li className="hover:text-[#F59E0B] cursor-pointer transition-colors">Offers & Coupons</li>
                            <li className="hover:text-[#F59E0B] cursor-pointer transition-colors">Terms & Conditions</li>
                            <li className="hover:text-[#F59E0B] cursor-pointer transition-colors">Cancellation Policy</li>
                            <li className="hover:text-[#F59E0B] cursor-pointer transition-colors">Contact Us</li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="font-black text-sm uppercase tracking-widest mb-10 flex items-center gap-3">
                            Services <div className="w-8 h-1 bg-[#F59E0B] rounded-full"></div>
                        </h4>
                        <ul className="space-y-4 text-xs font-bold text-white/40 uppercase tracking-widest">
                            <li className="hover:text-[#F59E0B] cursor-pointer transition-colors">Airport Transfer</li>
                            <li className="hover:text-[#F59E0B] cursor-pointer transition-colors">Tours Package</li>
                            <li className="hover:text-[#F59E0B] cursor-pointer transition-colors">Outstation</li>
                            <li className="hover:text-[#F59E0B] cursor-pointer transition-colors">Become a Driver</li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="font-black text-sm uppercase tracking-widest mb-10 flex items-center gap-3">
                            Contact Info <div className="w-8 h-1 bg-[#F59E0B] rounded-full"></div>
                        </h4>
                        <ul className="space-y-6 text-xs font-bold text-white/40 uppercase tracking-widest">
                            <li className="flex gap-3">
                                <MapPin size={16} className="text-[#F59E0B] shrink-0" />
                                <span>12/1 7th Cross, Maruti Nagar, Madiwala, Bangalore 560068</span>
                            </li>
                            <li className="flex gap-3 items-center">
                                <Mail size={16} className="text-[#F59E0B]" />
                                <span>support@nammataxi.com</span>
                            </li>
                            <li className="flex gap-3 items-center">
                                <Phone size={16} className="text-[#F59E0B]" />
                                <span>+91 80 4112 4112</span>
                            </li>
                        </ul>
                    </div>
                </div>
            </footer>

            {/* Bottom Sticky Action (Mobile) */}
            <div className="md:hidden fixed bottom-6 left-6 right-6 z-50">
                <button 
                    onClick={() => navigate('/user/login')}
                    className="w-full bg-[#F59E0B] text-[#1E1B4B] py-5 rounded-2xl font-black uppercase text-xs tracking-widest shadow-[0_20px_40px_rgba(245,158,11,0.4)] flex items-center justify-center gap-3 active:scale-95"
                >
                    <Zap size={18} />
                    Book Now
                </button>
            </div>
        </div>
    );
};

export default LandingPage;
