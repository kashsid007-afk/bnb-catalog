import type { Metadata } from 'next'
import { Toaster } from 'react-hot-toast'
import '@/styles/globals.css'

export const metadata: Metadata = {
  title: 'BNB Wholesale Collection',
  description: 'Premium Mobile Cover Wholesale Catalog',
  openGraph: {
    title: 'BNB Wholesale Collection',
    description: 'Premium Mobile Covers — Browse & Inquire on WhatsApp',
    type: 'website',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        {children}
        <Toaster
          position="bottom-center"
          toastOptions={{
            style: {
              background: '#3A2E25',
              color: '#E8D0B0',
              borderRadius: '14px',
              fontSize: '13px',
              fontWeight: 500,
            },
            success: { iconTheme: { primary: '#C9975A', secondary: '#3A2E25' } },
          }}
        />
      </body>
    </html>
  )
}
