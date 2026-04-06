'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { createClient } from '@/lib/supabase';
import { formatMMK, formatRelativeTime, getStatusColor } from '@/utils/formatters';
import { useUser } from '@/hooks/useUser';
import Button from '@/components/ui/Button';
import Modal from '@/components/ui/Modal';
import PaymentForm from '@/components/payment/PaymentForm';
import type { Product } from '@/types';

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { user, profile } = useUser();
  const productId = params.id as string;
  
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      const supabase = createClient();
      const { data, error } = await supabase
        .from('products')
        .select('*, seller:profiles(*)')
        .eq('id', productId)
        .single();

      if (!error && data) {
        setProduct(data as Product);
      }
      setLoading(false);
    };

    fetchProduct();
  }, [productId]);

  const handleBuyNow = () => {
    if (!user) {
      router.push('/auth/login?redirect=/products/' + productId);
      return;
    }
    if (!profile?.is_verified) {
      alert('Please complete NRC verification to purchase');
      return;
    }
    setShowPaymentModal(true);
  };

  const handlePaymentSubmit = async (data: {
    paymentScreenshot: File;
    last4Digits: string;
  }) => {
    if (!user || !product) return;
    
    setSubmitting(true);
    
    try {
      const supabase = createClient();
      
      // Upload screenshot
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('payment-screenshots')
        .upload(`${user.id}/${product.id}.jpg`, data.paymentScreenshot, { upsert: true });
      
      if (uploadError) throw uploadError;
      
      const { data: { publicUrl } } = supabase.storage
        .from('payment-screenshots')
        .getPublicUrl(`${user.id}/${product.id}.jpg`);
      
      // Create order (30% down payment)
      const { error: orderError } = await supabase
        .from('orders')
        .insert({
          product_id: product.id,
          buyer_id: user.id,
          seller_id: product.seller_id,
          payment_screenshot: publicUrl,
          last_4_digits: data.last4Digits,
          amount: product.price,
          down_payment_amount: Math.round(product.price * 0.3 * 100) / 100,
        });

      if (orderError) throw orderError;
      
      // Update product status to pending
      const { error: updateError } = await supabase
        .from('products')
        .update({ status: 'pending' })
        .eq('id', product.id);

      if (updateError) throw updateError;
      
      // Redirect to dashboard
      router.push('/dashboard?order=created');
    } catch (err: any) {
      alert(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen pt-24 pb-12 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-8">
            <div className="skeleton aspect-square rounded-2xl" />
            <div className="space-y-4">
              <div className="skeleton h-8 w-3/4" />
              <div className="skeleton h-6 w-1/2" />
              <div className="skeleton h-32" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen pt-24 pb-12 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <h1 className="text-2xl font-bold mb-4">Product Not Found</h1>
          <Link href="/products" className="text-primary hover:underline">
            Back to Products
          </Link>
        </div>
      </div>
    );
  }

  const isOwner = user?.id === product.seller_id;
  const canBuy = !isOwner && product.status === 'open' && profile?.is_verified;

  return (
    <main className="min-h-screen pt-24 pb-12 px-4">
      <div className="max-w-6xl mx-auto">
        <Link href="/products" className="inline-flex items-center gap-2 text-white/60 hover:text-white mb-6">
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to Products
        </Link>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Images */}
          <div className="space-y-4">
            <motion.div
              key={selectedImage}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="relative aspect-square rounded-2xl overflow-hidden glass-card"
            >
              {product.images?.[selectedImage] ? (
                <Image
                  src={product.images[selectedImage]}
                  alt={product.title}
                  fill
                  className="object-cover"
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center">
                  <span className="text-8xl">📦</span>
                </div>
              )}
            </motion.div>

            {product.images && product.images.length > 1 && (
              <div className="flex gap-2">
                {product.images.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setSelectedImage(i)}
                    className={`
                      w-20 h-20 rounded-xl overflow-hidden border-2 transition-colors
                      ${selectedImage === i ? 'border-primary' : 'border-transparent'}
                    `}
                  >
                    <Image src={img} alt="" width={80} height={80} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Details */}
          <div>
            <div className="flex items-start justify-between mb-4">
              <div>
                <span className={`status-badge ${getStatusColor(product.status)}`}>
                  {product.status.charAt(0).toUpperCase() + product.status.slice(1)}
                </span>
                {product.category && (
                  <span className="ml-2 text-sm text-white/50">{product.category}</span>
                )}
              </div>
              <span className="text-sm text-white/40">
                {formatRelativeTime(product.created_at)}
              </span>
            </div>

            <h1 className="text-3xl md:text-4xl font-heading font-bold mb-4">
              {product.title}
            </h1>

            <div className="text-3xl font-bold text-primary mb-6">
              {formatMMK(product.price)}
            </div>

            {product.description && (
              <div className="mb-6">
                <h3 className="text-sm font-medium text-white/70 mb-2">Description</h3>
                <p className="text-white/80 whitespace-pre-wrap">{product.description}</p>
              </div>
            )}

            {/* Seller Info */}
            <div className="p-4 bg-white/5 border border-white/10 rounded-xl mb-6">
              <h3 className="text-sm font-medium text-white/70 mb-3">Seller</h3>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-gradient-to-r from-primary to-secondary flex items-center justify-center text-lg font-semibold">
                  {product.seller?.full_name?.[0]?.toUpperCase() || '?'}
                </div>
                <div>
                  <p className="font-semibold">{product.seller?.full_name}</p>
                  {product.seller?.is_verified && (
                    <p className="text-sm text-primary flex items-center gap-1">
                      <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      Verified Seller
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Actions */}
            {canBuy && (
              <Button onClick={handleBuyNow} className="w-full">
                Buy Now (30% Down Payment)
              </Button>
            )}
            
            {isOwner && (
              <div className="space-y-2">
                <Button
                  onClick={async () => {
                    const supabase = createClient();
                    const newStatus = product.status === 'open' ? 'sold' : 'open';
                    await supabase.from('products').update({ status: newStatus }).eq('id', product.id);
                    setProduct({ ...product, status: newStatus as any });
                  }}
                  className="w-full"
                >
                  {product.status === 'open' ? 'Mark as Sold' : 'Mark as Available'}
                </Button>
              </div>
            )}

            {!profile?.is_verified && !isOwner && user && (
              <p className="text-sm text-yellow-400 mt-2">
                Complete NRC verification to purchase
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Payment Modal */}
      <Modal isOpen={showPaymentModal} onClose={() => setShowPaymentModal(false)} title="Payment Details" size="lg">
        <PaymentForm
          product={product}
          onSubmit={handlePaymentSubmit}
        />
      </Modal>
    </main>
  );
}