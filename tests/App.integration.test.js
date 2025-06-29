import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import App from "../src/App";

test("App bytter språk og viser oppdatert tekst", () => {
  render(<App />);
  // Sjekk at norsk tekst vises først
  expect(screen.getByText(/Sanntids avviksdeteksjon/i)).toBeInTheDocument();
  // Bytt til engelsk
  fireEvent.change(screen.getByLabelText(/Språk/i), { target: { value: "en" } });
  // Sjekk at engelsk tekst vises
  expect(screen.getByText(/Real-time Anomaly Detection/i)).toBeInTheDocument();
});
