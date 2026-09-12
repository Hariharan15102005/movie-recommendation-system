import React, { useState, useEffect } from 'react';
import { X, Star, Calendar, Clock, DollarSign, User, Users, Tag, ExternalLink } from 'lucide-react';

const API_BASE = 'http://127.0.0.1:8000';

export default function MovieModal({ movieTitle, onClose, onRecommend }) {
  const [details, setDetails] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (movieTitle) {
      setLoading(true);
      fetch(`${API_BASE}/api/movie/${encodeURIComponent(movieTitle)}`)
        .then((r) => {
          if (!r.ok) throw new Error('Failed to load movie details');
          return r.json();
        })
        .then((data) => {
          setDetails(data);
          setLoading(false);
        })
        .catch((err) => {
          console.error(err);
          setLoading(false);
        });
    }
  }, [movieTitle]);

  if (!movieTitle) return null;

  const formatCurrency = (val) => {
    if (!val || val === 0) return 'Not Disclosed';
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(val);
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'rgba(0, 0, 0, 0.85)',
      backdropFilter: 'blur(12px)',
      zIndex: 1000,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '24px'
    }}>
      <div className="glass-card" style={{
        maxWidth: '720px',
        width: '100%',
        maxHeight: '90vh',
        overflowY: 'auto',
        padding: '32px',
        position: 'relative',
        background: '#0d1322',
        border: '1px solid rgba(99, 102, 241, 0.4)'
      }}>
        {/* Close Button */}
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '20px',
            right: '20px',
            background: 'rgba(255, 255, 255, 0.08)',
            border: 'none',
            color: '#fff',
            width: '36px',
            height: '36px',
            borderRadius: '50%',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          <X size={18} />
        </button>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '60px' }}>
            <p style={{ color: 'var(--text-muted)' }}>Loading movie specifications...</p>
          </div>
        ) : details ? (
          <div>
            {/* Header */}
            <div style={{ marginBottom: '16px' }}>
              <div style={{ display: 'flex', gap: '8px', marginBottom: '8px' }}>
                {details.genres_list?.map((g) => (
                  <span key={g} className="badge badge-cyan">{g}</span>
                ))}
              </div>
              <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '2rem', fontWeight: 800 }}>
                {details.title}
              </h2>
              {details.tagline && (
                <p style={{ color: '#818cf8', fontStyle: 'italic', fontSize: '0.92rem', marginTop: '4px' }}>
                  "{details.tagline}"
                </p>
              )}
            </div>

            {/* Meta badges */}
            <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', padding: '12px 0', borderBottom: '1px solid rgba(255, 255, 255, 0.08)', marginBottom: '20px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#fbbf24', fontWeight: 700 }}>
                <Star size={16} fill="#fbbf24" />
                <span>{details.vote_average?.toFixed(1)} / 10 ({details.vote_count} votes)</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--text-muted)', fontSize: '0.88rem' }}>
                <Calendar size={16} />
                <span>{details.release_date || 'N/A'}</span>
              </div>
              {details.runtime > 0 && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--text-muted)', fontSize: '0.88rem' }}>
                  <Clock size={16} />
                  <span>{Math.floor(details.runtime)} mins</span>
                </div>
              )}
            </div>

            {/* Overview */}
            <div style={{ marginBottom: '24px' }}>
              <h4 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '8px', color: '#cbd5e1' }}>Storyline Overview</h4>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.92rem', lineHeight: 1.6 }}>
                {details.overview || 'No synopsis available.'}
              </p>
            </div>

            {/* Cast & Crew */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '24px' }}>
              <div style={{ background: 'rgba(255, 255, 255, 0.03)', padding: '16px', borderRadius: 'var(--radius-md)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.82rem', color: 'var(--text-dim)', marginBottom: '6px' }}>
                  <User size={14} /> Director
                </div>
                <div style={{ fontWeight: 600 }}>{details.director}</div>
              </div>
              <div style={{ background: 'rgba(255, 255, 255, 0.03)', padding: '16px', borderRadius: 'var(--radius-md)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.82rem', color: 'var(--text-dim)', marginBottom: '6px' }}>
                  <Users size={14} /> Lead Cast
                </div>
                <div style={{ fontWeight: 600 }}>{details.cast_list?.slice(0, 3).join(', ') || 'N/A'}</div>
              </div>
            </div>

            {/* Financials */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '28px' }}>
              <div style={{ background: 'rgba(255, 255, 255, 0.03)', padding: '16px', borderRadius: 'var(--radius-md)' }}>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-dim)', marginBottom: '4px' }}>Production Budget</div>
                <div style={{ fontWeight: 700, color: '#f8fafc' }}>{formatCurrency(details.budget)}</div>
              </div>
              <div style={{ background: 'rgba(255, 255, 255, 0.03)', padding: '16px', borderRadius: 'var(--radius-md)' }}>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-dim)', marginBottom: '4px' }}>Worldwide Gross</div>
                <div style={{ fontWeight: 700, color: '#38bdf8' }}>{formatCurrency(details.revenue)}</div>
              </div>
            </div>

            {/* Actions */}
            <div style={{ display: 'flex', gap: '12px' }}>
              <button
                className="btn-primary"
                onClick={() => {
                  onClose();
                  onRecommend(details.title);
                }}
                style={{ flex: 1, justifyContent: 'center' }}
              >
                <span>Find Similar Movies</span>
              </button>
              <a
                href={`https://www.youtube.com/results?search_query=${encodeURIComponent(details.title + ' official trailer')}`}
                target="_blank"
                rel="noreferrer"
                className="btn-secondary"
                style={{ textDecoration: 'none' }}
              >
                <ExternalLink size={16} />
                <span>Watch Trailer</span>
              </a>
            </div>
          </div>
        ) : (
          <p>Movie details not found.</p>
        )}
      </div>
    </div>
  );
}
