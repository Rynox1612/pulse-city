import { useState, useEffect } from 'react';

// Dynamically injects Leaflet JS and CSS to avoid cumbersome NPM conflicts
export const useLeafletMap = () => {
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    if (window.L) {
      setIsReady(true);
      return;
    }

    const cssId = 'leaflet-css';
    if (!document.getElementById(cssId)) {
      const link = document.createElement('link');
      link.id = cssId;
      link.rel = 'stylesheet';
      link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
      link.crossOrigin = '';
      document.head.appendChild(link);
    }

    const scriptId = 'leaflet-js';
    if (!document.getElementById(scriptId)) {
      const script = document.createElement('script');
      script.id = scriptId;
      script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
      script.crossOrigin = '';
      script.async = true;
      script.onload = () => setIsReady(true);
      document.head.appendChild(script);
    } else {
      const script = document.getElementById(scriptId);
      script.addEventListener('load', () => setIsReady(true));
    }
  }, []);

  return isReady;
};

// Simple heuristic to determine if a hospital is practically "Emergency Ready"
export const isEmergencyReady = (hospital) => {
  return hospital.emergencyAvailable && hospital.erBeds > 0;
};
