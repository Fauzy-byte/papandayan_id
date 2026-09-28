import React, { useState, useRef } from 'react';
import { 
  X, 
  Sparkles, 
  Image as ImageIcon, 
  Upload, 
  Download, 
  Wand2, 
  Loader2, 
  RefreshCw, 
  Sliders, 
  AlertTriangle,
  CheckCircle2,
  Layers
} from 'lucide-react';

interface ImageStudioModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ImageStudioModal: React.FC<ImageStudioModalProps> = ({ isOpen, onClose }) => {
  const [mode, setMode] = useState<'create' | 'edit'>('create');
  const [prompt, setPrompt] = useState('');
  const [aspectRatio, setAspectRatio] = useState<string>('1:1');
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [selectedImageMime, setSelectedImageMime] = useState<string>('image/jpeg');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [imageDescription, setImageDescription] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const presetsCreate = [
    'Pemandangan magis Hutan Mati Papandayan berselimut kabut pagi dengan cahaya keemasan terbit',
    'Badge emblem ekspedisi pendakian TWA Gunung Papandayan 2665 MDPL vintage outdoor logo',
    'Tenda camping hangat di bawah taburan galaksi bintang Milky Way Pondok Saladah Papandayan',
    'Padang bunga abadi Edelweiss mekar bermekaran di padang Tegal Alun Papandayan Garut'
  ];

  const presetsEdit = [
    'Tambahkan kabut dramatis pegunungan dan nuansa pencahayaan golden hour matahari terbit',
    'Tambahkan logo badge ekspedisi resmi Papandayan.id di sudut foto',
    'Ubah suasana foto menjadi sinematik ala dokumenter petualangan National Geographic'
  ];

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setSelectedImageMime(file.type || 'image/jpeg');
    const reader = new FileReader();
    reader.onload = () => {
      setSelectedImage(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleGenerate = async () => {
    if (!prompt.trim()) return;

    setIsGenerating(true);
    setErrorMsg(null);

    try {
      const payload: any = {
        prompt,
        aspectRatio
      };

      if (mode === 'edit' && selectedImage) {
        payload.base64Image = selectedImage;
        payload.mimeType = selectedImageMime;
      }

      const res = await fetch('/api/generate-image', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.error || 'Gagal memproses gambar AI.');
      }

      const data = await res.json();
      if (!data.imageUrl) {
        throw new Error('Tidak ada output gambar yang dihasilkan oleh model.');
      }

      setGeneratedImage(data.imageUrl);
      setImageDescription(data.text || null);
    } catch (err: any) {
      console.error(err);
      setErrorMsg(err.message || 'Terjadi kesalahan saat memproses gambar.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDownload = () => {
    if (!generatedImage) return;
    const a = document.createElement('a');
    a.href = generatedImage;
    a.download = `Papandayan-AI-${Date.now()}.png`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy-950/80 backdrop-blur-xs overflow-y-auto">
      <div className="relative w-full max-w-3xl bg-white rounded-3xl shadow-2xl border border-navy-100 overflow-hidden my-8">
        
        {/* Header */}
        <div className="bg-[#0a1638] text-white p-6 relative">
          <button
            onClick={onClose}
            className="absolute top-5 right-5 text-blue-200 hover:text-white p-1 rounded-full hover:bg-white/10 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
          
          <div className="flex items-center gap-2 text-amber-400 text-xs font-bold uppercase tracking-wider mb-1">
            <Sparkles className="w-4 h-4" />
            <span>AI Image Creator & Editor (gemini-3.1-flash-image-preview)</span>
          </div>
          <h3 className="text-xl sm:text-2xl font-black flex items-center gap-2.5">
            <Wand2 className="w-6 h-6 text-amber-400" />
            <span>Studio Foto & Desain Kreatif Papandayan</span>
          </h3>
          <p className="text-xs text-blue-200 mt-1 max-w-xl">
            Buat foto petualangan kustom, wallpaper eksklusif, emblem trip, atau edit foto pendakian Anda dengan instruksi teks cerdas.
          </p>

          {/* Mode Switch Tabs */}
          <div className="mt-4 flex gap-2">
            <button
              onClick={() => setMode('create')}
              className={`px-4 py-2 rounded-xl text-xs font-black transition cursor-pointer flex items-center gap-1.5 ${
                mode === 'create'
                  ? 'bg-amber-400 text-navy-950 shadow-xs'
                  : 'bg-navy-900 text-blue-200 hover:bg-navy-800'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Buat Gambar Baru (Prompt)</span>
            </button>
            <button
              onClick={() => setMode('edit')}
              className={`px-4 py-2 rounded-xl text-xs font-black transition cursor-pointer flex items-center gap-1.5 ${
                mode === 'edit'
                  ? 'bg-amber-400 text-navy-950 shadow-xs'
                  : 'bg-navy-900 text-blue-200 hover:bg-navy-800'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>Edit / Modifikasi Foto</span>
            </button>
          </div>
        </div>

        {/* Body */}
        <div className="p-6 space-y-6">

          {/* Edit Mode: Image Uploader */}
          {mode === 'edit' && (
            <div>
              <label className="block text-xs font-bold text-navy-950 mb-2">
                Unggah Foto yang Ingin Diedit:
              </label>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleImageUpload}
                accept="image/*"
                className="hidden"
              />
              {selectedImage ? (
                <div className="relative inline-block border-2 border-amber-400 rounded-2xl overflow-hidden group">
                  <img
                    src={selectedImage}
                    alt="Uploaded"
                    className="w-48 h-36 object-cover"
                  />
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="absolute inset-0 bg-navy-950/60 text-white text-xs font-bold flex items-center justify-center opacity-0 group-hover:opacity-100 transition cursor-pointer"
                  >
                    Ganti Foto
                  </button>
                </div>
              ) : (
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="border-2 border-dashed border-slate-300 hover:border-amber-400 rounded-2xl p-6 text-center cursor-pointer transition bg-slate-50 hover:bg-amber-50/50"
                >
                  <Upload className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                  <p className="text-xs font-bold text-navy-950">Klik untuk upload foto pendakian Anda</p>
                  <p className="text-[11px] text-slate-500 mt-0.5">Mendukung format JPG, PNG, atau WebP</p>
                </div>
              )}
            </div>
          )}

          {/* Prompt Input */}
          <div>
            <label className="block text-xs font-bold text-navy-950 mb-2">
              {mode === 'create' ? 'Deskripsi / Prompt Gambar:' : 'Instruksi Pengeditan Foto:'}
            </label>
            <textarea
              rows={3}
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder={
                mode === 'create'
                  ? 'Contoh: Pemandangan Hutan Mati Papandayan saat kabut pagi dengan matahari terbit keemasan dan tenda petualang gaya sinematik 4k...'
                  : 'Contoh: Tambahkan kabut tebal dramatis dan efek golden hour hangat pada foto ini...'
              }
              className="w-full p-3.5 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-2xl focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500 transition"
            />
          </div>

          {/* Quick Presets */}
          <div>
            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">Inspirasi Ide Papandayan:</p>
            <div className="flex flex-wrap gap-2">
              {(mode === 'create' ? presetsCreate : presetsEdit).map((preset, idx) => (
                <button
                  key={idx}
                  onClick={() => setPrompt(preset)}
                  className="text-xs bg-slate-100 hover:bg-amber-100 text-slate-800 hover:text-navy-950 px-3 py-1.5 rounded-xl border border-slate-200 transition cursor-pointer text-left"
                >
                  ✨ {preset}
                </button>
              ))}
            </div>
          </div>

          {/* Aspect Ratio (Only in create mode) */}
          {mode === 'create' && (
            <div>
              <label className="block text-xs font-bold text-navy-950 mb-2">Rasio Aspek:</label>
              <div className="flex gap-2">
                {[
                  { label: 'Persegi (1:1)', val: '1:1' },
                  { label: 'Lanskap (16:9)', val: '16:9' },
                  { label: 'Klasik (4:3)', val: '4:3' },
                  { label: 'Story / HP (9:16)', val: '9:16' }
                ].map((item) => (
                  <button
                    key={item.val}
                    onClick={() => setAspectRatio(item.val)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer border ${
                      aspectRatio === item.val
                        ? 'bg-[#0a1638] text-amber-400 border-navy-950'
                        : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Error Message */}
          {errorMsg && (
            <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 shrink-0 text-rose-600" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Action Generate Button */}
          <button
            onClick={handleGenerate}
            disabled={isGenerating || !prompt.trim() || (mode === 'edit' && !selectedImage)}
            className="w-full py-3 px-4 bg-amber-400 hover:bg-amber-300 disabled:opacity-50 text-[#0a1638] font-black text-sm rounded-2xl transition shadow-md flex items-center justify-center gap-2 cursor-pointer"
          >
            {isGenerating ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Memproses Gambar dengan AI (Mohon Tunggu)...</span>
              </>
            ) : (
              <>
                <Wand2 className="w-4 h-4" />
                <span>{mode === 'create' ? 'Generate Gambar Sekarang' : 'Terapkan Editan AI'}</span>
              </>
            )}
          </button>

          {/* Generated Result Preview */}
          {generatedImage && (
            <div className="p-5 rounded-3xl bg-slate-50 border border-slate-200 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-navy-950 flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Hasil Gambar AI
                </span>
                <button
                  onClick={handleDownload}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#0a1638] hover:bg-[#112354] text-amber-400 text-xs font-bold rounded-xl transition shadow-xs cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5" /> Unduh Gambar
                </button>
              </div>
              <div className="flex justify-center bg-black/5 rounded-2xl p-2 overflow-hidden">
                <img
                  src={generatedImage}
                  alt="Generated Output"
                  className="max-h-96 rounded-xl object-contain shadow-md"
                />
              </div>
              {imageDescription && (
                <p className="text-xs text-slate-600 italic">
                  {imageDescription}
                </p>
              )}
            </div>
          )}

        </div>

        {/* Footer */}
        <div className="bg-slate-50 px-6 py-4 border-t border-slate-200 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 text-xs font-bold text-slate-600 hover:text-navy-950 transition cursor-pointer"
          >
            Tutup
          </button>
        </div>

      </div>
    </div>
  );
};
