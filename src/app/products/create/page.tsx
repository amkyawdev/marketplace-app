'use client';

import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { createClient } from '@/lib/supabase';
import { PRODUCT_CATEGORIES } from '@/lib/nrc-constants';
import { useUser } from '@/hooks/useUser';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Camera from '@/components/auth/Camera';

export default function CreateProductPage() {
  const router = useRouter();
  const { user, profile } = useUser();
  const supabase = createClient();
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Form data
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [category, setCategory] = useState('');
  const [images, setImages] = useState<File[]>([]);
  const [imageUrls, setImageUrls] = useState<string[]>([]);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Check if user is verified
  if (!profile?.is_verified) {
    return (
      <div className="min-h-screen pt-24 pb-12 px-4">
        <div className="max-w-2xl mx-auto text-center">
          <div className="text-6xl mb-4">🛡️</div>
          <h1 className="text-2xl font-bold mb-4">Verification Required</h1>
          <p className="text-white/60 mb-6">
            You need to complete NRC verification before listing products.
          </p>
          <Button onClick={() => router.push('/auth/signup')}>
            Complete Verification
          </Button>
        </div>
      </div>
    );
  }

  const handleImageCapture = (file: File) => {
    if (images.length >= 5) return;
    
    setImages(prev => [...prev, file]);
    setImageUrls(prev => [...prev, URL.createObjectURL(file)]);
  };

  const handleRemoveImage = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index));
    setImageUrls(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (!user) throw new Error('Not authenticated');
      if (!title || !price || !category) throw new Error('Please fill all required fields');
      if (images.length === 0) throw new Error('Please add at least one photo');

      // Upload images
      const uploadedUrls: string[] = [];
      
      for (let i = 0; i < images.length; i++) {
        const file = images[i];
        const path = `${user.id}/${Date.now()}-${i}.jpg`;
        
        const { data, error: uploadError } = await supabase.storage
          .from('product-images')
          .upload(path, file, { upsert: true });

        if (uploadError) throw uploadError;

        const { data: { publicUrl } } = supabase.storage
          .from('product-images')
          .getPublicUrl(path);

        uploadedUrls.push(publicUrl);
      }

      // Create product
      const { data: product, error: productError } = await supabase
        .from('products')
        .insert({
          seller_id: user.id,
          title,
          description,
          price: parseFloat(price),
          category,
          images: uploadedUrls,
          status: 'open',
        })
        .select()
        .single();

      if (productError) throw productError;

      router.push(`/products/${product.id}`);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen pt-24 pb-12 px-4">
      <div className="max-w-2xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-3xl font-heading font-bold mb-2">
            List a Product
          </h1>
          <p className="text-white/60 mb-8">
            Fill in the details to list your product
          </p>

          {error && (
            <div className="mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Photos */}
            <div>
              <label className="block text-sm font-medium text-white/70 mb-2">
                Product Photos (up to 5)
              </label>
              
              <div className="grid grid-cols-3 gap-2 mb-3">
                {imageUrls.map((url, i) => (
                  <div key={i} className="relative aspect-square rounded-xl overflow-hidden">
                    <img src={url} alt="" className="w-full h-full object-cover" />
                    <button
                      type="button"
                      onClick={() => handleRemoveImage(i)}
                      className="absolute top-1 right-1 p-1 bg-red-500/80 rounded-full"
                    >
                      <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                ))}
                
                {images.length < 5 && (
                  <Camera
                    label="Add Photo"
                    imagePreview={undefined}
                    onCapture={handleImageCapture}
                  />
                )}
              </div>
            </div>

            {/* Title */}
            <Input
              label="Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="What are you selling?"
              required
            />

            {/* Price */}
            <Input
              label="Price (MMK)"
              type="number"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              placeholder="100000"
              min={1}
              required
            />

            {/* Category */}
            <div>
              <label className="block text-sm font-medium text-white/70 mb-2">
                Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                required
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary/50"
                style={{
                  backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='white'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")`,
                  backgroundRepeat: 'no-repeat',
                  backgroundPosition: 'right 12px center',
                  backgroundSize: '20px',
                  paddingRight: '40px'
                }}
              >
                <option value="" className="bg-slate-900">Select a category</option>
                {PRODUCT_CATEGORIES.map((cat) => (
                  <option key={cat.value} value={cat.value} className="bg-slate-900">
                    {cat.icon} {cat.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-white/70 mb-2">
                Description
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe your product..."
                rows={4}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none"
              />
            </div>

            {/* Submit */}
            <Button type="submit" loading={loading} className="w-full">
              List Product
            </Button>
          </form>
        </motion.div>
      </div>
    </main>
  );
}