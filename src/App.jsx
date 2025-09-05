import React, { useState, useCallback, useMemo, useEffect } from "react";
import Dashboard from "./components/Dashboard";
import FaceRecognition from "./components/FaceRecognition";
import AnomalyLog from "./components/AnomalyLog";
import LanguageSwitcher from "./components/LanguageSwitcher";
import "./styles/main.css";
import { i18n, initializeI18n } from "./utils/i18n";
import { generateAnomalyId } from "./utils";

export default function App() {
  const [language, setLanguage] = useState("no");
  const [anomalies, setAnomalies] = useState([]);
  const [uptime, setUptime] = useState(0);
  const [users] = useState(42);
  const [lastReport] = useState("2025-06-28 20:15");
  const [i18nInitialized, setI18nInitialized] = useState(false);

  // Initialize i18n system
  useEffect(() => {
    const initializeApp = async () => {
      try {
        // Try to load saved language preference first
        const savedLanguage = localStorage.getItem('cortex-language');
        const preferredLanguage = (savedLanguage && (savedLanguage === 'no' || savedLanguage === 'en')) 
          ? savedLanguage 
          : 'no';
        
        await initializeI18n(preferredLanguage);
        setLanguage(preferredLanguage);
        setI18nInitialized(true);
      } catch (error) {
        console.warn('Failed to initialize i18n, using fallback:', error);
        setI18nInitialized(true); // Continue with fallback translations
      }
    };

    initializeApp();
  }, []);

  // Update uptime every minute
  useEffect(() => {
    const startTime = Date.now();
    const interval = setInterval(() => {
      const minutes = Math.floor((Date.now() - startTime) / 60000);
      setUptime(1234 + minutes); // Add to base uptime
    }, 60000);

    return () => clearInterval(interval);
  }, []);

  // Optimized anomaly handler with useCallback to prevent unnecessary re-renders
  const handleDetect = useCallback((anomaly) => {
    const newAnomaly = {
      id: generateAnomalyId(),
      time: new Date().toISOString(),
      description: anomaly.description || i18n.t('anomalyLog.unknownAnomaly', 'Ukjent avvik'),
      type: anomaly.type || i18n.t('anomalyLog.other', 'Annet'),
    };

    setAnomalies((prev) => [newAnomaly, ...prev].slice(0, 100)); // Keep only last 100 anomalies
  }, []);

  // Optimized language change handler
  const handleLanguageChange = useCallback(async (newLanguage) => {
    try {
      await i18n.setLanguage(newLanguage);
      setLanguage(newLanguage);
      // Store preference in localStorage for persistence
      localStorage.setItem('cortex-language', newLanguage);
    } catch (error) {
      console.warn('Could not change language:', error);
    }
  }, []);

  // Dummy-data for kjent ansikter (i produksjon hentes dette f.eks. fra server)
  const knownFaces = useMemo(() => ["Ola", "Kari", "Per"], []);

  // Dummy-toleranse
  const tolerance = useMemo(() => 0.7, []);

  // Memoize anomaly count for dashboard
  const anomalyCount = useMemo(() => anomalies.length, [anomalies.length]);

  // Show loading state while i18n initializes
  if (!i18nInitialized) {
    return (
      <div className="min-h-screen bg-gray-950 text-gray-100 font-sans flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-teal-500 mx-auto mb-4"></div>
          <p className="text-xl">Loading CoreTex...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100 font-sans pb-8">
      <header className="p-6 bg-teal-800 text-white shadow flex flex-col items-center">
        <img 
          src="/assets/logo.png" 
          alt="CORTEX-logo" 
          className="w-16 mb-2" 
          onError={(e) => {
            e.target.style.display = 'none';
          }}
        />
        <h1 className="text-3xl font-bold tracking-wide mb-1">{i18n.t('title', 'CORTEX')}</h1>
        <div className="text-teal-200">{i18n.t('description', 'Advanced security system')}</div>
      </header>
      
      <main className="max-w-2xl mx-auto mt-6 px-4">
        <LanguageSwitcher 
          currentLanguage={language} 
          onChange={handleLanguageChange} 
        />
        
        <Dashboard
          anomalies={anomalyCount}
          uptime={uptime}
          users={users}
          lastReport={lastReport}
        />
        
        <FaceRecognition
          onDetect={handleDetect}
          tolerance={tolerance}
          knownFaces={knownFaces}
        />
        
        <AnomalyLog anomalies={anomalies} />
      </main>
      
      <footer className="text-center text-xs text-gray-400 mt-8">
        © 2025 CORTEX – {i18n.t('footer', 'Advanced security system')}
      </footer>
    </div>
  );
}
