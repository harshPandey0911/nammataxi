import React, { useState, useEffect } from 'react';
import { IndianRupee, Info, Edit, Check, X } from 'lucide-react';
import { useLocation } from 'react-router-dom';
import api from '../../../../lib/api';

const BasePrices = () => {
    const location = useLocation();
    const [prices, setPrices] = useState([]);
    const [loading, setLoading] = useState(true);
    const [editingId, setEditingId] = useState(null);
    const [editForm, setEditForm] = useState({});

    // Map path to serviceType
    const getSectionConfig = () => {
        const path = location.pathname;
        if (path.endsWith('/local')) return { type: 'local', title: 'Local Pricing', desc: 'Point-to-point city ride rates' };
        if (path.endsWith('/airport')) return { type: 'airport', title: 'Airport Pricing', desc: 'Pickup and drop rates for Bengaluru Airport' };
        if (path.endsWith('/out-station')) return { type: 'outstation', title: 'Out Station Pricing', desc: 'Inter-city travel rates and driver allowances' };
        if (path.endsWith('/tours-package')) return { type: 'tours', title: 'Tours Packages', desc: 'Pre-defined sight-seeing and rental packages' };
        return { type: null, title: 'All Base Pricing', desc: 'Configure standard fares and additional charges' };
    };

    const section = getSectionConfig();

    const fetchPrices = async () => {
        try {
            setLoading(true);
            const query = section.type ? `?serviceType=${section.type}` : '';
            const res = await api.get(`/pricing${query}`);
            if (res && res.data) {
                setPrices(res.data);
            }
        } catch (error) {
            console.error('Failed to fetch pricing:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPrices();
    }, [location.pathname]);

    const handleEditClick = (price) => {
        setEditingId(price._id);
        setEditForm({
            baseFare: price.baseFare || '',
            perKmRate: price.perKmRate || '',
            minimumKm: price.minimumKm || '',
            packagePrice: price.packagePrice || '',
            driverAllowance: price.driverAllowance || ''
        });
    };

    const handleCancelEdit = () => {
        setEditingId(null);
    };

    const handleSaveEdit = async (id) => {
        try {
            const res = await api.patch(`/pricing/${id}`, editForm);
            if (res && res.data) {
                setPrices(prev => prev.map(p => p._id === id ? res.data : p));
            }
            setEditingId(null);
        } catch (error) {
            console.error('Failed to update pricing:', error);
            alert(error.message || 'Failed to update pricing');
        }
    };

    return (
        <div className="space-y-6 animate-in fade-in duration-500 text-left font-outfit">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-8 rounded-[2rem] border border-black/5 shadow-sm">
                <div>
                    <h1 className="text-2xl font-serif font-black text-black tracking-tight uppercase">{section.title}</h1>
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mt-1">{section.desc}</p>
                </div>
                <button 
                    onClick={fetchPrices}
                    className="flex items-center gap-2 px-6 py-3 bg-black text-white rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-[#F7DC9D] hover:text-black transition-all shadow-lg active:scale-95"
                >
                    Refresh Fares
                </button>
            </div>

            {loading ? (
                <div className="text-center py-10 text-gray-400">Loading pricing rules...</div>
            ) : prices.length === 0 ? (
                <div className="text-center py-10 text-gray-400">No pricing rules found. Please seed the database.</div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {prices.map((price) => (
                        <div key={price._id} className="bg-white p-8 rounded-[2rem] border border-black/5 shadow-sm hover:shadow-xl transition-all group relative">
                            <div className="flex items-center gap-4 mb-6">
                                <div className="w-12 h-12 bg-gray-50 rounded-2xl flex items-center justify-center border border-black/5 group-hover:bg-[#F7DC9D]/20 transition-colors">
                                    <IndianRupee size={20} className="text-black group-hover:text-[#F7DC9D] transition-colors" />
                                </div>
                                <div>
                                    <h3 className="font-black text-black uppercase tracking-tight">{price.serviceType}</h3>
                                    <div className="flex items-center gap-2 mt-0.5">
                                        <span className="text-[10px] font-bold text-[#F7DC9D] uppercase tracking-widest">{price.tripMode}</span>
                                        <span className="text-gray-200 text-[8px]">•</span>
                                        <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                                            {price.vehicleCategoryId?.name || 'Unknown Vehicle'}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {editingId === price._id ? (
                                <div className="space-y-3 mb-6 p-4 bg-gray-50 rounded-2xl border border-gray-200">
                                    {price.serviceType === 'tours' ? (
                                        <div className="flex flex-col gap-1">
                                            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Package Price</label>
                                            <input type="number" className="p-2 border border-gray-300 rounded text-sm" value={editForm.packagePrice} onChange={e => setEditForm({...editForm, packagePrice: Number(e.target.value)})} />
                                        </div>
                                    ) : (
                                        <>
                                            <div className="flex flex-col gap-1">
                                                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Base Fare</label>
                                                <input type="number" className="p-2 border border-gray-300 rounded text-sm" value={editForm.baseFare} onChange={e => setEditForm({...editForm, baseFare: Number(e.target.value)})} />
                                            </div>
                                            <div className="flex flex-col gap-1">
                                                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Per Km Rate</label>
                                                <input type="number" className="p-2 border border-gray-300 rounded text-sm" value={editForm.perKmRate} onChange={e => setEditForm({...editForm, perKmRate: Number(e.target.value)})} />
                                            </div>
                                            <div className="flex flex-col gap-1">
                                                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Minimum Km</label>
                                                <input type="number" className="p-2 border border-gray-300 rounded text-sm" value={editForm.minimumKm} onChange={e => setEditForm({...editForm, minimumKm: Number(e.target.value)})} />
                                            </div>
                                            {price.serviceType === 'outstation' && (
                                                <div className="flex flex-col gap-1">
                                                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Driver Allowance</label>
                                                    <input type="number" className="p-2 border border-gray-300 rounded text-sm" value={editForm.driverAllowance} onChange={e => setEditForm({...editForm, driverAllowance: Number(e.target.value)})} />
                                                </div>
                                            )}
                                        </>
                                    )}
                                    <div className="flex justify-end gap-2 mt-4">
                                        <button onClick={handleCancelEdit} className="p-2 text-gray-500 hover:text-red-500 bg-white rounded shadow-sm border border-gray-200"><X size={16} /></button>
                                        <button onClick={() => handleSaveEdit(price._id)} className="p-2 text-white bg-black hover:bg-emerald-600 rounded shadow-sm"><Check size={16} /></button>
                                    </div>
                                </div>
                            ) : (
                                <>
                                    <div className="bg-gray-50 rounded-2xl p-6 mb-6 grid grid-cols-2 gap-4 border border-black/5">
                                        <div>
                                            <p className="text-[8px] font-black text-gray-400 uppercase tracking-widest mb-1">
                                                {price.serviceType === 'tours' ? 'Package Fare' : 'Base Fare'}
                                            </p>
                                            <p className="text-2xl font-serif font-black text-black">
                                                ₹{price.serviceType === 'tours' ? price.packagePrice : price.baseFare}
                                            </p>
                                        </div>
                                        <div className="flex flex-col justify-end text-right">
                                            <div className="flex items-center justify-end gap-1 text-emerald-500">
                                                <Info size={10} />
                                                <span className="text-[9px] font-black uppercase tracking-tighter">Active Rate</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="space-y-3">
                                        {price.serviceType !== 'tours' && (
                                            <>
                                                <div className="flex justify-between items-center px-2">
                                                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Per Km Rate</span>
                                                    <span className="text-[10px] font-black text-black">₹{price.perKmRate}/km</span>
                                                </div>
                                                <div className="flex justify-between items-center px-2">
                                                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Minimum Km</span>
                                                    <span className="text-[10px] font-black text-black">{price.minimumKm} km</span>
                                                </div>
                                            </>
                                        )}
                                        {price.serviceType === 'outstation' && (
                                            <div className="flex justify-between items-center px-2">
                                                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Driver Allowance</span>
                                                <span className="text-[10px] font-black text-black">₹{price.driverAllowance}/day</span>
                                            </div>
                                        )}
                                    </div>

                                    <button 
                                        onClick={() => handleEditClick(price)}
                                        className="absolute top-8 right-8 p-3 text-gray-300 hover:text-[#F7DC9D] transition-all"
                                    >
                                        <Edit size={18} />
                                    </button>
                                </>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default BasePrices;
