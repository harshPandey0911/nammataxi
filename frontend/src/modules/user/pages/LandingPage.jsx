import { useNavigate } from 'react-router-dom';
import SEO from '../components/SEO';
import heroTaxi from '../../../assets/hero_taxi.png';

const LandingPage = () => {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-white font-sans overflow-x-hidden">
            <SEO pageName="home" />
            {/* Navbar */}
            <nav className="flex justify-between items-center px-6 py-5 absolute top-0 w-full z-50">
                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center shadow-lg">
                        <span className="text-obsidian font-black text-xl">N</span>
                    </div>
                    <span className="font-black text-xl tracking-tighter">Namma Taxi</span>
                </div>
                <button 
                    onClick={() => navigate('/user')}
                    className="bg-obsidian text-white px-6 py-2.5 rounded-full font-bold text-xs shadow-xl active:scale-95 transition-all"
                >
                    Launch App
                </button>
            </nav>

            {/* Hero Section */}
            <section className="pt-32 pb-20 px-6 relative">
                <div className="max-w-4xl mx-auto text-center">
                    <div className="inline-block bg-primary/10 px-4 py-1.5 rounded-full mb-6">
                        <p className="text-primary font-black text-[10px] uppercase tracking-widest">Bengaluru's Favorite Cab Service</p>
                    </div>
                    <h1 className="text-5xl md:text-7xl font-black leading-[1.05] mb-8 tracking-tighter text-obsidian">
                        Ride Premium. <br />
                        Ride <span className="text-primary italic">Namma</span> Taxi.
                    </h1>
                    <p className="text-gray-500 text-lg md:text-xl max-w-2xl mx-auto mb-10 font-medium">
                        Experience the most reliable, clean, and professional cab service across Bangalore. Airport transfers, outstation, or local packages - we've got you covered.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                        <button 
                            onClick={() => navigate('/user')}
                            className="w-full sm:w-auto bg-primary text-obsidian px-10 py-5 rounded-[24px] font-black text-sm shadow-[0_20px_40px_rgba(255,204,0,0.3)] hover:shadow-none transition-all active:scale-95"
                        >
                            Book Your Ride Now
                        </button>
                        <button className="w-full sm:w-auto bg-gray-50 text-obsidian px-10 py-5 rounded-[24px] font-black text-sm hover:bg-gray-100 transition-all">
                            View Fleet
                        </button>
                    </div>
                </div>

                <div className="mt-20 relative flex justify-center">
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-full bg-gradient-to-b from-primary/20 via-transparent to-transparent blur-[120px] -z-10 opacity-30"></div>
                    <img src={heroTaxi} className="w-full max-w-4xl h-auto drop-shadow-[0_40px_80px_rgba(0,0,0,0.15)] animate-float" alt="Premium Taxi" />
                </div>
            </section>

            {/* Stats */}
            <section className="py-20 bg-obsidian text-white">
                <div className="max-w-6xl mx-auto px-6">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
                        {[
                            { label: 'Total Trips', value: '50k+' },
                            { label: 'Happy Users', value: '25k+' },
                            { label: 'Professional Drivers', value: '500+' },
                            { label: 'Cities Covered', value: '15+' }
                        ].map((stat, i) => (
                            <div key={i}>
                                <h3 className="text-4xl font-black text-primary mb-2 tracking-tighter">{stat.value}</h3>
                                <p className="text-[10px] font-bold uppercase tracking-widest opacity-50">{stat.label}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Why Choose Us */}
            <section className="py-24 px-6 max-w-6xl mx-auto">
                <div className="text-center mb-16">
                    <h2 className="text-3xl font-black mb-4">Why ride with Namma?</h2>
                    <div className="w-20 h-1.5 bg-primary mx-auto rounded-full"></div>
                </div>
                <div className="grid md:grid-cols-3 gap-8">
                    {[
                        { title: 'Zero Cancellations', desc: 'Once you book, your ride is guaranteed. We respect your time.' },
                        { title: 'Flat Pricing', desc: 'No hidden charges or surge pricing. What you see is what you pay.' },
                        { title: 'Clean Fleet', desc: 'Sanitized cars and professional drivers for a premium experience.' }
                    ].map((feature, i) => (
                        <div key={i} className="bg-white p-10 rounded-[40px] shadow-[0_20px_50px_rgba(0,0,0,0.05)] border border-gray-50 hover:border-primary/20 transition-all">
                            <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center text-primary mb-6">
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7"/></svg>
                            </div>
                            <h3 className="text-xl font-black mb-3">{feature.title}</h3>
                            <p className="text-gray-500 text-sm leading-relaxed font-medium">{feature.desc}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* Footer */}
            <footer className="py-12 border-t border-gray-100 text-center">
                <div className="flex items-center justify-center gap-2 mb-6">
                    <div className="w-6 h-6 bg-primary rounded flex items-center justify-center">
                        <span className="text-obsidian font-black text-sm">N</span>
                    </div>
                    <span className="font-black text-lg tracking-tighter">Namma Taxi</span>
                </div>
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-4">© 2026 Namma Taxi Service. All Rights Reserved.</p>
                <p className="text-2xl font-black italic tracking-tighter text-obsidian opacity-20">#goNammaTaxi</p>
            </footer>
        </div>
    );
};

export default LandingPage;
