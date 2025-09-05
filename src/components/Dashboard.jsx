import React, { memo } from "react";
import PropTypes from "prop-types";
import { formatUptime, formatTimestamp } from "../utils";

// Dashboard viser sanntidsstatistikk og nøkkeltall for ledelse/bruker
const Dashboard = memo(function Dashboard({ anomalies, uptime, users, lastReport }) {
  return (
    <section className="dashboard bg-gray-900 text-teal-300 p-6 rounded-lg shadow-lg mb-4">
      <h2 className="text-2xl mb-4 font-bold tracking-wide">Dashboard</h2>
      <ul className="space-y-2 text-lg">
        <li>
          <strong>Oppdagede avvik:</strong> 
          <span className={`ml-2 ${anomalies > 0 ? 'text-red-400' : 'text-green-400'}`}>
            {anomalies}
          </span>
        </li>
        <li>
          <strong>Oppetid:</strong> 
          <span className="ml-2 text-blue-400">{formatUptime(uptime)}</span>
        </li>
        <li>
          <strong>Registrerte brukere:</strong> 
          <span className="ml-2 text-purple-400">{users}</span>
        </li>
        <li>
          <strong>Siste risikorapport:</strong> 
          <span className="ml-2 text-gray-300">{formatTimestamp(lastReport)}</span>
        </li>
      </ul>
    </section>
  );
});

Dashboard.propTypes = {
  anomalies: PropTypes.number.isRequired,
  uptime: PropTypes.number.isRequired,
  users: PropTypes.number.isRequired,
  lastReport: PropTypes.string,
};

Dashboard.defaultProps = {
  lastReport: null,
};

export default Dashboard;
