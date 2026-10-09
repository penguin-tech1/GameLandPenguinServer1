import React from 'react';
import { Sparkles, RefreshCw, X, ArrowUpCircle } from 'lucide-react';
import { usePWAUpdate } from '../hooks/usePWAUpdate';

export const PWAUpdateToast: React.FC = () => {
  const { isUpdateAvailable, isUpdating, applyUpdate, newVersionDetails } = usePWAUpdate();
  const [dismissed, setDismissed] = React.useState(false);

  if (!isUpdateAvailable || dismissed) return null;

  return (
    <aside
      aria-label="Application update available"
      className="fixed bottom-5 right-5 z-50 max-w-sm rounded-2xl bg-gradient-to-br from-slate-900 via-sky-950 to-slate-900 border border-sky-400/60 p-4 shadow-2xl text-slate-100 animate-slideUp flex flex-col gap-3 ring-1 ring-sky-500/30"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-3">
          <div className="w-9 h-9 rounded-xl bg-sky-500/20 border border-sky-400/50 flex items-center justify-center shrink-0 text-sky-300">
            <Sparkles className="w-5 h-5 animate-spin text-sky-400" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-black text-sky-300 uppercase tracking-wide">
                Latest Version Ready
              </span>
              <span className="text-[10px] px-1.5 py-0.2 rounded bg-sky-400/20 text-sky-200 font-mono font-bold">
                {newVersionDetails?.version || 'v2.1'}
              </span>
            </div>
            <p className="text-xs text-slate-300 mt-1 leading-snug">
              Connected to the internet! A fresh game update has been downloaded in the background.
            </p>
          </div>
        </div>
        <button
          onClick={() => setDismissed(true)}
          className="text-slate-400 hover:text-slate-200 p-1 rounded-lg hover:bg-slate-800 transition"
          title="Dismiss for now"
          aria-label="Dismiss update notification"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      <div className="flex items-center gap-2">
        <button
          onClick={applyUpdate}
          disabled={isUpdating}
          className="flex-1 py-2 px-3 rounded-xl bg-gradient-to-r from-sky-500 to-cyan-500 hover:from-sky-400 hover:to-cyan-400 text-slate-950 text-xs font-black flex items-center justify-center gap-2 shadow-lg shadow-sky-500/20 transition active:scale-95 disabled:opacity-50"
        >
          {isUpdating ? (
            <>
              <RefreshCw className="w-3.5 h-3.5 animate-spin" />
              <span>Applying Update...</span>
            </>
          ) : (
            <>
              <ArrowUpCircle className="w-4 h-4" />
              <span>Update & Play Latest</span>
            </>
          )}
        </button>

        <button
          onClick={() => setDismissed(true)}
          className="py-2 px-3 rounded-xl bg-slate-800/80 hover:bg-slate-700/80 text-slate-300 text-xs font-bold transition"
        >
          Later
        </button>
      </div>
    </aside>
  );
};
