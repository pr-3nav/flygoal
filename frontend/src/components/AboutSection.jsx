import React from 'react';
import { Users, Vote, Award, TrendingUp } from 'lucide-react';
import { mockFeatures, mockStats } from '../data/mock';

const AboutSection = () => {
  const iconMap = {
    Users: Users,
    Vote: Vote,
    Award: Award
  };

  return (
    <section id="about" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-black mb-6">
            THE POWER IS IN YOUR HANDS
          </h2>
          <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            We're revolutionizing football merchandise by putting the design power directly into the hands of the fans. 
            No corporate boardrooms deciding what you wear - just pure community creativity.
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          <div className="text-center">
            <div className="text-3xl sm:text-4xl font-bold text-green-600 mb-2">
              {mockStats.totalDesigns}
            </div>
            <div className="text-gray-600 font-medium">Total Designs</div>
          </div>
          <div className="text-center">
            <div className="text-3xl sm:text-4xl font-bold text-green-600 mb-2">
              {mockStats.totalVotes.toLocaleString()}
            </div>
            <div className="text-gray-600 font-medium">Community Votes</div>
          </div>
          <div className="text-center">
            <div className="text-3xl sm:text-4xl font-bold text-green-600 mb-2">
              {mockStats.activeDesigners}
            </div>
            <div className="text-gray-600 font-medium">Active Designers</div>
          </div>
          <div className="text-center">
            <div className="text-3xl sm:text-4xl font-bold text-green-600 mb-2">
              {mockStats.productionRuns}
            </div>
            <div className="text-gray-600 font-medium">Jerseys Produced</div>
          </div>
        </div>

        {/* Features */}
        <div className="grid md:grid-cols-3 gap-8">
          {mockFeatures.map((feature, index) => {
            const IconComponent = iconMap[feature.icon];
            return (
              <div key={index} className="text-center p-8 rounded-xl border border-gray-200 hover:border-green-600 transition-all duration-300 hover:shadow-lg">
                <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                  <IconComponent size={32} className="text-green-600" />
                </div>
                <h3 className="text-xl font-bold text-black mb-4">
                  {feature.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default AboutSection;