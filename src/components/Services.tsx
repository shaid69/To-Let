import React from 'react';
import { Home, Search, Shield, Users, Calculator, FileText } from 'lucide-react';

const services = [
  {
    icon: Search,
    title: "Property Search",
    description: "Find your ideal rental property with our advanced search filters and personalized recommendations.",
    features: ["Advanced filtering", "Saved searches", "Price alerts", "Location mapping"]
  },
  {
    icon: Shield,
    title: "Verified Listings",
    description: "All properties are thoroughly verified to ensure authenticity and prevent fraudulent listings.",
    features: ["Document verification", "Property inspection", "Owner verification", "Photo authentication"]
  },
  {
    icon: Users,
    title: "Property Management",
    description: "Complete property management services for landlords to maximize rental income and minimize hassles.",
    features: ["Tenant screening", "Rent collection", "Maintenance coordination", "Legal assistance"]
  },
  {
    icon: Calculator,
    title: "Rent Calculation",
    description: "Get accurate rental valuations and market analysis to make informed decisions.",
    features: ["Market analysis", "Rent estimation", "Investment advice", "Yield calculation"]
  },
  {
    icon: FileText,
    title: "Legal Documentation",
    description: "Professional assistance with rental agreements, contracts, and legal documentation.",
    features: ["Agreement drafting", "Legal review", "Dispute resolution", "Documentation support"]
  },
  {
    icon: Home,
    title: "Relocation Services",
    description: "End-to-end relocation assistance to make your moving process smooth and stress-free.",
    features: ["Moving assistance", "Utility setup", "Area guidance", "Local connections"]
  }
];

const ServiceCard = ({ service }: { service: typeof services[0] }) => {
  const IconComponent = service.icon;
  
  return (
    <div className="bg-white rounded-xl shadow-lg p-8 hover:shadow-xl transition-shadow duration-300 group">
      <div className="flex items-center mb-6">
        <div className="bg-emerald-100 p-3 rounded-lg group-hover:bg-emerald-200 transition-colors duration-300">
          <IconComponent className="h-8 w-8 text-emerald-600" />
        </div>
        <h3 className="text-xl font-semibold text-gray-900 ml-4">{service.title}</h3>
      </div>
      
      <p className="text-gray-600 mb-6 leading-relaxed">{service.description}</p>
      
      <ul className="space-y-2">
        {service.features.map((feature, index) => (
          <li key={index} className="flex items-center text-sm text-gray-600">
            <div className="w-2 h-2 bg-emerald-500 rounded-full mr-3"></div>
            {feature}
          </li>
        ))}
      </ul>
    </div>
  );
};

const Services = () => {
  return (
    <section id="services" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Our Services
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            We provide comprehensive rental solutions to make your property journey seamless. 
            From finding the perfect home to managing your investment, we've got you covered.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <ServiceCard key={index} service={service} />
          ))}
        </div>

        <div className="mt-16 bg-gradient-to-r from-emerald-600 to-teal-600 rounded-2xl p-8 md:p-12 text-center text-white">
          <h3 className="text-3xl font-bold mb-4">Need Custom Solutions?</h3>
          <p className="text-xl mb-8 opacity-90">
            We offer tailored services for corporate housing, bulk rentals, and commercial properties.
          </p>
          <button className="bg-white text-emerald-600 hover:bg-gray-100 font-semibold py-3 px-8 rounded-lg transition-colors duration-200">
            Contact Our Experts
          </button>
        </div>
      </div>
    </section>
  );
};

export default Services;