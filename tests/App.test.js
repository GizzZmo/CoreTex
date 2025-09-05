// Enkel test for å sjekke at App-komponenten rendrer uten feil

import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import App from "../src/App";

test("App renders without crashing", async () => {
  render(<App />);
  
  // Wait for i18n to initialize and app to render
  await waitFor(() => {
    expect(screen.getByText(/Sanntids avviksdeteksjon/i)).toBeInTheDocument();
  }, { timeout: 5000 });
});
