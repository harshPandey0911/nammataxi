import { useState, useEffect } from 'react'
import serviceAirport from './assets/service_airport-removebg-preview - Copy.png'
import serviceTours from './assets/service_tours-removebg-preview - Copy.png'
import serviceOutstation from './assets/service_outstation_-_Copy-removebg-preview - Copy.png'
import heroTaxi from './assets/hero_taxi.png'

function App() {
  const [view, setView] = useState('home')
  const [activeService, setActiveService] = useState('airport')
  const [selectedCab, setSelectedCab] = useState(null)
  const [airportMode, setAirportMode] = useState('pickup')
  const [location, setLocation] = useState('Fetching live location...')
  const [dropLocation, setDropLocation] = useState('')
  const [pickupDate, setPickupDate] = useState('')
  const [pickupTime, setPickupTime] = useState('')
  const [phoneNumber, setPhoneNumber] = useState('')

  const [userName, setUserName] = useState('')
  const [userEmail, setUserEmail] = useState('')
  const [userAddress, setUserAddress] = useState('')
  const [isCheckingAvailability, setIsCheckingAvailability] = useState(false)

  const cabs = [
    { id: 1, name: 'Sedan Premium', brand: 'Toyota', seats: 4, luggage: 2, ac: true, price: '₹750', img: serviceAirport, desc: 'Highest rated sedan with maximum comfort and professional driver.' },
    { id: 2, name: 'SUV Luxury', brand: 'Innova', seats: 7, luggage: 4, ac: true, price: '₹1200', img: serviceOutstation, desc: 'Spacious SUV perfect for family trips and heavy luggage.' },
    { id: 3, name: 'Compact Hatch', brand: 'Swift', seats: 4, luggage: 1, ac: false, price: '₹450', img: serviceTours, desc: 'Economical and fast commute for city and airport runs.' }
  ]

  useEffect(() => {
    const timer = setTimeout(() => {
      setLocation('MG Road, Bengaluru, India')
    }, 1500)
    return () => clearTimeout(timer)
  }, [])

  const services = [
    { id: 'airport', name: 'Airport Transfer', img: serviceAirport },
    { id: 'tours', name: 'Tours Packages', img: serviceTours },
    { id: 'outstation', name: 'Outstation', img: serviceOutstation }
  ]

  const handleBookClick = () => {
    setIsCheckingAvailability(true)
    setTimeout(() => {
        setIsCheckingAvailability(false)
        setView('success')
    }, 2000)
  }

  const renderAirportForm = () => (
    <div className="animate-slide-up">
      <div className="flex gap-2 mb-4">
        {['pickup', 'drop', 'round'].map(mode => (
          <button key={mode} onClick={() => setAirportMode(mode)} className={`flex-1 py-2.5 text-[9px] font-black uppercase rounded-2xl transition-all ${airportMode === mode ? 'bg-obsidian text-white' : 'bg-gray-100 text-gray-400'}`}>
            {mode}
          </button>
        ))}
      </div>
      <div className="space-y-3">
        <div className="relative"><input type="text" className="form-input" value={location} onChange={(e) => setLocation(e.target.value)} /><span className="text-[8px] font-black text-primary uppercase absolute -top-1.5 left-3 bg-white px-1">Live Pickup</span></div>
        <div className="relative"><input type="text" className="form-input" value={dropLocation} onChange={(e) => setDropLocation(e.target.value)} placeholder="Search Drop Destination" /></div>
        <div className="flex gap-2">
          <div className="custom-date-wrapper"><input type="date" className="form-input" value={pickupDate} onChange={e => setPickupDate(e.target.value)} />{!pickupDate && <div className="custom-date-placeholder"><span>Date</span></div>}</div>
          <div className="custom-date-wrapper"><input type="time" className="form-input" value={pickupTime} onChange={e => setPickupTime(e.target.value)} />{!pickupTime && <div className="custom-date-placeholder"><span>Time</span></div>}</div>
        </div>
        <input type="tel" className="form-input" value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} placeholder="+91 Phone number" />
        <button onClick={() => setView('results')} className="primary-btn flex items-center justify-center gap-3"><span>Search Cabs</span></button>
      </div>
    </div>
  )

  const renderCabResults = () => (
    <div className="animate-slide-up px-4 pt-8">
        <div className="flex items-center gap-4 mb-6 px-2">
            <button onClick={() => setView('home')} className="w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-sm border border-gray-100"><svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" /></svg></button>
            <h2 className="font-extrabold text-lg">Available Cabs</h2>
        </div>
        <div className="space-y-3">
            {cabs.map(cab => (
                <div key={cab.id} onClick={() => { setSelectedCab(cab); setView('details'); }} className="cab-result-card cursor-pointer">
                    <div className="cab-img-box"><img src={cab.img} className="w-full h-auto max-h-[45px] object-contain" alt={cab.name} /></div>
                    <div className="cab-info">
                        <span className="text-[8px] font-black text-primary uppercase mb-0.5">{cab.brand}</span>
                        <h3 className="font-extrabold text-sm text-gray-800 leading-tight">{cab.name}</h3>
                        <div className="flex gap-2 mt-1">
                            <span className="text-[9px] font-bold text-gray-400 uppercase">{cab.seats} Seater</span>
                            <span className={`text-[9px] font-bold uppercase ${cab.ac ? 'text-green-500' : 'text-red-500'}`}>• {cab.ac ? 'AC' : 'Non-AC'}</span>
                        </div>
                    </div>
                    <div className="cab-price-box"><div className="font-black text-base text-obsidian">{cab.price}</div><span className="text-[8px] font-bold text-gray-400 underline">Select</span></div>
                </div>
            ))}
        </div>
    </div>
  )

  const renderCabDetails = () => (
    <div className="animate-slide-up px-6 pt-10">
        <button onClick={() => setView('results')} className="w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-sm mb-6"><svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" /></svg></button>
        <div className="flex flex-col items-center mb-6">
            <img src={selectedCab.img} className="w-44 h-auto mb-4" alt={selectedCab.name} />
            <h1 className="text-2xl font-black text-obsidian text-center">{selectedCab.name}</h1>
        </div>

        {/* Trip Summary Section */}
        <div className="bg-white/60 border border-white/40 backdrop-blur rounded-[32px] p-5 mb-6 shadow-sm">
            <h4 className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-3 ml-1">Trip Summary</h4>
            <div className="space-y-3">
                <div className="flex items-start gap-4">
                    <div className="flex flex-col items-center gap-1 mt-1">
                        <div className="w-2 h-2 rounded-full border-2 border-primary"></div>
                        <div className="w-0.5 h-6 bg-gray-200"></div>
                        <div className="w-2 h-2 bg-obsidian rotate-45"></div>
                    </div>
                    <div className="flex-1">
                        <div className="mb-2">
                            <p className="text-[8px] font-bold text-gray-400 uppercase leading-none">Pickup</p>
                            <p className="text-xs font-bold text-obsidian truncate">{location}</p>
                        </div>
                        <div>
                            <p className="text-[8px] font-bold text-gray-400 uppercase leading-none">Drop-off</p>
                            <p className="text-xs font-bold text-obsidian truncate">{dropLocation || 'Coordinate provided'}</p>
                        </div>
                    </div>
                </div>
                <div className="flex justify-between items-center pt-2 border-t border-gray-100/50">
                    <div className="flex items-center gap-2"><svg className="w-3 h-3 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg><p className="text-[10px] font-black text-obsidian">{pickupDate || 'Current'}</p></div>
                    <div className="flex items-center gap-2"><svg className="w-3 h-3 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg><p className="text-[10px] font-black text-obsidian">{pickupTime || 'Immediate'}</p></div>
                </div>
            </div>
        </div>

        <div className="grid grid-cols-3 gap-2 mb-8">
            <div className="bg-white p-3 rounded-2xl text-center shadow-sm"><p className="text-[9px] font-bold text-gray-400 mb-1">Seats</p><p className="font-black text-xs text-obsidian">{selectedCab.seats}</p></div>
            <div className="bg-white p-3 rounded-2xl text-center shadow-sm"><p className="text-[9px] font-bold text-gray-400 mb-1">Luggage</p><p className="font-black text-xs text-obsidian">{selectedCab.luggage}x</p></div>
            <div className="bg-white p-3 rounded-2xl text-center shadow-sm"><p className="text-[9px] font-bold text-gray-400 mb-1">Comfort</p><p className="font-black text-xs text-primary">{selectedCab.ac ? 'AC' : 'Fan'}</p></div>
        </div>
        
        <div className="bg-obsidian rounded-[32px] p-6 text-white flex justify-between items-center">
            <div><p className="text-[10px] font-bold opacity-50 uppercase tracking-widest">Fixed Fare</p><p className="text-2xl font-black">{selectedCab.price}</p></div>
            <button onClick={() => setView('checkout')} className="bg-primary text-obsidian font-black px-8 py-4 rounded-2xl shadow-xl active:scale-95 transition-all">Book</button>
        </div>
    </div>
  )

  const renderCheckoutForm = () => (
    <div className="animate-slide-up px-6 pt-10">
        <button onClick={() => setView('details')} className="w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-sm mb-6"><svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" /></svg></button>
        <div className="flex items-center justify-between mb-6 px-1">
            <h2 className="text-2xl font-black">User Details</h2>
            <div className="text-right"><p className="text-[10px] font-bold text-gray-400 uppercase leading-none">Booking Total</p><p className="text-lg font-black text-primary">{selectedCab.price}</p></div>
        </div>
        <div className="checkout-box space-y-4">
            <input type="text" className="form-input" placeholder="Full Name" value={userName} onChange={e => setUserName(e.target.value)} />
            <input type="email" className="form-input" placeholder="Email Address" value={userEmail} onChange={e => setUserEmail(e.target.value)} />
            <input type="tel" className="form-input" placeholder="Phone Number" value={phoneNumber} readOnly />
            <textarea className="form-input min-h-[100px]" placeholder="Complete Address" value={userAddress} onChange={e => setUserAddress(e.target.value)} />
            <button onClick={handleBookClick} disabled={isCheckingAvailability} className={`primary-btn ${isCheckingAvailability ? 'opacity-50' : ''}`}>
                {isCheckingAvailability ? 'Checking Availability...' : 'Confirm Booking'}
            </button>
        </div>
    </div>
  )

  const renderSuccess = () => (
    <div className="animate-slide-up flex flex-col items-center justify-center min-h-[80vh] px-8 text-center">
        <div className="success-ring"><svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={4} d="M5 13l4 4L19 7" /></svg></div>
        <h1 className="text-3xl font-black mb-2 text-obsidian font-manrope">Booking Verified!</h1>
        <p className="text-gray-400 text-sm mb-10 leading-relaxed font-semibold">Your {selectedCab.brand} {selectedCab.name} has been reserved successfully.</p>
        <button onClick={() => setView('home')} className="primary-btn w-[220px]">Return to Home</button>
    </div>
  )

  return (
    <div className="min-h-screen">
      {view === 'home' && (
        <div className="animate-slide-up">
            <div className="px-6 pt-10 pb-4 flex justify-between items-center bg-white border-b border-gray-100">
                <div className="flex items-center gap-3"><div className="w-9 h-9 rounded-full bg-slate-200 border-2 border-white shadow-sm overflow-hidden"><img src="https://ui-avatars.com/api/?name=User&background=BCE3E8" alt="profile" /></div><div><h4 className="text-gray-400 text-[8px] font-black uppercase tracking-tighter">Welcome back</h4><p className="font-extrabold text-xs">Hritik, India</p></div></div>
                <div className="w-9 h-9 rounded-full glass-panel flex items-center justify-center shadow-sm"><svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" /></svg></div>
            </div>
            <div className="px-6 pt-5 pb-2 relative overflow-hidden">
                <div className="relative z-10 w-3/4"><h1 className="text-xl font-black leading-[1.1] mb-1">Premium <span className="text-primary italic">Namma</span> taxi only here</h1><p className="text-gray-400 text-[9px] font-medium leading-relaxed">Book luxury airport transfer in seconds.</p></div>
                <img src={heroTaxi} className="absolute top-1/2 -right-4 transform -translate-y-1/2 w-[160px] opacity-80 pointer-events-none" alt="luxury car" />
            </div>
            <div className="px-6 mb-4 mt-2">
                <div className="glass-panel rounded-2xl flex items-center px-4 py-2.5 gap-3 shadow-sm border-white"><svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg><input type="text" placeholder="Search destinations..." className="bg-transparent border-none outline-none text-xs font-medium w-full" /></div>
            </div>
            <div className="px-5 mb-2">
                <div className="flex justify-between items-end mb-2 px-1"><h2 className="font-extrabold text-sm">Services</h2><button className="text-[8px] font-black text-gray-400 uppercase tracking-widest">See All</button></div>
                <div className="grid grid-cols-3 gap-2">
                    {services.map(service => (
                        <div key={service.id} onClick={() => setActiveService(service.id)} className={`service-card flex flex-col items-center justify-center text-center ${activeService === service.id ? 'active shadow-lg' : ''}`}><img src={service.img} alt={service.name} className="w-10 h-auto mb-1" /><span className="text-[8px] font-black uppercase tracking-tighter leading-[1]">{service.name}</span></div>
                    ))}
                </div>
            </div>
            <div className="px-4"><div className="booking-form">{activeService === 'airport' ? renderAirportForm() : <div className="flex flex-col items-center justify-center h-[180px] text-center opacity-40"><svg className="w-10 h-10 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg><p className="font-bold text-xs tracking-tight italic">Coming soon...</p></div>}</div></div>
        </div>
      )}
      
      {view === 'results' && renderCabResults()}
      {view === 'details' && renderCabDetails()}
      {view === 'checkout' && renderCheckoutForm()}
      {view === 'success' && renderSuccess()}

      {/* Global Spacer */}
      <div className="h-44"></div>

      <div className="floating-nav glass-dark shadow-[0_-20px_40px_rgba(0,0,0,0.1)]">
        <button onClick={() => setView('home')} className={`nav-item ${view === 'home' ? 'active' : ''}`}><svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/></svg></button>
        <button className="nav-item"><svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M21 16v-2l-8-5V3.5c0-.83-.67-1.5-1.5-1.5S10 2.67 10 3.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z" /></svg></button>
        <button className={`nav-item ${view !== 'home' && view !== 'success' ? 'active' : ''}`}><svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" /></svg></button>
        <button className="nav-item"><svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg></button>
      </div>
    </div>
  )
}

export default App
