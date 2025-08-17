import React from 'react';
import { Play, ArrowDown } from 'lucide-react';
import { mockHeroContent } from '../data/mock';

const HeroSection = () => {
  const scrollToNext = () => {
    const element = document.querySelector('#about');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section id="home" className="relative h-screen flex items-center justify-center overflow-hidden">
      {/* Video Background */}
      <div className="absolute inset-0 z-0">
        <div className="w-full h-full bg-gradient-to-r from-black/60 to-black/40">
          <iframe
            src="https://player.vimeo.com/video/76979871?background=1&autoplay=1&loop=1&byline=0&title=0&muted=1"
            className="w-full h-full object-cover"
            allow="autoplay; fullscreen"
            title="Football Background Video"
          ></iframe>
        </div>
        {/* Overlay */}
        <div className="absolute inset-0 bg-black/50"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 text-center px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight">
          {mockHeroContent.title}
        </h1>
        
        <div className="text-xl sm:text-2xl lg:text-3xl font-semibold text-green-400 mb-8">
          {mockHeroContent.subtitle}
        </div>
        
        <p className="text-lg sm:text-xl text-gray-200 mb-12 max-w-2xl mx-auto leading-relaxed">
          {mockHeroContent.description}
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <button className="bg-green-600 hover:bg-green-700 text-white px-8 py-4 rounded-lg font-semibold text-lg transition-all duration-300 transform hover:scale-105 flex items-center gap-2">
            <Play size={20} />
            Start Voting
          </button>
          
          <button className="border-2 border-white text-white hover:bg-white hover:text-black px-8 py-4 rounded-lg font-semibold text-lg transition-all duration-300 transform hover:scale-105">
            Submit Design
          </button>
        </div>
      </div>

      {/* Scroll Indicator */}
      <button
        onClick={scrollToNext}
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-white hover:text-green-400 transition-colors duration-300 animate-bounce"
      >
        <ArrowDown size={32} />
      </button>
    </section>
  );
};

export default HeroSection;