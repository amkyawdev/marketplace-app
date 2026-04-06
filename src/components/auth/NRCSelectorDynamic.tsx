'use client';

import { useState, useMemo } from 'react';
import { MapPin, Users, Hash, Eye, ChevronDown } from 'lucide-react';
import { MYANMAR_NRC_DATA, NRC_TYPES, NRC_REGIONS } from '@/lib/nrc-constants';

interface NRCSelectorProps {
  value?: string;
  onChange?: (nrc: string) => void;
  className?: string;
}

export default function NRCSelector({ value, onChange, className = '' }: NRCSelectorProps) {
  const [region, setRegion] = useState<string>('');
  const [township, setTownship] = useState<string>('');
  const [citizenType, setCitizenType] = useState<string>('');
  const [serial, setSerial] = useState<string>('');

  // Get townships for selected region
  const availableTownships = useMemo(() => {
    if (!region) return [];
    return MYANMAR_NRC_DATA[region as keyof typeof MYANMAR_NRC_DATA]?.townships || [];
  }, [region]);

  // Get citizen type label in Burmese
  const getCitizenLabel = (type: string) => {
    const found = NRC_TYPES.find(t => t.value === type);
    return found?.label || '';
  };

  // Format the NRC number
  const formattedNRC = useMemo(() => {
    if (!region || !township || !citizenType || serial.length !== 6) {
      return null;
    }
    return `${region}/${township}${getCitizenLabel(citizenType)}${serial}`;
  }, [region, township, citizenType, serial]);

  // Handle serial input - only 6 digits
  const handleSerialChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.replace(/\D/g, '').slice(0, 6);
    setSerial(val);
  };

  // Reset township when region changes
  const handleRegionChange = (newRegion: string) => {
    setRegion(newRegion);
    setTownship('');
  };

  return (
    <div className={`space-y-4 ${className}`}>
      {/* NRC Selection Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {/* Step 1: Region Select */}
        <div className="space-y-1">
          <label className="text-xs text-white/60 flex items-center gap-1">
            <MapPin className="w-3 h-3" />
            ပြည်နယ်/တိုင်းဒေသကြီး
          </label>
          <div className="relative">
            <select
              value={region}
              onChange={(e) => handleRegionChange(e.target.value)}
              className="w-full appearance-none bg-white/5 border border-white/10 rounded-xl px-4 py-3 pr-10 text-white focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/20 transition-all cursor-pointer"
            >
              <option value="" className="bg-slate-900">ရွေးပါပါ...</option>
              {NRC_REGIONS.map((r) => (
                <option key={r.value} value={r.value} className="bg-slate-900">
                  {r.label} - {MYANMAR_NRC_DATA[r.value as keyof typeof MYANMAR_NRC_DATA]?.name || ''}
                </option>
              ))}
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40 pointer-events-none" />
          </div>
        </div>

        {/* Step 2: Township Select */}
        <div className="space-y-1">
          <label className="text-xs text-white/60 flex items-center gap-1">
            <MapPin className="w-3 h-3" />
            မြို့နယ်
          </label>
          <div className="relative">
            <select
              value={township}
              onChange={(e) => setTownship(e.target.value)}
              disabled={!region}
              className="w-full appearance-none bg-white/5 border border-white/10 rounded-xl px-4 py-3 pr-10 text-white focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/20 transition-all cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <option value="" className="bg-slate-900">
                {region ? 'ရွေးပါပါ...' : 'ပြည်နယ်ရွေးပါ'}
              </option>
              {availableTownships.map((t) => (
                <option key={t} value={t} className="bg-slate-900">
                  {t}
                </option>
              ))}
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40 pointer-events-none" />
          </div>
        </div>

        {/* Step 3: Citizen Type */}
        <div className="space-y-1">
          <label className="text-xs text-white/60 flex items-center gap-1">
            <Users className="w-3 h-3" />
            နိုင်ငံသားအမျိုးအစား
          </label>
          <div className="relative">
            <select
              value={citizenType}
              onChange={(e) => setCitizenType(e.target.value)}
              className="w-full appearance-none bg-white/5 border border-white/10 rounded-xl px-4 py-3 pr-10 text-white focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/20 transition-all cursor-pointer"
            >
              <option value="" className="bg-slate-900">ရွေးပါပါ...</option>
              {NRC_TYPES.map((t) => (
                <option key={t.value} value={t.value} className="bg-slate-900">
                  {t.label} - {t.description}
                </option>
              ))}
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40 pointer-events-none" />
          </div>
        </div>

        {/* Step 4: Serial Number */}
        <div className="space-y-1">
          <label className="text-xs text-white/60 flex items-center gap-1">
            <Hash className="w-3 h-3" />
            နောက်ဆုံးဂဏန်း ၆ လုံး
          </label>
          <input
            type="text"
            value={serial}
            onChange={handleSerialChange}
            placeholder="၁၂၃၄၅၆"
            maxLength={6}
            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-white/30 focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/20 transition-all"
          />
        </div>
      </div>

      {/* Live Preview */}
      <div className="glass-card p-4 rounded-xl border border-primary/20 bg-primary/5">
        <div className="flex items-center gap-2 mb-2">
          <Eye className="w-4 h-4 text-primary" />
          <span className="text-sm text-white/70">လက်ရှိရွေးထားသော NRC</span>
        </div>
        {formattedNRC ? (
          <p className="text-2xl font-bold text-primary font-mono tracking-wider">
            {formattedNRC}
          </p>
        ) : (
          <p className="text-white/30 text-lg font-mono">
            အပေါ်ပါးကွက်လပ်များဖြည့်ပါပါ...
          </p>
        )}
      </div>

      {/* Hidden input for form submission */}
      {formattedNRC && (
        <input type="hidden" name="nrc_number" value={formattedNRC} />
      )}
    </div>
  );
}