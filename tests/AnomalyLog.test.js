import React from "react";
import { render, screen } from "@testing-library/react";
import AnomalyLog from "../src/components/AnomalyLog";

test("AnomalyLog viser ingen avvik når listen er tom", () => {
  render(<AnomalyLog anomalies={[]} />);
  expect(screen.getByText(/Ingen avvik registrert/i)).toBeInTheDocument();
});

test("AnomalyLog viser avviksdetaljer", () => {
  const data = [
    { time: "2025-06-28 12:00", description: "Ugyldig tilgang", type: "Sikkerhet" }
  ];
  render(<AnomalyLog anomalies={data} />);
  expect(screen.getByText(/Ugyldig tilgang/i)).toBeInTheDocument();
  expect(screen.getByText(/Sikkerhet/i)).toBeInTheDocument();
});
