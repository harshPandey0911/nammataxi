import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
    User, Bell, Search, Sparkles, Sliders, 
    Heart, Star, X, MapPin, Phone, 
    Calendar, Clock, ChevronRight
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import SEO from '../components/SEO';
import { services } from '../../../data';

const Home = ({ 
    user,
    activeService, setActiveService, 
    airportMode, setAirportMode, 
    location, setLocation, 
    dropLocation, setDropLocation, 
    pickupDate, setPickupDate, 
    pickupTime, setPickupTime, 
    phoneNumber, setPhoneNumber, 
    selectedPackage, setSelectedPackage, 
    outstationMode, setOutstationMode, 
    returnDate, setReturnDate,
    handleSearch,
    globalCategories = [],
    isBookingVisible,
    setIsBookingVisible
}) => {
    const navigate = useNavigate();
    const [errors, setErrors] = useState({});

    const validateAndSearch = () => {
        let newErrors = {};
        if (!location || location === 'Fetching live location...') newErrors.location = 'Pickup is required';
        if (!dropLocation) newErrors.dropLocation = 'Destination is required';
        if (!phoneNumber) newErrors.phoneNumber = 'Contact number is required';
        else if (!/^\d{10}$/.test(phoneNumber.replace(/[^0-9]/g, ''))) newErrors.phoneNumber = 'Invalid phone number';
        if (!pickupDate) newErrors.pickupDate = 'Date is required';
        if (!pickupTime) newErrors.pickupTime = 'Time is required';

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }
        setErrors({});
        handleSearch();
    };

    return (
        <div className="min-h-screen bg-[#F8F9FB] font-outfit pb-32 overflow-y-auto no-scrollbar">
            <SEO pageName="user" />
            
            {/* 1. Premium Header */}
            <div className="px-6 pt-8 pb-4 bg-white/80 backdrop-blur-md sticky top-0 z-40 flex justify-between items-center border-b border-black/5">
                <div className="flex items-center gap-3">
                    <motion.div 
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => navigate('/user/profile')}
                        className="w-12 h-12 rounded-2xl overflow-hidden shadow-lg shadow-black/5 cursor-pointer border-2 border-white"
                    >
                        <img src={`https://ui-avatars.com/api/?name=${user?.name || 'User'}&background=000&color=fff&bold=true`} alt="profile" className="w-full h-full object-cover" />
                    </motion.div>
                    <div>
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Welcome Back</p>
                        <h2 className="text-sm font-black text-obsidian tracking-tight flex items-center gap-1">
                            {user?.name || 'Guest'} <Sparkles size={12} className="text-yellow-500 fill-yellow-500" />
                        </h2>
                    </div>
                </div>
                <button className="w-10 h-10 bg-white rounded-xl shadow-sm flex items-center justify-center border border-black/5 active:scale-90 transition-all">
                    <div className="relative">
                        <Bell size={18} className="text-obsidian opacity-60" />
                        <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
                    </div>
                </button>
            </div>

            {/* 2. Integrated Booking Card (The "Top" Section requested) */}
            <div className="px-6 mt-6">
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white rounded-[2.5rem] p-6 shadow-xl shadow-black/[0.03] border border-black/5"
                >
                    <div className="space-y-4">
                        {/* Pickup */}
                        <div className="relative group">
                            <div className="absolute left-4 top-1/2 -translate-y-1/2 w-8 h-8 bg-gray-50 rounded-lg flex items-center justify-center group-focus-within:bg-obsidian group-focus-within:text-white transition-all">
                                <MapPin size={14} />
                            </div>
                            <input 
                                type="text"
                                placeholder="Pickup Location"
                                value={location}
                                onChange={(e) => setLocation(e.target.value)}
                                className={`w-full bg-gray-50 border-none rounded-2xl py-4 pl-14 pr-4 text-xs font-bold focus:ring-2 transition-all ${errors.location ? 'ring-2 ring-red-500/20' : 'focus:ring-obsidian/10'}`}
                            />
                            {errors.location && <p className="text-[9px] text-red-500 font-bold mt-1 ml-4 uppercase tracking-tighter">{errors.location}</p>}
                        </div>

                        {/* Drop */}
                        <div className="relative group">
                            <div className="absolute left-4 top-1/2 -translate-y-1/2 w-8 h-8 bg-gray-50 rounded-lg flex items-center justify-center group-focus-within:bg-obsidian group-focus-within:text-white transition-all">
                                <Search size={14} />
                            </div>
                            <input 
                                type="text"
                                placeholder="Where to?"
                                value={dropLocation}
                                onChange={(e) => setDropLocation(e.target.value)}
                                className={`w-full bg-gray-50 border-none rounded-2xl py-4 pl-14 pr-4 text-xs font-bold focus:ring-2 transition-all ${errors.dropLocation ? 'ring-2 ring-red-500/20' : 'focus:ring-obsidian/10'}`}
                            />
                            {errors.dropLocation && <p className="text-[9px] text-red-500 font-bold mt-1 ml-4 uppercase tracking-tighter">{errors.dropLocation}</p>}
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            {/* Contact */}
                            <div className="relative group col-span-2">
                                <div className="absolute left-4 top-1/2 -translate-y-1/2 w-8 h-8 bg-gray-50 rounded-lg flex items-center justify-center group-focus-within:bg-obsidian group-focus-within:text-white transition-all">
                                    <Phone size={14} />
                                </div>
                                <input 
                                    type="tel"
                                    placeholder="Contact Number"
                                    value={phoneNumber}
                                    onChange={(e) => setPhoneNumber(e.target.value)}
                                    className={`w-full bg-gray-50 border-none rounded-2xl py-4 pl-14 pr-4 text-xs font-bold focus:ring-2 transition-all ${errors.phoneNumber ? 'ring-2 ring-red-500/20' : 'focus:ring-obsidian/10'}`}
                                />
                                {errors.phoneNumber && <p className="text-[9px] text-red-500 font-bold mt-1 ml-4 uppercase tracking-tighter">{errors.phoneNumber}</p>}
                            </div>

                            {/* Date */}
                            <div className="relative group">
                                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                                    <Calendar size={14} />
                                </div>
                                <input 
                                    type="date"
                                    value={pickupDate}
                                    onChange={(e) => setPickupDate(e.target.value)}
                                    className={`w-full bg-gray-50 border-none rounded-2xl py-4 pl-12 pr-4 text-[10px] font-bold focus:ring-2 transition-all appearance-none ${errors.pickupDate ? 'ring-2 ring-red-500/20' : 'focus:ring-obsidian/10'}`}
                                />
                                {errors.pickupDate && <p className="text-[9px] text-red-500 font-bold mt-1 ml-4 uppercase tracking-tighter">{errors.pickupDate}</p>}
                            </div>

                            {/* Time */}
                            <div className="relative group">
                                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                                    <Clock size={14} />
                                </div>
                                <input 
                                    type="time"
                                    value={pickupTime}
                                    onChange={(e) => setPickupTime(e.target.value)}
                                    className={`w-full bg-gray-50 border-none rounded-2xl py-4 pl-12 pr-4 text-[10px] font-bold focus:ring-2 transition-all appearance-none ${errors.pickupTime ? 'ring-2 ring-red-500/20' : 'focus:ring-obsidian/10'}`}
                                />
                                {errors.pickupTime && <p className="text-[9px] text-red-500 font-bold mt-1 ml-4 uppercase tracking-tighter">{errors.pickupTime}</p>}
                            </div>
                        </div>

                        <motion.button 
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={validateAndSearch}
                            className="w-full bg-obsidian text-white py-4 rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-black/20 flex items-center justify-center gap-2"
                        >
                            Find Your Ride
                            <ChevronRight size={16} />
                        </motion.button>
                    </div>
                </motion.div>
            </div>

            {/* 3. Horizontal Categories */}
            <div className="px-6 mt-10">
                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-base font-black text-obsidian tracking-tight uppercase">Categories</h3>
                    <button className="text-[10px] font-black text-gray-400 hover:text-obsidian transition-colors">View All</button>
                </div>
                <div className="overflow-x-auto no-scrollbar flex gap-6 pb-4">
                    {services.map(service => (
                        <motion.div 
                            key={service.id} 
                            whileTap={{ scale: 0.9 }}
                            onClick={() => { setActiveService(service.id); }}
                            className="flex flex-col items-center gap-3 cursor-pointer"
                        >
                            <div className={`w-16 h-16 rounded-full flex items-center justify-center transition-all duration-300 ${
                                activeService === service.id ? 'bg-obsidian text-white shadow-xl scale-110' : 'bg-white text-obsidian border border-black/5 shadow-sm'
                            }`}>
                                <img src={service.img} className={`w-9 h-auto ${activeService === service.id ? 'brightness-0 invert' : ''}`} alt={service.name} />
                            </div>
                            <span className={`text-[10px] font-black uppercase tracking-tight text-center leading-none ${activeService === service.id ? 'text-obsidian' : 'text-gray-400'}`}>
                                {service.name.split(' ')[0]}
                            </span>
                        </motion.div>
                    ))}
                </div>
            </div>

            {/* 4. Popular Fleet (Real Data from API) */}
            <div className="px-6 mt-10">
                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-base font-black text-obsidian tracking-tight uppercase">Popular Choice</h3>
                    <div className="flex gap-2">
                        <div className="w-8 h-8 rounded-lg bg-white border border-black/5 flex items-center justify-center shadow-sm">
                            <Sliders size={14} className="text-obsidian opacity-60" />
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    {globalCategories.map((cat, idx) => (
                        <motion.div 
                            key={cat._id}
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: idx * 0.1 }}
                            onClick={() => { setActiveService('local'); setDropLocation(cat.name); }} 
                            className="bg-white rounded-[2.5rem] p-5 border border-black/5 shadow-sm relative group active:scale-95 transition-all cursor-pointer overflow-hidden"
                        >
                            <div className="absolute -top-4 -right-4 w-16 h-16 bg-gray-50 rounded-full group-hover:scale-[3] transition-transform duration-700 -z-0"></div>
                            
                            <button className="absolute top-4 left-4 w-8 h-8 bg-white/80 backdrop-blur-md rounded-xl flex items-center justify-center shadow-sm z-10 border border-black/5">
                                <Heart size={14} className="text-obsidian opacity-20 group-hover:text-red-500 group-hover:opacity-100 transition-all" />
                            </button>

                            <div className="h-24 flex items-center justify-center mb-4 relative z-10">
                                <img 
                                    src={cat.image} 
                                    className="w-full h-auto object-contain max-h-full drop-shadow-2xl transform group-hover:scale-110 transition-all duration-700" 
                                    alt={cat.name} 
                                />
                            </div>

                            <div className="relative z-10">
                                <h4 className="text-[11px] font-black text-obsidian uppercase tracking-tight mb-1">{cat.name}</h4>
                                <div className="flex justify-between items-center">
                                    <div className="flex flex-col">
                                        <span className="text-[10px] font-black text-obsidian">₹{cat.baseFare || '500'}</span>
                                        <span className="text-[8px] font-bold text-gray-400 uppercase tracking-tighter">Starting at</span>
                                    </div>
                                    <div className="flex items-center gap-1 bg-yellow-400/10 px-2 py-1 rounded-lg">
                                        <Star size={10} className="fill-yellow-400 text-yellow-400" />
                                        <span className="text-[9px] font-black text-obsidian">4.8</span>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                    
                    {globalCategories.length === 0 && (
                        <div className="col-span-2 py-20 flex flex-col items-center justify-center text-gray-300">
                            <Sparkles size={40} className="opacity-20 mb-4 animate-pulse" />
                            <p className="text-xs font-black uppercase tracking-widest">Loading Fleet...</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Bottom Nav Spacer */}
            <div className="h-10"></div>
        </div>
    );
};

export default Home;
