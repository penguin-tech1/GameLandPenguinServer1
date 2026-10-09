import React, { useState } from 'react';
import { WifiOff, Zap, X, Gamepad2 } from 'lucide-react';
import { useOnlineStatus } from '../hooks/useOnlineStatus';

interface OfflineIndicatorProps {
  onFilterOfflineGames?: () => void;
}

export const OfflineIndicator: React.FC<OfflineIndicatorProps> = ({ onFilterOfflineGames }) => {
  const isOnline = useOnlineStatus();
  const [dismissed, setDismissed] = useState(false);

  if (isOnline) {
    if (dismissed) setDismissed(false);
    return null;
  }

  if (dismissed) return null;

  return (
    <div className="fixed bottom-5 left-5 z-50 max-w-sm rounded-2xl bg-gradient-to-r from-slate-900 to-slate-950 border border-amber-500/50 p-3.5 shadow-2xl text-slate-100 animate-slideUp flex flex-col gap-2.5">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center shrink-0">
            <WifiOff className="w-4 h-4 text-amber-400" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-black text-amber-300">Offline Mode Active</span>
              <span className="flex h-2 w-2 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500"></span>
              </span>
            </div>
            <p className="text-[11px] text-slate-400 leading-tight mt-0.5">
              No internet detected. All built-in games and accounts are playable offline!
            </p>
          </div>
        </div>
        <button
          onClick={() => setDismissed(true)}
          className="text-slate-500 hover:text-slate-300 p-1"
          title="Dismiss"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>

      {onFilterOfflineGames && (
        <button
          onClick={onFilterOfflineGames}
          className="w-full flex items-center justify-center gap-1.5 py-1.5 px-3 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/30 text-xs font-bold transition-colors"
        >
          <Gamepad2 className="w-3.5 h-3.5 text-amber-400" />
          <span>Show Offline Playable Games</span>
        </button>
      )}
    </div>
  );
};
