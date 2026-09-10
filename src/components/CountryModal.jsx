import React, { useState } from "react";
import { X, Plus, Bookmark, Heart } from "lucide-react";

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

export default function CountryModal({
  country,
  articles = [],
  onClose,
  categoryFilter,
  onSelectCategory,
  onOpenAddModal
}) {
  const [expandedArticleId, setExpandedArticleId] = useState(null);
  const [bookmarkedIds, setBookmarkedIds] = useState(new Set());
  const [likedIds, setLikedIds] = useState(new Set());

  if (!country) return null;

  const countryName = country.properties?.NAME || country.properties?.ADMIN || "Selected Country";
  const iso3 = getCountryCode(country.properties);

  const categories = ["All", "World", "Politics", "Environment", "Health", "Tech"];

  const filteredArticles = articles.filter((art) => {
    if (categoryFilter === "All") return true;
    return art.category.toLowerCase() === categoryFilter.toLowerCase();
  });

  const toggleBookmark = (id, e) => {
    e.stopPropagation();
    setBookmarkedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const toggleLike = (id, e) => {
    e.stopPropagation();
    setLikedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  return (
    <div className="fixed inset-y-0 right-0 z-40 w-full max-w-md flex flex-col transition-all duration-300">
      <div className="flex flex-col h-full neu-flat-dark rounded-l-2xl overflow-hidden border-l border-slate-800 text-slate-100">
        {/* Header */}
        <div className="px-5 py-4 flex items-center justify-between border-b border-slate-800">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-bold text-white tracking-tight">{countryName}</h2>
              <span className="text-xs font-medium px-2 py-0.5 rounded bg-blue-500/20 text-blue-400 font-mono">
                {iso3}
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              {articles.length} {articles.length === 1 ? "report available" : "reports available"}
            </p>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl neu-btn-dark text-slate-400 hover:text-white transition-all cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Category Filters */}
        <div className="px-4 py-3 border-b border-slate-800 flex items-center gap-2 overflow-x-auto custom-scrollbar">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => onSelectCategory(cat)}
              className={`px-3.5 py-2 text-xs font-semibold rounded-xl whitespace-nowrap transition-all cursor-pointer ${
                categoryFilter === cat
                  ? "neu-active-filter"
                  : "neu-btn-dark text-slate-400 hover:text-slate-200"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Article Feed */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3.5 custom-scrollbar">
          {filteredArticles.length > 0 ? (
            filteredArticles.map((art) => {
              const isExpanded = expandedArticleId === art.id;
              return (
                <div
                  key={art.id}
                  className="neu-flat-dark p-3.5 space-y-2.5 transition-all"
                >
                  {/* Thumbnail */}
                  {art.image_url && (
                    <div className="w-full h-36 rounded-lg overflow-hidden bg-slate-900">
                      <img
                        src={art.image_url}
                        alt={art.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}

                  {/* Metadata */}
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-[11px] font-semibold text-blue-400">
                      {art.category}
                    </span>
                    <span className="text-slate-500 font-mono text-[10px]">
                      {art.source || "Global Wire"}
                    </span>
                  </div>

                  {/* Headline & Summary */}
                  <h3 className="text-sm font-semibold text-white leading-snug">
                    {art.title}
                  </h3>
                  <p className="text-xs text-slate-300 leading-relaxed font-normal">
                    {art.summary}
                  </p>

                  {/* Full Story Content */}
                  {isExpanded && art.content && (
                    <div className="neu-pressed-dark p-3 text-xs text-slate-200 leading-relaxed rounded-lg">
                      {art.content}
                    </div>
                  )}

                  {/* Card Actions */}
                  <div className="flex items-center justify-between pt-3 border-t border-slate-800 text-xs">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={(e) => toggleLike(art.id, e)}
                        className={`p-2 rounded-lg transition-colors cursor-pointer ${
                          likedIds.has(art.id) ? "text-rose-500 bg-rose-500/10" : "text-slate-400 hover:text-rose-400 hover:bg-slate-800"
                        }`}
                      >
                        <Heart className="w-4 h-4" />
                      </button>

                      <button
                        onClick={(e) => toggleBookmark(art.id, e)}
                        className={`p-2 rounded-lg transition-colors cursor-pointer ${
                          bookmarkedIds.has(art.id) ? "text-blue-400 bg-blue-500/10" : "text-slate-400 hover:text-blue-400 hover:bg-slate-800"
                        }`}
                      >
                        <Bookmark className="w-4 h-4" />
                      </button>
                    </div>

                    <button
                      onClick={() => setExpandedArticleId(isExpanded ? null : art.id)}
                      className="px-3 py-1.5 rounded-lg text-xs font-medium text-blue-400 hover:text-blue-300 hover:bg-slate-800/80 transition-all cursor-pointer"
                    >
                      {isExpanded ? "Show Less" : "Read Full Story"}
                    </button>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="text-center py-12 space-y-2">
              <p className="text-sm font-medium text-slate-300">No reports found for this filter</p>
              <p className="text-xs text-slate-500">
                You can contribute the first news report for {countryName}.
              </p>
            </div>
          )}
        </div>

        {/* Action Footer */}
        <div className="p-4 border-t border-slate-800">
          <button
            onClick={() => onOpenAddModal(iso3, countryName)}
            className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs sm:text-sm py-3 px-4 rounded-xl transition-all shadow-md cursor-pointer"
          >
            <Plus className="w-4 h-4 stroke-[2.5]" />
            <span>Add News Report for {countryName}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
