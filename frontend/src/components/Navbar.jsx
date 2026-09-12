import React from 'react';
import { Film, Sparkles, TrendingUp, BarChart2, Clapperboard } from 'lucide-react';

export default function Navbar({ activeTab, setActiveTab }) {
  const tabs = [
    { id: 'recommender', label: 'AI Recommender', icon: Sparkles },
    { id: 'predictor', label: 'Box Office Predictor', icon: TrendingUp },
    { id: 'explore', label: 'Top Movies & Leaderboard', icon: Clapperboard },
    { id: 'analytics', label: 'Dataset Insights', icon: BarChart2 },
  ];

  return (
    <header style={{
      position: 'sticky',
      top: 0,
      zIndex: 100,
      backdropFilter: 'blur(20px)',
      WebkitBackdropFilter: 'blur(20px)',
      background: 'rgba(7, 9, 19, 0.85)',
      borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
      padding: '16px 24px'
    }}>
      <div style={{
        maxWidth: '1280px',
        margin: '0 auto',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '16px'
      }}>
        {/* Brand Logo */}
        <div 
          onClick={() => setActiveTab('recommender')}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            cursor: 'pointer'
          }}
        >
          <div style={{
            background: 'linear-gradient(135deg, #6366f1 0%, #06b6d4 100%)',
            width: '42px',
            height: '42px',
            borderRadius: '12px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 0 20px rgba(99, 102, 241, 0.5)'
          }}>
            <Film color="#fff" size={22} />
          </div>
          <div>
            <h1 style={{
              fontFamily: 'var(--font-heading)',
              fontSize: '1.35rem',
              fontWeight: 800,
              letterSpacing: '-0.5px',
              lineHeight: 1.1
            }}>
              Cine<span style={{ color: '#06b6d4' }}>Predict</span> <span style={{ fontSize: '0.75rem', background: '#6366f1', padding: '2px 6px', borderRadius: '4px', verticalAlign: 'middle' }}>AI</span>
            </h1>
            <p style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>TMDB 5000 Intelligence Engine</p>
          </div>
        </div>

        {/* Navigation Tabs */}
        <nav style={{
          display: 'flex',
          gap: '8px',
          background: 'rgba(255, 255, 255, 0.04)',
          padding: '6px',
          borderRadius: '16px',
          border: '1px solid rgba(255, 255, 255, 0.06)'
        }}>
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '8px 16px',
                  borderRadius: '10px',
                  border: 'none',
                  background: isActive ? 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)' : 'transparent',
                  color: isActive ? '#ffffff' : 'var(--text-muted)',
                  fontWeight: isActive ? 600 : 500,
                  fontSize: '0.88rem',
                  fontFamily: 'var(--font-heading)',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  boxShadow: isActive ? '0 4px 15px rgba(99, 102, 241, 0.4)' : 'none'
                }}
              >
                <Icon size={16} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
