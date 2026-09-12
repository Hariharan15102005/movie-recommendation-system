import React, { useState } from 'react';
import Navbar from './components/Navbar';
import HeroSection from './components/HeroSection';
import RecommenderTab from './components/RecommenderTab';
import PredictorTab from './components/PredictorTab';
import AnalyticsTab from './components/AnalyticsTab';
import MovieModal from './components/MovieModal';

export default function App() {
  const [activeTab, setActiveTab] = useState('recommender');
  const [modalMovieTitle, setModalMovieTitle] = useState(null);

  const handleRecommendFromModal = (title) => {
    setActiveTab('recommender');
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Navigation Bar */}
      <Navbar activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Hero Header (Visible on Recommender and Predictor tabs) */}
      {(activeTab === 'recommender' || activeTab === 'explore') && (
        <HeroSection
          onExploreClick={() => setActiveTab('recommender')}
          onPredictClick={() => setActiveTab('predictor')}
        />
      )}

      {/* Main Tab Content */}
      <main style={{ flex: 1, marginTop: '20px' }}>
        {activeTab === 'recommender' && (
          <RecommenderTab onSelectMovie={(title) => setModalMovieTitle(title)} />
        )}
        {activeTab === 'predictor' && <PredictorTab />}
        {activeTab === 'explore' && <AnalyticsTab />}
        {activeTab === 'analytics' && <AnalyticsTab />}
      </main>

      {/* Movie Details Modal */}
      {modalMovieTitle && (
        <MovieModal
          movieTitle={modalMovieTitle}
          onClose={() => setModalMovieTitle(null)}
          onRecommend={handleRecommendFromModal}
        />
      )}

      {/* Footer */}
      <footer style={{
        marginTop: 'auto',
        borderTop: '1px solid rgba(255, 255, 255, 0.06)',
        padding: '24px',
        textAlign: 'center',
        color: 'var(--text-dim)',
        fontSize: '0.84rem'
      }}>
        <p>🎬 <strong>CinePredict AI</strong> — TMDB 5000 Movie Recommendation & Box Office Machine Learning Platform</p>
      </footer>
    </div>
  );
}
