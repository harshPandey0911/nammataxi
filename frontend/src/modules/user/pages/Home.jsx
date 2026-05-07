import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Bell, Search, Sparkles, Sliders, Heart, Star, X } from 'lucide-react';
import SEO from '../components/SEO';
import AirportForm from '../components/AirportForm';
import ToursForm from '../components/ToursForm';
import OutstationForm from '../components/OutstationForm';
import LocalForm from '../components/LocalForm';
import { services } from '../../../data';

const Home = ({ 
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
    
    return (
        <div className="min-h-screen bg-[#F8F9FB] font-outfit pb-40 overflow-y-auto no-scrollbar">
            <SEO pageName="user" />
            
            {/* 1. Header Area */}
            <div className="px-6 pt-8 flex justify-between items-center">
                <div className="flex items-center gap-3">
                    <div 
                        onClick={() => navigate('/user/profile')}
                        className="w-12 h-12 rounded-full overflow-hidden border-2 border-white shadow-md cursor-pointer active:scale-90 transition-all"
                    >
                        <img src="https://ui-avatars.com/api/?name=User&background=random" alt="profile" className="w-full h-full object-cover" />
                    </div>
                    <div>
                        <p className="text-[10px] font-bold text-gray-400 flex items-center gap-1">Welcome 👋</p>
                        <h2 className="text-sm font-black text-obsidian tracking-tight">User Account</h2>
                    </div>
                </div>
                <button className="w-10 h-10 bg-white rounded-full shadow-sm flex items-center justify-center border border-black/5 active:scale-90 transition-all">
                    <Bell size={18} className="text-obsidian opacity-60" />
                </button>
            </div>

            {/* 2. Search & Filter Area */}
            <div className="px-6 mt-6 flex gap-3">
                <div 
                    onClick={() => setIsBookingVisible(true)}
                    className="flex-1 bg-white rounded-2xl shadow-sm border border-black/5 flex items-center px-4 py-2 gap-3 cursor-pointer"
                >
                    <Search size={16} className="text-gray-300" />
                    <span className="text-[11px] font-bold text-gray-300">Search your ride</span>
                </div>
                <button className="w-10 h-10 bg-obsidian rounded-2xl flex items-center justify-center text-white shadow-lg shadow-black/20 active:scale-95 transition-all">
                    <Sliders size={16} />
                </button>
            </div>

            {/* 3. Category Circles (Horizontal) */}
            <div className="px-6 mt-12 overflow-x-auto no-scrollbar flex gap-6 pb-4">
                {services.map(service => (
                    <div 
                        key={service.id} 
                        onClick={() => { setActiveService(service.id); setIsBookingVisible(true); }}
                        className="flex flex-col items-center gap-2 cursor-pointer group"
                    >
                        <div className={`w-14 h-14 rounded-full flex items-center justify-center transition-all duration-300 ${
                            activeService === service.id ? 'bg-obsidian text-white shadow-xl scale-110' : 'bg-white text-obsidian border border-black/5'
                        }`}>
                            <img src={service.img} className={`w-8 h-auto ${activeService === service.id ? 'brightness-0 invert' : ''}`} alt={service.name} />
                        </div>
                        <span className={`text-[9px] font-black uppercase tracking-tighter ${activeService === service.id ? 'text-obsidian' : 'text-gray-400'}`}>
                            {service.name}
                        </span>
                    </div>
                ))}
            </div>

            {/* 4. Popular Fleet (Grid) */}
            <div className="px-6 mt-10">
                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-base font-black text-obsidian">Popular Choice</h3>
                    <button className="text-[10px] font-bold text-gray-400 hover:text-obsidian transition-colors">View All</button>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    {globalCategories.map(cat => (
                        <div 
                            key={cat._id} 
                            onClick={() => { setActiveService('local'); setIsBookingVisible(true); }} 
                            className="bg-white rounded-[2rem] p-4 border border-black/5 shadow-sm relative group active:scale-95 transition-all cursor-pointer"
                        >
                            <button className="absolute top-3 left-3 w-7 h-7 bg-white/80 backdrop-blur-md rounded-full flex items-center justify-center shadow-sm z-10">
                                <Heart size={12} className="text-obsidian opacity-40 group-hover:text-red-500 group-hover:opacity-100 transition-all" />
                            </button>
                            <div className="h-28 flex items-center justify-center mb-4">
                                <img src={cat.image} className="w-full h-auto object-contain max-h-full drop-shadow-lg transform group-hover:scale-105 transition-all duration-500" alt={cat.name} />
                            </div>
                            <h4 className="text-[11px] font-black text-obsidian uppercase tracking-tight mb-1">{cat.name}</h4>
                            <div className="flex justify-between items-center">
                                <span className="text-[10px] font-bold text-gray-400">₹{cat.baseDisplayPrice || '500'}</span>
                                <div className="flex items-center gap-0.5">
                                    <Star size={10} className="fill-yellow-400 text-yellow-400" />
                                    <span className="text-[9px] font-black text-obsidian">4.8</span>
                                </div>
                            </div>
                        </div>
                    ))}
                    
                    {globalCategories.length === 0 && (
                        <>
                            {[1, 2, 3, 4].map(i => (
                                <div key={i} className="bg-white rounded-[2rem] p-4 border border-black/5 shadow-sm h-48" />
                            ))}
                        </>
                    )}
                </div>
            </div>

            {/* 5. Booking Bottom Sheet (Drawer) */}
            {isBookingVisible && (
                <div className="fixed inset-0 z-50 flex flex-col justify-end">
                    {/* Backdrop */}
                    <div 
                        className="absolute inset-0 bg-black/40 backdrop-blur-[2px] animate-in fade-in duration-300"
                        onClick={() => setIsBookingVisible(false)}
                    />
                    
                    {/* Content */}
                    <div className="relative bg-white rounded-t-[3rem] shadow-[0_-10px_40px_rgba(0,0,0,0.2)] border-t border-black/5 p-8 h-fit max-h-[85vh] overflow-y-auto no-scrollbar animate-in slide-in-from-bottom duration-500">
                        <div 
                            className="w-10 h-1 bg-gray-100 rounded-full mx-auto mb-8 cursor-pointer hover:bg-gray-200" 
                            onClick={() => setIsBookingVisible(false)}
                        />
                        
                        <div className="flex items-center justify-between mb-6">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-2xl bg-obsidian flex items-center justify-center text-white">
                                    <Sparkles size={18} />
                                </div>
                                <div>
                                    <h2 className="text-lg font-black uppercase leading-none tracking-tight">{activeService} Booking</h2>
                                    <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest mt-1">Ready for dispatch</p>
                                </div>
                            </div>
                            <button 
                                onClick={() => setIsBookingVisible(false)}
                                className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center text-gray-400 active:scale-90 transition-all"
                            >
                                <X size={16} />
                            </button>
                        </div>

                        <div className="space-y-4">
                            {activeService === 'local' && <LocalForm {...{location, setLocation, dropLocation, setDropLocation, pickupDate, setPickupDate, pickupTime, setPickupTime, phoneNumber, setPhoneNumber, setView: handleSearch}} />}
                            {activeService === 'airport' && <AirportForm {...{airportMode, setAirportMode, location, setLocation, dropLocation, setDropLocation, pickupDate, setPickupDate, pickupTime, setPickupTime, phoneNumber, setPhoneNumber, setView: handleSearch}} />}
                            {activeService === 'tours' && <ToursForm {...{selectedPackage, setSelectedPackage, location, setLocation, pickupDate, setPickupDate, pickupTime, setPickupTime, phoneNumber, setPhoneNumber, setView: handleSearch}} />}
                            {activeService === 'outstation' && <OutstationForm {...{outstationMode, setOutstationMode, location, setLocation, dropLocation, setDropLocation, pickupDate, setPickupDate, pickupTime, setPickupTime, returnDate, setReturnDate, phoneNumber, setPhoneNumber, setView: handleSearch}} />}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Home;
