
import { useAuth } from '@/context/AuthContext';
import { cn } from '@/lib/utils';
import { LogOut, Menu, Truck, User, X, Wheat } from 'lucide-react';
import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';

interface NavbarProps {
  className?: string;
}

export const Navbar = ({ className }: NavbarProps) => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  const NavLink = ({ to, children }: { to: string; children: React.ReactNode }) => {
    const isActive = location.pathname === to;

    return (
      <Link
        to={to}
        className={cn(
          'relative px-3 py-2 text-sm rounded-lg transition-all duration-300 ease-apple hover:bg-muted',
          isActive ? 'text-primary font-medium' : 'text-muted-foreground'
        )}
      >
        {children}
        {isActive && (
          <span className="absolute bottom-0 left-1/2 w-1/2 h-0.5 bg-primary transform -translate-x-1/2 rounded-full" />
        )}
      </Link>
    );
  };

  return (
    <header
      className={cn(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-300 ease-apple py-4',
        isScrolled 
          ? 'bg-background/80 backdrop-blur-lg shadow-subtle border-b border-border/50' 
          : 'bg-transparent',
        className
      )}
    >
      <div className="container mx-auto px-4 flex items-center justify-between">
        <Link 
          to="/" 
          className="flex items-center gap-2 font-semibold text-xl"
        >
          <Truck className="w-6 h-6 text-primary" />
          <span className="animate-slide-up">Transport App</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-1">
          {user ? (
            <>
              {user.role === 'driver' && (
                <NavLink to="/driver">Panel de Conductor</NavLink>
              )}
              
              {user.role === 'coordinator' && (
                <>
                  <NavLink to="/coordinator">Panel de Coordinador</NavLink>
                  <NavLink to="/vehicles">Vehículos</NavLink>
                  <NavLink to="/farms">Granjas</NavLink>
                  <NavLink to="/drivers">Conductores</NavLink>
                  <NavLink to="/reports">Reportes</NavLink>
                </>
              )}
              
              <button
                onClick={logout}
                className="ml-2 px-3 py-2 text-sm rounded-lg text-muted-foreground transition-all duration-300 ease-apple hover:bg-muted flex items-center gap-1.5"
              >
                <LogOut className="w-4 h-4" />
                <span>Salir</span>
              </button>
            </>
          ) : (
            <>
              <NavLink to="/login">Iniciar Sesión</NavLink>
              <Link 
                to="/login" 
                className="ml-2 px-4 py-2 text-sm bg-primary text-white rounded-lg transition-all duration-300 ease-apple hover:bg-primary/90 btn-hover focus-ring"
              >
                Comenzar
              </Link>
            </>
          )}
        </nav>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden text-foreground p-2 rounded-lg hover:bg-muted transition-colors"
          aria-label={mobileMenuOpen ? "Cerrar menú" : "Abrir menú"}
        >
          {mobileMenuOpen ? (
            <X className="w-6 h-6" />
          ) : (
            <Menu className="w-6 h-6" />
          )}
        </button>

        {/* Mobile Navigation */}
        <div
          className={cn(
            "fixed inset-0 bg-background/80 backdrop-blur-sm z-50 md:hidden transition-opacity duration-300 ease-apple",
            mobileMenuOpen ? "opacity-100" : "opacity-0 pointer-events-none"
          )}
        >
          <div
            className={cn(
              "absolute top-0 right-0 h-full w-3/4 max-w-sm bg-card p-6 shadow-lg border-l transition-transform duration-300 ease-apple",
              mobileMenuOpen ? "translate-x-0" : "translate-x-full"
            )}
          >
            <div className="flex justify-between items-center mb-8">
              <Link to="/" className="flex items-center gap-2 font-semibold text-xl">
                <Truck className="w-6 h-6 text-primary" />
                <span>Transport App</span>
              </Link>
              <button
                onClick={() => setMobileMenuOpen(false)}
                className="p-2 text-foreground rounded-lg hover:bg-muted"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <nav className="flex flex-col space-y-4">
              {user ? (
                <>
                  <div className="flex items-center gap-3 p-3 bg-muted rounded-lg mb-2">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                      <User className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="font-medium">{user.name}</p>
                      <p className="text-xs text-muted-foreground capitalize">
                        {user.role === 'coordinator' ? 'Coordinador' : 'Conductor'}
                      </p>
                    </div>
                  </div>

                  {user.role === 'driver' && (
                    <Link 
                      to="/driver" 
                      className="px-3 py-2.5 text-sm rounded-lg hover:bg-muted transition-colors"
                    >
                      Panel de Conductor
                    </Link>
                  )}
                  
                  {user.role === 'coordinator' && (
                    <>
                      <Link 
                        to="/coordinator" 
                        className="px-3 py-2.5 text-sm rounded-lg hover:bg-muted transition-colors"
                      >
                        Panel de Coordinador
                      </Link>
                      <Link 
                        to="/vehicles" 
                        className="px-3 py-2.5 text-sm rounded-lg hover:bg-muted transition-colors"
                      >
                        Vehículos
                      </Link>
                      <Link 
                        to="/farms" 
                        className="px-3 py-2.5 text-sm rounded-lg hover:bg-muted transition-colors flex items-center gap-2"
                      >
                        <Wheat className="w-4 h-4" />
                        <span>Granjas</span>
                      </Link>
                      <Link 
                        to="/drivers" 
                        className="px-3 py-2.5 text-sm rounded-lg hover:bg-muted transition-colors"
                      >
                        Conductores
                      </Link>
                      <Link 
                        to="/reports" 
                        className="px-3 py-2.5 text-sm rounded-lg hover:bg-muted transition-colors"
                      >
                        Reportes
                      </Link>
                    </>
                  )}
                  
                  <button
                    onClick={logout}
                    className="mt-2 px-3 py-2.5 text-sm rounded-lg text-muted-foreground hover:bg-muted transition-colors flex items-center gap-2"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Cerrar Sesión</span>
                  </button>
                </>
              ) : (
                <>
                  <Link 
                    to="/login" 
                    className="px-3 py-2.5 text-sm rounded-lg hover:bg-muted transition-colors"
                  >
                    Iniciar Sesión
                  </Link>
                  <Link 
                    to="/login" 
                    className="px-3 py-2.5 text-sm bg-primary text-white rounded-lg transition-colors hover:bg-primary/90"
                  >
                    Comenzar
                  </Link>
                </>
              )}
            </nav>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
