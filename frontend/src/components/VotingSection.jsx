import React, { useState, useEffect } from 'react';
import { Heart, User, Calendar, TrendingUp, Loader2 } from 'lucide-react';
import { api, voteTracker } from '../services/api';
import { useToast } from '../hooks/use-toast';

const VotingSection = () => {
  const { toast } = useToast();
  const [jerseys, setJerseys] = useState([]);
  const [loading, setLoading] = useState(true);
  const [votingIds, setVotingIds] = useState(new Set());

  useEffect(() => {
    fetchJerseys();
  }, []);

  const fetchJerseys = async () => {
    try {
      setLoading(true);
      const data = await api.getJerseys('votes');
      setJerseys(data);
    } catch (error) {
      toast({
        title: "Error loading jerseys",
        description: "Failed to load jersey designs. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleVote = async (jerseyId) => {
    if (votingIds.has(jerseyId)) return; // Prevent double-clicking

    try {
      setVotingIds(prev => new Set(prev.add(jerseyId)));
      
      const result = await api.toggleVote(jerseyId);
      
      // Update local state
      setJerseys(prev => prev.map(jersey => 
        jersey.id === jerseyId 
          ? { ...jersey, votes: result.newVoteCount }
          : jersey
      ));

      // Update local vote tracking
      if (result.action === 'voted') {
        voteTracker.addVotedJersey(jerseyId);
      } else {
        voteTracker.removeVotedJersey(jerseyId);
      }

      // Show success message
      toast({
        title: result.action === 'voted' ? "Vote cast!" : "Vote removed",
        description: `You ${result.action} for this design.`
      });

    } catch (error) {
      toast({
        title: "Voting failed",
        description: "Failed to cast your vote. Please try again.",
        variant: "destructive"
      });
    } finally {
      setVotingIds(prev => {
        const newSet = new Set(prev);
        newSet.delete(jerseyId);
        return newSet;
      });
    }
  };

  if (loading) {
    return (
      <section id="vote" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <Loader2 className="animate-spin mx-auto mb-4" size={48} />
            <p className="text-gray-600">Loading jersey designs...</p>
          </div>
        </div>
      </section>
    );
  }

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
        {jerseys.length > 0 ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {jerseys.map((jersey, index) => (
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
                    src={jersey.imageUrl.startsWith('/api/uploads') 
                      ? `${process.env.REACT_APP_BACKEND_URL}${jersey.imageUrl}`
                      : jersey.imageUrl}
                    alt={jersey.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    onError={(e) => {
                      e.target.src = "https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=400&h=500&fit=crop";
                    }}
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
                      disabled={votingIds.has(jersey.id)}
                      className={`flex items-center gap-2 px-4 py-2 rounded-lg font-semibold transition-all duration-300 disabled:opacity-50 ${
                        voteTracker.isVoted(jersey.id)
                          ? 'bg-red-500 text-white hover:bg-red-600'
                          : 'bg-gray-100 text-gray-700 hover:bg-green-100 hover:text-green-700'
                      }`}
                    >
                      {votingIds.has(jersey.id) ? (
                        <Loader2 size={18} className="animate-spin" />
                      ) : (
                        <Heart 
                          size={18} 
                          className={voteTracker.isVoted(jersey.id) ? 'fill-current' : ''} 
                        />
                      )}
                      {voteTracker.isVoted(jersey.id) ? 'Voted' : 'Vote'}
                    </button>
                    
                    <div className="flex items-center gap-1 text-gray-600">
                      <TrendingUp size={16} />
                      <span className="font-semibold">{jersey.votes}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No jersey designs available yet. Be the first to submit one!</p>
          </div>
        )}
      </div>
    </section>
  );
};

export default VotingSection;