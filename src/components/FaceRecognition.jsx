import React, { useEffect, useRef, useState, useCallback, memo } from "react";
import PropTypes from "prop-types";
import { validateCameraConstraints, getCameraErrorMessage } from "../utils";

// FaceRecognition-komponenten håndterer webcam-feed og viser ansiktsgjenkjenning/anomalideteksjon
const FaceRecognition = memo(function FaceRecognition({ onDetect, tolerance, knownFaces }) {
  const videoRef = useRef(null);
  const streamRef = useRef(null);
  const [status, setStatus] = useState("Starter kamera...");
  const [error, setError] = useState(null);
  const [isRetrying, setIsRetrying] = useState(false);

  const stopStream = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
  }, []);

  const startCamera = useCallback(async () => {
    try {
      setError(null);
      setStatus("Starter kamera...");
      
      // Stop any existing stream
      stopStream();

      // Request camera with validated constraints
      const constraints = validateCameraConstraints();
      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      streamRef.current = stream;
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        setStatus("Kamera aktivt");
      }
    } catch (err) {
      console.error("Camera error:", err);
      const errorMessage = getCameraErrorMessage(err);
      setError(errorMessage);
      setStatus(errorMessage);
    }
  }, [stopStream]);

  const retryCamera = useCallback(async () => {
    setIsRetrying(true);
    await new Promise(resolve => setTimeout(resolve, 1000)); // Brief delay
    await startCamera();
    setIsRetrying(false);
  }, [startCamera]);

  // Initialize camera on mount
  useEffect(() => {
    startCamera();
    return stopStream;
  }, [startCamera, stopStream]);

  // Handle video element errors
  const handleVideoError = useCallback((e) => {
    console.error("Video error:", e);
    setError("Video avspilling feilet");
    setStatus("Video feil");
  }, []);

  // Simulate face detection (placeholder for actual implementation)
  useEffect(() => {
    if (status === "Kamera aktivt") {
      const simulateDetection = () => {
        // This is where you would integrate with face-api.js or similar
        // For now, we'll simulate occasional detection for demo purposes
        if (Math.random() < 0.1) { // 10% chance of "detection"
          onDetect({
            description: "Simulert ansiktsdeteksjon",
            type: "System"
          });
        }
      };

      const interval = setInterval(simulateDetection, 5000);
      return () => clearInterval(interval);
    }
  }, [status, onDetect]);

  const getStatusColor = () => {
    if (error) return "text-red-400";
    if (status === "Kamera aktivt") return "text-green-400";
    return "text-yellow-400";
  };

  return (
    <section className="face-recognition bg-gray-800 p-4 mb-4 rounded-lg border border-gray-700">
      <h2 className="text-xl font-semibold text-teal-400 mb-3">Ansiktsgjenkjenning</h2>
      
      <div className="relative mb-3">
        <video 
          ref={videoRef} 
          autoPlay 
          muted 
          playsInline
          onError={handleVideoError}
          className="w-full rounded shadow-lg bg-black" 
          style={{ aspectRatio: '4/3' }}
        />
        {(status !== "Kamera aktivt" || error) && (
          <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 rounded">
            <div className="text-center">
              <div className="text-2xl mb-2">📷</div>
              <div className={`text-sm ${getStatusColor()}`}>{status}</div>
            </div>
          </div>
        )}
      </div>

      <div className="flex justify-between items-center mb-2">
        <div className={`text-sm ${getStatusColor()}`}>
          Status: {status}
        </div>
        {error && (
          <button
            onClick={retryCamera}
            disabled={isRetrying}
            className="px-3 py-1 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 text-white text-xs rounded transition-colors"
          >
            {isRetrying ? "Prøver..." : "Prøv igjen"}
          </button>
        )}
      </div>

      <div className="text-xs text-gray-400 space-y-1">
        <div>
          <strong>Toleranse:</strong> 
          <span className="ml-1 text-teal-300">{tolerance}</span>
        </div>
        <div>
          <strong>Kjente ansikter:</strong> 
          <span className="ml-1 text-purple-400">{knownFaces.length}</span>
          {knownFaces.length > 0 && (
            <span className="ml-2 text-gray-500">
              ({knownFaces.slice(0, 3).join(", ")}{knownFaces.length > 3 ? "..." : ""})
            </span>
          )}
        </div>
      </div>
    </section>
  );
});

FaceRecognition.propTypes = {
  onDetect: PropTypes.func.isRequired,
  tolerance: PropTypes.number.isRequired,
  knownFaces: PropTypes.arrayOf(PropTypes.string).isRequired,
};

export default FaceRecognition;
