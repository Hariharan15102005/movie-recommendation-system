import os
import json
import pickle
import ast
import numpy as np
import pandas as pd
from typing import Optional, List
from fastapi import FastAPI, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from sklearn.ensemble import RandomForestRegressor

app = FastAPI(title="Movie Prediction & Recommender API", version="1.0.0")

# Enable CORS for React frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
ROOT_DIR = os.path.dirname(BASE_DIR)
MOVIES_CSV = os.path.join(ROOT_DIR, "tmdb_5000_movies.csv")
CREDITS_CSV = os.path.join(ROOT_DIR, "tmdb_5000_credits.csv")
MOVIE_DICT_PKL = os.path.join(ROOT_DIR, "movie_dict.pkl")
SIMILARITY_PKL = os.path.join(ROOT_DIR, "similarity.pkl")
REVENUE_MODEL_PKL = os.path.join(ROOT_DIR, "revenue_model.pkl")

# Global variables in memory
movies_df = None
credits_df = None
merged_df = None
new_df = None
similarity_matrix = None
revenue_model = None

def parse_json_names(val):
    if not isinstance(val, str) or val.strip() == "":
        return []
    try:
        items = ast.literal_eval(val)
        return [i["name"] for i in items if isinstance(i, dict) and "name" in i]
    except Exception:
        return []

def parse_cast(val):
    if not isinstance(val, str) or val.strip() == "":
        return []
    try:
        items = ast.literal_eval(val)
        return [i["name"] for i in items[:4] if isinstance(i, dict) and "name" in i]
    except Exception:
        return []

def parse_director(val):
    if not isinstance(val, str) or val.strip() == "":
        return "Unknown"
    try:
        items = ast.literal_eval(val)
        for i in items:
            if isinstance(i, dict) and i.get("job") == "Director":
                return i.get("name", "Unknown")
        return "Unknown"
    except Exception:
        return "Unknown"

@app.on_event("startup")
def load_and_initialize():
    global movies_df, credits_df, merged_df, new_df, similarity_matrix, revenue_model
    print("Loading datasets and models...")

    if os.path.exists(MOVIES_CSV) and os.path.exists(CREDITS_CSV):
        movies_df = pd.read_csv(MOVIES_CSV)
        credits_df = pd.read_csv(CREDITS_CSV)
        merged_df = movies_df.merge(credits_df, on="title")
        
        # Parse enriched details for frontend UI
        merged_df["genres_list"] = merged_df["genres"].apply(parse_json_names)
        merged_df["keywords_list"] = merged_df["keywords"].apply(parse_json_names)
        merged_df["cast_list"] = merged_df["cast"].apply(parse_cast)
        merged_df["director"] = merged_df["crew"].apply(parse_director)
        print(f"Loaded {len(merged_df)} movies.")

    # Load recommendation pickle files
    if os.path.exists(MOVIE_DICT_PKL) and os.path.exists(SIMILARITY_PKL):
        try:
            with open(MOVIE_DICT_PKL, "rb") as f:
                movie_dict = pickle.load(f)
                new_df = pd.DataFrame(movie_dict)
            with open(SIMILARITY_PKL, "rb") as f:
                similarity_matrix = pickle.load(f)
            print("Loaded recommendation models from pkl.")
        except Exception as e:
            print(f"Error loading pkl: {e}")

    # Train or load revenue prediction model
    if os.path.exists(REVENUE_MODEL_PKL):
        try:
            with open(REVENUE_MODEL_PKL, "rb") as f:
                revenue_model = pickle.load(f)
            print("Loaded revenue model from pkl.")
        except Exception:
            pass

    if revenue_model is None and merged_df is not None:
        print("Training Random Forest Revenue Regressor...")
        ml_data = merged_df[(merged_df["budget"] > 0) & (merged_df["revenue"] > 0)].copy()
        ml_data = ml_data[["budget", "popularity", "runtime", "vote_average", "vote_count", "revenue"]].dropna()
        X = ml_data[["budget", "popularity", "runtime", "vote_average", "vote_count"]]
        y = ml_data["revenue"]
        rf = RandomForestRegressor(n_estimators=100, random_state=42)
        rf.fit(X, y)
        revenue_model = rf
        with open(REVENUE_MODEL_PKL, "wb") as f:
            pickle.dump(rf, f)
        print("Revenue model trained and saved successfully.")

# Request / Response Schemas
class RecommendRequest(BaseModel):
    title: str
    top_n: Optional[int] = 6

class PredictRevenueRequest(BaseModel):
    budget: float
    popularity: float
    runtime: float
    vote_average: float
    vote_count: float

@app.get("/api/health")
def health_check():
    return {
        "status": "healthy",
        "movies_count": len(merged_df) if merged_df is not None else 0,
        "recommender_ready": similarity_matrix is not None,
        "predictor_ready": revenue_model is not None
    }

@app.get("/api/movies")
def get_all_movies(query: Optional[str] = Query(None, min_length=1), limit: int = 50):
    """Returns movie list with autocomplete search capability"""
    if merged_df is None:
        raise HTTPException(status_code=500, detail="Data not loaded")

    df_subset = merged_df[["movie_id", "title", "vote_average", "release_date", "genres_list", "popularity"]]
    if query:
        q = query.lower()
        matched = df_subset[df_subset["title"].str.lower().str.contains(q, na=False)]
        result = matched.head(limit).to_dict(orient="records")
    else:
        result = df_subset.head(limit).to_dict(orient="records")

    return {"movies": result}

@app.get("/api/top_movies")
def get_top_movies():
    """Returns curated lists of trending, top rated, and highest grossing movies"""
    if merged_df is None:
        raise HTTPException(status_code=500, detail="Data not loaded")

    cols = ["movie_id", "title", "vote_average", "vote_count", "popularity", "revenue", "budget", "release_date", "genres_list", "overview", "director", "cast_list", "runtime"]
    
    # Highest grossing
    highest_grossing = merged_df[merged_df["revenue"] > 0].nlargest(8, "revenue")[cols].to_dict(orient="records")
    # Top rated with minimum 1000 votes
    top_rated = merged_df[merged_df["vote_count"] > 1000].nlargest(8, "vote_average")[cols].to_dict(orient="records")
    # Most popular
    most_popular = merged_df.nlargest(8, "popularity")[cols].to_dict(orient="records")

    return {
        "highest_grossing": highest_grossing,
        "top_rated": top_rated,
        "trending": most_popular
    }

@app.get("/api/movie/{title}")
def get_movie_details(title: str):
    """Fetch complete metadata for a specific movie"""
    if merged_df is None:
        raise HTTPException(status_code=500, detail="Data not loaded")

    match = merged_df[merged_df["title"].str.lower() == title.lower()]
    if match.empty:
        raise HTTPException(status_code=404, detail="Movie not found")

    row = match.iloc[0].to_dict()
    keys_to_keep = [
        "movie_id", "title", "overview", "genres_list", "keywords_list",
        "cast_list", "director", "release_date", "budget", "revenue",
        "popularity", "runtime", "vote_average", "vote_count", "tagline"
    ]
    return {k: row.get(k) for k in keys_to_keep}

@app.post("/api/recommend")
def recommend_movies(payload: RecommendRequest):
    """Returns content-based recommendations for a target movie"""
    if new_df is None or similarity_matrix is None or merged_df is None:
        raise HTTPException(status_code=500, detail="Recommender model not initialized")

    movie_title = payload.title.strip()
    match = new_df[new_df["title"].str.lower() == movie_title.lower()]

    if match.empty:
        match = new_df[new_df["title"].str.lower().str.contains(movie_title.lower(), na=False)]
        if match.empty:
            raise HTTPException(status_code=404, detail=f"Movie '{movie_title}' not found in database")

    movie_index = match.index[0]
    matched_title = new_df.iloc[movie_index]["title"]
    
    distances = similarity_matrix[movie_index]
    sorted_movies = sorted(list(enumerate(distances)), reverse=True, key=lambda x: x[1])
    top_indices = sorted_movies[1 : payload.top_n + 1]

    recommendations = []
    for idx, dist in top_indices:
        rec_title = new_df.iloc[idx]["title"]
        detail_match = merged_df[merged_df["title"] == rec_title]
        if not detail_match.empty:
            d = detail_match.iloc[0]
            recommendations.append({
                "movie_id": int(d["movie_id"]),
                "title": str(d["title"]),
                "similarity_score": round(float(dist) * 100, 1),
                "vote_average": float(d.get("vote_average", 0)),
                "vote_count": int(d.get("vote_count", 0)),
                "release_date": str(d.get("release_date", "N/A")),
                "genres": d.get("genres_list", []),
                "overview": str(d.get("overview", "")),
                "director": str(d.get("director", "Unknown")),
                "cast": d.get("cast_list", []),
                "runtime": float(d.get("runtime", 0)) if pd.notnull(d.get("runtime")) else 0
            })

    queried_details = None
    q_match = merged_df[merged_df["title"] == matched_title]
    if not q_match.empty:
        qd = q_match.iloc[0]
        queried_details = {
            "movie_id": int(qd["movie_id"]),
            "title": str(qd["title"]),
            "vote_average": float(qd.get("vote_average", 0)),
            "release_date": str(qd.get("release_date", "N/A")),
            "genres": qd.get("genres_list", []),
            "overview": str(qd.get("overview", "")),
            "director": str(qd.get("director", "Unknown")),
            "cast": qd.get("cast_list", [])
        }

    return {
        "searched_movie": queried_details,
        "recommendations": recommendations
    }

@app.post("/api/predict_revenue")
def predict_revenue(payload: PredictRevenueRequest):
    """Predicts box office collection, profit, ROI, and verdict"""
    if revenue_model is None:
        raise HTTPException(status_code=500, detail="Revenue prediction model not ready")

    input_df = pd.DataFrame([{
        "budget": payload.budget,
        "popularity": payload.popularity,
        "runtime": payload.runtime,
        "vote_average": payload.vote_average,
        "vote_count": payload.vote_count
    }])

    predicted_revenue = float(revenue_model.predict(input_df)[0])
    predicted_revenue = max(0.0, predicted_revenue)
    profit = predicted_revenue - payload.budget
    roi = (profit / payload.budget) * 100 if payload.budget > 0 else 0

    if profit > payload.budget * 2:
        verdict = "All-Time Blockbuster 🚀"
        verdict_color = "#10b981"
    elif profit > payload.budget * 0.8:
        verdict = "Super Hit 🌟"
        verdict_color = "#3b82f6"
    elif profit >= 0:
        verdict = "Profitable / Moderate Hit 📈"
        verdict_color = "#f59e0b"
    else:
        verdict = "Box Office Flop 📉"
        verdict_color = "#ef4444"

    return {
        "input": {
            "budget": payload.budget,
            "popularity": payload.popularity,
            "runtime": payload.runtime,
            "vote_average": payload.vote_average,
            "vote_count": payload.vote_count
        },
        "predicted_revenue": round(predicted_revenue, 2),
        "predicted_profit": round(profit, 2),
        "roi_percentage": round(roi, 1),
        "verdict": verdict,
        "verdict_color": verdict_color
    }

@app.get("/api/analytics")
def get_analytics():
    """Returns dataset summary analytics for dashboard charts"""
    if merged_df is None:
        raise HTTPException(status_code=500, detail="Data not loaded")

    valid_fin = merged_df[(merged_df["budget"] > 0) & (merged_df["revenue"] > 0)]
    
    total_movies = len(merged_df)
    avg_budget = float(valid_fin["budget"].mean())
    avg_revenue = float(valid_fin["revenue"].mean())
    avg_rating = float(merged_df["vote_average"].mean())
    
    all_genres = []
    for g_list in merged_df["genres_list"]:
        all_genres.extend(g_list)
    genre_series = pd.Series(all_genres).value_counts().head(10).to_dict()

    return {
        "total_movies": total_movies,
        "avg_budget": round(avg_budget, 2),
        "avg_revenue": round(avg_revenue, 2),
        "avg_rating": round(avg_rating, 2),
        "top_genres": genre_series
    }
