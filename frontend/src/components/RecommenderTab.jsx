import React, { useState, useEffect, useRef } from 'react';
import { Search, Sparkles, Star, Calendar, User, Film, Clock, ArrowRight, Info } from 'lucide-react';

const API_BASE = 'http://127.0.0.1:8000';

export default function RecommenderTab({ onSelectMovie }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [selectedMovieTitle, setSelectedMovieTitle] = useState('Avatar');
  const [loading, setLoading] = useState(false);
  const [searchedMovie, setSearchedMovie] = useState(null);
  const [recommendations, setRecommendations] = useState([]);
  const [error, setError] = useState(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const dropdownRef = useRef(null);

  // Quick preset chips
  const popularChips = ['Avatar', 'The Dark Knight', 'The Avengers', 'Interstellar', 'Titanic', 'Inception', 'Spider-Man 3'];

  // Fetch suggestions when user types
  useEffect(() => {
    if (searchTerm.trim().length > 1) {
      const delayDebounce = setTimeout(() => {
        fetch(`${API_BASE}/api/movies?query=${encodeURIComponent(searchTerm.trim())}&limit=8`)
          .then((res) => res.json())
          .then((data) => {
            setSuggestions(data.movies || []);
            setIsDropdownOpen(true);
          })
          .catch((err) => console.error(err));
      }, 250);

      return () => clearTimeout(delayDebounce);
    } else {
      setSuggestions([]);
      setIsDropdownOpen(false);
    }
  }, [searchTerm]);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Fetch recommendations
  const getRecommendations = (title) => {
    if (!title) return;
    setLoading(true);
    setError(null);
    setSelectedMovieTitle(title);
    setIsDropdownOpen(false);

    fetch(`${API_BASE}/api/recommend`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title: title, top_n: 6 }),
    })
      .then((res) => {
        if (!res.ok) throw new Error('Movie not found or similarity computation error');
        return res.json();
      })
      .then((data) => {
        setSearchedMovie(data.searched_movie);
        setRecommendations(data.recommendations || []);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  };

  // Initial load recommendation
  useEffect(() => {
    getRecommendations('Avatar');
  }, []);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      getRecommendations(searchTerm.trim());
    }
  };

  return (
    <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 24px 60px' }}>
      {/* Search Header Container */}
      <div className="glass-card" style={{ padding: '32px', marginBottom: '36px' }}>
        <div style={{ textAlign: 'center', maxWidth: '680px', margin: '0 auto 24px' }}>
          <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.65rem', fontWeight: 800, marginBottom: '8px' }}>
            Find Similar Blockbusters & Hidden Gems
          </h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.92rem' }}>
            Type any movie title to generate high-accuracy content similarity recommendations based on cast, genres, director, and storyline.
          </p>
        </div>

        {/* Search Bar */}
        <div ref={dropdownRef} style={{ position: 'relative', maxWidth: '640px', margin: '0 auto 20px' }}>
          <form onSubmit={handleSearchSubmit} style={{ display: 'flex', gap: '10px' }}>
            <div style={{
              flex: 1,
              position: 'relative',
              display: 'flex',
              alignItems: 'center'
            }}>
              <Search size={18} color="var(--text-muted)" style={{ position: 'absolute', left: '16px' }} />
              <input
                type="text"
                placeholder="Search 4,800+ movies (e.g., The Dark Knight, Avatar, Interstellar)..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onFocus={() => suggestions.length > 0 && setIsDropdownOpen(true)}
                style={{
                  width: '100%',
                  padding: '14px 16px 14px 44px',
                  background: 'rgba(255, 255, 255, 0.06)',
                  border: '1px solid rgba(255, 255, 255, 0.15)',
                  borderRadius: 'var(--radius-md)',
                  color: '#fff',
                  fontSize: '0.95rem',
                  outline: 'none',
                  fontFamily: 'var(--font-body)',
                  transition: 'border-color 0.2s'
                }}
              />
            </div>
            <button type="submit" className="btn-primary" disabled={loading}>
              <Sparkles size={16} />
              <span>{loading ? 'Analyzing...' : 'Recommend'}</span>
            </button>
          </form>

          {/* Autocomplete Dropdown */}
          {isDropdownOpen && suggestions.length > 0 && (
            <div style={{
              position: 'absolute',
              top: 'calc(100% + 8px)',
              left: 0,
              right: 0,
              background: '#0d1322',
              border: '1px solid rgba(99, 102, 241, 0.3)',
              borderRadius: 'var(--radius-md)',
              boxShadow: '0 15px 35px rgba(0, 0, 0, 0.8)',
              zIndex: 50,
              overflow: 'hidden',
              maxHeight: '320px',
              overflowY: 'auto'
            }}>
              {suggestions.map((m) => (
                <div
                  key={m.movie_id}
                  onClick={() => {
                    setSearchTerm(m.title);
                    getRecommendations(m.title);
                  }}
                  style={{
                    padding: '12px 18px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    cursor: 'pointer',
                    borderBottom: '1px solid rgba(255, 255, 255, 0.04)',
                    transition: 'background 0.15s ease'
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(99, 102, 241, 0.15)')}
                  onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
                >
                  <div>
                    <div style={{ fontWeight: 600, fontSize: '0.92rem', color: '#fff' }}>{m.title}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                      {m.release_date ? m.release_date.split('-')[0] : 'N/A'} • {m.genres_list ? m.genres_list.slice(0, 2).join(', ') : ''}
                    </div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#fbbf24', fontSize: '0.82rem' }}>
                    <Star size={13} fill="#fbbf24" />
                    <span>{m.vote_average ? m.vote_average.toFixed(1) : 'N/A'}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Popular Quick-Select Chips */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', flexWrap: 'wrap' }}>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-dim)', fontWeight: 600 }}>TRENDING:</span>
          {popularChips.map((chip) => (
            <button
              key={chip}
              onClick={() => {
                setSearchTerm(chip);
                getRecommendations(chip);
              }}
              style={{
                background: selectedMovieTitle.toLowerCase() === chip.toLowerCase() ? 'rgba(99, 102, 241, 0.25)' : 'rgba(255, 255, 255, 0.04)',
                border: selectedMovieTitle.toLowerCase() === chip.toLowerCase() ? '1px solid #6366f1' : '1px solid rgba(255, 255, 255, 0.08)',
                color: selectedMovieTitle.toLowerCase() === chip.toLowerCase() ? '#818cf8' : 'var(--text-muted)',
                borderRadius: '9999px',
                padding: '4px 12px',
                fontSize: '0.78rem',
                cursor: 'pointer',
                fontFamily: 'var(--font-heading)',
                transition: 'all 0.2s ease'
              }}
            >
              {chip}
            </button>
          ))}
        </div>
      </div>

      {/* Error Banner */}
      {error && (
        <div style={{
          background: 'rgba(239, 68, 68, 0.15)',
          border: '1px solid rgba(239, 68, 68, 0.3)',
          padding: '16px',
          borderRadius: 'var(--radius-md)',
          color: '#fca5a5',
          marginBottom: '24px',
          textAlign: 'center'
        }}>
          ⚠️ {error}. Try searching another title like "The Dark Knight" or "Interstellar".
        </div>
      )}

      {/* Searched Movie Context Card */}
      {searchedMovie && (
        <div className="glass-card" style={{
          padding: '24px',
          marginBottom: '32px',
          background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.1) 0%, rgba(6, 182, 212, 0.05) 100%)',
          border: '1px solid rgba(99, 102, 241, 0.3)'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px' }}>
            <div style={{ flex: '1 1 500px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
                <span className="badge badge-purple">SOURCE MOVIE</span>
                <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                  {searchedMovie.release_date ? searchedMovie.release_date.split('-')[0] : ''}
                </span>
              </div>
              <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.8rem', fontWeight: 800, marginBottom: '10px' }}>
                {searchedMovie.title}
              </h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: 1.6, marginBottom: '14px' }}>
                {searchedMovie.overview}
              </p>
              <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                {searchedMovie.genres?.map((g) => (
                  <span key={g} className="badge badge-cyan">{g}</span>
                ))}
              </div>
            </div>

            <div style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '8px',
              background: 'rgba(0, 0, 0, 0.3)',
              padding: '16px 20px',
              borderRadius: 'var(--radius-md)',
              border: '1px solid rgba(255, 255, 255, 0.06)'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Star size={16} color="#fbbf24" fill="#fbbf24" />
                <span style={{ fontWeight: 700, fontSize: '1.1rem' }}>{searchedMovie.vote_average?.toFixed(1)}</span>
                <span style={{ color: 'var(--text-dim)', fontSize: '0.78rem' }}>/10</span>
              </div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                <strong>Director:</strong> {searchedMovie.director}
              </div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                <strong>Top Cast:</strong> {searchedMovie.cast?.slice(0, 3).join(', ')}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Recommendations Grid */}
      <div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
          <h4 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.3rem', fontWeight: 700 }}>
            Top Recommended Matches for You
          </h4>
          <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
            Showing top {recommendations.length} cosine similarity matches
          </span>
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '60px' }}>
            <div style={{ display: 'inline-block', width: '40px', height: '40px', border: '3px solid rgba(99,102,241,0.2)', borderTopColor: '#6366f1', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
            <p style={{ marginTop: '16px', color: 'var(--text-muted)' }}>Computing high-dimensional vectors...</p>
          </div>
        ) : (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(360px, 1fr))',
            gap: '24px'
          }}>
            {recommendations.map((movie, idx) => (
              <div
                key={movie.movie_id}
                className="glass-card"
                style={{
                  padding: '22px',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  position: 'relative',
                  overflow: 'hidden'
                }}
              >
                {/* Top Match Score Badge */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                  <span className="badge badge-green" style={{ fontSize: '0.8rem' }}>
                    <Sparkles size={12} /> {movie.similarity_score}% MATCH
                  </span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#fbbf24', fontSize: '0.85rem', fontWeight: 600 }}>
                    <Star size={14} fill="#fbbf24" />
                    <span>{movie.vote_average ? movie.vote_average.toFixed(1) : 'N/A'}</span>
                  </div>
                </div>

                {/* Movie Title & Year */}
                <div style={{ marginBottom: '12px' }}>
                  <h5 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.2rem', fontWeight: 700, lineHeight: 1.3, marginBottom: '6px' }}>
                    {movie.title}
                  </h5>
                  <div style={{ display: 'flex', gap: '10px', fontSize: '0.78rem', color: 'var(--text-dim)', flexWrap: 'wrap' }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <Calendar size={12} /> {movie.release_date ? movie.release_date.split('-')[0] : 'N/A'}
                    </span>
                    {movie.runtime > 0 && (
                      <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <Clock size={12} /> {Math.floor(movie.runtime)} min
                      </span>
                    )}
                    <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <User size={12} /> {movie.director}
                    </span>
                  </div>
                </div>

                {/* Overview Synopsis */}
                <p style={{
                  color: 'var(--text-muted)',
                  fontSize: '0.84rem',
                  lineHeight: 1.5,
                  marginBottom: '16px',
                  display: '-webkit-box',
                  WebkitLineClamp: 3,
                  WebkitBoxOrient: 'vertical',
                  overflow: 'hidden'
                }}>
                  {movie.overview}
                </p>

                {/* Genre Tags */}
                <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginBottom: '18px' }}>
                  {movie.genres?.slice(0, 3).map((g) => (
                    <span key={g} className="badge badge-cyan" style={{ fontSize: '0.7rem' }}>{g}</span>
                  ))}
                </div>

                {/* Action Buttons */}
                <div style={{ display: 'flex', gap: '10px', marginTop: 'auto', paddingTop: '12px', borderTop: '1px solid rgba(255, 255, 255, 0.06)' }}>
                  <button
                    className="btn-secondary"
                    onClick={() => onSelectMovie && onSelectMovie(movie.title)}
                    style={{ flex: 1, padding: '8px 12px', fontSize: '0.82rem', justifyContent: 'center' }}
                  >
                    <Info size={14} />
                    <span>View Details</span>
                  </button>
                  <button
                    className="btn-primary"
                    onClick={() => {
                      setSearchTerm(movie.title);
                      getRecommendations(movie.title);
                    }}
                    style={{ padding: '8px 14px', fontSize: '0.82rem' }}
                    title="Recommend movies similar to this one"
                  >
                    <span>More like this</span>
                    <ArrowRight size={14} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
