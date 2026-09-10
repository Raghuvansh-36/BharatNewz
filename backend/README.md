# BharatNewz Backend API & PostgreSQL Database

FastAPI backend service powering the 3D Interactive Global News & Threat Visualizer.

## Features
- **Pydantic Validation**: Strict request/response validation for news articles & threat alerts.
- **PostgreSQL Database Storage**: Persistent news storage with unique auto-generated IDs (`art_...`).
- **REST Endpoints**:
  - `GET /api/news` (Filter by country code, category, threat level, search term)
  - `GET /api/news/{id}` (Fetch article by unique ID)
  - `POST /api/news` (Submit new article)
  - `DELETE /api/news/{id}` (Delete article)
  - `GET /api/threats` (Fetch active global threat highlights with lat/long)
  - `GET /api/countries/summary` (Aggregated statistics per country)

## Setup & Running

```bash
# 1. Install dependencies
pip install -r requirements.txt

# 2. Seed database (PostgreSQL on localhost:5432/bharatnewz)
python seed_data.py

# 3. Start server
uvicorn main:app --reload --port 8000
```
