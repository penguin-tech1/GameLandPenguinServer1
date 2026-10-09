import React, { useState } from 'react';
import { Download, Sparkles, Smartphone, X } from 'lucide-react';
import { usePWAInstall } from '../hooks/usePWAInstall';

export const PWAInstallButton: React.FC = () => {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const [showIOSGuide, setShowIOSGuide] = useState(false);

  // If already running as an installed PWA, hide the button
  if (isInstalled) {
    return null;
  }

  // Chromium / Android / Desktop flow
  if (isInstallable) {
    return (
      <button
        onClick={install}
        className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 px-3.5 py-1.5 text-xs font-black text-slate-950 shadow-md shadow-cyan-500/20 transition-all hover:scale-[1.02] active:scale-95"
        title="Install GameLand app for offline play"
      >
        <Download className="w-4 h-4 text-slate-950" />
        <span>Install App (Offline Ready)</span>
      </button>
    );
  }

  // iOS Safari flow (beforeinstallprompt is not supported by WebKit)
  if (isIOS) {
    return (
      <>
        <button
          onClick={() => setShowIOSGuide(true)}
          className="flex items-center gap-1.5 rounded-xl border border-cyan-500/30 bg-cyan-950/40 hover:bg-cyan-900/40 px-3 py-1.5 text-xs font-bold text-cyan-300 transition-all shadow-sm"
          title="Install on iOS for offline play"
        >
          <Smartphone className="w-3.5 h-3.5 text-cyan-400" />
          <span>Install on iOS</span>
        </button>

        {showIOSGuide && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 animate-fadeIn">
            <div className="w-full max-w-sm rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-2xl text-slate-100 relative">
              <button
                onClick={() => setShowIOSGuide(false)}
                className="absolute top-4 right-4 p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
              >
                <X className="w-4 h-4" />
              </button>
              <div className="flex items-center gap-2 text-cyan-400 mb-2">
                <Sparkles className="w-5 h-5" />
                <h3 className="text-base font-bold text-white">Install on iPhone / iPad</h3>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed mb-4">
                Play GameLand completely offline anytime without internet:
              </p>
              <div className="space-y-2.5 text-xs text-slate-300 bg-slate-950/60 p-3.5 rounded-xl border border-slate-800 mb-5">
                <p className="flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-cyan-500 text-slate-950 font-black flex items-center justify-center text-[10px]">1</span>
                  Tap the <strong className="text-white">Share</strong> icon in Safari's bottom toolbar.
                </p>
                <p className="flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-cyan-500 text-slate-950 font-black flex items-center justify-center text-[10px]">2</span>
                  Scroll down and tap <strong className="text-white">Add to Home Screen</strong>.
                </p>
                <p className="flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-cyan-500 text-slate-950 font-black flex items-center justify-center text-[10px]">3</span>
                  Launch GameLand from your home screen for full offline arcade access!
                </p>
              </div>
              <button
                onClick={() => setShowIOSGuide(false)}
                className="w-full rounded-xl bg-cyan-500 hover:bg-cyan-400 py-2.5 text-xs font-black text-slate-950 transition-colors"
              >
                Got It!
              </button>
            </div>
          </div>
        )}
      </>
    );
  }

  return null;
};
