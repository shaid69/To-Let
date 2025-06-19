import React, { useState } from 'react';
import { Menu, X, Home, Search, Phone, Mail } from 'lucide-react';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center space-x-2">
            <Home className="h-8 w-8 text-emerald-600" />
            <span className="text-2xl font-bold text-gray-900">BanglaToLet</span>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-8">
            <a href="#home" className="text-gray-700 hover:text-emerald-600 transition-colors duration-200">Home</a>
            <a href="#properties" className="text-gray-700 hover:text-emerald-600 transition-colors duration-200">Properties</a>
            <a href="#services" className="text-gray-700 hover:text-emerald-600 transition-colors duration-200">Services</a>
            <a href="#about" className="text-gray-700 hover:text-emerald-600 transition-colors duration-200">About</a>
            <a href="#contact" className="text-gray-700 hover:text-emerald-600 transition-colors duration-200">Contact</a>
          </nav>

          {/* Contact Info */}
          <div className="hidden lg:flex items-center space-x-4">
            <div className="flex items-center space-x-1 text-sm text-gray-600">
              <Phone className="h-4 w-4" />
              <span>+880 1XXX-XXXXXX</span>
            </div>
            <div className="flex items-center space-x-1 text-sm text-gray-600">
              <Mail className="h-4 w-4" />
              <span>info@banglatolet.com</span>
            </div>
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden text-gray-700 hover:text-emerald-600 transition-colors duration-200"
          >
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden bg-white border-t border-gray-200">
            <nav className="py-4 space-y-2">
              <a href="#home" className="block px-4 py-2 text-gray-700 hover:text-emerald-600 hover:bg-gray-50 transition-colors duration-200">Home</a>
              <a href="#properties" className="block px-4 py-2 text-gray-700 hover:text-emerald-600 hover:bg-gray-50 transition-colors duration-200">Properties</a>
              <a href="#services" className="block px-4 py-2 text-gray-700 hover:text-emerald-600 hover:bg-gray-50 transition-colors duration-200">Services</a>
              <a href="#about" className="block px-4 py-2 text-gray-700 hover:text-emerald-600 hover:bg-gray-50 transition-colors duration-200">About</a>
              <a href="#contact" className="block px-4 py-2 text-gray-700 hover:text-emerald-600 hover:bg-gray-50 transition-colors duration-200">Contact</a>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;