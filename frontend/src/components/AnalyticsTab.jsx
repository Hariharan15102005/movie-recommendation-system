import React, { useState, useEffect } from 'react';
import { Award, Film, DollarSign, TrendingUp, BarChart, Layers } from 'lucide-react';

const API_BASE = 'http://127.0.0.1:8000';

export default function AnalyticsTab() {
  const [topData, setTopData] = useState(null);
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch(`${API_BASE}/api/top_movies`).then((r) => r.json()),
      fetch(`${API_BASE}/api/analytics`).then((r) => r.json()),
    ])
      .then(([topRes, analyticsRes]) => {
        setTopData(topRes);
        setAnalytics(analyticsRes);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  const formatCurrency = (val) => {
    if (!val) return '$0';
    if (val >= 1_000_000_000) return `$${(val / 1_000_000_000).toFixed(2)}B`;
    if (val >= 1_000_000) return `$${(val / 1_000_000).toFixed(1)}M`;
    return `$${val.toLocaleString()}`;
  };

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '100px' }}>
        <p style={{ color: 'var(--text-muted)' }}>Loading dataset analytics...</p>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 24px 60px' }}>
      {/* Top Stat Counters */}
      {analytics && (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
          gap: '20px',
          marginBottom: '40px'
        }}>
          <div className="glass-card" style={{ padding: '24px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
              <div style={{ background: 'rgba(99, 102, 241, 0.15)', padding: '10px', borderRadius: '12px' }}>
                <Film size={22} color="#818cf8" />
              </div>
              <div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Total Movies</div>
                <div style={{ fontFamily: 'var(--font-heading)', fontSize: '1.6rem', fontWeight: 800 }}>
                  {analytics.total_movies?.toLocaleString()}
                </div>
              </div>
            </div>
          </div>

          <div className="glass-card" style={{ padding: '24px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
              <div style={{ background: 'rgba(6, 182, 212, 0.15)', padding: '10px', borderRadius: '12px' }}>
                <DollarSign size={22} color="#22d3ee" />
              </div>
              <div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Avg Production Budget</div>
                <div style={{ fontFamily: 'var(--font-heading)', fontSize: '1.6rem', fontWeight: 800 }}>
                  {formatCurrency(analytics.avg_budget)}
                </div>
              </div>
            </div>
          </div>

          <div className="glass-card" style={{ padding: '24px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
              <div style={{ background: 'rgba(16, 185, 129, 0.15)', padding: '10px', borderRadius: '12px' }}>
                <TrendingUp size={22} color="#34d399" />
              </div>
              <div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Avg Worldwide Gross</div>
                <div style={{ fontFamily: 'var(--font-heading)', fontSize: '1.6rem', fontWeight: 800 }}>
                  {formatCurrency(analytics.avg_revenue)}
                </div>
              </div>
            </div>
          </div>

          <div className="glass-card" style={{ padding: '24px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
              <div style={{ background: 'rgba(245, 158, 11, 0.15)', padding: '10px', borderRadius: '12px' }}>
                <Award size={22} color="#fbbf24" />
              </div>
              <div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Avg Rating</div>
                <div style={{ fontFamily: 'var(--font-heading)', fontSize: '1.6rem', fontWeight: 800 }}>
                  ★ {analytics.avg_rating} / 10
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Leaderboard Table: Highest Grossing Movies */}
      <div className="glass-card" style={{ padding: '32px', marginBottom: '40px' }}>
        <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.4rem', fontWeight: 800, marginBottom: '20px' }}>
          🏆 All-Time Highest Grossing Blockbusters (TMDB 5000)
        </h3>

        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.9rem' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.1)', color: 'var(--text-dim)' }}>
                <th style={{ padding: '12px 16px' }}>#</th>
                <th style={{ padding: '12px 16px' }}>Movie Title</th>
                <th style={{ padding: '12px 16px' }}>Release</th>
                <th style={{ padding: '12px 16px' }}>Budget</th>
                <th style={{ padding: '12px 16px' }}>Worldwide Revenue</th>
                <th style={{ padding: '12px 16px' }}>Profitability (ROI)</th>
                <th style={{ padding: '12px 16px' }}>Rating</th>
              </tr>
            </thead>
            <tbody>
              {topData?.highest_grossing?.map((m, idx) => {
                const profit = m.revenue - m.budget;
                const roi = m.budget > 0 ? ((profit / m.budget) * 100).toFixed(0) : 'N/A';
                return (
                  <tr
                    key={m.movie_id}
                    style={{
                      borderBottom: '1px solid rgba(255, 255, 255, 0.04)',
                      transition: 'background 0.2s'
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(255, 255, 255, 0.02)')}
                    onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
                  >
                    <td style={{ padding: '16px', fontWeight: 700, color: idx === 0 ? '#fbbf24' : 'var(--text-dim)' }}>
                      #{idx + 1}
                    </td>
                    <td style={{ padding: '16px', fontWeight: 600, color: '#fff' }}>
                      {m.title}
                    </td>
                    <td style={{ padding: '16px', color: 'var(--text-muted)' }}>
                      {m.release_date?.split('-')[0]}
                    </td>
                    <td style={{ padding: '16px', color: 'var(--text-muted)' }}>
                      {formatCurrency(m.budget)}
                    </td>
                    <td style={{ padding: '16px', fontWeight: 700, color: '#38bdf8' }}>
                      {formatCurrency(m.revenue)}
                    </td>
                    <td style={{ padding: '16px', color: '#34d399', fontWeight: 600 }}>
                      +{roi}%
                    </td>
                    <td style={{ padding: '16px', color: '#fbbf24' }}>
                      ★ {m.vote_average?.toFixed(1)}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Genre Distribution Bars */}
      {analytics?.top_genres && (
        <div className="glass-card" style={{ padding: '32px' }}>
          <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.4rem', fontWeight: 800, marginBottom: '20px' }}>
            📊 Top Dominant Movie Genres in Dataset
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {Object.entries(analytics.top_genres).map(([genre, count]) => {
              const maxCount = Math.max(...Object.values(analytics.top_genres));
              const percent = (count / maxCount) * 100;
              return (
                <div key={genre}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '6px' }}>
                    <span style={{ fontWeight: 600 }}>{genre}</span>
                    <span style={{ color: 'var(--text-muted)' }}>{count} movies</span>
                  </div>
                  <div style={{ background: 'rgba(255, 255, 255, 0.05)', height: '10px', borderRadius: '9999px', overflow: 'hidden' }}>
                    <div style={{
                      width: `${percent}%`,
                      height: '100%',
                      background: 'linear-gradient(90deg, #6366f1 0%, #06b6d4 100%)',
                      borderRadius: '9999px',
                      transition: 'width 0.8s ease'
                    }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
