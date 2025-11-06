import type { Metadata } from 'next'
import './globals.css'
import { QueryProvider } from '@/lib/queryClient'

export const metadata: Metadata = {
  title: 'TaskFlow',
  description: 'Streamline your workflow with smart task management',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <QueryProvider>{children}</QueryProvider>
      </body>
    </html>
  )
}
