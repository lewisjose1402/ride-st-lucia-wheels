
import SearchForm from "./SearchForm";

const Hero = () => {
  return (
    <section 
      className="relative pt-16 pb-20 md:pt-24 md:pb-32"
      style={{
        backgroundImage: "linear-gradient(to bottom, rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.7)), url('/lovable-uploads/04e57072-d1d0-4a2c-9c19-bdb8eed479a6.png')",
        backgroundSize: "cover",
        backgroundPosition: "center"
      }}
    >
      <div className="container mx-auto px-4">
        <div className="text-center mb-10">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4">
            Find Your Perfect Rental in St. Lucia
          </h1>
          <p className="text-xl md:text-2xl text-gray-200 max-w-3xl mx-auto">
            Compare local rental companies and find the best deals for your Caribbean adventure
          </p>
        </div>
        
        <div className="max-w-4xl mx-auto">
          <SearchForm />
        </div>
      </div>
      
      {/* Decorative wave overlay for design flair */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 80" className="w-full h-auto">
          <path 
            fill="#ffffff" 
            fillOpacity="1" 
            d="M0,32L80,42.7C160,53,320,75,480,74.7C640,75,800,53,960,42.7C1120,32,1280,32,1440,37.3L1440,80L1280,80C1120,80,960,80,800,80C640,80,480,80,320,80C160,80,80,80,0,80Z"
          ></path>
        </svg>
      </div>
    </section>
  );
};

export default Hero;
