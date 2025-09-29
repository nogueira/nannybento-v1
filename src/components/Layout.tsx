import React from 'react';
import { Link } from 'react-router-dom';
import { Baby } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useUserStore } from '@/store/userStore';
interface LayoutProps {
  children: React.ReactNode;
}
const userDetails = {
  dilma: {
    name: 'Dilma',
    role: 'Babá',
    avatar: 'D',
    imageUrl: 'https://i.ibb.co/hJHkYqDQ/dil2.jpg?q=80&w=256&h=256&auto=format&fit=crop',
  },
  carla: {
    name: 'Carla',
    role: 'Empregador',
    avatar: 'C',
    imageUrl: null,
  },
};
export function Layout({ children }: LayoutProps) {
  const currentUser = useUserStore((state) => state.currentUser);
  // Replaced useLocation with a check on the global state to avoid router context errors.
  // The currentUser is null only on the profile selection page.
  const isProfileSelection = currentUser === null;
  const userInfo = currentUser ? userDetails[currentUser] : null;
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 font-sans">
      <header className="bg-white dark:bg-gray-950/70 backdrop-blur-sm border-b border-gray-200 dark:border-gray-800 sticky top-0 z-40">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link to="/" className="flex items-center gap-2 group">
              <div className="w-8 h-8 rounded-lg bg-blue-500 flex items-center justify-center transition-all duration-300 group-hover:scale-110 group-hover:rotate-12">
                <Baby className="w-5 h-5 text-white" />
              </div>
              <h1 className="text-2xl font-display font-bold text-gray-800 dark:text-white">
                PontoNanny
              </h1>
            </Link>
            {!isProfileSelection && userInfo && (
              <div className="flex items-center gap-3">
                <div className="text-right hidden sm:block">
                  <p className="font-semibold text-sm">{userInfo.name}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">{userInfo.role}</p>
                </div>
                <Avatar>
                  <AvatarImage src={userInfo.imageUrl ?? undefined} alt={userInfo.name} />
                  <AvatarFallback className="bg-blue-500 text-white font-bold">
                    {userInfo.avatar}
                  </AvatarFallback>
                </Avatar>
              </div>
            )}
          </div>
        </div>
      </header>
      <main className="py-8 sm:py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {children}
        </div>
      </main>
      <footer className="py-8 text-center text-gray-500 dark:text-gray-400 text-sm">
        <p>Built with ��️ at Cloudflare</p>
      </footer>
    </div>
  );
}