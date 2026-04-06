'use client';

import { useRef, useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface CameraProps {
  onCapture: (file: File) => void;
  label: string;
  imagePreview?: string;
  onClear?: () => void;
}

export default function Camera({ onCapture, label, imagePreview, onClear }: CameraProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isStreaming, setIsStreaming] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showCamera, setShowCamera] = useState(false);
  const [useFileInput, setUseFileInput] = useState(false);

  const startCamera = async () => {
    try {
      setError(null);
      
      // Try rear camera first (mobile)
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { 
          facingMode: { ideal: 'environment' }, 
          width: { ideal: 1280 }, 
          height: { ideal: 720 } 
        }
      });
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        setIsStreaming(true);
        setShowCamera(true);
        setUseFileInput(false);
      }
    } catch (err) {
      console.log('Camera not available, trying front camera...');
      try {
        // Try front camera
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: 'user' }
        });
        
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          setIsStreaming(true);
          setShowCamera(true);
          setUseFileInput(false);
        }
      } catch (err2) {
        console.log('No camera available, using file input');
        setUseFileInput(true);
        setError('Camera not available. Please use file upload option.');
      }
    }
  };

  const stopCamera = () => {
    if (videoRef.current?.srcObject) {
      const tracks = (videoRef.current.srcObject as MediaStream).getTracks();
      tracks.forEach(track => track.stop());
      videoRef.current.srcObject = null;
    }
    setIsStreaming(false);
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
        const file = new File([blob], `${label.toLowerCase().replace(/\s+/g, '-')}.jpg`, {
          type: 'image/jpeg'
        });
        onCapture(file);
        stopCamera();
      }
    }, 'image/jpeg', 0.9);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onCapture(file);
    }
  };

  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, []);

  return (
    <div className="space-y-4">
      <label className="block text-sm font-medium text-white/70">{label}</label>

      <AnimatePresence mode="wait">
        {imagePreview ? (
          <motion.div
            key="preview"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="relative aspect-[4/3] rounded-2xl overflow-hidden border border-white/10"
          >
            <img
              src={imagePreview}
              alt={label}
              className="w-full h-full object-cover"
            />
            {onClear && (
              <button
                onClick={onClear}
                className="absolute top-3 right-3 p-2 bg-red-500/80 hover:bg-red-500 rounded-full transition-colors"
              >
                <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
          </motion.div>
        ) : showCamera ? (
          <motion.div
            key="camera"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="relative"
          >
            <div className="relative aspect-[4/3] rounded-2xl overflow-hidden bg-black">
              <video
                ref={videoRef}
                autoPlay
                playsInline
                className="w-full h-full object-cover"
              />
              
              <div className="absolute inset-0 pointer-events-none">
                <div className="absolute inset-0 border-2 border-white/30 rounded-2xl m-4" />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 border-2 border-primary/50 rounded-full" />
              </div>

              <div className="absolute top-8 left-8 w-8 h-8 border-l-2 border-t-2 border-white" />
              <div className="absolute top-8 right-8 w-8 h-8 border-r-2 border-t-2 border-white" />
              <div className="absolute bottom-8 left-8 w-8 h-8 border-l-2 border-b-2 border-white" />
              <div className="absolute bottom-8 right-8 w-8 h-8 border-r-2 border-b-2 border-white" />
            </div>

            <div className="flex gap-3 mt-4">
              <button
                onClick={capturePhoto}
                className="flex-1 py-3 bg-primary hover:bg-primary/80 rounded-xl font-semibold transition-colors"
              >
                📸 Capture
              </button>
              <button
                onClick={() => setUseFileInput(true)}
                className="px-6 py-3 bg-white/10 hover:bg-white/20 rounded-xl font-semibold transition-colors"
              >
                📁 Upload
              </button>
            </div>
          </motion.div>
        ) : useFileInput || error ? (
          <motion.div
            key="file-input"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <input
              type="file"
              accept="image/*"
              capture="environment"
              ref={fileInputRef}
              onChange={handleFileSelect}
              className="hidden"
            />
            <button
              onClick={() => fileInputRef.current?.click()}
              className="w-full py-12 border-2 border-dashed border-white/20 rounded-2xl hover:border-primary/50 hover:bg-white/5 transition-all group"
            >
              <div className="flex flex-col items-center gap-3">
                <div className="w-16 h-16 rounded-full bg-white/10 group-hover:bg-primary/20 flex items-center justify-center transition-colors">
                  <svg className="w-8 h-8 text-white/70 group-hover:text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <span className="text-white/70 group-hover:text-white transition-colors">
                  Click to upload photo
                </span>
              </div>
            </button>
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
                <div className="w-16 h-16 rounded-full bg-white/10 group-hover:bg-primary/20 flex items-center justify-center transition-colors">
                  <svg className="w-8 h-8 text-white/70 group-hover:text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <span className="text-white/70 group-hover:text-white transition-colors">
                  Click to open camera
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
