import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Phone, MapPin, Navigation, CheckCircle, ChevronLeft, ArrowRight, User, ShieldCheck, Clock, Check, AlertCircle } from 'lucide-react';
import api from '../../../lib/api';
import socket from '../../../lib/socket';

const DriverBookingDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [booking, setBooking] = useState(null);
    const [loading, setLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState(false);
    const [otp, setOtp] = useState('');
    const [isOtpRequested, setIsOtpRequested] = useState(false);

    const fetchBooking = async () => {
        try {
            setLoading(true);
            const res = await api.get(`/driver/bookings/${id}`);
            if (res && res.data) {
                setBooking(res.data);
            }
        } catch (error) {
            console.error('Failed to fetch booking details', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchBooking();

        const handleUpdate = (updatedBooking) => {
            if (updatedBooking._id === id) {
                fetchBooking();
            }
        };

        socket.on('booking_updated', handleUpdate);
        socket.on('booking_cancelled', handleUpdate);

        return () => {
            socket.off('booking_updated', handleUpdate);
            socket.off('booking_cancelled', handleUpdate);
        };
    }, [id]);

    useEffect(() => {
        setIsOtpRequested(false);
        setOtp('');
    }, [booking?.status]);

    const handleStatusUpdate = async (nextStatus) => {
        // Both 'started' and 'completed' now require OTP verification
        if (nextStatus === 'started' || nextStatus === 'completed') {
            if (!isOtpRequested) {
                setIsOtpRequested(true);
                return;
            }
            if (!otp || otp.length < 4) {
                alert(`Please enter the 4-digit ${nextStatus === 'started' ? 'START' : 'END'} OTP provided by the customer.`);
                return;
            }
        }

        if (!window.confirm(`Are you sure you want to mark this ride as ${nextStatus.toUpperCase()}?`)) return;
        
        try {
            setActionLoading(true);
            const res = await api.patch(`/driver/bookings/${id}/status`, { status: nextStatus, otp });
            if (res && res.data) {
                setBooking(res.data);
                if (nextStatus === 'completed') {
                    alert('Ride Completed! Great Job.');
                    navigate('/driver/bookings');
                }
            }
        } catch (error) {
            console.error('Failed to update status', error);
            alert(error.response?.data?.message || 'Update failed. Please check network.');
        } finally {
            setActionLoading(false);
        }
    };

    if (loading) return (
        <div className="flex flex-col items-center justify-center py-20 font-outfit">
            <div className="w-12 h-12 border-[6px] border-[#BCE3E8]/20 border-t-black rounded-full animate-spin mb-6" />
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400">Loading Job Details...</span>
        </div>
    );

    if (!booking) return (
        <div className="p-10 text-center font-outfit">
            <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-6">
                <ShieldCheck className="text-red-500 opacity-20" size={40} />
            </div>
            <h3 className="font-black text-xl mb-2 text-black uppercase">Ride Link Broken</h3>
            <p className="text-gray-400 text-xs mb-8">We couldn't retrieve this ride details. It might be assigned to another driver.</p>
            <button onClick={() => navigate('/driver/bookings')} className="bg-black text-white px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest">Return to List</button>
        </div>
    );

    // Contextual Action Determination
    const getStatusInfo = () => {
        switch (booking.status) {
            case 'confirmed': 
            case 'assigned': return { next: 'started', label: 'Reached Pickup', color: 'bg-black text-white', icon: <MapPin size={20} /> };
            case 'started': return { next: 'completed', label: 'Work Complete', color: 'bg-emerald-500 text-white', icon: <Check size={24} /> };
            default: return null;
        }
    };

    const nextAction = getStatusInfo();

    return (
        <div className="space-y-6 font-outfit pb-40 animate-in fade-in duration-500">
            {/* Header */}
            <div className="flex items-center gap-4">
                <button 
                    onClick={() => navigate('/driver/bookings')}
                    className="w-12 h-12 bg-white rounded-2xl border border-black/5 flex items-center justify-center text-black shadow-sm active:scale-90"
                >
                    <ChevronLeft size={20} />
                </button>
                <div className="flex-1">
                    <div className="flex items-center justify-between">
                        <h2 className="text-xl font-serif font-black uppercase leading-none">{booking.bookingRef}</h2>
                        <span className="text-[8px] font-black bg-[#BCE3E8] text-black px-2 py-1 rounded-lg uppercase tracking-widest">{booking.status}</span>
                    </div>
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1 italic">Reference ID</p>
                </div>
            </div>

            {/* STATUS CONTROL CENTER (THE ACTION PANEL) */}
            <div className="bg-[#BCE3E8] p-3 rounded-2xl shadow-md border border-black/5">
                <div className="flex justify-between items-center mb-4">
                    <div className="flex flex-col">
                        <span className="text-[8px] font-black text-black/40 uppercase tracking-widest leading-none mb-0.5">Control Panel</span>
                        <h3 className="text-sm font-black text-black">Update Ride Status</h3>
                    </div>
                    <div className="w-8 h-8 bg-black/5 rounded-full flex items-center justify-center">
                        <Clock size={16} className="text-black/60" />
                    </div>
                </div>
                
                {(nextAction?.next === 'started' || nextAction?.next === 'completed') && isOtpRequested && (
                    <div className="mb-4 animate-in zoom-in-95 duration-200">
                        <div className="bg-white/40 rounded-xl p-2 border border-dashed border-black/10">
                            <span className="text-[7px] font-black text-black/40 uppercase tracking-widest block mb-2 text-center">
                                {nextAction?.next === 'started' ? 'Enter Start OTP' : 'Enter End OTP to Finish'}
                            </span>
                            <input 
                                type="text" 
                                maxLength={4}
                                placeholder="0000"
                                value={otp}
                                autoFocus
                                onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                                className="w-full bg-white py-2 rounded-lg text-center text-xl font-black tracking-[0.5em] text-black outline-none border border-transparent focus:border-black transition-all"
                            />
                        </div>
                    </div>
                )}

                {nextAction ? (
                    <button 
                        onClick={() => handleStatusUpdate(nextAction.next)}
                        disabled={actionLoading}
                        className={`w-full flex items-center justify-center p-2.5 rounded-full shadow-md active:scale-[0.98] transition-all border border-white/10 ${nextAction.color}`}
                    >
                        {actionLoading ? (
                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        ) : (
                            <span className="text-[10px] font-black uppercase tracking-widest">
                                {isOtpRequested 
                                    ? (nextAction.next === 'started' ? 'Verify & Start' : 'Confirm & Finish') 
                                    : nextAction.label
                                }
                            </span>
                        )}
                    </button>
                ) : (
                    <div className="bg-white/50 p-6 rounded-3xl text-center border border-black/5 flex flex-col items-center">
                        <AlertCircle size={32} className="text-black/20 mb-2" />
                        <span className="text-[10px] font-black uppercase text-black/40 tracking-widest">Ride in Final State: {booking.status}</span>
                    </div>
                )}
            </div>

            {/* Customer Details Card */}
            <div className="bg-white p-3 rounded-2xl border border-black/5 shadow-sm relative">
                <div className="flex justify-between items-center mb-6">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-black text-[#BCE3E8] rounded-lg flex items-center justify-center font-black text-lg shadow-md">
                            {booking.customerInfo.name?.[0] || 'C'}
                        </div>
                        <div className="flex flex-col">
                            <span className="text-xs font-black text-black uppercase block leading-none">{booking.customerInfo.name}</span>
                            <span className="text-[8px] font-bold text-emerald-500 uppercase tracking-widest mt-1 flex items-center gap-1">
                                <ShieldCheck size={8} /> Verified
                            </span>
                        </div>
                    </div>
                    <a href={`tel:${booking.customerInfo.phone}`} className="w-10 h-10 bg-emerald-500 text-white rounded-lg flex items-center justify-center shadow-md shadow-emerald-500/10 active:scale-95 transition-all">
                        <Phone size={18} fill="currentColor" />
                    </a>
                </div>

                <div className="space-y-4">
                    <div className="flex items-start gap-4">
                        <div className="w-10 h-10 bg-gray-50 rounded-xl flex items-center justify-center text-black border border-black/5">
                            <MapPin size={18} />
                        </div>
                        <div className="flex flex-col flex-1">
                            <span className="text-[8px] font-black text-gray-400 uppercase tracking-[0.1em] mb-0.5">Pick-up</span>
                            <span className="text-[11px] font-bold text-black leading-tight truncate">{booking.tripSummary.pickupLocation}</span>
                        </div>
                    </div>
                    <div className="flex items-start gap-4 border-t border-gray-50 pt-4">
                        <div className="w-10 h-10 bg-gray-50 rounded-xl flex items-center justify-center text-gray-300 border border-black/5">
                            <Navigation size={18} />
                        </div>
                        <div className="flex flex-col flex-1">
                            <span className="text-[8px] font-black text-gray-400 uppercase tracking-[0.1em] mb-0.5">Drop-off</span>
                            <span className="text-[11px] font-bold text-black leading-tight truncate">{booking.tripSummary.dropLocation || 'As directed'}</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Fare Summary */}
            <div className="bg-black p-3 rounded-2xl text-white flex justify-between items-center shadow-md">
                <div className="flex flex-col">
                    <span className="text-[8px] font-black text-[#BCE3E8] uppercase tracking-widest block mb-1 opacity-60">Estimated Fare</span>
                    <span className="text-xl font-serif font-black">₹{booking.fareDetails.computedFare}</span>
                </div>
                <div className="text-right">
                    <span className="text-[8px] font-black text-white uppercase tracking-widest block mb-1 opacity-40">Vehicle</span>
                    <div className="px-3 py-1 bg-white/10 rounded-lg border border-white/5">
                        <span className="text-[9px] font-black text-[#BCE3E8] uppercase">{booking.selectedVehicleCategory.name}</span>
                    </div>
                </div>
            </div>

            {/* Quick action button removed as it overlaps with bottom nav */}
        </div>
    );
};

export default DriverBookingDetail;
