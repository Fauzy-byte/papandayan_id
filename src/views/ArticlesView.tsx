import React, { useState } from 'react';
import { Article } from '../types';
import { Search, Clock, Calendar, User, ArrowRight } from 'lucide-react';

interface ArticlesViewProps {
  articles: Article[];
  onSelectArticle: (slug: string) => void;
}

export const ArticlesView: React.FC<ArticlesViewProps> = ({
  articles,
  onSelectArticle
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const categories = ['all', ...Array.from(new Set(articles.map(a => a.category)))];

  const filtered = articles.filter(article => {
    const matchesCat = selectedCategory === 'all' || article.category === selectedCategory;
    const matchesQuery = 
      article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      article.content.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesQuery;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 pb-20">
      <div className="mb-8">
        <span className="text-xs font-bold text-amber-600 uppercase tracking-wider">Artikel & Wawasan</span>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-navy-950 mt-1">
          Tips & Panduan Pendakian Papandayan
        </h1>
        <p className="text-sm text-slate-600 mt-2 max-w-2xl">
          Pelajari informasi jalur pendakian, sejarah kawah vulkanik, spot terbaik Hutan Mati & Tegal Alun, serta tips packing aman bersama pemandu kami.
        </p>
      </div>

      {/* Filter and Search */}
      <div className="bg-white p-4 rounded-2xl shadow-xs border border-navy-100 mb-8 flex flex-col md:flex-row gap-4 justify-between items-center">
        <div className="flex flex-wrap gap-2">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold capitalize transition ${
                selectedCategory === cat
                  ? 'bg-[#0f2252] text-amber-300 shadow-sm border border-navy-800'
                  : 'bg-navy-50 text-navy-900 hover:bg-navy-100'
              }`}
            >
              {cat === 'all' ? 'Semua Artikel' : cat}
            </button>
          ))}
        </div>

        <div className="relative w-full md:w-72">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari artikel pendakian..."
            className="w-full pl-9 pr-4 py-2 rounded-xl border border-navy-200 text-xs focus:ring-2 focus:ring-navy-900 focus:border-navy-900"
          />
          <Search className="w-4 h-4 text-navy-400 absolute left-3 top-2.5" />
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filtered.map((article) => (
          <article
            key={article.id}
            onClick={() => onSelectArticle(article.slug)}
            className="group bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden border border-navy-100 flex flex-col justify-between cursor-pointer"
          >
            <div>
              <div className="h-48 overflow-hidden bg-slate-100">
                <img
                  src={article.cover_image}
                  alt={article.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                />
              </div>

              <div className="p-6">
                <span className="text-[10px] font-bold text-navy-900 uppercase tracking-wider bg-navy-50 border border-navy-200/50 px-2.5 py-1 rounded-md">
                  {article.category}
                </span>

                <h2 className="text-lg font-bold text-navy-950 mt-2.5 group-hover:text-navy-700 transition line-clamp-2">
                  {article.title}
                </h2>

                <p className="text-xs text-slate-600 mt-2 line-clamp-3 leading-relaxed">
                  {article.content}
                </p>
              </div>
            </div>

            <div className="p-6 pt-0 mt-2">
              <div className="pt-3 border-t border-navy-50 flex items-center justify-between text-xs text-slate-500">
                <span className="flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5 text-slate-400" />
                  {article.published_at}
                </span>
                <span className="flex items-center gap-1 font-semibold text-navy-900">
                  <Clock className="w-3.5 h-3.5 text-amber-500" />
                  {article.read_time}
                </span>
              </div>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
};
