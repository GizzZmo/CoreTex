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
  expect(screen.getByText(/1d 1t 0m/i)).toBeInTheDocument(); // Updated to match new formatting
  expect(screen.getByText(/33/)).toBeInTheDocument();
  expect(screen.getByText(/28\.6\.2025/)).toBeInTheDocument(); // Updated to match locale formatting
});

test("Dashboard formaterer oppetid korrekt", () => {
  const { rerender } = render(
    <Dashboard anomalies={0} uptime={30} users={10} />
  );
  expect(screen.getByText(/30 min/)).toBeInTheDocument();
  
  rerender(<Dashboard anomalies={0} uptime={120} users={10} />);
  expect(screen.getByText(/2t 0m/)).toBeInTheDocument();
  
  rerender(<Dashboard anomalies={0} uptime={1500} users={10} />);
  expect(screen.getByText(/1d 1t 0m/)).toBeInTheDocument();
});

test("Dashboard viser riktig farge for avvik", () => {
  const { rerender } = render(
    <Dashboard anomalies={0} uptime={100} users={10} />
  );
  expect(screen.getByText("0")).toHaveClass("text-green-400");
  
  rerender(<Dashboard anomalies={5} uptime={100} users={10} />);
  expect(screen.getByText("5")).toHaveClass("text-red-400");
});
