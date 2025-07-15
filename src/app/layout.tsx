import './globals.css';
import { SupabaseProvider } from '@/providers/SupabaseProvider';

export const metadata = {
  title: 'KoffieForex',
  description: 'Trade professionally with confidence.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <SupabaseProvider>
          {children}
        </SupabaseProvider>
      </body>
    </html>
  );
}
