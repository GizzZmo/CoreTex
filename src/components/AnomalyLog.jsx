import React, { memo, useMemo } from "react";
import PropTypes from "prop-types";
import { formatTimestamp, getAnomalyTypeColor } from "../utils";

// Individual anomaly item component for better performance
const AnomalyItem = memo(function AnomalyItem({ anomaly, index }) {
  const formatTime = useMemo(() => {
    return formatTimestamp(anomaly.time);
  }, [anomaly.time]);

  const typeColor = useMemo(() => {
    return getAnomalyTypeColor(anomaly.type);
  }, [anomaly.type]);

  return (
    <li className="p-3 bg-gray-900 rounded shadow-md border-l-4 border-red-500 hover:bg-gray-800 transition-colors">
      <div className="mb-1">
        <strong className="text-teal-300">Tidspunkt:</strong> 
        <span className="ml-2 text-gray-300">{formatTime}</span>
      </div>
      <div className="mb-1">
        <strong className="text-teal-300">Beskrivelse:</strong> 
        <span className="ml-2 text-white">{anomaly.description}</span>
      </div>
      <div>
        <strong className="text-teal-300">Type:</strong> 
        <span className={`ml-2 ${typeColor} font-medium`}>{anomaly.type}</span>
      </div>
    </li>
  );
});

AnomalyItem.propTypes = {
  anomaly: PropTypes.shape({
    time: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    type: PropTypes.string.isRequired,
  }).isRequired,
  index: PropTypes.number.isRequired,
};

// Viser en logg over registrerte avvik (anomalier) i systemet
const AnomalyLog = memo(function AnomalyLog({ anomalies }) {
  const anomalyCount = anomalies.length;
  
  const sortedAnomalies = useMemo(() => {
    return [...anomalies].sort((a, b) => new Date(b.time) - new Date(a.time));
  }, [anomalies]);

  if (anomalyCount === 0) {
    return (
      <section className="anomaly-log bg-gray-800 p-4 rounded-lg mb-4">
        <h2 className="text-xl font-semibold text-red-400 mb-2">
          Avvikslogg
          <span className="ml-2 text-sm text-gray-400">(0 avvik)</span>
        </h2>
        <div className="text-gray-400 text-center py-4 border border-dashed border-gray-600 rounded">
          <span className="text-green-400">✓</span> Ingen avvik registrert.
        </div>
      </section>
    );
  }

  return (
    <section className="anomaly-log bg-gray-800 p-4 rounded-lg mb-4">
      <h2 className="text-xl font-semibold text-red-400 mb-3">
        Avvikslogg
        <span className="ml-2 text-sm text-gray-400">({anomalyCount} avvik)</span>
      </h2>
      <div className="max-h-96 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-gray-800">
        <ul className="space-y-3">
          {sortedAnomalies.map((anomaly, idx) => (
            <AnomalyItem 
              key={`${anomaly.time}-${idx}`} 
              anomaly={anomaly} 
              index={idx} 
            />
          ))}
        </ul>
      </div>
    </section>
  );
});

AnomalyLog.propTypes = {
  anomalies: PropTypes.arrayOf(PropTypes.shape({
    time: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    type: PropTypes.string.isRequired,
  })).isRequired,
};

export default AnomalyLog;
