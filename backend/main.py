from typing import List, Optional
from fastapi import FastAPI, Depends, HTTPException, Query, status
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from sqlalchemy import func, or_

from database import engine, get_db, Base
from models import (
    NewsArticleModel, ThreatHighlightModel,
    NewsArticleCreate, NewsArticleResponse,
    ThreatHighlightResponse, CountrySummaryResponse
)
from seed_data import seed_db
from scraper import scrape_live_news, generate_articles_for_country

# Initialize database tables
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="BharatNewz Global News & Threat Visualizer API",
    description="REST API for global news articles, threat highlights, and country statistics with PostgreSQL & Pydantic validation.",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("startup")
def startup_event():
    seed_db()
    scrape_live_news()

@app.get("/")
def root():
    return {"status": "online", "service": "BharatNewz 3D Visualizer API"}

@app.get("/api/news", response_model=List[NewsArticleResponse])
def get_news_articles(
    country_code: Optional[str] = Query(None),
    category: Optional[str] = Query(None),
    threat_level: Optional[str] = Query(None),
    search: Optional[str] = Query(None),
    country_name: Optional[str] = Query(None),
    db: Session = Depends(get_db)
):
    if country_code:
        cc_upper = country_code.upper()
        count = db.query(NewsArticleModel).filter(func.upper(NewsArticleModel.country_code) == cc_upper).count()
        if count == 0:
            cname = country_name or country_code
            generate_articles_for_country(db, cc_upper, cname)

    query = db.query(NewsArticleModel)

    if country_code:
        query = query.filter(func.upper(NewsArticleModel.country_code) == country_code.upper())
    if category and category.lower() != "all":
        query = query.filter(func.lower(NewsArticleModel.category) == category.lower())
    if threat_level and threat_level.lower() != "all":
        query = query.filter(func.lower(NewsArticleModel.threat_level) == threat_level.lower())
    if search:
        search_pattern = f"%{search}%"
        query = query.filter(
            or_(
                NewsArticleModel.title.ilike(search_pattern),
                NewsArticleModel.summary.ilike(search_pattern),
                NewsArticleModel.country_name.ilike(search_pattern)
            )
        )

    articles = query.order_by(NewsArticleModel.published_at.desc()).all()
    return articles


@app.get("/api/news/{article_id}", response_model=NewsArticleResponse)
def get_news_article(article_id: str, db: Session = Depends(get_db)):
    article = db.query(NewsArticleModel).filter(NewsArticleModel.id == article_id).first()
    if not article:
        raise HTTPException(status_code=404, detail=f"Article with ID {article_id} not found.")
    return article


@app.post("/api/news", response_model=NewsArticleResponse, status_code=status.HTTP_201_CREATED)
def create_news_article(article_in: NewsArticleCreate, db: Session = Depends(get_db)):
    """
    Store a new article in PostgreSQL database validated via Pydantic model.
    Generates a unique article ID automatically.
    """
    db_article = NewsArticleModel(
        title=article_in.title,
        summary=article_in.summary,
        content=article_in.content,
        category=article_in.category,
        country_code=article_in.country_code.upper(),
        country_name=article_in.country_name,
        threat_level=article_in.threat_level.lower(),
        threat_type=article_in.threat_type.lower(),
        source=article_in.source or "User Submission",
        image_url=article_in.image_url
    )
    db.add(db_article)
    db.commit()
    db.refresh(db_article)
    print(f"[API] Created new article with unique ID: {db_article.id} for country: {db_article.country_name}")
    return db_article


@app.post("/api/news/scrape")
def trigger_news_scrape():
    """
    Triggers real-time RSS news scraper to fetch new articles from BBC, Al Jazeera, Reuters, Times of India, CNN.
    """
    added = scrape_live_news()
    return {
        "status": "success",
        "message": f"Live news scrape completed. Added {added} new articles to PostgreSQL.",
        "new_articles_count": added
    }


@app.delete("/api/news/{article_id}")
def delete_news_article(article_id: str, db: Session = Depends(get_db)):
    article = db.query(NewsArticleModel).filter(NewsArticleModel.id == article_id).first()
    if not article:
        raise HTTPException(status_code=404, detail=f"Article with ID {article_id} not found.")
    db.delete(article)
    db.commit()
    return {"status": "success", "message": f"Article {article_id} deleted."}


# ==========================================
# THREAT HIGHLIGHTS ENDPOINTS
# ==========================================

@app.get("/api/threats", response_model=List[ThreatHighlightResponse])
def get_threat_highlights(
    country_code: Optional[str] = Query(None),
    db: Session = Depends(get_db)
):
    query = db.query(ThreatHighlightModel)
    if country_code:
        query = query.filter(func.upper(ThreatHighlightModel.country_code) == country_code.upper())
    return query.all()


# ==========================================
# COUNTRY SUMMARY & GLOBE STATS ENDPOINTS
# ==========================================

@app.get("/api/countries/summary", response_model=List[CountrySummaryResponse])
def get_country_summaries(db: Session = Depends(get_db)):
    articles = db.query(NewsArticleModel).all()
    threats = db.query(ThreatHighlightModel).all()

    summary_map = {}

    for art in articles:
        cc = art.country_code.upper()
        if cc not in summary_map:
            summary_map[cc] = {
                "country_code": cc,
                "country_name": art.country_name,
                "total_articles": 0,
                "critical_threats": 0,
                "categories": set(),
                "threat_types": set()
            }
        summary_map[cc]["total_articles"] += 1
        summary_map[cc]["categories"].add(art.category)
        if art.threat_level in ["high", "critical"]:
            summary_map[cc]["critical_threats"] += 1
        if art.threat_type and art.threat_type != "none":
            summary_map[cc]["threat_types"].add(art.threat_type)

    for th in threats:
        cc = th.country_code.upper()
        if cc not in summary_map:
            summary_map[cc] = {
                "country_code": cc,
                "country_name": th.country_name,
                "total_articles": 0,
                "critical_threats": 0,
                "categories": set(),
                "threat_types": set()
            }
        summary_map[cc]["critical_threats"] += 1
        summary_map[cc]["threat_types"].add(th.threat_type)

    result = []
    for cc, data in summary_map.items():
        result.append(CountrySummaryResponse(
            country_code=cc,
            country_name=data["country_name"],
            total_articles=data["total_articles"],
            critical_threats=data["critical_threats"],
            categories=list(data["categories"]),
            threat_types=list(data["threat_types"])
        ))

    return result
