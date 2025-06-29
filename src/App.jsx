import React, { useState } from "react";
import Dashboard from "./components/Dashboard";
import FaceRecognition from "./components/FaceRecognition";
import AnomalyLog from "./components/AnomalyLog";
import LanguageSwitcher from "./components/LanguageSwitcher";
import "./styles/main.css";
import { translations } from "./i18n";

export default function App() {
  const [language, setLanguage] = useState("no");
  const [anomalies, setAnomalies] = useState([]);
  const [uptime] = useState(1234);
  const [users] = useState(42);
  const [lastReport] = useState("2025-06-28 20:15");

  // Dummy-funksjon for å simulere deteksjon
  const handleDetect = (anomaly) => {
    setAnomalies((prev) => [
      ...prev,
      {
        time: new Date().toLocaleString(),
        description: anomaly.description || "Ukjent avvik",
        type: anomaly.type || "Annet",
      },
    ]);
  };

  // Dummy-data for kjent ansikter (i produksjon hentes dette f.eks. fra server)
  const knownFaces = ["Ola", "Kari", "Per"];

  // Dummy-toleranse
  const tolerance = 0.7;

  // Hent oversatte tekster
  const t = translations[language];

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100 font-sans pb-8">
      <header className="p-6 bg-teal-800 text-white shadow flex flex-col items-center">
        <img src="/assets/logo.png" alt="CORTEX-logo" className="w-16 mb-2" />
        <h1 className="text-3xl font-bold tracking-wide mb-1">{t.title}</h1>
        <div className="text-teal-200">{t.description}</div>
      </header>
      <main className="max-w-2xl mx-auto mt-6">
        <LanguageSwitcher currentLanguage={language} onChange={setLanguage} />
        <Dashboard
          anomalies={anomalies.length}
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
