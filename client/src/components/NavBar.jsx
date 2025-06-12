// components/NavBar.jsx
import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';

const NavBar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isNavbarVisible, setIsNavbarVisible] = useState(true);
  const lastScrollTop = useRef(0);
  const navRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      if (scrollTop > lastScrollTop.current && scrollTop > 100) {
        setIsNavbarVisible(false);
      } else {
        setIsNavbarVisible(true);
      }
      lastScrollTop.current = scrollTop;
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      <style jsx="true">{`
        .navbar-slide {
          transform: translateY(${isNavbarVisible ? '0' : '-100px'});
          transition: transform 0.3s ease;
        }

        .nav-link-hover {
          position: relative;
          transition: all 0.3s ease;
        }

        .nav-link-hover::after {
          content: '';
          position: absolute;
          width: 0;
          height: 2px;
          bottom: -5px;
          left: 50%;
          background-color: #1e40af;
          transition: all 0.3s ease;
          transform: translateX(-50%);
        }

        .nav-link-hover:hover::after {
          width: 100%;
        }

        .nav-link-hover:hover {
          transform: translateY(-2px);
        }

        .btn-hover:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 25px rgba(30, 64, 175, 0.4);
        }

        .btn-outline-hover:hover {
          transform: translateY(-1px);
          box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
        }

        .logo-pulse {
          animation: logoPulse 2s ease-in-out infinite;
        }

        @keyframes logoPulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.1); }
        }
      `}</style>

      <nav
        ref={navRef}
        className={`fixed top-0 left-0 right-0 z-50 navbar-slide backdrop-blur-lg bg-white/95 shadow-sm px-4 py-3`}
      >
        <div className="flex justify-between items-center max-w-7xl mx-auto">
          {/* Logo */}
          <div className="flex items-center">
            <div className="w-11 h-11 bg-gradient-to-r from-blue-800 to-blue-600 rounded-lg flex items-center justify-center logo-pulse">
              <span className="text-white font-bold text-lg">TL</span>
            </div>
          </div>

          {/* Desktop Links */}
          <div className="hidden md:flex space-x-8">
            <a href="#" className="nav-link-hover text-gray-700 font-medium">Home</a>
            <a href="#" className="nav-link-hover text-gray-700 font-medium">About</a>
            <a href="#" className="nav-link-hover text-gray-700 font-medium">Services</a>
            <a href="#" className="nav-link-hover text-gray-700 font-medium">Contact</a>
          </div>

          {/* Desktop Buttons */}
          <div className="hidden md:flex space-x-3">
            <Link
              to="/login"
              className="px-6 py-2 border border-gray-300 rounded-full font-medium text-gray-700 btn-outline-hover transition-all duration-300"
            >
              Log In
            </Link>
            <Link
              to="/register"
              className="px-6 py-2 bg-blue-800 text-white rounded-full font-medium btn-hover transition-all duration-300"
            >
              Sign Up
            </Link>
          </div>

          {/* Mobile Menu Toggle */}
          <button
            className="md:hidden p-2"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <div className="w-6 h-6 flex flex-col justify-center space-y-1">
              <div className={`w-full h-0.5 bg-gray-600 transition-all duration-300 ${isMenuOpen ? 'rotate-45 translate-y-1.5' : ''}`}></div>
              <div className={`w-full h-0.5 bg-gray-600 transition-all duration-300 ${isMenuOpen ? 'opacity-0' : ''}`}></div>
              <div className={`w-full h-0.5 bg-gray-600 transition-all duration-300 ${isMenuOpen ? '-rotate-45 -translate-y-1.5' : ''}`}></div>
            </div>
          </button>
        </div>

        {/* Mobile Menu */}
        <div className={`md:hidden mt-4 transition-all duration-300 ${isMenuOpen ? 'max-h-64 opacity-100' : 'max-h-0 opacity-0 overflow-hidden'}`}>
          <div className="flex flex-col space-y-4 pb-4">
            <a href="#" className="text-gray-700 font-medium">Home</a>
            <a href="#" className="text-gray-700 font-medium">About</a>
            <a href="#" className="text-gray-700 font-medium">Services</a>
            <a href="#" className="text-gray-700 font-medium">Contact</a>
            <div className="flex space-x-3 pt-2">
              <Link
                to="/login"
                className="w-full px-4 py-2 border border-gray-300 rounded-full font-medium text-center text-gray-700 btn-outline-hover"
              >
                Log In
              </Link>
              <Link
                to="/register"
                className="w-full px-4 py-2 bg-blue-800 text-white rounded-full font-medium text-center btn-hover"
              >
                Sign Up
              </Link>
            </div>
          </div>
        </div>
      </nav>
    </>
  );
};

export default NavBar;
