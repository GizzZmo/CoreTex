import React from "react";
import { render, screen } from "@testing-library/react";
import Dashboard from "../src/components/Dashboard";

test("Dashboard viser nøkkeltall", () => {
  render(
    <Dashboard
      anomalies={5}
      uptime={1500}
      users={33}
      lastReport="2025-06-28 20:15"
    />
  );
  expect(screen.getByText(/Oppdagede avvik/i)).toBeInTheDocument();
  expect(screen.getByText(/1500 min/i)).toBeInTheDocument();
  expect(screen.getByText(/33/)).toBeInTheDocument();
  expect(screen.getByText(/2025-06-28 20:15/)).toBeInTheDocument();
});
