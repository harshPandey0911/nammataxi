import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../../lib/api';

const ManageAddress = () => {
    const navigate = useNavigate();
    const [addresses, setAddresses] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    
    const [isAdding, setIsAdding] = useState(false);
    const [newAddr, setNewAddr] = useState({ type: '', address: '' });
    const [editId, setEditId] = useState(null);

    const fetchAddresses = async () => {
        try {
            setIsLoading(true);
            const res = await api.get('/addresses');
            setAddresses(res.data);
        } catch (err) {
            console.error('Failed to fetch addresses:', err);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchAddresses();
    }, []);

    const handleDelete = async (id) => {
        try {
            await api.delete(`/addresses/${id}`);
            setAddresses(addresses.filter(a => a._id !== id));
        } catch (err) {
            console.error('Failed to delete address:', err);
            alert('Failed to delete address');
        }
    };

    const handleAdd = async () => {
        if (!newAddr.type || !newAddr.address) return;
        try {
            const res = await api.post('/addresses', newAddr);
            setAddresses([res.data, ...addresses]);
            setNewAddr({ type: '', address: '' });
            setIsAdding(false);
        } catch (err) {
            console.error('Failed to add address:', err);
            alert('Failed to add address');
        }
    };

    const handleUpdate = async (id, text) => {
        try {
            const res = await api.patch(`/addresses/${id}`, { address: text });
            setAddresses(addresses.map(a => a._id === id ? res.data : a));
            setEditId(null);
        } catch (err) {
            console.error('Failed to update address:', err);
            alert('Failed to update address');
        }
    };

    const [isLocating, setIsLocating] = useState(false);

    const handleUseCurrentLocation = () => {
        if ("geolocation" in navigator) {
            setIsLocating(true);
            navigator.geolocation.getCurrentPosition(
                async (position) => {
                    const { latitude, longitude } = position.coords;
                    try {
                        const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
                        const response = await fetch(`https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${apiKey}`);
                        const data = await response.json();
                        
                        if (data.status === 'OK' && data.results && data.results[0]) {
                            setNewAddr(prev => ({ ...prev, address: data.results[0].formatted_address }));
                        } else {
                            alert('Could not fetch address for this location.');
                        }
                    } catch (err) {
                        console.error("Geocoding error:", err);
                        alert('Error fetching address.');
                    } finally {
                        setIsLocating(false);
                    }
                },
                (error) => {
                    console.error("Location error:", error);
                    alert('Permission denied or location unavailable.');
                    setIsLocating(false);
                }
            );
        }
    };

    return (
        <div className="animate-slide-up px-6 pt-6 pb-32">
            <div className="flex items-center gap-4 mb-8">
                <button 
                    onClick={() => navigate(-1)} 
                    className="w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-sm"
                >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
                    </svg>
                </button>
                <h1 className="text-2xl font-black">My Addresses</h1>
            </div>

            <div className="space-y-4 mb-8">
                {isLoading ? (
                    <div className="text-center py-10 text-gray-400 font-bold">Loading...</div>
                ) : addresses.length === 0 ? (
                    <div className="text-center py-10 text-gray-400 font-bold">No addresses found.</div>
                ) : addresses.map(item => {
                    const isHome = item.type.toLowerCase().includes('home');
                    const icon = isHome 
                        ? 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6'
                        : 'M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4';
                        
                    return (
                        <div key={item._id} className="bg-white p-5 rounded-[32px] shadow-sm flex gap-4 animate-scale-in">
                            <div className="w-12 h-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center flex-shrink-0">
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={icon} />
                                </svg>
                            </div>
                            <div className="flex-1">
                                <div className="flex justify-between items-start">
                                    <h3 className="font-extrabold text-sm mb-1">{item.type}</h3>
                                    <div className="flex gap-2">
                                        <button 
                                            onClick={() => setEditId(item._id)}
                                            className="text-primary font-bold text-[10px] uppercase"
                                        >
                                            Edit
                                        </button>
                                        <button 
                                            onClick={() => handleDelete(item._id)}
                                            className="text-red-500 font-bold text-[10px] uppercase"
                                        >
                                            Delete
                                        </button>
                                    </div>
                                </div>
                                {editId === item._id ? (
                                    <div className="mt-2 flex gap-2">
                                        <input 
                                            autoFocus
                                            className="text-[11px] border-b border-primary w-full outline-none"
                                            defaultValue={item.address}
                                            onBlur={(e) => handleUpdate(item._id, e.target.value)}
                                            onKeyDown={(e) => e.key === 'Enter' && handleUpdate(item._id, e.target.value)}
                                        />
                                    </div>
                                ) : (
                                    <p className="text-gray-400 text-[11px] leading-relaxed pr-4">{item.address}</p>
                                )}
                            </div>
                        </div>
                    )
                })}
            </div>

            {isAdding ? (
                <div className="bg-white p-6 rounded-[32px] shadow-lg border border-primary/20 space-y-3 mb-8 animate-slide-up">
                    <input 
                        placeholder="Address Type (e.g. Home, Work)" 
                        className="form-input text-xs"
                        value={newAddr.type}
                        onChange={e => setNewAddr({ ...newAddr, type: e.target.value })}
                    />
                    
                    <button 
                        onClick={handleUseCurrentLocation}
                        disabled={isLocating}
                        className="flex items-center gap-2 text-[10px] font-black text-primary uppercase tracking-wider bg-primary/5 px-4 py-2 rounded-xl border border-primary/10 hover:bg-primary/10 transition-all disabled:opacity-50"
                    >
                        <svg className={`w-3 h-3 ${isLocating ? 'animate-spin' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        {isLocating ? 'Locating...' : 'Use Current Location'}
                    </button>

                    <textarea 
                        placeholder="Full Address" 
                        className="form-input text-xs min-h-[80px]"
                        value={newAddr.address}
                        onChange={e => setNewAddr({ ...newAddr, address: e.target.value })}
                    />
                    <div className="flex gap-2">
                        <button onClick={handleAdd} className="primary-btn text-[10px] py-3">Save Address</button>
                        <button onClick={() => setIsAdding(false)} className="flex-1 bg-gray-100 font-black text-[10px] uppercase rounded-2xl">Cancel</button>
                    </div>
                </div>
            ) : (
                <button 
                    onClick={() => setIsAdding(true)}
                    className="w-full py-5 border-2 border-dashed border-gray-200 rounded-[32px] flex items-center justify-center gap-3 text-gray-400 hover:border-primary hover:text-primary transition-all active:scale-95"
                >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                    <span className="font-black text-xs uppercase tracking-widest">Add New Address</span>
                </button>
            )}
        </div>
    );
};

export default ManageAddress;
