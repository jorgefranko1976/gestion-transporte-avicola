
import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import {
  Home,
  Package,
  Truck,
  Users,
  User,
  Settings,
  Menu,
  X,
  LogOut,
  FileText,
  MapPin
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

export const Navbar = () => {
  const { user, signOut } = useAuth();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Array of navigation items for cleaner mapping
  const navItems = [
    { path: '/', label: 'Dashboard', icon: <Home className="w-[18px] h-[18px] mr-2" /> },
    { path: '/dispatches', label: 'Despachos', icon: <Package className="w-[18px] h-[18px] mr-2" /> },
    { path: '/orders', label: 'Órdenes', icon: <FileText className="w-[18px] h-[18px] mr-2" /> },
    { path: '/vehicles', label: 'Vehículos', icon: <Truck className="w-[18px] h-[18px] mr-2" /> },
    { path: '/drivers', label: 'Conductores', icon: <Users className="w-[18px] h-[18px] mr-2" /> },
    { path: '/owners', label: 'Propietarios', icon: <User className="w-[18px] h-[18px] mr-2" /> },
    { path: '/monitor', label: 'Monitor', icon: <MapPin className="w-[18px] h-[18px] mr-2" /> },
    { path: '/settings', label: 'Configuración', icon: <Settings className="w-[18px] h-[18px] mr-2" /> },
  ];

  // Toggle mobile menu
  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };
  
  // Close mobile menu
  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
  };

  return (
    <header className="fixed top-0 left-0 right-0 h-16 bg-white border-b z-40">
      <div className="container mx-auto h-full flex items-center justify-between px-4">
        {/* Logo and brand */}
        <div className="flex items-center">
          <Link to="/" className="text-lg font-semibold text-primary flex items-center">
            <img src="/logo.svg" alt="LogiFleet" className="h-8 mr-2" />
            <span className="hidden lg:inline">LogiFleet</span>
          </Link>
        </div>
        
        {/* Desktop navigation */}
        <nav className="hidden lg:flex items-center space-x-1">
          {navItems.map((item) => (
            <Link 
              key={item.path}
              to={item.path}
              className={`px-3 py-2 rounded-md text-sm font-medium flex items-center ${
                location.pathname === item.path || 
                (item.path !== '/' && location.pathname.startsWith(item.path))
                  ? 'bg-primary text-white'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              {item.icon}
              {item.label}
            </Link>
          ))}
        </nav>
        
        {/* User menu */}
        <div className="flex items-center">
          {user && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={user.photoURL || undefined} alt={user.displayName || "Usuario"} />
                    <AvatarFallback>{user.displayName?.charAt(0) || "U"}</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <div className="flex items-center justify-start gap-2 p-2">
                  <div className="flex flex-col space-y-1 leading-none">
                    {user.displayName && (
                      <p className="font-medium">{user.displayName}</p>
                    )}
                    {user.email && (
                      <p className="text-sm text-muted-foreground">{user.email}</p>
                    )}
                  </div>
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link to="/settings/profile" className="cursor-pointer w-full flex items-center">
                    <Settings className="w-4 h-4 mr-2" />
                    Configuración
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem 
                  className="text-red-600 cursor-pointer focus:text-red-600"
                  onClick={signOut}
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  Cerrar sesión
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
          
          {/* Mobile menu button */}
          <div className="lg:hidden ml-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleMobileMenu}
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </Button>
          </div>
        </div>
      </div>
      
      {/* Mobile navigation */}
      {mobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 top-16 z-30 bg-white p-4 animate-in fade-in">
          <nav className="flex flex-col space-y-2">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`px-4 py-3 rounded-md text-sm font-medium flex items-center ${
                  location.pathname === item.path || 
                  (item.path !== '/' && location.pathname.startsWith(item.path))
                    ? 'bg-primary text-white'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
                onClick={closeMobileMenu}
              >
                {item.icon}
                {item.label}
              </Link>
            ))}
            <Button 
              variant="ghost" 
              className="justify-start text-red-600 hover:text-red-700 hover:bg-red-50 px-4 py-3 h-auto"
              onClick={() => { closeMobileMenu(); signOut(); }}
            >
              <LogOut className="w-[18px] h-[18px] mr-2" />
              Cerrar sesión
            </Button>
          </nav>
        </div>
      )}
    </header>
  );
};
