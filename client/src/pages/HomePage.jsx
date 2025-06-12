    import React, { useState, useEffect, useRef } from 'react';
    import logo from "../assets/logo.jpeg"
    import { Link } from 'react-router-dom';
    import Courses from '../components/Courses';
import NavBar from '../components/NavBar';
    const HomePage = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isNavbarVisible, setIsNavbarVisible] = useState(true);
    const lastScrollTop = useRef(0);
    const heroRef = useRef(null);
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

    const handleRippleEffect = (e) => {
        const button = e.currentTarget;
        const rect = button.getBoundingClientRect();
        const ripple = document.createElement('span');
        const size = Math.max(rect.width, rect.height);
        const x = e.clientX - rect.left - size / 2;
        const y = e.clientY - rect.top - size / 2;
        
        ripple.style.width = ripple.style.height = size + 'px';
        ripple.style.left = x + 'px';
        ripple.style.top = y + 'px';
        ripple.classList.add('ripple');
        
        button.appendChild(ripple);
        
        setTimeout(() => {
        ripple.remove();
        }, 600);
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-200 overflow-x-hidden font-sans">
        {/* Custom Styles */}
        <style jsx>{`
            @import url('https://fonts.googleapis.com/css2?family=Poppins:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap');
            
            body {
            font-family: 'Poppins', sans-serif;
            }
            
            .floating-animation-1 {
            animation: float1 3s ease-in-out infinite;
            }
            
            .floating-animation-2 {
            animation: float2 4s ease-in-out infinite;
            }
            
            .particle {
            animation: particleFloat 5s ease-in-out infinite;
            }
            
            .gradient-text {
            background: linear-gradient(135deg, #1e40af, #3b82f6);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
            }
            
            .logo-pulse {
            animation: logoPulse 2s ease-in-out infinite;
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
            
            .btn-hover {
            transition: all 0.3s ease;
            }
            
            .btn-hover:hover {
            transform: translateY(-2px);
            box-shadow: 0 8px 25px rgba(30, 64, 175, 0.4);
            }
            
            .btn-outline-hover:hover {
            transform: translateY(-1px);
            box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
            }
            
            .ripple {
            position: absolute;
            border-radius: 50%;
            background: rgba(255, 255, 255, 0.5);
            pointer-events: none;
            transform: scale(0);
            animation: rippleEffect 0.6s ease-out;
            }
            
            @keyframes float1 {
            0%, 100% { transform: translateY(0px) rotate(0deg); }
            50% { transform: translateY(-20px) rotate(5deg); }
            }
            
            @keyframes float2 {
            0%, 100% { transform: translateY(0px) rotate(0deg); }
            50% { transform: translateY(-15px) rotate(-3deg); }
            }
            
            @keyframes particleFloat {
            0%, 100% { transform: translateY(0px) translateX(0px) rotate(0deg) scale(1); }
            25% { transform: translateY(-20px) translateX(10px) rotate(90deg) scale(1.2); }
            50% { transform: translateY(10px) translateX(-15px) rotate(180deg) scale(0.8); }
            75% { transform: translateY(-10px) translateX(20px) rotate(270deg) scale(1.1); }
            }
            
            @keyframes logoPulse {
            0%, 100% { transform: scale(1); }
            50% { transform: scale(1.1); }
            }
            
            @keyframes rippleEffect {
            to {
                transform: scale(2);
                opacity: 0;
            }
            }
            
            .navbar-slide {
            transform: translateY(${isNavbarVisible ? '0' : '-100px'});
            transition: transform 0.3s ease;
            }
        `}</style>

        {/* Floating Particles Background */}
        <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
            <div className="particle absolute w-5 h-5 bg-gradient-to-r from-blue-800 to-blue-600 rounded-full opacity-10" style={{top: '20%', left: '10%'}}></div>
            <div className="particle absolute w-4 h-4 bg-gradient-to-r from-blue-800 to-blue-600 rounded-full opacity-10" style={{top: '60%', left: '85%'}}></div>
            <div className="particle absolute w-6 h-6 bg-gradient-to-r from-blue-800 to-blue-600 rounded-full opacity-10" style={{top: '80%', left: '15%'}}></div>
            <div className="particle absolute w-5 h-5 bg-gradient-to-r from-blue-800 to-blue-600 rounded-full opacity-10" style={{top: '30%', left: '80%'}}></div>
            <div className="particle absolute w-3 h-3 bg-gradient-to-r from-blue-800 to-blue-600 rounded-full opacity-10" style={{top: '70%', left: '60%'}}></div>
        </div>

        {/* Navbar */}
         <NavBar />

        {/* Hero Section */}
        <section 
            ref={heroRef}
            className="relative min-h-screen flex flex-col justify-center items-center text-center px-4 pt-24"
        >
            <div className="max-w-4xl mx-auto relative z-10">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-semibold leading-tight mb-8 animate-pulse">
                Build skills, earn points, unlock<br />
                <span className="gradient-text">job opportunities.</span>
            </h1>
            
            <p className="text-lg md:text-xl text-gray-600 leading-relaxed mb-10 max-w-2xl mx-auto">
                Earn recognition for your skills and projects while accessing expert mentorship,<br className="hidden md:block" /> 
                career growth, and exclusive job offers.
            </p>
            
            <div className="flex justify-center">
                <button 
                onClick={handleRippleEffect}
                className="relative overflow-hidden px-8 py-4 bg-blue-800 text-white rounded-full font-medium btn-hover shadow-lg"
                >
                Get Started <span className="ml-2">→</span>
                </button>
            </div>
            </div>
            
            {/* Floating Images */}
            <div className="hidden lg:block absolute left-8 top-48 floating-animation-1">
            <div className="w-20 h-20 bg-gradient-to-r from-purple-400 to-pink-400 rounded-lg shadow-xl flex items-center justify-center">
                <span className="text-white font-bold text-xl">🎯</span>
            </div>
            </div>
            
            <div className="hidden lg:block absolute right-8 top-96 floating-animation-2">
            <div className="w-24 h-24 bg-gradient-to-r from-blue-400 to-cyan-400 rounded-lg shadow-xl flex items-center justify-center">
                <span className="text-white font-bold text-2xl">🚀</span>
            </div>
            </div>
        </section>
        <Courses />
        </div>
    );
    };

    export default HomePage;	