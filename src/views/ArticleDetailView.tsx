import React from 'react';
import { Article } from '../types';
import { ArrowLeft, Clock, Calendar, User, Share2, Tag, ArrowRight } from 'lucide-react';

interface ArticleDetailViewProps {
  article: Article;
  relatedArticles: Article[];
  onBack: () => void;
  onSelectArticle: (slug: string) => void;
  onNavigatePackages: () => void;
}

export const ArticleDetailView: React.FC<ArticleDetailViewProps> = ({
  article,
  relatedArticles,
  onBack,
  onSelectArticle,
  onNavigatePackages
}) => {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 pb-20">
      <button
        onClick={onBack}
        className="inline-flex items-center gap-1.5 text-xs font-bold text-navy-800 hover:text-navy-950 mb-6 transition"
      >
        <ArrowLeft className="w-4 h-4" /> Kembali ke Semua Artikel
      </button>

      {/* Main Article Header */}
      <div className="space-y-4 mb-6">
        <span className="text-xs font-bold text-navy-900 uppercase tracking-wider bg-navy-50 border border-navy-200/60 px-3 py-1 rounded-md">
          {article.category}
        </span>
        <h1 className="text-2xl sm:text-4xl font-extrabold text-navy-950 leading-tight">
          {article.title}
        </h1>

        <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 pt-2 border-y border-navy-50 py-3">
          <span className="flex items-center gap-1.5 font-semibold text-navy-950">
            <User className="w-4 h-4 text-amber-500" />
            {article.author_name}
          </span>
          <span className="text-slate-300">•</span>
          <span className="flex items-center gap-1.5">
            <Calendar className="w-4 h-4 text-amber-500" />
            {article.published_at}
          </span>
          <span className="text-slate-300">•</span>
          <span className="flex items-center gap-1.5">
            <Clock className="w-4 h-4 text-amber-500" />
            Waktu baca: {article.read_time}
          </span>
        </div>
      </div>

      {/* Hero Cover Image */}
      <div className="rounded-3xl overflow-hidden shadow-sm bg-slate-100 aspect-video mb-8">
        <img
          src={article.cover_image}
          alt={article.title}
          className="w-full h-full object-cover"
        />
      </div>

      {/* Content paragraphs */}
      <div className="bg-white p-6 sm:p-10 rounded-3xl border border-navy-100 shadow-xs mb-10 text-slate-800 text-sm sm:text-base leading-relaxed space-y-5">
        <p className="font-semibold text-navy-950 text-lg leading-relaxed">
          {article.content}
        </p>

        <p>
          Gunung Papandayan memiliki karakteristik lanskap yang sangat unik dibandingkan gunung api lainnya di Jawa Barat. Kawah belerang aktif yang mengepulkan asap putih, sungai hangat beraroma belerang, hingga transisi ke hutan tropis dan Hutan Mati eksotis menciptakan sensasi petualangan yang tiada duanya.
        </p>

        <div className="bg-navy-50/70 border-l-4 border-amber-500 p-4 rounded-r-xl my-6">
          <p className="text-xs sm:text-sm text-navy-950 font-medium">
            "Gunung Papandayan adalah salah satu gunung terbaik di Indonesia untuk memulai hobi mendaki. Keamanannya terjamin, pemandangannya luar biasa, dan fasilitas campingnya sangat nyaman."
          </p>
        </div>

        <h3 className="text-xl font-bold text-navy-950 pt-2">Tips Penting Sebelum Berangkat</h3>
        <ul className="list-disc list-inside space-y-2 text-sm text-slate-700">
          <li>Gunakan sepatu trekking atau sepatu olahraga dengan sol berprofil traksi baik.</li>
          <li>Bawa jaket windbreaker / fleece karena suhu malam dan dini hari dapat mencapai 10°C - 14°C.</li>
          <li>Gunakan masker penutup hidung saat melintasi area kawah belerang aktif.</li>
          <li>Selalu bawa kembali sampah Anda (Leave No Trace).</li>
        </ul>

        <h3 className="text-xl font-bold text-navy-950 pt-2">Kenapa Perlu Pemandu Lokal?</h3>
        <p>
          Meskipun jalur Papandayan cukup jelas, kehadiran guide lokal berlisensi dari Pasak Outdoor memastikan Anda terhindar dari gas beracun yang terkadang terkumpul di cekungan tertentu saat arah angin bergeser, serta membantu mengurus simaksi resmi dan dokumentasi foto di spot-spot tersembunyi.
        </p>
      </div>

      {/* CTA Box */}
      <div className="bg-gradient-to-r from-[#0a1638] via-[#0f2252] to-[#162a65] border-2 border-amber-500 text-white p-6 sm:p-8 rounded-2xl shadow-xl flex flex-col sm:flex-row justify-between items-center gap-6 mb-12">
        <div>
          <h3 className="text-lg font-bold">Tertarik Mendaki Papandayan Akhir Pekan Ini?</h3>
          <p className="text-xs text-blue-200 mt-1">Dapatkan paket lengkap mulai dari tiket, guide, makan, hingga tenda camping siap pakai.</p>
        </div>
        <button
          onClick={onNavigatePackages}
          className="bg-amber-500 text-[#0f2252] font-black px-6 py-2.5 rounded-xl text-xs sm:text-sm hover:bg-amber-400 transition whitespace-nowrap shadow-md"
        >
          Lihat Paket Trip Tersedia →
        </button>
      </div>

      {/* Related Articles */}
      <div>
        <h3 className="text-lg font-bold text-navy-950 mb-4">Artikel Terkait Lainnya</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {relatedArticles.slice(0, 2).map((rel) => (
            <div
              key={rel.id}
              onClick={() => onSelectArticle(rel.slug)}
              className="p-4 bg-white rounded-2xl border border-navy-100 hover:border-navy-900 cursor-pointer transition flex items-center gap-4 group shadow-xs"
            >
              <img
                src={rel.cover_image}
                alt={rel.title}
                className="w-20 h-20 rounded-xl object-cover shrink-0"
              />
              <div>
                <span className="text-[10px] font-bold text-navy-900 uppercase bg-navy-50 px-2 py-0.5 rounded">{rel.category}</span>
                <h4 className="text-xs sm:text-sm font-bold text-navy-950 group-hover:text-navy-700 transition line-clamp-2 mt-1">
                  {rel.title}
                </h4>
                <span className="text-[11px] text-slate-400 mt-1 block">{rel.read_time}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
