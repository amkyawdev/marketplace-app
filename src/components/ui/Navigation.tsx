'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import { useUser } from '@/hooks/useUser';

export default function Navigation() {
  const pathname = usePathname();
  const { user, profile, signOut } = useUser();

  const navLinks = [
    { href: '/', label: 'Home' },
    { href: '/products', label: 'Products' },
  ];

  const authLinks = user
    ? [
        { href: '/dashboard', label: 'Dashboard' },
      ]
    : [
        { href: '/auth/login', label: 'Login' },
        { href: '/auth/signup', label: 'Sign Up' },
      ];

  const isActive = (href: string) => pathname === href;

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 px-4 py-3">
      <div className="max-w-6xl mx-auto">
        <div className="glass-card px-4 py-3 flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-primary to-secondary flex items-center justify-center">
              <span className="text-xl">🛒</span>
            </div>
            <span className="font-heading font-bold text-lg hidden sm:block">
              Marketplace
            </span>
          </Link>

          {/* Nav Links */}
          <div className="flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`
                  px-4 py-2 rounded-lg text-sm font-medium transition-colors
                  ${isActive(link.href) 
                    ? 'text-primary bg-primary/10' 
                    : 'text-white/70 hover:text-white hover:bg-white/10'
                  }
                `}
              >
                {link.label}
              </Link>
            ))}

            {user && profile && (
              <Link
                href="/products/create"
                className="px-4 py-2 rounded-lg text-sm font-medium text-white/70 hover:text-white hover:bg-white/10 transition-colors"
              >
                + Sell
              </Link>
            )}
          </div>

          {/* Auth */}
          <div className="flex items-center gap-2">
            {user ? (
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-r from-primary to-secondary flex items-center justify-center text-sm font-semibold">
                    {profile?.full_name?.[0]?.toUpperCase() || '?'}
                  </div>
                  <span className="text-sm hidden md:block">
                    {profile?.full_name}
                  </span>
                  {profile?.is_verified && (
                    <span className="px-2 py-0.5 bg-primary/20 text-primary text-xs rounded-full">
                      ✓
                    </span>
                  )}
                </div>
                <button
                  onClick={signOut}
                  className="px-3 py-1.5 text-sm text-white/70 hover:text-white transition-colors"
                >
                  Logout
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                {authLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`
                      px-4 py-2 rounded-lg text-sm font-medium transition-colors
                      ${isActive(link.href)
                        ? 'text-primary bg-primary/10'
                        : 'text-white/70 hover:text-white'
                      }
                    `}
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}