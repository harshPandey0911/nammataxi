import React from 'react';

const CabResults = ({ cabs, setView, setSelectedCab }) => {
    return (
        <div className="animate-slide-up px-4 pt-8">
            <div className="flex items-center gap-4 mb-6 px-2">
                <button 
                    onClick={() => setView('home')} 
                    className="w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-sm border border-gray-100"
                >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
                    </svg>
                </button>
                <h2 className="font-extrabold text-lg">Available Cabs</h2>
            </div>

            {cabs.length > 0 && cabs[0].distanceKm > 0 && (
                <div className="mx-2 mb-6 p-4 bg-primary/5 rounded-2xl border border-primary/10 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z"/></svg>
                        </div>
                        <div>
                            <p className="text-[10px] font-black text-gray-400 uppercase leading-none mb-1">Route Distance</p>
                            <p className="text-sm font-black text-obsidian">{cabs[0].distanceKm.toFixed(1)} km</p>
                        </div>
                    </div>
                    {cabs[0].estimatedDuration > 0 && (
                        <div className="text-right">
                            <p className="text-[10px] font-black text-gray-400 uppercase leading-none mb-1">Est. Time</p>
                            <p className="text-sm font-black text-primary">{cabs[0].estimatedDuration} mins</p>
                        </div>
                    )}
                </div>
            )}

            <div className="space-y-3">
                {cabs.length === 0 ? (
                    <div className="mx-2 mt-10 p-10 bg-white rounded-[32px] border border-gray-100 text-center shadow-sm">
                        <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6">
                            <svg className="w-10 h-10 text-gray-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                            </svg>
                        </div>
                        <h3 className="font-black text-obsidian text-lg mb-2">No Cabs Found</h3>
                        <p className="text-xs text-gray-400 mb-8 leading-relaxed">
                            We couldn't find any available vehicles for this route or time. Please try adjusting your locations or schedule.
                        </p>
                        <button 
                            onClick={() => setView('home')}
                            className="w-full bg-primary text-white font-black py-4 rounded-2xl shadow-lg active:scale-95 transition-transform uppercase text-xs tracking-widest"
                        >
                            Search Again
                        </button>
                    </div>
                ) : (
                    cabs.map(cab => (
                        <div 
                            key={cab.id} 
                            onClick={() => { setSelectedCab(cab); setView('details'); }} 
                            className="cab-result-card cursor-pointer"
                        >
                            <div className="cab-img-box">
                                <img src={cab.img} className="w-full h-auto max-h-[60px] object-contain" alt={cab.name} />
                            </div>
                            <div className="cab-info">
                                <span className="text-[8px] font-black text-primary uppercase mb-0.5">{cab.brand}</span>
                                <h3 className="font-extrabold text-sm text-gray-800 leading-tight">{cab.name}</h3>
                                <div className="flex gap-2 mt-1">
                                    <span className="text-[9px] font-bold text-gray-400 uppercase">{cab.seats} Seater</span>
                                    <span className={`text-[9px] font-bold uppercase ${cab.ac ? 'text-green-500' : 'text-red-500'}`}>
                                        • {cab.ac ? 'AC' : 'Non-AC'}
                                    </span>
                                </div>
                            </div>
                            <div className="cab-price-box">
                                <div className="font-black text-base text-obsidian">{cab.price}</div>
                                <span className="text-[8px] font-bold text-gray-400 underline">Select</span>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default CabResults;
