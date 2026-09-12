import React from 'react';
import { Sparkles, TrendingUp, Film, CheckCircle2 } from 'lucide-react';

export default function HeroSection({ onExploreClick, onPredictClick }) {
  return (
    <div style={{
      position: 'relative',
      padding: '60px 24px 40px',
      maxWidth: '1280px',
      margin: '0 auto',
      textAlign: 'center'
    }}>
      {/* Top pill badge */}
      <div style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '8px',
        background: 'rgba(99, 102, 241, 0.12)',
        border: '1px solid rgba(99, 102, 241, 0.3)',
        padding: '6px 16px',
        borderRadius: '9999px',
        marginBottom: '20px',
        animation: 'fadeIn 0.6s ease'
      }}>
        <Sparkles size={14} color="#818cf8" />
        <span style={{ fontSize: '0.82rem', fontWeight: 600, color: '#a5b4fc', letterSpacing: '0.5px' }}>
          POWERED BY NLP COSINE SIMILARITY & RANDOM FOREST ML
        </span>
      </div>

      {/* Main Headline */}
      <h2 style={{
        fontFamily: 'var(--font-heading)',
        fontSize: 'clamp(2.2rem, 5vw, 3.8rem)',
        fontWeight: 900,
        lineHeight: 1.15,
        letterSpacing: '-1.5px',
        marginBottom: '18px'
      }}>
        Discover Movies You'll Love. <br />
        <span className="gradient-accent-text">Predict Box Office Blockbusters.</span>
      </h2>

      <p style={{
        color: 'var(--text-muted)',
        fontSize: 'clamp(1rem, 2vw, 1.18rem)',
        maxWidth: '720px',
        margin: '0 auto 32px',
        lineHeight: 1.6
      }}>
        Explore intelligent content-based movie recommendations from 4,800+ films, or simulate theatrical box office earnings using machine learning regression.
      </p>

      {/* Action Buttons */}
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        gap: '16px',
        flexWrap: 'wrap',
        marginBottom: '40px'
      }}>
        <button 
          className="btn-primary" 
          onClick={onExploreClick}
          style={{ padding: '14px 28px', fontSize: '1rem' }}
        >
          <Sparkles size={18} />
          <span>Search & Recommend Movies</span>
        </button>
        <button 
          className="btn-secondary" 
          onClick={onPredictClick}
          style={{ padding: '14px 28px', fontSize: '1rem' }}
        >
          <TrendingUp size={18} color="#06b6d4" />
          <span>Launch Box Office Simulator</span>
        </button>
      </div>

      {/* Highlights Bar */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '16px',
        maxWidth: '900px',
        margin: '0 auto',
        padding: '16px',
        background: 'rgba(255, 255, 255, 0.02)',
        borderRadius: 'var(--radius-lg)',
        border: '1px solid rgba(255, 255, 255, 0.05)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', justifyContent: 'center' }}>
          <CheckCircle2 size={18} color="#10b981" />
          <span style={{ fontSize: '0.88rem', color: 'var(--text-muted)' }}>4,800+ TMDB Movies</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', justifyContent: 'center' }}>
          <CheckCircle2 size={18} color="#10b981" />
          <span style={{ fontSize: '0.88rem', color: 'var(--text-muted)' }}>5,000-D NLP Vector Engine</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', justifyContent: 'center' }}>
          <CheckCircle2 size={18} color="#10b981" />
          <span style={{ fontSize: '0.88rem', color: 'var(--text-muted)' }}>Instant Similarity Scoring</span>
        </div>
      </div>
    </div>
  );
}
