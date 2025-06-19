import React, { useState, useEffect } from 'react';
import { Award, Users, MapPin, TrendingUp, Home } from 'lucide-react';
import ApiService from '../services/api.js';

const About = () => {
  const [stats, setStats] = useState({
    totalProperties: 0,
    totalTenants: 0,
    totalLocations: 0
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const data = await ApiService.getStats();
        setStats(data);
      } catch (error) {
        console.error('Failed to fetch stats:', error);
      }
    };

    fetchStats();
  }, []);

  const displayStats = [
    {
      icon: Home,
      number: `${stats.totalProperties.toLocaleString()}+`,
      label: "Properties Listed",
      description: "Verified rental properties across Bangladesh"
    },
    {
      icon: Users,
      number: `${stats.totalTenants.toLocaleString()}+`,
      label: "Happy Tenants",
      description: "Satisfied customers who found their perfect home"
    },
    {
      icon: MapPin,
      number: `${stats.totalLocations}+`,
      label: "Cities Covered",
      description: "Expanding across major cities in Bangladesh"
    },
    {
      icon: Award,
      number: "5+",
      label: "Years Experience",
      description: "Trusted expertise in Bangladesh's rental market"
    }
  ];

  const teamMembers = [
    {
      name: "Ahmed Rahman",
      role: "Founder & CEO",
      image: "https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=400",
      bio: "Real estate veteran with 15+ years of experience in Bangladesh property market."
    },
    {
      name: "Fatima Khan",
      role: "Head of Operations",
      image: "https://images.pexels.com/photos/3184436/pexels-photo-3184436.jpeg?auto=compress&cs=tinysrgb&w=400",
      bio: "Expert in property management and customer relations with proven track record."
    },
    {
      name: "Rahim Uddin",
      role: "Property Specialist",
      image: "https://images.pexels.com/photos/2379005/pexels-photo-2379005.jpeg?auto=compress&cs=tinysrgb&w=400",
      bio: "Local market expert specializing in residential and commercial properties."
    }
  ];

  const StatCard = ({ stat }: { stat: typeof displayStats[0] }) => {
    const IconComponent = stat.icon;
    
    return (
      <div className="text-center">
        <div className="flex justify-center mb-4">
          <div className="bg-emerald-100 p-4 rounded-full">
            <IconComponent className="h-8 w-8 text-emerald-600" />
          </div>
        </div>
        <div className="text-3xl font-bold text-gray-900 mb-2">{stat.number}</div>
        <div className="text-lg font-semibold text-gray-800 mb-2">{stat.label}</div>
        <div className="text-gray-600 text-sm">{stat.description}</div>
      </div>
    );
  };

  const TeamCard = ({ member }: { member: typeof teamMembers[0] }) => {
    return (
      <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
        <img
          src={member.image}
          alt={member.name}
          className="w-full h-64 object-cover"
        />
        <div className="p-6">
          <h3 className="text-xl font-semibold text-gray-900 mb-1">{member.name}</h3>
          <p className="text-emerald-600 font-medium mb-3">{member.role}</p>
          <p className="text-gray-600 text-sm leading-relaxed">{member.bio}</p>
        </div>
      </div>
    );
  };

  return (
    <section id="about" className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* About Section */}
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            About BanglaToLet
          </h2>
          <p className="text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
            Founded in 2019, BanglaToLet has emerged as Bangladesh's most trusted rental platform. 
            We connect property seekers with verified landlords, making the rental process transparent, 
            secure, and hassle-free. Our mission is to revolutionize the rental market in Bangladesh 
            by leveraging technology and providing exceptional customer service.
          </p>
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-20">
          {displayStats.map((stat, index) => (
            <StatCard key={index} stat={stat} />
          ))}
        </div>

        {/* Mission & Vision */}
        <div className="grid md:grid-cols-2 gap-12 mb-20">
          <div className="bg-white rounded-xl shadow-lg p-8">
            <div className="flex items-center mb-6">
              <div className="bg-emerald-100 p-3 rounded-lg">
                <TrendingUp className="h-8 w-8 text-emerald-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 ml-4">Our Mission</h3>
            </div>
            <p className="text-gray-600 leading-relaxed">
              To democratize access to quality rental properties across Bangladesh by creating 
              a transparent, secure, and user-friendly platform that benefits both tenants and landlords. 
              We strive to eliminate the traditional challenges of property rental through innovation and trust.
            </p>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-8">
            <div className="flex items-center mb-6">
              <div className="bg-blue-100 p-3 rounded-lg">
                <Award className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 ml-4">Our Vision</h3>
            </div>
            <p className="text-gray-600 leading-relaxed">
              To become the leading digital platform for property rentals in Bangladesh, 
              setting new standards for transparency, efficiency, and customer satisfaction. 
              We envision a future where finding the perfect rental home is simple, secure, and stress-free.
            </p>
          </div>
        </div>

        {/* Team Section */}
        <div className="text-center mb-12">
          <h3 className="text-3xl font-bold text-gray-900 mb-4">Meet Our Team</h3>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Our experienced team combines deep local market knowledge with innovative technology 
            to deliver exceptional service to our customers.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {teamMembers.map((member, index) => (
            <TeamCard key={index} member={member} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default About;