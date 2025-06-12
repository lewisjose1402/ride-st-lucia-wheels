
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { ChevronDown } from 'lucide-react';
import { useState } from 'react';

const FAQ = () => {
  const [openItems, setOpenItems] = useState<number[]>([]);

  const toggleItem = (index: number) => {
    setOpenItems(prev => 
      prev.includes(index) 
        ? prev.filter(i => i !== index)
        : [...prev, index]
    );
  };

  const faqs = [
    {
      category: "Booking Process",
      questions: [
        {
          question: "How do I book a rental vehicle?",
          answer: "Simply search for available vehicles using your preferred dates, select your ideal vehicle, and complete the booking form. You'll need to pay a small confirmation deposit to secure your reservation."
        },
        {
          question: "What information do I need to provide when booking?",
          answer: "You'll need to provide your personal details, driver's license information, age, driving experience, and preferred pickup/delivery location. International visitors will also need passport details."
        },
        {
          question: "Can I modify or cancel my booking?",
          answer: "Yes, you can modify or cancel your booking. Cancellation policies vary by rental company, but most allow free cancellation up to 24-48 hours before pickup. Contact the rental company directly for specific policies."
        }
      ]
    },
    {
      category: "Requirements & Documentation",
      questions: [
        {
          question: "What are the age requirements for renting a vehicle?",
          answer: "The minimum age is typically 21 years old, though some companies may require drivers to be 25 or older. Drivers under 25 may incur additional young driver fees."
        },
        {
          question: "Do I need an international driving license?",
          answer: "While an international driving license is preferred, visitors can obtain a temporary St. Lucia driving permit upon arrival. This can be arranged through the rental company for a small fee."
        },
        {
          question: "What documents do I need to bring?",
          answer: "You'll need a valid driver's license, passport (for international visitors), and a credit card for the security deposit. Some companies may also require proof of insurance."
        }
      ]
    },
    {
      category: "Payment & Pricing",
      questions: [
        {
          question: "How much is the confirmation deposit?",
          answer: "The confirmation deposit is typically $25-50 and secures your reservation. This amount is deducted from your total rental cost upon vehicle pickup."
        },
        {
          question: "When do I pay the remaining balance?",
          answer: "The remaining balance is paid directly to the rental company when you pick up the vehicle. Most companies accept cash, credit cards, or bank transfers."
        },
        {
          question: "Are there any hidden fees?",
          answer: "All fees are clearly displayed during booking. Additional costs may include young driver fees, temporary permit fees, delivery charges, or optional insurance coverage."
        }
      ]
    },
    {
      category: "Vehicle Pickup & Delivery",
      questions: [
        {
          question: "Where can I pick up my rental vehicle?",
          answer: "Vehicles can be picked up at the rental company's location, airports (UVF Hewanorra or GFL George F.L. Charles), or delivered to your accommodation for an additional fee."
        },
        {
          question: "Is delivery to my hotel available?",
          answer: "Yes, most rental companies offer delivery and pickup services to hotels and accommodations across the island. Delivery fees vary based on location and distance."
        },
        {
          question: "What happens if my flight is delayed?",
          answer: "Contact the rental company as soon as possible if your flight is delayed. Most companies are flexible and will hold your reservation or adjust pickup times without penalty."
        }
      ]
    },
    {
      category: "Insurance & Safety",
      questions: [
        {
          question: "Is insurance included in the rental price?",
          answer: "Basic insurance is typically included, but coverage levels vary by company. You can purchase additional comprehensive coverage for extra protection and peace of mind."
        },
        {
          question: "What happens if the vehicle is damaged?",
          answer: "Report any damage immediately to the rental company. Depending on your insurance coverage, you may be responsible for repair costs up to the security deposit amount."
        },
        {
          question: "Are the vehicles regularly maintained?",
          answer: "Yes, all rental companies on our platform are required to maintain their vehicles to safety standards. Vehicles undergo regular inspections and maintenance."
        }
      ]
    },
    {
      category: "Driving in St. Lucia",
      questions: [
        {
          question: "Which side of the road do you drive on in St. Lucia?",
          answer: "In St. Lucia, you drive on the LEFT side of the road, following British driving conventions. Take extra care if you're used to driving on the right side."
        },
        {
          question: "What are the road conditions like?",
          answer: "Main roads are generally well-maintained, but some rural and mountainous areas may have narrow, winding roads. A 4WD vehicle is recommended for exploring remote areas."
        },
        {
          question: "Do I need GPS navigation?",
          answer: "GPS is highly recommended, especially for first-time visitors. Many rental companies offer GPS units, or you can use mobile apps like Google Maps (ensure you have data coverage)."
        }
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      
      <div className="pt-20">
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-brand-purple to-brand-dark text-white py-16">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Frequently Asked Questions
            </h1>
            <p className="text-xl max-w-3xl mx-auto opacity-90">
              Find answers to common questions about renting vehicles in St. Lucia
            </p>
          </div>
        </section>

        {/* FAQ Content */}
        <section className="py-16">
          <div className="container mx-auto px-4 max-w-4xl">
            {faqs.map((category, categoryIndex) => (
              <div key={categoryIndex} className="mb-12">
                <h2 className="text-2xl font-bold text-brand-dark mb-6 pb-2 border-b-2 border-brand-orange">
                  {category.category}
                </h2>
                <div className="space-y-4">
                  {category.questions.map((faq, questionIndex) => {
                    const itemIndex = categoryIndex * 10 + questionIndex;
                    const isOpen = openItems.includes(itemIndex);
                    
                    return (
                      <Collapsible key={questionIndex}>
                        <CollapsibleTrigger
                          onClick={() => toggleItem(itemIndex)}
                          className="w-full text-left p-4 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors duration-200"
                        >
                          <div className="flex justify-between items-center">
                            <h3 className="font-semibold text-brand-dark pr-4">{faq.question}</h3>
                            <ChevronDown 
                              className={`w-5 h-5 text-brand-purple transition-transform duration-200 ${
                                isOpen ? 'transform rotate-180' : ''
                              }`}
                            />
                          </div>
                        </CollapsibleTrigger>
                        <CollapsibleContent className="px-4 py-3 text-gray-600 bg-white border-l-4 border-brand-orange">
                          {faq.answer}
                        </CollapsibleContent>
                      </Collapsible>
                    );
                  })}
                </div>
              </div>
            ))}

            {/* Contact Section */}
            <div className="bg-brand-light p-8 rounded-lg text-center mt-12">
              <h2 className="text-2xl font-bold text-brand-dark mb-4">
                Still Have Questions?
              </h2>
              <p className="text-gray-600 mb-6">
                Can't find the answer you're looking for? Our support team is here to help.
              </p>
              <a 
                href="mailto:info@ridematchstlucia.com"
                className="inline-block bg-brand-orange text-white px-6 py-3 rounded-lg font-semibold hover:bg-opacity-90 transition-colors"
              >
                Contact Support
              </a>
            </div>
          </div>
        </section>
      </div>

      <Footer />
    </div>
  );
};

export default FAQ;
