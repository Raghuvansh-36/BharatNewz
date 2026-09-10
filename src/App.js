import React, { useState, useEffect, useCallback } from "react";
import GlobeViewer from "./components/GlobeViewer";
import HeaderHUD from "./components/HeaderHUD";
import CountryModal from "./components/CountryModal";
import AddArticleModal from "./components/AddArticleModal";
import EditorialFeed from "./components/EditorialFeed";
import { Globe as GlobeIcon, Newspaper, Check } from "lucide-react";
import { fetchNewsArticles, fetchCountrySummaries, triggerNewsScrape } from "./services/api";

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

export default function App() {
  const [countriesGeoJson, setCountriesGeoJson] = useState(null);
  const [newsArticles, setNewsArticles] = useState([]);
  const [summaries, setSummaries] = useState([]);

  const [selectedCountry, setSelectedCountry] = useState(null);
  const [countryArticles, setCountryArticles] = useState([]);
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [autoRotate, setAutoRotate] = useState(true);
  const [viewMode, setViewMode] = useState("globe");
  const [isScraping, setIsScraping] = useState(false);
  const [syncToast, setSyncToast] = useState(null);

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [addModalInitialCountry, setAddModalInitialCountry] = useState({ code: "USA", name: "United States of America" });

  // Load GeoJSON dataset
  useEffect(() => {
    fetch("/countries.json")
      .then((res) => res.json())
      .then((data) => setCountriesGeoJson(data))
      .catch((err) => console.error("Error loading countries GeoJSON:", err));
  }, []);

  // Fetch news & country summaries
  const loadData = useCallback(async () => {
    const [articlesData, summariesData] = await Promise.all([
      fetchNewsArticles({ category: categoryFilter }),
      fetchCountrySummaries()
    ]);
    setNewsArticles(articlesData);
    setSummaries(summariesData);
  }, [categoryFilter]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // When selected country or category filter changes, fetch country-specific articles
  useEffect(() => {
    if (!selectedCountry) {
      setCountryArticles([]);
      return;
    }
    const props = selectedCountry.properties || {};
    const iso3 = getCountryCode(props);
    const name = props.NAME || props.ADMIN || "";
    if (!iso3) return;

    fetchNewsArticles({
      country_code: iso3,
      country_name: name,
      category: categoryFilter
    }).then((arts) => {
      setCountryArticles(arts);
    });
  }, [selectedCountry, categoryFilter]);

  // Sync news with tangible toast feedback
  const handleTriggerLiveScrape = async () => {
    setIsScraping(true);
    try {
      const res = await triggerNewsScrape();
      await loadData();
      const count = res?.new_articles_count || 0;
      setSyncToast(
        count > 0
          ? `Synced ${count} new live wire reports into database.`
          : "Sync complete. All global wire feeds are up to date."
      );
    } catch (e) {
      setSyncToast("Sync cycle finished.");
    } finally {
      setIsScraping(false);
      setTimeout(() => setSyncToast(null), 4000);
    }
  };

  const handleSelectCountryByCode = (countryCode) => {
    if (!countriesGeoJson) return;
    const match = countriesGeoJson.features.find((f) => {
      const code = getCountryCode(f.properties);
      return code === countryCode.toUpperCase();
    });
    if (match) {
      setSelectedCountry(match);
      setViewMode("globe");
      setAutoRotate(false);
    }
  };

  const handleSelectCountry = (countryFeature) => {
    setSelectedCountry(countryFeature);
    if (countryFeature) {
      setAutoRotate(false);
    }
  };

  const handleSelectCountryByName = (countryQuery) => {
    if (!countriesGeoJson) return;
    const q = countryQuery.toLowerCase().trim();
    const match = countriesGeoJson.features.find((f) => {
      const name = (f.properties?.NAME || f.properties?.ADMIN || "").toLowerCase();
      const iso3 = getCountryCode(f.properties).toLowerCase();
      return name === q || iso3 === q || name.includes(q);
    });
    if (match) {
      handleSelectCountry(match);
      if (viewMode !== "globe") setViewMode("globe");
    }
  };

  const handleOpenAddModal = (code = "USA", name = "United States of America") => {
    setAddModalInitialCountry({ code, name });
    setIsAddModalOpen(true);
  };

  const isLight = viewMode === "editorial";

  return (
    <div className={`relative w-full h-screen overflow-hidden font-sans select-none transition-colors duration-300 ${
      isLight ? "bg-[#e6ecf4] text-slate-900" : "bg-[#070b14] text-slate-100"
    }`}>
      {/* Top Navbar */}
      <HeaderHUD
        countries={countriesGeoJson ? countriesGeoJson.features : []}
        onSelectCountryByName={handleSelectCountryByName}
        categoryFilter={categoryFilter}
        onSelectCategory={setCategoryFilter}
        onOpenAddModal={() => handleOpenAddModal()}
        onTriggerLiveScrape={handleTriggerLiveScrape}
        isScraping={isScraping}
        viewMode={viewMode}
      />

      {/* Sync Status Toast */}
      {syncToast && (
        <div className={`fixed top-16 left-1/2 transform -translate-x-1/2 z-50 px-4 py-2.5 flex items-center gap-2 border shadow-xl rounded-lg transition-all ${
          isLight
            ? "neu-flat-light border-slate-300 text-slate-800"
            : "neu-flat-dark border-slate-700 text-slate-100"
        }`}>
          <Check className="w-4 h-4 text-emerald-400 shrink-0" />
          <span className="text-xs font-semibold">{syncToast}</span>
        </div>
      )}

      {/* View Mode 1: 3D Earth Visualizer (Eye-friendly dark space) */}
      {viewMode === "globe" ? (
        <>
          <GlobeViewer
            countriesGeoJson={countriesGeoJson}
            summaries={summaries}
            selectedCountry={selectedCountry}
            onSelectCountry={handleSelectCountry}
            autoRotate={autoRotate}
            onToggleAutoRotate={(val) => setAutoRotate(typeof val === "boolean" ? val : !autoRotate)}
            categoryFilter={categoryFilter}
          />

          {/* Country Detail Drawer */}
          {selectedCountry && (
            <CountryModal
              country={selectedCountry}
              articles={countryArticles}
              onClose={() => setSelectedCountry(null)}
              categoryFilter={categoryFilter}
              onSelectCategory={setCategoryFilter}
              onOpenAddModal={handleOpenAddModal}
            />
          )}
        </>
      ) : (
        /* View Mode 2: Editorial News Feed */
        <div className="w-full h-full overflow-y-auto custom-scrollbar">
          <EditorialFeed
            articles={newsArticles}
            categoryFilter={categoryFilter}
            onSelectCountryByCode={handleSelectCountryByCode}
          />
        </div>
      )}

      {/* Corner View Switcher Button */}
      <button
        onClick={() => setViewMode(viewMode === "globe" ? "editorial" : "globe")}
        title={viewMode === "globe" ? "Switch to Editorial Feed" : "Switch to 3D Globe"}
        className={`fixed bottom-6 left-6 z-40 w-12 h-12 rounded-2xl flex items-center justify-center border cursor-pointer shadow-lg transition-all ${
          isLight
            ? "neu-btn-light text-blue-600 border-slate-300 hover:scale-105"
            : "neu-btn-dark text-blue-400 border-slate-700 hover:scale-105"
        }`}
      >
        {viewMode === "globe" ? (
          <Newspaper className="w-5 h-5" />
        ) : (
          <GlobeIcon className="w-5 h-5" />
        )}
      </button>

      {/* Add Article Modal */}
      <AddArticleModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        initialCountryCode={addModalInitialCountry.code}
        initialCountryName={addModalInitialCountry.name}
        onSuccess={() => loadData()}
      />
    </div>
  );
}
