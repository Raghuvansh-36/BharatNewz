import json
import uuid
import random
from datetime import datetime, timedelta
from database import SessionLocal, engine, Base
from models import NewsArticleModel, ThreatHighlightModel

Base.metadata.create_all(bind=engine)

def get_country_code(props):
    iso3 = props.get("ISO_A3")
    adm0 = props.get("ADM0_A3")
    sov = props.get("SOV_A3")
    if iso3 and iso3 != "-99":
        return iso3.upper()
    if adm0 and adm0 != "-99":
        return adm0.upper()
    if sov and sov != "-99":
        return sov.upper()
    return "UNK"

CATEGORY_PHOTOS = {
    "Environment": [
        "https://images.unsplash.com/photo-1497435334941-8c899ee9e8e9?w=800",
        "https://images.unsplash.com/photo-1466611653911-95081537e5b7?w=800",
        "https://images.unsplash.com/photo-1509391365360-2e959784a276?w=800",
        "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=800"
    ],
    "Tech": [
        "https://images.unsplash.com/photo-1518770660439-4636190af475?w=800",
        "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800",
        "https://images.unsplash.com/photo-1531482615713-2afd69097998?w=800",
        "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?w=800"
    ],
    "Politics": [
        "https://images.unsplash.com/photo-1541872703-74c5e44368f9?w=800",
        "https://images.unsplash.com/photo-1577495508048-b635879837f1?w=800",
        "https://images.unsplash.com/photo-1529107386315-e1a2ed48a620?w=800",
        "https://images.unsplash.com/photo-1505373877841-8d25f7d46678?w=800"
    ],
    "Disasters": [
        "https://images.unsplash.com/photo-1547683905-f686c993aae5?w=800",
        "https://images.unsplash.com/photo-1516912481808-3406841bd33c?w=800",
        "https://images.unsplash.com/photo-1605721911519-3dfeb3be25e7?w=800"
    ],
    "Health": [
        "https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?w=800",
        "https://images.unsplash.com/photo-1505751172876-fa1923c5c528?w=800",
        "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=800"
    ],
    "World": [
        "https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=800",
        "https://images.unsplash.com/photo-1495020689067-958852a7765e?w=800",
        "https://images.unsplash.com/photo-1585829365295-ab7cd400c167?w=800"
    ]
}

ARTICLE_TEMPLATES = [
    {
        "category": "Environment",
        "title": "National Clean Energy Grid Expansion Unveiled in {country}",
        "summary": "Government authorities and environmental agencies in {country} approve a multi-billion dollar roadmap accelerating solar and wind infrastructure.",
        "content": "A landmark transition plan was formally announced today across {country}, establishing strategic public-private partnerships to replace aging fossil facilities with modern high-capacity renewable installations over the coming five years.",
        "threat_level": "none",
        "threat_type": "none",
        "source": "Global Energy Review"
    },
    {
        "category": "Tech",
        "title": "{country} Expands Digital Innovation & Fiber Connectivity",
        "summary": "Technology startups and public researchers in {country} roll out nationwide ultra-fast digital infrastructure to support next-generation tech industries.",
        "content": "Leaders from industry and government gathered to inaugurate regional high-speed communications hubs across {country}. The initiative aims to support regional research, cloud computing facilities, and digital workforce upskilling.",
        "threat_level": "none",
        "threat_type": "none",
        "source": "International Tech Wire"
    },
    {
        "category": "Politics",
        "title": "{country} Hosts Regional Economic & Trade Cooperation Summit",
        "summary": "Diplomatic representatives and trade ministers meet in {country} to formalize cross-border commercial pacts and supply chain corridors.",
        "content": "Multilateral talks concluded successfully with delegations endorsing improved customs procedures, cross-border digital financial protocols, and reciprocal trade facilitation between {country} and neighboring partners.",
        "threat_level": "none",
        "threat_type": "none",
        "source": "Diplomatic Dispatch"
    },
    {
        "category": "Health",
        "title": "Modern Healthcare & Medical Research Center Inaugurated in {country}",
        "summary": "Health officials in {country} inaugurate an advanced regional diagnostic center focused on preventive medicine and public health telemetry.",
        "content": "The state-of-the-art medical complex features advanced diagnostic laboratories, regional pandemic surveillance tools, and telemedicine capabilities designed to extend specialized treatment into underserved rural districts of {country}.",
        "threat_level": "none",
        "threat_type": "none",
        "source": "Global Health Monitor"
    }
]

GLOBAL_THREATS = [
    {"country_code": "USA", "country_name": "United States of America", "title": "Atlantic Hurricane Surge & Coastal Advisory", "description": "High-intensity storm system producing dangerous coastal surges and gale-force gusts across southeastern littoral zones.", "severity": "critical", "threat_type": "hurricane", "latitude": 28.5, "longitude": -82.0},
    {"country_code": "IND", "country_name": "India", "title": "Monsoon River Surge & Regional Flood Warning", "description": "Heavy precipitation triggers high water levels across major river basins in northern and eastern territories.", "severity": "high", "threat_type": "flood", "latitude": 26.8, "longitude": 80.9},
    {"country_code": "JPN", "country_name": "Japan", "title": "Magnitude 6.8 Offshore Seismic Warning", "description": "Subduction zone seismic activity recorded off northeastern coast with precautionary tsunami advisory for marine craft.", "severity": "critical", "threat_type": "earthquake", "latitude": 38.3, "longitude": 142.4},
    {"country_code": "BRA", "country_name": "Brazil", "title": "Amazon Basin Wildfire Alert & Dry Spell", "description": "Prolonged drought exacerbates spontaneous scrub and woodland blazes across central conservation belts.", "severity": "high", "threat_type": "wildfire", "latitude": -9.1, "longitude": -55.2},
    {"country_code": "AUS", "country_name": "Australia", "title": "Southeast Bushfire Weather Warning", "description": "Hot continental winds raise fire risk indices across southeastern bushland with total fire bans enacted.", "severity": "high", "threat_type": "wildfire", "latitude": -33.8, "longitude": 149.1},
    {"country_code": "DEU", "country_name": "Germany", "title": "Central European River Inundation Alert", "description": "Continuous rainfall raises water levels along the Rhine and Danube basins triggering floodplain alerts.", "severity": "medium", "threat_type": "flood", "latitude": 51.1, "longitude": 10.4},
    {"country_code": "EGY", "country_name": "Egypt", "title": "North African Extreme Heatwave Warning", "description": "Severe thermal surge with temperatures exceeding seasonal records across upper Nile valley provinces.", "severity": "medium", "threat_type": "epidemic", "latitude": 26.8, "longitude": 30.8},
    {"country_code": "PHL", "country_name": "Philippines", "title": "Western Pacific Typhoon Advisory", "description": "Tropical cyclone tracking westward through the Philippine Sea with torrential rainfall and coastal squalls.", "severity": "high", "threat_type": "hurricane", "latitude": 13.4, "longitude": 122.5},
    {"country_code": "TUR", "country_name": "Turkey", "title": "Anatolian Fault Seismic Precaution Alert", "description": "Moderate magnitude tremors detected along regional fault system; emergency response teams on heightened standby.", "severity": "high", "threat_type": "earthquake", "latitude": 39.9, "longitude": 32.8},
    {"country_code": "CAN", "country_name": "Canada", "title": "Boreal Woodland Fire Smoke Warning", "description": "Summer lightning storms trigger seasonal fires with smoke plume advisories issued for adjacent districts.", "severity": "medium", "threat_type": "wildfire", "latitude": 53.7, "longitude": -115.5},
    {"country_code": "IDN", "country_name": "Indonesia", "title": "Sunda Strait Volcanic & Tectonic Warning", "description": "Elevated seismic tremors and volcanic ash emissions recorded in maritime corridors.", "severity": "high", "threat_type": "earthquake", "latitude": -6.2, "longitude": 106.8},
    {"country_code": "CHL", "country_name": "Chile", "title": "Andean Offshore Tremor Advisory", "description": "Deep maritime seismic event registered along the Nazca plate boundary; infrastructure monitoring initiated.", "severity": "high", "threat_type": "earthquake", "latitude": -33.4, "longitude": -70.6},
    {"country_code": "KEN", "country_name": "Kenya", "title": "Horn of Africa Extended Aridity Alert", "description": "Sub-normal rainfall patterns place agricultural and pastoral reservoirs under strict management.", "severity": "medium", "threat_type": "flood", "latitude": -1.2, "longitude": 36.8},
]

def populate_all_countries():
    db = SessionLocal()
    try:
        with open("../public/countries.json", "r", encoding="utf-8") as f:
            countries_data = json.load(f)

        features = countries_data.get("features", [])
        print(f"[Population] Found {len(features)} countries in GeoJSON dataset.")

        added_articles = 0

        for feat in features:
            props = feat.get("properties", {})
            country_code = get_country_code(props)
            country_name = props.get("NAME") or props.get("ADMIN") or "Unknown"

            if not country_code or country_code == "UNK":
                continue

            cur_count = db.query(NewsArticleModel).filter(NewsArticleModel.country_code == country_code).count()
            if cur_count >= 2:
                continue

            num_to_add = 3 - cur_count
            templates_sample = random.sample(ARTICLE_TEMPLATES, k=min(num_to_add, len(ARTICLE_TEMPLATES)))

            for tmpl in templates_sample:
                cat = tmpl["category"]
                photos = CATEGORY_PHOTOS.get(cat, CATEGORY_PHOTOS["World"])
                img_url = random.choice(photos)

                art = NewsArticleModel(
                    id=f"art_glob_{uuid.uuid4().hex[:10]}",
                    title=tmpl["title"].format(country=country_name),
                    summary=tmpl["summary"].format(country=country_name),
                    content=tmpl["content"].format(country=country_name),
                    category=cat,
                    country_code=country_code,
                    country_name=country_name,
                    threat_level=tmpl["threat_level"],
                    threat_type=tmpl["threat_type"],
                    source=tmpl["source"],
                    image_url=img_url,
                    published_at=datetime.utcnow() - timedelta(hours=random.randint(1, 48), minutes=random.randint(0, 59))
                )
                db.add(art)
                added_articles += 1

        db.commit()
        print(f"[Population] Successfully added {added_articles} articles across missing countries!")

        existing_threat_titles = {
            row[0].lower().strip() for row in db.query(ThreatHighlightModel.title).all()
        }
        added_threats = 0
        for th_data in GLOBAL_THREATS:
            if th_data["title"].lower().strip() not in existing_threat_titles:
                th = ThreatHighlightModel(
                    id=f"th_{uuid.uuid4().hex[:8]}",
                    country_code=th_data["country_code"].upper(),
                    country_name=th_data["country_name"],
                    title=th_data["title"],
                    description=th_data["description"],
                    severity=th_data["severity"],
                    threat_type=th_data["threat_type"],
                    latitude=th_data["latitude"],
                    longitude=th_data["longitude"]
                )
                db.add(th)
                added_threats += 1
                existing_threat_titles.add(th_data["title"].lower().strip())

        db.commit()
        print(f"[Population] Added {added_threats} new global hazard alerts.")

        total_countries = db.query(NewsArticleModel.country_code).distinct().count()
        total_articles = db.query(NewsArticleModel).count()
        total_threats = db.query(ThreatHighlightModel).count()
        print(f"[Population Complete] DB now holds {total_articles} articles across {total_countries} countries and {total_threats} threat alerts.")

    except Exception as e:
        db.rollback()
        print(f"[Error] Population failed: {e}")
        raise
    finally:
        db.close()

if __name__ == "__main__":
    populate_all_countries()
