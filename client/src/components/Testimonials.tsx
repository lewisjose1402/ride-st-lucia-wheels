const testimonials = [
  {
    id: 1,
    content: "RideMatch made our St. Lucia vacation so much easier. We found a perfect Jeep at a great price and the pickup process was smooth. Highly recommend!",
    author: "Sarah M.",
    location: "Toronto, Canada",
    avatar: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=96&h=96&fit=crop&crop=face"
  },
  {
    id: 2,
    content: "As a first-time visitor to St. Lucia, I was worried about finding reliable transportation. RideMatch connected us with a wonderful local company and we couldn't be happier.",
    author: "James L.",
    location: "London, UK",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=96&h=96&fit=crop&crop=face"
  },
  {
    id: 3,
    content: "The ability to compare different rental companies in one place saved us time and money. Our SUV was perfect for exploring the island's rugged terrain.",
    author: "Maria C.",
    location: "Miami, USA",
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=96&h=96&fit=crop&crop=face"
  }
];

const Testimonials = () => {
  return (
    <section className="py-16 bg-brand-purple bg-opacity-5">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-2 text-[#ffffff]">
            Happy Travelers
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            See what our customers have to say about their experience with RideMatch
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map(testimonial => (
            <div key={testimonial.id} className="bg-white p-6 rounded-lg shadow-md">
              <div className="flex items-center mb-4">
                <div className="h-12 w-12 rounded-full overflow-hidden mr-4">
                  <img 
                    src={testimonial.avatar} 
                    alt={testimonial.author}
                    className="h-full w-full object-cover"
                  />
                </div>
                <div>
                  <h4 className="font-semibold text-brand-dark">{testimonial.author}</h4>
                  <p className="text-sm text-gray-600">{testimonial.location}</p>
                </div>
              </div>
              <blockquote className="text-gray-700 italic">{testimonial.content}</blockquote>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
