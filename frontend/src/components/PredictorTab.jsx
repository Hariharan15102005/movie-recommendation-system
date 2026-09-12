import React, { useState } from 'react';
import { DollarSign, TrendingUp, Award, Zap, Sliders, AlertCircle, RefreshCw } from 'lucide-react';
import confetti from 'canvas-confetti';

const API_BASE = 'http://127.0.0.1:8000';

export default function PredictorTab() {
  const [budgetMillion, setBudgetMillion] = useState(150);
  const [popularity, setPopularity] = useState(85);
  const [runtime, setRuntime] = useState(135);
  const [voteAverage, setVoteAverage] = useState(7.6);
  const [voteCount, setVoteCount] = useState(4500);

  const [loading, setLoading] = useState(false);
  const [prediction, setPrediction] = useState({
    predicted_revenue: 680450000,
    predicted_profit: 530450000,
    roi_percentage: 353.6,
    verdict: "All-Time Blockbuster 🚀",
    verdict_color: "#10b981"
  });

  const runPrediction = () => {
    setLoading(true);
    const budgetRaw = budgetMillion * 1_000_000;

    fetch(`${API_BASE}/api/predict_revenue`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        budget: budgetRaw,
        popularity: parseFloat(popularity),
        runtime: parseFloat(runtime),
        vote_average: parseFloat(voteAverage),
        vote_count: parseFloat(voteCount),
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        setPrediction(data);
        setLoading(false);
        if (data.verdict.includes('Blockbuster')) {
          confetti({
            particleCount: 80,
            spread: 70,
            origin: { y: 0.6 }
          });
        }
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  };

  const setPreset = (type) => {
    if (type === 'marvel') {
      setBudgetMillion(220);
      setPopularity(140);
      setRuntime(145);
      setVoteAverage(8.1);
      setVoteCount(9500);
    } else if (type === 'indie') {
      setBudgetMillion(15);
      setPopularity(35);
      setRuntime(105);
      setVoteAverage(7.8);
      setVoteCount(1200);
    } else if (type === 'horror') {
      setBudgetMillion(20);
      setPopularity(65);
      setRuntime(95);
      setVoteAverage(6.5);
      setVoteCount(3200);
    }
  };

  const formatCurrency = (val) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(val);
  };

  return (
    <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 24px 60px' }}>
      {/* Title & Introduction */}
      <div style={{ textAlign: 'center', maxWidth: '750px', margin: '0 auto 36px' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: 'rgba(6, 182, 212, 0.12)', border: '1px solid rgba(6, 182, 212, 0.3)', padding: '6px 16px', borderRadius: '9999px', marginBottom: '16px' }}>
          <Zap size={14} color="#22d3ee" />
          <span style={{ fontSize: '0.82rem', fontWeight: 600, color: '#22d3ee' }}>ML RANDOM FOREST REGRESSOR</span>
        </div>
        <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '2.2rem', fontWeight: 800, marginBottom: '10px' }}>
          Theatrical Box Office & Revenue Simulator
        </h3>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.96rem' }}>
          Adjust production variables to simulate world-wide box office gross earnings, estimated studio profit, and theatrical financial return.
        </p>

        {/* Quick Presets */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: '10px', marginTop: '16px' }}>
          <button className="btn-secondary" onClick={() => setPreset('marvel')} style={{ padding: '6px 14px', fontSize: '0.82rem' }}>
            🎬 High-Budget Blockbuster
          </button>
          <button className="btn-secondary" onClick={() => setPreset('horror')} style={{ padding: '6px 14px', fontSize: '0.82rem' }}>
            👻 Mid-Budget Thriller
          </button>
          <button className="btn-secondary" onClick={() => setPreset('indie')} style={{ padding: '6px 14px', fontSize: '0.82rem' }}>
            🏆 Indie Oscar Contender
          </button>
        </div>
      </div>

      {/* Simulator Layout */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))',
        gap: '32px',
        alignItems: 'stretch'
      }}>
        {/* Left Column: Interactive Controls */}
        <div className="glass-card" style={{ padding: '32px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '24px' }}>
            <Sliders size={20} color="#818cf8" />
            <h4 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.25rem', fontWeight: 700 }}>
              Movie Production Parameters
            </h4>
          </div>

          {/* Slider 1: Budget */}
          <div style={{ marginBottom: '24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
              <label style={{ fontSize: '0.88rem', fontWeight: 600, color: 'var(--text-main)' }}>
                Production Budget ($M)
              </label>
              <span style={{ fontWeight: 700, color: '#818cf8', fontFamily: 'var(--font-heading)' }}>
                ${budgetMillion} Million
              </span>
            </div>
            <input
              type="range"
              min="1"
              max="400"
              step="1"
              value={budgetMillion}
              onChange={(e) => setBudgetMillion(Number(e.target.value))}
              style={{ width: '100%', accentColor: '#6366f1', cursor: 'pointer' }}
            />
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.72rem', color: 'var(--text-dim)', marginTop: '4px' }}>
              <span>$1M (Micro budget)</span>
              <span>$400M (Mega tentpole)</span>
            </div>
          </div>

          {/* Slider 2: Popularity Index */}
          <div style={{ marginBottom: '24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
              <label style={{ fontSize: '0.88rem', fontWeight: 600, color: 'var(--text-main)' }}>
                Target Popularity / Buzz Index
              </label>
              <span style={{ fontWeight: 700, color: '#22d3ee', fontFamily: 'var(--font-heading)' }}>
                {popularity}
              </span>
            </div>
            <input
              type="range"
              min="5"
              max="300"
              step="5"
              value={popularity}
              onChange={(e) => setPopularity(Number(e.target.value))}
              style={{ width: '100%', accentColor: '#06b6d4', cursor: 'pointer' }}
            />
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.72rem', color: 'var(--text-dim)', marginTop: '4px' }}>
              <span>Low Buzz (5)</span>
              <span>Viral Sensation (300)</span>
            </div>
          </div>

          {/* Slider 3: Runtime */}
          <div style={{ marginBottom: '24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
              <label style={{ fontSize: '0.88rem', fontWeight: 600, color: 'var(--text-main)' }}>
                Film Runtime (Minutes)
              </label>
              <span style={{ fontWeight: 700, color: '#c084fc', fontFamily: 'var(--font-heading)' }}>
                {runtime} mins
              </span>
            </div>
            <input
              type="range"
              min="60"
              max="240"
              step="5"
              value={runtime}
              onChange={(e) => setRuntime(Number(e.target.value))}
              style={{ width: '100%', accentColor: '#a855f7', cursor: 'pointer' }}
            />
          </div>

          {/* Slider 4: Expected Rating */}
          <div style={{ marginBottom: '24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
              <label style={{ fontSize: '0.88rem', fontWeight: 600, color: 'var(--text-main)' }}>
                Expected Audience Rating (1 - 10)
              </label>
              <span style={{ fontWeight: 700, color: '#fbbf24', fontFamily: 'var(--font-heading)' }}>
                ★ {voteAverage} / 10
              </span>
            </div>
            <input
              type="range"
              min="3.0"
              max="9.5"
              step="0.1"
              value={voteAverage}
              onChange={(e) => setVoteAverage(Number(e.target.value))}
              style={{ width: '100%', accentColor: '#f59e0b', cursor: 'pointer' }}
            />
          </div>

          {/* Slider 5: Expected Vote Count */}
          <div style={{ marginBottom: '32px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
              <label style={{ fontSize: '0.88rem', fontWeight: 600, color: 'var(--text-main)' }}>
                Audience Review Count
              </label>
              <span style={{ fontWeight: 700, color: '#34d399', fontFamily: 'var(--font-heading)' }}>
                {voteCount.toLocaleString()} votes
              </span>
            </div>
            <input
              type="range"
              min="100"
              max="15000"
              step="100"
              value={voteCount}
              onChange={(e) => setVoteCount(Number(e.target.value))}
              style={{ width: '100%', accentColor: '#10b981', cursor: 'pointer' }}
            />
          </div>

          <button
            className="btn-primary"
            onClick={runPrediction}
            disabled={loading}
            style={{ width: '100%', padding: '16px', fontSize: '1.05rem', justifyContent: 'center' }}
          >
            <RefreshCw size={18} className={loading ? 'spin' : ''} />
            <span>{loading ? 'Running ML Regressor...' : 'Calculate Predicted Box Office'}</span>
          </button>
        </div>

        {/* Right Column: Prediction Results Dashboard */}
        <div className="glass-card" style={{
          padding: '32px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          background: 'linear-gradient(135deg, rgba(18, 24, 43, 0.95) 0%, rgba(13, 19, 36, 0.9) 100%)',
          border: '1px solid rgba(99, 102, 241, 0.25)'
        }}>
          <div>
            {/* Box Office Verdict Badge */}
            <div style={{ textAlign: 'center', marginBottom: '28px' }}>
              <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px', fontWeight: 600 }}>
                PROJECTED THEATRICAL STATUS
              </span>
              <div style={{
                marginTop: '10px',
                padding: '12px 24px',
                background: 'rgba(255, 255, 255, 0.05)',
                borderRadius: 'var(--radius-md)',
                border: `1px solid ${prediction.verdict_color || '#10b981'}`,
                color: prediction.verdict_color || '#10b981',
                fontSize: '1.4rem',
                fontWeight: 800,
                fontFamily: 'var(--font-heading)',
                display: 'inline-block'
              }}>
                {prediction.verdict}
              </div>
            </div>

            {/* Estimated Revenue Showcase */}
            <div style={{
              background: 'rgba(255, 255, 255, 0.03)',
              padding: '24px',
              borderRadius: 'var(--radius-md)',
              border: '1px solid rgba(255, 255, 255, 0.06)',
              marginBottom: '20px',
              textAlign: 'center'
            }}>
              <div style={{ fontSize: '0.84rem', color: 'var(--text-muted)', marginBottom: '6px' }}>
                Estimated Global Box Office Gross
              </div>
              <div style={{
                fontFamily: 'var(--font-heading)',
                fontSize: 'clamp(2rem, 3.5vw, 2.6rem)',
                fontWeight: 900,
                color: '#38bdf8',
                letterSpacing: '-0.5px'
              }}>
                {formatCurrency(prediction.predicted_revenue)}
              </div>
            </div>

            {/* Grid Metrics */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '24px' }}>
              {/* Estimated Profit */}
              <div style={{
                background: 'rgba(255, 255, 255, 0.03)',
                padding: '18px',
                borderRadius: 'var(--radius-md)',
                border: '1px solid rgba(255, 255, 255, 0.05)'
              }}>
                <div style={{ fontSize: '0.78rem', color: 'var(--text-dim)', marginBottom: '4px' }}>Estimated Profit / Loss</div>
                <div style={{
                  fontSize: '1.25rem',
                  fontWeight: 700,
                  color: prediction.predicted_profit >= 0 ? '#34d399' : '#f87171'
                }}>
                  {formatCurrency(prediction.predicted_profit)}
                </div>
              </div>

              {/* ROI Percentage */}
              <div style={{
                background: 'rgba(255, 255, 255, 0.03)',
                padding: '18px',
                borderRadius: 'var(--radius-md)',
                border: '1px solid rgba(255, 255, 255, 0.05)'
              }}>
                <div style={{ fontSize: '0.78rem', color: 'var(--text-dim)', marginBottom: '4px' }}>Return on Investment (ROI)</div>
                <div style={{
                  fontSize: '1.25rem',
                  fontWeight: 700,
                  color: prediction.roi_percentage >= 0 ? '#fbbf24' : '#f87171'
                }}>
                  {prediction.roi_percentage > 0 ? `+${prediction.roi_percentage}%` : `${prediction.roi_percentage}%`}
                </div>
              </div>
            </div>

            {/* Financial Breakdown Bar */}
            <div style={{
              background: 'rgba(0, 0, 0, 0.25)',
              padding: '16px',
              borderRadius: 'var(--radius-md)',
              border: '1px solid rgba(255, 255, 255, 0.04)',
              fontSize: '0.84rem'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                <span style={{ color: 'var(--text-muted)' }}>Invested Budget:</span>
                <span style={{ fontWeight: 600 }}>${budgetMillion} Million</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                <span style={{ color: 'var(--text-muted)' }}>Popularity Weight:</span>
                <span style={{ fontWeight: 600 }}>{popularity} / 300</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-muted)' }}>Confidence Metric:</span>
                <span style={{ color: '#34d399', fontWeight: 600 }}>High (Trained on 4.8K titles)</span>
              </div>
            </div>
          </div>

          <div style={{ marginTop: '24px', textAlign: 'center', fontSize: '0.76rem', color: 'var(--text-dim)' }}>
            * Predictions are modeled with Random Forest multi-variate non-linear regression using TMDB financial metrics.
          </div>
        </div>
      </div>
    </div>
  );
}
