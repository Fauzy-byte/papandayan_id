import React from 'react';
import { ShieldCheck, LogOut, LayoutDashboard, Globe, MapPin, Sparkles, User as UserIcon } from 'lucide-react';
import type { User as FirebaseUser } from 'firebase/auth';

interface AdminTopBarProps {
  currentView: string;
  onNavigate: (view: string) => void;
  onLogout: () => void;
  onOpenMapsGuide?: () => void;
  onOpenImageStudio?: () => void;
  firebaseUser?: FirebaseUser | null;
  onSignInGoogle?: () => void;
  onSignOutGoogle?: () => void;
}

export const AdminTopBar: React.FC<AdminTopBarProps> = ({
  currentView,
  onNavigate,
  onLogout,
  onOpenMapsGuide,
  onOpenImageStudio,
  firebaseUser,
  onSignInGoogle,
  onSignOutGoogle
}) => {
  return (
    <div className="bg-amber-500 text-navy-950 px-4 py-2 text-xs font-medium border-b border-amber-600 shadow-xs flex flex-wrap items-center justify-between gap-2 z-50">
      <div className="flex items-center gap-2">
        <span className="flex items-center justify-center w-5 h-5 rounded-full bg-navy-900 text-amber-300">
          <ShieldCheck className="w-3.5 h-3.5" />
        </span>
        <span className="font-bold tracking-tight">MODE ADMINISTRATOR AKTIF</span>
        <span className="text-navy-900/80 hidden md:inline">
          (Akses Eksklusif Tools AI & Database Cloud Firestore)
        </span>
      </div>

      <div className="flex items-center flex-wrap gap-2">
        {/* Quick Tools for Admin */}
        {onOpenMapsGuide && (
          <button
            onClick={onOpenMapsGuide}
            className="flex items-center gap-1 px-2.5 py-1 bg-rose-600 hover:bg-rose-700 text-white rounded-lg font-bold text-xs shadow-xs transition cursor-pointer"
            title="Buka Peta & Rute Grounding (Google Maps)"
          >
            <MapPin className="w-3.5 h-3.5" />
            <span>Peta Rute</span>
          </button>
        )}

        {onOpenImageStudio && (
          <button
            onClick={onOpenImageStudio}
            className="flex items-center gap-1 px-2.5 py-1 bg-navy-950 hover:bg-navy-900 text-amber-300 rounded-lg font-bold text-xs shadow-xs transition cursor-pointer"
            title="Buka AI Studio Desain & Foto Papandayan"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>Studio AI</span>
          </button>
        )}

        {/* Google Admin Auth */}
        {firebaseUser ? (
          <div className="flex items-center gap-1.5 bg-navy-900 text-white px-2 py-0.5 rounded-lg border border-navy-800 text-[11px]">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span className="font-bold truncate max-w-[80px]">{firebaseUser.displayName?.split(' ')[0] || 'Admin'}</span>
            {onSignOutGoogle && (
              <button 
                onClick={onSignOutGoogle} 
                className="text-slate-300 hover:text-red-400 ml-1 cursor-pointer"
                title="Sign out Google"
              >
                ×
              </button>
            )}
          </div>
        ) : onSignInGoogle ? (
          <button
            onClick={onSignInGoogle}
            className="flex items-center gap-1 px-2 py-1 bg-white hover:bg-slate-100 text-navy-950 rounded-lg font-bold text-[11px] shadow-xs transition cursor-pointer border border-amber-600/30"
            title="Hubungkan Akun Google Admin ke Firebase"
          >
            <UserIcon className="w-3 h-3 text-blue-600" />
            <span>Google Login</span>
          </button>
        ) : null}

        {currentView !== 'admin' ? (
          <button
            onClick={() => onNavigate('admin')}
            className="flex items-center gap-1.5 px-3 py-1 bg-navy-950 hover:bg-navy-900 text-white rounded-lg font-bold text-xs shadow-xs transition cursor-pointer"
          >
            <LayoutDashboard className="w-3.5 h-3.5 text-amber-400" />
            <span>Panel Admin</span>
          </button>
        ) : (
          <button
            onClick={() => onNavigate('home')}
            className="flex items-center gap-1.5 px-3 py-1 bg-white/90 hover:bg-white text-navy-950 rounded-lg font-bold text-xs shadow-xs transition cursor-pointer"
          >
            <Globe className="w-3.5 h-3.5 text-navy-700" />
            <span>Tampilan Pengunjung</span>
          </button>
        )}

        <button
          onClick={onLogout}
          className="flex items-center gap-1.5 px-3 py-1 bg-red-700 hover:bg-red-800 text-white rounded-lg font-bold text-xs shadow-xs transition cursor-pointer"
          title="Kunci Panel dan Keluar dari Mode Admin"
        >
          <LogOut className="w-3.5 h-3.5" />
          <span>Keluar</span>
        </button>
      </div>
    </div>
  );
};
