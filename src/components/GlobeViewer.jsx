import React, { useState, useEffect, useRef, useMemo } from "react";
import Globe from "react-globe.gl";

/**
 * Resolves ISO-3 code from GeoJSON properties, handling Natural Earth -99 sentinel.
 */
function getCountryCode(props) {
  if (!props) return "";
  const iso3 = props.ISO_A3;
  const adm0 = props.ADM0_A3;
  const sov = props.SOV_A3;
  if (iso3 && iso3 !== "-99") return iso3.toUpperCase();
  if (adm0 && adm0 !== "-99") return adm0.toUpperCase();
  if (sov && sov !== "-99") return sov.toUpperCase();
  return "";
}

/**
 * Computes accurate mainland centroid for a GeoJSON feature.
 */
function getFeatureCentroid(feature) {
  const geom = feature?.geometry;
  if (!geom) return { lat: 20, lng: 0 };

  let ring;
  if (geom.type === "MultiPolygon") {
    let maxLen = 0;
    let bestRing = null;
    for (const poly of geom.coordinates) {
      const outerRing = poly[0];
      if (outerRing && outerRing.length > maxLen) {
        maxLen = outerRing.length;
        bestRing = outerRing;
      }
    }
    ring = bestRing;
  } else if (geom.type === "Polygon") {
    ring = geom.coordinates[0];
  }

  if (!ring || ring.length === 0) return { lat: 20, lng: 0 };

  let sumLat = 0;
  let sumLng = 0;
  for (const point of ring) {
    sumLng += point[0];
    sumLat += point[1];
  }
  return {
    lat: sumLat / ring.length,
    lng: sumLng / ring.length
  };
}

export default function GlobeViewer({
  countriesGeoJson,
  summaries = [],
  selectedCountry,
  onSelectCountry,
  autoRotate,
  onToggleAutoRotate,
  categoryFilter = "All"
}) {
  const globeRef = useRef();
  const [hoveredPolygon, setHoveredPolygon] = useState(null);
  const [globeDimensions, setGlobeDimensions] = useState({
    width: window.innerWidth,
    height: window.innerHeight
  });

  useEffect(() => {
    const handleResize = () => {
      setGlobeDimensions({
        width: window.innerWidth,
        height: window.innerHeight
      });
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Auto-rotation
  useEffect(() => {
    if (globeRef.current) {
      const controls = globeRef.current.controls();
      if (controls) {
        controls.autoRotate = autoRotate;
        controls.autoRotateSpeed = 0.35;
        controls.enableZoom = true;
      }
    }
  }, [autoRotate]);

  // Smooth camera fly-to on country selection
  useEffect(() => {
    if (selectedCountry && globeRef.current) {
      const { lat, lng } = getFeatureCentroid(selectedCountry);
      globeRef.current.pointOfView({ lat, lng, altitude: 1.6 }, 900);
    }
  }, [selectedCountry]);

  // Summary lookup map
  const summaryMap = useMemo(() => {
    const map = {};
    summaries.forEach((s) => {
      if (s.country_code) map[s.country_code.toUpperCase()] = s;
    });
    return map;
  }, [summaries]);

  // Eye-friendly dark oceanic palette
  const getPolygonCapColor = (polygon) => {
    const props = polygon.properties || {};
    const iso3 = getCountryCode(props);
    const name = props.NAME || props.ADMIN;

    const selectedIso = selectedCountry ? getCountryCode(selectedCountry.properties) : "";
    const selectedName = selectedCountry?.properties?.NAME;

    const isSelected = selectedCountry && (selectedIso === iso3 || selectedName === name);
    const isHovered = hoveredPolygon === polygon;
    const summary = summaryMap[iso3];

    const matchesCategory =
      categoryFilter === "All" ||
      (summary && summary.categories && summary.categories.some(
        (c) => c.toLowerCase() === categoryFilter.toLowerCase()
      ));

    if (isSelected) return "rgba(37, 99, 235, 0.75)";
    if (isHovered) return "rgba(96, 165, 250, 0.5)";

    if (categoryFilter !== "All") {
      if (matchesCategory) {
        return "rgba(37, 99, 235, 0.4)";
      } else {
        return "rgba(15, 23, 42, 0.6)";
      }
    }

    if (summary && summary.total_articles > 0) {
      return "rgba(30, 58, 138, 0.35)";
    }
    return "rgba(15, 23, 42, 0.5)";
  };

  const getPolygonStrokeColor = (polygon) => {
    const props = polygon.properties || {};
    const iso3 = getCountryCode(props);
    const selectedIso = selectedCountry ? getCountryCode(selectedCountry.properties) : "";

    if (selectedIso && selectedIso === iso3) return "#60a5fa";
    if (polygon === hoveredPolygon) return "#93c5fd";
    return "rgba(148, 163, 184, 0.22)";
  };

  // Clean, eye-friendly dark card tooltip
  const getPolygonLabel = ({ properties }) => {
    if (!properties) return "";
    const name = properties.NAME || properties.ADMIN || "Unknown Country";
    const iso3 = getCountryCode(properties);
    const summary = summaryMap[iso3];
    const articleCount = summary ? summary.total_articles : 0;
    const matchesCategory =
      categoryFilter === "All" ||
      (summary && summary.categories && summary.categories.some(
        (c) => c.toLowerCase() === categoryFilter.toLowerCase()
      ));

    return `
      <div style="
        background: #0f172a;
        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.5);
        border: 1px solid rgba(255, 255, 255, 0.12);
        border-radius: 8px;
        padding: 8px 12px;
        color: #f8fafc;
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        pointer-events: none;
      ">
        <div style="font-weight: 600; font-size: 13px; display: flex; align-items: center; justify-content: space-between; gap: 8px;">
          <span>${name}</span>
          <span style="font-size: 10px; color: #60a5fa; background: rgba(59, 130, 246, 0.15); padding: 1px 5px; border-radius: 4px; font-family: monospace;">${iso3}</span>
        </div>
        <div style="font-size: 11px; color: #94a3b8; margin-top: 3px;">
          ${articleCount} ${articleCount === 1 ? "report" : "reports"}
          ${categoryFilter !== "All" ? ` • ${categoryFilter}: ${matchesCategory ? "Active" : "None"}` : ""}
        </div>
      </div>
    `;
  };

  return (
    <div className="relative w-full h-full bg-[#070b14] overflow-hidden">
      <Globe
        ref={globeRef}
        width={globeDimensions.width}
        height={globeDimensions.height}
        globeImageUrl="//unpkg.com/three-globe/example/img/earth-night.jpg"
        backgroundImageUrl="//unpkg.com/three-globe/example/img/night-sky.png"
        atmosphereColor="#3b82f6"
        atmosphereAltitude={0.16}
        polygonsData={countriesGeoJson ? countriesGeoJson.features : []}
        polygonCapColor={getPolygonCapColor}
        polygonSideColor={() => "rgba(10, 15, 25, 0.7)"}
        polygonStrokeColor={getPolygonStrokeColor}
        polygonAltitude={0.01}
        polygonLabel={getPolygonLabel}
        onPolygonHover={setHoveredPolygon}
        onPolygonClick={(polygon) => {
          if (autoRotate) onToggleAutoRotate(false);
          onSelectCountry(polygon);
        }}
      />
    </div>
  );
}
