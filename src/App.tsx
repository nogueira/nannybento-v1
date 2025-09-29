import { Outlet } from 'react-router-dom';
import { Toaster } from '@/components/ui/sonner';
import { Layout } from '@/components/Layout';
export function App() {
  return (
    <Layout>
      <Outlet />
      <Toaster richColors position="top-right" />
    </Layout>
  );
}