'use client';

import { useRef, useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface FaceScannerProps {
  onCapture: (file: File) => void;
  imagePreview?: string;
}

export default function FaceScanner({ onCapture, imagePreview }: FaceScannerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isStreaming, setIsStreaming] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [scanning, setScanning] = useState(false);
  const [showCamera, setShowCamera] = useState(false);

  const startCamera = async () => {
    try {
      setError(null);
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'user', width: 640, height: 480 }
      });
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        setIsStreaming(true);
        setShowCamera(true);
        // Auto-start scanning after a short delay
        setTimeout(() => setScanning(true), 1000);
      }
    } catch (err) {
      setError('Unable to access camera. Please check permissions.');
      console.error('Camera error:', err);
    }
  };

  const stopCamera = () => {
    if (videoRef.current?.srcObject) {
      const tracks = (videoRef.current.srcObject as MediaStream).getTracks();
      tracks.forEach(track => track.stop());
      videoRef.current.srcObject = null;
    }
    setIsStreaming(false);
    setScanning(false);
    setShowCamera(false);
  };

  const capturePhoto = () => {
    if (!videoRef.current || !canvasRef.current) return;

    const video = videoRef.current;
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');

    if (!context) return;

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    context.drawImage(video, 0, 0);

    canvas.toBlob((blob) => {
      if (blob) {
        const file = new File([blob], 'face-scan.jpg', {
          type: 'image/jpeg'
        });
        onCapture(file);
        stopCamera();
      }
    }, 'image/jpeg', 0.9);
  };

  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, []);

  return (
    <div className="space-y-4">
      <label className="block text-sm font-medium text-white/70">
        Live Face Scan
      </label>

      <AnimatePresence mode="wait">
        {imagePreview ? (
          <motion.div
            key="preview"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="relative aspect-square rounded-full overflow-hidden border-4 border-primary/50 w-48 h-48 mx-auto"
          >
            <img
              src={imagePreview}
              alt="Face scan"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 flex items-center justify-center bg-black/30">
              <div className="px-3 py-1 bg-green-500 rounded-full text-sm font-medium">
                ✓ Verified
              </div>
            </div>
          </motion.div>
        ) : showCamera ? (
          <motion.div
            key="camera"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="relative"
          >
            <div className="relative aspect-square rounded-full overflow-hidden bg-black w-48 h-48 mx-auto">
              <video
                ref={videoRef}
                autoPlay
                playsInline
                className="w-full h-full object-cover"
                style={{ transform: 'scaleX(-1)' }}
              />
              
              {/* Scanning animation overlay */}
              {scanning && (
                <motion.div
                  animate={{ y: [0, 200, 0] }}
                  transition={{ repeat: Infinity, duration: 2 }}
                  className="absolute left-0 right-0 h-1 bg-gradient-to-r from-transparent via-primary to-transparent"
                />
              )}

              {/* Face guide */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-40 border-2 border-white/50 rounded-full" />
            </div>

            <div className="flex flex-col items-center gap-3 mt-4">
              {scanning ? (
                <p className="text-sm text-white/70 animate-pulse">
                  Position your face in the circle...
                </p>
              ) : (
                <p className="text-sm text-white/50">
                  Getting ready...
                </p>
              )}
              
              <button
                onClick={capturePhoto}
                disabled={!scanning}
                className="px-8 py-3 bg-primary hover:bg-primary/80 disabled:opacity-50 disabled:cursor-not-allowed rounded-xl font-semibold transition-colors"
              >
                Take Photo
              </button>
              <button
                onClick={stopCamera}
                className="px-6 py-2 text-white/70 hover:text-white text-sm transition-colors"
              >
                Cancel
              </button>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="button"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <button
              onClick={startCamera}
              className="w-full py-12 border-2 border-dashed border-white/20 rounded-2xl hover:border-primary/50 hover:bg-white/5 transition-all group"
            >
              <div className="flex flex-col items-center gap-3">
                <div className="w-20 h-20 rounded-full bg-white/10 group-hover:bg-primary/20 flex items-center justify-center transition-colors">
                  <svg className="w-10 h-10 text-white/70 group-hover:text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <span className="text-white/70 group-hover:text-white transition-colors">
                  Start Face Scan
                </span>
              </div>
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {error && (
        <p className="text-sm text-red-400">{error}</p>
      )}

      <canvas ref={canvasRef} className="hidden" />
    </div>
  );
}