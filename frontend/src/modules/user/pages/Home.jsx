import React from 'react';
import SEO from '../components/SEO';
import Header from '../components/Header';
import Hero from '../components/Hero';
import ServiceGrid from '../components/ServiceGrid';
import AirportForm from '../components/AirportForm';
import ToursForm from '../components/ToursForm';
import OutstationForm from '../components/OutstationForm';
import LocalForm from '../components/LocalForm';
import Banners from '../components/Banners';
import heroTaxi from '../../../assets/hero_taxi.png';
import { services } from '../../../data';

const Home = ({ 
    activeService, 
    setActiveService, 
    airportMode, 
    setAirportMode, 
    location, 
    setLocation, 
    dropLocation, 
    setDropLocation, 
    pickupDate, 
    setPickupDate, 
    pickupTime, 
    setPickupTime, 
    phoneNumber, 
    setPhoneNumber, 
    selectedPackage, 
    setSelectedPackage, 
    outstationMode, 
    setOutstationMode, 
    returnDate, 
    setReturnDate,
    handleSearch
}) => {
    return (
        <div className="animate-slide-up">
            <SEO pageName="user" />
            <Header />
            <Hero heroTaxi={heroTaxi} />
            
            <ServiceGrid 
                services={services} 
                activeService={activeService} 
                setActiveService={setActiveService} 
            />

            <div className="px-4">
                <div className="booking-form">
                    {activeService === 'local' && (
                        <LocalForm 
                            location={location}
                            setLocation={setLocation}
                            dropLocation={dropLocation}
                            setDropLocation={setDropLocation}
                            pickupDate={pickupDate}
                            setPickupDate={setPickupDate}
                            pickupTime={pickupTime}
                            setPickupTime={setPickupTime}
                            phoneNumber={phoneNumber}
                            setPhoneNumber={setPhoneNumber}
                            setView={handleSearch}
                        />
                    )}
                    {activeService === 'airport' && (
                        <AirportForm 
                            airportMode={airportMode}
                            setAirportMode={setAirportMode}
                            location={location}
                            setLocation={setLocation}
                            dropLocation={dropLocation}
                            setDropLocation={setDropLocation}
                            pickupDate={pickupDate}
                            setPickupDate={setPickupDate}
                            pickupTime={pickupTime}
                            setPickupTime={setPickupTime}
                            phoneNumber={phoneNumber}
                            setPhoneNumber={setPhoneNumber}
                            setView={handleSearch}
                        />
                    )}
                    {activeService === 'tours' && (
                        <ToursForm 
                            selectedPackage={selectedPackage}
                            setSelectedPackage={setSelectedPackage}
                            location={location}
                            setLocation={setLocation}
                            pickupDate={pickupDate}
                            setPickupDate={setPickupDate}
                            pickupTime={pickupTime}
                            setPickupTime={setPickupTime}
                            phoneNumber={phoneNumber}
                            setPhoneNumber={setPhoneNumber}
                            setView={handleSearch}
                        />
                    )}
                    {activeService === 'outstation' && (
                        <OutstationForm 
                            outstationMode={outstationMode}
                            setOutstationMode={setOutstationMode}
                            location={location}
                            setLocation={setLocation}
                            dropLocation={dropLocation}
                            setDropLocation={setDropLocation}
                            pickupDate={pickupDate}
                            setPickupDate={setPickupDate}
                            pickupTime={pickupTime}
                            setPickupTime={setPickupTime}
                            returnDate={returnDate}
                            setReturnDate={setReturnDate}
                            phoneNumber={phoneNumber}
                            setPhoneNumber={setPhoneNumber}
                            setView={handleSearch}
                        />
                    )}
                </div>
            </div>
            <Banners />
            <div className="flex justify-center py-8 opacity-20">
                <p className="text-3xl font-black italic tracking-tighter text-obsidian">#goNammaTaxi</p>
            </div>
        </div>
    );
};

export default Home;
