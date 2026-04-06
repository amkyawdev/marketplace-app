'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { NRC_REGIONS, NRC_TYPES, MYANMAR_NRC_DATA, formatNRC, getTownshipsByRegion } from '@/lib/nrc-constants';

interface NRCSelectorProps {
  value: {
    region: string;
    township: string;
    type: string;
    serial: string;
  };
  onChange: (value: { region: string; township: string; type: string; serial: string }) => void;
  error?: string;
}

export default function NRCSelector({ value, onChange, error }: NRCSelectorProps) {
  const [townships, setTownships] = useState<{ value: string; label: string }[]>([]);

  useEffect(() => {
    if (value.region && MYANMAR_NRC_DATA[value.region as keyof typeof MYANMAR_NRC_DATA]) {
      setTownships(getTownshipsByRegion(value.region));
    } else {
      setTownships([]);
    }
  }, [value.region]);

  const handleRegionChange = (region: string) => {
    onChange({ ...value, region, township: '', serial: '' });
  };

  const handleTownshipChange = (township: string) => {
    onChange({ ...value, township, serial: '' });
  };

  const handleTypeChange = (type: string) => {
    onChange({ ...value, type, serial: '' });
  };

  const handleSerialChange = (serial: string) => {
    // Only allow digits and max 6 characters
    const filtered = serial.replace(/\D/g, '').slice(0, 6);
    onChange({ ...value, serial: filtered });
  };

  const formattedNRC = value.region && value.township && value.type && value.serial
    ? formatNRC(value)
    : '';

  return (
    <div className="space-y-4">
      <label className="block text-sm font-medium text-white/70">
        NRC Number
      </label>
      
      <div className="flex flex-wrap gap-2 items-center">
        {/* Region */}
        <div className="flex-shrink-0">
          <select
            value={value.region}
            onChange={(e) => handleRegionChange(e.target.value)}
            className="
              bg-white/5 border border-white/10 rounded-xl px-3 py-3
              text-white appearance-none cursor-pointer
              focus:outline-none focus:ring-2 focus:ring-primary/50
              min-w-[80px] text-center font-mono
            "
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='white'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")`,
              backgroundRepeat: 'no-repeat',
              backgroundPosition: 'right 8px center',
              backgroundSize: '20px',
              paddingRight: '32px'
            }}
          >
            <option value="" className="bg-slate-900">၁-၁၄</option>
            {NRC_REGIONS.map((r) => (
              <option key={r.value} value={r.value} className="bg-slate-900">
                {r.label}
              </option>
            ))}
          </select>
        </div>

        <span className="text-white/50 text-xl">/</span>

        {/* Township */}
        <div className="flex-shrink-0">
          <select
            value={value.township}
            onChange={(e) => handleTownshipChange(e.target.value)}
            disabled={!value.region}
            className="
              bg-white/5 border border-white/10 rounded-xl px-3 py-3
              text-white appearance-none cursor-pointer
              focus:outline-none focus:ring-2 focus:ring-primary/50
              min-w-[100px] text-center font-mono
              disabled:opacity-50 disabled:cursor-not-allowed
            "
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='white'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")`,
              backgroundRepeat: 'no-repeat',
              backgroundPosition: 'right 8px center',
              backgroundSize: '20px',
              paddingRight: '32px'
            }}
          >
            <option value="" className="bg-slate-900">Township</option>
            {townships.map((t) => (
              <option key={t.value} value={t.value} className="bg-slate-900">
                {t.label}
              </option>
            ))}
          </select>
        </div>

        <span className="text-white/50 text-xl">(</span>

        {/* Type */}
        <div className="flex-shrink-0">
          <select
            value={value.type}
            onChange={(e) => handleTypeChange(e.target.value)}
            disabled={!value.township}
            className="
              bg-white/5 border border-white/10 rounded-xl px-3 py-3
              text-white appearance-none cursor-pointer
              focus:outline-none focus:ring-2 focus:ring-primary/50
              min-w-[80px] text-center font-mono
              disabled:opacity-50 disabled:cursor-not-allowed
            "
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='white'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")`,
              backgroundRepeat: 'no-repeat',
              backgroundPosition: 'right 8px center',
              backgroundSize: '20px',
              paddingRight: '32px'
            }}
          >
            <option value="" className="bg-slate-900">Type</option>
            {NRC_TYPES.map((t) => (
              <option key={t.value} value={t.value} className="bg-slate-900">
                {t.label}
              </option>
            ))}
          </select>
        </div>

        <span className="text-white/50 text-xl">)</span>

        {/* Serial */}
        <div className="flex-shrink-0">
          <input
            type="text"
            value={value.serial}
            onChange={(e) => handleSerialChange(e.target.value)}
            disabled={!value.type}
            placeholder="123456"
            maxLength={6}
            className="
              w-28 bg-white/5 border border-white/10 rounded-xl px-4 py-3
              text-white placeholder-white/30
              focus:outline-none focus:ring-2 focus:ring-primary/50
              font-mono text-center tracking-widest
              disabled:opacity-50 disabled:cursor-not-allowed
              placeholder:text-center
            "
          />
        </div>
      </div>

      {/* Preview */}
      {formattedNRC && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-4 p-4 bg-primary/10 border border-primary/30 rounded-xl text-center"
        >
          <span className="font-mono text-xl tracking-widest text-primary">
            {formattedNRC}
          </span>
        </motion.div>
      )}

      {error && (
        <p className="text-sm text-red-400 mt-2">{error}</p>
      )}
    </div>
  );
}