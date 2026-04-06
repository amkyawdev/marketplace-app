'use client';

import { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { formatMMK, calculateDownPayment } from '@/utils/formatters';
import type { Profile } from '@/types';

interface PaymentFormProps {
  product: {
    id: string;
    title: string;
    price: number;
    seller?: Profile;
  };
  onSubmit: (data: {
    paymentScreenshot: File;
    last4Digits: string;
  }) => Promise<void>;
}

export default function PaymentForm({ product, onSubmit }: PaymentFormProps) {
  const [screenshot, setScreenshot] = useState<File | null>(null);
  const [screenshotPreview, setScreenshotPreview] = useState<string | null>(null);
  const [last4Digits, setLast4Digits] = useState('');
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const downPayment = calculateDownPayment(product.price);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setScreenshot(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setScreenshotPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!screenshot || last4Digits.length !== 4) return;

    setLoading(true);
    try {
      await onSubmit({
        paymentScreenshot: screenshot,
        last4Digits,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Payment Details */}
      <div className="p-4 bg-primary/10 border border-primary/30 rounded-xl">
        <h4 className="font-semibold mb-3">30% Down Payment Required</h4>
        <div className="flex justify-between items-center mb-2">
          <span className="text-white/70">Total Price</span>
          <span className="font-semibold">{formatMMK(product.price)}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-primary">Down Payment (30%)</span>
          <span className="font-bold text-xl text-primary">{formatMMK(downPayment)}</span>
        </div>
      </div>

      {/* Seller Payment Info */}
      <div className="p-4 bg-white/5 border border-white/10 rounded-xl">
        <h4 className="font-semibold mb-3">Send Payment To</h4>
        
        {product.seller?.kpay_no && (
          <div className="flex items-center justify-between py-2 border-b border-white/10">
            <div className="flex items-center gap-2">
              <span className="text-2xl">💳</span>
              <span className="text-white/70">KPay</span>
            </div>
            <span className="font-mono font-semibold">{product.seller?.kpay_no}</span>
          </div>
        )}
        
        {product.seller?.wave_no && (
          <div className="flex items-center justify-between py-2">
            <div className="flex items-center gap-2">
              <span className="text-2xl">🌊</span>
              <span className="text-white/70">Wave</span>
            </div>
            <span className="font-mono font-semibold">{product.seller?.wave_no}</span>
          </div>
        )}
      </div>

      {/* Upload Screenshot */}
      <div>
        <label className="block text-sm font-medium text-white/70 mb-2">
          Payment Screenshot
        </label>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="hidden"
        />
        
        {screenshotPreview ? (
          <div className="relative aspect-video rounded-xl overflow-hidden border border-white/10">
            <img
              src={screenshotPreview}
              alt="Payment screenshot"
              className="w-full h-full object-contain bg-black"
            />
            <button
              type="button"
              onClick={() => {
                setScreenshot(null);
                setScreenshotPreview(null);
                if (fileInputRef.current) fileInputRef.current.value = '';
              }}
              className="absolute top-2 right-2 p-2 bg-red-500/80 hover:bg-red-500 rounded-full transition-colors"
            >
              <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="w-full py-8 border-2 border-dashed border-white/20 rounded-xl hover:border-primary/50 hover:bg-white/5 transition-all"
          >
            <div className="flex flex-col items-center gap-2">
              <svg className="w-8 h-8 text-white/50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <span className="text-white/50">Upload payment screenshot</span>
            </div>
          </button>
        )}
      </div>

      {/* Last 4 Digits */}
      <div>
        <label className="block text-sm font-medium text-white/70 mb-2">
          Transaction Last 4 Digits
        </label>
        <input
          type="text"
          value={last4Digits}
          onChange={(e) => setLast4Digits(e.target.value.replace(/\D/g, '').slice(0, 4))}
          placeholder="****"
          maxLength={4}
          className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/40 font-mono text-center tracking-widest text-xl"
        />
      </div>

      {/* Submit */}
      <motion.button
        type="submit"
        disabled={!screenshot || last4Digits.length !== 4 || loading}
        whileTap={{ scale: 0.98 }}
        className="w-full py-4 bg-gradient-to-r from-primary to-secondary rounded-xl font-semibold transition-all hover:shadow-lg hover:shadow-primary/25 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? (
          <span className="flex items-center justify-center gap-2">
            <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
            Processing...
          </span>
        ) : (
          `Confirm Down Payment of ${formatMMK(downPayment)}`
        )}
      </motion.button>
    </form>
  );
}