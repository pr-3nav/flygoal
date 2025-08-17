import React, { useState } from 'react';
import { Filter, Grid, List, Search, Calendar, TrendingUp } from 'lucide-react';
import { mockJerseys } from '../data/mock';

const GallerySection = () => {
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'
  const [sortBy, setSortBy] = useState('votes'); // 'votes', 'recent', 'name'
  const [searchTerm, setSearchTerm] = useState('');

  const filteredJerseys = mockJerseys
    .filter(jersey => 
      jersey.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      jersey.designer.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      switch (sortBy) {
        case 'votes':
          return b.votes - a.votes;
        case 'recent':
          return new Date(b.submittedAt) - new Date(a.submittedAt);
        case 'name':
          return a.title.localeCompare(b.title);
        default:
          return 0;
      }
    });

  return (
    <section id="gallery" className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-black mb-6">
            DESIGN GALLERY
          </h2>
          <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Explore all community submissions and discover the creativity of our design community.
          </p>
        </div>

        {/* Controls */}
        <div className="flex flex-col lg:flex-row gap-4 mb-8 p-4 bg-white rounded-xl shadow-sm">
          {/* Search */}
          <div className="flex-1">
            <div className="relative">
              <input
                type="text"
                placeholder="Search designs or designers..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-2 pl-10 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
              <Search size={18} className="absolute left-3 top-2.5 text-gray-400" />
            </div>
          </div>

          {/* Sort */}
          <div className="flex items-center gap-2">
            <Filter size={18} className="text-gray-500" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-3 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-transparent"
            >
              <option value="votes">Most Voted</option>
              <option value="recent">Most Recent</option>
              <option value="name">Alphabetical</option>
            </select>
          </div>

          {/* View Mode */}
          <div className="flex rounded-lg border border-gray-300 overflow-hidden">
            <button
              onClick={() => setViewMode('grid')}
              className={`px-3 py-2 ${viewMode === 'grid' ? 'bg-green-600 text-white' : 'bg-white text-gray-600 hover:bg-gray-50'}`}
            >
              <Grid size={18} />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`px-3 py-2 ${viewMode === 'list' ? 'bg-green-600 text-white' : 'bg-white text-gray-600 hover:bg-gray-50'}`}
            >
              <List size={18} />
            </button>
          </div>
        </div>

        {/* Results Count */}
        <div className="mb-6">
          <p className="text-gray-600">
            Showing {filteredJerseys.length} of {mockJerseys.length} designs
          </p>
        </div>

        {/* Gallery Grid */}
        {viewMode === 'grid' ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredJerseys.map((jersey) => (
              <div key={jersey.id} className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden group">
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={jersey.imageUrl}
                    alt={jersey.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-2 right-2 bg-black/70 text-white px-2 py-1 rounded text-sm">
                    {jersey.votes} votes
                  </div>
                </div>
                
                <div className="p-4">
                  <h3 className="font-bold text-black mb-1">{jersey.title}</h3>
                  <p className="text-sm text-gray-600 mb-2">by {jersey.designer}</p>
                  <p className="text-xs text-gray-500">
                    {new Date(jersey.submittedAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          /* Gallery List */
          <div className="space-y-4">
            {filteredJerseys.map((jersey) => (
              <div key={jersey.id} className="bg-white rounded-xl p-6 shadow-md hover:shadow-lg transition-all duration-300">
                <div className="flex flex-col md:flex-row gap-6">
                  <div className="md:w-32 md:h-32 w-full h-48 rounded-lg overflow-hidden flex-shrink-0">
                    <img
                      src={jersey.imageUrl}
                      alt={jersey.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                      <div>
                        <h3 className="text-xl font-bold text-black mb-2">{jersey.title}</h3>
                        <p className="text-gray-600 mb-3">{jersey.description}</p>
                        <div className="flex items-center gap-4 text-sm text-gray-500">
                          <span>by {jersey.designer}</span>
                          <div className="flex items-center gap-1">
                            <Calendar size={14} />
                            <span>{new Date(jersey.submittedAt).toLocaleDateString()}</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2 text-green-600 font-semibold">
                        <TrendingUp size={18} />
                        <span>{jersey.votes} votes</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* No Results */}
        {filteredJerseys.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No designs found matching your search.</p>
          </div>
        )}
      </div>
    </section>
  );
};

export default GallerySection;