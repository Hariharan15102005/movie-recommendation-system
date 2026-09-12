# 🎬 CinePredict AI — TMDB 5000 Movie Recommendation & Box Office Prediction Engine

A modern, full-stack machine learning web application featuring an **NLP-based Content Recommendation System** and an interactive **Box Office Revenue Prediction Simulator** built with **React 18, Vite, FastAPI, and Scikit-Learn**.

---

## 🌟 Key Features

- **🎬 AI Content-Based Recommender**:
  - Recommends top 5-6 similar movies using CountVectorizer & Cosine Similarity across 4,800+ films.
  - Live auto-complete search, match similarity percentages (`e.g., 94.5% MATCH`), cast, director, and plot overview.
  - Direct YouTube trailer search links and detailed movie modal.

- **💰 Box Office & Hit Predictor (ML Simulator)**:
  - Non-linear multi-variate **Random Forest Regressor** trained on TMDB financial data.
  - Interactive sliders for **Budget ($M)**, **Popularity Index**, **Runtime**, **Expected Rating**, and **Vote Count**.
  - Real-time simulation of **Worldwide Box Office Gross**, **Profit/Loss**, **ROI %**, and **Theatrical Verdict** (*All-Time Blockbuster 🚀*, *Super Hit 🌟*, *Profitable 📈*, *Flop 📉*).
  - Confetti animations for blockbuster predictions.

- **📊 Dataset Leaderboard & Analytics**:
  - All-time highest-grossing movies table with financial ROI metrics.
  - Interactive genre distribution charts.

- **📓 Fully Documented Jupyter Notebook**:
  - `movie_prediction.ipynb` contains the complete end-to-end data processing, feature engineering, and model training with line-by-line `#` comments.

---

## 🏗️ Tech Stack

- **Frontend**: React 18, Vite, Lucide Icons, Canvas Confetti, Vanilla CSS (Obsidian Dark Glassmorphism)
- **Backend**: FastAPI, Uvicorn, Pydantic, CORS
- **Machine Learning & Data**: Pandas, NumPy, Scikit-Learn, NLTK, AST, Pickle
- **Dataset**: TMDB 5000 Movies & Credits

---

## 🚀 Quick Start Guide

### 1. Clone the Repository
```bash
git clone https://github.com/Hariharan15102005/movie-recommendation-system.git
cd movie-recommendation-system
```

### 2. Set Up Backend (FastAPI)
```bash
# Install Python dependencies
pip install fastapi uvicorn pandas numpy scikit-learn nltk

# Start the FastAPI server (runs on port 8000)
python -m uvicorn backend.app:app --port 8000 --host 127.0.0.1
```
> **Note**: The backend automatically parses the dataset and initializes model files on startup.

### 3. Set Up Frontend (React + Vite)
```bash
# Navigate to frontend folder
cd frontend

# Install dependencies
npm install

# Start Vite development server (runs on port 5173)
npm run dev
```

Open **`http://localhost:5173`** in your browser!

---

## 📁 Repository Structure

```
├── backend/
│   └── app.py                     # FastAPI REST API Server
├── frontend/                      # React 18 + Vite Web App
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navbar.jsx         # Sticky navigation with tabs
│   │   │   ├── HeroSection.jsx    # Cinematic showcase
│   │   │   ├── RecommenderTab.jsx # Movie search & similarity matching
│   │   │   ├── PredictorTab.jsx   # Interactive financial simulator
│   │   │   ├── AnalyticsTab.jsx   # Box office leaderboard & charts
│   │   │   └── MovieModal.jsx     # Detailed synopsis & trailer links
│   │   ├── App.jsx
│   │   └── index.css              # Obsidian Glassmorphic Design System
├── movie_prediction.ipynb         # Fully commented Jupyter Notebook
├── tmdb_5000_movies.csv           # TMDB Movies Metadata
├── tmdb_5000_credits.csv          # TMDB Credits Dataset
└── README.md
```

---

## 📜 License
Distributed under the MIT License.
