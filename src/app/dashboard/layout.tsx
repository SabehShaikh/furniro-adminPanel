import { MobileNav, Sidebar } from '@/components/Sidebar';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen">
    <Sidebar />
    <MobileNav />
    <main className="flex-1">
      {children}
    </main>
  </div>
  );
}