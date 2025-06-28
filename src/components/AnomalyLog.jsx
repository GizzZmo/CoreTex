import React from "react";

// Viser en logg over registrerte avvik (anomalier) i systemet
export default function AnomalyLog({ anomalies }) {
  return (
    <section className="anomaly-log bg-gray-800 p-4 rounded-lg mb-4">
      <h2 className="text-xl font-semibold text-red-400 mb-2">Avvikslogg</h2>
      {anomalies.length === 0 ? (
        <div className="text-gray-400">Ingen avvik registrert.</div>
      ) : (
        <ul className="space-y-2">
          {anomalies.map((anomaly, idx) => (
            <li key={idx} className="p-2 bg-gray-900 rounded shadow">
              <div>
                <strong>Tidspunkt:</strong> {anomaly.time}
              </div>
              <div>
                <strong>Beskrivelse:</strong> {anomaly.description}
              </div>
              <div>
                <strong>Type:</strong> {anomaly.type}
              </div>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
