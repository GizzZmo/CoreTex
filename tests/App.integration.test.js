import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import App from "../src/App";

test("App bytter språk og viser oppdatert tekst", async () => {
  render(<App />);
  
  // Wait for initial load and check Norwegian text
  await waitFor(() => {
    expect(screen.getByText(/Sanntids avviksdeteksjon/i)).toBeInTheDocument();
  }, { timeout: 3000 });
  
  // Switch to English
  const languageSelector = await screen.findByLabelText(/Språk/i);
  fireEvent.change(languageSelector, { target: { value: "en" } });
  
  // Wait for English text to appear
  await waitFor(() => {
    expect(screen.getByText(/Real-time Anomaly Detection/i)).toBeInTheDocument();
  }, { timeout: 3000 });
});
