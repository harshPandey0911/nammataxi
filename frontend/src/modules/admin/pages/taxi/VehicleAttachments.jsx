import React, { useState, useEffect } from 'react';
import { Search, ChevronLeft, ChevronRight, ListFilter, Car, User, MapPin, Loader2, ShieldCheck } from 'lucide-react';
import api from '../../../../lib/api';

const VehicleAttachments = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [attachments, setAttachments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [uploadingId, setUploadingId] = useState(null);
    const fileInputRef = React.useRef(null);
    const [selectedCategoryId, setSelectedCategoryId] = useState(null);
    
    const fetchAttachments = async () => {
        try {
            setLoading(true);
            const res = await api.get('/drivers');
            if (res && res.data) {
                setAttachments(res.data);
            }
        } catch (error) {
            console.error('Failed to fetch vehicle attachments:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleImageClick = (categoryId) => {
        setSelectedCategoryId(categoryId);
        fileInputRef.current?.click();
    };

    const handleFileChange = async (e) => {
        const file = e.target.files[0];
        if (!file || !selectedCategoryId) return;

        try {
            setUploadingId(selectedCategoryId);
            const formData = new FormData();
            formData.append('image', file);
            
            // 1. Upload the image
            const uploadRes = await api.post('/upload/image', formData);
            if (uploadRes && uploadRes.data) {
                const imageUrl = uploadRes.data.url;
                
                // 2. Update the vehicle category
                await api.patch(`/vehicle-categories/${selectedCategoryId}`, { image: imageUrl });
                
                // 3. Refresh the list to show new image
                fetchAttachments();
                alert('Image updated successfully!');
            }
        } catch (error) {
            console.error('Upload failed:', error);
            alert('Failed to upload image');
        } finally {
            setUploadingId(null);
            setSelectedCategoryId(null);
            e.target.value = ''; // Reset input
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to remove this vehicle attachment?')) return;
        try {
            await api.delete(`/drivers/${id}`);
            setAttachments(prev => prev.filter(item => item._id !== id));
        } catch (error) {
            console.error('Failed to delete vehicle attachment:', error);
            alert('Failed to delete');
        }
    };

    useEffect(() => {
        fetchAttachments();
    }, []);

    const filteredAttachments = attachments.filter(item => 
        item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.phone.includes(searchTerm) ||
        (item.vehicleNumber && item.vehicleNumber.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    return (
        <div className="p-1 md:p-3 bg-white min-h-screen font-inter animate-in fade-in duration-500 text-left">
            <style>
                {`
                @import url('https://fonts.googleapis.com/css2?family=Roboto:wght@400;500;700;900&display=swap');
                .font-roboto { font-family: 'Roboto', sans-serif; }
                `}
            </style>

            {/* Header Section */}
            <div className="mb-6 flex items-center justify-between">
                <div>
                    <h1 className="text-[22px] font-black text-black uppercase tracking-tight font-roboto">VEHICLE ATTACHMENTS</h1>
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1 italic">Fleet Onboarding & Verification Hub</p>
                </div>
                <div className="flex items-center gap-4 bg-emerald-50 px-6 py-3 rounded-2xl border border-emerald-100 shadow-sm">
                    <div className="text-right">
                        <p className="text-[9px] font-black text-emerald-600 uppercase tracking-widest">Active Fleet</p>
                        <p className="text-xl font-black text-emerald-700">{loading ? '...' : attachments.length}</p>
                    </div>
                    <div className="w-px h-8 bg-emerald-200" />
                    <Car className="text-emerald-600" size={24} />
                </div>
            </div>

            {/* Controls Section */}
            <div className="mb-4 flex flex-col md:flex-row md:items-center justify-between gap-4 px-1">
                <div className="flex items-center gap-3">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={14} />
                        <input 
                            type="text" 
                            placeholder="Search Driver or Plate .."
                            className="pl-9 pr-4 py-2 border border-black/10 rounded-none text-[13px] focus:outline-none focus:border-black transition-colors placeholder:text-gray-400 bg-gray-50/50 min-w-[280px]"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <button className="px-6 py-2 bg-black hover:bg-zinc-800 text-white font-bold text-[13px] rounded-none transition-all uppercase tracking-tight shadow-md">
                        Filter Fleet
                    </button>
                </div>
                
                <div className="text-[11px] font-black text-gray-400 uppercase tracking-[0.2em]">
                    Displaying Live Metadata From Infrastructure
                </div>
            </div>

            {/* Table Section */}
            <div className="border border-gray-200 rounded-none overflow-hidden overflow-x-auto bg-white shadow-sm">
                <table className="w-full border-collapse min-w-[1000px]">
                    <thead>
                        <tr className="bg-[#FDFDFD] border-b border-gray-200">
                            <th className="px-4 py-4 text-left text-[11px] font-black text-black uppercase tracking-widest border-r border-gray-200 w-[60px]">Sr</th>
                            <th className="px-4 py-4 text-left text-[11px] font-black text-black uppercase tracking-widest border-r border-gray-200">Vehicle Specification</th>
                            <th className="px-4 py-4 text-left text-[11px] font-black text-black uppercase tracking-widest border-r border-gray-200">Partner Details</th>
                            <th className="px-4 py-4 text-left text-[11px] font-black text-black uppercase tracking-widest border-r border-gray-200">License & Auth</th>
                            <th className="px-4 py-4 text-left text-[11px] font-black text-black uppercase tracking-widest border-r border-gray-200">Status</th>
                            <th className="px-4 py-4 text-left text-[11px] font-black text-black uppercase tracking-widest border-r border-gray-200">Onboarding</th>
                            <th className="px-4 py-4 text-left text-[11px] font-black text-black uppercase tracking-widest">Action</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                        {loading ? (
                            <tr>
                                <td colSpan="6" className="px-4 py-20 text-center">
                                    <div className="flex flex-col items-center gap-3">
                                        <Loader2 className="animate-spin text-black" size={32} />
                                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Polling Fleet Telemetry...</p>
                                    </div>
                                </td>
                            </tr>
                        ) : filteredAttachments.length === 0 ? (
                            <tr>
                                <td colSpan="6" className="px-4 py-20 text-center text-gray-400 italic font-medium">No attached vehicles found.</td>
                            </tr>
                        ) : filteredAttachments.map((item, index) => (
                            <tr key={item._id} className="hover:bg-gray-50/80 transition-colors group">
                                <td className="px-4 py-4 text-[12px] font-black text-gray-400 border-r border-gray-200">{index + 1}</td>
                                <td className="px-4 py-4 border-r border-gray-200">
                                    <div className="flex items-center gap-4">
                                        <div 
                                            onClick={() => item.vehicleCategoryId?._id && handleImageClick(item.vehicleCategoryId._id)}
                                            className={`w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center group-hover:bg-[#F7DC9D]/20 transition-colors shrink-0 border border-black/5 overflow-hidden cursor-pointer relative
                                                ${uploadingId === item.vehicleCategoryId?._id ? 'opacity-50' : ''}`}
                                        >
                                            {uploadingId === item.vehicleCategoryId?._id ? (
                                                <Loader2 className="animate-spin text-black" size={20} />
                                            ) : item.vehicleCategoryId?.image ? (
                                                <img 
                                                    src={item.vehicleCategoryId.image} 
                                                    alt={item.vehicleCategoryId.name} 
                                                    className="w-full h-full object-contain p-1"
                                                />
                                            ) : (
                                                <Car size={24} className="text-black group-hover:text-amber-600 transition-colors" />
                                            )}
                                        </div>
                                        <div>
                                            <p className="text-[12px] font-black text-black uppercase tracking-tight">
                                                {item.vehicleCategoryId?.name || 'GENERIC FLEET'}
                                            </p>
                                            <p className="text-[10px] font-bold text-amber-600 uppercase tracking-[0.15em] mt-0.5">
                                                {item.vehicleNumber || 'NO_PLATE'}
                                            </p>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-4 py-4 border-r border-gray-200">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-full bg-zinc-800 flex items-center justify-center text-white text-[10px] font-black shrink-0">
                                            {item.name.charAt(0).toUpperCase()}
                                        </div>
                                        <div>
                                            <p className="text-[12px] font-black text-black uppercase tracking-tight">{item.name}</p>
                                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{item.phone}</p>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-4 py-4 border-r border-gray-200">
                                    <div className="flex items-center gap-2">
                                        <ShieldCheck size={14} className="text-emerald-500" />
                                        <span className="text-[11px] font-black text-gray-700 uppercase tracking-tighter">
                                            {item.licenseNumber || 'PENDING_VERIFICATION'}
                                        </span>
                                    </div>
                                    <p className="text-[8px] font-black text-gray-400 uppercase mt-1 tracking-widest">RTO REGISTERED</p>
                                </td>
                                <td className="px-4 py-4 border-r border-gray-200">
                                    <span className={`px-3 py-1 rounded-sm text-[8px] font-black uppercase tracking-widest
                                        ${item.isActive ? 'bg-black text-[#F7DC9D]' : 'bg-red-500 text-white'}`}
                                    >
                                        {item.isActive ? 'Active' : 'Suspended'}
                                    </span>
                                    <p className="text-[8px] font-black text-gray-400 uppercase mt-1">Status: {item.status}</p>
                                </td>
                                <td className="px-4 py-4 border-r border-gray-200">
                                    <p className="text-[11px] font-black text-gray-500 uppercase">
                                        {new Date(item.createdAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
                                    </p>
                                    <p className="text-[9px] font-bold text-gray-400 uppercase mt-0.5">Fleet Onboarded</p>
                                </td>
                                <td className="px-4 py-4">
                                    <button 
                                        onClick={() => handleDelete(item._id)}
                                        className="px-3 py-1.5 bg-red-50 text-red-600 text-[10px] font-black uppercase tracking-widest rounded-lg hover:bg-red-600 hover:text-white transition-all border border-red-100"
                                    >
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Hidden File Input for Image Upload */}
                                        <input 
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                className="hidden"
                accept="image/*"
            />

            {/* Footer Copyright */}
            <div className="mt-12 text-center text-[10px] font-bold text-gray-400 py-6 border-t border-gray-100 uppercase tracking-[0.4em]">
                NAMMA TAXI • FLEET ASSET MANAGEMENT
            </div>
        </div>
    );
};

export default VehicleAttachments;
