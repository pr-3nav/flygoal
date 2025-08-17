import React, { useState, useEffect } from 'react';
import { Users, Vote, Award, TrendingUp, Loader2 } from 'lucide-react';
import { mockFeatures } from '../data/mock';
import { api } from '../services/api';

const AboutSection = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const data = await api.getStats();
      setStats(data);
    } catch (error) {
      console.error('Error fetching stats:', error);
      // Fallback to mock data
      setStats({
        totalDesigns: 0,
        totalVotes: 0,
        activeDesigners: 0,
        productionRuns: 12
      });
    } finally {
      setLoading(false);
    }
  };

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
          {loading ? (
            <div className="col-span-full text-center">
              <Loader2 className="animate-spin mx-auto mb-2" size={24} />
              <p className="text-gray-500">Loading stats...</p>
            </div>
          ) : (
            <>
              <div className="text-center">
                <div className="text-3xl sm:text-4xl font-bold text-green-600 mb-2">
                  {stats?.totalDesigns || 0}
                </div>
                <div className="text-gray-600 font-medium">Total Designs</div>
              </div>
              <div className="text-center">
                <div className="text-3xl sm:text-4xl font-bold text-green-600 mb-2">
                  {stats?.totalVotes?.toLocaleString() || 0}
                </div>
                <div className="text-gray-600 font-medium">Community Votes</div>
              </div>
              <div className="text-center">
                <div className="text-3xl sm:text-4xl font-bold text-green-600 mb-2">
                  {stats?.activeDesigners || 0}
                </div>
                <div className="text-gray-600 font-medium">Active Designers</div>
              </div>
              <div className="text-center">
                <div className="text-3xl sm:text-4xl font-bold text-green-600 mb-2">
                  {stats?.productionRuns || 0}
                </div>
                <div className="text-gray-600 font-medium">Jerseys Produced</div>
              </div>
            </>
          )}
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