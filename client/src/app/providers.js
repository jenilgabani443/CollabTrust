'use client';

import { AuthProvider } from '@/lib/AuthContext';
import { SocketProvider } from '@/lib/SocketContext';
import { ThemeProvider } from '@/lib/ThemeContext';

export function Providers({ children }) {
  return (
    <ThemeProvider>
      <AuthProvider>
        <SocketProvider>{children}</SocketProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}
