// Enkel test for å sjekke at App-komponenten rendrer uten feil

import React from "react";
import { render } from "@testing-library/react";
import App from "../src/App";

test("App renders without crashing", () => {
  render(<App />);
});
