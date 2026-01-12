import type { Metadata } from 'next';

export const metadata: Metadata = {
  manifest: '/manifest-admin.webmanifest',
};

export default function AdminGroupLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
