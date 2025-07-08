
import { Youtube, MessageCircle, Phone } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-kweku-blue text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="md:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <div className="font-heading font-bold">
                <span className="text-lg">Kweku Online Study</span>
                <div className="text-sm text-kweku-orange">A lesson that counts</div>
              </div>
            </div>
            <p className="text-gray-300 mb-4">
              Professional mathematics tutoring for IGCSE, A-Level, and Additional Mathematics. 
              Excellence in education through personalized learning.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold text-lg mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li><a href="/past-papers" className="text-gray-300 hover:text-white transition-colors">Past Papers</a></li>
              <li><a href="/video-lessons" className="text-gray-300 hover:text-white transition-colors">Video Lessons</a></li>
              <li><a href="/resources" className="text-gray-300 hover:text-white transition-colors">Resources</a></li>
              <li><a href="/study-tips" className="text-gray-300 hover:text-white transition-colors">Study Tips</a></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="font-semibold text-lg mb-4">Contact</h3>
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <Phone size={16} />
                <span className="text-gray-300">+233 24 721 9711</span>
              </div>
              <a 
                href="https://wa.me/233247219711" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center space-x-2 text-gray-300 hover:text-white transition-colors"
              >
                <MessageCircle size={16} />
                <span>WhatsApp</span>
              </a>
              <a 
                href="https://www.youtube.com/@KwekuOnlineStudy2-pn7zo" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center space-x-2 text-gray-300 hover:text-white transition-colors"
              >
                <Youtube size={16} />
                <span>YouTube Channel</span>
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-600 mt-8 pt-8 text-center">
          <p className="text-gray-300">
            © 2024 Kweku Online Study. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
