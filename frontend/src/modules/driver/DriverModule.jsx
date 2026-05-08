import React, { useState, useEffect, useRef } from 'react';
import { Routes, Route, Navigate, NavLink } from 'react-router-dom';
import DriverLogin from './pages/DriverLogin';
import DriverBookings from './pages/DriverBookings';
import DriverBookingDetail from './pages/DriverBookingDetail';
import DriverEarnings from './pages/DriverEarnings';
import { useAuth } from '../../context/AuthContext';
import { ClipboardList, Wallet, LogOut, Bell, MapPin, IndianRupee, Check, X } from 'lucide-react';
import socket from '../../lib/socket';
import api from '../../lib/api';
import { motion, AnimatePresence } from 'framer-motion';

const DriverModule = () => {
  const { user, loading, logout } = useAuth();
  const [newAssignment, setNewAssignment] = useState(null);
  const audioRef = useRef(null);

  useEffect(() => {
    if (user && user.role === 'driver') {
      const room = user.id || user._id;
      console.log('[DriverModule] Joining socket room:', room);
      
      const joinRoom = () => {
        socket.emit('join', room);
        console.log('[DriverModule] Emitted join for room:', room);
      };

      // Join immediately
      joinRoom();

      // Re-join on reconnection
      socket.on('connect', joinRoom);

      const handleAssignment = (data) => {
        console.log('[DriverModule] Received driver_assigned event:', data);
        setNewAssignment(data);
        
        // Play notification sound
        if (audioRef.current) {
          audioRef.current.currentTime = 0;
          audioRef.current.play().catch(err => {
            console.warn('[DriverModule] Audio playback failed (likely browser policy):', err);
          });
        }

        // Optional: Trigger browser notification if supported
        if ("Notification" in window && Notification.permission === "granted") {
          new Notification("New Ride Assigned!", {
            body: `Pickup: ${data.pickupLocation}\nFare: ₹${data.amount}`,
            icon: "/logo.png"
          });
        }
      };

      socket.on('driver_assigned', handleAssignment);

      return () => {
        socket.off('connect', joinRoom);
        socket.off('driver_assigned', handleAssignment);
      };
    }
  }, [user]);

  // Request notification permission on mount
  useEffect(() => {
    if ("Notification" in window && Notification.permission === "default") {
      Notification.requestPermission();
    }
  }, []);

  const handleResponse = async (action) => {
    if (!newAssignment) return;
    
    try {
      console.log(`[DriverModule] Responding ${action} to assignment ${newAssignment.bookingId}`);
      await api.post(`/driver-ops/bookings/${newAssignment.bookingId}/respond`, { action });
      setNewAssignment(null);
      
      // Navigate to details if accepted
      if (action === 'accept') {
        window.location.href = `/driver/booking/${newAssignment.bookingId}`;
      } else {
        window.location.reload();
      }
    } catch (err) {
      console.error('[DriverModule] Failed to respond to assignment:', err);
      // Even if it fails, clear the popup to not block the UI, maybe show an alert
      alert(err.message || 'Failed to respond to assignment');
      setNewAssignment(null);
    }
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-white font-outfit">
      <div className="w-12 h-12 border-4 border-[#F7DC9D] border-t-black rounded-full animate-spin" />
    </div>
  );

  // If not logged in as driver, only allow login page
  if (!user || user.role !== 'driver') {
    return (
      <Routes>
        <Route path="login" element={<DriverLogin />} />
        <Route path="*" element={<Navigate to="/driver/login" replace />} />
      </Routes>
    );
  }

  // Driver is logged in
  return (
    <div className="min-h-screen bg-gray-50 font-outfit flex flex-col">
      {/* Audio notification - Using a more reliable source or ensuring it's loaded */}
      <audio 
        ref={audioRef} 
        src="https://assets.mixkit.co/active_storage/sfx/2869/2869-preview.mp3" 
        preload="auto" 
      />
      
      {/* Top Navigation */}
      <nav className="bg-black text-white p-5 sticky top-0 z-[100] flex justify-between items-center shadow-2xl">
        <div className="flex flex-col">
          <span className="font-serif font-black tracking-tighter uppercase text-xl text-[#F7DC9D]">Namma Driver</span>
          <span className="text-[8px] font-black uppercase tracking-[0.3em] opacity-40">Operational Portal</span>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex flex-col items-end">
            <span className="text-[10px] font-black uppercase text-white leading-none mb-1">{user.name}</span>
            <div className="flex items-center gap-1.5">
               <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
               <span className="text-[8px] font-bold text-[#F7DC9D] uppercase tracking-widest leading-none">Online</span>
            </div>
          </div>
          <button onClick={() => logout()} className="p-2 bg-white/10 rounded-lg hover:bg-red-500 transition-colors group">
            <LogOut size={16} className="group-hover:scale-110 transition-transform" />
          </button>
        </div>
      </nav>

      {/* Main Content Area */}
      <div className="flex-1 p-4 pb-32">
        <Routes>
          <Route path="bookings" element={<DriverBookings />} />
          <Route path="booking/:id" element={<DriverBookingDetail />} />
          <Route path="earnings" element={<DriverEarnings />} />
          <Route path="/" element={<Navigate to="/driver/bookings" replace />} />
          <Route path="*" element={<Navigate to="/driver/bookings" replace />} />
        </Routes>
      </div>

      {/* Assignment Popup - Premium Design */}
      <AnimatePresence>
        {newAssignment && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-6 bg-black/80 backdrop-blur-md">
            <motion.div 
              initial={{ scale: 0.8, opacity: 0, y: 40 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.8, opacity: 0, y: 40 }}
              className="bg-white w-full max-w-sm rounded-[3rem] overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.3)] border-4 border-black"
            >
              <div className="bg-black p-8 text-center relative overflow-hidden">
                {/* Decorative circles */}
                <div className="absolute -top-10 -right-10 w-32 h-32 bg-[#F7DC9D]/10 rounded-full" />
                <div className="absolute -bottom-10 -left-10 w-24 h-24 bg-[#F7DC9D]/5 rounded-full" />
                
                <div className="w-20 h-20 bg-[#F7DC9D] rounded-3xl flex items-center justify-center mx-auto mb-5 rotate-12 animate-bounce shadow-[0_0_20px_rgba(247,220,157,0.4)]">
                  <Bell className="text-black -rotate-12" size={40} />
                </div>
                <h3 className="text-[#F7DC9D] font-serif font-black uppercase text-2xl tracking-tight leading-none">New Task!</h3>
                <p className="text-white/40 text-[10px] font-black uppercase tracking-[0.3em] mt-3">{newAssignment.bookingRef}</p>
              </div>

              <div className="p-8 space-y-8">
                <div className="flex items-start gap-5">
                  <div className="p-4 bg-gray-50 rounded-2xl border border-black/5">
                    <MapPin className="text-black" size={24} />
                  </div>
                  <div className="flex-1">
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-1.5">Pickup Point</p>
                    <p className="text-sm font-black text-black leading-snug">{newAssignment.pickupLocation}</p>
                  </div>
                </div>

                <div className="flex items-start gap-5">
                  <div className="p-4 bg-gray-50 rounded-2xl border border-black/5">
                    <IndianRupee className="text-black" size={24} />
                  </div>
                  <div className="flex-1">
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-1.5">Trip Earnings</p>
                    <div className="flex items-baseline gap-1">
                      <p className="text-3xl font-serif font-black text-black">₹{newAssignment.amount}</p>
                      <span className="text-[10px] font-bold text-emerald-500 uppercase">Est.</span>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 pt-4">
                  <button 
                    onClick={() => handleResponse('reject')}
                    className="flex items-center justify-center gap-2 py-5 border-2 border-black rounded-[2rem] text-xs font-black uppercase tracking-widest hover:bg-red-50 hover:border-red-500 hover:text-red-600 transition-all active:scale-95"
                  >
                    <X size={18} />
                    Pass
                  </button>
                  <button 
                    onClick={() => handleResponse('accept')}
                    className="flex items-center justify-center gap-2 py-5 bg-black text-[#F7DC9D] rounded-[2rem] text-xs font-black uppercase tracking-widest shadow-2xl shadow-black/20 hover:bg-[#F7DC9D] hover:text-black transition-all active:scale-95 group"
                  >
                    <Check size={18} className="group-hover:scale-125 transition-transform" />
                    Accept
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Bottom Navigation (Floating Style) */}
      <div className="fixed bottom-8 left-6 right-6 z-[100]">
        <div className="bg-black/95 backdrop-blur-2xl border border-white/10 p-3 rounded-[3rem] flex justify-around items-center shadow-[0_20px_50px_rgba(0,0,0,0.5)]">
          <NavLink
            to="/driver/bookings"
            className={({ isActive }) => `flex flex-col items-center gap-1.5 transition-all px-10 py-3 rounded-[2rem] ${isActive ? 'bg-[#F7DC9D] text-black scale-105 shadow-xl shadow-[#F7DC9D]/20' : 'text-gray-500 hover:text-white'}`}
          >
            <ClipboardList size={22} />
            <span className="text-[8px] font-black uppercase tracking-widest">Jobs</span>
          </NavLink>
          <NavLink
            to="/driver/earnings"
            className={({ isActive }) => `flex flex-col items-center gap-1.5 transition-all px-10 py-3 rounded-[2rem] ${isActive ? 'bg-[#F7DC9D] text-black scale-105 shadow-xl shadow-[#F7DC9D]/20' : 'text-gray-500 hover:text-white'}`}
          >
            <Wallet size={22} />
            <span className="text-[8px] font-black uppercase tracking-widest">Wallet</span>
          </NavLink>
        </div>
      </div>
    </div>
  );

};

export default DriverModule;
