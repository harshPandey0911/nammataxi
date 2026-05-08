import React from 'react';

const ServiceGrid = ({ services, activeService, setActiveService }) => {
    return (
        <div className="px-5 mb-2">
            <div className="flex justify-between items-end mb-2 px-1">
                <h2 className="font-extrabold text-sm">Services</h2>
                <button className="text-[8px] font-black text-gray-400 uppercase tracking-widest">See All</button>
            </div>
            <div className="grid grid-cols-3 gap-2">
                {services.map(service => (
                    <div 
                        key={service.id} 
                        onClick={() => setActiveService(service.id)} 
                        className={`service-card flex flex-col items-center justify-center text-center ${activeService === service.id ? 'active shadow-lg' : ''}`}
                    >
                        <img src={service.img} alt={service.name} className="w-10 h-auto mb-1" />
                        <span className="text-[9px] font-black uppercase tracking-tight leading-[1.2] w-full break-words">{service.name}</span>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ServiceGrid;
