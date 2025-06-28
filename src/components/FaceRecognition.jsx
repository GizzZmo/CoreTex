import React, { useEffect, useRef, useState } from "react";

// FaceRecognition-komponenten håndterer webcam-feed og viser ansiktsgjenkjenning/anomalideteksjon
export default function FaceRecognition({ onDetect, tolerance, knownFaces }) {
  const videoRef = useRef(null);
  const [status, setStatus] = useState("Starter kamera …");

  useEffect(() => {
    let stream;
    async function startCamera() {
      try {
        stream = await navigator.mediaDevices.getUserMedia({ video: true });
        videoRef.current.srcObject = stream;
        setStatus("Kamera aktivt");
      } catch (e) {
        setStatus("Kunne ikke starte kamera");
      }
    }
    startCamera();
    return () => { if (stream) stream.getTracks().forEach(t => t.stop()); };
  }, []);

  // Her bør du legge til integrasjon med face-api.js eller annen logikk for ansiktsgjenkjenning
  // og kalle `onDetect(data)` med resultater når ansikt(er) gjenkjennes.

  return (
    <section className="face-recognition bg-gray-800 p-4 mb-4 rounded-lg">
      <h2 className="text-xl font-semibold text-teal-400 mb-2">Ansiktsgjenkjenning</h2>
      <video ref={videoRef} autoPlay muted className="w-full rounded shadow mb-2" />
      <div className="text-sm text-gray-400">{status}</div>
      <div className="text-xs mt-2">
        <strong>Toleranse:</strong> {tolerance} <br />
        <strong>Kjente ansikter:</strong> {knownFaces.length}
      </div>
    </section>
  );
}
