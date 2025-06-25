// The TypeScript configuration file is located at : frontend/tsconfig.json
// 			console.log(`✅ API Response [${requestId}]:`, {
// 				status: error.response?.status,
// 				duration: `${Date.now() - (originalRequest.metadata?.startTime || Date.now())}ms`,
// 				data: error.response?.data,
import { useState, useEffect } from "react";
import { checkApiHealth } from "../api/config";

interface NetworkStatus {
  isOnline: boolean;
  isApiHealthy: boolean;
  lastChecked: Date;
  isChecking: boolean;
}

export const useNetworkStatus = (checkInterval: number = 30000) => {
  const [status, setStatus] = useState<NetworkStatus>({
    isOnline: navigator.onLine,
    isApiHealthy: false,
    lastChecked: new Date(),
    isChecking: false,
  });

  const checkStatus = async () => {
    setStatus(prev => ({ ...prev, isChecking: true }));

    try {
      const isApiHealthy = await checkApiHealth();
      setStatus(prev => ({
        ...prev,
        isOnline: navigator.onLine,
        isApiHealthy,
        lastChecked: new Date(),
        isChecking: false,
      }));
    } catch (error) {
      setStatus(prev => ({
        ...prev,
        isOnline: navigator.onLine,
        isApiHealthy: false,
        lastChecked: new Date(),
        isChecking: false,
      }));
    }
  };

  useEffect(() => {
    // Initial check
    checkStatus();

    // Set up interval for periodic checks
    const interval = setInterval(checkStatus, checkInterval);

    // Listen for online/offline events
    const handleOnline = () => {
      setStatus(prev => ({ ...prev, isOnline: true }));
      checkStatus();
    };

    const handleOffline = () => {
      setStatus(prev => ({ ...prev, isOnline: false, isApiHealthy: false }));
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      clearInterval(interval);
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [checkInterval]);

  return {
    ...status,
    refresh: checkStatus,
  };
};