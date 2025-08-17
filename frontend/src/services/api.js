import axios from 'axios';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

// Generate a unique session ID for voting tracking
const getSessionId = () => {
  let sessionId = localStorage.getItem('jerseyVoteSessionId');
  if (!sessionId) {
    sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    localStorage.setItem('jerseyVoteSessionId', sessionId);
  }
  return sessionId;
};

export const api = {
  // Jersey operations
  getJerseys: async (sortBy = 'votes') => {
    try {
      const response = await axios.get(`${API}/jerseys?sort_by=${sortBy}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching jerseys:', error);
      throw error;
    }
  },

  createJersey: async (jerseyData) => {
    try {
      const response = await axios.post(`${API}/jerseys`, jerseyData);
      return response.data;
    } catch (error) {
      console.error('Error creating jersey:', error);
      throw error;
    }
  },

  toggleVote: async (jerseyId) => {
    try {
      const sessionId = getSessionId();
      const response = await axios.put(`${API}/jerseys/${jerseyId}/vote`, {
        voterSessionId: sessionId
      });
      return response.data;
    } catch (error) {
      console.error('Error toggling vote:', error);
      throw error;
    }
  },

  getJersey: async (jerseyId) => {
    try {
      const response = await axios.get(`${API}/jerseys/${jerseyId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching jersey:', error);
      throw error;
    }
  },

  // File upload
  uploadFile: async (file) => {
    try {
      const formData = new FormData();
      formData.append('file', file);
      
      const response = await axios.post(`${API}/upload`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error) {
      console.error('Error uploading file:', error);
      throw error;
    }
  },

  // Statistics
  getStats: async () => {
    try {
      const response = await axios.get(`${API}/stats`);
      return response.data;
    } catch (error) {
      console.error('Error fetching stats:', error);
      throw error;
    }
  }
};

// Track voted jerseys in localStorage for UI state
export const voteTracker = {
  getVotedJerseys: () => {
    const voted = localStorage.getItem('votedJerseys');
    return voted ? JSON.parse(voted) : [];
  },

  addVotedJersey: (jerseyId) => {
    const voted = voteTracker.getVotedJerseys();
    if (!voted.includes(jerseyId)) {
      voted.push(jerseyId);
      localStorage.setItem('votedJerseys', JSON.stringify(voted));
    }
  },

  removeVotedJersey: (jerseyId) => {
    const voted = voteTracker.getVotedJerseys();
    const filtered = voted.filter(id => id !== jerseyId);
    localStorage.setItem('votedJerseys', JSON.stringify(filtered));
  },

  isVoted: (jerseyId) => {
    return voteTracker.getVotedJerseys().includes(jerseyId);
  }
};