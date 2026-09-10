import React, { useState } from "react";
import { X, Send, CheckCircle2, AlertCircle } from "lucide-react";
import { createNewsArticle } from "../services/api";

export default function AddArticleModal({ isOpen, onClose, initialCountryCode = "", initialCountryName = "", onSuccess }) {
  const [formData, setFormData] = useState({
    title: "",
    summary: "",
    content: "",
    category: "World",
    country_code: initialCountryCode || "USA",
    country_name: initialCountryName || "United States of America",
    threat_level: "none",
    threat_type: "none",
    source: "Staff Report"
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [createdId, setCreatedId] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMsg(null);

    try {
      const res = await createNewsArticle(formData);
      setCreatedId(res.id);
      if (onSuccess) onSuccess(res);
      setTimeout(() => {
        setCreatedId(null);
        onClose();
      }, 1500);
    } catch (err) {
      setErrorMsg("Failed to store article: " + err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
      <div className="neu-flat-light max-w-lg w-full p-6 space-y-4 border border-slate-300 rounded-xl shadow-2xl">
        <div className="flex items-center justify-between border-b border-slate-300/80 pb-3">
          <h3 className="text-base font-bold text-slate-900">
            Publish News Report
          </h3>
          <button onClick={onClose} className="text-slate-500 hover:text-slate-900 p-2 rounded-xl neu-btn-light transition-all cursor-pointer">
            <X className="w-4 h-4" />
          </button>
        </div>

        {createdId ? (
          <div className="py-8 text-center space-y-2">
            <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto" />
            <h4 className="text-sm font-semibold text-slate-900">Article Saved</h4>
            <p className="text-xs text-slate-500 font-mono">
              ID: <span className="text-blue-600">{createdId}</span>
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-3.5 text-xs text-slate-700">
            {errorMsg && (
              <div className="p-2.5 rounded-lg bg-rose-100 border border-rose-200 text-rose-700 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-slate-600 font-medium mb-1">Country Name</label>
                <input
                  type="text"
                  required
                  value={formData.country_name}
                  onChange={(e) => setFormData({ ...formData, country_name: e.target.value })}
                  className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-slate-900 outline-none focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-slate-600 font-medium mb-1">ISO Code</label>
                <input
                  type="text"
                  required
                  maxLength={5}
                  value={formData.country_code}
                  onChange={(e) => setFormData({ ...formData, country_code: e.target.value.toUpperCase() })}
                  className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-slate-900 outline-none focus:border-blue-500 uppercase font-mono"
                />
              </div>
            </div>

            <div>
              <label className="block text-slate-600 font-medium mb-1">Headline</label>
              <input
                type="text"
                required
                placeholder="e.g. Major Renewable Energy Grid Expansion Announced"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-slate-900 outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-slate-600 font-medium mb-1">Summary</label>
              <textarea
                required
                rows={3}
                placeholder="Key details of the news story..."
                value={formData.summary}
                onChange={(e) => setFormData({ ...formData, summary: e.target.value })}
                className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-slate-900 outline-none focus:border-blue-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-slate-600 font-medium mb-1">Category</label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full bg-white border border-slate-300 rounded-lg px-2.5 py-2 text-slate-900 outline-none focus:border-blue-500"
                >
                  <option value="World">World</option>
                  <option value="Politics">Politics</option>
                  <option value="Environment">Environment</option>
                  <option value="Health">Health</option>
                  <option value="Tech">Tech</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-600 font-medium mb-1">Source Wire</label>
                <input
                  type="text"
                  value={formData.source}
                  onChange={(e) => setFormData({ ...formData, source: e.target.value })}
                  className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-slate-900 outline-none focus:border-blue-500"
                />
              </div>
            </div>

            <div className="pt-3 flex items-center justify-end gap-3 border-t border-slate-300/80">
              <button
                type="button"
                onClick={onClose}
                className="px-5 py-2.5 rounded-xl neu-btn-light text-slate-700 font-semibold transition-all cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold shadow-md transition-all cursor-pointer"
              >
                <Send className="w-4 h-4" />
                <span>{isSubmitting ? "Publishing..." : "Publish Report"}</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
