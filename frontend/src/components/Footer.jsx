import React from 'react';
import { Mail, Instagram, Twitter, Facebook } from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-black text-white py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <div className="text-2xl font-bold">
              Jersey<span className="text-green-600">Vote</span>
            </div>
            <p className="text-gray-400 leading-relaxed">
              Where football fans design the jerseys and the community decides what goes into production.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold text-lg mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <button
                  onClick={() => document.querySelector('#home')?.scrollIntoView({ behavior: 'smooth' })}
                  className="text-gray-400 hover:text-white transition-colors duration-200"
                >
                  Home
                </button>
              </li>
              <li>
                <button
                  onClick={() => document.querySelector('#vote')?.scrollIntoView({ behavior: 'smooth' })}
                  className="text-gray-400 hover:text-white transition-colors duration-200"
                >
                  Vote
                </button>
              </li>
              <li>
                <button
                  onClick={() => document.querySelector('#submit')?.scrollIntoView({ behavior: 'smooth' })}
                  className="text-gray-400 hover:text-white transition-colors duration-200"
                >
                  Submit Design
                </button>
              </li>
              <li>
                <button
                  onClick={() => document.querySelector('#gallery')?.scrollIntoView({ behavior: 'smooth' })}
                  className="text-gray-400 hover:text-white transition-colors duration-200"
                >
                  Gallery
                </button>
              </li>
            </ul>
          </div>

          {/* Community */}
          <div>
            <h3 className="font-semibold text-lg mb-4">Community</h3>
            <ul className="space-y-2 text-gray-400">
              <li>Design Guidelines</li>
              <li>Voting Rules</li>
              <li>Production Process</li>
              <li>Designer Recognition</li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-semibold text-lg mb-4">Connect</h3>
            <div className="flex space-x-4 mb-4">
              <button className="bg-gray-800 hover:bg-green-600 p-2 rounded-lg transition-colors duration-200">
                <Instagram size={20} />
              </button>
              <button className="bg-gray-800 hover:bg-green-600 p-2 rounded-lg transition-colors duration-200">
                <Twitter size={20} />
              </button>
              <button className="bg-gray-800 hover:bg-green-600 p-2 rounded-lg transition-colors duration-200">
                <Facebook size={20} />
              </button>
              <button className="bg-gray-800 hover:bg-green-600 p-2 rounded-lg transition-colors duration-200">
                <Mail size={20} />
              </button>
            </div>
            <p className="text-gray-400 text-sm">
              hello@jerseyvote.com
            </p>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
          <p>&copy; {currentYear} JerseyVote. All rights reserved. Designed by the community, for the community.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;