'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { createClient } from '@/lib/supabase';
import NRCSelector from '@/components/auth/NRCSelector';
import Camera from '@/components/auth/Camera';
import FaceScanner from '@/components/auth/FaceScanner';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import { formatNRC } from '@/lib/nrc-constants';

type Step = 'form' | 'nrc' | 'nrc-photos' | 'face-scan' | 'gps' | 'payment-info';

export default function SignupPage() {
  const router = useRouter();
  const supabase = createClient();
  
  const [step, setStep] = useState<Step>('form');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Form data
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  
  // NRC
  const [nrcParts, setNrcParts] = useState({
    region: '',
    township: '',
    type: '',
    serial: '',
  });
  const [nrcPhotos, setNrcPhotos] = useState<{ front: File | null; back: File | null }>({
    front: null,
    back: null,
  });
  const [nrcPhotoUrls, setNrcPhotoUrls] = useState<{ front: string | null; back: string | null }>({
    front: null,
    back: null,
  });
  
  // Face scan
  const [facePhoto, setFacePhoto] = useState<File | null>(null);
  const [facePhotoUrl, setFacePhotoUrl] = useState<string | null>(null);
  
  // GPS
  const [gpsLocation, setGpsLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [gpsLoading, setGpsLoading] = useState(false);
  const [gpsError, setGpsError] = useState<string | null>(null);
  
  // Payment
  const [kpayNo, setKpayNo] = useState('');
  const [waveNo, setWaveNo] = useState('');

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const { data, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { full_name: fullName },
        },
      });

      if (signUpError) throw signUpError;
      if (!data.user) throw new Error('Failed to create user');

      // Move to next step
      setStep('nrc');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleNrcSubmit = () => {
    if (nrcParts.region && nrcParts.township && nrcParts.type && nrcParts.serial) {
      setStep('nrc-photos');
    }
  };

  const handlePhotoCapture = (type: 'front' | 'back') => (file: File) => {
    setNrcPhotos(prev => ({ ...prev, [type]: file }));
    setNrcPhotoUrls(prev => ({
      ...prev,
      [type]: URL.createObjectURL(file),
    }));
  };

  const handleNrcPhotosSubmit = () => {
    if (nrcPhotos.front && nrcPhotos.back) {
      setStep('face-scan');
    }
  };

  const handleFaceCapture = (file: File) => {
    setFacePhoto(file);
    setFacePhotoUrl(URL.createObjectURL(file));
    setStep('gps');
  };

  const handleGetLocation = () => {
    setGpsLoading(true);
    setGpsError(null);

    if (!navigator.geolocation) {
      setGpsError('Geolocation is not supported');
      setGpsLoading(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setGpsLocation({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        });
        setGpsLoading(false);
      },
      (err) => {
        setGpsError(err.message);
        setGpsLoading(false);
      }
    );
  };

  const handleGpsSubmit = () => {
    if (gpsLocation) {
      setStep('payment-info');
    }
  };

  const handleCompleteSignup = async () => {
    setLoading(true);
    setError(null);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      // Upload NRC photos
      const nrcFrontUrl = await uploadFile(nrcPhotos.front!, 'nrc-photos', `${user.id}/nrc-front.jpg`);
      const nrcBackUrl = await uploadFile(nrcPhotos.back!, 'nrc-photos', `${user.id}/nrc-back.jpg`);

      // Upload face photo
      const faceUrl = await uploadFile(facePhoto!, 'nrc-photos', `${user.id}/face.jpg`);

      // Update profile
      const { error: updateError } = await supabase
        .from('profiles')
        .update({
          full_name: fullName,
          nrc_number: formatNRC(nrcParts),
          nrc_photo_url: [nrcFrontUrl, nrcBackUrl, faceUrl],
          gps_location: `POINT(${gpsLocation?.lng} ${gpsLocation?.lat})`,
          kpay_no: kpayNo || null,
          wave_no: waveNo || null,
        } as any)
        .eq('id', user.id);

      if (updateError) throw updateError;

      // Redirect to login (user needs to verify email)
      router.push('/auth/login?registered=true');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const uploadFile = async (file: File, bucket: string, path: string) => {
    const { data, error } = await supabase.storage
      .from(bucket)
      .upload(path, file, { upsert: true });

    if (error) throw error;

    const { data: { publicUrl } } = supabase.storage
      .from(bucket)
      .getPublicUrl(path);

    return publicUrl;
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-lg">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card p-8"
        >
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-heading font-bold mb-2">
              Create Account
            </h1>
            <p className="text-white/60">
              Join our secure marketplace
            </p>
          </div>

          {/* Error */}
          {error && (
            <div className="mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400">
              {error}
            </div>
          )}

          {/* Step 1: Basic Info */}
          {step === 'form' && (
            <form onSubmit={handleSignup} className="space-y-4">
              <Input
                label="Full Name"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Enter your full name"
                required
              />
              <Input
                label="Email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                required
              />
              <Input
                label="Password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                minLength={6}
                required
              />
              <Button type="submit" loading={loading} className="w-full">
                Continue
              </Button>
            </form>
          )}

          {/* Step 2: NRC */}
          {step === 'nrc' && (
            <div className="space-y-6">
              <NRCSelector
                value={nrcParts}
                onChange={setNrcParts}
              />
              <Button
                onClick={handleNrcSubmit}
                disabled={!nrcParts.serial}
                className="w-full"
              >
                Continue
              </Button>
            </div>
          )}

          {/* Step 3: NRC Photos */}
          {step === 'nrc-photos' && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-center">
                Upload NRC Photos
              </h3>
              <Camera
                label="NRC Front"
                imagePreview={nrcPhotoUrls.front || undefined}
                onCapture={handlePhotoCapture('front')}
                onClear={() => {
                  setNrcPhotos(p => ({ ...p, front: null }));
                  setNrcPhotoUrls(p => ({ ...p, front: null }));
                }}
              />
              <Camera
                label="NRC Back"
                imagePreview={nrcPhotoUrls.back || undefined}
                onCapture={handlePhotoCapture('back')}
                onClear={() => {
                  setNrcPhotos(p => ({ ...p, back: null }));
                  setNrcPhotoUrls(p => ({ ...p, back: null }));
                }}
              />
              <Button
                onClick={handleNrcPhotosSubmit}
                disabled={!nrcPhotos.front || !nrcPhotos.back}
                className="w-full"
              >
                Continue
              </Button>
            </div>
          )}

          {/* Step 4: Face Scan */}
          {step === 'face-scan' && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-center">
                Face Verification
              </h3>
              <FaceScanner
                imagePreview={facePhotoUrl || undefined}
                onCapture={handleFaceCapture}
              />
            </div>
          )}

          {/* Step 5: GPS */}
          {step === 'gps' && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-center">
                Location Verification
              </h3>
              
              <div className="p-8 text-center border border-white/10 rounded-xl">
                {gpsLocation ? (
                  <div className="space-y-2">
                    <div className="text-4xl">📍</div>
                    <p className="text-green-400">Location captured!</p>
                    <p className="text-white/50 text-sm">
                      {gpsLocation.lat.toFixed(4)}, {gpsLocation.lng.toFixed(4)}
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="text-4xl">🌐</div>
                    <p className="text-white/70">
                      We need your GPS location for secure transactions
                    </p>
                    <Button
                      onClick={handleGetLocation}
                      loading={gpsLoading}
                      variant="secondary"
                    >
                      {gpsLoading ? 'Getting location...' : 'Get My Location'}
                    </Button>
                    {gpsError && (
                      <p className="text-red-400 text-sm">{gpsError}</p>
                    )}
                  </div>
                )}
              </div>

              {gpsLocation && (
                <Button onClick={handleGpsSubmit} className="w-full">
                  Continue
                </Button>
              )}
            </div>
          )}

          {/* Step 6: Payment Info */}
          {step === 'payment-info' && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-center">
                Payment Information
              </h3>
              <p className="text-white/60 text-sm text-center">
                Add your KPay or Wave number to receive payments
              </p>
              
              <Input
                label="KPay Number (optional)"
                value={kpayNo}
                onChange={(e) => setKpayNo(e.target.value)}
                placeholder="09xxxxxxxxx"
              />
              <Input
                label="Wave Number (optional)"
                value={waveNo}
                onChange={(e) => setWaveNo(e.target.value)}
                placeholder="09xxxxxxxxx"
              />
              
              <Button
                onClick={handleCompleteSignup}
                loading={loading}
                className="w-full"
              >
                Complete Registration
              </Button>
            </div>
          )}

          {/* Footer */}
          <div className="mt-6 text-center text-sm text-white/50">
            Already have an account?{' '}
            <Link href="/auth/login" className="text-primary hover:underline">
              Login
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
}