import React, { useState } from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import AdminSidebar from '../components/AdminSidebar';
import { useAuth } from '../../../context/AuthContext';
import { motion } from 'framer-motion';

const AdminLayout = () => {
    const { user, loading } = useAuth();
    const [isCollapsed, setIsCollapsed] = useState(false);

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-gray-50">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
        );
    }

    if (!user) {
        return <Navigate to="/admin/login" />;
    }

    return (
        <div className="bg-[#F4F4F4] h-screen flex font-outfit overflow-hidden">
            {/* Proper Full-Height Sidebar with state */}
            <AdminSidebar isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} />
            
            {/* Main Content Area - Flexible space with independent scroll */}
            <div className="flex-1 flex flex-col h-screen min-w-0 overflow-y-auto">
                <main className="flex-1 bg-white">
                    <div className="p-2 md:p-6">
                        <Outlet />
                    </div>
                </main>
            </div>
        </div>
    );
};

export default AdminLayout;
