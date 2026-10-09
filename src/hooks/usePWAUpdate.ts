import { useState, useEffect, useCallback, useRef } from 'react';

export interface VersionInfo {
  version: string;
  buildTime: string;
}

export function usePWAUpdate() {
  const [isUpdateAvailable, setIsUpdateAvailable] = useState(false);
  const [isChecking, setIsChecking] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [newVersionDetails, setNewVersionDetails] = useState<VersionInfo | null>(null);
  const [lastCheckTime, setLastCheckTime] = useState<Date | null>(null);
  const waitingWorkerRef = useRef<ServiceWorker | null>(null);

  // Check for updates by updating the service worker registration and checking version.json
  const checkForUpdate = useCallback(async (isManual = false) => {
    if (!navigator.onLine) return false;
    setIsChecking(true);

    try {
      // 1. Force service worker registration update check
      if ('serviceWorker' in navigator) {
        const registration = await navigator.serviceWorker.getRegistration();
        if (registration) {
          // If a service worker is already waiting, an update is ready!
          if (registration.waiting) {
            waitingWorkerRef.current = registration.waiting;
            setIsUpdateAvailable(true);
            window.dispatchEvent(new CustomEvent('gameland_pwa_update_available'));
          }

          // Trigger registration update check with server
          registration.update().catch(() => {});

          registration.addEventListener('updatefound', () => {
            const newWorker = registration.installing;
            if (newWorker) {
              newWorker.addEventListener('statechange', () => {
                if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                  waitingWorkerRef.current = newWorker;
                  setIsUpdateAvailable(true);
                  window.dispatchEvent(new CustomEvent('gameland_pwa_update_available'));
                }
              });
            }
          });
        }
      }

      // 2. Fetch version.json directly with cache-busting timestamp
      const timestamp = Date.now();
      const response = await fetch(`./version.json?_t=${timestamp}`, {
        cache: 'no-store',
        headers: {
          'Cache-Control': 'no-cache, no-store, must-revalidate',
          Pragma: 'no-cache',
        },
      });

      if (response.ok) {
        const remoteInfo: VersionInfo = await response.json();
        const localBuildTime = typeof __APP_BUILD_TIME__ !== 'undefined' ? __APP_BUILD_TIME__ : '';
        const localVersion = typeof __APP_VERSION__ !== 'undefined' ? __APP_VERSION__ : '2.0.0';

        // Check if remote version is newer than local build time or version
        const isTimeNewer = localBuildTime && remoteInfo.buildTime && remoteInfo.buildTime > localBuildTime;
        const isVersionNewer = remoteInfo.version && remoteInfo.version !== localVersion;

        if (isTimeNewer || isVersionNewer) {
          setIsUpdateAvailable(true);
          setNewVersionDetails(remoteInfo);
          window.dispatchEvent(new CustomEvent('gameland_pwa_update_available', { detail: remoteInfo }));
          return true;
        }
      }
    } catch (e) {
      // Ignore network errors when checking for update
    } finally {
      setIsChecking(false);
      setLastCheckTime(new Date());
    }

    return false;
  }, []);

  // Apply update and reload
  const applyUpdate = useCallback(() => {
    setIsUpdating(true);

    // If waiting service worker exists, tell it to skip waiting
    if (waitingWorkerRef.current) {
      waitingWorkerRef.current.postMessage({ type: 'SKIP_WAITING' });
    }

    // Small delay to allow service worker to activate before reloading
    setTimeout(() => {
      window.location.reload();
    }, 200);
  }, []);

  useEffect(() => {
    // 1. Initial check on mount if online
    if (navigator.onLine) {
      checkForUpdate();
    }

    // 2. Immediate check when device connects to internet
    const handleOnline = () => {
      console.log('🌐 Connected to internet: checking for latest game version...');
      checkForUpdate();
    };

    // 3. Check when user returns to the tab/window
    const handleVisibility = () => {
      if (document.visibilityState === 'visible' && navigator.onLine) {
        checkForUpdate();
      }
    };

    // 4. Listen for controllerchange (when new service worker claims the page)
    const handleControllerChange = () => {
      // New service worker has taken over!
      setIsUpdateAvailable(true);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('focus', handleOnline);
    document.addEventListener('visibilitychange', handleVisibility);

    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.addEventListener('controllerchange', handleControllerChange);
    }

    // 5. Periodic check every 60 seconds while online
    const interval = setInterval(() => {
      if (navigator.onLine) {
        checkForUpdate();
      }
    }, 60000);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('focus', handleOnline);
      document.removeEventListener('visibilitychange', handleVisibility);
      if ('serviceWorker' in navigator) {
        navigator.serviceWorker.removeEventListener('controllerchange', handleControllerChange);
      }
      clearInterval(interval);
    };
  }, [checkForUpdate]);

  return {
    isUpdateAvailable,
    isChecking,
    isUpdating,
    newVersionDetails,
    lastCheckTime,
    checkForUpdate,
    applyUpdate,
  };
}
