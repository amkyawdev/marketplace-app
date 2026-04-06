'use client';

import { ReactNode, useState, useEffect } from 'react';
import { createBrowserClient } from '@supabase/ssr';

interface ProvidersProps {
  children: ReactNode;
}

export function Providers({ children }: ProvidersProps) {
  const [supabase] = useState(() =>
    createBrowserClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )
  );

  return (
    <div suppressHydrationWarning>
      {children}
    </div>
  );
}