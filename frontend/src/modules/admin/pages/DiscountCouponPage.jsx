import React, { useState, useEffect, useMemo } from 'react';
import {
    Plus,
    Ticket,
    Activity,
    Clock,
    Edit2,
    Trash2,
    Loader2,
    Percent,
    Zap
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import api from '../../../lib/api';
import Pagination from '../components/Pagination';
import DataTable from '../components/common/DataTable';
import AdminStatsCard from '../components/AdminStatsCard';

const DiscountCouponPage = () => {
    const navigate = useNavigate();
    const [coupons, setCoupons] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 8;

    const fetchCoupons = async () => {
        try {
            setLoading(true);
            const res = await api.get('/coupons');
            if (res && res.data) {
                // For "Discount Coupons" page, we might want to filter or just show all
                // For now, let's show percentage based ones or all with a "Discount" focus
                setCoupons(res.data);
            }
        } catch (error) {
            console.error('Failed to fetch coupons:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCoupons();
    }, []);

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this discount coupon?')) {
            try {
                await api.delete(`/coupons/${id}`);
                fetchCoupons();
            } catch (error) {
                alert('Failed to delete coupon');
            }
        }
    };

    const filteredCoupons = useMemo(() => {
        return (coupons || [])
            .filter(c => 
                (c.code?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                c.description?.toLowerCase().includes(searchTerm.toLowerCase())) &&
                c.type === 'percentage' // Focusing on percentage discounts for this specific page
            )
            .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    }, [coupons, searchTerm]);

    const paginatedCoupons = useMemo(() => {
        const startIndex = (currentPage - 1) * itemsPerPage;
        return filteredCoupons.slice(startIndex, startIndex + itemsPerPage);
    }, [filteredCoupons, currentPage]);

    const totalPages = Math.ceil(filteredCoupons.length / itemsPerPage);

    const getCouponStatus = (coupon) => {
        const now = new Date();
        if (!coupon.isActive) return { label: 'Inactive', color: 'bg-gray-100 text-gray-400 border-gray-200' };
        if (coupon.validUntil && new Date(coupon.validUntil) < now) return { label: 'Expired', color: 'bg-red-50 text-red-600 border-red-100' };
        return { label: 'Active', color: 'bg-emerald-50 text-emerald-600 border-emerald-100' };
    };

    const columns = [
        {
            key: 'code',
            header: 'Campaign Code',
            render: (coupon) => (
                <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-[#F7DC9D] text-black rounded-none flex items-center justify-center shadow-sm shrink-0">
                        <Percent size={18} strokeWidth={3} />
                    </div>
                    <div>
                        <p className="font-black text-black text-[13px] tracking-tight uppercase">{coupon.code}</p>
                        <p className="text-[10px] text-gray-400 font-bold mt-0.5 max-w-[200px] truncate normal-case italic">{coupon.description || 'Global Discount'}</p>
                    </div>
                </div>
            )
        },
        {
            key: 'discount',
            header: 'Offer Value',
            render: (coupon) => (
                <div>
                    <span className="text-black bg-[#F7DC9D]/20 px-2 py-0.5 rounded-none text-[10px] font-black border border-[#F7DC9D]/30 uppercase tracking-tighter">
                        {coupon.value}% OFF
                    </span>
                    <p className="text-[10px] text-gray-400 font-bold mt-1 uppercase tracking-widest">Cap: <span className="text-black">₹{coupon.maxDiscount || 'None'}</span></p>
                </div>
            )
        },
        {
            key: 'usage',
            header: 'Performance',
            render: (coupon) => (
                <div className="space-y-1">
                    <p className="text-[11px] font-black text-black">{coupon.usageCount} Conversions</p>
                    <div className="w-24 h-1 bg-gray-100 rounded-full overflow-hidden">
                        <div 
                            className="h-full bg-black" 
                            style={{ width: `${Math.min((coupon.usageCount / (coupon.usageLimit || 100)) * 100, 100)}%` }}
                        ></div>
                    </div>
                </div>
            )
        },
        {
            key: 'status',
            header: 'Live Status',
            render: (coupon) => {
                const status = getCouponStatus(coupon);
                return (
                    <span className={`px-2 py-1 rounded-none text-[9px] font-black uppercase tracking-widest border ${status.color}`}>
                        {status.label}
                    </span>
                );
            }
        },
        {
            key: 'actions',
            header: 'Control',
            align: 'right',
            render: (coupon) => (
                <div className="flex items-center justify-end gap-2">
                    <button
                        onClick={() => navigate(`/admin/coupons/edit/${coupon._id}`)}
                        className="p-2 text-gray-400 hover:text-black transition-colors"
                    >
                        <Edit2 size={16} />
                    </button>
                    <button
                        onClick={() => handleDelete(coupon._id)}
                        className="p-2 text-gray-400 hover:text-red-600 transition-colors"
                    >
                        <Trash2 size={16} />
                    </button>
                </div>
            )
        }
    ];

    return (
        <div className="p-1 md:p-3 bg-white min-h-screen font-inter animate-in fade-in duration-500 text-left">
            <style>
                {`
                @import url('https://fonts.googleapis.com/css2?family=Roboto:wght@400;500;700;900&display=swap');
                .font-roboto { font-family: 'Roboto', sans-serif; }
                `}
            </style>

            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                <div>
                    <h1 className="text-[22px] font-black text-black uppercase tracking-tight font-roboto">DISCOUNT COUPONS</h1>
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1 italic">High-performance percentage based marketing tools</p>
                </div>
                <button
                    onClick={() => navigate('/admin/coupons/add')}
                    className="bg-black text-white px-6 py-2.5 rounded-none font-black text-[11px] uppercase tracking-widest flex items-center gap-2 hover:bg-zinc-800 transition-all shadow-lg active:scale-95"
                >
                    <Plus size={16} strokeWidth={3} /> Create Discount
                </button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                <AdminStatsCard
                    label="Total Discounts"
                    value={filteredCoupons.length}
                    icon={Percent}
                    color="text-black"
                    bgColor="bg-gray-50"
                />
                <AdminStatsCard
                    label="Active Campaigns"
                    value={filteredCoupons.filter(c => getCouponStatus(c).label === 'Active').length}
                    icon={Activity}
                    color="text-emerald-600"
                    bgColor="bg-emerald-50"
                />
                <AdminStatsCard
                    label="Total Conversions"
                    value={filteredCoupons.reduce((acc, curr) => acc + (curr.usageCount || 0), 0)}
                    icon={Zap}
                    color="text-amber-600"
                    bgColor="bg-amber-50"
                />
            </div>

            {loading ? (
                <div className="py-20 flex flex-col items-center gap-3 border border-gray-100 rounded-none bg-gray-50/30">
                    <Loader2 className="animate-spin text-black" size={32} />
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Scanning Discount Database...</p>
                </div>
            ) : (
                <>
                    <DataTable
                        columns={columns}
                        data={paginatedCoupons}
                        searchTerm={searchTerm}
                        setSearchTerm={setSearchTerm}
                        searchPlaceholder="Search by code or description..."
                    />

                    <div className="mt-6 flex flex-col md:flex-row justify-between items-center gap-4 px-2">
                        <div className="text-[10px] text-gray-400 font-black uppercase tracking-widest">
                            Showing {paginatedCoupons.length} of {filteredCoupons.length} Campaigns
                        </div>
                        <Pagination
                            currentPage={currentPage}
                            totalPages={totalPages}
                            onPageChange={setCurrentPage}
                            totalItems={filteredCoupons.length}
                            itemsPerPage={itemsPerPage}
                        />
                    </div>
                </>
            )}

            {/* Footer */}
            <div className="mt-12 text-center text-[10px] font-bold text-gray-400 py-6 border-t border-gray-100 uppercase tracking-[0.4em]">
                NAMMA TAXI • REVENUE ENGINE
            </div>
        </div>
    );
};

export default DiscountCouponPage;
