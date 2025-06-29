// Mock-test for FaceRecognition-komponenten

import React from "react";
import { render } from "@testing-library/react";
import FaceRecognition from "../src/components/FaceRecognition";

test("FaceRecognition renders and contains video element", () => {
  const { container } = render(
    <FaceRecognition onDetect={() => {}} tolerance={0.7} knownFaces={["Ola", "Kari"]} />
  );
  const video = container.querySelector("video");
  expect(video).toBeInTheDocument();
});
