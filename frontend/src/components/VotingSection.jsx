import React, { useState } from 'react';
import { Heart, User, Calendar, TrendingUp } from 'lucide-react';
import { mockJerseys } from '../data/mock';

const VotingSection = () => {
  const [votedJerseys, setVotedJerseys] = useState(new Set());
  const [jerseyVotes, setJerseyVotes] = useState(
    mockJerseys.reduce((acc, jersey) => {
      acc[jersey.id] = jersey.votes;
      return acc;
    }, {})
  );

  const handleVote = (jerseyId) => {
    if (votedJerseys.has(jerseyId)) {
      // Unvote
      setVotedJerseys(prev => {
        const newSet = new Set(prev);
        newSet.delete(jerseyId);
        return newSet;
      });
      setJerseyVotes(prev => ({
        ...prev,
        [jerseyId]: prev[jerseyId] - 1
      }));
    } else {
      // Vote
      setVotedJerseys(prev => new Set(prev.add(jerseyId)));
      setJerseyVotes(prev => ({
        ...prev,
        [jerseyId]: prev[jerseyId] + 1
      }));
    }
  };

  const sortedJerseys = [...mockJerseys].sort((a, b) => jerseyVotes[b.id] - jerseyVotes[a.id]);

  return (
    <section id="vote" className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-black mb-6">
            VOTE FOR YOUR FAVORITES
          </h2>
          <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Browse the latest community designs and cast your vote. The designs with the most votes will be 
            selected for our next production run.
          </p>
        </div>

        {/* Jersey Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {sortedJerseys.map((jersey, index) => (
            <div key={jersey.id} className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden group">
              {/* Ranking Badge */}
              {index < 3 && (
                <div className="absolute top-4 left-4 z-10">
                  <div className={`px-3 py-1 rounded-full text-white font-bold text-sm ${
                    index === 0 ? 'bg-yellow-500' : 
                    index === 1 ? 'bg-gray-400' : 'bg-amber-600'
                  }`}>
                    #{index + 1}
                  </div>
                </div>
              )}

              {/* Jersey Image */}
              <div className="relative h-64 overflow-hidden">
                <img
                  src={jersey.imageUrl}
                  alt={jersey.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-all duration-300"></div>
              </div>

              {/* Content */}
              <div className="p-6">
                <h3 className="text-xl font-bold text-black mb-2">{jersey.title}</h3>
                <p className="text-gray-600 mb-4 text-sm leading-relaxed">{jersey.description}</p>
                
                {/* Designer Info */}
                <div className="flex items-center gap-2 mb-4 text-sm text-gray-500">
                  <User size={16} />
                  <span>by {jersey.designer}</span>
                  <Calendar size={16} className="ml-2" />
                  <span>{new Date(jersey.submittedAt).toLocaleDateString()}</span>
                </div>

                {/* Vote Button */}
                <div className="flex items-center justify-between">
                  <button
                    onClick={() => handleVote(jersey.id)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg font-semibold transition-all duration-300 ${
                      votedJerseys.has(jersey.id)
                        ? 'bg-red-500 text-white hover:bg-red-600'
                        : 'bg-gray-100 text-gray-700 hover:bg-green-100 hover:text-green-700'
                    }`}
                  >
                    <Heart 
                      size={18} 
                      className={votedJerseys.has(jersey.id) ? 'fill-current' : ''} 
                    />
                    {votedJerseys.has(jersey.id) ? 'Voted' : 'Vote'}
                  </button>
                  
                  <div className="flex items-center gap-1 text-gray-600">
                    <TrendingUp size={16} />
                    <span className="font-semibold">{jerseyVotes[jersey.id]}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default VotingSection;