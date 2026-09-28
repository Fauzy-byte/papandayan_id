import React, { useState, useEffect } from 'react';
import { 
  X, 
  MapPin, 
  Navigation, 
  Search, 
  ExternalLink, 
  Sparkles, 
  Loader2, 
  Compass, 
  Info,
  Map as MapIcon,
  CheckCircle2,
  AlertTriangle,
  Layers,
  RefreshCw
} from 'lucide-react';
import { 
  APIProvider, 
  Map, 
  AdvancedMarker, 
  Pin, 
  InfoWindow,
  useMap
} from '@vis.gl/react-google-maps';

interface MapsGroundingModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface GroundingChunk {
  web?: {
    uri: string;
    title: string;
  };
  maps?: {
    uri?: string;
    title?: string;
    placeAnswerSources?: {
      reviewSnippets?: Array<{
        reviewText?: string;
        author?: string;
        uri?: string;
      }>;
    };
  };
}

interface MountainSpot {
  id: string;
  title: string;
  category: string;
  elevation: string;
  lat: number;
  lng: number;
  description: string;
  pinColor: string;
}

const PAPANDAYAN_SPOTS: MountainSpot[] = [
  {
    id: 'camp-david',
    title: 'Pos 1 Basecamp Camp David',
    category: 'Titik Registrasi & Parkir',
    elevation: '2.043 mdpl',
    lat: -7.3197,
    lng: 107.7297,
    description: 'Titik kumpul utama, registrasi simaksi Pasak Outdoor, area parkir 24 jam, warung logistik, dan briefing pendakian.',
    pinColor: '#0f2252'
  },
  {
    id: 'kawah-aktif',
    title: 'Kawah Belerang & Danau Baru',
    category: 'Vulkanik Aktif',
    elevation: '2.170 mdpl',
    lat: -7.3235,
    lng: 107.7310,
    description: 'Kawasan kawah solfatara aktif dengan pemandangan batuan belerang keemasan dan danau kawah vulkanik.',
    pinColor: '#d97706'
  },
  {
    id: 'pondok-saladah',
    title: 'Pondok Saladah Camping Ground',
    category: 'Area Berkemah Utama',
    elevation: '2.288 mdpl',
    lat: -7.3275,
    lng: 107.7350,
    description: 'Lembah terbuka rindang dengan sumber mata air alami, fasilitas toilet, pos ranger, dan view sunrise.',
    pinColor: '#059669'
  },
  {
    id: 'hutan-mati',
    title: 'Hutan Mati Papandayan',
    category: 'Spot Foto Ikonik',
    elevation: '2.340 mdpl',
    lat: -7.3288,
    lng: 107.7302,
    description: 'Bentang alam eksotis pohon cantigi hangus sisa erupsi 2002 dengan tanah kapur putih kontras.',
    pinColor: '#475569'
  },
  {
    id: 'tegal-alun',
    title: 'Tegal Alun Savana Edelweis',
    category: 'Padang Edelweis Terluas',
    elevation: '2.500 mdpl',
    lat: -7.3325,
    lng: 107.7245,
    description: 'Padang savana bunga abadi edelweis (Anaphalis javanica) seluas 35 hektar di dataran tinggi Papandayan.',
    pinColor: '#7c3aed'
  },
  {
    id: 'pasar-cisurupan',
    title: 'Pasar Cisurupan Garut',
    category: 'Titik Transit & Akses Angkot',
    elevation: '1.200 mdpl',
    lat: -7.3015,
    lng: 107.7712,
    description: 'Persimpangan jalan raya Garut-Cikajang, titik naik angkutan pick-up atau ojek menuju Pos 1 Camp David.',
    pinColor: '#dc2626'
  }
];

// Inner map camera controller component
const MapCameraSync: React.FC<{
  targetCoords: { lat: number; lng: number } | null;
  zoom?: number;
}> = ({ targetCoords, zoom = 14 }) => {
  const map = useMap();

  useEffect(() => {
    if (map && targetCoords) {
      map.panTo(targetCoords);
      if (zoom) map.setZoom(zoom);
    }
  }, [map, targetCoords, zoom]);

  return null;
};

export const MapsGroundingModal: React.FC<MapsGroundingModalProps> = ({ isOpen, onClose }) => {
  const [query, setQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [resultText, setResultText] = useState<string | null>(null);
  const [groundingChunks, setGroundingChunks] = useState<GroundingChunk[]>([]);
  const [dataSource, setDataSource] = useState<string>('');
  const [userCoords, setUserCoords] = useState<{ latitude: number; longitude: number } | null>(null);
  const [locationStatus, setLocationStatus] = useState<'idle' | 'locating' | 'ready' | 'denied'>('idle');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Google Maps JS SDK async loading states
  const [sdkStatus, setSdkStatus] = useState<'loading' | 'loaded' | 'error'>('loading');
  const [sdkErrorMessage, setSdkErrorMessage] = useState<string | null>(null);
  const [selectedSpot, setSelectedSpot] = useState<MountainSpot | null>(PAPANDAYAN_SPOTS[0]);
  const [activeCameraTarget, setActiveCameraTarget] = useState<{ lat: number; lng: number } | null>({
    lat: -7.3197,
    lng: 107.7297
  });

  // Securely retrieve the configured Google Maps API Key from environment
  const mapsApiKey = (import.meta.env.VITE_GOOGLE_MAPS_API_KEY as string) || '';

  // Quick search suggestions
  const quickPrompts = [
    'Rute & titik kumpul Pos 1 Camp David Basecamp Pasak Outdoor',
    'Kondisi jalur kawah aktif, Hutan Mati, dan Tegal Alun saat ini',
    'Tempat makan, minimarket & penginapan terdekat di Cisurupan Garut',
    'Perkiraan waktu & rute perjalanan dari Bandung/Jakarta ke Papandayan'
  ];

  if (!isOpen) return null;

  const detectLocation = () => {
    if (!navigator.geolocation) {
      setLocationStatus('denied');
      return;
    }
    setLocationStatus('locating');
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const coords = {
          latitude: pos.coords.latitude,
          longitude: pos.coords.longitude
        };
        setUserCoords(coords);
        setLocationStatus('ready');
        setActiveCameraTarget({
          lat: coords.latitude,
          lng: coords.longitude
        });
      },
      (err) => {
        console.warn('Geolocation warning:', err);
        setLocationStatus('denied');
      },
      { timeout: 8000 }
    );
  };

  const handleSearch = async (customQuery?: string) => {
    const q = customQuery || query;
    if (!q.trim()) return;

    setIsLoading(true);
    setErrorMsg(null);
    try {
      const res = await fetch('/api/maps-grounding', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query: q,
          userLocation: userCoords
        })
      });

      if (!res.ok) {
        throw new Error('Gagal menghubungi layanan Google Maps Grounding.');
      }

      const data = await res.json();
      setResultText(data.text);
      setGroundingChunks(data.groundingChunks || []);
      setDataSource(data.source || 'live_maps');
    } catch (err: any) {
      console.error(err);
      setErrorMsg(err.message || 'Terjadi kesalahan sistem.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSpotClick = (spot: MountainSpot) => {
    setSelectedSpot(spot);
    setActiveCameraTarget({ lat: spot.lat, lng: spot.lng });
  };

  // Extract all maps URIs and place sources
  const mapLinks = groundingChunks
    .map((chunk) => {
      if (chunk.maps?.uri) {
        return {
          title: chunk.maps.title || 'Buka di Google Maps',
          uri: chunk.maps.uri,
          reviews: chunk.maps.placeAnswerSources?.reviewSnippets || []
        };
      }
      if (chunk.web?.uri) {
        return {
          title: chunk.web.title || 'Sumber Informasi Maps',
          uri: chunk.web.uri,
          reviews: []
        };
      }
      return null;
    })
    .filter(Boolean) as Array<{
      title: string;
      uri: string;
      reviews: Array<{ reviewText?: string; author?: string; uri?: string }>;
    }>;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-navy-950/75 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-4xl bg-white rounded-3xl shadow-2xl border border-blue-900/20 overflow-hidden my-auto flex flex-col max-h-[92vh]">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-navy-950 via-navy-900 to-[#12285e] text-white p-4 sm:p-6 relative border-b border-white/10 shrink-0">
          <button
            onClick={onClose}
            className="absolute top-4 sm:top-6 right-4 sm:right-6 w-9 h-9 flex items-center justify-center rounded-xl bg-white/10 hover:bg-white/20 text-white transition cursor-pointer"
            aria-label="Tutup modal"
          >
            <X className="w-5 h-5" />
          </button>
          
          <div className="flex items-center gap-2 text-amber-400 text-xs font-bold uppercase tracking-wider mb-1">
            <Sparkles className="w-4 h-4" />
            <span>Google Maps JS SDK & AI Grounding</span>
          </div>
          <h3 className="text-xl sm:text-2xl font-black flex items-center gap-2.5">
            <MapIcon className="w-6 h-6 text-amber-400" />
            <span>Peta Interaktif & Navigasi Jalur Papandayan</span>
          </h3>
          <p className="text-xs text-blue-200 mt-1 max-w-xl leading-relaxed">
            Eksplorasi koordinat resmi titik pos pendakian via Google Maps JavaScript SDK interaktif serta panduan arah cerdas berbasis AI.
          </p>

          {/* Location button */}
          <div className="mt-3.5 flex flex-wrap items-center gap-2.5">
            <button
              onClick={detectLocation}
              disabled={locationStatus === 'locating'}
              className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/15 text-xs font-semibold text-white transition cursor-pointer disabled:opacity-50"
            >
              <Navigation className={`w-3.5 h-3.5 text-amber-400 ${locationStatus === 'locating' ? 'animate-spin' : ''}`} />
              <span>
                {locationStatus === 'locating'
                  ? 'Mencari Koordinat GPS...'
                  : locationStatus === 'ready'
                  ? 'Lokasi Anda Terdeteksi ✓'
                  : 'Gunakan Lokasi GPS Saya'}
              </span>
            </button>
            {userCoords && (
              <span className="text-[11px] text-blue-200 bg-white/5 px-2.5 py-1 rounded-lg border border-white/10 font-mono">
                {userCoords.latitude.toFixed(4)}, {userCoords.longitude.toFixed(4)}
              </span>
            )}
          </div>
        </div>

        {/* Scrollable Content Body */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-6">

          {/* Section 1: Interactive Google Maps JS SDK Canvas */}
          <div className="space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <Layers className="w-4 h-4 text-navy-900" />
                <h4 className="font-bold text-sm text-navy-950">Peta Satelit & Topografi Resmi Papandayan</h4>
              </div>
              <div className="flex items-center gap-2 text-xs">
                {sdkStatus === 'loaded' ? (
                  <span className="inline-flex items-center gap-1.5 text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200 font-semibold text-[11px]">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    Google Maps JS SDK Siap
                  </span>
                ) : sdkStatus === 'loading' ? (
                  <span className="inline-flex items-center gap-1.5 text-amber-700 bg-amber-50 px-2.5 py-1 rounded-lg border border-amber-200 font-semibold text-[11px]">
                    <Loader2 className="w-3.5 h-3.5 text-amber-600 animate-spin" />
                    Memuat Google Maps JS SDK...
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1.5 text-rose-700 bg-rose-50 px-2.5 py-1 rounded-lg border border-rose-200 font-semibold text-[11px]">
                    <AlertTriangle className="w-3.5 h-3.5 text-rose-600" />
                    Mode Peta Cadangan Terverifikasi
                  </span>
                )}
              </div>
            </div>

            {/* Quick Waypoint Chips */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1.5 scrollbar-thin">
              <span className="text-[11px] font-bold text-slate-500 shrink-0 mr-1">Titik Pos:</span>
              {PAPANDAYAN_SPOTS.map((spot) => {
                const isSelected = selectedSpot?.id === spot.id;
                return (
                  <button
                    key={spot.id}
                    onClick={() => handleSpotClick(spot)}
                    className={`shrink-0 px-2.5 py-1 rounded-lg text-xs font-semibold transition cursor-pointer flex items-center gap-1.5 ${
                      isSelected
                        ? 'bg-navy-950 text-amber-300 shadow-xs'
                        : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200'
                    }`}
                  >
                    <span
                      className="w-2 h-2 rounded-full shrink-0"
                      style={{ backgroundColor: spot.pinColor }}
                    />
                    <span>{spot.title.split(' ')[0]} {spot.title.split(' ')[1] || ''}</span>
                  </button>
                );
              })}
            </div>

            {/* Google Maps JS SDK Map Container with Asynchronous Loading Handling */}
            <div className="relative w-full h-72 sm:h-80 rounded-2xl overflow-hidden border border-slate-200 bg-slate-100 shadow-inner">
              {mapsApiKey ? (
                <APIProvider
                  apiKey={mapsApiKey}
                  onLoad={() => {
                    setSdkStatus('loaded');
                    setSdkErrorMessage(null);
                  }}
                  onError={(err) => {
                    console.error('Google Maps JS SDK Asynchronous Load Error:', err);
                    setSdkStatus('error');
                    setSdkErrorMessage('Gagal memuat Google Maps JS SDK secara asinkron. Menampilkan mode navigasi alternatif.');
                  }}
                >
                  <Map
                    defaultCenter={{ lat: -7.3197, lng: 107.7297 }}
                    defaultZoom={14}
                    mapId="DEMO_MAP_ID"
                    gestureHandling="greedy"
                    disableDefaultUI={false}
                    className="w-full h-full"
                    internalUsageAttributionIds={['gmp_mcp_codeassist_v1_aistudio']}
                  >
                    <MapCameraSync targetCoords={activeCameraTarget} />

                    {/* Official Mountain Waypoint Markers */}
                    {PAPANDAYAN_SPOTS.map((spot) => (
                      <AdvancedMarker
                        key={spot.id}
                        position={{ lat: spot.lat, lng: spot.lng }}
                        onClick={() => setSelectedSpot(spot)}
                        title={spot.title}
                      >
                        <Pin
                          background={spot.pinColor}
                          borderColor="#ffffff"
                          glyphColor="#ffffff"
                          scale={selectedSpot?.id === spot.id ? 1.25 : 1.0}
                        />
                      </AdvancedMarker>
                    ))}

                    {/* User GPS Location Marker */}
                    {userCoords && (
                      <AdvancedMarker
                        position={{ lat: userCoords.latitude, lng: userCoords.longitude }}
                        title="Lokasi Anda Saat Ini"
                      >
                        <div className="relative flex items-center justify-center">
                          <span className="animate-ping absolute inline-flex h-6 w-6 rounded-full bg-blue-400 opacity-75"></span>
                          <span className="relative inline-flex rounded-full h-4 w-4 bg-blue-600 border-2 border-white shadow-md"></span>
                        </div>
                      </AdvancedMarker>
                    )}

                    {/* InfoWindow for Selected Waypoint */}
                    {selectedSpot && (
                      <InfoWindow
                        position={{ lat: selectedSpot.lat, lng: selectedSpot.lng }}
                        onCloseClick={() => setSelectedSpot(null)}
                        headerContent={
                          <div className="font-bold text-navy-950 text-xs flex items-center gap-1.5">
                            <span
                              className="w-2 h-2 rounded-full"
                              style={{ backgroundColor: selectedSpot.pinColor }}
                            />
                            <span>{selectedSpot.title}</span>
                          </div>
                        }
                      >
                        <div className="p-1 max-w-[220px] text-slate-700">
                          <div className="flex items-center justify-between text-[11px] text-slate-500 mb-1 border-b pb-1">
                            <span className="font-medium text-navy-900">{selectedSpot.category}</span>
                            <span className="font-bold text-amber-700 bg-amber-50 px-1.5 py-0.5 rounded">
                              {selectedSpot.elevation}
                            </span>
                          </div>
                          <p className="text-[11px] leading-relaxed text-slate-600 mb-2">
                            {selectedSpot.description}
                          </p>
                          <a
                            href={`https://www.google.com/maps/search/?api=1&query=${selectedSpot.lat},${selectedSpot.lng}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 text-[11px] font-bold text-blue-700 hover:text-blue-900 underline"
                          >
                            <span>Petunjuk Arah Google Maps</span>
                            <ExternalLink className="w-3 h-3" />
                          </a>
                        </div>
                      </InfoWindow>
                    )}
                  </Map>
                </APIProvider>
              ) : (
                /* Fallback if API key is not configured */
                <div className="w-full h-full flex flex-col items-center justify-center p-6 text-center bg-slate-50">
                  <AlertTriangle className="w-8 h-8 text-amber-500 mb-2" />
                  <h5 className="font-bold text-navy-950 text-sm mb-1">Kunci Google Maps Belum Dikonfigurasi</h5>
                  <p className="text-xs text-slate-600 max-w-sm mb-4">
                    Konfigurasi <code className="bg-slate-200 px-1 py-0.5 rounded text-navy-900">VITE_GOOGLE_MAPS_API_KEY</code> diperlukan untuk merender peta interaktif SDK.
                  </p>
                  <a
                    href="https://www.google.com/maps/search/?api=1&query=Gunung+Papandayan+Garut"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-navy-950 text-amber-300 font-bold text-xs"
                  >
                    <span>Buka Peta Papandayan di Google Maps</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              )}

              {/* Asynchronous Loading Overlay during initial SDK fetch */}
              {mapsApiKey && sdkStatus === 'loading' && (
                <div className="absolute inset-0 bg-slate-900/20 backdrop-blur-[2px] flex items-center justify-center pointer-events-none">
                  <div className="bg-white/95 px-4 py-2.5 rounded-xl shadow-lg border border-slate-200 flex items-center gap-2.5 text-xs font-bold text-navy-950">
                    <Loader2 className="w-4 h-4 text-amber-500 animate-spin" />
                    <span>Menghubungkan ke Google Maps JS SDK...</span>
                  </div>
                </div>
              )}

              {/* Error overlay with reload option */}
              {sdkStatus === 'error' && (
                <div className="absolute bottom-3 left-3 right-3 bg-rose-50/95 border border-rose-200 rounded-xl p-3 shadow-md text-xs text-rose-900 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
                    <span>{sdkErrorMessage || 'Koneksi ke server Google Maps terhambat.'}</span>
                  </div>
                  <button
                    onClick={() => setSdkStatus('loading')}
                    className="px-2.5 py-1 bg-rose-600 hover:bg-rose-700 text-white rounded-lg font-bold text-[11px] shrink-0 ml-2 transition cursor-pointer"
                  >
                    Coba Lagi
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Section 2: AI Maps Grounding & Route Search */}
          <div className="space-y-4 pt-2 border-t border-slate-100">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Compass className="w-4 h-4 text-amber-600" />
                <h4 className="font-bold text-sm text-navy-950">Pencarian & Tanya Rute Pendakian</h4>
              </div>
              <span className="text-[11px] text-slate-500 font-medium">Model: Gemini 3.1 Flash Lite Grounding</span>
            </div>

            {/* Search Input Bar */}
            <div className="relative">
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                placeholder="Contoh: Rute pos kawah, estimasi trekking dari Camp David..."
                className="w-full pl-11 pr-28 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 focus:outline-hidden focus:ring-2 focus:ring-navy-900/20 focus:border-navy-900 transition"
              />
              <Search className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
              <button
                onClick={() => handleSearch()}
                disabled={isLoading || !query.trim()}
                className="absolute right-1.5 top-1/2 -translate-y-1/2 px-4 py-2 bg-navy-950 hover:bg-navy-900 disabled:bg-slate-300 text-amber-300 text-xs font-bold rounded-xl transition cursor-pointer flex items-center gap-1.5 shadow-sm"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    <span>Mencari...</span>
                  </>
                ) : (
                  <span>Tanyakan</span>
                )}
              </button>
            </div>

            {/* Quick Prompts */}
            <div className="space-y-1.5">
              <p className="text-[11px] font-bold text-slate-500">Pertanyaan Populer:</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {quickPrompts.map((item, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      setQuery(item);
                      handleSearch(item);
                    }}
                    className="text-left p-2.5 rounded-xl border border-slate-200 bg-slate-50/70 hover:bg-amber-50/50 hover:border-amber-300 text-slate-700 hover:text-navy-950 text-xs transition cursor-pointer flex items-start gap-2 group"
                  >
                    <MapPin className="w-3.5 h-3.5 text-amber-600 shrink-0 mt-0.5 group-hover:scale-110 transition" />
                    <span className="line-clamp-2 leading-relaxed">{item}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Error Message */}
            {errorMsg && (
              <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            {/* Loading Indicator */}
            {isLoading && (
              <div className="py-8 flex flex-col items-center justify-center space-y-3">
                <div className="relative">
                  <div className="w-10 h-10 border-4 border-slate-200 border-t-amber-500 rounded-full animate-spin"></div>
                  <Sparkles className="w-4 h-4 text-amber-500 absolute inset-0 m-auto" />
                </div>
                <p className="text-xs font-bold text-navy-950">Menganalisis Koordinat Geospasial & Peta Jalur...</p>
                <p className="text-[11px] text-slate-500">Menghubungkan data live Google Maps dengan topografi Papandayan</p>
              </div>
            )}

            {/* Grounding Results Display */}
            {resultText && !isLoading && (
              <div className="space-y-4">
                {/* Source Indicator Badge */}
                {dataSource === 'live_maps' ? (
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 text-xs px-3.5 py-2 rounded-xl bg-emerald-50 text-emerald-900 border border-emerald-200">
                    <span className="flex items-center gap-2 font-bold">
                      <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                      <span>Google Maps Grounding Aktif (Live API)</span>
                    </span>
                    <span className="text-[11px] text-emerald-700">Real-time Places & Geolocation Terhubung</span>
                  </div>
                ) : dataSource === 'ai_fallback' ? (
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 text-xs px-3.5 py-2 rounded-xl bg-blue-50 text-blue-950 border border-blue-200">
                    <span className="flex items-center gap-2 font-bold">
                      <span className="w-2 h-2 rounded-full bg-blue-500"></span>
                      <span>AI Smart Mountain Navigator (Gemini 3.1 Flash Lite)</span>
                    </span>
                    <span className="text-[11px] text-blue-700">Analisis Rute & Jalur Pendakian Cerdas</span>
                  </div>
                ) : (
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 text-xs px-3.5 py-2 rounded-xl bg-amber-50 text-amber-950 border border-amber-200">
                    <span className="flex items-center gap-2 font-bold">
                      <span className="w-2 h-2 rounded-full bg-amber-500"></span>
                      <span>Basis Data Rute Resmi Papandayan.id</span>
                    </span>
                    <span className="text-[11px] text-amber-800">Koordinat Terverifikasi & Deep-Link Google Maps</span>
                  </div>
                )}

                {/* Structured Text Result */}
                <div className="p-4 sm:p-5 rounded-2xl bg-slate-50 border border-slate-200 text-slate-800 text-xs sm:text-sm leading-relaxed whitespace-pre-line">
                  {resultText}
                </div>

                {/* Google Maps Place Links & Sources */}
                {mapLinks.length > 0 && (
                  <div className="space-y-2">
                    <div className="flex items-center gap-1.5 text-xs font-bold text-navy-950">
                      <ExternalLink className="w-3.5 h-3.5 text-amber-600" />
                      <span>Rujukan Titik Koordinat & Lokasi Google Maps:</span>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                      {mapLinks.map((link, idx) => (
                        <a
                          key={idx}
                          href={link.uri}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-3 rounded-xl border border-slate-200 bg-white hover:border-navy-900 hover:shadow-sm transition flex flex-col justify-between group"
                        >
                          <div>
                            <div className="flex items-start justify-between gap-2">
                              <h5 className="font-bold text-xs text-navy-950 group-hover:text-blue-700 transition">
                                {link.title}
                              </h5>
                              <ExternalLink className="w-3.5 h-3.5 text-slate-400 group-hover:text-blue-700 shrink-0" />
                            </div>
                            {link.reviews && link.reviews[0]?.reviewText && (
                              <p className="text-[11px] text-slate-500 mt-1 line-clamp-2 italic">
                                "{link.reviews[0].reviewText}"
                              </p>
                            )}
                          </div>
                          <span className="text-[10px] text-amber-600 font-bold mt-2 inline-flex items-center gap-1">
                            Buka Titik Peta Google Maps →
                          </span>
                        </a>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-2 shrink-0">
          <div className="flex items-center gap-2 text-slate-500 text-xs">
            <Info className="w-3.5 h-3.5 text-amber-600 shrink-0" />
            <span>Koordinat resmi Pos 1: (-7.3197, 107.7297). Sinyal seluler 4G stabil di area Basecamp.</span>
          </div>
          <button
            onClick={onClose}
            className="w-full sm:w-auto px-5 py-2 bg-navy-950 hover:bg-navy-900 text-white rounded-xl text-xs font-bold transition cursor-pointer"
          >
            Tutup Navigasi
          </button>
        </div>

      </div>
    </div>
  );
};
