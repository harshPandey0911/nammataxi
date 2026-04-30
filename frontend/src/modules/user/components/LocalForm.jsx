import React from 'react';

const LocalForm = ({ 
    location, 
    setLocation, 
    dropLocation, 
    setDropLocation, 
    pickupDate, 
    setPickupDate, 
    pickupTime, 
    setPickupTime, 
    phoneNumber, 
    setPhoneNumber, 
    setView 
}) => {
    return (
        <div className="animate-slide-up space-y-3">
            <div className="relative">
                <input 
                    type="text" 
                    className="form-input" 
                    value={location} 
                    onChange={(e) => setLocation(e.target.value)} 
                    placeholder="Pickup Location"
                />
                <span className="text-[8px] font-black text-primary uppercase absolute -top-1.5 left-3 bg-white px-1">Live Pickup</span>
            </div>

            <div className="relative">
                <input 
                    type="text" 
                    className="form-input" 
                    value={dropLocation} 
                    onChange={(e) => setDropLocation(e.target.value)} 
                    placeholder="Where to?"
                />
                <span className="text-[8px] font-black text-primary uppercase absolute -top-1.5 left-3 bg-white px-1">Destination</span>
            </div>

            <div className="flex gap-2">
                <div className="custom-date-wrapper">
                    <input type="date" className="form-input" value={pickupDate} onChange={e => setPickupDate(e.target.value)} />
                    {!pickupDate && <div className="custom-date-placeholder"><span>Date</span></div>}
                </div>
                <div className="custom-date-wrapper">
                    <input type="time" className="form-input" value={pickupTime} onChange={e => setPickupTime(e.target.value)} />
                    {!pickupTime && <div className="custom-date-placeholder"><span>Time</span></div>}
                </div>
            </div>

            <input 
                type="tel" 
                className="form-input" 
                value={phoneNumber} 
                onChange={(e) => setPhoneNumber(e.target.value)} 
                placeholder="+91 Phone number" 
            />

            <button 
                onClick={() => setView('results')} 
                className="primary-btn flex items-center justify-center gap-3"
            >
                <div className="w-5 h-5 bg-obsidian rounded flex items-center justify-center">
                    <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7"/></svg>
                </div>
                <span>Search Cabs</span>
            </button>
        </div>
    );
};

export default LocalForm;
