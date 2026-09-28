import React, { useState } from 'react';
import { ShieldCheck, Lock, User, KeyRound, AlertCircle, X, CheckCircle2 } from 'lucide-react';

interface AdminLoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: () => void;
}

export const AdminLoginModal: React.FC<AdminLoginModalProps> = ({
  isOpen,
  onClose,
  onLoginSuccess
}) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    setTimeout(() => {
      const cleanUser = username.trim().toLowerCase();
      const cleanPass = password.trim();

      // Credential validation:
      // Accepts username 'admin' or 'admin@papandayan.id' or 'operasional'
      // Accepts password 'admin123' or 'papandayan2026'
      if (
        (cleanUser === 'admin' || cleanUser === 'admin@papandayan.id' || cleanUser === 'operasional') &&
        (cleanPass === 'admin123' || cleanPass === 'papandayan2026')
      ) {
        setIsLoading(false);
        onLoginSuccess();
        onClose();
      } else {
        setIsLoading(false);
        setError('ID Pengguna atau Kata Sandi Admin salah. Silakan periksa kembali kredensial Anda.');
      }
    }, 400);
  };

  const handleUseDemoCredentials = () => {
    setUsername('admin@papandayan.id');
    setPassword('admin123');
    setError(null);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-navy-950/75 backdrop-blur-xs transition-opacity" 
        onClick={onClose}
      />

      {/* Modal Dialog */}
      <div className="relative bg-white rounded-2xl max-w-md w-full p-6 sm:p-7 shadow-2xl z-10 border border-navy-100 overflow-hidden">
        {/* Top security header bar */}
        <div className="bg-[#0b1736] -mx-6 sm:-mx-7 -mt-6 sm:-mt-7 px-6 py-4 mb-6 border-b border-navy-800 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-amber-500/20 border border-amber-400/30 flex items-center justify-center text-amber-400">
              <Lock className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white tracking-wide">Portal Akses Staf & Admin</h3>
              <p className="text-[11px] text-blue-200/70">PT. Pasak Outdoor • Papandayan.id</p>
            </div>
          </div>

          <button
            id="close-admin-login-btn"
            onClick={onClose}
            className="p-1.5 rounded-lg text-blue-200 hover:text-white hover:bg-navy-800/80 transition cursor-pointer"
            title="Tutup"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Security badge notice */}
        <div className="mb-5 p-3 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-xs flex items-start gap-2.5">
          <ShieldCheck className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
          <div>
            <span className="font-bold block">Pemisahan Keamanan Data Pelanggan</span>
            <span className="text-[11px] text-amber-800 leading-relaxed">
              Area ini dibatasi khusus pengelola operasional. Seluruh identitas (NIK/No. HP) dan riwayat transaksi wisatawan dilindungi privasinya.
            </span>
          </div>
        </div>

        {error && (
          <div className="mb-4 p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-red-500" />
            <span>{error}</span>
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-navy-900 mb-1.5">
              ID Pengguna / Email Admin
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                <User className="w-4 h-4" />
              </div>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="admin@papandayan.id atau admin"
                required
                className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm focus:outline-hidden focus:ring-2 focus:ring-navy-600 focus:bg-white text-navy-950 font-medium placeholder:text-slate-400"
              />
            </div>
          </div>

          <div>
            <div className="flex justify-between items-center mb-1.5">
              <label className="block text-xs font-bold text-navy-900">
                Kata Sandi / PIN Keamanan
              </label>
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="text-[11px] text-navy-600 hover:text-navy-900 font-medium cursor-pointer"
              >
                {showPassword ? 'Sembunyikan' : 'Tampilkan'}
              </button>
            </div>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                <KeyRound className="w-4 h-4" />
              </div>
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Masukkan kata sandi..."
                required
                className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm focus:outline-hidden focus:ring-2 focus:ring-navy-600 focus:bg-white text-navy-950 font-medium placeholder:text-slate-400"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-[#0f2252] hover:bg-[#162a65] text-white font-bold py-3 rounded-xl shadow-md transition text-sm flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
          >
            {isLoading ? (
              <span>Memverifikasi Otoritas...</span>
            ) : (
              <>
                <Lock className="w-4 h-4 text-amber-400" />
                <span>Masuk ke Panel Admin</span>
              </>
            )}
          </button>
        </form>

        {/* Quick helper for default testing */}
        <div className="mt-5 pt-4 border-t border-slate-100 text-center">
          <p className="text-[11px] text-slate-500 mb-2">Kredensial Default Staf Operasional:</p>
          <button
            type="button"
            onClick={handleUseDemoCredentials}
            className="inline-flex items-center gap-1.5 text-xs text-[#0f2252] bg-blue-50 hover:bg-blue-100 px-3 py-1.5 rounded-lg font-semibold border border-blue-200/60 transition cursor-pointer"
          >
            <CheckCircle2 className="w-3.5 h-3.5 text-blue-600" />
            <span>Isi Otomatis: admin@papandayan.id / admin123</span>
          </button>
        </div>
      </div>
    </div>
  );
};
