import React from 'react';

const CheckoutForm = ({ 
    selectedCab, 
    setView, 
    userName, 
    setUserName, 
    userEmail, 
    setUserEmail, 
    phoneNumber, 
    userAddress, 
    setUserAddress, 
    handleBookClick, 
    isCheckingAvailability,
    couponCode,
    setCouponCode,
    appliedCoupon,
    discountAmount,
    handleApplyCoupon,
    isApplyingCoupon
}) => {
    const baseFare = parseInt(selectedCab?.price.replace('₹', '')) || 0;
    const finalFare = baseFare - discountAmount;

    return (
        <div className="animate-slide-up px-6 pt-10">
            <button 
                onClick={() => setView('details')} 
                className="w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-sm mb-6"
            >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
                </svg>
            </button>
            <div className="flex items-center justify-between mb-6 px-1">
                <h2 className="text-2xl font-black">User Details</h2>
                <div className="text-right">
                    <p className="text-[10px] font-bold text-gray-400 uppercase leading-none">Booking Total</p>
                    <p className={`text-lg font-black ${discountAmount > 0 ? 'text-gray-400 line-through text-sm' : 'text-primary'}`}>
                        ₹{baseFare}
                    </p>
                    {discountAmount > 0 && (
                        <p className="text-lg font-black text-primary animate-in fade-in zoom-in duration-300">
                            ₹{finalFare}
                        </p>
                    )}
                </div>
            </div>
            <div className="checkout-box space-y-4">
                <input 
                    type="text" 
                    className="form-input" 
                    placeholder="Full Name" 
                    value={userName} 
                    onChange={e => setUserName(e.target.value)} 
                />
                <input 
                    type="email" 
                    className="form-input" 
                    placeholder="Email Address" 
                    value={userEmail} 
                    onChange={e => setUserEmail(e.target.value)} 
                />
                <input 
                    type="tel" 
                    className="form-input" 
                    placeholder="Phone Number" 
                    value={phoneNumber} 
                    readOnly 
                />
                <textarea 
                    className="form-input min-h-[100px]" 
                    placeholder="Complete Address" 
                    value={userAddress} 
                    onChange={e => setUserAddress(e.target.value)} 
                />

                {/* Coupon Section */}
                <div className="bg-gray-50 p-3 rounded-2xl border border-gray-100">
                    <div className="flex gap-2">
                        <input 
                            type="text" 
                            className="flex-1 bg-white border border-gray-200 rounded-xl px-3 py-2 text-xs font-bold uppercase tracking-widest focus:outline-none focus:border-primary" 
                            placeholder="COUPON CODE" 
                            value={couponCode}
                            onChange={e => setCouponCode(e.target.value.toUpperCase())}
                            disabled={appliedCoupon}
                        />
                        <button 
                            onClick={handleApplyCoupon}
                            disabled={isApplyingCoupon || appliedCoupon || !couponCode}
                            className="bg-obsidian text-white px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest disabled:opacity-50 transition-all"
                        >
                            {isApplyingCoupon ? '...' : appliedCoupon ? 'Applied' : 'Apply'}
                        </button>
                    </div>
                    {appliedCoupon && (
                        <div className="mt-2 flex items-center justify-between px-1">
                            <p className="text-[9px] font-bold text-emerald-600 uppercase tracking-widest flex items-center gap-1">
                                <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                </svg>
                                {appliedCoupon.code} Applied
                            </p>
                            <p className="text-[10px] font-black text-emerald-600">- ₹{discountAmount}</p>
                        </div>
                    )}
                </div>

                <button 
                    onClick={handleBookClick} 
                    disabled={isCheckingAvailability} 
                    className={`primary-btn ${isCheckingAvailability ? 'opacity-50' : ''}`}
                >
                    {isCheckingAvailability ? 'Checking Availability...' : 'Confirm Booking'}
                </button>
            </div>
        </div>
    );
};

export default CheckoutForm;
