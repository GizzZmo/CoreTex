import React, { useState, useCallback, useMemo, useEffect } from "react";
import Dashboard from "./components/Dashboard";
import FaceRecognition from "./components/FaceRecognition";
import AnomalyLog from "./components/AnomalyLog";
import LanguageSwitcher from "./components/LanguageSwitcher";
import "./styles/main.css";
import { translations } from "./i18n";
import { generateAnomalyId } from "./utils";

export default function App() {
  const [language, setLanguage] = useState("no");
  const [anomalies, setAnomalies] = useState([]);
  const [uptime, setUptime] = useState(0);
  const [users] = useState(42);
  const [lastReport] = useState("2025-06-28 20:15");

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
      description: anomaly.description || "Ukjent avvik",
      type: anomaly.type || "Annet",
    };

    setAnomalies((prev) => [newAnomaly, ...prev].slice(0, 100)); // Keep only last 100 anomalies
  }, []);

  // Optimized language change handler
  const handleLanguageChange = useCallback((newLanguage) => {
    setLanguage(newLanguage);
    // Store preference in localStorage for persistence
    try {
      localStorage.setItem('cortex-language', newLanguage);
    } catch (error) {
      console.warn('Could not save language preference:', error);
    }
  }, []);

  // Load saved language preference on mount
  useEffect(() => {
    try {
      const savedLanguage = localStorage.getItem('cortex-language');
      if (savedLanguage && (savedLanguage === 'no' || savedLanguage === 'en')) {
        setLanguage(savedLanguage);
      }
    } catch (error) {
      console.warn('Could not load language preference:', error);
    }
  }, []);

  // Dummy-data for kjent ansikter (i produksjon hentes dette f.eks. fra server)
  const knownFaces = useMemo(() => ["Ola", "Kari", "Per"], []);

  // Dummy-toleranse
  const tolerance = useMemo(() => 0.7, []);

  // Memoize translations to prevent unnecessary recalculation
  const t = useMemo(() => translations[language], [language]);

  // Memoize anomaly count for dashboard
  const anomalyCount = useMemo(() => anomalies.length, [anomalies.length]);

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
        <h1 className="text-3xl font-bold tracking-wide mb-1">{t.title}</h1>
        <div className="text-teal-200">{t.description}</div>
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
        © 2025 CORTEX – {t.footer}
      </footer>
    </div>
  );
}
