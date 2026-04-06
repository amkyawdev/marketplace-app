'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { createClient } from '@/lib/supabase';
import { formatMMK, formatRelativeTime, getStatusColor, calculateDownPayment } from '@/utils/formatters';
import { useUser } from '@/hooks/useUser';
import type { Order, Product } from '@/types';

type Tab = 'orders' | 'inventory';

function DashboardContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, profile, loading: userLoading } = useUser();
  const supabase = createClient();
  
  const [activeTab, setActiveTab] = useState<Tab>('orders');
  const [orders, setOrders] = useState<Order[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userLoading && !user) {
      router.push('/auth/login');
      return;
    }

    if (user) {
      fetchOrders();
      fetchProducts();
    }
  }, [user, userLoading]);

  const fetchOrders = async () => {
    if (!user) return;
    
    const { data, error } = await supabase
      .from('orders')
      .select('*, product:products(*), buyer:profiles(*), seller:profiles(*)')
      .or(`buyer_id.eq.${user.id},seller_id.eq.${user.id}`)
      .order('created_at', { ascending: false });

    if (!error && data) {
      setOrders(data as Order[]);
    }
    setLoading(false);
  };

  const fetchProducts = async () => {
    if (!user) return;
    
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('seller_id', user.id)
      .order('created_at', { ascending: false });

    if (!error && data) {
      setProducts(data as Product[]);
    }
  };

  const handleConfirmOrder = async (orderId: string) => {
    try {
      const { error } = await supabase
        .from('orders')
        .update({ status: 'confirmed' })
        .eq('id', orderId);

      if (error) throw error;

      // Also update product status to sold
      const order = orders.find(o => o.id === orderId);
      if (order) {
        await supabase
          .from('products')
          .update({ status: 'sold' })
          .eq('id', order.product_id);
      }

      // Refresh data
      fetchOrders();
      fetchProducts();
    } catch (err: any) {
      alert(err.message);
    }
  };

  if (userLoading) {
    return (
      <div className="min-h-screen pt-24 pb-12 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin w-8 h-8 border-2 border-primary border-t-transparent rounded-full" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen pt-24 pb-12 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-heading font-bold mb-2">
            Dashboard
          </h1>
          <p className="text-white/60">
            Manage your orders and inventory
          </p>
        </motion.div>

        {/* Tabs */}
        <div className="flex gap-2 mb-8 p-1 bg-white/5 rounded-xl w-fit">
          <button
            onClick={() => setActiveTab('orders')}
            className={`
              px-6 py-2 rounded-lg font-medium transition-colors
              ${activeTab === 'orders' 
                ? 'bg-primary text-white' 
                : 'text-white/60 hover:text-white'
              }
            `}
          >
            My Orders
          </button>
          <button
            onClick={() => setActiveTab('inventory')}
            className={`
              px-6 py-2 rounded-lg font-medium transition-colors
              ${activeTab === 'inventory' 
                ? 'bg-primary text-white' 
                : 'text-white/60 hover:text-white'
              }
            `}
          >
            Inventory
          </button>
        </div>

        {/* Content */}
        <AnimatePresence mode="wait">
          {activeTab === 'orders' && (
            <motion.div
              key="orders"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
            >
              {orders.length > 0 ? (
                <div className="space-y-4">
                  {orders.map((order) => (
                    <div
                      key={order.id}
                      className="glass-card p-4 flex flex-col md:flex-row gap-4"
                    >
                      {/* Product Info */}
                      <div className="flex-1">
                        <h3 className="font-semibold mb-1">{order.product?.title}</h3>
                        <p className="text-sm text-white/60">
                          {order.buyer_id === user?.id 
                            ? `Sold by ${order.seller?.full_name}` 
                            : `Sold to ${order.buyer?.full_name}`
                          }
                        </p>
                        <div className="flex gap-4 mt-2 text-sm">
                          <span>Total: {formatMMK(order.amount)}</span>
                          <span className="text-primary">
                            Down: {formatMMK(order.down_payment_amount)}
                          </span>
                        </div>
                      </div>

                      {/* Status */}
                      <div className="flex items-center gap-4">
                        <span className={`status-badge ${getStatusColor(order.status)}`}>
                          {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                        </span>
                        
                        {/* Confirm button for seller */}
                        {order.seller_id === user?.id && order.status === 'pending' && (
                          <button
                            onClick={() => handleConfirmOrder(order.id)}
                            className="px-4 py-2 bg-green-500/20 hover:bg-green-500/30 text-green-400 rounded-lg transition-colors"
                          >
                            Confirm Payment
                          </button>
                        )}

                        <span className="text-sm text-white/40">
                          {formatRelativeTime(order.created_at)}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="glass-card p-12 text-center">
                  <div className="text-6xl mb-4">📋</div>
                  <h3 className="text-xl font-semibold mb-2">No Orders Yet</h3>
                  <p className="text-white/60">Your orders will appear here</p>
                </div>
              )}
            </motion.div>
          )}

          {activeTab === 'inventory' && (
            <motion.div
              key="inventory"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
            >
              <div className="flex justify-end mb-4">
                <button
                  onClick={() => router.push('/products/create')}
                  className="px-4 py-2 bg-primary hover:bg-primary/80 rounded-lg font-medium transition-colors"
                >
                  + Add Product
                </button>
              </div>

              {products.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {products.map((product) => (
                    <div
                      key={product.id}
                      className="glass-card p-4"
                    >
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="font-semibold line-clamp-1">{product.title}</h3>
                        <span className={`status-badge ${getStatusColor(product.status)}`}>
                          {product.status}
                        </span>
                      </div>
                      <p className="text-primary font-bold mb-2">
                        {formatMMK(product.price)}
                      </p>
                      <div className="flex gap-2">
                        <button
                          onClick={async () => {
                            const newStatus = product.status === 'open' ? 'sold' : 'open';
                            await supabase
                              .from('products')
                              .update({ status: newStatus })
                              .eq('id', product.id);
                            fetchProducts();
                          }}
                          className="flex-1 py-2 bg-white/10 hover:bg-white/20 rounded-lg text-sm transition-colors"
                        >
                          {product.status === 'open' ? 'Mark Sold' : 'Re-list'}
                        </button>
                        <button
                          onClick={() => router.push(`/products/${product.id}`)}
                          className="flex-1 py-2 bg-white/10 hover:bg-white/20 rounded-lg text-sm transition-colors"
                        >
                          View
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="glass-card p-12 text-center">
                  <div className="text-6xl mb-4">📦</div>
                  <h3 className="text-xl font-semibold mb-2">No Products</h3>
                  <p className="text-white/60 mb-6">Start selling by listing your first product</p>
                  <button
                    onClick={() => router.push('/products/create')}
                    className="px-6 py-3 bg-primary hover:bg-primary/80 rounded-xl font-semibold transition-colors"
                  >
                    List a Product
                  </button>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </main>
  );
}

export default function DashboardPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen pt-24 pb-12 px-4">
        <div className="max-w-6xl mx-auto flex items-center justify-center h-64">
          <div className="animate-spin w-8 h-8 border-2 border-primary border-t-transparent rounded-full" />
        </div>
      </div>
    }>
      <DashboardContent />
    </Suspense>
  );
}