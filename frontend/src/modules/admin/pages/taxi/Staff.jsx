import React, { useState, useEffect } from 'react';
import { PlusCircle, Pencil, ListFilter, Search, Loader2, X, Shield, Mail, Phone, MapPin, Key } from 'lucide-react';
import api from '../../../../lib/api';

const Staff = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [staffList, setStaffList] = useState([]);
    const [loading, setLoading] = useState(true);
    
    // Modal states
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        passwordHash: '',
        address: '',
        role: 'staff'
    });

    const fetchStaff = async () => {
        try {
            setLoading(true);
            const res = await api.get('/staff');
            if (res && res.data) {
                setStaffList(res.data);
            }
        } catch (error) {
            console.error('Failed to fetch staff:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchStaff();
    }, []);

    const handleOpenModal = (staff = null) => {
        if (staff) {
            setEditingId(staff._id);
            setFormData({
                name: staff.name || '',
                email: staff.email || '',
                phone: staff.phone || '',
                passwordHash: '', // Leave empty for security during edit
                address: staff.address || '',
                role: staff.role || 'staff'
            });
        } else {
            setEditingId(null);
            setFormData({
                name: '',
                email: '',
                phone: '',
                passwordHash: '',
                address: '',
                role: 'staff'
            });
        }
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setEditingId(null);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            setIsSubmitting(true);
            
            const submitData = { ...formData };
            // If editing and password is empty, don't send it
            if (editingId && !submitData.passwordHash) {
                delete submitData.passwordHash;
            }

            if (editingId) {
                await api.patch(`/staff/${editingId}`, submitData);
            } else {
                await api.post('/staff', submitData);
            }
            
            fetchStaff();
            handleCloseModal();
        } catch (error) {
            alert(error.response?.data?.message || 'Operation failed');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleToggleStatus = async (id) => {
        try {
            await api.patch(`/staff/${id}/toggle`);
            fetchStaff();
        } catch (error) {
            alert('Failed to update status');
        }
    };

    const filteredStaff = staffList.filter(item => 
        item.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.email?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="p-0.5 md:p-1 bg-[#F8F9FA] min-h-screen font-inter animate-in fade-in duration-300 text-left relative selection:bg-black selection:text-white">
            <style>
                {`
                @import url('https://fonts.googleapis.com/css2?family=Roboto:wght@400;500;700;900&display=swap');
                .font-roboto { font-family: 'Roboto', sans-serif; }
                .hide-scrollbar::-webkit-scrollbar { display: none; }
                .industrial-shadow { shadow-sm; border: 1px solid rgba(0,0,0,0.05); }
                `}
            </style>

            {/* Top Command Bar */}
            <div className="bg-white border border-gray-200 px-2 py-1.5 mb-1.5 flex items-center justify-between sticky top-0 z-50 shadow-sm">
                <div className="flex items-center gap-2">
                    <div className="w-1.5 h-6 bg-black"></div>
                    <div>
                        <h1 className="text-[14px] font-black text-black uppercase tracking-tighter font-roboto leading-none">STAFF_OPS</h1>
                        <p className="text-[7px] font-bold text-gray-400 uppercase tracking-[0.2em] leading-none mt-0.5">Personnel Control</p>
                    </div>
                </div>
                
                <div className="flex items-center gap-1.5">
                    <div className="relative group hidden sm:block">
                        <Search className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-black transition-colors" size={10} />
                        <input 
                            type="text" 
                            className="pl-6 pr-2 py-1 border border-gray-100 rounded-none focus:outline-none focus:border-black text-[9px] bg-gray-50/50 w-[140px] md:w-[200px] transition-all font-black uppercase tracking-tight"
                            placeholder="SEARCH_ID..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <button 
                        onClick={() => handleOpenModal()}
                        className="bg-black hover:bg-zinc-800 text-[#F7DC9D] p-1.5 transition-all shadow-md active:scale-95"
                    >
                        <PlusCircle size={14} />
                    </button>
                </div>
            </div>

            {/* Mobile Search - Visible only on mobile */}
            <div className="sm:hidden px-0.5 mb-1.5">
                <div className="relative">
                    <Search className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-300" size={10} />
                    <input 
                        type="text" 
                        className="w-full pl-6 pr-2 py-1.5 border border-gray-200 rounded-none focus:outline-none focus:border-black text-[9px] bg-white font-black uppercase tracking-tight shadow-sm"
                        placeholder="QUICK_SEARCH..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            {/* Desktop View - High Density Table */}
            <div className="hidden md:block border border-gray-200 bg-white overflow-hidden shadow-sm">
                <table className="w-full border-collapse">
                    <thead>
                        <tr className="bg-[#FDFDFD] border-b border-gray-100">
                            <th className="px-2 py-1.5 text-left text-[8px] font-black text-black uppercase tracking-widest border-r border-gray-50 w-[35px]">SR</th>
                            <th className="px-2 py-1.5 text-left text-[8px] font-black text-black uppercase tracking-widest border-r border-gray-50">PERSONNEL</th>
                            <th className="px-2 py-1.5 text-left text-[8px] font-black text-black uppercase tracking-widest border-r border-gray-50">CONTACT_INFO</th>
                            <th className="px-2 py-1.5 text-left text-[8px] font-black text-black uppercase tracking-widest border-r border-gray-50">STATION_LOC</th>
                            <th className="px-2 py-1.5 text-left text-[8px] font-black text-black uppercase tracking-widest border-r border-gray-50 w-[70px]">PRIVILEGE</th>
                            <th className="px-2 py-1.5 text-center text-[8px] font-black text-black uppercase tracking-widest border-r border-gray-50 w-[60px]">AUTH</th>
                            <th className="px-2 py-1.5 text-right text-[8px] font-black text-black uppercase tracking-widest w-[80px]">CONTROL</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                        {loading ? (
                            <tr><td colSpan="7" className="py-10 text-center font-black text-[9px] text-gray-300 uppercase tracking-widest animate-pulse">POLLING_RECORDS...</td></tr>
                        ) : filteredStaff.length === 0 ? (
                            <tr><td colSpan="7" className="py-10 text-center font-black text-[9px] text-gray-300 uppercase tracking-widest italic">NO_SESSIONS_ACTIVE</td></tr>
                        ) : filteredStaff.map((item, index) => (
                            <tr key={item._id} className="hover:bg-[#FFFDF6] transition-colors group">
                                <td className="px-2 py-1 text-[9px] text-gray-300 font-black border-r border-gray-50">{index + 1}</td>
                                <td className="px-2 py-1 border-r border-gray-50">
                                    <div className="flex items-center gap-1.5">
                                        <div className="w-5 h-5 bg-black rounded-none flex items-center justify-center text-[#F7DC9D] text-[8px] font-black shrink-0 border border-white/10">
                                            {item.name?.charAt(0)}
                                        </div>
                                        <p className="text-[10px] font-black text-black uppercase tracking-tight leading-none truncate">{item.name}</p>
                                    </div>
                                </td>
                                <td className="px-2 py-1 border-r border-gray-50">
                                    <p className="text-[9px] font-bold text-gray-600 leading-none truncate">{item.email}</p>
                                    <p className="text-[7px] text-gray-400 font-black tracking-widest mt-0.5 uppercase italic">{item.phone || 'NA'}</p>
                                </td>
                                <td className="px-2 py-1 text-[9px] text-gray-400 border-r border-gray-50 uppercase font-bold truncate max-w-[150px] leading-tight italic">{item.address || 'DEFAULT_STATION'}</td>
                                <td className="px-2 py-1 border-r border-gray-50">
                                    <span className={`px-1 py-0.5 text-[7px] font-black uppercase tracking-[0.15em] border ${item.role === 'admin' ? 'bg-black text-white border-black' : 'bg-gray-50 text-gray-400 border-gray-100'}`}>
                                        {item.role}
                                    </span>
                                </td>
                                <td className="px-2 py-1 border-r border-gray-50 text-center">
                                    <span className={`px-1 py-0.5 text-[7px] font-black uppercase tracking-widest border
                                        ${item.isActive ? 'text-emerald-600 border-emerald-100 bg-emerald-50/30' : 'text-red-400 border-red-50 bg-red-50/10'}`}
                                    >
                                        {item.isActive ? 'ACTIVE' : 'LOCKED'}
                                    </span>
                                </td>
                                <td className="px-2 py-1">
                                    <div className="flex items-center justify-end gap-1.5">
                                        <button onClick={() => handleOpenModal(item)} className="p-1 text-gray-300 hover:text-black transition-all hover:bg-gray-100">
                                            <Pencil size={10} />
                                        </button>
                                        <div 
                                            onClick={() => handleToggleStatus(item._id)}
                                            className={`w-6 h-3 rounded-full p-0.5 transition-all cursor-pointer flex items-center shadow-inner
                                                ${item.isActive ? 'bg-emerald-500' : 'bg-gray-200'}`}
                                        >
                                            <div className={`w-2 h-2 bg-white rounded-full transform transition-transform duration-200 ${item.isActive ? 'translate-x-3' : 'translate-x-0'}`}></div>
                                        </div>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Mobile View - High Density Grid */}
            <div className="md:hidden grid grid-cols-1 gap-1 px-0.5">
                {loading ? (
                    <div className="py-10 text-center font-black text-[9px] text-gray-300 uppercase tracking-widest">POLLING_OPS...</div>
                ) : filteredStaff.map((item) => (
                    <div key={item._id} className="bg-white border border-gray-200 p-1.5 relative overflow-hidden shadow-sm">
                        <div className={`absolute top-0 right-0 w-1 h-full ${item.isActive ? 'bg-emerald-500' : 'bg-red-500'}`}></div>
                        <div className="flex items-center justify-between mb-1">
                            <div className="flex items-center gap-1.5">
                                <div className="w-5 h-5 bg-black flex items-center justify-center text-[#F7DC9D] text-[8px] font-black">
                                    {item.name?.charAt(0)}
                                </div>
                                <div>
                                    <p className="text-[10px] font-black text-black uppercase tracking-tight leading-none">{item.name}</p>
                                    <p className="text-[7px] font-bold text-gray-400 mt-0.5 uppercase tracking-widest">{item.role}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                <button onClick={() => handleOpenModal(item)} className="p-1 text-gray-400">
                                    <Pencil size={11} />
                                </button>
                                <div 
                                    onClick={() => handleToggleStatus(item._id)}
                                    className={`w-6 h-3 rounded-full p-0.5 flex items-center ${item.isActive ? 'bg-emerald-500' : 'bg-gray-200'}`}
                                >
                                    <div className={`w-2 h-2 bg-white rounded-full ${item.isActive ? 'translate-x-3' : 'translate-x-0'} transition-all`}></div>
                                </div>
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-2 mt-1 bg-gray-50/50 p-1 border border-gray-100">
                            <div>
                                <p className="text-[6px] font-black text-gray-400 uppercase tracking-widest">IDENTITY</p>
                                <p className="text-[8px] font-bold text-gray-600 truncate">{item.email}</p>
                            </div>
                            <div>
                                <p className="text-[6px] font-black text-gray-400 uppercase tracking-widest">LOCATION</p>
                                <p className="text-[8px] font-bold text-gray-600 truncate">{item.address || 'DEFAULT'}</p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Modal - Nano Pro */}
            {isModalOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-2 sm:p-4">
                    <div className="absolute inset-0 bg-black/40 backdrop-blur-[1px]" onClick={handleCloseModal}></div>
                    <div className="bg-white w-full max-w-[320px] relative z-10 shadow-2xl animate-in zoom-in duration-100 border border-black/10">
                        <div className="bg-black px-3 py-2 flex items-center justify-between border-b border-white/5">
                            <div>
                                <h2 className="text-white font-black text-[11px] uppercase tracking-tight font-roboto leading-none">
                                    {editingId ? 'MOD_SESSION' : 'AUTH_REG'}
                                </h2>
                                <p className="text-[6px] text-gray-500 font-bold uppercase tracking-widest mt-0.5">Personnel_Protocol_v3</p>
                            </div>
                            <button onClick={handleCloseModal} className="text-gray-500 hover:text-white">
                                <X size={14} />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="p-3 space-y-2.5">
                            <div className="space-y-0.5">
                                <label className="text-[7px] font-black text-gray-400 uppercase tracking-widest ml-0.5 text-left block">Identity Name</label>
                                <input 
                                    required type="text" 
                                    className="w-full px-2 py-1.5 border border-gray-100 focus:outline-none focus:border-black text-[10px] font-black bg-gray-50/30 uppercase tracking-tighter"
                                    placeholder="FULL_NAME"
                                    value={formData.name}
                                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-2">
                                <div className="space-y-0.5">
                                    <label className="text-[7px] font-black text-gray-400 uppercase tracking-widest ml-0.5 text-left block">Role Level</label>
                                    <select 
                                        className="w-full px-2 py-1.5 border border-gray-100 focus:outline-none focus:border-black text-[10px] font-black bg-white"
                                        value={formData.role}
                                        onChange={(e) => setFormData({...formData, role: e.target.value})}
                                    >
                                        <option value="staff">STAFF</option>
                                        <option value="admin">ADMIN</option>
                                    </select>
                                </div>
                                <div className="space-y-0.5">
                                    <label className="text-[7px] font-black text-gray-400 uppercase tracking-widest ml-0.5 text-left block">Security Hash</label>
                                    <input 
                                        required={!editingId} type="password" 
                                        className="w-full px-2 py-1.5 border border-gray-100 focus:outline-none focus:border-black text-[10px] font-black"
                                        placeholder={editingId ? "SECURE" : "PASS"}
                                        value={formData.passwordHash}
                                        onChange={(e) => setFormData({...formData, passwordHash: e.target.value})}
                                    />
                                </div>
                            </div>

                            <div className="space-y-0.5">
                                <label className="text-[7px] font-black text-gray-400 uppercase tracking-widest ml-0.5 text-left block">Email Interface</label>
                                <input 
                                    required type="email" 
                                    className="w-full px-2 py-1.5 border border-gray-100 focus:outline-none focus:border-black text-[10px] font-black"
                                    placeholder="ID@NAMMATAXI.COM"
                                    value={formData.email}
                                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                                />
                            </div>

                            <div className="space-y-0.5">
                                <label className="text-[7px] font-black text-gray-400 uppercase tracking-widest ml-0.5 text-left block">Communication Link (Phone)</label>
                                <input 
                                    required type="tel" 
                                    className="w-full px-2 py-1.5 border border-gray-100 focus:outline-none focus:border-black text-[10px] font-black bg-gray-50/30 uppercase tracking-tighter"
                                    placeholder="PHONE_NUMBER"
                                    value={formData.phone}
                                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                                />
                            </div>

                            <div className="space-y-0.5">
                                <label className="text-[7px] font-black text-gray-400 uppercase tracking-widest ml-0.5 text-left block">Station Location</label>
                                <textarea 
                                    className="w-full px-2 py-1.5 border border-gray-100 focus:outline-none focus:border-black text-[10px] font-black min-h-[40px] uppercase leading-tight"
                                    placeholder="OFFICE_ADDRESS"
                                    value={formData.address}
                                    onChange={(e) => setFormData({...formData, address: e.target.value})}
                                />
                            </div>

                            <button 
                                type="submit" disabled={isSubmitting}
                                className="w-full py-2 bg-black hover:bg-zinc-800 text-[#F7DC9D] font-black text-[9px] uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-2 shadow-lg active:scale-95"
                            >
                                {isSubmitting ? <Loader2 className="animate-spin" size={10} /> : (editingId ? 'COMMIT_CHANGES' : 'INITIALIZE_DEPLOY')}
                            </button>
                        </form>
                    </div>
                </div>
            )}

            {/* Footer Status */}
            <div className="mt-3 text-center text-[7px] font-black text-gray-300 py-3 uppercase tracking-[0.5em] border-t border-gray-50">
                NAMMA_TAXI // PERSONNEL_OPS // v3.0.1_STABLE
            </div>
        </div>
    );
};

export default Staff;
