import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import 'maplibre-gl/dist/maplibre-gl.css';

export const regions = [
  { id: 'india', label: 'India', type: 'country', country: 'in', coordinates: [78.96, 20.59] },
  { id: 'united-states', label: 'United States', type: 'country', country: 'us', coordinates: [-100, 38] },
  { id: 'united-kingdom', label: 'United Kingdom', type: 'country', country: 'gb', coordinates: [-3.44, 55.38] },
  { id: 'uae', label: 'UAE', type: 'country', country: 'ae', coordinates: [53.85, 23.42] },
  { id: 'australia', label: 'Australia', type: 'country', country: 'au', coordinates: [133.78, -25.27] },
  { id: 'singapore', label: 'Singapore', type: 'country', country: 'sg', coordinates: [103.82, 1.35] },
  { id: 'delhi', label: 'Delhi', type: 'state', country: 'in', query: 'Delhi India', coordinates: [77.1, 28.7] },
  { id: 'maharashtra', label: 'Maharashtra', type: 'state', country: 'in', query: 'Maharashtra India', coordinates: [75.71, 19.75] },
  { id: 'karnataka', label: 'Karnataka', type: 'state', country: 'in', query: 'Karnataka India', coordinates: [75.71, 15.32] },
  { id: 'tamil-nadu', label: 'Tamil Nadu', type: 'state', country: 'in', query: 'Tamil Nadu India', coordinates: [78.66, 11.13] },
  { id: 'west-bengal', label: 'West Bengal', type: 'state', country: 'in', query: 'West Bengal India', coordinates: [87.85, 22.99] },
];

const Home = () => {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const countries = regions.filter((region) => region.type === 'country');
  const indianStates = regions.filter((region) => region.type === 'state');
  const mapContainerRef = useRef(null);
  const visibleRegions = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase();
    if (!normalizedSearch) return regions;
    return regions.filter((region) => region.label.toLowerCase().includes(normalizedSearch));
  }, [search]);

  const openRegion = (region) => navigate(`/region/${region.id}`);

  useEffect(() => {
    if (!mapContainerRef.current || process.env.NODE_ENV === 'test') return undefined;

    let map;
    let disposed = false;

    import('maplibre-gl').then(({ Map, Marker, NavigationControl }) => {
      if (disposed) return;

      map = new Map({
      container: mapContainerRef.current,
      style: {
        version: 8,
        sources: {
          osm: {
            type: 'raster',
            tiles: ['https://tile.openstreetmap.org/{z}/{x}/{y}.png'],
            tileSize: 256,
            attribution: '&copy; OpenStreetMap contributors',
          },
        },
        layers: [{ id: 'osm', type: 'raster', source: 'osm' }],
      },
      center: [20, 20],
      zoom: 1.15,
      minZoom: 1,
      maxZoom: 6,
      projection: { type: 'globe' },
      attributionControl: true,
      });

      map.addControl(new NavigationControl({ showCompass: false }), 'top-right');

      map.on('load', () => {
        map.addSource('country-boundaries', {
          type: 'geojson',
          data: 'https://raw.githubusercontent.com/datasets/geo-countries/master/data/countries.geojson',
        });
        map.addLayer({
          id: 'country-fill',
          type: 'fill',
          source: 'country-boundaries',
          paint: {
            'fill-color': '#1b6685',
            'fill-opacity': 0.2,
          },
        });
        map.addLayer({
          id: 'country-outline',
          type: 'line',
          source: 'country-boundaries',
          paint: {
            'line-color': '#79c8dc',
            'line-opacity': 0.48,
            'line-width': 0.65,
          },
        });
        map.addLayer({
          id: 'country-hover',
          type: 'fill',
          source: 'country-boundaries',
          paint: {
            'fill-color': '#55d7aa',
            'fill-opacity': 0.48,
          },
          filter: ['==', ['get', 'ISO_A2'], ''],
        });

        map.on('mousemove', 'country-fill', (event) => {
          const country = event.features?.[0]?.properties;
          const code = country?.ISO_A2 || country?.ISO_A2_EH;
          if (code) map.setFilter('country-hover', ['==', ['get', 'ISO_A2'], code]);
          map.getCanvas().style.cursor = 'pointer';
        });
        map.on('mouseleave', 'country-fill', () => {
          map.setFilter('country-hover', ['==', ['get', 'ISO_A2'], '']);
          map.getCanvas().style.cursor = '';
        });
        map.on('click', 'country-fill', (event) => {
          const properties = event.features?.[0]?.properties || {};
          const countryCode = (properties.ISO_A2 || properties.ISO_A2_EH || '').toLowerCase();
          const countryName = properties.ADMIN || properties.NAME || properties.name;
          if (countryName) {
            const routeCode = countryCode && countryCode !== '-99' ? countryCode : 'world';
            navigate(`/country/${routeCode}/${encodeURIComponent(countryName)}`);
          }
        });
      });

      regions.filter((region) => region.type === 'state').forEach((region) => {
        const markerButton = document.createElement('button');
        markerButton.className = 'map-region-marker map-state-marker';
        markerButton.type = 'button';
        markerButton.title = `View ${region.label} news`;
        markerButton.setAttribute('aria-label', `View ${region.label} news`);
        markerButton.innerHTML = `<span></span><strong>${region.label}</strong>`;
        markerButton.addEventListener('click', () => navigate(`/region/${region.id}`));

        new Marker({ element: markerButton, anchor: 'bottom' })
          .setLngLat(region.coordinates)
          .addTo(map);
      });
    });

    return () => {
      disposed = true;
      map?.remove();
    };
  }, [navigate]);

  return (
    <main className="home-page home-dashboard">
      <div className="map-frame map-dashboard-frame">
        <div className="map-container" ref={mapContainerRef} aria-label="OpenStreetMap world map" />
        <div className="map-vignette" aria-hidden="true" />
        <div className="map-credit">OpenStreetMap</div>

        <section className="map-hero" aria-label="BharatNewz regional news map">
          <p className="home-kicker"><span className="live-dot" /> Live regional desk</p>
          <h1>BharatNewz</h1>
          <p>Click a place to read the news shaping it now.</p>
        </section>

        <section className="map-stats" aria-label="Available news regions">
          <div className="map-stat"><strong>{regions.length}</strong><span>local editions</span></div>
          <div className="map-stat"><strong>{countries.length}</strong><span>countries</span></div>
          <div className="map-stat"><strong>{indianStates.length}</strong><span>Indian states</span></div>
        </section>

        <div className="map-instruction">Click any country to read its news</div>

        <aside className="region-dock" aria-label="Search regional editions">
          <div className="dock-heading">
            <div>
              <p className="home-kicker">Explore editions</p>
              <h2>Where should we look?</h2>
            </div>
            <span className="dock-count">{visibleRegions.length}/{regions.length}</span>
          </div>
          <label className="region-search">
            <span aria-hidden="true">⌕</span>
            <input
              type="search"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search country or state"
              aria-label="Search country or state"
            />
          </label>
          <div className="dock-list">
            {visibleRegions.map((region) => (
              <button className="dock-region" key={region.id} type="button" onClick={() => openRegion(region)}>
                <span className={`dock-marker ${region.type === 'state' ? 'dock-state-marker' : ''}`} />
                <span>{region.label}</span>
                <span className="dock-arrow" aria-hidden="true">↗</span>
              </button>
            ))}
            {!visibleRegions.length && <p className="dock-empty">No matching edition.</p>}
          </div>
          <div className="map-legend">
            <span><i className="legend-country" /> Country</span>
            <span><i className="legend-state" /> Indian state</span>
          </div>
        </aside>
      </div>
    </main>
  );
};

export default Home;
