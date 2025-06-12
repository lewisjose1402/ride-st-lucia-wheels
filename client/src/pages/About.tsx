
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

const AboutPage = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow pt-16">
        {/* Hero Section */}
        <section className="bg-brand-purple text-white py-16">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-3xl md:text-5xl font-bold mb-4">About RideMatch St. Lucia</h1>
            <p className="text-xl max-w-3xl mx-auto opacity-90">
              Connecting tourists with local rental services for the perfect St. Lucia experience
            </p>
          </div>
        </section>
        
        {/* Mission */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto">
              <h2 className="text-3xl font-bold text-brand-dark mb-6">Our Mission</h2>
              <p className="text-lg text-gray-700 mb-8 leading-relaxed">
                At RideMatch St. Lucia, our mission is to make vehicle rental in St. Lucia simple, transparent, and affordable. 
                We connect travelers with trusted local rental companies, ensuring you get the best vehicle for your island adventure.
              </p>
              
              <p className="text-lg text-gray-700 mb-8 leading-relaxed">
                We believe in supporting the local economy while providing excellent service to visitors. 
                By partnering with St. Lucian rental companies, we help create sustainable tourism that benefits both travelers and the island community.
              </p>
              
              <div className="bg-gray-50 p-6 rounded-lg border border-gray-200 italic text-gray-700 text-center my-8">
                "Our goal is to enhance your St. Lucia experience with reliable transportation that lets you explore our beautiful island at your own pace."
              </div>
            </div>
          </div>
        </section>
        
        {/* More placeholder content would go here */}
        
      </main>
      
      <Footer />
    </div>
  );
};

export default AboutPage;
