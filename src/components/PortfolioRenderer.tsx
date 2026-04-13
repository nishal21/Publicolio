import React, { useEffect, useState } from 'react';
import { fetchDeveloperData } from '../services/api';
import type { DeveloperProfile } from '../types';
import type { ThemeOptions } from './themes';
import { THEMES } from './LandingBuilder';
import { Loader2 } from 'lucide-react';

interface PortfolioRendererProps {
  username: string;
  theme: string;
  repos: string[];
  options?: ThemeOptions;
}

export const PortfolioRenderer: React.FC<PortfolioRendererProps> = ({ username, theme, repos, options }) => {
  const [profile, setProfile] = useState<DeveloperProfile | null>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadData = async () => {
      try {
        const data = await fetchDeveloperData(username);
        
        // Filter the projects based on the repos specified in the URL params
        const selectedReposSet = new Set(repos);
        const filteredProjects = selectedReposSet.size > 0 
          ? data.projects.filter(p => selectedReposSet.has(p.name))
          : data.projects;

        setProfile({ ...data, projects: filteredProjects });
      } catch (err) {
        setError('Failed to load portfolio data.');
      }
    };

    if (username) {
      loadData();
    }
  }, [username, repos]);

  if (error) {
    return (
      <div className="min-h-screen bg-[#050505] text-white flex items-center justify-center font-sans">
        <div className="text-center space-y-4">
          <p className="text-red-400 font-bold tracking-widest uppercase">{error}</p>
          <p className="text-sm text-zinc-500">Please check the URL parameters.</p>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-[#050505] text-white flex items-center justify-center font-sans">
         <Loader2 className="w-10 h-10 animate-spin text-blue-500" />
      </div>
    );
  }

  // Fallback to bento if theme not found
  const ActiveTheme = THEMES[theme as keyof typeof THEMES]?.Component || THEMES['aurora'].Component;

  return <ActiveTheme profile={profile} options={options} />;
};
