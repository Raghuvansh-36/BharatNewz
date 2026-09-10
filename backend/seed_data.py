from datetime import datetime, timedelta
from database import SessionLocal, engine, Base
from models import NewsArticleModel, ThreatHighlightModel

def seed_db():
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()

    try:
        # Check if DB already populated with seed data
        article_count = db.query(NewsArticleModel).count()
        if article_count >= 10:
            print(f"[Seed] Database already contains {article_count} articles. Skipping seed.")
            return

        print("[Seed] Seeding database with initial news articles and threat highlights...")

        # ----------------------------------------------------
        # THREAT HIGHLIGHTS DATA (Natural disasters & major alerts)
        # ----------------------------------------------------
        threats = [
            ThreatHighlightModel(
                id="th_usa_hurricane",
                title="Category 4 Hurricane 'Helene' Approaching East Coast",
                description="Heavy storm surges, 140mph winds, and massive torrential rain forecasted across coastal states. Coastal evacuations ordered.",
                threat_type="hurricane",
                severity="critical",
                country_code="USA",
                country_name="United States of America",
                latitude=28.5383,
                longitude=-81.3792,
                radius_km=350.0
            ),
            ThreatHighlightModel(
                id="th_ind_flood",
                title="Severe Monsoon Flooding across Yamuna Basin",
                description="Submerged low-lying regions, displacement of over 200,000 residents, and emergency relief operations active across Northern states.",
                threat_type="flood",
                severity="high",
                country_code="IND",
                country_name="India",
                latitude=28.6139,
                longitude=77.2090,
                radius_km=300.0
            ),
            ThreatHighlightModel(
                id="th_jpn_earthquake",
                title="Magnitude 7.1 Offshore Earthquake Warning",
                description="Tsunami advisory issued for East Coast regions following undersea seismic activity. Emergency services on high alert.",
                threat_type="earthquake",
                severity="critical",
                country_code="JPN",
                country_name="Japan",
                latitude=35.6762,
                longitude=139.6503,
                radius_km=250.0
            ),
            ThreatHighlightModel(
                id="th_bra_wildfire",
                title="Amazon Basin Wildfires Spreading Rapidly",
                description="Extreme heatwave and dry winds fueling uncontained bushfires across southern ecological reserves. Smoke haze reaching urban centers.",
                threat_type="wildfire",
                severity="high",
                country_code="BRA",
                country_name="Brazil",
                latitude=-15.7975,
                longitude=-47.8919,
                radius_km=400.0
            ),
            ThreatHighlightModel(
                id="th_aus_wildfire",
                title="Southern bushfire alert amid record summer heatwave",
                description="Temperatures reaching 44°C trigger emergency red alerts across Victoria and South Australia fire danger districts.",
                threat_type="wildfire",
                severity="high",
                country_code="AUS",
                country_name="Australia",
                latitude=-33.8688,
                longitude=151.2093,
                radius_km=320.0
            ),
            ThreatHighlightModel(
                id="th_egy_heat",
                title="North African Extreme Heatwave Alert",
                description="Dangerous heatwave over 47°C stressing power grids and agricultural irrigation along the Nile delta.",
                threat_type="epidemic",
                severity="medium",
                country_code="EGY",
                country_name="Egypt",
                latitude=30.0444,
                longitude=31.2357,
                radius_km=200.0
            ),
            ThreatHighlightModel(
                id="th_deu_flood",
                title="Central European River Surge Warning",
                description="Rhine river levels rising past critical thresholds, halting cargo transit and prompting flood barriers in western cities.",
                threat_type="flood",
                severity="medium",
                country_code="DEU",
                country_name="Germany",
                latitude=52.5200,
                longitude=13.4050,
                radius_km=180.0
            )
        ]

        for th in threats:
            db.add(th)

        # ----------------------------------------------------
        # NEWS ARTICLES DATA
        # ----------------------------------------------------
        now = datetime.utcnow()
        articles = [
            # USA
            NewsArticleModel(
                id="art_usa_001",
                title="Coast Guard Deploys Rescue Fleets Ahead of Hurricane Helene Impact",
                summary="Over 5,000 emergency personnel deployed to southern ports as Hurricane Helene threatens major infrastructure.",
                content="Emergency relief convoys and military transport aircraft have established logistics hubs in Georgia and Florida. Governors have declared state emergency zones.",
                category="Disasters",
                country_code="USA",
                country_name="United States of America",
                threat_level="critical",
                threat_type="hurricane",
                source="Global Weather Wire",
                image_url="https://images.unsplash.com/photo-1527482797697-8795b05a13fe?w=600",
                published_at=now - timedelta(hours=2)
            ),
            NewsArticleModel(
                id="art_usa_002",
                title="Federal Tech Summit Unveils Next-Gen AI Safety Protocol",
                summary="Leaders from silicon valley gather to establish transparent guidelines for autonomous AI deployment.",
                content="The newly announced standard focuses on cybersecurity resilience, data privacy, and ethical guardrails for global AI models.",
                category="Tech",
                country_code="USA",
                country_name="United States of America",
                threat_level="none",
                threat_type="none",
                source="Tech Chronicle",
                image_url="https://images.unsplash.com/photo-1518770660439-4636190af475?w=600",
                published_at=now - timedelta(hours=8)
            ),

            # INDIA
            NewsArticleModel(
                id="art_ind_001",
                title="National Disaster Response Force Mobilizes 40 Teams for Yamuna Flood Relief",
                summary="Rescue operations underway in flooded districts as heavy rains continue in upper catchment zones.",
                content="Relief shelters have provided food and medical help to affected communities. Water purification plants are working around the clock.",
                category="Disasters",
                country_code="IND",
                country_name="India",
                threat_level="high",
                threat_type="flood",
                source="Bharat News Daily",
                image_url="https://images.unsplash.com/photo-1547683905-f686c993aae5?w=600",
                published_at=now - timedelta(hours=1)
            ),
            NewsArticleModel(
                id="art_ind_002",
                title="India Launches Clean Energy Expansion Target for 2030",
                summary="New solar power grid projects approved to add 150GW of renewable capacity across Rajasthan and Gujarat.",
                content="The initiative aims to significantly lower carbon emissions while accelerating rural electrification through microgrid technology.",
                category="Environment",
                country_code="IND",
                country_name="India",
                threat_level="none",
                threat_type="none",
                source="Green Horizon Press",
                image_url="https://images.unsplash.com/photo-1509391365360-2e959784a276?w=600",
                published_at=now - timedelta(hours=14)
            ),

            # JAPAN
            NewsArticleModel(
                id="art_jpn_001",
                title="Coastal Early-Warning Bulletins Active Following Offshore 7.1 Magnitude Quake",
                summary="Automated warning systems triggered coastal sirens within 4 seconds of seismic tremor detection.",
                content="Bullet trains automatically halted operations as safety protocols engaged. No structural damage reported in Tokyo center.",
                category="Disasters",
                country_code="JPN",
                country_name="Japan",
                threat_level="critical",
                threat_type="earthquake",
                source="Pacific Wire",
                image_url="https://images.unsplash.com/photo-1503899036084-c55cdd92da26?w=600",
                published_at=now - timedelta(minutes=45)
            ),
            NewsArticleModel(
                id="art_jpn_002",
                title="Tokyo Robotics Expo Features Breakthrough Healthcare Assistants",
                summary="Next-generation assistive humanoid robots designed to support elderly patients showcased in Odaiba.",
                content="The interactive prototypes combine soft-touch sensors with predictive natural language models for elder care facilities.",
                category="Tech",
                country_code="JPN",
                country_name="Japan",
                threat_level="none",
                threat_type="none",
                source="Nikkei Tech",
                image_url="https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=600",
                published_at=now - timedelta(hours=18)
            ),

            # BRAZIL
            NewsArticleModel(
                id="art_bra_001",
                title="Firefighters Battling Dry Season Wildfires Across Amazon Reserves",
                summary="Satellite thermal imagery detects multi-kilometer smoke plumes spreading toward southern state borders.",
                content="Rainforest conservation units and air tankers are dropping water fire retardant to prevent flames from reaching indigenous protected land.",
                category="Environment",
                country_code="BRA",
                country_name="Brazil",
                threat_level="high",
                threat_type="wildfire",
                source="South America Today",
                image_url="https://images.unsplash.com/photo-1516214104703-d870798883c5?w=600",
                published_at=now - timedelta(hours=3)
            ),

            # UK
            NewsArticleModel(
                id="art_gbr_001",
                title="UK Parliament Passes New Offshore Wind Turbine Investment Package",
                summary="Multi-billion pound clean energy funding approved for North Sea deepwater floating wind arrays.",
                content="Energy ministers highlighted that the new offshore developments will supply zero-carbon electricity to over 8 million homes by 2028.",
                category="Environment",
                country_code="GBR",
                country_name="United Kingdom",
                threat_level="none",
                threat_type="none",
                source="London Sentinel",
                image_url="https://images.unsplash.com/photo-1466611653911-95081537e5b7?w=600",
                published_at=now - timedelta(hours=10)
            ),
            NewsArticleModel(
                id="art_gbr_002",
                title="Global Health Summit Advocates Unified Pandemic Readiness Grid",
                summary="Medical researchers call for open genomic database sharing across international healthcare agencies.",
                content="Delegates emphasized early detection of zoonotic strains to prevent regional outbreaks from turning global.",
                category="Health",
                country_code="GBR",
                country_name="United Kingdom",
                threat_level="low",
                threat_type="epidemic",
                source="Global Health Journal",
                image_url="https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=600",
                published_at=now - timedelta(hours=22)
            ),

            # GERMANY
            NewsArticleModel(
                id="art_deu_001",
                title="Rhine River Navigation Suspended Near Kaub Due to High Surge Levels",
                summary="Heavy rainfall in Switzerland elevates Rhine water marks above maximum navigable limits.",
                content="Barge operators are delaying heavy machinery freight shipments until water levels normalize over the weekend.",
                category="Disasters",
                country_code="DEU",
                country_name="Germany",
                threat_level="medium",
                threat_type="flood",
                source="European Express",
                image_url="https://images.unsplash.com/photo-1513622470522-26c3c8a854bc?w=600",
                published_at=now - timedelta(hours=5)
            ),

            # AUSTRALIA
            NewsArticleModel(
                id="art_aus_001",
                title="State Fire Services Enforce Total Fire Bans Across Victoria",
                summary="Record temperatures and 50km/h dry winds prompt total outdoor fire bans in farm districts.",
                content="Water bombers have been positioned at regional airfields as emergency services prepare for peak afternoon conditions.",
                category="Disasters",
                country_code="AUS",
                country_name="Australia",
                threat_level="high",
                threat_type="wildfire",
                source="Sydney Herald",
                image_url="https://images.unsplash.com/photo-1508873696983-2df515122519?w=600",
                published_at=now - timedelta(hours=4)
            ),

            # EGYPT
            NewsArticleModel(
                id="art_egy_001",
                title="Extreme Temperature Warning Prompts Health Precautions in Cairo",
                summary="Public health officials advise citizens to remain indoors during peak heat index hours.",
                content="Cooling centers and mobile hydration units have been stationed across high-density neighborhoods.",
                category="Health",
                country_code="EGY",
                country_name="Egypt",
                threat_level="medium",
                threat_type="epidemic",
                source="Middle East News",
                image_url="https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?w=600",
                published_at=now - timedelta(hours=6)
            ),

            # FRANCE
            NewsArticleModel(
                id="art_fra_001",
                title="European Aerospace Consortium Unveils Zero-Emission Hydrogen Concept",
                summary="Test flights for commercial hydrogen turbine engines slated for late 2027.",
                content="The initiative combines cryogenic fuel storage with light composite airframes to eliminate carbon emissions in flight.",
                category="Tech",
                country_code="FRA",
                country_name="France",
                threat_level="none",
                threat_type="none",
                source="Paris Tech Digest",
                image_url="https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=600",
                published_at=now - timedelta(hours=16)
            )
        ]

        for art in articles:
            db.add(art)

        db.commit()
        print(f"[Seed] Successfully seeded {len(articles)} news articles and {len(threats)} threat highlights into PostgreSQL!")

    except Exception as e:
        db.rollback()
        print(f"[Seed] Error seeding database: {e}")
    finally:
        db.close()

if __name__ == "__main__":
    seed_db()
