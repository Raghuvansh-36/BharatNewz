import React, { useState } from "react";
import { Bookmark, Heart, TrendingUp, Clock, MapPin, X } from "lucide-react";

export default function EditorialFeed({
  articles = [],
  categoryFilter,
  onSelectCountryByCode
}) {
  const [bookmarkedIds, setBookmarkedIds] = useState(new Set());
  const [likedIds, setLikedIds] = useState(new Set());
  const [expandedArticle, setExpandedArticle] = useState(null);

  const filteredArticles = articles.filter((art) => {
    if (categoryFilter === "All") return true;
    return art.category.toLowerCase() === categoryFilter.toLowerCase();
  });

  const heroArticle = filteredArticles.length > 0 ? filteredArticles[0] : null;
  const gridArticles = filteredArticles.length > 1 ? filteredArticles.slice(1) : [];
  const trendingArticles = articles.slice(0, 6);

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
    <div className="min-h-screen bg-[#e6ecf4] text-slate-900 pt-20 pb-16 px-4 sm:px-6 lg:px-8 xl:px-10 w-full space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 xl:gap-8">
        {/* Left: Featured & Grid (9 Columns on lg+) */}
        <div className="lg:col-span-9 space-y-6">
          {/* Featured Hero Story */}
          {heroArticle && (
            <div
              onClick={() => setExpandedArticle(heroArticle)}
              className="neu-flat-light p-4 md:p-5 cursor-pointer transition-transform duration-200 hover:-translate-y-0.5"
            >
              <div className="w-full h-80 md:h-96 lg:h-[420px] relative overflow-hidden rounded-xl bg-slate-200">
                <img
                  src={heroArticle.image_url || "https://images.unsplash.com/photo-1585829365295-ab7cd400c167?w=1000"}
                  alt={heroArticle.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/35 to-transparent" />

                <div className="absolute bottom-0 inset-x-0 p-5 md:p-7 space-y-3 text-white">
                  <div className="flex items-center gap-2.5">
                    <span className="px-3.5 py-1.5 rounded-lg text-xs font-bold bg-blue-600 text-white uppercase tracking-wider shadow-sm">
                      {heroArticle.category}
                    </span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        if (onSelectCountryByCode) onSelectCountryByCode(heroArticle.country_code);
                      }}
                      className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-medium bg-black/50 hover:bg-black/70 text-white backdrop-blur-sm transition-all cursor-pointer"
                    >
                      <MapPin className="w-3.5 h-3.5 text-blue-400" />
                      <span>{heroArticle.country_name}</span>
                    </button>
                  </div>

                  <h2 className="text-xl md:text-2xl lg:text-3xl font-bold leading-snug tracking-tight text-white">
                    {heroArticle.title}
                  </h2>

                  <p className="text-xs md:text-sm text-slate-200 line-clamp-2 leading-relaxed max-w-4xl">
                    {heroArticle.summary}
                  </p>

                  <div className="flex items-center justify-between pt-3 border-t border-white/15 text-xs text-slate-300">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-white">{heroArticle.source || "Global Wire"}</span>
                      <span>•</span>
                      <span className="flex items-center gap-1.5 text-slate-300">
                        <Clock className="w-3.5 h-3.5" />
                        Live Coverage
                      </span>
                    </div>

                    <button
                      onClick={(e) => toggleBookmark(heroArticle.id, e)}
                      className={`p-2.5 rounded-xl backdrop-blur-sm transition-all cursor-pointer ${
                        bookmarkedIds.has(heroArticle.id) ? "bg-blue-600 text-white" : "bg-white/20 hover:bg-white/30 text-white"
                      }`}
                    >
                      <Bookmark className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* 3-Column Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 xl:gap-6">
            {gridArticles.map((art) => (
              <div
                key={art.id}
                onClick={() => setExpandedArticle(art)}
                className="neu-flat-light p-4 space-y-3 cursor-pointer transition-transform duration-200 hover:-translate-y-0.5 flex flex-col justify-between"
              >
                <div className="space-y-2.5">
                  {art.image_url && (
                    <div className="w-full h-44 rounded-lg overflow-hidden bg-slate-200">
                      <img
                        src={art.image_url}
                        alt={art.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}

                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-blue-600 text-[11px] px-2 py-0.5 rounded-md bg-blue-50">
                      {art.category}
                    </span>
                    <span className="text-slate-500 font-mono text-[10px] font-semibold">{art.country_code}</span>
                  </div>

                  <h3 className="text-sm font-bold text-slate-900 leading-snug line-clamp-2">
                    {art.title}
                  </h3>

                  <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">{art.summary}</p>
                </div>

                <div className="pt-3 border-t border-slate-300/60 flex items-center justify-between text-xs text-slate-500">
                  <span className="font-medium text-slate-700 truncate max-w-[140px]">
                    {art.source || "Global Wire"}
                  </span>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={(e) => toggleLike(art.id, e)}
                      className={`p-2 rounded-lg transition-all cursor-pointer ${
                        likedIds.has(art.id) ? "text-rose-600 bg-rose-50" : "text-slate-500 hover:text-rose-600 hover:bg-slate-200/50"
                      }`}
                    >
                      <Heart className="w-4 h-4" />
                    </button>

                    <button
                      onClick={(e) => toggleBookmark(art.id, e)}
                      className={`p-2 rounded-lg transition-all cursor-pointer ${
                        bookmarkedIds.has(art.id) ? "text-blue-600 bg-blue-50" : "text-slate-500 hover:text-blue-600 hover:bg-slate-200/50"
                      }`}
                    >
                      <Bookmark className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Sidebar: Trending Reports (3 Columns on lg+) */}
        <div className="lg:col-span-3 space-y-5">
          <div className="neu-flat-light p-5 space-y-3.5">
            <div className="flex items-center justify-between border-b border-slate-300/60 pb-2.5">
              <div className="flex items-center gap-2 font-bold text-sm text-slate-900">
                <TrendingUp className="w-4 h-4 text-blue-600" />
                <span>Trending Reports</span>
              </div>
              <span className="text-xs text-slate-500 font-medium">Real-Time</span>
            </div>

            <div className="space-y-3 divide-y divide-slate-300/50">
              {trendingArticles.map((art, idx) => (
                <div
                  key={art.id}
                  onClick={() => setExpandedArticle(art)}
                  className="pt-2.5 first:pt-0 flex items-start gap-3 cursor-pointer group"
                >
                  <span className="text-sm font-bold text-slate-400 w-5">
                    0{idx + 1}
                  </span>
                  <div className="space-y-0.5">
                    <span className="text-[10px] font-semibold text-blue-600 uppercase">
                      {art.country_name}
                    </span>
                    <h4 className="text-xs font-semibold text-slate-800 group-hover:text-blue-600 leading-snug line-clamp-2">
                      {art.title}
                    </h4>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Expanded Story Modal */}
      {expandedArticle && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="neu-flat-light bg-[#e6ecf4] max-w-xl w-full p-6 shadow-2xl space-y-4 max-h-[85vh] overflow-y-auto custom-scrollbar">
            <div className="flex items-center justify-between border-b border-slate-300 pb-2.5">
              <div className="flex items-center gap-2.5">
                <span className="px-3 py-1 rounded-md text-xs font-semibold bg-blue-600 text-white shadow-sm">
                  {expandedArticle.category}
                </span>
                <span className="text-xs font-medium text-slate-700">{expandedArticle.country_name}</span>
              </div>
              <button
                onClick={() => setExpandedArticle(null)}
                className="p-2 rounded-lg neu-btn-light text-slate-600 hover:text-slate-900 transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {expandedArticle.image_url && (
              <div className="w-full h-56 rounded-lg overflow-hidden bg-slate-200">
                <img src={expandedArticle.image_url} alt={expandedArticle.title} className="w-full h-full object-cover" />
              </div>
            )}

            <h2 className="text-lg md:text-xl font-bold text-slate-900 leading-snug">{expandedArticle.title}</h2>
            <p className="text-xs md:text-sm text-slate-700 leading-relaxed">{expandedArticle.summary}</p>

            {expandedArticle.content && (
              <div className="neu-pressed-light p-3.5 text-xs text-slate-800 leading-relaxed rounded-lg">
                <p>{expandedArticle.content}</p>
              </div>
            )}

            <div className="pt-2.5 border-t border-slate-300 flex items-center justify-between text-xs text-slate-500">
              <span>Source: <strong>{expandedArticle.source || "Global Wire"}</strong></span>
              <span className="font-mono text-[10px]">ID: {expandedArticle.id}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
