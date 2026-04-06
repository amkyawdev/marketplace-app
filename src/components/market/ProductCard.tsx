'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import type { Product } from '@/types';
import { formatMMK, getStatusColor, truncateText } from '@/utils/formatters';

interface ProductCardProps {
  product: Product;
  index?: number;
}

export default function ProductCard({ product, index = 0 }: ProductCardProps) {
  const [imageError, setImageError] = useState(false);

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        delay: index * 0.1,
      }
    }
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      whileHover="hover"
    >
      <Link href={`/products/${product.id}`}>
        <div className="group glass-card overflow-hidden product-card-hover cursor-pointer h-full flex flex-col">
          {/* Image */}
          <div className="relative aspect-[4/3] overflow-hidden">
            {!imageError && product.images?.[0] ? (
              <Image
                src={product.images[0]}
                alt={product.title}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-110"
                onError={() => setImageError(true)}
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center">
                <span className="text-6xl">📦</span>
              </div>
            )}
            
            {/* Status Badge */}
            <div className="absolute top-3 left-3">
              <span className={`status-badge ${getStatusColor(product.status)}`}>
                {product.status.charAt(0).toUpperCase() + product.status.slice(1)}
              </span>
            </div>

            {/* Price Overlay */}
            <div className="absolute bottom-3 right-3">
              <div className="px-3 py-1.5 bg-black/60 backdrop-blur-sm rounded-lg">
                <span className="font-semibold text-white">
                  {formatMMK(product.price)}
                </span>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="p-4 flex-1 flex flex-col">
            <h3 className="font-semibold text-lg mb-2 line-clamp-2 group-hover:text-primary transition-colors">
              {product.title}
            </h3>
            
            {product.description && (
              <p className="text-white/60 text-sm mb-3 line-clamp-2 flex-1">
                {truncateText(product.description, 80)}
              </p>
            )}

            {/* Seller Info */}
            <div className="flex items-center gap-2 pt-3 border-t border-white/10">
              <div className="w-8 h-8 rounded-full bg-gradient-to-r from-primary to-secondary flex items-center justify-center text-sm font-semibold">
                {product.seller?.full_name?.[0]?.toUpperCase() || '?'}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">
                  {product.seller?.full_name || 'Unknown Seller'}
                </p>
                {product.seller?.is_verified && (
                  <p className="text-xs text-primary flex items-center gap-1">
                    <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    Verified
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}