import serviceAirport from './assets/service_airport-removebg-preview - Copy.png'
import serviceTours from './assets/service_tours-removebg-preview - Copy.png'
import serviceOutstation from './assets/service_outstation_-_Copy-removebg-preview - Copy.png'

export const cabs = [
    { id: 1, name: 'Sedan Premium', brand: 'Toyota', seats: 4, luggage: 2, ac: true, price: '₹750', img: serviceAirport, desc: 'Highest rated sedan with maximum comfort and professional driver.' },
    { id: 2, name: 'SUV Luxury', brand: 'Innova', seats: 7, luggage: 4, ac: true, price: '₹1200', img: serviceOutstation, desc: 'Spacious SUV perfect for family trips and heavy luggage.' },
    { id: 3, name: 'Compact Hatch', brand: 'Swift', seats: 4, luggage: 1, ac: false, price: '₹450', img: serviceTours, desc: 'Economical and fast commute for city and airport runs.' }
];

export const services = [
    { id: 'local', name: 'Local City Ride', img: serviceTours },
    { id: 'airport', name: 'Airport Transfer', img: serviceAirport },
    { id: 'tours', name: 'Tours Packages', img: serviceTours },
    { id: 'outstation', name: 'Outstation', img: serviceOutstation }
];

export const imageMap = {
    'service_airport-removebg-preview - Copy.png': serviceAirport,
    'service_tours-removebg-preview - Copy.png': serviceTours,
    'service_outstation_-_Copy-removebg-preview - Copy.png': serviceOutstation,
};
