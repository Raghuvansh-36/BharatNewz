import React, { useState } from "react";
import { Search, Globe as GlobeIcon, Plus, RefreshCw } from "lucide-react";

export default function HeaderHUD({
  countries = [],
  onSelectCountryByName,
  categoryFilter,
  onSelectCategory,
  onOpenAddModal,
  onTriggerLiveScrape,
  isScraping = false,
  viewMode = "globe"
}) {
  const [searchTerm, setSearchTerm] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const categories = ["All", "World", "Politics", "Environment", "Health", "Tech"];

  const filteredCountries = countries.filter((c) => {
    const name = c.properties?.NAME || c.properties?.ADMIN || "";
    const iso3 = c.properties?.ISO_A3 && c.properties?.ISO_A3 !== "-99"
      ? c.properties.ISO_A3
      : (c.properties?.ADM0_A3 || "");
    return (
      name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      iso3.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  const handleSelectCountry = (name) => {
    onSelectCountryByName(name);
    setSearchTerm("");
    setIsDropdownOpen(false);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      if (filteredCountries.length > 0) {
        const name = filteredCountries[0].properties?.NAME || filteredCountries[0].properties?.ADMIN;
        handleSelectCountry(name);
      }
    }
  };

  const isLight = viewMode === "editorial";

  return (
    <header className="fixed top-0 left-0 right-0 z-30 px-3 sm:px-4 xl:px-8 py-3 flex items-center justify-between gap-2 xl:gap-4 pointer-events-none">
      {/* Brand Logo */}
      <div
        className={`flex items-center gap-2 px-3 py-1.5 sm:py-2 rounded-xl pointer-events-auto shrink-0 transition-all ${
          isLight ? "neu-flat-light" : "neu-flat-dark"
        }`}
      >
        <div className="w-7 h-7 rounded-lg bg-blue-600 flex items-center justify-center shadow-sm">
          <GlobeIcon className="w-4 h-4 text-white" />
        </div>
        <div>
          <h1 className={`text-sm font-bold tracking-tight leading-none ${isLight ? "text-slate-900" : "text-white"}`}>
            BharatNewz
          </h1>
          <p className="text-[10px] text-slate-500 font-medium leading-none mt-0.5">Global News Visualizer</p>
        </div>
      </div>

      {/* Center: Search + Category Filters */}
      <div
        className={`hidden md:flex items-center gap-1 xl:gap-2 p-1.5 rounded-2xl pointer-events-auto shrink-0 transition-all ${
          isLight ? "neu-flat-light" : "neu-flat-dark"
        }`}
      >
        {/* Search Input */}
        <div className="relative w-28 sm:w-32 lg:w-36 xl:w-48">
          <div
            className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl transition-all ${
              isLight ? "neu-pressed-light" : "neu-pressed-dark"
            }`}
          >
            <Search className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <input
              type="text"
              placeholder="Search country..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setIsDropdownOpen(true);
              }}
              onFocus={() => setIsDropdownOpen(true)}
              onKeyDown={handleKeyDown}
              className={`bg-transparent text-xs outline-none w-full font-medium ${
                isLight ? "text-slate-900 placeholder-slate-400" : "text-white placeholder-slate-500"
              }`}
            />
          </div>

          {/* Autocomplete Dropdown */}
          {isDropdownOpen && searchTerm.trim() !== "" && (
            <div
              className={`absolute top-full left-0 right-0 mt-2 max-h-60 overflow-y-auto shadow-xl z-50 divide-y custom-scrollbar rounded-lg ${
                isLight
                  ? "bg-white border border-slate-200 divide-slate-100"
                  : "bg-slate-900 border border-slate-700 divide-slate-800"
              }`}
            >
              {filteredCountries.length > 0 ? (
                filteredCountries.slice(0, 8).map((c, i) => {
                  const name = c.properties?.NAME || c.properties?.ADMIN || "Unknown";
                  const iso3 = c.properties?.ISO_A3 && c.properties?.ISO_A3 !== "-99"
                    ? c.properties.ISO_A3
                    : (c.properties?.ADM0_A3 || "");
                  return (
                    <button
                      key={i}
                      onClick={() => handleSelectCountry(name)}
                      className={`w-full text-left px-3 py-2 text-xs transition-colors flex items-center justify-between ${
                        isLight
                          ? "hover:bg-slate-100 text-slate-800"
                          : "hover:bg-slate-800 text-slate-200"
                      }`}
                    >
                      <span className="font-medium">{name}</span>
                      <span className={`text-[10px] px-1.5 py-0.5 rounded font-mono ${
                        isLight ? "bg-slate-100 text-slate-600" : "bg-slate-800 text-slate-400"
                      }`}>{iso3}</span>
                    </button>
                  );
                })
              ) : (
                <div className="px-3 py-2 text-xs text-slate-400 text-center">No matching country</div>
              )}
            </div>
          )}
        </div>

        <div className={`h-4 w-px ${isLight ? "bg-slate-300" : "bg-slate-700"}`} />

        {/* Category Filters */}
        <div className="flex items-center gap-1">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => onSelectCategory(cat)}
              className={`px-2.5 py-1.5 xl:px-3.5 xl:py-2 text-xs font-semibold rounded-xl whitespace-nowrap transition-all cursor-pointer ${
                categoryFilter === cat
                  ? "neu-active-filter"
                  : isLight
                  ? "neu-btn-light text-slate-600 hover:text-slate-900"
                  : "neu-btn-dark text-slate-400 hover:text-white"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Right Action Controls */}
      <div className="flex items-center gap-2 pointer-events-auto shrink-0">
        <button
          onClick={onTriggerLiveScrape}
          disabled={isScraping}
          className={`flex items-center gap-1.5 px-3 py-1.5 sm:px-3.5 sm:py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer whitespace-nowrap shrink-0 ${
            isLight ? "neu-btn-light text-slate-700 hover:text-slate-950" : "neu-btn-dark text-slate-200 hover:text-white"
          }`}
        >
          <RefreshCw className={`w-3.5 h-3.5 text-blue-500 ${isScraping ? "animate-spin" : ""}`} />
          <span className="hidden sm:inline">{isScraping ? "Syncing..." : "Sync News"}</span>
        </button>

        <button
          onClick={onOpenAddModal}
          className="flex items-center gap-1.5 bg-blue-600 hover:bg-blue-500 active:bg-blue-700 text-white px-3.5 py-1.5 sm:px-4 sm:py-2 rounded-xl text-xs sm:text-sm font-semibold shadow-md hover:shadow-lg transition-all cursor-pointer whitespace-nowrap shrink-0"
        >
          <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
          <span className="hidden sm:inline">Add News</span>
        </button>
      </div>
    </header>
  );
}
