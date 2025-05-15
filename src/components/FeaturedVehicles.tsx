
import VehicleCard from './VehicleCard';

// Sample data for featured vehicles
const featuredVehicles = [
  {
    id: 1,
    name: "Jeep Wrangler",
    image: "/vehicles/jeep-wrangler.jpg", 
    type: "Jeep",
    seats: 4,
    transmission: "Automatic",
    price: 89,
    rating: 4.8,
    location: "Castries, St. Lucia",
    featured: true
  },
  {
    id: 2,
    name: "Toyota RAV4",
    image: "/vehicles/toyota-rav4.jpg",
    type: "SUV",
    seats: 5,
    transmission: "Automatic",
    price: 65,
    rating: 4.7,
    location: "Rodney Bay, St. Lucia",
    featured: true
  },
  {
    id: 3,
    name: "Hyundai Tucson",
    image: "/vehicles/hyundai-tucson.jpg",
    type: "SUV",
    seats: 5,
    transmission: "Automatic",
    price: 59,
    rating: 4.6,
    location: "Soufrière, St. Lucia"
  },
  {
    id: 4,
    name: "Suzuki Jimny",
    image: "/vehicles/suzuki-jimny.jpg",
    type: "Jeep",
    seats: 4,
    transmission: "Manual",
    price: 45,
    rating: 4.5,
    location: "Vieux Fort, St. Lucia"
  }
];

const FeaturedVehicles = () => {
  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-10">
          <h2 className="text-3xl md:text-4xl font-bold text-brand-dark mb-2">
            Featured Vehicles
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Explore our most popular rental options in St. Lucia
          </p>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredVehicles.map(vehicle => (
            <VehicleCard key={vehicle.id} {...vehicle} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturedVehicles;
