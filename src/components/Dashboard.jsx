import React from "react";
import PropTypes from "prop-types";

// Dashboard viser sanntidsstatistikk og nøkkeltall for ledelse/bruker
export default function Dashboard({ anomalies, uptime, users, lastReport }) {
  return (
    <section className="dashboard bg-gray-900 text-teal-300 p-6 rounded-lg shadow-lg mb-4">
      <h2 className="text-2xl mb-4 font-bold tracking-wide">Dashboard</h2>
      <ul className="space-y-2 text-lg">
        <li>
          <strong>Oppdagede avvik:</strong> {anomalies}
        </li>
        <li>
          <strong>Oppetid:</strong> {uptime} min
        </li>
        <li>
          <strong>Registrerte brukere:</strong> {users}
        </li>
        <li>
          <strong>Siste risikorapport:</strong> {lastReport || "Ingen"}
        </li>
      </ul>
    </section>
  );
}

Dashboard.propTypes = {
  anomalies: PropTypes.number.isRequired,
  uptime: PropTypes.number.isRequired,
  users: PropTypes.number.isRequired,
  lastReport: PropTypes.string,
};
