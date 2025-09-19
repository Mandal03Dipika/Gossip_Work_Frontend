import { useAuthContext } from '@/features/Auth/contexts/AuthContext';
import useChatStore from '@/features/Chat/contexts/ChatContext';
import { Link } from '@tanstack/react-router'
import { LogOut, Menu, MessageSquare, Settings, User, Users } from 'lucide-react';

export default function Header() {
     const authContext = useAuthContext();
  const { setSidebarOpen } = useChatStore();

  if (!authContext) {
    return null; 
  }

  const { logout, authUser } = authContext;

   return (
    <header className="fixed top-0 z-40 w-full border-b bg-base-100 border-base-300 backdrop-blur-lg bg-base-100/80 ">
      <div className="container h-16 px-4 mx-auto">
        <div className="flex items-center justify-between h-full">
          <div className="flex items-center gap-4 sm:gap-8">
            {authUser && (
              <button
                className="flex items-center justify-center rounded-lg size-9 bg-primary/10 lg:hidden"
                onClick={() => setSidebarOpen((prev) => !prev)}
              >
                <Menu className="w-6 h-6 text-primary" />
              </button>
            )}
            <Link
              to="/"
              className="flex items-center gap-2.5 hover:opacity-80 transition-all"
            >
              {!authUser && (
                <div className="flex items-center justify-center rounded-lg sm:hidden size-9 bg-primary/10">
                  <MessageSquare className="w-5 h-5 text-primary" />
                </div>
              )}
              <div className="items-center justify-center hidden rounded-lg sm:flex size-9 bg-primary/10">
                <MessageSquare className="w-5 h-5 text-primary" />
              </div>
              <h1 className="text-lg font-bold">ChitChat</h1>
            </Link>
          </div>
          {/* <div className="flex items-center gap-2">
            <Link
              to={"/settings"}
              className="gap-2 transition-colors btn btn-sm"
            >
              <Settings className="w-4 h-4" />
              <span className="hidden sm:inline">Settings</span>
            </Link>
            {authUser && (
              <>
                <Link to={"/users"} className="gap-2 btn btn-sm">
                  <Users className="size-5" />
                  <span className="hidden sm:inline">Users</span>
                </Link>
                <Link to={"/profile"} className="gap-2 btn btn-sm">
                  <User className="size-5" />
                  <span className="hidden sm:inline">Profile</span>
                </Link>
                <button className="flex items-center gap-2" onClick={logout}>
                  <LogOut className="size-5" />
                  <span className="hidden sm:inline">Logout</span>
                </button>
              </>
            )}
          </div> */}
        </div>
      </div>
    </header>
  );
}
