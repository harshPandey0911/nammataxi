import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
    MapPin, CalendarCheck, Search, 
    Car, MousePointerClick, ShieldCheck, Zap,
    ChevronRight, ChevronLeft, Calendar, Newspaper
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import SEO from '../components/SEO';
import api from '../../../lib/api';

const LandingPage = () => {
    const navigate = useNavigate();
    const [carType, setCarType] = useState('');
    const [pickupLocation, setPickupLocation] = useState('');
    const [pickupDate, setPickupDate] = useState('');
    const [dropDate, setDropDate] = useState('');

    // Dynamic Data States
    const [banners, setBanners] = useState([]);
    const [categories, setCategories] = useState([]);
    const [posts, setPosts] = useState([]);
    const [activeBrand, setActiveBrand] = useState('');
    const [currentBannerIndex, setCurrentBannerIndex] = useState(0);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [bannerRes, catRes, postRes] = await Promise.all([
                    api.get('/banners'),
                    api.get('/vehicle-categories'),
                    api.get('/posts')
                ]);

                if (bannerRes?.data) setBanners(bannerRes.data);
                if (catRes?.data) {
                    setCategories(catRes.data);
                    if (catRes.data.length > 0) setActiveBrand(catRes.data[0].name);
                }
                if (postRes?.data) setPosts(postRes.data.slice(0, 3));
            } catch (err) {
                console.error('Failed to fetch dynamic data:', err);
            }
        };
        fetchData();
    }, []);

    const handleSearch = (e) => {
        e.preventDefault();
        navigate('/user/login');
    };

    const nextBanner = () => setCurrentBannerIndex((prev) => (prev + 1) % banners.length);
    const prevBanner = () => setCurrentBannerIndex((prev) => (prev - 1 + banners.length) % banners.length);

    return (
        <div className="min-h-screen bg-white font-outfit text-gray-900 selection:bg-[#ff7d44] selection:text-white">
            <SEO pageName="home" />
            
            {/* Navbar */}
            <nav className="flex items-center justify-between px-8 md:px-20 py-6 sticky top-0 bg-white/80 backdrop-blur-md z-50">
                <div className="flex items-center gap-2">
                    <div className="w-10 h-10 bg-gray-900 rounded-lg flex items-center justify-center">
                        <Car size={24} className="text-white" />
                    </div>
                    <span className="font-black text-xl tracking-tight uppercase">Rent A Car</span>
                </div>

                <div className="hidden lg:flex items-center gap-10">
                    {['Home', 'How it Work', 'Rental Deal', 'Why Choose Us', 'Contact Us'].map((item) => (
                        <a key={item} href={`#${item.toLowerCase().replace(/ /g, '-')}`} className="text-sm font-bold text-gray-500 hover:text-[#ff7d44] transition-colors">
                            {item}
                        </a>
                    ))}
                </div>

                <div className="flex items-center gap-6">
                    <button onClick={() => navigate('/user/login')} className="text-sm font-bold text-gray-900 hover:text-[#ff7d44] transition-colors">Sign In</button>
                    <button onClick={() => navigate('/user/login')} className="bg-[#ff7d44] text-white px-8 py-3 rounded-full font-bold text-sm shadow-lg shadow-orange-200 hover:scale-105 active:scale-95 transition-all">
                        Sign Up
                    </button>
                </div>
            </nav>

            {/* Hero Section */}
            <main className="relative pt-10 pb-20 px-8 md:px-20 overflow-hidden">
                {/* Background Decor */}
                <div className="absolute top-0 right-0 w-[45%] h-full bg-[#0c7c6c] -z-10 rounded-bl-[100px] hidden lg:block"></div>
                <div className="absolute top-[20%] right-[10%] w-[500px] h-[500px] bg-white opacity-5 rounded-full -z-5 animate-pulse"></div>

                <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-10 items-center min-h-[70vh]">
                    <div className="z-10">
                        <motion.h1 
                            initial={{ opacity: 0, x: -50 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="text-6xl md:text-7xl font-black leading-tight mb-8"
                        >
                            Fast And Easy Way <br />
                            <span className="text-gray-900/40">To Rent A Car</span>
                        </motion.h1>
                        
                        <motion.p 
                            initial={{ opacity: 0, x: -50 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.1 }}
                            className="text-gray-500 text-lg mb-12 max-w-lg leading-relaxed"
                        >
                            Experience seamless car rentals with Bangalore's most trusted provider. 
                            Choose from a wide fleet of premium vehicles at flat rates.
                        </motion.p>

                        {/* Search Form Card */}
                        <motion.div 
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                            className="bg-white p-8 rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.08)] border border-gray-50"
                        >
                            <form onSubmit={handleSearch} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">Select Your Car Type</label>
                                    <div className="relative">
                                        <select 
                                            value={carType}
                                            onChange={(e) => setCarType(e.target.value)}
                                            className="w-full bg-gray-50 border-none rounded-2xl p-4 text-sm font-bold appearance-none cursor-pointer focus:ring-2 focus:ring-[#ff7d44]/20"
                                        >
                                            <option value="">Select Category</option>
                                            {categories.map(cat => (
                                                <option key={cat._id} value={cat.name}>{cat.name}</option>
                                            ))}
                                        </select>
                                        <Car size={18} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-300 pointer-events-none" />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">Where to Pick-Up</label>
                                    <div className="relative">
                                        <input 
                                            type="text" 
                                            placeholder="Enter location"
                                            value={pickupLocation}
                                            onChange={(e) => setPickupLocation(e.target.value)}
                                            className="w-full bg-gray-50 border-none rounded-2xl p-4 text-sm font-bold placeholder:text-gray-300 focus:ring-2 focus:ring-[#ff7d44]/20"
                                        />
                                        <MapPin size={18} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-300" />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">Date of Pick-Up/Time</label>
                                    <div className="relative">
                                        <input 
                                            type="datetime-local" 
                                            value={pickupDate}
                                            onChange={(e) => setPickupDate(e.target.value)}
                                            className="w-full bg-gray-50 border-none rounded-2xl p-4 text-sm font-bold appearance-none cursor-pointer focus:ring-2 focus:ring-[#ff7d44]/20"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">Date of Drop-Off/Time</label>
                                    <div className="relative">
                                        <input 
                                            type="datetime-local" 
                                            value={dropDate}
                                            onChange={(e) => setDropDate(e.target.value)}
                                            className="w-full bg-gray-50 border-none rounded-2xl p-4 text-sm font-bold appearance-none cursor-pointer focus:ring-2 focus:ring-[#ff7d44]/20"
                                        />
                                    </div>
                                </div>

                                <button 
                                    type="submit"
                                    className="md:col-span-2 bg-[#ff7d44] text-white py-5 rounded-2xl font-black uppercase text-sm tracking-[0.2em] shadow-lg shadow-orange-100 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-3"
                                >
                                    <Search size={20} />
                                    Search
                                </button>
                            </form>
                        </motion.div>
                    </div>

                    <div className="relative h-full flex flex-col justify-center items-end group">
                        <AnimatePresence mode="wait">
                            {banners.length > 0 ? (
                                <motion.div
                                    key={currentBannerIndex}
                                    initial={{ opacity: 0, x: 50 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -50 }}
                                    className="w-full h-auto"
                                >
                                    <img 
                                        src={banners[currentBannerIndex].image} 
                                        alt={banners[currentBannerIndex].title} 
                                        className="w-full h-auto object-contain drop-shadow-[0_50px_50px_rgba(0,0,0,0.3)]"
                                    />
                                </motion.div>
                            ) : (
                                <motion.img 
                                    initial={{ opacity: 0, scale: 0.8 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    src="https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=1200&q=80" 
                                    alt="Default Jeep" 
                                    className="w-full h-auto object-contain drop-shadow-[0_50px_50px_rgba(0,0,0,0.3)]"
                                />
                            )}
                        </AnimatePresence>

                        {banners.length > 1 && (
                            <div className="absolute bottom-10 right-0 flex gap-4 opacity-0 group-hover:opacity-100 transition-opacity">
                                <button onClick={prevBanner} className="p-4 bg-white/10 backdrop-blur-md rounded-full text-white hover:bg-white hover:text-black transition-all"><ChevronLeft /></button>
                                <button onClick={nextBanner} className="p-4 bg-white/10 backdrop-blur-md rounded-full text-white hover:bg-white hover:text-black transition-all"><ChevronRight /></button>
                            </div>
                        )}
                    </div>
                </div>
            </main>

            {/* How it Work Section */}
            <section id="how-it-work" className="py-32 px-8 md:px-20 bg-gray-50/50">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-24">
                        <h2 className="text-5xl font-black mb-6 uppercase tracking-tighter">How it Work</h2>
                        <p className="text-gray-400 max-w-xl mx-auto">Rent your favorite car in just 3 simple steps. Reliable and transparent booking process.</p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-16 relative">
                        {/* Decorative Dashed Lines */}
                        <div className="absolute top-1/2 left-[20%] right-[20%] h-0.5 border-t-2 border-dashed border-gray-200 hidden lg:block -z-10"></div>
                        
                        {[
                            { title: 'Choose Location', icon: <MapPin size={32} />, desc: 'Pick the location that is closest to you for pickup.' },
                            { title: 'Pick-Up Date', icon: <CalendarCheck size={32} />, desc: 'Select the date and time for your rental period.' },
                            { title: 'Book Your Car', icon: <Car size={32} />, desc: 'Confirm your booking and enjoy your premium ride.' }
                        ].map((step, i) => (
                            <div key={i} className="flex flex-col items-center text-center group">
                                <div className="w-24 h-24 bg-white rounded-3xl flex items-center justify-center text-[#ff7d44] mb-8 shadow-xl group-hover:bg-[#ff7d44] group-hover:text-white transition-all duration-500">
                                    {step.icon}
                                </div>
                                <h3 className="text-2xl font-black mb-4 uppercase tracking-tighter">{step.title}</h3>
                                <p className="text-gray-400 text-sm leading-relaxed max-w-[250px]">{step.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Top Rated Rented Cars Section */}
            <section id="rental-deal" className="py-32 px-8 md:px-20">
                <div className="max-w-7xl mx-auto text-center">
                    <h2 className="text-5xl font-black mb-16 uppercase tracking-tighter">Top Rated Rented Cars</h2>
                    
                    <div className="flex flex-wrap justify-center gap-4 mb-20 overflow-x-auto no-scrollbar">
                        {categories.map((brand) => (
                            <button
                                key={brand._id}
                                onClick={() => setActiveBrand(brand.name)}
                                className={`px-10 py-4 rounded-xl text-sm font-black transition-all border-2 shrink-0
                                    ${activeBrand === brand.name ? 'bg-[#ff7d44] border-[#ff7d44] text-white shadow-lg shadow-orange-100' : 'bg-white border-gray-100 text-gray-400 hover:border-gray-200'}`}
                            >
                                {brand.name}
                            </button>
                        ))}
                    </div>

                    <div className="grid md:grid-cols-3 gap-10">
                        {categories.filter(c => c.name === activeBrand).map((cat) => (
                            <motion.div 
                                layout
                                key={cat._id} 
                                className="bg-white p-8 rounded-[3rem] border border-gray-100 shadow-sm hover:shadow-2xl transition-all group text-left"
                            >
                                <div className="aspect-[16/10] overflow-hidden rounded-3xl mb-8 bg-gray-50 flex items-center justify-center">
                                    <img 
                                        src={cat.image || `https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?auto=format&fit=crop&w=800&q=80`} 
                                        alt={cat.name} 
                                        className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-700" 
                                    />
                                </div>
                                <h4 className="text-2xl font-black mb-2 uppercase">{cat.name}</h4>
                                <div className="flex items-center gap-2 text-gray-400 text-sm mb-6">
                                    <Zap size={14} className="text-[#ff7d44]" />
                                    <span>{cat.description || 'Premium Luxury Edition • Automatic'}</span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <div className="text-3xl font-black">₹ {cat.baseFare || '1,500'}<span className="text-sm text-gray-400">/day</span></div>
                                    <button onClick={() => navigate('/user/login')} className="bg-gray-900 text-white p-4 rounded-2xl hover:bg-[#ff7d44] transition-colors">
                                        <ChevronRight size={20} />
                                    </button>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Latest News / Posts */}
            {posts.length > 0 && (
                <section id="posts-section" className="py-32 px-8 md:px-20 bg-gray-50/30">
                    <div className="max-w-7xl mx-auto">
                        <div className="text-center mb-24">
                            <h2 className="text-5xl font-black mb-6 uppercase tracking-tighter">Latest from Namma Taxi</h2>
                            <p className="text-gray-400">Stay updated with our latest news and travel guides.</p>
                        </div>

                        <div className="grid md:grid-cols-3 gap-10">
                            {posts.map((post) => (
                                <div key={post._id} className="bg-white rounded-[2.5rem] overflow-hidden border border-gray-50 shadow-sm hover:shadow-xl transition-all group">
                                    <div className="aspect-video overflow-hidden">
                                        <img src={post.image} alt={post.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                                    </div>
                                    <div className="p-8">
                                        <div className="flex items-center gap-3 text-[10px] font-black text-[#ff7d44] uppercase tracking-widest mb-4">
                                            <Calendar size={12} />
                                            {new Date(post.createdAt).toLocaleDateString()}
                                        </div>
                                        <h3 className="text-xl font-black mb-4 line-clamp-2 uppercase tracking-tight">{post.title}</h3>
                                        <p className="text-gray-400 text-sm mb-6 line-clamp-3">{post.excerpt}</p>
                                        <button className="text-xs font-black uppercase tracking-widest flex items-center gap-2 group-hover:text-[#ff7d44] transition-colors">
                                            Read More <ChevronRight size={14} />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>
            )}

            {/* Why Choose Us */}
            <section id="why-choose-us" className="py-32 px-8 md:px-20 bg-[#0c7c6c] text-white rounded-[100px] mx-8 my-20">
                <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-20 items-center">
                    <div>
                        <h2 className="text-6xl font-black mb-10 leading-tight uppercase tracking-tighter">Why Choose Our <br /> Premium Services?</h2>
                        <div className="space-y-8">
                            {[
                                { title: 'Safe & Secure', desc: 'All our vehicles are regularly sanitized and GPS tracked.', icon: <ShieldCheck /> },
                                { title: 'No Hidden Fees', desc: 'What you see is what you pay. Transparent pricing always.', icon: <Zap /> },
                                { title: '24/7 Support', desc: 'Our dedicated team is here to help you at any hour.', icon: <MousePointerClick /> }
                            ].map((item, i) => (
                                <div key={i} className="flex gap-6 group">
                                    <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center shrink-0 group-hover:bg-[#ff7d44] transition-all">
                                        {item.icon}
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-black mb-2 uppercase tracking-tight">{item.title}</h3>
                                        <p className="text-white/60 leading-relaxed">{item.desc}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className="relative">
                        <img 
                            src="https://images.unsplash.com/photo-1494976388531-d1058494cdd8?auto=format&fit=crop&w=800&q=80" 
                            alt="Luxury Car" 
                            className="rounded-[3rem] shadow-2xl rotate-3 hover:rotate-0 transition-transform duration-700"
                        />
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="py-20 px-8 md:px-20 border-t border-gray-100">
                <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-10">
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-gray-900 rounded-lg flex items-center justify-center">
                            <Car size={18} className="text-white" />
                        </div>
                        <span className="font-black text-lg tracking-tight uppercase">Rent A Car</span>
                    </div>
                    
                    <p className="text-gray-400 text-sm font-bold">© 2026 Namma Taxi. All rights reserved.</p>
                    
                    <div className="flex gap-8">
                        {['Privacy', 'Terms', 'Help'].map((item) => (
                            <a key={item} href="#" className="text-sm font-bold text-gray-500 hover:text-[#ff7d44] transition-colors">{item}</a>
                        ))}
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default LandingPage;


