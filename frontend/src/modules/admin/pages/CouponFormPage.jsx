import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
    ArrowLeft,
    Save,
    Ticket,
    Calendar,
    Settings,
    ShieldCheck,
    Info,
    CheckCircle2,
    Loader2
} from 'lucide-react';
import api from '../../../lib/api';
import PageHeader from '../components/common/PageHeader';
import { FormSection, Input, Select, TextArea } from '../components/common/FormControls';

const CouponFormPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const isEdit = Boolean(id);
    const [loading, setLoading] = useState(isEdit);
    const [saving, setSaving] = useState(false);

    const SERVICES = [
        { id: 'Outstation', name: 'Outstation' },
        { id: 'Airport Transfer', name: 'Airport Transfer' },
        { id: 'Local', name: 'Local Trip' }
    ];

    const VEHICLE_CATEGORIES = [
        'SEDAN', 'SUV 6', 'SUV 7', 'HATCHBACK', 'Tempo Traveller', 'Mini Bus', 'BUS 33'
    ];

    const [formData, setFormData] = useState({
        code: '',
        type: 'fixed',
        value: '',
        minOrderValue: '',
        maxDiscount: '',
        validFrom: new Date().toISOString().split('T')[0],
        validUntil: '',
        usageLimit: '',
        isActive: true,
        description: '',
        applicabilityType: 'all', // 'all', 'service', 'vehicle'
        targetItems: []
    });

    useEffect(() => {
        if (isEdit) {
            const fetchCoupon = async () => {
                try {
                    const res = await api.get(`/coupons`);
                    const coupon = res.data.find(c => c._id === id);
                    if (coupon) {
                        setFormData({
                            ...coupon,
                            validFrom: new Date(coupon.validFrom).toISOString().split('T')[0],
                            validUntil: new Date(coupon.validUntil).toISOString().split('T')[0],
                        });
                    }
                } catch (error) {
                    console.error('Failed to fetch coupon:', error);
                } finally {
                    setLoading(false);
                }
            };
            fetchCoupon();
        }
    }, [id, isEdit]);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const toggleTargetItem = (itemValue) => {
        setFormData(prev => {
            const current = prev.targetItems || [];
            if (current.includes(itemValue)) {
                return { ...prev, targetItems: current.filter(i => i !== itemValue) };
            } else {
                return { ...prev, targetItems: [...current, itemValue] };
            }
        });
    };

    const handleSave = async (e) => {
        if (e) e.preventDefault();
        try {
            setSaving(true);
            if (isEdit) {
                await api.patch(`/coupons/${id}`, formData);
            } else {
                await api.post('/coupons', formData);
            }
            navigate('/admin/coupons/list');
        } catch (error) {
            alert(error.response?.data?.message || 'Failed to save coupon');
        } finally {
            setSaving(false);
        }
    };

    const handleSaveAction = {
        label: saving ? 'Saving...' : (isEdit ? 'Update Coupon' : 'Deploy Coupon'),
        icon: saving ? <Loader2 className="animate-spin" size={16} /> : <Save size={16} />,
        onClick: handleSave
    };

    if (loading) {
        return (
            <div className="h-screen flex flex-col items-center justify-center gap-3">
                <Loader2 className="animate-spin text-black" size={40} />
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Retrieving Coupon Settings...</p>
            </div>
        );
    }

    return (
        <div className="p-1 md:p-3 bg-white min-h-screen font-inter animate-in fade-in duration-500 text-left pb-20">
            <PageHeader
                title={isEdit ? 'Configure Coupon' : 'New Promo Campaign'}
                subtitle={isEdit ? `Modifying settings for ${formData.code}` : 'Design a new high-conversion discount code'}
                backPath="/admin/coupons/list"
                action={handleSaveAction}
            />

            <form className="grid grid-cols-1 lg:grid-cols-12 gap-8 mt-10">
                <div className="lg:col-span-8 space-y-6">
                    <FormSection title="Core Settings" icon={<Info size={18} className="text-gray-400" />}>
                        <div className="space-y-5">
                            <div className="flex flex-col gap-1.5">
                                <Input
                                    label="Promotional Code"
                                    name="code"
                                    value={formData.code}
                                    onChange={handleChange}
                                    placeholder="e.g., TAXI50"
                                    className="uppercase font-black"
                                />
                                <div className="text-right">
                                    <button
                                        type="button"
                                        className="text-[10px] font-black text-black hover:underline uppercase tracking-widest"
                                        onClick={() => setFormData({ ...formData, code: `NAMMA${Math.floor(Math.random() * 900) + 100}` })}
                                    >
                                        Auto-Generate
                                    </button>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                <Select
                                    label="Discount Type"
                                    name="type"
                                    value={formData.type}
                                    onChange={handleChange}
                                    options={[
                                        { value: 'fixed', label: 'Flat Amount (₹)' },
                                        { value: 'percentage', label: 'Percentage (%)' }
                                    ]}
                                />
                                <Input
                                    label="Discount Value"
                                    type="number"
                                    name="value"
                                    value={formData.value}
                                    onChange={handleChange}
                                    placeholder={formData.type === 'percentage' ? 'e.g., 20' : 'e.g., 500'}
                                />
                            </div>

                            <TextArea
                                label="Campaign Description"
                                name="description"
                                value={formData.description}
                                onChange={handleChange}
                                rows="3"
                                placeholder="Explain the offer to customers..."
                            />
                        </div>
                    </FormSection>

                    <FormSection title="Applicability Scope" icon={<ShieldCheck size={18} className="text-gray-400" />}>
                        <div className="space-y-6">
                            <div className="flex p-1 bg-gray-100 rounded-none space-x-1 overflow-x-auto">
                                {[
                                    { id: 'all', label: 'All Services' },
                                    { id: 'service', label: 'Service Specific' },
                                    { id: 'vehicle', label: 'Vehicle Category' }
                                ].map(scope => (
                                    <button
                                        key={scope.id}
                                        type="button"
                                        onClick={() => setFormData({ ...formData, applicabilityType: scope.id, targetItems: [] })}
                                        className={`flex-1 py-2 px-3 rounded-none text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap ${formData.applicabilityType === scope.id
                                            ? 'bg-black text-white shadow-sm'
                                            : 'text-gray-500 hover:text-gray-700'
                                            }`}
                                    >
                                        {scope.label}
                                    </button>
                                ))}
                            </div>

                            <div className="border border-gray-100 rounded-none overflow-hidden min-h-[150px] p-4 bg-gray-50/30">
                                {formData.applicabilityType === 'all' && (
                                    <div className="h-full flex flex-col items-center justify-center text-center py-8 space-y-2">
                                        <CheckCircle2 size={24} className="text-emerald-500" />
                                        <p className="text-[11px] font-black text-black uppercase tracking-tight">Global Promotion</p>
                                        <p className="text-[10px] text-gray-400 font-bold max-w-xs uppercase tracking-wider">This coupon applies to any booking across the platform.</p>
                                    </div>
                                )}

                                {formData.applicabilityType === 'service' && (
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                        {SERVICES.map(service => (
                                            <label key={service.id} className="flex items-center gap-3 p-3 bg-white border border-gray-200 cursor-pointer hover:border-black transition-all">
                                                <div className={`w-4 h-4 border flex items-center justify-center ${formData.targetItems.includes(service.id) ? 'bg-black border-black' : 'border-gray-300'}`}>
                                                    {formData.targetItems.includes(service.id) && <CheckCircle2 size={10} className="text-white" />}
                                                </div>
                                                <input
                                                    type="checkbox"
                                                    className="hidden"
                                                    checked={formData.targetItems.includes(service.id)}
                                                    onChange={() => toggleTargetItem(service.id)}
                                                />
                                                <span className="text-[11px] font-black text-black uppercase">{service.name}</span>
                                            </label>
                                        ))}
                                    </div>
                                )}

                                {formData.applicabilityType === 'vehicle' && (
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                        {VEHICLE_CATEGORIES.map(cat => (
                                            <label key={cat} className="flex items-center gap-3 p-3 bg-white border border-gray-200 cursor-pointer hover:border-black transition-all">
                                                <div className={`w-4 h-4 border flex items-center justify-center ${formData.targetItems.includes(cat) ? 'bg-black border-black' : 'border-gray-300'}`}>
                                                    {formData.targetItems.includes(cat) && <CheckCircle2 size={10} className="text-white" />}
                                                </div>
                                                <input
                                                    type="checkbox"
                                                    className="hidden"
                                                    checked={formData.targetItems.includes(cat)}
                                                    onChange={() => toggleTargetItem(cat)}
                                                />
                                                <span className="text-[11px] font-black text-black uppercase">{cat}</span>
                                            </label>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    </FormSection>
                </div>

                <div className="lg:col-span-4 space-y-6">
                    <FormSection title="Validity Period" icon={<Calendar size={18} className="text-gray-400" />}>
                        <div className="space-y-4">
                            <Input
                                label="Start Date"
                                type="date"
                                name="validFrom"
                                value={formData.validFrom}
                                onChange={handleChange}
                            />
                            <Input
                                label="Expiry Date"
                                type="date"
                                name="validUntil"
                                value={formData.validUntil}
                                onChange={handleChange}
                            />
                        </div>
                    </FormSection>

                    <FormSection title="Limits & Caps" icon={<Settings size={18} className="text-gray-400" />}>
                        <div className="space-y-4">
                            <Input
                                label="Min Booking (₹)"
                                type="number"
                                name="minOrderValue"
                                value={formData.minOrderValue}
                                onChange={handleChange}
                            />
                            <Input
                                label="Max Discount (₹)"
                                type="number"
                                name="maxDiscount"
                                value={formData.maxDiscount}
                                onChange={handleChange}
                                disabled={formData.type === 'fixed'}
                                placeholder="Only for % coupons"
                            />
                            <Input
                                label="Total Usage Limit"
                                type="number"
                                name="usageLimit"
                                value={formData.usageLimit}
                                onChange={handleChange}
                                placeholder="e.g., 100"
                            />
                        </div>

                        <div className="h-px bg-gray-100 my-6"></div>

                        <div className="flex items-center justify-between p-1">
                            <span className="text-[11px] font-black text-black uppercase tracking-widest">Active Status</span>
                            <button
                                type="button"
                                onClick={() => setFormData({ ...formData, isActive: !formData.isActive })}
                                className={`w-11 h-5 rounded-full transition-all relative ${formData.isActive ? 'bg-emerald-500' : 'bg-gray-200'}`}
                            >
                                <div className={`absolute top-0.5 w-4 h-4 bg-white rounded-full transition-all ${formData.isActive ? 'right-0.5' : 'left-0.5 shadow-sm'}`}></div>
                            </button>
                        </div>
                    </FormSection>
                </div>
            </form>
        </div>
    );
};

export default CouponFormPage;
