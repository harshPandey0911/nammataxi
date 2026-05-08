import React from 'react';

const CabDetails = ({ selectedCab, setView, location, dropLocation, pickupDate, pickupTime }) => {
    if (!selectedCab) return null;

    return (
        <div className="animate-slide-up px-6 pt-0">
            <div className="flex items-center gap-4 mb-1">
                <button 
                    onClick={() => setView('results')} 
                    className="w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-sm"
                >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
                    </svg>
                </button>
                <h2 className="font-extrabold text-lg">Cab Details</h2>
            </div>

            <div className="flex flex-col items-center mb-0">
                <div className="relative group">
                    <div className="absolute -inset-4 bg-primary/20 rounded-full blur-3xl opacity-20 transition-opacity"></div>
                    <img src={selectedCab.img} className="w-72 h-auto mb-0 relative z-10 drop-shadow-2xl" alt={selectedCab.name} />
                </div>
                <div className="flex items-center gap-2 mb-1">
                    <span className="text-[10px] font-black text-primary uppercase bg-primary/10 px-2 py-0.5 rounded-full">{selectedCab.brand}</span>
                    <div className="flex items-center gap-0.5 text-yellow-500">
                        {[1, 2, 3, 4, 5].map(i => (
                            <svg key={i} className="w-2.5 h-2.5 fill-current" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
                        ))}
                        <span className="text-[10px] font-bold text-gray-400 ml-1">4.9 (1.2k+ trips)</span>
                    </div>
                </div>
                <h1 className="text-3xl font-black text-obsidian text-center">{selectedCab.name}</h1>
            </div>

            {/* Trip Summary Section */}
            <div className="bg-white/60 border border-white/40 backdrop-blur rounded-[32px] p-5 mb-6 shadow-sm">
                <h4 className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-3 ml-1">Trip Summary</h4>
                <div className="space-y-3">
                    <div className="flex items-start gap-4">
                        <div className="flex flex-col items-center gap-1 mt-1">
                            <div className="w-2 h-2 rounded-full border-2 border-primary"></div>
                            <div className="w-0.5 h-6 bg-gray-200"></div>
                            <div className="w-2 h-2 bg-obsidian rotate-45"></div>
                        </div>
                        <div className="flex-1">
                            <div className="mb-2">
                                <p className="text-[8px] font-bold text-gray-400 uppercase leading-none">Pickup</p>
                                <p className="text-xs font-bold text-obsidian truncate">{location}</p>
                            </div>
                            <div>
                                <p className="text-[8px] font-bold text-gray-400 uppercase leading-none">Drop-off</p>
                                <p className="text-xs font-bold text-obsidian truncate">{dropLocation || 'Coordinate provided'}</p>
                            </div>
                        </div>
                    </div>
                    <div className="flex justify-between items-center pt-2 border-t border-gray-100/50">
                        <div className="flex items-center gap-2">
                            <svg className="w-3 h-3 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                            <p className="text-[10px] font-black text-obsidian">{pickupDate || 'Current'}</p>
                        </div>
                        <div className="flex items-center gap-2">
                            <svg className="w-3 h-3 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <p className="text-[10px] font-black text-obsidian">{pickupTime || 'Immediate'}</p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-3 gap-2 mb-6">
                <div className="bg-white p-3 rounded-2xl text-center shadow-sm">
                    <p className="text-[9px] font-bold text-gray-400 mb-1">Seats</p>
                    <p className="font-black text-xs text-obsidian">{selectedCab.seats}</p>
                </div>
                <div className="bg-white p-3 rounded-2xl text-center shadow-sm">
                    <p className="text-[9px] font-bold text-gray-400 mb-1">Luggage</p>
                    <p className="font-black text-xs text-obsidian">{selectedCab.luggage}x</p>
                </div>
                <div className="bg-white p-3 rounded-2xl text-center shadow-sm">
                    <p className="text-[9px] font-bold text-gray-400 mb-1">Comfort</p>
                    <p className="font-black text-xs text-primary">{selectedCab.ac ? 'AC' : 'Fan'}</p>
                </div>
            </div>

            {/* Booking Benefits */}
            <div className="mb-8 px-1">
                <h4 className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-4">Booking Benefits</h4>
                <div className="grid grid-cols-2 gap-y-4 gap-x-2">
                    {[
                        { icon: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z', text: 'Free Cancellation' },
                        { icon: 'M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z', text: 'Insurance Included' },
                        { icon: 'M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z M15 11a3 3 0 11-6 0 3 3 0 016 0z', text: 'Live Tracking' },
                        { icon: 'M13 10V3L4 14h7v7l9-11h-7z', text: 'Priority Booking' }
                    ].map((benefit, i) => (
                        <div key={i} className="flex items-center gap-2">
                            <div className="w-6 h-6 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d={benefit.icon} />
                                </svg>
                            </div>
                            <span className="text-[10px] font-bold text-gray-600">{benefit.text}</span>
                        </div>
                    ))}
                </div>
            </div>
            
            <div className="bg-obsidian rounded-[32px] p-6 text-white flex justify-between items-center mb-10">
                <div>
                    <p className="text-[10px] font-bold opacity-50 uppercase tracking-widest">Fixed Fare</p>
                    <p className="text-2xl font-black">{selectedCab.price}</p>
                </div>
                <button 
                    onClick={() => setView('checkout')} 
                    className="bg-primary text-white font-black px-8 py-4 rounded-2xl shadow-xl active:scale-95 transition-all"
                >
                    Book
                </button>
            </div>
        </div>
    );
};

export default CabDetails;
