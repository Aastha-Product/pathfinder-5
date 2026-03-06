import React from 'react';

interface FooterProps {
  onNavigate: (view: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  const handleNavigation = (e: React.MouseEvent<HTMLAnchorElement>, view: string) => {
    e.preventDefault();
    onNavigate(view);
  };

  return (
    <footer className="bg-black text-white py-12">
      <div className="max-w-[1200px] mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 items-start">
          
          {/* Column 1: Brand & Description */}
          <div className="flex flex-col items-start">
            <div className="flex items-center gap-3 mb-4">
              <img 
                src="https://ui-avatars.com/api/?name=PF&background=1e3a8a&color=fff&rounded=true&bold=true&size=128" 
                alt="Pathfinder Logo" 
                className="w-8 h-8 rounded-full" 
              />
              <span className="text-xl font-semibold">Pathfinder</span>
            </div>
            <p className="text-white/60 text-sm leading-relaxed max-w-xs">
              Empowering developers to master their craft through real-world practice, mock interviews, and a supportive community.
            </p>
          </div>

          {/* Column 2: Quick Links */}
          <div className="flex flex-col items-start">
             <h4 className="text-sm font-medium uppercase tracking-[1px] opacity-70 mb-4">
               Quick Links
             </h4>
             <ul className="flex flex-col gap-3">
                <li>
                    <a 
                      href="/" 
                      onClick={(e) => handleNavigation(e, 'landing')}
                      className="text-sm text-white/85 hover:text-white transition-all duration-300 hover:translate-x-1 inline-block cursor-pointer"
                    >
                        Home
                    </a>
                </li>
                <li>
                    <a 
                      href="/resources" 
                      onClick={(e) => handleNavigation(e, 'resources')}
                      className="text-sm text-white/85 hover:text-white transition-all duration-300 hover:translate-x-1 inline-block cursor-pointer"
                    >
                        Resources
                    </a>
                </li>
             </ul>
          </div>

          {/* Column 3: Product */}
          <div className="flex flex-col items-start">
             <h4 className="text-sm font-medium uppercase tracking-[1px] opacity-70 mb-4">
               Product
             </h4>
             <ul className="flex flex-col gap-3">
                <li>
                    <a 
                      href="/mock-interviews" 
                      onClick={(e) => handleNavigation(e, 'mock-interviews')}
                      className="text-sm text-white/85 hover:text-white transition-all duration-300 hover:translate-x-1 inline-block cursor-pointer"
                    >
                        Mock Interviews
                    </a>
                </li>
                <li>
                    <a 
                      href="/projects" 
                      onClick={(e) => handleNavigation(e, 'projects')}
                      className="text-sm text-white/85 hover:text-white transition-all duration-300 hover:translate-x-1 inline-block cursor-pointer"
                    >
                        Projects
                    </a>
                </li>
                <li>
                    <a 
                      href="/community" 
                      onClick={(e) => handleNavigation(e, 'community')}
                      className="text-sm text-white/85 hover:text-white transition-all duration-300 hover:translate-x-1 inline-block cursor-pointer"
                    >
                        Community
                    </a>
                </li>
             </ul>
          </div>
        </div>

        {/* Divider */}
        <div className="w-full h-px bg-white opacity-20 my-8"></div>

        {/* Bottom Row */}
        <div className="flex justify-start">
          <p className="text-[13px] opacity-60">
            &copy; 2026 Pathfinder. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};